"use client"

import { useEffect } from "react"
import { AgendaModal } from "./layout/AgendaModal"
import { FooterNav } from "./layout/FooterNav"
import { Header } from "./layout/Header"
import { ScheduleAlarm } from "./layout/ScheduleAlarm"
import { PoskesdesStyles } from "./PoskesdesStyles"
import { initPoskesdesScripts } from "./init-poskesdes"
import { AncDetailSection } from "./sections/AncDetailSection"
import { EducationSection } from "./sections/EducationSection"
import { ExportSection } from "./sections/ExportSection"
import { HomeSection } from "./sections/HomeSection"
import { JadwalFormSection } from "./sections/JadwalFormSection"
import { JadwalSection } from "./sections/JadwalSection"
import { KbSection } from "./sections/KbSection"
import { LansiaSection } from "./sections/LansiaSection"
import { LaporanSection } from "./sections/LaporanSection"
import { PasienFormSection } from "./sections/PasienFormSection"
import { PasienSection } from "./sections/PasienSection"
import { PemeriksaanSection } from "./sections/PemeriksaanSection"
import { ProfilSection } from "./sections/ProfilSection"
import { RegisterSection } from "./sections/RegisterSection"

export function PoskesdesApp() {
  useEffect(() => {
    const cleanup = initPoskesdesScripts()
    return cleanup
  }, [])

  return (
    <>
      <PoskesdesStyles />
      <div className="poskesdes-app">
        <ScheduleAlarm />
        <Header />
        <main className="container" role="main">
          <HomeSection />
          <PasienSection />
          <PasienFormSection />
          <RegisterSection />
          <PemeriksaanSection />
          <AncDetailSection />
          <KbSection />
          <LansiaSection />
          <JadwalSection />
          <JadwalFormSection />
          <LaporanSection />
          <ExportSection />
          <EducationSection />
          <ProfilSection />
        </main>
        <FooterNav />
        <AgendaModal />
      </div>
    </>
  )
}

