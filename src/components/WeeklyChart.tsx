import { MAX_STEPS, STEP_COLORS } from '../constants'
import { isStepOn, popcount } from '../lib/steps'
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
        const mask = recordMap.get(date) ?? 0

        return (
          <div key={date} className="weekly-bar-col">
            <div className="weekly-bar-wrapper">
              {Array.from({ length: MAX_STEPS }, (_, j) => j + 1).map(level => {
                const filled = isStepOn(mask, level)
                return (
                  <div
                    key={level}
                    className={`weekly-bar-cell ${filled ? 'filled' : ''}`}
                    style={{
                      background: filled
                        ? STEP_COLORS[level as keyof typeof STEP_COLORS]
                        : 'var(--step-0)',
                    }}
                  />
                )
              }).reverse()}
            </div>
            <span className="weekly-day-label">{dayLabels[i]}</span>
            <span className="weekly-step-label">{popcount(mask)}</span>
          </div>
        )
      })}
    </div>
  )
}
