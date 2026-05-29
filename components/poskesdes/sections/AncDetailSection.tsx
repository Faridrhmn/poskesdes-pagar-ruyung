export function AncDetailSection() {
  return (
    <section id="anc-detail" className="page" data-page>
      <div className="card layanan-detail">
        <h2>Pemeriksaan Ibu Hamil (ANC) — Form Lengkap</h2>
        <p className="muted">Isi form berikut untuk merekam pemeriksaan ANC. Data akan disimpan ke perangkat (localStorage).</p>

        <div className="card anc-block">
          <label>
            Pilih Pasien:
            <select id="select-pasien-anc" data-info-target="info-pasien-anc" defaultValue="">
              <option value="">-- Pilih Pasien Terdaftar --</option>
            </select>
          </label>
          <p id="info-pasien-anc" style={{ marginTop: "8px", fontWeight: "bold", color: "#444" }} />
        </div>

        <form id="form-anc">
          <fieldset className="card anc-block">
            <legend>Data Kunjungan (Untuk Laporan)</legend>
            <div className="form-row">
              <div className="col">
                <label>
                  ANC Kunjungan Ke-:
                  <input type="number" name="anc_kunjungan_ke" min={1} id="anc_kunjungan_ke" placeholder="Contoh: 1, 2, 3, ..." required />
                </label>
              </div>
              <div className="col">
                <label>
                  Status Kunjungan:
                  <select name="anc_k_status" id="anc_k_status" required defaultValue="">
                    <option value="">Pilih</option>
                    <option value="K1">K1 (Kunjungan Pertama)</option>
                    <option value="K-Lanjut">K Lanjut (K4/K5/K6)</option>
                    <option value="K4">K4</option>
                    <option value="K5">K5</option>
                    <option value="K6">K6</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="col">
                <label>
                  USG oleh Dokter:
                  <select name="anc_usg_status" id="anc_usg_status" defaultValue="Tidak">
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </label>
              </div>
              <div className="col">
                <label>
                  Status 4T (Risiko):
                  <select name="anc_4t_status" id="anc_4t_status" defaultValue="Tidak">
                    <option value="Tidak">Tidak 4T</option>
                    <option value="Ya">Ya (Terlalu Muda/Tua/Rapat/Banyak)</option>
                  </select>
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Riwayat Kehamilan & Keluhan Utama</legend>

            <label>
              Gravida (G):
              <input type="number" name="gravida" min={0} id="anc_gravida" />
            </label>

            <label>
              Para (P):
              <input type="number" name="para" min={0} id="anc_para" />
            </label>

            <label>
              Abortus (A):
              <input type="number" name="abortus" min={0} id="anc_abortus" />
            </label>

            <label>
              HPHT:
              <input type="date" name="hpht" id="anc_hpht" />
            </label>

            <label>
              HPL:
              <input type="date" name="hpl" id="anc_hpl" />
            </label>

            <label>
              Keluhan utama:
              <textarea name="keluhan_utama" rows={2} id="anc_keluhan_utama" placeholder="Contoh: pusing, mual hebat, bengkak kaki, perdarahan, dsb." />
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Pemeriksaan Fisik</legend>

            <label>
              Tekanan darah (mmHg):
              <input type="text" name="td" placeholder="120/80" id="anc_td" />
            </label>

            <label>
              Nadi (x/menit):
              <input type="number" name="nadi" min={0} id="anc_nadi" />
            </label>

            <label>
              Suhu (°C):
              <input type="number" step="0.1" name="suhu" min={30} max={45} id="anc_suhu" />
            </label>

            <label>
              Berat badan (kg):
              <input type="number" step="0.1" name="bb" min={0} id="anc_bb" />
            </label>

            <label>
              Tinggi badan (cm):
              <input type="number" name="tb" min={0} id="anc_tb" />
            </label>

            <label>
              Edema:
              <select name="edema" id="anc_edema" defaultValue="">
                <option value="">Pilih</option>
                <option value="tidak">Tidak</option>
                <option value="ringan">Ringan</option>
                <option value="berat">Berat</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Pemeriksaan Janin</legend>

            <label>
              DJJ (x/menit):
              <input type="number" name="djj" min={0} id="anc_djj" />
            </label>

            <label>
              TFU (cm):
              <input type="number" step="0.1" name="tfu" min={0} id="anc_tfu" />
            </label>

            <label>
              Posisi janin:
              <select name="posisi_janin" id="anc_posisi" defaultValue="">
                <option value="">Pilih</option>
                <option value="kepala">Kepala di bawah (letak kepala)</option>
                <option value="sungsang">Sungsang</option>
                <option value="lintang">Lintang</option>
                <option value="belum_jelas">Belum jelas</option>
              </select>
            </label>

            <label>
              Gerak janin:
              <select name="gerak_janin" id="anc_gerak" defaultValue="">
                <option value="">Pilih</option>
                <option value="aktif">Aktif</option>
                <option value="berkurang">Berkurang</option>
                <option value="tidak_terasa">Tidak terasa</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Tablet Fe & Konseling Gizi</legend>

            <label>
              Jumlah tablet Fe diberikan:
              <input type="number" name="fe_diberikan" min={0} id="anc_fe_diberikan" placeholder="Contoh: 30" />
            </label>

            <label>
              Saran Gizi:
              <textarea
                name="saran_gizi"
                rows={2}
                id="anc_saran_gizi"
                placeholder="Contoh: Perbanyak makanan kaya zat besi, hindari kopi/teh setelah makan, dsb."
              />
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Pemeriksaan Penunjang Sederhana</legend>

            <div className="form-row">
              <div className="col">
                <label>
                  Hasil Hb (g/dL):
                  <input type="number" step="0.1" name="hb" id="anc_hb" placeholder="Contoh: 11.5" />
                </label>
              </div>
              <div className="col">
                <label>
                  Hasil Urin:
                  <input type="text" name="urin" id="anc_urin" placeholder="Contoh: Negatif/Proteinuria" />
                </label>
              </div>
            </div>

            <label>
              Keterangan Pemeriksaan Penunjang Lain:
              <textarea
                name="penunjang_lain"
                rows={2}
                id="anc_penunjang_lain"
                placeholder="Contoh: Pemeriksaan gula darah sewaktu (GDS) 120 mg/dL"
              />
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Skrining Risiko & Rujukan</legend>

            <label>
              Faktor risiko ditemukan:
              <textarea
                name="faktor_risiko"
                rows={2}
                id="anc_risiko"
                placeholder="Contoh: Usia <20 tahun, preeklamsia, riwayat SC, perdarahan, anemia, TB, DM, hipertensi, kehamilan ganda, dsb."
              />
            </label>

            <label>
              Klasifikasi risiko:
              <select name="klasifikasi_risiko" id="anc_klass" defaultValue="">
                <option value="">Pilih</option>
                <option value="rendah">Risiko rendah</option>
                <option value="tinggi">Risiko tinggi</option>
                <option value="gawat_darurat">Gawat darurat obstetri</option>
              </select>
            </label>

            <label>
              Perlu rujukan:
              <select name="perlu_rujukan" id="anc_perlu_rujukan" defaultValue="">
                <option value="">Pilih</option>
                <option value="tidak">Tidak</option>
                <option value="terencana">Ya, rujukan terencana</option>
                <option value="segera">Ya, rujukan segera</option>
              </select>
            </label>

            <label>
              Tujuan rujukan:
              <input type="text" name="tujuan_rujukan" id="anc_tujuan_rujukan" placeholder="Contoh: Puskesmas, RSUD, RS rujukan lain" />
            </label>

            <label>
              Alasan rujukan:
              <textarea
                name="alasan_rujukan"
                rows={2}
                id="anc_alasan_rujukan"
                placeholder="Contoh: preeklamsia berat, perdarahan, ketuban pecah dini, gawat janin, dsb."
              />
            </label>

            <label>
              Tatalaksana awal di Poskesdes:
              <textarea
                name="tatalaksana_awal"
                rows={2}
                id="anc_tatalaksana_awal"
                placeholder="Contoh: stabilisasi umum, pemberian MgSO4 sesuai program, infus, edukasi keluarga, dsb."
              />
            </label>
          </fieldset>

          <fieldset className="card anc-block">
            <legend>Kesimpulan Kunjungan</legend>

            <label>
              Ringkasan:
              <textarea
                name="ringkasan_kunjungan"
                rows={3}
                id="anc_ringkasan_kunjungan"
                placeholder="Ringkasan hasil pemeriksaan, rencana kontrol, dan edukasi yang diberikan."
              />
            </label>

            <label>
              Jadwal kontrol berikutnya:
              <input type="date" name="jadwal_kontrol_berikut" id="anc_jadwal_berikut" />
              <span className="danger-note" style={{ fontSize: "12px" }}>
                Catatan: Tanggal ini akan otomatis ditambahkan ke halaman Jadwal.
              </span>
            </label>
          </fieldset>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button type="button" className="small-btn" data-link="pemeriksaan">
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Rekam ANC
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

