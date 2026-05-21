import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import logoUrl from './assets/logos/logo-header.png'

const preloadLogo = document.createElement('link')
preloadLogo.rel = 'preload'
preloadLogo.as = 'image'
preloadLogo.href = logoUrl
document.head.appendChild(preloadLogo)
import './styles/tailwind.css'
import './index.css'
import './styles/page-styles.ts'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AppThemeProvider from './theme/AppThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
)
