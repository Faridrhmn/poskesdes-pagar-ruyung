<?php
/**
 * JADWAL API
 * 
 * Handles CRUD operations for schedule/appointments
 * Used in: JadwalSection, HomeSection (upcoming agenda)
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

require_once 'db.php';

class JadwalApi {
    private $conn;
    private $table_name = "jadwal";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT *, id_jadwal AS id FROM " . $this->table_name . " ORDER BY tanggal ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readUpcoming($limit = 5) {
        $query = "SELECT *, id_jadwal AS id FROM " . $this->table_name . " WHERE tanggal >= CURDATE() ORDER BY tanggal ASC LIMIT ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function readOne($id) {
        $query = "SELECT *, id_jadwal AS id FROM " . $this->table_name . " WHERE id_jadwal = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  (id_jadwal, nama, tanggal, jenis, cara, pasien_id)
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['nama']);
        $stmt->bindParam(3, $data['tanggal']);
        $stmt->bindParam(4, $data['jenis']);
        $stmt->bindParam(5, $data['cara']);
        $stmt->bindParam(6, $data['pasien_id']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET nama = ?, tanggal = ?, jenis = ?, cara = ?, pasien_id = ?
                  WHERE id_jadwal = ?";
        $stmt = $this->conn->prepare($query);
        
        $pasien_id = isset($data['pasien_id']) && !empty($data['pasien_id']) ? $data['pasien_id'] : null;
        
        $stmt->bindParam(1, $data['nama']);
        $stmt->bindParam(2, $data['tanggal']);
        $stmt->bindParam(3, $data['jenis']);
        $stmt->bindParam(4, $data['cara']);
        $stmt->bindParam(5, $pasien_id);
        $stmt->bindParam(6, $id);
        
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_jadwal = ?";
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

$api = new JadwalApi($db);
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
            if ($path === 'upcoming') {
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
                $stmt = $api->readUpcoming($limit);
                $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
                http_response_code(200);
                echo json_encode($records);
            } elseif ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                $result = $api->readOne($id);
                if ($result) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Schedule not found.']);
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
            // Convert empty strings to null to prevent MySQL strict mode errors
            foreach ($data as $key => $value) {
                if ($value === '') {
                    $data[$key] = null;
                }
            }

            
            if (!empty($data['id']) && !empty($data['nama']) && !empty($data['tanggal']) && !empty($data['jenis']) && !empty($data['cara'])) {
                if ($api->create($data)) {
                    http_response_code(201);
                    echo json_encode(['message' => 'Schedule created successfully.', 'id' => $data['id']]);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to create schedule.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Required fields: id, nama, tanggal, jenis, cara']);
            }
            break;
            
        case 'PUT':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                $data = json_decode(file_get_contents('php://input'), true);
            // Convert empty strings to null to prevent MySQL strict mode errors
            foreach ($data as $key => $value) {
                if ($value === '') {
                    $data[$key] = null;
                }
            }

                
                if (!empty($data['nama']) && !empty($data['tanggal']) && !empty($data['jenis']) && !empty($data['cara'])) {
                    if ($api->update($id, $data)) {
                        http_response_code(200);
                        echo json_encode(['message' => 'Schedule updated successfully.']);
                    } else {
                        http_response_code(503);
                        echo json_encode(['message' => 'Unable to update schedule.']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Required fields: nama, tanggal, jenis, cara']);
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
                    echo json_encode(['message' => 'Schedule deleted successfully.']);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to delete schedule.']);
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

