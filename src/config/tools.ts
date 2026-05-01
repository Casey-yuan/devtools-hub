import type { LucideIcon } from 'lucide-react'
import {
  FileJson,
  Code2,
  Hash,
  Clock,
  Regex,
  Palette,
  GitCompare,
  KeyRound,
  CalendarClock,
  Fingerprint,
  Binary,
  Eye,
  BookOpen,
  Type,
  Monitor,
  Shield,
  Globe,
  Calculator,
  Ruler,
  Text,
  Image,
  FileCode,
  Database,
  Network,
  Link,
  Server,
  Table,
} from 'lucide-react'

export type ToolCategory = 'format' | 'dev' | 'generator' | 'convert'

export interface Tool {
  id: string
  path: string
  name: string
  label: string
  description: string
  icon: LucideIcon
  category: ToolCategory
  color: string
  bgColor: string
  borderColor: string
  keywords: string[]
}

export interface ToolCategoryConfig {
  id: ToolCategory
  name: string
  icon: LucideIcon
}

export const toolCategories: ToolCategoryConfig[] = [
  { id: 'format', name: '格式化', icon: Type },
  { id: 'dev', name: '开发辅助', icon: Monitor },
  { id: 'generator', name: '生成器', icon: Shield },
  { id: 'convert', name: '转换器', icon: Globe },
]

