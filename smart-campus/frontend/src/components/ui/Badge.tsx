import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-primary-soft-strong)] bg-[var(--color-primary-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
      {children}
    </span>
  )
}
