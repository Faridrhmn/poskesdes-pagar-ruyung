/**
 * API utilities for Poskesdes
 */

import { getToken } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/web-bidan-main/api'

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  requireAuth?: boolean
}

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, requireAuth = false } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (requireAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else {
      throw new Error('Authentication required')
    }
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config)
    const data = await response.json()


    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.alert('Sesi Login Anda telah habis (Token Expired). Anda akan diarahkan ke halaman Login.')
          window.location.href = '/admin/login'
        }
      }
      throw new Error(data.message || `API request failed: ${response.status}`)
    }


    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error occurred')
  }
}

// =====================================================
// PASIEN API
// =====================================================

export interface Pasien {
  id?: string;
  id_pasien?: string
  nomor_cm: string
  nama: string
  nik?: string
  no_kk?: string
  no_hp: string
  no_kis?: string
  pendidikan?: string
  alamat?: string
  usia_kehamilan?: number
  tgl_daftar: string
  created_at?: string
  updated_at?: string
}

export const pasienApi = {
  getAll: () => apiRequest<Pasien[]>('pasien.php'),
  getOne: (id: string) => apiRequest<Pasien>(`pasien.php/${id}`),
  create: (data: Partial<Pasien>) => apiRequest('pasien.php', { method: 'POST', body: data, requireAuth: true }),
  update: (id: string, data: Partial<Pasien>) => apiRequest(`pasien.php/${id}`, { method: 'PUT', body: data, requireAuth: true }),
  delete: (id: string) => apiRequest(`pasien.php/${id}`, { method: 'DELETE', requireAuth: true }),
}

// =====================================================
// ANC RECORDS API
// =====================================================

export interface AncRecord {
  id?: string;
  id_anc?: string
  pasien_id?: string
  pasien_nama: string
  tanggal: string
  kunjungan_ke?: number
  k_status?: string
  usg_status?: string
  status_4t?: string
  gravida?: number
  para?: number
  abortus?: number
  hpht?: string
  hpl?: string
  keluhan_utama?: string
  td?: string
  nadi?: number
  suhu?: number
  bb?: number
  tb?: number
  edema?: string
  djj?: number
  tfu?: number
  posisi_janin?: string
  gerak_janin?: string
  fe_diberikan?: number
  saran_gizi?: string
  hb?: number
  urin?: string
  penunjang_lain?: string
  faktor_risiko?: string
  klasifikasi_risiko?: string
  perlu_rujukan?: string
  tujuan_rujukan?: string
  alasan_rujukan?: string
  tatalaksana_awal?: string
  ringkasan_kunjungan?: string
  jadwal_kontrol_berikut?: string
  created_at?: string
  updated_at?: string
}

export const ancApi = {
  getAll: () => apiRequest<AncRecord[]>('anc.php'),
  getOne: (id: string) => apiRequest<AncRecord>(`anc.php/${id}`),
  getByPasien: (pasienId: string) => apiRequest<AncRecord[]>(`anc.php/pasien/${pasienId}`),
  create: (data: Partial<AncRecord>) => apiRequest('anc.php', { method: 'POST', body: data, requireAuth: true }),
  delete: (id: string) => apiRequest(`anc.php/${id}`, { method: 'DELETE', requireAuth: true }),
}

// =====================================================
// KB RECORDS API
// =====================================================

export interface KbRecord {
  id?: string;
  id_kb?: string
  pasien_id?: string
  pasien_nama: string
  tanggal: string
  status_peserta: string
  metode_kb?: string
  tgl_mulai?: string
  keterangan?: string
  rencana_tindakan?: string
  jadwal_kontrol_kb?: string
  created_at?: string
  updated_at?: string
}

export const kbApi = {
  getAll: () => apiRequest<KbRecord[]>('kb.php'),
  getOne: (id: string) => apiRequest<KbRecord>(`kb.php/${id}`),
  getByPasien: (pasienId: string) => apiRequest<KbRecord[]>(`kb.php/pasien/${pasienId}`),
  create: (data: Partial<KbRecord>) => apiRequest('kb.php', { method: 'POST', body: data, requireAuth: true }),
  delete: (id: string) => apiRequest(`kb.php/${id}`, { method: 'DELETE', requireAuth: true }),
}

// =====================================================
// LANSIA RECORDS API
// =====================================================

export interface LansiaRecord {
  id?: string;
  id_lansia?: string
  pasien_id?: string
  pasien_nama: string
  tanggal: string
  keluhan_lansia: string
  diagnosa_lansia: string
  bb?: number
  tb?: number
  td: string
  gds?: number
  asam_urat?: number
  kolesterol?: number
  tindakan_lansia?: string
  jadwal_kontrol_lansia?: string
  created_at?: string
  updated_at?: string
}

export const lansiaApi = {
  getAll: () => apiRequest<LansiaRecord[]>('lansia.php'),
  getOne: (id: string) => apiRequest<LansiaRecord>(`lansia.php/${id}`),
  getByPasien: (pasienId: string) => apiRequest<LansiaRecord[]>(`lansia.php/pasien/${pasienId}`),
  create: (data: Partial<LansiaRecord>) => apiRequest('lansia.php', { method: 'POST', body: data, requireAuth: true }),
  delete: (id: string) => apiRequest(`lansia.php/${id}`, { method: 'DELETE', requireAuth: true }),
}

// =====================================================
// JADWAL API
// =====================================================

export interface Jadwal {
  id?: string;
  id_jadwal?: string
  nama: string
  tanggal: string
  jenis: string
  cara: string
  pasien_id?: string
  created_at?: string
  updated_at?: string
}

export const jadwalApi = {
  getAll: () => apiRequest<Jadwal[]>('jadwal.php'),
  getUpcoming: (limit = 5) => apiRequest<Jadwal[]>(`jadwal.php/upcoming?limit=${limit}`),
  getOne: (id: string) => apiRequest<Jadwal>(`jadwal.php/${id}`),
  create: (data: Partial<Jadwal>) => apiRequest('jadwal.php', { method: 'POST', body: data, requireAuth: true }),
  update: (id: string, data: Partial<Jadwal>) => apiRequest(`jadwal.php/${id}`, { method: 'PUT', body: data, requireAuth: true }),
  delete: (id: string) => apiRequest(`jadwal.php/${id}`, { method: 'DELETE', requireAuth: true }),
}

// =====================================================
// EDUCATION MATERIALS API
// =====================================================

export interface EducationMaterial {
  id?: string;
  id_edukasi?: string
  title: string
  body: string
  created_at?: string
  updated_at?: string
}

export const educationApi = {
  getAll: () => apiRequest<EducationMaterial[]>('education.php'),
  getOne: (id: string) => apiRequest<EducationMaterial>(`education.php/${id}`),
  create: (data: Partial<EducationMaterial>) => apiRequest('education.php', { method: 'POST', body: data, requireAuth: true }),
  update: (id: string, data: Partial<EducationMaterial>) => apiRequest(`education.php/${id}`, { method: 'PUT', body: data, requireAuth: true }),
  delete: (id: string) => apiRequest(`education.php/${id}`, { method: 'DELETE', requireAuth: true }),
}

