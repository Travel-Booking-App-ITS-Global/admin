import React from 'react';
import { UserCheck, ShieldCheck, Edit, Trash2, Phone, MapPin, Plus, Search, Star } from 'lucide-react';
import { Skeleton, EmptyState, Badge } from '../../../shared/ui/index.js';

export function DriversTab({
  drivers,
  loading,
  searchTerm,
  onSearchChange,
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
}) {
  return (
    <div>
      {/* Toolbar */}
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
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
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
            placeholder="Search driver name, phone, city..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-sm" onClick={onAddDriver}>
          <Plus size={15} style={{ marginRight: '6px' }} />
          Onboard Driver
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
              <Skeleton height="40px" width="60%" style={{ marginBottom: '10px' }} />
              <Skeleton height="16px" width="40%" style={{ marginBottom: '8px' }} />
              <Skeleton height="16px" width="80%" />
            </div>
          ))}
        </div>
      ) : drivers.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={32} />}
          title="No Drivers Registered"
          description="No drivers found matching your search. Onboard a new driver to assign fleet rides."
          action={
            <button className="btn btn-primary btn-sm" onClick={onAddDriver}>
              <Plus size={14} style={{ marginRight: '6px' }} />
              Add First Driver
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {drivers.map((d) => (
            <div key={d.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-600)' }}>
                  {d.drvCode || `DRV${d.id}`}
                </span>
                <Badge
                  variant={d.status === 'active' ? 'success' : d.status === 'busy' ? 'warning' : 'neutral'}
                  size="sm"
                >
                  {d.status}
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                {d.photo ? (
                  <img
                    src={d.photo}
                    alt={d.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--brand-50)',
                      color: 'var(--brand-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {(d.name || 'D').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{d.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--text-muted)" /> {d.city || 'Kochi, Kerala'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} /> <strong style={{ color: 'var(--text-secondary)' }}>{d.phone}</strong>
                </div>
                <div>Vehicle: <strong style={{ color: 'var(--text-primary)' }}>{d.vehicle || 'Unassigned'}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} color="var(--warning-500)" fill="var(--warning-500)" />
                  <strong>{d.rating || 4.9}</strong> ({d.rides || 0} total trips)
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-3)' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onEditDriver(d)}>
                  <Edit size={14} style={{ marginRight: '4px' }} /> Edit Details
                </button>
                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-500)' }} onClick={() => onDeleteDriver(d)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
