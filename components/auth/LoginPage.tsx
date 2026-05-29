"use client"

import { useState, FormEvent } from "react"
import { useAuth } from "./AuthProvider"

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await login(username, password)
      if (!response.ok) {
        setError(response.message || "Login gagal. Periksa username dan password Anda.")
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
        padding: "20px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#0ea5a4",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            PK
          </div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            Poskesdes Pagar Ruyung
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
            Masuk ke sistem
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0ea5a4")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              placeholder="Masukkan username"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0ea5a4")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                background: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: isLoading ? "#9ca3af" : "#0ea5a4",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = "#0d9488"
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.background = "#0ea5a4"
            }}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  )
}

