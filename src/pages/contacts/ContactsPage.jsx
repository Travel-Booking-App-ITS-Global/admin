import { useState, useEffect, useCallback } from "react";
import {
  Phone,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "../../components/ui/index.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useApp } from "../../store/AppContext.jsx";
import { contactsApi } from "../../services/api.js";

const TYPE_CONFIG = {
  Flight: {
    bg: "rgba(59, 130, 246, 0.1)",
    color: "#2563eb",
    border: "rgba(59, 130, 246, 0.25)",
  },
  Hotel: {
    bg: "rgba(245, 158, 11, 0.1)",
    color: "#d97706",
    border: "rgba(245, 158, 11, 0.25)",
  },
  Cab: {
    bg: "rgba(16, 185, 129, 0.1)",
    color: "#059669",
    border: "rgba(16, 185, 129, 0.25)",
  },
  Emergency: {
    bg: "rgba(239, 68, 68, 0.1)",
    color: "#dc2626",
    border: "rgba(239, 68, 68, 0.25)",
  },
  General: {
    bg: "rgba(139, 92, 246, 0.1)",
    color: "#7c3aed",
    border: "rgba(139, 92, 246, 0.25)",
  },
};

const CATEGORIES = ["All", "Flight", "Hotel", "Cab", "Emergency", "General"];

export default function ContactsPage() {
  const { addToast } = useApp();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    type: "Flight",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadContacts = useCallback(async () => {
    try {
      const data = await contactsApi.getAll({
        search: searchTerm,
        type: selectedType,
      });
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to load contacts:", err);
      addToast("Failed to load contacts from database", "error");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedType, addToast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Contact Name / Department is required";
    if (!formData.phone.trim()) {
      errs.phone = "Support Phone number is required";
    } else if (formData.phone.replace(/[^0-9]/g, "").length < 6) {
      errs.phone = "Enter a valid phone number (at least 6 digits)";
    }
    if (formData.whatsapp && formData.whatsapp.replace(/[^0-9]/g, "").length < 6) {
      errs.whatsapp = "Enter a valid WhatsApp number (at least 6 digits)";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      phone: "",
      whatsapp: "",
      type: "Flight",
    });
    setFormErrors({});
    setAddModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setActiveContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      whatsapp: contact.whatsapp || "",
      type: contact.type || "Flight",
    });
    setFormErrors({});
    setEditModalOpen(true);
  };

  const handleOpenDelete = (contact) => {
    setActiveContact(contact);
    setDeleteModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      const newContact = await contactsApi.create(formData);
      setContacts((prev) => [...prev, newContact]);
      addToast(`Contact "${formData.name}" successfully created!`, "success");
      setAddModalOpen(false);
    } catch (err) {
      addToast(err.message || "Failed to create contact", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm() || !activeContact) return;

    setActionLoading(true);
    try {
      const updated = await contactsApi.update(activeContact.id, formData);
      setContacts((prev) =>
        prev.map((c) => (c.id === activeContact.id ? updated : c))
      );
      addToast(`Contact "${formData.name}" updated in database!`, "success");
      setEditModalOpen(false);
    } catch (err) {
      addToast(err.message || "Failed to update contact", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeContact) return;
    setActionLoading(true);
    try {
      await contactsApi.delete(activeContact.id);
      setContacts((prev) => prev.filter((c) => c.id !== activeContact.id));
      addToast(`Contact "${activeContact.name}" deleted from database!`, "success");
      setDeleteModalOpen(false);
    } catch (err) {
      addToast(err.message || "Failed to delete contact", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard!`, "success");
  };

  return (
    <div>
      <PageHeader
        title="Contact Management"
        subtitle="Manage inquiry numbers and WhatsApp contacts"
        actions={
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} style={{ marginRight: 6 }} />
            Add Contact
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const active = selectedType === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedType(cat)}
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
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: 260, flex: "1 1 260px", maxWidth: 400 }}>
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
            style={{ paddingLeft: 36, fontSize: 13 }}
            placeholder="Search by name, phone, or WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Loader2 size={32} className="spin" style={{ color: "var(--brand-500)" }} />
        </div>
      ) : contacts.length === 0 ? (
        <div
          className="card"
          style={{
            padding: 50,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Phone size={36} style={{ color: "var(--text-muted)" }} />
          <div style={{ fontSize: 16, fontWeight: 700 }}>No Support Contacts Found</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400 }}>
            {searchTerm || selectedType !== "All"
              ? "No contacts match your active search or category filter. Try clearing the filter."
              : "No support contacts have been created yet. Add your first customer inquiry contact."}
          </div>
          {searchTerm || selectedType !== "All" ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("All");
              }}
            >
              Clear Filters
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
              <Plus size={14} style={{ marginRight: 6 }} />
              Add First Contact
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: 18,
          }}
        >
          {contacts.map((c) => (
            <div key={c.id} className="card" style={{ padding: "18px 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text-primary)",
                  }}
                >
                  {c.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    background: "var(--brand-50)",
                    color: "var(--brand-700)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 600,
                  }}
                >
                  {c.type}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontSize: 16 }}>📞</span>
                  <a
                    href={`tel:${c.phone}`}
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    {c.phone}
                  </a>
                </div>

                {c.whatsapp && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>💬</span>
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        textDecoration: "none",
                      }}
                    >
                      {c.whatsapp}
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenEdit(c)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--danger-500)" }}
                  onClick={() => handleOpenDelete(c)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => !actionLoading && setAddModalOpen(false)}
        title="Add Support Contact"
      >
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Department / Contact Name *</label>
            <input
              type="text"
              className={`form-input ${formErrors.name ? "input-error" : ""}`}
              style={{
                borderColor: formErrors.name ? "#ef4444" : undefined,
                boxShadow: formErrors.name
                  ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
                  : undefined,
              }}
              placeholder="e.g. Flights Support, VIP Helpdesk"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: null });
              }}
            />
            {formErrors.name && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                <AlertCircle size={13} />
                <span>{formErrors.name}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Service Category *</label>
            <select
              className="form-input form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Flight">Flight</option>
              <option value="Hotel">Hotel</option>
              <option value="Cab">Cab</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Calling Phone Number *</label>
            <input
              type="text"
              className={`form-input ${formErrors.phone ? "input-error" : ""}`}
              style={{
                borderColor: formErrors.phone ? "#ef4444" : undefined,
                boxShadow: formErrors.phone
                  ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
                  : undefined,
              }}
              placeholder="e.g. +91 1800 200 1234"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
              }}
            />
            {formErrors.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                <AlertCircle size={13} />
                <span>{formErrors.phone}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Number (Optional)</label>
            <input
              type="text"
              className={`form-input ${formErrors.whatsapp ? "input-error" : ""}`}
              style={{
                borderColor: formErrors.whatsapp ? "#ef4444" : undefined,
                boxShadow: formErrors.whatsapp
                  ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
                  : undefined,
              }}
              placeholder="e.g. +91 98765 00001"
              value={formData.whatsapp}
              onChange={(e) => {
                setFormData({ ...formData, whatsapp: e.target.value });
                if (formErrors.whatsapp) setFormErrors({ ...formErrors, whatsapp: null });
              }}
            />
            {formErrors.whatsapp && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                <AlertCircle size={13} />
                <span>{formErrors.whatsapp}</span>
              </div>
            )}
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
              onClick={() => setAddModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 size={15} className="spin" style={{ marginRight: 6 }} />
                  Saving Contact...
                </>
              ) : (
                "Save Contact"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Contact Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => !actionLoading && setEditModalOpen(false)}
        title="Edit Support Contact"
      >
        <form
          onSubmit={handleUpdate}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Department / Contact Name *</label>
            <input
              type="text"
              className={`form-input ${formErrors.name ? "input-error" : ""}`}
              style={{
                borderColor: formErrors.name ? "#ef4444" : undefined,
                boxShadow: formErrors.name
                  ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
                  : undefined,
              }}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: null });
              }}
            />
            {formErrors.name && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                <AlertCircle size={13} />
                <span>{formErrors.name}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Service Category *</label>
            <select
              className="form-input form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Flight">Flight</option>
              <option value="Hotel">Hotel</option>
              <option value="Cab">Cab</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Calling Phone Number *</label>
            <input
              type="text"
              className={`form-input ${formErrors.phone ? "input-error" : ""}`}
              style={{
                borderColor: formErrors.phone ? "#ef4444" : undefined,
                boxShadow: formErrors.phone
                  ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
                  : undefined,
              }}
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
              }}
            />
            {formErrors.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                <AlertCircle size={13} />
                <span>{formErrors.phone}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Number (Optional)</label>
            <input
              type="text"
              className={`form-input ${formErrors.whatsapp ? "input-error" : ""}`}
              style={{
                borderColor: formErrors.whatsapp ? "#ef4444" : undefined,
                boxShadow: formErrors.whatsapp
                  ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
                  : undefined,
              }}
              value={formData.whatsapp}
              onChange={(e) => {
                setFormData({ ...formData, whatsapp: e.target.value });
                if (formErrors.whatsapp) setFormErrors({ ...formErrors, whatsapp: null });
              }}
            />
            {formErrors.whatsapp && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                <AlertCircle size={13} />
                <span>{formErrors.whatsapp}</span>
              </div>
            )}
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
              onClick={() => setEditModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 size={15} className="spin" style={{ marginRight: 6 }} />
                  Updating Contact...
                </>
              ) : (
                "Update Contact"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => !actionLoading && setDeleteModalOpen(false)}
        title="Delete Support Contact"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Are you sure you want to delete{" "}
            <strong>{activeContact?.name}</strong> ({activeContact?.phone})?
            This contact will be permanently removed from customer help channels.
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
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 size={15} className="spin" style={{ marginRight: 6 }} />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Contact"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
