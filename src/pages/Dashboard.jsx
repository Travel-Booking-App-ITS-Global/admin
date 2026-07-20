import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Plane,
  Hotel,
  Car,
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Globe,
  Zap,
  Shield,
  Activity,
  MapPin,
  Star,
  Navigation,
  Wind,
  Compass,
} from "lucide-react";
import {
  revenueData,
  bookingTrendData,
  pieData,
  recentActivity,
  quickActions,
} from "../data/mockData.js";
import { useApp } from "../store/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 6,
          color: "var(--text-primary)",
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            color: p.color,
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              display: "inline-block",
            }}
          />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
            ₹{(p.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  );
};

const DEST_CARDS = [
  {
    city: "Mumbai",
    code: "BOM",
    emoji: "🌆",
    bookings: 1842,
    trend: "+14%",
    color: "#3b82f6",
    bg: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
  },
  {
    city: "Goa",
    code: "GOI",
    emoji: "🏖️",
    bookings: 1124,
    trend: "+22%",
    color: "#10b981",
    bg: "linear-gradient(135deg,#064e3b,#10b981)",
  },
  {
    city: "Dubai",
    code: "DXB",
    emoji: "🌃",
    bookings: 986,
    trend: "+31%",
    color: "#f59e0b",
    bg: "linear-gradient(135deg,#78350f,#f59e0b)",
  },
  {
    city: "Delhi",
    code: "DEL",
    emoji: "🏛️",
    bookings: 1654,
    trend: "+9%",
    color: "#8b5cf6",
    bg: "linear-gradient(135deg,#4c1d95,#8b5cf6)",
  },
];

const PIPELINE = [
  { label: "New Bookings", val: 247, color: "#3b82f6", icon: CheckCircle },
  { label: "Pending Pay", val: 58, color: "#f59e0b", icon: Clock },
  { label: "Open Tickets", val: 23, color: "#ef4444", icon: AlertTriangle },
  { label: "Pending Refund", val: 31, color: "#8b5cf6", icon: TrendingUp },
];

const ACTIVITY_ICONS = {
  booking: <Plane size={13} />,
  refund: <TrendingUp size={13} />,
  ticket: <AlertTriangle size={13} />,
  driver: <Car size={13} />,
  package: <Package size={13} />,
  alert: <Shield size={13} />,
};
const ACTIVITY_COLORS = {
  booking: "#3b82f6",
  refund: "#f59e0b",
  ticket: "#ef4444",
  driver: "#22c55e",
  package: "#8b5cf6",
  alert: "#ef4444",
};

