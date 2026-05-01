import { useState, useMemo, memo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { tools, toolCategories, type ToolCategory } from '@/config/tools'

interface SidebarCategory {
  id: ToolCategory
  name: string
  icon: React.ElementType
  tools: typeof tools
}

const categories: SidebarCategory[] = toolCategories.map((cat) => ({
  ...cat,
  tools: tools.filter((tool) => tool.category === cat.id),
}))

function Sidebar() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter(
          (t) =>
            t.label.toLowerCase().includes(query) ||
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
            cat.name.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.tools.length > 0)
  }, [searchQuery])

  const isToolActive = (path: string) => location.pathname === path

  return (
    <aside className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-60 border-r border-border bg-background overflow-y-auto">
      <nav className="flex flex-col gap-1 p-3">
        {/* Home */}
        <NavLink
          to="/"
          className={cn(
            'nav-item',
            location.pathname === '/' ? 'active' : 'text-muted-foreground'
          )}
        >
          <Home className="h-4 w-4" />
          首页
        </NavLink>

        <div className="my-2 border-t border-border" />

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索工具..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Categories */}
        {filteredCategories.map((category) => {
          const CategoryIcon = category.icon
          const isExpanded = expandedCategories[category.id] || searchQuery
          const hasActiveTool = category.tools.some((t) => isToolActive(t.path))

          return (
            <div key={category.id} className="flex flex-col">
              <button
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  hasActiveTool
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-2">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <NavLink
                        key={tool.path}
                        to={tool.path}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )
                        }
                        onMouseEnter={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                          setHoveredCategory(tool.description)
                          setTooltipPos({
                            top: rect.top + rect.height / 2,
                            left: rect.right + 8,
                          })
                        }}
                        onMouseLeave={() => {
                          setHoveredCategory(null)
                          setTooltipPos(null)
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="truncate">{tool.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Global Fixed Tooltip */}
      {hoveredCategory && tooltipPos && (
        <div
          className="fixed z-[9999] whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-lg border border-border animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top,
            transform: 'translateY(-50%)',
          }}
        >
          {hoveredCategory}
        </div>
      )}
    </aside>
  )
}

export default memo(Sidebar)
