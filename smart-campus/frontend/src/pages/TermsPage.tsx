import { FileText, Shield, Scale, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#0B1F3A]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200/80 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            <Scale size={16} />
            Terms & Guidelines
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Please read these terms carefully before using the Smart Lux campus assistant platform.
          </p>
        </div>

        {/* Terms Sections */}
        <section className="mt-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#0B1F3A]">
              <FileText className="text-[var(--color-primary)]" size={20} />
              <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            </div>
            <p className="mt-3">
              By accessing or using Smart Lux, you agree to comply with and be bound by these Terms of Use, university code of conduct, and acceptable use policies. If you do not agree to these terms, please refrain from using the application.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#0B1F3A]">
              <Shield className="text-[var(--color-primary)]" size={20} />
              <h2 className="text-lg font-semibold">2. Purpose & Information Disclaimer</h2>
            </div>
            <p className="mt-3">
              Smart Lux is designed to assist Dedan Kimathi University of Technology (DeKUT) students, staff, and visitors with campus navigation, academic directories, course information, and general campus guidance.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              *While answers are generated using official university retrieval sources and verified AI models, critical official matters (e.g. fee payment balances, transcripts, formal disciplinary actions) should always be verified directly with the official DeKUT Registry or relevant Dean's office.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#0B1F3A]">
              <Scale className="text-[var(--color-primary)]" size={20} />
              <h2 className="text-lg font-semibold">3. Acceptable Use</h2>
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Users must not attempt to perform automated scraping, brute-force requests, or exploit system endpoints.</li>
              <li>Users must not submit abusive, harassing, unlawful, or sexually explicit content to the assistant.</li>
              <li>System rate limits (100 requests per minute) are enforced to ensure equitable access for all campus students.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#0B1F3A]">
              <HelpCircle className="text-[var(--color-primary)]" size={20} />
              <h2 className="text-lg font-semibold">4. Privacy & Data Handling</h2>
            </div>
            <p className="mt-3">
              Smart Lux respects student privacy. Conversation history is processed securely for session continuity during your active chat and is not sold or shared with third parties.
            </p>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="mt-10 flex items-center justify-between rounded-xl bg-white p-4 border border-slate-200/80">
          <span className="text-xs text-slate-500">Looking for system documentation?</span>
          <div className="flex gap-4 text-xs font-medium text-[var(--color-primary)]">
            <Link to="/docs" className="hover:underline">Documentation</Link>
            <Link to="/chat" className="hover:underline">Start Chatting</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
