interface SuggestionChipProps {
  label: string
  onClick?: (label: string) => void
}

export function SuggestionChip({ label, onClick }: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(label)}
      className="rounded-full border border-[#dfe4e8] bg-white px-3 py-2 text-sm text-[#0B1F3A] transition hover:border-[#b4d4c3] hover:bg-[#f0f7f3]"
    >
      {label}
    </button>
  )
}
