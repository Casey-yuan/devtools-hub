import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

function TextTools() {
  const [text, setText] = useState('')
  const { addToast } = useToastStore()

  const stats = {
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    bytes: new Blob([text]).size,
  }

  const handleUpperCase = useCallback(() => {
    setText((prev) => prev.toUpperCase())
    addToast('已转为大写', 'success')
  }, [addToast])

  const handleLowerCase = useCallback(() => {
    setText((prev) => prev.toLowerCase())
    addToast('已转为小写', 'success')
  }, [addToast])

  const handleCapitalize = useCallback(() => {
    setText((prev) =>
      prev
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
    )
    addToast('已转为首字母大写', 'success')
  }, [addToast])

  const handleRemoveSpaces = useCallback(() => {
    setText((prev) => prev.replace(/\s+/g, ''))
    addToast('已去除所有空格', 'success')
  }, [addToast])

  const handleRemoveExtraSpaces = useCallback(() => {
    setText((prev) => prev.replace(/\s+/g, ' ').trim())
    addToast('已去除多余空格', 'success')
  }, [addToast])

  const handleRemoveLines = useCallback(() => {
    setText((prev) => prev.replace(/\n/g, ' '))
    addToast('已去除换行', 'success')
  }, [addToast])

  const handleReverse = useCallback(() => {
    setText((prev) => prev.split('').reverse().join(''))
    addToast('已反转文本', 'success')
  }, [addToast])

  const handleClear = useCallback(() => {
    setText('')
    addToast('已清空', 'info')
  }, [addToast])

  return (
    <ToolLayout title="文本工具" description="文本统计、大小写转换、去除空格等">
      <div className="flex flex-col gap-4">
        {/* 文本输入 */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此输入文本..."
            className="min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
          />
          <ClearButton onClick={handleClear} visible={text.length > 0} />
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.chars}</div>
            <div className="text-xs text-muted-foreground">字符数</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.charsNoSpace}</div>
            <div className="text-xs text-muted-foreground">不含空格</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.words}</div>
            <div className="text-xs text-muted-foreground">单词数</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.lines}</div>
            <div className="text-xs text-muted-foreground">行数</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.bytes}</div>
            <div className="text-xs text-muted-foreground">字节数</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handleUpperCase} className="btn-secondary text-xs">
            转大写
          </button>
          <button onClick={handleLowerCase} className="btn-secondary text-xs">
            转小写
          </button>
          <button onClick={handleCapitalize} className="btn-secondary text-xs">
            首字母大写
          </button>
          <button onClick={handleRemoveSpaces} className="btn-secondary text-xs">
            去除空格
          </button>
          <button onClick={handleRemoveExtraSpaces} className="btn-secondary text-xs">
            去除多余空格
          </button>
          <button onClick={handleRemoveLines} className="btn-secondary text-xs">
            去除换行
          </button>
          <button onClick={handleReverse} className="btn-secondary text-xs">
            反转文本
          </button>
          <CopyButton text={text} />
        </div>
      </div>
    </ToolLayout>
  )
}

export default memo(TextTools)
