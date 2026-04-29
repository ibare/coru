import { STEP_COLORS } from '../constants'
import { highestStep } from '../lib/steps'
import type { RoutineRecord } from '../types'
import './YearlyOverview.css'

interface MonthData {
  month: number
  activeDays: number
  totalDays: number
  averageSteps: number
  completionRate: number
}

interface Props {
  records: RoutineRecord[]
  year: number
}

export function YearlyOverview({ records, year }: Props) {
  const months: MonthData[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const monthStr = String(month).padStart(2, '0')
    const daysInMonth = new Date(year, month, 0).getDate()

    // 미래의 달은 현재 날짜까지만 계산
    const now = new Date()
    const isCurrentYear = year === now.getFullYear()
    const isCurrentMonth = isCurrentYear && month === now.getMonth() + 1
    const isFutureMonth = isCurrentYear && month > now.getMonth() + 1

    if (isFutureMonth) {
      return { month, activeDays: 0, totalDays: 0, averageSteps: 0, completionRate: 0 }
    }

    const totalDays = isCurrentMonth ? now.getDate() : daysInMonth
    const monthRecords = records.filter(r => r.date.startsWith(`${year}-${monthStr}`))
    const activeDays = monthRecords.filter(r => r.completedSteps > 0).length
    const totalHighest = monthRecords.reduce((sum, r) => sum + highestStep(r.completedSteps), 0)
    const averageSteps = activeDays > 0 ? totalHighest / activeDays : 0
    const completionRate = totalDays > 0 ? (activeDays / totalDays) * 100 : 0

    return { month, activeDays, totalDays, averageSteps, completionRate }
  })

  const getBarColor = (avg: number) => {
    if (avg === 0) return 'var(--step-0)'
    const step = Math.round(avg) as 1 | 2 | 3 | 4
    return STEP_COLORS[step] || STEP_COLORS[1]
  }

  return (
    <div className="yearly-overview">
      {months.map(m => (
        <div key={m.month} className="yearly-month-row">
          <span className="yearly-month-label">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m.month - 1]}</span>
          <div className="yearly-bar-track">
            <div
              className="yearly-bar-fill"
              style={{
                width: `${m.completionRate}%`,
                background: getBarColor(m.averageSteps),
              }}
            />
          </div>
          <span className="yearly-rate">
            {m.totalDays > 0 ? `${Math.round(m.completionRate)}%` : '-'}
          </span>
        </div>
      ))}
    </div>
  )
}
