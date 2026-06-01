"use client"

import { useState, useEffect } from "react"
import { educationApi } from "@/lib/api"
import type { EducationMaterial } from "@/lib/api"

export default function AdminEdukasiPage() {
  const [materials, setMaterials] = useState<EducationMaterial[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<EducationMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    loadMaterials()
  }, [])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchQuery])

  const loadMaterials = async () => {
    try {
      setIsLoading(true)
      const data = await educationApi.getAll()
      setMaterials(data)
    } catch (error) {
      console.error("Error loading education materials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMaterials = () => {
    let filtered = [...materials]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.body.toLowerCase().includes(query)
      )
    }

    setFilteredMaterials(filtered)
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
        <p>Memuat materi edukasi...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>📚 Materi Edukasi</h2>
          <p>Total {materials.length} materi edukasi</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-refresh" onClick={loadMaterials}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari judul atau isi materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="results-count">
          Menampilkan {filteredMaterials.length} dari {materials.length} materi
        </div>
      </div>

      <div className="materials-list">
        {filteredMaterials.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? "Tidak ada materi yang cocok" : "Belum ada materi edukasi"}
          </div>
        ) : (
          filteredMaterials.map((m) => (
            <div key={m.id || m.id_pasien || m.id_anc || m.id_kb || m.id_lansia || m.id_jadwal || m.id_edukasi || m.id_admin} className="material-card">
              <div
                className="material-header"
                onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
              >
                <div className="material-info">
                  <h3>{m.title}</h3>
                  <span className="material-date">Dibuat: {formatDate(m.created_at)}</span>
                </div>
                <button type="button" className="expand-btn">
                  {expandedId === m.id ? "▲" : "▼"}
                </button>
              </div>
              {expandedId === m.id && (
                <div className="material-body">
                  <div dangerouslySetInnerHTML={{ __html: m.body.replace(/\n/g, "<br>") }} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1200px;
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

        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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

        .materials-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .material-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .material-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .material-header:hover {
          background: #f8fafc;
        }

        .material-info h3 {
          margin: 0 0 4px;
          font-size: 16px;
          color: #1e293b;
        }

        .material-date {
          font-size: 13px;
          color: #64748b;
        }

        .expand-btn {
          background: none;
          border: none;
          font-size: 14px;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
        }

        .material-body {
          padding: 0 20px 20px;
          border-top: 1px solid #f1f5f9;
          color: #374151;
          font-size: 14px;
          line-height: 1.6;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          background: white;
          border-radius: 12px;
          color: #94a3b8;
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

