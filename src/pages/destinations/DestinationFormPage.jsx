import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  MapPin,
  Calendar,
  Languages,
  Globe,
  Star,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Info,
  Clock,
  Ticket,
  Hourglass,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";
import {
  destinationsApi,
  geoApi,
  currenciesApi,
  languagesApi,
  timezonesApi,
  bestTimeApi,
} from "../../services/api.js";
import { ImageUpload } from "../../components/ui/index.jsx";
import AttractionModal from "./AttractionModal.jsx";

const SECTIONS = [
  { id: "basic", label: "Basic Details", icon: Building2 },
  { id: "travel_info", label: "Travel Information", icon: Calendar },
  { id: "gallery", label: "Media & Photos", icon: ImageIcon },
  { id: "attractions", label: "Top Attractions", icon: Sparkles },
];

export default function DestinationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();
  const isEdit = Boolean(id);

  const [activeSection, setActiveSection] = useState("basic");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    state: "",
    slug: "",
    tagline: "Most loved places by our travelers",
    description: "",
    shortDescription: "",
    coverImage:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=85",
    ],
    rating: 4.8,
    reviewCount: 18932,
    badge: "Top Destination",
    isFeatured: true,
    isTopDestination: true,
    bestTimeToVisit: "Apr-Jun",
    language: "English",
    timeZone: "CET +1",
    currencyCode: "EUR",
    status: "active",
    order: 1,
    attractions: [],
  });

  const [newImageInput, setNewImageInput] = useState("");

  // Master Data States
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [timezonesList, setTimezonesList] = useState([]);
  const [bestTimesList, setBestTimesList] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [loadingStates, setLoadingStates] = useState(false);

  // Attraction Modal State
  const [attractionModalOpen, setAttractionModalOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState(null);
  const [editingAttractionIndex, setEditingAttractionIndex] = useState(null);

  // Load all masters on mount
  useEffect(() => {
    let isCancelled = false;
    const fetchMasters = async () => {
      try {
        const [cRes, curRes, langRes, tzRes, btRes] = await Promise.all([
          geoApi.getCountries({ isActive: "true" }),
          currenciesApi.getCurrencies({ isActive: "true" }),
          languagesApi.getLanguages({ isActive: "true" }),
          timezonesApi.getTimezones({ isActive: "true" }),
          bestTimeApi.getBestTimes({ isActive: "true" }),
        ]);
        if (!isCancelled) {
          setCountriesList(Array.isArray(cRes) ? cRes : cRes?.data || []);
          setCurrenciesList(Array.isArray(curRes) ? curRes : curRes?.data || []);
          setLanguagesList(Array.isArray(langRes) ? langRes : langRes?.data || []);
          setTimezonesList(Array.isArray(tzRes) ? tzRes : tzRes?.data || []);
          setBestTimesList(Array.isArray(btRes) ? btRes : btRes?.data || []);
        }
      } catch (err) {
        console.error("Failed to load reference masters:", err);
      }
    };
    fetchMasters();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Load destination
  const loadDestination = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await destinationsApi.getById(id);
      if (res) {
        setFormData({
          name: res.name || "",
          country: res.country || "",
          state: res.state || "",
          slug: res.slug || "",
          tagline: res.tagline || "",
          description: res.description || "",
          shortDescription: res.shortDescription || "",
          coverImage: res.coverImage || "",
          images:
            Array.isArray(res.images) && res.images.length > 0
              ? res.images
              : [res.coverImage],
          rating: res.rating !== undefined ? Number(res.rating) : 4.8,
          reviewCount:
            res.reviewCount !== undefined ? res.reviewCount : 18932,
          badge: res.badge || "Top Destination",
          isFeatured: res.isFeatured !== undefined ? res.isFeatured : true,
          isTopDestination:
            res.isTopDestination !== undefined
              ? res.isTopDestination
              : true,
          bestTimeToVisit: res.bestTimeToVisit || "Apr-Jun",
          language: res.language || "English",
          timeZone: res.timeZone || "CET +1",
          currencyCode: res.currencyCode || "EUR",
          status: res.status || "active",
          order: res.order !== undefined ? res.order : 1,
          attractions: res.attractions || [],
        });
      }
    } catch (err) {
      addToast(err.message || "Failed to load destination", "error");
      navigate("/destinations");
    } finally {
      setLoading(false);
    }
  }, [id, addToast, navigate]);

  useEffect(() => {
    if (isEdit) {
      loadDestination();
    }
  }, [isEdit, loadDestination]);

  // Synchronize selected country ID when formData.country or countriesList changes
  useEffect(() => {
    if (formData.country && countriesList.length > 0) {
      const matched = countriesList.find(
        (c) =>
          c.name.toLowerCase() === formData.country.toLowerCase() ||
          c.code.toLowerCase() === formData.country.toLowerCase()
      );
      if (matched && matched.id !== selectedCountryId) {
        setSelectedCountryId(matched.id);
      }
    }
  }, [formData.country, countriesList, selectedCountryId]);

  // Load states whenever selectedCountryId changes
  useEffect(() => {
    if (!selectedCountryId) {
      setStatesList([]);
      return;
    }
    let isCancelled = false;
    setLoadingStates(true);
    geoApi
      .getStates({ countryId: selectedCountryId, isActive: "true" })
      .then((res) => {
        if (!isCancelled) {
          const list = Array.isArray(res) ? res : res?.data || [];
          setStatesList(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load states for country:", err);
      })
      .finally(() => {
        if (!isCancelled) setLoadingStates(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCountryId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    const country = formData.country;
    const autoSlug = `${val}-${country}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && isEdit ? prev.slug : autoSlug,
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
  };

  const handleCountrySelect = (e) => {
    const countryName = e.target.value;
    const matched = countriesList.find((c) => c.name === countryName);
    setSelectedCountryId(matched ? matched.id : "");

    const name = formData.name;
    const autoSlug = `${name}-${countryName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({
      ...prev,
      country: countryName,
      state: "", // Reset state when country changes
      slug: prev.slug && isEdit ? prev.slug : autoSlug,
    }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
  };

  // Add / Remove Gallery Image
  const handleAddGalleryImage = () => {
    if (!newImageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageInput.trim()],
    }));
    setNewImageInput("");
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Save Attraction (Ghoomne ki Jagah)
  const handleSaveAttraction = (attractionData) => {
    if (editingAttractionIndex !== null) {
      setFormData((prev) => {
        const updated = [...prev.attractions];
        updated[editingAttractionIndex] = {
          ...updated[editingAttractionIndex],
          ...attractionData,
        };
        return { ...prev, attractions: updated };
      });
      addToast("Attraction updated!", "success");
    } else {
      setFormData((prev) => ({
        ...prev,
        attractions: [...prev.attractions, attractionData],
      }));
      addToast("Attraction added to list!", "success");
    }
    setEditingAttraction(null);
    setEditingAttractionIndex(null);
  };

  const handleDeleteAttraction = (index) => {
    setFormData((prev) => ({
      ...prev,
      attractions: prev.attractions.filter((_, i) => i !== index),
    }));
    addToast("Attraction removed", "info");
  };

  // Client-Side Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.name?.trim()) {
      errs.name = "Destination / City name is required";
    }
    if (!formData.country?.trim()) {
      errs.country = "Country name is required";
    }
    if (!formData.description?.trim()) {
      errs.description = "Full city description is required";
    }
    if (!formData.coverImage?.trim()) {
      errs.coverImage = "Primary cover image URL is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      addToast("Please fill in all required fields marked in red", "error");
      if (errors.name || errors.country || errors.description) {
        setActiveSection("basic");
      } else if (errors.coverImage) {
        setActiveSection("gallery");
      }
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        country: formData.country.trim(),
        description: formData.description.trim(),
        rating: Number(formData.rating) || 4.8,
        reviewCount: Number(formData.reviewCount) || 0,
        order: Number(formData.order) || 0,
        images:
          formData.images.length > 0
            ? formData.images
            : [formData.coverImage.trim()],
      };

      if (isEdit) {
        await destinationsApi.update(id, payload);
        addToast(`"${formData.name}" updated successfully!`, "success");
      } else {
        await destinationsApi.create(payload);
        addToast(`"${formData.name}" created successfully!`, "success");
      }
      navigate("/destinations");
    } catch (err) {
      addToast(err.message || "Failed to save destination", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Loader2 size={36} className="animate-spin" style={{ color: "var(--brand-500)" }} />
      </div>
    );
  }

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
            to="/destinations"
            className="btn btn-secondary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={15} /> Back to Destinations
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              {isEdit ? `Edit: ${formData.name || "Destination"}` : "Add New Destination"}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Destination profile, travel highlights & tourist attractions manager
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/destinations")}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving Destination...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? "Update Destination" : "Save & Publish"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Section Tabs (Exact HotelFormPage styling) */}
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
              {sec.id === "attractions" && formData.attractions.length > 0 && (
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
                  {formData.attractions.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ── 1. BASIC DETAILS ──                                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeSection === "basic" && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Basic Destination Details
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Primary city identification, regional classification, and marketing descriptions
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {/* Destination Name */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Destination / City Name <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    borderColor: errors.name ? "var(--danger-500)" : undefined,
                    boxShadow: errors.name ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                  placeholder="e.g. Amsterdam, Paris, Bali, Dubai"
                  value={formData.name}
                  onChange={handleNameChange}
                />
                {errors.name && (
                  <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4, display: "block" }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Country */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Country <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <select
                  className="form-input form-select"
                  style={{
                    borderColor: errors.country ? "var(--danger-500)" : undefined,
                    boxShadow: errors.country ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                  value={formData.country}
                  onChange={handleCountrySelect}
                >
                  <option value="">Select Country</option>
                  {countriesList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.flagEmoji ? `${c.flagEmoji} ` : ""}{c.name} ({c.code})
                    </option>
                  ))}
                  {formData.country && !countriesList.some((c) => c.name.toLowerCase() === formData.country.toLowerCase()) && (
                    <option value={formData.country}>{formData.country} (Custom)</option>
                  )}
                </select>
                {errors.country && (
                  <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4, display: "block" }}>
                    {errors.country}
                  </span>
                )}
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Loaded from Countries Master. <Link to="/countries" style={{ color: "var(--brand-600)" }}>Manage</Link>
                </span>
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  State / Province / Region
                </label>
                <select
                  className="form-input form-select"
                  disabled={!formData.country || loadingStates}
                  value={formData.state || ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                >
                  <option value="">
                    {!formData.country
                      ? "Select Country first"
                      : loadingStates
                      ? "Loading states..."
                      : statesList.length === 0
                      ? "No states found in master (Optional)"
                      : "Select State / Province"}
                  </option>
                  {statesList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} {s.code ? `(${s.code})` : ""}
                    </option>
                  ))}
                  {formData.state && !statesList.some((s) => s.name.toLowerCase() === formData.state.toLowerCase()) && (
                    <option value={formData.state}>{formData.state} (Custom)</option>
                  )}
                </select>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  States linked to {formData.country || "selected country"}. <Link to="/states" style={{ color: "var(--brand-600)" }}>Manage</Link>
                </span>
              </div>

              {/* Slug */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. amsterdam-netherlands"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                />
              </div>

              {/* Badge */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Featured Badge
                </label>
                <select
                  className="form-input form-select"
                  value={formData.badge}
                  onChange={(e) => handleChange("badge", e.target.value)}
                >
                  <option value="Top Destination">Top Destination</option>
                  <option value="Trending">Trending</option>
                  <option value="Popular">Popular</option>
                  <option value="Must Visit">Must Visit</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Publish Status
                </label>
                <select
                  className="form-input form-select"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="active">Active / Published</option>
                  <option value="inactive">Inactive / Draft</option>
                </select>
              </div>

              {/* Rating */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Rating Score (Out of 5.0)
                </label>
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

              {/* Review Count */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Total Verified Reviews
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 18932"
                  value={formData.reviewCount}
                  onChange={(e) => handleChange("reviewCount", e.target.value)}
                />
              </div>

              {/* Order */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Display Priority Order
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 1"
                  value={formData.order}
                  onChange={(e) => handleChange("order", e.target.value)}
                />
              </div>

              {/* Tagline */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Tagline / Hero Subtitle
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Most loved places by our travelers"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                />
              </div>

              {/* Short Summary */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Short Summary (Shown in card listings)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Charming canals, historic streets and vibrant culture."
                  value={formData.shortDescription}
                  onChange={(e) => handleChange("shortDescription", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Full City Description <span style={{ color: "var(--danger-500)" }}>*</span>
                </label>
                <textarea
                  className="form-input"
                  rows={5}
                  style={{
                    borderColor: errors.description ? "var(--danger-500)" : undefined,
                    boxShadow: errors.description ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                  placeholder="Describe the cultural heritage, sights, canal system, history, architecture, and overall travel experience..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                {errors.description && (
                  <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4, display: "block" }}>
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Display Switches */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: 24,
                  padding: "16px 20px",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  flexWrap: "wrap",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange("isFeatured", e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: "var(--brand-600)" }}
                  />
                  <span>Show in Explore Top Destinations (Home Page Carousel)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isTopDestination}
                    onChange={(e) => handleChange("isTopDestination", e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: "var(--brand-600)" }}
                  />
                  <span>Show in Explore Top Destinations List</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ── 2. TRAVEL INFORMATION ──                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeSection === "travel_info" && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Travel Reference & Quick Indicators
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Essential travel indicators displayed directly to tourists for planning their itinerary
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {/* Best Time to Visit */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Best Time to Visit
                </label>
                <select
                  className="form-input form-select"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => handleChange("bestTimeToVisit", e.target.value)}
                >
                  <option value="">Select Best Time Period</option>
                  {bestTimesList.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} {b.season ? `(${b.season})` : ""}
                    </option>
                  ))}
                  {formData.bestTimeToVisit &&
                    !bestTimesList.some(
                      (b) => b.name.toLowerCase() === formData.bestTimeToVisit.toLowerCase()
                    ) && (
                      <option value={formData.bestTimeToVisit}>
                        {formData.bestTimeToVisit} (Custom)
                      </option>
                    )}
                </select>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Ideal season or months for holiday travelers.{" "}
                  <Link to="/best-time-to-visit" style={{ color: "var(--brand-600)" }}>
                    Manage Master
                  </Link>
                </span>
              </div>

              {/* Primary Spoken Languages */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Primary Spoken Languages
                </label>
                <select
                  className="form-input form-select"
                  value={formData.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                >
                  <option value="">Select Primary Language</option>
                  {languagesList.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name} {l.nativeName ? `(${l.nativeName})` : ""}
                    </option>
                  ))}
                  {formData.language &&
                    !languagesList.some(
                      (l) => l.name.toLowerCase() === formData.language.toLowerCase()
                    ) && (
                      <option value={formData.language}>
                        {formData.language} (Custom)
                      </option>
                    )}
                </select>

                {/* Quick selectable chips/pills for multiple languages */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {languagesList.slice(0, 10).map((l) => {
                    const isSelected = (formData.language || "")
                      .split(",")
                      .map((s) => s.trim().toLowerCase())
                      .includes(l.name.toLowerCase());
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          const current = (formData.language || "")
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          let next;
                          if (current.map((c) => c.toLowerCase()).includes(l.name.toLowerCase())) {
                            next = current.filter((c) => c.toLowerCase() !== l.name.toLowerCase());
                          } else {
                            next = [...current, l.name];
                          }
                          handleChange("language", next.join(", "));
                        }}
                        style={{
                          padding: "2px 8px",
                          fontSize: 11,
                          borderRadius: 12,
                          border: isSelected ? "1px solid var(--brand-500)" : "1px solid var(--border-default)",
                          background: isSelected ? "var(--brand-50)" : "var(--bg-card)",
                          color: isSelected ? "var(--brand-600)" : "var(--text-secondary)",
                          cursor: "pointer",
                        }}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {l.name}
                      </button>
                    );
                  })}
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                  Selected languages: {formData.language || "None"}.{" "}
                  <Link to="/languages" style={{ color: "var(--brand-600)" }}>
                    Manage Master
                  </Link>
                </span>
              </div>

              {/* Time Zone */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Time Zone
                </label>
                <select
                  className="form-input form-select"
                  value={formData.timeZone}
                  onChange={(e) => handleChange("timeZone", e.target.value)}
                >
                  <option value="">Select Time Zone</option>
                  {timezonesList.map((t) => (
                    <option key={t.id} value={t.code}>
                      {t.code} — {t.name}
                    </option>
                  ))}
                  {formData.timeZone &&
                    !timezonesList.some(
                      (t) => t.code.toLowerCase() === formData.timeZone.toLowerCase()
                    ) && (
                      <option value={formData.timeZone}>
                        {formData.timeZone} (Custom)
                      </option>
                    )}
                </select>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Standard time zone offset for tourist clocks.{" "}
                  <Link to="/timezones" style={{ color: "var(--brand-600)" }}>
                    Manage Master
                  </Link>
                </span>
              </div>

              {/* Local Currency Code */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Local Currency Code
                </label>
                <select
                  className="form-input form-select"
                  value={formData.currencyCode}
                  onChange={(e) => handleChange("currencyCode", e.target.value)}
                >
                  <option value="">Select Currency</option>
                  {currenciesList.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} ({c.symbol}) — {c.name}
                    </option>
                  ))}
                  {formData.currencyCode &&
                    !currenciesList.some(
                      (c) => c.code.toLowerCase() === formData.currencyCode.toLowerCase()
                    ) && (
                      <option value={formData.currencyCode}>
                        {formData.currencyCode} (Custom)
                      </option>
                    )}
                </select>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  ISO 3-letter currency code.{" "}
                  <Link to="/currencies" style={{ color: "var(--brand-600)" }}>
                    Manage Master
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ── 3. MEDIA & GALLERY ──                                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeSection === "gallery" && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Photos & Media Gallery
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Primary hero cover photo and high-resolution city gallery imagery
            </p>

            <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Primary Hero Cover Image */}
              <div
                style={{
                  background: "var(--bg-card)",
                  padding: "20px 22px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                }}
              >
                <ImageUpload
                  label="Primary Hero Cover Image"
                  required
                  value={formData.coverImage}
                  onChange={(url) => handleChange("coverImage", url)}
                  error={errors.coverImage}
                  folder="destinations"
                  maxWidth={540}
                  helperText="High-resolution banner photo displayed across listings and cards"
                />
              </div>

              {/* Additional Photos */}
              <div
                style={{
                  background: "var(--bg-card)",
                  padding: "20px 22px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                }}
              >
                <ImageUpload
                  label="Additional Destination Photos (Gallery)"
                  multiple
                  value={formData.images}
                  onChange={(urls) => handleChange("images", urls)}
                  folder="destinations"
                  maxWidth={640}
                  helperText="City sights, landmarks, and landscape photos for tourist exploration"
                  maxFiles={12}
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ── 4. TOP ATTRACTIONS (GHOOMNE KI JAGAH) ──                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeSection === "attractions" && (
          <div className="card" style={{ padding: 28 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom: "1px solid var(--border-default)",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  Top Tourist Attractions in {formData.name || "Destination"}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                  Configure tourist spots, entry fees, operational timings, duration, and photos
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAttraction(null);
                  setEditingAttractionIndex(null);
                  setAttractionModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={16} /> Add New Attraction
              </button>
            </div>

            {formData.attractions.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  border: "2px dashed var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-app)",
                }}
              >
                <Sparkles size={40} color="var(--brand-500)" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  No Attractions Added Yet
                </h3>
                <p style={{ margin: "6px 0 18px", color: "var(--text-muted)", fontSize: 13 }}>
                  Add famous sights and monuments like Eiffel Tower, Canals, Temples, Museums for {formData.name || "this city"}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAttraction(null);
                    setEditingAttractionIndex(null);
                    setAttractionModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} style={{ marginRight: 4 }} /> Add First Attraction
                </button>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "30%" }}>Attraction Name</th>
                      <th>Timings</th>
                      <th>Entry Fee</th>
                      <th>Duration</th>
                      <th>Best Time to Visit</th>
                      <th>Rating</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.attractions.map((attr, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <img
                              src={attr.coverImage}
                              alt={attr.title}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: "var(--radius-md)",
                                objectFit: "cover",
                                border: "1px solid var(--border-default)",
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                                {attr.title}
                              </div>
                              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                {attr.location || `${formData.name}, ${formData.country}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                            {attr.timings || "9:00 AM – 11:45 PM"}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-success">
                            {attr.entryFee || "₹2,100 – ₹2,900"}
                          </span>
                        </td>
                        <td>{attr.duration || "1 – 2 Hours"}</td>
                        <td>{attr.bestTimeToVisit || "Sunset (6 PM – 8 PM)"}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star size={13} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontWeight: 700 }}>{attr.rating || 4.8}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAttraction(attr);
                                setEditingAttractionIndex(idx);
                                setAttractionModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Edit Attraction"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttraction(idx)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: "var(--danger-500)" }}
                              title="Delete Attraction"
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
          </div>
        )}

        {/* Form Bottom Save Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--border-default)",
          }}
        >
          <Link to="/destinations" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 170, justifyContent: "center" }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? "Update Destination" : "Save & Publish"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Attraction Add/Edit Modal */}
      <AttractionModal
        isOpen={attractionModalOpen}
        onClose={() => {
          setAttractionModalOpen(false);
          setEditingAttraction(null);
          setEditingAttractionIndex(null);
        }}
        onSave={handleSaveAttraction}
        attraction={editingAttraction}
        destinationName={formData.name}
        destinationCountry={formData.country}
      />
    </div>
  );
}
