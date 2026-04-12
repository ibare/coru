import { useState } from 'react'
import { PasscodeInput } from '../components/PasscodeInput'
import { verifyPasscode, updatePasscode } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import './SettingsPage.css'

type Step = 'current' | 'new' | 'confirm' | 'done'

export function SettingsPage() {
  const [step, setStep] = useState<Step>('current')
  const [error, setError] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { logout } = useAuth()

  const handleCurrentPasscode = async (passcode: string) => {
    setIsProcessing(true)
    setError(false)
    const valid = await verifyPasscode(passcode)
    setIsProcessing(false)

    if (valid) {
      setStep('new')
    } else {
      setError(true)
    }
  }

  const handleNewPasscode = (passcode: string) => {
    setNewCode(passcode)
    setStep('confirm')
  }

  const handleConfirmPasscode = async (passcode: string) => {
    if (passcode !== newCode) {
      setError(true)
      return
    }

    setIsProcessing(true)
    setError(false)
    await updatePasscode(passcode)
    setIsProcessing(false)
    setStep('done')
  }

  const getStepTitle = () => {
    switch (step) {
      case 'current': return 'Current Code'
      case 'new': return 'New Code'
      case 'confirm': return 'Confirm Code'
      case 'done': return 'All Done!'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 'current': return 'Enter your current passcode'
      case 'new': return 'Enter a new 4-digit passcode'
      case 'confirm': return 'Enter it one more time'
      case 'done': return 'Your passcode has been changed'
    }
  }

  return (
    <Layout title="Settings" showBack>
      <div className="settings-page animate-fade-in">
        <div className="settings-card card">
          <h2 className="settings-title">Change Passcode</h2>

          <div className="settings-step">
            <h3 className="step-title">{getStepTitle()}</h3>
            <p className="step-desc">{getStepDescription()}</p>

            {step !== 'done' ? (
              <div className="step-input">
                <PasscodeInput
                  key={step}
                  onComplete={
                    step === 'current'
                      ? handleCurrentPasscode
                      : step === 'new'
                      ? handleNewPasscode
                      : handleConfirmPasscode
                  }
                  error={error}
                  disabled={isProcessing}
                />
                {error && (
                  <p className="settings-error">
                    {step === 'current' ? 'Invalid code' : 'Codes do not match'}
                  </p>
                )}
              </div>
            ) : (
              <div className="done-area animate-bounce-in">
                <span className="done-icon">&#10003;</span>
                <button
                  className="btn"
                  onClick={() => {
                    setStep('current')
                    setNewCode('')
                    setError(false)
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <div className="settings-divider" />

          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </Layout>
  )
}
