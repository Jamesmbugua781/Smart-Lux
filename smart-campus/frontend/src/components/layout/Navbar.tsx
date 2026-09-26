import { Building2, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Brand } from './Brand'

const navItems = [
  { to: '/explore', label: 'Explore' },
  { to: '/campus', label: 'Campus' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/academics', label: 'Academics' },
  { to: '/map', label: 'Map' },
]

export function Navbar() {
  const location = useLocation()
  const { activeInstitution, institutions, setActiveInstitution } = useAuth()

  return (
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

        {/* Right: Assistant button (desktop only) */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/chat"
            id="navbar-assistant-btn"
            className="hidden items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 md:inline-flex"
            aria-label="Open AI assistant"
          >
            <Sparkles size={13} className="text-white" />
            <span className="hidden sm:inline text-white">Assistant</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
