import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

interface CronField {
  label: string
  min: number
  max: number
  value: string
}

const defaultFields: CronField[] = [
  { label: '秒', min: 0, max: 59, value: '0' },
  { label: '分', min: 0, max: 59, value: '0' },
  { label: '时', min: 0, max: 23, value: '0' },
  { label: '日', min: 1, max: 31, value: '*' },
  { label: '月', min: 1, max: 12, value: '*' },
  { label: '周', min: 0, max: 6, value: '?' },
]

const presets = [
  { name: '每分钟', cron: '0 * * * * ?' },
  { name: '每小时', cron: '0 0 * * * ?' },
  { name: '每天凌晨', cron: '0 0 0 * * ?' },
  { name: '每天中午', cron: '0 0 12 * * ?' },
  { name: '每周一', cron: '0 0 0 ? * 1' },
  { name: '每月1号', cron: '0 0 0 1 * ?' },
  { name: '每年1月1日', cron: '0 0 0 1 1 ?' },
]

function parseCron(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 6 && parts.length !== 7) {
    return '无效的 Cron 表达式'
  }

  const [second, minute, hour, day, month, week] = parts

  const descriptions: string[] = []

  if (second === '0' || second === '00') {
    descriptions.push('第0秒')
  } else if (second === '*') {
    descriptions.push('每秒')
  } else if (second.includes('/')) {
    const step = second.split('/')[1]
    descriptions.push(`每隔${step}秒`)
  } else {
    descriptions.push(`第${second}秒`)
  }

  if (minute === '0' || minute === '00') {
    descriptions.push('第0分')
  } else if (minute === '*') {
    descriptions.push('每分')
  } else if (minute.includes('/')) {
    const step = minute.split('/')[1]
    descriptions.push(`每隔${step}分钟`)
  } else {
    descriptions.push(`第${minute}分`)
  }

  if (hour === '0' || hour === '00') {
    descriptions.push('0点')
  } else if (hour === '*') {
    descriptions.push('每小时')
  } else if (hour.includes('/')) {
    const step = hour.split('/')[1]
    descriptions.push(`每隔${step}小时`)
  } else {
    descriptions.push(`${hour}点`)
  }

  if (day === '*') {
    descriptions.push('每天')
  } else if (day === '?') {
    // ignore
  } else if (day.includes('/')) {
    const step = day.split('/')[1]
    descriptions.push(`每隔${step}天`)
  } else {
    descriptions.push(`${day}日`)
  }

  if (month === '*') {
    descriptions.push('每月')
  } else if (month.includes('/')) {
    const step = month.split('/')[1]
    descriptions.push(`每隔${step}个月`)
  } else {
    descriptions.push(`${month}月`)
  }

  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  if (week === '*' || week === '?') {
    // ignore
  } else if (week.includes('/')) {
    const step = week.split('/')[1]
    descriptions.push(`每隔${step}周`)
  } else {
    const weekNum = parseInt(week)
    if (!isNaN(weekNum) && weekNum >= 0 && weekNum <= 6) {
      descriptions.push(weekNames[weekNum])
    }
  }

  return descriptions.join('，')
}

export default function CronTool() {
  const [fields, setFields] = useState<CronField[]>(defaultFields)
  const [cronInput, setCronInput] = useState('0 0 0 * * ?')
  const [description, setDescription] = useState('')
  const { addToast } = useToastStore()

  const updateField = useCallback((index: number, value: string) => {
    setFields((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], value }
      return next
    })
  }, [])

  const buildCron = useCallback(() => {
    const cron = fields.map((f) => f.value).join(' ')
    setCronInput(cron)
    setDescription(parseCron(cron))
    addToast('表达式已生成', 'success')
  }, [fields, addToast])

  const parseInput = useCallback(() => {
    const parts = cronInput.trim().split(/\s+/)
    if (parts.length === 6) {
      setFields((prev) =>
        prev.map((f, i) => ({
          ...f,
          value: parts[i] || '*',
        }))
      )
      setDescription(parseCron(cronInput))
      addToast('表达式解析成功', 'success')
    } else {
      setDescription('无效的 Cron 表达式（需要6个字段）')
      addToast('无效的 Cron 表达式', 'error')
    }
  }, [cronInput, addToast])

  const applyPreset = (cron: string) => {
    setCronInput(cron)
    const parts = cron.trim().split(/\s+/)
    if (parts.length === 6) {
      setFields((prev) =>
        prev.map((f, i) => ({
          ...f,
          value: parts[i] || '*',
        }))
      )
      setDescription(parseCron(cron))
      addToast('已应用预设', 'info')
    }
  }

  const clearAll = () => {
    setFields(defaultFields)
    setCronInput('')
    setDescription('')
    addToast('已清空', 'info')
  }

  return (
    <ToolLayout title="Cron表达式" description="生成和解析 Cron 定时任务表达式">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">常用预设</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.cron)}
                className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {fields.map((field, index) => (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label} ({field.min}-{field.max})
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(index, e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm font-mono shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={buildCron} className="btn-primary">生成表达式</button>
          <button onClick={parseInput} className="btn-primary">解析表达式</button>
          <button onClick={clearAll} className="btn-secondary">清空</button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cron 表达式</label>
            <CopyButton text={cronInput} />
          </div>
          <div className="relative">
            <input
              type="text"
              value={cronInput}
              onChange={(e) => setCronInput(e.target.value)}
              placeholder="输入 Cron 表达式..."
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 pr-10 text-sm font-mono shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <ClearButton onClick={() => setCronInput('')} visible={cronInput.length > 0} className="top-2" />
          </div>
        </div>

        {description && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <span className="text-sm font-medium">描述: </span>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
        )}

        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <h3 className="text-sm font-semibold mb-2">Cron 表达式格式说明</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div><code className="font-mono bg-muted px-1 rounded">*</code> 任意值</div>
            <div><code className="font-mono bg-muted px-1 rounded">?</code> 不指定</div>
            <div><code className="font-mono bg-muted px-1 rounded">-</code> 范围</div>
            <div><code className="font-mono bg-muted px-1 rounded">,</code> 列表</div>
            <div><code className="font-mono bg-muted px-1 rounded">/</code> 步长</div>
            <div><code className="font-mono bg-muted px-1 rounded">L</code> 最后</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
