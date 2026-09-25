import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brand } from '../components/layout/Brand'
import { Footer } from '../components/layout/Footer'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../components/auth/AuthContext'

// TODO: Replace mock login logic with real API calls to POST /auth/login and POST /auth/google once backend is ready.

export function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const completeMockLogin = () => navigate('/profile')

  const handleGoogleLogin = () => {
    loginWithGoogle()
    completeMockLogin()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: { email?: string; password?: string } = {}

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Enter your password.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    login(email.trim(), password)
    completeMockLogin()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7F8] text-[#0B1F33]">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Brand />
            <Badge>Temporary demo</Badge>
            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#0B1F3A]">Sign in to SMART LUX</h1>
            <p className="mt-2 text-sm text-slate-600">Access your campus assistant and saved preferences.</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe4e8] bg-white px-4 py-3 text-sm font-medium text-[#0B1F33] transition hover:bg-[#f8f8f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            <span className="text-base font-bold leading-none text-[#4285F4]" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#0B1F33]">Email address</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email ? <p id="email-error" className="mt-1.5 text-xs text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#0B1F33]">Password</label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password ? <p id="password-error" className="mt-1.5 text-xs text-red-600">{errors.password}</p> : null}
            </div>

            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}