import { useState, useEffect } from "react";
import {
  Globe,
  Building2,
  Mail,
  Phone,
  Clock,
  Coins,
  Percent,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Save,
} from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";
import { settingsApi } from "../../services/api.js";

const Section = ({ title, subtitle, children }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <div
      style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 15,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </div>
    <div style={{ padding: "18px 22px" }}>{children}</div>
  </div>
);

export default function GeneralSettingsTab() {
  const { addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [commission, setCommission] = useState("8.5");
  const [cancellationHours, setCancellationHours] = useState("24");
  const [taxRate, setTaxRate] = useState("18");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getSystemSettings();
      if (res?.map) {
        const m = res.map;
        if (m.company_name) setCompanyName(m.company_name);
        if (m.support_email) setSupportEmail(m.support_email);
        if (m.support_phone) setSupportPhone(m.support_phone);
        if (m.currency) setCurrency(m.currency);
        if (m.timezone) setTimezone(m.timezone);
        if (m.commission_percentage) setCommission(m.commission_percentage);
        if (m.cancellation_hours) setCancellationHours(m.cancellation_hours);
        if (m.tax_percentage) setTaxRate(m.tax_percentage);
        if (m.maintenance_mode) setMaintenanceMode(m.maintenance_mode === "true");
      }
    } catch (err) {
      console.warn("Failed to load platform settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.bulkUpdateSystemSettings([
        { key: "company_name", value: companyName.trim(), group: "general" },
        { key: "support_email", value: supportEmail.trim(), group: "general" },
        { key: "support_phone", value: supportPhone.trim(), group: "general" },
        { key: "currency", value: currency, group: "localization" },
        { key: "timezone", value: timezone, group: "localization" },
        { key: "commission_percentage", value: String(commission), group: "booking" },
        { key: "cancellation_hours", value: String(cancellationHours), group: "booking" },
        { key: "tax_percentage", value: String(taxRate), group: "booking" },
        { key: "maintenance_mode", value: maintenanceMode ? "true" : "false", group: "general" },
      ]);
      addToast("Platform configurations securely saved in database!", "success");
    } catch (err) {
      addToast(err.message || "Failed to save configurations", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Loader2 size={32} className="spin" style={{ color: "var(--brand-500)" }} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveAll}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 16,
        }}
      >
        {/* Brand & Organization */}
        <Section
          title="🏢 Brand & Customer Support"
          subtitle="Platform branding and public customer support points"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Platform Title / Brand *</label>
              <div style={{ position: "relative" }}>
                <Building2
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. ITS Global Travel"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Support Email Address *</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@domain.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">24/7 Helpline Contact *</label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="+91 1800..."
                  required
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Currency & Localization */}
        <Section
          title="🌐 Currency & Operations Timezone"
          subtitle="Regional formats for transactions and schedule timestamps"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Base Currency</label>
              <div style={{ position: "relative" }}>
                <Coins
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <select
                  className="form-input form-select"
                  style={{ paddingLeft: 38 }}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="AED">AED (د.إ) - UAE Dirham</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">System Timezone</label>
              <div style={{ position: "relative" }}>
                <Clock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <select
                  className="form-input form-select"
                  style={{ paddingLeft: 38 }}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York (EST)">America/New_York (EST, UTC-5)</option>
                  <option value="Asia/Dubai (GST)">Asia/Dubai (GST, UTC+4)</option>
                  <option value="Europe/London (BST)">Europe/London (BST, UTC+1)</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        {/* Business & Booking Economics */}
        <Section
          title="💼 Financial Rules & Booking Windows"
          subtitle="Taxation rates, commission brackets, and cancellation timelines"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Vendor Commission Rate (%)</label>
              <div style={{ position: "relative" }}>
                <Percent
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Free Cancellation Window (Hours)</label>
              <div style={{ position: "relative" }}>
                <Clock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={cancellationHours}
                  onChange={(e) => setCancellationHours(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Standard GST / Service Tax (%)</label>
              <div style={{ position: "relative" }}>
                <Percent
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Maintenance & Emergency Controls */}
        <Section
          title="🛡️ System Health & Maintenance"
          subtitle="Emergency controls and maintenance banners"
        >
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              background: maintenanceMode
                ? "rgba(239, 68, 68, 0.08)"
                : "rgba(34, 197, 94, 0.08)",
              border: `1px solid ${
                maintenanceMode
                  ? "rgba(239, 68, 68, 0.25)"
                  : "rgba(34, 197, 94, 0.25)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: maintenanceMode ? "#ef4444" : "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {maintenanceMode ? (
                  <AlertTriangle size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {maintenanceMode
                  ? "Maintenance Mode Active"
                  : "Platform Systems Operational"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                {maintenanceMode
                  ? "Non-admin booking operations are paused with a maintenance notice."
                  : "All public search engines, booking APIs, and payment webhooks are live."}
              </div>
            </div>

            <button
              type="button"
              className={maintenanceMode ? "btn btn-danger btn-sm" : "btn btn-secondary btn-sm"}
              onClick={() => setMaintenanceMode(!maintenanceMode)}
            >
              {maintenanceMode ? "Turn Off" : "Enable Maintenance"}
            </button>
          </div>
        </Section>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 20,
          marginBottom: 30,
        }}
      >
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: "12px 28px", fontSize: 14 }}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="spin" style={{ marginRight: 8 }} />
              Saving Configurations...
            </>
          ) : (
            <>
              <Save size={16} style={{ marginRight: 8 }} />
              Save Platform Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
