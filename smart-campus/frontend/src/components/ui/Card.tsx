import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#edf0f2] bg-white shadow-[0_10px_30px_rgba(11,31,58,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
