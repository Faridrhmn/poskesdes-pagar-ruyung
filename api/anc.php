<?php
/**
 * ANC RECORDS API
 * 
 * Handles CRUD operations for ANC (Antenatal Care) records
 * Used in: AncDetailSection
 * 
 * @author Yayasan Sengkelat Jagad Lawu
 * @version 1.0
 */

require_once 'db.php';

class AncApi {
    private $conn;
    private $table_name = "anc_records";

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
                  (id, pasien_id, pasien_nama, tanggal, kunjungan_ke, k_status, usg_status, status_4t,
                   gravida, para, abortus, hpht, hpl, keluhan_utama,
                   td, nadi, suhu, bb, tb, edema,
                   djj, tfu, posisi_janin, gerak_janin,
                   fe_diberikan, saran_gizi,
                   hb, urin, penunjang_lain,
                   faktor_risiko, klasifikasi_risiko, perlu_rujukan, tujuan_rujukan, alasan_rujukan, tatalaksana_awal,
                   ringkasan_kunjungan, jadwal_kontrol_berikut)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['pasien_id']);
        $stmt->bindParam(3, $data['pasien_nama']);
        $stmt->bindParam(4, $data['tanggal']);
        $stmt->bindParam(5, $data['kunjungan_ke']);
        $stmt->bindParam(6, $data['k_status']);
        $stmt->bindParam(7, $data['usg_status']);
        $stmt->bindParam(8, $data['status_4t']);
        $stmt->bindParam(9, $data['gravida']);
        $stmt->bindParam(10, $data['para']);
        $stmt->bindParam(11, $data['abortus']);
        $stmt->bindParam(12, $data['hpht']);
        $stmt->bindParam(13, $data['hpl']);
        $stmt->bindParam(14, $data['keluhan_utama']);
        $stmt->bindParam(15, $data['td']);
        $stmt->bindParam(16, $data['nadi']);
        $stmt->bindParam(17, $data['suhu']);
        $stmt->bindParam(18, $data['bb']);
        $stmt->bindParam(19, $data['tb']);
        $stmt->bindParam(20, $data['edema']);
        $stmt->bindParam(21, $data['djj']);
        $stmt->bindParam(22, $data['tfu']);
        $stmt->bindParam(23, $data['posisi_janin']);
        $stmt->bindParam(24, $data['gerak_janin']);
        $stmt->bindParam(25, $data['fe_diberikan']);
        $stmt->bindParam(26, $data['saran_gizi']);
        $stmt->bindParam(27, $data['hb']);
        $stmt->bindParam(28, $data['urin']);
        $stmt->bindParam(29, $data['penunjang_lain']);
        $stmt->bindParam(30, $data['faktor_risiko']);
        $stmt->bindParam(31, $data['klasifikasi_risiko']);
        $stmt->bindParam(32, $data['perlu_rujukan']);
        $stmt->bindParam(33, $data['tujuan_rujukan']);
        $stmt->bindParam(34, $data['alasan_rujukan']);
        $stmt->bindParam(35, $data['tatalaksana_awal']);
        $stmt->bindParam(36, $data['ringkasan_kunjungan']);
        $stmt->bindParam(37, $data['jadwal_kontrol_berikut']);
        
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

$api = new AncApi($db);
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
            
            if (!empty($data['id']) && !empty($data['pasien_nama']) && !empty($data['tanggal'])) {
                if ($api->create($data)) {
                    http_response_code(201);
                    echo json_encode(['message' => 'ANC record created successfully.', 'id' => $data['id']]);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to create ANC record.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Required fields: id, pasien_nama, tanggal']);
            }
            break;
            
        case 'DELETE':
            if ($path && preg_match('/^(.+)$/', $path, $matches)) {
                $id = $matches[1];
                if ($api->delete($id)) {
                    http_response_code(200);
                    echo json_encode(['message' => 'ANC record deleted successfully.']);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Unable to delete ANC record.']);
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

