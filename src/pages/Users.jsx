import { useState } from "react";
import {
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  PageHeader,
  StatusBadge,
  Avatar,
  TableFilters,
  Pagination,
} from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import {
  mockUsers,
  mockFlightBookings,
  mockHotelBookings,
  mockCabBookings,
  mockTickets,
  mockTransactions,
} from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";

// Helpers to generate user-specific bus and package bookings since they are not in the main database
const getBuses = (userName) => {
  const busBookingsMap = {
    "Aarav Sharma": [
      {
        id: "BUS2991",
        operator: "Zingbus",
        route: "Delhi → Jaipur",
        date: "25 Jul 2025",
        seat: "A3 (Sleeper)",
        price: "₹899",
        status: "confirmed",
      },
      {
        id: "BUS2992",
        operator: "IntrCity SmartBus",
        route: "Jaipur → Delhi",
        date: "28 Jul 2025",
        seat: "A4 (Sleeper)",
        price: "₹950",
        status: "confirmed",
      },
    ],
    "Priya Mehta": [
      {
        id: "BUS3010",
        operator: "Neeta Travels",
        route: "Mumbai → Pune",
        date: "18 Jul 2025",
        seat: "B12 (AC)",
        price: "₹550",
        status: "confirmed",
      },
    ],
    "Sneha Kapoor": [
      {
        id: "BUS4501",
        operator: "VRL Travels",
        route: "Delhi → Manali",
        date: "05 Aug 2025",
        seat: "C1 (Sleeper)",
        price: "₹1,450",
        status: "confirmed",
      },
    ],
  };
  return busBookingsMap[userName] || [];
};

const getPackages = (userName) => {
  const userPkgs = [];
  if (userName === "Sneha Kapoor") {
    userPkgs.push({
      id: "PKG-BKG-881",
      pkgId: "PKG002",
      name: "Rajasthan Royal Trail",
      date: "15 Jul 2025",
      price: "₹38,500",
      status: "pending",
    });
  }
  if (userName === "Aarav Sharma") {
    userPkgs.push({
      id: "PKG-BKG-882",
      pkgId: "PKG001",
      name: "Kerala Backwaters Escape",
      date: "10 Jul 2025",
      price: "₹24,999",
      status: "confirmed",
    });
  }
  return userPkgs;
};

