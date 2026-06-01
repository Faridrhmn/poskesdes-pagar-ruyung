<?php
require_once 'api/db.php';
require_once 'api/kb.php';
$db = new Database();
$conn = $db->getConnection();
$api = new KbApi($conn);
$data = [
    "id" => "KB-1234",
    "pasien_id" => "P-001",
    "pasien_nama" => "Ibu Siti Aisyah",
    "tanggal" => "2026-06-01",
    "status_peserta" => "Baru",
    "metode_kb" => "Pil",
    "tgl_mulai" => "2026-06-01",
    "keterangan" => "Aman",
    "rencana_tindakan" => "Kontrol",
    "jadwal_kontrol_kb" => "2026-07-01"
];
try {
    $result = $api->create($data);
    echo "Success: " . ($result ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
