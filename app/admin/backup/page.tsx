"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken, getAdminInfo } from "@/lib/auth"

interface BackupFile {
  filename: string
  size: number
  created: string
}

const API_BASE_URL = "https://api.vadr.my.id/bidan"

export default function AdminBackupPage() {
  const router = useRouter()
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const adminInfo = getAdminInfo()
    if (!adminInfo || adminInfo.role !== "superadmin") {
      router.push("/admin")
      return
    }
    loadBackups()
  }, [router])

  const loadBackups = async () => {
    try {
      setIsLoading(true)
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/backup.php/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBackups(data)
      }
    } catch (error) {
      console.error("Error loading backups:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    setError("")
    setSuccess("")

    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/backup.php/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.ok) {
        setSuccess(`Backup berhasil dibuat: ${data.filename}`)
        loadBackups()
      } else {
        setError(data.message || "Gagal membuat backup")
      }
    } catch {
      setError("Terjadi kesalahan saat membuat backup")
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleDownloadBackup = async (filename: string) => {
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/backup.php/download/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess(`Backup ${filename} berhasil diunduh`)
      } else {
        setError("Gagal mengunduh backup")
      }
    } catch {
      setError("Terjadi kesalahan saat mengunduh backup")
    }
  }

  const handleDownloadConfig = async () => {
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/backup.php/download-config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const contentDisposition = response.headers.get("Content-Disposition")
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
        const filename = filenameMatch ? filenameMatch[1] : `config_${Date.now()}.json`
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess("Config berhasil diekspor")
      } else {
        setError("Gagal mengekspor config")
      }
    } catch {
      setError("Terjadi kesalahan saat mengekspor config")
    }
  }

  const handleDeleteBackup = async (filename: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus backup "${filename}"?`)) {
      return
    }

    setError("")
    setSuccess("")

    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/backup.php/delete/${filename}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.ok) {
        setSuccess("Backup berhasil dihapus")
        loadBackups()
      } else {
        setError(data.message || "Gagal menghapus backup")
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus backup")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat data backup...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>💾 System Backup & Restore</h2>
          <p>Kelola backup database dan ekspor konfigurasi sistem</p>
        </div>
      </div>

      {error && (
        <div className="alert error">
          <span>⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="alert success">
          <span>✅</span> {success}
        </div>
      )}

      <div className="backup-actions">
        <div className="action-card">
          <div className="action-icon">🗄️</div>
          <div className="action-content">
            <h3>Database Backup</h3>
            <p>Buat backup lengkap database dalam format SQL</p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
            >
              {isCreatingBackup ? "⏳ Membuat Backup..." : "📥 Buat Database Backup"}
            </button>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">⚙️</div>
          <div className="action-content">
            <h3>Export Config</h3>
            <p>Ekspor file konfigurasi sistem dalam format JSON</p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownloadConfig}
            >
              📄 Export Config
            </button>
          </div>
        </div>
      </div>

      <div className="backups-section">
        <div className="section-header">
          <h3>📦 Daftar Backup Database</h3>
          <button
            type="button"
            className="btn-refresh"
            onClick={loadBackups}
            title="Refresh"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="backups-list">
          {backups.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <p>Belum ada backup database</p>
              <small>Klik "Buat Database Backup" untuk membuat backup pertama</small>
            </div>
          ) : (
            backups.map((backup) => (
              <div key={backup.filename} className="backup-item">
                <div className="backup-info">
                  <div className="backup-icon">🗄️</div>
                  <div className="backup-details">
                    <h4>{backup.filename}</h4>
                    <div className="backup-meta">
                      <span>📅 Dibuat: {formatDate(backup.created)}</span>
                      <span>💾 Ukuran: {formatFileSize(backup.size)}</span>
                    </div>
                  </div>
                </div>
                <div className="backup-actions">
                  <button
                    type="button"
                    className="btn-download"
                    onClick={() => handleDownloadBackup(backup.filename)}
                    title="Download"
                  >
                    ⬇️ Download
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDeleteBackup(backup.filename)}
                    title="Hapus"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="restore-section">
        <div className="restore-card">
          <h3>🔄 Restore Backup</h3>
          <p>
            Untuk restore backup database, silakan import file SQL backup melalui phpMyAdmin atau
            MySQL command line.
          </p>
          <div className="restore-instructions">
            <h4>Cara Restore:</h4>
            <ol>
              <li>Download file backup SQL yang ingin direstore</li>
              <li>Login ke phpMyAdmin atau akses MySQL command line</li>
              <li>Pilih database yang sesuai</li>
              <li>Import file SQL yang sudah didownload</li>
              <li>Tunggu hingga proses import selesai</li>
            </ol>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 24px;
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

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .alert.success {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .backup-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 16px;
        }

        .action-icon {
          font-size: 40px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0f2f1;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
        }

        .action-content h3 {
          margin: 0 0 8px;
          font-size: 18px;
          color: #1e293b;
        }

        .action-content p {
          margin: 0 0 16px;
          font-size: 14px;
          color: #64748b;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #0ea5a4;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0d9695;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .backups-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 18px;
          color: #1e293b;
        }

        .btn-refresh {
          padding: 8px 16px;
          background: #f1f5f9;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-refresh:hover {
          background: #e2e8f0;
        }

        .backups-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .backup-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .backup-item:hover {
          background: #f1f5f9;
          border-color: #0ea5a4;
        }

        .backup-info {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;
        }

        .backup-icon {
          font-size: 32px;
        }

        .backup-details h4 {
          margin: 0 0 8px;
          font-size: 15px;
          color: #1e293b;
          font-weight: 600;
        }

        .backup-meta {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #64748b;
        }

        .backup-actions {
          display: flex;
          gap: 8px;
        }

        .btn-download {
          padding: 8px 16px;
          background: #0ea5a4;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .btn-download:hover {
          background: #0d9695;
        }

        .btn-delete {
          padding: 8px 16px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .btn-delete:hover {
          background: #b91c1c;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .empty-state p {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 500;
        }

        .empty-state small {
          font-size: 13px;
        }

        .restore-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .restore-card h3 {
          margin: 0 0 12px;
          font-size: 18px;
          color: #1e293b;
        }

        .restore-card p {
          margin: 0 0 20px;
          color: #64748b;
          font-size: 14px;
        }

        .restore-instructions {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5a4;
        }

        .restore-instructions h4 {
          margin: 0 0 12px;
          font-size: 15px;
          color: #1e293b;
        }

        .restore-instructions ol {
          margin: 0;
          padding-left: 20px;
          color: #374151;
          font-size: 14px;
          line-height: 1.8;
        }

        .restore-instructions li {
          margin-bottom: 8px;
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
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .backup-actions {
            grid-template-columns: 1fr;
          }

          .backup-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .backup-actions {
            width: 100%;
            justify-content: stretch;
          }

          .btn-download,
          .btn-delete {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}

