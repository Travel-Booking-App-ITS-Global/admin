import React from 'react';
import { Eye, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import { Skeleton, EmptyState, Badge } from '../../../shared/ui/index.js';

/**
 * @typedef {Object} UserTableProps
 * @property {Array<Object>} users - List of users
 * @property {boolean} loading - Loading state
 * @property {function(Object):void} onView - View detail handler
 * @property {function(Object):void} onEdit - Edit user handler
 * @property {function(Object):void} onDelete - Delete user handler
 * @property {function(Object, string):void} onToggleStatus - Status toggle handler
 * @property {'table' | 'grid'} viewMode - Display mode
 */

/**
 * User data table and grid list
 * @param {UserTableProps} props
 */
export function UserTable({
  users,
  loading,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  viewMode = 'table',
}) {
  if (loading) {
    return (
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <Skeleton height="40px" style={{ marginBottom: '12px' }} />
        <Skeleton count={5} height="48px" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon size={32} />}
        title="No Users Found"
        description="No user accounts match your active search or status filter. Try clearing filters or creating a user."
      />
    );
  }

  if (viewMode === 'grid') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {users.map((u) => (
          <div key={u.id} className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-600)' }}>
                {u.usrCode || `USR${u.id}`}
              </span>
              <Badge
                variant={u.status === 'active' ? 'success' : u.status === 'blocked' ? 'danger' : 'warning'}
                size="sm"
              >
                {u.status}
              </Badge>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              {u.avatar ? (
                <img
                  src={u.avatar}
                  alt={u.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--brand-50)',
                    color: 'var(--brand-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {(u.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.email}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              <div>Phone: <strong style={{ color: 'var(--text-secondary)' }}>{u.phone || 'N/A'}</strong></div>
              <div>Total Spent: <strong style={{ color: 'var(--success-600)' }}>{u.totalSpent || '₹0'}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-3)' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onView(u)}>
                <Eye size={14} style={{ marginRight: '4px' }} /> View
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => onEdit(u)}>
                <Edit size={14} />
              </button>
              <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-500)' }} onClick={() => onDelete(u)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th>Bookings</th>
              <th>Total Spent</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--brand-50)',
                          color: 'var(--brand-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        {(u.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.usrCode || `USR${u.id}`}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{u.email}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</div>
                </td>
                <td>
                  <Badge
                    variant={u.status === 'active' ? 'success' : u.status === 'blocked' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {u.status}
                  </Badge>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{u.bookingsCount || 0}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--success-600)' }}>{u.totalSpent || '₹0'}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.joined || 'N/A'}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
                    <button className="btn-icon" onClick={() => onView(u)} title="View User Details">
                      <Eye size={15} />
                    </button>
                    <button className="btn-icon" onClick={() => onEdit(u)} title="Edit User">
                      <Edit size={15} />
                    </button>
                    <button className="btn-icon" style={{ color: 'var(--danger-500)' }} onClick={() => onDelete(u)} title="Delete User">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
