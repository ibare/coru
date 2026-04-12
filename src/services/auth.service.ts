import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'
import { db, auth } from '../firebase'

export async function initFirebaseAuth(): Promise<void> {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
}

export async function hashPasscode(passcode: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(passcode)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPasscode(passcode: string): Promise<boolean> {
  const hash = await hashPasscode(passcode)
  const configRef = doc(db, 'config', 'auth')
  const configSnap = await getDoc(configRef)

  if (!configSnap.exists()) {
    return false
  }

  const { passcodeHash } = configSnap.data()
  return hash === passcodeHash
}

export async function updatePasscode(newPasscode: string): Promise<void> {
  const hash = await hashPasscode(newPasscode)
  const configRef = doc(db, 'config', 'auth')
  await updateDoc(configRef, { passcodeHash: hash })
}
