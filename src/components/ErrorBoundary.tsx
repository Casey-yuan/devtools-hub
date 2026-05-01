import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-foreground mb-2">
                出错了
              </h1>

              {/* Description */}
              <p className="text-muted-foreground mb-6">
                应用程序遇到了一个错误。请尝试刷新页面或返回首页。
              </p>

              {/* Error Details (collapsed) */}
              {this.state.error && (
                <div className="mb-6 text-left">
                  <details className="rounded-lg border border-border bg-background/50">
                    <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                      错误详情
                    </summary>
                    <div className="px-4 py-3 border-t border-border">
                      <p className="text-sm text-destructive font-mono break-all">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <pre className="mt-2 text-xs text-muted-foreground font-mono overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-secondary"
                >
                  <RefreshCw className="h-4 w-4" />
                  重试
                </button>
                <button
                  onClick={this.handleReload}
                  className="btn-primary"
                >
                  刷新页面
                </button>
                <Link
                  to="/"
                  className="btn-secondary"
                  onClick={this.handleReset}
                >
                  <Home className="h-4 w-4" />
                  返回首页
                </Link>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              如果问题持续存在，请检查控制台获取更多错误信息
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
import { useState, useCallback } from 'react'

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null)

  const handleError = useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error)
    setError(error)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}
