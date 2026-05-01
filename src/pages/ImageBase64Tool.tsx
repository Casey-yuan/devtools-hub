import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import { useToastStore } from '@/stores/toastStore'
import { Upload, ImageIcon, Download, Trash2 } from 'lucide-react'

function ImageBase64Tool() {
  const [base64, setBase64] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const { addToast } = useToastStore()

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        addToast('请选择图片文件', 'error')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        addToast('图片大小不能超过 5MB', 'error')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setBase64(result)
        setFileName(file.name)
        setFileSize(file.size)
        addToast('图片已转换', 'success')
      }
      reader.readAsDataURL(file)
    },
    [addToast]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleClear = () => {
    setBase64('')
    setFileName('')
    setFileSize(0)
    addToast('已清空', 'info')
  }

  const handleDownload = () => {
    if (!base64) return
    const link = document.createElement('a')
    link.href = base64
    link.download = fileName || 'image.png'
    link.click()
    addToast('图片已下载', 'success')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <ToolLayout title="图片转Base64" description="图片与Base64编码互转">
      <div className="flex flex-col gap-4">
        {/* 上传区域 */}
        {!base64 ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              拖拽图片到此处，或
              <label className="text-primary cursor-pointer hover:underline mx-1">
                点击上传
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground">支持 PNG、JPG、GIF、WebP，最大 5MB</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 图片预览 */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{fileName}</span>
                  <span className="text-xs text-muted-foreground">
                    ({formatSize(fileSize)})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="btn-secondary text-xs">
                    <Download className="h-3 w-3" />
                    下载
                  </button>
                  <button onClick={handleClear} className="btn-danger text-xs">
                    <Trash2 className="h-3 w-3" />
                    清除
                  </button>
                </div>
              </div>
              <img
                src={base64}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
            </div>

            {/* Base64 输出 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Base64 编码</label>
                <CopyButton text={base64} />
              </div>
              <textarea
                value={base64}
                readOnly
                className="min-h-[150px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-xs font-mono resize-y"
              />
              <p className="text-xs text-muted-foreground">
                编码后大小: {formatSize(new Blob([base64]).size)}
              </p>
            </div>

            {/* Data URL 格式 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">CSS Background 格式</label>
                <CopyButton
                  text={`background-image: url(${base64});`}
                  showToast={false}
                />
              </div>
              <div className="rounded-lg border border-input bg-muted px-3 py-2 text-xs font-mono truncate">
                background-image: url({base64.slice(0, 50)}...);
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

export default memo(ImageBase64Tool)
