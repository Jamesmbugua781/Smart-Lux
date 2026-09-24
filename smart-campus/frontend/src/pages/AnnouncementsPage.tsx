import { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { PageHeader } from '../components/ui/PageHeader'
import { AnnouncementCard } from '../components/announcements/AnnouncementCard'
import { announcementItems } from '../data/announcements'

export function AnnouncementsPage() {
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<string | null>(null)

  const toggleAnnouncement = (id: string) => {
    setExpandedAnnouncementId((currentId) => (currentId === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Latest announcements"
            subtitle="Stay informed with the latest updates from the university and student services."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {announcementItems.map((item) => (
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
    </div>
  )
}
