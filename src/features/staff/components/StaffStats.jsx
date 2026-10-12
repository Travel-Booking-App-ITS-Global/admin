import React from 'react';
import { Users, Shield, Key, Activity } from 'lucide-react';
import { Skeleton } from '../../../shared/ui/index.js';

export function StaffStats({ totalStaff = 0, activeStaff = 0, rolesCount = 0, loading = false }) {
  const cards = [
    {
      title: 'Total Team Members',
      value: totalStaff,
      icon: <Users size={20} color="var(--brand-600)" />,
      bg: 'var(--brand-50)',
      trend: 'Authorized Portal Staff',
    },
    {
      title: 'Active Accounts',
      value: activeStaff,
      icon: <Shield size={20} color="var(--success-600)" />,
      bg: 'var(--success-50)',
      trend: 'Verified Active Access',
    },
    {
      title: 'RBAC Roles Defined',
      value: rolesCount || 4,
      icon: <Key size={20} color="var(--accent-500)" />,
      bg: 'var(--brand-50)',
      trend: 'SuperAdmin, Admin, Agent',
    },
    {
      title: 'Security Audit State',
      value: 'Protected',
      icon: <Activity size={20} color="var(--warning-600)" />,
      bg: 'var(--warning-50)',
      trend: '2FA & IP Logging Active',
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
