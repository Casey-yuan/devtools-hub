import { useState, memo, useMemo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'

function UrlParseTool() {
  const [url, setUrl] = useState('')

  const parsed = useMemo(() => {
    if (!url.trim()) return null
    try {
      const urlObj = new URL(url)
      const params: Record<string, string> = {}
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value
      })

      return {
        href: urlObj.href,
        protocol: urlObj.protocol,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        username: urlObj.username,
        password: urlObj.password,
        origin: urlObj.origin,
        params,
      }
    } catch {
      return null
    }
  }, [url])



  return (
    <ToolLayout title="URL解析" description="解析URL参数和组成部分">
      <div className="flex flex-col gap-4">
        {/* URL 输入 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">URL</label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/path?key=value"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 text-sm font-mono"
            />
            <ClearButton
              onClick={() => setUrl('')}
              visible={url.length > 0}
            />
          </div>
        </div>

        {parsed ? (
          <div className="flex flex-col gap-4">
            {/* URL 组成部分 */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium mb-3">URL 组成部分</h3>
              <div className="grid gap-2 text-sm">
                {[
                  { label: '完整链接', value: parsed.href },
                  { label: '协议', value: parsed.protocol },
                  { label: '域名', value: parsed.host },
                  { label: '主机名', value: parsed.hostname },
                  { label: '端口', value: parsed.port || '(默认)' },
                  { label: '路径', value: parsed.pathname },
                  { label: '查询参数', value: parsed.search || '(无)' },
                  { label: '锚点', value: parsed.hash || '(无)' },
                  { label: '源地址', value: parsed.origin },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-mono text-xs truncate max-w-[60%]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 查询参数 */}
            {Object.keys(parsed.params).length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-medium mb-3">查询参数</h3>
                <div className="grid gap-2">
                  {Object.entries(parsed.params).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-2 rounded bg-muted"
                    >
                      <span className="font-mono text-sm text-primary">{key}</span>
                      <span className="text-muted-foreground">=</span>
                      <span className="font-mono text-sm flex-1 truncate">
                        {decodeURIComponent(value)}
                      </span>
                      <CopyButton text={decodeURIComponent(value)} showToast={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL 编码/解码 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-medium mb-2">URL 编码</h3>
                <div className="font-mono text-xs break-all text-muted-foreground">
                  {encodeURIComponent(url)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-medium mb-2">URL 解码</h3>
                <div className="font-mono text-xs break-all text-muted-foreground">
                  {decodeURIComponent(url)}
                </div>
              </div>
            </div>
          </div>
        ) : url ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center text-destructive">
            无效的 URL 格式
          </div>
        ) : null}
      </div>
    </ToolLayout>
  )
}

export default memo(UrlParseTool)
