import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import SiteLogo from './SiteLogo';
import type { LogoTheme } from '../content/logoThemes';
import { ROUTES } from '../routes/paths';

type SiteHeaderProps = {
  headerClassName: string;
  logoTheme: LogoTheme;
  logoCompact: boolean;
  logoPriority: boolean;
  cartCount: number;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`;

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Home', end: true },
  { to: ROUTES.kundali, label: 'Kundali Patra' },
  { to: ROUTES.astrologers, label: 'Astrologers' },
  { to: ROUTES.divineStore, label: 'Divine Store' },
] as const;

export default function SiteHeader({
  headerClassName,
  logoTheme,
  logoCompact,
  logoPriority,
  cartCount,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen);
    return () => document.body.classList.remove('nav-menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={headerClassName}>
      <div className="site-shell nav-header__shell">
        <Link to={ROUTES.home} className="logo-container" onClick={closeMenu}>
          <SiteLogo compact={logoCompact} theme={logoTheme} priority={logoPriority} />
        </Link>

        <div className="nav-right-container">
          <nav className="nav-header__nav-desktop" aria-label="Main">
            <ul className="nav-menu">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass} end={'end' in item ? item.end : undefined}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <button type="button" className="action-btn" title="Search stars...">
              <Search size={22} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="action-btn"
              title="Login / Sign Up"
              onClick={() => navigate(ROUTES.login)}
            >
              <User size={22} strokeWidth={1.75} />
            </button>
            <button type="button" className="action-btn" title="Remedies Cart">
              <ShoppingCart size={22} strokeWidth={1.75} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>

          <button
            type="button"
            className={`nav-hamburger${menuOpen ? ' nav-hamburger--open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`nav-mobile-backdrop${menuOpen ? ' nav-mobile-backdrop--visible' : ''}`}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <nav
        id="site-mobile-nav"
        className={`nav-mobile-drawer${menuOpen ? ' nav-mobile-drawer--open' : ''}`}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        <div className="nav-mobile-drawer__head">
          <span className="nav-mobile-drawer__title">Menu</span>
          <button type="button" className="nav-mobile-drawer__close" aria-label="Close menu" onClick={closeMenu}>
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        <ul className="nav-mobile-menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-mobile-link${isActive ? ' active' : ''}`}
                end={'end' in item ? item.end : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-mobile-drawer__actions">
          <button type="button" className="nav-mobile-action" onClick={() => { closeMenu(); navigate(ROUTES.login); }}>
            <User size={20} strokeWidth={1.75} />
            Login / Sign Up
          </button>
          <button type="button" className="nav-mobile-action">
            <Search size={20} strokeWidth={1.75} />
            Search
          </button>
          <button type="button" className="nav-mobile-action">
            <ShoppingCart size={20} strokeWidth={1.75} />
            Cart{cartCount > 0 ? ` (${cartCount})` : ''}
          </button>
        </div>
      </nav>
    </header>
  );
}
