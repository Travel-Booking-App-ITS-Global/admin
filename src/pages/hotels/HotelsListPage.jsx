import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Hotel,
  Plus,
  Search,
  MapPin,
  Star,
  Edit2,
  Trash2,
  Loader2,
  LayoutGrid,
  List,
  Building2,
  Bed,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { PageHeader, Pagination } from "../../components/ui/index.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useApp } from "../../store/AppContext.jsx";
import { hotelsApi } from "../../services/api.js";

const PROPERTY_TYPES = ["All", "Resort", "Hotel", "Villa", "Apartment"];

export default function HotelsListPage() {
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeResorts: 0,
    activeHotels: 0,
    totalFiveStar: 0,
  });

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadHotels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await hotelsApi.getAllAdmin({
        page,
        limit,
        search: searchTerm,
        propertyType: selectedType,
      });
      if (res) {
        setHotels(res.items || []);
        if (res.pagination) {
          setTotal(res.pagination.total || 0);
          setTotalPages(res.pagination.totalPages || 1);
        }
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn("Failed to load hotels:", err);
      addToast("Failed to fetch hotels from database", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedType, addToast]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHotels();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadHotels]);

  const handleDelete = async () => {
    if (!hotelToDelete) return;
    setDeleting(true);
    try {
      await hotelsApi.deleteAdmin(hotelToDelete.id);
      addToast(`"${hotelToDelete.name}" soft-deleted successfully!`, "success");
      setDeleteModalOpen(false);
      setHotelToDelete(null);
      loadHotels();
    } catch (err) {
      addToast(err.message || "Failed to delete hotel", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hotels & Accommodations"
        subtitle="Manage verified direct-contract hotel properties, rooms inventory, and global aggregator feeds"
        actions={
          <Link to="/hotels/new" className="btn btn-primary">
            <Plus size={16} style={{ marginRight: 6 }} />
            Add Hotel
          </Link>
        }
      />

      {/* Top Metric Stats */}
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
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Total Properties</span>
            <Building2 size={18} color="var(--brand-500)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.totalProperties}
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircle size={12} /> Real-time in Database
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Luxury Resorts</span>
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.activeResorts}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Beachfront & Retreats</div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>City & Business Hotels</span>
            <Hotel size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.activeHotels}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Commercial inventory</div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>5-Star Rated Properties</span>
            <Star size={18} color="#eab308" fill="#eab308" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            {stats.totalFiveStar}
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>Premier Tier</div>
        </div>
      </div>

      {/* Filter Toolbar */}
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
        {/* Category Pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PROPERTY_TYPES.map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
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
                {type}
              </button>
            );
          })}
        </div>

        {/* Search & View Mode */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 300px", maxWidth: 450, justifyContent: "flex-end" }}>
          <div style={{ position: "relative", width: "100%" }}>
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
              placeholder="Search by hotel name, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <Loader2 size={36} className="spin" style={{ color: "var(--brand-500)" }} />
        </div>
      ) : hotels.length === 0 ? (
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
          <Hotel size={40} color="var(--text-muted)" />
          <div style={{ fontSize: 16, fontWeight: 700 }}>No Hotel Properties Found</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400 }}>
            {searchTerm || selectedType !== "All"
              ? "No hotels match your search criteria. Try adjusting your query or filter."
              : "No hotel properties have been created yet. Add your first hotel property."}
          </div>
          {searchTerm || selectedType !== "All" ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("All");
              }}
            >
              Reset Filters
            </button>
          ) : (
            <Link to="/hotels/new" className="btn btn-primary btn-sm">
              <Plus size={14} style={{ marginRight: 6 }} />
              Add First Hotel
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID CARDS VIEW ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {hotels.map((h) => {
            const cover =
              h.images && h.images[0]
                ? h.images[0]
                : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

            return (
              <div
                key={h.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  border: "1px solid var(--border-default)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Image Cover + Badges */}
                <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
                  <img
                    src={cover}
                    alt={h.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
                    }}
                  />

                  {/* Top Badges */}
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
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {h.propertyType || "Hotel"}
                    </span>

                    {h.featuredBadge && (
                      <span
                        style={{
                          fontSize: 11,
                          background: "var(--brand-500)",
                          color: "#ffffff",
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          fontWeight: 700,
                        }}
                      >
                        {h.featuredBadge}
                      </span>
                    )}
                  </div>

                  {/* Rating Tag */}
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
                    <span>{h.rating}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: 11 }}>
                      ({h.starRating}★)
                    </span>
                  </div>

                  {/* Price Tag in Cover */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 12,
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(4px)",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    ₹{h.lowestPrice.toLocaleString("en-IN")}{" "}
                    <span style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>
                      / night
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "var(--text-primary)",
                        marginBottom: 4,
                      }}
                    >
                      {h.name}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--text-muted)",
                        fontSize: 12,
                        marginBottom: 10,
                      }}
                    >
                      <MapPin size={14} color="var(--brand-500)" style={{ flexShrink: 0 }} />
                      <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {h.address || `${h.city}, ${h.country}`}
                      </span>
                    </div>

                    {/* Amenities Badges */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {h.amenities &&
                        h.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 11,
                              background: "var(--bg-hover)",
                              color: "var(--text-secondary)",
                              padding: "2px 8px",
                              borderRadius: 4,
                              border: "1px solid var(--border-default)",
                            }}
                          >
                            {typeof amenity === "string" ? amenity : amenity.name || "Facility"}
                          </span>
                        ))}
                      {h.roomsCount > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            background: "rgba(59, 130, 246, 0.08)",
                            color: "var(--brand-500)",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontWeight: 600,
                          }}
                        >
                          {h.roomsCount} Room {h.roomsCount > 1 ? "Types" : "Type"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      paddingTop: 12,
                      borderTop: "1px solid var(--border-default)",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/hotels/edit/${h.id}`)}
                    >
                      <Edit2 size={13} style={{ marginRight: 6 }} />
                      Edit Property
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-500)" }}
                      onClick={() => {
                        setHotelToDelete(h);
                        setDeleteModalOpen(true);
                      }}
                      title="Delete Hotel"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── TABLE VIEW ── */
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>City</th>
                <th>Rating</th>
                <th>Rooms</th>
                <th>From Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={
                          h.images && h.images[0]
                            ? h.images[0]
                            : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"
                        }
                        alt={h.name}
                        style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }}
                      />
                      <div>
                        <div>{h.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{h.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-hover)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      {h.propertyType}
                    </span>
                  </td>
                  <td>{h.city}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                      <Star size={13} fill="#eab308" color="#eab308" />
                      {h.rating} ({h.starRating}★)
                    </span>
                  </td>
                  <td>{h.roomsCount} Categories</td>
                  <td style={{ fontWeight: 700, color: "var(--brand-500)" }}>
                    ₹{h.lowestPrice.toLocaleString("en-IN")}/night
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/hotels/edit/${h.id}`)}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger-500)" }}
                        onClick={() => {
                          setHotelToDelete(h);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        open={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Delete Hotel Property"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Are you sure you want to archive <strong>{hotelToDelete?.name}</strong>?
            This will soft-delete the property from search listings while keeping existing booking records intact.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 10,
            }}
          >
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
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="spin" style={{ marginRight: 6 }} />
                  Archiving...
                </>
              ) : (
                "Yes, Delete Property"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
