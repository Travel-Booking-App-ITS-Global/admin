import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Coins,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Star,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { currenciesApi } from '../../services/api.js';

export default function CurrenciesMasterPage() {
  const { addToast } = useApp();

  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive', 'Popular'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    decimalPlaces: 2,
    exchangeRateToInr: 1.0,
    isPopular: false,
    displayOrder: 1,
    isActive: true,
  });

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load currencies
  const loadCurrencies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await currenciesApi.getCurrencies();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCurrencies(list);
    } catch (err) {
      console.error('Failed to load currencies:', err);
      addToast('Failed to fetch currency masters', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  // Filtered currencies
  const filteredCurrencies = useMemo(() => {
    return currencies.filter((c) => {
      const matchSearch =
        !searchTerm.trim() ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.symbol && c.symbol.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && c.isActive) ||
        (statusFilter === 'Inactive' && !c.isActive) ||
        (statusFilter === 'Popular' && c.isPopular);

      return matchSearch && matchStatus;
    });
  }, [currencies, searchTerm, statusFilter]);

  // Metrics
  const activeCount = useMemo(() => currencies.filter((c) => c.isActive).length, [currencies]);
  const popularCount = useMemo(() => currencies.filter((c) => c.isPopular).length, [currencies]);

  // ──────────────────────────────────────────────
  // MODAL HANDLERS
  // ──────────────────────────────────────────────

  const openAddModal = () => {
    setEditingCurrency(null);
    setFormData({
      code: '',
      name: '',
      symbol: '',
      decimalPlaces: 2,
      exchangeRateToInr: 1.0,
      isPopular: false,
      displayOrder: currencies.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCurrency(c);
    setFormData({
      code: c.code || '',
      name: c.name || '',
      symbol: c.symbol || '',
      decimalPlaces: c.decimalPlaces ?? 2,
      exchangeRateToInr: Number(c.exchangeRateToInr) || 1.0,
      isPopular: !!c.isPopular,
      displayOrder: c.displayOrder || 0,
      isActive: c.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      addToast('ISO Currency Code is required (e.g. USD, EUR)', 'error');
      return;
    }
    if (!formData.name.trim()) {
      addToast('Currency Name is required', 'error');
      return;
    }
    if (!formData.symbol.trim()) {
      addToast('Currency Symbol is required (e.g. $, €)', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        symbol: formData.symbol.trim(),
        decimalPlaces: Number(formData.decimalPlaces) || 2,
        exchangeRateToInr: Number(formData.exchangeRateToInr) || 1.0,
        isPopular: Boolean(formData.isPopular),
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: Boolean(formData.isActive),
      };

      if (editingCurrency) {
        await currenciesApi.updateCurrency(editingCurrency.id, payload);
        addToast(`Currency "${payload.code}" updated successfully!`, 'success');
      } else {
        await currenciesApi.createCurrency(payload);
        addToast(`Currency "${payload.code}" created successfully!`, 'success');
      }

      setModalOpen(false);
      loadCurrencies();
    } catch (err) {
      console.error('Failed to save currency:', err);
      addToast(err?.message || 'Failed to save currency', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (c) => {
    setCurrencyToDelete(c);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!currencyToDelete) return;
    setDeleting(true);
    try {
      await currenciesApi.deleteCurrency(currencyToDelete.id);
      addToast(`Currency "${currencyToDelete.code}" deleted successfully!`, 'success');
      setDeleteModalOpen(false);
      setCurrencyToDelete(null);
      loadCurrencies();
    } catch (err) {
      console.error('Failed to delete currency:', err);
      addToast(err?.message || 'Failed to delete currency', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (c) => {
    try {
      await currenciesApi.updateCurrency(c.id, { isActive: !c.isActive });
      addToast(`Currency "${c.code}" ${!c.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadCurrencies();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Currencies Master"
        subtitle="Manage global ISO 3-letter currency codes, exchange rates against INR, symbols, and decimal precision"
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Add Currency
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
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total Currencies</span>
            <Coins size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {currencies.length}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> {activeCount} Active Currencies
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Popular Currencies</span>
            <Star size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {popularCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Featured on front-end currency pickers
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Inactive Currencies</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {currencies.length - activeCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Hidden from customer dropdowns
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Base Currency</span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            INR (₹)
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Indian Rupee reference baseline
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
          {['All', 'Active', 'Inactive', 'Popular'].map((status) => {
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
            placeholder="Search code (EUR, USD), name, symbol..."
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
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading currencies master...</span>
            </div>
          ) : filteredCurrencies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Coins size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No currencies found
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Try adjusting your search or add a new currency.
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
                    SYMBOL
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    RATE TO INR
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    POPULAR
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
                {filteredCurrencies.map((c) => (
                  <tr
                    key={c.id}
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
                          letterSpacing: 0.5,
                          background: 'var(--brand-50)',
                          color: 'var(--brand-700)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontFamily: 'monospace',
                        }}
                      >
                        {c.code}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: 13.5 }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, fontSize: 15, color: 'var(--brand-600)' }}>
                      {c.symbol}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, fontSize: 13, fontFamily: 'monospace' }}>
                      ₹{Number(c.exchangeRateToInr || 1).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      {c.isPopular ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 8px',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          <Star size={11} fill="#f59e0b" color="#f59e0b" /> Popular
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                      {c.displayOrder}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(c)}
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
                          color: c.isActive ? '#065f46' : '#991b1b',
                          backgroundColor: c.isActive ? '#d1fae5' : '#fee2e2',
                        }}
                      >
                        {c.isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => openEditModal(c)}
                          title="Edit Currency"
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
                          onClick={() => confirmDelete(c)}
                          title="Delete Currency"
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
        title={editingCurrency ? `Edit Currency: ${editingCurrency.code}` : 'Add New Currency'}
        size="md"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                ISO Code <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. EUR, USD, INR"
                maxLength={10}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>3-letter standard ISO code</span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Currency Name <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Euro, US Dollar, Dirham"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Symbol <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. €, $, AED"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Decimal Places
              </label>
              <input
                type="number"
                min="0"
                max="4"
                className="form-input"
                value={formData.decimalPlaces}
                onChange={(e) => setFormData({ ...formData, decimalPlaces: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                Rate to INR (₹)
              </label>
              <input
                type="number"
                step="0.000001"
                min="0"
                className="form-input"
                placeholder="e.g. 91.50"
                value={formData.exchangeRateToInr}
                onChange={(e) => setFormData({ ...formData, exchangeRateToInr: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', marginTop: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--brand-600)' }}
                />
                Mark as Popular Currency
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--brand-600)' }}
                />
                Active Status (Visible to users)
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
                editingCurrency ? 'Update Currency' : 'Create Currency'
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
        title="Confirm Currency Deletion"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Delete currency "{currencyToDelete?.code}"?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                This will remove the currency master record. Bookings or rates linked to this currency code will keep their historical values.
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
                'Delete Currency'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
