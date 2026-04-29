import { useState, useRef } from 'react'
import { MAX_STEPS, STEP_COLORS, STEP_COLORS_DARK } from '../constants'
import { isStepOn, toggleStep } from '../lib/steps'
import './RoutineButtons.css'

const COOLDOWN_MS = 600

interface Props {
  completedSteps: number
  onSelect: (steps: number) => void
}

export function RoutineButtons({ completedSteps, onSelect }: Props) {
  const [animatingStep, setAnimatingStep] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = (step: number) => {
    if (locked) return

    const newMask = toggleStep(completedSteps, step)
    setAnimatingStep(step)
    setLocked(true)
    onSelect(newMask)

    if (lockTimer.current) clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(() => {
      setAnimatingStep(null)
      setLocked(false)
    }, COOLDOWN_MS)
  }

  return (
    <div className="routine-buttons-grid">
      {Array.from({ length: MAX_STEPS }, (_, i) => i + 1).map(step => {
        const isCompleted = isStepOn(completedSteps, step)
        const color = STEP_COLORS[step as keyof typeof STEP_COLORS]
        const darkColor = STEP_COLORS_DARK[step as keyof typeof STEP_COLORS_DARK]

        return (
          <button
            key={step}
            className={`routine-btn ${isCompleted ? 'completed' : ''} ${animatingStep === step ? 'animate-confirm' : ''} ${locked && animatingStep !== step ? 'locked' : ''}`}
            style={{
              background: isCompleted ? color : 'var(--color-surface)',
              borderBottomColor: isCompleted ? darkColor : 'var(--color-border)',
              borderColor: isCompleted ? color : 'var(--color-border)',
            }}
            onClick={() => handleClick(step)}
          >
            <span className="routine-btn-number">{step}</span>
            {isCompleted && <span className="routine-btn-check">&#10003;</span>}
          </button>
        )
      })}
    </div>
  )
}
