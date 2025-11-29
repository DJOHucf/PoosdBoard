import React, { useState } from "react";

interface TwoFactorVerificationProps {
  email: string;
  onVerificationSuccess: (token: string, name: string) => void;
  onCancel: () => void;
}

function TwoFactorVerification({ email, onVerificationSuccess, onCancel }: TwoFactorVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://poosdboard.com/api/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.auth && data.name) {
        onVerificationSuccess(data.auth, data.name);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("2FA verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const layoutStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "calc(100vh - 150px)",
    margin: 0,
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.75)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "32px",
    padding: "50px 60px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "16px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "32px",
    lineHeight: "1.5",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "12px",
    fontSize: "20px",
    color: "#1f2937",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginBottom: "16px",
    textAlign: "center",
    letterSpacing: "8px",
    fontWeight: "600",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    background: "linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)",
    color: "white",
    border: "none",
    padding: "14px 0",
    borderRadius: "12px",
    cursor: isLoading ? "not-allowed" : "pointer",
    fontWeight: 700,
    fontSize: "16px",
    boxShadow: "0 6px 20px rgba(85, 85, 255, 0.3)",
    transition: "all 0.3s ease",
    marginTop: "8px",
    opacity: isLoading ? 0.6 : 1,
  };

  const cancelButtonStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    color: "#6b7280",
    border: "2px solid rgba(107, 114, 128, 0.3)",
    padding: "12px 0",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    marginTop: "12px",
    transition: "all 0.3s ease",
  };

  const errorStyle: React.CSSProperties = {
    color: "#ef4444",
    fontSize: "14px",
    marginBottom: "12px",
    minHeight: "20px",
  };

  return (
    <div style={layoutStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Two-Factor Authentication</h2>
        <p style={subtitleStyle}>
          We've sent a 6-digit verification code to<br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#5555ff";
              e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.4)";
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
            }}
            required
            autoFocus
          />

          {error && <div style={errorStyle}>{error}</div>}

          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading || verificationCode.length !== 6}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLElement).style.transform = "translateY(-3px)";
                (e.target as HTMLElement).style.boxShadow = "0 8px 24px rgba(85, 85, 255, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "translateY(0)";
              (e.target as HTMLElement).style.boxShadow = "0 6px 20px rgba(85, 85, 255, 0.3)";
            }}
          >
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>

        <button
          style={cancelButtonStyle}
          onClick={onCancel}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.borderColor = "rgba(107, 114, 128, 0.5)";
            (e.target as HTMLElement).style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = "rgba(107, 114, 128, 0.3)";
            (e.target as HTMLElement).style.color = "#6b7280";
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TwoFactorVerification;
