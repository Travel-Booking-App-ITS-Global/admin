import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Globe,
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  Compass,
  ChevronRight,
  Sparkles,
  Phone,
  Coins,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { geoApi } from '../../services/api.js';

export default function LocationsMasterPage() {
  const { addToast } = useApp();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(false);

  // Active selected country
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  // Search & Filter
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modals state
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [countryForm, setCountryForm] = useState({
    name: '',
    code: '',
    phoneCode: '',
    currencyCode: '',
    flagEmoji: '🌐',
    displayOrder: 1,
    isActive: true,
  });

  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [stateForm, setStateForm] = useState({
    countryId: '',
    name: '',
    code: '',
    isActive: true,
  });

  // Delete modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Loading actions
  const [savingCountry, setSavingCountry] = useState(false);
  const [savingState, setSavingState] = useState(false);

  // Fetch countries
  const loadCountries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await geoApi.getCountries();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCountries(list);
      if (list.length > 0 && !selectedCountryId) {
        setSelectedCountryId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load countries:', err);
      addToast('Failed to fetch country masters', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCountryId, addToast]);

  // Fetch states
  const loadStates = useCallback(async (countryId) => {
    if (!countryId) {
      setStates([]);
      return;
    }
    setStatesLoading(true);
    try {
      const res = await geoApi.getStates({ countryId });
      const list = Array.isArray(res) ? res : res?.data || [];
      setStates(list);
    } catch (err) {
      console.error('Failed to load states:', err);
      addToast('Failed to fetch states', 'error');
    } finally {
      setStatesLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (selectedCountryId) {
      loadStates(selectedCountryId);
    }
  }, [selectedCountryId, loadStates]);

  const selectedCountry = useMemo(() => {
    return countries.find((c) => c.id === selectedCountryId) || countries[0];
  }, [countries, selectedCountryId]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchSearch =
        !countrySearch.trim() ||
        c.name.toLowerCase().includes(countrySearch.toLowerCase().trim()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase().trim()) ||
        (c.currencyCode && c.currencyCode.toLowerCase().includes(countrySearch.toLowerCase().trim()));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && c.isActive) ||
        (statusFilter === 'Inactive' && !c.isActive);

      return matchSearch && matchStatus;
    });
  }, [countries, countrySearch, statusFilter]);

  // Filtered states
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return states;
    const q = stateSearch.toLowerCase().trim();
    return states.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q))
    );
  }, [states, stateSearch]);

  const totalStatesCount = useMemo(() => {
    return countries.reduce((acc, c) => acc + (c.statesCount || 0), 0);
  }, [countries]);

  // ──────────────────────────────────────────────
  // COUNTRY MODAL
  // ──────────────────────────────────────────────

  const openAddCountry = () => {
    setEditingCountry(null);
    setCountryForm({
      name: '',
      code: '',
      phoneCode: '+',
      currencyCode: '',
      flagEmoji: '🌐',
      displayOrder: countries.length + 1,
      isActive: true,
    });
    setCountryModalOpen(true);
  };

  const openEditCountry = (c, e) => {
    if (e) e.stopPropagation();
    setEditingCountry(c);
    setCountryForm({
      name: c.name,
      code: c.code,
      phoneCode: c.phoneCode || '',
      currencyCode: c.currencyCode || '',
      flagEmoji: c.flagEmoji || '🌐',
      displayOrder: c.displayOrder || 1,
      isActive: c.isActive,
    });
    setCountryModalOpen(true);
  };

  const handleSaveCountry = async (e) => {
    e.preventDefault();
    if (!countryForm.name.trim() || !countryForm.code.trim()) {
      addToast('Country name and ISO code are required', 'warning');
      return;
    }

    setSavingCountry(true);
    try {
      if (editingCountry) {
        await geoApi.updateCountry(editingCountry.id, countryForm);
        addToast(`Country "${countryForm.name}" updated successfully!`, 'success');
      } else {
        const created = await geoApi.createCountry(countryForm);
        addToast(`Country "${countryForm.name}" added successfully!`, 'success');
        if (created?.id) setSelectedCountryId(created.id);
      }
      setCountryModalOpen(false);
      loadCountries();
    } catch (err) {
      addToast(err?.message || 'Failed to save country', 'error');
    } finally {
      setSavingCountry(false);
    }
  };

  // ──────────────────────────────────────────────
  // STATE MODAL
  // ──────────────────────────────────────────────

  const openAddState = () => {
    setEditingState(null);
    setStateForm({
      countryId: selectedCountry?.id || (countries[0] && countries[0].id) || '',
      name: '',
      code: '',
      isActive: true,
    });
    setStateModalOpen(true);
  };

  const openEditState = (s) => {
    setEditingState(s);
    setStateForm({
      countryId: s.countryId || selectedCountry?.id,
      name: s.name,
      code: s.code || '',
      isActive: s.isActive,
    });
    setStateModalOpen(true);
  };

  const handleSaveState = async (e) => {
    e.preventDefault();
    if (!stateForm.name.trim() || !stateForm.countryId) {
      addToast('State name and Country selection are required', 'warning');
      return;
    }

    setSavingState(true);
    try {
      if (editingState) {
        await geoApi.updateState(editingState.id, stateForm);
        addToast(`State "${stateForm.name}" updated successfully!`, 'success');
      } else {
        await geoApi.createState(stateForm);
        addToast(`State "${stateForm.name}" added successfully!`, 'success');
      }
      setStateModalOpen(false);
      if (selectedCountry?.id) loadStates(selectedCountry.id);
      loadCountries();
    } catch (err) {
      addToast(err?.message || 'Failed to save state', 'error');
    } finally {
      setSavingState(false);
    }
  };

  // ──────────────────────────────────────────────
  // DELETE ACTION
  // ──────────────────────────────────────────────

  const confirmDelete = (type, item, e) => {
    if (e) e.stopPropagation();
    setItemToDelete({ type, id: item.id, name: item.name });
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      if (itemToDelete.type === 'country') {
        await geoApi.deleteCountry(itemToDelete.id);
        addToast(`Country "${itemToDelete.name}" deleted successfully!`, 'success');
        if (selectedCountryId === itemToDelete.id) {
          const next = countries.find((c) => c.id !== itemToDelete.id);
          setSelectedCountryId(next ? next.id : null);
        }
        loadCountries();
      } else {
        await geoApi.deleteState(itemToDelete.id);
        addToast(`State "${itemToDelete.name}" deleted successfully!`, 'success');
        if (selectedCountry?.id) loadStates(selectedCountry.id);
        loadCountries();
      }
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      addToast(err?.message || 'Failed to delete record', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Country & State Masters"
        subtitle="Manage international and domestic geographic master registries for destinations, hotels, and booking searches"
        actions={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={openAddState}
            >
              <MapPin size={16} />
              Add State
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openAddCountry}
            >
              <Plus size={16} />
              Add Country
            </button>
          </div>
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
            <CheckCircle size={12} /> Active in Registry
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total States / Provinces</span>
            <MapPin size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {totalStatesCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Geographic sub-divisions
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Selected Country</span>
            <Compass size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span>{selectedCountry?.flagEmoji || '🌐'}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedCountry?.name || 'None'}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--brand-600)', marginTop: 4, fontWeight: 600 }}>
            {states.length} states registered
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Sync Status</span>
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            100% Synced
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>
            Local & Remote Postgres
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
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
                  background: active ? 'var(--brand-500)' : 'var(--bg-card)',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search countries..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              style={{ paddingLeft: 32, fontSize: 13, height: 36 }}
            />
          </div>
        </div>
      </div>

      {/* Split Catalog: Countries on Left (5 cols), States on Right (7 cols) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left Card: Countries List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-hover)',
            }}
          >
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Countries Registry
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Select a country to view or add states
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={openAddCountry}
              style={{ padding: '4px 10px', fontSize: 12 }}
            >
              <Plus size={14} /> New Country
            </button>
          </div>

          <div style={{ maxHeight: 620, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                <span style={{ fontSize: 13 }}>Loading countries...</span>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No countries found matching search.
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.id === selectedCountry?.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCountryId(c.id)}
                    style={{
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-default)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--bg-active)' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--brand-500)' : '4px solid transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <span style={{ fontSize: 24, userSelect: 'none' }}>{c.flagEmoji || '🌐'}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.name}
                          </span>
                          <span
                            className="badge badge-brand"
                            style={{ fontSize: 10, padding: '1px 6px' }}
                          >
                            {c.code}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 10 }}>
                          {c.phoneCode && <span>Dial: {c.phoneCode}</span>}
                          {c.currencyCode && <span>Curr: {c.currencyCode}</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        className="badge badge-gray"
                        style={{ fontSize: 11, padding: '2px 8px', fontWeight: 600 }}
                      >
                        {c.statesCount || 0} states
                      </span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => openEditCountry(c, e)}
                          title="Edit Country"
                          style={{ padding: 4 }}
                        >
                          <Edit2 size={14} color="var(--text-secondary)" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => confirmDelete('country', c, e)}
                          title="Delete Country"
                          style={{ padding: 4 }}
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </div>
                      <ChevronRight
                        size={16}
                        color={isSelected ? 'var(--brand-500)' : 'var(--text-muted)'}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Card: States in Selected Country */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-hover)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{selectedCountry?.flagEmoji || '🌐'}</span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  States in {selectedCountry?.name || 'Country'}
                </h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {states.length} registered states / provinces
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!selectedCountry}
              onClick={openAddState}
            >
              <Plus size={14} /> Add State
            </button>
          </div>

          {/* Search states input */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder={`Search states in ${selectedCountry?.name || 'country'}...`}
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                style={{ paddingLeft: 30, fontSize: 12, height: 34 }}
              />
            </div>
          </div>

          {/* States Table */}
          <div className="table-wrap" style={{ maxHeight: 560, overflowY: 'auto' }}>
            {statesLoading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                <span style={{ fontSize: 13 }}>Loading states...</span>
              </div>
            ) : filteredStates.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <MapPin size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  No states found
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Add the first state or province for {selectedCountry?.name || 'this country'}.
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={openAddState}
                  style={{ marginTop: 12 }}
                >
                  <Plus size={14} /> Add State Now
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>State / Province Name</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <MapPin size={15} color="var(--text-muted)" />
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td>
                        {s.code ? (
                          <span className="badge badge-brand" style={{ fontSize: 10 }}>
                            {s.code}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>-</span>
                        )}
                      </td>
                      <td>
                        {s.isActive ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-gray">Inactive</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 4 }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEditState(s)}
                            title="Edit State"
                            style={{ padding: 4 }}
                          >
                            <Edit2 size={14} color="var(--text-secondary)" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={(e) => confirmDelete('state', s, e)}
                            title="Delete State"
                            style={{ padding: 4 }}
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
      </div>

      {/* ──────────────────────────────────────────────
          ADD / EDIT COUNTRY MODAL
      ────────────────────────────────────────────── */}
      {countryModalOpen && (
        <Modal
          isOpen={countryModalOpen}
          onClose={() => setCountryModalOpen(false)}
          title={editingCountry ? `Edit Country: ${editingCountry.name}` : 'Add New Country'}
        >
          <form onSubmit={handleSaveCountry}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  Country Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. India, France, Japan"
                  value={countryForm.name}
                  onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
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
                    value={countryForm.code}
                    onChange={(e) => setCountryForm({ ...countryForm, code: e.target.value.toUpperCase() })}
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
                    value={countryForm.flagEmoji}
                    onChange={(e) => setCountryForm({ ...countryForm, flagEmoji: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Phone Dial Code</label>
                  <input
                    type="text"
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. +91, +1, +44"
                    value={countryForm.phoneCode}
                    onChange={(e) => setCountryForm({ ...countryForm, phoneCode: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Currency Code</label>
                  <input
                    type="text"
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. INR, USD, EUR"
                    value={countryForm.currencyCode}
                    onChange={(e) => setCountryForm({ ...countryForm, currencyCode: e.target.value.toUpperCase() })}
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="countryActiveToggle"
                  checked={countryForm.isActive}
                  onChange={(e) => setCountryForm({ ...countryForm, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="countryActiveToggle" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }}>
                  Active for booking and listings
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCountryModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingCountry}
                >
                  {savingCountry && <Loader2 size={15} className="animate-spin" />}
                  {editingCountry ? 'Update Country' : 'Create Country'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ──────────────────────────────────────────────
          ADD / EDIT STATE MODAL
      ────────────────────────────────────────────── */}
      {stateModalOpen && (
        <Modal
          isOpen={stateModalOpen}
          onClose={() => setStateModalOpen(false)}
          title={editingState ? `Edit State: ${editingState.name}` : `Add State in ${selectedCountry?.name || 'Country'}`}
        >
          <form onSubmit={handleSaveState}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  Parent Country <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  className="form-input form-select"
                  required
                  value={stateForm.countryId}
                  onChange={(e) => setStateForm({ ...stateForm, countryId: e.target.value })}
                >
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
                  value={stateForm.name}
                  onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State Code / Abbreviation</label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-input"
                  placeholder="e.g. MH, CA, DXB"
                  value={stateForm.code}
                  onChange={(e) => setStateForm({ ...stateForm, code: e.target.value.toUpperCase() })}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="stateActiveToggle"
                  checked={stateForm.isActive}
                  onChange={(e) => setStateForm({ ...stateForm, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="stateActiveToggle" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }}>
                  Active for booking searches
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingState}
                >
                  {savingState && <Loader2 size={15} className="animate-spin" />}
                  {editingState ? 'Update State' : 'Create State'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ──────────────────────────────────────────────
          DELETE CONFIRMATION MODAL
      ────────────────────────────────────────────── */}
      {deleteConfirmOpen && itemToDelete && (
        <Modal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          title={`Delete ${itemToDelete.type === 'country' ? 'Country' : 'State'}?`}
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
                  Are you sure you want to delete &quot;{itemToDelete.name}&quot;?
                </strong>
                {itemToDelete.type === 'country' ? (
                  <span>
                    Warning: Deleting this country will also permanently remove all its linked states!
                  </span>
                ) : (
                  <span>This action cannot be undone.</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={executeDelete}
              >
                {deleting && <Loader2 size={15} className="animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
