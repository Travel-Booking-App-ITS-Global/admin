import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Globe,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { geoApi } from '../../services/api.js';

export default function StatesMasterPage() {
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const initialCountryId = searchParams.get('countryId') || 'All';
  const [selectedCountryId, setSelectedCountryId] = useState(initialCountryId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    countryId: '',
    name: '',
    code: '',
    isActive: true,
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load countries list for filter dropdown
  const loadCountries = useCallback(async () => {
    try {
      const res = await geoApi.getCountries();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCountries(list);
    } catch (err) {
      console.error('Failed to load countries:', err);
    }
  }, []);

  // Load states
  const loadStates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCountryId && selectedCountryId !== 'All') {
        params.countryId = selectedCountryId;
      }
      const res = await geoApi.getStates(params);
      const list = Array.isArray(res) ? res : res?.data || [];
      setStates(list);
    } catch (err) {
      console.error('Failed to load states:', err);
      addToast('Failed to fetch states master', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCountryId, addToast]);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    loadStates();
  }, [loadStates]);

  // Update query params when country changes
  const handleCountryFilterChange = (newCountryId) => {
    setSelectedCountryId(newCountryId);
    if (newCountryId && newCountryId !== 'All') {
      setSearchParams({ countryId: newCountryId });
    } else {
      setSearchParams({});
    }
  };

  // Filtered states
  const filteredStates = useMemo(() => {
    return states.filter((s) => {
      const matchSearch =
        !searchTerm.trim() ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (s.country?.name && s.country.name.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && s.isActive) ||
        (statusFilter === 'Inactive' && !s.isActive);

      return matchSearch && matchStatus;
    });
  }, [states, searchTerm, statusFilter]);

  // Metrics
  const activeCount = useMemo(() => states.filter((s) => s.isActive).length, [states]);
  const activeCountryObj = useMemo(() => {
    if (!selectedCountryId || selectedCountryId === 'All') return null;
    return countries.find((c) => c.id === selectedCountryId);
  }, [countries, selectedCountryId]);

  // ──────────────────────────────────────────────
  // MODAL ACTIONS
  // ──────────────────────────────────────────────

  const openAddModal = () => {
    setEditingState(null);
    setFormData({
      countryId: (selectedCountryId !== 'All' && selectedCountryId) || (countries[0]?.id || ''),
      name: '',
      code: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingState(s);
    setFormData({
      countryId: s.countryId || s.country?.id || '',
      name: s.name || '',
      code: s.code || '',
      isActive: s.isActive !== undefined ? s.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.countryId) {
      addToast('State name and Country are required', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        countryId: formData.countryId,
        name: formData.name.trim(),
        code: formData.code?.trim().toUpperCase() || null,
        isActive: Boolean(formData.isActive),
      };

      if (editingState) {
        await geoApi.updateState(editingState.id, payload);
        addToast(`State "${formData.name}" updated successfully!`, 'success');
      } else {
        await geoApi.createState(payload);
        addToast(`State "${formData.name}" added successfully!`, 'success');
      }
      setModalOpen(false);
      loadStates();
      loadCountries();
    } catch (err) {
      console.error('Failed to save state:', err);
      addToast(err?.message || 'Failed to save state', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (s) => {
    setStateToDelete(s);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!stateToDelete) return;
    setDeleting(true);
    try {
      await geoApi.deleteState(stateToDelete.id);
      addToast(`State "${stateToDelete.name}" deleted successfully!`, 'success');
      setDeleteModalOpen(false);
      setStateToDelete(null);
      loadStates();
      loadCountries();
    } catch (err) {
      console.error('Failed to delete state:', err);
      addToast(err?.message || 'Failed to delete state', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (s) => {
    try {
      await geoApi.updateState(s.id, { isActive: !s.isActive });
      addToast(`State "${s.name}" ${!s.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadStates();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="States & Provinces Master"
        subtitle="Manage geographic sub-divisions, state codes, and regions for domestic & international bookings"
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Add State
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
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total States</span>
            <MapPin size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {states.length}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> {activeCount} Active States
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Filtered Country</span>
            <Globe size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 10, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeCountryObj ? `${activeCountryObj.flagEmoji || '🌐'} ${activeCountryObj.name}` : 'All Countries'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {activeCountryObj ? `Showing states for ${activeCountryObj.code}` : 'Showing all global states'}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Inactive States</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {states.length - activeCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Disabled in dropdowns
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Countries Registry</span>
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/countries')}
              style={{ width: '100%', justifyContent: 'center', gap: 6, fontSize: 12 }}
            >
              <Globe size={14} /> Go to Countries Master <ExternalLink size={12} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            {countries.length} master countries registered
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
          gap: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          {/* Country Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={15} color="var(--text-muted)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Country:</span>
            <select
              className="form-input form-select"
              value={selectedCountryId}
              onChange={(e) => handleCountryFilterChange(e.target.value)}
              style={{ width: 'auto', minWidth: 180, height: 36, fontSize: 13 }}
            >
              <option value="All">🌍 All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flagEmoji} {c.name} ({c.statesCount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Status Pills */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['All', 'Active', 'Inactive'].map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '5px 12px',
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
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: 240, maxWidth: 320, width: '100%' }}>
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
            placeholder="Search state name or code..."
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
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading states master...</span>
            </div>
          ) : filteredStates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <MapPin size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No states or provinces found
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {selectedCountryId !== 'All'
                  ? `No states registered for ${activeCountryObj?.name || 'this country'}.`
                  : 'Try selecting a different filter or create a new state.'}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openAddModal}
                style={{ marginTop: 14 }}
              >
                <Plus size={14} /> Add State
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>State / Province Name</th>
                  <th>Country</th>
                  <th>State Code</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStates.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-active)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--brand-600)',
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          <MapPin size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                            {s.name}
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            ID: {s.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{s.country?.flagEmoji || '🌐'}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                          {s.country?.name || 'Unknown'}
                        </span>
                        <span className="badge badge-gray" style={{ fontSize: 10, fontFamily: 'monospace' }}>
                          {s.country?.code}
                        </span>
                      </div>
                    </td>

                    <td>
                      {s.code ? (
                        <span className="badge badge-brand" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                          {s.code}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>-</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => toggleStatus(s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        title="Click to toggle status"
                      >
                        {s.isActive ? (
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
                          onClick={() => openEditModal(s)}
                          title="Edit State"
                          style={{ padding: 6 }}
                        >
                          <Edit2 size={15} color="var(--text-secondary)" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => confirmDelete(s)}
                          title="Delete State"
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
          ADD / EDIT STATE MODAL
      ────────────────────────────────────────────── */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingState ? `Edit State: ${editingState.name}` : 'Add New State / Province'}
        >
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  Parent Country <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  required
                  className="form-input form-select"
                  value={formData.countryId}
                  onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                >
                  <option value="" disabled>-- Select Country --</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flagEmoji} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  State / Province Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Maharashtra, California, Dubai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State Code / Abbreviation</label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-input"
                  placeholder="e.g. MH, CA, DXB"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="stateActiveChk"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="stateActiveChk" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }}>
                  Active for booking searches and hotel mapping
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
                  {editingState ? 'Update State' : 'Create State'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ──────────────────────────────────────────────
          DELETE CONFIRM MODAL
      ────────────────────────────────────────────── */}
      {deleteModalOpen && stateToDelete && (
        <Modal
          open={deleteModalOpen}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={`Delete State: ${stateToDelete.name}?`}
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
                  Are you sure you want to delete state &quot;{stateToDelete.name}&quot;?
                </strong>
                <span>
                  This state will be removed from {stateToDelete.country?.name || 'its country'}.
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
                Yes, Delete State
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
