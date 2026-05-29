import { pasienApi, ancApi, kbApi, lansiaApi, jadwalApi, educationApi, type Pasien, type AncRecord, type KbRecord, type LansiaRecord, type Jadwal, type EducationMaterial } from "@/lib/api"
import * as XLSX from "xlsx"

type JadwalItem = {
  id: string
  nama: string
  tanggal: string
  jenis: string
  cara: string
}

declare global {
  interface Window {
    __poskesdesCleanup__?: () => void
  }
}

export function initPoskesdesScripts() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {}
  }

  if (window.__poskesdesCleanup__) {
    window.__poskesdesCleanup__()
    window.__poskesdesCleanup__ = undefined
  }

  const listeners: Array<{ target: EventTarget; type: string; listener: EventListenerOrEventListenerObject }> = []

  const addListener = (target: EventTarget | null, type: string, listener: EventListenerOrEventListenerObject) => {
    if (!target) return
    target.addEventListener(type, listener)
    listeners.push({ target, type, listener })
  }

  const pages = Array.from(document.querySelectorAll<HTMLElement>("[data-page]"))
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("nav.top-nav a"))
  const dataLinkElements = Array.from(document.querySelectorAll<HTMLElement>("[data-link]"))

  const agendaItems = [
    { title: "ANC: Kontrol Ibu Hamil", date: "24 Nov — 10:30", body: "Bidan A. Persiapkan buku KIA dan catatan kehamilan." },
  ]

  const modal = document.getElementById("modal")
  const modalTitle = document.getElementById("modal-title")
  const modalBody = document.getElementById("modal-body")
  const modalClose = document.getElementById("modal-close")

  const formRegister = document.getElementById("form-register-pasien") as HTMLFormElement | null
  const formANC = document.getElementById("form-anc") as HTMLFormElement | null
  const formKB = document.getElementById("form-kb") as HTMLFormElement | null
  const formLansia = document.getElementById("form-lansia") as HTMLFormElement | null
  const formJadwal = document.getElementById("form-jadwal") as HTMLFormElement | null
  const formEdukasi = document.getElementById("form-edukasi") as HTMLFormElement | null

  const infoPasienANC = document.getElementById("info-pasien-anc")
  const infoPasienKB = document.getElementById("info-pasien-kb")
  const infoPasienLansia = document.getElementById("info-pasien-lansia")

  const selectPasienANC = document.getElementById("select-pasien-anc") as HTMLSelectElement | null
  const selectPasienKB = document.getElementById("select-pasien-kb") as HTMLSelectElement | null
  const selectPasienLansia = document.getElementById("select-pasien-lansia") as HTMLSelectElement | null

  const jadwalListContainer = document.getElementById("jadwal-list")
  const jadwalKosong = document.getElementById("jadwal-kosong")
  const rekamList = document.getElementById("rekam-list")
  const educationList = document.getElementById("education-list")

  // Export buttons are now handled by data-export and data-format attributes

  const printEducationButton = document.getElementById("btn-print-edukasi")

  const laporanElements = {
    totalPendaftar: document.getElementById("lap-total-pendaftar"),
    totalAnc: document.getElementById("lap-total-anc"),
    totalKb: document.getElementById("lap-total-kb"),
    totalLansia: document.getElementById("lap-total-lansia"),
    totalJadwal: document.getElementById("lap-total-jadwal"),
    jadwalTable: document.getElementById("laporan-jadwal"),
  }

  // State for caching data
  let cachedPasien: Pasien[] = []
  let cachedAnc: AncRecord[] = []
  let cachedKb: KbRecord[] = []
  let cachedLansia: LansiaRecord[] = []
  let cachedJadwal: Jadwal[] = []
  let cachedEducation: EducationMaterial[] = []

  const openModal = (idx: number) => {
    const item = agendaItems[idx]
    if (!item || !modal || !modalTitle || !modalBody) return
    modalTitle.textContent = item.title
    modalBody.innerHTML = `Tanggal: <strong>${item.date}</strong><p>${item.body}</p>`
    modal.classList.add("show")
  }

  const closeModal = () => {
    if (modal) modal.classList.remove("show")
  }

  const agendaButtons = Array.from(document.querySelectorAll<HTMLElement>("[data-agenda-open]"))
  agendaButtons.forEach((btn) => {
    addListener(btn, "click", () => {
      const idx = Number(btn.dataset.agendaOpen)
      openModal(idx)
    })
  })
  addListener(modalClose, "click", closeModal)

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

  const downloadCSV = (filename: string, rows: Record<string, unknown>[]) => {
    if (!rows.length) {
      window.alert("Tidak ada data untuk diekspor.")
      return
    }
    const header = Object.keys(rows[0])
    const replacer = (_key: string, value: unknown) => {
      if (value === null || typeof value === "undefined") return ""
      if (typeof value === "string") return value.replace(/"/g, '""')
      return String(value)
    }
    const csv = [
      header.join(","),
      ...rows.map((row) => header.map((fieldName) => `"${replacer(fieldName, row[fieldName])}"`).join(",")),
    ].join("\r\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const downloadXLSX = (filename: string, rows: Record<string, unknown>[], sheetName: string = "Data") => {
    if (!rows.length) {
      window.alert("Tidak ada data untuk diekspor.")
      return
    }

    // Convert data to worksheet format
    const worksheet = XLSX.utils.json_to_sheet(rows)
    
    // Auto-size columns
    const maxWidth = 50
    const wscols = Object.keys(rows[0]).map(() => ({ wch: maxWidth }))
    worksheet["!cols"] = wscols

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Generate file and download
    XLSX.writeFile(workbook, filename)
  }

  // Load all data from API
  const loadAllData = async () => {
    try {
      const [pasien, anc, kb, lansia, jadwal, education] = await Promise.all([
        pasienApi.getAll().catch(() => [] as Pasien[]),
        ancApi.getAll().catch(() => [] as AncRecord[]),
        kbApi.getAll().catch(() => [] as KbRecord[]),
        lansiaApi.getAll().catch(() => [] as LansiaRecord[]),
        jadwalApi.getAll().catch(() => [] as Jadwal[]),
        educationApi.getAll().catch(() => [] as EducationMaterial[]),
      ])

      cachedPasien = pasien
      cachedAnc = anc
      cachedKb = kb
      cachedLansia = lansia
      cachedJadwal = jadwal
      cachedEducation = education

      populateDropdown(selectPasienANC, infoPasienANC)
      populateDropdown(selectPasienKB, infoPasienKB)
      populateDropdown(selectPasienLansia, infoPasienLansia)
      setupPasienSearch(selectPasienANC)
      setupPasienSearch(selectPasienKB)
      setupPasienSearch(selectPasienLansia)
      loadJadwal()
      renderAncList()
      updateLaporan()
      loadEducation()
    } catch (error) {
      console.error("Error loading data:", error)
      window.alert("Gagal memuat data. Silakan refresh halaman.")
    }
  }

  const getPendaftar = (): Pasien[] => {
    return cachedPasien.filter((item) => item.id && item.id.startsWith("P-"))
  }

  const populateDropdown = (selectEl: HTMLSelectElement | null, infoEl: HTMLElement | null) => {
    if (!selectEl) return
    const pasienList = getPendaftar()
    selectEl.innerHTML = '<option value="">-- Pilih Pasien Terdaftar --</option>'
    if (infoEl) infoEl.textContent = ""
    pasienList.forEach((pasien) => {
      if (!pasien.id) return
      const option = document.createElement("option")
      option.value = pasien.id
      const nomorCM = pasien.nomor_cm || ""
      const usiaKehamilan = pasien.usia_kehamilan || 0
      if (selectEl.id.includes("anc") && usiaKehamilan > 0) {
        option.textContent = `${nomorCM ? nomorCM + " — " : ""}${pasien.nama} — UK: ${usiaKehamilan} mg`
      } else {
        option.textContent = `${nomorCM ? nomorCM + " — " : ""}${pasien.nama}${pasien.no_hp ? ` — HP: ${pasien.no_hp}` : ""}`
      }
      option.dataset.searchText = `${nomorCM} ${pasien.nama} ${pasien.no_hp || ""}`.toLowerCase()
      selectEl.appendChild(option)
    })
  }

  const setupPasienSearch = (selectEl: HTMLSelectElement | null) => {
    if (!selectEl) return
    
    const searchId = `search-${selectEl.id}`
    let searchInput = document.getElementById(searchId) as HTMLInputElement
    const pasienList = getPendaftar()
    
    if (!searchInput) {
      searchInput = document.createElement("input")
      searchInput.id = searchId
      searchInput.type = "text"
      searchInput.placeholder = "🔍 Ketik nomor CM atau nama untuk mencari..."
      searchInput.style.cssText = "width: 100%; padding: 10px 12px; margin-bottom: 10px; border: 2px solid #0ea5a4; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
      
      const filterOptions = () => {
        const searchTerm = searchInput.value.toLowerCase().trim()
        const options = Array.from(selectEl.options) as HTMLOptionElement[]
        let visibleCount = 0
        
        options.forEach((option) => {
          if (option.value === "") {
            option.style.display = searchTerm ? "none" : "block"
            return
          }
          
          const searchText = option.dataset.searchText || option.textContent?.toLowerCase() || ""
          if (!searchTerm || searchText.includes(searchTerm)) {
            option.style.display = "block"
            visibleCount++
          } else {
            option.style.display = "none"
          }
        })
        
        if (searchTerm) {
          searchInput.style.borderColor = visibleCount > 0 ? "#10b981" : "#dc2626"
          
          if (visibleCount === 1) {
            const visibleOption = options.find((opt) => opt.style.display !== "none" && opt.value !== "")
            if (visibleOption && selectEl.value === "") {
              selectEl.value = visibleOption.value
              selectEl.dispatchEvent(new Event("change", { bubbles: true }))
            }
          }
        } else {
          searchInput.style.borderColor = "#0ea5a4"
        }
      }
      
      searchInput.addEventListener("input", filterOptions)
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          searchInput.value = ""
          filterOptions()
          searchInput.blur()
        }
        if (e.key === "Enter" && searchInput.value.trim()) {
          e.preventDefault()
          const options = Array.from(selectEl.options) as HTMLOptionElement[]
          const firstVisible = options.find((opt) => opt.style.display !== "none" && opt.value !== "")
          if (firstVisible) {
            selectEl.value = firstVisible.value
            selectEl.dispatchEvent(new Event("change", { bubbles: true }))
            searchInput.blur()
          }
        }
      })
      
      if (selectEl.parentElement) {
        const parent = selectEl.parentElement
        if (parent.tagName === "LABEL") {
          selectEl.parentElement.insertBefore(searchInput, selectEl)
        } else {
          parent.insertBefore(searchInput, selectEl)
        }
      }
    }
    
    return searchInput
  }

  const handlePasienSelect = (selectEl: HTMLSelectElement, infoEl: HTMLElement | null) => {
    const pasienId = selectEl.value
    const pasien = getPendaftar().find((p) => p.id === pasienId)
    if (!infoEl) return
    if (pasien) {
      const nomorCM = pasien.nomor_cm || "—"
      const usia = pasien.usia_kehamilan && Number(pasien.usia_kehamilan) > 0 ? ` | UK: ${pasien.usia_kehamilan} minggu` : " | Status: Non-Hamil"
      infoEl.textContent = `CM: ${nomorCM} | Nama: ${pasien.nama || "—"} | NIK: ${pasien.nik || "—"} | HP: ${pasien.no_hp || "—"}${usia}`
    } else {
      infoEl.textContent = ""
    }
  }

  if (selectPasienANC) {
    addListener(selectPasienANC, "change", (event) => {
      handlePasienSelect(event.currentTarget as HTMLSelectElement, infoPasienANC)
    })
  }
  if (selectPasienKB) {
    addListener(selectPasienKB, "change", (event) => {
      handlePasienSelect(event.currentTarget as HTMLSelectElement, infoPasienKB)
    })
  }
  if (selectPasienLansia) {
    addListener(selectPasienLansia, "change", (event) => {
      handlePasienSelect(event.currentTarget as HTMLSelectElement, infoPasienLansia)
    })
  }

  const loadJadwal = async () => {
    try {
      const data = await jadwalApi.getAll()
      cachedJadwal = data
      if (!jadwalListContainer || !jadwalKosong) return
      if (data.length === 0) {
        jadwalKosong.style.display = "block"
        jadwalListContainer.innerHTML = ""
        updateLaporan()
        return
      }

      jadwalKosong.style.display = "none"
      data.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
      const pendaftar = getPendaftar()

      jadwalListContainer.innerHTML = data
        .map((jadwal) => {
          const status = hitungStatus(jadwal.tanggal)
          const paciente = pendaftar.find((p) => jadwal.nama.includes(p.nama.split(" ")[0]) || jadwal.nama.includes(p.nama))
          let phone = "62812xxxxxx"
          let nama = jadwal.nama
          if (paciente?.no_hp) {
            phone = paciente.no_hp.replace(/\D/g, "")
            if (!phone.startsWith("62") && phone.startsWith("0")) {
              phone = `62${phone.substring(1)}`
            } else if (!phone.startsWith("62")) {
              phone = `62${phone}`
            }
            nama = paciente.nama
          }

          const pesan = encodeURIComponent(
            `*PEMBERITAHUAN JADWAL POSKESDES PAGAR RUYUNG*\n\nKepada Yth. Sdr/Ibu *${nama}* Anda memiliki jadwal *${jadwal.jenis}* pada:\n*Tanggal: ${formatTanggal(
              jadwal.tanggal,
            )}*\n*Waktu: 09.00 - 14.00 WIB*\n\nDiharapkan datang tepat waktu sesuai jadwal. Cara pengingat: ${jadwal.cara}\n\nTerima kasih.\n_Bidan Poskesdes Pagar Ruyung_`,
          )
          const waLink = `https://wa.me/${phone}?text=${pesan}`

          let badgeText = "Mendatang"
          let badgeClass = "badge-muted"
          let borderStyle = "#ccc"
          if (status === "lewat") {
            badgeText = "Lewat"
            badgeClass = "badge-danger"
            borderStyle = "var(--danger)"
          } else if (status === "hari-ini") {
            badgeText = "Hari ini"
            badgeClass = "badge-success"
            borderStyle = "var(--success)"
          } else if (status === "besok") {
            badgeText = "Besok (WA PENGINGAT)"
            badgeClass = "badge-warning"
            borderStyle = "var(--warning)"
          } else if (status === "minggu-ini") {
            badgeText = "Minggu Ini"
            badgeClass = "badge-muted"
            borderStyle = "#ccc"
          }

          const waButton =
            status === "hari-ini" || status === "besok"
              ? `<a href="${waLink}" target="_blank" class="small-btn" style="background:var(--success); color:#fff; font-size:11px; font-weight:700;">${
                  status === "besok" ? "KIRIM WA PENGINGAT" : "KIRIM WA SEKARANG"
                }</a>`
              : `<a href="${waLink}" target="_blank" class="small-btn" style="background:#e0f2f1; color:var(--teal-600); font-size:11px;">Kirim WA (Manual)</a>`

          return `
          <div class="agenda item" style="margin-top:6px; border-left: 4px solid ${borderStyle};">
            <div style="flex-grow:1;">
              <div style="font-weight:700">${jadwal.nama}</div>
              <div class="muted" style="font-size:13px">
                ${formatTanggal(jadwal.tanggal)} • ${jadwal.jenis} • ${jadwal.cara}
              </div>
            </div>
            <div style="text-align:right; display:flex; gap: 8px; align-items:center;">
              ${waButton}
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
          </div>
        `
        })
        .join("")
      updateLaporan()
    } catch (error) {
      console.error("Error loading jadwal:", error)
      if (jadwalKosong) jadwalKosong.style.display = "block"
      if (jadwalListContainer) jadwalListContainer.innerHTML = ""
    }
  }

  if (formJadwal) {
    addListener(formJadwal, "submit", async (event) => {
      event.preventDefault()
      const formData = new FormData(formJadwal)
      const formObj = Object.fromEntries(formData.entries()) as Record<string, string>
      if (!formObj.nama || !formObj.tanggal || !formObj.jenis || !formObj.cara) {
        window.alert("Semua kolom harus diisi!")
        return
      }
      try {
        await jadwalApi.create({
          id: `J-${Date.now().toString(36)}`,
          nama: formObj.nama.trim(),
          tanggal: formObj.tanggal,
          jenis: formObj.jenis,
          cara: formObj.cara,
        })
        formJadwal.reset()
        await loadJadwal()
        window.alert("Jadwal baru tersimpan.")
      } catch (error) {
        console.error("Error saving jadwal:", error)
        window.alert("Gagal menyimpan jadwal. Silakan coba lagi.")
      }
    })
  }

  if (formRegister) {
    addListener(formRegister, "submit", async (event) => {
      event.preventDefault()
      const formData = new FormData(formRegister)
      const formObj = Object.fromEntries(formData.entries()) as Record<string, string>
      try {
        const patientId = `P-${Date.now().toString(36)}`
        await pasienApi.create({
          id: patientId,
          nama: formObj.nama,
          nik: formObj.nik || undefined,
          no_kk: formObj.no_kk || undefined,
          no_hp: formObj.no_hp,
          no_kis: formObj.no_kis || undefined,
          pendidikan: formObj.pendidikan || undefined,
          alamat: formObj.alamat || undefined,
          usia_kehamilan: Number(formObj.usia_kehamilan) || 0,
          tgl_daftar: new Date().toISOString().substring(0, 10),
        })
        
        await loadAllData()
        
        const newPatient = cachedPasien.find((p) => p.id === patientId)
        const nomorCM = newPatient?.nomor_cm || "—"
        
        formRegister.reset()
        window.alert(`Pasien ${formObj.nama} berhasil didaftarkan!\nNomor CM: ${nomorCM}`)
        showPage("home")
      } catch (error) {
        console.error("Error registering patient:", error)
        window.alert("Gagal mendaftarkan pasien. Silakan coba lagi.")
      }
    })
  }

  const handleRecordSubmission = ({
    form,
    select,
    infoElement,
    successMessage,
    recordPrefix,
    jadwalKeyName,
    jadwalField,
    jadwalLabel,
    defaultCara,
    redirectToSchedule,
    apiCreate,
  }: {
    form: HTMLFormElement | null
    select: HTMLSelectElement | null
    infoElement: HTMLElement | null
    successMessage: (jadwalDate?: string, nama?: string) => string
    recordPrefix: string
    jadwalKeyName: string
    jadwalField: string
    jadwalLabel: (nama: string, data: Record<string, string>) => string
    defaultCara: string
    redirectToSchedule?: boolean
    apiCreate: (data: unknown) => Promise<unknown>
  }) => {
    if (!form || !select) return
    addListener(form, "submit", async (event) => {
      event.preventDefault()
      const pasienId = select.value
      if (!pasienId) {
        window.alert("Pilih Pasien terlebih dahulu!")
        return
      }
      const pasien = getPendaftar().find((p) => p.id === pasienId)
      const formData = new FormData(form)
      const recordData = Object.fromEntries(formData.entries()) as Record<string, string>
      const namaPasien = pasien?.nama || infoElement?.textContent?.replace("Nama: ", "").split(" | ")[0] || "Pasien Tidak Dikenal"

      try {
        const recordId = `${recordPrefix}-${Date.now().toString(36)}`
        const apiData: Record<string, unknown> = {
          id: recordId,
          pasien_id: pasien?.id || undefined,
          pasien_nama: namaPasien,
          tanggal: new Date().toISOString().substring(0, 10),
          ...recordData,
        }

        await apiCreate(apiData)

        const jadwalKontrol = recordData[jadwalField]
        if (jadwalKontrol) {
          const label = jadwalLabel(namaPasien, recordData)
          await jadwalApi.create({
            id: `J-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`,
            nama: label,
            tanggal: jadwalKontrol,
            jenis: jadwalKeyName,
            cara: defaultCara,
            pasien_id: pasien?.id,
          })
        }

        form.reset()
        select.value = ""
        if (infoElement) infoElement.textContent = ""
        await loadAllData()
        window.alert(successMessage(jadwalKontrol, namaPasien))
        if (jadwalKontrol && redirectToSchedule) {
          await loadJadwal()
          showPage("jadwal")
        }
      } catch (error) {
        console.error(`Error saving ${recordPrefix} record:`, error)
        window.alert(`Gagal menyimpan rekam ${recordPrefix}. Silakan coba lagi.`)
      }
    })
  }

  handleRecordSubmission({
    form: formANC,
    select: selectPasienANC,
    infoElement: infoPasienANC,
    successMessage: (date) =>
      `Rekam ANC tersimpan.${date ? ` Jadwal kontrol ANC pada ${formatTanggal(date)} otomatis ditambahkan.` : ""}`,
    recordPrefix: "ANC",
    jadwalKeyName: "ANC Kontrol",
    jadwalField: "jadwal_kontrol_berikut",
    jadwalLabel: (nama) => `ANC Kontrol: ${nama}`,
    defaultCara: "Poskesdes",
    redirectToSchedule: true,
    apiCreate: (data) => ancApi.create(data as Partial<AncRecord>),
  })

  handleRecordSubmission({
    form: formKB,
    select: selectPasienKB,
    infoElement: infoPasienKB,
    successMessage: (date) => (date ? `Rekam KB tersimpan. Jadwal kontrol KB pada ${formatTanggal(date)} otomatis ditambahkan.` : "Rekam KB tersimpan."),
    recordPrefix: "KB",
    jadwalKeyName: "KB Kontrol",
    jadwalField: "jadwal_kontrol_kb",
    jadwalLabel: (nama, data) => `KB Kontrol: ${nama} (${data.metode_kb || "-"})`,
    defaultCara: "Telepon/WA",
    redirectToSchedule: true,
    apiCreate: (data) => kbApi.create(data as Partial<KbRecord>),
  })

  handleRecordSubmission({
    form: formLansia,
    select: selectPasienLansia,
    infoElement: infoPasienLansia,
    successMessage: (date) =>
      date ? `Rekam Lansia tersimpan. Jadwal kontrol pada ${formatTanggal(date)} otomatis ditambahkan.` : "Rekam Lansia tersimpan.",
    recordPrefix: "LANSIA",
    jadwalKeyName: "Lansia Kontrol",
    jadwalField: "jadwal_kontrol_lansia",
    jadwalLabel: (nama) => `Kontrol Lansia: ${nama}`,
    defaultCara: "Telepon/WA",
    redirectToSchedule: true,
    apiCreate: (data) => lansiaApi.create(data as Partial<LansiaRecord>),
  })

  const renderAncList = () => {
    if (!rekamList) return
    const data = cachedAnc
    if (!data.length) {
      rekamList.textContent = "Belum ada kunjungan terdaftar."
      return
    }
    rekamList.innerHTML = data
      .slice(-5)
      .reverse()
      .map((record) => {
        const ringkasan = record.ringkasan_kunjungan || ""
        const trimmed = ringkasan.length > 80 ? `${ringkasan.substring(0, 80)}...` : ringkasan
        return `<div style="padding:8px;border-bottom:1px dashed #eef2f3">
          <strong>${record.pasien_nama || "—"}</strong>
          <div class="muted" style="font-size:13px">Tgl: ${record.tanggal || "—"} — ${trimmed || "—"}</div>
        </div>`
      })
      .join("")
  }

  const updateLaporan = () => {
    const pendaftar = getPendaftar().length
    const anc = cachedAnc.length
    const kb = cachedKb.length
    const lansia = cachedLansia.length
    const jadwal = cachedJadwal
    const jadwalAktif = jadwal.filter((item) => hitungStatus(item.tanggal) !== "lewat").length

    if (laporanElements.totalPendaftar) laporanElements.totalPendaftar.textContent = String(pendaftar)
    if (laporanElements.totalAnc) laporanElements.totalAnc.textContent = String(anc)
    if (laporanElements.totalKb) laporanElements.totalKb.textContent = String(kb)
    if (laporanElements.totalLansia) laporanElements.totalLansia.textContent = String(lansia)
    if (laporanElements.totalJadwal) laporanElements.totalJadwal.textContent = String(jadwalAktif)

    if (laporanElements.jadwalTable) {
      const header = `
        <div class="header">
          <span>No</span><span>Pasien</span><span>Tanggal</span><span>Jenis</span>
        </div>
      `
      if (!jadwal.length) {
        laporanElements.jadwalTable.innerHTML =
          header + '<div style="grid-template-columns:1fr; text-align:center; padding:10px;">Tidak ada jadwal.</div>'
        return
      }
      const list = jadwal
        .filter((item) => hitungStatus(item.tanggal) !== "lewat")
        .slice(0, 5)
        .map(
          (item, idx) => `
          <div>
            <span>${idx + 1}</span>
            <span>${item.nama}</span>
            <span>${formatTanggal(item.tanggal)}</span>
            <span>${item.jenis}</span>
          </div>
        `,
        )
        .join("")
      laporanElements.jadwalTable.innerHTML = header + list
    }
  }

  const loadEducation = async () => {
    try {
      const data = await educationApi.getAll()
      cachedEducation = data
      if (!educationList) return
      educationList.innerHTML = data
        .map(
          (item) => `
        <div style="padding:12px;border-radius:10px;background:linear-gradient(180deg,#fff,#fbfbfb);border:1px solid #f1f7f7">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <strong style="font-size:16px;">${item.title}</strong>
            <button class="small-btn" style="background:var(--danger); color:#fff; margin-left:10px;" data-delete-edu="${item.id}">Hapus</button>
          </div>
          <p class="muted" style="margin:6px 0 0">${item.body}</p>
        </div>
      `,
        )
        .join("")

      const deleteButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-delete-edu]"))
      deleteButtons.forEach((btn) => {
        addListener(btn, "click", async (event) => {
          event.preventDefault()
          const id = btn.dataset.deleteEdu
          if (!id) return
          if (window.confirm("Yakin ingin menghapus materi edukasi ini?")) {
            try {
              await educationApi.delete(id)
              await loadEducation()
            } catch (error) {
              console.error("Error deleting education:", error)
              window.alert("Gagal menghapus materi edukasi.")
            }
          }
        })
      })
    } catch (error) {
      console.error("Error loading education:", error)
    }
  }

  const showPage = (name: string) => {
    const hashName = name.split("?")[0]
    pages.forEach((page) => page.classList.toggle("active", page.id === hashName))
    navLinks.forEach((link) => link.classList.toggle("active", link.dataset.route === hashName))
    if (!name.includes("?")) {
      window.location.hash = name
    }
    const pageEl = document.getElementById(hashName)
    if (pageEl) {
      pageEl.scrollTop = 0
    }

    if (hashName === "anc-detail") {
      populateDropdown(selectPasienANC, infoPasienANC)
      setupPasienSearch(selectPasienANC)
    }
    if (hashName === "pelayanan-kb") {
      populateDropdown(selectPasienKB, infoPasienKB)
      setupPasienSearch(selectPasienKB)
    }
    if (hashName === "lansia-detail") {
      populateDropdown(selectPasienLansia, infoPasienLansia)
      setupPasienSearch(selectPasienLansia)
    }
    // Jadwal is now handled by the component itself
    if (hashName === "laporan" || hashName === "ekspor") updateLaporan()
    if (hashName === "edukasi") loadEducation()
  }

  const initialHash = window.location.hash.replace("#", "") || "home"
  showPage(initialHash)
  
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "") || "home"
    showPage(hash)
  })

  navLinks.forEach((link) => {
    addListener(link, "click", (event) => {
      event.preventDefault()
      if (link.dataset.route) {
        showPage(link.dataset.route)
      }
    })
  })

  dataLinkElements.forEach((element) => {
    addListener(element, "click", (event) => {
      event.preventDefault()
      const targetPage = element.dataset.link
      if (targetPage) {
        showPage(targetPage)
      }
    })
  })

  if (formEdukasi) {
    addListener(formEdukasi, "submit", async (event) => {
      event.preventDefault()
      const formData = new FormData(formEdukasi)
      const formObj = Object.fromEntries(formData.entries()) as Record<string, string>
      try {
        await educationApi.create({
          id: `E-${Date.now().toString(36)}`,
          title: formObj.title,
          body: formObj.body,
        })
        formEdukasi.reset()
        await loadEducation()
        window.alert("Materi edukasi berhasil ditambahkan!")
      } catch (error) {
        console.error("Error creating education:", error)
        window.alert("Gagal menambahkan materi edukasi.")
      }
    })
  }

  addListener(printEducationButton, "click", () => {
    window.alert('Browser akan membuka dialog Cetak. Pilih "Simpan sebagai PDF" atau "Print" untuk ekspor.')
    window.print()
  })

  // Export handlers with detailed data
  const getDetailedPasienData = () => {
    return getPendaftar().map((item) => ({
      "Nomor CM": item.nomor_cm || "",
      "ID Pasien": item.id,
      "Nama Lengkap": item.nama,
      "NIK": item.nik || "",
      "No. KK": item.no_kk || "",
      "No. HP": item.no_hp,
      "No. KIS": item.no_kis || "",
      "Pendidikan": item.pendidikan || "",
      "Alamat": item.alamat || "",
      "Usia Kehamilan (minggu)": item.usia_kehamilan || 0,
      "Tanggal Daftar": item.tgl_daftar,
      "Created At": item.created_at || "",
      "Updated At": item.updated_at || "",
    }))
  }

  const getDetailedJadwalData = () => {
    const pasienList = getPendaftar()
    return cachedJadwal.map((schedule) => {
      const pasien = pasienList.find((p) => p.id === schedule.pasien_id)
      return {
        "ID Jadwal": schedule.id,
        "Nama/Kegiatan": schedule.nama,
        "Tanggal": schedule.tanggal,
        "Jenis Kegiatan": schedule.jenis,
        "Cara Kontak": schedule.cara,
        "Pasien ID": schedule.pasien_id || "",
        "Nomor CM Pasien": pasien?.nomor_cm || "",
        "Nama Pasien": pasien?.nama || "",
        "No. HP Pasien": pasien?.no_hp || "",
        "Created At": schedule.created_at || "",
        "Updated At": schedule.updated_at || "",
      }
    })
  }

  const getDetailedAncData = () => {
    return cachedAnc.map((record) => ({
      "ID Rekam": record.id,
      "Pasien ID": record.pasien_id || "",
      "Nama Pasien": record.pasien_nama || "",
      "Tanggal Kunjungan": record.tanggal || "",
      "Kunjungan Ke": record.kunjungan_ke || "",
      "Status K": record.k_status || "",
      "Status USG": record.usg_status || "",
      "Status 4T": record.status_4t || "",
      "Gravida": record.gravida || "",
      "Para": record.para || "",
      "Abortus": record.abortus || "",
      "HPHT": record.hpht || "",
      "HPL": record.hpl || "",
      "Keluhan Utama": record.keluhan_utama || "",
      "TD (mmHg)": record.td || "",
      "Nadi (bpm)": record.nadi || "",
      "Suhu (°C)": record.suhu || "",
      "BB (kg)": record.bb || "",
      "TB (cm)": record.tb || "",
      "Edema": record.edema || "",
      "DJJ (bpm)": record.djj || "",
      "TFU (cm)": record.tfu || "",
      "Posisi Janin": record.posisi_janin || "",
      "Gerak Janin": record.gerak_janin || "",
      "Fe Diberikan": record.fe_diberikan || "",
      "Saran Gizi": record.saran_gizi || "",
      "HB (g/dL)": record.hb || "",
      "Urin": record.urin || "",
      "Penunjang Lain": record.penunjang_lain || "",
      "Faktor Risiko": record.faktor_risiko || "",
      "Klasifikasi Risiko": record.klasifikasi_risiko || "",
      "Perlu Rujukan": record.perlu_rujukan || "",
      "Tujuan Rujukan": record.tujuan_rujukan || "",
      "Alasan Rujukan": record.alasan_rujukan || "",
      "Tatalaksana Awal": record.tatalaksana_awal || "",
      "Ringkasan Kunjungan": record.ringkasan_kunjungan || "",
      "Jadwal Kontrol Berikut": record.jadwal_kontrol_berikut || "",
      "Created At": record.created_at || "",
      "Updated At": record.updated_at || "",
    }))
  }

  const getDetailedKbData = () => {
    return cachedKb.map((record) => ({
      "ID Rekam": record.id,
      "Pasien ID": record.pasien_id || "",
      "Nama Pasien": record.pasien_nama || "",
      "Tanggal Kunjungan": record.tanggal || "",
      "Status Peserta": record.status_peserta || "",
      "Metode KB": record.metode_kb || "",
      "Tanggal Mulai": record.tgl_mulai || "",
      "Rencana Tindakan": record.rencana_tindakan || "",
      "Keterangan": record.keterangan || "",
      "Jadwal Kontrol KB": record.jadwal_kontrol_kb || "",
      "Created At": record.created_at || "",
      "Updated At": record.updated_at || "",
    }))
  }

  const getDetailedLansiaData = () => {
    return cachedLansia.map((record) => ({
      "ID Rekam": record.id,
      "Pasien ID": record.pasien_id || "",
      "Nama Pasien": record.pasien_nama || "",
      "Tanggal Kunjungan": record.tanggal || "",
      "Keluhan": record.keluhan_lansia || "",
      "Diagnosa": record.diagnosa_lansia || "",
      "BB (kg)": record.bb || "",
      "TB (cm)": record.tb || "",
      "TD (mmHg)": record.td || "",
      "GDS (mg/dL)": record.gds || "",
      "Asam Urat (mg/dL)": record.asam_urat || "",
      "Kolesterol (mg/dL)": record.kolesterol || "",
      "Tindakan": record.tindakan_lansia || "",
      "Jadwal Kontrol Berikut": record.jadwal_kontrol_lansia || "",
      "Created At": record.created_at || "",
      "Updated At": record.updated_at || "",
    }))
  }

  const exportData = (type: "pendaftar" | "jadwal" | "anc" | "kb" | "lansia" | "summary", format: "csv" | "xlsx") => {
    let data: Record<string, unknown>[] = []
    let filename = ""
    let sheetName = ""

    switch (type) {
      case "pendaftar":
        data = getDetailedPasienData()
        filename = format === "csv" ? "pendaftar_poskesdes.csv" : "pendaftar_poskesdes.xlsx"
        sheetName = "Data Pasien"
        break
      case "jadwal":
        data = getDetailedJadwalData()
        filename = format === "csv" ? "jadwal_poskesdes.csv" : "jadwal_poskesdes.xlsx"
        sheetName = "Data Jadwal"
        break
      case "anc":
        data = getDetailedAncData()
        filename = format === "csv" ? "rekam_anc_poskesdes.csv" : "rekam_anc_poskesdes.xlsx"
        sheetName = "Rekam ANC"
        break
      case "kb":
        data = getDetailedKbData()
        filename = format === "csv" ? "rekam_kb_poskesdes.csv" : "rekam_kb_poskesdes.xlsx"
        sheetName = "Rekam KB"
        break
      case "lansia":
        data = getDetailedLansiaData()
        filename = format === "csv" ? "rekam_lansia_poskesdes.csv" : "rekam_lansia_poskesdes.xlsx"
        sheetName = "Rekam Lansia"
        break
      case "summary":
        const ancData = cachedAnc
        const kbData = cachedKb
        const months = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ]

        const summaryMap: Record<
          string,
          {
            Bulan: string
            "K1 Total": number
            "K Lanjut (K4, K5, K6)": number
            "Ibu Hamil Komplikasi": number
            "KB Baru": number
            "KB Drop Out/Gagal/Komplikasi": number
            "KB Aktif": number
          }
        > = {}

        const ensureMonth = (key: string) => {
          if (!summaryMap[key]) {
            summaryMap[key] = {
              Bulan: `${months[parseInt(key.substring(5, 7), 10) - 1]} ${key.substring(0, 4)}`,
              "K1 Total": 0,
              "K Lanjut (K4, K5, K6)": 0,
              "Ibu Hamil Komplikasi": 0,
              "KB Baru": 0,
              "KB Drop Out/Gagal/Komplikasi": 0,
              "KB Aktif": 0,
            }
          }
        }

        ancData.forEach((record) => {
          const date = record.tanggal || ""
          const ym = date.substring(0, 7)
          if (!ym) return
          ensureMonth(ym)
          if (record.k_status === "K1") {
            summaryMap[ym]["K1 Total"]++
          }
          if (["K-Lanjut", "K4", "K5", "K6"].includes(record.k_status || "")) {
            summaryMap[ym]["K Lanjut (K4, K5, K6)"]++
          }
          if (["tinggi", "gawat_darurat"].includes(record.klasifikasi_risiko || "")) {
            summaryMap[ym]["Ibu Hamil Komplikasi"]++
          }
        })

        kbData.forEach((record) => {
          const date = record.tanggal || ""
          const ym = date.substring(0, 7)
          if (!ym) return
          ensureMonth(ym)
          if (record.status_peserta === "Baru") {
            summaryMap[ym]["KB Baru"]++
          }
          if (["DropOut", "Gagal", "Komplikasi"].includes(record.status_peserta || "")) {
            summaryMap[ym]["KB Drop Out/Gagal/Komplikasi"]++
          }
          summaryMap[ym]["KB Aktif"]++
        })

        data = Object.keys(summaryMap)
          .sort()
          .map((key) => summaryMap[key])

        filename = format === "csv" ? "laporan_bulanan_ringkas.csv" : "laporan_bulanan_ringkas.xlsx"
        sheetName = "Laporan Bulanan"
        break
    }

    if (!data.length) {
      window.alert("Tidak ada data untuk diekspor.")
      return
    }

    if (format === "csv") {
      downloadCSV(filename, data)
    } else {
      downloadXLSX(filename, data, sheetName)
    }
  }

  // Export monthly report (detailed by month and category)
  const exportMonthlyReport = (category: "anc" | "kb" | "lansia", month: string, format: "csv" | "xlsx") => {
    const monthParts = month.split("-")
    if (monthParts.length !== 2) {
      window.alert("Format bulan tidak valid. Gunakan format YYYY-MM")
      return
    }

    const year = parseInt(monthParts[0])
    const monthNum = parseInt(monthParts[1])
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ]
    const monthLabel = `${monthNames[monthNum - 1]} ${year}`

    let data: Record<string, unknown>[] = []
    let filename = ""
    let sheetName = ""

    switch (category) {
      case "anc":
        data = cachedAnc
          .filter((record) => {
            const recordDate = record.tanggal || ""
            return recordDate.startsWith(month)
          })
          .map((record) => ({
            "ID Rekam": record.id,
            "Pasien ID": record.pasien_id || "",
            "Nama Pasien": record.pasien_nama || "",
            "Tanggal Kunjungan": record.tanggal || "",
            "Kunjungan Ke": record.kunjungan_ke || "",
            "Status K": record.k_status || "",
            "Status USG": record.usg_status || "",
            "Status 4T": record.status_4t || "",
            "Gravida": record.gravida || "",
            "Para": record.para || "",
            "Abortus": record.abortus || "",
            "HPHT": record.hpht || "",
            "HPL": record.hpl || "",
            "Keluhan Utama": record.keluhan_utama || "",
            "TD (mmHg)": record.td || "",
            "Nadi (bpm)": record.nadi || "",
            "Suhu (°C)": record.suhu || "",
            "BB (kg)": record.bb || "",
            "TB (cm)": record.tb || "",
            "Edema": record.edema || "",
            "DJJ (bpm)": record.djj || "",
            "TFU (cm)": record.tfu || "",
            "Posisi Janin": record.posisi_janin || "",
            "Gerak Janin": record.gerak_janin || "",
            "Fe Diberikan": record.fe_diberikan || "",
            "Saran Gizi": record.saran_gizi || "",
            "HB (g/dL)": record.hb || "",
            "Urin": record.urin || "",
            "Penunjang Lain": record.penunjang_lain || "",
            "Faktor Risiko": record.faktor_risiko || "",
            "Klasifikasi Risiko": record.klasifikasi_risiko || "",
            "Perlu Rujukan": record.perlu_rujukan || "",
            "Tujuan Rujukan": record.tujuan_rujukan || "",
            "Alasan Rujukan": record.alasan_rujukan || "",
            "Tatalaksana Awal": record.tatalaksana_awal || "",
            "Ringkasan Kunjungan": record.ringkasan_kunjungan || "",
            "Jadwal Kontrol Berikut": record.jadwal_kontrol_berikut || "",
            "Created At": record.created_at || "",
            "Updated At": record.updated_at || "",
          }))
        filename = format === "csv" ? `register_anc_${month}.csv` : `register_anc_${month}.xlsx`
        sheetName = `Register ANC ${monthLabel}`
        break

      case "kb":
        data = cachedKb
          .filter((record) => {
            const recordDate = record.tanggal || ""
            return recordDate.startsWith(month)
          })
          .map((record) => ({
            "ID Rekam": record.id,
            "Pasien ID": record.pasien_id || "",
            "Nama Pasien": record.pasien_nama || "",
            "Tanggal Kunjungan": record.tanggal || "",
            "Status Peserta": record.status_peserta || "",
            "Metode KB": record.metode_kb || "",
            "Tanggal Mulai": record.tgl_mulai || "",
            "Rencana Tindakan": record.rencana_tindakan || "",
            "Keterangan": record.keterangan || "",
            "Jadwal Kontrol KB": record.jadwal_kontrol_kb || "",
            "Created At": record.created_at || "",
            "Updated At": record.updated_at || "",
          }))
        filename = format === "csv" ? `register_kb_${month}.csv` : `register_kb_${month}.xlsx`
        sheetName = `Register KB ${monthLabel}`
        break

      case "lansia":
        data = cachedLansia
          .filter((record) => {
            const recordDate = record.tanggal || ""
            return recordDate.startsWith(month)
          })
          .map((record) => ({
            "ID Rekam": record.id,
            "Pasien ID": record.pasien_id || "",
            "Nama Pasien": record.pasien_nama || "",
            "Tanggal Kunjungan": record.tanggal || "",
            "Keluhan": record.keluhan_lansia || "",
            "Diagnosa": record.diagnosa_lansia || "",
            "BB (kg)": record.bb || "",
            "TB (cm)": record.tb || "",
            "TD (mmHg)": record.td || "",
            "GDS (mg/dL)": record.gds || "",
            "Asam Urat (mg/dL)": record.asam_urat || "",
            "Kolesterol (mg/dL)": record.kolesterol || "",
            "Tindakan": record.tindakan_lansia || "",
            "Jadwal Kontrol Berikut": record.jadwal_kontrol_lansia || "",
            "Created At": record.created_at || "",
            "Updated At": record.updated_at || "",
          }))
        filename = format === "csv" ? `register_lansia_${month}.csv` : `register_lansia_${month}.xlsx`
        sheetName = `Register Lansia ${monthLabel}`
        break
    }

    if (!data.length) {
      window.alert(`Tidak ada data ${category} untuk bulan ${monthLabel}.`)
      return
    }

    if (format === "csv") {
      downloadCSV(filename, data)
    } else {
      downloadXLSX(filename, data, sheetName)
    }
  }

  // Attach export button handlers (new version with CSV/XLSX support)
  document.querySelectorAll('[data-export][data-format]').forEach((button) => {
    const exportType = button.getAttribute("data-export") as "pendaftar" | "jadwal" | "anc" | "kb" | "lansia" | "summary"
    const format = button.getAttribute("data-format") as "csv" | "xlsx"
    if (exportType && format) {
      addListener(button, "click", () => exportData(exportType, format))
    }
  })

  // Attach monthly report export handlers with event delegation
  const attachMonthlyExportHandlers = () => {
    // Use event delegation for buttons that may be re-rendered
    const eksporSection = document.getElementById("ekspor")
    if (eksporSection) {
      addListener(eksporSection, "click", (event) => {
        const target = event.target as HTMLElement
        const button = target.closest('[data-export-monthly][data-format]') as HTMLElement
        if (button) {
          const category = button.getAttribute("data-export-monthly") as "anc" | "kb" | "lansia"
          const format = button.getAttribute("data-format") as "csv" | "xlsx"
          const month = button.getAttribute("data-month") || ""
          
          if (category && format) {
            if (!month) {
              window.alert("Silakan pilih bulan terlebih dahulu.")
              return
            }
            exportMonthlyReport(category, month, format)
          }
        }
      })
    }
  }

  // Initial attach
  attachMonthlyExportHandlers()

  // Initial load
  loadAllData()

  const cleanup = () => {
    listeners.forEach(({ target, type, listener }) => {
      target.removeEventListener(type, listener)
    })
    listeners.length = 0
  }

  window.__poskesdesCleanup__ = cleanup

  return cleanup
}
