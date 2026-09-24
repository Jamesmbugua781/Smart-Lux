import { Navbar } from '../components/layout/Navbar'
import { PageHeader } from '../components/ui/PageHeader'
import { ServiceCard } from '../components/campus/ServiceCard'
import { serviceCategories } from '../data/services'

export function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Explore Campus"
            subtitle="Find the information and services you need."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {serviceCategories.map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
