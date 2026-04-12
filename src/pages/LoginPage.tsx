import { useState } from 'react'
import { PasscodeInput } from '../components/PasscodeInput'
import { verifyPasscode } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'
import './LoginPage.css'

export function LoginPage() {
  const [error, setError] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const { login } = useAuth()
  useTheme()

  const handleComplete = async (passcode: string) => {
    setIsChecking(true)
    setError(false)

    const valid = await verifyPasscode(passcode)

    if (valid) {
      login()
    } else {
      setError(true)
      setIsChecking(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-content animate-fade-in">
        <div className="login-logo">
          <span className="logo-dot">&#9679;</span>
          <h1 className="logo-text">CORU</h1>
        </div>
        <p className="login-subtitle">Core Routine Tracker</p>

        <div className="login-input-area">
          <PasscodeInput
            onComplete={handleComplete}
            error={error}
            disabled={isChecking}
          />
          {error && (
            <p className="login-error">Invalid code</p>
          )}
        </div>
      </div>
    </div>
  )
}
