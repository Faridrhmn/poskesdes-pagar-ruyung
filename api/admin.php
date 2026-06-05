<?php
/**
 * ADMIN AUTHENTICATION API
 * 
 * Handles admin authentication for Poskesdes Pagar Ruyung
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

// Include database configuration (also provides token utilities)
require_once 'db.php';

/**
 * AdminApi Class
 * Handles admin authentication operations
 */
class AdminApi {
    private $conn;
    private $table_name = "admins";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Admin login with username and password
     * ONLY allows superadmin role users to login to admin dashboard
     * Regular users should login via homepage (route /)
     * 
     * @param string $username
     * @param string $password
     * @return array Returns: ['ok' => true, 'admin' => [...], 'token' => '...'] on success
     */
    public function login($username, $password) {
        $stmt = $this->conn->prepare("SELECT id_admin AS id, username, password_hash, role FROM " . $this->table_name . " WHERE username = ? LIMIT 1");
        $stmt->bindParam(1, $username);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            return [ 'ok' => false, 'message' => 'Invalid credentials' ];
        }

        if (!password_verify($password, $row['password_hash'])) {
            return [ 'ok' => false, 'message' => 'Invalid credentials' ];
        }

        if (password_needs_rehash($row['password_hash'], PASSWORD_BCRYPT, ['cost' => 12])) {
            $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
            $stmtUpdate = $this->conn->prepare("UPDATE " . $this->table_name . " SET password_hash = ? WHERE id_admin = ?");
            $stmtUpdate->execute([$newHash, $row['id']]);
        }

        $role = $row['role'] ?? 'regular';
        
        // Only superadmin can login to admin dashboard
        if ($role !== 'superadmin') {
            return [ 
                'ok' => false, 
                'message' => 'Akses ditolak. Hanya superadmin yang dapat login ke admin dashboard. Silakan login di homepage untuk akses regular.' 
            ];
        }
        
