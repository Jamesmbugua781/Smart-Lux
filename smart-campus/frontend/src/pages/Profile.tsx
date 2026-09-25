import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../components/auth/AuthContext'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { LanguageToggle } from '../components/ui/LanguageToggle'
import { PageHeader } from '../components/ui/PageHeader'

export function Profile() {
  const navigate = useNavigate()
  const { user, logout, institutions, activeInstitution } = useAuth()
  const [displayName, setDisplayName] = useState(user?.full_name ?? '')
  const [saved, setSaved] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (!user && !isSigningOut) {
      navigate('/login', { replace: true })
    }
  }, [isSigningOut, navigate, user])

  if (!user) return null

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'SL'

  const userInstitution = institutions.find((i) => i.id === (user.institution_id || activeInstitution))

  const handleSave = () => {
    setSaved(true)
  }

  const handleSignOut = () => {
    setIsSigningOut(true)
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader title="My Profile" subtitle="Manage your account details and campus assistant preferences." />

          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-lg font-bold text-[var(--color-primary)]">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-[#0B1F33]">{user.full_name}</p>
                  <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  <Building2 size={14} className="text-[var(--color-primary)]" />
                  <span>Institution: {userInstitution?.name || 'Dedan Kimathi University'}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[var(--color-primary-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)]">
                  <ShieldCheck size={14} />
                  <span>Role: {user.role.toUpperCase()} ({user.auth_provider})</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#0B1F33]">Account Settings</h2>
              <p className="mt-1 text-sm text-slate-600">Update your public display name across Smart Lux.</p>
              <label htmlFor="display-name" className="mt-5 block text-sm font-medium text-[#0B1F33]">Display name</label>
              <Input
                id="display-name"
                className="mt-1.5"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value)
                  setSaved(false)
                }}
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button type="button" onClick={handleSave}>Save changes</Button>
                {saved ? <p className="text-sm text-[var(--color-status)]">Profile updated successfully.</p> : null}
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#0B1F33]">Preferences</h2>
              <p className="mt-1 text-sm text-slate-600">Choose the language used by the campus experience.</p>
              <div className="mt-5 flex items-center justify-between rounded-xl border border-[#edf0f2] bg-[#f8f8f5] p-3">
                <div>
                  <p className="text-sm font-medium text-[#0B1F33]">Interface language</p>
                  <p className="mt-1 text-xs text-slate-500">English / Kiswahili / Sheng</p>
                </div>
                <LanguageToggle />
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Button type="button" variant="ghost" onClick={handleSignOut} className="gap-2">
              <LogOut size={16} />
              Sign out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}