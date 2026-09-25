import { createContext, useContext } from 'react'

export interface MockUser {
  name: string
  email: string
  initials: string
}

export interface AuthContextValue {
  user: MockUser | null
  login: (email: string, password: string) => void
  loginWithGoogle: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}