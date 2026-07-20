import { useState } from "react";
import { RefreshCw, Download, CreditCard, Plus, Eye, LayoutGrid, List } from "lucide-react";
import {
  PageHeader,
  StatusBadge,
  TableFilters,
  Pagination,
} from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import TagSelector from "../components/ui/TagSelector.jsx";
import { mockTransactions } from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";

const PAYMENT_TAGS = [
  "UPI", "Credit Card", "Debit Card", "Net Banking", "Cash",
  "Domestic", "International", "Refunded", "Disputed", "Manual Entry",
  "Urgent", "High Value", "Pending",
];

const METHOD_ICON = {
  UPI: "📱",
  "Credit Card": "💳",
  "Debit Card": "💳",
  "Net Banking": "🏦",
  Cash: "💵",
  Manual: "💼",
};

export default function Payments() {
  const { addToast } = useApp();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("transactions");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Refund states
  const [refundOpen, setRefundOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundReason, setRefundReason] = useState("Requested by customer");
  const [refundNotes, setRefundNotes] = useState("");

  // View details state
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewTxn, setViewTxn] = useState(null);

  // Manual Transaction states
  const [addTxnOpen, setAddTxnOpen] = useState(false);
  const [formTxn, setFormTxn] = useState({
    user: "",
    type: "Flight",
    amount: "",
    method: "UPI",
    gateway: "Razorpay",
    status: "success",
    tags: [],
  });

  const refundable = transactions.filter((t) => t.status === "success");

  const filtered = transactions.filter((t) => {
    const s = search.toLowerCase();
    const matchesTags = t.tags && t.tags.some((tag) => tag.toLowerCase().includes(s));
    return (
      t.id.toLowerCase().includes(s) ||
      t.user.toLowerCase().includes(s) ||
      t.type.toLowerCase().includes(s) ||
      matchesTags
    );
  });

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const currentPage = page > totalPages ? 1 : page;
  const paginatedTransactions = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleOpenAddTxn = () => {
    setFormTxn({
      user: "",
      type: "Flight",
      amount: "",
      method: "UPI",
      gateway: "Razorpay",
      status: "success",
      tags: [],
    });
    setAddTxnOpen(true);
  };

  const handleSaveTxn = (e) => {
    e?.preventDefault();
    if (!formTxn.user || !formTxn.amount) {
      addToast("Please fill all required fields", "error");
      return;
    }
    const formattedAmount = formTxn.amount.startsWith("₹")
      ? formTxn.amount
      : `₹${formTxn.amount}`;
    const added = {
      id: `TXN${Math.floor(88220 + Math.random() * 999)}`,
      user: formTxn.user,
      type: formTxn.type,
      amount: formattedAmount,
      method: formTxn.method,
      gateway: formTxn.gateway,
      status: formTxn.status,
      tags: formTxn.tags || [],
      date: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
    setTransactions((prev) => [added, ...prev]);
    addToast(`Transaction ${added.id} logged successfully!`, "success");
    setAddTxnOpen(false);
  };

  const processRefund = (e) => {
    e?.preventDefault();
    if (!selectedTxn) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTxn.id
          ? {
              ...t,
              status: "refunded",
              refundReason: refundReason,
              refundNotes: refundNotes,
              refundedAt: new Date().toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }
          : t
      )
    );
    addToast(
      `Refund for ${selectedTxn.id} processed successfully!`,
      "success"
    );
    setRefundOpen(false);
    setSelectedTxn(null);
    setRefundNotes("");
  };

  const totals = {
    revenue: transactions
      .filter((t) => t.status === "success")
      .reduce((acc, curr) => {
        const val = parseInt(curr.amount.replace(/[₹,]/g, "")) || 0;
        return acc + val;
      }, 0),
    success: transactions.filter((t) => t.status === "success").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    refunded: transactions.filter((t) => t.status === "refunded").length,
  };

  return (
    <div>
      <PageHeader
        title="Payments & Refunds"
        subtitle="Track transactions, refund requests, and payment gateway health"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddTxn}>
              <Plus size={14} /> Log Payment
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => addToast("Exporting transactions…", "info")}
            >
              <Download size={14} /> Export
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          {
            label: "Total Success Revenue",
            val: `₹${totals.revenue.toLocaleString()}`,
            color: "#3b82f6",
          },
          { label: "Success Bookings", val: totals.success, color: "#22c55e" },
          { label: "Pending Settlements", val: totals.pending, color: "#f59e0b" },
          { label: "Refunded Txns", val: totals.refunded, color: "#8b5cf6" },
        ].map((s) => (
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
                fontSize: 24,
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

      <div className="tabs">
        {["transactions", "refunds"].map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "transactions" ? "💳 Transactions" : "↩️ Refund Requests"}
          </button>
        ))}
      </div>

      {tab === "transactions" && (
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="card-title">All Transactions</span>
            <div className="view-toggle-group">
              <button
                className={`view-toggle-btn${viewMode === "table" ? " active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <List size={14} /> Table
              </button>
              <button
                className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
            </div>
          </div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            <TableFilters search={search} onSearch={(s) => { setSearch(s); setPage(1); }} />
            
            {viewMode === "table" ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Txn ID</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Gateway</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          style={{
                            textAlign: "center",
                            padding: 24,
                            color: "var(--text-muted)",
                          }}
                        >
                          No transactions found
                        </td>
                      </tr>
                    )}
                    {paginatedTransactions.map((t) => (
                      <tr key={t.id}>
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--brand-600)",
                          }}
                        >
                          {t.id}
                        </td>
                        <td style={{ fontWeight: 500, fontSize: 13 }}>
                          <div>{t.user}</div>
                          {t.tags && t.tags.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              {t.tags.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontSize: 9,
                                    background: "rgba(37, 99, 235, 0.08)",
                                    color: "var(--text-brand)",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
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
                            {t.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, fontSize: 14 }}>
                          {t.amount}
                        </td>
                        <td style={{ fontSize: 13 }}>
                          <span style={{ marginRight: 4 }}>
                            {METHOD_ICON[t.method] || "💰"}
                          </span>
                          {t.method}
                        </td>
                        <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                          {t.gateway}
                        </td>
                        <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {t.date}
                        </td>
                        <td>
                          <StatusBadge status={t.status} />
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="View Details"
                              onClick={() => {
                                setViewTxn(t);
                                setDetailOpen(true);
                              }}
                            >
                              <Eye size={12} />
                            </button>
                            {t.status === "success" && (
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ fontSize: 12, color: "var(--warning-600)", padding: "2px 6px" }}
                                onClick={() => {
                                  setSelectedTxn(t);
                                  setRefundOpen(true);
                                }}
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid-2" style={{ gap: 16, marginTop: 10 }}>
                {paginatedTransactions.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                    No transactions found
                  </div>
                )}
                {paginatedTransactions.map((t) => (
                  <div key={t.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--brand-600)" }}>{t.id}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: "var(--text-primary)" }}>{t.user}</div>
                        {t.tags && t.tags.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                            {t.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontSize: 9,
                                  background: "rgba(139, 92, 246, 0.1)",
                                  color: "var(--accent-600)",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={t.status} />
                    </div>

                    <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div><span style={{ color: "var(--text-muted)" }}>Type:</span> <strong style={{ textTransform: "capitalize" }}>{t.type}</strong></div>
                        <div><span style={{ color: "var(--text-muted)" }}>Date:</span> <strong>{t.date}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Amount:</span> <strong style={{ fontSize: 14, color: "var(--brand-600)" }}>{t.amount}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Method:</span> <strong style={{ color: "var(--text-secondary)" }}>{METHOD_ICON[t.method] || "💰"} {t.method}</strong>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <span style={{ color: "var(--text-muted)" }}>Gateway:</span> <strong style={{ color: "var(--text-secondary)" }}>{t.gateway}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="View Details"
                        onClick={() => {
                          setViewTxn(t);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye size={12} />
                      </button>
                      {t.status === "success" && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: "var(--warning-700)" }}
                          onClick={() => {
                            setSelectedTxn(t);
                            setRefundOpen(true);
                          }}
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination
              page={currentPage}
              total={filtered.length}
              perPage={perPage}
              onChange={setPage}
            />
          </div>
        </div>
      )}

      {tab === "refunds" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Refund Queue (Eligible Transactions)</span>
          </div>
          <div style={{ padding: "12px 20px" }}>
            {refundable.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                No successful transactions eligible for refunds.
              </div>
            ) : (
              refundable.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 4px",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-md)",
                        background: "var(--warning-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CreditCard
                        size={16}
                        style={{ color: "var(--warning-600)" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {t.user} — {t.type}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {t.id} · {t.date}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {t.amount}
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedTxn(t);
                        setRefundOpen(true);
                      }}
                    >
                      Process Refund
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      <Modal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setViewTxn(null);
        }}
        title="Transaction Ledger Details"
      >
        {viewTxn && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "var(--brand-600)" }}>{viewTxn.id}</span>
              <StatusBadge status={viewTxn.status} />
            </div>
            <div className="grid-2" style={{ gap: 10 }}>
              {[
                { label: "Customer", val: viewTxn.user },
                { label: "Booking Type", val: viewTxn.type },
                { label: "Payment Gateway", val: viewTxn.gateway },
                { label: "Payment Method", val: viewTxn.method },
                { label: "Transacted Date", val: viewTxn.date },
                { label: "Total Amount", val: viewTxn.amount },
              ].map((f) => (
                <div key={f.label} style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)", marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.val}</div>
                </div>
              ))}
            </div>
            {viewTxn.status === "refunded" && (
              <div style={{ background: "var(--warning-50)", border: "1px solid var(--warning-200)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginTop: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--warning-700)", textTransform: "uppercase", letterSpacing: ".05em" }}>Refund Information</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Reason: <strong>{viewTxn.refundReason || "Requested by customer"}</strong></div>
                <div style={{ fontSize: 13, marginTop: 2 }}>Processed on: <strong>{viewTxn.refundedAt || "Today"}</strong></div>
                {viewTxn.refundNotes && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontStyle: "italic" }}>Admin Notes: "{viewTxn.refundNotes}"</div>}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Log Payment Modal */}
      <Modal
        open={addTxnOpen}
        onClose={() => setAddTxnOpen(false)}
        title="Record Manual Payment Entry"
      >
        <form onSubmit={handleSaveTxn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formTxn.user}
              onChange={(e) => setFormTxn({ ...formTxn, user: e.target.value })}
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Booking Type</label>
              <select
                className="form-input form-select"
                value={formTxn.type}
                onChange={(e) => setFormTxn({ ...formTxn, type: e.target.value })}
              >
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Cab">Cab</option>
                <option value="Package">Package</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 15200"
                value={formTxn.amount}
                onChange={(e) => setFormTxn({ ...formTxn, amount: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-input form-select"
                value={formTxn.method}
                onChange={(e) => setFormTxn({ ...formTxn, method: e.target.value })}
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Gateway</label>
              <select
                className="form-input form-select"
                value={formTxn.gateway}
                onChange={(e) => setFormTxn({ ...formTxn, gateway: e.target.value })}
              >
                <option value="Razorpay">Razorpay</option>
                <option value="Stripe">Stripe</option>
                <option value="Paytm">Paytm</option>
                <option value="Manual">Manual Settlement</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Payment Status</label>
            <select
              className="form-input form-select"
              value={formTxn.status}
              onChange={(e) => setFormTxn({ ...formTxn, status: e.target.value })}
            >
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <TagSelector
            label="Tags"
            value={formTxn.tags || []}
            onChange={(tags) => setFormTxn({ ...formTxn, tags })}
            suggestions={PAYMENT_TAGS}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddTxnOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Log Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Refund Confirmation Modal */}
      <Modal
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        title="Initiate Refund Request"
      >
        <form onSubmit={processRefund} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {selectedTxn && (
            <>
              <div
                style={{
                  background: "var(--warning-50)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  border: "1px solid var(--warning-400)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--warning-600)" }}>
                  ⚠ Refund Confirmation Required
                </div>
                <div style={{ fontSize: 12, color: "var(--warning-600)", marginTop: 4 }}>
                  This action is irreversible. The amount will be credited back to the customer's account.
                </div>
              </div>
              <div className="grid-2" style={{ gap: 10 }}>
                {[
                  { label: "Transaction", val: selectedTxn.id },
                  { label: "User", val: selectedTxn.user },
                  { label: "Amount", val: selectedTxn.amount },
                  { label: "Method", val: selectedTxn.method },
                ].map((f) => (
                  <div
                    key={f.label}
                    style={{
                      background: "var(--bg-hover)",
                      borderRadius: 8,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                        color: "var(--text-muted)",
                        marginBottom: 3,
                      }}
                    >
                      {f.label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{f.val}</div>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Refund Reason</label>
                <select
                  className="form-input form-select"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                >
                  <option value="Requested by customer">Requested by customer</option>
                  <option value="Duplicate payment">Duplicate payment</option>
                  <option value="Fraudulent transaction">Fraudulent transaction</option>
                  <option value="Service not delivered">Service not delivered</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Notes (optional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Any additional notes…"
                  style={{ resize: "none" }}
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
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
                  onClick={() => setRefundOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  <RefreshCw size={14} style={{ marginRight: 4 }} /> Process Refund
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
