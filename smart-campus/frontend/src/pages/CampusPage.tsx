import { ArrowRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CampusMap } from '../components/CampusMap'
import { MapLegend } from '../components/MapLegend'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PageHeader } from '../components/ui/PageHeader'
import { LocationCard } from '../components/campus/LocationCard'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { fetchCampusLocations } from '../services/api'
import type { CampusLocation } from '../types'
import { LoadingState } from '../components/ui/LoadingState'

export function CampusPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') ?? ''
  const [locations, setLocations] = useState<CampusLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    fetchCampusLocations()
      .then((nextLocations) => {
        if (!isMounted) return
        setLocations(nextLocations)
        setSelectedLocation(nextLocations[0] ?? null)
      })
      .catch(() => {
        if (isMounted) setLoadError('Campus information could not be loaded.')
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return locations

    return locations.filter((location) =>
      [location.name, location.category, location.description, location.badge, location.area].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [locations, query])

  const updateQuery = (nextQuery: string) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)

      if (nextQuery.trim()) {
        nextParams.set('query', nextQuery)
      } else {
        nextParams.delete('query')
      }

      return nextParams
    })
  }

  const clearQuery = () => {
    updateQuery('')
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title="Campus Directory" subtitle="Search for buildings, schools, offices, and support services." />

          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              <div className="flex w-full items-center gap-3 rounded-2xl border border-[#edf0f2] bg-white p-2 shadow-sm">
                <Search className="ml-3 text-[var(--color-primary)]" size={18} />
                <Input
                  aria-label="Search campus locations"
                  placeholder="Search buildings, schools, offices..."
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  className="border-0 bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearQuery}
                    className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                    aria-label="Clear campus search"
                  >
                    <X size={15} />
                  </button>
                ) : null}
              </div>
              {loadError ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p> : null}
              {!loadError && locations.length === 0 ? <LoadingState /> : null}
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    isSelected={selectedLocation?.id === location.id}
                    onViewDetails={setSelectedLocation}
                  />
                ))
              ) : (
                <EmptyState title="No locations found" description="Try a building name, office type, service, or area." />
              )}
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#edf0f2] bg-white p-5 shadow-[0_18px_50px_rgba(11,31,58,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#0B1F3A]">Campus map</h2>
                <span className="text-xs text-slate-500">{locations.length} locations</span>
              </div>

              {selectedLocation ? (
                <div className="relative h-[460px] overflow-hidden rounded-2xl border border-[#edf0f2]">
                  <CampusMap
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={setSelectedLocation}
                  />

                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#edf0f2] bg-white/90 p-4 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Selected location</p>
                    <h3 className="mt-2 font-semibold text-[#0B1F3A]">{selectedLocation.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{selectedLocation.area}</p>
                    <Link
                      to={`/chat?question=${encodeURIComponent(`Tell me about ${selectedLocation.name}`)}`}
                      className="action-link mt-3 text-sm"
                    >
                      Ask assistant
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : null}

              {locations.length > 0 ? <MapLegend locations={locations} onSelectLocation={setSelectedLocation} /> : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
