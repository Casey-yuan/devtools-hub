import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

// XML 格式化
const formatXML = (xml: string): string => {
  let formatted = ''
  let indent = 0
  const tab = '  '
  
  xml = xml.replace(/>\s*</g, '><').trim()
  
  for (let i = 0; i < xml.length; i++) {
    const char = xml[i]
    const nextChar = xml[i + 1]
    
    if (char === '<' && nextChar !== '/') {
      // 开始标签
      if (formatted.length > 0) {
        formatted += '\n' + tab.repeat(indent)
      }
      formatted += char
      indent++
    } else if (char === '<' && nextChar === '/') {
      // 结束标签
      indent = Math.max(0, indent - 1)
      if (formatted.length > 0 && !formatted.endsWith('\n')) {
        formatted += '\n' + tab.repeat(indent)
      }
      formatted += char
    } else if (char === '>' && xml.substring(i - 1, i + 1) !== '/>') {
      formatted += char
    } else if (char === '>' && xml.substring(i - 1, i + 1) === '/>') {
      // 自闭合标签
      formatted += char
      indent = Math.max(0, indent - 1)
    } else {
      formatted += char
    }
  }
  
  return formatted
}

// XML 压缩
const compressXML = (xml: string): string => {
  return xml.replace(/>\s+</g, '><').trim()
}

// XML 校验
const validateXML = (xml: string): { valid: boolean; error?: string } => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'application/xml')
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      return { valid: false, error: parserError.textContent || 'XML 格式错误' }
    }
    return { valid: true }
  } catch (e) {
    return { valid: false, error: 'XML 解析失败' }
  }
}

// XML 转义
const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// XML 反转义
const unescapeXML = (str: string): string => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

// XML 语法高亮
const highlightXML = (xml: string): string => {
  let highlighted = escapeXML(xml)
  
  // 标签高亮
  highlighted = highlighted.replace(
    /&lt;(\/?)([\w:-]+)(.*?)(&gt;|\/&gt;)/g,
    (_match, slash, tagName, attrs, end) => {
      // 属性高亮
      const highlightedAttrs = attrs.replace(
        /(\s+)([\w:-]+)(=)(".*?")/g,
        '$1<span class="text-purple-500">$2</span>$3<span class="text-green-500">$4</span>'
      )
      return `<span class="text-blue-500">&lt;${slash}${tagName}</span>${highlightedAttrs}<span class="text-blue-500">${end.replace('/', '')}&gt;</span>`
    }
  )
  
  // 注释高亮
  highlighted = highlighted.replace(
    /(&lt;!--[\s\S]*?--&gt;)/g,
    '<span class="text-gray-500 italic">$1</span>'
  )
  
  // CDATA 高亮
  highlighted = highlighted.replace(
    /(&lt;!\[CDATA\[[\s\S]*?\]\]&gt;)/g,
    '<span class="text-orange-500">$1</span>'
  )
  
  return highlighted
}

function XmlFormatTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null)
  const [showHighlight, setShowHighlight] = useState(true)
  const { addToast } = useToastStore()

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入 XML', 'error')
      return
    }
    const formatted = formatXML(input)
    setOutput(formatted)
    const validationResult = validateXML(input)
    setValidation(validationResult)
    addToast(validationResult.valid ? '格式化成功' : '格式化完成，但 XML 可能有问题', 
      validationResult.valid ? 'success' : 'warning')
  }, [input, addToast])

  const handleCompress = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入 XML', 'error')
      return
    }
    const compressed = compressXML(input)
    setOutput(compressed)
    addToast('压缩成功', 'success')
  }, [input, addToast])

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入 XML', 'error')
      return
    }
    const result = validateXML(input)
    setValidation(result)
    addToast(result.valid ? 'XML 格式正确' : 'XML 格式错误', result.valid ? 'success' : 'error')
  }, [input, addToast])

  const handleEscape = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入内容', 'error')
      return
    }
    setOutput(escapeXML(input))
    addToast('转义成功', 'success')
  }, [input, addToast])

  const handleUnescape = useCallback(() => {
    if (!input.trim()) {
      addToast('请输入内容', 'error')
      return
    }
    setOutput(unescapeXML(input))
    addToast('反转义成功', 'success')
  }, [input, addToast])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setValidation(null)
    addToast('已清空', 'info')
  }, [addToast])

  // 示例 XML
  const loadExample = useCallback(() => {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book id="1">
    <title>JavaScript 高级程序设计</title>
    <author>Matt Frisbie</author>
    <year>2020</year>
    <price>129.00</price>
  </book>
  <book id="2">
    <title>深入理解 TypeScript</title>
    <author>Basarat Ali Syed</author>
    <year>2021</year>
    <price>89.00</price>
  </book>
</library>`
    setInput(example)
    addToast('已加载示例', 'info')
  }, [addToast])

  return (
    <ToolLayout title="XML格式化" description="XML格式化和校验工具">
      <div className="flex flex-col gap-4">
        {/* 输入区域 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">输入 XML</label>
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
            placeholder="在此输入 XML..."
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
          <button onClick={handleValidate} className="btn-secondary">
            校验
          </button>
          <button onClick={handleEscape} className="btn-secondary">
            转义
          </button>
          <button onClick={handleUnescape} className="btn-secondary">
            反转义
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

        {/* 校验结果 */}
        {validation && (
          <div className={`rounded-lg p-3 text-sm ${validation.valid ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
            {validation.valid ? '✓ XML 格式正确' : `✗ ${validation.error}`}
          </div>
        )}

        {/* 输出区域 */}
        {output && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">结果</label>
            {showHighlight ? (
              <pre
                className="min-h-[150px] w-full rounded-lg border border-input bg-muted p-3 text-sm font-mono overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: highlightXML(output) }}
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

        {/* XML 语法说明 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium mb-2">XML 语法规则</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• XML 文档必须有一个根元素</li>
            <li>• 所有标签必须正确关闭</li>
            <li>• 标签对大小写敏感</li>
            <li>• 属性值必须用引号包裹</li>
            <li>• 特殊字符需要转义：&lt;, &gt;, &amp;, &quot;, &apos;</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}

export default memo(XmlFormatTool)
