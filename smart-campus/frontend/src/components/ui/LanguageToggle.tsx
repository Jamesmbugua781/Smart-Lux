import { Globe } from 'lucide-react'
import { useState } from 'react'

export function LanguageToggle() {
  const [language, setLanguage] = useState<'EN' | 'SW'>('EN')

  return (
    <button
      type="button"
      onClick={() => setLanguage((current) => (current === 'EN' ? 'SW' : 'EN'))}
      className="inline-flex items-center gap-2 rounded-full border border-[#dfe7ee] bg-white px-3 py-2 text-xs font-medium text-[#0B1F33] transition hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      aria-label={`Switch language. Current language is ${language}`}
    >
      <Globe size={14} />
      {language}
    </button>
  )
}