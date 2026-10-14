import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  AlertCircle,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { geoApi } from '../../services/api.js';

export default function CountriesMasterPage() {
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phoneCode: '+',
    flagEmoji: '🌐',
    displayOrder: 1,
    isActive: true,
  });

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load countries
  const loadCountries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await geoApi.getCountries();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCountries(list);
    } catch (err) {
      console.error('Failed to load countries:', err);
      addToast('Failed to fetch country masters', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchSearch =
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.phoneCode && c.phoneCode.includes(searchTerm.trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && c.isActive) ||
        (statusFilter === 'Inactive' && !c.isActive);

      return matchSearch && matchStatus;
    });
  }, [countries, searchTerm, statusFilter]);

  // Metrics
  const activeCount = useMemo(() => countries.filter((c) => c.isActive).length, [countries]);
  const totalStates = useMemo(() => countries.reduce((acc, c) => acc + (c.statesCount || 0), 0), [countries]);

  // ──────────────────────────────────────────────
  // MODAL HANDLERS
  // ──────────────────────────────────────────────

  const openAddModal = () => {
    setEditingCountry(null);
    setFormData({
      name: '',
      code: '',
      phoneCode: '+',
      flagEmoji: '🌐',
      displayOrder: countries.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCountry(c);
    setFormData({
      name: c.name || '',
      code: c.code || '',
      phoneCode: c.phoneCode || '+',
      flagEmoji: c.flagEmoji || '🌐',
      displayOrder: c.displayOrder || 1,
      isActive: c.isActive !== undefined ? c.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      addToast('Country name and ISO code are required', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        phoneCode: formData.phoneCode?.trim() || null,
        flagEmoji: formData.flagEmoji?.trim() || null,
        displayOrder: parseInt(formData.displayOrder, 10) || 0,
        isActive: Boolean(formData.isActive),
      };

      if (editingCountry) {
        await geoApi.updateCountry(editingCountry.id, payload);
        addToast(`Country "${formData.name}" updated successfully!`, 'success');
      } else {
        await geoApi.createCountry(payload);
        addToast(`Country "${formData.name}" added successfully!`, 'success');
      }
      setModalOpen(false);
      loadCountries();
    } catch (err) {
      console.error('Failed to save country:', err);
      addToast(err?.message || 'Failed to save country', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (c) => {
    setCountryToDelete(c);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!countryToDelete) return;
    setDeleting(true);
    try {
      await geoApi.deleteCountry(countryToDelete.id);
      addToast(`Country "${countryToDelete.name}" deleted successfully!`, 'success');
      setDeleteModalOpen(false);
      setCountryToDelete(null);
      loadCountries();
    } catch (err) {
      console.error('Failed to delete country:', err);
      addToast(err?.message || 'Failed to delete country', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (c) => {
    try {
      await geoApi.updateCountry(c.id, { isActive: !c.isActive });
      addToast(`Country "${c.name}" ${!c.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadCountries();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Countries Master"
        subtitle="Manage global countries, ISO codes, phone dial codes, and geographic settings"
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Add Country
          </button>
        }
      />

      {/* Metric Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total Countries</span>
            <Globe size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {countries.length}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> {activeCount} Active Countries
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total States / Provinces</span>
            <MapPin size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {totalStates}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Sub-divisions mapped
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Inactive Countries</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {countries.length - activeCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Hidden from listings
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Quick Navigation</span>
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/states')}
              style={{ width: '100%', justifyContent: 'center', gap: 6, fontSize: 12 }}
            >
              <MapPin size={14} /> Go to States Master <ExternalLink size={12} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            Manage individual states/provinces
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Filter:</span>
          {['All', 'Active', 'Inactive'].map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  border: active
                    ? '1px solid var(--brand-500)'
                    : '1px solid var(--border-default)',
                  background: active ? 'var(--brand-50)' : 'var(--bg-input)',
                  color: active ? 'var(--brand-600)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: 260, maxWidth: 360, width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search country, code (+91, IN)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 }}>
              <Loader2 className="animate-spin" size={24} color="var(--brand-500)" />
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading countries master...</span>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Globe size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No countries found
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Try adjusting your search or add a new country.
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openAddModal}
                style={{ marginTop: 14 }}
              >
                <Plus size={14} /> Add Country
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Country Name</th>
                  <th>ISO Code</th>
                  <th>Dial Code</th>
                  <th>States / Provinces</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24, userSelect: 'none' }}>{c.flagEmoji || '🌐'}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                            {c.name}
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Priority Order: #{c.displayOrder || 1}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-brand" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                        {c.code}
                      </span>
                    </td>

                    <td>
                      {c.phoneCode ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <Phone size={13} color="var(--text-muted)" />
                          <span>{c.phoneCode}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>-</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => navigate(`/states?countryId=${c.id}`)}
                        className="btn btn-ghost btn-sm"
                        style={{
                          padding: '3px 8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'var(--bg-active)',
                          color: 'var(--brand-600)',
                          fontWeight: 600,
                          fontSize: 12,
                          borderRadius: 'var(--radius-md)',
                        }}
                        title="View States in this Country"
                      >
                        <MapPin size={13} />
                        <span>{c.statesCount || 0} States</span>
                        <ExternalLink size={11} />
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => toggleStatus(c)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        title="Click to toggle status"
                      >
                        {c.isActive ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-gray">Inactive</span>
                        )}
                      </button>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEditModal(c)}
                          title="Edit Country"
                          style={{ padding: 6 }}
                        >
                          <Edit2 size={15} color="var(--text-secondary)" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => confirmDelete(c)}
                          title="Delete Country"
                          style={{ padding: 6 }}
                        >
                          <Trash2 size={15} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ADD / EDIT COUNTRY MODAL
      ────────────────────────────────────────────── */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCountry ? `Edit Country: ${editingCountry.name}` : 'Add New Country'}
        >
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  Country Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. India, United States, Japan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">
                    ISO Code <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. IN, US, FR"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Flag Emoji</label>
                  <input
                    type="text"
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. 🇮🇳, 🇺🇸, 🇫🇷"
                    value={formData.flagEmoji}
                    onChange={(e) => setFormData({ ...formData, flagEmoji: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Dial Code</label>
                <input
                  type="text"
                  maxLength={10}
                  className="form-input"
                  placeholder="e.g. +91, +1, +44"
                  value={formData.phoneCode}
                  onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Order Priority</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 1 })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="countryActiveChk"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="countryActiveChk" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }}>
                  Active for booking and public listings
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingCountry ? 'Update Country' : 'Create Country'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ──────────────────────────────────────────────
          DELETE CONFIRM MODAL
      ────────────────────────────────────────────── */}
      {deleteModalOpen && countryToDelete && (
        <Modal
          open={deleteModalOpen}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={`Delete Country: ${countryToDelete.name}?`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: 13,
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: 2 }}>
                  Are you sure you want to delete &quot;{countryToDelete.name}&quot; ({countryToDelete.code})?
                </strong>
                <span>
                  Warning: Deleting this country will also permanently delete all ({countryToDelete.statesCount || 0}) states registered under it!
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting && <Loader2 size={15} className="animate-spin" />}
                Yes, Delete Country
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
