import { useEffect, useState } from 'react'
import { MessageSquareText, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { deleteSessionApi, fetchSessionsApi } from '../../services/api'
import { Brand } from './Brand'

export interface ChatSessionItem {
  id: string
  title: string
  created_at?: string
}

interface SidebarProps {
  currentSessionId?: string | null
  onNewConversation: () => void
  onSelectSession: (sessionId: string) => void
}

export function Sidebar({ currentSessionId, onNewConversation, onSelectSession }: SidebarProps) {
  const { token, activeInstitution } = useAuth()
  const [sessions, setSessions] = useState<ChatSessionItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadSessions = async () => {
    try {
      setIsLoading(true)
      const data = await fetchSessionsApi(activeInstitution, token)
      setSessions(data || [])
    } catch {
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSessions()
  }, [token, activeInstitution, currentSessionId])

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    try {
      await deleteSessionApi(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        onNewConversation()
      }
    } catch (err) {
      console.warn('Failed to delete session:', err)
    }
  }

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-[#edf0f2] bg-[#f7faf8] lg:flex lg:flex-col">
      <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-5">
        <Brand />
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#112848]"
        >
          <Plus size={16} />
          New conversation
        </button>
      </div>

      <div className="px-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">History Memory</p>
          {isLoading ? <span className="text-[10px] text-slate-400">Loading...</span> : null}
        </div>

        <div className="mt-3 space-y-1.5">
          {sessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-3 text-center text-xs text-slate-400">
              No saved history yet. Ask Smart Lux a question to start.
            </div>
          ) : (
            sessions.map((item) => {
              const isSelected = currentSessionId === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectSession(item.id)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs transition ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-white text-[var(--color-primary)] shadow-sm font-semibold'
                      : 'border-transparent bg-white/80 text-[#0B1F3A] hover:border-[#dfe7ee] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <MessageSquareText size={15} className="shrink-0 text-[var(--color-primary)]" />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition shrink-0"
                    title="Delete session"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}
