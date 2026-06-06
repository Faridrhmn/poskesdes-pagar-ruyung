-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 06, 2026 at 04:34 PM
-- Server version: 5.7.42
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `poskesdes_pagar_ruyung_old`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('superadmin','regular') COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `username`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$KjseVepgyntmqDAP1lTIsevTrj1rxMQJTWxMwcI335cRf9qHEEKAW', 'regular', '2025-11-21 04:14:15', '2025-11-27 08:58:15'),
(2, 'superadmin', '$2a$12$CXKNDTpRWlIfFyQ4iBr2G.IJ5xnEKYfVjZVxf4zOKOmLKGhDEU2CG', 'superadmin', '2025-11-26 13:53:36', '2025-11-26 14:28:24'),
(4, 'dzakirah', '$2y$12$hvNbpEedfJDQX2EmxLJgBOJshHJs88psMBKH2mYu3.GCIb7pbxN/e', 'superadmin', '2025-11-27 08:47:47', '2026-06-05 09:05:47'),
(5, 'bidan', '$2y$12$b00kgOclRA8q3retfvDDu.99y/mH8VoK5MTniZA0lxqdo0PxzXWFG', 'regular', '2026-06-05 15:09:49', '2026-06-05 15:09:49');

-- --------------------------------------------------------

--
-- Table structure for table `anc_records`
--

CREATE TABLE `anc_records` (
  `id_anc` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pasien_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pasien_nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `kunjungan_ke` int(11) DEFAULT NULL,
  `k_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usg_status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'Tidak',
  `status_4t` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'Tidak',
  `gravida` int(11) DEFAULT NULL,
  `para` int(11) DEFAULT NULL,
  `abortus` int(11) DEFAULT NULL,
  `hpht` date DEFAULT NULL,
  `hpl` date DEFAULT NULL,
  `keluhan_utama` text COLLATE utf8mb4_unicode_ci,
  `td` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nadi` int(11) DEFAULT NULL,
  `suhu` decimal(4,1) DEFAULT NULL,
  `bb` decimal(5,1) DEFAULT NULL,
  `tb` int(11) DEFAULT NULL,
  `edema` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `djj` int(11) DEFAULT NULL,
  `tfu` decimal(4,1) DEFAULT NULL,
  `posisi_janin` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gerak_janin` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fe_diberikan` int(11) DEFAULT NULL,
  `saran_gizi` text COLLATE utf8mb4_unicode_ci,
  `hb` decimal(4,1) DEFAULT NULL,
  `urin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penunjang_lain` text COLLATE utf8mb4_unicode_ci,
  `faktor_risiko` text COLLATE utf8mb4_unicode_ci,
  `klasifikasi_risiko` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perlu_rujukan` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tujuan_rujukan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alasan_rujukan` text COLLATE utf8mb4_unicode_ci,
  `tatalaksana_awal` text COLLATE utf8mb4_unicode_ci,
  `ringkasan_kunjungan` text COLLATE utf8mb4_unicode_ci,
  `jadwal_kontrol_berikut` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anc_records`
--

INSERT INTO `anc_records` (`id_anc`, `pasien_id`, `pasien_nama`, `tanggal`, `kunjungan_ke`, `k_status`, `usg_status`, `status_4t`, `gravida`, `para`, `abortus`, `hpht`, `hpl`, `keluhan_utama`, `td`, `nadi`, `suhu`, `bb`, `tb`, `edema`, `djj`, `tfu`, `posisi_janin`, `gerak_janin`, `fe_diberikan`, `saran_gizi`, `hb`, `urin`, `penunjang_lain`, `faktor_risiko`, `klasifikasi_risiko`, `perlu_rujukan`, `tujuan_rujukan`, `alasan_rujukan`, `tatalaksana_awal`, `ringkasan_kunjungan`, `jadwal_kontrol_berikut`, `created_at`, `updated_at`) VALUES
('ANC-mi8ex294', 'P-003', 'Bapak Budi Santoso', '2025-11-21', NULL, NULL, NULL, NULL, 123, 123, 123, '2025-11-14', '2025-11-21', 'DWQDWQ', '12331', 12313, 44.0, 2131.0, 213213, 'ringan', 123, 123.0, 'kepala', 'berkurang', 33, 'dwqdwqwq', 999.9, 'ddwqdwq', 'qdwqdqw', 'dqdq', 'gawat_darurat', 'tidak', 'dqwdwq', 'dwqdq', 'dwq', 'dqdwq', '2025-11-13', '2025-11-21 05:21:17', '2025-11-21 05:21:17'),
('ANC-miee5xyp', 'P-miedw4ni', 'Titi Suryani ', '2025-11-25', NULL, NULL, NULL, NULL, 2, 1, 0, '2025-05-21', '2025-05-26', 'Tidak ada keluhan ', '100/80', 85, 36.5, 49.0, 155, 'tidak', 146, 19.0, 'kepala', 'aktif', 20, 'Makan banyak karbohidrat\nMinum kalsium\nMakan sayur dan buah ', 12.0, '', '', 'Tidak ada ', '', '', '', '', '', '', '2025-12-24', '2025-11-25 09:46:49', '2025-11-25 09:46:49'),
('ANC-mief31o8', 'P-mieeav6v', 'YAFI MARTA GAYATRI', '2025-11-25', NULL, NULL, NULL, NULL, 1, 0, 0, '2025-05-16', '2025-02-21', 'Tidak ada', '120/80', 87, 36.6, 68.0, 153, 'tidak', 162, 20.0, 'kepala', 'aktif', 20, 'Banyak makan sayur dan buah\nKebersihan hygine', 12.0, '', '', 'Ibu hamil terlalu muda umur 16 tahun', 'tinggi', 'terencana', 'Puskesmas ', 'Resiko Kehamilan', 'Kontrol perkembangan dan periksa awal jika ada tanda2 gawat janin', 'Konsul ke dokter obgyn', '2025-12-24', '2025-11-25 10:12:34', '2025-11-25 10:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `education_materials`
--

CREATE TABLE `education_materials` (
  `id_edukasi` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id_jadwal` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `jenis` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cara` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pasien_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id_jadwal`, `nama`, `tanggal`, `jenis`, `cara`, `pasien_id`, `created_at`, `updated_at`) VALUES
