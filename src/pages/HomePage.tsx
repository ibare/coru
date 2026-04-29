import { format } from 'date-fns'
import { Layout } from '../components/Layout'
import { RoutineStatus } from '../components/RoutineStatus'
import { RoutineButtons } from '../components/RoutineButtons'
import { useRoutine } from '../hooks/useRoutine'
import { popcount } from '../lib/steps'
import { MAX_STEPS } from '../constants'
import './HomePage.css'

export function HomePage() {
  const { record, isLoading, updateSteps } = useRoutine()
  const today = new Date()
  const dateStr = format(today, 'MMMM d, yyyy')
  const dayStr = format(today, 'EEEE')
  const completedSteps = record?.completedSteps ?? 0
  const doneCount = popcount(completedSteps)

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
          {doneCount > 0 ? (
            <>
              <p className="status-text">
                <strong>{doneCount}</strong> of {MAX_STEPS} completed!
              </p>
              <RoutineStatus completedSteps={completedSteps} />
            </>
          ) : (
            <p className="status-text empty">No record yet</p>
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
