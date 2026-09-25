export type MessageRole = 'user' | 'assistant'

export interface ChatMessageData {
  id: string
  role: MessageRole
  text: string
  timestamp?: string
  sources?: Array<{
    source?: string
    title: string
    type?: string
    snippet?: string
    confidence?: number
  }>
}

export interface CampusLocation {
  id: string
  name: string
  category: string
  description: string
  badge: string
  area: string
  locationType: 'library' | 'school' | 'support' | 'registry' | 'ict'
  mapPosition: { left: string; top: string }
  externalUrl?: string
}

export interface ServiceCategory {
  id: string
  title: string
  description: string
  icon: string
}

export interface AnnouncementItem {
  id: string
  title: string
  date: string
  category: string
  summary: string
}

export interface AcademicSection {
  id: string
  title: string
  subtitle: string
  items: AcademicItem[]
}

export interface AcademicItem {
  label: string
  externalUrl?: string
}
