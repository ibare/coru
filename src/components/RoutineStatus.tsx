import { MAX_STEPS, STEP_COLORS } from '../constants'
import { isStepOn } from '../lib/steps'
import './RoutineStatus.css'

interface Props {
  completedSteps: number
}

export function RoutineStatus({ completedSteps }: Props) {
  return (
    <div className="routine-status">
      <div className="status-dots">
        {Array.from({ length: MAX_STEPS }, (_, i) => i + 1).map(step => {
          const isCompleted = isStepOn(completedSteps, step)
          const color = STEP_COLORS[step as keyof typeof STEP_COLORS]

          return (
            <div
              key={step}
              className={`status-dot ${isCompleted ? 'filled' : ''}`}
              style={{
                background: isCompleted ? color : 'var(--step-0)',
              }}
            >
              {isCompleted && <span className="dot-check">&#10003;</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
