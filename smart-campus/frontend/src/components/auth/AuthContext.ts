import { createContext, useContext } from 'react'
import type { Institution, User } from '../../types'

export interface AuthContextValue {
  user: User | null
  token: string | null
  activeInstitution: string
  institutions: Institution[]
  isLoading: boolean
  setActiveInstitution: (institutionId: string) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, institutionId?: string, role?: string) => Promise<void>
  loginWithGoogle: (email: string, fullName?: string, avatarUrl?: string) => Promise<void>
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