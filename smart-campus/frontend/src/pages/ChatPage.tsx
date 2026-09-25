import { useCallback, useEffect, useRef, useState } from 'react'
import { Building2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Footer } from '../components/layout/Footer'
import { ChatMessage } from '../components/chat/ChatMessage'
import { ChatInput } from '../components/chat/ChatInput'
import { SuggestionChip } from '../components/chat/SuggestionChip'
import { SourceCard } from '../components/chat/SourceCard'
import { useAuth } from '../components/auth/AuthContext'
import { fetchSessionMessagesApi, sendChatMessage } from '../services/api'
import type { ChatMessageData } from '../types'
import { popularQuestions } from '../data/campusData'

export function ChatPage() {
  const location = useLocation()
  const { token, activeInstitution, institutions, setActiveInstitution } = useAuth()
  const submittedIncomingQuestion = useRef('')

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const currentInstitutionObj = institutions.find((i) => i.id === activeInstitution) || {
    id: 'dekut',
    name: 'Dedan Kimathi University of Technology',
    code: 'DEKUT',
  }

  const submitMessage = useCallback(
    async (question = input) => {
      const message = question.trim()
      if (!message || isLoading) return

      setInput('')
      setError('')
      setSuggestions([])

      const userMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        role: 'user',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((current) => [...current, userMessage])
      setIsLoading(true)

      try {
        const history = messages
          .filter((m) => Boolean(m.text && m.text.trim()))
          .map((m) => ({ role: m.role, content: m.text.trim() }))

        const response = await sendChatMessage(
          message,
          'en',
          history,
          currentSessionId,
          activeInstitution,
          token
        )

        if (response.session_id && response.session_id !== currentSessionId) {
          setCurrentSessionId(response.session_id)
        }

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: response.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: response.sources,
          },
        ])
        setSuggestions(response.suggestions)
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, messages, currentSessionId, activeInstitution, token]
  )

  const handleSelectSession = async (sessionId: string) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await fetchSessionMessagesApi(sessionId)
      setCurrentSessionId(sessionId)
      setMessages(data.messages || [])
    } catch {
      setError('Failed to load conversation history.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    submittedIncomingQuestion.current = ''
    setCurrentSessionId(null)
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
        <Sidebar
          currentSessionId={currentSessionId}
          onNewConversation={clearConversation}
          onSelectSession={(sid) => void handleSelectSession(sid)}
        />

        <main className="flex min-h-screen flex-1 flex-col bg-[#f9faf9]">
          <header className="border-b border-[#edf0f2] bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">SMART LUX</p>
                <h1 className="text-base font-semibold text-[#0B1F3A] sm:text-lg">Campus Assistant</h1>
              </div>

              {/* Institution Selector */}
              <div className="flex items-center gap-2">
                {institutions.length > 0 && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#f8f9fa] px-2.5 py-1">
                    <Building2 size={12} className="shrink-0 text-[var(--color-primary)]" />
                    <select
                      value={activeInstitution}
                      onChange={(e) => setActiveInstitution(e.target.value)}
                      className="max-w-[130px] truncate bg-transparent text-[11px] font-semibold text-[#0B1F3A] focus:outline-none cursor-pointer sm:max-w-[200px]"
                      aria-label="Select institution"
                    >
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.code} – {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              {messages.length === 0 ? (
                <div className="mb-8">
                  <p className="text-2xl font-semibold tracking-tight text-[#0B1F3A]">
                    Hi, how can I help at {currentInstitutionObj.name}?
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Try one of these questions to get started.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {popularQuestions.map((question) => (
                      <SuggestionChip
                        key={question}
                        label={question}
                        onClick={(value) => void submitMessage(value)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading ? (
                <div className="mb-5 rounded-2xl border border-[#edf0f2] bg-white px-4 py-3 text-sm text-slate-500 shadow-sm" aria-label="Assistant is typing">
                  •••
                </div>
              ) : null}

              {error ? (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </div>
              ) : null}

              {messages.some((message) => message.sources?.length) ? (
                <div className="mb-5 rounded-2xl border border-[#edf0f2] bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-[#0B1F3A]">Source</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {messages
                      .flatMap((message) => message.sources ?? [])
                      .map((source) => (
                        <SourceCard
                          key={`${source.source}-${source.title}`}
                          title={source.title}
                          type="Source"
                          source={source.source}
                        />
                      ))}
                  </div>
                </div>
              ) : null}

              {suggestions.length > 0 ? (
                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <SuggestionChip
                        key={suggestion}
                        label={suggestion}
                        onClick={(value) => void submitMessage(value)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-[#edf0f2] bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <ChatInput
                placeholder={`Ask Smart Lux (${currentInstitutionObj.code})...`}
                value={input}
                onChange={setInput}
                onSubmit={() => submitMessage()}
                disabled={isLoading}
              />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
