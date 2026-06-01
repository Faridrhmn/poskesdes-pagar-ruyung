<?php
// Mock $_SERVER for CLI
$_SERVER['REQUEST_METHOD'] = 'POST';

require_once 'api/db.php';
require_once 'api/kb.php';

$db = new Database();
$conn = $db->getConnection();

// Bypass auth by instantiating API directly
$api = new KbApi($conn);

$data = [
    "id" => "KB-test-999",
    "pasien_id" => "P-001",
    "pasien_nama" => "Ibu Siti Aisyah",
    "tanggal" => "2026-06-01",
    "status_peserta" => "Baru",
    "metode_kb" => "Pil",
    "tgl_mulai" => "2026-06-01",
    "keterangan" => "Aman",
    "rencana_tindakan" => "Kontrol",
    "jadwal_kontrol_kb" => null
];

try {
    $result = $api->create($data);
    echo "Success: " . ($result ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
