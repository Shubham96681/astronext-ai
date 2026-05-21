import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import logoUrl from './assets/logos/logo-header.png'

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
import './styles/motion-interactive.css'
import './styles/footer-section.css'
import './styles/devotion-section.css'
import './styles/puja-promo-section.css'
import './styles/astrologers-page.css'
import './styles/detail-reference.css'
import './styles/astrologer-detail-page.css'
import './styles/jg-detail-readmore.css'
import './styles/kundali-page.css'
import './styles/jagannath-store-page.css'
import './styles/auth-page.css'
import './styles/site-logo.css'
import './styles/site-shell.css'
import './styles/nav-header.css'
import './styles/whatsapp-chat-btn.css'
import './styles/whatsapp-chat-widget.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
