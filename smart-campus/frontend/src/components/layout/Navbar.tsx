import { useState } from 'react'
import {
  Building2,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AuthModal } from '../auth/AuthModal'
import { Brand } from './Brand'
import { LanguageToggle } from '../ui/LanguageToggle'

const navItems = [
  { to: '/explore', label: 'Explore' },
  { to: '/campus', label: 'Campus' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/academics', label: 'Academics' },
  { to: '/map', label: 'Map' },
]

export function Navbar() {
  const location = useLocation()
  const { user, logout, activeInstitution, institutions, setActiveInstitution } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userInitials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'SL'

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const openSignIn = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
    closeMobileMenu()
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#e7edf3] bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Left: Brand + Institution */}
          <div className="flex min-w-0 items-center gap-3">
            <Brand className="shrink-0" />

            {institutions.length > 0 && (
              <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-[#f8f9fa] px-2.5 py-1 lg:flex">
                <Building2 size={12} className="shrink-0 text-[var(--color-primary)]" />
                <select
                  value={activeInstitution}
                  onChange={(e) => setActiveInstitution(e.target.value)}
                  className="max-w-[180px] truncate bg-transparent text-[11px] font-semibold text-[#0B1F3A] focus:outline-none cursor-pointer"
                  aria-label="Select institution"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.code} – {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Center: Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F33]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/chat"
              className="hidden items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 md:inline-flex"
              aria-label="Open AI assistant"
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">Assistant</span>
            </Link>

            <LanguageToggle />

            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-100"
                  >
                    <ShieldCheck size={12} className="text-amber-600" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#0B1F33] transition hover:bg-slate-50"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[9px] font-bold text-[var(--color-primary)]">
                    {userInitials}
                  </span>
                  <span className="hidden sm:inline">{user.full_name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="hidden items-center gap-1.5 rounded-lg border border-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)] md:inline-flex"
              >
                <UserRound size={13} />
                Sign In
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 md:hidden">

            {/* Institution selector – mobile */}
            {institutions.length > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-[#f8f9fa] px-3 py-2">
                <Building2 size={13} className="shrink-0 text-[var(--color-primary)]" />
                <select
                  value={activeInstitution}
                  onChange={(e) => { setActiveInstitution(e.target.value); closeMobileMenu() }}
                  className="w-full bg-transparent text-xs font-semibold text-[#0B1F3A] focus:outline-none cursor-pointer"
                  aria-label="Select institution"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.code} – {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nav links */}
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'navbar-mobile-link-active'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F33]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Chat CTA */}
            <Link
              to="/chat"
              onClick={closeMobileMenu}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Sparkles size={15} />
              Open Assistant
            </Link>

            {/* Auth section */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[11px] font-bold text-[var(--color-primary)]">
                      {userInitials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#0B1F3A]">{user.full_name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800"
                      >
                        <ShieldCheck size={11} />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); closeMobileMenu() }}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                      title="Sign Out"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openSignIn}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)]"
                >
                  <UserRound size={15} />
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}
