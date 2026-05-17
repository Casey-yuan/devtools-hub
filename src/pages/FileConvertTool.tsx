import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'
import { Upload, Download, FileText, X, Check, AlertCircle, FileType, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'

// 支持的文件格式配置
const FILE_FORMATS = {
  pdf: { label: 'PDF', ext: '.pdf', mime: 'application/pdf', icon: '📄' },
  docx: { label: 'Word', ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: '📝' },
  xlsx: { label: 'Excel', ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: '📊' },
  txt: { label: 'TXT', ext: '.txt', mime: 'text/plain', icon: '📃' },
}

// 有效的转换组合（禁止同类型转换）
const VALID_CONVERSIONS: Record<string, string[]> = {
  pdf: ['docx', 'xlsx', 'txt'],
  docx: ['pdf', 'xlsx', 'txt'],
  xlsx: ['pdf', 'docx', 'txt'],
  txt: ['pdf', 'docx', 'xlsx'],
}

interface ConversionHistory {
  id: string
  fileName: string
  fromFormat: string
  toFormat: string
  timestamp: number
  fileSize: number
  status: 'success' | 'error'
}

export default function FileConvertTool() {
  const [file, setFile] = useState<File | null>(null)
  const [fromFormat, setFromFormat] = useState<string>('')
  const [toFormat, setToFormat] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ content: string; blob?: Blob } | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<ConversionHistory[]>([])
  const [dragActive, setDragActive] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToastStore()

  // 根据源格式动态更新目标格式选项
  useEffect(() => {
    if (fromFormat && VALID_CONVERSIONS[fromFormat]) {
      const validTargets = VALID_CONVERSIONS[fromFormat]
      if (!validTargets.includes(toFormat)) {
        setToFormat(validTargets[0])
      }
    }
  }, [fromFormat, toFormat])

  // 处理文件上传
  const processFile = useCallback((uploadedFile: File) => {
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase()
    
    if (!ext || !FILE_FORMATS[ext as keyof typeof FILE_FORMATS]) {
      addToast('不支持的文件格式', 'error')
      return
    }

    if (uploadedFile.size > 50 * 1024 * 1024) {
      addToast('文件大小不能超过 50MB', 'error')
      return
    }

    setFile(uploadedFile)
    setFromFormat(ext)
    setError('')
    setResult(null)
    addToast(`已选择: ${uploadedFile.name}`, 'success')
  }, [addToast])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) processFile(uploadedFile)
  }, [processFile])

  // 拖拽处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) processFile(droppedFile)
  }, [processFile])

  // 执行格式转换
  const handleConvert = useCallback(async () => {
    if (!file || !fromFormat || !toFormat) {
      addToast('请先选择文件和转换格式', 'warning')
      return
    }

    if (fromFormat === toFormat) {
      addToast('源格式和目标格式不能相同', 'warning')
      return
    }

    setIsConverting(true)
    setProgress(0)
    setError('')
    setResult(null)

    try {
      // 模拟转换进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // 执行转换
      let convertedContent = ''
      let convertedBlob: Blob | undefined
      
      const conversionKey = `${fromFormat}-to-${toFormat}`
      
      switch (conversionKey) {
        case 'pdf-to-txt':
        case 'docx-to-txt':
        case 'xlsx-to-txt':
          convertedContent = await extractText(uint8Array, fromFormat)
          break
        case 'txt-to-pdf':
          convertedBlob = await textToPdf(file)
          convertedContent = '[PDF文件已生成]'
          break
        case 'txt-to-docx':
          convertedBlob = await textToDocx(file)
          convertedContent = '[Word文档已生成]'
          break
        case 'txt-to-xlsx':
          convertedBlob = await textToXlsx(file)
          convertedContent = '[Excel文件已生成]'
          break
        default:
          // 其他复杂转换需要后端支持
          throw new Error(`暂不支持 ${conversionKey} 转换，请使用基础格式互转`)
      }

      clearInterval(progressInterval)
      setProgress(100)

      setResult({ content: convertedContent, blob: convertedBlob })
      
      // 添加到历史记录
      const newHistory: ConversionHistory = {
        id: Date.now().toString(),
        fileName: file.name,
        fromFormat,
        toFormat,
        timestamp: Date.now(),
        fileSize: file.size,
        status: 'success',
      }
      setHistory(prev => [newHistory, ...prev].slice(0, 10))
      
      addToast('转换成功！', 'success')
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败')
      addToast('转换失败', 'error')
      
      // 添加错误记录
      const errorHistory: ConversionHistory = {
        id: Date.now().toString(),
        fileName: file.name,
        fromFormat,
        toFormat,
        timestamp: Date.now(),
        fileSize: file.size,
        status: 'error',
      }
      setHistory(prev => [errorHistory, ...prev].slice(0, 10))
    } finally {
      setIsConverting(false)
    }
  }, [file, fromFormat, toFormat, addToast])

  // 下载转换后的文件
  const handleDownload = useCallback(() => {
    if (!result) {
      addToast('没有可下载的内容', 'warning')
      return
    }

    if (result.blob) {
      // 下载二进制文件
      const url = URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.href = url
      const originalName = file?.name.replace(/\.[^/.]+$/, '') || 'converted'
      a.download = `${originalName}${FILE_FORMATS[toFormat as keyof typeof FILE_FORMATS]?.ext || '.txt'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // 下载文本内容
      const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converted.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    addToast('文件下载成功', 'success')
  }, [result, file, toFormat, addToast])



  // 清空所有内容
  const handleClear = useCallback(() => {
    setFile(null)
    setFromFormat('')
    setToFormat('')
    setResult(null)
    setError('')
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    addToast('已清空', 'info')
  }, [addToast])

  return (
    <ToolLayout
      title="文件转换工具"
      description="支持 PDF、Word、Excel、TXT 等多种格式互转，简单高效"
    >
      {/* 功能特性提示 */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">智能文件转换</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              ✨ 完全免费 · 本地处理保护隐私 · 支持多种办公格式互转
            </p>
          </div>
        </div>
      </div>

      {/* 主要操作区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：文件上传 */}
        <div className="space-y-6">
          {/* 文件上传区 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              上传文件
            </h3>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.xlsx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {file ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClear()
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    移除文件
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                      点击或拖拽文件到此处
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      支持 PDF、Word、Excel、TXT（最大 50MB）
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 格式选择 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FileType className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              转换设置
            </h3>
            
            <div className="space-y-4">
              {/* 源格式 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  源格式
                </label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-600">
                  {fromFormat ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{FILE_FORMATS[fromFormat as keyof typeof FILE_FORMATS]?.icon}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {FILE_FORMATS[fromFormat as keyof typeof FILE_FORMATS]?.label}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">请先上传文件</span>
                  )}
                </div>
              </div>

              {/* 箭头 */}
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-slate-400" />
              </div>

              {/* 目标格式 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  目标格式
                </label>
                <select
                  value={toFormat}
                  onChange={(e) => setToFormat(e.target.value)}
                  disabled={!fromFormat}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">请选择目标格式</option>
                  {fromFormat && VALID_CONVERSIONS[fromFormat]?.map((format) => (
                    <option key={format} value={format}>
                      {FILE_FORMATS[format as keyof typeof FILE_FORMATS]?.icon} {FILE_FORMATS[format as keyof typeof FILE_FORMATS]?.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：转换结果 */}
        <div className="space-y-6">
          {/* 转换按钮 */}
          <button
            onClick={handleConvert}
            disabled={isConverting || !file || !fromFormat || !toFormat || fromFormat === toFormat}
            className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {isConverting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>转换中... {progress}%</span>
              </div>
            ) : !file ? (
              <div className="flex items-center justify-center gap-2">
                <Upload className="h-5 w-5" />
                <span>请先上传文件</span>
              </div>
            ) : !toFormat ? (
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>请选择目标格式</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>开始转换</span>
              </div>
            )}
          </button>

          {/* 进度条 */}
          {isConverting && progress > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">转换进度</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">转换失败</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 转换结果 */}
          {result && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  转换成功
                </h3>
                <div className="flex gap-2">
                  <CopyButton text={result.content} />
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    下载文件
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
                <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                  {result.content}
                </pre>
              </div>
            </div>
          )}

          {/* 清空按钮 */}
          {(file || result) && (
            <ClearButton onClick={handleClear} visible={true} />
          )}
        </div>
      </div>

      {/* 转换历史 */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mt-6">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            最近转换
          </h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  item.status === 'success'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{FILE_FORMATS[item.fromFormat as keyof typeof FILE_FORMATS]?.icon}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                      {FILE_FORMATS[item.fromFormat as keyof typeof FILE_FORMATS]?.label}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{FILE_FORMATS[item.toFormat as keyof typeof FILE_FORMATS]?.icon}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                      {FILE_FORMATS[item.toFormat as keyof typeof FILE_FORMATS]?.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 truncate max-w-[150px]">
                    {item.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {item.status === 'success' ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {(item.fileSize / 1024 / 1024).toFixed(2)} MB · {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  )
}

// ==================== 转换辅助函数 ====================

// 从 PDF 文件中提取文本内容
async function extractTextFromPdf(data: Uint8Array): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    
    // 设置 worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    
    const loadingTask = pdfjsLib.getDocument({ data })
    const pdf = await loadingTask.promise
    
    let fullText = ''
    
    // 逐页提取文本
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('PDF 解析失败:', error)
    throw new Error('PDF 文件解析失败，请确保文件格式正确')
  }
}

// 从 Word 文件中提取文本内容
async function extractTextFromDocx(data: Uint8Array): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    
    // mammoth 需要 ArrayBuffer
    const arrayBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer
    
    const result = await mammoth.extractRawText({ arrayBuffer })
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Word 解析警告:', result.messages)
    }
    
    return result.value || ''
  } catch (error) {
    console.error('Word 解析失败:', error)
    throw new Error('Word 文件解析失败，请确保文件格式正确')
  }
}

// 从 Excel 文件中提取文本内容
async function extractTextFromXlsx(data: Uint8Array): Promise<string> {
  try {
    const XLSX = await import('xlsx')
    
    const workbook = XLSX.read(data, { type: 'array' })
    const textParts: string[] = []
    
    // 遍历所有工作表
    workbook.SheetNames.forEach((sheetName: string) => {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      textParts.push(`\n===== ${sheetName} =====\n`)
      
      // 转换为文本格式
      const rows = jsonData as any[][]
      rows.forEach((row: any[]) => {
        if (row && row.length > 0) {
          textParts.push(row.join('\t'))
        }
      })
    })
    
    return textParts.join('\n').trim()
  } catch (error) {
    console.error('Excel 解析失败:', error)
    throw new Error('Excel 文件解析失败，请确保文件格式正确')
  }
}

// 从文件中提取文本内容（统一入口）
async function extractText(data: Uint8Array, format: string): Promise<string> {
  switch (format.toLowerCase()) {
    case 'pdf':
      return await extractTextFromPdf(data)
    case 'docx':
      return await extractTextFromDocx(data)
    case 'xlsx':
      return await extractTextFromXlsx(data)
    case 'txt':
      const decoder = new TextDecoder('utf-8')
      return decoder.decode(data)
    default:
      throw new Error(`不支持的格式: ${format}`)
  }
}

// TXT 转 PDF
async function textToPdf(file: File): Promise<Blob> {
  try {
    const text = await file.text()
    const { jsPDF } = await import('jspdf')
    
    const doc = new jsPDF()
    
    // 设置字体和边距
    const margin = 10
    const lineHeight = 7
    const maxWidth = 190 // A4 宽度 - 左右边距
    
    // 分割文本为行
    const lines = doc.splitTextToSize(text, maxWidth)
    
    let y = margin
    const pageHeight = 280 // A4 高度
    
    // 逐行添加文本，自动分页
    for (let i = 0; i < lines.length; i++) {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(lines[i], margin, y)
      y += lineHeight
    }
    
    return doc.output('blob')
  } catch (error) {
    console.error('PDF 生成失败:', error)
    throw new Error('PDF 文件生成失败')
  }
}

// TXT 转 Word
async function textToDocx(file: File): Promise<Blob> {
  try {
    const text = await file.text()
    const { Document, Packer, Paragraph, TextRun } = await import('docx')
    
    // 将文本按行分割
    const lines = text.split('\n')
    
    // 创建段落
    const children = lines.map(line => 
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24, // 12pt
          })
        ],
        spacing: {
          after: 200, // 段后间距
        }
      })
    )
    
    // 创建文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    })
    
    // 打包为 Blob
    const buffer = await Packer.toBlob(doc)
    return buffer
  } catch (error) {
    console.error('Word 生成失败:', error)
    throw new Error('Word 文件生成失败')
  }
}

// TXT 转 Excel
async function textToXlsx(file: File): Promise<Blob> {
  try {
    const text = await file.text()
    const XLSX = await import('xlsx')
    
    // 按行分割文本
    const lines = text.split('\n').filter(line => line.trim())
    
    // 尝试检测分隔符（制表符、逗号等）
    const data = lines.map(line => {
      // 优先使用制表符分割，其次是逗号
      if (line.includes('\t')) {
        return line.split('\t')
      } else if (line.includes(',')) {
        return line.split(',')
      } else {
        return [line] // 单列数据
      }
    })
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(data)
    
    // 创建工作簿
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    
    // 生成 Excel 文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
  } catch (error) {
    console.error('Excel 生成失败:', error)
    throw new Error('Excel 文件生成失败')
  }
}
