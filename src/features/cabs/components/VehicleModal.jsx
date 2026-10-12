import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function VehicleModal({ isOpen, onClose, vehicle, onSubmit }) {
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [permit, setPermit] = useState('All India Tourist Permit (AITP)');
  const [driver, setDriver] = useState('Unassigned');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setModel(vehicle.model || '');
      setPlate(vehicle.plate || vehicle.registrationNumber || '');
      setRcNumber(vehicle.rcNumber || '');
      setPermit(vehicle.permit || 'All India Tourist Permit (AITP)');
      setDriver(vehicle.driver || 'Unassigned');
      setStatus(vehicle.status || 'active');
    } else {
      setModel('Swift Dzire');
      setPlate('');
      setRcNumber('');
      setPermit('All India Tourist Permit (AITP)');
      setDriver('Unassigned');
      setStatus('active');
    }
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        model: model.trim(),
        registrationNumber: plate.trim().toUpperCase(),
        rcNumber: rcNumber.trim() || `RC-${plate.replace(/\s/g, '')}`,
        permit: permit.trim(),
        driverName: driver.trim(),
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
            {vehicle ? 'Edit Vehicle Details' : 'Add Vehicle to Fleet'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="form-label">Vehicle Model *</label>
            <input
              type="text"
              required
              className="form-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Swift Dzire, Toyota Innova Crysta"
            />
          </div>

          <div>
            <label className="form-label">Registration Plate Number *</label>
            <input
              type="text"
              required
              className="form-input"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="e.g. KL 07 AE 4521, DL 1Z A 9012"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label className="form-label">RC Number</label>
              <input
                type="text"
                className="form-input"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                placeholder="RC-KL07-2022-9012"
              />
            </div>
            <div>
              <label className="form-label">Assigned Driver</label>
              <input
                type="text"
                className="form-input"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                placeholder="Driver name or Unassigned"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Permit Type</label>
            <select className="form-input" value={permit} onChange={(e) => setPermit(e.target.value)}>
              <option value="All India Tourist Permit (AITP)">All India Tourist Permit (AITP)</option>
              <option value="State Taxi Permit">State Taxi Permit</option>
              <option value="Commercial Contract Carriage">Commercial Contract Carriage</option>
            </select>
          </div>

          <div>
            <label className="form-label">Status</label>
            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active & Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : vehicle ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
