import { Timestamp } from 'firebase/firestore'

export interface RoutineRecord {
  date: string
  completedSteps: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AuthConfig {
  passcodeHash: string
}

export interface StatsSummary {
  totalDays: number
  activeDays: number
  perfectDays: number
  averageSteps: number
  completionRate: number
}
