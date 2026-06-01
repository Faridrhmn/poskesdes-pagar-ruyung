<?php
require_once 'api/db.php';
$db = new Database();
$conn = $db->getConnection();
$stmt = $conn->prepare("SELECT *, id_pasien AS id FROM pasien LIMIT 1");
$stmt->execute();
print_r($stmt->fetch(PDO::FETCH_ASSOC));
