import { useState, useCallback } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'
import CopyButton from '@/components/layout/CopyButton'
import ClearButton from '@/components/layout/ClearButton'
import { useToastStore } from '@/stores/toastStore'

async function sha1(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sha512(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function md5(message: string): string {
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n))
  const addUnsigned = (x: number, y: number) => {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]
  const K = new Array(64).fill(0).map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296))

  let a = 0x67452301
  let b = 0xefcdab89
  let c = 0x98badcfe
  let d = 0x10325476

  const msg = unescape(encodeURIComponent(message))
  const msgLen = msg.length
  const paddedLen = Math.ceil((msgLen + 9) / 64) * 64
  const padded = new Uint8Array(paddedLen)
  for (let i = 0; i < msgLen; i++) padded[i] = msg.charCodeAt(i)
  padded[msgLen] = 0x80
  const bitsLen = msgLen * 8
  padded[paddedLen - 8] = bitsLen & 0xff
  padded[paddedLen - 7] = (bitsLen >> 8) & 0xff
  padded[paddedLen - 6] = (bitsLen >> 16) & 0xff
  padded[paddedLen - 5] = (bitsLen >> 24) & 0xff

  for (let i = 0; i < paddedLen; i += 64) {
    const chunk = padded.slice(i, i + 64)
    const M = new Array(16).fill(0).map((_, j) => {
      return chunk[j * 4] | (chunk[j * 4 + 1] << 8) | (chunk[j * 4 + 2] << 16) | (chunk[j * 4 + 3] << 24)
    })

    let [A, B, C, D] = [a, b, c, d]

    for (let j = 0; j < 64; j++) {
      let f, g
      if (j < 16) {
        f = (B & C) | (~B & D)
        g = j
      } else if (j < 32) {
        f = (D & B) | (~D & C)
        g = (5 * j + 1) % 16
      } else if (j < 48) {
        f = B ^ C ^ D
        g = (3 * j + 5) % 16
      } else {
        f = C ^ (B | ~D)
        g = (7 * j) % 16
      }
      const temp = D
      D = C
      C = B
      B = addUnsigned(B, rotateLeft(addUnsigned(addUnsigned(A, f), addUnsigned(K[j], M[g])), s[j]))
      A = temp
    }

    a = addUnsigned(a, A)
    b = addUnsigned(b, B)
    c = addUnsigned(c, C)
    d = addUnsigned(d, D)
  }

  const toHex = (n: number) => {
    let hex = ''
    for (let i = 0; i < 4; i++) {
      hex += String.fromCharCode((n >> (i * 8)) & 0xff)
    }
    return hex
  }

  const result = toHex(a) + toHex(b) + toHex(c) + toHex(d)
  return Array.from(result)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

const exampleText = 'DevTools Hub'

export default function HashTool() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})
  const { addToast } = useToastStore()

  const calculate = useCallback(async () => {
    if (!input) {
      addToast('请输入文本', 'warning')
      return
    }
    const newResults: Record<string, string> = {}
    newResults['MD5'] = md5(input)
    newResults['SHA1'] = await sha1(input)
    newResults['SHA256'] = await sha256(input)
    newResults['SHA512'] = await sha512(input)
    setResults(newResults)
    addToast('哈希计算完成', 'success')
  }, [input, addToast])

  const clearAll = () => {
    setInput('')
    setResults({})
    addToast('已清空', 'info')
  }

  const loadExample = () => {
    setInput(exampleText)
    setResults({})
    addToast('已加载示例数据', 'info')
  }

  return (
    <ToolLayout title="哈希工具" description="计算 MD5、SHA1、SHA256、SHA512 哈希值">
      <div className="flex flex-wrap gap-2">
        <button onClick={calculate} className="btn-primary">计算</button>
        <button onClick={loadExample} className="btn-secondary">加载示例</button>
        <button onClick={clearAll} className="btn-secondary">清空</button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">输入文本</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入文本..."
              className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
            />
            <ClearButton onClick={() => setInput('')} visible={input.length > 0} />
          </div>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="flex flex-col gap-3">
            {Object.entries(results).map(([algo, hash]) => (
              <div key={algo} className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{algo}</span>
                  <CopyButton text={hash} />
                </div>
                <code className="break-all text-sm font-mono text-muted-foreground">{hash}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
