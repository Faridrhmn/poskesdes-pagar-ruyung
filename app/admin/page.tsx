"use client"

import { useState, useEffect } from "react"
import { pasienApi, ancApi, kbApi, lansiaApi, jadwalApi } from "@/lib/api"
import type { Pasien, AncRecord, KbRecord, LansiaRecord, Jadwal } from "@/lib/api"

interface Stats {
  totalPasien: number
  totalAnc: number
  totalKb: number
  totalLansia: number
  totalJadwal: number
  jadwalHariIni: number
}

interface SystemInfo {
  version: string
  status: string
  lastActivity: string
  databaseSize: string
  serverTime: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPasien: 0,
    totalAnc: 0,
    totalKb: 0,
    totalLansia: 0,
    totalJadwal: 0,
    jadwalHariIni: 0,
  })
  const [recentPasien, setRecentPasien] = useState<Pasien[]>([])
  const [upcomingJadwal, setUpcomingJadwal] = useState<Jadwal[]>([])
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    version: "1.0.0",
    status: "online",
    lastActivity: "",
    databaseSize: "0 MB",
    serverTime: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [pasien, anc, kb, lansia, jadwal] = await Promise.all([
        pasienApi.getAll(),
        ancApi.getAll(),
        kbApi.getAll(),
        lansiaApi.getAll(),
        jadwalApi.getAll(),
      ])

      const today = new Date().toISOString().split("T")[0]
      const jadwalHariIni = jadwal.filter((j) => j.tanggal === today).length

      setStats({
        totalPasien: pasien.length,
        totalAnc: anc.length,
        totalKb: kb.length,
        totalLansia: lansia.length,
        totalJadwal: jadwal.length,
        jadwalHariIni,
      })

      // Get 5 most recent patients
      setRecentPasien(
        pasien
          .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
          .slice(0, 5)
      )

      // Get upcoming schedules
      setUpcomingJadwal(
        jadwal
          .filter((j) => new Date(j.tanggal) >= new Date(today))
          .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
          .slice(0, 5)
      )

      // Get system info - find last activity from all records
      const allRecords = [
        ...pasien.map((p) => ({ date: p.updated_at || p.created_at || "", type: "Pasien" })),
        ...anc.map((a) => ({ date: a.updated_at || a.created_at || "", type: "ANC" })),
        ...kb.map((k) => ({ date: k.updated_at || k.created_at || "", type: "KB" })),
        ...lansia.map((l) => ({ date: l.updated_at || l.created_at || "", type: "Lansia" })),
        ...jadwal.map((j) => ({ date: j.updated_at || j.created_at || "", type: "Jadwal" })),
      ]
        .filter((r) => r.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const lastActivity = allRecords.length > 0 ? allRecords[0].date : new Date().toISOString()

      setSystemInfo({
        version: "1.0.0",
        status: "online",
        lastActivity,
        databaseSize: "N/A",
        serverTime: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      })
    } catch (error) {
      console.error("Error loading dashboard:", error)
      setSystemInfo({
        version: "1.0.0",
        status: "error",
        lastActivity: "",
        databaseSize: "N/A",
        serverTime: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
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
        <p>Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Selamat Datang di Admin Dashboard</h2>
          <p>Ringkasan data Poskesdes Pagar Ruyung</p>
        </div>
        <div className="system-status-card">
          <div className="status-item">
            <span className="status-label">Status:</span>
            <span className={`status-badge ${systemInfo.status}`}>
              {systemInfo.status === "online" ? "🟢 Online" : "🔴 Error"}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Versi:</span>
            <span className="status-value">v{systemInfo.version}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card pasien">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalPasien}</span>
            <span className="stat-label">Total Pasien</span>
          </div>
        </div>

        <div className="stat-card anc">
          <div className="stat-icon">🤰</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAnc}</span>
            <span className="stat-label">Rekam ANC</span>
          </div>
        </div>

        <div className="stat-card kb">
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalKb}</span>
            <span className="stat-label">Rekam KB</span>
          </div>
        </div>

        <div className="stat-card lansia">
          <div className="stat-icon">👴</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalLansia}</span>
            <span className="stat-label">Rekam Lansia</span>
          </div>
        </div>

        <div className="stat-card jadwal">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalJadwal}</span>
            <span className="stat-label">Total Jadwal</span>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <span className="stat-value">{stats.jadwalHariIni}</span>
            <span className="stat-label">Jadwal Hari Ini</span>
          </div>
        </div>
      </div>

      <div className="system-info-section">
        <div className="system-card">
          <h3>📊 Informasi Sistem</h3>
          <div className="system-details">
            <div className="detail-row">
              <span className="detail-label">Versi Aplikasi:</span>
              <span className="detail-value">v{systemInfo.version}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-indicator ${systemInfo.status}`}>
                {systemInfo.status === "online" ? "🟢 Online" : "🔴 Error"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Waktu Server:</span>
              <span className="detail-value">{systemInfo.serverTime}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Aktivitas Terakhir:</span>
              <span className="detail-value">
                {systemInfo.lastActivity
                  ? formatDate(systemInfo.lastActivity.split("T")[0]) +
                    " " +
                    new Date(systemInfo.lastActivity).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Tidak ada aktivitas"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Ukuran Database:</span>
              <span className="detail-value">{systemInfo.databaseSize}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>👥 Pasien Terbaru</h3>
            <a href="/admin/pasien" className="view-all">Lihat Semua →</a>
          </div>
          <div className="card-content">
            {recentPasien.length === 0 ? (
              <p className="empty-state">Belum ada data pasien</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>No. CM</th>
                    <th>Nama</th>
                    <th>No. HP</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPasien.map((p) => (
                    <tr key={p.id || p.id_pasien}>
                      <td>{p.nomor_cm}</td>
                      <td>{p.nama}</td>
                      <td>{p.no_hp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>📅 Jadwal Mendatang</h3>
            <a href="/admin/jadwal" className="view-all">Lihat Semua →</a>
          </div>
          <div className="card-content">
            {upcomingJadwal.length === 0 ? (
              <p className="empty-state">Tidak ada jadwal mendatang</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama</th>
                    <th>Jenis</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingJadwal.map((j) => (
                    <tr key={j.id || j.id_pasien || j.id_anc || j.id_kb || j.id_lansia || j.id_jadwal || j.id_edukasi || j.id_admin}>
                      <td>{formatDate(j.tanggal)}</td>
                      <td>{j.nama}</td>
                      <td>
                        <span className={`badge ${j.jenis.toLowerCase().replace(/\s+/g, "-")}`}>
                          {j.jenis}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dashboard-header h2 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #1e293b;
        }

        .dashboard-header p {
          margin: 0;
          color: #64748b;
        }

        .system-status-card {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 12px 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.online {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.error {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-value {
          font-weight: 600;
          color: #1e293b;
        }

        .system-info-section {
          margin-bottom: 24px;
        }

        .system-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .system-card h3 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1e293b;
        }

        .system-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .detail-value {
          font-size: 15px;
          color: #1e293b;
          font-weight: 600;
        }

        .status-indicator {
          font-weight: 600;
          font-size: 14px;
        }

        .status-indicator.online {
          color: #059669;
        }

        .status-indicator.error {
          color: #dc2626;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 32px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-card.pasien .stat-icon { background: #dbeafe; }
        .stat-card.anc .stat-icon { background: #fce7f3; }
        .stat-card.kb .stat-icon { background: #d1fae5; }
        .stat-card.lansia .stat-icon { background: #fef3c7; }
        .stat-card.jadwal .stat-icon { background: #e0e7ff; }
        .stat-card.today .stat-icon { background: #fee2e2; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-header h3 {
          margin: 0;
          font-size: 16px;
          color: #1e293b;
        }

        .view-all {
          font-size: 13px;
          color: #0ea5a4;
          text-decoration: none;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        .card-content {
          padding: 16px 20px;
        }

        .mini-table {
          width: 100%;
          border-collapse: collapse;
        }

        .mini-table th,
        .mini-table td {
          padding: 10px 8px;
          text-align: left;
          font-size: 13px;
        }

        .mini-table th {
          color: #64748b;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
        }

        .mini-table td {
          color: #374151;
          border-bottom: 1px solid #f3f4f6;
        }

        .mini-table tr:last-child td {
          border-bottom: none;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          background: #e5e7eb;
          color: #374151;
        }

        .badge.anc-kontrol { background: #fce7f3; color: #be185d; }
        .badge.kb-kontrol { background: #d1fae5; color: #059669; }
        .badge.lansia-kontrol { background: #fef3c7; color: #d97706; }

        .empty-state {
          text-align: center;
          color: #94a3b8;
          padding: 24px;
          font-size: 14px;
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
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

