import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Plane, Hotel, Car, Package } from "lucide-react";

const PAGE_CONFIG = {
  "/flights": {
    icon: Plane,
    color: "#3b82f6",
    label: "Flight Bookings",
    title: "Searching best flights...",
    class: "loader-flight",
  },
  "/cabs": {
    icon: Car,
    color: "#22c55e",
    label: "Cab Management",
    title: "Assigning nearby cabs...",
    class: "loader-cab",
  },
  "/hotels": {
    icon: Hotel,
    color: "#8b5cf6",
    label: "Hotel Bookings",
    title: "Finding luxury hotels...",
    class: "loader-hotel",
  },
  "/packages": {
    icon: Package,
    color: "#ec4899",
    label: "Holiday Packages",
    title: "Curating travel packages...",
    class: "loader-package",
  },
};

export default function PageLoader() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [config, setConfig] = useState(null);
  const timerRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    if (location.pathname === prevPath.current) return;
    clearTimeout(timerRef.current);
    clearTimeout(fadeRef.current);

    // Only show loader for the 4 booking pages — skip all other routes
    const cfg = PAGE_CONFIG[location.pathname];
    prevPath.current = location.pathname;

    if (!cfg) return; // not a booking page — do nothing

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfig(cfg);
    setFading(false);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setFading(true);
      fadeRef.current = setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, 280);
    }, 780);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(fadeRef.current);
    };
  }, [location.pathname]);

  if (!visible || !config) return null;

  const Icon = config.icon;

  return (
    /* ── Transparent backdrop — just centers the card, doesn't black out ── */
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none" /* page stays interactive underneath */,
      }}
    >
      {/* ── Compact floating loader card ── */}
      <div
        style={{
          pointerEvents: "auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          padding: "28px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          minWidth: 220,
          opacity: fading ? 0 : 1,
          transform: fading
            ? "scale(0.94) translateY(6px)"
            : "scale(1) translateY(0px)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Icon animation */}
        <div
          className={`loader-anim-container ${config.class}`}
          style={{
            width: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {config.class === "loader-flight" && (
            <div
              className="flight-track-line"
              style={{
                width: 160,
                position: "relative",
                height: 40,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icon
                className="loader-anim-icon"
                size={30}
                style={{ color: config.color }}
              />
            </div>
          )}
          {config.class === "loader-cab" && (
            <div style={{ position: "relative", width: 160, height: 44 }}>
              <div
                className="cab-road-line"
                style={{ position: "absolute", bottom: 0, width: "100%" }}
              />
              <Icon
                className="loader-anim-icon"
                size={28}
                style={{ color: config.color, position: "absolute", bottom: 4 }}
              />
            </div>
          )}
          {config.class === "loader-hotel" && (
            <div
              className="hotel-pulse-ring"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                className="loader-anim-icon"
                size={38}
                style={{ color: config.color }}
              />
            </div>
          )}
          {config.class === "loader-package" && (
            <div
              className="package-bounce-box"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                className="loader-anim-icon"
                size={34}
                style={{ color: config.color }}
              />
            </div>
          )}
          {config.class === "loader-default" && (
            <div
              className="compass-spin"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                className="loader-anim-icon"
                size={30}
                style={{ color: config.color }}
              />
            </div>
          )}

          {/* Thin progress bar */}
          <div
            style={{
              width: "100%",
              height: 3,
              background: "var(--border-default)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: config.color,
                borderRadius: 99,
                animation: "loader-progress 0.78s ease-out forwards",
              }}
            />
          </div>
        </div>

        {/* Labels */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              color: "var(--text-primary)",
              marginBottom: 3,
            }}
          >
            {config.label}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-muted)",
              animation: "pulse-text 1.4s infinite ease-in-out",
            }}
          >
            {config.title}
          </div>
        </div>
      </div>
    </div>
  );
}
