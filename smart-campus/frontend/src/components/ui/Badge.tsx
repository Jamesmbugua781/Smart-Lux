import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#d9e6dc] bg-[#edf7f0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#126B3A]">
      {children}
    </span>
  )
}
