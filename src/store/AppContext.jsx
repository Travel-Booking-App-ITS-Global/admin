/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

/* ── Persist helpers ── */
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    console.log("error");
  }
};

/* ── Accent color palettes ── */
export const ACCENT_COLORS = [
  {
    id: "blue",
    label: "Ocean Blue",
    primary: "#2563eb",
    shade: "#3b82f6",
    bg: "#eff6ff",
    dark: "#1d4ed8",
  },
  {
    id: "violet",
    label: "Royal Violet",
    primary: "#7c3aed",
    shade: "#8b5cf6",
    bg: "#f5f3ff",
    dark: "#6d28d9",
  },
  {
    id: "emerald",
    label: "Emerald",
    primary: "#059669",
    shade: "#10b981",
    bg: "#ecfdf5",
    dark: "#047857",
  },
  {
    id: "rose",
    label: "Rose Red",
    primary: "#e11d48",
    shade: "#f43f5e",
    bg: "#fff1f2",
    dark: "#be123c",
  },
  {
    id: "amber",
    label: "Golden Amber",
    primary: "#d97706",
    shade: "#f59e0b",
    bg: "#fffbeb",
    dark: "#b45309",
  },
  {
    id: "cyan",
    label: "Sky Cyan",
    primary: "#0891b2",
    shade: "#06b6d4",
    bg: "#ecfeff",
    dark: "#0e7490",
  },
  {
    id: "pink",
    label: "Hot Pink",
    primary: "#db2777",
    shade: "#ec4899",
    bg: "#fdf2f8",
    dark: "#be185d",
  },
  {
    id: "slate",
    label: "Cool Slate",
    primary: "#475569",
    shade: "#64748b",
    bg: "#f8fafc",
    dark: "#334155",
  },
];

/* ── Font options ── */
export const FONT_OPTIONS = [
  {
    id: "inter",
    label: "Inter",
    body: "'Inter', system-ui, sans-serif",
    heading: "'Inter', sans-serif",
  },
  {
    id: "outfit",
    label: "Outfit",
    body: "'Outfit', sans-serif",
    heading: "'Outfit', sans-serif",
  },
  {
    id: "jakarta",
    label: "Plus Jakarta Sans",
    body: "'Plus Jakarta Sans', sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif",
  },
  {
    id: "poppins",
    label: "Poppins",
    body: "'Poppins', sans-serif",
    heading: "'Poppins', sans-serif",
  },
  {
    id: "nunito",
    label: "Nunito",
    body: "'Nunito', sans-serif",
    heading: "'Nunito', sans-serif",
  },
  {
    id: "dm",
    label: "DM Sans",
    body: "'DM Sans', sans-serif",
    heading: "'DM Sans', sans-serif",
  },
  {
    id: "geist",
    label: "Geist",
    body: "'Geist', 'Inter', sans-serif",
    heading: "'Geist', 'Inter', sans-serif",
  },
  {
    id: "mono",
    label: "JetBrains Mono",
    body: "'JetBrains Mono', monospace",
    heading: "'JetBrains Mono', monospace",
  },
];

/* ── Density options ── */
export const DENSITY_OPTIONS = [
  {
    id: "compact",
    label: "Compact",
    description: "Tighter spacing, more data visible",
  },
  {
    id: "default",
    label: "Default",
    description: "Balanced spacing for everyday use",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    description: "More breathing room, easier reading",
  },
];

/* ── Apply accent to CSS variables ── */
function applyAccent(color) {
  const root = document.documentElement;
  root.style.setProperty("--brand-500", color.shade);
  root.style.setProperty("--brand-600", color.primary);
  root.style.setProperty("--brand-700", color.dark);
  root.style.setProperty("--brand-50", color.bg);
  root.style.setProperty("--border-brand", color.shade);
}

/* ── Apply font ── */
function applyFont(font) {
  const root = document.documentElement;
  root.style.setProperty("--font-body", font.body);
  root.style.setProperty("--font-heading", font.heading);
}

/* ── Apply density ── */
function applyDensity(density) {
  document.documentElement.setAttribute("data-density", density);
}

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth < 768,
  );
  const [theme, setTheme] = useState(() => load("its_theme", "dark"));
  const [accentId, setAccentId] = useState(() => load("its_accent", "blue"));
  const [fontId, setFontId] = useState(() => load("its_font", "inter"));
  const [density, setDensity] = useState(() => load("its_density", "default"));
  const [toasts, setToasts] = useState([]);

  const [adminName, setAdminName] = useState(() => load("its_admin_name", "Super Admin"));
  const [adminEmail, setAdminEmail] = useState(() => load("its_admin_email", "admin@itsglobal.in"));
  const [adminAvatar, setAdminAvatar] = useState(() => load("its_admin_avatar", ""));
  const [adminPassword, setAdminPassword] = useState(() => load("its_admin_password", "admin123"));

  const updateAdminProfile = (name, email, avatar) => {
    setAdminName(name);
    setAdminEmail(email);
    setAdminAvatar(avatar);
    save("its_admin_name", name);
    save("its_admin_email", email);
    save("its_admin_avatar", avatar);
  };

  const changeAdminPassword = (oldPass, newPass) => {
    if (oldPass !== adminPassword) {
      return { success: false, message: "Current password does not match." };
    }
    setAdminPassword(newPass);
    save("its_admin_password", newPass);
    return { success: true };
  };

  /* Apply persisted prefs on mount */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const accent =
      ACCENT_COLORS.find((c) => c.id === accentId) || ACCENT_COLORS[0];
    applyAccent(accent);
    const font = FONT_OPTIONS.find((f) => f.id === fontId) || FONT_OPTIONS[0];
    applyFont(font);
    applyDensity(density);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSidebar = () => setSidebarCollapsed((p) => !p);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      save("its_theme", next);
      return next;
    });
  };

  const changeAccent = (id) => {
    const color = ACCENT_COLORS.find((c) => c.id === id) || ACCENT_COLORS[0];
    applyAccent(color);
    setAccentId(id);
    save("its_accent", id);
  };

  const changeFont = (id) => {
    const font = FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0];
    applyFont(font);
    setFontId(id);
    save("its_font", id);
  };

  const changeDensity = (id) => {
    applyDensity(id);
    setDensity(id);
    save("its_density", id);
  };

  const addToast = (message, type = "success", duration = 3500) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        theme,
        toggleTheme,
        accentId,
        changeAccent,
        fontId,
        changeFont,
        density,
        changeDensity,
        toasts,
        addToast,
        adminName,
        adminEmail,
        adminAvatar,
        updateAdminProfile,
        changeAdminPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
