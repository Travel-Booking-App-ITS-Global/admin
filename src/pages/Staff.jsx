import { useState } from "react";
import {
  Shield,
  UserX,
  Plus,
  Key,
  Activity,
  CheckCircle,
  AlertCircle,
  CheckSquare,
  Square,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  PageHeader,
  StatusBadge,
  Avatar,
  Pagination,
} from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import TagSelector from "../components/ui/TagSelector.jsx";
import { useApp } from "../store/AppContext.jsx";

const STAFF_TAGS = [
  "SuperAdmin", "IT Lead", "Finance", "Auditor", "CMS", "Editor",
  "Support Lead", "CustomerCare", "Operator", "Bookings",
  "Shift-A", "Shift-B", "Shift-Night", "Remote",
];

// Initial staff database
const initialStaff = [
  {
    id: "STF001",
    name: "Aarush Singhania",
    email: "aarush.s@itsglobal.in",
    phone: "+91 99999 11111",
    role: "Super Admin",
    status: "active",
    joined: "12 May 2024",
    lastActive: "Just now",
    tags: ["SuperAdmin", "IT Lead"],
    permissions: {
      dashboard: true,
      bookings: true,
      users: true,
      finance: true,
      support: true,
      cms: true,
      staff: true,
    },
  },
  {
    id: "STF002",
    name: "Kiara Sen",
    email: "kiara.sen@itsglobal.in",
    phone: "+91 98888 22222",
    role: "Booking Manager",
    status: "active",
    joined: "18 Jun 2024",
    lastActive: "10 mins ago",
    tags: ["Bookings", "Operator"],
    permissions: {
      dashboard: true,
      bookings: true,
      users: true,
      finance: false,
      support: false,
      cms: true,
      staff: false,
    },
  },
  {
    id: "STF003",
    name: "Devansh Kapoor",
    email: "devansh.k@itsglobal.in",
    phone: "+91 97777 33333",
    role: "Support Lead",
    status: "active",
    joined: "05 Aug 2024",
    lastActive: "2 hours ago",
    tags: ["Support Lead", "CustomerCare"],
    permissions: {
      dashboard: true,
      bookings: false,
      users: true,
      finance: false,
      support: true,
      cms: false,
      staff: false,
    },
  },
  {
    id: "STF004",
    name: "Meera Nair",
    email: "meera.nair@itsglobal.in",
    phone: "+91 96666 44444",
    role: "Finance Auditor",
    status: "active",
    joined: "11 Nov 2024",
    lastActive: "1 day ago",
    tags: ["Finance", "Auditor"],
    permissions: {
      dashboard: true,
      bookings: false,
      users: false,
      finance: true,
      support: false,
      cms: false,
      staff: false,
    },
  },
  {
    id: "STF005",
    name: "Rohan Malhotra",
    email: "rohan.m@itsglobal.in",
    phone: "+91 95555 55555",
    role: "CMS Manager",
    status: "inactive",
    joined: "22 Jan 2025",
    lastActive: "3 days ago",
    tags: ["CMS", "Editor"],
    permissions: {
      dashboard: true,
      bookings: false,
      users: false,
      finance: false,
      support: false,
      cms: true,
      staff: false,
    },
  },
];

