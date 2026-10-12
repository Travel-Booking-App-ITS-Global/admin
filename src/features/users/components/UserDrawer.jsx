import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, Shield, DollarSign } from 'lucide-react';
import { Badge } from '../../../shared/ui/index.js';

/**
 * @typedef {Object} UserDrawerProps
 * @property {boolean} isOpen - Whether drawer is open
 * @property {function():void} onClose - Close handler
 * @property {Object} [user] - User details object
 */

/**
 * Slide-over drawer displaying comprehensive user profile & bookings history
 * @param {UserDrawerProps} props
 */
export function UserDrawer({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen || !user) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'var(--bg-app)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInRight 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: 'var(--space-5)',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
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
                  fontSize: '1.125rem',
                }}
              >
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-600)' }}>
                  {user.usrCode || `USR${user.id}`}
                </span>
                <Badge
                  variant={user.status === 'active' ? 'success' : user.status === 'blocked' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            padding: '0 var(--space-5)',
          }}
        >
          {['profile', 'bookings', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                border: 'none',
                background: 'transparent',
                fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? 'var(--brand-600)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab ? '2px solid var(--brand-600)' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '0.875rem',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)' }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <h4 style={{ margin: '0 0 var(--space-3)', fontSize: '0.9375rem', fontWeight: 600 }}>
                  Contact Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
                    <Mail size={16} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
                    <Phone size={16} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-primary)' }}>{user.phone || 'No phone added'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
                    <Calendar size={16} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Joined: {user.joined || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <h4 style={{ margin: '0 0 var(--space-3)', fontSize: '0.9375rem', fontWeight: 600 }}>
                  Account Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Bookings</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {user.bookingsCount || 0}
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Spent</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-600)', marginTop: '2px' }}>
                      {user.totalSpent || '₹0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--text-muted)' }}>
              <div>Recent bookings will appear here.</div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--text-muted)' }}>
              <div>User session history and activity timeline.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
