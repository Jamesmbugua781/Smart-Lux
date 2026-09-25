import type { AcademicSection, AnnouncementItem, CampusLocation } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

const mapPositions: Record<string, { left: string; top: string }> = {
  library: { left: '18%', top: '18%' },
  'computer-science': { left: '65%', top: '28%' },
  'student-center': { left: '52%', top: '42%' },
  registry: { left: '25%', top: '62%' },
  ict: { left: '74%', top: '64%' },
  engineering: { left: '42%', top: '76%' },
}

export interface ChatSource {
  source: string
  title: string
  snippet?: string
  confidence?: number
}

export interface ChatResponse {
  message: string
  language: string
  is_verified: boolean
  confidence: number
  sources: ChatSource[]
  suggestions: string[]
}

export async function sendChatMessage(
  message: string,
  language = 'en',
  history: Array<{ role: string; content: string }> = [],
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history }),
  })

  if (!response.ok) throw new Error('Chat request failed')
  return response.json() as Promise<ChatResponse>
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`)
  if (!response.ok) throw new Error('Health request failed')
  return response.json()
}

interface CampusLocationApiResponse {
  id: string
  name: string
  category: string
  description: string
  badge: string
  area: string
  location_type: CampusLocation['locationType']
  coordinates: { lat: number; lng: number }
  building_id?: string
  external_url?: string
}

export async function fetchCampusLocations(): Promise<CampusLocation[]> {
  const response = await fetch(`${API_BASE_URL}/api/campus`)
  if (!response.ok) throw new Error('Campus locations request failed')

  const locations = await response.json() as CampusLocationApiResponse[]
  return locations.map((location) => ({
    id: location.id,
    name: location.name,
    category: location.category,
    description: location.description,
    badge: location.badge,
    area: location.area,
    locationType: location.location_type,
    mapPosition: mapPositions[location.id] ?? { left: '50%', top: '50%' },
    coordinates: location.coordinates,
    buildingId: location.building_id,
    externalUrl: location.external_url,
  }))
}

export async function fetchAnnouncements(): Promise<AnnouncementItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/announcements`)
  if (!response.ok) throw new Error('Announcements request failed')
  return response.json() as Promise<AnnouncementItem[]>
}

export async function fetchAcademics(): Promise<AcademicSection[]> {
  const response = await fetch(`${API_BASE_URL}/api/academics`)
  if (!response.ok) throw new Error('Academics request failed')
  const sections = await response.json() as Array<Omit<AcademicSection, 'items'> & { items: string[] }>
  return sections.map((section) => ({
    ...section,
    items: section.items.map((label) => ({ label })),
  }))
}
