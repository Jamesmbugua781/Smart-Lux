interface SuggestionChipProps {
  label: string
  onClick?: (label: string) => void
}

export function SuggestionChip({ label, onClick }: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(label)}
      className="rounded-full border border-[#dfe7ee] bg-[#f8fbff] px-3 py-2 text-sm text-[#0B1F33] transition hover:border-[#bfd5ff] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
    >
      {label}
    </button>
  )
}
