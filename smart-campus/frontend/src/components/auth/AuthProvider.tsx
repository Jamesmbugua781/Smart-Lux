import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchCurrentMe, fetchInstitutionsApi, googleAuthApi, loginApi, registerApi } from '../../services/api'
import type { Institution, User } from '../../types'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smartlux_token'))
  const [user, setUser] = useState<User | null>(null)
  const [activeInstitution, setActiveInstitutionState] = useState<string>(
    () => localStorage.getItem('smartlux_institution') || 'dekut'
  )
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch institutions on mount
  useEffect(() => {
    fetchInstitutionsApi()
      .then((data) => setInstitutions(data))
      .catch((err) => console.warn('Failed to load institutions list:', err))
  }, [])

  // Restore authenticated session on mount
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    fetchCurrentMe(token)
      .then((userData) => {
        setUser(userData)
        if (userData.institution_id) {
          setActiveInstitutionState(userData.institution_id)
        }
      })
      .catch(() => {
        localStorage.removeItem('smartlux_token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const setActiveInstitution = (id: string) => {
    setActiveInstitutionState(id)
    localStorage.setItem('smartlux_institution', id)
  }

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password)
    localStorage.setItem('smartlux_token', res.access_token)
    setToken(res.access_token)
    setUser(res.user)
    if (res.user.institution_id) {
      setActiveInstitution(res.user.institution_id)
    }
  }

  const register = async (
    email: string,
    password: string,
    fullName: string,
    institutionId = activeInstitution,
    role = 'student',
  ) => {
    const res = await registerApi(email, password, fullName, institutionId, role)
    localStorage.setItem('smartlux_token', res.access_token)
    setToken(res.access_token)
    setUser(res.user)
    if (res.user.institution_id) {
      setActiveInstitution(res.user.institution_id)
    }
  }

  const loginWithGoogle = async (email: string, fullName = '', avatarUrl = '') => {
    // Generate OAuth session token placeholder
    const googleToken = `google-oauth-${Date.now()}`
    const res = await googleAuthApi(googleToken, email, fullName, avatarUrl, activeInstitution)
    localStorage.setItem('smartlux_token', res.access_token)
    setToken(res.access_token)
    setUser(res.user)
    if (res.user.institution_id) {
      setActiveInstitution(res.user.institution_id)
    }
  }

  const logout = () => {
    localStorage.removeItem('smartlux_token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      activeInstitution,
      institutions,
      isLoading,
      setActiveInstitution,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, token, activeInstitution, institutions, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}