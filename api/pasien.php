<?php
/**
 * PASIEN API
 * 
 * Handles CRUD operations for patient records
 * Used in: RegisterSection, dropdown selections in ANC/KB/Lansia forms
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

require_once 'db.php';

class PasienApi {
    private $conn;
    private $table_name = "pasien";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Generate next nomor CM
     */
    private function generateNomorCM() {
        $query = "SELECT nomor_cm FROM " . $this->table_name . " ORDER BY nomor_cm DESC LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && preg_match('/CM-(\d+)/', $result['nomor_cm'], $matches)) {
            $lastNumber = intval($matches[1]);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }
        
        return 'CM-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get all patients
     */
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY nomor_cm ASC, tgl_daftar DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Get single patient by ID
     */
    public function readOne($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create new patient
     */
    public function create($data) {
        // Auto-generate nomor CM if not provided
        if (empty($data['nomor_cm'])) {
            $data['nomor_cm'] = $this->generateNomorCM();
        }
        
        $query = "INSERT INTO " . $this->table_name . "
                  (id, nomor_cm, nama, nik, no_kk, no_hp, no_kis, pendidikan, alamat, usia_kehamilan, tgl_daftar)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['nomor_cm']);
        $stmt->bindParam(3, $data['nama']);
        $stmt->bindParam(4, $data['nik']);
        $stmt->bindParam(5, $data['no_kk']);
        $stmt->bindParam(6, $data['no_hp']);
        $stmt->bindParam(7, $data['no_kis']);
        $stmt->bindParam(8, $data['pendidikan']);
        $stmt->bindParam(9, $data['alamat']);
        $stmt->bindParam(10, $data['usia_kehamilan']);
        $stmt->bindParam(11, $data['tgl_daftar']);
        
        return $stmt->execute();
    }

    /**
     * Update patient
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET nama = ?, nik = ?, no_kk = ?, no_hp = ?, no_kis = ?, 
                      pendidikan = ?, alamat = ?, usia_kehamilan = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['nama']);
        $stmt->bindParam(2, $data['nik']);
        $stmt->bindParam(3, $data['no_kk']);
        $stmt->bindParam(4, $data['no_hp']);
        $stmt->bindParam(5, $data['no_kis']);
        $stmt->bindParam(6, $data['pendidikan']);
        $stmt->bindParam(7, $data['alamat']);
        $stmt->bindParam(8, $data['usia_kehamilan']);
        $stmt->bindParam(9, $id);
        
        return $stmt->execute();
    }

    /**
     * Delete patient
     */
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

$api = new PasienApi($db);
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';

// Require auth for write operations
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
                    echo json_encode(['message' => 'Patient not found.']);
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
            
            if (!empty($data['id']) && !empty($data['nama']) && !empty($data['no_hp']) && !empty($data['tgl_daftar'])) {
                if ($api->create($data)) {
                    $createdPatient = $api->readOne($data['id']);
                    http_response_code(201);
                    echo json_encode([
                        'message' => 'Patient created successfully.', 
                        'id' => $data['id'],
                        'nomor_cm' => $createdPatient['nomor_cm'] ?? null
                    ]);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to create patient.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Required fields: id, nama, no_hp, tgl_daftar']);
            }
            break;
            
        case 'PUT':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (!empty($data['nama']) && !empty($data['no_hp'])) {
                    if ($api->update($id, $data)) {
                        http_response_code(200);
                        echo json_encode(['message' => 'Patient updated successfully.']);
                    } else {
                        http_response_code(503);
                        echo json_encode(['message' => 'Unable to update patient.']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Required fields: nama, no_hp']);
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
                    echo json_encode(['message' => 'Patient deleted successfully.']);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to delete patient.']);
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

