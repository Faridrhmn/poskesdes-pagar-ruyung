"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getToken, removeToken, setToken, login as apiLogin, type AuthResponse } from "@/lib/auth"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated on mount
    const token = getToken()
    setIsAuthenticated(!!token)
    setIsLoading(false)

    // Setup idle timeout (2 hours = 7200000 ms)
    const IDLE_TIMEOUT = 2 * 60 * 60 * 1000
    let timeoutId: NodeJS.Timeout

    const handleLogout = () => {
      removeToken()
      setIsAuthenticated(false)
      window.location.href = '/'
    }

    const resetTimer = () => {
      clearTimeout(timeoutId)
      if (getToken()) {
        timeoutId = setTimeout(handleLogout, IDLE_TIMEOUT)
      }
    }

    // List of events to monitor for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => document.addEventListener(event, resetTimer))
    
    // Initialize timer
    resetTimer()

    return () => {
      clearTimeout(timeoutId)
      events.forEach(event => document.removeEventListener(event, resetTimer))
    }
  }, [])

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiLogin(username, password)
    if (response.ok && response.token) {
      setToken(response.token)
      setIsAuthenticated(true)
    }
    return response
  }

  const logout = () => {
    removeToken()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

