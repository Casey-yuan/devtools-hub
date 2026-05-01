import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

type Base = 2 | 8 | 10 | 16

const baseLabels: Record<Base, string> = {
  2: '二进制',
  8: '八进制',
  10: '十进制',
  16: '十六进制',
}

export default function BaseConvertTool() {
  const [values, setValues] = useState<Record<Base, string>>({
    2: '101010',
    8: '52',
    10: '42',
    16: '2A',
  })
  const [lastEdited, setLastEdited] = useState<Base>(10)
  const { addToast } = useToastStore()

  const updateValue = useCallback((base: Base, value: string) => {
    if (!value) {
      setValues({ 2: '', 8: '', 10: '', 16: '' })
      return
    }

    setLastEdited(base)

    const validChars: Record<Base, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-Fa-f]+$/,
    }

    if (!validChars[base].test(value)) {
      setValues((prev) => ({ ...prev, [base]: value }))
      return
    }

    try {
      const decimal = parseInt(value, base)
      if (isNaN(decimal)) {
        setValues((prev) => ({ ...prev, [base]: value }))
        return
      }

      setValues({
        2: decimal.toString(2),
        8: decimal.toString(8),
        10: decimal.toString(10),
        16: decimal.toString(16).toUpperCase(),
      })
      addToast('转换完成', 'success')
    } catch {
      setValues((prev) => ({ ...prev, [base]: value }))
      addToast('转换失败', 'error')
    }
  }, [addToast])

  const clearAll = () => {
    setValues({ 2: '', 8: '', 10: '', 16: '' })
    addToast('已清空', 'info')
  }

  const loadExample = () => {
    setValues({
      2: '101010',
      8: '52',
      10: '42',
      16: '2A',
    })
    setLastEdited(10)
    addToast('已加载示例数据', 'info')
  }

  const bases: Base[] = [2, 8, 10, 16]

  return (
    <ToolLayout title="进制转换" description="二进制、八进制、十进制、十六进制互转">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end gap-2">
          <button onClick={loadExample} className="btn-secondary">加载示例</button>
          <button onClick={clearAll} className="btn-secondary">清空</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {bases.map((base) => (
            <div
              key={base}
              className={`flex flex-col gap-2 rounded-xl border p-4 transition-all duration-200 ${
                lastEdited === base
                  ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border bg-muted/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">{baseLabels[base]}</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">Base-{base}</span>
                  <CopyButton text={values[base]} />
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={values[base]}
                  onChange={(e) => updateValue(base, e.target.value)}
                  placeholder={`输入${baseLabels[base]}...`}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 pr-10 text-sm font-mono shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <ClearButton onClick={() => updateValue(base, '')} visible={values[base].length > 0} className="top-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <h3 className="text-sm font-semibold mb-2">进制对照表</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">十进制</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">二进制</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">八进制</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">十六进制</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                  <tr key={n} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="py-1.5 px-3 font-mono">{n}</td>
                    <td className="py-1.5 px-3 font-mono">{n.toString(2).padStart(4, '0')}</td>
                    <td className="py-1.5 px-3 font-mono">{n.toString(8)}</td>
                    <td className="py-1.5 px-3 font-mono">{n.toString(16).toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
