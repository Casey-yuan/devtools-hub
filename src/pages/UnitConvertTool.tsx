import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import { useToastStore } from '@/stores/toastStore'

interface UnitCategory {
  name: string
  units: { name: string; factor: number; offset?: number }[]
}

const unitCategories: Record<string, UnitCategory> = {
  length: {
    name: '长度',
    units: [
      { name: '米 (m)', factor: 1 },
      { name: '千米 (km)', factor: 1000 },
      { name: '厘米 (cm)', factor: 0.01 },
      { name: '毫米 (mm)', factor: 0.001 },
      { name: '英寸 (in)', factor: 0.0254 },
      { name: '英尺 (ft)', factor: 0.3048 },
      { name: '码 (yd)', factor: 0.9144 },
      { name: '英里 (mi)', factor: 1609.344 },
    ],
  },
  weight: {
    name: '重量',
    units: [
      { name: '千克 (kg)', factor: 1 },
      { name: '克 (g)', factor: 0.001 },
      { name: '毫克 (mg)', factor: 0.000001 },
      { name: '吨 (t)', factor: 1000 },
      { name: '磅 (lb)', factor: 0.45359237 },
      { name: '盎司 (oz)', factor: 0.02834952 },
    ],
  },
  temperature: {
    name: '温度',
    units: [
      { name: '摄氏度 (°C)', factor: 1, offset: 0 },
      { name: '华氏度 (°F)', factor: 5 / 9, offset: -32 },
      { name: '开尔文 (K)', factor: 1, offset: -273.15 },
    ],
  },
  area: {
    name: '面积',
    units: [
      { name: '平方米 (m²)', factor: 1 },
      { name: '平方千米 (km²)', factor: 1000000 },
      { name: '平方厘米 (cm²)', factor: 0.0001 },
      { name: '公顷 (ha)', factor: 10000 },
      { name: '亩', factor: 666.67 },
      { name: '平方英尺 (ft²)', factor: 0.092903 },
    ],
  },
}

function UnitConvertTool() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState(0)
  const [toUnit, setToUnit] = useState(1)
  const [value, setValue] = useState('')
  const { addToast } = useToastStore()

  const currentCategory = unitCategories[category]

  const convert = useCallback(() => {
    if (!value) return ''
    const num = parseFloat(value)
    if (isNaN(num)) return ''

    const from = currentCategory.units[fromUnit]
    const to = currentCategory.units[toUnit]

    let result: number

    if (category === 'temperature') {
      // 温度需要特殊处理
      const celsius = (num + (from.offset || 0)) * from.factor
      result = celsius / to.factor - (to.offset || 0)
    } else {
      // 其他单位直接换算
      result = (num * from.factor) / to.factor
    }

    return result.toFixed(6).replace(/\.?0+$/, '')
  }, [value, category, fromUnit, toUnit, currentCategory])

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    addToast('已交换单位', 'success')
  }

  return (
    <ToolLayout title="单位换算" description="长度、重量、面积、体积、温度等单位转换">
      <div className="flex flex-col gap-6 max-w-2xl">
        {/* 分类选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">换算类型</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(unitCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => {
                  setCategory(key)
                  setFromUnit(0)
                  setToUnit(1)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">输入值</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入数值"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(parseInt(e.target.value))}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {currentCategory.units.map((unit, index) => (
                <option key={index} value={index}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="btn-secondary h-10 px-3"
            title="交换单位"
          >
            ⇄
          </button>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">结果</label>
            <div className="h-10 rounded-lg border border-input bg-muted px-3 flex items-center text-sm font-mono">
              {convert() || '-'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(parseInt(e.target.value))}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {currentCategory.units.map((unit, index) => (
                <option key={index} value={index}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 常用换算参考 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">常用换算参考</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {category === 'length' && (
              <>
                <div>1 米 = 3.28084 英尺</div>
                <div>1 千米 = 0.621371 英里</div>
                <div>1 英寸 = 2.54 厘米</div>
                <div>1 码 = 0.9144 米</div>
              </>
            )}
            {category === 'weight' && (
              <>
                <div>1 千克 = 2.20462 磅</div>
                <div>1 磅 = 453.592 克</div>
                <div>1 盎司 = 28.3495 克</div>
                <div>1 吨 = 1000 千克</div>
              </>
            )}
            {category === 'temperature' && (
              <>
                <div>0°C = 32°F = 273.15K</div>
                <div>100°C = 212°F = 373.15K</div>
                <div>-40°C = -40°F</div>
                <div>人体正常体温: 37°C</div>
              </>
            )}
            {category === 'area' && (
              <>
                <div>1 公顷 = 15 亩</div>
                <div>1 亩 ≈ 666.67 平方米</div>
                <div>1 平方千米 = 100 公顷</div>
                <div>1 平方米 = 10.7639 平方英尺</div>
              </>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

export default memo(UnitConvertTool)
