"use client"

import { useState, useEffect } from "react"
import { pasienApi } from "@/lib/api"
import type { Pasien } from "@/lib/api"

export default function AdminPasienPage() {
  const [pasien, setPasien] = useState<Pasien[]>([])
  const [filteredPasien, setFilteredPasien] = useState<Pasien[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Pasien>("nomor_cm")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadPasien()
  }, [])

  useEffect(() => {
    filterAndSortPasien()
  }, [pasien, searchQuery, sortField, sortOrder])

  const loadPasien = async () => {
    try {
      setIsLoading(true)
      const data = await pasienApi.getAll()
      setPasien(data)
    } catch (error) {
      console.error("Error loading pasien:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortPasien = () => {
    let filtered = [...pasien]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.nama.toLowerCase().includes(query) ||
          p.nomor_cm.toLowerCase().includes(query) ||
          p.no_hp.includes(query) ||
          (p.nik && p.nik.includes(query))
      )
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField] || ""
      const bVal = b[sortField] || ""
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

    setFilteredPasien(filtered)
  }

  const handleSort = (field: keyof Pasien) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat data pasien...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>👥 Data Pasien</h2>
          <p>Total {pasien.length} pasien terdaftar</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-refresh" onClick={loadPasien}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari nama, No. CM, NIK, atau No. HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="results-count">
          Menampilkan {filteredPasien.length} dari {pasien.length} data
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("nomor_cm")} className="sortable">
                No. CM {sortField === "nomor_cm" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("nama")} className="sortable">
                Nama {sortField === "nama" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>NIK</th>
              <th>No. HP</th>
              <th>Alamat</th>
              <th onClick={() => handleSort("tgl_daftar")} className="sortable">
                Tgl Daftar {sortField === "tgl_daftar" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>Usia Kehamilan</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasien.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  {searchQuery ? "Tidak ada data yang cocok" : "Belum ada data pasien"}
                </td>
              </tr>
            ) : (
              filteredPasien.map((p) => (
                <tr key={p.id}>
                  <td className="cm-cell">{p.nomor_cm}</td>
                  <td className="name-cell">{p.nama}</td>
                  <td>{p.nik || "-"}</td>
                  <td>{p.no_hp}</td>
                  <td className="address-cell">{p.alamat || "-"}</td>
                  <td>{formatDate(p.tgl_daftar)}</td>
                  <td>
                    {p.usia_kehamilan && p.usia_kehamilan > 0 ? (
                      <span className="badge pregnant">{p.usia_kehamilan} minggu</span>
                    ) : (
                      "-"
                    )}
                  </td>
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
          transition: background 0.2s;
        }

        .btn-refresh:hover {
          background: #0d9695;
        }

        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0 16px;
          flex: 1;
          max-width: 400px;
        }

        .search-box:focus-within {
          border-color: #0ea5a4;
        }

        .search-icon {
          margin-right: 10px;
        }

        .search-box input {
          flex: 1;
          border: none;
          padding: 12px 0;
          font-size: 14px;
          outline: none;
        }

        .results-count {
          font-size: 13px;
          color: #64748b;
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

        .data-table th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .data-table th.sortable:hover {
          background: #f1f5f9;
        }

        .data-table td {
          border-bottom: 1px solid #f1f5f9;
          color: #374151;
        }

        .data-table tr:hover td {
          background: #f8fafc;
        }

        .cm-cell {
          font-weight: 600;
          color: #0ea5a4 !important;
        }

        .name-cell {
          font-weight: 500;
        }

        .address-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.pregnant {
          background: #fce7f3;
          color: #be185d;
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
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: none;
          }
        }
      `}</style>
    </div>
  )
}

