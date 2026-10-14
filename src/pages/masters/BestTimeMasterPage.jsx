import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  SunMedium,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { bestTimeApi } from '../../services/api.js';

export default function BestTimeMasterPage() {
  const { addToast } = useApp();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    season: '',
    description: '',
    displayOrder: 1,
    isActive: true,
  });

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load items
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bestTimeApi.getBestTimes();
      const list = Array.isArray(res) ? res : res?.data || [];
      setItems(list);
    } catch (err) {
      console.error('Failed to load best time master:', err);
      addToast('Failed to fetch best time records', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchSearch =
        !searchTerm.trim() ||
        i.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (i.season && i.season.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (i.description && i.description.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && i.isActive) ||
        (statusFilter === 'Inactive' && !i.isActive);

      return matchSearch && matchStatus;
    });
  }, [items, searchTerm, statusFilter]);

  // Metrics
  const activeCount = useMemo(() => items.filter((i) => i.isActive).length, [items]);

  // ──────────────────────────────────────────────
  // MODAL HANDLERS
  // ──────────────────────────────────────────────

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      season: '',
      description: '',
      displayOrder: items.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (i) => {
    setEditingItem(i);
    setFormData({
      name: i.name || '',
      season: i.season || '',
      description: i.description || '',
      displayOrder: i.displayOrder || 0,
      isActive: i.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Months or period name is required (e.g. Apr-Jun, Oct-Mar)', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        season: formData.season?.trim() || null,
        description: formData.description?.trim() || null,
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: Boolean(formData.isActive),
      };

      if (editingItem) {
        await bestTimeApi.updateBestTime(editingItem.id, payload);
        addToast(`Best time "${payload.name}" updated successfully!`, 'success');
      } else {
        await bestTimeApi.createBestTime(payload);
        addToast(`Best time "${payload.name}" created successfully!`, 'success');
      }

      setModalOpen(false);
      loadItems();
    } catch (err) {
      console.error('Failed to save best time record:', err);
      addToast(err?.message || 'Failed to save best time record', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (i) => {
    setItemToDelete(i);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await bestTimeApi.deleteBestTime(itemToDelete.id);
      addToast(`Best time "${itemToDelete.name}" deleted successfully!`, 'success');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadItems();
    } catch (err) {
      console.error('Failed to delete best time record:', err);
      addToast(err?.message || 'Failed to delete best time record', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (i) => {
    try {
      await bestTimeApi.updateBestTime(i.id, { isActive: !i.isActive });
      addToast(`Best time "${i.name}" ${!i.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadItems();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Best Time to Visit Master"
        subtitle="Manage recommended travel seasons, month spans, weather indicators, and tourist guidance notes"
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Add Period / Season
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
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total Period Options</span>
            <Calendar size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {items.length}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> {activeCount} Active Indicators
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Seasons Tagged</span>
            <SunMedium size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {new Set(items.map((i) => i.season).filter(Boolean)).size}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Distinct climate seasons mapped
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Inactive Indicators</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {items.length - activeCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Disabled in destination selection
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
            placeholder="Search period (Apr-Jun), season, description..."
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
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading best time master...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Calendar size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No records found
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Try adjusting your search or add a new period.
              </div>
            </div>
          ) : (
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    PERIOD / MONTHS
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    SEASON
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    DESCRIPTION / TRAVELER NOTE
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ORDER
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    STATUS
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((i) => (
                  <tr
                    key={i.id}
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          background: 'var(--brand-50)',
                          color: 'var(--brand-700)',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {i.name}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: 13 }}>
                      {i.season ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 8px',
                            background: 'var(--bg-input)',
                            borderRadius: 6,
                            fontSize: 12,
                          }}
                        >
                          {i.season}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360 }}>
                      {i.description || '—'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                      {i.displayOrder}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(i)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 600,
                          color: i.isActive ? '#065f46' : '#991b1b',
                          backgroundColor: i.isActive ? '#d1fae5' : '#fee2e2',
                        }}
                      >
                        {i.isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {i.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => openEditModal(i)}
                          title="Edit Period"
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            border: '1px solid var(--border-default)',
                            background: 'var(--bg-card)',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={14} color="var(--text-secondary)" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => confirmDelete(i)}
                          title="Delete Period"
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            border: '1px solid var(--border-default)',
                            background: 'var(--bg-card)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} color="#ef4444" />
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

      {/* ────────────────────────────────────────────── */}
      {/* ADD / EDIT MODAL                               */}
      {/* ────────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit Period: ${editingItem.name}` : 'Add New Best Time Period'}
        size="md"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Period / Months Range <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Apr-Jun, Oct-Mar, All Year Round"
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Indicator displayed on destination cards</span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Season Category
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Spring, Winter, Dry Season, Summer"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Traveler Guidance Note / Climate Description
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mild weather, blooming flowers, shoulder season pricing"
              maxLength={255}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'center' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Display Priority Order
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
              />
            </div>

            <div className="form-group" style={{ marginTop: 22 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--brand-600)' }}
                />
                Active Status (Selectable in destinations)
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                editingItem ? 'Update Period' : 'Create Period'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ────────────────────────────────────────────── */}
      {/* DELETE CONFIRM MODAL                           */}
      {/* ────────────────────────────────────────────── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Delete period "{itemToDelete?.name}"?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                This will remove the master record. Existing destinations using this string will retain their values.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ background: '#ef4444', color: '#fff', border: 'none' }}
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                'Delete Period'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
