import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Package as PackageIcon,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck,
  Tag,
  ListPlus,
  Compass,
  DollarSign,
  Utensils,
  Moon,
  Sun,
  Eye,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "../../components/ui/index.jsx";
import { useApp } from "../../store/AppContext.jsx";
import { packagesApi } from "../../services/api.js";

const TRAVEL_TYPES = [
  "Wellness & Leisure",
  "Adventure & Trekking",
  "Beach & Island",
  "Honeymoon & Romantic",
  "Family & Group",
  "Cultural & Heritage",
  "Luxury Experience",
  "Wildlife & Nature",
];

const COMMON_INCLUSIONS_PRESETS = [
  "4-Star Luxury Resort Stay",
  "Daily Breakfast & Dinner (MAP)",
  "Private Airport Transfers",
  "Dedicated AC Cab for Sightseeing",
  "Professional Tour Guide",
  "Welcome Drinks & Spa Voucher",
  "Entrance Tickets to Key Attractions",
  "Sunset Cruise / Boat Tour",
];

const COMMON_EXCLUSIONS_PRESETS = [
  "Flight / Airfare Tickets",
  "Personal Expenses & Laundry",
  "Optional Water Sports / Activities",
  "Travel Insurance",
  "Early Check-in / Late Check-out",
  "GST & City Taxes",
];

