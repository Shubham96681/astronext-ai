'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, X } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppChatButton from '@/components/WhatsAppChatButton';
import FooterSocialLinks from '@/components/FooterSocialLinks';
import logoFooterImg from '@/assets/logos/logo-footer.svg';
import { imageSrc } from '@/lib/imageSrc';
import { getNavLogoThemeFromPath } from '@/content/logoThemes';
import { isDetailSubRoute, isHeroOverlayPath, pathnameToTab, ROUTES } from '@/routes/paths';
import {
  FOOTER_ABOUT,
  FOOTER_CONTACT_INTRO,
  SUPPORT_EMAIL,
} from '@/content/siteCopy';
import { CartProvider, useCart } from '@/context/CartContext';
import { PujaBookingProvider, usePujaBooking } from '@/context/PujaBookingContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function SiteShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeTab = pathnameToTab(pathname);
  const navLogoTheme = getNavLogoThemeFromPath(pathname);
  const isHeroOverlayPage = !isDetailSubRoute(pathname) && isHeroOverlayPath(pathname);
  const { cartCount } = useCart();
  const { selectedPuja, closePujaModal } = usePujaBooking();
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', dob: '', gotra: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerQuery, setFooterQuery] = useState('');
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  const navHeaderClass = [
    'nav-header',
    activeTab === 'home' && 'nav-header--home',
    isHeroOverlayPage && 'nav-header--overlay',
    !isHeroOverlayPage &&
      activeTab !== 'home' &&
      activeTab !== 'login' &&
      activeTab !== 'signup' &&
      'nav-header--inner',
    isScrolled && 'scrolled',
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(false);
  }, [pathname]);

  useEffect(() => {
    if (selectedPuja) {
      setBookingForm({ name: '', dob: '', gotra: '' });
      setBookingSuccess(false);
    }
  }, [selectedPuja]);

  useScrollReveal([pathname]);

  const handleBookPujaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.dob) {
      alert('Please provide devotee name and birth date for the holy rituals.');
      return;
    }
    setBookingSuccess(true);
  };

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail || !footerQuery) return;
    setFooterSubmitted(true);
    setTimeout(() => {
      setFooterSubmitted(false);
      setFooterEmail('');
      setFooterQuery('');
    }, 3000);
  };

  return (
    <div className="app-container interactive-page min-h-screen font-sans antialiased">
      <ScrollToTop />
      <div className="space-sparkles" />

      <SiteHeader
        headerClassName={navHeaderClass}
        logoTheme={navLogoTheme}
        logoCompact={isScrolled && !isHeroOverlayPage}
        logoPriority={activeTab === 'home' || isHeroOverlayPage}
        cartCount={cartCount}
      />

      <main
        className={`main-content ${
          activeTab !== 'home' && activeTab !== 'login' && activeTab !== 'signup'
            ? 'main-content--with-nav-gap'
            : ''
        } ${isHeroOverlayPage ? 'main-content--hero-overlay' : ''}`}
      >
        <div key={pathname} className={`page-view page-view--${activeTab}`}>
          {children}
        </div>
      </main>

      <footer className="mega-footer">
        <div className="footer-inner">
          <div className="footer-top-row">
            <Link href={ROUTES.home} className="footer-top-logo">
              <img
                src={imageSrc(logoFooterImg)}
                alt="Astronext.ai — THE NEXT-GEN AI OF ASTROLOGY"
                className="footer-top-logo__img"
                width={222}
                height={134}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <nav className="footer-top-nav" aria-label="Legal policies">
              <ul className="footer-legal-inline">
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#refund">Refund Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="footer-grid">
            <div className="footer-col footer-col--brand">
              <h4>About Astro AI</h4>
              <p>{FOOTER_ABOUT}</p>
            </div>

            <div className="footer-col footer-col--form">
              <h4>We&apos;d be glad to connect with you.</h4>
              {footerSubmitted ? (
                <p className="footer-success-msg">Thank you! We will reach out soon.</p>
              ) : (
                <form onSubmit={handleFooterSubmit} className="footer-input-group">
                  <input
                    type="email"
                    className="footer-input"
                    placeholder="Type Email ID"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="footer-input"
                    placeholder="Type your query"
                    value={footerQuery}
                    onChange={(e) => setFooterQuery(e.target.value)}
                    required
                  />
                  <button type="submit" className="footer-submit-btn">
                    Submit
                  </button>
                </form>
              )}
            </div>

            <div id="footer-contact" className="footer-col footer-col--contact">
              <h4>Contact Us</h4>
              <p className="footer-contact-line">{FOOTER_CONTACT_INTRO}</p>
              <p className="footer-email-line">
                <span className="footer-email-label">Email ID:</span>{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="footer-email-value">
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <FooterSocialLinks />
            </div>
          </div>

          <div className="footer-bottom">
            <p>Copyright 2025 AstroAI . All Rights Reserved</p>
          </div>
        </div>
      </footer>

      <WhatsAppChatButton className="wa-chat-widget--floating" />

      {selectedPuja && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button type="button" className="modal-close-x" onClick={closePujaModal}>
              <X size={20} />
            </button>

            {!bookingSuccess ? (
              <div>
                <h3 className="modal-title">Schedule {selectedPuja.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(37, 21, 69, 0.7)', marginBottom: '1.8rem' }}>
                  Provide devotee credentials so the Pandits can chant custom gotra sankalp mantras during live Yajna.
                </p>
                <form onSubmit={handleBookPujaSubmit}>
                  <div className="form-group">
                    <label className="form-label">Devotee Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Rahul Sharma"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Birth Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingForm.dob}
                      onChange={(e) => setBookingForm({ ...bookingForm, dob: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vedic Gotra (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Kashyap, Bhardwaj"
                      value={bookingForm.gotra}
                      onChange={(e) => setBookingForm({ ...bookingForm, gotra: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
                    Confirm & Proceed ({selectedPuja.price})
                  </button>
                </form>
              </div>
            ) : (
              <div className="success-message">
                <div className="success-icon-box">
                  <Check size={36} />
                </div>
                <h3 className="modal-title" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>
                  Sankalp Confirmed!
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'rgba(37, 21, 69, 0.8)',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5',
                  }}
                >
                  Pranam, <strong>{bookingForm.name}</strong>. Your custom live broadcast details for{' '}
                  <strong>{selectedPuja.title}</strong> have been scheduled successfully.
                </p>
                <div
                  style={{
                    background: '#f5fbf6',
                    border: '1px dashed #25D366',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: '#1a7a3b',
                    fontWeight: 600,
                    marginBottom: '2rem',
                  }}
                >
                  Ritual coordinates and private webstream link sent to your registered WhatsApp channel.
                </div>
                <button type="button" className="submit-btn" onClick={closePujaModal}>
                  Blessed Be
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <PujaBookingProvider>
        <SiteShellInner>{children}</SiteShellInner>
      </PujaBookingProvider>
    </CartProvider>
  );
}
