import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Building2,
  MapPin,
  Bed,
  Utensils,
  Compass,
  FileQuestion,
  Star,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "../../components/ui/index.jsx";
import { useApp } from "../../store/AppContext.jsx";
import { hotelsApi } from "../../services/api.js";

const PROPERTY_TYPES = ["Resort", "Hotel", "Villa", "Apartment"];
const BED_TYPES = ["1 King Bed", "2 Twin Beds", "1 Queen Bed", "2 Double Beds", "King Bed + Sofa"];
const MEAL_PLANS = ["Room Only", "Breakfast Included", "Breakfast & Dinner (MAP)", "All Meals Included"];

const COMMON_FACILITIES_PRESETS = [
  { category: "Food & Drink", items: ["A la carte dine-in", "Breakfast buffet", "Restaurant", "Vegetarian meal", "Cocktail Bar", "Room Service"] },
  { category: "Wellness & Pools", items: ["Infinity Pool", "Swimming Pool", "Spa & Wellness", "Fitness Center", "Steam & Sauna", "Yoga Deck"] },
  { category: "Transportation", items: ["Free Parking", "Airport Shuttle", "Valet Parking", "Car Rental Desk"] },
  { category: "Hotel Services", items: ["24h Front Desk", "Concierge Service", "Daily Housekeeping", "Laundry Service", "Luggage Storage"] },
  { category: "Connectivity & Media", items: ["Free High-Speed WiFi", "Smart TV", "Work Desk", "Business Center"] },
];

