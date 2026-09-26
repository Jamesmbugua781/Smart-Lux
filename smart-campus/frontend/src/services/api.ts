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
  session_id?: string
  is_verified: boolean
  confidence: number
  sources: ChatSource[]
  suggestions: string[]
}

export async function sendChatMessage(
  message: string,
  language = 'en',
  history: Array<{ role: string; content: string }> = [],
  sessionId?: string | null,
  institutionId = 'dekut',
  authToken?: string | null,
): Promise<ChatResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, language, history, session_id: sessionId, institution_id: institutionId }),
  })

  if (!response.ok) throw new Error('Chat request failed')
  return response.json() as Promise<ChatResponse>
}

export async function fetchSessionsApi(institutionId = 'dekut', authToken?: string | null) {
  const headers: Record<string, string> = {}
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  const response = await fetch(`${API_BASE_URL}/api/chat/sessions?institution_id=${institutionId}`, { headers })
  if (!response.ok) return []
  return response.json()
}

export async function fetchSessionMessagesApi(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionId}`)
  if (!response.ok) throw new Error('Failed to load session messages')
  return response.json()
}

export async function deleteSessionApi(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionId}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete session')
  return response.json()
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

// ---------------------------------------------------------------------------
// Institution API (used by AuthProvider for the institution selector)
// ---------------------------------------------------------------------------
export async function fetchInstitutionsApi(): Promise<import('../types').Institution[]> {
  const response = await fetch(`${API_BASE_URL}/api/auth/institutions`)
  if (!response.ok) throw new Error('Failed to fetch institutions')
  return response.json()
}

// ---------------------------------------------------------------------------
// Institution Admin Document Upload & Management APIs
// ---------------------------------------------------------------------------
export async function uploadAdminTextDocApi(
  filename: string,
  content: string,
  fileType = 'txt',
  institutionId = 'dekut',
  authToken?: string | null,
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const response = await fetch(`${API_BASE_URL}/api/admin/documents/upload-text`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ filename, content, file_type: fileType, institution_id: institutionId }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'Document upload failed')
  }
  return response.json()
}

export async function fetchAdminDocsApi(institutionId = 'dekut', authToken?: string | null) {
  const headers: Record<string, string> = {}
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const response = await fetch(`${API_BASE_URL}/api/admin/documents?institution_id=${institutionId}`, { headers })
  if (!response.ok) return []
  return response.json()
}

export async function deleteAdminDocApi(documentId: string, authToken?: string | null) {
  const headers: Record<string, string> = {}
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const response = await fetch(`${API_BASE_URL}/api/admin/documents/${documentId}`, {
    method: 'DELETE',
    headers,
  })
  if (!response.ok) throw new Error('Failed to delete document')
  return response.json()
}

export async function createInstitutionApi(
  id: string,
  code: string,
  name: string,
  city: string,
  description: string,
  authToken?: string | null,
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const response = await fetch(`${API_BASE_URL}/api/admin/institutions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id, code, name, city, description }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'Failed to create institution')
  }
  return response.json()
}


