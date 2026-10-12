import React from 'react';
import { Users, Edit, Trash2, Shield, Plus, Search, Mail, Phone } from 'lucide-react';
import { Skeleton, EmptyState, Badge } from '../../../shared/ui/index.js';

export function StaffTable({
  staff,
  loading,
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roles = [],
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
}) {
  return (
    <div>
      {/* Filter toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-3)', flex: '1 1 320px', maxWidth: '520px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
              placeholder="Search staff name, email, designation..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select
            className="form-input"
            style={{ width: '180px', fontSize: '0.875rem' }}
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            <option value="All">All Roles</option>
            {roles.map((r) => (
              <option key={r.id || r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onAddStaff}>
          <Plus size={15} style={{ marginRight: '6px' }} />
          Add Team Member
        </button>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <Skeleton height="40px" style={{ marginBottom: '12px' }} />
          <Skeleton count={5} height="48px" />
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="No Team Members Found"
          description="No staff accounts match your active search or role filter."
          action={
            <button className="btn btn-primary btn-sm" onClick={onAddStaff}>
              <Plus size={14} style={{ marginRight: '6px' }} />
              Add First Staff
            </button>
          }
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Department & Designation</th>
                  <th>Role & Access</th>
                  <th>Contact Details</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        {s.avatar ? (
                          <img
                            src={s.avatar}
                            alt={s.name}
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
                            {(s.name || 'S').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.designation || 'Staff'}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{s.department || 'Operations'}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--brand-50)',
                          color: 'var(--brand-700)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                        }}
                      >
                        <Shield size={12} /> {s.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{s.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <Badge variant={s.status === 'active' ? 'success' : 'neutral'} size="sm">
                        {s.status}
                      </Badge>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {s.joinedDate ? new Date(s.joinedDate).toLocaleDateString('en-GB') : 'N/A'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
                        <button className="btn-icon" onClick={() => onEditStaff(s)} title="Edit Staff Details">
                          <Edit size={15} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger-500)' }} onClick={() => onDeleteStaff(s)} title="Revoke Access">
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
      )}
    </div>
  );
}
