import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * @typedef {Object} UserModalProps
 * @property {boolean} isOpen - Whether modal is open
 * @property {function():void} onClose - Close handler
 * @property {Object} [user] - User object to edit (or null if creating)
 * @property {function(Object):Promise<void>} onSubmit - Submit handler
 */

/**
 * Modal form for creating and editing user accounts
 * @param {UserModalProps} props
 */
export function UserModal({ isOpen, onClose, user, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setStatus(user.status || 'active');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setStatus('active');
      setPassword('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone: phone || undefined,
        status,
        ...(password && !user ? { password } : {}),
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        padding: 'var(--space-4)',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {user ? 'Edit User Account' : 'Create New User'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
            />
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>

          {!user && (
            <div>
              <label className="form-label">Initial Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for default"
              />
            </div>
          )}

          <div>
            <label className="form-label">Account Status</label>
            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : user ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
