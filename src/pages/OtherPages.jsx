import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BarChart2, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react";
import { PageHeader, StatusBadge, ConfirmDeleteModal } from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import {
  mockItineraries,
  mockNotifTemplates,
  mockFAQs,
} from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";
import api from "../services/api.js";
import SettingsComponent from "./settings/Settings.jsx";
import ContactsComponent from "./contacts/ContactsPage.jsx";
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
                  <td style={{ fontWeight: 600 }}>
                    {it.title}
                    {it.tags && it.tags.length > 0 && (
                      <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                        {it.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              background: "rgba(37, 99, 235, 0.08)",
                              color: "var(--text-brand)",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontWeight: 600,
                              border: "1px solid rgba(37, 99, 235, 0.15)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
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
  const [faqs, setFaqs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null); // Will hold policy object to edit
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "General",
  });
  const [editFaq, setEditFaq] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      if (tab === "faqs") {
        const data = await api.cmsApi.getFaqs();
        setFaqs(data);
      } else if (tab === "policies") {
        const data = await api.cmsApi.getPolicies();
        setPolicies(data);
      }
    } catch (err) {
      addToast(err.message || "Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, [tab]);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) {
      addToast("Please enter both question and answer", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.cmsApi.createFaq(newFaq);
      addToast("FAQ added successfully!", "success");
      setAddFaqOpen(false);
      setNewFaq({ question: "", answer: "", category: "General" });
      fetchCmsData();
    } catch (err) {
      addToast(err.message || "Failed to add FAQ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteFaq = (f) => {
    setFaqToDelete(f);
    setDeleteModalOpen(true);
  };

  const deleteFaq = async () => {
    if (!faqToDelete) return;
    setIsSubmitting(true);
    try {
      await api.cmsApi.deleteFaq(faqToDelete.id);
      addToast("FAQ marked as deleted", "error");
      setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
      setDeleteModalOpen(false);
      setFaqToDelete(null);
    } catch (err) {
      addToast(err.message || "Failed to delete FAQ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFaq = async (e) => {
    e.preventDefault();
    if (!editFaq.question || !editFaq.answer) {
      addToast("Please enter both question and answer", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.cmsApi.updateFaq(editFaq.id, {
        question: editFaq.question,
        answer: editFaq.answer,
        category: editFaq.category,
      });
      addToast("FAQ updated successfully!", "success");
      setEditFaq(null);
      fetchCmsData();
    } catch (err) {
      addToast(err.message || "Failed to update FAQ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePolicy = async (e) => {
    e.preventDefault();
    if (!editPolicy.content) {
      addToast("Policy content cannot be empty", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.cmsApi.updatePolicy(editPolicy.id, { content: editPolicy.content });
      addToast("Policy updated successfully!", "success");
      setEditPolicy(null);
      fetchCmsData();
    } catch (err) {
      addToast(err.message || "Failed to update policy", "error");
    } finally {
      setIsSubmitting(false);
    }
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
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "60px 10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--brand-600)" }} />
                        <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>
                          Loading FAQs...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)" }}>
                      No FAQs found. Add one above.
                    </td>
                  </tr>
                ) : (
                  faqs.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 500, maxWidth: 400 }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                          {f.question}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {f.category.split(",").map((t, idx) => (
                            <span key={idx} style={{
                              fontSize: 10,
                              background: "rgba(59, 130, 246, 0.12)",
                              color: "var(--brand-700)",
                              padding: "2px 6px",
                              borderRadius: 4,
                            }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {f.category}
                      </td>
                      <td style={{ fontWeight: 600 }}>0</td>
                      <td>
                        <StatusBadge status={f.status.toLowerCase()} />
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 12, color: "var(--text-secondary)" }}
                            onClick={() => setEditFaq(f)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 12, color: "var(--danger-500)" }}
                            onClick={() => confirmDeleteFaq(f)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "policies" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--brand-600)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>
                Loading policies...
              </span>
            </div>
          ) : policies.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)" }}>
              No policies found.
            </div>
          ) : (
            policies.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>📄 {p.title}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <StatusBadge status={p.status.toLowerCase()} />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditPolicy(p)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
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
              <option value="General">General</option>
              <option value="Flights">Flights</option>
              <option value="Hotels">Hotels</option>
              <option value="Cabs">Cabs</option>
              <option value="Packages">Packages</option>
            </select>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddFaqOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add FAQ"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Policy Modal */}
      <Modal
        open={!!editPolicy}
        onClose={() => setEditPolicy(null)}
        title={editPolicy ? `Edit ${editPolicy.title}` : "Edit Policy"}
        width="600px"
      >
        <form className="card-body" onSubmit={handleUpdatePolicy}>
          <div className="form-group">
            <label className="form-label">Policy Content *</label>
            <div style={{ height: "300px", marginBottom: "40px" }}>
              <ReactQuill
                theme="snow"
                value={editPolicy?.content || ""}
                onChange={(val) =>
                  setEditPolicy({ ...editPolicy, content: val })
                }
                style={{ height: "100%" }}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditPolicy(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Policy"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        open={!!editFaq}
        onClose={() => setEditFaq(null)}
        title="Edit FAQ"
      >
        <form
          onSubmit={handleUpdateFaq}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Question *</label>
            <input
              className="form-input"
              value={editFaq?.question || ""}
              onChange={(e) =>
                setEditFaq({ ...editFaq, question: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Answer *</label>
            <textarea
              className="form-input"
              rows={3}
              value={editFaq?.answer || ""}
              onChange={(e) => setEditFaq({ ...editFaq, answer: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input form-select"
              value={editFaq?.category || "General"}
              onChange={(e) =>
                setEditFaq({ ...editFaq, category: e.target.value })
              }
            >
              <option value="General">General</option>
              <option value="Flights">Flights</option>
              <option value="Hotels">Hotels</option>
              <option value="Cabs">Cabs</option>
              <option value="Packages">Packages</option>
            </select>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditFaq(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save FAQ"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setFaqToDelete(null);
        }}
        onConfirm={deleteFaq}
        itemName={faqToDelete?.question}
        isDeleting={isSubmitting}
      />
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
  return <ContactsComponent />;
}
