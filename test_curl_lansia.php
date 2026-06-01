<?php
require_once '/home/patrick/skripsi_hehe/api/db.php';
$token = generate_token(1, "admin", "superadmin");
$data = [
    "id" => "LAN-1234",
    "pasien_id" => "P-001",
    "pasien_nama" => "Ibu Siti",
    "tanggal" => "2026-06-01",
    "keluhan" => "Pusing",
    "tekanan_darah" => "120/80",
    "berat_badan" => "60",
    "tinggi_badan" => "150",
    "pemeriksaan_lain" => "Gula darah normal",
    "diagnosis" => "Sehat",
    "terapi" => "Vitamin",
    "jadwal_kontrol_lansia" => null
];

$ch = curl_init('http://localhost:8000/lansia.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
echo "Response: " . $response . "\n";
