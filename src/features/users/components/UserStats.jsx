import React from 'react';
import { Users as UsersIcon, UserCheck, UserX, ShieldAlert } from 'lucide-react';
import { Skeleton } from '../../../shared/ui/index.js';

/**
 * @typedef {Object} UserStatsProps
 * @property {Object} stats - Stats counts
 * @property {number} stats.total - Total users count
 * @property {number} stats.active - Active users count
 * @property {number} stats.inactive - Inactive users count
 * @property {number} stats.blocked - Blocked users count
 * @property {boolean} loading - Loading state
 */

/**
 * User Statistics KPI Cards
 * @param {UserStatsProps} props
 */
export function UserStats({ stats, loading }) {
  const cards = [
    {
      title: 'Total Users',
      value: stats?.total ?? 0,
      icon: <UsersIcon size={20} color="var(--brand-600)" />,
      bg: 'var(--brand-50)',
      trend: '+12% this month',
    },
    {
      title: 'Active Users',
      value: stats?.active ?? 0,
      icon: <UserCheck size={20} color="var(--success-600)" />,
      bg: 'var(--success-50)',
      trend: 'Active travelers',
    },
    {
      title: 'Inactive Users',
      value: stats?.inactive ?? 0,
      icon: <UserX size={20} color="var(--warning-600)" />,
      bg: 'var(--warning-50)',
      trend: 'No recent booking',
    },
    {
      title: 'Blocked Users',
      value: stats?.blocked ?? 0,
      icon: <ShieldAlert size={20} color="var(--danger-600)" />,
      bg: 'var(--danger-50)',
      trend: 'Access restricted',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: c.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {c.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {c.title}
            </div>
            {loading ? (
              <Skeleton width="60px" height="24px" style={{ marginTop: '4px' }} />
            ) : (
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                {c.value.toLocaleString()}
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {c.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
