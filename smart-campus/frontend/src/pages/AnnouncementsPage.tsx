import { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PageHeader } from '../components/ui/PageHeader'
import { AnnouncementCard } from '../components/announcements/AnnouncementCard'
import { announcementItems } from '../data/announcements'

export function AnnouncementsPage() {
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Academic', 'Library', 'ICT', 'Student Support']

  const toggleAnnouncement = (id: string) => {
    setExpandedAnnouncementId((currentId) => (currentId === id ? null : id))
  }

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
