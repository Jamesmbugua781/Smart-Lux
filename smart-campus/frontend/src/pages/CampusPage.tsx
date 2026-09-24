import { ArrowRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { PageHeader } from '../components/ui/PageHeader'
import { LocationCard } from '../components/campus/LocationCard'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { campusLocations } from '../data/campus'
import type { CampusLocation } from '../types'

export function CampusPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') ?? ''
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation>(campusLocations[0])

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return campusLocations

    return campusLocations.filter((location) =>
      [location.name, location.category, location.description, location.badge, location.area].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query])

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

          <div className="mb-8 flex max-w-xl items-center gap-3 rounded-2xl border border-[#edf0f2] bg-white p-2 shadow-sm">
            <Search className="ml-3 text-[#126B3A]" size={18} />
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
                className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#f0f7f3] hover:text-[#126B3A]"
                aria-label="Clear campus search"
              >
                <X size={15} />
              </button>
            ) : null}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    isSelected={selectedLocation.id === location.id}
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
                <span className="rounded-full border border-[#dfe4e8] bg-[#f8f8f5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Demo
                </span>
              </div>

              <div className="relative h-[460px] overflow-hidden rounded-2xl border border-[#edf0f2] bg-[radial-gradient(circle_at_center,_rgba(18,107,58,0.08),_rgba(255,255,255,1)_58%)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(11,31,58,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,31,58,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />

                <button type="button" onClick={() => setSelectedLocation(campusLocations[0])} className="absolute left-[18%] top-[18%] flex h-4 w-4 items-center justify-center rounded-full bg-[#126B3A] shadow-[0_0_0_8px_rgba(18,107,58,0.08)]" aria-label="Select Central Library">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </button>
                <button type="button" onClick={() => setSelectedLocation(campusLocations[2])} className="absolute left-[52%] top-[42%] flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A227] shadow-[0_0_0_8px_rgba(201,162,39,0.08)]" aria-label="Select Student Services Center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </button>
                <button type="button" onClick={() => setSelectedLocation(campusLocations[1])} className="absolute left-[65%] top-[28%] flex h-4 w-4 items-center justify-center rounded-full bg-[#0B1F3A] shadow-[0_0_0_8px_rgba(11,31,58,0.08)]" aria-label="Select School of Computer Science">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </button>
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#edf0f2] bg-white/90 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#126B3A]">Selected location</p>
                  <h3 className="mt-2 font-semibold text-[#0B1F3A]">{selectedLocation.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{selectedLocation.area}</p>
                  <Link
                    to={`/chat?question=${encodeURIComponent(`Tell me about ${selectedLocation.name}`)}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#126B3A]"
                  >
                    Ask assistant
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
