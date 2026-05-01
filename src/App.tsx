import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import Header from '@/components/layout/Header'
import { useThemeStore, applyTheme } from '@/stores/themeStore'
import { useUsageStore } from '@/stores/usageStore'
import ToastContainer from '@/components/layout/ToastContainer'
import { BaiduTongji } from '@/components/SEOHelmet'

// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home'))
const JsonTool = lazy(() => import('@/pages/JsonTool'))
const EncodeTool = lazy(() => import('@/pages/EncodeTool'))
const HashTool = lazy(() => import('@/pages/HashTool'))
const TimestampTool = lazy(() => import('@/pages/TimestampTool'))
const RegexTool = lazy(() => import('@/pages/RegexTool'))
const ColorTool = lazy(() => import('@/pages/ColorTool'))
const DiffTool = lazy(() => import('@/pages/DiffTool'))
const PasswordTool = lazy(() => import('@/pages/PasswordTool'))
const CronTool = lazy(() => import('@/pages/CronTool'))
const UuidTool = lazy(() => import('@/pages/UuidTool'))

const BaseConvertTool = lazy(() => import('@/pages/BaseConvertTool'))
const HtmlPreviewTool = lazy(() => import('@/pages/HtmlPreviewTool'))
const MarkdownTool = lazy(() => import('@/pages/MarkdownTool'))
// 新增工具
const UnitConvertTool = lazy(() => import('@/pages/UnitConvertTool'))
const TextTools = lazy(() => import('@/pages/TextTools'))

const UrlParseTool = lazy(() => import('@/pages/UrlParseTool'))
const ImageBase64Tool = lazy(() => import('@/pages/ImageBase64Tool'))
const CalculatorTool = lazy(() => import('@/pages/CalculatorTool'))
const IpQueryTool = lazy(() => import('@/pages/IpQueryTool'))
const SqlFormatTool = lazy(() => import('@/pages/SqlFormatTool'))
const XmlFormatTool = lazy(() => import('@/pages/XmlFormatTool'))


// 加载占位组件
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground text-sm">加载中...</p>
      </div>
    </div>
  )
}

function RouteTracker() {
  const location = useLocation()
  const { incrementClick } = useUsageStore()

  useEffect(() => {
    if (location.pathname !== '/') {
      incrementClick(location.pathname)
    }
  }, [location.pathname, incrementClick])

  return null
}

export default function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <BaiduTongji />
      <Header />
      <ToastContainer />
      <main className="pt-14 transition-all duration-300">
        <RouteTracker />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/json" element={<JsonTool />} />
              <Route path="/encode" element={<EncodeTool />} />
              <Route path="/hash" element={<HashTool />} />
              <Route path="/timestamp" element={<TimestampTool />} />
              <Route path="/regex" element={<RegexTool />} />
              <Route path="/color" element={<ColorTool />} />
              <Route path="/diff" element={<DiffTool />} />
              <Route path="/password" element={<PasswordTool />} />
              <Route path="/cron" element={<CronTool />} />
              <Route path="/uuid" element={<UuidTool />} />

              <Route path="/baseconvert" element={<BaseConvertTool />} />
              <Route path="/htmlpreview" element={<HtmlPreviewTool />} />
              <Route path="/markdown" element={<MarkdownTool />} />
              {/* 新增工具路由 */}
              <Route path="/unitconvert" element={<UnitConvertTool />} />
              <Route path="/texttools" element={<TextTools />} />

              <Route path="/urlparse" element={<UrlParseTool />} />
              <Route path="/imagebase64" element={<ImageBase64Tool />} />
              <Route path="/calculator" element={<CalculatorTool />} />
              <Route path="/ipquery" element={<IpQueryTool />} />
              <Route path="/sqlformat" element={<SqlFormatTool />} />
              <Route path="/xmlformat" element={<XmlFormatTool />} />

            </Routes>
          </Suspense>
      </main>
    </div>
  )
}
