"use client"

import { useState, useEffect } from "react"
import { kbApi } from "@/lib/api"
import type { KbRecord } from "@/lib/api"

export default function AdminKbPage() {
  const [records, setRecords] = useState<KbRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<KbRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterMetode, setFilterMetode] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchQuery, filterStatus, filterMetode, startDate, endDate])

  const loadRecords = async () => {
    try {
      setIsLoading(true)
      const data = await kbApi.getAll()
      setRecords(data.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()))
    } catch (error) {
      console.error("Error loading KB records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...records]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.pasien_nama.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus) {
      filtered = filtered.filter((r) => r.status_peserta === filterStatus)
    }

    if (filterMetode) {
      filtered = filtered.filter((r) => r.metode_kb === filterMetode)
    }

    if (startDate) {
      filtered = filtered.filter((r) => r.tanggal >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((r) => r.tanggal <= endDate)
    }

    setFilteredRecords(filtered)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setFilterStatus("")
    setFilterMetode("")
    setStartDate("")
    setEndDate("")
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; color: string }> = {
      Baru: { bg: "#dbeafe", color: "#1d4ed8" },
      Lama: { bg: "#d1fae5", color: "#059669" },
      DropOut: { bg: "#fee2e2", color: "#dc2626" },
      Gagal: { bg: "#fef3c7", color: "#d97706" },
      Komplikasi: { bg: "#fce7f3", color: "#be185d" },
    }
    const s = statusMap[status] || { bg: "#e5e7eb", color: "#374151" }
    return (
      <span style={{ background: s.bg, color: s.color, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat data KB...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>💊 Rekam Pelayanan KB</h2>
          <p>Total {records.length} rekam pelayanan KB</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-refresh" onClick={loadRecords}>
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
              placeholder="Cari nama / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Lama">Lama</option>
              <option value="DropOut">DropOut</option>
              <option value="Gagal">Gagal</option>
              <option value="Komplikasi">Komplikasi</option>
            </select>
          </div>

          <div className="filter-item">
            <select
              value={filterMetode}
              onChange={(e) => setFilterMetode(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Metode</option>
              <option value="Pil">Pil</option>
              <option value="Suntik">Suntik</option>
              <option value="Implan">Implan</option>
              <option value="IUD">IUD</option>
              <option value="Kondom">Kondom</option>
              <option value="MOW">MOW</option>
              <option value="MOP">MOP</option>
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
          Menampilkan <strong>{filteredRecords.length}</strong> dari {records.length} data
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Pasien</th>
              <th>Status Peserta</th>
              <th>Metode KB</th>
              <th>Tgl Mulai</th>
              <th>Rencana Tindakan</th>
              <th>Keterangan</th>
              <th>Jadwal Kontrol</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-row">
                  {searchQuery || filterStatus || filterMetode ? "Tidak ada data yang cocok" : "Belum ada rekam KB"}
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.tanggal)}</td>
                  <td className="name-cell">{r.pasien_nama}</td>
                  <td>{getStatusBadge(r.status_peserta)}</td>
                  <td>
                    <span className="badge-metode">{r.metode_kb || "-"}</span>
                  </td>
                  <td>{formatDate(r.tgl_mulai)}</td>
                  <td>{r.rencana_tindakan || "-"}</td>
                  <td className="keterangan-cell">{r.keterangan || "-"}</td>
                  <td>{formatDate(r.jadwal_kontrol_kb)}</td>
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
          min-width: 900px;
        }

        .data-table th,
        .data-table td {
          padding: 14px 12px;
          text-align: left;
          font-size: 13px;
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

        .badge-metode {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #e0f2f1;
          color: #0d9695;
        }

        .keterangan-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

