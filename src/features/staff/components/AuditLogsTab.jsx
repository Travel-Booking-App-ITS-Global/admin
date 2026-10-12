import React from 'react';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';
import { Skeleton, EmptyState, Badge } from '../../../shared/ui/index.js';

export function AuditLogsTab({ logs = [], loading = false }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <Skeleton height="36px" style={{ marginBottom: '10px' }} />
        <Skeleton count={6} height="40px" />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <EmptyState
        icon={<Activity size={32} />}
        title="No Security Logs Recorded"
        description="Admin actions, logins, and permission changes will be audited and displayed here."
      />
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Module</th>
              <th>Admin Actor</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : 'Just now'}
                  </span>
                </td>
                <td>
                  <strong style={{ color: 'var(--text-primary)' }}>{log.action}</strong>
                </td>
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--brand-600)', fontWeight: 600 }}>
                    {log.module || 'System'}
                  </span>
                </td>
                <td>
                  <span>{log.actorEmail || `Admin #${log.actorId || 1}`}</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </span>
                </td>
                <td>
                  <Badge variant="success" size="sm">
                    Success
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
