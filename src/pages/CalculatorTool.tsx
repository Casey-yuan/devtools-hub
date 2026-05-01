import { useState, useCallback, memo } from 'react'
import ToolLayout from '@/components/layout/ToolLayout'

interface ButtonProps {
  label: string
  onClick: () => void
  className?: string
  colSpan?: number
}

const CalculatorButton = ({ label, onClick, className = '', colSpan = 1 }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`h-14 rounded-lg text-lg font-medium transition-all active:scale-95 ${
      colSpan === 2 ? 'col-span-2' : ''
    } ${className}`}
  >
    {label}
  </button>
)

function CalculatorTool() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }, [display, waitingForOperand])

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation])

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '%':
        return firstValue % secondValue
      case '^':
        return Math.pow(firstValue, secondValue)
      default:
        return secondValue
    }
  }

  const performCalculation = useCallback(() => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }, [display, previousValue, operation])

  const scientificOperation = useCallback((op: string) => {
    const inputValue = parseFloat(display)
    let result = 0

    switch (op) {
      case 'sin':
        result = Math.sin(inputValue)
        break
      case 'cos':
        result = Math.cos(inputValue)
        break
      case 'tan':
        result = Math.tan(inputValue)
        break
      case 'log':
        result = Math.log10(inputValue)
        break
      case 'ln':
        result = Math.log(inputValue)
        break
      case 'sqrt':
        result = Math.sqrt(inputValue)
        break
      case 'x²':
        result = Math.pow(inputValue, 2)
        break
      case '1/x':
        result = 1 / inputValue
        break
      case 'π':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      case '!':
        result = factorial(inputValue)
        break
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }, [display])

  const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(-value))
  }, [display])

  return (
    <ToolLayout title="科学计算器" description="支持科学计算的在线计算器">
      <div className="flex flex-col items-center gap-4">
        {/* 显示屏 */}
        <div className="w-full max-w-md rounded-xl bg-muted p-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground h-6">
              {previousValue !== null ? `${previousValue} ${operation || ''}` : ''}
            </div>
            <div className="text-4xl font-mono font-bold overflow-hidden text-ellipsis">
              {display}
            </div>
          </div>
        </div>

        {/* 科学计算按钮 */}
        <div className="grid grid-cols-5 gap-2 w-full max-w-md">
          <CalculatorButton label="sin" onClick={() => scientificOperation('sin')} className="btn-secondary text-sm" />
          <CalculatorButton label="cos" onClick={() => scientificOperation('cos')} className="btn-secondary text-sm" />
          <CalculatorButton label="tan" onClick={() => scientificOperation('tan')} className="btn-secondary text-sm" />
          <CalculatorButton label="log" onClick={() => scientificOperation('log')} className="btn-secondary text-sm" />
          <CalculatorButton label="ln" onClick={() => scientificOperation('ln')} className="btn-secondary text-sm" />
          
          <CalculatorButton label="x²" onClick={() => scientificOperation('x²')} className="btn-secondary text-sm" />
          <CalculatorButton label="√" onClick={() => scientificOperation('sqrt')} className="btn-secondary text-sm" />
          <CalculatorButton label="1/x" onClick={() => scientificOperation('1/x')} className="btn-secondary text-sm" />
          <CalculatorButton label="π" onClick={() => scientificOperation('π')} className="btn-secondary text-sm" />
          <CalculatorButton label="e" onClick={() => scientificOperation('e')} className="btn-secondary text-sm" />
        </div>

        {/* 基础计算按钮 */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-md">
          <CalculatorButton label="C" onClick={clear} className="btn-danger" />
          <CalculatorButton label="±" onClick={toggleSign} className="btn-secondary" />
          <CalculatorButton label="%" onClick={() => performOperation('%')} className="btn-secondary" />
          <CalculatorButton label="÷" onClick={() => performOperation('÷')} className="btn-primary" />

          <CalculatorButton label="7" onClick={() => inputNumber('7')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="8" onClick={() => inputNumber('8')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="9" onClick={() => inputNumber('9')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="×" onClick={() => performOperation('×')} className="btn-primary" />

          <CalculatorButton label="4" onClick={() => inputNumber('4')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="5" onClick={() => inputNumber('5')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="6" onClick={() => inputNumber('6')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="-" onClick={() => performOperation('-')} className="btn-primary" />

          <CalculatorButton label="1" onClick={() => inputNumber('1')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="2" onClick={() => inputNumber('2')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="3" onClick={() => inputNumber('3')} className="bg-card hover:bg-accent" />
          <CalculatorButton label="+" onClick={() => performOperation('+')} className="btn-primary" />

          <CalculatorButton label="0" onClick={() => inputNumber('0')} colSpan={2} className="bg-card hover:bg-accent" />
          <CalculatorButton label="." onClick={inputDot} className="bg-card hover:bg-accent" />
          <CalculatorButton label="=" onClick={performCalculation} className="btn-primary" />
        </div>

        {/* 使用说明 */}
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground mb-2">使用说明</h3>
          <ul className="space-y-1 text-xs">
            <li>• 支持基础运算：加、减、乘、除、取模</li>
            <li>• 科学计算：三角函数、对数、幂运算、阶乘</li>
            <li>• 常数：π (3.14159...)、e (2.71828...)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}

export default memo(CalculatorTool)
