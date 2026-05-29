-- =====================================================
-- ALTER TABLE: Tambah kolom nomor_cm ke tabel pasien
-- =====================================================
-- Jalankan file ini untuk update database yang sudah ada
-- =====================================================

-- Tambah kolom nomor_cm
ALTER TABLE pasien 
ADD COLUMN nomor_cm VARCHAR(20) NULL AFTER id;

-- Buat index untuk nomor_cm
ALTER TABLE pasien 
ADD INDEX idx_nomor_cm (nomor_cm);

-- Update nomor_cm untuk data yang sudah ada (jika ada)
-- Format: CM-0001, CM-0002, dst berdasarkan urutan created_at
SET @row_number = 0;
UPDATE pasien 
SET nomor_cm = CONCAT('CM-', LPAD(@row_number := @row_number + 1, 4, '0'))
WHERE nomor_cm IS NULL
ORDER BY created_at ASC, id ASC;

-- Set nomor_cm menjadi NOT NULL dan UNIQUE setelah semua data diupdate
ALTER TABLE pasien 
MODIFY COLUMN nomor_cm VARCHAR(20) NOT NULL,
ADD UNIQUE KEY uk_nomor_cm (nomor_cm);

