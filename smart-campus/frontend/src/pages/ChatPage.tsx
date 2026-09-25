import { useCallback, useEffect, useRef, useState } from 'react'
import { Globe } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Footer } from '../components/layout/Footer'
import { ChatMessage } from '../components/chat/ChatMessage'
import { ChatInput } from '../components/chat/ChatInput'
import { SuggestionChip } from '../components/chat/SuggestionChip'
import { SourceCard } from '../components/chat/SourceCard'
import { sendChatMessage } from '../services/api'
import type { ChatMessageData } from '../types'
import { popularQuestions } from '../data/campusData'

export function ChatPage() {
  const location = useLocation()
  const submittedIncomingQuestion = useRef('')
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const submitMessage = useCallback(async (question = input) => {
    const message = question.trim()
    if (!message || isLoading) return

    setInput('')
    setError('')
    setSuggestions([])
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text: message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setIsLoading(true)

    try {
      const response = await sendChatMessage(message)
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
      }])
      setSuggestions(response.suggestions)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  const clearConversation = () => {
    submittedIncomingQuestion.current = ''
    setMessages([])
    setSuggestions([])
    setError('')
    setInput('')
  }

  useEffect(() => {
    const question = new URLSearchParams(location.search).get('question') ?? ''
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || submittedIncomingQuestion.current === trimmedQuestion) return

    submittedIncomingQuestion.current = trimmedQuestion
    void submitMessage(trimmedQuestion)
  }, [location.search, submitMessage])

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#0B1F3A]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar onNewConversation={clearConversation} onSelectConversation={(prompt) => void submitMessage(prompt)} />

        <main className="flex min-h-screen flex-1 flex-col bg-[#f9faf9]">
          <header className="border-b border-[#edf0f2] bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">SMART LUX</p>
                <h1 className="mt-1 text-xl font-semibold text-[#0B1F3A]">Campus Assistant</h1>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#dfe4e8] bg-[#f8f8f5] px-3 py-2 text-xs font-medium text-[#0B1F3A]">
                <Globe size={14} />
                EN / SW
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              {messages.length === 0 ? (
                <div className="mb-8">
                  <p className="text-2xl font-semibold tracking-tight text-[#0B1F3A]">Hi, how can I help on campus today?</p>
                  <p className="mt-2 text-sm text-slate-500">Try one of these questions to get started.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {popularQuestions.map((question) => <SuggestionChip key={question} label={question} onClick={(value) => void submitMessage(value)} />)}
                  </div>
                </div>
              ) : null}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading ? <div className="mb-5 rounded-2xl border border-[#edf0f2] bg-white px-4 py-3 text-sm text-slate-500 shadow-sm" aria-label="Assistant is typing">•••</div> : null}

              {error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div> : null}

              {messages.some((message) => message.sources?.length) ? (
                <div className="mb-5 rounded-2xl border border-[#edf0f2] bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-[#0B1F3A]">Source</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {messages.flatMap((message) => message.sources ?? []).map((source) => (
                      <SourceCard key={`${source.source}-${source.title}`} title={source.title} type="Source" source={source.source} />
                    ))}
                  </div>
                </div>
              ) : null}

              {suggestions.length > 0 ? (
                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => <SuggestionChip key={suggestion} label={suggestion} onClick={(value) => void submitMessage(value)} />)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-[#edf0f2] bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <ChatInput placeholder="Ask Smart Campus..." value={input} onChange={setInput} onSubmit={() => submitMessage()} disabled={isLoading} />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
