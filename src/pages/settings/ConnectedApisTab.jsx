import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";
import { StatusBadge } from "../../components/ui/index.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { mockAPIConfigs } from "../../data/mockData.js";

const STATUS_DOT = {
  active: "#22c55e",
  warning: "#f59e0b",
  inactive: "#9ca3af",
};

export default function ConnectedApisTab() {
  const { addToast } = useApp();
  const [apiConfigs, setApiConfigs] = useState(mockAPIConfigs);

  // Modal / Form States
  const [addApiOpen, setAddApiOpen] = useState(false);
  const [newApiName, setNewApiName] = useState("");
  const [newApiType, setNewApiType] = useState("Flight");
  const [newApiProvider, setNewApiProvider] = useState("");
  const [newApiTags, setNewApiTags] = useState("");

  // Search/Filter states
  const [apisSearchTerm, setApisSearchTerm] = useState("");
  const [activeApiFilter, setActiveApiFilter] = useState("All");
  const apisFilterTags = ["All", "GDS", "Flights", "Hotels", "Global", "Domestic", "Maps", "Navigation"];

  const testApi = (id, name) => {
    addToast(`Pinging ${name}…`, "info");
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 200) + 40;
      setApiConfigs((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, latency: `${latency}ms`, status: "active" } : a,
        ),
      );
      addToast(`${name} responded in ${latency}ms!`, "success");
    }, 900);
  };

  const handleAddApi = (e) => {
    e.preventDefault();
    if (!newApiName.trim() || !newApiProvider.trim()) {
      addToast("Please fill out API Name and Provider", "error");
      return;
    }
    const parsedTags = newApiTags
      ? newApiTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const added = {
      id: `API${Date.now()}`,
      name: newApiName,
      type: newApiType,
      provider: newApiProvider,
      status: "active",
      lastPing: "Just now",
      latency: "45ms",
      tags: parsedTags,
    };
    setApiConfigs((prev) => [...prev, added]);
    addToast(`${newApiName} connected successfully!`, "success");
    setNewApiName("");
    setNewApiProvider("");
    setNewApiTags("");
    setAddApiOpen(false);
  };

  const handleDeleteApi = (id, name) => {
    setApiConfigs((prev) => prev.filter((a) => a.id !== id));
    addToast(`${name} disconnected!`, "warning");
  };

  const filteredApiConfigs = apiConfigs.filter((api) => {
    const matchesSearch = api.name.toLowerCase().includes(apisSearchTerm.toLowerCase()) || 
                          api.provider.toLowerCase().includes(apisSearchTerm.toLowerCase()) ||
                          api.type.toLowerCase().includes(apisSearchTerm.toLowerCase()) ||
                          (api.tags && api.tags.some(t => t.toLowerCase().includes(apisSearchTerm.toLowerCase())));
    const matchesFilter = activeApiFilter === "All" || (api.tags && api.tags.includes(activeApiFilter));
    return matchesSearch && matchesFilter;
  });


  return (
    <div>
      {/* Connected APIs Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">🔌 Connected APIs</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setAddApiOpen(true)}
          >
            + Add API
          </button>
        </div>
        {/* Search & Tags Filters */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-default)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search APIs by name, type, provider, or tag..."
              value={apisSearchTerm}
              onChange={(e) => setApisSearchTerm(e.target.value)}
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
            {apisFilterTags.map((tag) => {
              const isActive = activeApiFilter === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveApiFilter(tag)}
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

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>API Name</th>
                <th>Type</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Last Ping</th>
                <th>Latency</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApiConfigs.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: STATUS_DOT[a.status] || "#9ca3af",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span>{a.name}</span>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {a.tags && a.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: 9,
                                background: "rgba(16, 185, 129, 0.08)",
                                color: "#10b981",
                                padding: "1px 5px",
                                borderRadius: "3px",
                                fontWeight: 700,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        background: "var(--bg-hover)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {a.type}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{a.provider}</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td
                    style={{ fontSize: 12, color: "var(--text-muted)" }}
                  >
                    {a.lastPing}
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          a.latency === "-"
                            ? "var(--text-muted)"
                            : parseInt(a.latency) > 300
                              ? "var(--warning-600)"
                              : "var(--success-600)",
                      }}
                    >
                      {a.latency}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => testApi(a.id, a.name)}
                      >
                        Test
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger-500)", padding: 4 }}
                        onClick={() => handleDeleteApi(a.id, a.name)}
                        title="Disconnect API"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApiConfigs.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)", fontSize: 13 }}>
                    No APIs found matching the search/filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Connected API Modal */}
      <Modal
        open={addApiOpen}
        onClose={() => setAddApiOpen(false)}
        title="Connect New External API"
      >
        <form
          onSubmit={handleAddApi}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="form-group">
            <label className="form-label">API Integration Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stripe Payment Gateway"
              value={newApiName}
              onChange={(e) => setNewApiName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">API Type</label>
              <select
                className="form-input form-select"
                value={newApiType}
                onChange={(e) => setNewApiType(e.target.value)}
              >
                <option value="Flight">Flight Service</option>
                <option value="Hotel">Hotel Service</option>
                <option value="Cab">Cab Service</option>
                <option value="Package">Package Booking</option>
                <option value="Payment">Payment Gateway</option>
                <option value="Notification">SMS & Email Gateway</option>
                <option value="Maps">Geocoding & Maps</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Provider Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Stripe, Twilio, Google"
                value={newApiProvider}
                onChange={(e) => setNewApiProvider(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Flights, Global, Live"
              value={newApiTags}
              onChange={(e) => setNewApiTags(e.target.value)}
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
              onClick={() => setAddApiOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Connect API
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
