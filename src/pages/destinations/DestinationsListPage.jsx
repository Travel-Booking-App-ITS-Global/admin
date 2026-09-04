import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Loader2,
  LayoutGrid,
  List,
  Globe,
  Sparkles,
  Calendar,
  Languages,
  Clock,
  TrendingUp,
  Building2,
  CheckCircle,
} from "lucide-react";
import { PageHeader, Pagination } from "../../components/ui/index.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useApp } from "../../store/AppContext.jsx";
import { destinationsApi } from "../../services/api.js";

const BADGES = ["All", "Top Destination", "Trending", "Popular", "Must Visit"];

export default function DestinationsListPage() {
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalAttractions: 0,
    activeDestinations: 0,
    totalCountries: 0,
  });

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await destinationsApi.getAll({
        page,
        limit,
        search: searchTerm,
        badge: selectedBadge,
        country: selectedCountry,
        status: selectedStatus,
      });
      if (res) {
        setDestinations(res.items || []);
        if (res.pagination) {
          setTotal(res.pagination.total || 0);
          setTotalPages(res.pagination.totalPages || 1);
        }
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn("Failed to load destinations:", err);
      addToast("Failed to fetch destinations from database", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedBadge, selectedCountry, selectedStatus, addToast]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedBadge, selectedCountry, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDestinations();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadDestinations]);

  const handleDelete = async () => {
    if (!destinationToDelete) return;
    setDeleting(true);
    try {
      await destinationsApi.delete(destinationToDelete.id);
      addToast(`"${destinationToDelete.name}" deleted successfully!`, "success");
      setDeleteModalOpen(false);
      setDestinationToDelete(null);
      loadDestinations();
    } catch (err) {
      addToast(err.message || "Failed to delete destination", "error");
    } finally {
      setDeleting(false);
    }
  };

  const countriesList = [
    "All",
    ...Array.from(new Set(destinations.map((d) => d.country).filter(Boolean))),
  ];

  return (
    <div>
      <PageHeader
        title="Destinations & Top Attractions"
        subtitle="Manage global travel destinations, city profiles, and top tourist attractions"
        actions={
          <Link to="/destinations/new" className="btn btn-primary">
            <Plus size={16} style={{ marginRight: 6 }} />
            Add Destination
          </Link>
        }
      />

      {/* Top Metric Stats (Exact HotelListPage structure) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Total Destinations</span>
            <MapPin size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.totalDestinations || destinations.length}
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircle size={12} /> Active in Database
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Total Attractions</span>
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.totalAttractions || 0}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Tourist spots with fees & timings</div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Countries Covered</span>
            <Globe size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.totalCountries || Math.max(countriesList.length - 1, 1)}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>International regions</div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Average Rating</span>
            <Star size={18} color="#eab308" fill="#eab308" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            ⭐ 4.8 / 5.0
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>18,932+ verified reviews</div>
        </div>
      </div>

      {/* Filter Toolbar (Exact HotelListPage structure & form-input styling) */}
      <div
        className="card"
        style={{
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Category Badge Pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BADGES.map((badge) => {
            const active = selectedBadge === badge;
            return (
              <button
                key={badge}
                type="button"
                onClick={() => setSelectedBadge(badge)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  border: active
                    ? "1px solid var(--brand-500)"
                    : "1px solid var(--border-default)",
                  background: active ? "var(--brand-500)" : "var(--bg-card)",
                  color: active ? "#ffffff" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {badge}
              </button>
            );
          })}
        </div>

        {/* Search, Dropdowns & View Mode */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 340px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", minWidth: 200, flex: 1 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32, fontSize: 13 }}
              placeholder="Search by city, country, spot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Country Dropdown */}
          <select
            className="form-input form-select"
            style={{ width: "auto", fontSize: 13, minWidth: 130 }}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countriesList.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Countries" : c}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            className="form-input form-select"
            style={{ width: "auto", fontSize: 13, minWidth: 110 }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* View Toggle */}
          <div
            style={{
              display: "flex",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("table")}
              style={{
                padding: "8px 10px",
                border: "none",
                background: viewMode === "table" ? "var(--brand-500)" : "var(--bg-card)",
                color: viewMode === "table" ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer",
              }}
              title="Table View"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              style={{
                padding: "8px 10px",
                border: "none",
                background: viewMode === "grid" ? "var(--brand-500)" : "var(--bg-card)",
                color: viewMode === "grid" ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer",
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <Loader2 size={36} className="spin" style={{ color: "var(--brand-500)" }} />
        </div>
      ) : destinations.length === 0 ? (
        <div
          className="card"
          style={{
            padding: 60,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <MapPin size={40} color="var(--text-muted)" />
          <div style={{ fontSize: 16, fontWeight: 700 }}>No Destinations Found</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400 }}>
            {searchTerm || selectedBadge !== "All" || selectedCountry !== "All"
              ? "No destinations match your search filter criteria. Try adjusting your query."
              : "No destinations have been created yet. Add your first destination."}
          </div>
          {searchTerm || selectedBadge !== "All" || selectedCountry !== "All" ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedBadge("All");
                setSelectedCountry("All");
                setSelectedStatus("All");
              }}
            >
              Reset Filters
            </button>
          ) : (
            <Link to="/destinations/new" className="btn btn-primary btn-sm">
              <Plus size={14} style={{ marginRight: 6 }} />
              Add First Destination
            </Link>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* ── TABLE VIEW ── */
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "26%" }}>Destination / City</th>
                <th>Country</th>
                <th>Rating & Reviews</th>
                <th>Badge</th>
                <th>Attractions</th>
                <th>Best Time</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest) => (
                <tr key={dest.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={dest.coverImage}
                        alt={dest.name}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 6,
                          objectFit: "cover",
                          border: "1px solid var(--border-default)",
                        }}
                      />
                      <div>
                        <div>{dest.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {dest.shortDescription ? dest.shortDescription.slice(0, 45) + "..." : dest.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={13} color="var(--brand-500)" />
                      {dest.country}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                      <Star size={13} fill="#eab308" color="#eab308" />
                      {dest.rating || 4.8}
                      <span style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500 }}>
                        ({(dest.reviewCount || 18932).toLocaleString()})
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(37, 99, 235, 0.1)",
                        color: "var(--brand-600)",
                        fontWeight: 700,
                      }}
                    >
                      {dest.badge || "Top Destination"}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#7c3aed",
                        fontWeight: 700,
                      }}
                    >
                      {dest.attractionsCount || (dest.attractions ? dest.attractions.length : 0)} Spots
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={12} color="var(--text-muted)" />
                      {dest.bestTimeToVisit || "Apr-Jun"}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: dest.status === "active" ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)",
                        color: dest.status === "active" ? "var(--success-600)" : "var(--danger-600)",
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {dest.status || "active"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <Link
                        to={`/destinations/edit/${dest.id}`}
                        className="btn btn-secondary btn-sm"
                        title="Edit Destination"
                        style={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Edit2 size={13} /> Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger-500)" }}
                        onClick={() => {
                          setDestinationToDelete(dest);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete Destination"
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
        /* ── GRID CARDS VIEW ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid var(--border-default)",
                transition: "all 0.2s ease",
              }}
            >
              {/* Cover Image */}
              <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    right: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(6px)",
                      color: "#ffffff",
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      fontWeight: 700,
                    }}
                  >
                    {dest.badge || "Top Destination"}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      background: dest.status === "active" ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)",
                      color: "#ffffff",
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {dest.status || "active"}
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                    color: "#fbbf24",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Star size={13} fill="#fbbf24" />
                  <span>{dest.rating || 4.8}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: 11 }}>
                    ({(dest.reviewCount || 18932).toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                    {dest.name}, {dest.country}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 10 }}>
                    {dest.shortDescription || dest.description}
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        background: "var(--bg-hover)",
                        color: "var(--text-secondary)",
                        padding: "2px 8px",
                        borderRadius: 4,
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      📅 {dest.bestTimeToVisit || "Apr-Jun"}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        background: "rgba(139, 92, 246, 0.08)",
                        color: "#7c3aed",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      📍 {dest.attractionsCount || (dest.attractions ? dest.attractions.length : 0)} Attractions
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: "1px solid var(--border-default)",
                    justifyContent: "space-between",
                  }}
                >
                  <Link
                    to={`/destinations/edit/${dest.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    <Edit2 size={13} style={{ marginRight: 6 }} /> Edit Destination
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--danger-500)" }}
                    onClick={() => {
                      setDestinationToDelete(dest);
                      setDeleteModalOpen(true);
                    }}
                    title="Delete Destination"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        total={total}
        perPage={limit}
        onChange={(newPage) => setPage(newPage)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Destination"
      >
        <div style={{ padding: "8px 0" }}>
          <p style={{ fontSize: 14, color: "var(--text-secondary, #475569)" }}>
            Are you sure you want to delete{" "}
            <strong>"{destinationToDelete?.name}"</strong>? All associated tourist attractions will also be archived.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
