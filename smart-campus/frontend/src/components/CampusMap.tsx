import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { CampusLocation } from '../types'
import 'leaflet/dist/leaflet.css'

const campusCenter: [number, number] = [-0.4, 36.955]
const markerColors: Record<CampusLocation['locationType'], string> = {
  library: '#2563eb',
  school: '#0b1f33',
  support: '#f59e0b',
  registry: '#8b5cf6',
  ict: '#06b6d4',
}

function createLocationIcon(type: CampusLocation['locationType']) {
  return L.divIcon({
    className: 'campus-map-marker',
    html: `<span style="background:${markerColors[type]}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}

function createGroupedIcon(count: number) {
  return L.divIcon({
    className: 'campus-map-group-marker',
    html: `<span>${count}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

interface MapControllerProps {
  selectedLocation: CampusLocation
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>
}

function MapController({ selectedLocation, markerRefs }: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    const { lat, lng } = selectedLocation.coordinates
    map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true })
    markerRefs.current[selectedLocation.id]?.openPopup()
  }, [map, markerRefs, selectedLocation])

  return null
}

interface CampusMapProps {
  locations: CampusLocation[]
  selectedLocation: CampusLocation
  onSelectLocation: (location: CampusLocation) => void
}

export function CampusMap({ locations, selectedLocation, onSelectLocation }: CampusMapProps) {
  const markerRefs = useRef<Record<string, L.Marker | null>>({})
  const locationGroups = useMemo(() => {
    const groups = new Map<string, CampusLocation[]>()

    locations.forEach((location) => {
      const groupKey = location.buildingId ?? location.id
      groups.set(groupKey, [...(groups.get(groupKey) ?? []), location])
    })

    return [...groups.values()]
  }, [locations])
  const icons = useMemo(() => (
    Object.fromEntries(Object.keys(markerColors).map((type) => [type, createLocationIcon(type as CampusLocation['locationType'])])) as Record<CampusLocation['locationType'], L.DivIcon>
  ), [])
  const groupedIcon = useMemo(() => createGroupedIcon(3), [])

  return (
    <MapContainer
      center={campusCenter}
      zoom={16}
      scrollWheelZoom
      className="h-full min-h-[420px] w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapController selectedLocation={selectedLocation} markerRefs={markerRefs} />
      {locationGroups.map((group) => {
        const firstLocation = group[0]
        const isGrouped = group.length > 1

        return (
          <Marker
            key={firstLocation.buildingId ?? firstLocation.id}
            ref={(marker) => {
              group.forEach((location) => {
                markerRefs.current[location.id] = marker
              })
            }}
            position={[firstLocation.coordinates.lat, firstLocation.coordinates.lng]}
            icon={isGrouped ? groupedIcon : icons[firstLocation.locationType]}
            eventHandlers={{ click: () => { if (!isGrouped) onSelectLocation(firstLocation) } }}
          >
            <Popup>
              {isGrouped ? (
                <div className="space-y-2">
                  <p className="font-semibold text-[#0B1F33]">Admin &amp; Academic Block</p>
                  <p className="text-xs text-slate-500">3 services in this shared building</p>
                  <div className="space-y-1">
                    {group.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => onSelectLocation(location)}
                        className="block w-full rounded px-2 py-1 text-left text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold text-[#0B1F33]">{firstLocation.name}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-primary)]">{firstLocation.category}</p>
                  <p className="text-sm text-slate-600">{firstLocation.description}</p>
                </div>
              )}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}