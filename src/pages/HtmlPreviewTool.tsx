import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import ClearButton from '@/components/layout/ClearButton'
import { Monitor, Smartphone, Tablet, RotateCcw, Copy, Check } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'

type ViewMode = 'desktop' | 'tablet' | 'mobile'

const defaultHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 500;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello World</h1>
        <p>这是一个 HTML 预览示例。你可以在左侧编辑代码，实时看到渲染效果。</p>
        <a href="#" class="btn">点击我</a>
    </div>
</body>
</html>`

const viewModeConfig: Record<ViewMode, { width: string; icon: React.ElementType; label: string }> = {
  desktop: { width: '100%', icon: Monitor, label: '桌面' },
  tablet: { width: '768px', icon: Tablet, label: '平板' },
  mobile: { width: '375px', icon: Smartphone, label: '手机' },
}

export default function HtmlPreviewTool() {
  const [htmlCode, setHtmlCode] = useState(defaultHtml)
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [copied, setCopied] = useState(false)
  const { addToast } = useToastStore()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(htmlCode)
      setCopied(true)
      addToast('已复制 HTML 代码', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('复制失败', 'error')
    }
  }, [htmlCode, addToast])

  const handleReset = useCallback(() => {
    setHtmlCode(defaultHtml)
    addToast('已重置为默认代码', 'info')
  }, [addToast])

  const clearCode = () => {
    setHtmlCode('')
    addToast('已清空', 'info')
  }

  return (
    <ToolLayout title="HTML预览" description="实时预览 HTML 代码渲染效果">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
          <div className="flex items-center gap-1">
            {(Object.entries(viewModeConfig) as [ViewMode, typeof viewModeConfig.desktop][]).map(
              ([mode, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      viewMode === mode
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                )
              }
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-ghost inline-flex items-center gap-1.5"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? '已复制' : '复制'}
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost inline-flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">HTML 代码</label>
            <div className="relative">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="flex-1 min-h-[400px] w-full rounded-lg border border-input bg-background p-4 pr-10 text-sm font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="输入 HTML 代码..."
                spellCheck={false}
              />
              <ClearButton onClick={clearCode} visible={htmlCode.length > 0} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">实时预览</label>
            <div className="flex-1 rounded-lg border border-border bg-muted p-2 overflow-auto min-h-[400px]">
              <div
                className="mx-auto transition-all duration-300"
                style={{ width: viewModeConfig[viewMode].width, maxWidth: '100%' }}
              >
                <iframe
                  srcDoc={htmlCode}
                  className="w-full min-h-[500px] rounded-lg border border-border bg-white"
                  sandbox="allow-scripts"
                  title="HTML Preview"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <h3 className="text-sm font-semibold mb-2">使用提示</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>支持完整的 HTML、CSS 和 JavaScript 代码</li>
            <li>可以切换桌面/平板/手机视图预览响应式效果</li>
            <li>代码修改后会实时更新预览</li>
            <li>出于安全考虑，部分功能（如弹窗、外部链接）可能受限</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
