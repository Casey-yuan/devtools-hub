import { ReactNode, memo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import SEOHelmet from '@/components/SEOHelmet'
import { tools, toolCategories, type ToolCategory } from '@/config/tools'
import { Home, ChevronDown, ChevronRight } from 'lucide-react'

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
}

function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const location = useLocation()
  const currentPath = location.pathname
  
  // 按分类分组工具
  const toolsByCategory = toolCategories.map(cat => ({
    ...cat,
    tools: tools.filter(t => t.category === cat.id)
  }))
  
  // 找到当前工具所属的分类
  const currentTool = tools.find(t => t.path === currentPath)
  const currentCategory = currentTool?.category
  
  // 展开当前分类
  const [expandedCategories, setExpandedCategories] = useState<Record<ToolCategory, boolean>>({
    format: currentCategory === 'format',
    dev: currentCategory === 'dev',
    generator: currentCategory === 'generator',
    convert: currentCategory === 'convert',
  })

  const toggleCategory = (id: ToolCategory) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <SEOHelmet path={location.pathname} />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* 侧边导航栏 */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto">
          <div className="p-4">
            {/* 返回首页 */}
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">返回首页</span>
            </Link>
            
            {/* 工具分类 */}
            <div className="space-y-1">
              {toolsByCategory.map((category) => {
                const CategoryIcon = category.icon
                const isExpanded = expandedCategories[category.id]
                const isCurrentCategory = currentCategory === category.id
                
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isCurrentCategory
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4" />
                        <span>{category.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-1 ml-4 space-y-0.5">
                        {category.tools.map((tool) => {
                          const Icon = tool.icon
                          const isActive = currentPath === tool.path
                          
                          return (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <Icon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{tool.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
              <div className="flex flex-col gap-4">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default memo(ToolLayout)