export default function HotelFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [activeSection, setActiveSection] = useState("basic"); // 'basic', 'location', 'gallery', 'amenities', 'rooms', 'dining_nearby', 'rules_faqs'
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    propertyType: "Resort",
    featuredBadge: "Top Rated",
    description: "",
    city: "Goa",
    state: "Goa",
    country: "India",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
    latitude: 15.5189,
    longitude: 73.7681,
    starRating: 5,
    rating: 4.8,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    ],
    amenities: [
      "Free WiFi",
      "Infinity Pool",
      "Spa & Wellness",
      "Breakfast Buffet",
      "Free Parking",
      "24h Front Desk",
      "Restaurant",
    ],
    rooms: [
      {
        roomName: "Deluxe Sea View Room",
        roomType: "Deluxe",
        bedType: "1 King Bed",
        maxAdults: 2,
        maxChildren: 1,
        maxOccupancy: 3,
        roomSize: "420 sq ft",
        pricePerNight: 5800,
        mealPlan: "Breakfast Included",
        refundable: true,
        amenities: ["Sea View Balcony", "Free WiFi", "AC", "Smart TV"],
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"],
      },
    ],
    diningOptions: [
      {
        name: "Waves Seafood & Wine Lounge",
        cuisine: "Mediterranean & Fresh Seafood",
        timing: "12:00 PM - 11:30 PM",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      },
    ],
    nearbyActivities: [
      {
        title: "Scuba Diving & 5 Water Sports Combo",
        category: "Water Sports",
        distance: "1.2 km from resort",
        price: 1999,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      },
    ],
    houseRules: {
      checkIn: "14:00 PM",
      checkOut: "11:00 AM",
      petsAllowed: true,
      smokingAllowed: false,
      cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    },
    faqs: [
      {
        question: "What is the check-in and check-out time?",
        answer: "Check-in begins at 2:00 PM and check-out is until 11:00 AM.",
      },
      {
        question: "Is breakfast included in the room price?",
        answer: "Yes, our Deluxe and Suite rates include a complimentary gourmet breakfast buffet.",
      },
    ],
  });

  // Load existing hotel in edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const res = await hotelsApi.getByIdAdmin(id);
        if (res) {
          setFormData({
            name: res.name || "",
            propertyType: res.propertyType || "Hotel",
            featuredBadge: res.featuredBadge || "",
            description: res.description || "",
            city: res.city || "",
            state: res.state || "",
            country: res.country || "India",
            address: res.address || "",
            postalCode: res.postalCode || "",
            phone: res.phone || "",
            email: res.email || "",
            latitude: res.latitude ? Number(res.latitude) : 15.5,
            longitude: res.longitude ? Number(res.longitude) : 73.7,
            starRating: res.starRating || 4,
            rating: res.rating ? Number(res.rating) : 4.5,
            checkInTime: res.checkInTime || "14:00",
            checkOutTime: res.checkOutTime || "11:00",
            images: Array.isArray(res.images) && res.images.length > 0 ? res.images : [],
            amenities: Array.isArray(res.amenities) ? res.amenities : [],
            rooms: Array.isArray(res.rooms) && res.rooms.length > 0 ? res.rooms : [],
            diningOptions: Array.isArray(res.diningOptions) ? res.diningOptions : [],
            nearbyActivities: Array.isArray(res.nearbyActivities) ? res.nearbyActivities : [],
            houseRules: res.houseRules || {},
            faqs: Array.isArray(res.faqs) ? res.faqs : [],
          });
        }
      } catch (err) {
        addToast(err.message || "Failed to load hotel data", "error");
        navigate("/hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id, isEdit, addToast, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Image Gallery Handlers
  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleUpdateImage = (index, url) => {
    const updated = [...formData.images];
    updated[index] = url;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Amenities Toggle
  const toggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item],
      };
    });
  };

  // Room Handlers
  const handleAddRoom = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          roomName: "Executive City View Room",
          roomType: "Executive",
          bedType: "1 King Bed",
          maxAdults: 2,
          maxChildren: 1,
          maxOccupancy: 3,
          roomSize: "400 sq ft",
          pricePerNight: 6500,
          mealPlan: "Breakfast Included",
          refundable: true,
          amenities: ["Free WiFi", "AC", "Smart TV"],
          images: [],
        },
      ],
    }));
  };

  const handleUpdateRoom = (index, field, value) => {
    const updated = [...formData.rooms];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, rooms: updated }));
  };

  const handleRemoveRoom = (index) => {
    if (formData.rooms.length <= 1) {
      addToast("Property must have at least one room category", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  // Dining Handlers
  const handleAddDining = () => {
    setFormData((prev) => ({
      ...prev,
      diningOptions: [
        ...prev.diningOptions,
        { name: "", cuisine: "", timing: "", image: "" },
      ],
    }));
  };

  const handleUpdateDining = (index, field, value) => {
    const updated = [...formData.diningOptions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, diningOptions: updated }));
  };

  const handleRemoveDining = (index) => {
    setFormData((prev) => ({
      ...prev,
      diningOptions: prev.diningOptions.filter((_, i) => i !== index),
    }));
  };

  // Activities Handlers
  const handleAddActivity = () => {
    setFormData((prev) => ({
      ...prev,
      nearbyActivities: [
        ...prev.nearbyActivities,
        { title: "", category: "Water Sports", distance: "", price: 1500, image: "" },
      ],
    }));
  };

  const handleUpdateActivity = (index, field, value) => {
    const updated = [...formData.nearbyActivities];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, nearbyActivities: updated }));
  };

  const handleRemoveActivity = (index) => {
    setFormData((prev) => ({
      ...prev,
      nearbyActivities: prev.nearbyActivities.filter((_, i) => i !== index),
    }));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const handleUpdateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, faqs: updated }));
  };

  const handleRemoveFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Form Validation & Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Property name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Street address is required";
    if (!formData.rooms || formData.rooms.length === 0) {
      newErrors.rooms = "At least one room configuration is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast("Please fill in all required fields highlighted in red", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        starRating: Number(formData.starRating),
        rating: Number(formData.rating),
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        rooms: formData.rooms.map((r) => ({
          ...r,
          pricePerNight: Number(r.pricePerNight),
          maxAdults: Number(r.maxAdults || 2),
          maxChildren: Number(r.maxChildren || 1),
          maxOccupancy: Number(r.maxOccupancy || 3),
        })),
        nearbyActivities: formData.nearbyActivities.map((a) => ({
          ...a,
          price: Number(a.price || 0),
        })),
      };

      if (isEdit) {
        await hotelsApi.updateAdmin(id, payload);
        addToast(`"${formData.name}" updated successfully!`, "success");
      } else {
        await hotelsApi.createAdmin(payload);
        addToast(`"${formData.name}" added to inventory successfully!`, "success");
      }

      navigate("/hotels");
    } catch (err) {
      addToast(err.message || "Failed to save hotel property", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Loader2 size={36} className="spin" style={{ color: "var(--brand-500)" }} />
      </div>
    );
  }

  const SECTIONS = [
    { id: "basic", label: "Basic Info", icon: Building2 },
    { id: "location", label: "Location & Coordinates", icon: MapPin },
    { id: "gallery", label: "Photos & Gallery", icon: ImageIcon },
    { id: "amenities", label: "Facilities & Amenities", icon: Sparkles },
    { id: "rooms", label: "Room Inventory & Rates", icon: Bed, count: formData.rooms.length },
    { id: "dining_nearby", label: "Dining & Things To Do", icon: Utensils },
    { id: "rules_faqs", label: "Rules & FAQs", icon: FileQuestion },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      {/* Top Breadcrumb & Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/hotels"
            className="btn btn-secondary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={15} />
            Back to Hotels
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              {isEdit ? `Edit: ${formData.name || "Hotel Property"}` : "Add New Hotel Property"}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Full-page direct contractor & inventory manager
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/hotels")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="spin" />
                Saving Property...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? "Update Property" : "Publish Hotel"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Section Tabs */}
      <div
        className="card"
        style={{
          padding: 6,
          marginBottom: 24,
          display: "flex",
          overflowX: "auto",
          gap: 4,
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
        }}
      >
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const active = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: active ? "var(--brand-500)" : "transparent",
                color: active ? "#ffffff" : "var(--text-secondary)",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} />
              <span>{sec.label}</span>
              {sec.count !== undefined && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                    background: active ? "rgba(255,255,255,0.25)" : "var(--bg-hover)",
                    color: active ? "#ffffff" : "var(--text-muted)",
                    fontWeight: 700,
                  }}
                >
                  {sec.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── 1. BASIC PROPERTY DETAILS ── */}
        {activeSection === "basic" && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Basic Property Details</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Primary display title, star classification, and marketing highlights for the mobile card
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {/* Hotel Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Property Name <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    borderColor: errors.name ? "var(--danger-500)" : undefined,
                    boxShadow: errors.name ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                  placeholder="e.g. The Aston Grand Resort"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4, display: "block" }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Property Category</label>
                <select
                  className="form-input"
                  value={formData.propertyType}
                  onChange={(e) => handleChange("propertyType", e.target.value)}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Star Rating (Official)</label>
                <select
                  className="form-input"
                  value={formData.starRating}
                  onChange={(e) => handleChange("starRating", Number(e.target.value))}
                >
                  <option value={5}>5-Star Luxury</option>
                  <option value={4}>4-Star Premium</option>
                  <option value={3}>3-Star Comfort</option>
                  <option value={2}>2-Star Standard</option>
                  <option value={1}>1-Star Budget</option>
                </select>
              </div>

              {/* Featured Badge */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Featured Badge (Mobile Highlight)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Top Rated, Beachfront, Bestseller"
                  value={formData.featuredBadge}
                  onChange={(e) => handleChange("featuredBadge", e.target.value)}
                />
              </div>

              {/* Guest Rating Score */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Overall Guest Rating (Out of 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  className="form-input"
                  value={formData.rating}
                  onChange={(e) => handleChange("rating", e.target.value)}
                />
              </div>

              {/* Description */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Property Overview Description</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Describe the experience, architectural features, views, and ambience..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── 2. LOCATION & COORDINATES ── */}
        {activeSection === "location" && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Location & Coordinates</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Physical address and GPS coordinates for in-app interactive map rendering
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {/* City */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  City <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    borderColor: errors.city ? "var(--danger-500)" : undefined,
                    boxShadow: errors.city ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                  placeholder="e.g. Goa, Jaipur, Mumbai"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {errors.city && (
                  <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4, display: "block" }}>
                    {errors.city}
                  </span>
                )}
              </div>

              {/* State */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>State / Province</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Goa, Rajasthan, Maharashtra"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>

              {/* Country */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Postal Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 403515"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                />
              </div>

              {/* Full Address */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Full Street Address <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    borderColor: errors.address ? "var(--danger-500)" : undefined,
                    boxShadow: errors.address ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                  placeholder="e.g. Candolim Beach Road, Near Fort Aguada, Candolim"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
                {errors.address && (
                  <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4, display: "block" }}>
                    {errors.address}
                  </span>
                )}
              </div>

              {/* Coordinates: Latitude & Longitude */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Latitude (GPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  placeholder="e.g. 15.5189"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Longitude (GPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  placeholder="e.g. 73.7681"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                />
              </div>

              {/* Contact Phone & Email */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Frontdesk Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +91 832 249 9000"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Reservations Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. reservations@hotel.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── 3. PHOTOS & GALLERY ── */}
        {activeSection === "gallery" && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Photo Gallery</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                  High-definition photography displayed on mobile search cards and gallery view
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddImage}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={14} /> Add Image URL
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {formData.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 10,
                    background: "var(--bg-hover)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 6,
                      background: "#000",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                        }}
                      >
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imgUrl}
                      onChange={(e) => handleUpdateImage(idx, e.target.value)}
                    />
                    {idx === 0 && (
                      <span style={{ fontSize: 11, color: "var(--brand-500)", fontWeight: 600, marginTop: 4, display: "block" }}>
                        ★ Primary Cover Photo (Hero image on mobile card)
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--danger-500)" }}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. FACILITIES & AMENITIES ── */}
        {activeSection === "amenities" && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Facilities & Amenities</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Select amenities matching the categorized facilities sheet shown in the mobile detail screen
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {COMMON_FACILITIES_PRESETS.map((cat, ci) => (
                <div key={ci} style={{ padding: 14, background: "var(--bg-hover)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
                    {cat.category}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cat.items.map((item) => {
                      const selected = formData.amenities.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAmenity(item)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "var(--radius-full)",
                            fontSize: 12,
                            fontWeight: selected ? 700 : 500,
                            border: selected
                              ? "1px solid var(--brand-500)"
                              : "1px solid var(--border-default)",
                            background: selected ? "var(--brand-500)" : "var(--bg-card)",
                            color: selected ? "#ffffff" : "var(--text-secondary)",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {selected ? "✓ " : "+ "}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. ROOM INVENTORY & RATES (REPEATER) ── */}
        {activeSection === "rooms" && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Room Types & Nightly Rates</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                  Configure room categories (Deluxe, Suite), occupancy, meal inclusions, and base nightly tariff
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddRoom}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={15} /> Add Room Category
              </button>
            </div>

            {errors.rooms && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--danger-500)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                {errors.rooms}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {formData.rooms.map((room, ri) => (
                <div
                  key={ri}
                  style={{
                    padding: 20,
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-card)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border-default)",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--brand-500)" }}>
                      #{ri + 1} {room.roomName || "Room Category"}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-500)" }}
                      onClick={() => handleRemoveRoom(ri)}
                      disabled={formData.rooms.length <= 1}
                    >
                      <Trash2 size={15} style={{ marginRight: 4 }} /> Remove Room
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                    {/* Room Name */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Room Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Deluxe Sea View Room"
                        value={room.roomName}
                        onChange={(e) => handleUpdateRoom(ri, "roomName", e.target.value)}
                      />
                    </div>

                    {/* Room Type */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Room Type</label>
                      <select
                        className="form-input"
                        value={room.roomType}
                        onChange={(e) => handleUpdateRoom(ri, "roomType", e.target.value)}
                      >
                        <option value="Deluxe">Deluxe</option>
                        <option value="Premium">Premium</option>
                        <option value="Suite">Suite</option>
                        <option value="Villa">Villa</option>
                        <option value="Standard">Standard</option>
                      </select>
                    </div>

                    {/* Bed Type */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Bed Configuration</label>
                      <select
                        className="form-input"
                        value={room.bedType}
                        onChange={(e) => handleUpdateRoom(ri, "bedType", e.target.value)}
                      >
                        {BED_TYPES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Per Night */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>
                        Price Per Night (₹ INR) <span style={{ color: "var(--danger-500)" }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="5800"
                        value={room.pricePerNight}
                        onChange={(e) => handleUpdateRoom(ri, "pricePerNight", e.target.value)}
                      />
                    </div>

                    {/* Max Occupancy */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Max Adults</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-input"
                        value={room.maxAdults}
                        onChange={(e) => handleUpdateRoom(ri, "maxAdults", e.target.value)}
                      />
                    </div>

                    {/* Meal Plan */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Meal Inclusion</label>
                      <select
                        className="form-input"
                        value={room.mealPlan}
                        onChange={(e) => handleUpdateRoom(ri, "mealPlan", e.target.value)}
                      >
                        {MEAL_PLANS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Room Size */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Room Size</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 420 sq ft"
                        value={room.roomSize}
                        onChange={(e) => handleUpdateRoom(ri, "roomSize", e.target.value)}
                      />
                    </div>

                    {/* Room Image URL */}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Room Photo URL</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                        value={room.images && room.images[0] ? room.images[0] : ""}
                        onChange={(e) => handleUpdateRoom(ri, "images", [e.target.value])}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 6. DINING OPTIONS & THINGS TO DO NEARBY ── */}
        {activeSection === "dining_nearby" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Dining Options */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>In-House Dining Options</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                    Restaurants, cafes, and rooftop lounges shown on the hotel detail screen
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddDining}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={14} /> Add Restaurant
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formData.diningOptions.map((d, di) => (
                  <div
                    key={di}
                    style={{
                      padding: 14,
                      background: "var(--bg-hover)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) auto",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Restaurant Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Waves Seafood & Lounge"
                        value={d.name}
                        onChange={(e) => handleUpdateDining(di, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Cuisine Type</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Mediterranean & Seafood"
                        value={d.cuisine}
                        onChange={(e) => handleUpdateDining(di, "cuisine", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Photo URL</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                        value={d.image}
                        onChange={(e) => handleUpdateDining(di, "image", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-500)", marginTop: 18 }}
                      onClick={() => handleRemoveDining(di)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Things To Do Nearby */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Things To Do Nearby (Activities)</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                    Water sports, beach walks, sightseeing spots around the hotel
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddActivity}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={14} /> Add Activity
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formData.nearbyActivities.map((act, ai) => (
                  <div
                    key={ai}
                    style={{
                      padding: 14,
                      background: "var(--bg-hover)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr)) auto",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Activity Title</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Scuba Diving & 5 Water Sports"
                        value={act.title}
                        onChange={(e) => handleUpdateActivity(ai, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Category</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Water Sports, Sightseeing"
                        value={act.category}
                        onChange={(e) => handleUpdateActivity(ai, "category", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Distance</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 1.2 km from resort"
                        value={act.distance}
                        onChange={(e) => handleUpdateActivity(ai, "distance", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Price (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="1999"
                        value={act.price}
                        onChange={(e) => handleUpdateActivity(ai, "price", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-500)", marginTop: 18 }}
                      onClick={() => handleRemoveActivity(ai)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. HOUSE RULES & FAQS ── */}
        {activeSection === "rules_faqs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* House Rules */}
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Property Policies & House Rules</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                Check-in/out policies, pet regulations, and cancellation guarantees
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Standard Check-in Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.checkInTime}
                    onChange={(e) => handleChange("checkInTime", e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Standard Check-out Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.checkOutTime}
                    onChange={(e) => handleChange("checkOutTime", e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Pets Policy</label>
                  <select
                    className="form-input"
                    value={formData.houseRules.petsAllowed ? "yes" : "no"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        houseRules: { ...prev.houseRules, petsAllowed: e.target.value === "yes" },
                      }))
                    }
                  >
                    <option value="yes">Pet-Friendly (Pets Allowed)</option>
                    <option value="no">Strictly No Pets</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Smoking Policy</label>
                  <select
                    className="form-input"
                    value={formData.houseRules.smokingAllowed ? "yes" : "no"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        houseRules: { ...prev.houseRules, smokingAllowed: e.target.value === "yes" },
                      }))
                    }
                  >
                    <option value="no">100% Non-Smoking Property</option>
                    <option value="yes">Designated Smoking Zones</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FAQs Accordion Builder */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Frequently Asked Questions (FAQs)</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                    Q&A accordion items displayed on the mobile hotel details page
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddFaq}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={14} /> Add FAQ
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formData.faqs.map((faq, fi) => (
                  <div
                    key={fi}
                    style={{
                      padding: 14,
                      background: "var(--bg-hover)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>
                        FAQ #{fi + 1}
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger-500)", padding: 2 }}
                        onClick={() => handleRemoveFaq(fi)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. What is the check-in time?"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(fi, "question", e.target.value)}
                    />
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="Answer..."
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(fi, "answer", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Floating Action Bar */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            background: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            * Ensure all property information is verified for accurate mobile booking.
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/hotels")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Saving Property...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Update Property" : "Publish Hotel"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
