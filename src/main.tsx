import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import logoUrl from './assets/astronext-logo.png'

const preloadLogo = document.createElement('link')
preloadLogo.rel = 'preload'
preloadLogo.as = 'image'
preloadLogo.href = logoUrl
document.head.appendChild(preloadLogo)
import './index.css'
import './styles/home-pixel.css'
import './styles/cosmic-section.css'
import './styles/mockups.css'
import './styles/hero-reference.css'
import './styles/section-typography.css'
import './styles/why-app-section.css'
import './styles/motion.css'
import './styles/footer-section.css'
import './styles/devotion-section.css'
import './styles/puja-promo-section.css'
import './styles/astrologers-page.css'
import './styles/kundali-page.css'
import './styles/jagannath-store-page.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
