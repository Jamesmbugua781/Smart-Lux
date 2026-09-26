import {
  BookOpen,
  Building2,
  GraduationCap,
  Map,
  Megaphone,
  Sparkles,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/explore', label: 'Explore', icon: Building2 },
  { to: '/campus', label: 'Campus', icon: BookOpen },
  { to: '/announcements', label: 'Updates', icon: Megaphone },
  { to: '/academics', label: 'Academics', icon: GraduationCap },
  { to: '/map', label: 'Map', icon: Map },
]

export function MobileBottomNav() {
  const location = useLocation()

  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(11,31,58,0.08)] md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {navItems.slice(0, 2).map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold tracking-wide transition-colors duration-150 ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'}
              />
              {label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[var(--color-primary)]"
                />
              )}
            </Link>
          )
        })}

        {/* Center: Assistant CTA — slightly raised pill */}
        <div className="relative flex flex-1 items-center justify-center">
          <Link
            to="/chat"
            aria-label="Open AI Assistant"
            id="mobile-bottom-nav-assistant"
            className={`-mt-4 flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-bold tracking-wide shadow-[0_4px_18px_rgba(37,99,235,0.35)] transition hover:opacity-90 active:scale-95 ${
              location.pathname === '/chat'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-primary)] text-white'
            }`}
            style={{ minWidth: '64px' }}
          >
            <Sparkles size={20} strokeWidth={2} className="text-white" />
            <span className="text-white">Assistant</span>
          </Link>
        </div>

        {navItems.slice(3).map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold tracking-wide transition-colors duration-150 ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'}
              />
              {label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[var(--color-primary)]"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
