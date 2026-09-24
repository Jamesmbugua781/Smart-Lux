import { ArrowRight, Building2, Globe2, Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { SuggestionChip } from '../components/chat/SuggestionChip'

const suggestions = [
  'Where is the library?',
  'How do I register for courses?',
  'Where is the School of Computer Science?',
  'What student services are available?',
  'Maktaba iko wapi?',
]

export function HomePage() {
  const [question, setQuestion] = useState('')
  const navigate = useNavigate()

  const openAssistant = (message: string) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    navigate(`/chat?question=${encodeURIComponent(trimmedMessage)}`)
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    openAssistant(question)
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#0B1F3A]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[30px] border border-[#edf0f2] bg-white px-5 py-10 shadow-[0_20px_60px_rgba(11,31,58,0.04)] sm:px-8 lg:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#126B3A]">SMART CAMPUS ASSISTANT</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                Your campus. <span className="text-[#126B3A]">One conversation.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
                Ask about academics, campus services, locations and university information.
              </p>

              <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#fafaf8] p-2 shadow-[0_10px_25px_rgba(11,31,58,0.03)]">
                <Search className="ml-3 text-[#126B3A]" size={18} />
                <input
                  aria-label="Ask anything about campus"
                  placeholder="Ask anything about campus..."
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="flex-1 border-0 bg-transparent px-2 py-3 text-base text-[#0B1F3A] placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#112848] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-7">
                <p className="text-sm font-medium text-slate-600">Try asking</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <SuggestionChip key={suggestion} label={suggestion} onClick={openAssistant} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-[#edf0f2] bg-[radial-gradient(circle_at_top,_rgba(18,107,58,0.12),_transparent_50%),linear-gradient(135deg,#f4f7f2,#eef4f8)] p-6 shadow-[0_20px_60px_rgba(11,31,58,0.06)]">
                <div className="absolute inset-0 opacity-70" aria-hidden="true">
                  <div className="absolute left-10 top-10 h-28 w-28 rounded-full border border-[#b8d3c0] bg-[#ffffff]/40" />
                  <div className="absolute bottom-10 right-12 h-32 w-32 rounded-full border border-[#d3c58a] bg-[#ffffff]/30" />
                  <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#0B1F3A]/20" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-[#edf0f2] bg-white/80 p-4 backdrop-blur-sm">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#126B3A]">Campus network</p>
                      <p className="mt-1 text-lg font-semibold text-[#0B1F3A]">Connected services</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7f0] text-[#126B3A]">
                      <Globe2 size={18} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#edf0f2] bg-white p-4">
                      <Building2 size={18} className="text-[#126B3A]" />
                      <p className="mt-4 text-sm text-slate-500">Campus map</p>
                      <p className="mt-1 font-semibold text-[#0B1F3A]">Locations</p>
                    </div>
                    <div className="rounded-2xl border border-[#edf0f2] bg-white p-4">
                      <Search size={18} className="text-[#C9A227]" />
                      <p className="mt-4 text-sm text-slate-500">Verified answer</p>
                      <p className="mt-1 font-semibold text-[#0B1F3A]">AI support</p>
                    </div>
                  </div>

                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#dfe4e8] bg-white px-4 py-2.5 text-sm font-medium text-[#0B1F3A] transition hover:bg-[#f8f8f5]"
                  >
                    Open campus assistant
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
