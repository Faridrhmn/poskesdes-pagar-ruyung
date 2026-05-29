"use client"

import { AuthProvider, useAuth } from "@/components/auth/AuthProvider"
import { LoginPage } from "@/components/auth/LoginPage"
import { PoskesdesApp } from "@/components/poskesdes/PoskesdesApp"

function HomeContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
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
          zIndex: 9999,
        }}
      >
        <div style={{ color: "white", fontSize: "18px" }}>Memuat...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <PoskesdesApp />
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
