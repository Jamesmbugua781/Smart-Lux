const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export interface ChatSource {
  source: string
  title: string
}

export interface ChatResponse {
  message: string
  language: string
  sources: ChatSource[]
  suggestions: string[]
}

export async function sendChatMessage(message: string, language = 'en'): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language }),
  })

  if (!response.ok) throw new Error('Chat request failed')
  return response.json() as Promise<ChatResponse>
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/health`)
  return response.json()
}

export async function fetchCampusLocations() {
  const response = await fetch(`${API_BASE_URL}/campus`)
  return response.json()
}

export async function fetchAnnouncements() {
  const response = await fetch(`${API_BASE_URL}/announcements`)
  return response.json()
}

export async function fetchAcademics() {
  const response = await fetch(`${API_BASE_URL}/academics`)
  return response.json()
}
