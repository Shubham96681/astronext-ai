'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardStatGrid from '@/components/dashboard/DashboardStatGrid';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAdminDashboard,
  formatDateTime,
  formatPaise,
  type AdminDashboardData,
} from '@/lib/api';
import { ROUTES } from '@/routes/paths';

export default function AdminDashboard() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.replace(ROUTES.login);
      return;
    }
    if (user.role !== 'admin' && user.role !== 'ops') {
      router.replace(user.role === 'astrologer' ? '/dashboard/astrologer' : ROUTES.home);
      return;
    }

    fetchAdminDashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [authLoading, user, token, router]);

  if (authLoading || loading) {
    return (
      <DashboardShell role="admin" title="Admin Dashboard" subtitle="Loading platform overview…">
        <div className="dashboard-loading">Loading dashboard…</div>
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell role="admin" title="Admin Dashboard">
        <div className="dashboard-error">{error ?? 'Unable to load data'}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="admin"
      title="Admin Dashboard"
      subtitle="Astrologers, consultations, and puja bookings — products via Shopify"
    >
      {data.products_note ? (
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>{data.products_note}</p>
      ) : null}
      <DashboardStatGrid stats={data.stats} />

      <div className="dashboard-grid-2">
        <section className="dashboard-panel" id="consultations">
          <div className="dashboard-panel__head">
            <h2 className="dashboard-panel__title">Recent Consultations</h2>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Scheduled</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_consultations.map((c) => (
                  <tr key={c.id}>
                    <td>{c.customer_name}</td>
                    <td>{formatDateTime(c.scheduled_at)}</td>
                    <td>{c.duration_minutes} min</td>
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

      <div className="dashboard-grid-2" style={{ marginTop: '1.5rem' }}>
        <section className="dashboard-panel">
          <div className="dashboard-panel__head">
            <h2 className="dashboard-panel__title">Puja Bookings</h2>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Devotee</th>
                  <th>Puja</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_puja_bookings.map((p) => (
                  <tr key={p.id}>
                    <td>{p.devotee_name}</td>
                    <td>{p.puja_name}</td>
                    <td>{p.scheduled_date}</td>
                    <td>{formatPaise(p.amount_paise)}</td>
                    <td>
                      <span className={`dashboard-badge dashboard-badge--${p.status}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel" id="astrologers">
          <div className="dashboard-panel__head">
            <h2 className="dashboard-panel__title">Astrologers</h2>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Rate/min</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.astrologers.map((a) => (
                  <tr key={a.slug}>
                    <td>{a.name}</td>
                    <td>{a.specialty}</td>
                    <td>₹{a.price_per_minute}</td>
                    <td>{a.rating.toFixed(2)}</td>
                    <td>
                      <span className={`dashboard-badge dashboard-badge--${a.online ? 'completed' : 'pending'}`}>
                        {a.online ? 'Online' : 'Offline'}
                      </span>
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
