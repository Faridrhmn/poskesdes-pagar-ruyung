export function PemeriksaanSection() {
  return (
    <section id="pemeriksaan" className="page" data-page>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h2 style={{ margin: 0 }}>Pemeriksaan Ibu Hamil (ANC)</h2>
            <p className="muted">Lihat isi pemeriksaan, daftar, dan rekam kunjungan</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn" data-link="anc-detail" type="button">
              Mulai Pemeriksaan ANC
            </button>
          </div>
        </div>

        <div style={{ height: "12px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
          <div style={{ background: "var(--teal-50)", padding: "12px", borderRadius: "10px" }}>
            <strong>Isi Pemeriksaan</strong>
            <ul className="muted" style={{ paddingLeft: "18px" }}>
              <li>Riwayat kehamilan & keluhan utama</li>
              <li>Pemeriksaan fisik: tekanan darah, nadi, suhu</li>
              <li>Pemeriksaan janin: DJJ, TFU, posisi janin</li>
              <li>Pemberian tablet Fe & konseling gizi</li>
              <li>Pemeriksaan penunjang sederhana (Hb, urin) bila perlu</li>
              <li>Skrining risiko kehamilan dan rujukan</li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ margin: "0 0 8px 0" }}>Rekam Kunjungan (Ringkas)</h3>
            <div id="rekam-list" className="muted">
              Belum ada kunjungan terdaftar.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

