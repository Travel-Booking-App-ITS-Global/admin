import { useState, useEffect, useCallback } from 'react';
import {
  Ticket,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  Eye,
  Percent,
  IndianRupee,
  Copy,
  Check,
  Calculator,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  List,
  AlertCircle,
  HelpCircle,
  Tag,
  ArrowRight,
  Filter,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { PageHeader, Pagination, KpiCard, ConfirmDeleteModal } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../store/AppContext.jsx';
import { couponsApi } from '../../services/api.js';
import CouponFormModal from './CouponFormModal.jsx';

const CATEGORY_OPTIONS = ['All', 'FLIGHTS', 'HOTELS', 'CABS', 'PACKAGES', 'ACTIVITIES'];
const STATUS_TABS = ['All', 'active', 'inactive', 'expired'];
const DISCOUNT_TYPES = ['All', 'PERCENTAGE', 'FLAT'];

export default function CouponsListPage() {
  const { addToast } = useApp();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalRedemptions: 0,
    totalDiscountGranted: 0,
    totalOrderVolume: 0,
  });

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDiscountType, setSelectedDiscountType] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Live Tester Simulator Modal
  const [testerOpen, setTesterOpen] = useState(false);
  const [testerData, setTesterData] = useState({
    code: '',
    orderAmount: 5000,
    category: 'FLIGHTS',
  });
  const [testerResult, setTesterResult] = useState(null);
  const [testing, setTesting] = useState(false);

  // Copy Feedback state
  const [copiedCode, setCopiedCode] = useState(null);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await couponsApi.getAll({
        page,
        limit,
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        discountType: selectedDiscountType,
      });

      if (res) {
        setCoupons(res.items || []);
        if (res.pagination) {
          setTotal(res.pagination.total || 0);
          setTotalPages(res.pagination.totalPages || 1);
        }
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.warn('Failed to load coupons:', err);
      addToast('Failed to fetch coupons from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedCategory, selectedStatus, selectedDiscountType, addToast]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, selectedDiscountType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCoupons();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadCoupons]);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code '${code}' copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
      await couponsApi.updateStatus(coupon.id, newStatus);
      addToast(`Coupon '${coupon.code}' is now ${newStatus}`, 'success');
      loadCoupons();
    } catch (err) {
      addToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingCoupon?.id) {
        await couponsApi.update(editingCoupon.id, payload);
        addToast(`Coupon '${payload.code}' updated successfully!`, 'success');
      } else {
        await couponsApi.create(payload);
        addToast(`Coupon '${payload.code}' created successfully!`, 'success');
      }
      setFormModalOpen(false);
      setEditingCoupon(null);
      loadCoupons();
    } catch (err) {
      addToast(err.message || 'Failed to save coupon', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    setDeleting(true);
    try {
      await couponsApi.delete(couponToDelete.id);
      addToast(`Coupon '${couponToDelete.code}' deleted successfully`, 'success');
      setDeleteModalOpen(false);
      setCouponToDelete(null);
      loadCoupons();
    } catch (err) {
      addToast(err.message || 'Failed to delete coupon', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetails = async (coupon) => {
    setSelectedCouponDetails(coupon);
    setDetailsModalOpen(true);
    setLoadingDetails(true);
    try {
      const full = await couponsApi.getById(coupon.id);
      if (full) {
        setSelectedCouponDetails(full);
      }
    } catch (err) {
      console.warn('Failed to load full coupon details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const res = await couponsApi.seed();
      addToast(res.message || 'Default starter coupons seeded successfully!', 'success');
      loadCoupons();
    } catch (err) {
      addToast(err.message || 'Failed to seed coupons', 'error');
    }
  };

  const runTesterValidation = async () => {
    if (!testerData.code.trim()) {
      addToast('Please enter a coupon code to test', 'warning');
      return;
    }
    setTesting(true);
    setTesterResult(null);
    try {
      const result = await couponsApi.testValidate({
        code: testerData.code.trim().toUpperCase(),
        orderAmount: Number(testerData.orderAmount) || 0,
        category: testerData.category,
      });
      setTesterResult(result);
    } catch (err) {
      setTesterResult({
        isValid: false,
        message: err.message || 'Validation request failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const openTesterForCoupon = (coupon) => {
    setTesterData({
      code: coupon.code,
      orderAmount: Number(coupon.minBookingAmount) > 0 ? Number(coupon.minBookingAmount) + 1000 : 5000,
      category: coupon.category === 'ALL' ? 'FLIGHTS' : coupon.category,
    });
    setTesterResult(null);
    setTesterOpen(true);
  };

  return (
    <div className="page-wrapper animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Promotions & Coupon Codes"
        subtitle="Create, configure and manage promotional discounts, vouchers, and savings rules across all travel services."
        actions={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setTesterData({ code: coupons[0]?.code || 'FLYITS500', orderAmount: 5000, category: 'FLIGHTS' });
                setTesterResult(null);
                setTesterOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Calculator size={14} style={{ color: 'var(--brand-primary)' }} />
              Test Simulator
            </button>

            {coupons.length === 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleSeedDefaults}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Sparkles size={14} style={{ color: '#f59e0b' }} />
                Seed Starter Promos
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingCoupon(null);
                setFormModalOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={15} />
              Create Coupon
            </button>
          </div>
        }
      />

      {/* Top KPI Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          label="Total Coupons"
          value={stats.totalCoupons ?? coupons.length}
          icon={Ticket}
          iconBg="#6366f1"
        />
        <KpiCard
          label="Active Promos"
          value={stats.activeCoupons ?? 0}
          icon={CheckCircle}
          iconBg="#10b981"
        />
        <KpiCard
          label="Total Redemptions"
          value={stats.totalRedemptions ?? 0}
          icon={TrendingUp}
          iconBg="#0ea5e9"
        />
        <KpiCard
          label="Total Savings Granted"
          value={`₹${(stats.totalDiscountGranted ?? 0).toLocaleString('en-IN')}`}
          icon={IndianRupee}
          iconBg="#f59e0b"
        />
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedStatus(tab)}
                className={`btn btn-sm ${selectedStatus === tab ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  borderRadius: 20,
                  padding: '5px 14px',
                  fontSize: 12,
                  fontWeight: selectedStatus === tab ? 700 : 500,
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'All' ? 'All Status' : tab}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-surface-secondary)',
              padding: 3,
              borderRadius: 8,
              border: '1px solid var(--border-default)',
            }}
          >
            <button
              type="button"
              className={`btn btn-xs ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('table')}
              style={{ borderRadius: 6 }}
              title="Table View"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              className={`btn btn-xs ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('grid')}
              style={{ borderRadius: 6 }}
              title="Grid Card View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by coupon code, title, or terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, fontSize: 13 }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: 13 }}
          >
            <option value="All">All Categories</option>
            <option value="FLIGHTS">✈️ Flights</option>
            <option value="HOTELS">🏨 Hotels</option>
            <option value="CABS">🚖 Cabs</option>
            <option value="PACKAGES">🎒 Packages</option>
            <option value="ACTIVITIES">🎡 Activities</option>
          </select>

          {/* Discount Type Filter */}
          <select
            className="form-input"
            value={selectedDiscountType}
            onChange={(e) => setSelectedDiscountType(e.target.value)}
            style={{ fontSize: 13 }}
          >
            <option value="All">All Discount Types</option>
            <option value="PERCENTAGE">% Percentage</option>
            <option value="FLAT">₹ Flat Amount</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div
          className="card"
          style={{
            padding: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <div className="spinner" style={{ width: 32, height: 32 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading coupons & discount vouchers...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div
          className="card"
          style={{
            padding: 50,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1',
            }}
          >
            <Ticket size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px 0' }}>No Coupons Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 400, margin: 0 }}>
              {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'No promotional coupons match your selected filters. Try resetting your search or filter parameters.'
                : 'No promotional discount coupons have been created yet. Seed default starter promos or create your first coupon!'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSelectedDiscountType('All');
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleSeedDefaults}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Sparkles size={14} style={{ color: '#f59e0b' }} />
                Seed 5 Starter Promos
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingCoupon(null);
                setFormModalOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> Create Coupon
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>COUPON CODE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>TITLE & CATEGORY</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>DISCOUNT VALUE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>MIN ORDER</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>VALIDITY</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>REDEMPTIONS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const isExpired = coupon.isExpired || new Date(coupon.endDate) < new Date();
                  const effectiveStatus = isExpired ? 'expired' : coupon.status;
                  const discountVal = Number(coupon.discountValue);
                  const maxDisc = coupon.maxDiscount ? Number(coupon.maxDiscount) : null;
                  const minBooking = Number(coupon.minBookingAmount);

                  return (
                    <tr
                      key={coupon.id}
                      style={{
                        borderBottom: '1px solid var(--border-default)',
                        transition: 'background 0.15s ease',
                      }}
                      className="table-row-hover"
                    >
                      {/* Code + Copy */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: 14,
                              letterSpacing: '1px',
                              padding: '4px 8px',
                              borderRadius: 6,
                              background: 'var(--bg-surface-secondary)',
                              border: '1px solid var(--border-default)',
                              color: 'var(--brand-primary)',
                            }}
                          >
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon btn-xs"
                            onClick={() => handleCopy(coupon.code)}
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check size={13} style={{ color: '#16a34a' }} />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                        {coupon.isFeatured && (
                          <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, display: 'block', marginTop: 3 }}>
                            ★ Featured Offer
                          </span>
                        )}
                      </td>

                      {/* Title & Category */}
                      <td style={{ padding: '14px 16px', maxWidth: 260 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>
                          {coupon.title}
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span className="badge badge-gray" style={{ fontSize: 11, padding: '2px 7px' }}>
                            {coupon.category === 'ALL' ? '🌐 Universal' : coupon.category}
                          </span>
                          {coupon.applicableUsers === 'NEW_USERS_ONLY' && (
                            <span className="badge badge-accent" style={{ fontSize: 10, padding: '2px 6px' }}>
                              1st Booking
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}>
                          {coupon.discountType === 'PERCENTAGE' ? (
                            <>
                              {discountVal}% OFF
                              {maxDisc && (
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>
                                  Max ₹{maxDisc.toLocaleString('en-IN')}
                                </span>
                              )}
                            </>
                          ) : (
                            <>₹{discountVal.toLocaleString('en-IN')} FLAT</>
                          )}
                        </div>
                      </td>

                      {/* Min Order */}
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {minBooking > 0 ? `₹${minBooking.toLocaleString('en-IN')}` : 'No Min'}
                      </td>

                      {/* Validity */}
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                        <div>{new Date(coupon.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                        <div style={{ color: isExpired ? '#ef4444' : 'var(--text-muted)', fontSize: 11 }}>
                          to {new Date(coupon.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>

                      {/* Redemptions Progress */}
                      <td style={{ padding: '14px 16px', minWidth: 120 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{coupon.usedCount || 0} used</span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '∞'}
                          </span>
                        </div>
                        {coupon.usageLimit && (
                          <div
                            style={{
                              width: '100%',
                              height: 4,
                              borderRadius: 2,
                              background: 'var(--bg-surface-secondary)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100))}%`,
                                height: '100%',
                                background: 'var(--brand-primary)',
                                borderRadius: 2,
                              }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {isExpired ? (
                          <span className="badge badge-danger">Expired</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(coupon)}
                            className={`badge badge-${coupon.status === 'active' ? 'success' : 'gray'}`}
                            style={{
                              cursor: 'pointer',
                              border: 'none',
                              outline: 'none',
                              padding: '4px 10px',
                              borderRadius: 12,
                            }}
                            title="Click to toggle Active / Inactive"
                          >
                            {coupon.status === 'active' ? '● Active' : '○ Inactive'}
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon btn-xs"
                            onClick={() => openTesterForCoupon(coupon)}
                            title="Test this coupon in simulator"
                          >
                            <Calculator size={14} style={{ color: 'var(--brand-primary)' }} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon btn-xs"
                            onClick={() => handleViewDetails(coupon)}
                            title="View usage details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon btn-xs"
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setFormModalOpen(true);
                            }}
                            title="Edit coupon"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon btn-xs"
                            onClick={() => {
                              setCouponToDelete(coupon);
                              setDeleteModalOpen(true);
                            }}
                            style={{ color: '#ef4444' }}
                            title="Delete coupon"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {coupons.map((coupon) => {
            const isExpired = coupon.isExpired || new Date(coupon.endDate) < new Date();
            const discountVal = Number(coupon.discountValue);
            const maxDisc = coupon.maxDiscount ? Number(coupon.maxDiscount) : null;
            const minBooking = Number(coupon.minBookingAmount);

            return (
              <div
                key={coupon.id}
                className="card"
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${
                    coupon.category === 'FLIGHTS'
                      ? '#0ea5e9'
                      : coupon.category === 'HOTELS'
                      ? '#f59e0b'
                      : coupon.category === 'CABS'
                      ? '#10b981'
                      : coupon.category === 'PACKAGES'
                      ? '#ec4899'
                      : '#6366f1'
                  }`,
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span className="badge badge-gray" style={{ fontSize: 11, textTransform: 'uppercase' }}>
                      {coupon.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {coupon.isFeatured && (
                        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>★ Featured</span>
                      )}
                      <span className={`badge badge-${isExpired ? 'danger' : coupon.status === 'active' ? 'success' : 'gray'}`}>
                        {isExpired ? 'Expired' : coupon.status}
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {coupon.discountType === 'PERCENTAGE' ? (
                      <>
                        {discountVal}% OFF
                        {maxDisc && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 6 }}>(Max ₹{maxDisc.toLocaleString('en-IN')})</span>}
                      </>
                    ) : (
                      <>₹{discountVal.toLocaleString('en-IN')} FLAT</>
                    )}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                    {coupon.title}
                  </div>

                  {coupon.description && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.4 }}>
                      {coupon.description}
                    </div>
                  )}

                  {/* Code Tag */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface-secondary)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px dashed var(--border-default)',
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, letterSpacing: '1px' }}>
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleCopy(coupon.code)}
                      style={{ padding: '4px 10px', fontSize: 11 }}
                    >
                      {copiedCode === coupon.code ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Criteria info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Min Booking:</span>
                      <strong>{minBooking > 0 ? `₹${minBooking.toLocaleString('en-IN')}` : 'None'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Valid Till:</span>
                      <strong>{new Date(coupon.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Redemptions:</span>
                      <strong>
                        {coupon.usedCount || 0} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'uses'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: '1px solid var(--border-default)',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => openTesterForCoupon(coupon)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Calculator size={12} /> Test
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon btn-xs"
                      onClick={() => handleViewDetails(coupon)}
                      title="View details"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon btn-xs"
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setFormModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon btn-xs"
                      onClick={() => {
                        setCouponToDelete(coupon);
                        setDeleteModalOpen(true);
                      }}
                      style={{ color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && coupons.length > 0 && (
        <Pagination
          page={page}
          total={total}
          perPage={limit}
          onChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Create / Edit Form Modal */}
      <CouponFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingCoupon(null);
        }}
        initialData={editingCoupon}
        onSubmit={handleFormSubmit}
        loading={submitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCouponToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Promotional Coupon"
        message={`Are you sure you want to delete coupon code "${couponToDelete?.code}"? This will deactivate the code from any further user checkouts.`}
        loading={deleting}
      />

      {/* Live Coupon Tester / Simulator Modal */}
      <Modal
        open={testerOpen}
        onClose={() => {
          setTesterOpen(false);
          setTesterResult(null);
        }}
        title="Interactive Coupon Discount Tester"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setTesterOpen(false);
                setTesterResult(null);
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={runTesterValidation}
              disabled={testing}
              style={{ minWidth: 140 }}
            >
              {testing ? 'Calculating...' : 'Run Simulation'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            Simulate a traveler checkout cart with any coupon code, order amount, and category to test real-time validation and savings calculation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Coupon Code to Test</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. FLYITS500"
                value={testerData.code}
                onChange={(e) => setTesterData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Simulated Booking Category</label>
              <select
                className="form-input"
                value={testerData.category}
                onChange={(e) => setTesterData((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="FLIGHTS">✈️ Flights</option>
                <option value="HOTELS">🏨 Hotels</option>
                <option value="CABS">🚖 Cabs</option>
                <option value="PACKAGES">🎒 Packages</option>
                <option value="ACTIVITIES">🎡 Activities</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Simulated Cart Subtotal Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              step="100"
              value={testerData.orderAmount}
              onChange={(e) => setTesterData((prev) => ({ ...prev, orderAmount: e.target.value }))}
            />
          </div>

          {/* Tester Simulation Results */}
          {testerResult && (
            <div
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                background: testerResult.isValid
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${
                  testerResult.isValid ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'
                }`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {testerResult.isValid ? (
                  <CheckCircle size={18} style={{ color: '#10b981' }} />
                ) : (
                  <AlertCircle size={18} style={{ color: '#ef4444' }} />
                )}
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: testerResult.isValid ? '#10b981' : '#ef4444',
                  }}
                >
                  {testerResult.isValid ? 'Valid & Applied Successfully' : 'Coupon Rejected'}
                </span>
              </div>

              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 12 }}>
                {testerResult.message}
              </div>

              {testerResult.isValid && testerResult.calculation && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                    padding: '12px',
                    borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cart Subtotal</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      ₹{testerResult.calculation.orderAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#10b981' }}>You Save</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>
                      -₹{testerResult.calculation.discountAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--brand-primary)' }}>Final Payable</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--brand-primary)' }}>
                      ₹{testerResult.calculation.finalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Coupon Details & Usages Drawer/Modal */}
      <Modal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedCouponDetails(null);
        }}
        title={`Coupon Details: ${selectedCouponDetails?.code || ''}`}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setDetailsModalOpen(false);
                setSelectedCouponDetails(null);
              }}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedCouponDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Overview Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                padding: 16,
                borderRadius: 10,
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Discount Type</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#10b981' }}>
                  {selectedCouponDetails.discountType === 'PERCENTAGE'
                    ? `${Number(selectedCouponDetails.discountValue)}% OFF`
                    : `₹${Number(selectedCouponDetails.discountValue).toLocaleString('en-IN')} FLAT`}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Applicable Category</span>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {selectedCouponDetails.category}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Min Order Value</span>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  ₹{Number(selectedCouponDetails.minBookingAmount || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Redemptions</span>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {selectedCouponDetails.usedCount || selectedCouponDetails.totalRedemptions || 0}{' '}
                  {selectedCouponDetails.usageLimit ? `/ ${selectedCouponDetails.usageLimit}` : 'uses'}
                </div>
              </div>
            </div>

            {/* Terms List */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Terms & Conditions
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(Array.isArray(selectedCouponDetails.termsAndConditions)
                  ? selectedCouponDetails.termsAndConditions
                  : ['Valid on selected travel itineraries only.']
                ).map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Recent Redemptions Table */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Recent Redemptions Log ({selectedCouponDetails.usages?.length || 0})
              </h4>
              {loadingDetails ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading usage records...
                </div>
              ) : selectedCouponDetails.usages && selectedCouponDetails.usages.length > 0 ? (
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 8 }}>
                  <table className="table" style={{ width: '100%', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-surface-secondary)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Booking Ref</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Order Value</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Discount</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCouponDetails.usages.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                          <td style={{ padding: '8px 12px' }}>
                            {u.customer ? `${u.customer.firstName || ''} ${u.customer.lastName || ''} (${u.customer.email})` : 'Guest'}
                          </td>
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>
                            {u.booking?.bookingReference || `#BK-${u.bookingId}`}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            ₹{Number(u.orderAmount).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>
                            -₹{Number(u.discountAmount).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>
                            {new Date(u.usedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  style={{
                    padding: 24,
                    textAlign: 'center',
                    background: 'var(--bg-surface-secondary)',
                    borderRadius: 8,
                    color: 'var(--text-muted)',
                    fontSize: 13,
                  }}
                >
                  No customer has redeemed this coupon code yet.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
