import { useRef } from "react";

/**
 * TagSelector — matches the Packages page tag UI exactly.
 *
 * Props:
 *   value       – string[]  currently selected tags
 *   onChange    – (tags: string[]) => void
 *   suggestions – string[]  predefined tag chips (toggleable)
 *   label       – string    field label (default "Tags")
 */
export default function TagSelector({
  value = [],
  onChange,
  suggestions = [],
  label = "Tags",
}) {
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const t = tag.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const toggleSuggestion = (tag) => {
    if (value.includes(tag)) {
      removeTag(tag);
    } else {
      addTag(tag);
    }
  };

  const handleAddClick = () => {
    const val = inputRef.current?.value?.trim();
    if (val && !value.includes(val)) {
      addTag(val);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* Input + Add button */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            ref={inputRef}
            className="form-input"
            placeholder="Type a tag and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = e.target.value.trim();
                if (val && !value.includes(val)) {
                  addTag(val);
                  e.target.value = "";
                }
              }
            }}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleAddClick}
        >
          Add Tag
        </button>
      </div>

      {/* Selected tags */}
      {value.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {value.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                background: "var(--brand-600)",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 600,
              }}
            >
              {tag}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontSize: 10,
                  padding: 0,
                  lineHeight: 1,
                }}
                onClick={() => removeTag(tag)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggestion chips */}
      {suggestions.length > 0 && (
        <>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Quick Add Suggestions:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {suggestions.map((tag) => {
              const active = value.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: "var(--radius-full)",
                    border: active
                      ? "1px solid var(--brand-600)"
                      : "1px solid var(--border-default)",
                    background: active
                      ? "rgba(37,99,235,0.08)"
                      : "var(--bg-hover)",
                    color: active
                      ? "var(--brand-600)"
                      : "var(--text-secondary)",
                    cursor: "pointer",
                    fontWeight: active ? 600 : 500,
                    transition: "all 0.12s ease",
                  }}
                  onClick={() => toggleSuggestion(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
