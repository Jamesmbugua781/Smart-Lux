import { Link } from 'react-router-dom'

interface BrandProps {
  className?: string
}

export function Brand({ className = '' }: BrandProps) {
  return (
    <Link
      to="/"
      aria-label="SMART LUX Home"
      className={`inline-flex items-center ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B1F33] text-xs font-semibold tracking-[0.08em] text-[#F8F8F5]">
        SL
      </div>

      <div>
        <span className="text-base ml-2 font-semibold tracking-[-0.04em] text-[#0B1F33]">SMART LUX</span>
      </div>
    </Link>
  )
}
