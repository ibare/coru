import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

// GitHub Pages SPA 라우팅 복원
const params = new URLSearchParams(window.location.search)
const route = params.get('route')
if (route) {
  window.history.replaceState(null, '', '/coru' + decodeURIComponent(route))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
