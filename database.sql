-- =====================================================
-- POSKESDES PAGAR RUYUNG - DATABASE SCHEMA
-- =====================================================
-- Database untuk sistem layanan Poskesdes
-- Digunakan untuk menyimpan data pasien, rekam medis, jadwal, dan edukasi
-- 
-- RELASI TABEL:
-- pasien (1) -> (N) anc_records
-- pasien (1) -> (N) kb_records
-- pasien (1) -> (N) lansia_records
-- pasien (1) -> (N) jadwal
-- 
-- PENGGUNAAN DI WEBSITE:
-- 1. pasien: Form pendaftaran pasien baru, dropdown di form ANC/KB/Lansia
-- 2. anc_records: Form pemeriksaan ibu hamil lengkap
-- 3. kb_records: Form pelayanan KB
-- 4. lansia_records: Form pemeriksaan lansia
-- 5. jadwal: Halaman jadwal, agenda terdekat di home, laporan
-- 6. education_materials: Halaman edukasi kesehatan
-- =====================================================

-- =====================================================
-- TABLE: pasien
-- =====================================================
-- Digunakan di halaman: RegisterSection (Pendaftaran Pasien Baru)
-- Data pasien yang terdaftar di Poskesdes, digunakan sebagai dropdown
-- di form ANC, KB, dan Lansia untuk memilih pasien yang akan diperiksa
-- =====================================================
CREATE TABLE pasien (
    id VARCHAR(50) PRIMARY KEY,
    nomor_cm VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    nik VARCHAR(20),
    no_kk VARCHAR(20),
    no_hp VARCHAR(20) NOT NULL,
    no_kis VARCHAR(20),
    pendidikan VARCHAR(50),
    alamat VARCHAR(255),
    usia_kehamilan INTEGER DEFAULT 0,
    tgl_daftar DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nomor_cm (nomor_cm),
    INDEX idx_nama (nama),
    INDEX idx_no_hp (no_hp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: anc_records
-- =====================================================
-- Digunakan di halaman: AncDetailSection (Pemeriksaan Ibu Hamil)
-- Menyimpan rekam medis pemeriksaan Antenatal Care (ANC)
-- Setiap record adalah satu kunjungan pemeriksaan ibu hamil
-- =====================================================
CREATE TABLE anc_records (
    id VARCHAR(50) PRIMARY KEY,
    pasien_id VARCHAR(50),
    pasien_nama VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    
    -- Data Kunjungan
    kunjungan_ke INTEGER,
    k_status VARCHAR(20),
    usg_status VARCHAR(10) DEFAULT 'Tidak',
    status_4t VARCHAR(10) DEFAULT 'Tidak',
    
    -- Riwayat Kehamilan
    gravida INTEGER,
    para INTEGER,
    abortus INTEGER,
    hpht DATE,
    hpl DATE,
    keluhan_utama TEXT,
    
    -- Pemeriksaan Fisik
    td VARCHAR(20),
    nadi INTEGER,
    suhu DECIMAL(4,1),
    bb DECIMAL(5,1),
    tb INTEGER,
    edema VARCHAR(20),
    
    -- Pemeriksaan Janin
    djj INTEGER,
    tfu DECIMAL(4,1),
    posisi_janin VARCHAR(30),
    gerak_janin VARCHAR(30),
    
    -- Tablet Fe & Gizi
    fe_diberikan INTEGER,
    saran_gizi TEXT,
    
    -- Pemeriksaan Penunjang
    hb DECIMAL(4,1),
    urin VARCHAR(50),
    penunjang_lain TEXT,
    
    -- Skrining Risiko & Rujukan
    faktor_risiko TEXT,
    klasifikasi_risiko VARCHAR(30),
    perlu_rujukan VARCHAR(20),
    tujuan_rujukan VARCHAR(255),
    alasan_rujukan TEXT,
    tatalaksana_awal TEXT,
    
    -- Kesimpulan
    ringkasan_kunjungan TEXT,
    jadwal_kontrol_berikut DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE SET NULL,
    INDEX idx_pasien_id (pasien_id),
    INDEX idx_tanggal (tanggal),
    INDEX idx_k_status (k_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: kb_records
-- =====================================================
-- Digunakan di halaman: KbSection (Pelayanan Keluarga Berencana)
-- Menyimpan rekam pelayanan KB (Keluarga Berencana)
-- Setiap record adalah satu pelayanan/kontrol KB
-- =====================================================
CREATE TABLE kb_records (
    id VARCHAR(50) PRIMARY KEY,
    pasien_id VARCHAR(50),
    pasien_nama VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    
    -- Data Pelayanan KB
    status_peserta VARCHAR(30) NOT NULL,
    metode_kb VARCHAR(30),
    tgl_mulai DATE,
    keterangan TEXT,
    
    -- Jadwal Kontrol
    rencana_tindakan VARCHAR(50),
    jadwal_kontrol_kb DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE SET NULL,
    INDEX idx_pasien_id (pasien_id),
    INDEX idx_tanggal (tanggal),
    INDEX idx_status_peserta (status_peserta),
    INDEX idx_metode_kb (metode_kb)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: lansia_records
-- =====================================================
-- Digunakan di halaman: LansiaSection (Pemeriksaan Pasien Lansia)
-- Menyimpan rekam medis pemeriksaan pasien lansia (usia 60+)
-- Setiap record adalah satu kunjungan pemeriksaan lansia
-- =====================================================
CREATE TABLE lansia_records (
    id VARCHAR(50) PRIMARY KEY,
    pasien_id VARCHAR(50),
    pasien_nama VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    
    -- Data Kunjungan
    keluhan_lansia TEXT NOT NULL,
    diagnosa_lansia VARCHAR(255) NOT NULL,
    bb DECIMAL(5,1),
    tb INTEGER,
    
    -- Pemeriksaan Fisik & Penunjang
    td VARCHAR(20) NOT NULL,
    gds INTEGER,
    asam_urat DECIMAL(5,1),
    kolesterol INTEGER,
    tindakan_lansia TEXT,
    
    -- Jadwal Kontrol
    jadwal_kontrol_lansia DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE SET NULL,
    INDEX idx_pasien_id (pasien_id),
    INDEX idx_tanggal (tanggal),
    INDEX idx_diagnosa (diagnosa_lansia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: jadwal
-- =====================================================
-- Digunakan di halaman: JadwalSection (Manajemen Jadwal)
-- HomeSection (Agenda Terdekat - menampilkan jadwal terdekat)
-- LaporanSection (menampilkan statistik jadwal aktif)
-- Menyimpan semua jadwal kunjungan pasien dan agenda Poskesdes
-- Jadwal bisa dibuat manual atau otomatis dari form ANC/KB/Lansia
-- =====================================================
CREATE TABLE jadwal (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    jenis VARCHAR(50) NOT NULL,
    cara VARCHAR(50) NOT NULL,
    pasien_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE SET NULL,
    INDEX idx_tanggal (tanggal),
    INDEX idx_jenis (jenis),
    INDEX idx_pasien_id (pasien_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: education_materials
-- =====================================================
-- Digunakan di halaman: EducationSection (Edukasi Kesehatan)
-- Menyimpan materi edukasi kesehatan yang bisa dicetak/diekspor
-- Digunakan untuk memberikan informasi kesehatan kepada pasien
-- =====================================================
CREATE TABLE education_materials (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: admins
-- =====================================================
-- Digunakan untuk autentikasi admin dan akses dashboard
-- Role: superadmin (full access), regular (view only)
-- =====================================================
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'regular') DEFAULT 'regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample admin (password: admin123)
-- Password hash generated with password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO admins (username, password_hash, role) VALUES
('superadmin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin'),
('bidan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'regular');

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- View untuk laporan bulanan ringkas
CREATE VIEW v_laporan_bulanan AS
SELECT 
    DATE_FORMAT(tanggal, '%Y-%m') AS bulan,
    DATE_FORMAT(tanggal, '%M %Y') AS bulan_nama,
    COUNT(CASE WHEN k_status = 'K1' THEN 1 END) AS k1_total,
    COUNT(CASE WHEN k_status IN ('K-Lanjut', 'K4', 'K5', 'K6') THEN 1 END) AS k_lanjut,
    COUNT(CASE WHEN klasifikasi_risiko IN ('tinggi', 'gawat_darurat') THEN 1 END) AS komplikasi_ibu_hamil
FROM anc_records
GROUP BY DATE_FORMAT(tanggal, '%Y-%m'), DATE_FORMAT(tanggal, '%M %Y');

-- View untuk statistik KB bulanan
CREATE VIEW v_laporan_kb_bulanan AS
SELECT 
    DATE_FORMAT(tanggal, '%Y-%m') AS bulan,
    DATE_FORMAT(tanggal, '%M %Y') AS bulan_nama,
    COUNT(CASE WHEN status_peserta = 'Baru' THEN 1 END) AS kb_baru,
    COUNT(CASE WHEN status_peserta IN ('DropOut', 'Gagal', 'Komplikasi') THEN 1 END) AS kb_dropout_gagal,
    COUNT(*) AS kb_aktif
FROM kb_records
GROUP BY DATE_FORMAT(tanggal, '%Y-%m'), DATE_FORMAT(tanggal, '%M %Y');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index untuk pencarian pasien berdasarkan nama atau NIK
CREATE INDEX idx_pasien_search ON pasien(nama, nik);

-- Index untuk filter jadwal berdasarkan tanggal dan jenis
CREATE INDEX idx_jadwal_filter ON jadwal(tanggal, jenis);

-- Index untuk laporan ANC berdasarkan bulan (menggunakan tanggal saja, query akan filter dengan DATE_FORMAT)
CREATE INDEX idx_anc_tanggal ON anc_records(tanggal);

-- Index untuk laporan KB berdasarkan bulan (menggunakan tanggal saja, query akan filter dengan DATE_FORMAT)
CREATE INDEX idx_kb_tanggal ON kb_records(tanggal);

-- =====================================================
-- SAMPLE DATA (Optional - untuk testing)
-- =====================================================

-- Sample pasien
INSERT INTO pasien (id, nomor_cm, nama, nik, no_kk, no_hp, pendidikan, alamat, usia_kehamilan, tgl_daftar) VALUES
('P-001', 'CM-0001', 'Ibu Siti Aisyah', '1703012345678901', '1703012345678902', '08123456789', 'SLTP', 'Dusun I, RT 01', 28, CURDATE()),
('P-002', 'CM-0002', 'Ibu Fatimah Az-Zahra', '1703012345678903', '1703012345678904', '08529876543', 'SLTA', 'Dusun II, RT 02', 12, CURDATE()),
('P-003', 'CM-0003', 'Bapak Budi Santoso', '1703012345678905', '1703012345678906', '08123445566', 'SD', 'Dusun III, RT 03', 0, CURDATE());

-- =====================================================
-- SUGGESTED API ENDPOINTS
-- =====================================================
-- Berdasarkan struktur database ini, berikut endpoint yang disarankan:
--
-- PASIEN:
--   GET    /api/pasien              - List semua pasien (untuk dropdown)
--   GET    /api/pasien/:id          - Detail pasien
--   POST   /api/pasien              - Daftar pasien baru
--   PUT    /api/pasien/:id          - Update data pasien
--   DELETE /api/pasien/:id          - Hapus pasien
--
-- ANC RECORDS:
--   GET    /api/anc                 - List rekam ANC (dengan filter)
--   GET    /api/anc/:id             - Detail rekam ANC
--   POST   /api/anc                 - Simpan rekam ANC baru
--   PUT    /api/anc/:id              - Update rekam ANC
--   GET    /api/anc/pasien/:id       - Rekam ANC per pasien
--
-- KB RECORDS:
--   GET    /api/kb                  - List rekam KB
--   GET    /api/kb/:id               - Detail rekam KB
--   POST   /api/kb                   - Simpan rekam KB baru
--   PUT    /api/kb/:id                - Update rekam KB
--   GET    /api/kb/pasien/:id         - Rekam KB per pasien
--
-- LANSIA RECORDS:
--   GET    /api/lansia               - List rekam Lansia
--   GET    /api/lansia/:id            - Detail rekam Lansia
--   POST   /api/lansia                - Simpan rekam Lansia baru
--   PUT    /api/lansia/:id             - Update rekam Lansia
--   GET    /api/lansia/pasien/:id      - Rekam Lansia per pasien
--
-- JADWAL:
--   GET    /api/jadwal               - List jadwal (dengan filter tanggal)
--   GET    /api/jadwal/:id            - Detail jadwal
--   POST   /api/jadwal                - Tambah jadwal baru
--   PUT    /api/jadwal/:id             - Update jadwal
--   DELETE /api/jadwal/:id             - Hapus jadwal
--   GET    /api/jadwal/upcoming       - Jadwal mendatang (untuk home page)
--
-- EDUCATION:
--   GET    /api/education             - List materi edukasi
--   GET    /api/education/:id         - Detail materi
--   POST   /api/education              - Tambah materi baru
--   PUT    /api/education/:id          - Update materi
--   DELETE /api/education/:id          - Hapus materi
--
-- LAPORAN:
--   GET    /api/laporan/statistik     - Statistik ringkas (untuk halaman laporan)
--   GET    /api/laporan/bulanan       - Laporan bulanan (untuk ekspor CSV)
--   GET    /api/laporan/anc           - Ekspor CSV rekam ANC
--   GET    /api/laporan/kb            - Ekspor CSV rekam KB
--   GET    /api/laporan/lansia        - Ekspor CSV rekam Lansia
--   GET    /api/laporan/pasien        - Ekspor CSV data pasien
--   GET    /api/laporan/jadwal        - Ekspor CSV jadwal
-- =====================================================

