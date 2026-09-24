import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#126B3A] text-white shadow-[0_12px_30px_rgba(18,107,58,0.18)] hover:bg-[#0f5b34]',
  secondary: 'bg-[#0B1F3A] text-white hover:bg-[#0a1730]',
  ghost: 'bg-white text-[#0B1F3A] border border-[#e5e7eb] hover:bg-[#f8f8f5]',
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
