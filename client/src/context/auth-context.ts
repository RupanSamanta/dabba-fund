import { createContext } from "react"

export type AuthData = {
  id: string
  firstname: string
  lastname: string
  email: string
  isAdmin: boolean
  createdAt?: string
}

export type SignupData = {
  firstname: string
  lastname: string
  email: string
  password: string
}

export type AuthContextValue = {
  authData: AuthData | null
  isAuthenticated: boolean
  isLoading: boolean
  signup: (data: SignupData) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)