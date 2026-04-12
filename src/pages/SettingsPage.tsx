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
      case 'current': return '현재 코드 입력'
      case 'new': return '새 코드 입력'
      case 'confirm': return '새 코드 확인'
      case 'done': return '변경 완료!'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 'current': return '현재 사용 중인 Passcode를 입력하세요'
      case 'new': return '새로운 4자리 Passcode를 입력하세요'
      case 'confirm': return '한번 더 입력하세요'
      case 'done': return 'Passcode가 변경되었습니다'
    }
  }

  return (
    <Layout title="설정" showBack>
      <div className="settings-page animate-fade-in">
        <div className="settings-card card">
          <h2 className="settings-title">Passcode 변경</h2>

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
                    {step === 'current' ? '잘못된 코드입니다' : '코드가 일치하지 않습니다'}
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
                  확인
                </button>
              </div>
            )}
          </div>

          <div className="settings-divider" />

          <button className="logout-btn" onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>
    </Layout>
  )
}
