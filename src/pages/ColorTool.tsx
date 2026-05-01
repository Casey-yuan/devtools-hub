import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

const presetColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#78716c', '#525252', '#404040', '#171717',
  '#ffffff', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3',
]

export default function ColorTool() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [history, setHistory] = useState<string[]>([])
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToastStore()

  const updateFromHex = useCallback((newHex: string) => {
    if (!newHex.startsWith('#')) newHex = '#' + newHex
    setHex(newHex)
    const rgbVal = hexToRgb(newHex)
    if (rgbVal) {
      setRgb(rgbVal)
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b))
    }
  }, [])

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    const newRgb = { r, g, b }
    setRgb(newRgb)
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }, [])

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    const newHsl = { h, s, l }
    setHsl(newHsl)
    const rgbVal = hslToRgb(h, s, l)
    setRgb(rgbVal)
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b))
  }, [])

  const addToHistory = useCallback(() => {
    setHistory((prev) => {
      const filtered = prev.filter((c) => c !== hex)
      return [hex, ...filtered].slice(0, 12)
    })
  }, [hex])

  useEffect(() => {
    const timer = setTimeout(addToHistory, 1000)
    return () => clearTimeout(timer)
  }, [hex, addToHistory])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith('#')) value = '#' + value
    setHex(value)
    const rgbVal = hexToRgb(value)
    if (rgbVal) {
      setRgb(rgbVal)
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b))
    }
  }



  return (
    <ToolLayout title="颜色工具" description="HEX、RGB、HSL 颜色格式互转">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">颜色预览</label>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => colorInputRef.current?.click()}
              className="relative h-24 w-24 rounded-2xl border-2 border-border shadow-lg transition-transform hover:scale-105 active:scale-95 overflow-hidden"
              style={{ backgroundColor: hex }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
                <span className="text-white text-xs font-medium">点击选择</span>
              </div>
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="sr-only"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold">{hex.toUpperCase()}</code>
                <CopyButton text={hex.toUpperCase()} />
              </div>
              <span className="text-sm text-muted-foreground">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </span>
              <span className="text-sm text-muted-foreground">
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">HEX</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={hex}
                onChange={handleHexChange}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring uppercase"
                placeholder="#000000"
                maxLength={7}
              />
              <ClearButton onClick={() => updateFromHex('#000000')} visible={hex !== '#000000'} className="top-2" />
            </div>
            <CopyButton text={hex.toUpperCase()} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">RGB</label>
          <div className="grid grid-cols-3 gap-3">
            {(['r', 'g', 'b'] as const).map((channel) => (
              <div key={channel} className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground uppercase font-medium">
                  {channel}
                </label>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                    updateFromRgb(
                      channel === 'r' ? val : rgb.r,
                      channel === 'g' ? val : rgb.g,
                      channel === 'b' ? val : rgb.b
                    )
                  }}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    updateFromRgb(
                      channel === 'r' ? val : rgb.r,
                      channel === 'g' ? val : rgb.g,
                      channel === 'b' ? val : rgb.b
                    )
                  }}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-3">
            <code className="text-sm font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
            <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">HSL</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground font-medium">色相 (H)</label>
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(360, parseInt(e.target.value) || 0))
                  updateFromHsl(val, hsl.s, hsl.l)
                }}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="range"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => updateFromHsl(parseInt(e.target.value), hsl.s, hsl.l)}
                className="w-full"
                style={{ accentColor: `hsl(${hsl.h}, 100%, 50%)` }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground font-medium">饱和度 (S)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                  updateFromHsl(hsl.h, val, hsl.l)
                }}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => updateFromHsl(hsl.h, parseInt(e.target.value), hsl.l)}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground font-medium">亮度 (L)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                  updateFromHsl(hsl.h, hsl.s, val)
                }}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => updateFromHsl(hsl.h, hsl.s, parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-3">
            <code className="text-sm font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
            <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">预设颜色</label>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  updateFromHex(color)
                  addToast(`已选择 ${color.toUpperCase()}`, 'info')
                }}
                className={`h-10 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${
                  hex.toLowerCase() === color.toLowerCase()
                    ? 'border-primary shadow-md'
                    : 'border-transparent hover:border-border'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">历史记录</label>
            <div className="flex flex-wrap gap-2">
              {history.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => updateFromHex(color)}
                  className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-xs">{color.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
