import { useState } from "react";
import { BarChart2, TrendingUp, Users, DollarSign } from "lucide-react";
import { PageHeader, StatusBadge } from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import {
  mockItineraries,
  mockNotifTemplates,
  mockFAQs,
} from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";
import SettingsComponent from "./settings/Settings.jsx";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const analyticsData = [
  { month: "Jan", users: 320, revenue: 480000 },
  { month: "Feb", users: 280, revenue: 390000 },
  { month: "Mar", users: 420, revenue: 610000 },
  { month: "Apr", users: 390, revenue: 570000 },
  { month: "May", users: 510, revenue: 730000 },
  { month: "Jun", users: 620, revenue: 890000 },
  { month: "Jul", users: 740, revenue: 1020000 },
];

/* =================== ANALYTICS =================== */
export function Analytics() {
  return (
    <div>
      <PageHeader
        title="Analytics & Reports"
        subtitle="Business intelligence and growth metrics"
      />
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          {
            label: "Monthly Revenue",
            val: "₹10.2L",
            change: "+14%",
            icon: DollarSign,
            color: "#2563eb",
          },
          {
            label: "New Users",
            val: "740",
            change: "+19%",
            icon: Users,
            color: "#7c3aed",
          },
          {
            label: "Booking Rate",
            val: "68.4%",
            change: "+3%",
            icon: BarChart2,
            color: "#16a34a",
          },
          {
            label: "Avg Order Val.",
            val: "₹4,820",
            change: "+7%",
            icon: TrendingUp,
            color: "#d97706",
          },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="kpi-label">{s.label}</div>
                <div className="kpi-value" style={{ marginTop: 8 }}>
                  {s.val}
                </div>
              </div>
              <div className="kpi-icon-wrap" style={{ background: s.color }}>
                <s.icon size={20} color="#fff" />
              </div>
            </div>
            <div className="kpi-change positive">
              ↑ {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue Trend</span>
          </div>
          <div style={{ padding: "16px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-default)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}K`}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="url(#gr)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">User Growth</span>
          </div>
          <div style={{ padding: "16px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-default)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-card)",
                  }}
                />
                <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== ITINERARIES =================== */
export function Itineraries() {
  return (
    <div>
      <PageHeader
        title="AI Itinerary Monitor"
        subtitle="User-generated and AI-created travel itineraries"
      />
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Itineraries</span>
        </div>
        <div className="table-wrap" style={{ padding: "0 0 8px" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Title</th>
                <th>Days</th>
                <th>Destinations</th>
                <th>Created</th>
                <th>AI Generated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockItineraries.map((it) => (
                <tr key={it.id}>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: "var(--brand-600)",
                      fontWeight: 600,
                    }}
                  >
                    {it.id}
                  </td>
                  <td style={{ fontWeight: 500 }}>{it.user}</td>
                  <td style={{ fontWeight: 600 }}>{it.title}</td>
                  <td style={{ fontWeight: 600 }}>{it.days}</td>
                  <td>{it.destinations} cities</td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {it.created}
                  </td>
                  <td>
                    {it.aiGenerated ? (
                      <span
                        style={{
                          fontSize: 11,
                          background: "rgba(139,92,246,.1)",
                          color: "var(--accent-600)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          fontWeight: 600,
                        }}
                      >
                        ✦ AI
                      </span>
                    ) : (
                      <span
                        style={{ fontSize: 11, color: "var(--text-muted)" }}
                      >
                        Manual
                      </span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={it.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =================== AI CHAT =================== */
export function AIChat() {
  const chatStats = [
    { label: "Total Sessions", val: "8,241", color: "#3b82f6" },
    { label: "Avg Messages", val: "14.2", color: "#8b5cf6" },
    { label: "Resolved by AI", val: "76%", color: "#22c55e" },
    { label: "Escalated", val: "24%", color: "#f59e0b" },
  ];
  return (
    <div>
      <PageHeader
        title="AI Chat Monitor"
        subtitle="Conversation analytics and prompt management"
      />
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {chatStats.map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 18px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                color: "var(--text-muted)",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                fontFamily: "var(--font-heading)",
                color: s.color,
                marginTop: 6,
              }}
            >
              {s.val}
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Prompt Templates</span>
        </div>
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[
            "Welcome greeting",
            "Flight search assistant",
            "Hotel recommendation",
            "Itinerary builder",
            "Payment help",
          ].map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500 }}>✦ {p}</span>
              <span className="badge badge-success">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================== CMS =================== */
export function CMS() {
  const { addToast } = useApp();
  const [tab, setTab] = useState("faqs");
  const [faqs, setFaqs] = useState(mockFAQs);
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "General",
  });

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) {
      addToast("Please enter both question and answer", "error");
      return;
    }
    const added = {
      id: `faq-${Date.now()}`,
      question: newFaq.question,
      answer: newFaq.answer,
      category: newFaq.category,
      views: 0,
      status: "active",
    };
    setFaqs((prev) => [added, ...prev]);
    addToast("FAQ added successfully!", "success");
    setAddFaqOpen(false);
    setNewFaq({ question: "", answer: "", category: "General" });
  };

  const deleteFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    addToast("FAQ deleted", "error");
  };

  return (
    <div>
      <PageHeader
        title="Content Management"
        subtitle="FAQs, policies, and static pages"
      />
      <div className="tabs">
        {["faqs", "policies"].map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "faqs" ? "❓ FAQs" : "📄 Policies"}
          </button>
        ))}
      </div>
      {tab === "faqs" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">FAQ Management</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setAddFaqOpen(true)}
            >
              + Add FAQ
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 500, maxWidth: 400 }}>
                      {f.question}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          background: "var(--bg-hover)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {f.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {f.views.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={f.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12 }}
                          onClick={() => addToast("FAQ updated", "success")}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12, color: "var(--danger-500)" }}
                          onClick={() => deleteFaq(f.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "policies" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "Privacy Policy",
            "Terms & Conditions",
            "Cancellation Policy",
            "Refund Policy",
            "Cookie Policy",
          ].map((p) => (
            <div
              key={p}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyDrop: "space-between",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>📄 {p}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="badge badge-success">Published</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => addToast(`Editing ${p}…`, "info")}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add FAQ Modal */}
      <Modal
        open={addFaqOpen}
        onClose={() => setAddFaqOpen(false)}
        title="Create FAQ"
      >
        <form
          onSubmit={handleAddFaq}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Question *</label>
            <input
              className="form-input"
              placeholder="e.g. What is the cancellation policy?"
              value={newFaq.question}
              onChange={(e) =>
                setNewFaq({ ...newFaq, question: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Answer *</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Answer details..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input form-select"
              value={newFaq.category}
              onChange={(e) =>
                setNewFaq({ ...newFaq, category: e.target.value })
              }
            >
              <option>General</option>
              <option>Bookings</option>
              <option>Payments</option>
              <option>Refunds</option>
              <option>Cabs</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddFaqOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add FAQ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* =================== NOTIFICATIONS =================== */
export function Notifications() {
  const { addToast } = useApp();
  const [templates, setTemplates] = useState(mockNotifTemplates);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", channel: "Email", trigger: "" });

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!form.name || !form.trigger) {
      addToast("Please fill all required fields", "error");
      return;
    }
    const added = {
      id: `tmpl-${Date.now()}`,
      name: form.name,
      channel: form.channel,
      trigger: form.trigger,
      status: "active",
    };
    setTemplates((prev) => [added, ...prev]);
    addToast("Notification template added!", "success");
    setAddOpen(false);
    setForm({ name: "", channel: "Email", trigger: "" });
  };

  return (
    <div>
      <PageHeader
        title="Notification Management"
        subtitle="Templates and delivery logs"
        actions={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setAddOpen(true)}
          >
            + New Template
          </button>
        }
      />
      <div className="card">
        <div className="card-header">
          <span className="card-title">Notification Templates</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Channel</th>
                <th>Trigger</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((n) => (
                <tr key={n.id}>
                  <td style={{ fontWeight: 600 }}>{n.name}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {n.channel.split("+").map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: 11,
                            background: "var(--bg-hover)",
                            padding: "2px 7px",
                            borderRadius: "var(--radius-full)",
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {n.trigger}
                  </td>
                  <td>
                    <StatusBadge status={n.status} />
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 12 }}
                      onClick={() => addToast(`Editing ${n.name}…`, "info")}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create Notification Template"
      >
        <form
          onSubmit={handleAddTemplate}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Template Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Booking Confirmation Email"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Channel</label>
            <select
              className="form-input form-select"
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
            >
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp</option>
              <option>Email+SMS</option>
              <option>Email+WhatsApp</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trigger Trigger *</label>
            <input
              className="form-input"
              placeholder="e.g. On booking creation status confirmed"
              value={form.trigger}
              onChange={(e) => setForm({ ...form, trigger: e.target.value })}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Template
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* =================== SETTINGS =================== */
export function Settings() {
  return <SettingsComponent />;
}

/* =================== CONTACTS =================== */
export function Contacts() {
  const { addToast } = useApp();
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Flights Support",
      phone: "+91 1800 200 1234",
      whatsapp: "+91 98765 00001",
      type: "Flight",
    },
    {
      id: 2,
      name: "Hotels Support",
      phone: "+91 1800 200 5678",
      whatsapp: "+91 98765 00002",
      type: "Hotel",
    },
    {
      id: 3,
      name: "Cabs Dispatch",
      phone: "+91 1800 200 9012",
      whatsapp: "+91 98765 00003",
      type: "Cab",
    },
    {
      id: 4,
      name: "Emergency Line",
      phone: "+91 1800 911 0000",
      whatsapp: "+91 98765 00099",
      type: "Emergency",
    },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    type: "Flight",
  });

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      addToast("Please fill out name and phone", "error");
      return;
    }
    const added = {
      id: Date.now(),
      ...form,
    };
    setContacts((prev) => [...prev, added]);
    addToast("Contact added!", "success");
    setAddOpen(false);
    setForm({ name: "", phone: "", whatsapp: "", type: "Flight" });
  };

  const deleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    addToast("Contact deleted", "error");
  };

  return (
    <div>
      <PageHeader
        title="Contact Management"
        subtitle="Manage inquiry numbers and WhatsApp contacts"
        actions={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setAddOpen(true)}
          >
            + Add Contact
          </button>
        }
      />
      <div className="grid-2">
        {contacts.map((c) => (
          <div key={c.id} className="card" style={{ padding: "18px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyDrop: "space-between",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {c.name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: "var(--brand-50)",
                  color: "var(--brand-700)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 600,
                }}
              >
                {c.type}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text-muted)", fontSize: 18 }}>
                  📞
                </span>
                <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                  {c.phone}
                </span>
              </div>
              {c.whatsapp && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--text-muted)", fontSize: 18 }}>
                    💬
                  </span>
                  <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {c.whatsapp}
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => addToast("Editing contact…", "info")}
              >
                Edit
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--danger-500)" }}
                onClick={() => deleteContact(c.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Contact"
      >
        <form
          onSubmit={handleAddContact}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Contact Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Packages Desk"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                className="form-input"
                placeholder="e.g. +91 1800 200 5555"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input
                className="form-input"
                placeholder="e.g. +91 98765 00055"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Contact Type</label>
            <select
              className="form-input form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Flight</option>
              <option>Hotel</option>
              <option>Cab</option>
              <option>Package</option>
              <option>Emergency</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Contact
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
