import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

const examples: Record<string, string> = {
  base64: 'Hello World! 你好，世界！',
  url: 'https://example.com/search?q=hello world&page=1',
  html: '<div class="container">\n  <h1>标题</h1>\n  <p>这是一段文本</p>\n</div>',
}

export default function EncodeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'base64' | 'url' | 'html'>('base64')
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode')
  const { addToast } = useToastStore()

  const process = useCallback(() => {
    try {
      if (!input) {
        addToast('请输入内容', 'warning')
        return
      }
      let result = ''
      if (mode === 'base64') {
        if (operation === 'encode') {
          result = btoa(unescape(encodeURIComponent(input)))
        } else {
          result = decodeURIComponent(escape(atob(input)))
        }
      } else if (mode === 'url') {
        if (operation === 'encode') {
          result = encodeURIComponent(input)
        } else {
          result = decodeURIComponent(input)
        }
      } else if (mode === 'html') {
        if (operation === 'encode') {
          const textarea = document.createElement('textarea')
          textarea.textContent = input
          result = textarea.innerHTML
        } else {
          const textarea = document.createElement('textarea')
          textarea.innerHTML = input
          result = textarea.textContent || ''
        }
      }
      setOutput(result)
      addToast(`${mode.toUpperCase()} ${operation === 'encode' ? '编码' : '解码'}成功`, 'success')
    } catch (e) {
      setOutput('错误: ' + (e as Error).message)
      addToast('处理失败', 'error')
    }
  }, [input, mode, operation, addToast])

  const clearAll = () => {
    setInput('')
    setOutput('')
    addToast('已清空', 'info')
  }

  const loadExample = () => {
    setInput(examples[mode])
    setOutput('')
    addToast('已加载示例数据', 'info')
  }

  return (
    <ToolLayout title="编码工具" description="Base64、URL、HTML 编解码">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">类型:</span>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as 'base64' | 'url' | 'html')
              setOutput('')
            }}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="base64">Base64</option>
            <option value="url">URL</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">操作:</span>
          <div className="flex rounded-md border border-input p-1">
            <button
              onClick={() => setOperation('encode')}
              className={`px-3 py-1 text-sm rounded ${operation === 'encode' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              编码
            </button>
            <button
              onClick={() => setOperation('decode')}
              className={`px-3 py-1 text-sm rounded ${operation === 'decode' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              解码
            </button>
          </div>
        </div>
        <button onClick={process} className="btn-primary">执行</button>
        <button onClick={loadExample} className="btn-secondary">加载示例</button>
        <button onClick={clearAll} className="btn-secondary">清空</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">输入</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入内容..."
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
