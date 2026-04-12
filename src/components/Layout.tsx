import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import './Layout.css'

interface Props {
  children: React.ReactNode
  title?: string
  showBack?: boolean
}

export function Layout({ children, title = 'CORU', showBack }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle } = useTheme()

  const isHome = location.pathname === '/' || location.pathname === ''

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          {showBack ? (
            <button className="header-icon-btn" onClick={() => navigate('/')}>
              &#8592;
            </button>
          ) : (
            <span className="header-logo">{title}</span>
          )}
        </div>
        <div className="header-right">
          {isHome && (
            <>
              <button
                className="header-icon-btn"
                onClick={() => navigate('/stats')}
                title="Stats"
              >
                &#9776;
              </button>
              <button
                className="header-icon-btn"
                onClick={toggle}
                title="Theme"
              >
                {theme === 'light' ? '\u263E' : '\u2600'}
              </button>
              <button
                className="header-icon-btn"
                onClick={() => navigate('/settings')}
                title="Settings"
              >
                &#9881;
              </button>
            </>
          )}
          {!isHome && (
            <button
              className="header-icon-btn"
              onClick={() => navigate('/')}
              title="Home"
            >
              &#8962;
            </button>
          )}
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}
