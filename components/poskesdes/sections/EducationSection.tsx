export function EducationSection() {
  return (
    <section id="edukasi" className="page" data-page>
      <div className="card">
        <h2 style={{ margin: 0 }}>Edukasi Kesehatan</h2>
        <p className="muted">Tambahkan, kelola materi edukasi, dan cetak sebagai pamflet di sini.</p>

        <div className="card" style={{ marginBottom: "12px", border: "1px solid var(--teal-600)", background: "#f9ffff" }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Tambah Materi Baru</h3>
          <form id="form-edukasi">
            <label>
              Judul Materi:
              <input type="text" id="edu_title" name="title" required placeholder="Contoh: Manfaat ASI Eksklusif" />
            </label>
            <label style={{ marginTop: "10px" }}>
              Isi/Deskripsi Singkat:
              <textarea
                id="edu_body"
                name="body"
                rows={2}
                required
                placeholder="Contoh: ASI Eksklusif selama 6 bulan pertama meningkatkan daya tahan tubuh bayi..."
              />
            </label>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button type="submit" className="btn-primary">
                Simpan Materi
              </button>
            </div>
          </form>
        </div>

        <h3 style={{ margin: "0 0 8px 0" }}>Daftar Materi Aktif</h3>
        <button className="small-btn" id="btn-print-edukasi" type="button" style={{ marginBottom: "10px", background: "#e0f2f1", color: "var(--teal-600)" }}>
          Cetak/Ekspor PDF Materi
        </button>
        <div id="education-list" style={{ display: "grid", gap: "10px" }} />
      </div>
    </section>
  )
}

