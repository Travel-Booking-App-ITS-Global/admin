import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
} from "lucide-react";
import { uploadApi } from "../../services/api.js";
import { useApp } from "../../store/AppContext.jsx";

/**
 * Extracts a readable filename or domain from a long URL (strips query parameters)
 */
function getReadableFileName(url) {
  if (!url || typeof url !== "string") return "";
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (lastPart) {
      // Decode and truncate if too long
      const decoded = decodeURIComponent(lastPart);
      return decoded.length > 32 ? decoded.slice(0, 16) + "..." + decoded.slice(-12) : decoded;
    }
    return parsed.hostname;
  } catch {
    const clean = url.split("?")[0];
    const parts = clean.split("/").filter(Boolean);
    return parts[parts.length - 1] || "Image";
  }
}

/**
 * Premium Image Upload Component with Cloud Storage & URL support
 *
 * @param {Object} props
 * @param {string | string[]} props.value - Image URL or array of URLs
 * @param {Function} props.onChange - Callback with new URL(s)
 * @param {boolean} [props.multiple=false] - Whether to allow multiple image uploads
 * @param {string} [props.folder='destinations'] - S3 / Storage target folder
 * @param {string} [props.label] - Field label
 * @param {string} [props.helperText] - Small helper caption
 * @param {boolean} [props.required=false] - Required indicator
 * @param {string} [props.error] - Validation error message
 * @param {number} [props.maxFiles=12] - Max files if multiple
 * @param {number | string} [props.maxWidth] - Custom maximum width constraint
 */
