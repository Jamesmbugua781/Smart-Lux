import { Globe, Menu, MessageSquareText, UserRound, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/campus', label: 'Campus' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/academics', label: 'Academics' },
]

export function Navbar() {
  const [language, setLanguage] = useState<'EN' | 'SW'>('EN')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const closeMenus = () => {
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#e9edf1] bg-[#f8f8f5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenus} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F3A] text-sm font-semibold text-[#F8F8F5]">
            SC
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#126B3A]">Smart Campus</p>
            <p className="text-base font-semibold text-[#0B1F3A]">SMART CAMPUS</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-[#0B1F3A]' : 'text-slate-500 hover:text-[#0B1F3A]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage((current) => (current === 'EN' ? 'SW' : 'EN'))}
            className="inline-flex items-center gap-2 rounded-full border border-[#dfe4e8] bg-white px-3 py-2 text-xs font-medium text-[#0B1F3A] transition hover:bg-[#f0f7f3]"
            aria-label={`Switch language. Current language is ${language}`}
          >
            <Globe size={14} />
            {language}
          </button>
          <button
            type="button"
            onClick={() => setIsProfileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe4e8] bg-white text-[#0B1F3A] transition hover:bg-[#f0f7f3]"
            aria-label="Open student menu"
            aria-expanded={isProfileOpen}
          >
            <UserRound size={16} />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe4e8] bg-white text-[#0B1F3A] transition hover:bg-[#f0f7f3] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {isProfileOpen ? (
            <div className="absolute right-12 top-12 w-56 rounded-2xl border border-[#edf0f2] bg-white p-3 shadow-[0_18px_45px_rgba(11,31,58,0.12)] md:right-0">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Student tools</p>
              <Link
                to="/chat"
                onClick={closeMenus}
                className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#0B1F3A] transition hover:bg-[#f0f7f3]"
              >
                <MessageSquareText size={15} />
                Open assistant
              </Link>
              <Link
                to="/academics"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#0B1F3A] transition hover:bg-[#f0f7f3]"
              >
                Academic info
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {isMobileMenuOpen ? (
        <nav className="border-t border-[#e9edf1] bg-white px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-[#edf7f0] text-[#126B3A]' : 'text-slate-600 hover:bg-[#f7faf8] hover:text-[#0B1F3A]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
