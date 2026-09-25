import { ArrowRight, MapPin } from 'lucide-react'
import type { CampusLocation } from '../../types'

interface LocationCardProps {
  location: CampusLocation
  isSelected?: boolean
  onViewDetails: (location: CampusLocation) => void
}

export function LocationCard({ location, isSelected = false, onViewDetails }: LocationCardProps) {
  const cardClassName = `flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-[0_8px_25px_rgba(11,31,58,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(11,31,58,0.06)] sm:flex-row sm:items-center sm:justify-between ${isSelected ? 'border-[var(--color-primary)]' : 'border-[#edf0f2]'}`
  const actionClassName = 'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#dfe4e8] bg-[#f8f8f5] px-3 py-1.5 text-sm font-medium text-[#0B1F3A] transition hover:border-[var(--color-primary-soft-strong)] hover:bg-[var(--color-primary-soft)]'
  const cardContent = (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <MapPin size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#0B1F3A]">{location.name}</h3>
            <span className="rounded-full border border-[#dfe4e8] bg-[#f8f8f5] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-500">
              {location.badge}
            </span>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-primary)]">{location.category}</p>
          <p className="mt-2 text-sm text-slate-600">{location.description}</p>
        </div>
      </div>
      {location.externalUrl ? (
        <a
          href={location.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className={actionClassName}
        >
          {isSelected ? 'Selected' : 'View details'}
          <ArrowRight size={14} />
        </a>
      ) : (
        <button
          type="button"
          onClick={() => onViewDetails(location)}
          className={actionClassName}
        >
          {isSelected ? 'Selected' : 'View details'}
          <ArrowRight size={14} />
        </button>
      )}
    </>
  )

  return location.externalUrl ? (
    <div
      className={cardClassName}
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(location)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onViewDetails(location)
        }
      }}
    >
      {cardContent}
    </div>
  ) : (
    <div className={cardClassName}>{cardContent}</div>
  )
}
