import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordResetChangePage: React.FC = () => {
  const query = useQuery();
  const initialEmail = query.get("email") || "";
  const initialCode = query.get("code") || "";
  const [email] = useState(initialEmail);
  const [code] = useState(initialCode);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email || !code) {
      setError("Missing reset info. Please restart the reset flow.");
    }
  }, [email, code]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("https://poosdboard.com/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: password }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        alert("Password updated. Please log in.");
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "min(92vw, 720px)",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "clamp(20px, 4vw, 40px)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.94)",
    boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "2px solid #d1d5db",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "17px",
    background: "#ffffff",
    color: "#111827",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)",
    color: "#fff",
    fontWeight: 700,
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.7 : 1,
  };

  const errorStyle: React.CSSProperties = { color: "#dc2626", minHeight: "20px", marginTop: "8px" };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #9be7ff 0%, #7c3aed 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 32px)",
        boxSizing: "border-box",
      }}
    >
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "12px", color: "#111827" }}>Set a New Password</h2>
        <p style={{ marginBottom: "12px", color: "#4b5563" }}>
          Email: <strong>{email || "unknown"}</strong>
        </p>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle} disabled={isLoading || !email || !code}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </div>
  );
};

export default PasswordResetChangePage;
