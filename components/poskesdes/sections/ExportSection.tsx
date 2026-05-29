"use client"

import { useState, useEffect } from "react"

export function ExportSection() {
  const [selectedMonth, setSelectedMonth] = useState("")

  useEffect(() => {
    // Set default to current month
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    setSelectedMonth(`${year}-${month}`)
  }, [])

  useEffect(() => {
    // Update data-month attribute on all monthly export buttons
    document.querySelectorAll('[data-export-monthly]').forEach((button) => {
      button.setAttribute("data-month", selectedMonth)
    })
  }, [selectedMonth])

  const getMonthOptions = () => {
    const options = []
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
      ]
      const value = `${year}-${month}`
      const label = `${monthNames[date.getMonth()]} ${year}`
      options.push({ value, label })
    }

    return options
  }
  return (
    <section id="ekspor" className="page" data-page>
      <div className="card">
        <h2 style={{ margin: 0 }}>Ekspor Data Dasar & Laporan Bulanan</h2>
        <p className="muted" style={{ margin: "4px 0 10px" }}>
          Gunakan tombol di bawah untuk mengunduh data mentah pasien, jadwal, dan rekam medis. Pilih format CSV atau XLSX (Excel). Data diekspor secara detail dan lengkap.
        </p>
        
        <div style={{ marginBottom: "20px", padding: "12px", background: "#e0f2f1", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>📋 Data Pasien</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="btn" data-export="pendaftar" data-format="csv" type="button">
              📄 Unduh CSV Pendaftar
            </button>
            <button className="btn" data-export="pendaftar" data-format="xlsx" type="button">
              📊 Unduh XLSX Pendaftar
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "12px", background: "#e0f2f1", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>📅 Data Jadwal</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="btn" data-export="jadwal" data-format="csv" type="button">
              📄 Unduh CSV Jadwal
            </button>
            <button className="btn" data-export="jadwal" data-format="xlsx" type="button">
              📊 Unduh XLSX Jadwal
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "12px", background: "#e0f2f1", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>👩‍⚕️ Rekam Medis ANC</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="btn" data-export="anc" data-format="csv" type="button">
              📄 Unduh CSV Rekam ANC
            </button>
            <button className="btn" data-export="anc" data-format="xlsx" type="button">
              📊 Unduh XLSX Rekam ANC
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "12px", background: "#e0f2f1", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>💊 Rekam Medis KB</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="btn" data-export="kb" data-format="csv" type="button">
              📄 Unduh CSV Rekam KB
            </button>
            <button className="btn" data-export="kb" data-format="xlsx" type="button">
              📊 Unduh XLSX Rekam KB
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "12px", background: "#e0f2f1", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>👴 Rekam Medis Lansia</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="btn" data-export="lansia" data-format="csv" type="button">
              📄 Unduh CSV Rekam Lansia
            </button>
            <button className="btn" data-export="lansia" data-format="xlsx" type="button">
              📊 Unduh XLSX Rekam Lansia
            </button>
          </div>
        </div>

        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #0ea5a4" }}>
          <p className="muted" style={{ fontWeight: 700, marginBottom: "12px", fontSize: "16px" }}>
            📈 Laporan Bulanan (Ringkas - Statistik)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button className="btn-primary" data-export="summary" data-format="csv" type="button">
              📄 Unduh CSV Laporan Bulanan
            </button>
            <button className="btn-primary" data-export="summary" data-format="xlsx" type="button">
              📊 Unduh XLSX Laporan Bulanan
            </button>
          </div>
          <p className="muted" style={{ fontSize: "12px", marginTop: "8px" }}>
            Laporan ini berisi total K1, K-Lanjut, KB Baru, dan Komplikasi per bulan dalam format ringkas.
          </p>
        </div>

        <div style={{ marginTop: "24px", padding: "20px", background: "#fff7ed", borderRadius: "12px", border: "2px solid #f59e0b" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#92400e" }}>
            📚 Register Buku Manual Bidan (Laporan Bulanan Lengkap)
          </h3>
          <p className="muted" style={{ marginBottom: "16px", fontSize: "14px" }}>
            Ekspor laporan bulanan lengkap sesuai isian pemeriksaan sebagai pengganti register buku manual. Pilih kategori dan bulan yang diinginkan.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px" }}>
              Pilih Bulan:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "300px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "2px solid #0ea5a4",
                fontSize: "14px",
                background: "#fff",
              }}
            >
              {getMonthOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>👩‍⚕️ Ibu Hamil (ANC)</h4>
              <p className="muted" style={{ fontSize: "12px", marginBottom: "8px" }}>
                Register pemeriksaan ibu hamil lengkap
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button
                  className="btn"
                  data-export-monthly="anc"
                  data-format="csv"
                  data-month={selectedMonth}
                  type="button"
                  disabled={!selectedMonth}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  📄 CSV
                </button>
                <button
                  className="btn"
                  data-export-monthly="anc"
                  data-format="xlsx"
                  data-month={selectedMonth}
                  type="button"
                  disabled={!selectedMonth}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  📊 XLSX
                </button>
              </div>
            </div>

            <div style={{ padding: "12px", background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>💊 Keluarga Berencana (KB)</h4>
              <p className="muted" style={{ fontSize: "12px", marginBottom: "8px" }}>
                Register pelayanan KB lengkap
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button
                  className="btn"
                  data-export-monthly="kb"
                  data-format="csv"
                  data-month={selectedMonth}
                  type="button"
                  disabled={!selectedMonth}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  📄 CSV
                </button>
                <button
                  className="btn"
                  data-export-monthly="kb"
                  data-format="xlsx"
                  data-month={selectedMonth}
                  type="button"
                  disabled={!selectedMonth}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  📊 XLSX
                </button>
              </div>
            </div>



            <div style={{ padding: "12px", background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>👴 Lansia</h4>
              <p className="muted" style={{ fontSize: "12px", marginBottom: "8px" }}>
                Register pemeriksaan lansia lengkap
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button
                  className="btn"
                  data-export-monthly="lansia"
                  data-format="csv"
                  data-month={selectedMonth}
                  type="button"
                  disabled={!selectedMonth}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  📄 CSV
                </button>
                <button
                  className="btn"
                  data-export-monthly="lansia"
                  data-format="xlsx"
                  data-month={selectedMonth}
                  type="button"
                  disabled={!selectedMonth}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  📊 XLSX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

