"use client"

import { useEffect, useState, useMemo } from "react"
import { jadwalApi, pasienApi, type Jadwal, type Pasien } from "@/lib/api"

const formatTanggal = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

const hitungStatus = (tanggalStr: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(tanggalStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return "lewat"
  if (diff === 0) return "hari-ini"
  if (diff === 1) return "besok"
  if (diff <= 7) return "minggu-ini"
  return "lain"
}

export function JadwalSection() {
  const [schedules, setSchedules] = useState<Jadwal[]>([])
  const [pasienList, setPasienList] = useState<Pasien[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterJenis, setFilterJenis] = useState("")
  const [filterCara, setFilterCara] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadPasien()
    loadSchedules()
  }, [])

  const loadPasien = async () => {
    try {
      const data = await pasienApi.getAll()
      setPasienList(data)
    } catch (error) {
      console.error("Error loading pasien:", error)
    }
  }

  const loadSchedules = async () => {
    try {
      setIsLoading(true)
      const data = await jadwalApi.getAll()
      setSchedules(data.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()))
    } catch (error) {
      console.error("Error loading schedules:", error)
      window.alert("Gagal memuat jadwal. Silakan refresh halaman.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          schedule.nama.toLowerCase().includes(query) ||
          schedule.jenis.toLowerCase().includes(query) ||
          schedule.cara.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Jenis filter
      if (filterJenis && schedule.jenis !== filterJenis) return false

      // Cara filter
      if (filterCara && schedule.cara !== filterCara) return false

      // Status filter
      if (filterStatus) {
        const status = hitungStatus(schedule.tanggal)
        if (filterStatus === "aktif" && status === "lewat") return false
        if (filterStatus === "lewat" && status !== "lewat") return false
        if (filterStatus === "mendatang" && status === "lewat") return false
        if (filterStatus === "hari-ini" && status !== "hari-ini") return false
        if (filterStatus === "besok" && status !== "besok") return false
      }

      // Date range filter
      if (startDate && schedule.tanggal < startDate) return false
      if (endDate && schedule.tanggal > endDate) return false

      return true
    })
  }, [schedules, searchQuery, filterJenis, filterCara, filterStatus, startDate, endDate])


  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return
    try {
      await jadwalApi.delete(id)
      await loadSchedules()
      window.alert("Jadwal berhasil dihapus.")
    } catch (error) {
      console.error("Error deleting jadwal:", error)
      window.alert("Gagal menghapus jadwal.")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterJenis("")
    setFilterCara("")
    setFilterStatus("")
    setStartDate("")
    setEndDate("")
  }

  const getStatusBadge = (tanggal: string) => {
    const status = hitungStatus(tanggal)
    const badges = {
      lewat: { text: "Lewat", class: "badge-danger", border: "var(--danger)" },
      "hari-ini": { text: "Hari ini", class: "badge-success", border: "var(--success)" },
      besok: { text: "Besok (WA PENGINGAT)", class: "badge-warning", border: "var(--warning)" },
      "minggu-ini": { text: "Minggu Ini", class: "badge-muted", border: "#ccc" },
      lain: { text: "Mendatang", class: "badge-muted", border: "#ccc" },
    }
    return badges[status] || badges.lain
  }

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return ""
    let cleaned = phone.replace(/\D/g, "")
    
    if (cleaned.startsWith("62")) {
      return cleaned
    } else if (cleaned.startsWith("0")) {
      return `62${cleaned.substring(1)}`
    } else {
      return `62${cleaned}`
    }
  }

  const getPasienByJadwal = (schedule: Jadwal): Pasien | null => {
    if (!schedule.pasien_id) return null
    return pasienList.find((p) => p.id === schedule.pasien_id) || null
  }

  const getWaLink = (schedule: Jadwal) => {
    const pasien = getPasienByJadwal(schedule)
    let phone = "62812xxxxxx"
    let namaPasien = schedule.nama
    
    if (pasien?.no_hp) {
      phone = formatPhoneNumber(pasien.no_hp)
      namaPasien = pasien.nama
    }
    
    const pesan = encodeURIComponent(
      `*PEMBERITAHUAN JADWAL POSKESDES PAGAR RUYUNG*\n\nKepada Yth. Sdr/Ibu *${namaPasien}* Anda memiliki jadwal *${schedule.jenis}* pada:\n*Tanggal: ${formatTanggal(
        schedule.tanggal,
      )}*\n*Waktu: 09.00 - 14.00 WIB*\n\nDiharapkan datang tepat waktu sesuai jadwal. Cara pengingat: ${schedule.cara}\n\nTerima kasih.\n_Bidan Poskesdes Pagar Ruyung_`,
    )
    return `https://wa.me/${phone}?text=${pesan}`
  }

  const uniqueJenis = Array.from(new Set(schedules.map((s) => s.jenis))).sort()
  const uniqueCara = Array.from(new Set(schedules.map((s) => s.cara))).sort()

  return (
    <section id="jadwal" className="page" data-page>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h2 style={{ margin: 0 }}>Manajemen Jadwal & Pengingat Kontrol</h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="small-btn"
              onClick={loadSchedules}
              disabled={isLoading}
              style={{
                background: "#e0f2f1",
                color: "var(--teal-600)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              title="Refresh data jadwal"
            >
              <span style={{ fontSize: "16px" }}>{isLoading ? "⏳" : "🔄"}</span>
              {isLoading ? "Memuat..." : "Refresh"}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                window.location.hash = "jadwal-form?id=new"
              }}
            >
              ➕ Tambah Jadwal Baru
            </button>
          </div>
        </div>
        <p className="muted" style={{ marginBottom: "24px" }}>
          Lihat semua jadwal kunjungan pasien (ANC/KB/Lansia) dan agenda Poskesdes. <strong>Alarm WA Otomatis (Pre-Kirim)</strong> ditandai
          dengan garis tepi dan badge oranye (Besok).
        </p>

        {/* Search and Filters */}
        <div style={{ marginBottom: "24px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>🔍 Pencarian & Filter</h3>
            <button
              type="button"
              className="small-btn"
              onClick={() => setShowFilters(!showFilters)}
              style={{ background: showFilters ? "var(--teal-600)" : "#e0f2f1", color: showFilters ? "#fff" : "var(--teal-600)" }}
            >
              {showFilters ? "▲ Sembunyikan Filter" : "▼ Tampilkan Filter"}
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="🔍 Cari berdasarkan nama, jenis, atau cara kontak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box",
                background: "#fff",
              }}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginTop: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500" }}>
                  Jenis Kegiatan:
                </label>
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">Semua Jenis</option>
                  {uniqueJenis.map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500" }}>
                  Cara Kontak:
                </label>
                <select
                  value={filterCara}
                  onChange={(e) => setFilterCara(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">Semua Cara</option>
                  {uniqueCara.map((cara) => (
                    <option key={cara} value={cara}>
                      {cara}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500" }}>
                  Status:
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">Semua Status</option>
                  <option value="aktif">Aktif (Tidak Lewat)</option>
                  <option value="hari-ini">Hari Ini</option>
                  <option value="besok">Besok</option>
                  <option value="mendatang">Mendatang</option>
                  <option value="lewat">Lewat</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500" }}>
                  Tanggal Mulai:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500" }}>
                  Tanggal Akhir:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="small-btn"
                  onClick={clearFilters}
                  style={{ width: "100%", background: "#fee2e2", color: "#dc2626" }}
                >
                  🗑️ Hapus Filter
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "#e0f2f1", borderRadius: "8px", fontSize: "14px" }}>
            Menampilkan <strong>{filteredSchedules.length}</strong> dari <strong>{schedules.length}</strong> jadwal
          </div>
        </div>

        {/* Schedule List */}
        <div>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px" }}>📅 Daftar Jadwal</h3>
          {isLoading ? (
            <div className="muted" style={{ padding: "20px", textAlign: "center" }}>
              Memuat jadwal...
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="muted" style={{ padding: "20px", textAlign: "center" }}>
              {schedules.length === 0 ? "Belum ada jadwal yang terdaftar." : "Tidak ada jadwal yang sesuai dengan filter."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredSchedules.map((schedule) => {
                const badge = getStatusBadge(schedule.tanggal)
                const waLink = getWaLink(schedule)
                const isUrgent = badge.class === "badge-warning" || badge.class === "badge-success"

                return (
                  <div
                    key={schedule.id}
                    style={{
                      borderLeft: `4px solid ${badge.border}`,
                      background: isUrgent ? "#fffbf0" : "#fff",
                      padding: "18px 20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ flexGrow: 1, marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 700, fontSize: "16px", lineHeight: 1.4 }}>{schedule.nama}</div>
                        <span className={`badge ${badge.class}`} style={{ fontSize: "12px", padding: "4px 10px" }}>
                          {badge.text}
                        </span>
                      </div>
                      <div className="muted" style={{ fontSize: "14px", display: "flex", flexWrap: "wrap", gap: "12px", lineHeight: 1.6 }}>
                        <span>📅 {formatTanggal(schedule.tanggal)}</span>
                        <span>•</span>
                        <span>🏷️ {schedule.jenis}</span>
                        <span>•</span>
                        <span>📞 {schedule.cara}</span>
                        {schedule.pasien_id && getPasienByJadwal(schedule) && (
                          <>
                            <span>•</span>
                            <span>👤 {getPasienByJadwal(schedule)?.nomor_cm || ""}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "auto" }}>
                      {isUrgent ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small-btn"
                          style={{
                            background: "var(--success)",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 600,
                            textDecoration: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                          }}
                        >
                          {badge.class === "badge-warning" ? "📱 KIRIM WA PENGINGAT" : "📱 KIRIM WA SEKARANG"}
                        </a>
                      ) : (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#e0f2f1",
                            color: "var(--teal-600)",
                            fontSize: "13px",
                            fontWeight: 600,
                            textDecoration: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid var(--teal-600)",
                          }}
                        >
                          📱 Kirim WA
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = `jadwal-form?id=${schedule.id}`
                        }}
                        style={{ background: "#e0f2f1", color: "var(--teal-600)", fontSize: "13px", fontWeight: 600, padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--teal-600)", cursor: "pointer" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(schedule.id)}
                        style={{ background: "#fee2e2", color: "#dc2626", fontSize: "13px", fontWeight: 600, padding: "8px 16px", borderRadius: "6px", border: "1px solid #dc2626", cursor: "pointer" }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
