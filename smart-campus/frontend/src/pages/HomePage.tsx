import { ArrowRight, Globe2, Sparkles } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { SuggestionChip } from '../components/chat/SuggestionChip'
import { popularQuestions } from '../data/campusData'

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
    <div className="min-h-screen bg-[#F5F7F8] text-[#0B1F33]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="overflow-hidden rounded-[30px] border border-[#eaeef2] bg-[#ffffff] px-5 py-8 shadow-[0_18px_50px_rgba(11,31,58,0.04)] sm:px-8 lg:px-12 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">SMART CAMPUS ASSISTANT</p>
              <h1 className="mt-4 text-4xl font-semibold leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                Your campus.
                <span className="mt-2 block text-[#0B1F33]">
                  One <span className="text-[var(--color-primary)]">conversation.</span>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
                Ask about academics, campus services, locations, and student information in one clear conversation.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[22px] border border-[#dfe7ee] bg-[#f8fbff] p-2 shadow-[0_10px_30px_rgba(37,99,235,0.04)] sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-transparent bg-transparent px-2 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <Sparkles size={16} />
                  </div>
                  <input
                    aria-label="Ask anything about campus"
                    placeholder="Ask anything about campus..."
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className="w-full border-0 bg-transparent px-1 py-2 text-base text-[#0B1F33] placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[140px]"
                >
                  Ask
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-7">
                <p className="text-sm font-medium text-slate-600">Try asking</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularQuestions.map((suggestion) => (
                    <SuggestionChip key={suggestion} label={suggestion} onClick={openAssistant} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-[#e9eef6] bg-[linear-gradient(135deg,#eff6ff,#f8fbff)] p-5 shadow-[0_18px_50px_rgba(11,31,58,0.05)] sm:p-6">
                <div className="absolute inset-0 opacity-70" aria-hidden="true">
                  <div className="absolute left-10 top-10 h-28 w-28 rounded-full border border-[#cfe0ff] bg-white/40" />
                  <div className="absolute bottom-10 right-12 h-32 w-32 rounded-full border border-[#dfe9ff] bg-white/30" />
                  <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#0B1F33]/15" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#dfeafc] pb-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Campus intelligence</p>
                      <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#0B1F33]"><span className="h-2.5 w-2.5 rounded-full bg-[var(--color-status)]" aria-hidden="true" />Connected</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                      <Globe2 size={18} />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-[#dfeafc] bg-white/80 p-4">
                    <div className="grid gap-4 border-b border-[#dfeafc] pb-4 text-sm text-slate-600 sm:grid-cols-2">
                      <div>
                        <p className="text-[28px] font-bold leading-none text-[#0B1F33]">12</p>
                        <p className="mt-1">Campus services</p>
                      </div>
                      <div>
                        <p className="text-[28px] font-bold leading-none text-[#0B1F33]">48</p>
                        <p className="mt-1">Locations</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="font-semibold text-[#0B1F33]">Verified answers</p>
                      <p>Live campus guidance available</p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-[#e9eef6] bg-white/80 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Quick links</p>
                    {[
                      'Campus Map',
                      'Academic Calendar',
                      'Student Services',
                      'Announcements',
                    ].map((link) => (
                      <Link
                        key={link}
                        to={link === 'Announcements' ? '/announcements' : link === 'Academic Calendar' ? '/academics' : link === 'Student Services' ? '/campus?query=services' : '/map'}
                        className="action-link flex justify-between rounded-xl px-3 py-2 text-sm text-[#0B1F33] no-underline hover:bg-[var(--color-primary-soft)]"
                      >
                        <span>{link}</span>
                        <ArrowRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
