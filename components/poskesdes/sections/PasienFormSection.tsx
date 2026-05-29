"use client"

import { useEffect, useState, useRef } from "react"
import { pasienApi, type Pasien } from "@/lib/api"

export function PasienFormSection() {
  const [pasien, setPasien] = useState<Pasien | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    no_kk: "",
    no_hp: "",
    no_kis: "",
    pendidikan: "",
    alamat: "",
    usia_kehamilan: "0",
  })

  const loadedPasienId = useRef<string | null>(null)

  useEffect(() => {
    const checkHash = async () => {
      const hash = window.location.hash.replace("#", "")
      if (!hash.startsWith("pasien-form")) return

      const params = new URLSearchParams(hash.split("?")[1] || "")
      const id = params.get("id")

      if (id && id !== "new") {
        if (loadedPasienId.current !== id) {
          loadedPasienId.current = id
          await loadPasien(id)
        }
      } else if (id === "new" || !id) {
        if (loadedPasienId.current !== null) {
          loadedPasienId.current = null
          setPasien(null)
          setFormData({
            nama: "",
            nik: "",
            no_kk: "",
            no_hp: "",
            no_kis: "",
            pendidikan: "",
            alamat: "",
            usia_kehamilan: "0",
          })
        }
      }
    }

    // Check hash on mount
    checkHash()

    // Listen for hash changes
    const handleHashChange = () => checkHash()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const loadPasien = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await pasienApi.getOne(id)
      if (data) {
        setPasien(data)
        setFormData({
          nama: data.nama,
          nik: data.nik || "",
          no_kk: data.no_kk || "",
          no_hp: data.no_hp,
          no_kis: data.no_kis || "",
          pendidikan: data.pendidikan || "",
          alamat: data.alamat || "",
          usia_kehamilan: String(data.usia_kehamilan || 0),
        })
      }
    } catch (error) {
      console.error("Error loading pasien:", error)
      window.alert("Gagal memuat data pasien.")
      goBack()
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    window.location.hash = "pasien"
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.nama || !formData.no_hp) {
      window.alert("Nama dan Nomor HP wajib diisi!")
      return
    }

    try {
      setIsSaving(true)

      if (pasien) {
        await pasienApi.update(pasien.id, {
          nama: formData.nama.trim(),
          nik: formData.nik.trim() || undefined,
          no_kk: formData.no_kk.trim() || undefined,
          no_hp: formData.no_hp.trim(),
          no_kis: formData.no_kis.trim() || undefined,
          pendidikan: formData.pendidikan || undefined,
          alamat: formData.alamat.trim() || undefined,
          usia_kehamilan: Number(formData.usia_kehamilan) || 0,
        })
        window.alert("Data pasien berhasil diperbarui.")
      } else {
        await pasienApi.create({
          id: `P-${Date.now().toString(36)}`,
          nama: formData.nama.trim(),
          nik: formData.nik.trim() || undefined,
          no_kk: formData.no_kk.trim() || undefined,
          no_hp: formData.no_hp.trim(),
          no_kis: formData.no_kis.trim() || undefined,
          pendidikan: formData.pendidikan || undefined,
          alamat: formData.alamat.trim() || undefined,
          usia_kehamilan: Number(formData.usia_kehamilan) || 0,
          tgl_daftar: new Date().toISOString().substring(0, 10),
        })
        window.alert("Pasien baru berhasil didaftarkan.")
      }
      goBack()
    } catch (error) {
      console.error("Error saving pasien:", error)
      window.alert(`Gagal ${pasien ? "memperbarui" : "menyimpan"} data pasien. Silakan coba lagi.`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section id="pasien-form" className="page" data-page>
        <div className="card">
          <div className="muted" style={{ padding: "40px", textAlign: "center" }}>
            Memuat data pasien...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pasien-form" className="page" data-page>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ margin: 0 }}>{pasien ? "✏️ Edit Data Pasien" : "➕ Tambah Pasien Baru"}</h2>
          <button type="button" className="small-btn" onClick={goBack} style={{ background: "#fee2e2", color: "#dc2626" }}>
            ← Kembali
          </button>
        </div>
        <p className="muted">
          {pasien
            ? `Mengedit data pasien: ${pasien.nomor_cm || "—"} — ${pasien.nama}`
            : "Isi form berikut untuk mendaftarkan pasien baru. Nomor CM akan otomatis di-generate."}
        </p>

        <div className="card" style={{ marginTop: "20px", background: "#f9ffff", border: "1px solid var(--teal-600)" }}>
          <form onSubmit={handleSubmit}>
            {pasien && (
              <div style={{ padding: "12px", background: "#e0f2f1", borderRadius: "8px", marginBottom: "16px" }}>
                <strong>Nomor CM:</strong> {pasien.nomor_cm || "—"}
              </div>
            )}

            <div className="form-row">
              <div className="col">
                <label>
                  Nama Lengkap Pasien <span style={{ color: "#dc2626" }}>*</span>:
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    placeholder="Contoh: Ibu Siti Aisyah"
                  />
                </label>
              </div>
              <div className="col">
                <label>
                  Nomor HP (WhatsApp) <span style={{ color: "#dc2626" }}>*</span>:
                  <input
                    type="text"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    required
                    placeholder="Contoh: 08123456789"
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="col">
                <label>
                  NIK Pasien:
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="Contoh: 17xxxxxxxxxxxxxx"
                  />
                </label>
              </div>
              <div className="col">
                <label>
                  No Kartu Keluarga (KK):
                  <input
                    type="text"
                    value={formData.no_kk}
                    onChange={(e) => setFormData({ ...formData, no_kk: e.target.value })}
                    placeholder="Contoh: 17xxxxxxxxxxxxxx"
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="col">
                <label>
                  Pendidikan Terakhir:
                  <select value={formData.pendidikan} onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}>
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
                  <input
                    type="text"
                    value={formData.no_kis}
                    onChange={(e) => setFormData({ ...formData, no_kis: e.target.value })}
                    placeholder="Opsional"
                  />
                </label>
              </div>
            </div>

            <label>
              Alamat Ringkas:
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Contoh: Dusun I, RT 01"
              />
            </label>

            <label>
              Usia Kehamilan (Minggu, isi &lsquo;0&rsquo; jika bukan ibu hamil):
              <input
                type="number"
                value={formData.usia_kehamilan}
                onChange={(e) => setFormData({ ...formData, usia_kehamilan: e.target.value })}
                min="0"
                required
              />
            </label>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button type="button" className="small-btn" onClick={goBack} disabled={isSaving}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Menyimpan..." : pasien ? "Simpan Perubahan" : "Daftarkan Pasien"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

