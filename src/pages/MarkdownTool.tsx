import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import { useMarkdownStore } from '@/stores/markdownStore'
import { useToastStore } from '@/stores/toastStore'
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Eye,
  Edit3,
  Clock,
  FileEdit,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/___(.*?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Blockquote
    .replace(/^&gt; (.*$)/gim, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary underline">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full" />')
    // Horizontal rule
    .replace(/^---$/gim, '<hr />')
    // Line breaks
    .replace(/\n/g, '<br />')

  // Wrap consecutive li in ul/ol
  html = html.replace(/(<li>.*<\/li>)(<br \/>)?/g, '<ul>$1</ul>')

  return html
}

const defaultContent = `# 欢迎使用 Markdown 编辑器

这是一个简洁的 Markdown 编辑工具，支持实时预览。

## 功能特点

- **实时预览**: 左侧编辑，右侧即时渲染
- **文档管理**: 支持创建、保存、删除多篇文档
- **本地存储**: 所有文档保存在浏览器本地

## 常用语法

### 文本样式
- **粗体**: 使用两个星号 **粗体**
- *斜体*: 使用一个星号 *斜体*
- ~~删除线~~: 使用波浪线

### 代码
行内代码: \`const x = 1\`

代码块:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 列表
1. 有序列表项
2. 另一个项
   - 子项
   - 另一个子项

### 引用
> 这是一段引用文字

### 链接和图片
[访问 GitHub](https://github.com)

---

开始编写你的文档吧！
`

export default function MarkdownTool() {
  const { docs, activeDocId, addDoc, updateDoc, deleteDoc, setActiveDoc, getActiveDoc } =
    useMarkdownStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToastStore()

  const activeDoc = getActiveDoc()

  // Load active doc
  useEffect(() => {
    if (activeDoc) {
      setTitle(activeDoc.title)
      setContent(activeDoc.content)
    } else if (docs.length === 0) {
      // Create default doc
      addDoc('未命名文档', defaultContent)
      setTitle('未命名文档')
      setContent(defaultContent)
    }
  }, [activeDocId])

  // Auto save
  useEffect(() => {
    if (!activeDocId || !title.trim()) return
    const timer = setTimeout(() => {
      updateDoc(activeDocId, { title, content })
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, content, activeDocId, updateDoc])

  const handleNewDoc = useCallback(() => {
    addDoc('未命名文档', '# 新文档\n\n开始编写...')
    setTitle('未命名文档')
    setContent('# 新文档\n\n开始编写...')
    addToast('新文档已创建', 'success')
  }, [addDoc, addToast])

  const handleDeleteDoc = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      if (window.confirm('确定要删除这篇文档吗？')) {
        deleteDoc(id)
        addToast('文档已删除', 'info')
      }
    },
    [deleteDoc, addToast]
  )

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  const insertSyntax = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const before = content.substring(0, start)
    const after = content.substring(end)

    const insertText = selected || placeholder
    const newContent = before + syntax.replace('{{text}}', insertText) + after
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      const newCursor = start + syntax.indexOf('{{text}}') + insertText.length
      textarea.setSelectionRange(newCursor, newCursor)
    }, 0)
  }

  const toolbarItems = [
    { label: 'H1', action: () => insertSyntax('# {{text}}\n', '标题') },
    { label: 'H2', action: () => insertSyntax('## {{text}}\n', '标题') },
    { label: 'H3', action: () => insertSyntax('### {{text}}\n', '标题') },
    { label: 'B', action: () => insertSyntax('**{{text}}**', '粗体') },
    { label: 'I', action: () => insertSyntax('*{{text}}*', '斜体') },
    { label: '`', action: () => insertSyntax('`{{text}}`', '代码') },
    { label: '```', action: () => insertSyntax('```\n{{text}}\n```', '代码块') },
    { label: '>', action: () => insertSyntax('> {{text}}\n', '引用') },
    { label: '-', action: () => insertSyntax('- {{text}}\n', '列表项') },
    { label: '[]', action: () => insertSyntax('[{{text}}](url)', '链接文本') },
  ]

  return (
    <ToolLayout title="Markdown编辑器" description="支持实时预览的 Markdown 文档编辑工具">
      <div className="flex flex-col gap-4 h-[calc(100vh-12rem)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all',
                showSidebar ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent'
              )}
              title="文档列表"
            >
              <FileText className="h-4 w-4" />
            </button>
            <div className="mx-2 h-4 w-px bg-border" />
            {toolbarItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-mono font-bold text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                showPreview
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent'
              )}
            >
              {showPreview ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {showPreview ? '预览中' : '编辑中'}
            </button>
            <button
              onClick={handleNewDoc}
              className="btn-primary inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              新建
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-4 min-h-0">
          {/* Doc Sidebar */}
          {showSidebar && (
            <div className="flex w-56 flex-col gap-2 rounded-xl border border-border bg-background p-3 overflow-hidden">
              <h3 className="text-sm font-semibold px-1">文档列表</h3>
              <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc.id)
                      setTitle(doc.title)
                      setContent(doc.content)
                    }}
                    className={cn(
                      'group flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-all',
                      activeDocId === doc.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FileEdit className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-sm font-medium truncate flex-1">{doc.title}</span>
                      {activeDocId === doc.id && (
                        <Trash2
                          className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteDoc(doc.id, e)}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-60">
                      <Clock className="h-3 w-3" />
                      {formatDate(doc.updatedAt)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Editor + Preview */}
          <div className="flex flex-1 gap-4 min-h-0">
            {/* Editor */}
            <div className={cn('flex flex-col gap-2 min-h-0', showPreview ? 'flex-1' : 'flex-1')}>
              {/* Title */}
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingTitle(false)
                    }}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-lg font-bold hover:text-primary transition-colors"
                  >
                    {title || '点击编辑标题'}
                  </button>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  自动保存
                </span>
              </div>

              {/* Textarea */}
              <textarea
                id="markdown-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background p-4 text-sm font-mono leading-relaxed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-y-auto"
                placeholder="开始编写 Markdown..."
                spellCheck={false}
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="flex flex-col gap-2 flex-1 min-h-0">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-muted-foreground">预览</span>
                </div>
                <div
                  className="flex-1 rounded-lg border border-border bg-background p-6 overflow-y-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
