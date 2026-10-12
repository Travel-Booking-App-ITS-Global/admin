import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package as PackageIcon,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Loader2,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Tag,
  TrendingUp,
  Sparkles,
  Heart,
  ChevronRight,
  Eye,
  AlertCircle,
} from "lucide-react";
import { PageHeader, Pagination } from "../../components/ui/index.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useApp } from "../../store/AppContext.jsx";
import { packagesApi } from "../../services/api.js";

const TRAVEL_TYPES = [
  "All",
  "Wellness & Leisure",
  "Adventure & Trekking",
  "Beach & Island",
  "Honeymoon & Romantic",
  "Family & Group",
  "Cultural & Heritage",
  "Luxury Experience",
  "Wildlife & Nature",
];

export default function PackagesListPage() {
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    inactivePackages: 0,
    destinationsCount: 0,
    averagePrice: 0,
  });

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTravelType, setSelectedTravelType] = useState("All");
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load stats
  const loadStats = async () => {
    try {
      const res = await packagesApi.getStats();
      if (res) setStats(res);
    } catch (err) {
      console.warn("Failed to load packages stats:", err);
    }
  };

  // Load packages list
  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await packagesApi.getAll({
        page,
        limit,
        search: searchTerm,
        travelType: selectedTravelType,
        destination: selectedDestination,
        status: selectedStatus,
      });

      if (res) {
        setPackages(res.items || []);
        if (res.pagination) {
          setTotal(res.pagination.total || 0);
          setTotalPages(res.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.warn("Failed to load packages:", err);
      addToast("Failed to fetch packages from server", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedTravelType, selectedDestination, selectedStatus, addToast]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedTravelType, selectedDestination, selectedStatus]);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPackages();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadPackages]);

  const handleDelete = async () => {
    if (!packageToDelete) return;
    setDeleting(true);
    try {
      await packagesApi.delete(packageToDelete.id);
      addToast(`"${packageToDelete.title}" deleted successfully!`, "success");
      setDeleteModalOpen(false);
      setPackageToDelete(null);
      loadPackages();
      loadStats();
    } catch (err) {
      addToast(err.message || "Failed to delete package", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (pkg, e) => {
    e.stopPropagation();
    const newStatus = pkg.status === "active" ? "inactive" : "active";
    try {
      await packagesApi.updateStatus(pkg.id, newStatus);
      addToast(`Package marked as ${newStatus}`, "success");
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, status: newStatus } : p))
      );
      loadStats();
    } catch (err) {
      addToast("Failed to update status", "error");
    }
  };

  const destinationsList = [
    "All",
    ...Array.from(new Set(packages.map((p) => p.destination).filter(Boolean))),
  ];

  return (
    <div>
      <PageHeader
        title="Holiday Packages & Itineraries"
        subtitle="Manage curated multi-day tour packages, itineraries, pricing, and mobile showcase cards"
        actions={
          <Link to="/packages/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} />
            Add Package
          </Link>
        }
      />

      {/* KPI Stats Cards */}
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
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Total Packages</span>
            <PackageIcon size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.totalPackages || packages.length}
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircle size={12} /> Curated in System
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Active Showcase</span>
            <Sparkles size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "#10b981" }}>
            {stats.activePackages || packages.filter((p) => p.status === "active").length}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Visible in Mobile App & Web
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Destinations Covered</span>
            <MapPin size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.destinationsCount || destinationsList.length - 1 || 1}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Unique holiday spots
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Avg. Starting Price</span>
            <Tag size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            ₹{stats.averagePrice ? stats.averagePrice.toLocaleString() : "1,249"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Per person rate
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: 16,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, flex: 1, minWidth: 280 }}>
          {/* Search Box */}
          <div style={{ position: "relative", minWidth: 220, flex: "1 1 220px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 36, width: "100%" }}
              placeholder="Search package title, destination, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Travel Type Filter */}
          <select
            className="form-input"
            style={{ width: "auto", minWidth: 170 }}
            value={selectedTravelType}
            onChange={(e) => setSelectedTravelType(e.target.value)}
          >
            {TRAVEL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Travel Types" : t}
              </option>
            ))}
          </select>

          {/* Destination Filter */}
          <select
            className="form-input"
            style={{ width: "auto", minWidth: 150 }}
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
          >
            {destinationsList.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Destinations" : d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-input"
            style={{ width: "auto", minWidth: 130 }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* View Switcher & Limit */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              onClick={() => setViewMode("grid")}
              className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
              style={{ borderRadius: 0, padding: "6px 10px" }}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
              style={{ borderRadius: 0, padding: "6px 10px" }}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>

          <select
            className="form-input"
            style={{ width: "auto", padding: "6px 10px", fontSize: 13 }}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={8}>8 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 12px", color: "var(--brand-500)" }} />
          <p style={{ margin: 0, fontWeight: 500 }}>Loading holiday packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "60px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-full)",
              background: "rgba(59, 130, 246, 0.1)",
              color: "var(--brand-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <PackageIcon size={32} />
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>No Holiday Packages Found</h3>
          <p style={{ margin: "0 0 20px", color: "var(--text-muted)", maxWidth: 420, fontSize: 14 }}>
            {searchTerm || selectedTravelType !== "All" || selectedDestination !== "All"
              ? "No packages match your search filters. Try clearing or adjusting your filter criteria."
              : "Get started by creating your first holiday package for travelers."}
          </p>
          <Link to="/packages/new" className="btn btn-primary">
            <Plus size={16} style={{ marginRight: 6 }} /> Create First Package
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW: Exact Mobile Card Aesthetics */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {packages.map((pkg) => {
            const coverImage =
              (pkg.images && pkg.images[0]?.imageUrl) ||
              "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&q=80";
            const minPrice = Number(pkg.minPrice || 1249);
            const maxPrice = pkg.maxPrice ? Number(pkg.maxPrice) : null;
            const inclusionsCount = (pkg.inclusions && pkg.inclusions.length) || 0;

            return (
              <div
                key={pkg.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                  overflow: "hidden",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-default)",
                  transition: "all 0.25s ease",
                  position: "relative",
                }}
              >
                {/* Image Section with Location Pill & Badges */}
                <div style={{ position: "relative", height: 180, width: "100%", overflow: "hidden" }}>
                  <img
                    src={coverImage}
                    alt={pkg.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&q=80";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                    }}
                  />

                  {/* Destination Pill (Floating bottom left) */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      background: "rgba(15, 23, 42, 0.85)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    }}
                  >
                    <MapPin size={12} color="#38bdf8" />
                    <span>{pkg.destination || "Worldwide"}</span>
                  </div>

                  {/* Heart / Wishlist icon top right */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-full)",
                      background: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ef4444",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Heart size={16} fill="#ef4444" />
                  </div>

                  {/* Status badge top left */}
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span
                      className={`badge ${pkg.status === "active" ? "badge-success" : "badge-secondary"}`}
                      style={{ textTransform: "capitalize", fontWeight: 700, fontSize: 11 }}
                    >
                      {pkg.status}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Category / Travel Type */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {pkg.travelType || "Holiday Package"}
                    </span>
                    {pkg.itineraries?.length > 0 && (
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {pkg.itineraries.length} Days Itinerary
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    title={pkg.title}
                  >
                    {pkg.title}
                  </h3>

                  {/* Overview description */}
                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {pkg.description || "Rejuvenate your mind, body & soul in the heart of scenic paradise."}
                  </p>

                  {/* 3 Metric Badges (Exact mobile app format) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                      marginBottom: 16,
                      background: "var(--bg-hover)",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                        {pkg.durationDays || 5} Days
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Duration</div>
                    </div>

                    <div style={{ textAlign: "center", borderLeft: "1px solid var(--border-default)", borderRight: "1px solid var(--border-default)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                        {pkg.durationNights || 4} Nights
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Stay</div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>
                        {inclusionsCount > 0 ? `${inclusionsCount} Incl.` : "All Incl."}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Meals & More</div>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      paddingTop: 12,
                      borderTop: "1px solid var(--border-default)",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Starting From</span>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-600)" }}>
                          ₹{minPrice.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ person</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(pkg, e)}
                        className={`btn btn-sm ${pkg.status === "active" ? "btn-secondary" : "btn-primary"}`}
                        style={{ padding: "6px 10px", fontSize: 12 }}
                        title={pkg.status === "active" ? "Set Inactive" : "Set Active"}
                      >
                        {pkg.status === "active" ? "Active" : "Publish"}
                      </button>

                      <Link
                        to={`/packages/edit/${pkg.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Edit2 size={13} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setPackageToDelete(pkg);
                          setDeleteModalOpen(true);
                        }}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ color: "var(--danger-500)" }}
                        title="Delete Package"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
          <div className="table-responsive">
            <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-hover)", borderBottom: "1px solid var(--border-default)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>Package</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>Destination</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>Duration</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>Category</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>Starting Price</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>Itinerary / Inclusions</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => {
                  const coverImage =
                    (pkg.images && pkg.images[0]?.imageUrl) ||
                    "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=400&q=80";
                  const minPrice = Number(pkg.minPrice || 1249);
                  return (
                    <tr
                      key={pkg.id}
                      style={{ borderBottom: "1px solid var(--border-default)" }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={coverImage}
                            alt={pkg.title}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: "var(--radius-md)",
                              objectFit: "cover",
                              border: "1px solid var(--border-default)",
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=400&q=80";
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                              {pkg.title}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                              Slug: {pkg.slug?.substring(0, 24)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={14} color="var(--brand-500)" />
                          <span>{pkg.destination}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{pkg.durationDays}D / {pkg.durationNights}N</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{pkg.durationDays} Days Tour</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13 }}>
                        <span className="badge badge-secondary" style={{ fontSize: 11, fontWeight: 600 }}>
                          {pkg.travelType || "Leisure"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "var(--brand-600)" }}>
                        ₹{minPrice.toLocaleString()}
                        <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)", marginLeft: 2 }}>/ person</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>
                        <div>{pkg.itineraries?.length || 0} Itinerary Days</div>
                        <div>{pkg.inclusions?.length || 0} Inclusions</div>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(pkg, e)}
                          className={`badge ${pkg.status === "active" ? "badge-success" : "badge-secondary"}`}
                          style={{
                            cursor: "pointer",
                            border: "none",
                            padding: "4px 8px",
                            textTransform: "capitalize",
                          }}
                        >
                          {pkg.status}
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <Link
                            to={`/packages/edit/${pkg.id}`}
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Edit Package"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setPackageToDelete(pkg);
                              setDeleteModalOpen(true);
                            }}
                            className="btn btn-ghost btn-sm btn-icon"
                            style={{ color: "var(--danger-500)" }}
                            title="Delete Package"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Server & Client Pagination */}
      {total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          totalItems={total}
          itemsPerPage={limit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Package"
        size="sm"
      >
        <div style={{ padding: "10px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              background: "rgba(239, 68, 68, 0.08)",
              padding: 12,
              borderRadius: "var(--radius-md)",
            }}
          >
            <AlertCircle size={24} color="var(--danger-500)" />
            <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
              Are you sure you want to delete package <strong>"{packageToDelete?.title}"</strong>? This will remove it from search and mobile showcase.
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Delete Package
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
