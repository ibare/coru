import { useState } from 'react'
import { MAX_STEPS, STEP_COLORS, STEP_COLORS_DARK } from '../constants'
import './RoutineButtons.css'

interface Props {
  completedSteps: number
  onSelect: (steps: number) => void
}

export function RoutineButtons({ completedSteps, onSelect }: Props) {
  const [animatingStep, setAnimatingStep] = useState<number | null>(null)

  const handleClick = (step: number) => {
    const newSteps = step === completedSteps ? 0 : step
    setAnimatingStep(step)
    onSelect(newSteps)
    setTimeout(() => setAnimatingStep(null), 300)
  }

  return (
    <div className="routine-buttons-grid">
      {Array.from({ length: MAX_STEPS }, (_, i) => i + 1).map(step => {
        const isCompleted = step <= completedSteps
        const color = STEP_COLORS[step as keyof typeof STEP_COLORS]
        const darkColor = STEP_COLORS_DARK[step as keyof typeof STEP_COLORS_DARK]

        return (
          <button
            key={step}
            className={`routine-btn ${isCompleted ? 'completed' : ''} ${animatingStep === step ? 'animate-pop' : ''}`}
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
