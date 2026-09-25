import { BookOpen, Cpu, Layers, ShieldCheck, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'

export function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#0B1F3A]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200/80 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            <BookOpen size={16} />
            Documentation
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Smart Lux System & Developer Guide
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Comprehensive overview of Smart Lux architecture, RAG retrieval engine, API integrations, and developer instructions.
          </p>
        </div>

        {/* Core Architecture */}
        <section className="mt-10 space-y-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#0B1F3A]/5 p-2.5 text-[var(--color-primary)]">
                <Layers size={22} />
              </div>
              <h2 className="text-xl font-semibold text-[#0B1F3A]">Architecture Overview</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Smart Lux is designed using a <strong>Vertical-Slice (Feature-Based) Architecture</strong>. Each domain feature (Chat, Campus Locations, Academics, Announcements) is self-contained with its own router, data schema, and service module.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200/60 bg-[#1e293b] p-4 text-xs font-mono text-slate-200 overflow-x-auto">
              <pre>{`Smart-Lux/
├── smart-campus/
│   ├── backend/               # FastAPI Backend (Python 3.10+)
│   │   ├── app/
│   │   │   ├── core/          # Database, Security, Rate Limiting & Config
│   │   │   ├── features/      # Vertical Slices (chat, campus, academics)
│   │   │   │   ├── chat/      # RAG engine, Gemini/Grok AI Service, Embeddings
│   │   │   │   └── campus/    # Location data & SCIT knowledge ingestion
│   │   │   └── main.py        # FastAPI Application Entrypoint
│   └── frontend/              # React + Vite Single Page Application (TypeScript)
│       └── src/
│           ├── pages/         # Client routes (Chat, Map, Explore, Docs, Terms)
│           └── services/      # Type-safe API client`}</pre>
            </div>
          </div>

          {/* RAG & AI Engine */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#0B1F3A]/5 p-2.5 text-[var(--color-primary)]">
                <Cpu size={22} />
              </div>
              <h2 className="text-xl font-semibold text-[#0B1F3A]">RAG & AI Engine</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-[#f9faf9] p-4">
                <h3 className="font-semibold text-sm text-[#0B1F3A]">1. Hybrid Retrieval</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Combines sparse keyword matching with 128-dimensional dense vector embeddings (Cosine Similarity) for maximum accuracy on DeKUT terminology.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-[#f9faf9] p-4">
                <h3 className="font-semibold text-sm text-[#0B1F3A]">2. Multi-Provider AI Fallback</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Seamlessly queries <strong>Google Gemini 2.5 Flash</strong> as primary provider, with automatic fallback to <strong>xAI / Grok</strong> or local RAG data.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-[#f9faf9] p-4">
                <h3 className="font-semibold text-sm text-[#0B1F3A]">3. SCIT Specialized Knowledge</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Automatic domain detection routes queries about computing, software engineering, and SCIT labs to specialized school-level data.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-[#f9faf9] p-4">
                <h3 className="font-semibold text-sm text-[#0B1F3A]">4. Conversational Memory</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Maintains multi-turn context history, enabling natural follow-up questions during student conversations.
                </p>
              </div>
            </div>
          </div>

          {/* Setup Commands */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#0B1F3A]/5 p-2.5 text-[var(--color-primary)]">
                <Terminal size={22} />
              </div>
              <h2 className="text-xl font-semibold text-[#0B1F3A]">Local Development</h2>
            </div>
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <p className="font-semibold text-[#0B1F3A]">Backend Server (FastAPI):</p>
                <div className="mt-2 rounded-lg bg-[#1e293b] p-3 font-mono text-slate-200">
                  <code>uvicorn app.main:app --reload --port 8000</code>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[#0B1F3A]">Frontend Application (Vite):</p>
                <div className="mt-2 rounded-lg bg-[#1e293b] p-3 font-mono text-slate-200">
                  <code>npm run dev</code>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Reliability */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#0B1F3A]/5 p-2.5 text-[var(--color-primary)]">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl font-semibold text-[#0B1F3A]">Security & System Reliability</h2>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-xs text-slate-600 leading-relaxed">
              <li><strong>Schema Validation</strong>: Strict Pydantic models sanitize all user inputs to eliminate XSS and injection vectors.</li>
              <li><strong>Rate Limiting</strong>: IP-based sliding window rate limiter (100 req/min) powered by <code>slowapi</code>.</li>
              <li><strong>Resilient Database Engine</strong>: PostgreSQL primary database with seamless fallback to SQLite if PostgreSQL is unreachable.</li>
            </ul>
          </div>
        </section>

        {/* Quick Links */}
        <div className="mt-10 flex items-center justify-between rounded-xl bg-white p-4 border border-slate-200/80">
          <span className="text-xs text-slate-500">Need help or terms of service?</span>
          <div className="flex gap-4 text-xs font-medium text-[var(--color-primary)]">
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
            <Link to="/chat" className="hover:underline">Go to Assistant</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