export default function Dashboard() {
  const { addToast, adminName } = useApp();
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState("revenue");

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0c4a6e 100%)",
          padding: "36px 36px 0",
          minHeight: 240,
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Animated sky blobs */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: "30%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Stars - static positions */}
        {[[8,12,0.7],[15,32,0.4],[22,55,0.8],[5,75,0.5],[38,18,0.6],[45,42,0.9],
          [52,68,0.4],[60,8,0.7],[67,88,0.5],[12,95,0.6],[30,25,0.8],[42,80,0.4],
          [55,50,0.7],[18,62,0.5],[70,35,0.6],[25,10,0.8],[48,90,0.4],[35,70,0.7]
        ].map(([top,left,opacity],i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
              top: `${top}%`,
              left: `${left}%`,
              opacity,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left text */}
          <div style={{ maxWidth: 560 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(99,102,241,0.3)",
                  border: "1px solid rgba(99,102,241,0.5)",
                  fontSize: 11,
                  color: "#a5b4fc",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                🌐 ITS Global Command Center
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                {dateStr}
              </div>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 30,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 8,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {greeting}, {adminName} 👋
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
                maxWidth: 440,
              }}
            >
              Your travel platform processed{" "}
              <strong style={{ color: "#60a5fa" }}>₹48,32,150</strong> in
              revenue this month. You have{" "}
              <strong style={{ color: "#fbbf24" }}>5 open tickets</strong> and{" "}
              <strong style={{ color: "#f87171" }}>3 pending refunds</strong>{" "}
              awaiting review.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                className="btn"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.5)",
                }}
                onClick={() => navigate("/support")}
              >
                <Zap size={14} /> View Tickets
              </button>
              <button
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
                onClick={() => navigate("/payments")}
              >
                Refund Queue
              </button>
              <button
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onClick={() => navigate("/analytics")}
              >
                <Activity size={14} /> Analytics
              </button>
            </div>
          </div>

          {/* Right – live flight path animation */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "center",
              paddingBottom: 0,
            }}
          >
            {/* Globe art */}
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.4), rgba(29,78,216,0.15))",
                border: "1.5px solid rgba(99,102,241,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 0 40px rgba(99,102,241,0.3)",
              }}
            >
              <Globe size={52} style={{ color: "rgba(147,197,253,0.8)" }} />
              <div style={{ position: "absolute", top: 12, right: 8 }}>
                <Plane
                  size={16}
                  style={{ color: "#60a5fa", transform: "rotate(45deg)" }}
                />
              </div>
              <div style={{ position: "absolute", bottom: 16, left: 10 }}>
                <MapPin size={12} style={{ color: "#f87171" }} />
              </div>
            </div>
            {/* Route line */}
            <div
              style={{
                width: 1,
                height: 30,
                background:
                  "linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)",
              }}
            />
            <div
              style={{
                padding: "6px 14px",
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: 20,
                fontSize: 11,
                color: "#a5b4fc",
                fontWeight: 600,
              }}
            >
              <Navigation
                size={10}
                style={{ display: "inline", marginRight: 4 }}
              />{" "}
              42 Routes Active
            </div>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            {
              icon: Plane,
              label: "Flights",
              val: "5,124",
              color: "#60a5fa",
              path: "/flights",
            },
            {
              icon: Hotel,
              label: "Hotels",
              val: "4,380",
              color: "#c084fc",
              path: "/hotels",
            },
            {
              icon: Car,
              label: "Cabs",
              val: "2,891",
              color: "#4ade80",
              path: "/cabs",
            },
            {
              icon: Package,
              label: "Packages",
              val: "452",
              color: "#fb923c",
              path: "/packages",
            },
            {
              icon: Users,
              label: "Users",
              val: "3,241",
              color: "#38bdf8",
              path: "/users",
            },
            {
              icon: Wind,
              label: "Revenue",
              val: "₹48L",
              color: "#facc15",
              path: "/analytics",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              onClick={() => navigate(s.path)}
              style={{
                flex: 1,
                padding: "16px 10px",
                textAlign: "center",
                cursor: "pointer",
                borderRight:
                  i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <s.icon
                size={18}
                style={{
                  color: s.color,
                  marginBottom: 6,
                  display: "block",
                  margin: "0 auto 6px",
                }}
              />
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PIPELINE ROW ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
        }}
      >
        {PIPELINE.map((p) => (
          <div
            key={p.label}
            className="card"
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${p.color}18`,
                border: `1px solid ${p.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <p.icon size={20} style={{ color: p.color }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
              >
                {p.val}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 3,
                }}
              >
                {p.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TOP DESTINATIONS ──────────────────────────────────────────── */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
                marginBottom: 2,
              }}
            >
              <Compass
                size={16}
                style={{
                  display: "inline",
                  marginRight: 6,
                  color: "var(--brand-500)",
                }}
              />
              Top Destinations
            </h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Highest booked routes this month
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/flights")}
          >
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
          }}
        >
          {DEST_CARDS.map((d) => (
            <div
              key={d.city}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                background: d.bg,
                minHeight: 130,
                padding: "18px 16px",
                boxShadow: `0 8px 24px ${d.color}30`,
                transition: "all 0.2s",
              }}
              onClick={() => navigate(`/flights?search=${d.city}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 16px 36px ${d.color}45`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${d.color}30`;
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  fontSize: 70,
                  opacity: 0.12,
                  pointerEvents: "none",
                }}
              >
                {d.emoji}
              </div>
              <div style={{ fontSize: 28 }}>{d.emoji}</div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#fff",
                  marginTop: 6,
                }}
              >
                {d.city}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 10,
                }}
              >
                {d.code}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  {d.bookings.toLocaleString()} bookings
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.85)",
                    background: "rgba(0,0,0,0.25)",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  {d.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ROW ────────────────────────────────────────────────── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}
      >
        {/* Revenue area chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Revenue by Category</span>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Last 7 months · All booking types
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["revenue", "bookings"].map((t) => (
                <button
                  key={t}
                  className={`tab-btn${activeChart === t ? " active" : ""}`}
                  style={{ padding: "4px 10px", margin: 0, fontSize: 11 }}
                  onClick={() => setActiveChart(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "12px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={revenueData}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <defs>
                  {[
                    ["gF", "#3b82f6"],
                    ["gH", "#8b5cf6"],
                    ["gC", "#22c55e"],
                    ["gP", "#f59e0b"],
                  ].map(([id, c]) => (
                    <linearGradient
                      key={id}
                      id={id}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={c} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-default)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}K`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="flights"
                  name="Flights"
                  stroke="#3b82f6"
                  fill="url(#gF)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="hotels"
                  name="Hotels"
                  stroke="#8b5cf6"
                  fill="url(#gH)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="cabs"
                  name="Cabs"
                  stroke="#22c55e"
                  fill="url(#gC)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="packages"
                  name="Packages"
                  stroke="#f59e0b"
                  fill="url(#gP)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right col: Booking mix + weekly bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <span className="card-title">Booking Mix</span>
            </div>
            <div
              style={{
                padding: "14px 12px",
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={46}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                {pieData.map((d) => (
                  <div
                    key={d.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: d.color,
                          display: "inline-block",
                        }}
                      />
                      <span style={{ color: "var(--text-secondary)" }}>
                        {d.name}
                      </span>
                    </div>
                    <span
                      style={{ fontWeight: 700, color: "var(--text-primary)" }}
                    >
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <span className="card-title">Daily Bookings</span>
              <span className="badge badge-success">This Week</span>
            </div>
            <div style={{ padding: "8px 8px 6px" }}>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart
                  data={bookingTrendData}
                  margin={{ top: 0, right: 4, bottom: 0, left: -20 }}
                >
                  <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                    {bookingTrendData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === bookingTrendData.length - 1
                            ? "#3b82f6"
                            : "#6366f122"
                        }
                      />
                    ))}
                  </Bar>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--bg-hover)" }}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid var(--border-default)",
                      background: "var(--bg-card)",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Activity + Platform Health + Quick Actions ─── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}
      >
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Live Activity</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/reports")}
            >
              All <ArrowUpRight size={12} />
            </button>
          </div>
          <div style={{ padding: "4px 0" }}>
            {recentActivity.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "11px 18px",
                  borderBottom:
                    i < recentActivity.length - 1
                      ? "1px solid var(--border-default)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: `${ACTIVITY_COLORS[a.type]}18`,
                    border: `1px solid ${ACTIVITY_COLORS[a.type]}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ACTIVITY_COLORS[a.type],
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {ACTIVITY_ICONS[a.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--text-primary)",
                      lineHeight: 1.4,
                    }}
                  >
                    {a.text}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "var(--text-muted)",
                      marginTop: 3,
                    }}
                  >
                    <Clock
                      size={9}
                      style={{ display: "inline", marginRight: 3 }}
                    />
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Health */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Platform Health</span>
            <span className="badge badge-success">● Live</span>
          </div>
          <div
            style={{
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[
              { label: "Flight APIs", val: 98, color: "#3b82f6" },
              { label: "Hotel APIs", val: 94, color: "#8b5cf6" },
              { label: "Cab System", val: 99, color: "#22c55e" },
              { label: "AI Services", val: 87, color: "#f59e0b" },
              { label: "Payment GW", val: 100, color: "#10b981" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        s.val >= 95
                          ? "var(--success-600)"
                          : s.val >= 85
                            ? "var(--warning-600)"
                            : "var(--danger-600)",
                    }}
                  >
                    {s.val}%
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${s.val}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "14px 18px",
              borderTop: "1px solid var(--border-default)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { label: "Response", val: "1.2s", icon: "⚡" },
              { label: "Uptime", val: "99.97%", icon: "✅" },
              { label: "Errors/hr", val: "3", icon: "🔴" },
              { label: "Sessions", val: "421", icon: "👥" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "var(--bg-hover)",
                  borderRadius: 8,
                  padding: "9px 11px",
                }}
              >
                <div style={{ fontSize: 16, marginBottom: 3 }}>{m.icon}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                  }}
                >
                  {m.val}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Quick Actions</span>
            <Star size={14} style={{ color: "var(--warning-500)" }} />
          </div>
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  navigate(a.path);
                  addToast(`Navigating to ${a.label}`, "info");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.borderColor = a.color + "60";
                  e.currentTarget.style.transform = "translateX(3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-card)";
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${a.color}18`,
                    border: `1px solid ${a.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: a.color,
                      display: "block",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {a.label}
                </span>
                <ArrowUpRight
                  size={13}
                  style={{ marginLeft: "auto", color: "var(--text-muted)" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
