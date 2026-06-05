"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken, getAdminInfo } from "@/lib/auth"

interface Admin {
  id: number
  username: string
  role: string
  created_at: string
  updated_at?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/web-bidan-main/api"

export default function AdminUsersPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", role: "regular" })
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [resettingAdmin, setResettingAdmin] = useState<Admin | null>(null)
  const [resetPassword, setResetPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const adminInfo = getAdminInfo()
    if (!adminInfo || adminInfo.role !== "superadmin") {
      router.push("/admin")
      return
    }
    setCurrentUserId(adminInfo.id)
    loadAdmins()
  }, [router])

  const loadAdmins = async () => {
    try {
      setIsLoading(true)
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/admin.php/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // Jika bukan array (misal error object), tampilkan pesan error
        const message = (data && data.message) || "Gagal memuat data admin"
        setError(message)
        setAdmins([])
        return
      }

      if (Array.isArray(data)) {
        setAdmins(data)
      } else {
        console.error("Unexpected admins response:", data)
        setError("Format data admin tidak sesuai")
        setAdmins([])
      }
    } catch (error) {
      console.error("Error loading admins:", error)
      setError("Terjadi kesalahan saat memuat data admin")
      setAdmins([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newAdmin.username || !newAdmin.password) {
      setError("Username dan password harus diisi")
      return
    }

    if (newAdmin.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/admin.php/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      })

      const data = await response.json()
      if (data.ok) {
        setSuccess("Admin berhasil ditambahkan")
        setNewAdmin({ username: "", password: "", role: "regular" })
        setShowAddForm(false)
        loadAdmins()
      } else {
        setError(data.message || "Gagal menambahkan admin")
      }
    } catch {
      setError("Terjadi kesalahan")
    }
  }

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAdmin) return

    setError("")
    setSuccess("")

    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/admin.php/${editingAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editingAdmin.username,
          role: editingAdmin.role,
        }),
      })

      const data = await response.json()
      if (data.ok) {
        setSuccess("Admin berhasil diupdate")
        setEditingAdmin(null)
        loadAdmins()
      } else {
        setError(data.message || "Gagal mengupdate admin")
      }
    } catch {
      setError("Terjadi kesalahan")
    }
  }

  const handleDeleteAdmin = async (adminId: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
      return
    }

    setError("")
    setSuccess("")

    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/admin.php/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.ok) {
        setSuccess("Admin berhasil dihapus")
        loadAdmins()
      } else {
        setError(data.message || "Gagal menghapus admin")
      }
    } catch {
      setError("Terjadi kesalahan")
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resettingAdmin) return

    setError("")
    setSuccess("")

    if (!resetPassword || resetPassword.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/admin.php/${resettingAdmin.id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: resetPassword }),
      })

      const data = await response.json()
      if (data.ok) {
        setSuccess("Password berhasil direset")
        setResettingAdmin(null)
        setResetPassword("")
        loadAdmins()
      } else {
        setError(data.message || "Gagal reset password")
      }
    } catch {
      setError("Terjadi kesalahan")
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
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
        <p>Memuat data admin...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>🔐 Kelola Admin</h2>
          <p>Hanya superadmin yang dapat mengakses halaman ini</p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn-add"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "✕ Batal" : "+ Tambah Admin"}
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {showAddForm && (
        <div className="add-form-card">
          <h3>Tambah Admin Baru</h3>
          <form onSubmit={handleAddAdmin}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Masukkan password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                >
                  <option value="regular">Regular</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-submit">
              Simpan Admin
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Dibuat</th>
              <th>Terakhir Update</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">
                  Belum ada data admin
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id || admin.id_pasien || admin.id_anc || admin.id_kb || admin.id_lansia || admin.id_jadwal || admin.id_edukasi || admin.id_admin}>
                  <td>{admin.id}</td>
                  <td className="username-cell">{admin.username}</td>
                  <td>
                    <span className={`role-badge ${admin.role}`}>
                      {admin.role === "superadmin" ? "Super Admin" : "Regular"}
                    </span>
                  </td>
                  <td>{formatDate(admin.created_at)}</td>
                  <td>{formatDate(admin.updated_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => setEditingAdmin({ ...admin })}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-reset"
                        onClick={() => setResettingAdmin(admin)}
                        title="Reset Password"
                      >
                        🔑
                      </button>
                      {admin.id !== currentUserId && (
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingAdmin && (
        <div className="modal-overlay" onClick={() => setEditingAdmin(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Admin</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setEditingAdmin(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditAdmin}>
              <div className="form-group">
                <label htmlFor="edit-username">Username</label>
                <input
                  type="text"
                  id="edit-username"
                  value={editingAdmin.username}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  value={editingAdmin.role}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, role: e.target.value })
                  }
                >
                  <option value="regular">Regular</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingAdmin(null)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingAdmin && (
        <div className="modal-overlay" onClick={() => setResettingAdmin(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password - {resettingAdmin.username}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setResettingAdmin(null)
                  setResetPassword("")
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="new-password">Password Baru</label>
                <input
                  type="password"
                  id="new-password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
                <small className="form-hint">Password minimal 6 karakter</small>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setResettingAdmin(null)
                    setResetPassword("")
                  }}
                >
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        .btn-add {
          padding: 10px 20px;
          background: #0ea5a4;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-add:hover {
          background: #0d9695;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
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

        .add-form-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .add-form-card h3 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1e293b;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          color: #374151;
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #0ea5a4;
          outline: none;
        }

        .btn-submit {
          padding: 12px 24px;
          background: #0ea5a4;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-submit:hover {
          background: #0d9695;
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
        }

        .data-table td {
          border-bottom: 1px solid #f1f5f9;
          color: #374151;
        }

        .data-table tr:hover td {
          background: #f8fafc;
        }

        .username-cell {
          font-weight: 600;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .role-badge.superadmin {
          background: #fef3c7;
          color: #92400e;
        }

        .role-badge.regular {
          background: #dbeafe;
          color: #1d4ed8;
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

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .btn-action:hover {
          background: #f1f5f9;
        }

        .btn-action.btn-edit:hover {
          background: #dbeafe;
        }

        .btn-action.btn-reset:hover {
          background: #fef3c7;
        }

        .btn-action.btn-delete:hover {
          background: #fee2e2;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }

        .modal-close:hover {
          background: #f1f5f9;
        }

        .modal-content form {
          padding: 24px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f1f5f9;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .form-hint {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #64748b;
        }
      `}</style>
    </div>
  )
}

