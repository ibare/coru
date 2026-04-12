import { useState, useRef, useEffect } from 'react'
import { PASSCODE_LENGTH } from '../constants'
import './PasscodeInput.css'

interface Props {
  onComplete: (passcode: string) => void
  error?: boolean
  disabled?: boolean
}

export function PasscodeInput({ onComplete, error, disabled }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(PASSCODE_LENGTH).fill(''))
  const [showDigit, setShowDigit] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (error) {
      setDigits(Array(PASSCODE_LENGTH).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 400)
    }
  }, [error])

  const handleInput = (index: number, value: string) => {
    if (disabled) return
    const digit = value.replace(/\D/g, '').slice(-1)
    if (!digit) return

    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    // 잠깐 숫자를 보여준 후 마스킹
    setShowDigit(index)
    setTimeout(() => setShowDigit(null), 300)

    if (index < PASSCODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // 모든 자리가 채워졌으면 완료
    if (newDigits.every(d => d !== '')) {
      onComplete(newDigits.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...digits]
      if (digits[index]) {
        newDigits[index] = ''
        setDigits(newDigits)
      } else if (index > 0) {
        newDigits[index - 1] = ''
        setDigits(newDigits)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  return (
    <div className={`passcode-container ${error ? 'animate-shake' : ''}`}>
      {digits.map((digit, i) => (
        <div key={i} className={`passcode-box ${digit ? 'filled' : ''} ${error ? 'error' : ''}`}>
          <input
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={showDigit === i ? digit : digit ? '\u2022' : ''}
            onChange={e => handleInput(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={disabled}
            autoComplete="off"
          />
        </div>
      ))}
    </div>
  )
}
