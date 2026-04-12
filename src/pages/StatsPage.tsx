import { useState, useEffect, useCallback } from 'react'
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  eachDayOfInterval,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { Layout } from '../components/Layout'
import { WeeklyChart } from '../components/WeeklyChart'
import { MonthlyHeatmap } from '../components/MonthlyHeatmap'
import { YearlyOverview } from '../components/YearlyOverview'
import { getRoutinesByRange } from '../services/routine.service'
import { MAX_STEPS } from '../constants'
import type { RoutineRecord, StatsSummary } from '../types'
import './StatsPage.css'

type TabType = 'weekly' | 'monthly' | 'yearly'

function calcSummary(records: RoutineRecord[], totalDays: number): StatsSummary {
  const activeDays = records.filter(r => r.completedSteps > 0).length
  const perfectDays = records.filter(r => r.completedSteps === MAX_STEPS).length
  const totalSteps = records.reduce((sum, r) => sum + r.completedSteps, 0)
  const averageSteps = activeDays > 0 ? totalSteps / activeDays : 0
  const completionRate = totalDays > 0 ? (activeDays / totalDays) * 100 : 0

  return { totalDays, activeDays, perfectDays, averageSteps, completionRate }
}

export function StatsPage() {
  const [tab, setTab] = useState<TabType>('weekly')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [records, setRecords] = useState<RoutineRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    let start: string
    let end: string

    if (tab === 'weekly') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      start = format(weekStart, 'yyyy-MM-dd')
      end = format(weekEnd, 'yyyy-MM-dd')
    } else if (tab === 'monthly') {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      start = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    } else {
      const year = currentDate.getFullYear()
      start = `${year}-01-01`
      end = `${year}-12-31`
    }

    const data = await getRoutinesByRange(start, end)
    setRecords(data)
    setIsLoading(false)
  }, [tab, currentDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const navigate = (direction: -1 | 1) => {
    if (tab === 'weekly') {
      setCurrentDate(prev => direction === 1 ? addWeeks(prev, 1) : subWeeks(prev, 1))
    } else if (tab === 'monthly') {
      setCurrentDate(prev => direction === 1 ? addMonths(prev, 1) : subMonths(prev, 1))
    } else {
      setCurrentDate(prev => direction === 1 ? addYears(prev, 1) : subYears(prev, 1))
    }
  }

  const getPeriodLabel = () => {
    if (tab === 'weekly') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(weekStart, 'M/d')} - ${format(weekEnd, 'M/d')}`
    } else if (tab === 'monthly') {
      return format(currentDate, 'yyyy년 M월', { locale: ko })
    } else {
      return `${currentDate.getFullYear()}년`
    }
  }

  const getWeeklyData = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const dates = days.map(d => format(d, 'yyyy-MM-dd'))
    const dayLabels = days.map(d => format(d, 'EEE', { locale: ko }))
    return { dates, dayLabels }
  }

  const getTotalDays = () => {
    if (tab === 'weekly') return 7
    if (tab === 'monthly') {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const now = new Date()
      if (year === now.getFullYear() && month === now.getMonth() + 1) {
        return now.getDate()
      }
      return new Date(year, month, 0).getDate()
    }
    const year = currentDate.getFullYear()
    const now = new Date()
    if (year === now.getFullYear()) {
      const start = new Date(year, 0, 1)
      return Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    return isLeap ? 366 : 365
  }

  const summary = calcSummary(records, getTotalDays())

  return (
    <Layout title="통계" showBack>
      <div className="stats-page animate-fade-in">
        <div className="stats-tabs">
          {(['weekly', 'monthly', 'yearly'] as TabType[]).map(t => (
            <button
              key={t}
              className={`stats-tab ${tab === t ? 'active' : ''}`}
              onClick={() => { setTab(t); setCurrentDate(new Date()) }}
            >
              {t === 'weekly' ? '주간' : t === 'monthly' ? '월간' : '연간'}
            </button>
          ))}
        </div>

        <div className="stats-nav">
          <button className="nav-btn" onClick={() => navigate(-1)}>&#8249;</button>
          <span className="nav-label">{getPeriodLabel()}</span>
          <button className="nav-btn" onClick={() => navigate(1)}>&#8250;</button>
        </div>

        <div className="stats-chart card">
          {isLoading ? (
            <div className="stats-loading">
              <div className="loading-dot animate-pop" />
            </div>
          ) : tab === 'weekly' ? (
            <WeeklyChart
              records={records}
              dates={getWeeklyData().dates}
              dayLabels={getWeeklyData().dayLabels}
            />
          ) : tab === 'monthly' ? (
            <MonthlyHeatmap
              records={records}
              year={currentDate.getFullYear()}
              month={currentDate.getMonth() + 1}
            />
          ) : (
            <YearlyOverview
              records={records}
              year={currentDate.getFullYear()}
            />
          )}
        </div>

        {!isLoading && (
          <div className="stats-summary card">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-value">{summary.activeDays}/{summary.totalDays}</span>
                <span className="summary-label">활동</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{summary.perfectDays}일</span>
                <span className="summary-label">완벽</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{summary.averageSteps.toFixed(1)}</span>
                <span className="summary-label">평균</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{Math.round(summary.completionRate)}%</span>
                <span className="summary-label">달성</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
