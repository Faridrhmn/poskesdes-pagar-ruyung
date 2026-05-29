"use client"

import { useEffect, useState, useMemo } from "react"
import { pasienApi, type Pasien } from "@/lib/api"

const formatTanggal = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

export function PasienSection() {
  const [pasienList, setPasienList] = useState<Pasien[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadPasien()
  }, [])

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash === "pasien") {
        loadPasien()
      }
    }

    const handleHashChange = () => checkHash()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const loadPasien = async () => {
    try {
      setIsLoading(true)
      const data = await pasienApi.getAll()
      setPasienList(data.sort((a, b) => (a.nomor_cm || "").localeCompare(b.nomor_cm || "")))
    } catch (error) {
      console.error("Error loading pasien:", error)
      window.alert("Gagal memuat data pasien. Silakan refresh halaman.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPasien = useMemo(() => {
    if (!searchQuery.trim()) return pasienList

    const query = searchQuery.toLowerCase()
    return pasienList.filter((pasien) => {
      return (
        (pasien.nomor_cm || "").toLowerCase().includes(query) ||
        pasien.nama.toLowerCase().includes(query) ||
        (pasien.nik || "").toLowerCase().includes(query) ||
        (pasien.no_hp || "").toLowerCase().includes(query)
      )
    })
  }, [pasienList, searchQuery])


  const handleDelete = async (id: string, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus pasien "${nama}"?\n\nPeringatan: Data rekam medis terkait juga akan terpengaruh.`)) return

    try {
      await pasienApi.delete(id)
      window.alert("Pasien berhasil dihapus.")
      await loadPasien()
    } catch (error) {
      console.error("Error deleting pasien:", error)
      window.alert("Gagal menghapus pasien.")
    }
  }

  return (
    <section id="pasien" className="page" data-page>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ margin: 0 }}>Manajemen Pasien</h2>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              window.location.hash = "pasien-form?id=new"
            }}
          >
            ➕ Tambah Pasien Baru
          </button>
        </div>
        <p className="muted">
          Kelola data pasien terdaftar. Anda bisa menambah, mengedit, dan menghapus data pasien di sini. Nomor CM akan otomatis di-generate saat pendaftaran baru.
        </p>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: "16px", background: "#f8fafc" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>🔍 Cari Pasien:</label>
          <input
            type="text"
            placeholder="Cari berdasarkan Nomor CM, Nama, NIK, atau Nomor HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
          {searchQuery && (
            <div style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
              Menampilkan <strong>{filteredPasien.length}</strong> dari <strong>{pasienList.length}</strong> pasien
            </div>
          )}
        </div>

        {/* Pasien List */}
        <div>
          <h3 style={{ margin: "0 0 12px 0" }}>📋 Daftar Pasien</h3>
          {isLoading ? (
            <div className="muted" style={{ padding: "20px", textAlign: "center" }}>
              Memuat data pasien...
            </div>
          ) : filteredPasien.length === 0 ? (
            <div className="muted" style={{ padding: "20px", textAlign: "center" }}>
              {pasienList.length === 0 ? "Belum ada pasien yang terdaftar." : "Tidak ada pasien yang sesuai dengan pencarian."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredPasien.map((pasien) => (
                <div
                  key={pasien.id}
                  className="card agenda item"
                  style={{
                    borderLeft: "4px solid var(--teal-600)",
                    padding: "14px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, fontSize: "15px" }}>
                        {pasien.nomor_cm || "—"} — {pasien.nama}
                      </div>
                    </div>
                    <div className="muted" style={{ fontSize: "13px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {pasien.nik && <span>🆔 NIK: {pasien.nik}</span>}
                      {pasien.nik && pasien.no_hp && <span>•</span>}
                      {pasien.no_hp && <span>📞 HP: {pasien.no_hp}</span>}
                      {pasien.no_hp && pasien.alamat && <span>•</span>}
                      {pasien.alamat && <span>📍 {pasien.alamat}</span>}
                    </div>
                    <div className="muted" style={{ fontSize: "12px", display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                      <span>📅 Daftar: {formatTanggal(pasien.tgl_daftar)}</span>
                      {pasien.usia_kehamilan && Number(pasien.usia_kehamilan) > 0 && (
                        <>
                          <span>•</span>
                          <span>🤰 UK: {pasien.usia_kehamilan} minggu</span>
                        </>
                      )}
                      {pasien.pendidikan && (
                        <>
                          <span>•</span>
                          <span>🎓 {pasien.pendidikan}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "10px" }}>
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => {
                        window.location.hash = `pasien-form?id=${pasien.id}`
                      }}
                      style={{ background: "#e0f2f1", color: "var(--teal-600)", fontSize: "11px" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => handleDelete(pasien.id, pasien.nama)}
                      style={{ background: "#fee2e2", color: "#dc2626", fontSize: "11px" }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

