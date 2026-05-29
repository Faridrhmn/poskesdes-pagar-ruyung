<?php
/**
 * DATABASE CONFIGURATION
 * 
 * Database configuration for Poskesdes API
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

class Database {
    // Database configuration
    private $host = 'localhost';
    private $db_name = 'vade3664_bidan';
    private $username = 'vade3664_bidan';
    private $password = 'bidanxy123zz';
    private $conn;

    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

/**
 * CORS Headers Setup
 * These headers allow cross-origin requests from the frontend
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/**
 * Handle preflight OPTIONS requests
 * This is required for CORS to work properly
 */
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Simple HMAC token utilities (JWT-like but minimal)
 */
function project_secret() {
    // Hardcoded JWT / token secret - CHANGE THIS IN PRODUCTION
    return 'poskesdes-pagar-ruyung-secret-key-2024';
}

function project_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function project_base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function generate_token($userId, $username, $role = 'regular', $ttlSeconds = 86400) {
    $header = project_base64url_encode(json_encode([ 'alg' => 'HS256', 'typ' => 'JWT' ]));
    $now = time();
    $payload = project_base64url_encode(json_encode([
        'sub' => (int)$userId,
        'username' => $username,
        'role' => $role,
        'iat' => $now,
        'exp' => $now + $ttlSeconds,
    ]));
    $toSign = $header . '.' . $payload;
    $signature = project_base64url_encode(hash_hmac('sha256', $toSign, project_secret(), true));
    return $toSign . '.' . $signature;
}

function verify_token($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return [ 'ok' => false, 'message' => 'Invalid token format' ];
    list($h, $p, $s) = $parts;
    $expected = project_base64url_encode(hash_hmac('sha256', $h . '.' . $p, project_secret(), true));
    if (!hash_equals($expected, $s)) return [ 'ok' => false, 'message' => 'Invalid signature' ];
    $payload = json_decode(project_base64url_decode($p), true);
    if (!$payload || !isset($payload['exp']) || time() >= (int)$payload['exp']) {
        return [ 'ok' => false, 'message' => 'Token expired' ];
    }
    return [ 'ok' => true, 'payload' => $payload ];
}

function get_bearer_token() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (stripos($auth, 'Bearer ') === 0) {
        return substr($auth, 7);
    }
    return null;
}

/**
 * Require authentication token for protected endpoints
 * Call this function in your API endpoints that need authentication
 */
function require_auth() {
    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode([ 'message' => 'Authorization token required' ]);
        return false;
    }
    
    $result = verify_token($token);
    if (!$result['ok']) {
        http_response_code(401);
        echo json_encode([ 'message' => $result['message'] ]);
        return false;
    }
    
    return $result['payload'];
}
?>

