import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CampusMap } from '../components/CampusMap'
import { MapLegend } from '../components/MapLegend'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { PageHeader } from '../components/ui/PageHeader'
import type { CampusLocation } from '../types'
import { fetchCampusLocations } from '../services/api'
import { LoadingState } from '../components/ui/LoadingState'

export function MapPage() {
  const [searchParams] = useSearchParams()
  const [locations, setLocations] = useState<CampusLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    fetchCampusLocations()
      .then((nextLocations) => {
        if (!isMounted) return
        setLocations(nextLocations)
        setSelectedLocation(nextLocations.find((location) => location.id === searchParams.get('location')) ?? nextLocations[0] ?? null)
      })
      .catch(() => {
        if (isMounted) setLoadError('Campus information could not be loaded.')
      })

    return () => {
      isMounted = false
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader title="Campus Map" subtitle="Find important campus locations and services at a glance." />

          <section className="overflow-hidden rounded-[28px] border border-[#edf0f2] bg-white p-5 shadow-[0_18px_50px_rgba(11,31,58,0.05)]" aria-labelledby="campus-map-title">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="campus-map-title" className="text-xl font-semibold text-[#0B1F3A]">Campus map</h2>
              <span className="text-xs text-slate-500">{locations.length} locations</span>
            </div>

            {loadError ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p> : null}
            {!loadError && !selectedLocation ? <LoadingState /> : null}
            {selectedLocation ? (
              <div className="relative h-[540px] overflow-hidden rounded-2xl border border-[#edf0f2]">
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
