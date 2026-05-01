import { Wrench, Github } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [titleText, setTitleText] = useState('')
  const fullTitle = 'DevTools Hub'

  // Typing effect
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 shadow-lg">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight font-mono text-slate-900">
            {titleText}
            <span className="inline-block w-0.5 h-5 bg-slate-900 ml-0.5 animate-pulse align-middle" />
          </span>
        </div>

        {/* 右侧按钮 */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/Casey-yuan/devtools-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100 h-9 w-9 text-slate-600"
            title="GitHub"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
