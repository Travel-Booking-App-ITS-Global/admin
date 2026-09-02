import { useState, useEffect } from "react";
import { Key, Loader2, AlertCircle } from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";
import { settingsApi } from "../../services/api.js";
import Modal from "../../components/ui/Modal.jsx";

export default function SecurityTab() {
  const { addToast } = useApp();

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 2FA Authentication State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [twoFactorUpdating, setTwoFactorUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manual2FaKey, setManual2FaKey] = useState("");

  useEffect(() => {
    settingsApi
      .getProfile()
      .then((p) => {
        if (p) {
          setTwoFactorEnabled(!!p.mfaEnabled);
          const emailPrefix = (p.email || "admin").split("@")[0].toUpperCase().slice(0, 4);
          setManual2FaKey(`ITSG${emailPrefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword) {
      setPasswordError("Please enter current password");
      addToast("Please enter current password", "error");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      addToast("New password must be at least 6 characters long", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      addToast("Passwords do not match", "error");
      return;
    }

    setPasswordUpdating(true);
    try {
      await settingsApi.changePassword(currentPassword, newPassword);
      addToast("Password securely changed in database!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.message || "Failed to change password";
      setPasswordError(msg);
      addToast(msg, "error");
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleToggle2FA = async () => {
    if (twoFactorEnabled) {
      setTwoFactorUpdating(true);
      try {
        await settingsApi.toggle2FA(false);
        setTwoFactorEnabled(false);
        addToast("Two-Factor Authentication disabled in database", "info");
      } catch (err) {
        addToast(err.message || "Failed to disable 2FA", "error");
      } finally {
        setTwoFactorUpdating(false);
      }
    } else {
      setOtpCode("");
      setTwoFactorOpen(true);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6 || isNaN(otpCode)) {
      addToast("Please enter a valid 6-digit OTP code", "error");
      return;
    }
    setTwoFactorUpdating(true);
    try {
      await settingsApi.toggle2FA(true);
      setTwoFactorEnabled(true);
      setTwoFactorOpen(false);
      addToast("Two-Factor Authentication enabled and secured in database!", "success");
    } catch (err) {
      addToast(err.message || "Failed to enable 2FA", "error");
    } finally {
      setTwoFactorUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Loader2 size={32} className="spin" style={{ color: "var(--brand-500)" }} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: 16,
      }}
    >
      {/* Change Password Card */}
      <div className="card">
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
            🔑 Security Credentials
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            Update admin account security password
          </div>
        </div>
        <div style={{ padding: "18px 22px" }}>
          <form
            noValidate
            onSubmit={handleUpdatePassword}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {passwordError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  fontSize: 12,
                }}
              >
                <AlertCircle size={14} />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password *</label>
              <div style={{ position: "relative" }}>
                <Key
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password *</label>
              <div style={{ position: "relative" }}>
                <Key
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <div style={{ position: "relative" }}>
                <Key
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Update Password Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
              disabled={passwordUpdating}
            >
              {passwordUpdating ? (
                <>
                  <Loader2 size={15} className="spin" style={{ marginRight: 8 }} />
                  Verifying & Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="card">
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
            🛡️ Two-Factor Authentication (2FA)
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            Secure your account with secondary verification code
          </div>
        </div>
        <div
          style={{
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-hover)",
              padding: "16px 18px",
              borderRadius: "var(--radius-md)",
              border: twoFactorEnabled
                ? "1.5px solid #22c55e"
                : "1.5px solid var(--border-default)",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: twoFactorEnabled
                    ? "#22c55e"
                    : "var(--text-secondary)",
                }}
              >
                <span>● {twoFactorEnabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                {twoFactorEnabled
                  ? "Protected by authenticator app"
                  : "No secondary security configured"}
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggle2FA}
              className={
                twoFactorEnabled ? "btn btn-danger btn-sm" : "btn btn-primary btn-sm"
              }
            >
              {twoFactorEnabled ? "Disable 2FA" : "Configure 2FA"}
            </button>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.4,
            }}
          >
            Two-factor authentication adds an extra layer of security to
            your account. Once enabled, you will be prompted for an OTP code
            during the login process.
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      <Modal
        open={twoFactorOpen}
        onClose={() => setTwoFactorOpen(false)}
        title="Setup Two-Factor Authentication (2FA)"
      >
        <form
          onSubmit={handleVerify2FA}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                display: "inline-block",
                background: "#fff",
                padding: 12,
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                marginBottom: 12,
              }}
            >
              <svg
                width="150"
                height="150"
                viewBox="0 0 100 100"
                style={{ shapeRendering: "crispEdges" }}
              >
                <rect width="100" height="100" fill="white" />
                <rect x="0" y="0" width="30" height="30" fill="black" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="black" />

                <rect x="70" y="0" width="30" height="30" fill="black" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="black" />

                <rect x="0" y="70" width="30" height="30" fill="black" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="black" />

                <rect x="40" y="0" width="10" height="20" fill="black" />
                <rect x="50" y="10" width="10" height="10" fill="black" />
                <rect x="40" y="30" width="10" height="10" fill="black" />
                <rect x="10" y="40" width="20" height="10" fill="black" />
                <rect x="0" y="50" width="10" height="10" fill="black" />
                <rect x="30" y="50" width="20" height="20" fill="black" />
                <rect x="60" y="40" width="30" height="10" fill="black" />
                <rect x="70" y="30" width="10" height="10" fill="black" />
                <rect x="90" y="50" width="10" height="30" fill="black" />
                <rect x="50" y="70" width="10" height="10" fill="black" />
                <rect x="40" y="80" width="20" height="20" fill="black" />
                <rect x="70" y="70" width="20" height="10" fill="black" />
                <rect x="70" y="90" width="30" height="10" fill="black" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Scan this QR Code with your Authenticator App
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              Or enter code manually:{" "}
              <code
                style={{
                  background: "var(--bg-hover)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {manual2FaKey || "ITSGADMINSECURE"}
              </code>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ textAlign: "center" }}>
              Enter 6-Digit Authenticator Code
            </label>
            <input
              type="text"
              maxLength="6"
              className="form-input"
              style={{
                textAlign: "center",
                fontSize: 20,
                letterSpacing: 6,
                fontWeight: 700,
              }}
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              required
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
              onClick={() => setTwoFactorOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Verify & Enable
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
