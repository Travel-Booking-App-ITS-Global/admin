import { useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlignLeft,
  FolderLock,
  UploadCloud,
  FileText,
  Download,
  Trash2,
} from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";

export default function ProfileTab() {
  const { adminName, adminEmail, adminAvatar, updateAdminProfile, addToast } =
    useApp();

  // Basic Profile State
  const [profileName, setProfileName] = useState(adminName);
  const [profileEmail, setProfileEmail] = useState(adminEmail);
  const [profileAvatar, setProfileAvatar] = useState(adminAvatar);

  // Extended Profile State (Mocked for Super Admin Details)
  const [profileRole, setProfileRole] = useState("Super Administrator");
  const [profilePhone, setProfilePhone] = useState("+1 (555) 123-4567");
  const [profileLocation, setProfileLocation] = useState("San Francisco, CA");
  const [profileBio, setProfileBio] = useState(
    "Leading the tech infrastructure and global operations for the platform.",
  );

  // Vault / Document Locker State
  const [vaultDocs, setVaultDocs] = useState([
    {
      id: "doc_1",
      name: "SuperAdmin_NDA_Signed.pdf",
      size: "2.4 MB",
      date: "Oct 12, 2025",
      tags: ["Legal", "Signed"],
    },
    {
      id: "doc_2",
      name: "Project_Architecture_V2.docx",
      size: "1.1 MB",
      date: "Nov 05, 2025",
      tags: ["Technical", "Design"],
    },
    {
      id: "doc_3",
      name: "Personal_ID_Copy.png",
      size: "845 KB",
      date: "Jan 18, 2026",
      tags: ["Identity", "Personal"],
    },
  ]);

  // Upload/Search/Filter states for tags
  const [selectedUploadTag, setSelectedUploadTag] = useState("General");
  const [vaultSearchTerm, setVaultSearchTerm] = useState("");
  const [activeVaultFilter, setActiveVaultFilter] = useState("All");
  const vaultFilterTags = ["All", "Legal", "Technical", "Identity", "Finance", "General"];


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast("Image size must be less than 2MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileAvatar(reader.result);
      addToast("Avatar loaded. Save profile to apply changes.", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      addToast("Name and Email are required", "error");
      return;
    }
    updateAdminProfile(profileName, profileEmail, profileAvatar);
    addToast("Profile details updated successfully!", "success");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      date: "Just now",
      tags: [selectedUploadTag],
    };
    setVaultDocs([newDoc, ...vaultDocs]);
    addToast(`${file.name} securely added to Vault with tag [${selectedUploadTag}].`, "success");
  };

  const handleDeleteDoc = (id, name) => {
    setVaultDocs(vaultDocs.filter((d) => d.id !== id));
    addToast(`${name} removed from Vault.`, "warning");
  };

  const filteredVaultDocs = vaultDocs.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(vaultSearchTerm.toLowerCase()) || 
                          (doc.tags && doc.tags.some(t => t.toLowerCase().includes(vaultSearchTerm.toLowerCase())));
    const matchesFilter = activeVaultFilter === "All" || (doc.tags && doc.tags.includes(activeVaultFilter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* ─── LEFT COLUMN: PROFILE DETAILS ─── */}
      <div className="card">
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-default)",
            background:
              "linear-gradient(to right, rgba(var(--brand-500-rgb, 59, 130, 246), 0.05), transparent)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <User size={18} color="var(--brand-500)" />
            Super Admin Profile
          </div>
          <div
            style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}
          >
            Manage your comprehensive administrative identity
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          <form
            onSubmit={handleSaveProfile}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Avatar Section (Premium Glass Look) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-lg)",
                border: "1px dashed var(--border-default)",
              }}
            >
              <div style={{ position: "relative" }}>
                {profileAvatar ? (
                  <img
                    src={profileAvatar}
                    alt="Avatar"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid var(--bg-card)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
                      color: "#fff",
                      fontSize: 32,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid var(--bg-card)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {profileName
                      ? profileName
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "SA"}
                  </div>
                )}
                <label
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--brand-500)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    border: "3px solid var(--bg-card)",
                    transition: "transform 0.2s",
                  }}
                  title="Upload Photo"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text-primary)",
                  }}
                >
                  Profile Avatar
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginBottom: 8,
                    marginTop: 4,
                  }}
                >
                  High-res JPG, PNG or GIF. Max size 2MB.
                </div>
                {profileAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileAvatar("");
                      addToast("Avatar removed. Save to apply.", "info");
                    }}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "none",
                      color: "var(--danger-500)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* Grid Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {/* Display Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: "relative" }}>
                  <User
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
                    style={{ paddingLeft: 38 }}
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Role */}
              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <div style={{ position: "relative" }}>
                  <Briefcase
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
                    style={{ paddingLeft: 38 }}
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail
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
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone
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
                    style={{ paddingLeft: 38 }}
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Office Location</label>
              <div style={{ position: "relative" }}>
                <MapPin
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
                  style={{ paddingLeft: 38 }}
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label">Administrative Bio</label>
              <div style={{ position: "relative" }}>
                <AlignLeft
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 12,
                    color: "var(--text-muted)",
                  }}
                />
                <textarea
                  className="form-input"
                  style={{
                    paddingLeft: 38,
                    minHeight: 80,
                    paddingTop: 10,
                    resize: "vertical",
                  }}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-end", padding: "10px 24px" }}
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: PERSONAL VAULT ─── */}
      <div
        className="card"
        style={{ border: "1px solid var(--border-default)" }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-default)",
            background:
              "linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)", // Greenish gradient
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FolderLock size={18} color="#10b981" />
            Personal Document Vault
          </div>
          <div
            style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}
          >
            Secure locker for your personal and project-related files
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Dropzone Area with Tag Selector */}
          <div
            style={{
              border: "2px dashed var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "20px 15px",
              textAlign: "center",
              background: "var(--bg-hover)",
              marginBottom: 20,
              position: "relative",
              transition: "border-color 0.2s",
            }}
          >
            <UploadCloud
              size={32}
              color="var(--brand-500)"
              style={{ margin: "0 auto 8px" }}
            />
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Drag & Drop your files here
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>
              or click to browse from your computer (Max 10MB)
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 50,
                opacity: 0,
                cursor: "pointer",
              }}
            />
            
            {/* Inline Tag selector before uploading */}
            <div 
              style={{ 
                position: "relative", 
                zIndex: 10, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 8,
                background: "var(--bg-card)",
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-default)",
                maxWidth: 240,
                margin: "0 auto"
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>File Tag:</span>
              <select
                value={selectedUploadTag}
                onChange={(e) => setSelectedUploadTag(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--brand-500)",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="General">General</option>
                <option value="Legal">Legal</option>
                <option value="Technical">Technical</option>
                <option value="Identity">Identity</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Search & Tags Filters */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Search documents by name or tag..."
                value={vaultSearchTerm}
                onChange={(e) => setVaultSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 32px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-hover)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 13,
                  opacity: 0.6,
                }}
              >
                🔍
              </span>
            </div>

            {/* Quick Tag Pills */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {vaultFilterTags.map((tag) => {
                const isActive = activeVaultFilter === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveVaultFilter(tag)}
                    style={{
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: isActive ? "var(--brand-500)" : "var(--bg-hover)",
                      color: isActive ? "#fff" : "var(--text-secondary)",
                      transition: "all 0.15s",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>Stored Documents ({filteredVaultDocs.length})</span>
              {activeVaultFilter !== "All" && (
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>
                  Filtered by: {activeVaultFilter}
                </span>
              )}
            </div>

            {filteredVaultDocs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "var(--text-muted)",
                  fontSize: 13,
                  background: "var(--bg-hover)",
                  border: "1px dashed var(--border-default)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                No documents found matching the search criteria.
              </div>
            ) : (
              filteredVaultDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        background:
                          "rgba(var(--brand-500-rgb, 59, 130, 246), 0.1)",
                        color: "var(--brand-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {doc.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          marginTop: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexWrap: "wrap"
                        }}
                      >
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>Uploaded {doc.date}</span>
                      </div>
                      
                      {/* Document tags display */}
                      <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                        {doc.tags && doc.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              background: tag === "Legal" ? "rgba(239, 68, 68, 0.1)" :
                                          tag === "Technical" ? "rgba(59, 130, 246, 0.1)" :
                                          tag === "Identity" ? "rgba(16, 185, 129, 0.1)" :
                                          tag === "Finance" ? "rgba(245, 158, 11, 0.1)" :
                                          "rgba(156, 163, 175, 0.1)",
                              color: tag === "Legal" ? "var(--danger-500)" :
                                     tag === "Technical" ? "var(--brand-600)" :
                                     tag === "Identity" ? "#10b981" :
                                     tag === "Finance" ? "#f59e0b" :
                                     "var(--text-muted)",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              fontWeight: 700,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: 6 }}
                      title="Download"
                      onClick={() =>
                        addToast(`Downloading ${doc.name}...`, "info")
                      }
                    >
                      <Download size={14} color="var(--text-secondary)" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: 6 }}
                      title="Delete"
                      onClick={() => handleDeleteDoc(doc.id, doc.name)}
                    >
                      <Trash2 size={14} color="var(--danger-500)" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
