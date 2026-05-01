import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

// 简单的 SQL 格式化函数
const formatSQL = (sql: string): string => {
  let formatted = sql
    // 在大写关键字前后添加换行
    .replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|ORDER|BY|HAVING|LIMIT|OFFSET|UNION|ALL|VALUES|SET|AND|OR|NOT|NULL|IS|IN|EXISTS|BETWEEN|LIKE|AS|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|AUTO_INCREMENT|UNIQUE|CHECK|CONSTRAINT|DATABASE|VIEW|TRIGGER|PROCEDURE|FUNCTION|RETURN|IF|ELSE|WHILE|FOR|CASE|WHEN|THEN|END|DECLARE|BEGIN|COMMIT|ROLLBACK|TRANSACTION)\b/gi, '\n$1')
    // 在逗号后添加空格
    .replace(/,/g, ', ')
    // 在左括号前添加空格
    .replace(/\(/g, ' (')
    // 移除多余空格
    .replace(/\s+/g, ' ')
    // 在特定关键字后添加换行和缩进
    .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|ON|AND|OR)\b/gi, '\n$1')
    // 美化
    .trim()

  // 简单的缩进处理
  const lines = formatted.split('\n')
  let indent = 0
  const indentedLines = lines.map((line) => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return ''
    
    // 减少缩进的关键字
    if (/^(END|ELSE|COMMIT|ROLLBACK)/i.test(trimmedLine)) {
      indent = Math.max(0, indent - 1)
    }
    
    const result = '  '.repeat(indent) + trimmedLine
    
    // 增加缩进的关键字
    if (/^(BEGIN|CASE|IF|ELSE|WHILE|FOR|CREATE|ALTER)/i.test(trimmedLine)) {
      indent++
    }
    
    return result
  })

  return indentedLines.filter(line => line).join('\n')
}

// SQL 压缩
const compressSQL = (sql: string): string => {
  return sql
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),])\s*/g, '$1')
    .trim()
}

// SQL 语法高亮（简单版本）
const highlightSQL = (sql: string): string => {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'LEFT', 'RIGHT', 
    'INNER', 'OUTER', 'ON', 'GROUP', 'ORDER', 'BY', 'HAVING', 'LIMIT', 'OFFSET', 
    'UNION', 'ALL', 'VALUES', 'SET', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 
    'EXISTS', 'BETWEEN', 'LIKE', 'AS', 'CREATE', 'TABLE', 'ALTER', 'DROP', 
    'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'UNIQUE'
  ]
  
  let highlighted = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi')
    highlighted = highlighted.replace(regex, '<span class="text-purple-500 font-bold">$1</span>')
  })
  
  // 字符串高亮
  highlighted = highlighted.replace(
    /'([^']*)'/g, 
    '<span class="text-green-500">\'$1\'</span>'
  )
  
  // 数字高亮
  highlighted = highlighted.replace(
    /\b(\d+)\b/g, 
    '<span class="text-orange-500">$1</span>'
  )
  
  // 注释高亮
  highlighted = highlighted.replace(
    /(--.*$)/gm, 
    '<span class="text-gray-500 italic">$1</span>'
  )
  
  return highlighted
}

function SqlFormatTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [showHighlight, setShowHighlight] = useState(true)
  const { addToast } = useToastStore()

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入 SQL 语句', 'error')
      return
    }
    const formatted = formatSQL(input)
    setOutput(formatted)
    addToast('格式化成功', 'success')
  }, [input, addToast])

  const handleCompress = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入 SQL 语句', 'error')
      return
    }
    const compressed = compressSQL(input)
    setOutput(compressed)
    addToast('压缩成功', 'success')
  }, [input, addToast])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    addToast('已清空', 'info')
  }, [addToast])

  // 示例 SQL
  const loadExample = useCallback(() => {
    const example = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND u.created_at > '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 10;`
    setInput(example)
    addToast('已加载示例', 'info')
  }, [addToast])

  return (
    <ToolLayout title="SQL格式化" description="SQL语句美化和格式化">
      <div className="flex flex-col gap-4">
        {/* 输入区域 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">输入 SQL</label>
            <div className="flex gap-2">
              <button onClick={loadExample} className="btn-secondary text-xs">
                加载示例
              </button>
              <ClearButton onClick={handleClear} visible={input.length > 0} />
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="在此输入 SQL 语句..."
            className="min-h-[150px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handleFormat} className="btn-primary">
            格式化
          </button>
          <button onClick={handleCompress} className="btn-secondary">
            压缩
          </button>
          <CopyButton text={output} disabled={!output} />
          <label className="flex items-center gap-2 ml-auto text-sm">
            <input
              type="checkbox"
              checked={showHighlight}
              onChange={(e) => setShowHighlight(e.target.checked)}
              className="rounded border-input"
            />
            语法高亮
          </label>
        </div>

        {/* 输出区域 */}
        {output && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">结果</label>
            {showHighlight ? (
              <pre
                className="min-h-[150px] w-full rounded-lg border border-input bg-muted p-3 text-sm font-mono overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: highlightSQL(output) }}
              />
            ) : (
              <textarea
                value={output}
                readOnly
                className="min-h-[150px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm font-mono resize-y"
              />
            )}
          </div>
        )}

        {/* 常用 SQL 关键字参考 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">常用 SQL 关键字</h3>
          <div className="flex flex-wrap gap-2">
            {['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT'].map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono cursor-pointer hover:bg-primary/20"
                onClick={() => setInput((prev) => prev + ' ' + keyword)}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

export default memo(SqlFormatTool)
