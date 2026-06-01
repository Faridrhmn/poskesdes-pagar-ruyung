-- Script untuk melakukan rename kolom id menjadi lebih spesifik sesuai tabelnya (Dukungan MySQL 5.x / MariaDB lama)

-- 1. Drop Foreign Key
ALTER TABLE anc_records DROP FOREIGN KEY anc_records_ibfk_1;
ALTER TABLE kb_records DROP FOREIGN KEY kb_records_ibfk_1;
ALTER TABLE lansia_records DROP FOREIGN KEY lansia_records_ibfk_1;
ALTER TABLE jadwal DROP FOREIGN KEY jadwal_ibfk_1;

-- 2. Mengubah nama kolom ID (menggunakan CHANGE)
ALTER TABLE pasien CHANGE id id_pasien VARCHAR(50);
ALTER TABLE anc_records CHANGE id id_anc VARCHAR(50);
ALTER TABLE kb_records CHANGE id id_kb VARCHAR(50);
ALTER TABLE lansia_records CHANGE id id_lansia VARCHAR(50);
ALTER TABLE jadwal CHANGE id id_jadwal VARCHAR(50);
ALTER TABLE education_materials CHANGE id id_edukasi VARCHAR(50);
ALTER TABLE admins CHANGE id id_admin INT AUTO_INCREMENT;

-- 3. Menambahkan kembali Foreign Key
ALTER TABLE anc_records ADD CONSTRAINT anc_records_ibfk_1 FOREIGN KEY (pasien_id) REFERENCES pasien(id_pasien) ON DELETE SET NULL;
ALTER TABLE kb_records ADD CONSTRAINT kb_records_ibfk_1 FOREIGN KEY (pasien_id) REFERENCES pasien(id_pasien) ON DELETE SET NULL;
ALTER TABLE lansia_records ADD CONSTRAINT lansia_records_ibfk_1 FOREIGN KEY (pasien_id) REFERENCES pasien(id_pasien) ON DELETE SET NULL;
ALTER TABLE jadwal ADD CONSTRAINT jadwal_ibfk_1 FOREIGN KEY (pasien_id) REFERENCES pasien(id_pasien) ON DELETE SET NULL;
