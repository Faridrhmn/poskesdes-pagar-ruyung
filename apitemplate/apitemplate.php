<?php
/**
 * API TEMPLATE
 * 
 * This template shows the standard API structure for CRUD operations
 * in the Yayasan Sengkelat Jagad Lawu project.
 * 
 * USAGE:
 * 1. Copy this file and rename it to your specific API file (e.g., yourtable.php)
 * 2. Update the class name, table name, and field names
 * 3. Customize the CRUD methods as needed
 * 4. Update the router section for your specific endpoints
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

// Include database configuration (also provides validateApiKey())
require_once 'databasetemplate.php';

/**
 * YourTable Class
 * Handles CRUD operations for your_table
 */
class YourTable {
    private $conn;
    private $table_name = "your_table";

    // Table fields - UPDATE THESE FOR YOUR TABLE
    public $id;
    public $field1;
    public $field2;
    public $field3;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Read all records
     * @return array
     */
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Read single record by ID
     * @param int $id
     * @return array|false
     */
    public function readOne($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create new record
     * @param string $field1
     * @param string $field2
     * @param string $field3
     * @return bool
     */
    public function create($field1, $field2, $field3) {
        $query = "INSERT INTO " . $this->table_name . "
                  (field1, field2, field3, created_at)
                  VALUES (?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $field1);
        $stmt->bindParam(2, $field2);
        $stmt->bindParam(3, $field3);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Update existing record
     * @param int $id
     * @param string $field1
     * @param string $field2
     * @param string $field3
     * @return bool
     */
    public function update($id, $field1, $field2, $field3) {
        $query = "UPDATE " . $this->table_name . "
                  SET field1 = ?, field2 = ?, field3 = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $field1);
        $stmt->bindParam(2, $field2);
        $stmt->bindParam(3, $field3);
        $stmt->bindParam(4, $id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Delete record by ID
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}

/**
 * API Router
 * Handles different HTTP methods and routes
 */
$database = new Database();
$db = $database->getConnection();

if ($db) {
    $yourTable = new YourTable($db);
    
    // Get request method and path
    $method = $_SERVER['REQUEST_METHOD'];
    $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';

    // API key validation removed by default. Rely on token auth for write operations.
    
    // Require authentication only for POST, PUT, DELETE operations
    // GET requests remain public
    $user = null;
    if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
        $user = require_auth();
        if (!$user) exit(); // Authentication failed
    }
    
    try {
        switch ($method) {
            case 'GET':
                if ($path && preg_match('/^\/(\d+)$/', $path, $matches)) {
                    // GET /yourtable.php/{id} - Get single record
                    $id = $matches[1];
                    $result = $yourTable->readOne($id);
                    if ($result) {
                        http_response_code(200);
                        echo json_encode($result);
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message" => "Record not found."));
                    }
                } else {
                    // GET /yourtable.php - Get all records
                    $stmt = $yourTable->read();
                    $num = $stmt->rowCount();
                    
                    if ($num > 0) {
                        $records_arr = array();
                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                            extract($row);
                            $record_item = array(
                                "id" => $id,
                                "field1" => $field1,
                                "field2" => $field2,
                                "field3" => $field3,
                                "created_at" => $created_at
                            );
                            array_push($records_arr, $record_item);
                        }
                        http_response_code(200);
                        echo json_encode($records_arr);
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message" => "No records found."));
                    }
                }
                break;
                
            case 'POST':
                // POST /yourtable.php - Create new record
                $data = json_decode(file_get_contents("php://input"));
                
                if (!empty($data->field1) && !empty($data->field2) && !empty($data->field3)) {
                    if ($yourTable->create($data->field1, $data->field2, $data->field3)) {
                        http_response_code(201);
                        echo json_encode(array("message" => "Record created successfully."));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Unable to create record."));
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Unable to create record. Data is incomplete."));
                }
                break;
                
            case 'PUT':
                // PUT /yourtable.php/{id} - Update record
                if ($path && preg_match('/^\/(\d+)$/', $path, $matches)) {
                    $id = $matches[1];
                    $data = json_decode(file_get_contents("php://input"));
                    
                    if (!empty($data->field1) && !empty($data->field2) && !empty($data->field3)) {
                        if ($yourTable->update($id, $data->field1, $data->field2, $data->field3)) {
                            http_response_code(200);
                            echo json_encode(array("message" => "Record updated successfully."));
                        } else {
                            http_response_code(503);
                            echo json_encode(array("message" => "Unable to update record."));
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(array("message" => "Unable to update record. Data is incomplete."));
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Invalid ID provided."));
                }
                break;
                
            case 'DELETE':
                // DELETE /yourtable.php/{id} - Delete record
                if ($path && preg_match('/^\/(\d+)$/', $path, $matches)) {
                    $id = $matches[1];
                    if ($yourTable->delete($id)) {
                        http_response_code(200);
                        echo json_encode(array("message" => "Record deleted successfully."));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Unable to delete record."));
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Invalid ID provided."));
                }
                break;
                
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed."));
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Internal server error: " . $e->getMessage()));
    }
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
}

/**
 * EXAMPLE USAGE:
 * 
 * 1. GET all records:
 *    GET https://yourdomain.com/api/yourtable.php
 * 
 * 2. GET single record:
 *    GET https://yourdomain.com/api/yourtable.php/1
 * 
 * 3. CREATE new record:
 *    POST https://yourdomain.com/api/yourtable.php
 *    Body: {"field1": "value1", "field2": "value2", "field3": "value3"}
 * 
 * 4. UPDATE record:
 *    PUT https://yourdomain.com/api/yourtable.php/1
 *    Body: {"field1": "new_value1", "field2": "new_value2", "field3": "new_value3"}
 * 
 * 5. DELETE record:
 *    DELETE https://yourdomain.com/api/yourtable.php/1
 * 
 * SECURITY NOTES:
* - API key validation is disabled by default in this template
 * - Authentication is automatically required for POST, PUT, DELETE operations
 * - GET operations remain public (no authentication required)
 * - Tokens are generated with generate_token($userId, $username) and verified with verify_token($token)
 * - Update the secret key in project_secret() function for token security
 * 
 * AUTHENTICATION EXAMPLES:
 * 
 * 1. Public GET endpoint (no authentication required):
 *    GET https://yourdomain.com/api/yourtable.php
 *    GET https://yourdomain.com/api/yourtable.php/1
 * 
 * 2. Protected endpoints (requires Bearer token):
 *    POST https://yourdomain.com/api/yourtable.php
 *    PUT https://yourdomain.com/api/yourtable.php/1
 *    DELETE https://yourdomain.com/api/yourtable.php/1
 *    Headers: Authorization: Bearer your-jwt-token-here
 * 
 * 3. Generate token (typically in login endpoint):
 *    $token = generate_token($userId, $username);
 *    // Return token to client for future requests
 * 
 * 4. Access authenticated user data in protected endpoints:
 *    // $user variable is automatically available in POST/PUT/DELETE operations
 *    $userId = $user['sub']; // User ID from token
 *    $username = $user['username']; // Username from token
 */
?> 