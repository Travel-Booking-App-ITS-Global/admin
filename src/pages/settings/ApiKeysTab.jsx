import { useState } from "react";
import { Eye, EyeOff, Trash2, RefreshCw, Pencil } from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";
import Modal from "../../components/ui/Modal.jsx";

const initialApiKeys = [
  {
    id: "KEY001",
    name: "Razorpay Secret Key",
    provider: "Razorpay",
    value: "rzp_live_abcd1234efgh5678",
    hidden: true,
    tags: ["Payment", "Production"],
  },
  {
    id: "KEY002",
    name: "Stripe Secret Key",
    provider: "Stripe",
    value: "sk_live_51NvXYZabc1237890",
    hidden: true,
    tags: ["Payment", "Production"],
  },
  {
    id: "KEY003",
    name: "Google Maps API Key",
    provider: "Google",
    value: "AIzaSyA1234567890-bcdefg",
    hidden: true,
    tags: ["Maps", "Development"],
  },
  {
    id: "KEY004",
    name: "Firebase Server Key",
    provider: "Firebase",
    value: "AAAA1234567890:APA91b-xyz",
    hidden: true,
    tags: ["Auth", "Production"],
  },
  {
    id: "KEY005",
    name: "Amadeus API Secret",
    provider: "Amadeus",
    value: "amadeus_secret_9988776655",
    hidden: true,
    tags: ["Flights", "Development"],
  },
];

