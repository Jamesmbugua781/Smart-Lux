import { useEffect, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PageHeader } from '../components/ui/PageHeader'
import { AnnouncementCard } from '../components/announcements/AnnouncementCard'
import { fetchAnnouncements } from '../services/api'
import type { AnnouncementItem } from '../types'
import { LoadingState } from '../components/ui/LoadingState'

export function AnnouncementsPage() {
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<string | null>(null)
  const [announcementItems, setAnnouncementItems] = useState<AnnouncementItem[]>([])
  const [loadError, setLoadError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Academic', 'Library', 'ICT', 'Student Support']

  const toggleAnnouncement = (id: string) => {
    setExpandedAnnouncementId((currentId) => (currentId === id ? null : id))
  }

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncementItems)
      .catch(() => setLoadError('Announcements could not be loaded.'))
  }, [])

  const filteredAnnouncements = selectedCategory === 'All'
    ? announcementItems
    : announcementItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Latest announcements"
            subtitle="Stay informed with the latest updates from the university and student services."
          />

          {loadError ? <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p> : null}
          {!loadError && announcementItems.length === 0 ? <LoadingState /> : null}

          <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter announcements by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${selectedCategory === category ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {filteredAnnouncements.map((item) => (
              <AnnouncementCard
                key={item.id}
                item={item}
                isExpanded={expandedAnnouncementId === item.id}
                onToggle={toggleAnnouncement}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
