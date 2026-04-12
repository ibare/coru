import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-dot animate-pop" style={{
          width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)',
        }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-dot animate-pop" style={{
          width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)',
        }} />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/coru">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