('J-mi8mq2m93bb', 'KB Kontrol: Ibu Siti Aisyah (Suntik 1 Bln)', '2025-12-21', 'KB Kontrol', 'Telepon/WA', 'P-001', '2025-11-21 08:59:50', '2025-11-21 08:59:50'),
('J-miba6psx', 'Ibu Fatimah Az-Zahra', '2025-11-24', 'KB Kontrol', 'Telepon/WA', 'P-002', '2025-11-23 05:32:04', '2025-11-23 05:32:04'),
('J-mibaacro', 'Bapak Budi Santoso', '2025-11-25', 'ANC Kontrol', 'Telepon/WA', 'P-003', '2025-11-23 05:34:54', '2025-11-23 05:45:37'),
('J-mibbajl0cgh', 'KB Kontrol: Neni (Suntik 1 Bln)', '2025-11-24', 'KB Kontrol', 'Telepon/WA', 'P-mibb81gm', '2025-11-23 06:03:08', '2025-11-23 06:03:08'),
('J-mibiwwg3bna', 'Kontrol Lansia: Bapak Budi Santoso', '2025-11-23', 'Lansia Kontrol', 'Telepon/WA', 'P-003', '2025-11-23 09:36:28', '2025-11-23 09:36:28'),
('J-mibpltn0', 'Neni', '2025-11-27', 'Lainnya', 'Telepon/WA', 'P-mibb81gm', '2025-11-23 12:43:33', '2025-11-23 12:43:33'),
('J-miee5y261ke', 'ANC Kontrol: Titi Suryani ', '2025-12-24', 'ANC Kontrol', 'Poskesdes', 'P-miedw4ni', '2025-11-25 09:46:49', '2025-11-25 09:46:49'),
('J-mief32j777v', 'ANC Kontrol: YAFI MARTA GAYATRI', '2025-12-24', 'ANC Kontrol', 'Poskesdes', 'P-mieeav6v', '2025-11-25 10:12:35', '2025-11-25 10:12:35'),
('J-mpqzdh49bw4', 'KB Kontrol: Bapak Budi Santoso (MOW)', '2026-05-30', 'KB Kontrol', 'Telepon/WA', 'P-003', '2026-05-29 13:51:44', '2026-05-29 13:51:44'),
('J-mpqzfwgst8y', 'Kontrol Lansia: Titi Suryani ', '2026-05-30', 'Lansia Kontrol', 'Telepon/WA', 'P-miedw6e0', '2026-05-29 13:53:37', '2026-05-29 13:53:37'),
('J-mpv4i8ksab7', 'KB Kontrol: Titi Suryani  (Suntik 3 Bln)', '2026-06-02', 'KB Kontrol', 'Telepon/WA', 'P-miedw4ni', '2026-06-01 11:26:29', '2026-06-01 11:26:29'),
('J-mq0pao6guc0', 'KB Kontrol: Bapak Budi Santoso (Kondom)', '2026-06-06', 'KB Kontrol', 'Telepon/WA', 'P-003', '2026-06-05 09:07:19', '2026-06-05 09:07:19'),
('J-test', 'Test Jadwal', '2026-06-01', 'Lansia Kontrol', 'Telepon', 'P-001', '2026-06-01 10:59:51', '2026-06-01 10:59:51');

