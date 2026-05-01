import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClearButtonProps {
  onClick: () => void
  className?: string
  visible: boolean
}

export default function ClearButton({ onClick, className, visible }: ClearButtonProps) {
  if (!visible) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-accent hover:text-foreground',
        className
      )}
      title="清空"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  )
}
