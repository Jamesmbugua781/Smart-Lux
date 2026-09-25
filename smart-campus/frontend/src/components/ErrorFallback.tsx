import type { FallbackProps } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import { Footer } from './layout/Footer'
import { Navbar } from './layout/Navbar'
import { Button } from './ui/Button'

export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-190px)] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">SMART LUX</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-navy)] sm:text-5xl">Something went wrong</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">We could not load this page. Please try again or return to the home page.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={resetErrorBoundary}>Try again</Button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[var(--color-navy)] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              Go home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
