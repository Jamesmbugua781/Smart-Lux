import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-500 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--color-navy)]">SMART LUX</p>
          <p className="mt-1">Intelligent campus guidance, all in one place.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link className="action-link" to="/docs">Documentation</Link>
            <Link className="action-link" to="/terms">Terms of Use</Link>
            <Link className="action-link" to="/campus?query=ict">Contact ICT Help Desk</Link>
          </div>
          <p>© {currentYear} SMART LUX. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  )
}