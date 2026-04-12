import { STEP_COLORS } from '../constants'
import type { RoutineRecord } from '../types'
import './MonthlyHeatmap.css'

interface Props {
  records: RoutineRecord[]
  year: number
  month: number
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function MonthlyHeatmap({ records, year, month }: Props) {
  const recordMap = new Map(records.map(r => [r.date, r.completedSteps]))

  // 해당 월의 첫째 날과 마지막 날
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const totalDays = lastDay.getDate()

  // 월요일 기준 시작 요일 (0=월, 6=일)
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  // 그리드 셀 생성
  const cells: { date: string | null; steps: number }[] = []

  // 빈 셀 (이전 달)
  for (let i = 0; i < startDow; i++) {
    cells.push({ date: null, steps: 0 })
  }

  // 실제 날짜 셀
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ date: dateStr, steps: recordMap.get(dateStr) ?? 0 })
  }

  return (
    <div className="monthly-heatmap">
      <div className="heatmap-header">
        {DAY_LABELS.map(label => (
          <span key={label} className="heatmap-day-label">{label}</span>
        ))}
      </div>
      <div className="heatmap-grid">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`heatmap-cell ${cell.date ? '' : 'empty'}`}
            style={{
              background: cell.date
                ? STEP_COLORS[cell.steps as keyof typeof STEP_COLORS]
                : 'transparent',
            }}
            title={cell.date ? `${cell.date}: Step ${cell.steps}` : ''}
          >
            {cell.date && (
              <span className="heatmap-cell-day">
                {parseInt(cell.date.split('-')[2])}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
