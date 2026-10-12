import React, { useState, useEffect, useRef } from "react";
import { Loader2, ArrowUp, ArrowDown, Upload, Link as LinkIcon, X, Image as ImageIcon } from "lucide-react";
import { StatusBadge, ConfirmDeleteModal } from "../../components/ui/index.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { onboardingApi, uploadApi } from "../../services/api.js";
import { useApp } from "../../store/AppContext.jsx";

export default function OnboardingSlidesTab() {
  const { addToast } = useApp();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);

  // Upload vs URL mode ("upload" | "url")
  const [imageMode, setImageMode] = useState("upload");
  const fileInputRef = useRef(null);

  // Form State (Without badge)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    order: 1,
    isActive: true,
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await onboardingApi.getAll();
      setSlides(data);
    } catch (err) {
      addToast(err.message || "Failed to load onboarding slides", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setImageMode("upload");
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      order: slides.length + 1,
      isActive: true,
    });
    setAddModalOpen(true);
  };

  const openEditModal = (slide) => {
    setEditSlide(slide);
    setImageMode("upload");
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image || "",
      order: slide.order,
      isActive: slide.isActive,
    });
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      addToast("Image size must be less than 20MB", "error");
      return;
    }

    setUploadingImage(true);
    try {
      // Direct S3 / Neon Object Storage Upload
      const res = await uploadApi.uploadImage(file, "onboarding");
      if (res?.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        addToast("Image uploaded to Object Storage successfully!", "success");
      }
    } catch (err) {
      console.warn("Upload service error, falling back:", err);
      // Fallback preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        addToast("Image loaded", "info");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subtitle.trim() || !formData.image.trim()) {
      addToast("Please upload an image and fill all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardingApi.create(formData);
      addToast("Onboarding slide added successfully!", "success");
      setAddModalOpen(false);
      fetchSlides();
    } catch (err) {
      addToast(err.message || "Failed to add slide", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subtitle.trim() || !formData.image.trim()) {
      addToast("Please upload an image and fill all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardingApi.update(editSlide.id, formData);
      addToast("Onboarding slide updated successfully!", "success");
      setEditSlide(null);
      fetchSlides();
    } catch (err) {
      addToast(err.message || "Failed to update slide", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (slide) => {
    try {
      await onboardingApi.toggleStatus(slide.id);
      addToast(`Slide marked as ${slide.isActive ? "inactive" : "active"}`, "success");
      fetchSlides();
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    try {
      setSlides(reordered.map((item, idx) => ({ ...item, order: idx + 1 })));
      await onboardingApi.reorder(payload);
      addToast("Slide sequence reordered", "success");
    } catch (err) {
      addToast(err.message || "Failed to reorder slides", "error");
      fetchSlides();
    }
  };

  const confirmDelete = (slide) => {
    setSlideToDelete(slide);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!slideToDelete) return;
    setIsSubmitting(true);
    try {
      await onboardingApi.delete(slideToDelete.id);
      addToast("Onboarding slide deleted successfully", "error");
      setDeleteModalOpen(false);
      setSlideToDelete(null);
      fetchSlides();
    } catch (err) {
      addToast(err.message || "Failed to delete slide", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared Image Upload & URL input block
  const renderImageSection = () => (
    <div className="form-group">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label className="form-label" style={{ margin: 0 }}>Cover Image *</label>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className={`btn btn-sm ${imageMode === "upload" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: 11, padding: "2px 8px", height: "auto" }}
            onClick={() => setImageMode("upload")}
          >
            <Upload size={12} style={{ marginRight: 4 }} /> Upload File
          </button>
          <button
            type="button"
            className={`btn btn-sm ${imageMode === "url" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: 11, padding: "2px 8px", height: "auto" }}
            onClick={() => setImageMode("url")}
          >
            <LinkIcon size={12} style={{ marginRight: 4 }} /> Enter URL
          </button>
        </div>
      </div>

      {imageMode === "upload" ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageFileChange}
            style={{ display: "none" }}
          />

          {uploadingImage ? (
            <div
              style={{
                border: "2px dashed var(--brand-500)",
                borderRadius: "var(--radius-md)",
                padding: "24px 16px",
                textAlign: "center",
                background: "rgba(37, 99, 235, 0.05)",
              }}
            >
              <Loader2 size={28} className="spin" style={{ color: "var(--brand-600)", margin: "0 auto 6px" }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                Uploading image to Object Storage...
              </div>
            </div>
          ) : !formData.image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--bg-muted)",
                transition: "all 0.2s ease",
              }}
            >
              <ImageIcon size={28} style={{ color: "var(--brand-600)", margin: "0 auto 6px" }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                Click to browse image from device
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                PNG, JPG, WEBP, GIF (Max. 20MB)
              </div>
            </div>
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 10,
              background: "var(--bg-muted)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
            }}>
              <div style={{
                width: 80,
                height: 54,
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid var(--border-default)",
              }}>
                <img
                  src={formData.image}
                  alt="Uploaded preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                  Image Selected
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Ready to save
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--danger-500)", padding: 4 }}
                onClick={() => setFormData({ ...formData, image: "" })}
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            className="form-input"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
          {formData.image && (
            <div style={{
              marginTop: 8,
              width: 80,
              height: 54,
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              border: "1px solid var(--border-default)",
            }}>
              <img
                src={formData.image}
                alt="URL preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80";
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Onboarding Carousel Slides</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={openAddModal}
          >
            + Add Slide
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Order</th>
                <th style={{ width: 90 }}>Image</th>
                <th>Title & Subtitle</th>
                <th>Status</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "60px 10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--brand-600)" }} />
                      <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>
                        Loading onboarding slides...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : slides.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)" }}>
                    No onboarding slides found. Click "+ Add Slide" above to create one.
                  </td>
                </tr>
              ) : (
                slides.map((slide, index) => (
                  <tr key={slide.id}>
                    {/* Order & Reorder Controls */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontWeight: 600, color: "var(--brand-600)", minWidth: 20 }}>
                          #{slide.order}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ padding: 2, height: "auto", minHeight: "unset" }}
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, "up")}
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ padding: 2, height: "auto", minHeight: "unset" }}
                            disabled={index === slides.length - 1}
                            onClick={() => handleMoveOrder(index, "down")}
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Thumbnail */}
                    <td>
                      <div style={{
                        width: 70,
                        height: 48,
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        background: "var(--bg-muted)",
                        border: "1px solid var(--border-default)",
                      }}>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80";
                          }}
                        />
                      </div>
                    </td>

                    {/* Title & Subtitle */}
                    <td style={{ maxWidth: 420 }}>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                        {slide.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {slide.subtitle}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        onClick={() => handleToggleStatus(slide)}
                        style={{ cursor: "pointer" }}
                        title="Click to toggle status"
                      >
                        <StatusBadge status={slide.isActive ? "active" : "inactive"} />
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12, color: "var(--text-secondary)" }}
                          onClick={() => openEditModal(slide)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12, color: "var(--danger-500)" }}
                          onClick={() => confirmDelete(slide)}
                        >
                          Delete
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

      {/* Add Slide Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Create Onboarding Slide"
      >
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Slide Title *</label>
            <input
              className="form-input"
              placeholder="e.g. Explore the World with Ease"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle / Description *</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Find and book domestic & international flights, luxury resorts, and customized vacation packages."
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              required
            />
          </div>

          {/* Image Upload / URL Component */}
          {renderImageSection()}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Order Number</label>
              <input
                type="number"
                min={1}
                className="form-input"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input form-select"
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
              >
                <option value="active">Active (Published)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Slide"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Slide Modal */}
      <Modal
        open={Boolean(editSlide)}
        onClose={() => setEditSlide(null)}
        title="Edit Onboarding Slide"
      >
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Slide Title *</label>
            <input
              className="form-input"
              placeholder="e.g. Explore the World with Ease"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle / Description *</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Find and book domestic & international flights, luxury resorts, and customized vacation packages."
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              required
            />
          </div>

          {/* Image Upload / URL Component */}
          {renderImageSection()}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Order Number</label>
              <input
                type="number"
                min={1}
                className="form-input"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input form-select"
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
              >
                <option value="active">Active (Published)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditSlide(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Onboarding Slide"
        message={`Are you sure you want to delete "${slideToDelete?.title}"? This slide will no longer be visible in the mobile app.`}
        loading={isSubmitting}
      />
    </div>
  );
}
