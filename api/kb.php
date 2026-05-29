<?php
/**
 * KB RECORDS API
 * 
 * Handles CRUD operations for KB (Keluarga Berencana) records
 * Used in: KbSection
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

require_once 'db.php';

class KbApi {
    private $conn;
    private $table_name = "kb_records";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY tanggal DESC";
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

    public function readByPasien($pasien_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE pasien_id = ? ORDER BY tanggal DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $pasien_id);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  (id, pasien_id, pasien_nama, tanggal, status_peserta, metode_kb, tgl_mulai, keterangan, rencana_tindakan, jadwal_kontrol_kb)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['pasien_id']);
        $stmt->bindParam(3, $data['pasien_nama']);
        $stmt->bindParam(4, $data['tanggal']);
        $stmt->bindParam(5, $data['status_peserta']);
        $stmt->bindParam(6, $data['metode_kb']);
        $stmt->bindParam(7, $data['tgl_mulai']);
        $stmt->bindParam(8, $data['keterangan']);
        $stmt->bindParam(9, $data['rencana_tindakan']);
        $stmt->bindParam(10, $data['jadwal_kontrol_kb']);
        
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

$api = new KbApi($db);
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
            if ($path && preg_match('/^pasien\/(.+)$/', $path, $matches)) {
                $pasien_id = $matches[1];
                $stmt = $api->readByPasien($pasien_id);
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
                    echo json_encode(['message' => 'Record not found.']);
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
            
            if (!empty($data['id']) && !empty($data['pasien_nama']) && !empty($data['tanggal']) && !empty($data['status_peserta'])) {
                if ($api->create($data)) {
                    http_response_code(201);
                    echo json_encode(['message' => 'KB record created successfully.', 'id' => $data['id']]);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to create KB record.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Required fields: id, pasien_nama, tanggal, status_peserta']);
            }
            break;
            
        case 'DELETE':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                if ($api->delete($id)) {
                    http_response_code(200);
                    echo json_encode(['message' => 'KB record deleted successfully.']);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to delete KB record.']);
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

