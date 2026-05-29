"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, getToken, logout } from "@/lib/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Redirect if already logged in
    if (typeof window !== "undefined") {
      const token = getToken()
      if (token) {
        router.push("/admin")
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(username, password)
      if (result.ok && result.admin) {
        // Verify that user is superadmin
        if (result.admin.role !== "superadmin") {
          setError("Akses ditolak. Hanya superadmin yang dapat login ke admin dashboard. Silakan login di homepage untuk akses regular.")
          logout()
          return
        }
        router.push("/admin")
      } else {
        setError(result.message || "Login gagal. Periksa username dan password Anda.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🏥</span>
          <h1>Admin Login</h1>
          <p>Poskesdes Pagar Ruyung</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <a href="/">← Kembali ke Website</a>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .login-header h1 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #1e293b;
        }

        .login-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
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

        .form-group input {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0ea5a4;
          box-shadow: 0 0 0 3px rgba(14, 165, 164, 0.1);
        }

        .login-btn {
          background: linear-gradient(135deg, #0ea5a4 0%, #0d9695 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(14, 165, 164, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .login-footer a {
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
        }

        .login-footer a:hover {
          color: #0ea5a4;
        }
      `}</style>
    </div>
  )
}

