import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { initFirebaseAuth } from '../services/auth.service'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_KEY = 'coru_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      await initFirebaseAuth()
      const stored = sessionStorage.getItem(AUTH_KEY)
      if (stored === 'true') {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const login = () => {
    sessionStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
