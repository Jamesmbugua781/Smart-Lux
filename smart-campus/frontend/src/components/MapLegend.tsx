import type { CampusLocation } from '../types'

interface MapLegendProps {
  locations: CampusLocation[]
  onSelectLocation: (location: CampusLocation) => void
}

export function MapLegend({ locations, onSelectLocation }: MapLegendProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500" aria-label="Map locations legend">
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          onClick={() => onSelectLocation(location)}
          className="inline-flex items-center gap-1.5 rounded px-1 py-1 capitalize transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          aria-label={`Show ${location.name} on map`}
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: `var(--color-pin-${location.locationType})` }} />
          {location.name}
        </button>
      ))}
      <span className="inline-flex items-center gap-1.5 px-1 py-1">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">3</span>
        grouped shared building
      </span>
    </div>
  )
}
