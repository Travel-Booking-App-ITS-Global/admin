import { useState } from "react";
import { User, Shield, Palette, Activity, Key, Sliders } from "lucide-react";
import { PageHeader } from "../../components/ui/index.jsx";

// Import individual settings tabs
import GeneralSettingsTab from "./GeneralSettingsTab.jsx";
import ProfileTab from "./ProfileTab.jsx";
import SecurityTab from "./SecurityTab.jsx";
import AppearanceTab from "./AppearanceTab.jsx";
import ConnectedApisTab from "./ConnectedApisTab.jsx";
import ApiKeysTab from "./ApiKeysTab.jsx";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  // Keep-alive cache: only mount a tab when first visited, but keep it in memory so switching is 0ms instant
  const [visitedTabs, setVisitedTabs] = useState(new Set(["general"]));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setVisitedTabs((prev) => new Set([...prev, tabId]));
  };

  const tabs = [
    { id: "general", label: "General & Platform", icon: Sliders },
    { id: "profile", label: "Profile & Vault", icon: User },
    { id: "security", label: "Security & 2FA", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "apis", label: "Connected APIs", icon: Activity },
    { id: "keys", label: "API Keys", icon: Key },
  ];

  return (
    <div>
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage platform rules, admin profile, security credentials, appearance, and third-party integrations"
      />

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-default)",
          marginBottom: 20,
          gap: 6,
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: 2,
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                borderBottom: isActive
                  ? "3px solid var(--brand-500)"
                  : "3px solid transparent",
                color: isActive ? "var(--brand-500)" : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                outline: "none",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents - Lazy-loaded on first click & kept alive in memory for instant switching */}
      <div>
        <div style={{ display: activeTab === "general" ? "block" : "none" }}>
          {visitedTabs.has("general") && <GeneralSettingsTab />}
        </div>
        <div style={{ display: activeTab === "profile" ? "block" : "none" }}>
          {visitedTabs.has("profile") && <ProfileTab />}
        </div>
        <div style={{ display: activeTab === "security" ? "block" : "none" }}>
          {visitedTabs.has("security") && <SecurityTab />}
        </div>
        <div style={{ display: activeTab === "appearance" ? "block" : "none" }}>
          {visitedTabs.has("appearance") && <AppearanceTab />}
        </div>
        <div style={{ display: activeTab === "apis" ? "block" : "none" }}>
          {visitedTabs.has("apis") && <ConnectedApisTab />}
        </div>
        <div style={{ display: activeTab === "keys" ? "block" : "none" }}>
          {visitedTabs.has("keys") && <ApiKeysTab />}
        </div>
      </div>
    </div>
  );
}
