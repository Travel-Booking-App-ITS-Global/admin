import { useState } from "react";
import { MessageCircle, CheckCircle, User, Clock, AlertTriangle, Plus } from "lucide-react";
import { PageHeader, StatusBadge, TableFilters, Avatar } from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import { mockTickets } from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";

const PRIORITY_COLOR = { high: "var(--danger-500)", medium: "var(--warning-500)", low: "var(--gray-400)" };

export default function Support() {
  const { addToast } = useApp();
  const [tickets, setTickets] = useState(mockTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("Pooja S.");
  const [chatLogs, setChatLogs] = useState({});

  // Manual ticket states
  const [addOpen, setAddOpen] = useState(false);
  const [formTicket, setFormTicket] = useState({
    user: "",
    subject: "",
    category: "Booking",
    priority: "medium",
    status: "open",
    assigned: "Pooja S.",
  });

  const handleOpenAddModal = () => {
    setFormTicket({
      user: "",
      subject: "",
      category: "Booking",
      priority: "medium",
      status: "open",
      assigned: "Pooja S.",
    });
    setAddOpen(true);
  };

  const handleSaveTicket = (e) => {
    e?.preventDefault();
    if (!formTicket.user || !formTicket.subject) {
      addToast("Please fill all required fields", "error");
      return;
    }
    const added = {
      id: `TKT${Math.floor(1000 + Math.random() * 9000)}`,
      user: formTicket.user,
      subject: formTicket.subject,
      category: formTicket.category,
      priority: formTicket.priority,
      status: formTicket.status,
      created: "Just now",
      assigned: formTicket.assigned,
    };
    setTickets((prev) => [added, ...prev]);
    addToast(`Ticket ${added.id} filed successfully!`, "success");
    setAddOpen(false);
  };

  const filtered = tickets.filter((t) => {
    const s = search.toLowerCase();
    return (
      (t.id.toLowerCase().includes(s) ||
        t.user.toLowerCase().includes(s) ||
        t.subject.toLowerCase().includes(s)) &&
      (statusFilter === "all" || t.status === statusFilter)
    );
  });

  const getMessagesForTicket = (t) => {
    if (!t) return [];
    if (chatLogs[t.id]) return chatLogs[t.id];
    return [
      { from: "user", text: `Hi, I have an issue with my booking. ${t.subject.toLowerCase()}.`, time: "2 hrs ago" },
      { from: "agent", text: "Hi! I'm looking into your issue right now. Could you share your booking ID?", time: "1.5 hrs ago" },
      { from: "user", text: `Sure, it's ${t.id.replace("TKT", "BKT")}. Please check.`, time: "1 hr ago" },
    ];
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    const currentMsgs = getMessagesForTicket(selected);
    const newMsg = { from: "agent", text: replyText, time: "Just now" };
    setChatLogs((prev) => ({
      ...prev,
      [selected.id]: [...currentMsgs, newMsg],
    }));
    setReplyText("");
    addToast("Reply sent!", "success");

    // If ticket is open, auto change status to in_progress
    if (selected.status === "open") {
      updateTicketField("status", "in_progress");
    }
  };

  const updateTicketField = (field, value) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, [field]: value } : t))
    );
    setSelected((prev) => ({ ...prev, [field]: value }));
    addToast(`Ticket ${field} updated!`, "success");
  };

  const handleAssign = () => {
    updateTicketField("assigned", assignedAgent);
  };

  const resolveTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "resolved" } : t))
    );
    addToast("Ticket resolved!", "success");
    setSelected(null);
  };

  const counts = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div>
      <PageHeader
        title="Support & Ticketing"
        subtitle="Customer support tickets and resolution workflow"
        actions={
          <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
            <Plus size={14} /> File Ticket
          </button>
        }
      />

      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: "Open", val: counts.open, color: "#ef4444", icon: AlertTriangle, filterKey: "open" },
          { label: "In Progress", val: counts.in_progress, color: "#f59e0b", icon: Clock, filterKey: "in_progress" },
          { label: "Resolved", val: counts.resolved, color: "#22c55e", icon: CheckCircle, filterKey: "resolved" },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              border: statusFilter === s.filterKey ? `1px solid ${s.color}` : "1px solid var(--border-default)",
              background: statusFilter === s.filterKey ? "var(--bg-hover)" : "var(--bg-card)",
              transition: "all 0.2s",
            }}
            onClick={() => setStatusFilter(s.filterKey)}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: s.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
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
                }}
              >
                {s.val}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Tickets</span>
          <select
            className="form-input form-select"
            style={{ width: 140, fontSize: 12, padding: "6px 28px 6px 10px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="card-body" style={{ padding: "12px 20px" }}>
          <TableFilters search={search} onSearch={setSearch} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                No support tickets found
              </div>
            )}
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelected(t)}
                style={{
                  background: "var(--bg-hover)",
                  borderRadius: "var(--radius-lg)",
                  padding: "14px 16px",
                  cursor: "pointer",
                  border: "1px solid var(--border-default)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  transition: "all var(--transition-fast)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border-brand)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              >
                {/* Priority Dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: PRIORITY_COLOR[t.priority],
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "var(--brand-600)" }}>
                      {t.id}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        background: "var(--gray-100)",
                        borderRadius: "var(--radius-full)",
                        padding: "1px 8px",
                        color: "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      {t.category}
                    </span>
                    <StatusBadge status={t.priority} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.subject}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <User size={11} />
                      {t.user}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} />
                      {t.created}
                    </span>
                    {t.assigned && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={11} style={{ color: "var(--success-500)" }} />
                        Assigned: {t.assigned}
                      </span>
                    )}
                  </div>
                </div>

                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Details & Workspace Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Support Workspace - Ticket ${selected?.id}`}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSelected(null)}>
              Close Workspace
            </button>
            {selected?.status !== "resolved" && (
              <button className="btn btn-success" onClick={() => resolveTicket(selected.id)}>
                <CheckCircle size={14} style={{ marginRight: 4 }} /> Mark Resolved
              </button>
            )}
          </>
        }
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: "14px 16px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-md)",
                borderLeft: `4px solid ${PRIORITY_COLOR[selected.priority]}`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{selected.subject}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", fontSize: 12, color: "var(--text-secondary)" }}>
                <span>
                  User: <strong>{selected.user}</strong>
                </span>
                <span>
                  Opened: <strong>{selected.created}</strong>
                </span>
                <span>
                  Current Status: <strong style={{ textTransform: "capitalize" }}>{selected.status}</strong>
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div style={{ background: "var(--bg-hover)", padding: 12, borderRadius: "var(--radius-md)", display: "flex", flexWrap: "wrap", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Category:</span>
                <select
                  className="form-input form-select"
                  style={{ width: 110, fontSize: 12, padding: "4px 20px 4px 6px" }}
                  value={selected.category}
                  onChange={(e) => updateTicketField("category", e.target.value)}
                >
                  <option value="Booking">Booking</option>
                  <option value="Refund">Refund</option>
                  <option value="Cab">Cab</option>
                  <option value="Tech">Tech</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Priority:</span>
                <select
                  className="form-input form-select"
                  style={{ width: 100, fontSize: 12, padding: "4px 20px 4px 6px" }}
                  value={selected.priority}
                  onChange={(e) => updateTicketField("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Status:</span>
                <select
                  className="form-input form-select"
                  style={{ width: 110, fontSize: 12, padding: "4px 20px 4px 6px" }}
                  value={selected.status}
                  onChange={(e) => updateTicketField("status", e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Conversation Thread */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                Conversation Thread
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {getMessagesForTicket(selected).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, flexDirection: m.from === "agent" ? "row-reverse" : "row" }}>
                    <Avatar name={m.from === "agent" ? selected.assigned || "Agent" : selected.user} size="sm" />
                    <div
                      style={{
                        maxWidth: "75%",
                        background: m.from === "agent" ? "var(--brand-600)" : "var(--bg-hover)",
                        color: m.from === "agent" ? "#fff" : "var(--text-primary)",
                        padding: "10px 14px",
                        borderRadius: m.from === "agent" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                        fontSize: 13,
                      }}
                    >
                      {m.text}
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: m.from === "agent" ? "right" : "left" }}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Input */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Type your reply to customer…"
                style={{ flex: 1, resize: "none" }}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button className="btn btn-primary" style={{ alignSelf: "flex-end" }} onClick={sendReply}>
                <MessageCircle size={14} style={{ marginRight: 4 }} /> Send
              </button>
            </div>

            {/* Assignment Panel */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "12px 14px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Assign Team Member:</div>
              <select
                className="form-input form-select"
                style={{ width: 180, fontSize: 12 }}
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
              >
                <option value="Pooja S.">Pooja S. (Flights Desk)</option>
                <option value="Rahul M.">Rahul M. (Refund Specialist)</option>
                <option value="Ananya K.">Ananya K. (Cab Ops Coordinator)</option>
              </select>
              <button className="btn btn-secondary btn-sm" onClick={handleAssign}>
                Assign Agent
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* File Manual Ticket Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="File Support Ticket (Call/Email)">
        <form onSubmit={handleSaveTicket} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Priyan Sharma"
              value={formTicket.user}
              onChange={(e) => setFormTicket({ ...formTicket, user: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subject Description *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Flight was rescheduled, need name correction"
              value={formTicket.subject}
              onChange={(e) => setFormTicket({ ...formTicket, subject: e.target.value })}
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                value={formTicket.category}
                onChange={(e) => setFormTicket({ ...formTicket, category: e.target.value })}
              >
                <option value="Booking">Booking</option>
                <option value="Refund">Refund</option>
                <option value="Cab">Cab</option>
                <option value="Tech">Tech</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input form-select"
                value={formTicket.priority}
                onChange={(e) => setFormTicket({ ...formTicket, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Assigned Agent</label>
              <select
                className="form-input form-select"
                value={formTicket.assigned}
                onChange={(e) => setFormTicket({ ...formTicket, assigned: e.target.value })}
              >
                <option value="Pooja S.">Pooja S.</option>
                <option value="Rahul M.">Rahul M.</option>
                <option value="Ananya K.">Ananya K.</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input form-select"
                value={formTicket.status}
                onChange={(e) => setFormTicket({ ...formTicket, status: e.target.value })}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              File Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
