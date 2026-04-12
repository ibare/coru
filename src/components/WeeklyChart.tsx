import { MAX_STEPS, STEP_COLORS } from '../constants'
import type { RoutineRecord } from '../types'
import './WeeklyChart.css'

interface Props {
  records: RoutineRecord[]
  dates: string[]
  dayLabels: string[]
}

export function WeeklyChart({ records, dates, dayLabels }: Props) {
  const recordMap = new Map(records.map(r => [r.date, r.completedSteps]))

  return (
    <div className="weekly-chart">
      {dates.map((date, i) => {
        const steps = recordMap.get(date) ?? 0

        return (
          <div key={date} className="weekly-bar-col">
            <div className="weekly-bar-wrapper">
              {Array.from({ length: MAX_STEPS }, (_, j) => j + 1).map(level => (
                <div
                  key={level}
                  className={`weekly-bar-cell ${level <= steps ? 'filled' : ''}`}
                  style={{
                    background: level <= steps
                      ? STEP_COLORS[level as keyof typeof STEP_COLORS]
                      : 'var(--step-0)',
                  }}
                />
              )).reverse()}
            </div>
            <span className="weekly-day-label">{dayLabels[i]}</span>
            <span className="weekly-step-label">{steps}</span>
          </div>
        )
      })}
    </div>
  )
}
