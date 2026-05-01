import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/toastStore'

interface CopyButtonProps {
  text: string
  className?: string
  showToast?: boolean
  disabled?: boolean
}

export default function CopyButton({ text, className, showToast = true, disabled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToastStore()

  const handleCopy = async () => {
    if (disabled) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (showToast) {
        addToast('已复制到剪贴板', 'success')
      }
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('复制失败', 'error')
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 h-8 w-8',
        copied && 'border-green-500/30 bg-green-500/10',
        className
      )}
      title={copied ? '已复制' : '复制'}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
