"use client"

import { useEffect, useState, useRef } from "react"
import { jadwalApi, type Jadwal } from "@/lib/api"

const hitungStatus = (tanggalStr: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(tanggalStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return "lewat"
  if (diff === 0) return "hari-ini"
  if (diff === 1) return "besok"
  if (diff <= 7) return "minggu-ini"
  return "lain"
}

const formatTanggal = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

const playBellSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.error("Error playing bell sound:", error)
  }
}

export function ScheduleAlarm() {
  const [urgentSchedules, setUrgentSchedules] = useState<Jadwal[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const bellIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const dismissedScheduleIdsRef = useRef<Set<string>>(new Set())
  const previousUrgentIdsRef = useRef<string[]>([])

  useEffect(() => {
    const checkSchedules = async () => {
      try {
        const schedules = await jadwalApi.getAll()
        const urgent = schedules.filter((schedule) => {
          const status = hitungStatus(schedule.tanggal)
          return status === "hari-ini" || status === "besok"
        })

        const urgentIds = urgent.map((s) => s.id).sort()
        const urgentIdsString = JSON.stringify(urgentIds)
        const previousIdsString = JSON.stringify(previousUrgentIdsRef.current)
        const hasNewUrgent = urgentIdsString !== previousIdsString

        if (hasNewUrgent && urgentIds.length > 0) {
          previousUrgentIdsRef.current = urgentIds
          dismissedScheduleIdsRef.current = new Set()
        }

        const visibleUrgent = urgent.filter((schedule) => !dismissedScheduleIdsRef.current.has(schedule.id))

        if (visibleUrgent.length > 0) {
          setUrgentSchedules(visibleUrgent)
          setIsVisible(true)
        } else {
          setUrgentSchedules([])
          setIsVisible(false)
        }
      } catch (error) {
        console.error("Error checking schedules:", error)
      }
    }

    checkSchedules()

    checkIntervalRef.current = setInterval(checkSchedules, 60000)

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (bellIntervalRef.current) {
        clearInterval(bellIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible && urgentSchedules.length > 0) {
      playBellSound()

      bellIntervalRef.current = setInterval(() => {
        playBellSound()
      }, 3000)

      return () => {
        if (bellIntervalRef.current) {
          clearInterval(bellIntervalRef.current)
        }
      }
    } else {
      if (bellIntervalRef.current) {
        clearInterval(bellIntervalRef.current)
        bellIntervalRef.current = null
      }
    }
  }, [isVisible, urgentSchedules.length])

  const handleDismiss = () => {
    urgentSchedules.forEach((schedule) => {
      dismissedScheduleIdsRef.current.add(schedule.id)
    })
    setIsVisible(false)
    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current)
      bellIntervalRef.current = null
    }
  }

  if (!isVisible || urgentSchedules.length === 0) {
    return null
  }

  const todaySchedules = urgentSchedules.filter((s) => hitungStatus(s.tanggal) === "hari-ini")
  const tomorrowSchedules = urgentSchedules.filter((s) => hitungStatus(s.tanggal) === "besok")

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        width: "90%",
        maxWidth: "600px",
        animation: "slideDown 0.3s ease-out",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(220, 38, 38, 0.4)",
          border: "2px solid #fff",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ fontSize: "32px", lineHeight: 1 }}>🔔</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
              ⚠️ PENGINGAT JADWAL PASIEN
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.6, marginBottom: "12px", opacity: 0.95 }}>
              {todaySchedules.length > 0 && (
                <div style={{ marginBottom: "8px" }}>
                  <strong>📅 Hari Ini ({todaySchedules.length} jadwal):</strong>
                  <div style={{ marginTop: "4px", marginLeft: "12px" }}>
                    {todaySchedules.map((schedule) => (
                      <div key={schedule.id} style={{ marginBottom: "4px" }}>
                        • {schedule.nama} - {schedule.jenis} ({formatTanggal(schedule.tanggal)})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tomorrowSchedules.length > 0 && (
                <div>
                  <strong>📆 Besok ({tomorrowSchedules.length} jadwal):</strong>
                  <div style={{ marginTop: "4px", marginLeft: "12px" }}>
                    {tomorrowSchedules.map((schedule) => (
                      <div key={schedule.id} style={{ marginBottom: "4px" }}>
                        • {schedule.nama} - {schedule.jenis} ({formatTanggal(schedule.tanggal)})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleDismiss}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
              }}
            >
              Tutup Alarm
            </button>
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#fff",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              lineHeight: 1,
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
            }}
          >
            ×
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `
      }} />
    </div>
  )
}

