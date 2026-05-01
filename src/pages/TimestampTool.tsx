import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [nowTimestamp, setNowTimestamp] = useState('')
  const [nowDateStr, setNowDateStr] = useState('')
  const { addToast } = useToastStore()

  useEffect(() => {
    const updateNow = () => {
      const now = new Date()
      setNowTimestamp(Math.floor(now.getTime() / 1000).toString())
      setNowDateStr(now.toLocaleString('zh-CN'))
    }
    updateNow()
    const interval = setInterval(updateNow, 1000)
    return () => clearInterval(interval)
  }, [])

  const timestampToDate = useCallback(() => {
    try {
      const ts = parseInt(timestamp)
      if (isNaN(ts)) {
        setDateStr('无效的时间戳')
        addToast('无效的时间戳', 'error')
        return
      }
      const date = new Date(ts.toString().length === 10 ? ts * 1000 : ts)
      const result = date.toLocaleString('zh-CN')
      setDateStr(result)
      addToast('转换成功', 'success')
    } catch {
      setDateStr('转换失败')
      addToast('转换失败', 'error')
    }
  }, [timestamp, addToast])

  const dateToTimestamp = useCallback(() => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        setTimestamp('无效的日期格式')
        addToast('无效的日期格式', 'error')
        return
      }
      const result = Math.floor(date.getTime() / 1000).toString()
      setTimestamp(result)
      addToast('转换成功', 'success')
    } catch {
      setTimestamp('转换失败')
      addToast('转换失败', 'error')
    }
  }, [dateStr, addToast])

  const useNow = () => {
    setTimestamp(nowTimestamp)
    setDateStr(nowDateStr)
    addToast('已填入当前时间', 'info')
  }

  const clearAll = () => {
    setTimestamp('')
    setDateStr('')
    addToast('已清空', 'info')
  }

  return (
    <ToolLayout title="时间戳转换" description="时间戳与日期时间互转">
      <div className="flex flex-col gap-6">
        <div className="rounded-md border border-border bg-muted/30 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">当前时间</span>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">时间戳:</span>
                <code className="text-sm font-mono">{nowTimestamp}</code>
                <CopyButton text={nowTimestamp} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">日期:</span>
                <span className="text-sm">{nowDateStr}</span>
                <CopyButton text={nowDateStr} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">时间戳转日期</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="输入时间戳..."
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
                <ClearButton onClick={() => setTimestamp('')} visible={timestamp.length > 0} className="top-1.5" />
              </div>
              <button onClick={timestampToDate} className="btn-primary whitespace-nowrap">转换</button>
            </div>
            {dateStr && (
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3">
                <span className="text-sm">{dateStr}</span>
                <CopyButton text={dateStr} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">日期转时间戳</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  placeholder="输入日期 (如: 2024-01-01 12:00:00)..."
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <ClearButton onClick={() => setDateStr('')} visible={dateStr.length > 0} className="top-1.5" />
              </div>
              <button onClick={dateToTimestamp} className="btn-primary whitespace-nowrap">转换</button>
            </div>
            {timestamp && !isNaN(parseInt(timestamp)) && (
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3">
                <code className="text-sm font-mono">{timestamp}</code>
                <CopyButton text={timestamp} />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <button onClick={useNow} className="btn-secondary">使用当前时间</button>
          <button onClick={clearAll} className="btn-secondary">清空</button>
        </div>
      </div>
    </ToolLayout>
  )
}
