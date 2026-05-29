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

