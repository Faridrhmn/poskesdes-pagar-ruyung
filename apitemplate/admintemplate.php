<?php
/**
 * ADMIN AUTHENTICATION TEMPLATE
 * 
 * This template shows the standard admin authentication structure
 * with JWT-like token generation and verification.
 * 
 * USAGE:
 * 1. Copy this file and rename it to your specific admin API file (e.g., admin.php)
 * 2. Update the class name and table name
 * 3. Customize the authentication logic as needed
 * 4. Update the router section for your specific endpoints
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

// Include database configuration (also provides token utilities)
require_once 'databasetemplate.php';

/**
 * AdminApi Class
 * Handles admin authentication operations
 */
class AdminApi {
    private $conn;
    private $table_name = "admins"; // UPDATE THIS FOR YOUR ADMINS TABLE

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Admin login with username and password
     * @param string $username
     * @param string $password
     * @return array
     */
    public function login($username, $password) {
        $stmt = $this->conn->prepare("SELECT id, username, password_hash FROM " . $this->table_name . " WHERE username = ? LIMIT 1");
        $stmt->bindParam(1, $username);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            return [ 'ok' => false, 'message' => 'Invalid credentials' ];
        }

        if (!password_verify($password, $row['password_hash'])) {
            return [ 'ok' => false, 'message' => 'Invalid credentials' ];
        }

        $token = generate_token((int)$row['id'], $row['username']);
        return [
            'ok' => true,
            'admin' => [
                'id' => (int)$row['id'],
                'username' => $row['username'],
            ],
            'token' => $token,
        ];
    }

    /**
     * Create new admin user (optional - for admin management)
     * @param string $username
     * @param string $password
     * @return array
     */
    public function create($username, $password) {
        // Check if username already exists
        $stmt = $this->conn->prepare("SELECT id FROM " . $this->table_name . " WHERE username = ? LIMIT 1");
        $stmt->bindParam(1, $username);
        $stmt->execute();
        if ($stmt->fetch()) {
            return [ 'ok' => false, 'message' => 'Username already exists' ];
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (username, password_hash, created_at) VALUES (?, ?, NOW())");
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $passwordHash);
        
        if ($stmt->execute()) {
            $adminId = $this->conn->lastInsertId();
            return [
                'ok' => true,
                'admin' => [
                    'id' => (int)$adminId,
                    'username' => $username,
                ]
            ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to create admin user' ];
    }

    /**
     * Change admin password
     * @param int $adminId
     * @param string $oldPassword
     * @param string $newPassword
     * @return array
     */
    public function changePassword($adminId, $oldPassword, $newPassword) {
        // Verify old password
        $stmt = $this->conn->prepare("SELECT password_hash FROM " . $this->table_name . " WHERE id = ? LIMIT 1");
        $stmt->bindParam(1, $adminId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row || !password_verify($oldPassword, $row['password_hash'])) {
            return [ 'ok' => false, 'message' => 'Invalid old password' ];
        }

        // Update password
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET password_hash = ? WHERE id = ?");
        $stmt->bindParam(1, $newPasswordHash);
        $stmt->bindParam(2, $adminId);
        
        if ($stmt->execute()) {
            return [ 'ok' => true, 'message' => 'Password updated successfully' ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to update password' ];
    }
}

/**
 * API Router
 * Handles different HTTP methods and routes
 */
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode([ 'message' => 'Database connection failed.' ]);
    exit();
}

if (!validateApiKey()) {
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$api = new AdminApi($db);

try {
    switch ($method) {
        case 'POST':
            if ($path !== 'login' && $path !== 'register' && $path !== '') {
                http_response_code(404);
                echo json_encode([ 'message' => 'Not found' ]);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            
            if ($path === 'login' || $path === '') {
                // POST /admin.php/login - Admin login
                $username = isset($data['username']) ? trim((string)$data['username']) : '';
                $password = isset($data['password']) ? (string)$data['password'] : '';
                
                if ($username === '' || $password === '') {
                    http_response_code(400);
                    echo json_encode([ 'message' => 'username and password are required' ]);
                    break;
                }
                
                $result = $api->login($username, $password);
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(401);
                    echo json_encode($result);
                }
            } elseif ($path === 'register') {
                // POST /admin.php/register - Create new admin (requires authentication)
                $user = require_auth();
                if (!$user) break;
                
                $username = isset($data['username']) ? trim((string)$data['username']) : '';
                $password = isset($data['password']) ? (string)$data['password'] : '';
                
                if ($username === '' || $password === '') {
                    http_response_code(400);
                    echo json_encode([ 'message' => 'username and password are required' ]);
                    break;
                }
                
                $result = $api->create($username, $password);
                if ($result['ok']) {
                    http_response_code(201);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            }
            break;
            
        case 'PUT':
            if ($path !== 'change-password') {
                http_response_code(404);
                echo json_encode([ 'message' => 'Not found' ]);
                break;
            }
            
            // PUT /admin.php/change-password - Change password (requires authentication)
            $user = require_auth();
            if (!$user) break;
            
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $oldPassword = isset($data['oldPassword']) ? (string)$data['oldPassword'] : '';
            $newPassword = isset($data['newPassword']) ? (string)$data['newPassword'] : '';
            
            if ($oldPassword === '' || $newPassword === '') {
                http_response_code(400);
                echo json_encode([ 'message' => 'oldPassword and newPassword are required' ]);
                break;
            }
            
            $result = $api->changePassword($user['sub'], $oldPassword, $newPassword);
            if ($result['ok']) {
                http_response_code(200);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode([ 'message' => 'Method not allowed.' ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([ 'message' => 'Internal server error: ' . $e->getMessage() ]);
}

/**
 * EXAMPLE USAGE:
 * 
 * 1. Admin Login:
 *    POST https://yourdomain.com/api/admin.php/login
 *    Body: {"username": "admin", "password": "password123"}
 *    Response: {"ok": true, "admin": {"id": 1, "username": "admin"}, "token": "jwt-token-here"}
 * 
 * 2. Create New Admin (requires authentication):
 *    POST https://yourdomain.com/api/admin.php/register
 *    Headers: Authorization: Bearer your-jwt-token-here
 *    Body: {"username": "newadmin", "password": "password123"}
 *    Response: {"ok": true, "admin": {"id": 2, "username": "newadmin"}}
 * 
 * 3. Change Password (requires authentication):
 *    PUT https://yourdomain.com/api/admin.php/change-password
 *    Headers: Authorization: Bearer your-jwt-token-here
 *    Body: {"oldPassword": "oldpass", "newPassword": "newpass"}
 *    Response: {"ok": true, "message": "Password updated successfully"}
 * 
 * DATABASE SETUP:
 * 
 * Create your admins table:
 * CREATE TABLE admins (
 *   id INT NOT NULL AUTO_INCREMENT,
 *   username VARCHAR(255) NOT NULL UNIQUE,
 *   password_hash VARCHAR(255) NOT NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   PRIMARY KEY (id)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 * 
 * Insert default admin:
 * INSERT INTO admins (username, password_hash) VALUES ('admin', '$2y$10$your-hashed-password-here');
 * 
 * SECURITY NOTES:
 * - Use password_hash() and password_verify() for password security
 * - Tokens expire after 24 hours by default (configurable in generate_token())
 * - Update the secret key in project_secret() function for token security
 * - validateApiKey() is still required for API access
 */
?>
