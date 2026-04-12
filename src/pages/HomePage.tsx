import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Layout } from '../components/Layout'
import { RoutineStatus } from '../components/RoutineStatus'
import { RoutineButtons } from '../components/RoutineButtons'
import { useRoutine } from '../hooks/useRoutine'
import './HomePage.css'

export function HomePage() {
  const { record, isLoading, updateSteps } = useRoutine()
  const today = new Date()
  const dateStr = format(today, 'yyyy년 M월 d일', { locale: ko })
  const dayStr = format(today, 'EEEE', { locale: ko })
  const completedSteps = record?.completedSteps ?? 0

  if (isLoading) {
    return (
      <Layout>
        <div className="home-loading">
          <div className="loading-dot animate-pop" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="home-page animate-fade-in">
        <div className="home-date">
          <h2 className="date-main">{dateStr}</h2>
          <span className="date-day">{dayStr}</span>
        </div>

        <div className="home-status card">
          {completedSteps > 0 ? (
            <>
              <p className="status-text">
                오늘 <strong>{completedSteps}단계</strong> 완료!
              </p>
              <RoutineStatus completedSteps={completedSteps} />
            </>
          ) : (
            <p className="status-text empty">아직 기록이 없습니다</p>
          )}
        </div>

        <RoutineButtons
          completedSteps={completedSteps}
          onSelect={updateSteps}
        />
      </div>
    </Layout>
  )
}
