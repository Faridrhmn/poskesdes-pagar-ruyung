export function LaporanSection() {
  return (
    <section id="laporan" className="page" data-page>
      <div className="card">
        <h2 style={{ margin: 0 }}>Laporan & Statistik Ringkas</h2>
        <p className="muted">Statistik dasar pasien terdaftar dan jadwal kontrol aktif</p>
        <div style={{ display: "flex", gap: "10px", margin: "12px 0", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 140px", background: "#f9fafb", borderRadius: "10px", padding: "10px" }}>
            <p className="muted" style={{ fontSize: "12px", margin: 0 }}>
              Total Pendaftar
            </p>
            <p id="lap-total-pendaftar" style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
              0
            </p>
          </div>
          <div style={{ flex: "1 1 140px", background: "#f9fafb", borderRadius: "10px", padding: "10px" }}>
            <p className="muted" style={{ fontSize: "12px", margin: 0 }}>
              Total Rekam ANC
            </p>
            <p id="lap-total-anc" style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
              0
            </p>
          </div>
          <div style={{ flex: "1 1 140px", background: "#f9fafb", borderRadius: "10px", padding: "10px" }}>
            <p className="muted" style={{ fontSize: "12px", margin: 0 }}>
              Total Rekam KB
            </p>
            <p id="lap-total-kb" style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
              0
            </p>
          </div>
          <div style={{ flex: "1 1 140px", background: "#f9fafb", borderRadius: "10px", padding: "10px" }}>
            <p className="muted" style={{ fontSize: "12px", margin: 0 }}>
              Total Rekam Lansia
            </p>
            <p id="lap-total-lansia" style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
              0
            </p>
          </div>
          <div style={{ flex: "1 1 140px", background: "#f9fafb", borderRadius: "10px", padding: "10px" }}>
            <p className="muted" style={{ fontSize: "12px", margin: 0 }}>
              Jadwal Kontrol Aktif
            </p>
            <p id="lap-total-jadwal" style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
              0
            </p>
          </div>
        </div>
        <h3 style={{ margin: "0 0 4px 0" }}>Daftar Jadwal (Ringkas)</h3>
        <div className="table-like" id="laporan-jadwal">
          <div className="header">
            <span>No</span>
            <span>Pasien</span>
            <span>Tanggal</span>
            <span>Jenis</span>
          </div>
        </div>
      </div>
    </section>
  )
}

