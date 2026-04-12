import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { RoutineRecord } from '../types'

export async function getRoutine(date: string): Promise<RoutineRecord | null> {
  const docRef = doc(db, 'routines', date)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  return docSnap.data() as RoutineRecord
}

export async function setRoutine(date: string, completedSteps: number): Promise<RoutineRecord> {
  const docRef = doc(db, 'routines', date)
  const now = Timestamp.now()
  const existing = await getDoc(docRef)

  const record: RoutineRecord = {
    date,
    completedSteps,
    createdAt: existing.exists() ? existing.data().createdAt : now,
    updatedAt: now,
  }

  await setDoc(docRef, record)
  return record
}

export async function getRoutinesByRange(
  startDate: string,
  endDate: string
): Promise<RoutineRecord[]> {
  const q = query(
    collection(db, 'routines'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => d.data() as RoutineRecord)
}
