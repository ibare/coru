import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { getRoutine, setRoutine } from '../services/routine.service'
import type { RoutineRecord } from '../types'

export function useRoutine() {
  const [record, setRecord] = useState<RoutineRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchToday = useCallback(async () => {
    setIsLoading(true)
    const data = await getRoutine(today)
    setRecord(data)
    setIsLoading(false)
  }, [today])

  useEffect(() => {
    fetchToday()
  }, [fetchToday])

  const updateSteps = useCallback(async (mask: number) => {
    // 낙관적 업데이트
    if (mask === 0) {
      setRecord(null)
    } else {
      setRecord(prev => {
        if (prev) {
          return { ...prev, completedSteps: mask }
        }
        return {
          date: today,
          completedSteps: mask,
          createdAt: null as never,
          updatedAt: null as never,
        }
      })
    }

    const updated = await setRoutine(today, mask)
    setRecord(updated)
  }, [today])

  return { record, isLoading, updateSteps }
}
