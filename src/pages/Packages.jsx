import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, LayoutGrid, List, Download } from "lucide-react";
import {
  PageHeader,
  StatusBadge,
  TableFilters,
  Pagination,
} from "../components/ui/index.jsx";
import Modal from "../components/ui/Modal.jsx";
import { mockPackages } from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";
import { exportToCSV } from "../utils/export.js";
import { useLocation } from "react-router-dom";

const COMMON_INCLUSIONS = [
  "Hotel",
  "Meals",
  "Transfers",
  "Guide",
  "Sightseeing",
  "Flights",
  "Camping",
];

const COMMON_TAGS = [
  "Best Seller",
  "Trending",
  "Special Offer",
  "Family Friendly",
  "Adventure",
  "Couple Friendly",
  "Budget Friendly",
  "Luxury",
];

export default function Packages() {
  const { addToast } = useApp();
  const [packages, setPackages] = useState(mockPackages);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

  // Unified form state with tags
  const [form, setForm] = useState({
    id: "",
    name: "",
    duration: "",
    price: "",
    category: "Leisure",
    destinations: "",
    status: "active",
    inclusions: ["Hotel", "Meals", "Transfers"],
    description: "",
    tags: [],
  });

  const handleOpenCreate = () => {
    setForm({
      id: `PKG${100 + packages.length + 1}`,
      name: "",
      duration: "",
      price: "",
      category: "Leisure",
      destinations: "",
      status: "active",
      inclusions: ["Hotel", "Meals", "Transfers"],
      description: "",
      tags: [],
    });
    setCreateOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setForm({
      id: pkg.id,
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price.replace("₹", ""),
      category: pkg.category,
      destinations: pkg.destinations.join(", "),
      status: pkg.status,
      inclusions: pkg.inclusions,
      description: pkg.description || "",
      tags: pkg.tags || [],
    });
    setEditOpen(true);
  };

  const handleSavePackage = (e) => {
    e?.preventDefault();
    if (!form.name || !form.duration || !form.price) {
      addToast("Please fill out all required fields", "error");
      return;
    }

    const priceVal = form.price.startsWith("₹") ? form.price : `₹${form.price}`;
    const destArray = form.destinations
      ? form.destinations
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      : ["TBD"];

    if (editOpen) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === form.id
            ? {
                ...p,
                name: form.name,
                duration: form.duration,
                price: priceVal,
                category: form.category,
                destinations: destArray,
                status: form.status,
                inclusions: form.inclusions,
                description: form.description,
                tags: form.tags,
              }
            : p,
        ),
      );
      addToast("Package updated successfully!", "success");
      setEditOpen(false);
    } else {
      const added = {
        id: form.id,
        name: form.name,
        duration: form.duration,
        price: priceVal,
        category: form.category,
        destinations: destArray,
        status: form.status,
        bookings: 0,
        inclusions: form.inclusions,
        description: form.description,
        tags: form.tags,
      };
      setPackages((prev) => [added, ...prev]);
      addToast("Package created successfully!", "success");
      setCreateOpen(false);
    }
  };

  const togglePackageStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "draft" : "active";
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)),
    );
    addToast(`Package status updated to ${nextStatus}`, "success");
  };

  const deletePackage = (id, name) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addToast(`${name} deleted`, "error");
  };

  const handleInclusionChange = (inc) => {
    setForm((prev) => {
      const isSelected = prev.inclusions.includes(inc);
      return {
        ...prev,
        inclusions: isSelected
          ? prev.inclusions.filter((x) => x !== inc)
          : [...prev.inclusions, inc],
      };
    });
  };

  const filtered = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.destinations.some((d) =>
        d.toLowerCase().includes(search.toLowerCase()),
      ) ||
      (p.tags &&
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))),
  );

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const currentPage = page > totalPages ? 1 : page;
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div>
      <PageHeader
        title="Package Management"
        subtitle="Create and manage travel packages"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
              <Plus size={14} /> Create Package
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                exportToCSV(filtered, "packages_export.csv");
                addToast("Packages data exported to CSV!", "success");
              }}
            >
              <Download size={14} /> Export
            </button>
          </div>
        }
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TableFilters
          search={search}
          onSearch={(s) => {
            setSearch(s);
            setPage(1);
          }}
        />
        <div className="view-toggle-group" style={{ marginTop: -16 }}>
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

      {viewMode === "table" ? (
        <div className="card" style={{ padding: "12px 20px" }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Package ID</th>
                  <th>Package Name</th>
                  <th>Category</th>
                  <th>Destinations</th>
                  <th>Duration</th>
                  <th>Price/Pax</th>
                  <th>Bookings</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      No packages found
                    </td>
                  </tr>
                )}
                {paginated.map((pkg) => (
                  <tr key={pkg.id}>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--brand-600)",
                      }}
                    >
                      {pkg.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{pkg.name}</div>
                      {pkg.tags && pkg.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            marginTop: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          {pkg.tags.map((t) => (
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
                    <td>{pkg.category}</td>
                    <td style={{ fontSize: 12 }}>
                      {pkg.destinations.join(" · ")}
                    </td>
                    <td>{pkg.duration}</td>
                    <td style={{ fontWeight: 700, color: "var(--brand-600)" }}>
                      {pkg.price}
                    </td>
                    <td style={{ fontWeight: 600 }}>{pkg.bookings}</td>
                    <td>
                      <StatusBadge status={pkg.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title={
                            pkg.status === "active"
                              ? "Change to Draft"
                              : "Change to Active"
                          }
                          onClick={() =>
                            togglePackageStatus(pkg.id, pkg.status)
                          }
                        >
                          {pkg.status === "active" ? "⏸" : "▶"}
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Edit Package"
                          onClick={() => handleOpenEdit(pkg)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Delete Package"
                          style={{ color: "var(--danger-500)" }}
                          onClick={() => deletePackage(pkg.id, pkg.name)}
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
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 16 }}>
          {paginated.length === 0 && (
            <div
              style={{
                gridColumn: "span 2",
                textAlign: "center",
                padding: 24,
                color: "var(--text-muted)",
              }}
            >
              No packages found
            </div>
          )}
          {paginated.map((pkg) => (
            <div
              key={pkg.id}
              className="card"
              style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: 6,
                  background:
                    pkg.status === "active"
                      ? "linear-gradient(90deg,#3b82f6,#8b5cf6)"
                      : "linear-gradient(90deg,#9ca3af,#d1d5db)",
                }}
              />
              <div
                style={{
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      {/* Package Tags */}
                      {pkg.tags && pkg.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            marginBottom: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {pkg.tags.map((t) => (
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
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: 700,
                          fontSize: 16,
                          color: "var(--text-primary)",
                        }}
                      >
                        {pkg.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 3,
                        }}
                      >
                        {pkg.destinations.join(" · ")}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <StatusBadge status={pkg.status} />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 16,
                      marginTop: 12,
                    }}
                  >
                    {pkg.inclusions.map((inc) => (
                      <span
                        key={inc}
                        style={{
                          fontSize: 11,
                          background: "var(--bg-hover)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border-default)",
                    paddingTop: 12,
                    marginTop: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 20 }}>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        Duration
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {pkg.duration}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        Price/Pax
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--brand-600)",
                        }}
                      >
                        {pkg.price}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        Bookings
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {pkg.bookings}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title={
                        pkg.status === "active"
                          ? "Change to Draft"
                          : "Change to Active"
                      }
                      style={{ fontSize: 11, fontWeight: 600 }}
                      onClick={() => togglePackageStatus(pkg.id, pkg.status)}
                    >
                      {pkg.status === "active" ? "⏸" : "▶"}
                    </button>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Edit Package"
                      onClick={() => handleOpenEdit(pkg)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Delete Package"
                      style={{ color: "var(--danger-500)" }}
                      onClick={() => deletePackage(pkg.id, pkg.name)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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

      {/* Create / Edit Package Modal */}
      <Modal
        open={createOpen || editOpen}
        onClose={() => {
          setCreateOpen(false);
          setEditOpen(false);
        }}
        title={editOpen ? "Edit Holiday Package" : "Create New Holiday Package"}
      >
        <form
          onSubmit={handleSavePackage}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Package Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Goa Beach Escape 4D"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Duration *</label>
              <input
                className="form-input"
                placeholder="e.g. 3N/4D"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price per Pax *</label>
              <input
                className="form-input"
                placeholder="24999"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Leisure</option>
                <option>Adventure</option>
                <option>Heritage</option>
                <option>Beach</option>
                <option>Honeymoon</option>
                <option>Corporate</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Package Status</label>
              <select
                className="form-input form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Destinations (comma separated)</label>
            <input
              className="form-input"
              placeholder="e.g. Alleppey, Kochi, Munnar"
              value={form.destinations}
              onChange={(e) =>
                setForm({ ...form, destinations: e.target.value })
              }
            />
          </div>

          {/* Package Tag System */}
          <div className="form-group">
            <label className="form-label">Package Tags</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  className="form-input"
                  id="new-tag-input"
                  placeholder="Type a tag (e.g. Eco-tour) and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !form.tags.includes(val)) {
                        setForm({ ...form, tags: [...form.tags, val] });
                        e.target.value = "";
                      }
                    }
                  }}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const input = document.getElementById("new-tag-input");
                  const val = input?.value.trim();
                  if (val && !form.tags.includes(val)) {
                    setForm({ ...form, tags: [...form.tags, val] });
                    input.value = "";
                  }
                }}
              >
                Add Tag
              </button>
            </div>

            {/* Currently selected tags */}
            {form.tags && form.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      background: "var(--brand-600)",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.8)",
                        cursor: "pointer",
                        fontSize: 10,
                        padding: 0,
                        lineHeight: 1,
                      }}
                      onClick={() =>
                        setForm({
                          ...form,
                          tags: form.tags.filter((t) => t !== tag),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suggestions */}
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              Quick Add Suggestions:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {COMMON_TAGS.map((tag) => {
                const active = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)",
                      border: active
                        ? "1px solid var(--brand-600)"
                        : "1px solid var(--border-default)",
                      background: active
                        ? "rgba(37,99,235,0.08)"
                        : "var(--bg-hover)",
                      color: active
                        ? "var(--brand-600)"
                        : "var(--text-secondary)",
                      cursor: "pointer",
                      fontWeight: active ? 600 : 500,
                      transition: "all 0.12s ease",
                    }}
                    onClick={() => {
                      if (active) {
                        setForm({
                          ...form,
                          tags: form.tags.filter((t) => t !== tag),
                        });
                      } else {
                        setForm({ ...form, tags: [...form.tags, tag] });
                      }
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: 6 }}>
              Inclusions
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px 18px",
                background: "var(--bg-hover)",
                padding: 12,
                borderRadius: "var(--radius-md)",
              }}
            >
              {COMMON_INCLUSIONS.map((inc) => {
                const checked = form.inclusions.includes(inc);
                return (
                  <label
                    key={inc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: checked ? 600 : 400,
                      color: "var(--text-primary)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleInclusionChange(inc)}
                      style={{ cursor: "pointer" }}
                    />
                    {inc}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Itinerary</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Highlights of the trip, sightseeing details, and cancellation rules…"
              style={{ resize: "vertical" }}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
              onClick={() => {
                setCreateOpen(false);
                setEditOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editOpen ? "Save Changes" : "Create Package"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
