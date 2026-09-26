import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchInstitutionsApi } from '../../services/api'
import type { Institution } from '../../types'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [activeInstitution, setActiveInstitutionState] = useState<string>(
    () => localStorage.getItem('smartlux_institution') || 'dekut'
  )
  const [institutions, setInstitutions] = useState<Institution[]>([])

  // Fetch institutions on mount for the institution selector UI
  useEffect(() => {
    fetchInstitutionsApi()
      .then((data) => setInstitutions(data))
      .catch((err) => console.warn('Failed to load institutions list:', err))
  }, [])

  const setActiveInstitution = (id: string) => {
    setActiveInstitutionState(id)
    localStorage.setItem('smartlux_institution', id)
  }

  const value = useMemo(
    () => ({
      user: null,
      token: null,
      activeInstitution,
      institutions,
      isLoading: false,
      setActiveInstitution,
    }),
    [activeInstitution, institutions]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}