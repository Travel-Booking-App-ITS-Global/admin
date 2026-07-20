import { useState, useEffect } from "react";
import { Eye, Star, MapPin, Plus, XCircle, CheckCircle, Edit, FileText, AlertTriangle, ShieldCheck, LayoutGrid, List, Download } from "lucide-react";
import {
  PageHeader,
  StatusBadge,
  Avatar,
  TableFilters,
  Pagination,
} from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import TagSelector from "../components/ui/TagSelector.jsx";
import {
  mockHotelBookings,
  mockCabBookings,
} from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";
import { exportToCSV } from "../utils/export.js";
import { useLocation } from "react-router-dom";

const HOTEL_TAGS = [
  "Luxury", "Budget", "Heritage", "Resort", "Business",
  "Family", "Holiday", "Express", "Five Star", "Boutique",
  "Sea View", "City Centre", "Promo",
];
const CAB_TAGS = [
  "Airport Transfer", "Local Ride", "Outstation", "SUV", "Sedan",
  "Budget", "Early Morning", "Night Ride", "Premium", "Group",
];
const DRIVER_TAGS = [
  "Top Rated", "English Speaking", "SUV Expert", "Local Guide",
  "Veteran", "No Cancellations", "Night Shift", "Airport Specialist",
];
const VEHICLE_TAGS = [
  "Sedan", "SUV", "Tempo Traveller", "Luxury", "Commercial",
  "AITP Permitted", "AC", "Non-AC", "GPS Enabled",
];

