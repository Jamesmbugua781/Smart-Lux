import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--color-navy)]">SMART LUX</p>
          <p className="mt-1">Intelligent campus guidance, all in one place.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="action-link" to="/campus">Campus</Link>
          <Link className="action-link" to="/announcements">Announcements</Link>
          <Link className="action-link" to="/academics">Academics</Link>
        </nav>
      </div>
    </footer>
  )
}