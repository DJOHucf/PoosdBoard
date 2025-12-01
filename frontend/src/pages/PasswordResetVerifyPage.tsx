import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordResetVerifyPage: React.FC = () => {
  const query = useQuery();
  const email = query.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      setError("Missing email. Please start from the reset page.");
    }
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("https://poosdboard.com/api/verify-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        window.location.href = `/reset-change?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
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
    fontSize: "20px",
    letterSpacing: "6px",
    textAlign: "center" as const,
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
        <h2 style={{ marginBottom: "12px", color: "#111827" }}>Enter Reset Code</h2>
        <p style={{ marginBottom: "12px", color: "#4b5563" }}>
          We sent a 6-digit code to <strong>{email || "your email"}</strong>
        </p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle} disabled={isLoading || code.length !== 6 || !email}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </div>
  );
};

export default PasswordResetVerifyPage;
