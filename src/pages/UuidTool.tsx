import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import { RefreshCw } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'

function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateUUIDv1(): string {
  const now = new Date()
  const timestamp = now.getTime()
  const hexTimestamp = timestamp.toString(16).padStart(12, '0')
  const clockSeq = Math.floor(Math.random() * 16384).toString(16).padStart(4, '0')
  const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')
  return `${hexTimestamp.slice(0, 8)}-${hexTimestamp.slice(8)}-1${clockSeq.slice(0, 3)}-${clockSeq.slice(3)}${node.slice(0, 2)}-${node.slice(2)}`
}

function generateShortUUID(): string {
  return Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

function generateNanoId(size: number = 21): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const array = new Uint8Array(size)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => alphabet[byte % alphabet.length]).join('')
}

export default function UuidTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])
  const [format, setFormat] = useState<'v4' | 'v1' | 'short' | 'nanoid'>('v4')
  const [uppercase, setUppercase] = useState(false)
  const [withHyphens, setWithHyphens] = useState(true)
  const { addToast } = useToastStore()

  const generate = useCallback(() => {
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = ''
      switch (format) {
        case 'v4':
          uuid = generateUUIDv4()
          break
        case 'v1':
          uuid = generateUUIDv1()
          break
        case 'short':
          uuid = generateShortUUID()
          break
        case 'nanoid':
          uuid = generateNanoId()
          break
      }
      if (uppercase) uuid = uuid.toUpperCase()
      if (!withHyphens && format !== 'short' && format !== 'nanoid') {
        uuid = uuid.replace(/-/g, '')
      }
      results.push(uuid)
    }
    setUuids(results)
    addToast(`已生成 ${count} 个 ${format.toUpperCase()}`, 'success')
  }, [count, format, uppercase, withHyphens, addToast])

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      addToast('已复制全部到剪贴板', 'success')
    } catch {
      addToast('复制失败', 'error')
    }
  }

  const clearAll = () => {
    setUuids([])
    addToast('已清空', 'info')
  }

  return (
    <ToolLayout title="UUID生成" description="生成各种格式的唯一标识符">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">格式</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'v4' | 'v1' | 'short' | 'nanoid')}
              className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="v4">UUID v4 (随机)</option>
              <option value="v1">UUID v1 (时间戳)</option>
              <option value="short">短ID (8位)</option>
              <option value="nanoid">NanoID</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">数量</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="h-9 w-20 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm">大写</span>
          </label>

          {(format === 'v4' || format === 'v1') && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={withHyphens}
                onChange={(e) => setWithHyphens(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm">包含连字符</span>
            </label>
          )}

          <button onClick={generate} className="btn-primary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            生成
          </button>
          {uuids.length > 0 && (
            <button onClick={clearAll} className="btn-secondary">清空</button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">生成结果</label>
              <button onClick={copyAll} className="btn-secondary text-xs">复制全部</button>
            </div>
            <div className="flex flex-col gap-2">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 group hover:border-primary/30 transition-all duration-200"
                >
                  <code className="text-sm font-mono">{uuid}</code>
                  <CopyButton text={uuid} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
