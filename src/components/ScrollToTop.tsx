import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top on route change (replaces activeTab scroll effect). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
