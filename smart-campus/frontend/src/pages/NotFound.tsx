import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'

export function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-190px)] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-navy)] sm:text-5xl">Page not found</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">The page you are looking for does not exist or may have moved.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            Redirect to home
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
