"use client"

import { useState, useEffect } from "react"
import { jadwalApi } from "@/lib/api"
import type { Jadwal } from "@/lib/api"

export default function AdminJadwalPage() {
  const [jadwal, setJadwal] = useState<Jadwal[]>([])
  const [filteredJadwal, setFilteredJadwal] = useState<Jadwal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterJenis, setFilterJenis] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    loadJadwal()
  }, [])

  useEffect(() => {
    filterJadwalData()
  }, [jadwal, searchQuery, filterJenis, filterStatus, startDate, endDate])

  const loadJadwal = async () => {
    try {
      setIsLoading(true)
      const data = await jadwalApi.getAll()
      setJadwal(data.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()))
    } catch (error) {
      console.error("Error loading jadwal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterJadwalData = () => {
    let filtered = [...jadwal]
    const today = new Date().toISOString().split("T")[0]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((j) => j.nama.toLowerCase().includes(query))
    }

    if (filterJenis) {
      filtered = filtered.filter((j) => j.jenis === filterJenis)
    }

    if (filterStatus === "upcoming") {
      filtered = filtered.filter((j) => j.tanggal >= today)
    } else if (filterStatus === "past") {
      filtered = filtered.filter((j) => j.tanggal < today)
    } else if (filterStatus === "today") {
      filtered = filtered.filter((j) => j.tanggal === today)
    }

    if (startDate) {
      filtered = filtered.filter((j) => j.tanggal >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((j) => j.tanggal <= endDate)
    }

    setFilteredJadwal(filtered)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setFilterJenis("")
    setFilterStatus("")
    setStartDate("")
    setEndDate("")
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusBadge = (tanggal: string) => {
    const today = new Date().toISOString().split("T")[0]
    if (tanggal === today) {
      return <span className="badge today">Hari Ini</span>
    } else if (tanggal > today) {
      return <span className="badge upcoming">Mendatang</span>
    }
    return <span className="badge past">Lewat</span>
  }

  const getJenisBadge = (jenis: string) => {
    const jenisMap: Record<string, { bg: string; color: string }> = {
      "ANC Kontrol": { bg: "#fce7f3", color: "#be185d" },
      "KB Kontrol": { bg: "#d1fae5", color: "#059669" },
      "Lansia Kontrol": { bg: "#fef3c7", color: "#d97706" },
      Lainnya: { bg: "#e5e7eb", color: "#374151" },
    }
    const j = jenisMap[jenis] || jenisMap.Lainnya
    return (
      <span style={{ background: j.bg, color: j.color, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
        {jenis}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat data jadwal...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>📅 Data Jadwal</h2>
          <p>Total {jadwal.length} jadwal</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-refresh" onClick={loadJadwal}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-item search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari nama/kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Jenis</option>
              <option value="ANC Kontrol">ANC Kontrol</option>
              <option value="KB Kontrol">KB Kontrol</option>
              <option value="Lansia Kontrol">Lansia Kontrol</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="filter-item">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Status</option>
              <option value="today">Hari Ini</option>
              <option value="upcoming">Mendatang</option>
              <option value="past">Sudah Lewat</option>
            </select>
          </div>

          <div className="filter-item date-group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
              placeholder="Dari Tanggal"
              title="Dari Tanggal"
            />
            <span className="date-separator">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
              placeholder="Sampai Tanggal"
              title="Sampai Tanggal"
            />
          </div>

          <button onClick={resetFilters} className="btn-reset" title="Reset Filter">
            ✕
          </button>
        </div>

        <div className="results-count">
          Menampilkan <strong>{filteredJadwal.length}</strong> dari {jadwal.length} data
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Nama/Kegiatan</th>
              <th>Jenis</th>
              <th>Cara Kontak</th>
              <th>Dibuat</th>
            </tr>
          </thead>
          <tbody>
            {filteredJadwal.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">
                  {searchQuery || filterJenis || filterStatus ? "Tidak ada data yang cocok" : "Belum ada jadwal"}
                </td>
              </tr>
            ) : (
              filteredJadwal.map((j) => (
                <tr key={j.id}>
                  <td>{getStatusBadge(j.tanggal)}</td>
                  <td>{formatDate(j.tanggal)}</td>
                  <td className="name-cell">{j.nama}</td>
                  <td>{getJenisBadge(j.jenis)}</td>
                  <td>{j.cara}</td>
                  <td>{j.created_at ? new Date(j.created_at).toLocaleDateString("id-ID") : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .page-title h2 {
          margin: 0 0 4px;
          font-size: 24px;
          color: #1e293b;
        }

        .page-title p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .page-actions {
          display: flex;
          gap: 12px;
        }

        .btn-refresh {
          padding: 10px 20px;
          background: #0ea5a4;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-refresh:hover {
          background: #0d9695;
        }

        .filters-section {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .filters-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .filter-item {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          transition: border-color 0.2s;
        }

        .filter-item:focus-within {
          border-color: #0ea5a4;
          background: white;
        }

        .filter-item.search {
          flex: 2;
          min-width: 250px;
        }

        .filter-item input {
          border: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
          outline: none;
        }

        .filter-select {
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          min-width: 120px;
        }

        .filter-item.date-group {
          padding: 6px 12px;
          gap: 8px;
        }

        .date-input {
          border: none;
          background: transparent;
          font-size: 13px;
          outline: none;
          color: #334155;
        }

        .date-separator {
          color: #94a3b8;
        }

        .btn-reset {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-reset:hover {
          background: #e2e8f0;
          color: #ef4444;
        }

        .results-count {
          font-size: 13px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
        }

        .search-icon {
          margin-right: 8px;
          color: #94a3b8;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .data-table th,
        .data-table td {
          padding: 14px 16px;
          text-align: left;
          font-size: 14px;
        }

        .data-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
        }

        .data-table td {
          border-bottom: 1px solid #f1f5f9;
          color: #374151;
        }

        .data-table tr:hover td {
          background: #f8fafc;
        }

        .name-cell {
          font-weight: 500;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.today {
          background: #fee2e2;
          color: #dc2626;
        }

        .badge.upcoming {
          background: #d1fae5;
          color: #059669;
        }

        .badge.past {
          background: #e5e7eb;
          color: #6b7280;
        }

        .empty-row {
          text-align: center;
          color: #94a3b8;
          padding: 48px !important;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #0ea5a4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .filters-grid {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-item.search,
          .filter-item,
          .filter-select {
            width: 100%;
          }
          
          .filter-item.date-group {
             justify-content: space-between;
          }
        }
      `}</style>
    </div>
  )
}

