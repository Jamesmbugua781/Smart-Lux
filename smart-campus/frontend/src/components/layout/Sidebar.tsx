import { MessageSquareText, Plus } from 'lucide-react'
import { Brand } from './Brand'

const recentConversations = [
  { label: 'Library information', prompt: 'Where is the library and what services are available?' },
  { label: 'Course registration', prompt: 'How do I register for courses?' },
  { label: 'Campus locations', prompt: 'Show me important campus locations.' },
]

interface SidebarProps {
  onNewConversation: () => void
  onSelectConversation: (prompt: string) => void
}

export function Sidebar({ onNewConversation, onSelectConversation }: SidebarProps) {
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

      <div className="px-4">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Recent conversations</p>
        <div className="mt-3 space-y-2">
          {recentConversations.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectConversation(item.prompt)}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-3 text-left text-sm text-[#0B1F3A] shadow-sm transition hover:border-[#dfe7ee] hover:bg-[#f5f7f8]"
            >
              <MessageSquareText size={15} className="text-[var(--color-primary)]" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
