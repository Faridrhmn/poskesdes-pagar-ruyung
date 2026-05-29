import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Poskesdes Pagar Ruyung — Sistem Layanan Terpadu",
  description:
    "Dashboard Poskesdes Pagar Ruyung untuk pendaftaran pasien, rekam ANC/KB/Lansia, pengingat jadwal, ekspor laporan, dan materi edukasi.",
  keywords: [
    "Poskesdes Pagar Ruyung",
    "Bidan Pertiwi Agustini",
    "Pemeriksaan ANC",
    "Pelayanan KB",
    "Posbindu Lansia",
    "Jadwal kontrol",
    "Laporan kesehatan desa",
  ],
  authors: [{ name: "Poskesdes Pagar Ruyung" }],
  openGraph: {
    title: "Poskesdes Pagar Ruyung — Sistem Layanan Terpadu",
    description:
      "Pantau pendaftaran pasien, rekam ANC & KB, jadwal kontrol, serta materi edukasi kesehatan dari satu dashboard responsif.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
