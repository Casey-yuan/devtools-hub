import { useState, useCallback, memo, useEffect } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import { useToastStore } from '@/stores/toastStore'
import { Globe, MapPin, Server, Clock, Copy, RefreshCw } from 'lucide-react'

interface IpInfo {
  ip: string
  country?: string
  region?: string
  city?: string
  org?: string
  timezone?: string
  loc?: string
}

function IpQueryTool() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { addToast } = useToastStore()

  // 获取 IP 信息
  const getIpInfo = useCallback(async (showToast = true) => {
    setLoading(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      
      const response = await fetch('https://ipinfo.io/json', { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setIpInfo({
          ip: data.ip || '',
          country: data.country,
          region: data.region,
          city: data.city,
          org: data.org,
          timezone: data.timezone,
          loc: data.loc
        })
        if (showToast) {
          addToast('IP 信息获取成功', 'success')
        }
      } else {
        throw new Error('获取失败')
      }
    } catch {
      // 备用方案
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        setIpInfo({ ip: data.ip || '' })
        if (showToast) {
          addToast('IP 获取成功', 'success')
        }
      } catch {
        if (showToast) {
          addToast('获取 IP 失败', 'error')
        }
      }
    } finally {
      setLoading(false)
    }
  }, [addToast])

  // 组件加载时自动获取（不显示 toast）
  useEffect(() => {
    getIpInfo(false)
  }, [getIpInfo])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      addToast('已复制到剪贴板', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('复制失败', 'error')
    }
  }, [addToast])

  return (
    <ToolLayout title="IP 地址查询" description="查询您的公网 IP 地址及地理位置信息">
      <div className="max-w-3xl">
        {/* 主卡片 - 类似菜鸟工具的样式 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* 头部 - 显示大 IP */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-8 py-10 text-center">
            <p className="text-blue-100 text-sm mb-2">您的 IP 地址</p>
            {ipInfo?.ip ? (
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-wider">
                  {ipInfo.ip}
                </h1>
                <button
                  onClick={() => copyToClipboard(ipInfo.ip)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="复制 IP"
                >
                  {copied ? (
                    <span className="text-white text-xs">已复制</span>
                  ) : (
                    <Copy className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            ) : (
              <div className="text-2xl text-white/80">正在获取...</div>
            )}
          </div>

          {/* 详细信息网格 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IP 地址 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">IP 地址</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white font-mono">
                    {ipInfo?.ip || '-'}
                  </p>
                </div>
              </div>

              {/* 地理位置 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">地理位置</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {ipInfo?.country && ipInfo?.region && ipInfo?.city 
                      ? `${ipInfo.country} ${ipInfo.region} ${ipInfo.city}`
                      : ipInfo?.country || ipInfo?.region || ipInfo?.city || '-'
                    }
                  </p>
                </div>
              </div>

              {/* 运营商 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">网络提供商</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {ipInfo?.org || '-'}
                  </p>
                </div>
              </div>

              {/* 时区 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">时区</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {ipInfo?.timezone || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* 刷新按钮 */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => getIpInfo(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? '刷新中...' : '刷新信息'}
              </button>
            </div>
          </div>
        </div>

        {/* 说明文字 */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">关于 IP 地址</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            IP 地址是 Internet Protocol Address 的缩写，是分配给每个连接到互联网的设备的唯一标识符。
            您的公网 IP 地址由您的网络服务提供商（ISP）分配，用于在互联网上识别您的设备。
            如果您使用了 VPN 或代理服务器，此处显示的是代理服务器的 IP 地址。
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}

export default memo(IpQueryTool)
