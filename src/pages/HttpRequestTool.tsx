import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'
import { Globe, Send, Plus, Trash2, Clock, FileJson, ChevronDown } from 'lucide-react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

interface Header {
  key: string
  value: string
  enabled: boolean
}

interface ResponseData {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  size: number
}

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  HEAD: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  OPTIONS: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
}

const HttpRequestTool = memo(() => {
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true },
  ])
  const [body, setBody] = useState('')
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('body')
  const { addToast } = useToastStore()

  const addHeader = useCallback(() => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }, [headers])

  const removeHeader = useCallback((index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }, [headers])

  const updateHeader = useCallback((index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }, [headers])

  const formatBody = useCallback(() => {
    try {
      const parsed = JSON.parse(body)
      setBody(JSON.stringify(parsed, null, 2))
      addToast('JSON 格式化成功', 'success')
    } catch {
      addToast('无效的 JSON 格式', 'error')
    }
  }, [body, addToast])

  const sendRequest = useCallback(async () => {
    if (!url.trim()) {
      addToast('请输入请求地址', 'warning')
      return
    }

    setLoading(true)
    const startTime = performance.now()

    try {
      const requestHeaders: Record<string, string> = {}
      headers.forEach((h) => {
        if (h.enabled && h.key.trim()) {
          requestHeaders[h.key.trim()] = h.value
        }
      })

      const options: RequestInit = {
        method,
        headers: requestHeaders,
        mode: 'cors',
      }

      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        options.body = body
      }

      const res = await fetch(url, options)
      const endTime = performance.now()

      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let responseBody = ''
      const contentType = res.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        const json = await res.json()
        responseBody = JSON.stringify(json, null, 2)
      } else {
        responseBody = await res.text()
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: Math.round(endTime - startTime),
        size: new Blob([responseBody]).size,
      })

      addToast('请求成功', 'success')
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: `请求失败: ${error instanceof Error ? error.message : '未知错误'}\n\n注意：由于浏览器 CORS 限制，某些 API 可能无法直接访问。`,
        time: 0,
        size: 0,
      })
      addToast('请求失败', 'error')
    } finally {
      setLoading(false)
    }
  }, [method, url, headers, body, addToast])

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400'
    if (status >= 300 && status < 400) return 'text-yellow-600 dark:text-yellow-400'
    if (status >= 400) return 'text-red-600 dark:text-red-400'
    return 'text-slate-600 dark:text-slate-400'
  }

  const sampleRequests = [
    { name: 'JSONPlaceholder GET', method: 'GET' as HttpMethod, url: 'https://jsonplaceholder.typicode.com/posts/1' },
    { name: 'JSONPlaceholder POST', method: 'POST' as HttpMethod, url: 'https://jsonplaceholder.typicode.com/posts' },
    { name: 'HTTPBin GET', method: 'GET' as HttpMethod, url: 'https://httpbin.org/get' },
  ]

  const loadSample = (sample: typeof sampleRequests[0]) => {
    setMethod(sample.method)
    setUrl(sample.url)
    if (sample.method === 'POST') {
      setBody(JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }, null, 2))
    }
  }

  // 解析 cURL 命令
  const parseCurl = useCallback((curlCommand: string) => {
    try {
      const cleanCurl = curlCommand.trim()
      
      // 提取 URL
      const urlMatch = cleanCurl.match(/curl\s+(?:-X\s+\w+\s+)?['"]?([^\s'"]+)['"]?/i)
      if (!urlMatch) {
        addToast('无法解析 cURL 命令', 'error')
        return
      }
      
      let parsedUrl = urlMatch[1]
      let parsedMethod: HttpMethod = 'GET'
      const parsedHeaders: Header[] = []
      let parsedBody = ''
      
      // 提取方法
      const methodMatch = cleanCurl.match(/-X\s+(\w+)/i)
      if (methodMatch) {
        const m = methodMatch[1].toUpperCase()
        if (methods.includes(m as HttpMethod)) {
          parsedMethod = m as HttpMethod
        }
      } else if (cleanCurl.includes(' -d ') || cleanCurl.includes(' --data ')) {
        parsedMethod = 'POST'
      }
      
      // 提取 Headers
      const headerRegex = /-H\s+['"]([^'"]+)['"]/g
      let headerMatch
      while ((headerMatch = headerRegex.exec(cleanCurl)) !== null) {
        const headerStr = headerMatch[1]
        const colonIndex = headerStr.indexOf(':')
        if (colonIndex > 0) {
          parsedHeaders.push({
            key: headerStr.substring(0, colonIndex).trim(),
            value: headerStr.substring(colonIndex + 1).trim(),
            enabled: true,
          })
        }
      }
      
      // 提取 Body
      const bodyMatch = cleanCurl.match(/-d\s+['"]([\s\S]*?)['"](?:\s+-H|\s+-X|$)/) || 
                        cleanCurl.match(/--data\s+['"]([\s\S]*?)['"](?:\s+-H|\s+-X|$)/) ||
                        cleanCurl.match(/-d\s+(\{[\s\S]*?\})(?:\s+-H|\s+-X|$)/) ||
                        cleanCurl.match(/--data\s+(\{[\s\S]*?\})(?:\s+-H|\s+-X|$)/)
      if (bodyMatch) {
        parsedBody = bodyMatch[1].trim()
      }
      
      // 应用解析结果
      setUrl(parsedUrl)
      setMethod(parsedMethod)
      if (parsedHeaders.length > 0) {
        setHeaders(parsedHeaders)
      }
      if (parsedBody) {
        setBody(parsedBody)
      }
      
      addToast('cURL 导入成功', 'success')
    } catch (error) {
      addToast('cURL 解析失败', 'error')
    }
  }, [addToast])

  const [showCurlInput, setShowCurlInput] = useState(false)
  const [curlCommand, setCurlCommand] = useState('')

  return (
    <ToolLayout
      title="HTTP 请求测试"
      description="在线发送 HTTP 请求，测试 API 接口"
    >
      <div className="space-y-4">
        {/* 请求配置 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 space-y-4">
            {/* URL 和方法 */}
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className={`px-3 py-2 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${methodColors[method]}`}
              >
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入请求地址，例如: https://api.example.com/data"
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
              />
              <button
                onClick={sendRequest}
                disabled={loading || !url.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                发送
              </button>
            </div>

            {/* 示例请求和 cURL 导入 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">示例:</span>
                {sampleRequests.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => loadSample(sample)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCurlInput(!showCurlInput)}
                className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <span>导入 cURL</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCurlInput ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* cURL 输入框 */}
            {showCurlInput && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">粘贴 cURL 命令</span>
                  <button
                    onClick={() => {
                      if (curlCommand.trim()) {
                        parseCurl(curlCommand)
                        setShowCurlInput(false)
                        setCurlCommand('')
                      }
                    }}
                    disabled={!curlCommand.trim()}
                    className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded transition-colors"
                  >
                    导入
                  </button>
                </div>
                <textarea
                  value={curlCommand}
                  onChange={(e) => setCurlCommand(e.target.value)}
                  placeholder={`curl -X POST https://api.example.com/data \\\n  -H "Content-Type: application/json" \\\n  -d '{"key":"value"}'`}
                  className="w-full h-24 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 请求区域 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* 标签页 */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'headers'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Headers ({headers.filter((h) => h.enabled).length})
              </button>
              <button
                onClick={() => setActiveTab('body')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'body'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Body
              </button>
            </div>

            {/* Headers */}
            {activeTab === 'headers' && (
              <div className="p-4 space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      placeholder="Header 名称"
                      className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      placeholder="值"
                      className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                    />
                    <button
                      onClick={() => removeHeader(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addHeader}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  添加 Header
                </button>
              </div>
            )}

            {/* Body */}
            {activeTab === 'body' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">请求体 (JSON)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={formatBody}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                    >
                      <FileJson className="w-3 h-3" />
                      格式化
                    </button>
                    <ClearButton onClick={() => setBody('')} visible={body.length > 0} />
                  </div>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={`{\n  "key": "value"\n}`}
                  className="w-full h-64 p-3 font-mono text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 dark:text-slate-300"
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* 响应区域 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  响应
                </span>
                {response && (
                  <>
                    <span className={`text-sm font-bold ${getStatusColor(response.status)}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {response.time}ms
                    </span>
                    <span className="text-xs text-slate-500">
                      {response.size > 0 && `${(response.size / 1024).toFixed(2)} KB`}
                    </span>
                  </>
                )}
              </div>
              {response && <CopyButton text={response.body} />}
            </div>

            <div className="p-4">
              {response ? (
                <pre className="w-full h-80 overflow-auto font-mono text-sm bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 text-slate-700 dark:text-slate-300">
                  {response.body}
                </pre>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-400 dark:text-slate-600">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>发送请求后在此查看响应</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            使用提示
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>支持 GET、POST、PUT、DELETE 等常见 HTTP 方法</li>
            <li>可自定义请求 Headers，支持一键启用/禁用</li>
            <li>响应结果自动格式化 JSON</li>
            <li>显示响应时间、状态码和数据大小</li>
            <li>注意：由于浏览器 CORS 限制，某些 API 可能无法直接访问</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
})

HttpRequestTool.displayName = 'HttpRequestTool'

export default HttpRequestTool
