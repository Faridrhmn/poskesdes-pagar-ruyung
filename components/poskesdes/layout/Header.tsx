"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/AuthProvider"

const NAV_ITEMS = [
  { href: "#home", route: "home", label: "Beranda" },
  { href: "#pasien", route: "pasien", label: "Pasien" },
  { href: "#pemeriksaan", route: "pemeriksaan", label: "Pemeriksaan" },
  { href: "#jadwal", route: "jadwal", label: "Jadwal" },
  { href: "#laporan", route: "laporan", label: "Laporan" },
  { href: "#ekspor", route: "ekspor", label: "Ekspor" },
  { href: "#edukasi", route: "edukasi", label: "Edukasi" },
  { href: "#profil", route: "profil", label: "Profil" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <>
      <header>
        <div className="logo">
          <div className="mark" aria-hidden="true">
            PK
          </div>
          <div>
            <div>Poskesdes Pagar Ruyung</div>
            <div className="muted">Desa Pagar Ruyung — Jam: 08.00–14.00</div>
          </div>
        </div>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span className={isMenuOpen ? "open" : ""}></span>
          <span className={isMenuOpen ? "open" : ""}></span>
          <span className={isMenuOpen ? "open" : ""}></span>
        </button>
        <nav className={`top-nav ${isMenuOpen ? "open" : ""}`} role="navigation" aria-label="Menu utama">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.route}
              href={item.href}
              data-route={item.route}
              className={item.route === "home" ? "active" : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="logout-btn-mobile"
            style={{
              marginTop: "12px",
              padding: "12px 10px",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderTop: "1px solid #eee",
              color: "#dc2626",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Keluar
          </button>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="logout-btn-desktop"
          style={{
            display: "none",
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid #dc2626",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            marginLeft: "12px",
          }}
        >
          Keluar
        </button>
      </header>
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu} aria-hidden="true" />}
    </>
  )
}

