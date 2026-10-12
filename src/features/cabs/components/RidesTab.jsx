import React from 'react';
import { Route, Star, MapPin, Search } from 'lucide-react';
import { EmptyState, Badge } from '../../../shared/ui/index.js';

export function RidesTab({ rides = [], searchTerm = '', onSearchChange }) {
  const filtered = rides.filter(
    (r) =>
      r.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.drop?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driver?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-4)', maxWidth: '380px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
            placeholder="Search passenger, route, pickup..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Route size={32} />}
          title="No Cab Rides Found"
          description="No ride bookings found matching your search query."
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Passenger</th>
                  <th>Route (Pickup ➔ Drop)</th>
                  <th>Assigned Driver</th>
                  <th>Vehicle</th>
                  <th>Date & Time</th>
                  <th>Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--brand-600)' }}>{r.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.user}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {r.pickup} ➔ {r.drop}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.driver || 'Unassigned'}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.vehicle}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{r.date}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--success-600)' }}>{r.amount}</strong>
                    </td>
                    <td>
                      <Badge
                        variant={r.status === 'completed' ? 'success' : r.status === 'scheduled' ? 'primary' : 'warning'}
                        size="sm"
                      >
                        {r.status}
                      </Badge>
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
