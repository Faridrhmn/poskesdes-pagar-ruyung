<?php
/**
 * SYSTEM BACKUP API
 * 
 * Handles database backup, config export, and restore operations
 * Only accessible by superadmin
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

require_once 'db.php';

/**
 * BackupApi Class
 * Handles backup and restore operations
 */
class BackupApi {
    private $conn;
    private $backupDir;

    public function __construct($db) {
        $this->conn = $db;
        // Create backup directory if it doesn't exist
        $this->backupDir = __DIR__ . '/../backups/';
        if (!is_dir($this->backupDir)) {
            mkdir($this->backupDir, 0755, true);
        }
    }

    /**
     * Generate database backup SQL file
     * @return array
     */
    public function backupDatabase() {
        try {
            $backupFileName = 'backup_' . date('Y-m-d_His') . '.sql';
            $backupFilePath = $this->backupDir . $backupFileName;

            // Get database name
            $stmt = $this->conn->query("SELECT DATABASE()");
            $dbName = $stmt->fetchColumn();

            // Get all tables
            $tables = [];
            $stmt = $this->conn->query("SHOW TABLES");
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                $tables[] = $row[0];
            }

            $sql = "-- Database Backup\n";
            $sql .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
            $sql .= "-- Database: " . ($dbName ?: 'vade3664_bidan') . "\n\n";
            $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

            // Export each table
            foreach ($tables as $table) {
                $sql .= "-- Table: {$table}\n";
                $sql .= "DROP TABLE IF EXISTS `{$table}`;\n";

                // Get CREATE TABLE statement
                $stmt = $this->conn->query("SHOW CREATE TABLE `{$table}`");
                $row = $stmt->fetch(PDO::FETCH_NUM);
                $sql .= $row[1] . ";\n\n";

                // Get table data
                $stmt = $this->conn->query("SELECT * FROM `{$table}`");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (count($rows) > 0) {
                    $sql .= "INSERT INTO `{$table}` VALUES\n";
                    $values = [];
                    foreach ($rows as $row) {
                        $rowValues = [];
                        foreach ($row as $value) {
                            if ($value === null) {
                                $rowValues[] = 'NULL';
                            } else {
                                $rowValues[] = $this->conn->quote($value);
                            }
                        }
                        $values[] = '(' . implode(',', $rowValues) . ')';
                    }
                    $sql .= implode(",\n", $values) . ";\n\n";
                }
            }

            $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

            // Save to file
            file_put_contents($backupFilePath, $sql);

            return [
                'ok' => true,
                'filename' => $backupFileName,
                'path' => $backupFilePath,
                'size' => filesize($backupFilePath),
                'message' => 'Backup created successfully'
            ];
        } catch (Exception $e) {
            return [
                'ok' => false,
                'message' => 'Failed to create backup: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Export configuration file
     * @return array
     */
    public function exportConfig() {
        try {
            $configFileName = 'config_export_' . date('Y-m-d_His') . '.json';
            $configFilePath = $this->backupDir . $configFileName;

            // Get database name
            $stmt = $this->conn->query("SELECT DATABASE()");
            $dbName = $stmt->fetchColumn();

            $config = [
                'export_date' => date('Y-m-d H:i:s'),
                'database' => [
                    'host' => 'localhost',
                    'db_name' => $dbName ?: 'vade3664_bidan',
                ],
                'app_version' => '1.0.0',
                'backup_type' => 'config_export',
            ];

            file_put_contents($configFilePath, json_encode($config, JSON_PRETTY_PRINT));

            return [
                'ok' => true,
                'filename' => $configFileName,
                'path' => $configFilePath,
                'size' => filesize($configFilePath),
                'message' => 'Config exported successfully'
            ];
        } catch (Exception $e) {
            return [
                'ok' => false,
                'message' => 'Failed to export config: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get list of backup files
     * @return array
     */
    public function listBackups() {
        try {
            $backups = [];
            $files = scandir($this->backupDir);

            foreach ($files as $file) {
                if ($file === '.' || $file === '..') continue;
                
                $filePath = $this->backupDir . $file;
                if (is_file($filePath) && pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                    $backups[] = [
                        'filename' => $file,
                        'size' => filesize($filePath),
                        'created' => date('Y-m-d H:i:s', filemtime($filePath)),
                    ];
                }
            }

            // Sort by creation date (newest first)
            usort($backups, function($a, $b) {
                return strtotime($b['created']) - strtotime($a['created']);
            });

            return $backups;
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Get backup file content for download
     * @param string $filename
     * @return array|null
     */
    public function getBackupFile($filename) {
        // Security: Only allow SQL files
        if (!preg_match('/^backup_\d{4}-\d{2}-\d{2}_\d{6}\.sql$/', $filename)) {
            return null;
        }

        $filePath = $this->backupDir . $filename;
        if (!file_exists($filePath)) {
            return null;
        }

        return [
            'path' => $filePath,
            'filename' => $filename,
            'size' => filesize($filePath),
            'content' => file_get_contents($filePath),
        ];
    }

    /**
     * Delete backup file
     * @param string $filename
     * @return array
     */
    public function deleteBackup($filename) {
        // Security: Only allow SQL files
        if (!preg_match('/^backup_\d{4}-\d{2}-\d{2}_\d{6}\.sql$/', $filename)) {
            return ['ok' => false, 'message' => 'Invalid filename'];
        }

        $filePath = $this->backupDir . $filename;
        if (!file_exists($filePath)) {
            return ['ok' => false, 'message' => 'Backup file not found'];
        }

        if (unlink($filePath)) {
            return ['ok' => true, 'message' => 'Backup deleted successfully'];
        }

        return ['ok' => false, 'message' => 'Failed to delete backup'];
    }
}

/**
 * API Router
 */
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$api = new BackupApi($db);

// All endpoints require superadmin authentication
$user = require_auth();
if (!$user) exit();

if (!isset($user['role']) || $user['role'] !== 'superadmin') {
    http_response_code(403);
    echo json_encode(['message' => 'Only superadmin can access backup functions']);
    exit();
}

try {
    switch ($method) {
        case 'GET':
            if ($path === 'list') {
                // GET /backup.php/list - List all backup files
                $backups = $api->listBackups();
                http_response_code(200);
                echo json_encode($backups);
            } elseif (preg_match('/^download\/(.+)$/', $path, $matches)) {
                // GET /backup.php/download/{filename} - Download backup file
                $filename = basename($matches[1]);
                $backup = $api->getBackupFile($filename);
                
                if ($backup) {
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename="' . $filename . '"');
                    header('Content-Length: ' . $backup['size']);
                    echo $backup['content'];
                    exit();
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Backup file not found']);
                }
            } elseif ($path === 'download-config') {
                // GET /backup.php/download-config - Download config export
                $result = $api->exportConfig();
                if ($result['ok']) {
                    header('Content-Type: application/json');
                    header('Content-Disposition: attachment; filename="' . $result['filename'] . '"');
                    header('Content-Length: ' . $result['size']);
                    readfile($result['path']);
                    // Clean up temporary file
                    unlink($result['path']);
                    exit();
                } else {
                    http_response_code(500);
                    echo json_encode($result);
                }
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Not found']);
            }
            break;

        case 'POST':
            if ($path === 'create') {
                // POST /backup.php/create - Create database backup
                $result = $api->backupDatabase();
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(500);
                    echo json_encode($result);
                }
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Not found']);
            }
            break;

        case 'DELETE':
            if (preg_match('/^delete\/(.+)$/', $path, $matches)) {
                // DELETE /backup.php/delete/{filename} - Delete backup file
                $filename = basename($matches[1]);
                $result = $api->deleteBackup($filename);
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Not found']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
}
?>

