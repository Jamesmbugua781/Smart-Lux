import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { SuggestionChip } from '../components/chat/SuggestionChip'
import { PageHeader } from '../components/ui/PageHeader'
import { ServiceCard } from '../components/campus/ServiceCard'
import { popularQuestions, serviceCategories } from '../data/campusData'

export function ExplorePage() {
  const navigate = useNavigate()

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
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Popular questions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularQuestions.map((question) => <SuggestionChip key={question} label={question} onClick={(value) => navigate(`/chat?question=${encodeURIComponent(value)}`)} />)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
