import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function StaffModal({ isOpen, onClose, staff, roles = [], onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [designation, setDesignation] = useState('Staff');
  const [roleId, setRoleId] = useState(2);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setName(staff.name || '');
      setEmail(staff.email || '');
      setPhone(staff.phone || '');
      setDepartment(staff.department || 'Operations');
      setDesignation(staff.designation || 'Staff');
      setRoleId(staff.roleId || 2);
      setStatus(staff.status || 'active');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setDepartment('Operations');
      setDesignation('Staff Specialist');
      setRoleId(roles[1]?.id || 2);
      setStatus('active');
      setPassword('');
    }
  }, [staff, isOpen, roles]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parts = name.trim().split(' ');
      await onSubmit({
        email: email.trim().toLowerCase(),
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        displayName: name.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        roleId: Number(roleId),
        status,
        ...(password && !staff ? { password } : {}),
      });
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
            {staff ? 'Edit Team Member' : 'Invite New Team Member'}
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
              placeholder="e.g. Kiara Sen"
            />
          </div>

          <div>
            <label className="form-label">Work Email *</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kiara.s@itsglobal.in"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Operations, Sales"
              />
            </div>
            <div>
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-input"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Lead Officer"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label className="form-label">Portal Role</label>
              <select className="form-input" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                {roles.length > 0 ? (
                  roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={1}>SUPER_ADMIN</option>
                    <option value={2}>ADMIN</option>
                    <option value={3}>STAFF</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="form-label">Account Status</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {!staff && (
            <div>
              <label className="form-label">Temporary Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for auto-generated password"
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : staff ? 'Save Changes' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
