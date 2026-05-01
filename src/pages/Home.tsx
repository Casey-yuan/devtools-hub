import { Link } from 'react-router-dom'
import { Star, Terminal, Search, Clock, Zap, ArrowUpRight } from 'lucide-react'
import { tools, toolCategories, recommendedTools, getToolById, type ToolCategory } from '@/config/tools'
import { memo, useEffect, useState, useMemo } from 'react'

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<ToolCategory, boolean>>({
    format: false,
    dev: false,
    generator: false,
    convert: false,
  })
  
  // 搜索相关
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    document.title = 'DevTools Hub - 开发者工具箱'
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return { hours, minutes, seconds }
  }

  const time = formatTime(currentTime)

  const toggleCategory = (id: ToolCategory) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // 按分类分组工具
  const toolsByCategory = toolCategories.map(cat => ({
    ...cat,
    tools: tools.filter(t => t.category === cat.id)
  }))

  // 搜索过滤
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some(k => k.toLowerCase().includes(query))
    ).slice(0, 6)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section - 极简设计 */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo & Title */}
          <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-slate-900 dark:bg-white shadow-xl">
              <Terminal className="h-8 w-8 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              开发者工具箱
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              简洁、高效的在线开发工具集合
            </p>
          </div>

          {/* 大搜索框 - 核心功能 */}
          <div className={`relative max-w-2xl mx-auto mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className={`relative rounded-2xl border-2 transition-all duration-300 ${
              isSearchFocused 
                ? 'border-slate-900 dark:border-white shadow-2xl shadow-slate-900/10 dark:shadow-white/10' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}>
              <div className="flex items-center px-6 py-5">
                <Search className="h-6 w-6 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="搜索工具，如 JSON 格式化、Base64 编码..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="flex-1 ml-4 text-lg bg-transparent border-none outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="sr-only">清除</span>
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* 搜索结果下拉 */}
              {searchQuery && filteredTools.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden">
                  {filteredTools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.bgColor}`}>
                          <Icon className={`h-5 w-5 ${tool.color}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {tool.description}
                          </div>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </Link>
                    )
                  })}
                </div>
              )}
              
              {searchQuery && filteredTools.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 py-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl z-50 text-center">
                  <p className="text-slate-500 dark:text-slate-400">未找到相关工具</p>
                </div>
              )}
            </div>
          </div>

          {/* 快捷统计 */}
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{tools.length} 个工具</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-mono">{time.hours}:{time.minutes}:{time.seconds}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 推荐工具 */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">推荐工具</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedTools.map((id) => {
              const tool = getToolById(id)
              if (!tool) return null
              const Icon = tool.icon
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-600 hover:shadow-lg transition-all bg-white dark:bg-slate-900"
                >
                  <div className={`w-10 h-10 rounded-lg ${tool.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 全部工具 - 分类折叠 */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">全部工具</h2>
          
          <div className="space-y-3">
            {toolsByCategory.map((category) => {
              const CategoryIcon = category.icon
              const isExpanded = expandedCategories[category.id]
              
              return (
                <div 
                  key={category.id} 
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="h-5 w-5 text-slate-500" />
                      <span className="font-semibold text-slate-900 dark:text-white">{category.name}</span>
                      <span className="text-sm text-slate-400">{category.tools.length}</span>
                    </div>
                    <svg 
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.tools.map((tool) => {
                          const Icon = tool.icon
                          return (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                              <div className={`w-8 h-8 rounded-lg ${tool.bgColor} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`h-4 w-4 ${tool.color}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors">
                                  {tool.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {tool.description}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(Home)
