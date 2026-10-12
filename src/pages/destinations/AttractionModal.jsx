import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  Ticket,
  Clock,
  Hourglass,
  Star,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function AttractionModal({
  isOpen,
  onClose,
  onSave,
  attraction = null,
  destinationName = "",
  destinationCountry = "",
}) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    location: "",
    about: "",
    coverImage: "",
    photos: [],
    rating: 4.8,
    reviewsCount: "12k",
    timings: "9:00 AM – 11:45 PM",
    entryFee: "₹2,100 – ₹2,900",
    duration: "1 – 2 Hours",
    bestTimeToVisit: "Sunset (6 PM – 8 PM)",
    isTopAttraction: true,
    status: "active",
  });

  const [newPhotoInput, setNewPhotoInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (attraction) {
      setFormData({
        title: attraction.title || "",
        subtitle: attraction.subtitle || "",
        location:
          attraction.location ||
          (destinationName ? `${destinationName}, ${destinationCountry}` : ""),
        about: attraction.about || "",
        coverImage: attraction.coverImage || "",
        photos: Array.isArray(attraction.photos) ? attraction.photos : [],
        rating: attraction.rating !== undefined ? Number(attraction.rating) : 4.8,
        reviewsCount: attraction.reviewsCount || "12k",
        timings: attraction.timings || "9:00 AM – 11:45 PM",
        entryFee: attraction.entryFee || "₹2,100 – ₹2,900",
        duration: attraction.duration || "1 – 2 Hours",
        bestTimeToVisit: attraction.bestTimeToVisit || "Sunset (6 PM – 8 PM)",
        isTopAttraction:
          attraction.isTopAttraction !== undefined
            ? attraction.isTopAttraction
            : true,
        status: attraction.status || "active",
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        location: destinationName
          ? `${destinationName}, ${destinationCountry}`
          : "",
        about: "",
        coverImage:
          "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=85",
        photos: [
          "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=85",
          "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=1200&q=85",
        ],
        rating: 4.8,
        reviewsCount: "12k",
        timings: "9:00 AM – 11:45 PM",
        entryFee: "₹2,100 – ₹2,900",
        duration: "1 – 2 Hours",
        bestTimeToVisit: "Sunset (6 PM – 8 PM)",
        isTopAttraction: true,
        status: "active",
      });
    }
    setErrors({});
  }, [attraction, destinationName, destinationCountry, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title?.trim()) {
      errs.title = "Attraction title is required";
    }
    if (!formData.coverImage?.trim()) {
      errs.coverImage = "Cover image URL is required";
    }
    if (!formData.about?.trim()) {
      errs.about = "About description is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const photosArray =
        formData.photos.length > 0 ? formData.photos : [formData.coverImage];
      await onSave({
        ...formData,
        photos: photosArray,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhotoInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhotoInput.trim()],
    }));
    setNewPhotoInput("");
  };

  const handleRemovePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 9999,
        padding: "32px 16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        className="modal modal-lg"
        style={{
          maxWidth: 680,
          width: "100%",
          maxHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--border-default)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Fixed at Top) */}
        <div
          className="modal-header"
          style={{
            padding: "16px 24px",
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-default)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background: "rgba(59, 130, 246, 0.12)",
                color: "var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                {attraction ? "Edit Tourist Attraction" : "Add New Tourist Attraction"}
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                {destinationName ? `Location: ${destinationName}, ${destinationCountry}` : "Configure attraction details"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body & Form (Scrollable Area) */}
        <form
          id="attraction-form"
          onSubmit={handleSubmit}
          className="modal-body"
          style={{
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: "1 1 auto",
            minHeight: 0,
          }}
        >
          {/* Title & Subtitle */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Attraction Title <span style={{ color: "var(--danger-500)" }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                style={{
                  borderColor: errors.title ? "var(--danger-500)" : undefined,
                  boxShadow: errors.title ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                }}
                placeholder="e.g. Iconic Canals, Eiffel Tower, Louvre"
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
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Subtitle / Highlight
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Historic Waterways & Bridges"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
          </div>

          {/* Location, Rating, Reviews */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.7fr 0.8fr", gap: 14 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Specific Location / Address
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amsterdam, Netherlands"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Rating (⭐)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="form-input"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.8 })}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Reviews Count
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 12k or 18,932"
                value={formData.reviewsCount}
                onChange={(e) => setFormData({ ...formData, reviewsCount: e.target.value })}
              />
            </div>
          </div>

          {/* Practical Info: Timings, Entry Fee, Duration, Best Time */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              background: "var(--bg-hover)",
              padding: 14,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                🕒 Timings
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: 12, padding: "6px 8px" }}
                placeholder="9:00 AM – 11:45 PM"
                value={formData.timings}
                onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                🎟️ Entry Fee
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: 12, padding: "6px 8px" }}
                placeholder="₹2,100 – ₹2,900"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                ⏳ Duration
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: 12, padding: "6px 8px" }}
                placeholder="1 – 2 Hours"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                🌅 Best Time
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: 12, padding: "6px 8px" }}
                placeholder="Sunset (6 PM – 8 PM)"
                value={formData.bestTimeToVisit}
                onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
              />
            </div>
          </div>

          {/* About Description */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              About Attraction <span style={{ color: "var(--danger-500)" }}>*</span>
            </label>
            <textarea
              className="form-input"
              rows={3}
              style={{
                borderColor: errors.about ? "var(--danger-500)" : undefined,
                boxShadow: errors.about ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                resize: "vertical",
              }}
              placeholder="Comprehensive details, historic significance, observation points, boat tour highlights, etc."
              value={formData.about}
              onChange={(e) => {
                setFormData({ ...formData, about: e.target.value });
                if (errors.about) setErrors((prev) => ({ ...prev, about: null }));
              }}
            />
            {errors.about && (
              <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4 }}>
                {errors.about}
              </span>
            )}
          </div>

          {/* Hero Cover Image URL */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Hero Cover Image URL <span style={{ color: "var(--danger-500)" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="text"
                className="form-input"
                style={{
                  flex: 1,
                  borderColor: errors.coverImage ? "var(--danger-500)" : undefined,
                  boxShadow: errors.coverImage ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : undefined,
                }}
                placeholder="https://images.unsplash.com/..."
                value={formData.coverImage}
                onChange={(e) => {
                  setFormData({ ...formData, coverImage: e.target.value });
                  if (errors.coverImage) setErrors((prev) => ({ ...prev, coverImage: null }));
                }}
              />
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 6,
                    objectFit: "cover",
                    border: "1px solid var(--border-default)",
                    flexShrink: 0,
                  }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
            {errors.coverImage && (
              <span style={{ color: "var(--danger-500)", fontSize: 12, marginTop: 4 }}>
                {errors.coverImage}
              </span>
            )}
          </div>

          {/* Photos Gallery */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Photos Gallery
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Paste photo image URL and click Add"
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
                className="btn btn-secondary btn-sm"
                onClick={handleAddPhoto}
                style={{ flexShrink: 0 }}
              >
                <Plus size={14} style={{ marginRight: 4 }} /> Add Photo
              </button>
            </div>

            {formData.photos.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                {formData.photos.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      overflow: "hidden",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Photo ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
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
                        width: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer (Fixed at Bottom) */}
        <div
          className="modal-footer"
          style={{
            padding: "14px 24px",
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border-default)",
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="attraction-form"
            className="btn btn-primary"
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {attraction ? "Update Attraction" : "Save Attraction"}
          </button>
        </div>
      </div>
    </div>
  );
}
