import type { StatCard } from '@/lib/api';

type Props = {
  stats: StatCard[];
};

export default function DashboardStatGrid({ stats }: Props) {
  return (
    <div className="dashboard-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="dashboard-stat-card">
          <p className="dashboard-stat-card__label">{stat.label}</p>
          <p className="dashboard-stat-card__value">{stat.value}</p>
          {stat.change ? (
            <p
              className={`dashboard-stat-card__change dashboard-stat-card__change--${stat.trend ?? 'neutral'}`}
            >
              {stat.change}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
