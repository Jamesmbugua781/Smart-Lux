import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, KeyRound, Loader2, Lock, Mail, ShieldCheck, User as UserIcon } from 'lucide-react'
import { Brand } from '../components/layout/Brand'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'
import { useAuth } from '../components/auth/AuthContext'

export function Login() {
  const navigate = useNavigate()
  const { login, register, loginWithGoogle, institutions, activeInstitution, setActiveInstitution } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState(activeInstitution)
  const [role, setRole] = useState<'student' | 'admin'>('student')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const targetEmail = email.trim() || `user_${Math.floor(Math.random() * 10000)}@gmail.com`
      const targetName = fullName.trim() || 'Smart Lux User'
      await loginWithGoogle(targetEmail, targetName)
      navigate('/profile')
    } catch (err: any) {
      setErrors({ general: err.message || 'Google sign-in failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: { email?: string; password?: string; general?: string } = {}

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Enter your password.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      setIsLoading(true)
      if (mode === 'login') {
        await login(email.trim(), password)
      } else {
        await register(email.trim(), password, fullName.trim(), selectedInstitution, role)
      }
      navigate(role === 'admin' ? '/admin' : '/profile')
    } catch (err: any) {
      setErrors({ general: err.message || (mode === 'login' ? 'Invalid email or password.' : 'Registration failed.') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7F8] text-[#0B1F33]">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Brand />
            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#0B1F3A]">
              {mode === 'login' ? 'Sign in to SMART LUX' : 'Create SMART LUX Account'}
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              {mode === 'login'
                ? 'Access your campus assistant, saved history, and university tools.'
                : 'Join Smart Lux to access multi-campus AI guidance and admin portal.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-6 flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}) }}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                mode === 'login' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrors({}) }}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                mode === 'register' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {errors.general ? (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 text-center">
              {errors.general}
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
            {mode === 'register' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Wanjiru"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-[#0B1F3A] placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@dekut.ac.ke"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-[#0B1F3A] placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
              {errors.email ? <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-[#0B1F3A] placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
              {errors.password ? <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
            </div>

            {mode === 'register' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">University / Campus</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <select
                      value={selectedInstitution}
                      onChange={(e) => {
                        setSelectedInstitution(e.target.value)
                        setActiveInstitution(e.target.value)
                      }}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-[#0B1F3A] bg-white focus:border-[var(--color-primary)] focus:outline-none"
                    >
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                        role === 'student'
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                        role === 'admin'
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      👑 Admin
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] py-3 text-xs font-semibold text-white transition hover:bg-[#153460] disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            <span className="text-[10px] uppercase font-semibold">or</span>
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe4e8] bg-white px-4 py-2.5 text-xs font-medium text-[#0B1F33] transition hover:bg-[#f8f8f5] disabled:opacity-50"
          >
            <span className="text-base font-bold leading-none text-[#4285F4]" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck size={12} />
            <span>Secure JWT Authentication • Multi-Tenant Campus Isolation</span>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}