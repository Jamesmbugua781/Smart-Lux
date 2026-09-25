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
  coordinates: { lat: number; lng: number }
  buildingId?: string
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

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: 'student' | 'admin' | 'super_admin'
  auth_provider: 'email' | 'google'
  institution_id: string
}

export interface Institution {
  id: string
  code: string
  name: string
  description: string
  city: string
  logo_url?: string
  is_active: boolean
}

export interface AuthTokenResponse {
  access_token: string
  token_type: string
  user: User
}

