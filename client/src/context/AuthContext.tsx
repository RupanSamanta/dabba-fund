import { useState, type ReactNode } from "react"
import { AuthContext, type AuthData, type SignupData } from "./auth-context"
import { api } from "@/lib/api"

const AUTH_STORAGE_KEY = "dabba-fund-auth-data"

const getSavedAuthData = (): AuthData | null => {
  const savedAuthData = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!savedAuthData) return null

  try {
    return JSON.parse(savedAuthData) as AuthData
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(getSavedAuthData)
  const [isLoading, setIsLoading] = useState(false)

  const saveAuthData = (user: AuthData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    setAuthData(user)
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const response = await api.post<AuthData>("/auth/signup", data)
      saveAuthData(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.post<AuthData>("/auth/signin", {
        email,
        password,
      })
      saveAuthData(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthData(null)
  }

  return (
    <AuthContext.Provider
      value={{
        authData,
        isAuthenticated: authData !== null,
        isLoading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

