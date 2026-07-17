import { Sun, Moon, Check } from "lucide-react";
import { useApp, ACCENT_COLORS, FONT_OPTIONS, DENSITY_OPTIONS } from "../../store/AppContext.jsx";

const Section = ({ title, subtitle, children }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <div
      style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 15,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </div>
    <div style={{ padding: "18px 22px" }}>{children}</div>
  </div>
);

export default function AppearanceTab() {
  const {
    theme,
    toggleTheme,
    accentId,
    changeAccent,
    fontId,
    changeFont,
    density,
    changeDensity,
    addToast,
  } = useApp();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: 16,
      }}
    >
      {/* Theme Mode */}
      <Section
        title="🎨 Theme Mode"
        subtitle="Choose your preferred colour scheme"
      >
        <div style={{ display: "flex", gap: 12 }}>
          {[
            {
              id: "light",
              label: "Light",
              icon: Sun,
              desc: "Clean & bright",
            },
            { id: "dark", label: "Dark", icon: Moon, desc: "Easy on eyes" },
          ].map(({ id, label, icon: Icon, desc }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (!active) toggleTheme();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 12px",
                  borderRadius: "var(--radius-lg)",
                  border: active
                    ? "2px solid var(--brand-500)"
                    : "2px solid var(--border-default)",
                  background: active
                    ? "rgba(var(--brand-500-rgb,59,130,246),0.07)"
                    : "var(--bg-hover)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                <Icon
                  size={22}
                  style={{
                    color: active
                      ? "var(--brand-500)"
                      : "var(--text-muted)",
                  }}
                />
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: active
                      ? "var(--brand-600)"
                      : "var(--text-primary)",
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {desc}
                </div>
                {active && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--brand-500)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Accent Color */}
      <Section
        title="🖌️ Accent Colour"
        subtitle="Pick a brand colour applied across the entire admin panel"
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {ACCENT_COLORS.map((color) => {
            const active = accentId === color.id;
            return (
              <button
                key={color.id}
                type="button"
                title={color.label}
                onClick={() => {
                  changeAccent(color.id);
                  addToast(`Accent changed to ${color.label}`, "success");
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-md)",
                  background: `linear-gradient(135deg, ${color.shade}, ${color.primary})`,
                  border: active
                    ? `3px solid ${color.primary}`
                    : "3px solid transparent",
                  boxShadow: active
                    ? `0 0 0 3px ${color.bg}, 0 4px 14px ${color.shade}55`
                    : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.18s",
                  transform: active ? "scale(1.12)" : "scale(1)",
                  outline: "none",
                }}
              >
                {active && <Check size={18} color="#fff" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {ACCENT_COLORS.map((color) => (
            <span
              key={color.id}
              style={{
                fontSize: 11,
                fontWeight: accentId === color.id ? 700 : 400,
                color:
                  accentId === color.id
                    ? color.primary
                    : "var(--text-muted)",
                cursor: "pointer",
              }}
              onClick={() => {
                changeAccent(color.id);
                addToast(`Accent changed to ${color.label}`, "success");
              }}
            >
              {color.label}
            </span>
          ))}
        </div>
      </Section>

      {/* Font Family */}
      <Section
        title="🔤 Font Family"
        subtitle="Select the typeface used across the admin interface"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          {FONT_OPTIONS.map((font) => {
            const active = fontId === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => {
                  changeFont(font.id);
                  addToast(`Font changed to ${font.label}`, "success");
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: active
                    ? "2px solid var(--brand-500)"
                    : "2px solid var(--border-default)",
                  background: active
                    ? "rgba(59,130,246,0.05)"
                    : "var(--bg-hover)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.16s",
                }}
              >
                <div
                  style={{
                    fontFamily: font.body,
                    fontWeight: 600,
                    fontSize: 15,
                    color: active
                      ? "var(--brand-600)"
                      : "var(--text-primary)",
                    marginBottom: 3,
                  }}
                >
                  {font.label}
                </div>
                <div
                  style={{
                    fontFamily: font.body,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  Aa Bb Cc 1 2 3
                </div>
                {active && (
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Check
                      size={10}
                      style={{ color: "var(--brand-500)" }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "var(--brand-500)",
                      }}
                    >
                      Active
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Display Density */}
      <Section
        title="📐 Display Density"
        subtitle="Adjust how compact or spacious the UI feels"
      >
        <div style={{ display: "flex", gap: 12 }}>
          {DENSITY_OPTIONS.map((opt) => {
            const active = density === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  changeDensity(opt.id);
                  addToast(`Density set to ${opt.label}`, "success");
                }}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  border: active
                    ? "2px solid var(--brand-500)"
                    : "2px solid var(--border-default)",
                  background: active
                    ? "rgba(59,130,246,0.05)"
                    : "var(--bg-hover)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.16s",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: active
                      ? "var(--brand-600)"
                      : "var(--text-primary)",
                    marginBottom: 3,
                  }}
                >
                  {opt.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {opt.description}
                </div>
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
