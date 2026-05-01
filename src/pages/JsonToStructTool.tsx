import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'
import { FileJson, Code, ChevronDown, Settings } from 'lucide-react'

type Language = 'go' | 'java' | 'csharp' | 'typescript' | 'python' | 'rust'
type NamingStyle = 'camel' | 'pascal' | 'snake' | 'original'

interface ConvertOptions {
  useTags: boolean
  useOmitEmpty: boolean
  namingStyle: NamingStyle
  addJsonTags: boolean
  addValidation: boolean
}

const languageOptions: { value: Language; label: string }[] = [
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
]

const namingOptions: { value: NamingStyle; label: string }[] = [
  { value: 'original', label: '保持原样' },
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
]

// 命名转换函数
const convertNaming = (name: string, style: NamingStyle): string => {
  if (style === 'original') return name

  // 先统一转换为小写和下划线
  const normalized = name
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/_{2,}/g, '_')

  if (style === 'snake') return normalized

  const parts = normalized.split('_')

  if (style === 'camel') {
    return parts[0] + parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  }

  if (style === 'pascal') {
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  }

  return name
}

// 推断类型
const inferType = (value: unknown, language: Language): string => {
  if (value === null) {
    switch (language) {
      case 'go':
        return 'interface{}'
      case 'java':
        return 'Object'
      case 'csharp':
        return 'object'
      case 'typescript':
        return 'null'
      case 'python':
        return 'None'
      case 'rust':
        return 'Option<()>'
      default:
        return 'any'
    }
  }

  const type = typeof value

  switch (type) {
    case 'string':
      switch (language) {
        case 'go':
          return 'string'
        case 'java':
          return 'String'
        case 'csharp':
          return 'string'
        case 'typescript':
          return 'string'
        case 'python':
          return 'str'
        case 'rust':
          return 'String'
        default:
          return 'string'
      }
    case 'number':
      if (Number.isInteger(value)) {
        switch (language) {
          case 'go':
            return 'int'
          case 'java':
            return 'Integer'
          case 'csharp':
            return 'int'
          case 'typescript':
            return 'number'
          case 'python':
            return 'int'
          case 'rust':
            return 'i32'
          default:
            return 'int'
        }
      } else {
        switch (language) {
          case 'go':
            return 'float64'
          case 'java':
            return 'Double'
          case 'csharp':
            return 'double'
          case 'typescript':
            return 'number'
          case 'python':
            return 'float'
          case 'rust':
            return 'f64'
          default:
            return 'float'
        }
      }
    case 'boolean':
      switch (language) {
        case 'go':
          return 'bool'
        case 'java':
          return 'Boolean'
        case 'csharp':
          return 'bool'
        case 'typescript':
          return 'boolean'
        case 'python':
          return 'bool'
        case 'rust':
          return 'bool'
        default:
          return 'bool'
      }
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) {
          switch (language) {
            case 'go':
              return '[]interface{}'
            case 'java':
              return 'List<Object>'
            case 'csharp':
              return 'List<object>'
            case 'typescript':
              return 'any[]'
            case 'python':
              return 'list'
            case 'rust':
              return 'Vec<()>()'
            default:
              return '[]'
          }
        }
        const itemType = inferType(value[0], language)
        switch (language) {
          case 'go':
            return `[]${itemType}`
          case 'java':
            return `List<${itemType}>`
          case 'csharp':
            return `List<${itemType}>`
          case 'typescript':
            return `${itemType}[]`
          case 'python':
            return 'list'
          case 'rust':
            return `Vec<${itemType}>`
          default:
            return `${itemType}[]`
        }
      } else {
        return 'object'
      }
    default:
      return 'any'
  }
}

