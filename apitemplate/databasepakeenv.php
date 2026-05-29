<?php
/**
 * DATABASE TEMPLATE
 * 
 * This template shows the standard database configuration structure
 * for all API files in the Yayasan Sengkelat Jagad Lawu project.
 * Now supports environment-based configuration via Config::get().
 * 
 * USAGE:
 * 1. Copy this file and rename it to your specific API file
 * 2. Create a .env file (see .env.example) or set real environment variables
 * 3. Include this file in your API endpoints
 * 
 * NOTE: This template requires apitemplate/config.php
 */

require_once __DIR__ . '/config.php';

class Database {
    // Database configuration
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;
        try {
            // Load from environment/config
            $this->host = Config::get('DB_HOST', 'localhost');
            $this->db_name = Config::get('DB_NAME', 'your_database_name');
            $this->username = Config::get('DB_USER', 'your_username');
            $this->password = Config::get('DB_PASS', 'your_password');
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
 * Validate API Key (shared helper)
 * Set API key via env .env (API_KEY) or server environment
 */
function validateApiKey() {
    $validApiKey = Config::get('API_KEY', 'changekeyhere');

    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $apiKey = null;

    if (isset($headers['X-API-Key'])) {
        $apiKey = $headers['X-API-Key'];
    } elseif (isset($headers['x-api-key'])) {
        $apiKey = $headers['x-api-key'];
    } elseif (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (strpos($auth, 'Bearer ') === 0) {
            $apiKey = substr($auth, 7);
        }
    }

    if (!$apiKey && isset($_GET['api_key'])) {
        $apiKey = $_GET['api_key'];
    }

    if ($apiKey !== $validApiKey) {
        http_response_code(401);
        echo json_encode([
            'message' => 'Unauthorized. Invalid or missing API key.',
            'error' => 'API_KEY_REQUIRED'
        ]);
        return false;
    }

    return true;
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
    // Use JWT_SECRET from env, fallback to default
    return Config::get('JWT_SECRET', 'change-this-secret-key-for-your-project');
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

function generate_token($userId, $username, $ttlSeconds = 86400) {
    $header = project_base64url_encode(json_encode([ 'alg' => 'HS256', 'typ' => 'JWT' ]));
    $now = time();
    $payload = project_base64url_encode(json_encode([
        'sub' => (int)$userId,
        'username' => $username,
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

/**
 * EXAMPLE USAGE:
 * 
 * // Include this file in your API endpoint
 * require_once 'databasetemplate.php';
 * 
 * // Create database instance
 * $database = new Database();
 * $db = $database->getConnection();
 * 
 * // Use the connection for your queries
 * if ($db) {
 *     // Your API logic here
 * }
 * 
 * // For protected endpoints, use require_auth():
 * $user = require_auth();
 * if (!$user) exit(); // Authentication failed
 * 
 * // Now you have access to $user['sub'] (user ID) and $user['username']
 */
?> 