import React from 'react';
import { Car, ShieldCheck, Edit, Trash2, Plus, Search, Calendar, FileText } from 'lucide-react';
import { Skeleton, EmptyState, Badge } from '../../../shared/ui/index.js';

export function VehiclesTab({
  vehicles,
  loading,
  searchTerm,
  onSearchChange,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
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
            placeholder="Search vehicle model, plate number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-sm" onClick={onAddVehicle}>
          <Plus size={15} style={{ marginRight: '6px' }} />
          Add Vehicle
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
              <Skeleton height="36px" width="70%" style={{ marginBottom: '10px' }} />
              <Skeleton height="16px" width="50%" style={{ marginBottom: '8px' }} />
              <Skeleton height="20px" width="100%" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={<Car size={32} />}
          title="No Vehicles in Fleet"
          description="No vehicles registered matching your search query. Add a new taxi, sedan, or SUV."
          action={
            <button className="btn btn-primary btn-sm" onClick={onAddVehicle}>
              <Plus size={14} style={{ marginRight: '6px' }} />
              Add First Vehicle
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
          {vehicles.map((v) => (
            <div key={v.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-600)' }}>
                  {v.vehCode || `VEH${v.id}`}
                </span>
                <Badge
                  variant={v.status === 'active' ? 'success' : 'warning'}
                  size="sm"
                >
                  {v.status}
                </Badge>
              </div>

              <div style={{ marginBottom: 'var(--space-3)' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {v.model}
                </h4>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--gray-100)',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  {v.plate}
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-4)' }}>
                <div>Assigned Driver: <strong style={{ color: 'var(--text-secondary)' }}>{v.driver || 'Unassigned'}</strong></div>
                <div>Permit: <strong style={{ color: 'var(--text-secondary)' }}>{v.permit || 'State Tourist Permit'}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-600)' }}>
                  <ShieldCheck size={14} /> Insurance & PUC Active
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-3)' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onEditVehicle(v)}>
                  <Edit size={14} style={{ marginRight: '4px' }} /> Edit Details
                </button>
                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-500)' }} onClick={() => onDeleteVehicle(v)}>
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
