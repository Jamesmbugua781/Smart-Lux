import { SendHorizonal } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface ChatInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function ChatInput({ placeholder = 'Ask Smart Lux...', value, onChange, onSubmit, disabled }: ChatInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!value.trim() || disabled) return
      onSubmit()
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#edf0f2] bg-white p-2 shadow-[0_10px_30px_rgba(11,31,58,0.06)]">
      <Input
        aria-label="Message input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="border-0 bg-transparent px-3 py-2 text-sm shadow-none focus:ring-0"
      />
      <Button type="button" variant="primary" className="rounded-xl px-4 py-2.5" onClick={onSubmit} disabled={disabled || !value.trim()} aria-label="Send message">
        <SendHorizonal size={16} />
      </Button>
    </div>
  )
}
