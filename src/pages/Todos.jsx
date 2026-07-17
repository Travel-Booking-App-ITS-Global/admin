import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Search,
  Calendar,
  Trash2,
  Edit,
  CheckSquare,
  Square,
  List,
  LayoutGrid,
  Tag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { PageHeader, StatusBadge, Avatar } from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import { useApp } from "../store/AppContext.jsx";

const INITIAL_TODOS = [
  {
    id: "TSK001",
    title: "Verify Amadeus API Latency Issues",
    description:
      "Amadeus flights API is throwing sporadic 504 gateway timeout errors during peak hours.",
    category: "System",
    priority: "high",
    status: "in_progress",
    dueDate: "2025-07-20",
    assignedTo: "Aarush Singhania",
    created: "2025-07-15",
  },
  {
    id: "TSK002",
    title: "Process Pending Refunds for cancelled flights",
    description:
      "Refunds for flights FLT8823 (Rohit Verma) and other pending refunds in Razorpay queue need manual approval.",
    category: "Payments",
    priority: "high",
    status: "pending",
    dueDate: "2025-07-18",
    assignedTo: "Devansh Dixit",
    created: "2025-07-16",
  },
  {
    id: "TSK003",
    title: "Add Rajasthan Package winter dates",
    description:
      "CMS update for Rajasthan package with new departure dates starting October 2025.",
    category: "CMS",
    priority: "medium",
    status: "completed",
    dueDate: "2025-07-25",
    assignedTo: "Riya Sen",
    created: "2025-07-12",
  },
  {
    id: "TSK004",
    title: "Update Driver Onboarding Form in CRM",
    description:
      "Revise the driver application form fields to capture background verification details properly.",
    category: "Cabs",
    priority: "low",
    status: "pending",
    dueDate: "2025-07-30",
    assignedTo: "Anjali Mehta",
    created: "2025-07-17",
  },
  {
    id: "TSK005",
    title: "Support ticket TKT0093 escalation",
    description:
      "Follow up with customer Rohit Verma regarding driver not arriving for airport transfer.",
    category: "Support",
    priority: "high",
    status: "in_progress",
    dueDate: "2025-07-17",
    assignedTo: "Rohan Das",
    created: "2025-07-17",
  },
];

const STAFF_MEMBERS = [
  "Aarush Singhania",
  "Devansh Dixit",
  "Riya Sen",
  "Anjali Mehta",
  "Rohan Das",
  "Pooja Sharma",
  "Super Admin",
];

const CATEGORIES = ["System", "Payments", "CMS", "Cabs", "Support", "General"];

