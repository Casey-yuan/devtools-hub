import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'
import { Database, Code, Settings, ChevronDown } from 'lucide-react'

type Language = 'java' | 'csharp' | 'python' | 'go' | 'typescript'

interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  defaultValue?: string
  comment?: string
  isPrimaryKey?: boolean
}

const languageOptions: { value: Language; label: string }[] = [
  { value: 'java', label: 'Java (Spring/JPA)' },
  { value: 'csharp', label: 'C# (.NET)' },
  { value: 'python', label: 'Python (SQLAlchemy)' },
  { value: 'go', label: 'Go (GORM)' },
  { value: 'typescript', label: 'TypeScript/Node.js' },
]

// 解析 SQL 建表语句
const parseSQLTable = (sql: string): { tableName: string; columns: ColumnInfo[] } | null => {
  const tableMatch = sql.match(/CREATE\s+TABLE\s+(?:`?|"?|\[?)(\w+)(?:`?|"?|\]?)/i)
  if (!tableMatch) return null

  const tableName = tableMatch[1]
  const columns: ColumnInfo[] = []

  // 提取列定义部分
  const columnsMatch = sql.match(/\(([^)]+)\)/s)
  if (!columnsMatch) return null

  const columnDefs = columnsMatch[1].split(',').map(s => s.trim())

  for (const def of columnDefs) {
    // 跳过约束定义
    if (/^(PRIMARY\s+KEY|FOREIGN\s+KEY|CONSTRAINT|INDEX|UNIQUE)/i.test(def)) continue

    const colMatch = def.match(/(?:`?|"?)(\w+)(?:`?|"?)\s+(\w+(?:\([^)]+\))?)/i)
    if (!colMatch) continue

    const name = colMatch[1]
    const type = colMatch[2].toUpperCase()
    const nullable = !def.match(/NOT\s+NULL/i)
    const isPrimaryKey = def.match(/PRIMARY\s+KEY/i) !== null
    const defaultMatch = def.match(/DEFAULT\s+([^\s,]+)/i)
    const commentMatch = def.match(/COMMENT\s+['"]([^'"]+)['"]/i)

    columns.push({
      name,
      type,
      nullable,
      defaultValue: defaultMatch ? defaultMatch[1] : undefined,
      comment: commentMatch ? commentMatch[1] : undefined,
      isPrimaryKey,
    })
  }

  return { tableName, columns }
}

// 转换 SQL 类型到 Java 类型
const sqlToJavaType = (sqlType: string): string => {
  const type = sqlType.toUpperCase()
  if (type.includes('INT') || type.includes('SERIAL')) return 'Long'
  if (type.includes('VARCHAR') || type.includes('TEXT') || type.includes('CHAR')) return 'String'
  if (type.includes('DECIMAL') || type.includes('NUMERIC') || type.includes('MONEY')) return 'BigDecimal'
  if (type.includes('FLOAT') || type.includes('REAL')) return 'Float'
  if (type.includes('DOUBLE')) return 'Double'
  if (type.includes('BOOLEAN') || type.includes('BIT')) return 'Boolean'
  if (type.includes('DATE') && !type.includes('TIME')) return 'LocalDate'
  if (type.includes('TIME') && !type.includes('DATE')) return 'LocalTime'
  if (type.includes('DATETIME') || type.includes('TIMESTAMP')) return 'LocalDateTime'
  if (type.includes('BLOB') || type.includes('BINARY')) return 'byte[]'
  if (type.includes('JSON')) return 'String'
  return 'Object'
}

// 转换 SQL 类型到 C# 类型
const sqlToCSharpType = (sqlType: string): string => {
  const type = sqlType.toUpperCase()
  if (type.includes('INT') || type.includes('SERIAL')) return 'long'
  if (type.includes('VARCHAR') || type.includes('TEXT') || type.includes('CHAR')) return 'string'
  if (type.includes('DECIMAL') || type.includes('NUMERIC') || type.includes('MONEY')) return 'decimal'
  if (type.includes('FLOAT') || type.includes('REAL')) return 'float'
  if (type.includes('DOUBLE')) return 'double'
  if (type.includes('BOOLEAN') || type.includes('BIT')) return 'bool'
  if (type.includes('DATE') && !type.includes('TIME')) return 'DateTime'
  if (type.includes('TIME') && !type.includes('DATE')) return 'TimeSpan'
  if (type.includes('DATETIME') || type.includes('TIMESTAMP')) return 'DateTime'
  if (type.includes('BLOB') || type.includes('BINARY')) return 'byte[]'
  if (type.includes('GUID') || type.includes('UUID')) return 'Guid'
  return 'object'
}

// 转换 SQL 类型到 Python 类型
const sqlToPythonType = (sqlType: string): string => {
  const type = sqlType.toUpperCase()
  if (type.includes('INT') || type.includes('SERIAL')) return 'int'
  if (type.includes('VARCHAR') || type.includes('TEXT') || type.includes('CHAR')) return 'str'
  if (type.includes('DECIMAL') || type.includes('NUMERIC') || type.includes('MONEY')) return 'Decimal'
  if (type.includes('FLOAT') || type.includes('REAL')) return 'float'
  if (type.includes('DOUBLE')) return 'float'
  if (type.includes('BOOLEAN') || type.includes('BIT')) return 'bool'
  if (type.includes('DATE') || type.includes('TIME') || type.includes('DATETIME') || type.includes('TIMESTAMP')) return 'datetime'
  if (type.includes('BLOB') || type.includes('BINARY')) return 'bytes'
  if (type.includes('JSON')) return 'dict'
  return 'Any'
}

// 转换 SQL 类型到 Go 类型
const sqlToGoType = (sqlType: string, nullable: boolean): string => {
  const type = sqlType.toUpperCase()
  let goType = 'interface{}'
  
  if (type.includes('INT') || type.includes('SERIAL')) goType = 'int64'
  else if (type.includes('VARCHAR') || type.includes('TEXT') || type.includes('CHAR')) goType = 'string'
  else if (type.includes('DECIMAL') || type.includes('NUMERIC') || type.includes('MONEY')) goType = 'decimal.Decimal'
  else if (type.includes('FLOAT') || type.includes('REAL')) goType = 'float32'
  else if (type.includes('DOUBLE')) goType = 'float64'
  else if (type.includes('BOOLEAN') || type.includes('BIT')) goType = 'bool'
  else if (type.includes('DATE') || type.includes('TIME') || type.includes('DATETIME') || type.includes('TIMESTAMP')) goType = 'time.Time'
  else if (type.includes('BLOB') || type.includes('BINARY')) goType = '[]byte'
  
  return nullable ? `*${goType}` : goType
}

// 转换 SQL 类型到 TypeScript 类型
const sqlToTsType = (sqlType: string): string => {
  const type = sqlType.toUpperCase()
  if (type.includes('INT') || type.includes('SERIAL')) return 'number'
  if (type.includes('VARCHAR') || type.includes('TEXT') || type.includes('CHAR')) return 'string'
  if (type.includes('DECIMAL') || type.includes('NUMERIC') || type.includes('MONEY')) return 'number'
  if (type.includes('FLOAT') || type.includes('REAL') || type.includes('DOUBLE')) return 'number'
  if (type.includes('BOOLEAN') || type.includes('BIT')) return 'boolean'
  if (type.includes('DATE') || type.includes('TIME') || type.includes('DATETIME') || type.includes('TIMESTAMP')) return 'Date'
  if (type.includes('BLOB') || type.includes('BINARY')) return 'Buffer'
  if (type.includes('JSON')) return 'any'
  return 'any'
}

// 驼峰命名转换
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// 大驼峰命名
const toPascalCase = (str: string): string => {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

// 生成 Java 实体类
const generateJavaEntity = (tableName: string, columns: ColumnInfo[]): string => {
  const className = toPascalCase(tableName)
  let code = `import javax.persistence.*;\n`
  code += `import java.math.BigDecimal;\n`
  code += `import java.time.*;\n\n`
  code += `@Entity\n`
  code += `@Table(name = "${tableName}")\n`
  code += `public class ${className} {\n\n`

  columns.forEach(col => {
    const fieldName = toCamelCase(col.name)
    const javaType = sqlToJavaType(col.type)
    
    if (col.isPrimaryKey) {
      code += `  @Id\n`
      code += `  @GeneratedValue(strategy = GenerationType.IDENTITY)\n`
    }
    code += `  @Column(name = "${col.name}")\n`
    code += `  private ${javaType} ${fieldName};\n\n`
  })

  // Getters and Setters
  columns.forEach(col => {
    const fieldName = toCamelCase(col.name)
    const javaType = sqlToJavaType(col.type)
    const methodName = toPascalCase(col.name)
    
    code += `  public ${javaType} get${methodName}() {\n`
    code += `    return ${fieldName};\n`
    code += `  }\n\n`
    code += `  public void set${methodName}(${javaType} ${fieldName}) {\n`
    code += `    this.${fieldName} = ${fieldName};\n`
    code += `  }\n\n`
  })

  code += `}`
  return code
}

// 生成 C# 实体类
const generateCSharpEntity = (tableName: string, columns: ColumnInfo[]): string => {
  const className = toPascalCase(tableName)
  let code = `using System;\n`
  code += `using System.ComponentModel.DataAnnotations;\n`
  code += `using System.ComponentModel.DataAnnotations.Schema;\n\n`
  code += `[Table("${tableName}")]\n`
  code += `public class ${className}\n{\n`

  columns.forEach(col => {
    const propName = toPascalCase(col.name)
    const csType = sqlToCSharpType(col.type)
    const nullableType = col.nullable && csType !== 'string' && csType !== 'byte[]' ? `${csType}?` : csType
    
    if (col.isPrimaryKey) {
      code += `  [Key]\n`
    }
    code += `  [Column("${col.name}")]\n`
    code += `  public ${nullableType} ${propName} { get; set; }\n\n`
  })

  code += `}`
  return code
}

// 生成 Python 实体类
const generatePythonEntity = (tableName: string, columns: ColumnInfo[]): string => {
  const className = toPascalCase(tableName)
  let code = `from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, Text\n`
  code += `from sqlalchemy.ext.declarative import declarative_base\n\n`
  code += `Base = declarative_base()\n\n`
  code += `class ${className}(Base):\n`
  code += `    __tablename__ = '${tableName}'\n\n`

  columns.forEach(col => {
    const pyType = sqlToPythonType(col.type)
    let sqlAlchemyType = 'String'
    
    if (col.type.toUpperCase().includes('INT')) sqlAlchemyType = 'Integer'
    else if (col.type.toUpperCase().includes('DECIMAL') || col.type.toUpperCase().includes('NUMERIC')) sqlAlchemyType = 'Numeric'
    else if (col.type.toUpperCase().includes('BOOLEAN') || col.type.toUpperCase().includes('BIT')) sqlAlchemyType = 'Boolean'
    else if (col.type.toUpperCase().includes('TEXT')) sqlAlchemyType = 'Text'
    else if (col.type.toUpperCase().includes('DATETIME') || col.type.toUpperCase().includes('TIMESTAMP')) sqlAlchemyType = 'DateTime'
    
    code += `    ${col.name} = Column(${sqlAlchemyType}`
    if (col.isPrimaryKey) code += `, primary_key=True`
    if (!col.nullable) code += `, nullable=False`
    code += `)\n`
  })

  return code
}

// 生成 Go 实体类
const generateGoEntity = (tableName: string, columns: ColumnInfo[]): string => {
  const structName = toPascalCase(tableName)
  let code = `package models\n\n`
  code += `import (\n`
  code += `  "time"\n`
  code += `  "github.com/shopspring/decimal"\n`
  code += `  "gorm.io/gorm"\n`
  code += `)\n\n`
  code += `type ${structName} struct {\n`
  code += `  gorm.Model\n`

  columns.filter(col => !col.isPrimaryKey).forEach(col => {
    const fieldName = toPascalCase(col.name)
    const goType = sqlToGoType(col.type, col.nullable)
    const jsonTag = toCamelCase(col.name)
    const gormTag = `column:${col.name}`
    
    code += `  ${fieldName} ${goType} ` + '`json:"' + jsonTag + '" gorm:"' + gormTag + '"`\n'
  })

  code += `}`
  return code
}

// 生成 TypeScript 实体类
const generateTsEntity = (tableName: string, columns: ColumnInfo[]): string => {
  const interfaceName = toPascalCase(tableName)
  let code = `export interface ${interfaceName} {\n`

  columns.forEach(col => {
    const propName = toCamelCase(col.name)
    const tsType = sqlToTsType(col.type)
    const optional = col.nullable ? '?' : ''
    code += `  ${propName}${optional}: ${tsType};\n`
  })

  code += `}\n\n`
  
  // 添加 Prisma schema 版本
  code += `// Prisma Schema\n`
  code += `model ${interfaceName} {\n`
  columns.forEach(col => {
    const tsType = sqlToTsType(col.type)
    let prismaType = 'String'
    if (tsType === 'number') prismaType = 'Int'
    if (tsType === 'boolean') prismaType = 'Boolean'
    if (tsType === 'Date') prismaType = 'DateTime'
    
    code += `  ${col.name} ${prismaType}`
    if (col.isPrimaryKey) code += ` @id @default(autoincrement())`
    code += `\n`
  })
  code += `}`
  
  return code
}

// 生成实体类代码
const generateEntity = (sql: string, language: Language): string => {
  const tableInfo = parseSQLTable(sql)
  if (!tableInfo) return '// 无法解析 SQL，请检查语法是否正确'

  const { tableName, columns } = tableInfo

  switch (language) {
    case 'java':
      return generateJavaEntity(tableName, columns)
    case 'csharp':
      return generateCSharpEntity(tableName, columns)
    case 'python':
      return generatePythonEntity(tableName, columns)
    case 'go':
      return generateGoEntity(tableName, columns)
    case 'typescript':
      return generateTsEntity(tableName, columns)
    default:
      return '// 不支持的语言'
  }
}

const SqlToEntityTool = memo(() => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState<Language>('java')
  const [showSettings, setShowSettings] = useState(false)
  const { showToast } = useToastStore()

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      showToast('请输入 SQL 建表语句', 'warning')
      return
    }
    const result = generateEntity(input, language)
    setOutput(result)
    showToast('转换成功', 'success')
  }, [input, language, showToast])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    showToast('已清空', 'success')
  }, [showToast])

  const sampleSQL = `CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  age INT DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  profile TEXT
);`

  return (
    <ToolLayout
      title="SQL 转实体类"
      description="将 SQL 建表语句转换为各种编程语言的实体类代码"
      icon={Database}
    >
      <div className="space-y-4">
        {/* 设置栏 */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              目标语言：
            </span>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
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
          <button
            onClick={() => setInput(sampleSQL)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            加载示例
          </button>
        </div>

        {/* 输入输出区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 输入区域 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  SQL 建表语句
                </span>
              </div>
              <ClearButton onClick={handleClear} />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴 CREATE TABLE 语句..."
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
                  生成的代码
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
              </div>
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
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            支持的功能
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>解析 CREATE TABLE 语句生成实体类</li>
            <li>支持 Java (JPA)、C# (.NET)、Python (SQLAlchemy)、Go (GORM)、TypeScript/Node.js</li>
            <li>自动识别主键、字段类型、可空性</li>
            <li>驼峰命名自动转换</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
})

SqlToEntityTool.displayName = 'SqlToEntityTool'

export default SqlToEntityTool
