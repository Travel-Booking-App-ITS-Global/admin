import { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Ticket,
  Calendar,
  Percent,
  IndianRupee,
  ShieldCheck,
  Globe,
  Star,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  Layers,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function CouponFormModal({
  open,
  onClose,
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    maxDiscount: 2000,
    minBookingAmount: 3000,
    category: 'ALL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 500,
    userUsageLimit: 1,
    status: 'active',
    isPublic: true,
    isFeatured: false,
    applicableUsers: 'ALL',
    termsAndConditions: [
      'Valid on bookings made directly on ITS Global Travel.',
      'Cannot be clubbed with any other promotional vouchers.',
      'Discount applies on base fare before taxes and surcharges.',
    ],
  });

  const [newTerm, setNewTerm] = useState('');
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      const startStr = initialData.startDate
        ? new Date(initialData.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      const endStr = initialData.endDate
        ? new Date(initialData.endDate).toISOString().split('T')[0]
        : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      let terms = initialData.termsAndConditions;
      if (typeof terms === 'string') {
        try {
          terms = JSON.parse(terms);
        } catch {
          terms = [terms];
        }
      }

      setFormData({
        code: initialData.code || '',
        title: initialData.title || '',
        description: initialData.description || '',
        discountType: initialData.discountType || 'PERCENTAGE',
        discountValue: Number(initialData.discountValue) || 15,
        maxDiscount: initialData.maxDiscount ? Number(initialData.maxDiscount) : '',
        minBookingAmount: initialData.minBookingAmount ? Number(initialData.minBookingAmount) : 0,
        category: initialData.category || 'ALL',
        startDate: startStr,
        endDate: endStr,
        usageLimit: initialData.usageLimit ?? '',
        userUsageLimit: initialData.userUsageLimit ?? 1,
        status: initialData.status || 'active',
        isPublic: initialData.isPublic ?? true,
        isFeatured: initialData.isFeatured ?? false,
        applicableUsers: initialData.applicableUsers || 'ALL',
        termsAndConditions: Array.isArray(terms) && terms.length > 0 ? terms : [
          'Valid on bookings made directly on ITS Global Travel.',
          'Cannot be clubbed with any other promotional vouchers.',
        ],
      });
      setErrorMsg('');
    } else {
      setFormData({
        code: '',
        title: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxDiscount: 2000,
        minBookingAmount: 3000,
        category: 'ALL',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 500,
        userUsageLimit: 1,
        status: 'active',
        isPublic: true,
        isFeatured: false,
        applicableUsers: 'ALL',
        termsAndConditions: [
          'Valid on bookings made directly on ITS Global Travel.',
          'Cannot be clubbed with any other promotional vouchers.',
          'Discount applies on base fare before taxes and surcharges.',
        ],
      });
      setErrorMsg('');
    }
  }, [initialData, open]);

  const generateRandomCode = () => {
    const prefixes = ['ITS', 'FLY', 'STAY', 'TRIP', 'SAVE', 'WANDER', 'HOLIDAY'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `${randomPrefix}${randomNum}`;
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleChange = (field, value) => {
    setErrorMsg('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, newTerm.trim()],
    }));
    setNewTerm('');
  };

  const handleRemoveTerm = (index) => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setErrorMsg('Coupon code is required.');
      return;
    }
    if (!formData.title.trim()) {
      setErrorMsg('Coupon title is required.');
      return;
    }
    if (Number(formData.discountValue) <= 0) {
      setErrorMsg('Discount value must be greater than 0.');
      return;
    }
    if (formData.discountType === 'PERCENTAGE' && Number(formData.discountValue) > 100) {
      setErrorMsg('Percentage discount cannot exceed 100%.');
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setErrorMsg('End date must be strictly after start date.');
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      maxDiscount:
        formData.discountType === 'PERCENTAGE' && formData.maxDiscount !== ''
          ? Number(formData.maxDiscount)
          : undefined,
      minBookingAmount: formData.minBookingAmount !== '' ? Number(formData.minBookingAmount) : 0,
      category: formData.category,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate + 'T23:59:59').toISOString(),
      usageLimit: formData.usageLimit !== '' ? Number(formData.usageLimit) : undefined,
      userUsageLimit: formData.userUsageLimit !== '' ? Number(formData.userUsageLimit) : 1,
      status: formData.status,
      isPublic: Boolean(formData.isPublic),
      isFeatured: Boolean(formData.isFeatured),
      applicableUsers: formData.applicableUsers,
      termsAndConditions: formData.termsAndConditions,
    };

    onSubmit(payload);
  };

  if (!open) return null;

  const categoryGradients = {
    ALL: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    FLIGHTS: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    HOTELS: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    CABS: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    PACKAGES: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    ACTIVITIES: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  };

  const previewGradient = categoryGradients[formData.category] || categoryGradients.ALL;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Coupon: ${initialData?.code}` : 'Create New Promotional Coupon'}
      size="xl"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ minWidth: 130 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="spinner" style={{ width: 14, height: 14 }} />
                Saving...
              </span>
            ) : isEdit ? (
              'Update Coupon'
            ) : (
              'Create Coupon'
            )}
          </button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 24 }}>
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Code & Title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Coupon Code *</span>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: 0,
                    fontWeight: 600,
                  }}
                >
                  <Sparkles size={12} /> Auto-Generate
                </button>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. FLYITS500"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  style={{
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                    fontSize: 14,
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="ALL">🌐 All Services (Universal)</option>
                <option value="FLIGHTS">✈️ Flights Only</option>
                <option value="HOTELS">🏨 Hotels & Resorts</option>
                <option value="CABS">🚖 Cabs & Transfers</option>
                <option value="PACKAGES">🎒 Holiday Packages</option>
                <option value="ACTIVITIES">🎡 Activities & Tours</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Coupon Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Flat ₹500 Off on Domestic Flights"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Short description or subtext explaining the offer benefits..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          {/* Discount Type & Values */}
          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: 'var(--bg-surface-secondary, rgba(255,255,255,0.03))',
              border: '1px solid var(--border-default)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                Discount Configuration
              </label>
              <div style={{ display: 'flex', gap: 6, background: 'var(--bg-surface)', padding: 3, borderRadius: 8, border: '1px solid var(--border-default)' }}>
                <button
                  type="button"
                  onClick={() => handleChange('discountType', 'PERCENTAGE')}
                  className={`btn btn-xs ${formData.discountType === 'PERCENTAGE' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: 6, padding: '4px 10px', fontSize: 12 }}
                >
                  <Percent size={13} style={{ marginRight: 4 }} /> Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('discountType', 'FLAT')}
                  className={`btn btn-xs ${formData.discountType === 'FLAT' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: 6, padding: '4px 10px', fontSize: 12 }}
                >
                  <IndianRupee size={13} style={{ marginRight: 4 }} /> Flat Amount (₹)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: formData.discountType === 'PERCENTAGE' ? '1fr 1fr' : '1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 12 }}>
                  {formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 'Flat Discount Amount (₹) *'}
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="0.1"
                  max={formData.discountType === 'PERCENTAGE' ? '100' : '100000'}
                  step="any"
                  value={formData.discountValue}
                  onChange={(e) => handleChange('discountValue', e.target.value)}
                  placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 500'}
                  required
                />
              </div>

              {formData.discountType === 'PERCENTAGE' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => handleChange('maxDiscount', e.target.value)}
                    placeholder="e.g. 2000 (No cap if empty)"
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 12 }}>
                  Min Booking Cart Value (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={formData.minBookingAmount}
                  onChange={(e) => handleChange('minBookingAmount', e.target.value)}
                  placeholder="e.g. 2500 (0 for no min)"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 12 }}>
                  Target Audience
                </label>
                <select
                  className="form-input"
                  value={formData.applicableUsers}
                  onChange={(e) => handleChange('applicableUsers', e.target.value)}
                >
                  <option value="ALL">All Travelers</option>
                  <option value="NEW_USERS_ONLY">First-Time Bookings Only</option>
                  <option value="VIP">Loyalty / VIP Members</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates & Usage Limits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Valid From (Start Date) *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Valid Until (End Date) *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Platform Usage Limit</label>
              <input
                type="number"
                className="form-input"
                min="1"
                placeholder="e.g. 1000 (Empty = Unlimited)"
                value={formData.usageLimit}
                onChange={(e) => handleChange('usageLimit', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Uses Per Customer</label>
              <input
                type="number"
                className="form-input"
                min="1"
                placeholder="Default: 1"
                value={formData.userUsageLimit}
                onChange={(e) => handleChange('userUsageLimit', e.target.value)}
              />
            </div>
          </div>

          {/* Status & Flags */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-default)',
              flexWrap: 'wrap',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={formData.status === 'active'}
                onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
              />
              <span style={{ fontWeight: 600 }}>Active Status</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => handleChange('isPublic', e.target.checked)}
              />
              <span>Public Offers Page</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
              />
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>★ Featured Badge</span>
            </label>
          </div>

          {/* Terms & Conditions */}
          <div className="form-group">
            <label className="form-label">Terms & Conditions</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add rule e.g. Valid only on weekend travel..."
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTerm();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddTerm}>
                <Plus size={14} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {formData.termsAndConditions.map((term, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    fontSize: 12,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    {term}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Right Column: Live Interactive Coupon Card Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Customer Preview
            </span>
            <span className={`badge badge-${formData.status === 'active' ? 'success' : 'gray'}`}>
              {formData.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Ticket Card */}
          <div
            style={{
              background: previewGradient,
              borderRadius: 16,
              padding: 20,
              color: '#ffffff',
              boxShadow: '0 12px 30px -8px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background watermark badge */}
            <Ticket
              size={120}
              style={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                opacity: 0.12,
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
              }}
            />

            {/* Header tags */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(8px)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {formData.category}
                </span>
                {formData.isFeatured && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.9)',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    ★ FEATURED
                  </span>
                )}
              </div>
              <span style={{ fontSize: 11, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> Till {new Date(formData.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Discount Headline */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>
                {formData.discountType === 'PERCENTAGE' ? (
                  <>
                    {formData.discountValue}% OFF
                    {formData.maxDiscount ? (
                      <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.9, marginLeft: 6 }}>
                        (Up to ₹{Number(formData.maxDiscount).toLocaleString('en-IN')})
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>FLAT ₹{Number(formData.discountValue || 0).toLocaleString('en-IN')} OFF</>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.95, marginTop: 4 }}>
                {formData.title || 'Enter a coupon title...'}
              </div>
            </div>

            {formData.description && (
              <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 14, lineHeight: 1.4 }}>
                {formData.description}
              </div>
            )}

            {/* Perforated Divider */}
            <div
              style={{
                borderTop: '2px dashed rgba(255,255,255,0.3)',
                margin: '14px 0',
                position: 'relative',
              }}
            />

            {/* Promo Code Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(6px)',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.75, letterSpacing: '0.5px' }}>
                  PROMO CODE
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '1.5px', fontFamily: 'monospace' }}>
                  {formData.code || 'COUPONCODE'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(formData.code);
                  setCopiedPreview(true);
                  setTimeout(() => setCopiedPreview(false), 2000);
                }}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                {copiedPreview ? <Check size={12} color="#16a34a" /> : <Ticket size={12} />}
                {copiedPreview ? 'COPIED' : 'COPY'}
              </button>
            </div>

            {/* Footer criteria */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.8, marginTop: 10 }}>
              <span>
                {Number(formData.minBookingAmount) > 0
                  ? `Min booking: ₹${Number(formData.minBookingAmount).toLocaleString('en-IN')}`
                  : 'No minimum booking required'}
              </span>
              <span>
                {formData.usageLimit ? `Limit: ${formData.usageLimit} uses` : 'Unlimited uses'}
              </span>
            </div>
          </div>

          {/* Rules / Conditions Summary */}
          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} style={{ color: 'var(--brand-primary)' }} /> Applicable Rules & Terms
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>
                <strong>Category:</strong> {formData.category === 'ALL' ? 'All Travel Services' : formData.category}
              </li>
              <li>
                <strong>Audience:</strong>{' '}
                {formData.applicableUsers === 'NEW_USERS_ONLY'
                  ? 'First-Time Users Only'
                  : formData.applicableUsers === 'VIP'
                  ? 'VIP Club Members'
                  : 'All Registered Customers'}
              </li>
              <li>
                <strong>User Frequency:</strong> Max {formData.userUsageLimit || 1} time(s) per account
              </li>
              {formData.termsAndConditions.slice(0, 3).map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