export default function Users() {
  const { addToast } = useApp();
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [selected, setSelected] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formUser, setFormUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    status: "active",
  });

  const toggleBlockUser = (id, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );
    if (selected && selected.id === id) {
      setSelected((prev) => ({ ...prev, status: newStatus }));
    }
    const uName = users.find((u) => u.id === id)?.name || "User";
    addToast(
      `${uName} ${newStatus === "blocked" ? "blocked" : "unblocked"}`,
      newStatus === "blocked" ? "warning" : "success",
    );
  };

  const deleteUser = (id, name) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast(`${name} deleted successfully`, "error");
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSelectUser = (u) => {
    setSelected(u);
    setActiveDetailTab("overview");
  };

  const handleOpenAddModal = () => {
    setFormMode("create");
    setFormUser({ id: "", name: "", email: "", phone: "", status: "active" });
    setFormOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setFormMode("edit");
    setFormUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
    });
    setFormOpen(true);
  };

  const handleSaveUser = (e) => {
    e?.preventDefault();
    if (!formUser.name || !formUser.email || !formUser.phone) {
      addToast("Please fill in all fields", "error");
      return;
    }

    if (formMode === "create") {
      const newId = `USR${String(users.length + 1).padStart(3, "0")}`;
      const options = { day: "numeric", month: "short", year: "numeric" };
      const todayStr = new Date().toLocaleDateString("en-GB", options);

      const newUser = {
        id: newId,
        name: formUser.name,
        email: formUser.email,
        phone: formUser.phone,
        status: formUser.status,
        bookings: 0,
        spent: "₹0",
        joined: todayStr,
        avatar: formUser.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };
      setUsers((prev) => [newUser, ...prev]);
      addToast(`User ${formUser.name} created successfully!`, "success");
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === formUser.id ? { ...u, ...formUser } : u)),
      );
      addToast(`User ${formUser.name} updated successfully!`, "success");
      if (selected && selected.id === formUser.id) {
        setSelected((prev) => ({ ...prev, ...formUser }));
      }
    }
    setFormOpen(false);
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const ITEMS_PER_PAGE = 10;
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // If a user profile is selected, show their full profile page view
  if (selected) {
    const userFlights = mockFlightBookings.filter(
      (b) => b.user === selected.name,
    );
    const userHotels = mockHotelBookings.filter(
      (b) => b.user === selected.name,
    );
    const userCabs = mockCabBookings.filter((b) => b.user === selected.name);
    const userTickets = mockTickets.filter((b) => b.user === selected.name);
    const userTransactions = mockTransactions.filter(
      (b) => b.user === selected.name,
    );
    const userBuses = getBuses(selected.name);
    const userPkgs = getPackages(selected.name);

    return (
      <div>
        {/* Navigation & Header Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelected(null)}
            >
              ← Back to Users
            </button>
            <h1 className="section-title" style={{ margin: 0 }}>
              User Profile
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleOpenEditModal(selected)}
            >
              <Edit size={14} style={{ marginRight: 4 }} /> Edit Details
            </button>
            {selected.status === "blocked" ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => toggleBlockUser(selected.id, selected.status)}
              >
                <UserCheck size={14} style={{ marginRight: 4 }} /> Unblock User
              </button>
            ) : (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => toggleBlockUser(selected.id, selected.status)}
              >
                <UserX size={14} style={{ marginRight: 4 }} /> Block User
              </button>
            )}
            <button
              className="btn btn-danger btn-sm"
              style={{ background: "var(--danger-600)" }}
              onClick={() => {
                deleteUser(selected.id, selected.name);
                setSelected(null);
              }}
            >
              <Trash2 size={14} style={{ marginRight: 4 }} /> Delete User
            </button>
          </div>
        </div>

        {/* 2-Column Sidebar + Main Details Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Left Column: Profile Card */}
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Avatar name={selected.name} size="xl" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0" }}>
              {selected.name}
            </h2>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                wordBreak: "break-all",
              }}
            >
              {selected.email}
            </div>
            <div
              style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}
            >
              {selected.phone}
            </div>
            <div style={{ marginTop: 12 }}>
              <StatusBadge status={selected.status} />
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border-default)",
                marginTop: 20,
                paddingTop: 20,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  letterSpacing: ".05em",
                }}
              >
                User Summary
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    User ID
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      fontFamily: "monospace",
                    }}
                  >
                    {selected.id}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Joined Date
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {selected.joined}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Total Bookings
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--brand-600)",
                    }}
                  >
                    {selected.bookings}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Total Spent
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--success-600)",
                    }}
                  >
                    {selected.spent}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Views */}
          <div className="card" style={{ padding: 20 }}>
            {/* Horizontal Tabs list */}
            <div
              className="tabs"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                borderBottom: "1px solid var(--border-default)",
                paddingBottom: 12,
                marginBottom: 16,
              }}
            >
              {[
                { id: "overview", label: "Overview", count: null },
                {
                  id: "flights",
                  label: "Flights ✈",
                  count: userFlights.length,
                },
                { id: "hotels", label: "Hotels 🏨", count: userHotels.length },
                { id: "cabs", label: "Cabs 🚖", count: userCabs.length },
                { id: "buses", label: "Buses 🚌", count: userBuses.length },
                {
                  id: "packages",
                  label: "Packages 📦",
                  count: userPkgs.length,
                },
                {
                  id: "transactions",
                  label: "Payments 💳",
                  count: userTransactions.length,
                },
                {
                  id: "tickets",
                  label: "Tickets 🎫",
                  count: userTickets.length,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`tab-btn${activeDetailTab === t.id ? " active" : ""}`}
                  style={{
                    padding: "8px 14px",
                    fontSize: 13,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onClick={() => setActiveDetailTab(t.id)}
                >
                  <span>{t.label}</span>
                  {t.count !== null && (
                    <span
                      style={{
                        background:
                          activeDetailTab === t.id
                            ? "var(--brand-600)"
                            : "var(--bg-hover)",
                        color:
                          activeDetailTab === t.id
                            ? "#fff"
                            : "var(--text-secondary)",
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents Panels */}
            <div>
              {activeDetailTab === "overview" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 14,
                    }}
                  >
                    {[
                      {
                        title: "Flight Bookings",
                        value: userFlights.length,
                        icon: "✈",
                        color: "#3b82f6",
                      },
                      {
                        title: "Hotel Bookings",
                        value: userHotels.length,
                        icon: "🏨",
                        color: "#8b5cf6",
                      },
                      {
                        title: "Cab Bookings",
                        value: userCabs.length,
                        icon: "🚖",
                        color: "#22c55e",
                      },
                      {
                        title: "Bus Bookings",
                        value: userBuses.length,
                        icon: "🚌",
                        color: "#f59e0b",
                      },
                      {
                        title: "Package Bookings",
                        value: userPkgs.length,
                        icon: "📦",
                        color: "#06b6d4",
                      },
                      {
                        title: "Support Tickets",
                        value: userTickets.length,
                        icon: "🎫",
                        color: "#ef4444",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        style={{
                          padding: 16,
                          background: "var(--bg-hover)",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              fontWeight: 500,
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                              marginTop: 4,
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                        <div style={{ fontSize: 26, opacity: 0.8 }}>
                          {item.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="card"
                    style={{
                      border: "1px solid var(--border-default)",
                      boxShadow: "none",
                    }}
                  >
                    <div className="card-header">
                      <span className="card-title" style={{ fontSize: 14 }}>
                        Profile Activity Status
                      </span>
                    </div>
                    <div
                      className="card-body"
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        lineHeight: "1.6",
                      }}
                    >
                      <p>
                        This user is currently{" "}
                        <strong>{selected.status}</strong> in the travel admin
                        registry. They have booked a total of{" "}
                        <strong>{selected.bookings}</strong> travel assets and
                        spent a total of <strong>{selected.spent}</strong>{" "}
                        across all payment gateways.
                      </p>
                      <p style={{ marginTop: 8 }}>
                        Use the tabs above to explore their historical flights,
                        hotel stays, cab routes, package purchases, and
                        payments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === "flights" && (
                <div className="table-wrap">
                  {userFlights.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Flight Bookings Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Flight ID</th>
                          <th>Route</th>
                          <th>Date</th>
                          <th>PNR</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userFlights.map((f) => (
                          <tr key={f.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {f.id}
                            </td>
                            <td style={{ fontWeight: 700 }}>
                              {f.from} → {f.to}
                            </td>
                            <td>{f.date}</td>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontWeight: 600,
                              }}
                            >
                              {f.pnr}
                            </td>
                            <td>
                              <StatusBadge status={f.status} />
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {f.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeDetailTab === "hotels" && (
                <div className="table-wrap">
                  {userHotels.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Hotel Bookings Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Hotel ID</th>
                          <th>Hotel Name</th>
                          <th>City</th>
                          <th>Stay Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userHotels.map((h) => (
                          <tr key={h.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {h.id}
                            </td>
                            <td style={{ fontWeight: 600 }}>{h.hotel}</td>
                            <td>{h.city}</td>
                            <td>
                              {h.checkin} → {h.checkout}
                            </td>
                            <td>
                              <StatusBadge status={h.status} />
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {h.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeDetailTab === "cabs" && (
                <div className="table-wrap">
                  {userCabs.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Cab Rides Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Ride ID</th>
                          <th>Pickup → Drop</th>
                          <th>Date</th>
                          <th>Driver</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userCabs.map((c) => (
                          <tr key={c.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {c.id}
                            </td>
                            <td>
                              <div style={{ fontWeight: 500 }}>{c.pickup}</div>
                              <div
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: 11,
                                }}
                              >
                                → {c.drop}
                              </div>
                            </td>
                            <td>{c.date}</td>
                            <td>{c.driver}</td>
                            <td>
                              <StatusBadge status={c.status} />
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {c.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeDetailTab === "buses" && (
                <div className="table-wrap">
                  {userBuses.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Bus Bookings Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Bus ID</th>
                          <th>Operator</th>
                          <th>Route</th>
                          <th>Date</th>
                          <th>Seat</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBuses.map((b) => (
                          <tr key={b.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {b.id}
                            </td>
                            <td style={{ fontWeight: 600 }}>{b.operator}</td>
                            <td style={{ fontWeight: 700 }}>{b.route}</td>
                            <td>{b.date}</td>
                            <td>{b.seat}</td>
                            <td
                              style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {b.price}
                            </td>
                            <td>
                              <StatusBadge status={b.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeDetailTab === "packages" && (
                <div className="table-wrap">
                  {userPkgs.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Packages Booked Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Package Name</th>
                          <th>Date</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userPkgs.map((p) => (
                          <tr key={p.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {p.id}
                            </td>
                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                            <td>{p.date}</td>
                            <td
                              style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {p.price}
                            </td>
                            <td>
                              <StatusBadge status={p.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeDetailTab === "transactions" && (
                <div className="table-wrap">
                  {userTransactions.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Payments/Transactions Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Txn ID</th>
                          <th>Type</th>
                          <th>Gateway</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTransactions.map((t) => (
                          <tr key={t.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {t.id}
                            </td>
                            <td style={{ fontWeight: 600 }}>{t.type}</td>
                            <td>
                              {t.gateway} ({t.method})
                            </td>
                            <td>{t.date}</td>
                            <td>
                              <StatusBadge status={t.status} />
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {t.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeDetailTab === "tickets" && (
                <div className="table-wrap">
                  {userTickets.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text-muted)",
                      }}
                    >
                      No Support Tickets Found
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Ticket ID</th>
                          <th>Subject</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Assigned To</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTickets.map((t) => (
                          <tr key={t.id}>
                            <td
                              style={{
                                fontWeight: 600,
                                fontFamily: "monospace",
                                color: "var(--brand-600)",
                              }}
                            >
                              {t.id}
                            </td>
                            <td style={{ fontWeight: 500 }}>{t.subject}</td>
                            <td>{t.category}</td>
                            <td>
                              <StatusBadge status={t.priority} />
                            </td>
                            <td>{t.assigned || "Unassigned"}</td>
                            <td>
                              <StatusBadge status={t.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal (re-used for profile edit while on detail view) */}
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Edit User"
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveUser}>
                Save Changes
              </button>
            </>
          }
        >
          <form
            onSubmit={handleSaveUser}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={formUser.name}
                onChange={(e) =>
                  setFormUser((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. john@example.com"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={formUser.phone}
                onChange={(e) =>
                  setFormUser((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input form-select"
                value={formUser.status}
                onChange={(e) =>
                  setFormUser((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Otherwise, render default Users listing table view
  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} total users registered`}
        actions={
          <>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddModal}
            >
              <Plus size={14} /> Add User
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => addToast("Exporting users CSV…", "info")}
            >
              <Download size={14} /> Export CSV
            </button>
          </>
        }
      />

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Users", val: users.length, color: "#3b82f6", filterKey: "all" },
          {
            label: "Active",
            val: users.filter((u) => u.status === "active").length,
            color: "#22c55e",
            filterKey: "active",
          },
          {
            label: "Inactive",
            val: users.filter((u) => u.status === "inactive").length,
            color: "#9ca3af",
            filterKey: "inactive",
          },
          {
            label: "Blocked",
            val: users.filter((u) => u.status === "blocked").length,
            color: "#ef4444",
            filterKey: "blocked",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              padding: "14px 18px",
              cursor: "pointer",
              border: statusFilter === s.filterKey ? `1px solid ${s.color}` : "1px solid var(--border-default)",
              background: statusFilter === s.filterKey ? "var(--bg-hover)" : "var(--bg-card)",
              transition: "all 0.2s",
            }}
            onClick={() => handleStatusFilterChange(s.filterKey)}
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
        <div className="card-header flex items-center justify-between gap-4 flex-wrap">
          <span className="card-title">All Users</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
              style={{ width: 140, fontSize: 12, padding: "6px 28px 6px 10px" }}
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
        <div className="card-body" style={{ padding: "12px 20px" }}>
          <TableFilters search={search} onSearch={handleSearchChange} />
          
          {viewMode === "table" ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Bookings</th>
                    <th>Total Spent</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: 48,
                          color: "var(--text-muted)",
                          fontSize: 13,
                        }}
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                  {paginated.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>
                              {u.name}
                            </div>
                            <div
                              style={{ fontSize: 11, color: "var(--text-muted)" }}
                            >
                              {u.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{u.email}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {u.phone}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={u.status} />
                        {u.status === "blocked" && (
                          <button
                            onClick={() => toggleBlockUser(u.id, u.status)}
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: "var(--brand-600)",
                              background: "none",
                              border: "none",
                              padding: 0,
                              marginTop: "4px",
                              cursor: "pointer",
                              textDecoration: "underline",
                              fontWeight: 600,
                            }}
                          >
                            Unblock User
                          </button>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{u.bookings}</td>
                      <td
                        style={{ fontWeight: 700, color: "var(--text-primary)" }}
                      >
                        {u.spent}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {u.joined}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="View Details"
                            onClick={() => handleSelectUser(u)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Edit User"
                            onClick={() => handleOpenEditModal(u)}
                          >
                            <Edit size={14} />
                          </button>
                          {u.status === "blocked" ? (
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Unblock User"
                              onClick={() => toggleBlockUser(u.id, u.status)}
                              style={{ color: "var(--success-500)" }}
                            >
                              <UserCheck size={14} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Block User"
                              onClick={() => toggleBlockUser(u.id, u.status)}
                              style={{ color: "var(--danger-500)" }}
                            >
                              <UserX size={14} />
                            </button>
                          )}
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Delete User"
                            style={{ color: "var(--danger-500)" }}
                            onClick={() => deleteUser(u.id, u.name)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: 16 }}>
              {paginated.length === 0 ? (
                <div style={{ gridColumn: "span 2", textAlign: "center", padding: "40px 10px", color: "var(--text-muted)" }}>
                  No users found
                </div>
              ) : (
                paginated.map((u) => (
                  <div key={u.id} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={u.name} size="md" />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{u.name}</div>
                          <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{u.id}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <StatusBadge status={u.status} />
                        {u.status === "blocked" && (
                          <button
                            onClick={() => toggleBlockUser(u.id, u.status)}
                            style={{
                              fontSize: "10px",
                              color: "var(--brand-600)",
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              textDecoration: "underline",
                              fontWeight: 600,
                            }}
                          >
                            Unblock User
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div><span style={{ color: "var(--text-muted)" }}>Email:</span> <strong>{u.email}</strong></div>
                        <div><span style={{ color: "var(--text-muted)" }}>Phone:</span> <strong>{u.phone}</strong></div>
                        <div><span style={{ color: "var(--text-muted)" }}>Joined:</span> <strong>{u.joined}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12, marginBottom: 14 }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Bookings:</span> <strong style={{ fontSize: 13, color: "var(--brand-600)" }}>{u.bookings}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Spent:</span> <strong style={{ fontSize: 13, color: "var(--success-600)" }}>{u.spent}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
                      <button
                        className="btn btn-secondary btn-icon btn-sm"
                        title="View Details"
                        onClick={() => handleSelectUser(u)}
                        style={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Eye size={12} /> View Profile
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Edit User"
                        onClick={() => handleOpenEditModal(u)}
                      >
                        <Edit size={14} />
                      </button>
                      {u.status === "blocked" ? (
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Unblock User"
                          onClick={() => toggleBlockUser(u.id, u.status)}
                          style={{ color: "var(--success-500)" }}
                        >
                          <UserCheck size={14} />
                        </button>
                      ) : (
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Block User"
                          onClick={() => toggleBlockUser(u.id, u.status)}
                          style={{ color: "var(--danger-500)" }}
                        >
                          <UserX size={14} />
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Delete User"
                        style={{ color: "var(--danger-500)" }}
                        onClick={() => deleteUser(u.id, u.name)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <Pagination
            page={page}
            total={filtered.length}
            perPage={ITEMS_PER_PAGE}
            onChange={setPage}
          />
        </div>
      </div>

      {/* Add/Edit Modal (for listing page) */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === "create" ? "Add New User" : "Edit User"}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveUser}>
              {formMode === "create" ? "Create User" : "Save Changes"}
            </button>
          </>
        }
      >
        <form
          onSubmit={handleSaveUser}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formUser.name}
              onChange={(e) =>
                setFormUser((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. john@example.com"
              value={formUser.email}
              onChange={(e) =>
                setFormUser((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. +91 98765 43210"
              value={formUser.phone}
              onChange={(e) =>
                setFormUser((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input form-select"
              value={formUser.status}
              onChange={(e) =>
                setFormUser((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
