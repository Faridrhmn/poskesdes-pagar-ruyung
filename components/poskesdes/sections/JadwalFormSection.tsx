"use client"

import { useEffect, useState, useRef } from "react"
import { jadwalApi, pasienApi, type Jadwal, type Pasien } from "@/lib/api"

const formatTanggal = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

export function JadwalFormSection() {
  const [jadwal, setJadwal] = useState<Jadwal | null>(null)
  const [pasienList, setPasienList] = useState<Pasien[]>([])
  const [pasienSearchQuery, setPasienSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPasien, setIsLoadingPasien] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    pasien_id: "",
    nama: "",
    tanggal: "",
    jenis: "",
    cara: "Telepon/WA",
    isNonPasien: false,
  })

  const loadedJadwalId = useRef<string | null>(null)

  useEffect(() => {
    const init = async () => {
      await loadPasien()
      // Check hash after pasien loaded
      const hash = window.location.hash.replace("#", "")
      if (hash.startsWith("jadwal-form")) {
        const params = new URLSearchParams(hash.split("?")[1] || "")
        const id = params.get("id")
        if (id && id !== "new") {
          loadedJadwalId.current = id
          await loadJadwal(id)
        }
      }
    }
    init()
  }, [])

  useEffect(() => {
    const checkHash = async () => {
      const hash = window.location.hash.replace("#", "")
      if (!hash.startsWith("jadwal-form")) return
      
      const params = new URLSearchParams(hash.split("?")[1] || "")
      const id = params.get("id")

      if (id && id !== "new") {
        if (loadedJadwalId.current !== id) {
          loadedJadwalId.current = id
          await loadJadwal(id)
        }
      } else if (id === "new" || !id) {
        if (loadedJadwalId.current !== null) {
          loadedJadwalId.current = null
          setJadwal(null)
          setFormData({
            pasien_id: "",
            nama: "",
            tanggal: "",
            jenis: "",
            cara: "Telepon/WA",
            isNonPasien: false,
          })
          setPasienSearchQuery("")
        }
      }
    }

    const handleHashChange = () => checkHash()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  useEffect(() => {
    if (jadwal && pasienList.length > 0) {
      const currentPasienId = jadwal.pasien_id || ""
      const currentIsNonPasien = !currentPasienId
      if (formData.pasien_id !== currentPasienId || formData.isNonPasien !== currentIsNonPasien) {
        setFormData((prev) => ({
          ...prev,
          pasien_id: currentPasienId,
          isNonPasien: currentIsNonPasien,
        }))
      }
    }
  }, [jadwal, pasienList])

  const loadPasien = async () => {
    try {
      setIsLoadingPasien(true)
      const data = await pasienApi.getAll()
      setPasienList(data.sort((a, b) => (a.nomor_cm || "").localeCompare(b.nomor_cm || "")))
    } catch (error) {
      console.error("Error loading pasien:", error)
    } finally {
      setIsLoadingPasien(false)
    }
  }

  const loadJadwal = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await jadwalApi.getOne(id)
      if (data) {
        setJadwal(data)
        setFormData({
          pasien_id: data.pasien_id || "",
          nama: data.nama,
          tanggal: data.tanggal,
          jenis: data.jenis,
          cara: data.cara,
          isNonPasien: !data.pasien_id,
        })
        setPasienSearchQuery("")
      } else {
        window.alert("Jadwal tidak ditemukan.")
        goBack()
      }
    } catch (error) {
      console.error("Error loading jadwal:", error)
      window.alert("Gagal memuat data jadwal.")
      goBack()
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasienChange = (pasienId: string) => {
    if (pasienId === "non-pasien") {
      setFormData({ ...formData, pasien_id: "", isNonPasien: true, nama: "" })
      setPasienSearchQuery("")
    } else if (pasienId && pasienId !== "") {
      const selectedPasien = pasienList.find((p) => (p.id || p.id_pasien) === pasienId)
      if (selectedPasien) {
        setFormData({
          ...formData,
          pasien_id: pasienId,
          nama: selectedPasien.nama,
          isNonPasien: false,
        })
        setPasienSearchQuery("")
      }
    } else {
      setFormData({ ...formData, pasien_id: "", nama: "", isNonPasien: false })
      setPasienSearchQuery("")
    }
  }

  const goBack = () => {
    loadedJadwalId.current = null
    window.location.hash = "jadwal"
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((!formData.isNonPasien && !formData.pasien_id) || !formData.nama || !formData.tanggal || !formData.jenis || !formData.cara) {
      window.alert("Semua kolom harus diisi!")
      return
    }

    try {
      setIsSaving(true)

      const jadwalData = {
        nama: formData.nama.trim(),
        tanggal: formData.tanggal,
        jenis: formData.jenis,
        cara: formData.cara,
        pasien_id: formData.isNonPasien ? undefined : formData.pasien_id || undefined,
      }

      if (jadwal) {
        await jadwalApi.update(jadwal.id, jadwalData)
        window.alert("Jadwal berhasil diperbarui.")
      } else {
        await jadwalApi.create({
          id: `J-${Date.now().toString(36)}`,
          ...jadwalData,
        })
        window.alert("Jadwal baru tersimpan.")
      }
      goBack()
    } catch (error) {
      console.error("Error saving jadwal:", error)
      window.alert(`Gagal ${jadwal ? "memperbarui" : "menyimpan"} jadwal. Silakan coba lagi.`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section id="jadwal-form" className="page" data-page>
        <div className="card">
          <div className="muted" style={{ padding: "40px", textAlign: "center" }}>
            Memuat data jadwal...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="jadwal-form" className="page" data-page>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ margin: 0 }}>{jadwal ? "✏️ Edit Jadwal" : "➕ Tambah Jadwal Baru"}</h2>
          <button type="button" className="small-btn" onClick={goBack} style={{ background: "#fee2e2", color: "#dc2626" }}>
            ← Kembali
          </button>
        </div>
        <p className="muted">
          {jadwal
            ? `Mengedit jadwal: ${jadwal.nama} — ${formatTanggal(jadwal.tanggal)}`
            : "Isi form berikut untuk menambahkan jadwal baru."}
        </p>

        <div className="card" style={{ marginTop: "20px", background: "#f9ffff", border: "1px solid var(--teal-600)" }}>
          <form onSubmit={handleSubmit}>
            <label>
              Pilih Pasien atau Kegiatan <span style={{ color: "#dc2626" }}>*</span>:
              <input
                type="text"
                placeholder="🔍 Cari pasien berdasarkan nomor CM atau nama..."
                value={pasienSearchQuery}
                onChange={(e) => setPasienSearchQuery(e.target.value)}
                disabled={isLoadingPasien || formData.isNonPasien}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  marginBottom: "10px",
                  border: "2px solid #0ea5a4",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  background: formData.isNonPasien ? "#f3f4f6" : "#fff",
                  cursor: formData.isNonPasien ? "not-allowed" : "text",
                }}
              />
              {isLoadingPasien && <div className="muted" style={{ fontSize: "12px", marginBottom: "10px" }}>Memuat daftar pasien...</div>}
              <select
                value={formData.isNonPasien ? "non-pasien" : formData.pasien_id}
                onChange={(e) => handlePasienChange(e.target.value)}
                required
                disabled={isLoadingPasien}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", fontSize: "14px", marginBottom: "10px" }}
              >
                <option value="">-- Pilih Pasien atau Kegiatan --</option>
                <option value="non-pasien">📋 Kegiatan Non-Pasien (Kegiatan Poskesdes/Lainnya)</option>
                {pasienList
                  .filter((pasien) => {
                    if (!pasienSearchQuery.trim() || formData.isNonPasien) return true
                    const query = pasienSearchQuery.toLowerCase()
                    return (
                      (pasien.nomor_cm || "").toLowerCase().includes(query) ||
                      pasien.nama.toLowerCase().includes(query) ||
                      (pasien.nik || "").toLowerCase().includes(query)
                    )
                  })
                  .map((pasien) => (
                    <option key={(pasien.id || pasien.id_pasien)} value={(pasien.id || pasien.id_pasien)}>
                      {pasien.nomor_cm || "—"} — {pasien.nama}
                    </option>
                  ))}
              </select>
              {pasienSearchQuery && !formData.isNonPasien && (
                <div className="muted" style={{ fontSize: "12px", marginTop: "-8px", marginBottom: "10px" }}>
                  Menampilkan{" "}
                  {
                    pasienList.filter((pasien) => {
                      const query = pasienSearchQuery.toLowerCase()
                      return (
                        (pasien.nomor_cm || "").toLowerCase().includes(query) ||
                        pasien.nama.toLowerCase().includes(query) ||
                        (pasien.nik || "").toLowerCase().includes(query)
                      )
                    }).length
                  }{" "}
                  hasil
                </div>
              )}
            </label>
            
            <div className="form-row" style={{ marginTop: "10px" }}>
              <div className="col">
                <label>
                  Tanggal Jadwal <span style={{ color: "#dc2626" }}>*</span>:
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                  />
                </label>
              </div>
            </div>

            <label>
              Nama Pasien/Kegiatan <span style={{ color: "#dc2626" }}>*</span>:
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
                disabled={!formData.isNonPasien && formData.pasien_id !== ""}
                placeholder={formData.isNonPasien ? "Contoh: Kegiatan Poskesdes / Rapat" : "Nama akan otomatis terisi"}
                style={{
                  background: !formData.isNonPasien && formData.pasien_id !== "" ? "#f3f4f6" : "#fff",
                  cursor: !formData.isNonPasien && formData.pasien_id !== "" ? "not-allowed" : "text",
                }}
              />
              {!formData.isNonPasien && formData.pasien_id && (
                <div className="muted" style={{ fontSize: "12px", marginTop: "4px" }}>
                  Nama otomatis diisi dari data pasien yang dipilih
                </div>
              )}
              {formData.isNonPasien && (
                <div className="muted" style={{ fontSize: "12px", marginTop: "4px" }}>
                  Masukkan nama kegiatan (contoh: Posyandu, Rapat, dll)
                </div>
              )}
            </label>

            <div className="form-row" style={{ marginTop: "10px" }}>
              <div className="col">
                <label>
                  Jenis Kegiatan <span style={{ color: "#dc2626" }}>*</span>:
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    required
                  >
                    <option value="">-- Pilih Jenis --</option>
                    <option value="ANC Kontrol">ANC Kontrol</option>
                    <option value="KB Kontrol">KB Kontrol</option>
                    <option value="Lansia Kontrol">Lansia Kontrol</option>

                    <option value="Lainnya">Lainnya</option>
                  </select>
                </label>
              </div>
              <div className="col">
                <label>
                  Cara Kontak/Pengingat <span style={{ color: "#dc2626" }}>*</span>:
                  <select
                    value={formData.cara}
                    onChange={(e) => setFormData({ ...formData, cara: e.target.value })}
                    required
                  >
                    <option value="Telepon/WA">Telepon/WA</option>
                    <option value="Kunjungan">Kunjungan Bidan</option>
                    <option value="Poskesdes">Datang ke Poskesdes</option>
                  </select>
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button type="button" className="small-btn" onClick={goBack} disabled={isSaving}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Menyimpan..." : jadwal ? "Simpan Perubahan" : "Simpan Jadwal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