export const tools: Tool[] = [
  // 格式化工具
  {
    id: 'json',
    path: '/json',
    name: 'JSON工具',
    label: 'JSON工具',
    description: '格式化、压缩、转义、校验 JSON 数据',
    icon: FileJson,
    category: 'format',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'hover:border-blue-500/30',
    keywords: ['json', '格式化', '压缩', '校验', 'parse'],
  },
  {
    id: 'encode',
    path: '/encode',
    name: '编码工具',
    label: '编码工具',
    description: 'Base64、URL、HTML 编解码',
    icon: Code2,
    category: 'format',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'hover:border-green-500/30',
    keywords: ['base64', 'url', 'html', 'encode', 'decode', '编码', '解码'],
  },
  {
    id: 'hash',
    path: '/hash',
    name: '哈希工具',
    label: '哈希工具',
    description: 'MD5、SHA1、SHA256、SHA512 计算',
    icon: Hash,
    category: 'format',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'hover:border-purple-500/30',
    keywords: ['md5', 'sha', 'hash', '哈希', '加密'],
  },

  // 开发辅助工具
  {
    id: 'timestamp',
    path: '/timestamp',
    name: '时间戳转换',
    label: '时间戳',
    description: '时间戳与日期时间互转',
    icon: Clock,
    category: 'dev',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'hover:border-orange-500/30',
    keywords: ['timestamp', '时间戳', '日期', 'date', 'time'],
  },
  {
    id: 'regex',
    path: '/regex',
    name: '正则测试',
    label: '正则测试',
    description: '正则表达式实时匹配测试',
    icon: Regex,
    category: 'dev',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'hover:border-red-500/30',
    keywords: ['regex', '正则', '表达式', '匹配', 'pattern'],
  },
  {
    id: 'color',
    path: '/color',
    name: '颜色工具',
    label: '颜色工具',
    description: 'HEX、RGB、HSL 颜色转换',
    icon: Palette,
    category: 'dev',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'hover:border-pink-500/30',
    keywords: ['color', '颜色', 'hex', 'rgb', 'hsl', '色值'],
  },
  {
    id: 'diff',
    path: '/diff',
    name: '文本对比',
    label: '文本对比',
    description: '文本差异对比分析',
    icon: GitCompare,
    category: 'dev',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'hover:border-cyan-500/30',
    keywords: ['diff', '对比', '比较', '差异', 'compare'],
  },
  {
    id: 'cron',
    path: '/cron',
    name: 'Cron表达式',
    label: 'Cron表达式',
    description: '生成和解析定时任务表达式',
    icon: CalendarClock,
    category: 'dev',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'hover:border-indigo-500/30',
    keywords: ['cron', '定时任务', 'schedule', '表达式'],
  },
  {
    id: 'htmlpreview',
    path: '/htmlpreview',
    name: 'HTML预览',
    label: 'HTML预览',
    description: '实时预览 HTML 代码渲染效果',
    icon: Eye,
    category: 'dev',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'hover:border-orange-500/30',
    keywords: ['html', '预览', 'preview', '渲染'],
  },
  {
    id: 'markdown',
    path: '/markdown',
    name: 'Markdown',
    label: 'Markdown',
    description: '支持实时预览的 Markdown 编辑器',
    icon: BookOpen,
    category: 'dev',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'hover:border-sky-500/30',
    keywords: ['markdown', 'md', '编辑器', 'editor', '预览'],
  },

  // 生成器工具
  {
    id: 'password',
    path: '/password',
    name: '密码生成',
    label: '密码生成',
    description: '生成随机安全密码',
    icon: KeyRound,
    category: 'generator',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'hover:border-yellow-500/30',
    keywords: ['password', '密码', '生成', '随机', 'random'],
  },
  {
    id: 'uuid',
    path: '/uuid',
    name: 'UUID生成',
    label: 'UUID生成',
    description: '生成各种格式的唯一标识符',
    icon: Fingerprint,
    category: 'generator',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'hover:border-teal-500/30',
    keywords: ['uuid', 'guid', '唯一标识', '生成'],
  },


  // 转换器工具
  {
    id: 'baseconvert',
    path: '/baseconvert',
    name: '进制转换',
    label: '进制转换',
    description: '二进制、八进制、十进制、十六进制互转',
    icon: Binary,
    category: 'convert',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'hover:border-amber-500/30',
    keywords: ['base', '进制', '二进制', '十六进制', '转换', 'convert'],
  },
  {
    id: 'unitconvert',
    path: '/unitconvert',
    name: '单位换算',
    label: '单位换算',
    description: '长度、重量、面积、体积、温度等单位转换',
    icon: Ruler,
    category: 'convert',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'hover:border-emerald-500/30',
    keywords: ['unit', '单位', '换算', '长度', '重量', '温度', 'convert'],
  },
  {
    id: 'calculator',
    path: '/calculator',
    name: '科学计算器',
    label: '计算器',
    description: '支持科学计算的在线计算器',
    icon: Calculator,
    category: 'convert',
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    borderColor: 'hover:border-slate-500/30',
    keywords: ['calculator', '计算器', '计算', 'math', '科学计算'],
  },

  // 文本工具
  {
    id: 'texttools',
    path: '/texttools',
    name: '文本工具',
    label: '文本工具',
    description: '文本统计、大小写转换、去除空格等',
    icon: Text,
    category: 'format',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'hover:border-violet-500/30',
    keywords: ['text', '文本', '统计', '大小写', '空格', '字数'],
  },


  // 网络工具
  {
    id: 'ipquery',
    path: '/ipquery',
    name: 'IP查询',
    label: 'IP查询',
    description: '查询IP地址信息和地理位置',
    icon: Network,
    category: 'dev',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-600/10',
    borderColor: 'hover:border-cyan-600/30',
    keywords: ['ip', '地址', '查询', 'location', '地理'],
  },
  {
    id: 'urlparse',
    path: '/urlparse',
    name: 'URL解析',
    label: 'URL解析',
    description: '解析URL参数和组成部分',
    icon: Link,
    category: 'dev',
    color: 'text-lime-500',
    bgColor: 'bg-lime-500/10',
    borderColor: 'hover:border-lime-500/30',
    keywords: ['url', '链接', '解析', '参数', 'query', 'parse'],
  },

  // 图片工具
  {
    id: 'imagebase64',
    path: '/imagebase64',
    name: '图片转Base64',
    label: '图片转Base64',
    description: '图片与Base64编码互转',
    icon: Image,
    category: 'convert',
    color: 'text-pink-600',
    bgColor: 'bg-pink-600/10',
    borderColor: 'hover:border-pink-600/30',
    keywords: ['image', '图片', 'base64', '转换', 'dataurl'],
  },

  // 代码工具
  {
    id: 'sqlformat',
    path: '/sqlformat',
    name: 'SQL格式化',
    label: 'SQL格式化',
    description: 'SQL语句美化和格式化',
    icon: Database,
    category: 'format',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/10',
    borderColor: 'hover:border-orange-600/30',
    keywords: ['sql', '格式化', '美化', 'database', '查询'],
  },
  {
    id: 'xmlformat',
    path: '/xmlformat',
    name: 'XML格式化',
    label: 'XML格式化',
    description: 'XML格式化和校验工具',
    icon: FileCode,
    category: 'format',
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
    borderColor: 'hover:border-amber-600/30',
    keywords: ['xml', '格式化', '校验', 'parse', '节点'],
  },

  // 后端开发工具
  {
    id: 'sqltoentity',
    path: '/sqltoentity',
    name: 'SQL转实体类',
    label: 'SQL转实体类',
    description: '将SQL建表语句转换为Java/C#/Go等实体类',
    icon: Table,
    category: 'dev',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/10',
    borderColor: 'hover:border-indigo-600/30',
    keywords: ['sql', 'entity', '实体类', 'java', 'csharp', 'go', 'orm', 'jpa'],
  },
  {
    id: 'httprequest',
    path: '/httprequest',
    name: 'HTTP请求测试',
    label: 'HTTP请求',
    description: '在线发送HTTP请求，测试API接口',
    icon: Globe,
    category: 'dev',
    color: 'text-green-600',
    bgColor: 'bg-green-600/10',
    borderColor: 'hover:border-green-600/30',
    keywords: ['http', 'api', '请求', 'postman', 'rest', '测试', '接口'],
  },
  {
    id: 'jsontostruct',
    path: '/jsontostruct',
    name: 'JSON转结构体',
    label: 'JSON转结构体',
    description: '将JSON数据转换为Go/Java/TS结构体定义',
    icon: Server,
    category: 'dev',
    color: 'text-rose-600',
    bgColor: 'bg-rose-600/10',
    borderColor: 'hover:border-rose-600/30',
    keywords: ['json', 'struct', '结构体', 'go', 'java', 'typescript', 'model'],
  },

  // 生成器工具
]

// 推荐工具
export const recommendedTools = ['json', 'encode', 'timestamp', 'uuid']

// 获取工具通过ID
export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id)
}

// 获取工具通过路径
export function getToolByPath(path: string): Tool | undefined {
  return tools.find((tool) => tool.path === path)
}

// 通过分类获取工具
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category)
}

// 搜索工具
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase()
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
  )
}

// 获取所有工具路径（用于路由配置）
export const toolPaths = tools.map((tool) => tool.path)