export default function PackageFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [activeSection, setActiveSection] = useState("basic"); // 'basic', 'pricing', 'media', 'inclusions', 'itinerary'
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    destination: "Ubud, Bali",
    durationDays: 5,
    durationNights: 4,
    travelType: "Wellness & Leisure",
    minPrice: 1249,
    maxPrice: 1899,
    mealsBadge: "All Incl.",
    priceUnit: "/ person",
    description:
      "Rejuvenate your mind, body & soul in the heart of lush green Ubud valley with luxury villas, healing spa therapies, and organic culinary experiences.",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=85",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85",
    ],
    inclusions: [
      { title: "5-Star Jungle Villa Stay with Private Pool", description: "4 Nights in luxury suite" },
      { title: "All Inclusive Meals & Beverages", description: "Daily organic buffet breakfast, lunch, and candle-light dinner" },
      { title: "Airport Pickup & Drop", description: "Private luxury chauffeur transfer" },
      { title: "Balinese Massage & Spa Session", description: "Complimentary 90-min couples wellness treatment" },
    ],
    exclusions: [
      "International / Domestic Airfare",
      "Personal shopping and alcoholic beverages",
      "Visa on Arrival fees",
    ],
    itineraries: [
      {
        dayNumber: 1,
        title: "Arrival in Bali & Ubud Jungle Villa Check-in",
        description:
          "Warm traditional welcome at Denpasar Airport, scenic transfer to Ubud, check-in to jungle pool villa, followed by sunset welcome drinks.",
        locations: ["Denpasar Airport", "Ubud Valley"],
        activities: ["Private Airport Pickup", "Resort Check-in", "Sunset Welcome Dinner"],
      },
      {
        dayNumber: 2,
        title: "Tegallalang Rice Terraces & Sacred Monkey Forest",
        description:
          "Morning yoga session followed by guided tour of world-famous Tegallalang terraces, Bali jungle swing, and heritage monkey forest sanctuary.",
        locations: ["Tegallalang", "Monkey Forest"],
        activities: ["Morning Yoga Deck", "Jungle Swing", "Traditional Balinese Lunch"],
      },
      {
        dayNumber: 3,
        title: "Tirta Empul Holy Water & Wellness Spa Ritual",
        description:
          "Visit ancient Tirta Empul temple for traditional blessing ceremony. Afternoon dedicated to rejuvenating 90-minute Balinese spa treatment.",
        locations: ["Tirta Empul Temple", "Lotus Spa"],
        activities: ["Temple Purification Ritual", "Organic Herbal Tea", "Couples Spa Session"],
      },
      {
        dayNumber: 4,
        title: "Mount Batur Sunrise View & Coffee Plantation",
        description:
          "Early morning panoramic viewpoint of Mount Batur crater lake, authentic Luwak coffee tasting, and afternoon leisure at the infinity pool.",
        locations: ["Kintamani", "Coffee Plantation"],
        activities: ["Sunrise Viewpoint", "Artisanal Coffee Tasting", "Infinity Poolside Relax"],
      },
      {
        dayNumber: 5,
        title: "Souvenir Shopping & Airport Departure",
        description:
          "Enjoy leisurely floating breakfast, visit Ubud traditional art market for handicrafts, and chauffeur transfer to airport for departure.",
        locations: ["Ubud Art Market", "Airport"],
        activities: ["Floating Breakfast", "Handicrafts Shopping", "Airport Transfer"],
      },
    ],
  });

  const [newPhotoInput, setNewPhotoInput] = useState("");
  const [newInclusionInput, setNewInclusionInput] = useState("");
  const [newExclusionInput, setNewExclusionInput] = useState("");

  // Load existing package if edit
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      packagesApi
        .getById(id)
        .then((res) => {
          if (res) {
            setFormData({
              title: res.title || "",
              destination: res.destination || "",
              durationDays: res.durationDays || 5,
              durationNights: res.durationNights || 4,
              travelType: res.travelType || "Wellness & Leisure",
              minPrice: Number(res.minPrice) || 1249,
              maxPrice: res.maxPrice ? Number(res.maxPrice) : 1899,
              mealsBadge: "All Incl.",
              priceUnit: "/ person",
              description: res.description || "",
              status: res.status || "active",
              images:
                res.images && res.images.length > 0
                  ? res.images.map((img) => (typeof img === "string" ? img : img.imageUrl))
                  : ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85"],
              inclusions:
                res.inclusions && res.inclusions.length > 0
                  ? res.inclusions.map((inc) => ({
                      title: typeof inc === "string" ? inc : inc.title,
                      description: typeof inc === "object" ? inc.description || "" : "",
                    }))
                  : [],
              exclusions: Array.isArray(res.exclusions) ? res.exclusions : [],
              itineraries:
                res.itineraries && res.itineraries.length > 0
                  ? res.itineraries.map((it, idx) => ({
                      dayNumber: it.dayNumber || idx + 1,
                      title: it.title || `Day ${idx + 1}`,
                      description: it.description || "",
                      locations: Array.isArray(it.locations) ? it.locations : [],
                      activities: Array.isArray(it.activities) ? it.activities : [],
                    }))
                  : [],
            });
          }
        })
        .catch((err) => {
          addToast("Failed to fetch package details", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, addToast]);

  const validate = () => {
    const errs = {};
    if (!formData.title?.trim()) errs.title = "Package title is required";
    if (!formData.destination?.trim()) errs.destination = "Destination is required";
    if (!formData.durationDays || formData.durationDays <= 0)
      errs.durationDays = "Duration days must be at least 1";
    if (!formData.minPrice || formData.minPrice <= 0)
      errs.minPrice = "Starting price is required";
    if (!formData.description?.trim()) errs.description = "Description is required";
    if (!formData.images || formData.images.length === 0)
      errs.images = "At least one cover photo is required";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      addToast("Please fill all required fields", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        durationDays: Number(formData.durationDays),
        durationNights: Number(formData.durationNights),
        travelType: formData.travelType,
        minPrice: Number(formData.minPrice),
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : Number(formData.minPrice),
        description: formData.description.trim(),
        status: formData.status,
        images: formData.images.map((url, idx) => ({
          imageUrl: url,
          altText: formData.title,
          sortOrder: idx + 1,
        })),
        inclusions: formData.inclusions.map((inc, idx) => ({
          title: typeof inc === "string" ? inc : inc.title,
          description: typeof inc === "object" ? inc.description : null,
          sortOrder: idx + 1,
        })),
        exclusions: formData.exclusions,
        itineraries: formData.itineraries.map((it, idx) => ({
          dayNumber: it.dayNumber || idx + 1,
          title: it.title || `Day ${idx + 1}`,
          description: it.description || "",
          locations: it.locations || [],
          activities: it.activities || [],
        })),
      };

      if (isEdit) {
        await packagesApi.update(id, payload);
        addToast("Package updated successfully!", "success");
      } else {
        await packagesApi.create(payload);
        addToast("Package created successfully!", "success");
      }
      navigate("/packages");
    } catch (err) {
      addToast(err.message || "Failed to save package", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhotoInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newPhotoInput.trim()],
    }));
    setNewPhotoInput("");
    if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
  };

  const handleRemovePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleAddInclusion = () => {
    if (!newInclusionInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, { title: newInclusionInput.trim(), description: "" }],
    }));
    setNewInclusionInput("");
  };

  const handleRemoveInclusion = (idx) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== idx),
    }));
  };

  const handleAddExclusion = () => {
    if (!newExclusionInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      exclusions: [...prev.exclusions, newExclusionInput.trim()],
    }));
    setNewExclusionInput("");
  };

  const handleRemoveExclusion = (idx) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== idx),
    }));
  };

  const handleAddItineraryDay = () => {
    const nextDay = formData.itineraries.length + 1;
    setFormData((prev) => ({
      ...prev,
      itineraries: [
        ...prev.itineraries,
        {
          dayNumber: nextDay,
          title: `Day ${nextDay}: Exploration & Highlights`,
          description: "Details for sightseeing, cultural spots, and dining.",
          locations: [prev.destination || "Destination City"],
          activities: ["Guided Sightseeing", "Local Meal"],
        },
      ],
    }));
  };

  const handleRemoveItineraryDay = (idx) => {
    setFormData((prev) => ({
      ...prev,
      itineraries: prev.itineraries
        .filter((_, i) => i !== idx)
        .map((it, i) => ({ ...it, dayNumber: i + 1 })),
    }));
  };

  const handleItineraryChange = (idx, field, value) => {
    setFormData((prev) => {
      const copy = [...prev.itineraries];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, itineraries: copy };
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-muted)" }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 12px", color: "var(--brand-500)" }} />
        <p style={{ margin: 0, fontWeight: 500 }}>Loading package details...</p>
      </div>
    );
  }

  const coverImage =
    (formData.images && formData.images[0]) ||
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85";

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/packages" className="btn btn-secondary btn-sm btn-icon" title="Back to Packages">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
              {isEdit ? "Edit Holiday Package" : "Create New Holiday Package"}
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
              {isEdit ? `Updating: ${formData.title}` : "Configure curated multi-day tour details, pricing, and showcase"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/packages" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={submitting}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Package" : "Save Package"}
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div style={{ maxWidth: 1020, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Section 1: Basic Information */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "rgba(59, 130, 246, 0.12)",
                color: "var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PackageIcon size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>1. Basic Information</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                Package title, destination location, travel type, and publish status
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Package Title <span style={{ color: "var(--danger-500)" }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                style={{
                  borderColor: errors.title ? "var(--danger-500)" : undefined,
                  boxShadow: errors.title ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                }}
                placeholder="e.g. Ubud Wellness Retreat, Exotic Bali Beach Getaway"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
              />
              {errors.title && (
                <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4 }}>
                  {errors.title}
                </span>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Destination / Location <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin
                    size={15}
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--brand-500)",
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      paddingLeft: 32,
                      borderColor: errors.destination ? "var(--danger-500)" : undefined,
                    }}
                    placeholder="e.g. Ubud, Bali or Goa, India"
                    value={formData.destination}
                    onChange={(e) => {
                      setFormData({ ...formData, destination: e.target.value });
                      if (errors.destination) setErrors((prev) => ({ ...prev, destination: null }));
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Travel Category
                </label>
                <select
                  className="form-input"
                  value={formData.travelType}
                  onChange={(e) => setFormData({ ...formData, travelType: e.target.value })}
                >
                  {TRAVEL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Status
                </label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active (Published)</option>
                  <option value="inactive">Inactive (Draft)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Duration, Pricing & Badges */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DollarSign size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>2. Duration & Pricing Breakdown</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                Configure Days, Nights, Meals highlight pill, and Starting Price
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr", gap: 12 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                🗓️ Duration Days <span style={{ color: "var(--danger-500)" }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                className="form-input"
                value={formData.durationDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationDays: parseInt(e.target.value) || 1,
                    durationNights: Math.max(0, (parseInt(e.target.value) || 1) - 1),
                  })
                }
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                🌙 Stay Nights
              </label>
              <input
                type="number"
                min="0"
                max="60"
                className="form-input"
                value={formData.durationNights}
                onChange={(e) =>
                  setFormData({ ...formData, durationNights: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Starting Price (₹) <span style={{ color: "var(--danger-500)" }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                className="form-input"
                style={{
                  fontWeight: 700,
                  color: "var(--brand-600)",
                  borderColor: errors.minPrice ? "var(--danger-500)" : undefined,
                }}
                placeholder="e.g. 1249"
                value={formData.minPrice}
                onChange={(e) => {
                  setFormData({ ...formData, minPrice: parseFloat(e.target.value) || 0 });
                  if (errors.minPrice) setErrors((prev) => ({ ...prev, minPrice: null }));
                }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Original / Max Price (₹)
              </label>
              <input
                type="number"
                min="1"
                className="form-input"
                placeholder="e.g. 1899"
                value={formData.maxPrice}
                onChange={(e) =>
                  setFormData({ ...formData, maxPrice: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Quick helper for Inclusions Badge */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: "var(--radius-md)",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Utensils size={16} color="var(--brand-500)" />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  Inclusions Tag:
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>
                  Shown on package badge (e.g. All Incl., Breakfast Included, Flight Included)
                </span>
              </div>
            </div>
            <input
              type="text"
              className="form-input"
              style={{ width: 160, padding: "4px 8px", fontSize: 12, textAlign: "center" }}
              value={formData.mealsBadge}
              onChange={(e) => setFormData({ ...formData, mealsBadge: e.target.value })}
              placeholder="All Incl."
            />
          </div>
        </div>

        {/* Section 3: Overview Description */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "rgba(139, 92, 246, 0.12)",
                color: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>3. Overview & Highlights</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                Compelling description shown on package card and details page
              </p>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <textarea
              className="form-input"
              rows={3}
              style={{
                borderColor: errors.description ? "var(--danger-500)" : undefined,
                resize: "vertical",
              }}
              placeholder="Write a captivating summary for travelers..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
            />
            {errors.description && (
              <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4 }}>
                {errors.description}
              </span>
            )}
          </div>
        </div>

        {/* Section 4: Media & Photo Gallery */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "rgba(245, 158, 11, 0.12)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>4. Hero Cover & Photo Gallery</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                First photo acts as the main hero cover image
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Paste high-res image URL (Unsplash or CDN)..."
              value={newPhotoInput}
              onChange={(e) => setNewPhotoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPhoto();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddPhoto}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}
            >
              <Plus size={16} /> Add Photo
            </button>
          </div>

          {formData.images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
              {formData.images.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    height: 80,
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: idx === 0 ? "2px solid var(--brand-500)" : "1px solid var(--border-default)",
                  }}
                >
                  <img
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  {idx === 0 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: 2,
                        background: "var(--brand-600)",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      COVER
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      background: "rgba(239, 68, 68, 0.9)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "var(--radius-full)",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    title="Remove Photo"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Inclusions & Exclusions */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>5. Inclusions & Exclusions</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                What's included in this holiday package vs. excluded
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Inclusions Column */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, color: "#10b981" }}>
                ✅ Inclusions ({formData.inclusions.length})
              </label>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 5-Star Resort Stay"
                  value={newInclusionInput}
                  onChange={(e) => setNewInclusionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInclusion();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddInclusion}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {formData.inclusions.map((inc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      background: "rgba(16, 185, 129, 0.06)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {typeof inc === "string" ? inc : inc.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInclusion(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--danger-500)",
                        cursor: "pointer",
                        padding: 2,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions Column */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, color: "var(--danger-500)" }}>
                ❌ Exclusions ({formData.exclusions.length})
              </label>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Airfare / Flights"
                  value={newExclusionInput}
                  onChange={(e) => setNewExclusionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExclusion();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddExclusion}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {formData.exclusions.map((exc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      background: "rgba(239, 68, 68, 0.06)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{exc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExclusion(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--danger-500)",
                        cursor: "pointer",
                        padding: 2,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Day-by-Day Itinerary Planner */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "var(--brand-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>6. Day-by-Day Tour Itinerary</h3>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                  Configure the exact schedule and experience for each day
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItineraryDay}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <Plus size={14} /> Add Day {formData.itineraries.length + 1}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {formData.itineraries.map((it, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        background: "var(--brand-600)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      DAY {it.dayNumber || idx + 1}
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontWeight: 600, fontSize: 13, padding: "4px 8px", flex: 1, minWidth: 260 }}
                      value={it.title}
                      onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                      placeholder="e.g. Arrival & Sunset Beach Dinner"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryDay(idx)}
                    className="btn btn-ghost btn-sm btn-icon"
                    style={{ color: "var(--danger-500)" }}
                    title="Remove Day"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <textarea
                  className="form-input"
                  rows={2}
                  style={{ fontSize: 12 }}
                  placeholder="Day description, highlights, activities..."
                  value={it.description || ""}
                  onChange={(e) => handleItineraryChange(idx, "description", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save / Cancel Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "10px 0 30px" }}>
          <Link to="/packages" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={submitting}
            style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 140, justifyContent: "center" }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Package" : "Save Package"}
          </button>
        </div>
      </div>
    </div>
  );
}
