export function RegisterSection() {
  return (
    <section id="register" className="page" data-page>
      <div className="card layanan-detail">
        <h2>Pendaftaran Pasien Baru</h2>
        <p className="muted">
          Isi form berikut untuk mendaftarkan pasien baru (Ibu Hamil/Akseptor KB/Lansia). Data ini akan muncul di dropdown pemeriksaan.
        </p>

        <form id="form-register-pasien">
          <fieldset className="card anc-block">
            <legend>Data Dasar Pasien</legend>

            <label>
              Nomor Catatan Medik (CM):
              <input type="text" name="nomor_cm" id="reg_nomor_cm" readOnly placeholder="Otomatis terisi saat menyimpan" style={{ background: "#f0f0f0", cursor: "not-allowed" }} />
              <span className="muted" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                Nomor CM akan otomatis di-generate saat pendaftaran.
              </span>
            </label>

            <label>
              Nama Lengkap Pasien:
              <input type="text" name="nama" id="reg_nama" required placeholder="Contoh: Ibu Siti Aisyah" />
            </label>

            <div className="form-row">
              <div className="col">
                <label>
                  NIK Pasien:
                  <input type="text" name="nik" id="reg_nik" placeholder="Contoh: 17xxxxxxxxxxxxxx" />
                </label>
              </div>
              <div className="col">
                <label>
                  No Kartu Keluarga (KK):
                  <input type="text" name="no_kk" id="reg_no_kk" placeholder="Contoh: 17xxxxxxxxxxxxxx" />
                </label>
              </div>
            </div>

            <label>
              Nomor HP (WhatsApp):
              <input type="text" name="no_hp" id="reg_no_hp" required placeholder="Contoh: 08123456789" />
              <span className="muted" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                Nomor ini akan digunakan untuk pengingat jadwal.
              </span>
            </label>

            <div className="form-row">
              <div className="col">
                <label>
                  Pendidikan Terakhir:
                  <select name="pendidikan" id="reg_pendidikan" defaultValue="">
                    <option value="">Pilih</option>
                    <option value="SD">SD</option>
                    <option value="SLTP">SLTP</option>
                    <option value="SLTA">SLTA</option>
                    <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                  </select>
                </label>
              </div>
              <div className="col">
                <label>
                  No KIS/BPJS:
                  <input type="text" name="no_kis" id="reg_no_kis" placeholder="Opsional" />
                </label>
              </div>
            </div>

            <label>
              Alamat Ringkas:
              <input type="text" name="alamat" id="reg_alamat" placeholder="Contoh: Dusun I, RT 01" />
            </label>

            <label>
              Usia Kehamilan (Minggu, isi &lsquo;0&rsquo; jika bukan ibu hamil):
              <input type="number" name="usia_kehamilan" id="reg_usia_kehamilan" min="0" required defaultValue={0} />
            </label>
          </fieldset>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "10px" }}>
            <button type="button" className="small-btn" data-link="home">
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Daftar Pasien
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

