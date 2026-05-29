<?php
// Universal upload handler: multiple files (images, videos, any type)

require_once __DIR__ . '/db.php';

// Set proper encoding for UTF-8
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

ini_set('upload_max_filesize', '1G');
ini_set('post_max_size', '1G');
ini_set('max_execution_time', 600);
ini_set('max_input_time', 600);
ini_set('memory_limit', '512M');
ini_set('max_file_uploads', 100);

// Prevent output buffering issues
if (ob_get_level()) ob_end_clean();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validate API Key using shared helper
if (!validateApiKey()) {
    exit;
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

function sendResponse($status, $message, $data = []) {
    // Ensure clean output
    if (ob_get_level()) ob_end_clean();
    
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendResponse('error', 'Method not allowed. Use POST.');
}

// Check if files were uploaded
if (!isset($_FILES['files']) && !isset($_FILES['file'])) {
    http_response_code(400);
    sendResponse('error', 'No files uploaded. Use "files[]" or "file" field.');
}

$uploads = [];

// Handle single file upload (fallback)
if (isset($_FILES['file'])) {
    $file = $_FILES['file'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendResponse('error', 'Upload error code: ' . $file['error']);
    }

    if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        sendResponse('error', 'Upload failed.');
    }

    $originalFilename = basename($file['name']);
    $ext = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));
    $filename = uniqid('file_', true) . '.' . $ext;
    $targetPath = $uploadDir . $filename;

    if (!is_writable($uploadDir)) {
        sendResponse('error', 'Upload directory is not writable.');
    }

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
        $fileUrl = $protocol . $host . $basePath . '/uploads/' . $filename;

        sendResponse('success', 'File uploaded.', [
            'original_name' => $originalFilename,
            'stored_name' => $filename,
            'file_size' => $file['size'],
            'mime_type' => $file['type'],
            'url' => $fileUrl,
            'path' => 'uploads/' . $filename
        ]);
    } else {
        sendResponse('error', 'Failed to move uploaded file.');
    }
}

// Handle multiple files upload
if (isset($_FILES['files'])) {
    $files = $_FILES['files'];
    $fileCount = count($files['name']);
    
    // Limit number of files to prevent timeout
    if ($fileCount > 10) {
        sendResponse('error', 'Too many files. Maximum 10 files allowed.');
    }

    for ($i = 0; $i < $fileCount; $i++) {
        // Check for timeout
        if (connection_aborted()) {
            sendResponse('error', 'Connection aborted during upload.');
        }
        
        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Upload error code: ' . $files['error'][$i],
                'index' => $i
            ];
            continue;
        }

        if (empty($files['tmp_name'][$i]) || !is_uploaded_file($files['tmp_name'][$i])) {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Upload failed.',
                'index' => $i
            ];
            continue;
        }

        $originalFilename = basename($files['name'][$i]);
        $ext = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));
        $filename = uniqid('file_', true) . '.' . $ext;
        $targetPath = $uploadDir . $filename;

        if (!is_writable($uploadDir)) {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Upload directory is not writable.',
                'index' => $i
            ];
            continue;
        }

        if (move_uploaded_file($files['tmp_name'][$i], $targetPath)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
            $fileUrl = $protocol . $host . $basePath . '/uploads/' . $filename;

            $uploads[] = [
                'status' => 'success',
                'original_name' => $originalFilename,
                'stored_name' => $filename,
                'file_size' => $files['size'][$i],
                'mime_type' => $files['type'][$i],
                'url' => $fileUrl,
                'path' => 'uploads/' . $filename
            ];
        } else {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Failed to move uploaded file.',
                'index' => $i
            ];
        }
    }
}

sendResponse('success', 'Files processed.', $uploads);

?>
