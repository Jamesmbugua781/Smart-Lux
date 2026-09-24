import { ArrowRight } from 'lucide-react'
import type { AnnouncementItem } from '../../types'

interface AnnouncementCardProps {
  item: AnnouncementItem
  isExpanded: boolean
  onToggle: (id: string) => void
}

export function AnnouncementCard({ item, isExpanded, onToggle }: AnnouncementCardProps) {
  return (
    <article className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-[0_12px_30px_rgba(11,31,58,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(11,31,58,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#edf7f0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#126B3A]">
          {item.category}
        </span>
        <span className="text-sm text-slate-500">{item.date}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#0B1F3A]">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
      {isExpanded ? (
        <div className="mt-4 rounded-2xl border border-[#edf0f2] bg-[#f8f8f5] p-4 text-sm leading-6 text-slate-700">
          <p>This update is ready in the student information flow. Contact the relevant office or ask the campus assistant for the next step.</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#126B3A]"
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Show less' : 'Read more'}
        <ArrowRight size={14} className={`transition ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
    </article>
  )
}
