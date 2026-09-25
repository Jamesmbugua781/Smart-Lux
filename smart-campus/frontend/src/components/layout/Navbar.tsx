import {
  Bell,
  Compass,
  Globe,
  GraduationCap,
  Map as MapIcon,
  MapPinned,
  MessageSquareText,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Brand } from './Brand'

const navItems = [
  { to: '/explore', label: 'Explore' },
  { to: '/campus', label: 'Campus' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/academics', label: 'Academics' },
  { to: '/map', label: 'Map' },
]

const mobileNavItems: Array<{
  to?: string
  label: string
  icon: typeof Compass
  action?: 'profile'
}> = [
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/campus', label: 'Campus', icon: MapPinned },
  { to: '/announcements', label: 'Announcements', icon: Bell },
  { to: '/academics', label: 'Academics', icon: GraduationCap },
  { to: '/map', label: 'Map', icon: MapIcon },
  { label: 'Profile', icon: UserRound, action: 'profile' },
]

export function Navbar() {
  const [language, setLanguage] = useState<'EN' | 'SW'>('EN')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const closeMenus = () => {
    setIsProfileOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7edf3] bg-[#f8f8f5]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Brand className="shrink-0" />

        <nav aria-label="Main navigation" className="hidden ml-10 items-center gap-6 md:flex ">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'navbar-link-active'
                    : 'text-[#0B1F33]/70 hover:text-[#0B1F33]'
                }`}
                aria-current={isActive ? 'page' : undefined}
                style={isActive ? { color: 'var(--color-primary)', textDecorationColor: 'var(--color-primary)' } : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="relative ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            to="/chat"
            className="hidden items-center gap-2 rounded-xl bg-[var(--color-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 md:inline-flex"
            aria-label="Open assistant"
            style={{ color: 'white' }}
          >
            <Sparkles size={15} />
            Open Assistant
          </Link>

          <button
            type="button"
            onClick={() => setLanguage((current) => (current === 'EN' ? 'SW' : 'EN'))}
            className="inline-flex items-center gap-2 rounded-full border border-[#dfe7ee] bg-white px-3 py-2 text-xs font-medium text-[#0B1F33] transition hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            aria-label={`Switch language. Current language is ${language}`}
          >
            <Globe size={14} />
            {language}
          </button>

          <button
            type="button"
            onClick={() => setIsProfileOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-[#dfe7ee] bg-white px-3 py-2 text-sm font-medium text-[#0B1F33] transition hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            aria-label="Open student profile"
            aria-expanded={isProfileOpen}
          >
            <UserRound size={16} />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {isProfileOpen ? (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-[#edf1f5] bg-white p-3 shadow-[0_18px_45px_rgba(11,31,58,0.12)]">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Student tools</p>
              <Link
                to="/chat"
                onClick={closeMenus}
                className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#0B1F33] transition hover:bg-[var(--color-primary-soft)]"
              >
                <MessageSquareText size={15} />
                Open assistant
              </Link>
              <Link
                to="/academics"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#0B1F33] transition hover:bg-[var(--color-primary-soft)]"
              >
                Academic info
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <nav
        aria-label="Mobile primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7edf3] bg-[#f8f8f5]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-10px_30px_rgba(11,31,58,0.08)] backdrop-blur-sm md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon

            if (item.action === 'profile') {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-[#0B1F33]/70 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                  aria-label="Open student profile"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              )
            }

            if (!item.to) {
              return null
            }

            const isActive = location.pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                  isActive
                    ? 'navbar-mobile-link-active'
                    : 'text-[#0B1F33]/70 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
                style={isActive ? { color: 'var(--color-primary)', textDecorationColor: 'var(--color-primary)' } : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
