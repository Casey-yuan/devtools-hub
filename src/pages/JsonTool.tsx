import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

const exampleJson = `{
  "name": "DevTools Hub",
  "version": "2.0",
  "tools": [
    "JSON格式化",
    "编码解码",
    "哈希计算",
    "正则测试"
  ],
  "features": {
    "offline": true,
    "fast": true,
    "secure": true
  }
}`

export default function JsonTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const { addToast } = useToastStore()

  const formatJson = useCallback(() => {
    try {
      if (!input.trim()) {
        addToast('请输入 JSON 数据', 'warning')
        return
      }
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
      addToast('JSON 格式化成功', 'success')
    } catch (e) {
      setError('无效的 JSON 格式: ' + (e as Error).message)
      setOutput('')
      addToast('JSON 格式无效', 'error')
    }
  }, [input, addToast])

  const compressJson = useCallback(() => {
    try {
      if (!input.trim()) {
        addToast('请输入 JSON 数据', 'warning')
        return
      }
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
      addToast('JSON 压缩成功', 'success')
    } catch (e) {
      setError('无效的 JSON 格式: ' + (e as Error).message)
      setOutput('')
      addToast('JSON 格式无效', 'error')
    }
  }, [input, addToast])

  const escapeJson = useCallback(() => {
    try {
      if (!input.trim()) {
        addToast('请输入 JSON 数据', 'warning')
        return
      }
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(JSON.stringify(parsed)))
      setError('')
      addToast('JSON 转义成功', 'success')
    } catch (e) {
      setError('无效的 JSON 格式: ' + (e as Error).message)
      setOutput('')
      addToast('JSON 格式无效', 'error')
    }
  }, [input, addToast])

  const unescapeJson = useCallback(() => {
    try {
      if (!input.trim()) {
        addToast('请输入 JSON 数据', 'warning')
        return
      }
      const unescaped = JSON.parse(input)
      if (typeof unescaped === 'string') {
        const parsed = JSON.parse(unescaped)
        setOutput(JSON.stringify(parsed, null, 2))
      } else {
        setOutput(JSON.stringify(unescaped, null, 2))
      }
      setError('')
      addToast('JSON 去转义成功', 'success')
    } catch (e) {
      setError('处理失败: ' + (e as Error).message)
      setOutput('')
      addToast('处理失败', 'error')
    }
  }, [input, addToast])

  const validateJson = useCallback(() => {
    try {
      if (!input.trim()) {
        addToast('请输入 JSON 数据', 'warning')
        return
      }
      JSON.parse(input)
      setOutput('JSON 格式有效 ✓')
      setError('')
      addToast('JSON 格式有效', 'success')
    } catch (e) {
      setError('无效的 JSON 格式: ' + (e as Error).message)
      setOutput('')
      addToast('JSON 格式无效', 'error')
    }
  }, [input, addToast])

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    addToast('已清空', 'info')
  }

  const loadExample = () => {
    setInput(exampleJson)
    setOutput('')
    setError('')
    addToast('已加载示例数据', 'info')
  }

  return (
    <ToolLayout title="JSON工具" description="格式化、压缩、转义、校验 JSON 数据">
      <div className="flex flex-wrap gap-2">
        <button onClick={formatJson} className="btn-primary">格式化</button>
        <button onClick={compressJson} className="btn-primary">压缩</button>
        <button onClick={escapeJson} className="btn-primary">转义</button>
        <button onClick={unescapeJson} className="btn-primary">去转义</button>
        <button onClick={validateJson} className="btn-primary">校验</button>
        <button onClick={loadExample} className="btn-secondary">加载示例</button>
        <button onClick={clearAll} className="btn-secondary">清空</button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium">输入</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入 JSON 数据..."
              className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
            />
            <ClearButton onClick={() => setInput('')} visible={input.length > 0} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">输出</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="处理结果将显示在这里..."
            className="flex min-h-[400px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
          />
        </div>
      </div>
    </ToolLayout>
  )
}