const initialLogs = [
  {
    id: "LOG101",
    staff: "Aarush Singhania",
    role: "Super Admin",
    action: "Approved system migration update",
    time: "Just now",
    ip: "192.168.1.5",
  },
  {
    id: "LOG102",
    staff: "Kiara Sen",
    role: "Booking Manager",
    action: "Added new flight package 'Manali Adventure Holiday'",
    time: "12 mins ago",
    ip: "192.168.1.18",
  },
  {
    id: "LOG103",
    staff: "Meera Nair",
    role: "Finance Auditor",
    action: "Initiated cab refund request (pi_9201)",
    time: "1 hour ago",
    ip: "192.168.1.42",
  },
  {
    id: "LOG104",
    staff: "Devansh Kapoor",
    role: "Support Lead",
    action: "Closed support ticket #TK-9882 (Pending flight cancellation)",
    time: "2 hours ago",
    ip: "192.168.1.9",
  },
  {
    id: "LOG105",
    staff: "Aarush Singhania",
    role: "Super Admin",
    action: "Changed operational status of staff Rohan Malhotra to Inactive",
    time: "1 day ago",
    ip: "192.168.1.5",
  },
  {
    id: "LOG106",
    staff: "Kiara Sen",
    role: "Booking Manager",
    action: "Updated pricing for flight route DEL-MUM",
    time: "2 days ago",
    ip: "192.168.1.18",
  },
];

