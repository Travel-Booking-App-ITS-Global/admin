import React from 'react';
import { Car, UserCheck, ShieldCheck, Route } from 'lucide-react';
import { Skeleton } from '../../../shared/ui/index.js';

/**
 * KPI stats for Cabs, Drivers, and Vehicles fleet
 */
export function CabStats({ driversTotal = 0, vehiclesTotal = 0, ridesTotal = 0, loading = false }) {
  const cards = [
    {
      title: 'Total Rides',
      value: ridesTotal,
      icon: <Route size={20} color="var(--brand-600)" />,
      bg: 'var(--brand-50)',
      trend: 'Scheduled & Completed',
    },
    {
      title: 'Active Drivers',
      value: driversTotal,
      icon: <UserCheck size={20} color="var(--success-600)" />,
      bg: 'var(--success-50)',
      trend: 'Verified Fleet Crew',
    },
    {
      title: 'Registered Cabs',
      value: vehiclesTotal,
      icon: <Car size={20} color="var(--accent-500)" />,
      bg: 'var(--brand-50)',
      trend: 'Sedan, SUV & Luxury',
    },
    {
      title: 'Compliance Rate',
      value: '99.4%',
      icon: <ShieldCheck size={20} color="var(--warning-600)" />,
      bg: 'var(--warning-50)',
      trend: 'PUC, RC & Insurance',
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
                {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
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
