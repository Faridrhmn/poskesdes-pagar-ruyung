export function LansiaSection() {
  return (
    <section id="lansia-detail" className="page" data-page>
      <div className="card layanan-detail">
        <h2>Pemeriksaan Pasien Lansia & Posbindu — Form Lengkap</h2>
        <p className="muted">Isi form berikut untuk merekam pemeriksaan Lansia (Usia 60+). Data akan disimpan ke perangkat (localStorage).</p>

        <div className="card anc-block">
          <label>
            Pilih Pasien:
            <select id="select-pasien-lansia" data-info-target="info-pasien-lansia" defaultValue="">
              <option value="">-- Pilih Pasien Terdaftar --</option>
            </select>
          </label>
          <p id="info-pasien-lansia" style={{ marginTop: "8px", fontWeight: "bold", color: "#444" }} />
        </div>

        <form id="form-lansia">
          <fieldset className="card anc-block">
            <legend>Data Kunjungan & Keluhan Utama</legend>
            <label>
              Keluhan Utama:
              <textarea name="keluhan_lansia" rows={2} id="lansia_keluhan" placeholder="Contoh: pusing, nyeri sendi, batuk lama, dsb." required />
            </label>
            <label>
              Diagnosa (Ringkas):
              <input type="text" name="diagnosa_lansia" id="lansia_diagnosa" required placeholder="Contoh: Hipertensi, Osteoarthritis, DM Tipe 2" />
            </label>
            <div className="form-row">
              <div className="col">
                <label>
                  Berat Badan (kg):
                  <input type="number" step="0.1" name="bb" min={0} id="lansia_bb" />
                </label>
              </div>
              <div className="col">
                <label>
                  Tinggi Badan (cm):
                  <input type="number" name="tb" min={0} id="lansia_tb" />
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Pemeriksaan Fisik & Penunjang</legend>

            <label>
              Tekanan darah (mmHg):
              <input type="text" name="td" id="lansia_td" placeholder="Contoh: 140/90" required />
            </label>

            <div className="form-row">
              <div className="col">
                <label>
                  Gula Darah Sewaktu (GDS) (mg/dL):
                  <input type="number" name="gds" min={0} id="lansia_gds" />
                </label>
              </div>
              <div className="col">
                <label>
                  Asam Urat (mg/dL):
                  <input type="number" step="0.1" name="asam_urat" id="lansia_asam_urat" />
                </label>
              </div>
              <div className="col">
                <label>
                  Kolesterol Total (mg/dL):
                  <input type="number" name="kolesterol" min={0} id="lansia_kolesterol" />
                </label>
              </div>
            </div>

            <label>
              Tindakan/Pengobatan:
              <textarea
                name="tindakan_lansia"
                rows={2}
                id="lansia_tindakan"
                placeholder="Contoh: Pemberian obat Hipertensi Amlodipin 5mg, Edukasi diet rendah garam, rujuk ke Puskesmas, dsb."
              />
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Jadwal Kontrol Berikutnya</legend>

            <label>
              Jadwal Kontrol Berikutnya:
              <input type="date" name="jadwal_kontrol_lansia" id="lansia_jadwal_berikut" />
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
              Simpan Rekam Lansia
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