// 生成 Go 结构体
const generateGoStruct = (
  obj: Record<string, unknown>,
  structName: string,
  options: ConvertOptions
): string => {
  let code = `type ${structName} struct {\n`

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = convertNaming(key, options.namingStyle === 'original' ? 'pascal' : options.namingStyle)
    const fieldType = inferType(value, 'go')

    let tags = ''
    if (options.addJsonTags) {
      const jsonTag = options.useOmitEmpty ? `${key},omitempty` : key
      tags += ` \`json:"${jsonTag}"\``
    }

    code += `\t${fieldName} ${fieldType}${tags}\n`
  }

  code += `}\n`
  return code
}

// 生成 Java 类
const generateJavaClass = (
  obj: Record<string, unknown>,
  className: string,
  options: ConvertOptions
): string => {
  let code = `public class ${className} {\n\n`

  // Fields
  for (const [key, value] of Object.entries(obj)) {
    const fieldName = convertNaming(key, 'camel')
    const fieldType = inferType(value, 'java')
    code += `    private ${fieldType} ${fieldName};\n`
  }

  code += `\n`

  // Getters and Setters
  for (const [key] of Object.entries(obj)) {
    const fieldName = convertNaming(key, 'camel')
    const methodName = convertNaming(key, 'pascal')
    const fieldType = inferType(obj[key], 'java')

    // Getter
    code += `    public ${fieldType} get${methodName}() {\n`
    code += `        return ${fieldName};\n`
    code += `    }\n\n`

    // Setter
    code += `    public void set${methodName}(${fieldType} ${fieldName}) {\n`
    code += `        this.${fieldName} = ${fieldName};\n`
    code += `    }\n\n`
  }

  code += `}\n`
  return code
}

// 生成 C# 类
const generateCSharpClass = (
  obj: Record<string, unknown>,
  className: string,
  options: ConvertOptions
): string => {
  let code = `public class ${className}\n{\n`

  for (const [key, value] of Object.entries(obj)) {
    const propName = convertNaming(key, 'pascal')
    const propType = inferType(value, 'csharp')
    code += `    public ${propType} ${propName} { get; set; }\n`
  }

  code += `}\n`
  return code
}

// 生成 TypeScript 接口
const generateTypeScriptInterface = (
  obj: Record<string, unknown>,
  interfaceName: string,
  options: ConvertOptions
): string => {
  let code = `interface ${interfaceName} {\n`

  for (const [key, value] of Object.entries(obj)) {
    const propName = convertNaming(key, 'camel')
    const propType = inferType(value, 'typescript')
    code += `  ${propName}: ${propType};\n`
  }

  code += `}\n`
  return code
}

// 生成 Python 类
const generatePythonClass = (
  obj: Record<string, unknown>,
  className: string,
  options: ConvertOptions
): string => {
  let code = `from dataclasses import dataclass\n\n`
  code += `@dataclass\n`
  code += `class ${className}:\n`

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = convertNaming(key, 'snake')
    const fieldType = inferType(value, 'python')
    code += `    ${fieldName}: ${fieldType}\n`
  }

  code += `\n`
  return code
}

// 生成 Rust 结构体
const generateRustStruct = (
  obj: Record<string, unknown>,
  structName: string,
  options: ConvertOptions
): string => {
  let code = `#[derive(Debug, Serialize, Deserialize)]\n`
  code += `pub struct ${structName} {\n`

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = convertNaming(key, 'snake')
    const fieldType = inferType(value, 'rust')

    let attrs = ''
    if (options.addJsonTags) {
      const rename = key !== fieldName ? `, rename = "${key}"` : ''
      attrs += `    #[serde(rename = "${key}")]\n`
    }

    code += `${attrs}    pub ${fieldName}: ${fieldType},\n`
  }

  code += `}\n`
  return code
}

