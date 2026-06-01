"use client"

import { useEffect, useState } from "react"
import { jadwalApi, type Jadwal } from "@/lib/api"

const formatTanggal = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

export function HomeSection() {
  const [upcomingSchedules, setUpcomingSchedules] = useState<Jadwal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUpcoming = async () => {
      try {
        const schedules = await jadwalApi.getUpcoming(5)
        setUpcomingSchedules(schedules)
      } catch (error) {
        console.error("Error loading upcoming schedules:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUpcoming()
  }, [])
  return (
    <section id="home" className="page active" data-page>
      <div className="card hero">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrasi layanan Poskesdes">
          <rect width="64" height="64" rx="12" fill="#fff" />
          <path d="M22 44c0-6 6-10 14-10s14 4 14 10" stroke="#0ea5a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="26" r="6" fill="#0ea5a4" />
          <circle cx="40" cy="22" r="4" fill="#0891b2" />
        </svg>
        <div>
          <h2>Selamat Datang di Poskesdes Pagar Ruyung</h2>
          <p className="muted">
            Layanan utama: Pemeriksaan Ibu Hamil, KB, dan Lansia. Klik kartu layanan untuk detail & pendaftaran.
          </p>
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button className="btn" data-link="register" type="button">
              Daftar Pasien Baru
            </button>
            <button className="small-btn" data-link="pemeriksaan" type="button">
              Mulai Pemeriksaan
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: "14px" }} />
      <div className="grid services">
        <div className="card svc" data-link="pemeriksaan">
          <div className="icon" aria-hidden="true">
            👩‍⚕️
          </div>
          <div>
            <div>Pemeriksaan Ibu Hamil</div>
            <div className="muted">Konsultasi antenatal, pemeriksaan DJJ, Fe</div>
          </div>
        </div>

        <div className="card svc" data-link="pelayanan-kb">
          <div className="icon" aria-hidden="true">
            🤱
          </div>
          <div>
            <div>Pelayanan Keluarga Berencana (KB)</div>
            <div className="muted">Kontrol, konseling, dan pencatatan metode KB</div>
          </div>
        </div>



        <div className="card svc" data-link="lansia-detail">
          <div className="icon" style={{ background: "#ecfdf5", color: "#059669" }} aria-hidden="true">
            👴👵
          </div>
          <div>
            <div>Pelayanan Lansia & Posbindu</div>
            <div className="muted">Pemeriksaan kesehatan rutin, TD, GDS, Kolesterol</div>
          </div>
        </div>

        <div className="card svc" data-link="edukasi">
          <div className="icon" aria-hidden="true">
            📚
          </div>
          <div>
            <div>Edukasi Kesehatan</div>
            <div className="muted">Materi gizi, persalinan, tanda bahaya</div>
          </div>
        </div>
      </div>

      <div className="card agenda">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <strong>Agenda Terdekat</strong>
          <button className="small-btn" data-link="jadwal" type="button">
            Lihat Semua
          </button>
        </div>
        {isLoading ? (
          <div className="muted" style={{ padding: "10px", textAlign: "center" }}>
            Memuat agenda...
          </div>
        ) : upcomingSchedules.length === 0 ? (
          <div className="muted" style={{ padding: "10px", textAlign: "center" }}>
            Belum ada agenda terdekat.
          </div>
        ) : (
          upcomingSchedules.map((schedule) => (
            <div key={schedule.id || schedule.id_pasien || schedule.id_anc || schedule.id_kb || schedule.id_lansia || schedule.id_jadwal || schedule.id_edukasi || schedule.id_admin} className="item">
              <div>
                <div style={{ fontWeight: 700 }}>{schedule.nama}</div>
                <div className="muted">{formatTanggal(schedule.tanggal)} • {schedule.jenis}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

