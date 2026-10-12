import React from 'react';
import { Key, Shield, CheckCircle } from 'lucide-react';
import { Badge } from '../../../shared/ui/index.js';

export function RolesTab({ roles = [] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {roles.map((r) => (
        <div key={r.id || r.name} className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-50)',
                  color: 'var(--brand-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Key size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {r.name}
              </h4>
            </div>
            <Badge variant="primary" size="sm">
              Role
            </Badge>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 var(--space-4)', lineHeight: 1.5 }}>
            {r.description || `Role with customized operational permissions for ${r.name}.`}
          </p>

          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-3)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
              ATTACHED PERMISSIONS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
              {(r.permissions && r.permissions.length > 0
                ? r.permissions.map((p) => p.key || p.name || p)
                : ['dashboard', 'bookings.read', 'customers.read']
              ).map((perm, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-default)',
                    fontFamily: 'monospace',
                  }}
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
