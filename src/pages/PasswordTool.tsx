import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import { RefreshCw, Trash2 } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generatePassword(options: {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}): string {
  let chars = ''
  if (options.lowercase) chars += LOWERCASE
  if (options.uppercase) chars += UPPERCASE
  if (options.numbers) chars += NUMBERS
  if (options.symbols) chars += SYMBOLS

  if (!chars) return ''

  let password = ''
  const array = new Uint32Array(options.length)
  crypto.getRandomValues(array)

  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length]
  }

  return password
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const labels = ['极弱', '弱', '一般', '强', '极强']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']

  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    color: colors[Math.min(score, 4)],
  }
}

export default function PasswordTool() {
  const [length, setLength] = useState(16)
  const [lowercase, setLowercase] = useState(true)
  const [uppercase, setUppercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const { addToast } = useToastStore()

  const generate = useCallback(() => {
    const newPassword = generatePassword({ length, lowercase, uppercase, numbers, symbols })
    if (!newPassword) {
      addToast('请至少选择一种字符类型', 'warning')
      return
    }
    setPassword(newPassword)
    setHistory((prev) => [newPassword, ...prev].slice(0, 10))
    addToast('密码生成成功', 'success')
  }, [length, lowercase, uppercase, numbers, symbols, addToast])

  const clearHistory = () => {
    setHistory([])
    setPassword('')
    addToast('已清空历史记录', 'info')
  }

  const strength = calculateStrength(password)

  return (
    <ToolLayout title="密码生成" description="生成随机安全密码">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/30 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">密码长度</label>
                <span className="text-sm font-mono">{length}</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm">小写字母 (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm">大写字母 (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm">数字 (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm">特殊符号</span>
            </label>
          </div>

          <button onClick={generate} className="btn-primary flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />
            生成密码
          </button>
        </div>

        {password && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">生成的密码</label>
              <CopyButton text={password} />
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-4">
              <code className="break-all text-lg font-mono">{password}</code>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${strength.color}`}
                  style={{ width: `${((strength.score + 1) / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{strength.label}</span>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">历史记录</label>
              <button onClick={clearHistory} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Trash2 className="h-3 w-3" />
                清空
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {history.map((p, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2"
                >
                  <code className="text-sm font-mono truncate flex-1 mr-2">{p}</code>
                  <CopyButton text={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
