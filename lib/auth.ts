/**
 * Authentication utilities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/web-bidan-main/api'

export interface AdminInfo {
  id: number
  username: string
  role: 'superadmin' | 'regular'
}

export interface AuthResponse {
  ok: boolean
  admin?: AdminInfo
  token?: string
  message?: string
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin.php/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (data.ok && data.token && data.admin) {
      setToken(data.token)
      setAdminInfo(data.admin)
    }

    return data
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    }
  }
}

export function logout(): void {
  removeToken()
  removeAdminInfo()
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('poskesdes_token')
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('poskesdes_token', token)
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('poskesdes_token')
}

export function getAdminInfo(): AdminInfo | null {
  if (typeof window === 'undefined') return null
  const info = localStorage.getItem('poskesdes_admin')
  if (!info) return null
  try {
    return JSON.parse(info)
  } catch {
    return null
  }
}

export function setAdminInfo(admin: AdminInfo): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('poskesdes_admin', JSON.stringify(admin))
}

export function removeAdminInfo(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('poskesdes_admin')
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

export function isSuperAdmin(): boolean {
  const admin = getAdminInfo()
  return admin?.role === 'superadmin'
}