export default function ApiKeysTab() {
  const { addToast } = useApp();
  const [apiKeys, setApiKeys] = useState(initialApiKeys);

  // Add Modal States
  const [addKeyOpen, setAddKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("Razorpay");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyTags, setNewKeyTags] = useState("");

  // Edit Modal States
  const [editKeyOpen, setEditKeyOpen] = useState(false);
  const [editingKeyId, setEditingKeyId] = useState(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [editKeyProvider, setEditKeyProvider] = useState("");
  const [editKeyValue, setEditKeyValue] = useState("");
  const [editKeyTags, setEditKeyTags] = useState("");

  // Search/Filter states
  const [keysSearchTerm, setKeysSearchTerm] = useState("");
  const [activeKeyFilter, setActiveKeyFilter] = useState("All");
  const keysFilterTags = ["All", "Payment", "Maps", "Auth", "Flights", "Production", "Development"];


  const handleAddKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      addToast("Please fill out Key Name and Key Value", "error");
      return;
    }
    const parsedTags = newKeyTags
      ? newKeyTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const added = {
      id: `KEY${Date.now()}`,
      name: newKeyName,
      provider: newKeyProvider,
      value: newKeyValue,
      hidden: true,
      tags: parsedTags,
    };
    setApiKeys((prev) => [...prev, added]);
    addToast(`${newKeyName} added successfully!`, "success");
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyTags("");
    setAddKeyOpen(false);
  };

  const handleEditClick = (key) => {
    setEditingKeyId(key.id);
    setEditKeyName(key.name);
    setEditKeyProvider(key.provider);
    setEditKeyValue(key.value);
    setEditKeyTags(key.tags ? key.tags.join(", ") : "");
    setEditKeyOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editKeyName.trim() || !editKeyValue.trim()) {
      addToast("Please fill out Key Name and Key Value", "error");
      return;
    }
    const parsedTags = editKeyTags
      ? editKeyTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === editingKeyId
          ? {
              ...k,
              name: editKeyName,
              provider: editKeyProvider,
              value: editKeyValue,
              tags: parsedTags,
            }
          : k
      )
    );
    addToast(`${editKeyName} updated successfully!`, "success");
    setEditKeyOpen(false);
    setEditingKeyId(null);
    setEditKeyTags("");
  };

  const filteredApiKeys = apiKeys.filter((key) => {
    const matchesSearch = key.name.toLowerCase().includes(keysSearchTerm.toLowerCase()) || 
                          key.provider.toLowerCase().includes(keysSearchTerm.toLowerCase()) ||
                          (key.tags && key.tags.some(t => t.toLowerCase().includes(keysSearchTerm.toLowerCase())));
    const matchesFilter = activeKeyFilter === "All" || (key.tags && key.tags.includes(activeKeyFilter));
    return matchesSearch && matchesFilter;
  });


  const toggleKeyVisibility = (id) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, hidden: !k.hidden } : k))
    );
  };

  const handleRotateKey = (id, name) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newGeneratedVal = "";
    if (name.toLowerCase().includes("stripe")) {
      newGeneratedVal = "sk_live_";
    } else if (name.toLowerCase().includes("razorpay")) {
      newGeneratedVal = "rzp_live_";
    } else if (name.toLowerCase().includes("google")) {
      newGeneratedVal = "AIzaSy";
    } else {
      newGeneratedVal = "key_";
    }
    for (let i = 0; i < 20; i++) {
      newGeneratedVal += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, value: newGeneratedVal } : k))
    );
    addToast(`${name} rotated successfully!`, "success");
  };

  const handleDeleteKey = (id, name) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    addToast(`${name} deleted!`, "error");
  };

  return (
    <div>
      {/* API Keys Card */}
      <div className="card">
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="card-title">🔑 API Key Credentials</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setAddKeyOpen(true)}
          >
            + Add API Key
          </button>
        </div>
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Search & Tags Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 6 }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search keys by name, provider, or tag..."
                value={keysSearchTerm}
                onChange={(e) => setKeysSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 32px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-card)",
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
              {keysFilterTags.map((tag) => {
                const isActive = activeKeyFilter === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveKeyFilter(tag)}
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

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span>Showing {filteredApiKeys.length} of {apiKeys.length} Keys</span>
            {activeKeyFilter !== "All" && <span>Filtered by: {activeKeyFilter}</span>}
          </div>

          {filteredApiKeys.map((key) => (
            <div
              key={key.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    {key.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      background: "var(--brand-50)",
                      color: "var(--brand-700)",
                      padding: "1px 6px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 600,
                    }}
                  >
                    {key.provider}
                  </span>
                  
                  {/* Render Tags */}
                  {key.tags && key.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 9,
                        background: "rgba(var(--brand-500-rgb, 59, 130, 246), 0.08)",
                        color: "var(--brand-500)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        fontWeight: 700,
                        border: "1px solid rgba(var(--brand-500-rgb, 59, 130, 246), 0.15)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "var(--text-muted)",
                    marginTop: 4,
                    wordBreak: "break-all",
                  }}
                >
                  {key.hidden ? "•".repeat(24) : key.value}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => toggleKeyVisibility(key.id)}
                  title={key.hidden ? "Show API Key" : "Hide API Key"}
                >
                  {key.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(key.value);
                    addToast(`${key.name} copied to clipboard!`, "success");
                  }}
                >
                  Copy
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onClick={() => handleEditClick(key)}
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    color: "var(--warning-600)",
                    borderColor: "var(--warning-500)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onClick={() => handleRotateKey(key.id, key.name)}
                >
                  <RefreshCw size={12} />
                  Rotate
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--danger-500)", padding: 4 }}
                  onClick={() => handleDeleteKey(key.id, key.name)}
                  title="Delete Key"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {filteredApiKeys.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "var(--text-muted)",
                fontSize: 13,
                border: "1px dashed var(--border-default)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-hover)",
              }}
            >
              No API Keys found matching the search/filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add API Key Modal */}
      <Modal
        open={addKeyOpen}
        onClose={() => setAddKeyOpen(false)}
        title="Add API Secret Key"
      >
        <form
          onSubmit={handleAddKey}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Key Name / Description *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stripe Production Secret"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Provider</label>
              <select
                className="form-input form-select"
                value={newKeyProvider}
                onChange={(e) => setNewKeyProvider(e.target.value)}
              >
                <option value="Razorpay">Razorpay</option>
                <option value="Stripe">Stripe</option>
                <option value="Google">Google Maps</option>
                <option value="Firebase">Firebase</option>
                <option value="Amadeus">Amadeus</option>
                <option value="AWS">Amazon Web Services</option>
                <option value="Twilio">Twilio</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Key Value / Secret *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter key credential value"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Payment, Production, Live"
              value={newKeyTags}
              onChange={(e) => setNewKeyTags(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddKeyOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save API Key
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit API Key Modal */}
      <Modal
        open={editKeyOpen}
        onClose={() => setEditKeyOpen(false)}
        title="Edit API Secret Key"
      >
        <form
          onSubmit={handleSaveEdit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">Key Name / Description *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stripe Production Secret"
              value={editKeyName}
              onChange={(e) => setEditKeyName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Provider</label>
              <select
                className="form-input form-select"
                value={editKeyProvider}
                onChange={(e) => setEditKeyProvider(e.target.value)}
              >
                <option value="Razorpay">Razorpay</option>
                <option value="Stripe">Stripe</option>
                <option value="Google">Google Maps</option>
                <option value="Firebase">Firebase</option>
                <option value="Amadeus">Amadeus</option>
                <option value="AWS">Amazon Web Services</option>
                <option value="Twilio">Twilio</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Key Value / Secret *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter key credential value"
                value={editKeyValue}
                onChange={(e) => setEditKeyValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Payment, Production, Live"
              value={editKeyTags}
              onChange={(e) => setEditKeyTags(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditKeyOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update API Key
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