// 主转换函数
const convertJsonToStruct = (
  jsonStr: string,
  language: Language,
  structName: string,
  options: ConvertOptions
): string => {
  try {
    const parsed = JSON.parse(jsonStr)

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return '// 错误：JSON 必须是对象类型，不能是数组或基本类型'
    }

    switch (language) {
      case 'go':
        return generateGoStruct(parsed, structName, options)
      case 'java':
        return generateJavaClass(parsed, structName, options)
      case 'csharp':
        return generateCSharpClass(parsed, structName, options)
      case 'typescript':
        return generateTypeScriptInterface(parsed, structName, options)
      case 'python':
        return generatePythonClass(parsed, structName, options)
      case 'rust':
        return generateRustStruct(parsed, structName, options)
      default:
        return '// 不支持的语言'
    }
  } catch (error) {
    return `// JSON 解析错误: ${error instanceof Error ? error.message : '未知错误'}`
  }
}

const JsonToStructTool = memo(() => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState<Language>('go')
  const [structName, setStructName] = useState('User')
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<ConvertOptions>({
    useTags: true,
    useOmitEmpty: false,
    namingStyle: 'pascal',
    addJsonTags: true,
    addValidation: false,
  })
  const { showToast } = useToastStore()

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      showToast('请输入 JSON', 'warning')
      return
    }

    const result = convertJsonToStruct(input, language, structName, options)
    setOutput(result)
    showToast('转换成功', 'success')
  }, [input, language, structName, options, showToast])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    showToast('已清空', 'success')
  }, [showToast])

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
      showToast('JSON 格式化成功', 'success')
    } catch {
      showToast('无效的 JSON 格式', 'error')
    }
  }, [input, showToast])

  const sampleJSON = `{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "balance": 99.99,
  "tags": ["developer", "blogger"],
  "address": {
    "city": "Beijing",
    "zipCode": "100000"
  }
}`

  return (
    <ToolLayout
      title="JSON 转结构体"
      description="将 JSON 数据转换为各种编程语言的结构体/类定义"
      icon={FileJson}
    >
      <div className="space-y-4">
        {/* 配置栏 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">语言:</span>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="appearance-none bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">结构体名:</span>
              <input
                type="text"
                value={structName}
                onChange={(e) => setStructName(e.target.value)}
                className="w-32 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Settings className="w-4 h-4" />
              选项
              <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setInput(sampleJSON)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              加载示例
            </button>
          </div>

          {/* 高级选项 */}
          {showOptions && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">命名风格:</span>
                <select
                  value={options.namingStyle}
                  onChange={(e) => setOptions({ ...options, namingStyle: e.target.value as NamingStyle })}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm"
                >
                  {namingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {language === 'go' && (
                <>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={options.addJsonTags}
                      onChange={(e) => setOptions({ ...options, addJsonTags: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    添加 json tags
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={options.useOmitEmpty}
                      onChange={(e) => setOptions({ ...options, useOmitEmpty: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    omitempty
                  </label>
                </>
              )}
            </div>
          )}
        </div>

        {/* 输入输出区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 输入区域 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">JSON 数据</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={formatJson}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  格式化
                </button>
                <ClearButton onClick={handleClear} />
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`{\n  "id": 1,\n  "name": "example"\n}`}
              className="w-full h-96 p-4 font-mono text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-none text-slate-700 dark:text-slate-300"
              spellCheck={false}
            />
          </div>

          {/* 输出区域 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {language === 'typescript' ? 'Interface' : language === 'go' ? 'Struct' : 'Class'}
                </span>
              </div>
              <CopyButton text={output} />
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="点击转换按钮生成代码..."
              className="w-full h-96 p-4 font-mono text-sm bg-slate-50 dark:bg-slate-900/50 border-0 focus:outline-none focus:ring-0 resize-none text-slate-700 dark:text-slate-300"
              spellCheck={false}
            />
          </div>
        </div>

        {/* 转换按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Code className="w-5 h-5" />
            转换
          </button>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">支持的功能</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>支持 Go、Java、C#、TypeScript、Python、Rust 等主流语言</li>
            <li>自动推断字段类型（string、int、float、bool、array、object）</li>
            <li>支持多种命名风格转换（camelCase、PascalCase、snake_case）</li>
            <li>Go 语言支持添加 json tags 和 omitempty 选项</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
})

JsonToStructTool.displayName = 'JsonToStructTool'

export default JsonToStructTool