export default function Todos() {
  const { addToast } = useApp();
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("itsglobal_todos");
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  // Filters & State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'table' or 'grid' (represented as Kanban board)
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentTodo, setCurrentTodo] = useState({
    id: "",
    title: "",
    description: "",
    category: "General",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: "Super Admin",
  });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "new") {
      handleOpenAdd();
      // Remove query parameters from URL cleanly
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

  useEffect(() => {
    localStorage.setItem("itsglobal_todos", JSON.stringify(todos));
  }, [todos]);

  // Statistics
  const stats = {
    total: todos.length,
    pending: todos.filter((t) => t.status === "pending").length,
    inProgress: todos.filter((t) => t.status === "in_progress").length,
    completed: todos.filter((t) => t.status === "completed").length,
    highPriority: todos.filter(
      (t) => t.priority === "high" && t.status !== "completed",
    ).length,
  };

  // Toggle single todo check status
  const handleToggleComplete = (todo) => {
    const newStatus = todo.status === "completed" ? "pending" : "completed";
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, status: newStatus } : t)),
    );
    addToast(
      `Task marked as ${newStatus === "completed" ? "completed" : "pending"}!`,
      newStatus === "completed" ? "success" : "info",
    );
  };

  // Move todo status in kanban columns
  const handleMoveStatus = (id, direction) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        let nextStatus = t.status;
        if (t.status === "pending" && direction === "next") {
          nextStatus = "in_progress";
        } else if (t.status === "in_progress" && direction === "prev") {
          nextStatus = "pending";
        } else if (t.status === "in_progress" && direction === "next") {
          nextStatus = "completed";
        } else if (t.status === "completed" && direction === "prev") {
          nextStatus = "in_progress";
        }
        if (nextStatus !== t.status) {
          addToast(
            `Moved "${t.title.substring(0, 20)}..." to ${nextStatus.toUpperCase().replace("_", " ")}`,
            "success",
          );
        }
        return { ...t, status: nextStatus };
      }),
    );
  };

  // Delete Todo
  const handleDeleteTodo = (id, title) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    addToast(`Task "${title.substring(0, 20)}..." deleted!`, "error");
  };

  // Open Modal for Add
  function handleOpenAdd() {
    setModalMode("create");
    const today = new Date().toISOString().split("T")[0];
    setCurrentTodo({
      id: "",
      title: "",
      description: "",
      category: "General",
      priority: "medium",
      status: "pending",
      dueDate: today,
      assignedTo: "Super Admin",
    });
    setModalOpen(true);
  }

  // Open Modal for Edit
  const handleOpenEdit = (todo) => {
    setModalMode("edit");
    setCurrentTodo({ ...todo });
    setModalOpen(true);
  };

  // Save / Update Todo
  const handleSaveTodo = (e) => {
    e.preventDefault();
    if (!currentTodo.title.trim()) {
      addToast("Task title is required", "warning");
      return;
    }

    if (modalMode === "create") {
      const newId = `TSK${String(todos.length + 1).padStart(3, "0")}`;
      const newTodo = {
        ...currentTodo,
        id: newId,
        created: new Date().toISOString().split("T")[0],
      };
      setTodos((prev) => [newTodo, ...prev]);
      addToast("New task created successfully!", "success");
    } else {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === currentTodo.id ? { ...t, ...currentTodo } : t,
        ),
      );
      addToast("Task updated successfully!", "success");
    }
    setModalOpen(false);
  };

  // Filtering
  const filteredTodos = todos.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority =
      priorityFilter === "all" || t.priority === priorityFilter;
    const matchCategory =
      categoryFilter === "all" || t.category === categoryFilter;

    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  return (
    <div>
      <PageHeader
        title="Admin Tasks & To-Dos"
        subtitle="Manage and track platform operations and staff workflows"
        actions={
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <Plus size={14} /> Add Task
          </button>
        }
      />

      {/* KPI Stats Panel */}
      <div className="grid-5" style={{ marginBottom: 24 }}>
        {[
          {
            label: "Total Tasks",
            val: stats.total,
            color: "#3b82f6",
            filter: "all",
          },
          {
            label: "Pending",
            val: stats.pending,
            color: "#9ca3af",
            filter: "pending",
          },
          {
            label: "In Progress",
            val: stats.inProgress,
            color: "#f59e0b",
            filter: "in_progress",
          },
          {
            label: "Completed",
            val: stats.completed,
            color: "#22c55e",
            filter: "completed",
          },
          {
            label: "High Priority Alert",
            val: stats.highPriority,
            color: "#ef4444",
            alert: true,
          },
        ].map((s, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: "14px 18px",
              cursor: s.filter ? "pointer" : "default",
              border:
                s.filter && statusFilter === s.filter
                  ? `1px solid ${s.color}`
                  : "1px solid var(--border-default)",
              background:
                s.filter && statusFilter === s.filter
                  ? "var(--bg-hover)"
                  : "var(--bg-card)",
              transition: "all 0.2s",
            }}
            onClick={() => s.filter && setStatusFilter(s.filter)}
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

      {/* Filters Toolbar */}
      <div className="card" style={{ marginBottom: 20, padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left search & dropdown filters */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
            <div style={{ position: "relative", minWidth: 240 }}>
              <input
                type="text"
                placeholder="Search task title, desc, staff..."
                className="form-input"
                style={{ paddingLeft: 34, fontSize: 13 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
            </div>

            <select
              className="form-input form-select"
              style={{ width: 140, fontSize: 13 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="form-input form-select"
              style={{ width: 130, fontSize: 13 }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="form-input form-select"
              style={{ width: 140, fontSize: 13 }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Right layout toggler */}
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Kanban Board View"
            >
              <LayoutGrid size={14} /> Board
            </button>
            <button
              className={`view-toggle-btn${viewMode === "table" ? " active" : ""}`}
              onClick={() => setViewMode("table")}
              title="List Table View"
            >
              <List size={14} /> List Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Renders: Board vs Table */}
      {viewMode === "table" ? (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Check</th>
                    <th>Task Details</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Staff</th>
                    <th>Due Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTodos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          padding: "40px 10px",
                          color: "var(--text-muted)",
                        }}
                      >
                        No tasks found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTodos.map((todo) => (
                      <tr key={todo.id}>
                        <td>
                          <button
                            onClick={() => handleToggleComplete(todo)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color:
                                todo.status === "completed"
                                  ? "var(--success-500)"
                                  : "var(--text-muted)",
                              padding: 4,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {todo.status === "completed" ? (
                              <CheckSquare size={18} />
                            ) : (
                              <Square size={18} />
                            )}
                          </button>
                        </td>
                        <td>
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                                textDecoration:
                                  todo.status === "completed"
                                    ? "line-through"
                                    : "none",
                                color:
                                  todo.status === "completed"
                                    ? "var(--text-muted)"
                                    : "var(--text-primary)",
                              }}
                            >
                              {todo.title}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                marginTop: 2,
                                maxWidth: 360,
                              }}
                            >
                              {todo.description}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 10,
                              background: "rgba(37, 99, 235, 0.08)",
                              color: "var(--brand-600)",
                              padding: "2px 7px",
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            <Tag
                              size={10}
                              style={{
                                display: "inline",
                                marginRight: 3,
                                verticalAlign: "middle",
                              }}
                            />
                            {todo.category}
                          </span>
                        </td>
                        <td>
                          <StatusBadge
                            status={todo.priority}
                            customLabels={{
                              high: "High",
                              medium: "Medium",
                              low: "Low",
                            }}
                          />
                        </td>
                        <td>
                          <StatusBadge status={todo.status} />
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Avatar name={todo.assignedTo} size="xs" />
                            <span style={{ fontSize: 12, fontWeight: 500 }}>
                              {todo.assignedTo}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--text-muted)",
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {todo.dueDate}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Edit Task"
                              onClick={() => handleOpenEdit(todo)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Delete Task"
                              style={{ color: "var(--danger-500)" }}
                              onClick={() =>
                                handleDeleteTodo(todo.id, todo.title)
                              }
                            >
                              <Trash2 size={14} />
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
        </div>
      ) : (
        /* Kanban Board Columns */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {["pending", "in_progress", "completed"].map((colStatus) => {
            const columnTasks = filteredTodos.filter(
              (t) => t.status === colStatus,
            );
            const statusLabel =
              colStatus === "pending"
                ? "Pending Backlog"
                : colStatus === "in_progress"
                  ? "Active In-Progress"
                  : "Completed Tasks";

            const columnColor =
              colStatus === "pending"
                ? "var(--text-muted)"
                : colStatus === "in_progress"
                  ? "var(--warning-600)"
                  : "var(--success-600)";

            return (
              <div
                key={colStatus}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverCol !== colStatus) {
                    setDragOverCol(colStatus);
                  }
                }}
                onDragLeave={() => {
                  setDragOverCol(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  setDragOverCol(null);
                  setDraggedTaskId(null);
                  if (id) {
                    setTodos((prev) =>
                      prev.map((t) => {
                        if (t.id === id) {
                          if (t.status !== colStatus) {
                            addToast(
                              `Moved "${t.title.substring(0, 20)}..." to ${colStatus.toUpperCase().replace("_", " ")}`,
                              "success",
                            );
                            return { ...t, status: colStatus };
                          }
                        }
                        return t;
                      }),
                    );
                  }
                }}
                className="card"
                style={{
                  background:
                    dragOverCol === colStatus
                      ? "rgba(37, 99, 235, 0.08)"
                      : "rgba(15, 23, 42, 0.2)",
                  border:
                    dragOverCol === colStatus
                      ? "1px dashed var(--brand-500)"
                      : "1px solid var(--border-default)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 460,
                  transition: "all 0.2s ease",
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border-default)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: columnColor,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <span
                    style={{
                      background: "var(--bg-hover)",
                      padding: "2px 7px",
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Scrollable Content */}
                <div
                  style={{
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: 520,
                  }}
                >
                  {columnTasks.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 10px",
                        color: "var(--text-muted)",
                        fontSize: 12,
                        border: "2px dashed var(--border-default)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      No tasks in this lane
                    </div>
                  ) : (
                    columnTasks.map((todo) => (
                      <div
                        key={todo.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", todo.id);
                          setDraggedTaskId(todo.id);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverCol(null);
                        }}
                        className="card"
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-strong)",
                          padding: 14,
                          boxShadow: "var(--shadow-sm)",
                          position: "relative",
                          transition: "all 0.2s",
                          opacity: draggedTaskId === todo.id ? 0.4 : 1,
                          cursor: "grab",
                        }}
                      >
                        {/* Title & Priority Badge */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 6,
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              lineHeight: "1.4",
                            }}
                          >
                            {todo.title}
                          </span>
                          <StatusBadge
                            status={todo.priority}
                            customLabels={{
                              high: "High",
                              medium: "Med",
                              low: "Low",
                            }}
                          />
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            margin: "0 0 12px 0",
                            lineHeight: "1.5",
                          }}
                        >
                          {todo.description}
                        </p>

                        {/* Category tag & Staff Avatar */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              background: "rgba(37, 99, 235, 0.08)",
                              color: "var(--brand-600)",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            {todo.category}
                          </span>
                          <div
                            className="flex items-center gap-1.5"
                            title={`Assigned to ${todo.assignedTo}`}
                          >
                            <Avatar name={todo.assignedTo} size="xs" />
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color: "var(--text-secondary)",
                              }}
                            >
                              {todo.assignedTo.split(" ")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Due Date & Action Navigation */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: "1px solid var(--border-default)",
                            paddingTop: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--text-muted)",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Calendar size={10} />
                            <span>Due {todo.dueDate}</span>
                          </div>

                          <div style={{ display: "flex", gap: 4 }}>
                            {/* Directional buttons to move lanes */}
                            {colStatus !== "pending" && (
                              <button
                                className="btn btn-secondary btn-icon btn-sm"
                                style={{ padding: 4 }}
                                title="Move Left"
                                onClick={() =>
                                  handleMoveStatus(todo.id, "prev")
                                }
                              >
                                <ArrowLeft size={10} />
                              </button>
                            )}

                            <button
                              className="btn btn-secondary btn-icon btn-sm"
                              style={{ padding: 4 }}
                              title="Edit Details"
                              onClick={() => handleOpenEdit(todo)}
                            >
                              <Edit size={10} />
                            </button>

                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              style={{ padding: 4, color: "var(--danger-500)" }}
                              title="Delete Task"
                              onClick={() =>
                                handleDeleteTodo(todo.id, todo.title)
                              }
                            >
                              <Trash2 size={10} />
                            </button>

                            {colStatus !== "completed" && (
                              <button
                                className="btn btn-secondary btn-icon btn-sm"
                                style={{ padding: 4 }}
                                title="Move Right"
                                onClick={() =>
                                  handleMoveStatus(todo.id, "next")
                                }
                              >
                                <ArrowRight size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === "create" ? "Create New Task" : "Edit Task Details"}
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveTodo}>
              {modalMode === "create" ? "Create Task" : "Save Changes"}
            </button>
          </div>
        }
      >
        <form
          onSubmit={handleSaveTodo}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Debug API integration timeout"
              value={currentTodo.title}
              onChange={(e) =>
                setCurrentTodo({ ...currentTodo, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Work Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Enter full details about this workflow requirement..."
              value={currentTodo.description}
              onChange={(e) =>
                setCurrentTodo({ ...currentTodo, description: e.target.value })
              }
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                value={currentTodo.category}
                onChange={(e) =>
                  setCurrentTodo({ ...currentTodo, category: e.target.value })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Priority</label>
              <select
                className="form-input form-select"
                value={currentTodo.priority}
                onChange={(e) =>
                  setCurrentTodo({ ...currentTodo, priority: e.target.value })
                }
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Assignee Staff</label>
              <select
                className="form-input form-select"
                value={currentTodo.assignedTo}
                onChange={(e) =>
                  setCurrentTodo({ ...currentTodo, assignedTo: e.target.value })
                }
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                className="form-input"
                value={currentTodo.dueDate}
                onChange={(e) =>
                  setCurrentTodo({ ...currentTodo, dueDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          {modalMode === "edit" && (
            <div className="form-group">
              <label className="form-label">Status Lane</label>
              <select
                className="form-input form-select"
                value={currentTodo.status}
                onChange={(e) =>
                  setCurrentTodo({ ...currentTodo, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
