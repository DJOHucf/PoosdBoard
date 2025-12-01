import React, { useState } from "react";

const PasswordResetRequestPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("https://poosdboard.com/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessage("Check your email for the reset code.");
        window.location.href = `/reset-verify?email=${encodeURIComponent(email)}`;
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "min(90vw, 480px)",
    margin: "0 auto",
    padding: "clamp(20px, 4vw, 32px)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "2px solid #d1d5db",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "17px",
    background: "#f8fafc",
    color: "#111827", // ensure text is dark on light background
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)",
    color: "#fff",
    fontWeight: 700,
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.7 : 1,
  };

  const errorStyle: React.CSSProperties = { color: "#dc2626", minHeight: "20px", marginTop: "8px" };
  const infoStyle: React.CSSProperties = { color: "#16a34a", minHeight: "20px", marginTop: "8px" };

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
        <h2 style={{ marginBottom: "12px", color: "#111827" }}>Forgot Password</h2>
        <p style={{ marginBottom: "20px", color: "#4b5563" }}>
          Enter your account email. We'll send a 6-digit code to verify you.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
        {error && <div style={errorStyle}>{error}</div>}
        {message && <div style={infoStyle}>{message}</div>}
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;
