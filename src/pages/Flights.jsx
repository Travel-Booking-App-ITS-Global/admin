import { useState } from "react";
import { Eye, Download, XCircle, Plus, Edit, LayoutGrid, List } from "lucide-react";
import {
  PageHeader,
  StatusBadge,
  TableFilters,
  Pagination,
} from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import TagSelector from "../components/ui/TagSelector.jsx";
import { mockFlightBookings } from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";

const FLIGHT_TAGS = [
  "Domestic", "International", "Business", "Economy", "Leisure",
  "Family", "Corporate", "Urgent", "Holiday", "Honeymoon",
  "Refund Pending", "Group Booking",
];

export default function Flights() {
  const { addToast } = useApp();
  const [bookings, setBookings] = useState(mockFlightBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [selected, setSelected] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formBooking, setFormBooking] = useState({
    id: "",
    user: "",
    from: "",
    to: "",
    airline: "",
    pnr: "",
    date: "",
    class: "Economy",
    amount: "",
    pax: 1,
    status: "pending",
    tags: [],
  });

  const handleOpenAddModal = () => {
    setFormBooking({
      id: `FLT${Math.floor(1000 + Math.random() * 9000)}`,
      user: "",
      from: "",
      to: "",
      airline: "IndiGo",
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      class: "Economy",
      amount: "₹",
      pax: 1,
      status: "pending",
      tags: [],
    });
    setAddOpen(true);
  };

  const handleOpenEditModal = (b) => {
    setFormBooking({ ...b, tags: b.tags || [] });
    setEditOpen(true);
  };

  const handleSaveBooking = (e) => {
    e?.preventDefault();
    if (
      !formBooking.user ||
      !formBooking.from ||
      !formBooking.to ||
      !formBooking.amount
    ) {
      addToast("Please fill all required fields", "error");
      return;
    }
    const formattedAmount = formBooking.amount.startsWith("₹")
      ? formBooking.amount
      : `₹${formBooking.amount}`;
    const cleanBooking = { ...formBooking, amount: formattedAmount };

    if (editOpen) {
      setBookings((prev) =>
        prev.map((b) => (b.id === cleanBooking.id ? cleanBooking : b)),
      );
      if (selected && selected.id === cleanBooking.id) {
        setSelected(cleanBooking);
      }
      addToast(`Booking ${cleanBooking.id} updated successfully!`, "success");
      setEditOpen(false);
    } else {
      setBookings((prev) => [cleanBooking, ...prev]);
      addToast(`Booking ${cleanBooking.id} created successfully!`, "success");
      setAddOpen(false);
    }
  };

  const confirmBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)),
    );
    addToast(`Booking ${id} confirmed successfully!`, "success");
    setSelected(null);
  };

  const cancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
    addToast(`Booking ${id} cancelled.`, "warning");
    setSelected(null);
  };

  const filtered = bookings.filter((b) => {
    const s = search.toLowerCase();
    const matchesTags = b.tags && b.tags.some((tag) => tag.toLowerCase().includes(s));
    return (
      (b.id.toLowerCase().includes(s) ||
        b.user.toLowerCase().includes(s) ||
        b.pnr.toLowerCase().includes(s) ||
        matchesTags) &&
      (statusFilter === "all" || b.status === statusFilter)
    );
  });

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const currentPage = page > totalPages ? 1 : page;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const counts = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  // Clickable stats card updates status filter
  const handleStatCardClick = (filterVal) => {
    setStatusFilter(filterVal);
  };

  return (
    <div>
      <PageHeader
        title="Flight Bookings"
        subtitle="Manage all flight reservations across all airlines"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddModal}
            >
              <Plus size={14} /> Book Flight
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => addToast("Exporting flights…", "info")}
            >
              <Download size={14} /> Export
            </button>
          </div>
        }
      />

      {/* Interactive Stats Row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          {
            label: "Total",
            val: counts.total,
            color: "#3b82f6",
            filterKey: "all",
          },
          {
            label: "Confirmed",
            val: counts.confirmed,
            color: "#22c55e",
            filterKey: "confirmed",
          },
          {
            label: "Pending",
            val: counts.pending,
            color: "#f59e0b",
            filterKey: "pending",
          },
          {
            label: "Cancelled",
            val: counts.cancelled,
            color: "#ef4444",
            filterKey: "cancelled",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              padding: "14px 18px",
              cursor: "pointer",
              border:
                statusFilter === s.filterKey
                  ? `1px solid ${s.color}`
                  : "1px solid var(--border-default)",
              background:
                statusFilter === s.filterKey
                  ? "var(--bg-hover)"
                  : "var(--bg-card)",
              transition: "all 0.2s",
            }}
            onClick={() => handleStatCardClick(s.filterKey)}
          >
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
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span className="card-title">All Flight Bookings</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <select
              className="form-input form-select"
              style={{ width: 140, fontSize: 12, padding: "6px 28px 6px 10px", margin: 0 }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
        <div className="card-body" style={{ padding: "12px 20px" }}>
          <TableFilters search={search} onSearch={(s) => { setSearch(s); setPage(1); }} />
          
          {viewMode === "table" ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Airline / PNR</th>
                    <th>Date</th>
                    <th>Class</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          textAlign: "center",
                          padding: 24,
                          color: "var(--text-muted)",
                        }}
                      >
                        No flight bookings found
                      </td>
                    </tr>
                  )}
                  {paginated.map((b) => (
                    <tr key={b.id}>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--brand-600)",
                        }}
                      >
                        {b.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.user}</div>
                        {b.tags && b.tags.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                            {b.tags.map((t) => (
                              <span
                                key={t}
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
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontWeight: 700,
                          }}
                        >
                          <span>{b.from}</span>
                          <span
                            style={{ color: "var(--text-muted)", fontSize: 12 }}
                          >
                            →
                          </span>
                          <span>{b.to}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{b.airline}</div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            fontFamily: "monospace",
                          }}
                        >
                          {b.pnr}
                        </div>
                      </td>
                      <td
                        style={{ fontSize: 12, color: "var(--text-secondary)" }}
                      >
                        {b.date}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            background:
                              b.class === "Business"
                                ? "rgba(139,92,246,.1)"
                                : "var(--gray-100)",
                            color:
                              b.class === "Business"
                                ? "var(--accent-600)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {b.class}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{b.amount}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="View Details"
                            onClick={() => setSelected(b)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Edit Booking"
                            onClick={() => handleOpenEditModal(b)}
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: 16, marginTop: 10 }}>
              {paginated.length === 0 && (
                <div style={{ gridColumn: "span 2", textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                  No flight bookings found
                </div>
              )}
              {paginated.map((b) => (
                <div key={b.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--brand-600)" }}>{b.id}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4, color: "var(--text-primary)" }}>{b.user}</div>
                      {b.tags && b.tags.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                          {b.tags.map((t) => (
                            <span
                              key={t}
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
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  
                  <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{b.from}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Origin</div>
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: 16 }}>✈</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{b.to}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Dest</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Airline:</span> <strong style={{ color: "var(--text-secondary)" }}>{b.airline}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>PNR:</span> <strong style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{b.pnr}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Date:</span> <strong style={{ color: "var(--text-secondary)" }}>{b.date}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Class:</span> <strong style={{ color: "var(--text-secondary)" }}>{b.class}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Total Paid</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--brand-600)" }}>{b.amount}</div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" title="View Details" onClick={() => setSelected(b)}>
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Edit Booking" onClick={() => handleOpenEditModal(b)}>
                        <Edit size={14} />
                      </button>
                    </div>
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

      {/* Flight Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Flight Booking Details"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const b = selected;
                setSelected(null);
                handleOpenEditModal(b);
              }}
            >
              <Edit size={14} style={{ marginRight: 4 }} /> Edit Details
            </button>
            {selected?.status === "pending" && (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => cancelBooking(selected.id)}
                >
                  <XCircle size={14} /> Cancel Booking
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => confirmBooking(selected.id)}
                >
                  Confirm Booking
                </button>
              </>
            )}
            {selected?.status === "confirmed" && (
              <button
                className="btn btn-danger"
                onClick={() => cancelBooking(selected.id)}
              >
                <XCircle size={14} /> Cancel Booking
              </button>
            )}
          </>
        }
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--brand-600)",
                }}
              >
                {selected.id}
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div
              style={{
                background: "var(--bg-hover)",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {selected.from}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Origin
                </div>
              </div>
              <div style={{ fontSize: 24, color: "var(--text-muted)" }}>✈</div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {selected.to}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Destination
                </div>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 10 }}>
              {[
                { label: "Passenger", val: selected.user },
                { label: "Airline", val: selected.airline },
                { label: "PNR", val: selected.pnr },
                { label: "Class", val: selected.class },
                { label: "Date", val: selected.date },
                { label: "Pax", val: selected.pax },
                { label: "Amount", val: selected.amount },
                { label: "Tags", val: selected.tags && selected.tags.length > 0 ? selected.tags.join(", ") : "None" },
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
          </div>
        )}
      </Modal>

      {/* Book Flight / Edit Flight Modal */}
      <Modal
        open={addOpen || editOpen}
        onClose={() => {
          setAddOpen(false);
          setEditOpen(false);
        }}
        title={
          editOpen ? "Edit Flight Booking" : "Create Manual Flight Booking"
        }
      >
        <form
          onSubmit={handleSaveBooking}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Passenger Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formBooking.user}
              onChange={(e) =>
                setFormBooking({ ...formBooking, user: e.target.value })
              }
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">From (Origin Code) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DEL"
                maxLength={3}
                value={formBooking.from}
                onChange={(e) =>
                  setFormBooking({
                    ...formBooking,
                    from: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">To (Destination Code) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BOM"
                maxLength={3}
                value={formBooking.to}
                onChange={(e) =>
                  setFormBooking({
                    ...formBooking,
                    to: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Airline *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IndiGo"
                value={formBooking.airline}
                onChange={(e) =>
                  setFormBooking({ ...formBooking, airline: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">PNR *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 6E4921"
                maxLength={6}
                value={formBooking.pnr}
                onChange={(e) =>
                  setFormBooking({
                    ...formBooking,
                    pnr: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="grid-3" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-input form-select"
                value={formBooking.class}
                onChange={(e) =>
                  setFormBooking({ ...formBooking, class: e.target.value })
                }
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Passenger Count</label>
              <input
                type="number"
                className="form-input"
                min={1}
                value={formBooking.pax}
                onChange={(e) =>
                  setFormBooking({
                    ...formBooking,
                    pax: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Booking Status</label>
              <select
                className="form-input form-select"
                value={formBooking.status}
                onChange={(e) =>
                  setFormBooking({ ...formBooking, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Travel Date *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 18 Jul 2025"
                value={formBooking.date}
                onChange={(e) =>
                  setFormBooking({ ...formBooking, date: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Cost *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 8420"
                value={formBooking.amount}
                onChange={(e) =>
                  setFormBooking({ ...formBooking, amount: e.target.value })
                }
                required
              />
            </div>
          </div>
          <TagSelector
            label="Tags"
            value={formBooking.tags || []}
            onChange={(tags) => setFormBooking({ ...formBooking, tags })}
            suggestions={FLIGHT_TAGS}
          />
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
              onClick={() => {
                setAddOpen(false);
                setEditOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editOpen ? "Save Changes" : "Create Reservation"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
