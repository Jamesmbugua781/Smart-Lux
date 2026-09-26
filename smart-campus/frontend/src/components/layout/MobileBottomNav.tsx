import {
  BookOpen,
  Building2,
  GraduationCap,
  Map,
  Megaphone,
  Sparkles,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// Left of center: Explore, Campus
const leftItems = [
  { to: '/explore', label: 'Explore', icon: Building2 },
  { to: '/campus', label: 'Campus', icon: BookOpen },
]

// Right of center: Announcements, Academics, Map  (short labels to fit)
const rightItems = [
  { to: '/announcements', label: 'News', icon: Megaphone },
  { to: '/academics', label: 'Academics', icon: GraduationCap },
  { to: '/map', label: 'Map', icon: Map },
]

interface NavTabProps {
  to: string
  label: string
  icon: React.ElementType
  isActive: boolean
}

function NavTab({ to, label, icon: Icon, isActive }: NavTabProps) {
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
      className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 pt-1 text-[9px] font-semibold tracking-wide transition-colors duration-150 ${
        isActive
          ? 'text-[var(--color-primary)]'
          : 'text-slate-500 active:text-slate-800'
      }`}
    >
      {/* Active indicator bar at top */}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-b-full bg-[var(--color-primary)]"
        />
      )}
      <Icon
        size={18}
        strokeWidth={isActive ? 2.2 : 1.7}
        className={isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'}
      />
      <span>{label}</span>
    </Link>
  )
}

export function MobileBottomNav() {
  const location = useLocation()

  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(11,31,58,0.08)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex h-16 max-w-screen-sm items-stretch">

        {/* Left tabs */}
        {leftItems.map(({ to, label, icon }) => (
          <NavTab
            key={to}
            to={to}
            label={label}
            icon={icon}
            isActive={location.pathname === to}
          />
        ))}

        {/* Center: Assistant CTA — raised pill button */}
        <div className="relative flex flex-[1.2] items-start justify-center pt-1">
          <Link
            to="/chat"
            id="mobile-bottom-nav-assistant"
            aria-label="Open AI Assistant"
            className={`-mt-5 flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2.5 text-[9px] font-bold tracking-wide transition hover:opacity-90 active:scale-95 ${
              location.pathname === '/chat'
                ? 'bg-[#1a52c8] shadow-[0_4px_20px_rgba(37,99,235,0.5)] text-white'
                : 'bg-[var(--color-primary)] shadow-[0_4px_18px_rgba(37,99,235,0.35)] text-white'
            }`}
            style={{ minWidth: '60px' }}
          >
            <Sparkles size={19} strokeWidth={2} className="text-white" />
            <span className="text-white leading-none">Assistant</span>
          </Link>
        </div>

        {/* Right tabs */}
        {rightItems.map(({ to, label, icon }) => (
          <NavTab
            key={to}
            to={to}
            label={label}
            icon={icon}
            isActive={location.pathname === to}
          />
        ))}
      </div>
    </nav>
  )
}