        $token = generate_token((int)$row['id'], $row['username'], $role);
        return [
            'ok' => true,
            'admin' => [
                'id' => (int)$row['id'],
                'username' => $row['username'],
                'role' => $role,
            ],
            'token' => $token,
        ];
    }

    /**
     * Create new admin user (optional - for admin management)
     * @param string $username
     * @param string $password
     * @param string $role
     * @return array
     */
    public function create($username, $password, $role = 'regular') {
        // Check if username already exists
        $stmt = $this->conn->prepare("SELECT id_admin AS id FROM " . $this->table_name . " WHERE username = ? LIMIT 1");
        $stmt->bindParam(1, $username);
        $stmt->execute();
        if ($stmt->fetch()) {
            return [ 'ok' => false, 'message' => 'Username already exists' ];
        }

        // Validate role
        if (!in_array($role, ['superadmin', 'regular'])) {
            $role = 'regular';
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (username, password_hash, role, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $passwordHash);
        $stmt->bindParam(3, $role);
        
        if ($stmt->execute()) {
            $adminId = $this->conn->lastInsertId();
            return [
                'ok' => true,
                'admin' => [
                    'id' => (int)$adminId,
                    'username' => $username,
                    'role' => $role,
                ]
            ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to create admin user' ];
    }

    /**
     * Get all admins (superadmin only)
     * @return array
     */
    public function getAll() {
        // Check if updated_at column exists
        $checkStmt = $this->conn->query("SHOW COLUMNS FROM " . $this->table_name . " LIKE 'updated_at'");
        $hasUpdatedAt = $checkStmt->rowCount() > 0;
        
        // Build query based on whether updated_at exists
        if ($hasUpdatedAt) {
            $stmt = $this->conn->prepare("SELECT id_admin AS id, username, role, created_at, updated_at FROM " . $this->table_name . " ORDER BY created_at DESC");
        } else {
            $stmt = $this->conn->prepare("SELECT id_admin AS id, username, role, created_at, NULL as updated_at FROM " . $this->table_name . " ORDER BY created_at DESC");
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update admin role (superadmin only)
     * @param int $adminId
     * @param string $role
     * @return array
     */
    public function updateRole($adminId, $role) {
        if (!in_array($role, ['superadmin', 'regular'])) {
            return [ 'ok' => false, 'message' => 'Invalid role' ];
        }

        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET role = ? WHERE id_admin = ?");
        $stmt->bindParam(1, $role);
        $stmt->bindParam(2, $adminId);
        
        if ($stmt->execute()) {
            return [ 'ok' => true, 'message' => 'Role updated successfully' ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to update role' ];
    }

    /**
     * Delete admin (superadmin only)
     * @param int $adminId
     * @return array
     */
    public function deleteAdmin($adminId) {
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id_admin = ?");
        $stmt->bindParam(1, $adminId);
        
        if ($stmt->execute()) {
            return [ 'ok' => true, 'message' => 'Admin deleted successfully' ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to delete admin' ];
    }

    /**
     * Update admin username and role
     * @param int $adminId
     * @param string $username
     * @param string $role
     * @return array
     */
    public function updateAdmin($adminId, $username, $role) {
        // Check if username already exists (excluding current admin)
        $stmt = $this->conn->prepare("SELECT id_admin AS id FROM " . $this->table_name . " WHERE username = ? AND id != ? LIMIT 1");
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $adminId);
        $stmt->execute();
        if ($stmt->fetch()) {
            return [ 'ok' => false, 'message' => 'Username already exists' ];
        }

        // Validate role
        if (!in_array($role, ['superadmin', 'regular'])) {
            return [ 'ok' => false, 'message' => 'Invalid role' ];
        }

        // Check if updated_at column exists
        $checkStmt = $this->conn->query("SHOW COLUMNS FROM " . $this->table_name . " LIKE 'updated_at'");
        $hasUpdatedAt = $checkStmt->rowCount() > 0;
        
        // Build update query based on whether updated_at exists
        if ($hasUpdatedAt) {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET username = ?, role = ?, updated_at = NOW() WHERE id_admin = ?");
        } else {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET username = ?, role = ? WHERE id_admin = ?");
        }
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $role);
        $stmt->bindParam(3, $adminId);
        
        if ($stmt->execute()) {
            return [ 'ok' => true, 'message' => 'Admin updated successfully' ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to update admin' ];
    }

    /**
     * Reset admin password (superadmin only, no old password required)
     * @param int $adminId
     * @param string $newPassword
     * @return array
     */
    public function resetPassword($adminId, $newPassword) {
        if (empty($newPassword) || strlen($newPassword) < 6) {
            return [ 'ok' => false, 'message' => 'Password must be at least 6 characters' ];
        }

        // Check if updated_at column exists
        $checkStmt = $this->conn->query("SHOW COLUMNS FROM " . $this->table_name . " LIKE 'updated_at'");
        $hasUpdatedAt = $checkStmt->rowCount() > 0;
        
        $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        
        // Build update query based on whether updated_at exists
        if ($hasUpdatedAt) {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET password_hash = ?, updated_at = NOW() WHERE id_admin = ?");
        } else {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET password_hash = ? WHERE id_admin = ?");
        }
        $stmt->bindParam(1, $newPasswordHash);
        $stmt->bindParam(2, $adminId);
        
        if ($stmt->execute()) {
            return [ 'ok' => true, 'message' => 'Password reset successfully' ];
        }
        
        return [ 'ok' => false, 'message' => 'Failed to reset password' ];
    }

    /**
     * Change admin password (self-change with old password verification)
     * @param int $adminId
     * @param string $oldPassword
     * @param string $newPassword
     * @return array
     */
    public function changePassword($adminId, $oldPassword, $newPassword) {
        // Verify old password
        $stmt = $this->conn->prepare("SELECT password_hash FROM " . $this->table_name . " WHERE id_admin = ? LIMIT 1");
        $stmt->bindParam(1, $adminId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row || !password_verify($oldPassword, $row['password_hash'])) {
            return [ 'ok' => false, 'message' => 'Invalid old password' ];
        }

        if (empty($newPassword) || strlen($newPassword) < 6) {
            return [ 'ok' => false, 'message' => 'Password must be at least 6 characters' ];
        }

        // Check if updated_at column exists
        $checkStmt = $this->conn->query("SHOW COLUMNS FROM " . $this->table_name . " LIKE 'updated_at'");
        $hasUpdatedAt = $checkStmt->rowCount() > 0;

        // Update password
        $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        
        // Build update query based on whether updated_at exists
        if ($hasUpdatedAt) {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET password_hash = ?, updated_at = NOW() WHERE id_admin = ?");
        } else {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET password_hash = ? WHERE id_admin = ?");
        }
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

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$api = new AdminApi($db);

try {
    switch ($method) {
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            
            // Handle reset password endpoint
            if (preg_match('/^(\d+)\/reset-password$/', $path, $matches)) {
                $user = require_auth();
                if (!$user) break;
                
                // Check if user is superadmin
                if (!isset($user['role']) || $user['role'] !== 'superadmin') {
                    http_response_code(403);
                    echo json_encode([ 'message' => 'Only superadmin can reset passwords' ]);
                    break;
                }
                
                $adminId = (int)$matches[1];
                $newPassword = isset($data['newPassword']) ? (string)$data['newPassword'] : '';
                
                if ($newPassword === '') {
                    http_response_code(400);
                    echo json_encode([ 'message' => 'newPassword is required' ]);
                    break;
                }
                
                $result = $api->resetPassword($adminId, $newPassword);
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            } elseif ($path === 'login' || $path === '') {
                // POST /admin.php/login - Admin login (SUPERADMIN ONLY)
                // Regular users should use homepage login endpoint
                // Only superadmin role can access admin dashboard
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
                    // Return 403 if access denied (regular user trying to login)
                    $statusCode = (strpos($result['message'] ?? '', 'Akses ditolak') !== false) ? 403 : 401;
                    http_response_code($statusCode);
                    echo json_encode($result);
                }
            } elseif ($path === 'register') {
                // POST /admin.php/register - Create new admin (requires superadmin)
                $user = require_auth();
                if (!$user) break;
                
                // Check if user is superadmin
                if (!isset($user['role']) || $user['role'] !== 'superadmin') {
                    http_response_code(403);
                    echo json_encode([ 'message' => 'Only superadmin can create new admins' ]);
                    break;
                }
                
                $username = isset($data['username']) ? trim((string)$data['username']) : '';
                $password = isset($data['password']) ? (string)$data['password'] : '';
                $role = isset($data['role']) ? trim((string)$data['role']) : 'regular';
                
                if ($username === '' || $password === '') {
                    http_response_code(400);
                    echo json_encode([ 'message' => 'username and password are required' ]);
                    break;
                }
                
                $result = $api->create($username, $password, $role);
                if ($result['ok']) {
                    http_response_code(201);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            }
            break;
            
        case 'GET':
            // GET /admin.php/list - Get all admins (requires superadmin)
            if ($path === 'list') {
                $user = require_auth();
                if (!$user) break;
                
                if (!isset($user['role']) || $user['role'] !== 'superadmin') {
                    http_response_code(403);
                    echo json_encode([ 'message' => 'Only superadmin can view admin list' ]);
                    break;
                }
                
                $admins = $api->getAll();
                http_response_code(200);
                echo json_encode($admins);
            } elseif ($path === 'me') {
                // GET /admin.php/me - Get current admin info
                $user = require_auth();
                if (!$user) break;
                
                http_response_code(200);
                echo json_encode([
                    'ok' => true,
                    'admin' => [
                        'id' => $user['sub'],
                        'username' => $user['username'],
                        'role' => $user['role'] ?? 'regular',
                    ]
                ]);
            } else {
                http_response_code(404);
                echo json_encode([ 'message' => 'Not found' ]);
            }
            break;
            
        case 'PUT':
            $user = require_auth();
            if (!$user) break;
            
            // Check if user is superadmin
            if (!isset($user['role']) || $user['role'] !== 'superadmin') {
                http_response_code(403);
                echo json_encode([ 'message' => 'Only superadmin can perform this action' ]);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            
            if ($path === 'change-password') {
                // PUT /admin.php/change-password - Change own password (requires authentication)
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
            } elseif (preg_match('/^(\d+)$/', $path, $matches)) {
                // PUT /admin.php/{id} - Update admin (requires superadmin)
                $adminId = (int)$matches[1];
                $username = isset($data['username']) ? trim((string)$data['username']) : '';
                $role = isset($data['role']) ? trim((string)$data['role']) : '';
                
                if ($username === '' || $role === '') {
                    http_response_code(400);
                    echo json_encode([ 'message' => 'username and role are required' ]);
                    break;
                }
                
                $result = $api->updateAdmin($adminId, $username, $role);
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            } else {
                http_response_code(404);
                echo json_encode([ 'message' => 'Not found' ]);
            }
            break;
            
        case 'DELETE':
            $user = require_auth();
            if (!$user) break;
            
            // Check if user is superadmin
            if (!isset($user['role']) || $user['role'] !== 'superadmin') {
                http_response_code(403);
                echo json_encode([ 'message' => 'Only superadmin can perform this action' ]);
                break;
            }
            
            if (preg_match('/^(\d+)$/', $path, $matches)) {
                // DELETE /admin.php/{id} - Delete admin (requires superadmin)
                $adminId = (int)$matches[1];
                
                // Prevent deleting self
                if ($adminId === (int)$user['sub']) {
                    http_response_code(400);
                    echo json_encode([ 'ok' => false, 'message' => 'Cannot delete your own account' ]);
                    break;
                }
                
                $result = $api->deleteAdmin($adminId);
                if ($result['ok']) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode($result);
                }
            } else {
                http_response_code(404);
                echo json_encode([ 'message' => 'Not found' ]);
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
?>

