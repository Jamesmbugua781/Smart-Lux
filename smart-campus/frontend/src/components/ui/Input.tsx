import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border border-[#dfe4e8] bg-white px-4 py-3 text-sm text-[#0B1F3A] placeholder:text-slate-400 focus:border-[#126B3A] focus:outline-none focus:ring-2 focus:ring-[#126B3A]/10 ${className}`}
      {...props}
    />
  )
}