export default function Staff() {
  const { addToast } = useApp();
  const [staffList, setStaffList] = useState(initialStaff);
  const [logs, setLogs] = useState(initialLogs);
  const [tab, setTab] = useState("roster"); // "roster", "logs", "roles"
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Modal control states
  const [addOpen, setAddOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Forms
  const [formStaff, setFormStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Booking Manager",
    tags: [],
    permissions: {
      dashboard: true,
      bookings: false,
      users: false,
      finance: false,
      support: false,
      cms: false,
      staff: false,
    },
  });

  const availablePermissions = [
    {
      key: "dashboard",
      label: "Dashboard & Live Analytics",
      desc: "Allows viewing high-level stats, revenue, and analytical charts.",
    },
    {
      key: "bookings",
      label: "Booking Operations",
      desc: "Allows adding/modifying flights, hotels, packages, and cab schedules.",
    },
    {
      key: "users",
      label: "User Accounts",
      desc: "Allows banning, unbanning, and viewing comprehensive user profiles.",
    },
    {
      key: "finance",
      label: "Financial Auditing",
      desc: "Access to payment gateways, transaction ledgers, and issuing refunds.",
    },
    {
      key: "support",
      label: "Customer Support Escalations",
      desc: "Access to chat monitoring, support tickets, and direct chat actions.",
    },
    {
      key: "cms",
      label: "CMS Content & Pages",
      desc: "Allows updating terms and conditions, contact info, and promotional posts.",
    },
    {
      key: "staff",
      label: "Staff & RBAC Credentials",
      desc: "High-level access to manage staff permissions and onboard system admins.",
    },
  ];

  // Auto-fill preset permissions based on role
  const handleRoleChangeInForm = (role) => {
    const defaultPerms = {
      dashboard: true,
      bookings: false,
      users: false,
      finance: false,
      support: false,
      cms: false,
      staff: false,
    };

    if (role === "Super Admin") {
      Object.keys(defaultPerms).forEach((k) => (defaultPerms[k] = true));
    } else if (role === "Booking Manager") {
      defaultPerms.bookings = true;
      defaultPerms.cms = true;
      defaultPerms.users = true;
    } else if (role === "Support Lead") {
      defaultPerms.support = true;
      defaultPerms.users = true;
    } else if (role === "Finance Auditor") {
      defaultPerms.finance = true;
    } else if (role === "CMS Manager") {
      defaultPerms.cms = true;
    }

    setFormStaff({
      ...formStaff,
      role,
      permissions: defaultPerms,
    });
  };

  const handleTogglePermissionInForm = (key) => {
    setFormStaff({
      ...formStaff,
      permissions: {
        ...formStaff.permissions,
        [key]: !formStaff.permissions[key],
      },
    });
  };

  const handleOpenAdd = () => {
    setFormStaff({
      name: "",
      email: "",
      phone: "",
      role: "Booking Manager",
      tags: [],
      permissions: {
        dashboard: true,
        bookings: true,
        users: true,
        finance: false,
        support: false,
        cms: true,
        staff: false,
      },
    });
    setAddOpen(true);
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!formStaff.name || !formStaff.email || !formStaff.phone) {
      addToast("Please fill all mandatory fields", "error");
      return;
    }

    const newMember = {
      id: `STF00${staffList.length + 1}`,
      name: formStaff.name,
      email: formStaff.email,
      phone: formStaff.phone,
      role: formStaff.role,
      status: "active",
      joined: "Today",
      lastActive: "Never",
      tags: formStaff.tags || [],
      permissions: formStaff.permissions,
    };

    setStaffList([newMember, ...staffList]);
    setLogs([
      {
        id: `LOG${Date.now().toString().slice(-3)}`,
        staff: "Super Admin",
        role: "Super Admin",
        action: `Onboarded new staff member '${formStaff.name}' as ${formStaff.role}`,
        time: "Just now",
        ip: "192.168.1.5",
      },
      ...logs,
    ]);

    addToast(`Staff '${formStaff.name}' onboarded successfully!`, "success");
    setAddOpen(false);
  };

  const handleToggleStaffStatus = (id) => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          const nextStatus = member.status === "active" ? "inactive" : "active";
          addToast(`Staff status updated to ${nextStatus}`, "info");

          // Log action
          setLogs([
            {
              id: `LOG${Date.now().toString().slice(-3)}`,
              staff: "Super Admin",
              role: "Super Admin",
              action: `Changed status of ${member.name} to ${nextStatus.toUpperCase()}`,
              time: "Just now",
              ip: "192.168.1.5",
            },
            ...logs,
          ]);

          return { ...member, status: nextStatus };
        }
        return member;
      }),
    );
  };

  const handleOpenPermissions = (member) => {
    setSelectedStaff(member);
    setFormStaff({
      ...formStaff,
      role: member.role,
      tags: member.tags || [],
      permissions: { ...member.permissions },
    });
    setPermissionsOpen(true);
  };

  const handleSavePermissions = () => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id === selectedStaff.id) {
          // Log permissions update
          setLogs([
            {
              id: `LOG${Date.now().toString().slice(-3)}`,
              staff: "Super Admin",
              role: "Super Admin",
              action: `Updated access permissions for staff '${member.name}'`,
              time: "Just now",
              ip: "192.168.1.5",
            },
            ...logs,
          ]);

          return {
            ...member,
            role: formStaff.role,
            tags: formStaff.tags || [],
            permissions: formStaff.permissions,
          };
        }
        return member;
      }),
    );

    addToast("Permissions updated successfully!", "success");
    setPermissionsOpen(false);
  };

  // Filter roster
  const filteredStaff = staffList.filter((member) => {
    const s = search.toLowerCase();
    const matchesTags = member.tags && member.tags.some((tag) => tag.toLowerCase().includes(s));
    const matchesSearch =
      member.name.toLowerCase().includes(s) ||
      member.email.toLowerCase().includes(s) ||
      member.id.toLowerCase().includes(s) ||
      matchesTags;
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const perPage = 10;
  const totalPages = Math.ceil(filteredStaff.length / perPage) || 1;
  const currentPage = page > totalPages ? 1 : page;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff & EMS Credentials"
        subtitle="Onboard system administrators, configure dynamic feature permissions, and audit secure activity logs."
        actions={
          tab === "roster" && (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
              <Plus size={14} /> Onboard Staff Admin
            </button>
          )
        }
      />

      {/* KPI Stats */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="flex justify-between items-center">
            <span className="kpi-label">Active Admin Sessions</span>
            <div
              className="kpi-icon-wrap"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                color: "var(--success-500)",
              }}
            >
              <Shield size={20} />
            </div>
          </div>
          <span className="kpi-value">
            {staffList.filter((s) => s.status === "active").length}
          </span>
          <span className="kpi-change positive">0 Accounts Suspended</span>
        </div>

        <div className="kpi-card">
          <div className="flex justify-between items-center">
            <span className="kpi-label">Granular Access Roles</span>
            <div
              className="kpi-icon-wrap"
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--accent-500)",
              }}
            >
              <Key size={20} />
            </div>
          </div>
          <span className="kpi-value">5 Presets</span>
          <span className="kpi-change positive">RBAC Rule Compliance</span>
        </div>

        <div className="kpi-card">
          <div className="flex justify-between items-center">
            <span className="kpi-label">Logged Audit Events</span>
            <div
              className="kpi-icon-wrap"
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                color: "var(--warning-500)",
              }}
            >
              <Activity size={20} />
            </div>
          </div>
          <span className="kpi-value">{logs.length} Total</span>
          <span className="kpi-change positive">Audit Logs Maintained</span>
        </div>

        <div className="kpi-card">
          <div className="flex justify-between items-center">
            <span className="kpi-label">Suspended Admins</span>
            <div
              className="kpi-icon-wrap"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "var(--danger-500)",
              }}
            >
              <UserX size={20} />
            </div>
          </div>
          <span className="kpi-value">
            {staffList.filter((s) => s.status === "inactive").length}
          </span>
          <span className="kpi-change negative">Disabled Terminals</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn${tab === "roster" ? " active" : ""}`}
          onClick={() => setTab("roster")}
        >
          Staff & Roles Roster
        </button>
        <button
          className={`tab-btn${tab === "logs" ? " active" : ""}`}
          onClick={() => setTab("logs")}
        >
          EMS Audit Logs
        </button>
        <button
          className={`tab-btn${tab === "roles" ? " active" : ""}`}
          onClick={() => setTab("roles")}
        >
          Role-Permission Matrix
        </button>
      </div>

      {/* Roster View */}
      {tab === "roster" && (
        <div className="card">
          <div className="card-header flex items-center justify-between gap-4 flex-wrap">
            <span className="card-title">Staff Administration Roster</span>
            <div className="flex gap-3 items-center flex-wrap">
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
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search staff, email, UID..."
                  className="form-input"
                  style={{ width: 220, fontSize: 13, padding: "6px 12px" }}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                <select
                  className="form-input form-select"
                  style={{ width: 180, fontSize: 13, padding: "6px 12px" }}
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Booking Manager">Booking Manager</option>
                  <option value="Support Lead">Support Lead</option>
                  <option value="Finance Auditor">Finance Auditor</option>
                  <option value="CMS Manager">CMS Manager</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-body" style={{ padding: "12px 20px" }}>
            {viewMode === "table" ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Full Name</th>
                      <th>Designation Role</th>
                      <th>Access Scope Permissions</th>
                      <th>Joined Date</th>
                      <th>Last Interaction</th>
                      <th>Account Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStaff.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          style={{ textAlign: "center", padding: "40px 10px" }}
                        >
                          No staff members found matching the filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedStaff.map((member) => (
                        <tr key={member.id}>
                          <td
                            style={{
                              fontWeight: 600,
                              color: "var(--text-muted)",
                            }}
                          >
                            {member.id}
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <Avatar name={member.name} size="md" />
                              <div className="flex flex-col">
                                <span style={{ fontWeight: 600 }}>
                                  {member.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {member.email}
                                </span>
                                {member.tags && member.tags.length > 0 && (
                                  <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                                    {member.tags.map((t) => (
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
                          <td>
                            <span className="badge badge-brand">
                              {member.role}
                            </span>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                                maxWidth: 300,
                              }}
                            >
                              {Object.entries(member.permissions)
                                .filter(([, allowed]) => allowed)
                                .map(([key]) => (
                                  <span
                                    key={key}
                                    style={{
                                      fontSize: 10,
                                      background: "rgba(59, 130, 246, 0.12)",
                                      color: "var(--brand-700)",
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                      textTransform: "capitalize",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {key}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td>{member.joined}</td>
                          <td>{member.lastActive}</td>
                          <td>
                            <StatusBadge
                              status={member.status}
                              customLabels={{
                                active: "Active",
                                inactive: "Banned",
                              }}
                            />
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                className="btn btn-secondary btn-icon btn-sm"
                                title="Edit Access Control"
                                onClick={() => handleOpenPermissions(member)}
                              >
                                <Key size={14} />
                              </button>
                              <button
                                className={`btn btn-sm ${
                                  member.status === "active"
                                    ? "btn-danger"
                                    : "btn-success"
                                }`}
                                onClick={() =>
                                  handleToggleStaffStatus(member.id)
                                }
                                style={{ padding: "4px 8px", fontSize: 11 }}
                                disabled={member.role === "Super Admin"}
                              >
                                {member.status === "active"
                                  ? "Ban Access"
                                  : "Unban Access"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid-2" style={{ gap: 16 }}>
                {paginatedStaff.length === 0 ? (
                  <div
                    style={{
                      gridColumn: "span 2",
                      textAlign: "center",
                      padding: "40px 10px",
                      color: "var(--text-muted)",
                    }}
                  >
                    No staff members found matching the filters.
                  </div>
                ) : (
                  paginatedStaff.map((member) => (
                    <div
                      key={member.id}
                      className="card"
                      style={{
                        padding: "18px 20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Avatar name={member.name} size="md" />
                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {member.name}
                            </div>
                            <div
                              style={{
                                fontFamily: "monospace",
                                fontSize: 11,
                                color: "var(--text-muted)",
                              }}
                            >
                              {member.id}
                            </div>
                            {member.tags && member.tags.length > 0 && (
                              <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                                {member.tags.map((t) => (
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
                        <StatusBadge
                          status={member.status}
                          customLabels={{
                            active: "Active",
                            inactive: "Banned",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          background: "var(--bg-hover)",
                          borderRadius: 8,
                          padding: "10px 14px",
                          marginBottom: 12,
                          fontSize: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>
                              Email:
                            </span>{" "}
                            <strong>{member.email}</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>
                              Phone:
                            </span>{" "}
                            <strong>{member.phone}</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>
                              Joined:
                            </span>{" "}
                            <strong>{member.joined}</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--text-muted)" }}>
                              Last Active:
                            </span>{" "}
                            <strong>{member.lastActive}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 600,
                            }}
                          >
                            Role:
                          </span>
                          <span className="badge badge-brand">
                            {member.role}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                            marginTop: 6,
                          }}
                        >
                          {Object.entries(member.permissions)
                            .filter(([, allowed]) => allowed)
                            .map(([key]) => (
                              <span
                                key={key}
                                style={{
                                  fontSize: 10,
                                  background: "rgba(59, 130, 246, 0.12)",
                                  color: "var(--brand-700)",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  textTransform: "capitalize",
                                  fontWeight: 500,
                                }}
                              >
                                {key}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 8,
                          borderTop: "1px solid var(--border-default)",
                          paddingTop: 12,
                        }}
                      >
                        <button
                          className="btn btn-secondary btn-icon btn-sm"
                          title="Edit Access Control"
                          onClick={() => handleOpenPermissions(member)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Key size={12} /> Permissions
                        </button>
                        <button
                          className={`btn btn-sm ${
                            member.status === "active"
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                          onClick={() => handleToggleStaffStatus(member.id)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          disabled={member.role === "Super Admin"}
                        >
                          {member.status === "active" ? "Ban" : "Unban"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <Pagination
              page={currentPage}
              total={filteredStaff.length}
              perPage={perPage}
              onChange={setPage}
            />
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {tab === "logs" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              Staff Action Audit Trail Logs (EMS Logs)
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Staff Member</th>
                  <th>Designation</th>
                  <th>Action Triggered</th>
                  <th>Event Date / Time</th>
                  <th>Secured Client IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>
                      {log.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.staff}</td>
                    <td>
                      <span className="badge badge-gray">{log.role}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Activity
                          size={12}
                          style={{ color: "var(--brand-500)" }}
                        />
                        <span>{log.action}</span>
                      </div>
                    </td>
                    <td>{log.time}</td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        color: "var(--text-muted)",
                      }}
                    >
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Permission presets matrix */}
      {tab === "roles" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              Access Policy Rules & Matrix Control
            </span>
          </div>
          <div className="card-body">
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 20,
              }}
            >
              The dynamic policy engine enforces the following permissions for
              default system roles. Custom overrides can be applied directly in
              the Roster tab.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Module Permission Scope</th>
                    <th>Super Admin</th>
                    <th>Booking Manager</th>
                    <th>Support Lead</th>
                    <th>Finance Auditor</th>
                    <th>CMS Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {availablePermissions.map((perm) => (
                    <tr key={perm.key}>
                      <td>
                        <div className="flex flex-col">
                          <span style={{ fontWeight: 600 }}>{perm.label}</span>
                          <span
                            style={{ fontSize: 11, color: "var(--text-muted)" }}
                          >
                            {perm.desc}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <CheckCircle
                          size={18}
                          style={{
                            color: "var(--success-500)",
                            display: "inline",
                          }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {["bookings", "cms", "users", "dashboard"].includes(
                          perm.key,
                        ) ? (
                          <CheckCircle
                            size={18}
                            style={{
                              color: "var(--success-500)",
                              display: "inline",
                            }}
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            style={{
                              color: "var(--text-muted)",
                              opacity: 0.3,
                              display: "inline",
                            }}
                          />
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {["support", "users", "dashboard"].includes(
                          perm.key,
                        ) ? (
                          <CheckCircle
                            size={18}
                            style={{
                              color: "var(--success-500)",
                              display: "inline",
                            }}
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            style={{
                              color: "var(--text-muted)",
                              opacity: 0.3,
                              display: "inline",
                            }}
                          />
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {["finance", "dashboard"].includes(perm.key) ? (
                          <CheckCircle
                            size={18}
                            style={{
                              color: "var(--success-500)",
                              display: "inline",
                            }}
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            style={{
                              color: "var(--text-muted)",
                              opacity: 0.3,
                              display: "inline",
                            }}
                          />
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {["cms", "dashboard"].includes(perm.key) ? (
                          <CheckCircle
                            size={18}
                            style={{
                              color: "var(--success-500)",
                              display: "inline",
                            }}
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            style={{
                              color: "var(--text-muted)",
                              opacity: 0.3,
                              display: "inline",
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Onboard new staff */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Onboard New System Admin / Staff"
      >
        <form
          onSubmit={handleCreateStaff}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div
            style={{
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: 8,
              padding: 12,
              fontSize: 12,
              color: "var(--brand-700)",
            }}
          >
            <strong>EMS Security Policy:</strong> New administrative accounts
            will be activated immediately. Grant module permissions responsibly
            as per staff roles.
          </div>

          <div className="form-group">
            <label className="form-label">Full Name*</label>
            <input
              className="form-input"
              placeholder="e.g. Advait Nair"
              value={formStaff.name}
              onChange={(e) =>
                setFormStaff({ ...formStaff, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Office Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. advait.n@itsglobal.in"
                value={formStaff.email}
                onChange={(e) =>
                  setFormStaff({ ...formStaff, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Contact *</label>
              <input
                className="form-input"
                placeholder="e.g. +91 94444 88888"
                value={formStaff.phone}
                onChange={(e) =>
                  setFormStaff({ ...formStaff, phone: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">System Access Designation Role</label>
            <select
              className="form-input form-select"
              value={formStaff.role}
              onChange={(e) => handleRoleChangeInForm(e.target.value)}
            >
              <option value="Super Admin">
                Super Admin (Full System Access)
              </option>
              <option value="Booking Manager">
                Booking Manager (Bookings + CMS)
              </option>
              <option value="Support Lead">
                Support Lead (Support Tickets + Chat)
              </option>
              <option value="Finance Auditor">
                Finance Auditor (Refunds + Transactions)
              </option>
              <option value="CMS Manager">CMS Manager (CMS Editor)</option>
            </select>
          </div>

          <TagSelector
            label="Tags"
            value={formStaff.tags || []}
            onChange={(tags) => setFormStaff({ ...formStaff, tags })}
            suggestions={STAFF_TAGS}
          />

          <div
            style={{
              borderTop: "1px solid var(--border-default)",
              paddingTop: 12,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--brand-700)",
              }}
            >
              Configure Granular Access Control Lists
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 10,
              }}
            >
              {availablePermissions.map((perm) => (
                <div
                  key={perm.key}
                  onClick={() => handleTogglePermissionInForm(perm.key)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 8,
                    borderRadius: 6,
                    background: formStaff.permissions[perm.key]
                      ? "var(--bg-active)"
                      : "transparent",
                    border: `1px solid ${formStaff.permissions[perm.key] ? "var(--border-brand)" : "transparent"}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      marginTop: 2,
                      color: formStaff.permissions[perm.key]
                        ? "var(--brand-600)"
                        : "var(--text-muted)",
                    }}
                  >
                    {formStaff.permissions[perm.key] ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {perm.label}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {perm.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="modal-footer"
            style={{
              borderTop: "1px solid var(--border-default)",
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
              Onboard Staff Admin
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit permissions */}
      <Modal
        open={permissionsOpen}
        onClose={() => setPermissionsOpen(false)}
        title={`Edit Credentials Scope: ${selectedStaff?.name}`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group">
            <label className="form-label">System Access Designation Role</label>
            <select
              className="form-input form-select"
              value={formStaff.role}
              onChange={(e) => handleRoleChangeInForm(e.target.value)}
              disabled={selectedStaff?.role === "Super Admin"}
            >
              <option value="Super Admin">
                Super Admin (Full System Access)
              </option>
              <option value="Booking Manager">
                Booking Manager (Bookings + CMS)
              </option>
              <option value="Support Lead">
                Support Lead (Support Tickets + Chat)
              </option>
              <option value="Finance Auditor">
                Finance Auditor (Refunds + Transactions)
              </option>
              <option value="CMS Manager">CMS Manager (CMS Editor)</option>
            </select>
          </div>

          <TagSelector
            label="Tags"
            value={formStaff.tags || []}
            onChange={(tags) => setFormStaff({ ...formStaff, tags })}
            suggestions={STAFF_TAGS}
          />

          <div
            style={{
              borderTop: "1px solid var(--border-default)",
              paddingTop: 12,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--brand-700)",
              }}
            >
              Access Control Lists Override
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 10,
              }}
            >
              {availablePermissions.map((perm) => (
                <div
                  key={perm.key}
                  onClick={() =>
                    selectedStaff?.role !== "Super Admin" &&
                    handleTogglePermissionInForm(perm.key)
                  }
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 8,
                    borderRadius: 6,
                    background: formStaff.permissions[perm.key]
                      ? "var(--bg-active)"
                      : "transparent",
                    border: `1px solid ${formStaff.permissions[perm.key] ? "var(--border-brand)" : "transparent"}`,
                    cursor:
                      selectedStaff?.role === "Super Admin"
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      selectedStaff?.role === "Super Admin" &&
                      perm.key !== "staff"
                        ? 0.8
                        : 1,
                  }}
                >
                  <div
                    style={{
                      marginTop: 2,
                      color: formStaff.permissions[perm.key]
                        ? "var(--brand-600)"
                        : "var(--text-muted)",
                    }}
                  >
                    {formStaff.permissions[perm.key] ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {perm.label}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {perm.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="modal-footer"
            style={{
              borderTop: "1px solid var(--border-default)",
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPermissionsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSavePermissions}
            >
              Save Overrides
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