export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  folder = "destinations",
  label,
  helperText,
  required = false,
  error = null,
  maxFiles = 12,
  maxWidth,
}) {
  const { addToast } = useApp();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("upload"); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Normalize values
  const currentImages = multiple
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : typeof value === "string"
    ? value
    : "";

  const hasSingleImage = !multiple && Boolean(currentImages);
  const hasGalleryImages = multiple && currentImages.length > 0;

  // ──────────────────────────────────────────────
  // FILE SELECTION & UPLOAD HANDLERS
  // ──────────────────────────────────────────────

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        addToast(`File "${file.name}" is not a valid image format`, "error");
        return false;
      }
      if (file.size > 15 * 1024 * 1024) {
        addToast(`File "${file.name}" exceeds 15MB limit`, "error");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      if (multiple) {
        setUploadProgress(`Uploading ${validFiles.length} photo(s)...`);
        const uploadedUrls = [];

        for (let i = 0; i < validFiles.length; i++) {
          setUploadProgress(`Uploading photo ${i + 1} of ${validFiles.length}...`);
          const res = await uploadApi.uploadImage(validFiles[i], folder);
          if (res?.url) {
            uploadedUrls.push(res.url);
          }
        }

        if (uploadedUrls.length > 0) {
          onChange([...currentImages, ...uploadedUrls]);
          addToast(
            `${uploadedUrls.length} photo(s) uploaded successfully!`,
            "success"
          );
        }
      } else {
        // Single file upload
        setUploadProgress("Uploading photo to storage...");
        const res = await uploadApi.uploadImage(validFiles[0], folder);
        if (res?.url) {
          onChange(res.url);
          addToast("Photo uploaded successfully!", "success");
        }
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      addToast(err?.message || "Failed to upload photo", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Add via direct URL
  const handleAddUrl = (e) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      addToast("Please enter a valid URL starting with http:// or https://", "error");
      return;
    }

    if (multiple) {
      onChange([...currentImages, trimmed]);
      setUrlInput("");
      addToast("Photo URL added to gallery!", "success");
    } else {
      onChange(trimmed);
      setUrlInput("");
      addToast("Photo URL updated!", "success");
    }
  };

  // Remove image
  const handleRemove = (indexToRemove) => {
    if (multiple) {
      onChange(currentImages.filter((_, i) => i !== indexToRemove));
    } else {
      onChange("");
    }
  };

  // Container width defaults: 560px for single cover, 760px for gallery
  const effectiveMaxWidth = maxWidth || (multiple ? 780 : 540);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: effectiveMaxWidth,
        width: "100%",
      }}
    >
      {/* Header: Label and Mode Switch */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {label && (
          <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>
            {label} {required && <span style={{ color: "var(--danger-500)" }}>*</span>}
          </label>
        )}

        {/* Tab switch: Upload vs URL */}
        <div
          style={{
            display: "inline-flex",
            background: "var(--bg-input)",
            borderRadius: "var(--radius-full)",
            padding: 3,
            border: "1px solid var(--border-default)",
            gap: 2,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            style={{
              padding: "3px 10px",
              borderRadius: "var(--radius-full)",
              fontSize: 11.5,
              fontWeight: activeTab === "upload" ? 700 : 500,
              background: activeTab === "upload" ? "var(--bg-card)" : "transparent",
              color: activeTab === "upload" ? "var(--brand-600)" : "var(--text-muted)",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              boxShadow: activeTab === "upload" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <Upload size={12} /> Upload from Device
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            style={{
              padding: "3px 10px",
              borderRadius: "var(--radius-full)",
              fontSize: 11.5,
              fontWeight: activeTab === "url" ? 700 : 500,
              background: activeTab === "url" ? "var(--bg-card)" : "transparent",
              color: activeTab === "url" ? "var(--brand-600)" : "var(--text-muted)",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              boxShadow: activeTab === "url" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <LinkIcon size={12} /> Web Link URL
          </button>
        </div>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* URL INPUT ROW (When URL tab selected) */}
      {activeTab === "url" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <input
            type="url"
            className="form-input"
            placeholder="https://images.unsplash.com/photo-..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            style={{ flex: 1, fontSize: 13 }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              flexShrink: 0,
              fontSize: 12,
              padding: "6px 14px",
            }}
          >
            <Plus size={14} /> Add URL
          </button>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. SINGLE IMAGE MODE                                       */}
      {/* ────────────────────────────────────────────────────────── */}
      {!multiple && (
        <>
          {hasSingleImage ? (
            /* SLEEK SINGLE PREVIEW CARD (When image already exists) */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                position: "relative",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: `1px solid ${isDragging ? "var(--brand-500)" : "var(--border-default)"}`,
                background: "var(--bg-card)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s ease",
              }}
            >
              {/* Image Preview with balanced 16:9 aspect ratio */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  maxHeight: 280,
                  background: "var(--bg-input)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={currentImages}
                  alt="Destination Cover Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";
                  }}
                />

                {/* Drag-over drop overlay */}
                {isDragging && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(37, 99, 235, 0.85)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      gap: 8,
                      zIndex: 10,
                    }}
                  >
                    <Upload size={32} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>
                      Drop image to replace cover
                    </span>
                  </div>
                )}

                {/* Upload spinner overlay */}
                {isUploading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      gap: 8,
                      zIndex: 10,
                    }}
                  >
                    <Loader2 className="animate-spin" size={30} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {uploadProgress || "Uploading new photo..."}
                    </span>
                  </div>
                )}

                {/* Top Floating Actions: Replace, View, Remove */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    zIndex: 5,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload different image"
                    style={{
                      padding: "5px 12px",
                      background: "rgba(15, 23, 42, 0.8)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "var(--radius-full)",
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <RefreshCw size={12} /> Replace
                  </button>

                  <a
                    href={currentImages}
                    target="_blank"
                    rel="noreferrer"
                    title="View full-size image"
                    style={{
                      padding: 6,
                      background: "rgba(15, 23, 42, 0.8)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    <ExternalLink size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemove(0)}
                    title="Remove cover photo"
                    style={{
                      padding: 6,
                      background: "rgba(220, 38, 38, 0.85)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Bottom Info Strip: Clean File info & Badge */}
              <div
                style={{
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-card)",
                  borderTop: "1px solid var(--border-default)",
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <ImageIcon size={14} color="var(--brand-600)" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontWeight: 600,
                      fontFamily: "monospace",
                      fontSize: 11.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {getReadableFileName(currentImages)}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--brand-700)",
                    background: "var(--brand-50)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle size={11} color="var(--brand-600)" /> Active Cover
                </span>
              </div>
            </div>
          ) : (
            /* COMPACT DROPZONE (When no image is set yet) */
            activeTab === "upload" && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${
                    isDragging
                      ? "var(--brand-500)"
                      : error
                      ? "var(--danger-500)"
                      : "var(--border-default)"
                  }`,
                  borderRadius: "var(--radius-lg)",
                  padding: "22px 18px",
                  textAlign: "center",
                  background: isDragging
                    ? "var(--brand-50)"
                    : "var(--bg-card)",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={26} color="var(--brand-500)" />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {uploadProgress || "Uploading photo..."}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--brand-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--brand-600)",
                        marginBottom: 2,
                      }}
                    >
                      <Upload size={18} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      Click to browse or drag & drop photo here
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      Supports PNG, JPG, JPEG, WEBP up to 15MB
                    </span>
                  </>
                )}
              </div>
            )
          )}
        </>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. MULTIPLE GALLERY MODE                                   */}
      {/* ────────────────────────────────────────────────────────── */}
      {multiple && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Gallery Grid: Uploaded Photos + Inline "Add More" Tile */}
          {hasGalleryImages && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 12,
              }}
            >
              {currentImages.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-input)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80";
                    }}
                  />

                  {/* Index pill */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      padding: "1px 6px",
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    #{idx + 1}
                  </span>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="Remove Photo"
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(220, 38, 38, 0.9)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Inline Add More Tile */}
              {activeTab === "upload" && currentImages.length < maxFiles && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  style={{
                    aspectRatio: "4 / 3",
                    border: `2px dashed ${isDragging ? "var(--brand-500)" : "var(--border-default)"}`,
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    background: isDragging ? "var(--brand-50)" : "var(--bg-card)",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    color: "var(--text-muted)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={20} color="var(--brand-500)" />
                  ) : (
                    <>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--bg-input)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--brand-600)",
                        }}
                      >
                        <Plus size={16} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
                        Add Photo
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* If gallery is completely empty, show initial dropzone */}
          {!hasGalleryImages && activeTab === "upload" && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${
                  isDragging
                    ? "var(--brand-500)"
                    : error
                    ? "var(--danger-500)"
                    : "var(--border-default)"
                }`,
                borderRadius: "var(--radius-lg)",
                padding: "24px 20px",
                textAlign: "center",
                background: isDragging ? "var(--brand-50)" : "var(--bg-card)",
                cursor: isUploading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={26} color="var(--brand-500)" />
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {uploadProgress || "Uploading photos..."}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--brand-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--brand-600)",
                      marginBottom: 2,
                    }}
                  >
                    <Upload size={18} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                    Click to browse or drop gallery photos
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    Supports PNG, JPG, JPEG, WEBP up to 15MB (Select multiple files)
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <span
          style={{
            color: "var(--danger-500)",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <AlertCircle size={13} /> {error}
        </span>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

