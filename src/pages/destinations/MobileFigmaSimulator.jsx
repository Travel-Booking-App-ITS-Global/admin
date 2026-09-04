import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  ChevronLeft,
  Share2,
  Calendar,
  Languages,
  Globe,
  Clock,
  Ticket,
  Hourglass,
  Sun,
  Search,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  ExternalLink,
} from "lucide-react";
import Modal from "../../components/ui/Modal.jsx";

export default function MobileFigmaSimulator({
  isOpen,
  onClose,
  initialDestination = null,
  allDestinations = [],
}) {
  const [activeScreen, setActiveScreen] = useState("screen3"); // 'screen1' | 'screen2' | 'screen3' | 'screen4'
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    if (initialDestination) {
      setSelectedDestination(initialDestination);
      if (initialDestination.attractions && initialDestination.attractions.length > 0) {
        setSelectedAttraction(initialDestination.attractions[0]);
      }
      setActiveScreen("screen3");
    } else if (allDestinations.length > 0) {
      setSelectedDestination(allDestinations[0]);
      if (allDestinations[0].attractions && allDestinations[0].attractions.length > 0) {
        setSelectedAttraction(allDestinations[0].attractions[0]);
      }
      setActiveScreen("screen1");
    }
  }, [initialDestination, allDestinations, isOpen]);

  if (!isOpen) return null;

  const currentDest = selectedDestination || allDestinations[0] || {
    name: "Amsterdam",
    country: "Netherlands",
    badge: "Top Destination",
    rating: 4.7,
    reviewCount: 18932,
    coverImage: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=85",
    description:
      "Amsterdam, the capital of the Netherlands, is known for its artistic heritage, elaborate canal system and narrow houses with gabled facades, legacies of the city's 17th-century Golden Age. Its Museum District houses the Van Gogh Museum, works by Rembrandt and Vermeer at the Rijksmuseum, and modern art at the Stedelijk.",
    bestTimeToVisit: "Apr-Jun",
    language: "French",
    timeZone: "CET +1",
    attractions: [
      {
        id: 1,
        title: "Iconic Canals",
        location: "Amsterdam, Netherlands",
        about:
          "An iconic symbol of Paris, the Eiffel Tower offers breathtaking views of the city from its observation decks. Built in 1889, it remains one of the most visited monuments in the world.",
        rating: 4.8,
        reviewsCount: "12k",
        timings: "9:00 AM – 11:45 PM",
        entryFee: "₹2,100 – ₹2,900",
        duration: "1 – 2 Hours",
        bestTimeToVisit: "Sunset (6 PM – 8 PM)",
        coverImage:
          "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=85",
        photos: [
          "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=85",
          "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=1200&q=85",
          "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=85",
        ],
      },
    ],
  };

  const currentAttr =
    selectedAttraction ||
    (currentDest.attractions && currentDest.attractions[0]) || {
      title: "Iconic Canals",
      location: `${currentDest.name}, ${currentDest.country}`,
      about:
        "An iconic symbol of Amsterdam with scenic waterways and historical 17th century canal houses offering sunset boat cruises and romantic walking bridges.",
      rating: 4.8,
      reviewsCount: "12k",
      timings: "9:00 AM – 11:45 PM",
      entryFee: "₹2,100 – ₹2,900",
      duration: "1 – 2 Hours",
      bestTimeToVisit: "Sunset (6 PM – 8 PM)",
      coverImage:
        "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=85",
      photos: [
        "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=85",
        "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=1200&q=85",
      ],
    };

  const toggleLike = (key, e) => {
    e?.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "var(--card-bg, #ffffff)",
          borderRadius: 24,
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: 960,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid var(--border-color, #e2e8f0)",
        }}
      >
        {/* Simulator Modal Top Bar */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-color, #e2e8f0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary, #f8fafc)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Live Figma Mobile App Preview
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted, #64748b)" }}>
                Testing live customer screen flows matching exact Figma designs
              </p>
            </div>
          </div>

          {/* Quick Screen Nav Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--bg-tertiary, #e2e8f0)",
              padding: 4,
              borderRadius: 12,
            }}
          >
            {[
              { id: "screen1", label: "1. Home Carousel" },
              { id: "screen2", label: "2. Explore List" },
              { id: "screen3", label: "3. City Detail" },
              { id: "screen4", label: "4. Attraction Detail" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveScreen(tab.id)}
                style={{
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  background:
                    activeScreen === tab.id
                      ? "var(--brand-600, #2563eb)"
                      : "transparent",
                  color: activeScreen === tab.id ? "#fff" : "var(--text-secondary, #475569)",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: 8, borderRadius: "50%" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Simulator Body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            background: "var(--bg-tertiary, #f1f5f9)",
          }}
        >
          {/* Left: Quick Destination Switcher Sidebar */}
          <div
            style={{
              width: 280,
              borderRight: "1px solid var(--border-color, #e2e8f0)",
              background: "var(--card-bg, #fff)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted, #94a3b8)",
                marginBottom: 12,
              }}
            >
              Select Destination To Preview
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allDestinations.map((d) => {
                const isSel = selectedDestination?.id === d.id;
                return (
                  <div
                    key={d.id || d.name}
                    onClick={() => {
                      setSelectedDestination(d);
                      if (d.attractions && d.attractions.length > 0) {
                        setSelectedAttraction(d.attractions[0]);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 10px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: isSel
                        ? "1.5px solid var(--brand-500, #3b82f6)"
                        : "1px solid var(--border-color, #e2e8f0)",
                      background: isSel
                        ? "rgba(59, 130, 246, 0.08)"
                        : "var(--card-bg, #fff)",
                      transition: "all 0.15s",
                    }}
                  >
                    <img
                      src={d.coverImage}
                      alt={d.name}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isSel
                            ? "var(--brand-600, #2563eb)"
                            : "var(--text-primary, #0f172a)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {d.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted, #64748b)",
                        }}
                      >
                        {d.country} • {d.attractions?.length || 0} spots
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Attractions quick picker */}
            {currentDest.attractions && currentDest.attractions.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-muted, #94a3b8)",
                    marginBottom: 10,
                  }}
                >
                  Attractions in {currentDest.name}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {currentDest.attractions.map((att) => {
                    const isAttSel = selectedAttraction?.title === att.title;
                    return (
                      <div
                        key={att.id || att.title}
                        onClick={() => {
                          setSelectedAttraction(att);
                          setActiveScreen("screen4");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 8px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: isAttSel
                            ? "rgba(139, 92, 246, 0.1)"
                            : "var(--bg-secondary, #f8fafc)",
                          border: isAttSel
                            ? "1px solid #8b5cf6"
                            : "1px solid transparent",
                          fontSize: 12,
                          fontWeight: isAttSel ? 700 : 500,
                          color: isAttSel ? "#7c3aed" : "var(--text-secondary, #475569)",
                        }}
                      >
                        <MapPin size={13} color={isAttSel ? "#7c3aed" : "#94a3b8"} />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {att.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Center: Mobile Device Frame (Figma Screen Rendering) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              overflowY: "auto",
            }}
          >
            {/* Phone Bezel */}
            <div
              style={{
                width: 375,
                height: 680,
                background: "#000",
                borderRadius: 44,
                padding: "10px",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Phone Inner Screen */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#f8fafc",
                  borderRadius: 36,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  color: "#1e293b",
                }}
              >
                {/* iOS Top Status Bar */}
                <div
                  style={{
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    fontSize: 12,
                    fontWeight: 700,
                    zIndex: 30,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    color:
                      activeScreen === "screen3" || activeScreen === "screen4"
                        ? "#ffffff"
                        : "#0f172a",
                  }}
                >
                  <span>9:41</span>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <span style={{ fontSize: 10 }}>5G</span>
                    <div
                      style={{
                        width: 18,
                        height: 9,
                        border: "1.5px solid currentColor",
                        borderRadius: 3,
                        padding: 1,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: "70%",
                          height: "100%",
                          background: "currentColor",
                          borderRadius: 1,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* SCREEN 1: Home Page Top Destinations Carousel           */}
                {/* ═════════════════════════════════════════════════════════ */}
                {activeScreen === "screen1" && (
                  <div
                    style={{
                      flex: 1,
                      paddingTop: 46,
                      paddingBottom: 20,
                      overflowY: "auto",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 800,
                          color: "#0f172a",
                        }}
                      >
                        Explore Top Destinations
                      </h4>
                      <button
                        onClick={() => setActiveScreen("screen2")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3b82f6",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        See more <ChevronLeft size={14} style={{ transform: "rotate(180deg)" }} />
                      </button>
                    </div>

                    {/* Horizontal Destination Cards */}
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        overflowX: "auto",
                        padding: "0 18px 10px",
                        scrollbarWidth: "none",
                      }}
                    >
                      {allDestinations.map((dest) => {
                        const isLiked = likedItems[`home_${dest.id}`];
                        return (
                          <div
                            key={dest.id || dest.name}
                            onClick={() => {
                              setSelectedDestination(dest);
                              if (dest.attractions && dest.attractions.length > 0) {
                                setSelectedAttraction(dest.attractions[0]);
                              }
                              setActiveScreen("screen3");
                            }}
                            style={{
                              minWidth: 140,
                              width: 140,
                              height: 190,
                              borderRadius: 20,
                              position: "relative",
                              overflow: "hidden",
                              cursor: "pointer",
                              flexShrink: 0,
                              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                            }}
                          >
                            <img
                              src={dest.coverImage}
                              alt={dest.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            {/* Dark Gradient Overlay */}
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
                              }}
                            />

                            {/* Favorite Heart Icon */}
                            <button
                              onClick={(e) => toggleLike(`home_${dest.id}`, e)}
                              style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.25)",
                                backdropFilter: "blur(6px)",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: isLiked ? "#ef4444" : "#ffffff",
                                cursor: "pointer",
                              }}
                            >
                              <Heart
                                size={14}
                                fill={isLiked ? "#ef4444" : "none"}
                              />
                            </button>

                            {/* City & Country Label */}
                            <div
                              style={{
                                position: "absolute",
                                bottom: 12,
                                left: 12,
                                right: 12,
                                color: "#fff",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  lineHeight: 1.2,
                                }}
                              >
                                {dest.name}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  fontSize: 11,
                                  color: "rgba(255,255,255,0.85)",
                                  marginTop: 3,
                                }}
                              >
                                <MapPin size={11} />
                                <span>{dest.country}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═════════════════════════════════════════════════════════ */}
                {/* SCREEN 2: Explore Top Destinations List                 */}
                {/* ═════════════════════════════════════════════════════════ */}
                {activeScreen === "screen2" && (
                  <div
                    style={{
                      flex: 1,
                      paddingTop: 42,
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto",
                      background: "#f4f6f9",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "8px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={() => setActiveScreen("screen1")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 4,
                          cursor: "pointer",
                        }}
                      >
                        <ChevronLeft size={22} color="#0f172a" />
                      </button>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>
                        Top Destination
                      </span>
                      <Search size={20} color="#0f172a" />
                    </div>

                    <div style={{ padding: "8px 18px 14px" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0f172a",
                        }}
                      >
                        Explore Top Destination
                      </h3>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: 12,
                          color: "#64748b",
                        }}
                      >
                        Most loved places by our travelers
                      </p>
                    </div>

                    {/* Destination Vertical Cards List */}
                    <div
                      style={{
                        padding: "0 18px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {allDestinations.map((dest) => {
                        const isLiked = likedItems[`list_${dest.id}`];
                        return (
                          <div
                            key={dest.id || dest.name}
                            onClick={() => {
                              setSelectedDestination(dest);
                              if (dest.attractions && dest.attractions.length > 0) {
                                setSelectedAttraction(dest.attractions[0]);
                              }
                              setActiveScreen("screen3");
                            }}
                            style={{
                              background: "#ffffff",
                              borderRadius: 18,
                              padding: "12px",
                              display: "flex",
                              gap: 12,
                              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                              cursor: "pointer",
                              position: "relative",
                              border: "1px solid #edf2f7",
                            }}
                          >
                            <img
                              src={dest.coverImage}
                              alt={dest.name}
                              style={{
                                width: 88,
                                height: 88,
                                borderRadius: 14,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      fontSize: 15,
                                      fontWeight: 800,
                                      color: "#0f172a",
                                    }}
                                  >
                                    {dest.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: "#64748b",
                                      marginTop: 1,
                                    }}
                                  >
                                    {dest.country}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => toggleLike(`list_${dest.id}`, e)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 2,
                                    color: isLiked ? "#ef4444" : "#94a3b8",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Heart
                                    size={17}
                                    fill={isLiked ? "#ef4444" : "none"}
                                  />
                                </button>
                              </div>

                              {/* Rating & Reviews */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  marginTop: 4,
                                  fontSize: 11,
                                  fontWeight: 700,
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 2,
                                    background: "#fef3c7",
                                    color: "#d97706",
                                    padding: "2px 6px",
                                    borderRadius: 6,
                                  }}
                                >
                                  <Star size={10} fill="#d97706" />
                                  {dest.rating || 4.8}
                                </span>
                                <span style={{ color: "#64748b", fontWeight: 500 }}>
                                  {(dest.reviewCount || 18932).toLocaleString()} reviews
                                </span>
                              </div>

                              {/* Snippet Description */}
                              <p
                                style={{
                                  margin: "4px 0 0",
                                  fontSize: 10.5,
                                  lineHeight: 1.35,
                                  color: "#64748b",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {dest.shortDescription || dest.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═════════════════════════════════════════════════════════ */}
                {/* SCREEN 3: City / Destination Detail Page                */}
                {/* ═════════════════════════════════════════════════════════ */}
                {activeScreen === "screen3" && (
                  <div
                    style={{
                      flex: 1,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto",
                      background: "#fff",
                    }}
                  >
                    {/* Hero Image */}
                    <div
                      style={{
                        height: 260,
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={currentDest.coverImage}
                        alt={currentDest.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 35%, rgba(0,0,0,0.7) 100%)",
                        }}
                      />

                      {/* Header Buttons */}
                      <div
                        style={{
                          position: "absolute",
                          top: 44,
                          left: 16,
                          right: 16,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          zIndex: 20,
                        }}
                      >
                        <button
                          onClick={() => setActiveScreen("screen2")}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.85)",
                            backdropFilter: "blur(6px)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <ChevronLeft size={20} color="#0f172a" />
                        </button>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={(e) => toggleLike(`dest_${currentDest.id}`, e)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.85)",
                              backdropFilter: "blur(6px)",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: likedItems[`dest_${currentDest.id}`]
                                ? "#ef4444"
                                : "#0f172a",
                            }}
                          >
                            <Heart
                              size={18}
                              fill={
                                likedItems[`dest_${currentDest.id}`]
                                  ? "#ef4444"
                                  : "none"
                              }
                            />
                          </button>
                          <button
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.85)",
                              backdropFilter: "blur(6px)",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#0f172a",
                            }}
                          >
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* City Banner Title Info */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 24,
                          left: 20,
                          right: 20,
                          color: "#fff",
                        }}
                      >
                        <span
                          style={{
                            background: "rgba(37, 99, 235, 0.9)",
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {currentDest.badge || "Top Destination"}
                        </span>
                        <h2
                          style={{
                            margin: "6px 0 2px",
                            fontSize: 20,
                            fontWeight: 800,
                          }}
                        >
                          {currentDest.name}, {currentDest.country}
                        </h2>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 2,
                              background: "rgba(0,0,0,0.5)",
                              padding: "2px 6px",
                              borderRadius: 6,
                              fontWeight: 700,
                            }}
                          >
                            <Star size={11} fill="#fbbf24" color="#fbbf24" />
                            {currentDest.rating || 4.7}
                          </span>
                          <span style={{ opacity: 0.9 }}>
                            {(currentDest.reviewCount || 18932).toLocaleString()} reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Sheet Content with Curved Top */}
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        marginTop: -18,
                        zIndex: 10,
                        padding: "20px 18px",
                        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* Description */}
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          lineHeight: 1.5,
                          color: "#334155",
                        }}
                      >
                        {currentDest.description}
                        <span
                          style={{
                            color: "#2563eb",
                            fontWeight: 700,
                            marginLeft: 4,
                            cursor: "pointer",
                          }}
                        >
                          Read More
                        </span>
                      </p>

                      {/* Travel Quick Info Chips (Best Time, Language, Time Zone) */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 10,
                          marginTop: 18,
                          marginBottom: 22,
                        }}
                      >
                        {/* 1. Best Time */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 14,
                            padding: "10px 8px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#e0e7ff",
                              color: "#4338ca",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Calendar size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 9.5, color: "#64748b" }}>
                              Best Time
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: "#0f172a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {currentDest.bestTimeToVisit || "Apr-Jun"}
                            </div>
                          </div>
                        </div>

                        {/* 2. Language */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 14,
                            padding: "10px 8px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Languages size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 9.5, color: "#64748b" }}>
                              Language
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: "#0f172a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {currentDest.language || "French"}
                            </div>
                          </div>
                        </div>

                        {/* 3. Time Zone */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 14,
                            padding: "10px 8px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#e0f2fe",
                              color: "#0369a1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Globe size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 9.5, color: "#64748b" }}>
                              Time Zone
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: "#0f172a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {currentDest.timeZone || "CET +1"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Top Attraction Section */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: 800,
                              color: "#0f172a",
                            }}
                          >
                            Top Attraction
                          </h4>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#2563eb",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            See All <ChevronLeft size={13} style={{ transform: "rotate(180deg)" }} />
                          </span>
                        </div>

                        {/* Attractions Horizontal Carousel */}
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            overflowX: "auto",
                            paddingBottom: 6,
                            scrollbarWidth: "none",
                          }}
                        >
                          {(currentDest.attractions || []).map((att) => (
                            <div
                              key={att.id || att.title}
                              onClick={() => {
                                setSelectedAttraction(att);
                                setActiveScreen("screen4");
                              }}
                              style={{
                                minWidth: 120,
                                width: 120,
                                cursor: "pointer",
                                flexShrink: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: 120,
                                  height: 110,
                                  borderRadius: 16,
                                  overflow: "hidden",
                                  position: "relative",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                }}
                              >
                                <img
                                  src={att.coverImage}
                                  alt={att.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <button
                                  onClick={(e) => toggleLike(`att_${att.id}`, e)}
                                  style={{
                                    position: "absolute",
                                    top: 6,
                                    right: 6,
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.8)",
                                    border: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: likedItems[`att_${att.id}`]
                                      ? "#ef4444"
                                      : "#334155",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Heart
                                    size={12}
                                    fill={
                                      likedItems[`att_${att.id}`]
                                        ? "#ef4444"
                                        : "none"
                                    }
                                  />
                                </button>
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  marginTop: 6,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {att.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═════════════════════════════════════════════════════════ */}
                {/* SCREEN 4: Top Attraction Detail Page                    */}
                {/* ═════════════════════════════════════════════════════════ */}
                {activeScreen === "screen4" && (
                  <div
                    style={{
                      flex: 1,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto",
                      background: "#fff",
                    }}
                  >
                    {/* Attraction Hero Cover */}
                    <div
                      style={{
                        height: 270,
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={currentAttr.coverImage}
                        alt={currentAttr.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)",
                        }}
                      />

                      {/* Header Buttons */}
                      <div
                        style={{
                          position: "absolute",
                          top: 44,
                          left: 16,
                          right: 16,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          zIndex: 20,
                        }}
                      >
                        <button
                          onClick={() => setActiveScreen("screen3")}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.85)",
                            backdropFilter: "blur(6px)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <ChevronLeft size={20} color="#0f172a" />
                        </button>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={(e) => toggleLike(`att_det_${currentAttr.id}`, e)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.85)",
                              backdropFilter: "blur(6px)",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: likedItems[`att_det_${currentAttr.id}`]
                                ? "#ef4444"
                                : "#0f172a",
                            }}
                          >
                            <Heart
                              size={18}
                              fill={
                                likedItems[`att_det_${currentAttr.id}`]
                                  ? "#ef4444"
                                  : "none"
                              }
                            />
                          </button>
                          <button
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.85)",
                              backdropFilter: "blur(6px)",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#0f172a",
                            }}
                          >
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Attraction Title & Rating */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 24,
                          left: 20,
                          right: 20,
                          color: "#fff",
                        }}
                      >
                        <h2
                          style={{
                            margin: 0,
                            fontSize: 22,
                            fontWeight: 800,
                            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          }}
                        >
                          {currentAttr.title}
                        </h2>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            <MapPin size={12} />
                            <span>{currentAttr.location || `${currentDest.name}, ${currentDest.country}`}</span>
                          </div>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              background: "rgba(0,0,0,0.6)",
                              backdropFilter: "blur(4px)",
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            <Star size={11} fill="#fbbf24" color="#fbbf24" />
                            {currentAttr.rating || 4.8}
                            <span style={{ opacity: 0.8, fontWeight: 500 }}>
                              ({currentAttr.reviewsCount || "12k"})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attraction Bottom Sheet */}
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        marginTop: -18,
                        zIndex: 10,
                        padding: "20px 18px",
                        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* About Heading */}
                      <h4
                        style={{
                          margin: "0 0 8px",
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#0f172a",
                        }}
                      >
                        About
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          lineHeight: 1.5,
                          color: "#475569",
                        }}
                      >
                        {currentAttr.about}
                      </p>

                      {/* 4 Info Grid Tiles (Timings, Entry Fee, Duration, Best Time to Visit) */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          marginTop: 18,
                          marginBottom: 20,
                        }}
                      >
                        {/* 1. Timings */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: "12px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#e0e7ff",
                              color: "#4338ca",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Calendar size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>
                              Timings
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#0f172a",
                                marginTop: 1,
                              }}
                            >
                              {currentAttr.timings || "9:00 AM – 11:45 PM"}
                            </div>
                          </div>
                        </div>

                        {/* 2. Entry Fee */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: "12px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Ticket size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>
                              Entry Fee
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#0f172a",
                                marginTop: 1,
                              }}
                            >
                              {currentAttr.entryFee || "₹2,100 – ₹2,900"}
                            </div>
                          </div>
                        </div>

                        {/* 3. Duration */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: "12px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#e0f2fe",
                              color: "#0369a1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Hourglass size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>
                              Duration
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#0f172a",
                                marginTop: 1,
                              }}
                            >
                              {currentAttr.duration || "1 – 2 Hours"}
                            </div>
                          </div>
                        </div>

                        {/* 4. Best Time to Visit */}
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: "12px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#fef3c7",
                              color: "#b45309",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Clock size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>
                              Best Time to Visit
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#0f172a",
                                marginTop: 1,
                              }}
                            >
                              {currentAttr.bestTimeToVisit || "Sunset (6 PM – 8 PM)"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Photos Gallery */}
                      <div>
                        <h4
                          style={{
                            margin: "0 0 10px",
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          Photos
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            overflowX: "auto",
                            paddingBottom: 4,
                            scrollbarWidth: "none",
                          }}
                        >
                          {(currentAttr.photos && currentAttr.photos.length > 0
                            ? currentAttr.photos
                            : [currentAttr.coverImage]
                          ).map((photoUrl, idx) => (
                            <img
                              key={idx}
                              src={photoUrl}
                              alt={`Photo ${idx + 1}`}
                              style={{
                                width: 78,
                                height: 92,
                                borderRadius: 12,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
