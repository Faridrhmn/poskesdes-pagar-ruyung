export function KbSection() {
  return (
    <section id="pelayanan-kb" className="page" data-page>
      <div className="card layanan-detail">
        <h2>Pelayanan Keluarga Berencana (KB) — Form Lengkap</h2>
        <p className="muted">Isi form berikut untuk merekam pelayanan dan jadwal kontrol KB. Data akan disimpan ke perangkat (localStorage).</p>

        <div className="card anc-block">
          <label>
            Pilih Pasien (Ibu):
            <select id="select-pasien-kb" data-info-target="info-pasien-kb" defaultValue="">
              <option value="">-- Pilih Pasien Terdaftar --</option>
            </select>
          </label>
          <p id="info-pasien-kb" style={{ marginTop: "8px", fontWeight: "bold", color: "#444" }} />
        </div>

        <form id="form-kb">
          <fieldset className="card anc-block">
            <legend>Data Pelayanan KB (Untuk Laporan Form 7)</legend>

            <label>
              Status Peserta:
              <select name="status_peserta" id="kb_status_peserta" required defaultValue="">
                <option value="">Pilih Status</option>
                <option value="Baru">Peserta KB Baru</option>
                <option value="Lama">Peserta KB Lama (Mengganti)</option>
                <option value="Lama">Peserta KB Lama (Suntik Ulang/Pil Lanjut)</option>
                <option value="DropOut">Drop Out/Keluar dari KB</option>
                <option value="Gagal">Gagal/Hamil Saat KB</option>
                <option value="Komplikasi">Komplikasi</option>
              </select>
            </label>

            <label>
              Metode KB:
              <select name="metode_kb" id="kb_metode" defaultValue="">
                <option value="">Pilih Metode</option>
                <option value="Pil">Pil KB</option>
                <option value="Suntik 1 Bln">Suntik 1 Bulan</option>
                <option value="Suntik 3 Bln">Suntik 3 Bulan</option>
                <option value="Implan">Implan (Susuk)</option>
                <option value="IUD">IUD</option>
                <option value="MOW">MOW (Steril)</option>
                <option value="MAL">MAL</option>
                <option value="Kondom">Kondom</option>
                <option value="MOP">MOP</option>
                <option value="Lain">Lainnya</option>
              </select>
            </label>

            <label>
              Tanggal Mulai/Pemasangan:
              <input type="date" name="tgl_mulai" id="kb_tgl_mulai" required />
            </label>

            <label>
              Keterangan:
              <textarea
                name="keterangan"
                rows={2}
                id="kb_keterangan"
                placeholder="Contoh: KB suntik 3 bulan ke-2, Keluhan: pusing ringan, dsb. Jika status Komplikasi/Drop Out/Gagal, jelaskan di sini."
              />
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Jadwal Kontrol Berikutnya</legend>

            <label>
              Rencana Tindakan:
              <select name="rencana_tindakan" id="kb_rencana_tindakan" defaultValue="Kontrol Rutin">
                <option value="Kontrol Rutin">Kontrol Rutin</option>
                <option value="Ganti Metode">Ganti/Lepas Metode</option>
                <option value="Suntik Ulang">Suntik Ulang</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </label>

            <label>
              Jadwal Kontrol Berikutnya:
              <input type="date" name="jadwal_kontrol_kb" id="kb_jadwal_berikut" />
              <span className="danger-note" style={{ fontSize: "12px" }}>
                Catatan: Tanggal ini akan otomatis ditambahkan ke halaman Jadwal.
              </span>
            </label>
          </fieldset>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button type="button" className="small-btn" data-link="home">
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Rekam KB
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

