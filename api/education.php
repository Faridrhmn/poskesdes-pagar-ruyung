<?php
/**
 * EDUCATION MATERIALS API
 * 
 * Handles CRUD operations for education materials
 * Used in: EducationSection
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

require_once 'db.php';

class EducationApi {
    private $conn;
    private $table_name = "education_materials";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  (id, title, body)
                  VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['title']);
        $stmt->bindParam(3, $data['body']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET title = ?, body = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['title']);
        $stmt->bindParam(2, $data['body']);
        $stmt->bindParam(3, $id);
        
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        return $stmt->execute();
    }
}

// Router
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit();
}

$api = new EducationApi($db);
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';

$user = null;
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    $user = require_auth();
    if (!$user) exit();
}

try {
    switch ($method) {
        case 'GET':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                $result = $api->readOne($id);
                if ($result) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Education material not found.']);
                }
            } else {
                $stmt = $api->read();
                $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
                http_response_code(200);
                echo json_encode($records);
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!empty($data['id']) && !empty($data['title']) && !empty($data['body'])) {
                if ($api->create($data)) {
                    http_response_code(201);
                    echo json_encode(['message' => 'Education material created successfully.', 'id' => $data['id']]);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to create education material.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Required fields: id, title, body']);
            }
            break;
            
        case 'PUT':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (!empty($data['title']) && !empty($data['body'])) {
                    if ($api->update($id, $data)) {
                        http_response_code(200);
                        echo json_encode(['message' => 'Education material updated successfully.']);
                    } else {
                        http_response_code(503);
                        echo json_encode(['message' => 'Unable to update education material.']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Required fields: title, body']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID provided.']);
            }
            break;
            
        case 'DELETE':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                if ($api->delete($id)) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Education material deleted successfully.']);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to delete education material.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid ID provided.']);
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

