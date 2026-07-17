import { useState } from "react";
import { Key } from "lucide-react";
import { useApp } from "../../store/AppContext.jsx";
import Modal from "../../components/ui/Modal.jsx";

export default function SecurityTab() {
  const { addToast, changeAdminPassword } = useApp();

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 2FA Authentication State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    return localStorage.getItem("admin_2fa_enabled") === "true";
  });
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast("Please enter current password", "error");
      return;
    }
    if (newPassword.length < 6) {
      addToast("New password must be at least 6 characters long", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    const res = changeAdminPassword(currentPassword, newPassword);
    if (res.success) {
      addToast("Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      addToast(res.message, "error");
    }
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      localStorage.setItem("admin_2fa_enabled", "false");
      setTwoFactorEnabled(false);
      addToast("Two-Factor Authentication disabled", "info");
    } else {
      setOtpCode("");
      setTwoFactorOpen(true);
    }
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6 || isNaN(otpCode)) {
      addToast("Please enter a valid 6-digit OTP code", "error");
      return;
    }
    localStorage.setItem("admin_2fa_enabled", "true");
    setTwoFactorEnabled(true);
    setTwoFactorOpen(false);
    addToast("Two-Factor Authentication enabled successfully!", "success");
  };

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
            onSubmit={handleUpdatePassword}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password</label>
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
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>
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
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Update Password Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
            >
              Update Password
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
                JBSWY3DPEHPK3PXP
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
