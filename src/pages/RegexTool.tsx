import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import ClearButton from '@/components/layout/ClearButton'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'

interface MatchResult {
  text: string
  index: number
  groups: string[]
}

interface RegexTestResult {
  isValid: boolean
  matches: MatchResult[]
  error?: string
  isMatch: boolean
}

export default function RegexTool() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9]+@[a-zA-Z]+\\.[a-zA-Z]{2,}')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState(
    'Contact us at support@example.com or sales@company.org\nInvalid: not-an-email'
  )
  const [result, setResult] = useState<RegexTestResult>({
    isValid: true,
    matches: [],
    isMatch: false,
  })
  const [replaceText, setReplaceText] = useState('***')
  const [replaced, setReplaced] = useState('')
  const { addToast } = useToastStore()

  const testRegex = useCallback(() => {
    if (!pattern.trim()) {
      setResult({ isValid: true, matches: [], isMatch: false })
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const matches: MatchResult[] = []
      let match

      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      } else {
        match = regex.exec(testText)
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      setResult({
        isValid: true,
        matches,
        isMatch: matches.length > 0,
      })

      try {
        const replaceRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
        setReplaced(testText.replace(replaceRegex, replaceText))
      } catch {
        setReplaced(testText)
      }
    } catch (e) {
      setResult({
        isValid: false,
        matches: [],
        error: e instanceof Error ? e.message : 'Invalid regex',
        isMatch: false,
      })
      setReplaced(testText)
    }
  }, [pattern, flags, testText, replaceText])

  useEffect(() => {
    testRegex()
  }, [testRegex])

  const toggleFlag = (flag: string) => {
    setFlags((prev) => {
      if (prev.includes(flag)) {
        return prev.replace(flag, '')
      }
      return prev + flag
    })
  }

  const flagDescriptions: Record<string, string> = {
    g: '全局匹配',
    i: '忽略大小写',
    m: '多行模式',
    s: '点号匹配换行',
    u: 'Unicode',
    y: '粘性匹配',
  }

  const renderHighlightedText = () => {
    if (!result.isValid || result.matches.length === 0) {
      return <span className="text-muted-foreground">{testText}</span>
    }

    const elements: React.ReactNode[] = []
    let lastIndex = 0

    result.matches.forEach((match, idx) => {
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${idx}`} className="text-muted-foreground">
            {testText.slice(lastIndex, match.index)}
          </span>
        )
      }
      elements.push(
        <mark
          key={`match-${idx}`}
          className="bg-primary/20 text-primary font-semibold rounded px-0.5"
          title={`Match ${idx + 1} at position ${match.index}`}
        >
          {match.text}
        </mark>
      )
      lastIndex = match.index + match.text.length
    })

    if (lastIndex < testText.length) {
      elements.push(
        <span key="text-end" className="text-muted-foreground">
          {testText.slice(lastIndex)}
        </span>
      )
    }

    return elements
  }

  const clearAll = () => {
    setPattern('')
    setTestText('')
    setReplaceText('')
    setReplaced('')
    setResult({ isValid: true, matches: [], isMatch: false })
    addToast('已清空', 'info')
  }

  return (
    <ToolLayout title="正则测试" description="测试正则表达式匹配结果">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">正则表达式</label>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-lg border border-border bg-muted px-3 text-sm font-mono text-muted-foreground">
              /
            </span>
            <div className="relative flex-1">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="输入正则表达式..."
                className="flex h-10 w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <ClearButton onClick={() => setPattern('')} visible={pattern.length > 0} className="top-2" />
            </div>
            <span className="inline-flex items-center rounded-lg border border-border bg-muted px-3 text-sm font-mono text-muted-foreground">
              /{flags}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(flagDescriptions).map(([flag, desc]) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  flags.includes(flag)
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent'
                }`}
                title={desc}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">测试文本</label>
          <div className="relative">
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-input bg-background p-4 pr-10 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono resize-y"
              placeholder="输入要测试的文本..."
            />
            <ClearButton onClick={() => setTestText('')} visible={testText.length > 0} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={testRegex} className="btn-primary">测试</button>
          <button onClick={clearAll} className="btn-secondary">清空</button>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          {!result.isValid ? (
            <>
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-destructive">正则表达式无效</span>
                <span className="text-xs text-muted-foreground">{result.error}</span>
              </div>
            </>
          ) : result.isMatch ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-green-500">匹配成功</span>
                <span className="text-xs text-muted-foreground">
                  找到 {result.matches.length} 个匹配项
                </span>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-red-500">未匹配</span>
                <span className="text-xs text-muted-foreground">正则表达式在测试文本中未找到匹配</span>
              </div>
            </>
          )}
        </div>

        {result.isValid && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">匹配结果</label>
            <div className="rounded-lg border border-border bg-muted p-4 text-sm font-mono whitespace-pre-wrap min-h-[80px]">
              {renderHighlightedText()}
            </div>
          </div>
        )}

        {result.matches.length > 0 && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">匹配详情</label>
            <div className="flex flex-col gap-2">
              {result.matches.map((match, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <code className="text-sm font-mono text-primary">{match.text}</code>
                    <span className="text-xs text-muted-foreground">
                      位置: {match.index}
                    </span>
                    {match.groups.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {match.groups.map((group, gidx) => (
                          <span
                            key={gidx}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-mono"
                          >
                            ${gidx + 1}: {group || '(empty)'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">替换文本</label>
          <div className="relative">
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
              placeholder="替换为..."
            />
            <ClearButton onClick={() => setReplaceText('')} visible={replaceText.length > 0} className="top-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">替换结果</label>
            <div className="rounded-lg border border-border bg-muted p-4 text-sm font-mono whitespace-pre-wrap min-h-[60px]">
              {replaced || (
                <span className="text-muted-foreground">替换结果将显示在这里...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">常用正则速查</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
              { name: '手机号(中国)', pattern: '1[3-9]\\d{9}' },
              { name: 'URL', pattern: 'https?://[^\\s]+' },
              { name: 'IP地址', pattern: '\\d{1,3}(\\.\\d{1,3}){3}' },
              { name: '身份证号', pattern: '\\d{17}[\\dXx]' },
              { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setPattern(item.pattern)
                  addToast(`已加载 ${item.name} 正则`, 'info')
                }}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{item.name}</span>
                <code className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                  {item.pattern}
                </code>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