/* =================== HOTELS PAGE =================== */
export function Hotels() {
  const { addToast } = useApp();
  const [hotelBookings, setHotelBookings] = useState(mockHotelBookings);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q) {
      setTimeout(() => {
        setSearch(q);
        setPage(1);
      }, 0);
    }
  }, [location.search]);

  // Manual Hotel booking states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formHotel, setFormHotel] = useState({
    id: "",
    user: "",
    hotel: "",
    city: "",
    checkin: "",
    checkout: "",
    rooms: 1,
    nights: 1,
    amount: "",
    status: "pending",
    tags: [],
  });

  const handleOpenAddModal = () => {
    setFormHotel({
      id: `HTL${Math.floor(3000 + Math.random() * 999)}`,
      user: "",
      hotel: "",
      city: "",
      checkin: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      checkout: new Date(Date.now() + 86400000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      rooms: 1,
      nights: 1,
      amount: "₹",
      status: "pending",
      tags: [],
    });
    setAddOpen(true);
  };

  const handleOpenEditModal = (booking) => {
    setFormHotel({ ...booking, tags: booking.tags || [] });
    setEditOpen(true);
  };

  const handleSaveHotel = (e) => {
    e?.preventDefault();
    if (!formHotel.user || !formHotel.hotel || !formHotel.city || !formHotel.amount) {
      addToast("Please fill all required fields", "error");
      return;
    }
    const formattedAmount = formHotel.amount.startsWith("₹")
      ? formHotel.amount
      : `₹${formHotel.amount}`;
    const cleanHotel = { ...formHotel, amount: formattedAmount };

    if (editOpen) {
      setHotelBookings((prev) =>
        prev.map((b) => (b.id === cleanHotel.id ? cleanHotel : b)),
      );
      if (selected && selected.id === cleanHotel.id) {
        setSelected(cleanHotel);
      }
      addToast(`Booking ${cleanHotel.id} updated!`, "success");
      setEditOpen(false);
    } else {
      setHotelBookings((prev) => [cleanHotel, ...prev]);
      addToast(`Booking ${cleanHotel.id} created!`, "success");
      setAddOpen(false);
    }
  };

  const confirmHotelBooking = (id) => {
    setHotelBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)),
    );
    addToast(`Hotel booking ${id} confirmed!`, "success");
    setSelected(null);
  };

  const cancelHotelBooking = (id) => {
    setHotelBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
    addToast(`Hotel booking ${id} cancelled.`, "warning");
    setSelected(null);
  };

  const filtered = hotelBookings.filter((b) => {
    const s = search.toLowerCase();
    const matchesTags = b.tags && b.tags.some((tag) => tag.toLowerCase().includes(s));
    return (
      b.hotel.toLowerCase().includes(s) ||
      b.user.toLowerCase().includes(s) ||
      b.city.toLowerCase().includes(s) ||
      matchesTags
    );
  });

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const currentPage = page > totalPages ? 1 : page;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div>
      <PageHeader
        title="Hotel Bookings"
        subtitle="Manage all hotel reservations"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddModal}
            >
              <Plus size={14} /> Book Hotel
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                exportToCSV(filtered, "hotels_bookings.csv");
                addToast("Hotels data exported to CSV!", "success");
              }}
            >
              <Download size={14} /> Export
            </button>
          </div>
        }
      />
      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="card-title">All Hotel Bookings</span>
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
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Hotel</th>
                    <th>City</th>
                    <th>Check-in</th>
                    <th>Nights</th>
                    <th>Rooms</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          textAlign: "center",
                          padding: 24,
                          color: "var(--text-muted)",
                        }}
                      >
                        No hotel bookings found
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
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {b.hotel}
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <MapPin
                            size={11}
                            style={{ color: "var(--text-muted)" }}
                          />
                          {b.city}
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {b.checkin} → {b.checkout}
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.nights}N</td>
                      <td>{b.rooms}</td>
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
                  No hotel bookings found
                </div>
              )}
              {paginated.map((b) => (
                <div key={b.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--brand-600)" }}>{b.id}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: "var(--text-primary)" }}>{b.hotel}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                        <MapPin size={12} style={{ color: "var(--text-muted)" }} />
                        {b.city}
                      </div>
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

                  <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "var(--text-muted)" }}>Guest:</span> <strong>{b.user}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-muted)" }}>Stay:</span> <strong>{b.checkin} → {b.checkout}</strong>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Rooms:</span> <strong style={{ color: "var(--text-secondary)" }}>{b.rooms} Room(s)</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Nights:</span> <strong style={{ color: "var(--text-secondary)" }}>{b.nights} Night(s)</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Total Price</div>
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

      {/* Hotel Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Hotel Booking Details"
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
                  onClick={() => cancelHotelBooking(selected.id)}
                >
                  <XCircle size={14} /> Cancel Booking
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => confirmHotelBooking(selected.id)}
                >
                  <CheckCircle size={14} /> Confirm Booking
                </button>
              </>
            )}
            {selected?.status === "confirmed" && (
              <button
                className="btn btn-danger"
                onClick={() => cancelHotelBooking(selected.id)}
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
                background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
                borderRadius: 12,
                padding: "20px",
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {selected.hotel}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 6,
                  opacity: 0.8,
                  fontSize: 13,
                }}
              >
                <MapPin size={13} /> {selected.city}
              </div>
            </div>
            <div className="grid-2" style={{ gap: 10 }}>
              {[
                { label: "Guest Name", val: selected.user },
                { label: "Check-in", val: selected.checkin },
                { label: "Checkout", val: selected.checkout },
                { label: "Rooms Required", val: selected.rooms },
                { label: "Total Nights", val: selected.nights },
                { label: "Paid Amount", val: selected.amount },
                { label: "Booking Status", val: selected.status },
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

      {/* Book Hotel / Edit Hotel Modal */}
      <Modal
        open={addOpen || editOpen}
        onClose={() => {
          setAddOpen(false);
          setEditOpen(false);
        }}
        title={editOpen ? "Edit Hotel Booking" : "Create Manual Hotel Booking"}
      >
        <form
          onSubmit={handleSaveHotel}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Guest Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Priyan Sharma"
              value={formHotel.user}
              onChange={(e) =>
                setFormHotel({ ...formHotel, user: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hotel Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Taj Mahal Palace"
              value={formHotel.hotel}
              onChange={(e) =>
                setFormHotel({ ...formHotel, hotel: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mumbai"
              value={formHotel.city}
              onChange={(e) =>
                setFormHotel({ ...formHotel, city: e.target.value })
              }
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Check-in Date *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 14 Jul"
                value={formHotel.checkin}
                onChange={(e) =>
                  setFormHotel({ ...formHotel, checkin: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Check-out Date *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 17 Jul"
                value={formHotel.checkout}
                onChange={(e) =>
                  setFormHotel({ ...formHotel, checkout: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid-3" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Nights</label>
              <input
                type="number"
                className="form-input"
                min={1}
                value={formHotel.nights}
                onChange={(e) =>
                  setFormHotel({
                    ...formHotel,
                    nights: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rooms</label>
              <input
                type="number"
                className="form-input"
                min={1}
                value={formHotel.rooms}
                onChange={(e) =>
                  setFormHotel({
                    ...formHotel,
                    rooms: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Booking Status</label>
              <select
                className="form-input form-select"
                value={formHotel.status}
                onChange={(e) =>
                  setFormHotel({ ...formHotel, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Total Amount Paid *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 45000"
              value={formHotel.amount}
              onChange={(e) =>
                setFormHotel({ ...formHotel, amount: e.target.value })
              }
              required
            />
          </div>
          <TagSelector
            label="Tags"
            value={formHotel.tags || []}
            onChange={(tags) => setFormHotel({ ...formHotel, tags })}
            suggestions={HOTEL_TAGS}
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
              {editOpen ? "Save Changes" : "Reserve Hotel"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* =================== CABS PAGE =================== */
export function Cabs() {
  const { addToast } = useApp();
  const [tab, setTab] = useState("rides");
  const [rides, setRides] = useState(mockCabBookings);
  const [search, setSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const location = useLocation();

  // Pagination states
  const [ridesPage, setRidesPage] = useState(1);
  const [driversPage, setDriversPage] = useState(1);
  const [vehiclesPage, setVehiclesPage] = useState(1);

  // View Mode states
  const [ridesViewMode, setRidesViewMode] = useState("table");
  const [driversViewMode, setDriversViewMode] = useState("table");
  const [vehiclesViewMode, setVehiclesViewMode] = useState("table");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    const q = params.get("search");
    setTimeout(() => {
      if (tabParam) {
        setTab(tabParam);
      }
      if (q) {
        if (tabParam === "drivers") {
          setDriverSearch(q);
          setDriversPage(1);
        } else if (tabParam === "vehicles") {
          setVehicleSearch(q);
          setVehiclesPage(1);
        } else {
          setSearch(q);
          setRidesPage(1);
        }
      }
    }, 0);
  }, [location.search]);

  // Detailed compliance drivers database with profile photos
  const [drivers, setDrivers] = useState([
    {
      id: "DRV001",
      name: "Ramu Kumar",
      phone: "+91 98400 11223",
      vehicle: "Swift Dzire",
      plate: "KL07AE4521",
      status: "active",
      rating: 4.8,
      rides: 1240,
      joined: "2022-03-10",
      city: "Kochi",
      aadhar: "4532 9012 8834",
      pan: "ABCDE1234F",
      dlNumber: "KL-0720150082341",
      dlExpiry: "2030-05-20",
      policeVerification: "completed",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      id: "DRV002",
      name: "Suresh Pillai",
      phone: "+91 94471 22334",
      vehicle: "Innova Crysta",
      plate: "KL09BC8812",
      status: "busy",
      rating: 4.6,
      rides: 892,
      joined: "2023-01-05",
      city: "Kochi",
      aadhar: "5821 3349 9012",
      pan: "FGHIJ5678K",
      dlNumber: "KL-0920180029342",
      dlExpiry: "2029-08-14",
      policeVerification: "completed",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
    {
      id: "DRV003",
      name: "Mohan Das",
      phone: "+91 90211 33445",
      vehicle: "Toyota Etios",
      plate: "MH01ZZ9923",
      status: "active",
      rating: 4.9,
      rides: 2105,
      joined: "2021-11-12",
      city: "Mumbai",
      aadhar: "2294 8832 1190",
      pan: "LMNOP9012Q",
      dlNumber: "MH-0120100054231",
      dlExpiry: "2028-11-10",
      policeVerification: "completed",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
    {
      id: "DRV004",
      name: "Rajesh Tiwari",
      phone: "+91 88012 44556",
      vehicle: "Swift Dzire",
      plate: "DL05AB3341",
      status: "inactive",
      rating: 4.2,
      rides: 421,
      joined: "2023-07-20",
      city: "Delhi",
      aadhar: "9012 4823 8812",
      pan: "RSTUV3456W",
      dlNumber: "DL-0520190038456",
      dlExpiry: "2027-04-12",
      policeVerification: "pending",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    },
  ]);

  // Detailed compliance vehicles database
  const [vehicles, setVehicles] = useState([
    {
      id: "VEH001",
      model: "Swift Dzire",
      plate: "KL07AE4521",
      rcNumber: "RC-KL07-2022-9012",
      pucExpiry: "2026-12-15",
      insuranceNo: "INS-HDFC-98212",
      insuranceExpiry: "2026-05-20",
      permit: "State Taxi Permit",
      status: "active",
      driver: "Ramu Kumar",
    },
    {
      id: "VEH002",
      model: "Innova Crysta",
      plate: "KL09BC8812",
      rcNumber: "RC-KL09-2023-8812",
      pucExpiry: "2026-09-30",
      insuranceNo: "INS-ICICI-44129",
      insuranceExpiry: "2026-03-12",
      permit: "All India Tourist Permit (AITP)",
      status: "active",
      driver: "Suresh Pillai",
    },
    {
      id: "VEH003",
      model: "Toyota Etios",
      plate: "MH01ZZ9923",
      rcNumber: "RC-MH01-2021-0023",
      pucExpiry: "2026-02-18",
      insuranceNo: "INS-SBI-20098",
      insuranceExpiry: "2026-11-04",
      permit: "State Taxi Permit",
      status: "active",
      driver: "Mohan Das",
    },
    {
      id: "VEH004",
      model: "Swift Dzire",
      plate: "DL05AB3341",
      rcNumber: "RC-DL05-2023-3341",
      pucExpiry: "2025-10-22",
      insuranceNo: "INS-NIA-88210",
      insuranceExpiry: "2026-08-15",
      permit: "Local NCR Taxi Permit",
      status: "inactive",
      driver: "Rajesh Tiwari",
    },
  ]);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Cab manual ride states
  const [addRideOpen, setAddRideOpen] = useState(false);
  const [editRideOpen, setEditRideOpen] = useState(false);
  const [formRide, setFormRide] = useState({
    id: "",
    user: "",
    driver: "Unassigned",
    pickup: "",
    drop: "",
    date: "",
    vehicle: "Swift Dzire",
    amount: "",
    status: "scheduled",
    rating: null,
    tags: [],
  });

  // Driver Onboarding compliance states (Indian Guidelines)
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [editDriverOpen, setEditDriverOpen] = useState(false);
  const [formDriver, setFormDriver] = useState({
    id: "",
    name: "",
    phone: "",
    city: "",
    vehicle: "Unassigned",
    plate: "TBD",
    status: "active",
    rating: 5.0,
    rides: 0,
    joined: "Today",
    aadhar: "",
    pan: "",
    dlNumber: "",
    dlExpiry: "",
    policeVerification: "pending",
    photo: "",
    tags: [],
  });

  // Vehicle Onboarding compliance states
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [editVehicleOpen, setEditVehicleOpen] = useState(false);
  const [formVehicle, setFormVehicle] = useState({
    id: "",
    model: "",
    plate: "",
    rcNumber: "",
    pucExpiry: "",
    insuranceNo: "",
    insuranceExpiry: "",
    permit: "All India Tourist Permit (AITP)",
    status: "active",
    driver: "Unassigned",
    tags: [],
  });

  // Rides handlers
  const handleOpenAddRideModal = () => {
    setFormRide({
      id: `CAB${Math.floor(5500 + Math.random() * 499)}`,
      user: "",
      driver: drivers.length > 0 ? drivers[0].name : "Unassigned",
      pickup: "",
      drop: "",
      date: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      vehicle: "Swift Dzire",
      amount: "₹",
      status: "scheduled",
      rating: null,
      tags: [],
    });
    setAddRideOpen(true);
  };

  const handleOpenEditRideModal = (ride) => {
    setFormRide({ ...ride, tags: ride.tags || [] });
    setEditRideOpen(true);
  };

  const handleSaveRide = (e) => {
    e?.preventDefault();
    if (!formRide.user || !formRide.pickup || !formRide.drop || !formRide.amount) {
      addToast("Please fill all required fields", "error");
      return;
    }
    const formattedAmount = formRide.amount.startsWith("₹")
      ? formRide.amount
      : `₹${formRide.amount}`;
    const cleanRide = { ...formRide, amount: formattedAmount };

    if (editRideOpen) {
      setRides((prev) =>
        prev.map((r) => (r.id === cleanRide.id ? cleanRide : r))
      );
      addToast(`Ride ${cleanRide.id} updated!`, "success");
      setEditRideOpen(false);
    } else {
      setRides((prev) => [cleanRide, ...prev]);
      addToast(`Ride ${cleanRide.id} booked successfully!`, "success");
      setAddRideOpen(false);
    }
  };

  // Drivers Handlers with compliance validation
  const handleOpenAddDriverModal = () => {
    setFormDriver({
      id: `DRV${100 + drivers.length + 1}`,
      name: "",
      phone: "",
      city: "",
      vehicle: "Unassigned",
      plate: "TBD",
      status: "active",
      rating: 5.0,
      rides: 0,
      joined: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      aadhar: "",
      pan: "",
      dlNumber: "",
      dlExpiry: "",
      policeVerification: "pending",
      photo: "",
      tags: [],
    });
    setAddDriverOpen(true);
  };

  const handleOpenEditDriverModal = (driver) => {
    setFormDriver({ ...driver, tags: driver.tags || [] });
    setEditDriverOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast("Image size must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormDriver((prev) => ({ ...prev, photo: reader.result }));
        addToast("Photo uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDriver = (e) => {
    e?.preventDefault();
    if (
      !formDriver.name ||
      !formDriver.phone ||
      !formDriver.aadhar ||
      !formDriver.pan ||
      !formDriver.dlNumber ||
      !formDriver.dlExpiry
    ) {
      addToast("Please provide all required registration documents", "error");
      return;
    }

    // Aadhar Card check (12 Digits/formatting)
    const rawAadhar = formDriver.aadhar.replace(/\s/g, "");
    if (rawAadhar.length !== 12 || isNaN(rawAadhar)) {
      addToast("Aadhar Card must be a valid 12-digit number", "error");
      return;
    }

    // PAN Card check (5 letters, 4 numbers, 1 letter)
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/i;
    if (!panRegex.test(formDriver.pan)) {
      addToast("Please enter a valid 10-character PAN number", "error");
      return;
    }

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
    const finalDriver = {
      ...formDriver,
      photo: formDriver.photo.trim() || defaultAvatar,
    };

    if (editDriverOpen) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === finalDriver.id ? finalDriver : d))
      );
      if (selectedDriver && selectedDriver.id === finalDriver.id) {
        setSelectedDriver(finalDriver);
      }
      addToast(`Driver ${finalDriver.name} compliance logs updated!`, "success");
      setEditDriverOpen(false);
    } else {
      setDrivers((prev) => [finalDriver, ...prev]);
      addToast(`Driver ${finalDriver.name} registered under Indian Motor Act guidelines!`, "success");
      setAddDriverOpen(false);
    }
  };

  // Vehicles Handlers
  const handleOpenAddVehicleModal = () => {
    setFormVehicle({
      id: `VEH${100 + vehicles.length + 1}`,
      model: "",
      plate: "",
      rcNumber: "",
      pucExpiry: "",
      insuranceNo: "",
      insuranceExpiry: "",
      permit: "All India Tourist Permit (AITP)",
      status: "active",
      driver: drivers.length > 0 ? drivers[0].name : "Unassigned",
      tags: [],
    });
    setAddVehicleOpen(true);
  };

  const handleOpenEditVehicleModal = (veh) => {
    setFormVehicle({ ...veh, tags: veh.tags || [] });
    setEditVehicleOpen(true);
  };

  const handleSaveVehicle = (e) => {
    e?.preventDefault();
    if (
      !formVehicle.model ||
      !formVehicle.plate ||
      !formVehicle.rcNumber ||
      !formVehicle.pucExpiry ||
      !formVehicle.insuranceNo ||
      !formVehicle.insuranceExpiry
    ) {
      addToast("Please provide all required vehicle compliance details", "error");
      return;
    }

    if (editVehicleOpen) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === formVehicle.id ? formVehicle : v))
      );
      if (selectedVehicle && selectedVehicle.id === formVehicle.id) {
        setSelectedVehicle(formVehicle);
      }
      addToast(`Vehicle ${formVehicle.plate} records updated!`, "success");
      setEditVehicleOpen(false);
    } else {
      setVehicles((prev) => [formVehicle, ...prev]);
      addToast(`Vehicle ${formVehicle.plate} registered in records database!`, "success");
      setAddVehicleOpen(false);
    }
  };

  const toggleDriverStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: nextStatus } : d))
    );
    if (selectedDriver && selectedDriver.id === id) {
      setSelectedDriver((prev) => ({ ...prev, status: nextStatus }));
    }
    addToast(
      `Driver status set to ${nextStatus}`,
      nextStatus === "active" ? "success" : "warning"
    );
  };

  const toggleVehicleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: nextStatus } : v))
    );
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle((prev) => ({ ...prev, status: nextStatus }));
    }
    addToast(`Vehicle status set to ${nextStatus}`, "success");
  };

  const filteredRides = rides.filter((b) => {
    const s = search.toLowerCase();
    const matchesTags = b.tags && b.tags.some((tag) => tag.toLowerCase().includes(s));
    return (
      b.user.toLowerCase().includes(s) ||
      b.driver.toLowerCase().includes(s) ||
      matchesTags
    );
  });

  const perPage = 10;

  const totalRidesPages = Math.ceil(filteredRides.length / perPage) || 1;
  const currentRidesPage = ridesPage > totalRidesPages ? 1 : ridesPage;
  const paginatedRides = filteredRides.slice((currentRidesPage - 1) * perPage, currentRidesPage * perPage);

  const filteredDrivers = drivers.filter((d) => {
    const s = driverSearch.toLowerCase();
    const matchesTags = d.tags && d.tags.some((tag) => tag.toLowerCase().includes(s));
    return (
      d.name.toLowerCase().includes(s) ||
      d.city.toLowerCase().includes(s) ||
      matchesTags
    );
  });

  const totalDriversPages = Math.ceil(filteredDrivers.length / perPage) || 1;
  const currentDriversPage = driversPage > totalDriversPages ? 1 : driversPage;
  const paginatedDrivers = filteredDrivers.slice((currentDriversPage - 1) * perPage, currentDriversPage * perPage);

  const filteredVehicles = vehicles.filter((v) => {
    const s = vehicleSearch.toLowerCase();
    const matchesTags = v.tags && v.tags.some((tag) => tag.toLowerCase().includes(s));
    return (
      v.model.toLowerCase().includes(s) ||
      v.plate.toLowerCase().includes(s) ||
      matchesTags
    );
  });

  const totalVehiclesPages = Math.ceil(filteredVehicles.length / perPage) || 1;
  const currentVehiclesPage = vehiclesPage > totalVehiclesPages ? 1 : vehiclesPage;
  const paginatedVehicles = filteredVehicles.slice((currentVehiclesPage - 1) * perPage, currentVehiclesPage * perPage);

  return (
    <div>
      <PageHeader
        title="Cab Management"
        subtitle="Manage rides, drivers, vehicles and Indian legal compliance checklists"
        actions={
          tab === "rides" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOpenAddRideModal}
              >
                <Plus size={14} /> Book Cab
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  exportToCSV(filteredRides, "cab_bookings.csv");
                  addToast("Cab bookings exported to CSV!", "success");
                }}
              >
                <Download size={14} /> Export
              </button>
            </div>
          ) : tab === "drivers" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOpenAddDriverModal}
              >
                <Plus size={14} /> Add Driver
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  exportToCSV(filteredDrivers, "drivers_export.csv");
                  addToast("Drivers list exported to CSV!", "success");
                }}
              >
                <Download size={14} /> Export
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOpenAddVehicleModal}
              >
                <Plus size={14} /> Register Vehicle
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  exportToCSV(filteredVehicles, "vehicles_export.csv");
                  addToast("Vehicles list exported to CSV!", "success");
                }}
              >
                <Download size={14} /> Export
              </button>
            </div>
          )
        }
      />

      <div className="tabs">
        {["rides", "drivers", "vehicles"].map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
            style={{ textTransform: "capitalize" }}
          >
            {t === "rides" ? "🚖 Rides" : t === "drivers" ? "🧑‍✈️ Drivers" : "🚘 Vehicles"}
          </button>
        ))}
      </div>

      {tab === "rides" && (
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="card-title">All Cab Rides</span>
            <div className="view-toggle-group">
              <button
                className={`view-toggle-btn${ridesViewMode === "table" ? " active" : ""}`}
                onClick={() => setRidesViewMode("table")}
                title="Table View"
              >
                <List size={14} /> Table
              </button>
              <button
                className={`view-toggle-btn${ridesViewMode === "grid" ? " active" : ""}`}
                onClick={() => setRidesViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
            </div>
          </div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            <TableFilters search={search} onSearch={(s) => { setSearch(s); setRidesPage(1); }} />
            
            {ridesViewMode === "table" ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ride ID</th>
                      <th>Passenger</th>
                      <th>Driver Assigned</th>
                      <th>Route</th>
                      <th>Vehicle</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Rating</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRides.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          style={{
                            textAlign: "center",
                            padding: 24,
                            color: "var(--text-muted)",
                          }}
                        >
                          No cab rides found
                        </td>
                      </tr>
                    )}
                    {paginatedRides.map((r) => (
                      <tr key={r.id}>
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--success-600)",
                          }}
                        >
                          {r.id}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{r.user}</div>
                          {r.tags && r.tags.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              {r.tags.map((t) => (
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
                        <td style={{ fontSize: 13, fontWeight: 600 }}>
                          {r.driver}
                        </td>
                        <td>
                          <div style={{ fontSize: 12 }}>
                            <div style={{ fontWeight: 500 }}>{r.pickup}</div>
                            <div style={{ color: "var(--text-muted)" }}>
                              → {r.drop}
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 12 }}>{r.vehicle}</td>
                        <td style={{ fontWeight: 700 }}>{r.amount}</td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                        <td>
                          {r.rating ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              <Star
                                size={12}
                                style={{ color: "#f59e0b", fill: "#f59e0b" }}
                              />
                              {r.rating}
                            </div>
                          ) : (
                            <span
                              style={{ color: "var(--text-muted)", fontSize: 12 }}
                            >
                              —
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Edit / Assign Driver"
                            onClick={() => handleOpenEditRideModal(r)}
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid-2" style={{ gap: 16, marginTop: 10 }}>
                {paginatedRides.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                    No cab rides found
                  </div>
                )}
                {paginatedRides.map((r) => (
                  <div key={r.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--success-600)" }}>{r.id}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: "var(--text-primary)" }}>{r.user}</div>
                        {r.tags && r.tags.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                            {r.tags.map((t) => (
                              <span
                                key={t}
                                style={{
                                  fontSize: 9,
                                  background: "rgba(16, 185, 129, 0.1)",
                                  color: "var(--success-700)",
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
                      <StatusBadge status={r.status} />
                    </div>

                    <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div><span style={{ color: "var(--text-muted)" }}>From:</span> <strong>{r.pickup}</strong></div>
                        <div><span style={{ color: "var(--text-muted)" }}>To:</span> <strong>{r.drop}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Driver:</span> <strong style={{ color: "var(--text-secondary)" }}>{r.driver}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Vehicle:</span> <strong style={{ color: "var(--text-secondary)" }}>{r.vehicle}</strong>
                      </div>
                      {r.rating && (
                        <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: "var(--text-muted)" }}>Rating:</span>
                          <Star size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                          <strong style={{ color: "var(--text-secondary)" }}>{r.rating} / 5</strong>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Fare Amount</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--success-600)" }}>{r.amount}</div>
                      </div>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Edit / Assign Driver"
                        onClick={() => handleOpenEditRideModal(r)}
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination
              page={currentRidesPage}
              total={filteredRides.length}
              perPage={perPage}
              onChange={setRidesPage}
            />
          </div>
        </div>
      )}

      {tab === "drivers" && (
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="card-title">Driver Registry</span>
            <div className="view-toggle-group">
              <button
                className={`view-toggle-btn${driversViewMode === "table" ? " active" : ""}`}
                onClick={() => setDriversViewMode("table")}
                title="Table View"
              >
                <List size={14} /> Table
              </button>
              <button
                className={`view-toggle-btn${driversViewMode === "grid" ? " active" : ""}`}
                onClick={() => setDriversViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
            </div>
          </div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            <TableFilters search={driverSearch} onSearch={(s) => { setDriverSearch(s); setDriversPage(1); }} />
            
            {driversViewMode === "table" ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Driver Name</th>
                      <th>Contact</th>
                      <th>Verification</th>
                      <th>DL Expiry</th>
                      <th>Status</th>
                      <th>Rating</th>
                      <th>Total Rides</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDrivers.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          style={{
                            textAlign: "center",
                            padding: 24,
                            color: "var(--text-muted)",
                          }}
                        >
                          No drivers registered
                        </td>
                      </tr>
                    )}
                    {paginatedDrivers.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <Avatar name={d.name} size="sm" src={d.photo} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>
                                {d.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {d.id}
                              </div>
                              {d.tags && d.tags.length > 0 && (
                                <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                                  {d.tags.map((t) => (
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
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 12 }}>{d.phone}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {d.policeVerification === "completed" ? (
                              <span
                                style={{
                                  fontSize: 11,
                                  background: "rgba(34, 197, 94, 0.15)",
                                  color: "var(--success-700)",
                                  padding: "2px 8px",
                                  borderRadius: "var(--radius-full)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 3,
                                  fontWeight: 600,
                                }}
                              >
                                <ShieldCheck size={11} /> Verified
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 11,
                                  background: "rgba(245, 158, 11, 0.15)",
                                  color: "var(--warning-700)",
                                  padding: "2px 8px",
                                  borderRadius: "var(--radius-full)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 3,
                                  fontWeight: 600,
                                }}
                              >
                                <AlertTriangle size={11} /> Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontSize: 12, fontFamily: "monospace" }}>
                          {d.dlExpiry}
                        </td>
                        <td>
                          <StatusBadge status={d.status} />
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <Star
                              size={12}
                              style={{ color: "#f59e0b", fill: "#f59e0b" }}
                            />
                            {d.rating}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {d.rides.toLocaleString()}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedDriver(d)}
                            >
                              Details
                            </button>
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Edit Driver Profile"
                              onClick={() => handleOpenEditDriverModal(d)}
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
                {paginatedDrivers.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                    No drivers registered
                  </div>
                )}
                {paginatedDrivers.map((d) => (
                  <div key={d.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={d.name} size="md" src={d.photo} />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{d.name}</div>
                          <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{d.id}</div>
                          {d.tags && d.tags.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              {d.tags.map((t) => (
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
                      </div>
                      <StatusBadge status={d.status} />
                    </div>

                    <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div><span style={{ color: "var(--text-muted)" }}>Phone:</span> <strong>{d.phone}</strong></div>
                        <div><span style={{ color: "var(--text-muted)" }}>DL Expiry:</span> <strong style={{ fontFamily: "monospace" }}>{d.dlExpiry}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Total Rides:</span> <strong style={{ color: "var(--text-secondary)" }}>{d.rides}</strong>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <span style={{ color: "var(--text-muted)" }}>Rating:</span>
                        <Star size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                        <strong style={{ color: "var(--text-secondary)" }}>{d.rating}</strong>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <span style={{ color: "var(--text-muted)" }}>Verification:</span>{" "}
                        {d.policeVerification === "completed" ? (
                          <span style={{ color: "var(--success-600)", fontWeight: 600 }}>Verified ✓</span>
                        ) : (
                          <span style={{ color: "var(--warning-600)", fontWeight: 600 }}>Pending ⚠️</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedDriver(d)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Edit Driver Profile"
                        onClick={() => handleOpenEditDriverModal(d)}
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination
              page={currentDriversPage}
              total={filteredDrivers.length}
              perPage={perPage}
              onChange={setDriversPage}
            />
          </div>
        </div>
      )}

      {tab === "vehicles" && (
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="card-title">Vehicles Inventory Registry</span>
            <div className="view-toggle-group">
              <button
                className={`view-toggle-btn${vehiclesViewMode === "table" ? " active" : ""}`}
                onClick={() => setVehiclesViewMode("table")}
                title="Table View"
              >
                <List size={14} /> Table
              </button>
              <button
                className={`view-toggle-btn${vehiclesViewMode === "grid" ? " active" : ""}`}
                onClick={() => setVehiclesViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
            </div>
          </div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            <TableFilters search={vehicleSearch} onSearch={(s) => { setVehicleSearch(s); setVehiclesPage(1); }} />
            
            {vehiclesViewMode === "table" ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Model / Make</th>
                      <th>Registration No.</th>
                      <th>RC Book Number</th>
                      <th>PUC Certificate</th>
                      <th>Permit Type</th>
                      <th>Driver</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVehicles.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          style={{
                            textAlign: "center",
                            padding: 24,
                            color: "var(--text-muted)",
                          }}
                        >
                          No registered vehicles found
                        </td>
                      </tr>
                    )}
                    {paginatedVehicles.map((v) => {
                      const isPucExpiring = new Date(v.pucExpiry) < new Date();
                      return (
                        <tr key={v.id}>
                          <td
                            style={{
                              fontFamily: "monospace",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--brand-600)",
                            }}
                          >
                            {v.id}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{v.model}</div>
                            {v.tags && v.tags.length > 0 && (
                              <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                                {v.tags.map((t) => (
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
                          <td style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--text-primary)" }}>{v.plate}</td>
                          <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v.rcNumber}</td>
                          <td>
                            <span
                              style={{
                                fontSize: 11,
                                background: isPucExpiring ? "rgba(239, 68, 68, 0.15)" : "var(--gray-100)",
                                color: isPucExpiring ? "var(--danger-700)" : "var(--text-secondary)",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-full)",
                                fontWeight: 600,
                              }}
                            >
                              {v.pucExpiry} {isPucExpiring && "⚠️ Expired"}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, fontWeight: 500 }}>{v.permit}</td>
                          <td style={{ fontWeight: 600, fontSize: 12 }}>{v.driver}</td>
                          <td>
                            <StatusBadge status={v.status} />
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 4 }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setSelectedVehicle(v)}
                              >
                                Details
                              </button>
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                title="Edit Vehicle Specs"
                                onClick={() => handleOpenEditVehicleModal(v)}
                              >
                                <Edit size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid-2" style={{ gap: 16, marginTop: 10 }}>
                {paginatedVehicles.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                    No registered vehicles found
                  </div>
                )}
                {paginatedVehicles.map((v) => {
                  const isPucExpiring = new Date(v.pucExpiry) < new Date();
                  return (
                    <div key={v.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--brand-600)" }}>{v.id}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: "var(--text-primary)" }}>{v.model}</div>
                          {v.tags && v.tags.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                              {v.tags.map((t) => (
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
                        <StatusBadge status={v.status} />
                      </div>

                      <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div><span style={{ color: "var(--text-muted)" }}>Registration No:</span> <strong style={{ fontFamily: "monospace" }}>{v.plate}</strong></div>
                          <div><span style={{ color: "var(--text-muted)" }}>RC Book No:</span> <strong>{v.rcNumber}</strong></div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                        <div style={{ gridColumn: "span 2" }}>
                          <span style={{ color: "var(--text-muted)" }}>Permit:</span> <strong style={{ color: "var(--text-secondary)" }}>{v.permit}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Driver:</span> <strong style={{ color: "var(--text-secondary)" }}>{v.driver}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>PUC Certificate:</span>{" "}
                          <span
                            style={{
                              fontSize: 11,
                              background: isPucExpiring ? "rgba(239, 68, 68, 0.15)" : "var(--gray-100)",
                              color: isPucExpiring ? "var(--danger-700)" : "var(--text-secondary)",
                              padding: "2px 8px",
                              borderRadius: "var(--radius-full)",
                              fontWeight: 600,
                              display: "inline-block",
                              marginTop: 2
                            }}
                          >
                            {v.pucExpiry} {isPucExpiring && "⚠️"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedVehicle(v)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Edit Vehicle Specs"
                          onClick={() => handleOpenEditVehicleModal(v)}
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination
              page={currentVehiclesPage}
              total={filteredVehicles.length}
              perPage={perPage}
              onChange={setVehiclesPage}
            />
          </div>
        </div>
      )}

      {/* Driver Details / Indian Compliance Modal */}
      <Modal
        open={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title="Driver Profile & Verification Records"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedDriver(null)}
            >
              Close
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const d = selectedDriver;
                setSelectedDriver(null);
                handleOpenEditDriverModal(d);
              }}
            >
              <Edit size={14} style={{ marginRight: 4 }} /> Edit Profile
            </button>
            {selectedDriver && (
              <button
                className="btn btn-danger"
                onClick={() =>
                  toggleDriverStatus(selectedDriver.id, selectedDriver.status)
                }
              >
                {selectedDriver.status === "active" ? "Deactivate" : "Activate"}
              </button>
            )}
          </>
        }
      >
        {selectedDriver && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={selectedDriver.name} size="xl" src={selectedDriver.photo} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {selectedDriver.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {selectedDriver.phone} · {selectedDriver.city}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  {selectedDriver.policeVerification === "completed" ? (
                    <span style={{ fontSize: 11, background: "rgba(34,197,94,.15)", color: "var(--success-700)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                      ✓ Police Verified
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, background: "rgba(245,158,11,.15)", color: "var(--warning-700)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                      ⚠ Police Background Check Pending
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Joined: {selectedDriver.joined}
                  </span>
                </div>
              </div>
            </div>

            {/* Indian Regulatory Compliance Documents */}
            <div style={{ background: "var(--bg-hover)", borderRadius: 10, padding: 14, border: "1px solid var(--border-default)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-700)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={13} /> Indian Govt Compliance Documents
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Aadhar Card UID (UIDAI)</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", marginTop: 2 }}>{selectedDriver.aadhar || "Not Provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Income Tax PAN Number</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", marginTop: 2, textTransform: "uppercase" }}>{selectedDriver.pan || "Not Provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Commercial Driving License (DL)</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", marginTop: 2, textTransform: "uppercase" }}>{selectedDriver.dlNumber || "Not Provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>DL License Expiry</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedDriver.dlExpiry || "TBD"}</div>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 10 }}>
              {[
                { label: "Driver ID", val: selectedDriver.id },
                { label: "Vehicle Assigned", val: `${selectedDriver.vehicle} (${selectedDriver.plate})` },
                { label: "Profile Status", val: selectedDriver.status },
                { label: "Rating Metric", val: `${selectedDriver.rating} ★ (${selectedDriver.rides} rides)` },
                { label: "Tags", val: selectedDriver.tags && selectedDriver.tags.length > 0 ? selectedDriver.tags.join(", ") : "None" },
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

      {/* Vehicle Details Modal */}
      <Modal
        open={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title="Vehicle Compliance & Registration Certificate"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedVehicle(null)}
            >
              Close
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const v = selectedVehicle;
                setSelectedVehicle(null);
                handleOpenEditVehicleModal(v);
              }}
            >
              <Edit size={14} style={{ marginRight: 4 }} /> Edit Details
            </button>
            {selectedVehicle && (
              <button
                className="btn btn-danger"
                onClick={() =>
                  toggleVehicleStatus(selectedVehicle.id, selectedVehicle.status)
                }
              >
                {selectedVehicle.status === "active" ? "Set Inactive" : "Set Active"}
              </button>
            )}
          </>
        }
      >
        {selectedVehicle && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: 12,
                padding: "20px",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                {selectedVehicle.model}
              </div>
              <div style={{ fontSize: 14, fontFamily: "monospace", marginTop: 4, opacity: 0.9 }}>
                {selectedVehicle.plate} (REGISTRATION ID: {selectedVehicle.id})
              </div>
            </div>

            {/* Indian RTO Regulatory Documents */}
            <div style={{ background: "var(--bg-hover)", borderRadius: 10, padding: 14, border: "1px solid var(--border-default)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-700)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={13} /> RTO Regulatory Documents
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>RC Number</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", marginTop: 2, textTransform: "uppercase" }}>{selectedVehicle.rcNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>PUC Certificate Expiry</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", marginTop: 2 }}>{selectedVehicle.pucExpiry}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Commercial Insurance Policy</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", marginTop: 2, textTransform: "uppercase" }}>{selectedVehicle.insuranceNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Insurance Expiry Date</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedVehicle.insuranceExpiry}</div>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 10 }}>
              {[
                { label: "State Transport Permit", val: selectedVehicle.permit },
                { label: "Assigned Driver", val: selectedVehicle.driver },
                { label: "Active Fleet Status", val: selectedVehicle.status },
                { label: "Tags", val: selectedVehicle.tags && selectedVehicle.tags.length > 0 ? selectedVehicle.tags.join(", ") : "None" },
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

      {/* Book Cab Ride Modal */}
      <Modal
        open={addRideOpen || editRideOpen}
        onClose={() => {
          setAddRideOpen(false);
          setEditRideOpen(false);
        }}
        title={editRideOpen ? "Edit Cab Ride Booking" : "Create Manual Cab Booking"}
      >
        <form
          onSubmit={handleSaveRide}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Passenger Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Aarav Sharma"
              value={formRide.user}
              onChange={(e) =>
                setFormRide({ ...formRide, user: e.target.value })
              }
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Pick-up Location *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CP Delhi"
                value={formRide.pickup}
                onChange={(e) =>
                  setFormRide({ ...formRide, pickup: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Drop Location *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DEL Airport"
                value={formRide.drop}
                onChange={(e) =>
                  setFormRide({ ...formRide, drop: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Assign Driver</label>
              <select
                className="form-input form-select"
                value={formRide.driver}
                onChange={(e) =>
                  setFormRide({ ...formRide, driver: e.target.value })
                }
              >
                <option value="Unassigned">Unassigned</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.city} - {d.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select
                className="form-input form-select"
                value={formRide.vehicle}
                onChange={(e) =>
                  setFormRide({ ...formRide, vehicle: e.target.value })
                }
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={`${v.model} (${v.plate})`}>
                    {v.model} - {v.plate}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid-3" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 16 Jul 2025 04:00"
                value={formRide.date}
                onChange={(e) =>
                  setFormRide({ ...formRide, date: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fare Amount *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 1100"
                value={formRide.amount}
                onChange={(e) =>
                  setFormRide({ ...formRide, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ride Status</label>
              <select
                className="form-input form-select"
                value={formRide.status}
                onChange={(e) =>
                  setFormRide({ ...formRide, status: e.target.value })
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <TagSelector
            label="Tags"
            value={formRide.tags || []}
            onChange={(tags) => setFormRide({ ...formRide, tags })}
            suggestions={CAB_TAGS}
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
                setAddRideOpen(false);
                setEditRideOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editRideOpen ? "Save Ride" : "Confirm Cab"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Onboard Driver with Indian Compliance documents */}
      <Modal
        open={addDriverOpen || editDriverOpen}
        onClose={() => {
          setAddDriverOpen(false);
          setEditDriverOpen(false);
        }}
        title={editDriverOpen ? "Edit Driver Compliance Dossier" : "Indian MV Act - Onboard New Driver"}
      >
        <form
          onSubmit={handleSaveDriver}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: 8, padding: 12, fontSize: 12, color: "var(--brand-700)" }}>
            <strong>Regulatory Requirements:</strong> Under the Indian Motor Vehicles Act guidelines, UID Aadhar, Income Tax PAN card, and commercial Driving License documentation checks are mandatory.
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: "block", marginBottom: 6 }}>Driver Profile Photo *</label>
            <div style={{ display: "flex", gap: 16, alignItems: "center", background: "var(--bg-hover)", padding: 12, borderRadius: 8, border: "1px solid var(--border-default)" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gray-200)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border-default)" }}>
                {formDriver.photo ? (
                  <img src={formDriver.photo} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>NO PHOTO</span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                  id="driver-photo-upload-input"
                />
                <label
                  htmlFor="driver-photo-upload-input"
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: "pointer", display: "inline-flex", alignSelf: "flex-start", gap: 4, alignItems: "center" }}
                >
                  📤 Upload Photo File
                </label>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Max size 2MB (JPG, PNG, WebP)</span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Or specify a photo URL link:</span>
              <input
                className="form-input"
                style={{ marginTop: 4 }}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                value={formDriver.photo.startsWith("data:") ? "" : formDriver.photo}
                onChange={(e) =>
                  setFormDriver({ ...formDriver, photo: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Driver Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Ramesh Kumar"
              value={formDriver.name}
              onChange={(e) =>
                setFormDriver({ ...formDriver, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={formDriver.phone}
                onChange={(e) =>
                  setFormDriver({ ...formDriver, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Base City Office *</label>
              <input
                className="form-input"
                placeholder="e.g. Kochi"
                value={formDriver.city}
                onChange={(e) =>
                  setFormDriver({ ...formDriver, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-700)" }}>Indian Identity & Commercial DL Verification</span>
            <div className="grid-2" style={{ gap: 12, marginTop: 8 }}>
              <div className="form-group">
                <label className="form-label">12-Digit Aadhar UIDAI *</label>
                <input
                  className="form-input"
                  placeholder="xxxx xxxx xxxx"
                  value={formDriver.aadhar}
                  onChange={(e) =>
                    setFormDriver({ ...formDriver, aadhar: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">PAN Card Number *</label>
                <input
                  className="form-input"
                  placeholder="e.g. ABCDE1234F"
                  maxLength={10}
                  value={formDriver.pan}
                  onChange={(e) =>
                    setFormDriver({ ...formDriver, pan: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid-2" style={{ gap: 12, marginTop: 8 }}>
              <div className="form-group">
                <label className="form-label">Commercial DL ID *</label>
                <input
                  className="form-input"
                  placeholder="e.g. DL-1420180098234"
                  value={formDriver.dlNumber}
                  onChange={(e) =>
                    setFormDriver({ ...formDriver, dlNumber: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">DL Expiry Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formDriver.dlExpiry}
                  onChange={(e) =>
                    setFormDriver({ ...formDriver, dlExpiry: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Police Verification Check</label>
              <select
                className="form-input form-select"
                value={formDriver.policeVerification}
                onChange={(e) =>
                  setFormDriver({ ...formDriver, policeVerification: e.target.value })
                }
              >
                <option value="pending">Verification Pending</option>
                <option value="completed">Completed / Clean Background</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select
                className="form-input form-select"
                value={formDriver.status}
                onChange={(e) =>
                  setFormDriver({ ...formDriver, status: e.target.value })
                }
              >
                <option value="active">Active (Available)</option>
                <option value="busy">Busy (On Duty)</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Assigned Vehicle</label>
              <select
                className="form-input form-select"
                value={formDriver.plate}
                onChange={(e) => {
                  const selectVeh = vehicles.find(v => v.plate === e.target.value);
                  setFormDriver({
                    ...formDriver,
                    plate: e.target.value,
                    vehicle: selectVeh ? selectVeh.model : "Unassigned"
                  });
                }}
              >
                <option value="TBD">Unassigned</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.plate}>{v.model} - {v.plate}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Completed Rides</label>
              <input
                type="number"
                className="form-input"
                value={formDriver.rides}
                onChange={(e) =>
                  setFormDriver({
                    ...formDriver,
                    rides: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <TagSelector
            label="Tags"
            value={formDriver.tags || []}
            onChange={(tags) => setFormDriver({ ...formDriver, tags })}
            suggestions={DRIVER_TAGS}
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
                setAddDriverOpen(false);
                setEditDriverOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editDriverOpen ? "Save Dossier" : "Add Dossier"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Register Vehicle Modal */}
      <Modal
        open={addVehicleOpen || editVehicleOpen}
        onClose={() => {
          setAddVehicleOpen(false);
          setEditVehicleOpen(false);
        }}
        title={editVehicleOpen ? "Edit Vehicle Regulatory Dossier" : "Register Fleet Vehicle (RTO Checks)"}
      >
        <form
          onSubmit={handleSaveVehicle}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Make & Model *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maruti Suzuki Swift Dzire"
              value={formVehicle.model}
              onChange={(e) => setFormVehicle({ ...formVehicle, model: e.target.value })}
              required
            />
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">License Plate No. *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DL 1C A 1234"
                value={formVehicle.plate}
                onChange={(e) => setFormVehicle({ ...formVehicle, plate: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">RC Certificate Book No. *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. RC-DL05-2023-3341"
                value={formVehicle.rcNumber}
                onChange={(e) => setFormVehicle({ ...formVehicle, rcNumber: e.target.value.toUpperCase() })}
                required
              />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">PUC Expiry Date *</label>
              <input
                type="date"
                className="form-input"
                value={formVehicle.pucExpiry}
                onChange={(e) => setFormVehicle({ ...formVehicle, pucExpiry: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Commercial Insurance Policy No. *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. INS-NIA-88210"
                value={formVehicle.insuranceNo}
                onChange={(e) => setFormVehicle({ ...formVehicle, insuranceNo: e.target.value.toUpperCase() })}
                required
              />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Insurance Expiry Date *</label>
              <input
                type="date"
                className="form-input"
                value={formVehicle.insuranceExpiry}
                onChange={(e) => setFormVehicle({ ...formVehicle, insuranceExpiry: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">State Permit Classification</label>
              <select
                className="form-input form-select"
                value={formVehicle.permit}
                onChange={(e) => setFormVehicle({ ...formVehicle, permit: e.target.value })}
              >
                <option value="All India Tourist Permit (AITP)">All India Tourist Permit (AITP)</option>
                <option value="State Taxi Permit">State Taxi Permit</option>
                <option value="Local NCR Taxi Permit">Local NCR Taxi Permit</option>
              </select>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Assigned Driver</label>
              <select
                className="form-input form-select"
                value={formVehicle.driver}
                onChange={(e) => setFormVehicle({ ...formVehicle, driver: e.target.value })}
              >
                <option value="Unassigned">Unassigned</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Operational Status</label>
              <select
                className="form-input form-select"
                value={formVehicle.status}
                onChange={(e) => setFormVehicle({ ...formVehicle, status: e.target.value })}
              >
                <option value="active">Active (On Duty)</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">In Shop (Maintenance)</option>
              </select>
            </div>
          </div>
          <TagSelector
            label="Tags"
            value={formVehicle.tags || []}
            onChange={(tags) => setFormVehicle({ ...formVehicle, tags })}
            suggestions={VEHICLE_TAGS}
          />
          <div style={{ display: "flex", gap: 10, justifySelf: "end", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setAddVehicleOpen(false);
                setEditVehicleOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editVehicleOpen ? "Save Registration" : "Complete Registration"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
