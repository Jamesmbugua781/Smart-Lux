import { createContext, useContext } from 'react'
import type { Institution, User } from '../../types'

export interface AuthContextValue {
  user: User | null
  token: string | null
  activeInstitution: string
  institutions: Institution[]
  isLoading: boolean
  setActiveInstitution: (institutionId: string) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}