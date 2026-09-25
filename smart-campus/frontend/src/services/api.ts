const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

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
  return response.json()
}

export async function fetchCampusLocations() {
  const response = await fetch(`${API_BASE_URL}/api/campus`)
  return response.json()
}

export async function fetchAnnouncements() {
  const response = await fetch(`${API_BASE_URL}/api/announcements`)
  return response.json()
}

export async function fetchAcademics() {
  const response = await fetch(`${API_BASE_URL}/api/academics`)
  return response.json()
}
