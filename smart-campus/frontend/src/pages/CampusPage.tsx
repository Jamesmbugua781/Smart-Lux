import { Search, X } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PageHeader } from '../components/ui/PageHeader'
import { LocationCard } from '../components/campus/LocationCard'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { campusLocations } from '../data/campusData'

export function CampusPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('query') ?? ''

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
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onViewDetails={(location) => navigate(`/map?location=${location.id}`)}
                  />
                ))
              ) : (
                <EmptyState title="No locations found" description="Try a building name, office type, service, or area." />
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
