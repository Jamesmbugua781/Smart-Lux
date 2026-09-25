import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type MockUser } from './AuthContext'

// TODO: Replace mock user data and actions with real authentication API calls once the backend is ready.

const createMockUser = (email: string): MockUser => ({
  name: 'Charles Waithaka',
  email,
  initials: 'CW',
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null)

  const value = useMemo(() => ({
    user,
    login: (email: string, password: string) => {
      void password
      setUser(createMockUser(email))
    },
    loginWithGoogle: () => setUser(createMockUser('charles@example.com')),
    logout: () => setUser(null),
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}