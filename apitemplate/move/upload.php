<?php
// Universal upload handler: multiple files (images, videos, any type)
// Based on apitemplate/upload.php

require_once __DIR__ . '/../databasetemplate.php';

// Set proper encoding for UTF-8
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '50M');
ini_set('max_execution_time', 300);
ini_set('max_input_time', 300);
ini_set('memory_limit', '256M');
ini_set('max_file_uploads', 20);

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

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Require authentication only for POST, PUT, DELETE operations (write operations)
// GET requests remain public (if needed in the future)
// API key validation removed - using token auth only, mirroring apitemplate behavior
$user = null;
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    $user = require_auth();
    if (!$user) exit(); // Authentication failed
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

function compressImageToWebP($sourcePath, $targetPath, $quality = 85, $maxWidth = 1920, $maxHeight = 1920) {
    // Get image info
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) {
        return false;
    }
    
    $mimeType = $imageInfo['mime'];
    $originalWidth = $imageInfo[0];
    $originalHeight = $imageInfo[1];
    
    // Create image resource based on type
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $sourceImage = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $sourceImage = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $sourceImage = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            $sourceImage = imagecreatefromwebp($sourcePath);
            break;
        default:
            return false;
    }
    
    if (!$sourceImage) {
        return false; 
    }
    
    // Calculate new dimensions (maintain aspect ratio)
    $ratio = min($maxWidth / $originalWidth, $maxHeight / $originalHeight);
    $newWidth = (int)($originalWidth * $ratio);
    $newHeight = (int)($originalHeight * $ratio);
    
    // Don't upscale images
    if ($ratio >= 1) {
        $newWidth = $originalWidth;
        $newHeight = $originalHeight;
    }
    
    // Create new image with new dimensions
    $newImage = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preserve transparency for PNG and GIF
    if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
        imagealphablending($newImage, false);
        imagesavealpha($newImage, true);
        $transparent = imagecolorallocatealpha($newImage, 255, 255, 255, 127);
        imagefilledrectangle($newImage, 0, 0, $newWidth, $newHeight, $transparent);
    }
    
    // Resize image
    imagecopyresampled($newImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);
    
    // Save as WebP
    $result = imagewebp($newImage, $targetPath, $quality);
    
    // Clean up memory
    imagedestroy($sourceImage);
    imagedestroy($newImage);
    
    return $result;
}

// Only allow POST method for file uploads
if ($method !== 'POST') {
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

    // Validate file type (images only)
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = mime_content_type($file['tmp_name']);
    
    if (!in_array($fileType, $allowedTypes)) {
        sendResponse('error', 'Invalid file type. Only images are allowed.');
    }

    // Validate file size (max 10MB)
    if ($file['size'] > 10 * 1024 * 1024) {
        sendResponse('error', 'File too large. Maximum 10MB allowed.');
    }

    $originalFilename = basename($file['name']);
    $ext = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));
    $filename = uniqid('img_', true) . '.webp'; // Always save as WebP
    $targetPath = $uploadDir . $filename;

    if (!is_writable($uploadDir)) {
        sendResponse('error', 'Upload directory is not writable.');
    }

    // Compress and convert to WebP
    if (compressImageToWebP($file['tmp_name'], $targetPath)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
        $fileUrl = $protocol . $host . $basePath . '/uploads/' . $filename;
        
        $compressedSize = filesize($targetPath);

        sendResponse('success', 'File uploaded and compressed to WebP.', [
            'original_name' => $originalFilename,
            'stored_name' => $filename,
            'original_size' => $file['size'],
            'compressed_size' => $compressedSize,
            'compression_ratio' => round((($file['size'] - $compressedSize) / $file['size']) * 100, 2) . '%',
            'mime_type' => 'image/webp',
            'url' => $fileUrl,
            'path' => 'uploads/' . $filename
        ]);
    } else {
        sendResponse('error', 'Failed to compress and save image.');
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

        // Validate file type (images only)
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($files['tmp_name'][$i]);
        
        if (!in_array($fileType, $allowedTypes)) {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Invalid file type. Only images are allowed.',
                'index' => $i
            ];
            continue;
        }

        // Validate file size (max 10MB)
        if ($files['size'][$i] > 10 * 1024 * 1024) {
            $uploads[] = [
                'status' => 'error',
                'message' => 'File too large. Maximum 10MB allowed.',
                'index' => $i
            ];
            continue;
        }

        $originalFilename = basename($files['name'][$i]);
        $ext = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));
        $filename = uniqid('img_', true) . '.webp'; // Always save as WebP
        $targetPath = $uploadDir . $filename;

        if (!is_writable($uploadDir)) {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Upload directory is not writable.',
                'index' => $i
            ];
            continue;
        }

        // Compress and convert to WebP
        if (compressImageToWebP($files['tmp_name'][$i], $targetPath)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
            $fileUrl = $protocol . $host . $basePath . '/uploads/' . $filename;
            
            $compressedSize = filesize($targetPath);

            $uploads[] = [
                'status' => 'success',
                'original_name' => $originalFilename,
                'stored_name' => $filename,
                'original_size' => $files['size'][$i],
                'compressed_size' => $compressedSize,
                'compression_ratio' => round((($files['size'][$i] - $compressedSize) / $files['size'][$i]) * 100, 2) . '%',
                'mime_type' => 'image/webp',
                'url' => $fileUrl,
                'path' => 'uploads/' . $filename
            ];
        } else {
            $uploads[] = [
                'status' => 'error',
                'message' => 'Failed to compress and save image.',
                'index' => $i
            ];
        }
    }
}

sendResponse('success', 'Files processed.', $uploads);

?>
