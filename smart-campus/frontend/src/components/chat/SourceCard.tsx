import { ArrowUpRight } from 'lucide-react'

interface SourceCardProps {
  title: string
  type?: string
  source?: string
}

export function SourceCard({ title, type = 'Source', source }: SourceCardProps) {
  return (
    <div className="rounded-2xl border border-[#edf0f2] bg-[#f9fafb] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">{type}</span>
        <ArrowUpRight size={14} className="text-[#0B1F3A]" />
      </div>
      <p className="mt-2 text-sm font-medium text-[#0B1F3A]">{title}</p>
      {source ? <p className="mt-1 text-xs text-slate-500">{source}</p> : null}
    </div>
  )
}
