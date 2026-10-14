import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Languages,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { languagesApi } from '../../services/api.js';

export default function LanguagesMasterPage() {
  const { addToast } = useApp();

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nativeName: '',
    displayOrder: 1,
    isActive: true,
  });

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load languages
  const loadLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await languagesApi.getLanguages();
      const list = Array.isArray(res) ? res : res?.data || [];
      setLanguages(list);
    } catch (err) {
      console.error('Failed to load languages:', err);
      addToast('Failed to fetch language masters', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    return languages.filter((l) => {
      const matchSearch =
        !searchTerm.trim() ||
        l.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        l.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (l.nativeName && l.nativeName.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && l.isActive) ||
        (statusFilter === 'Inactive' && !l.isActive);

      return matchSearch && matchStatus;
    });
  }, [languages, searchTerm, statusFilter]);

  // Metrics
  const activeCount = useMemo(() => languages.filter((l) => l.isActive).length, [languages]);

  // ──────────────────────────────────────────────
  // MODAL HANDLERS
  // ──────────────────────────────────────────────

  const openAddModal = () => {
    setEditingLanguage(null);
    setFormData({
      code: '',
      name: '',
      nativeName: '',
      displayOrder: languages.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (l) => {
    setEditingLanguage(l);
    setFormData({
      code: l.code || '',
      name: l.name || '',
      nativeName: l.nativeName || '',
      displayOrder: l.displayOrder || 0,
      isActive: l.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      addToast('Language code is required (e.g. en, fr, nl)', 'error');
      return;
    }
    if (!formData.name.trim()) {
      addToast('Language name is required (e.g. English, French)', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.trim().toLowerCase(),
        name: formData.name.trim(),
        nativeName: formData.nativeName?.trim() || null,
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: Boolean(formData.isActive),
      };

      if (editingLanguage) {
        await languagesApi.updateLanguage(editingLanguage.id, payload);
        addToast(`Language "${payload.name}" updated successfully!`, 'success');
      } else {
        await languagesApi.createLanguage(payload);
        addToast(`Language "${payload.name}" created successfully!`, 'success');
      }

      setModalOpen(false);
      loadLanguages();
    } catch (err) {
      console.error('Failed to save language:', err);
      addToast(err?.message || 'Failed to save language', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (l) => {
    setLanguageToDelete(l);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!languageToDelete) return;
    setDeleting(true);
    try {
      await languagesApi.deleteLanguage(languageToDelete.id);
      addToast(`Language "${languageToDelete.name}" deleted successfully!`, 'success');
      setDeleteModalOpen(false);
      setLanguageToDelete(null);
      loadLanguages();
    } catch (err) {
      console.error('Failed to delete language:', err);
      addToast(err?.message || 'Failed to delete language', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (l) => {
    try {
      await languagesApi.updateLanguage(l.id, { isActive: !l.isActive });
      addToast(`Language "${l.name}" ${!l.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadLanguages();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Languages Master"
        subtitle="Manage primary spoken languages, regional scripts, and tourist communication codes"
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Add Language
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
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total Languages</span>
            <Languages size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {languages.length}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> {activeCount} Active Languages
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Native Scripts</span>
            <BookOpen size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {languages.filter((l) => l.nativeName).length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Localized native scripts mapped
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Inactive Languages</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {languages.length - activeCount}
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
            placeholder="Search language name, code (en, fr)..."
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
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading languages master...</span>
            </div>
          ) : filteredLanguages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Languages size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No languages found
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Try adjusting your search or add a new language.
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
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    NATIVE SCRIPT
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
                {filteredLanguages.map((l) => (
                  <tr
                    key={l.id}
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
                        {l.code}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: 13.5 }}>
                      {l.name}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {l.nativeName || '—'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                      {l.displayOrder}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(l)}
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
                          color: l.isActive ? '#065f46' : '#991b1b',
                          backgroundColor: l.isActive ? '#d1fae5' : '#fee2e2',
                        }}
                      >
                        {l.isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {l.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => openEditModal(l)}
                          title="Edit Language"
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
                          onClick={() => confirmDelete(l)}
                          title="Delete Language"
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
        title={editingLanguage ? `Edit Language: ${editingLanguage.name}` : 'Add New Language'}
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
                placeholder="e.g. en, fr, nl"
                maxLength={10}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>ISO 639-1 code</span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Language Name (English) <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. English, French, Dutch"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Native Name / Script
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Français, Nederlands, हिन्दी"
                value={formData.nativeName}
                onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>How it is written locally</span>
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
              Active Status (Available in destination languages selection)
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
                editingLanguage ? 'Update Language' : 'Create Language'
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
        title="Confirm Language Deletion"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Delete language "{languageToDelete?.name}"?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                This will remove the language master record from future selection.
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
                'Delete Language'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
