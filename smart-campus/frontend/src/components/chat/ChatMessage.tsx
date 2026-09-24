import { ArrowUpRight, MapPin } from 'lucide-react'
import type { ChatMessageData } from '../../types'

interface ChatMessageProps {
  message: ChatMessageData
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
      <div
        className={`max-w-[82%] rounded-2xl border px-4 py-3 shadow-sm ${
          isUser
            ? 'border-[#cfe7d9] bg-[#126B3A] text-white'
            : 'border-[#edf0f2] bg-white text-[#0B1F3A]'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <span className={`text-xs font-medium ${isUser ? 'text-white/80' : 'text-slate-500'}`}>
            {isUser ? 'You' : 'Campus Assistant'}
          </span>
          {message.timestamp ? (
            <span className={`text-[10px] ${isUser ? 'text-white/70' : 'text-slate-400'}`}>
              {message.timestamp}
            </span>
          ) : null}
        </div>

        <p className="mt-2 whitespace-pre-line text-sm leading-7">
          {message.text}
        </p>

        {message.sources && message.sources.length > 0 ? (
          <div className="mt-4 space-y-2">
            {message.sources.map((source) => (
              <div
                key={source.title}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                  isUser ? 'border-white/20 bg-white/5' : 'border-[#edf0f2] bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className={isUser ? 'text-[#F3D98A]' : 'text-[#126B3A]'} />
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#126B3A]">
                    Source
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{source.title}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
