import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { timezonesApi } from '../../services/api.js';

export default function TimezonesMasterPage() {
  const { addToast } = useApp();

  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    offset: '',
    displayOrder: 1,
    isActive: true,
  });

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [timezoneToDelete, setTimezoneToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load timezones
  const loadTimezones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await timezonesApi.getTimezones();
      const list = Array.isArray(res) ? res : res?.data || [];
      setTimezones(list);
    } catch (err) {
      console.error('Failed to load timezones:', err);
      addToast('Failed to fetch timezone masters', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadTimezones();
  }, [loadTimezones]);

  // Filtered timezones
  const filteredTimezones = useMemo(() => {
    return timezones.filter((t) => {
      const matchSearch =
        !searchTerm.trim() ||
        t.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (t.offset && t.offset.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && t.isActive) ||
        (statusFilter === 'Inactive' && !t.isActive);

      return matchSearch && matchStatus;
    });
  }, [timezones, searchTerm, statusFilter]);

  // Metrics
  const activeCount = useMemo(() => timezones.filter((t) => t.isActive).length, [timezones]);

  // ──────────────────────────────────────────────
  // MODAL HANDLERS
  // ──────────────────────────────────────────────

  const openAddModal = () => {
    setEditingTimezone(null);
    setFormData({
      code: '',
      name: '',
      offset: '',
      displayOrder: timezones.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTimezone(t);
    setFormData({
      code: t.code || '',
      name: t.name || '',
      offset: t.offset || '',
      displayOrder: t.displayOrder || 0,
      isActive: t.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      addToast('Timezone code is required (e.g. CET +1, IST +5:30)', 'error');
      return;
    }
    if (!formData.name.trim()) {
      addToast('Descriptive timezone name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        offset: formData.offset?.trim() || null,
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: Boolean(formData.isActive),
      };

      if (editingTimezone) {
        await timezonesApi.updateTimezone(editingTimezone.id, payload);
        addToast(`Timezone "${payload.code}" updated successfully!`, 'success');
      } else {
        await timezonesApi.createTimezone(payload);
        addToast(`Timezone "${payload.code}" created successfully!`, 'success');
      }

      setModalOpen(false);
      loadTimezones();
    } catch (err) {
      console.error('Failed to save timezone:', err);
      addToast(err?.message || 'Failed to save timezone', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (t) => {
    setTimezoneToDelete(t);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!timezoneToDelete) return;
    setDeleting(true);
    try {
      await timezonesApi.deleteTimezone(timezoneToDelete.id);
      addToast(`Timezone "${timezoneToDelete.code}" deleted successfully!`, 'success');
      setDeleteModalOpen(false);
      setTimezoneToDelete(null);
      loadTimezones();
    } catch (err) {
      console.error('Failed to delete timezone:', err);
      addToast(err?.message || 'Failed to delete timezone', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (t) => {
    try {
      await timezonesApi.updateTimezone(t.id, { isActive: !t.isActive });
      addToast(`Timezone "${t.code}" ${!t.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadTimezones();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Time Zones Master"
        subtitle="Manage global standard timezones, UTC offsets, and destination tourist clock indicators"
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Add Time Zone
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
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total Time Zones</span>
            <Clock size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {timezones.length}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> {activeCount} Active Time Zones
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>UTC Offsets</span>
            <Globe size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {timezones.filter((t) => t.offset).length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Standard offsets mapped
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Inactive Time Zones</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {timezones.length - activeCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Hidden from destination form
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
            placeholder="Search timezone (CET, IST, GMT)..."
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
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading timezones master...</span>
            </div>
          ) : filteredTimezones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No timezones found
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Try adjusting your search or add a new timezone.
              </div>
            </div>
          ) : (
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    CODE
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    NAME
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    UTC OFFSET
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
                {filteredTimezones.map((t) => (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 12,
                          background: 'var(--brand-50)',
                          color: 'var(--brand-700)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontFamily: 'monospace',
                        }}
                      >
                        {t.code}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: 13.5 }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {t.offset || '—'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                      {t.displayOrder}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(t)}
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
                          color: t.isActive ? '#065f46' : '#991b1b',
                          backgroundColor: t.isActive ? '#d1fae5' : '#fee2e2',
                        }}
                      >
                        {t.isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {t.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => openEditModal(t)}
                          title="Edit Timezone"
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
                          onClick={() => confirmDelete(t)}
                          title="Delete Timezone"
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
        title={editingTimezone ? `Edit Time Zone: ${editingTimezone.code}` : 'Add New Time Zone'}
        size="md"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Code <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CET +1, IST +5:30"
                maxLength={64}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tourist indicator string</span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Descriptive Name <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Central European Time (UTC+1)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                UTC Offset
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +01:00, +05:30"
                maxLength={20}
                value={formData.offset}
                onChange={(e) => setFormData({ ...formData, offset: e.target.value })}
              />
            </div>

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
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--brand-600)' }}
              />
              Active Status (Available in destination time zone dropdown)
            </label>
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
                editingTimezone ? 'Update Time Zone' : 'Create Time Zone'
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
        title="Confirm Time Zone Deletion"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Delete timezone "{timezoneToDelete?.code}"?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                This will remove the timezone master record. Existing destinations using this string will retain their values.
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
                'Delete Time Zone'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
