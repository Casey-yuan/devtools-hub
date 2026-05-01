import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

interface DiffLine {
  type: 'same' | 'added' | 'removed'
  oldLine?: number
  newLine?: number
  content: string
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: DiffLine[] = []

  let oldIndex = 0
  let newIndex = 0

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex >= oldLines.length) {
      result.push({ type: 'added', newLine: newIndex + 1, content: newLines[newIndex] })
      newIndex++
    } else if (newIndex >= newLines.length) {
      result.push({ type: 'removed', oldLine: oldIndex + 1, content: oldLines[oldIndex] })
      oldIndex++
    } else if (oldLines[oldIndex] === newLines[newIndex]) {
      result.push({ type: 'same', oldLine: oldIndex + 1, newLine: newIndex + 1, content: oldLines[oldIndex] })
      oldIndex++
      newIndex++
    } else {
      if (newIndex + 1 < newLines.length && oldLines[oldIndex] === newLines[newIndex + 1]) {
        result.push({ type: 'added', newLine: newIndex + 1, content: newLines[newIndex] })
        newIndex++
      } else if (oldIndex + 1 < oldLines.length && oldLines[oldIndex + 1] === newLines[newIndex]) {
        result.push({ type: 'removed', oldLine: oldIndex + 1, content: oldLines[oldIndex] })
        oldIndex++
      } else {
        result.push({ type: 'removed', oldLine: oldIndex + 1, content: oldLines[oldIndex] })
        result.push({ type: 'added', newLine: newIndex + 1, content: newLines[newIndex] })
        oldIndex++
        newIndex++
      }
    }
  }

  return result
}

const exampleOld = `function greet(name) {
  console.log("Hello, " + name);
  return "Welcome!";
}

greet("World");`

const exampleNew = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return "Welcome to DevTools!";
}

greet("Developer");`

export default function DiffTool() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [diff, setDiff] = useState<DiffLine[]>([])
  const { addToast } = useToastStore()

  const compare = useCallback(() => {
    if (!oldText && !newText) {
      addToast('请输入文本进行对比', 'warning')
      return
    }
    setDiff(computeDiff(oldText, newText))
    addToast('对比完成', 'success')
  }, [oldText, newText, addToast])

  const clearAll = () => {
    setOldText('')
    setNewText('')
    setDiff([])
    addToast('已清空', 'info')
  }

  const loadExample = () => {
    setOldText(exampleOld)
    setNewText(exampleNew)
    setDiff([])
    addToast('已加载示例数据', 'info')
  }

  const getLineClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-500/10 text-green-700 dark:text-green-300'
      case 'removed':
        return 'bg-red-500/10 text-red-700 dark:text-red-300'
      default:
        return ''
    }
  }

  const getLinePrefix = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return '+'
      case 'removed':
        return '-'
      default:
        return ' '
    }
  }

  return (
    <ToolLayout title="文本对比" description="比较两段文本的差异">
      <div className="flex flex-wrap gap-2">
        <button onClick={compare} className="btn-primary">对比</button>
        <button onClick={loadExample} className="btn-secondary">加载示例</button>
        <button onClick={clearAll} className="btn-secondary">清空</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">原文本</label>
          <div className="relative">
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="在此输入原文本..."
              className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
            />
            <ClearButton onClick={() => setOldText('')} visible={oldText.length > 0} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">新文本</label>
          <div className="relative">
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="在此输入新文本..."
              className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
            />
            <ClearButton onClick={() => setNewText('')} visible={newText.length > 0} />
          </div>
        </div>
      </div>

      {diff.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">差异结果</label>
          <div className="rounded-md border border-border bg-muted/30 overflow-hidden">
            <div className="flex border-b border-border bg-muted px-4 py-2 text-xs font-medium">
              <span className="w-8">行</span>
              <span className="w-8">行</span>
              <span className="flex-1">内容</span>
            </div>
            <div className="max-h-[500px] overflow-auto">
              {diff.map((line, index) => (
                <div
                  key={index}
                  className={`flex px-4 py-1 text-sm font-mono ${getLineClass(line.type)}`}
                >
                  <span className="w-8 text-muted-foreground select-none">
                    {line.oldLine || ''}
                  </span>
                  <span className="w-8 text-muted-foreground select-none">
                    {line.newLine || ''}
                  </span>
                  <span className="flex-1">
                    {getLinePrefix(line.type)} {line.content}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
