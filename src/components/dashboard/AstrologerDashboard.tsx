'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardStatGrid from '@/components/dashboard/DashboardStatGrid';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAstrologerDashboard,
  formatDateTime,
  formatPaise,
  isProfileOnline,
  updateAstrologerOnlineStatus,
  type AstrologerDashboardData,
} from '@/lib/api';
import { ROUTES } from '@/routes/paths';

export default function AstrologerDashboard() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AstrologerDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.replace(ROUTES.login);
      return;
    }
    if (user.role !== 'astrologer') {
      router.replace(user.role === 'admin' || user.role === 'ops' ? '/dashboard/admin' : ROUTES.home);
      return;
    }

    fetchAstrologerDashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [authLoading, user, token, router]);

  const handleToggleOnline = async () => {
    if (!data) return;
    setToggling(true);
    try {
      const next = isProfileOnline(data.profile) ? 'offline' : 'online';
      const updated = await updateAstrologerOnlineStatus(next);
      setData((prev) => (prev ? { ...prev, profile: { ...prev.profile, ...updated } } : prev));
    } catch {
      /* ignore */
    } finally {
      setToggling(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardShell role="astrologer" title="Astrologer Portal" subtitle="Loading your sessions…">
        <div className="dashboard-loading">Loading dashboard…</div>
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell role="astrologer" title="Astrologer Portal">
        <div className="dashboard-error">{error ?? 'Unable to load data'}</div>
      </DashboardShell>
    );
  }

  const online = isProfileOnline(data.profile);
  const initials = data.profile.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <DashboardShell
      role="astrologer"
      title="Astrologer Portal"
      subtitle="Manage consultations, availability, and earnings"
      headerAction={
        <div className="dashboard-online-toggle">
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {online ? 'You are online' : 'You are offline'}
          </span>
          <button
            type="button"
            className={`dashboard-toggle${online ? ' dashboard-toggle--on' : ''}`}
            onClick={handleToggleOnline}
            disabled={toggling}
            aria-pressed={online}
            aria-label="Toggle online status"
          >
            <span className="dashboard-toggle__knob" />
          </button>
        </div>
      }
    >
      <div className="dashboard-profile-card">
        <div className="dashboard-profile-card__avatar">{initials}</div>
        <div>
          <h2 className="dashboard-profile-card__name">{data.profile.name}</h2>
          <p className="dashboard-profile-card__meta">{data.profile.specialty}</p>
          <p className="dashboard-profile-card__meta">
            ₹{(data.profile.price_per_minute_paise / 100).toFixed(0)}/min ·{' '}
            {data.profile.consultation_count.toLocaleString()} consultations
          </p>
        </div>
      </div>

      <DashboardStatGrid stats={data.stats} />

      <div className="dashboard-grid-2" id="sessions">
        <section className="dashboard-panel">
          <div className="dashboard-panel__head">
            <h2 className="dashboard-panel__title">Upcoming Sessions</h2>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Scheduled</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.upcoming_consultations.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#666' }}>
                      No upcoming sessions
                    </td>
                  </tr>
                ) : (
                  data.upcoming_consultations.map((c) => (
                    <tr key={c.id}>
                      <td>{c.customer_name}</td>
                      <td>{formatDateTime(c.scheduled_at)}</td>
                      <td>{c.duration_minutes} min</td>
                      <td>{formatPaise(c.amount_paise)}</td>
                      <td>{c.notes ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel" id="earnings">
          <div className="dashboard-panel__head">
            <h2 className="dashboard-panel__title">Recent Sessions</h2>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_consultations.map((c) => (
                  <tr key={c.id}>
                    <td>{c.customer_name}</td>
                    <td>{formatDateTime(c.scheduled_at)}</td>
                    <td>{formatPaise(c.amount_paise)}</td>
                    <td>
                      <span className={`dashboard-badge dashboard-badge--${c.status}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
