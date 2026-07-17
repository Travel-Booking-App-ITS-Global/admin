import { useState } from "react";
import { User, Shield, Palette, Activity, Key } from "lucide-react";
import { PageHeader } from "../../components/ui/index.jsx";

// Import individual settings tabs
import ProfileTab from "./ProfileTab.jsx";
import SecurityTab from "./SecurityTab.jsx";
import AppearanceTab from "./AppearanceTab.jsx";
import ConnectedApisTab from "./ConnectedApisTab.jsx";
import ApiKeysTab from "./ApiKeysTab.jsx";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security & 2FA", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "apis", label: "Connected APIs", icon: Activity },
    { id: "keys", label: "API Keys", icon: Key },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage profile, security credentials, appearance, and API configurations"
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
              onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Contents */}
      <div>
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "apis" && <ConnectedApisTab />}
        {activeTab === "keys" && <ApiKeysTab />}
      </div>
    </div>
  );
}
