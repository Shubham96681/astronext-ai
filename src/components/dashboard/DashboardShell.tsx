'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Star,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/paths';

type DashboardRole = 'admin' | 'astrologer';

type Props = {
  role: DashboardRole;
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
};

const NAV: Record<DashboardRole, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin#consultations', label: 'Consultations', icon: Calendar },
    { href: '/dashboard/admin#astrologers', label: 'Astrologers', icon: Users },
  ],
  astrologer: [
    { href: '/dashboard/astrologer', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/astrologer#sessions', label: 'Sessions', icon: Calendar },
    { href: '/dashboard/astrologer#earnings', label: 'Earnings', icon: Star },
  ],
};

export default function DashboardShell({ role, title, subtitle, headerAction, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.login);
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__brand">
          <Link href={ROUTES.home} className="dashboard-sidebar__logo">
            Astro<span>Next</span>
          </Link>
          <p className="dashboard-sidebar__role">{role === 'admin' ? 'Admin Panel' : 'Astrologer Portal'}</p>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {NAV[role].map(({ href, label, icon: Icon }) => {
            const active = pathname === href.split('#')[0];
            return (
              <Link
                key={href}
                href={href}
                className={`dashboard-nav__link${active ? ' dashboard-nav__link--active' : ''}`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar__footer">
          <p className="dashboard-sidebar__user">{user?.name}</p>
          <p className="dashboard-sidebar__email">{user?.email}</p>
          <button type="button" className="dashboard-btn dashboard-btn--ghost" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-header__title">{title}</h1>
            {subtitle ? <p className="dashboard-header__subtitle">{subtitle}</p> : null}
          </div>
          {headerAction}
        </header>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
