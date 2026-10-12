import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function DriverModal({ isOpen, onClose, driver, onSubmit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [license, setLicense] = useState('');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (driver) {
      setName(driver.name || '');
      setPhone(driver.phone || '');
      setCity(driver.city || '');
      setVehicle(driver.vehicle || '');
      setLicense(driver.dlNumber || driver.licenseNumber || '');
      setStatus(driver.status || 'active');
    } else {
      setName('');
      setPhone('');
      setCity('Kochi');
      setVehicle('Swift Dzire');
      setLicense('');
      setStatus('active');
    }
  }, [driver, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parts = name.trim().split(' ');
      await onSubmit({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        phone: phone.trim(),
        city: city.trim(),
        assignedVehicleModel: vehicle.trim(),
        licenseNumber: license.trim() || `DL-${Math.floor(100000 + Math.random() * 900000)}`,
        status,
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
            {driver ? 'Edit Driver Details' : 'Onboard New Fleet Driver'}
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
              placeholder="e.g. Ramu Kumar"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label className="form-label">Mobile Number *</label>
              <input
                type="text"
                required
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98400 11223"
              />
            </div>
            <div>
              <label className="form-label">Base City *</label>
              <input
                type="text"
                required
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kochi, Goa"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label className="form-label">Driving License No.</label>
              <input
                type="text"
                className="form-input"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="KL-07-2018-00912"
              />
            </div>
            <div>
              <label className="form-label">Assigned Vehicle</label>
              <input
                type="text"
                className="form-input"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="e.g. Swift Dzire, Innova"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Status</label>
            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active & On-Duty</option>
              <option value="busy">On Trip / Busy</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : driver ? 'Save Changes' : 'Onboard Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