-- --------------------------------------------------------

--
-- Table structure for table `kb_records`
--

CREATE TABLE `kb_records` (
  `id_kb` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pasien_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pasien_nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `status_peserta` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metode_kb` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tgl_mulai` date DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `rencana_tindakan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jadwal_kontrol_kb` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kb_records`
--

INSERT INTO `kb_records` (`id_kb`, `pasien_id`, `pasien_nama`, `tanggal`, `status_peserta`, `metode_kb`, `tgl_mulai`, `keterangan`, `rencana_tindakan`, `jadwal_kontrol_kb`, `created_at`, `updated_at`) VALUES
('KB-mpqzdh1y', 'P-003', 'Bapak Budi Santoso', '2026-05-29', 'Baru', 'MOW', '2026-05-30', 'coba test', 'Kontrol Rutin', '2026-05-30', '2026-05-29 13:51:44', '2026-05-29 13:51:44'),
('KB-mpv4i8j6', 'P-miedw4ni', 'Titi Suryani ', '2026-06-01', 'Lama', 'Suntik 3 Bln', '2026-06-02', 'test', 'Kontrol Rutin', '2026-06-02', '2026-06-01 11:26:29', '2026-06-01 11:26:29'),
('KB-mq0pao5t', 'P-003', 'Bapak Budi Santoso', '2026-06-05', 'Lama', 'Kondom', '2026-06-05', NULL, 'Kontrol Rutin', '2026-06-06', '2026-06-05 09:07:19', '2026-06-05 09:07:19');

-- --------------------------------------------------------

--
-- Table structure for table `lansia_records`
--

CREATE TABLE `lansia_records` (
  `id_lansia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pasien_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pasien_nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `keluhan_lansia` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `diagnosa_lansia` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bb` decimal(5,1) DEFAULT NULL,
  `tb` int(11) DEFAULT NULL,
  `td` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gds` int(11) DEFAULT NULL,
  `asam_urat` decimal(5,1) DEFAULT NULL,
  `kolesterol` int(11) DEFAULT NULL,
  `tindakan_lansia` text COLLATE utf8mb4_unicode_ci,
  `jadwal_kontrol_lansia` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lansia_records`
--

INSERT INTO `lansia_records` (`id_lansia`, `pasien_id`, `pasien_nama`, `tanggal`, `keluhan_lansia`, `diagnosa_lansia`, `bb`, `tb`, `td`, `gds`, `asam_urat`, `kolesterol`, `tindakan_lansia`, `jadwal_kontrol_lansia`, `created_at`, `updated_at`) VALUES
('LAN-1234', 'P-001', 'Ibu Siti', '2026-06-01', 'Pusing', 'Sehat', 60.0, 150, '120/80', NULL, NULL, NULL, 'Vitamin', NULL, '2026-06-01 10:59:37', '2026-06-01 10:59:37'),
('LANSIA-mpqzfwe5', 'P-miedw6e0', 'Titi Suryani ', '2026-05-29', 'sdds', 'uunun', 123.0, 768, '81/80', 322, 45.0, 788, '', '2026-05-30', '2026-05-29 13:53:37', '2026-05-29 13:53:37');

-- --------------------------------------------------------

--
-- Table structure for table `pasien`
--

CREATE TABLE `pasien` (
  `id_pasien` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_cm` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_kk` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_kis` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pendidikan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usia_kehamilan` int(11) DEFAULT '0',
  `tgl_daftar` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pasien`
--

INSERT INTO `pasien` (`id_pasien`, `nomor_cm`, `nama`, `nik`, `no_kk`, `no_hp`, `no_kis`, `pendidikan`, `alamat`, `usia_kehamilan`, `tgl_daftar`, `created_at`, `updated_at`) VALUES
('P-001', 'CM-0001', 'Ibu Siti Aisyah', '1703012345678901', '1703012345678902', '08123456789', NULL, 'SLTP', 'Dusun I, RT 01', 28, '2025-11-21', '2025-11-21 04:08:02', '2025-11-23 04:56:50'),
('P-002', 'CM-0002', 'Ibu Fatimah Az-Zahra', '1703012345678903', '1703012345678904', '08529876543', NULL, 'SLTA', 'Dusun II, RT 02', 12, '2025-11-21', '2025-11-21 04:08:02', '2025-11-23 04:56:50'),
('P-003', 'CM-0003', 'Bapak Budi Santoso', '1703012345678905', '1703012345678906', '08123445566', NULL, 'SD', 'Dusun III, RT 03', 0, '2025-11-21', '2025-11-21 04:08:02', '2025-11-23 04:56:50'),
('P-mibb81gm', 'CM-0004', 'Neni', '1771001678', '17771002', '085292024977', NULL, 'SLTA', 'Pagar ruyung', 1, '2025-11-23', '2025-11-23 06:01:11', '2025-11-23 06:01:11'),
('P-miedw4ni', 'CM-0005', 'Titi Suryani ', '1703075510030004', NULL, '085809094729', NULL, 'SLTP', 'Desa Pagar Ruyung ', 26, '2025-11-25', '2025-11-25 09:39:11', '2025-11-25 09:39:11'),
('P-miedw6e0', 'CM-0006', 'Titi Suryani ', '1703075510030004', NULL, '085809094729', NULL, 'SLTP', 'Desa Pagar Ruyung ', 26, '2025-11-25', '2025-11-25 09:39:14', '2025-11-25 09:39:14'),
('P-miedw8m6', 'CM-0007', 'Titi Suryani ', '1703075510030004', NULL, '085809094729', NULL, 'SLTP', 'Desa Pagar Ruyung ', 26, '2025-11-25', '2025-11-25 09:39:16', '2025-11-25 09:39:16'),
('P-mieeav6v', 'CM-0008', 'YAFI MARTA GAYATRI', '1771046811090001', NULL, '085609667760', NULL, 'SD', 'Desa Pagar Ruyung', 27, '2025-11-25', '2025-11-25 09:50:40', '2025-11-25 09:50:40');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_laporan_bulanan`
-- (See below for the actual view)
--
CREATE TABLE `v_laporan_bulanan` (
`bulan` varchar(7)
,`bulan_nama` varchar(69)
,`k1_total` bigint(21)
,`k_lanjut` bigint(21)
,`komplikasi_ibu_hamil` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_laporan_kb_bulanan`
-- (See below for the actual view)
--
CREATE TABLE `v_laporan_kb_bulanan` (
`bulan` varchar(7)
,`bulan_nama` varchar(69)
,`kb_baru` bigint(21)
,`kb_dropout_gagal` bigint(21)
,`kb_aktif` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure for view `v_laporan_bulanan`
--
DROP TABLE IF EXISTS `v_laporan_bulanan`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_laporan_bulanan`  AS SELECT date_format(`anc_records`.`tanggal`,'%Y-%m') AS `bulan`, date_format(`anc_records`.`tanggal`,'%M %Y') AS `bulan_nama`, count((case when (`anc_records`.`k_status` = 'K1') then 1 end)) AS `k1_total`, count((case when (`anc_records`.`k_status` in ('K-Lanjut','K4','K5','K6')) then 1 end)) AS `k_lanjut`, count((case when (`anc_records`.`klasifikasi_risiko` in ('tinggi','gawat_darurat')) then 1 end)) AS `komplikasi_ibu_hamil` FROM `anc_records` GROUP BY date_format(`anc_records`.`tanggal`,'%Y-%m'), date_format(`anc_records`.`tanggal`,'%M %Y') ;

-- --------------------------------------------------------

--
-- Structure for view `v_laporan_kb_bulanan`
--
DROP TABLE IF EXISTS `v_laporan_kb_bulanan`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_laporan_kb_bulanan`  AS SELECT date_format(`kb_records`.`tanggal`,'%Y-%m') AS `bulan`, date_format(`kb_records`.`tanggal`,'%M %Y') AS `bulan_nama`, count((case when (`kb_records`.`status_peserta` = 'Baru') then 1 end)) AS `kb_baru`, count((case when (`kb_records`.`status_peserta` in ('DropOut','Gagal','Komplikasi')) then 1 end)) AS `kb_dropout_gagal`, count(0) AS `kb_aktif` FROM `kb_records` GROUP BY date_format(`kb_records`.`tanggal`,'%Y-%m'), date_format(`kb_records`.`tanggal`,'%M %Y') ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `anc_records`
--
ALTER TABLE `anc_records`
  ADD PRIMARY KEY (`id_anc`),
  ADD KEY `idx_pasien_id` (`pasien_id`),
  ADD KEY `idx_tanggal` (`tanggal`),
  ADD KEY `idx_k_status` (`k_status`),
  ADD KEY `idx_anc_tanggal` (`tanggal`);

--
-- Indexes for table `education_materials`
--
ALTER TABLE `education_materials`
  ADD PRIMARY KEY (`id_edukasi`),
  ADD KEY `idx_title` (`title`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id_jadwal`),
  ADD KEY `idx_tanggal` (`tanggal`),
  ADD KEY `idx_jenis` (`jenis`),
  ADD KEY `idx_pasien_id` (`pasien_id`),
  ADD KEY `idx_jadwal_filter` (`tanggal`,`jenis`);

--
-- Indexes for table `kb_records`
--
ALTER TABLE `kb_records`
  ADD PRIMARY KEY (`id_kb`),
  ADD KEY `idx_pasien_id` (`pasien_id`),
  ADD KEY `idx_tanggal` (`tanggal`),
  ADD KEY `idx_status_peserta` (`status_peserta`),
  ADD KEY `idx_metode_kb` (`metode_kb`),
  ADD KEY `idx_kb_tanggal` (`tanggal`);

--
-- Indexes for table `lansia_records`
--
ALTER TABLE `lansia_records`
  ADD PRIMARY KEY (`id_lansia`),
  ADD KEY `idx_pasien_id` (`pasien_id`),
  ADD KEY `idx_tanggal` (`tanggal`),
  ADD KEY `idx_diagnosa` (`diagnosa_lansia`);

--
-- Indexes for table `pasien`
--
ALTER TABLE `pasien`
  ADD PRIMARY KEY (`id_pasien`),
  ADD UNIQUE KEY `uk_nomor_cm` (`nomor_cm`),
  ADD KEY `idx_nama` (`nama`),
  ADD KEY `idx_no_hp` (`no_hp`),
  ADD KEY `idx_pasien_search` (`nama`,`nik`),
  ADD KEY `idx_nomor_cm` (`nomor_cm`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anc_records`
--
ALTER TABLE `anc_records`
  ADD CONSTRAINT `anc_records_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE SET NULL;

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE SET NULL;

--
-- Constraints for table `kb_records`
--
ALTER TABLE `kb_records`
  ADD CONSTRAINT `kb_records_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE SET NULL;

--
-- Constraints for table `lansia_records`
--
ALTER TABLE `lansia_records`
  ADD CONSTRAINT `lansia_records_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
