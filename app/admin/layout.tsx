"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getToken, getAdminInfo, setAdminInfo, logout } from "@/lib/auth"

interface AdminInfo {
  id: number
  username: string
  role: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/web-bidan-main/api"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<AdminInfo | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Skip layout for login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    // Don't check auth on login page
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    const loadAdminData = async () => {
      const token = getToken()
      if (!token) {
        router.push("/admin/login")
        return
      }

      // Try to get admin info from localStorage first
      let adminInfo = getAdminInfo()
      
      // If not in localStorage, fetch from API
      if (!adminInfo) {
        try {
          const response = await fetch(`${API_BASE_URL}/admin.php/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const data = await response.json()
            if (data.ok && data.admin) {
              adminInfo = data.admin
              // Make sure role is set (fallback to regular if not specified)
              if (adminInfo) {
                if (!adminInfo.role) {
                  adminInfo.role = "regular"
                }
                setAdminInfo(adminInfo)
              }
            } else {
              // If API returns error, token might be invalid
              logout()
              router.push("/admin/login")
              return
            }
          } else {
            // If API returns error, token might be invalid
            logout()
            router.push("/admin/login")
            return
          }
        } catch (error) {
          console.error("Error fetching admin info:", error)
          // On error, clear token and redirect to login
          logout()
          router.push("/admin/login")
          return
        }
      }

      // Validate adminInfo has required fields
      if (!adminInfo || !adminInfo.id || !adminInfo.username) {
        logout()
        router.push("/admin/login")
        return
      }

      // Ensure role is set (fallback to regular)
      if (!adminInfo.role) {
        adminInfo.role = "regular"
        setAdminInfo(adminInfo)
      }

      // Only superadmin can access admin dashboard
      if (adminInfo.role !== "superadmin") {
        logout()
        router.push("/admin/login")
        return
      }

      setAdmin(adminInfo)
      setIsLoading(false)
    }

    loadAdminData()
  }, [router, isLoginPage])

  // Render children directly for login page (no layout)
  if (isLoginPage) {
    return <>{children}</>
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Memuat...</p>
      </div>
    )
  }

  // If admin is not loaded, show loading (will redirect if needed)
  if (!admin && !isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Memuat informasi admin...</p>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/pasien", label: "Data Pasien", icon: "👥" },
    { href: "/admin/anc", label: "Rekam ANC", icon: "🤰" },
    { href: "/admin/kb", label: "Rekam KB", icon: "💊" },
    { href: "/admin/lansia", label: "Rekam Lansia", icon: "👴" },
    { href: "/admin/jadwal", label: "Jadwal", icon: "📅" },
    { href: "/admin/edukasi", label: "Edukasi", icon: "📚" },
  ]

  const superadminItems = [
    { href: "/admin/users", label: "Kelola Admin", icon: "🔐" },
    { href: "/admin/backup", label: "System Backup", icon: "💾" },
  ]

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-icon">🏥</span>
            {sidebarOpen && <span className="admin-logo-text">Poskesdes Admin</span>}
          </div>
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="admin-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="admin-nav-link"
                  title={item.label}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
                </a>
              </li>
            ))}

            {admin.role === "superadmin" && (
              <>
                <li className="admin-nav-divider" />
                {superadminItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="admin-nav-link superadmin"
                      title={item.label}
                    >
                      <span className="admin-nav-icon">{item.icon}</span>
                      {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-avatar">👤</span>
            {sidebarOpen && (
              <div className="admin-user-details">
                <span className="admin-user-name">{admin.username}</span>
                <span className={`admin-user-role ${admin.role}`}>
                  {admin.role === "superadmin" ? "Super Admin" : "Regular"}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="admin-header-title">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <a href="/" className="admin-back-to-site" title="Kembali ke Website">
              🌐 Website
            </a>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
        }

        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
        }

        .admin-sidebar.closed {
          width: 70px;
        }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #334155;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-logo-icon {
          font-size: 24px;
        }

        .admin-logo-text {
          font-weight: 700;
          font-size: 16px;
          white-space: nowrap;
        }

        .admin-sidebar-toggle {
          background: #334155;
          border: none;
          color: #e2e8f0;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .admin-sidebar-toggle:hover {
          background: #475569;
        }

        .admin-nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .admin-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .admin-nav-link:hover {
          background: #334155;
          color: #f8fafc;
          border-left-color: #0ea5a4;
        }

        .admin-nav-link.superadmin {
          color: #fbbf24;
        }

        .admin-nav-link.superadmin:hover {
          border-left-color: #fbbf24;
        }

        .admin-nav-icon {
          font-size: 18px;
          min-width: 24px;
          text-align: center;
        }

        .admin-nav-label {
          white-space: nowrap;
        }

        .admin-nav-divider {
          height: 1px;
          background: #334155;
          margin: 12px 16px;
        }

        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid #334155;
        }

        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .admin-user-avatar {
          font-size: 24px;
        }

        .admin-user-details {
          display: flex;
          flex-direction: column;
        }

        .admin-user-name {
          font-weight: 600;
          font-size: 14px;
        }

        .admin-user-role {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          background: #334155;
        }

        .admin-user-role.superadmin {
          background: #92400e;
          color: #fef3c7;
        }

        .admin-logout-btn {
          width: 100%;
          padding: 10px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .admin-logout-btn:hover {
          background: #b91c1c;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-sidebar.closed + .admin-main {
          margin-left: 70px;
        }

        .admin-header {
          background: white;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .admin-header-title h1 {
          margin: 0;
          font-size: 20px;
          color: #1e293b;
        }

        .admin-header-actions {
          margin-left: auto;
        }

        .admin-back-to-site {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #0ea5a4;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .admin-back-to-site:hover {
          background: #0d9695;
        }

        .admin-content {
          flex: 1;
          padding: 24px;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 16px;
        }

        .admin-loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
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
          .admin-sidebar {
            transform: translateX(-100%);
            width: 260px !important;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-main {
            margin-left: 0 !important;
          }

          .admin-mobile-menu-btn {
            display: block;
          }

          .admin-sidebar-toggle {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

