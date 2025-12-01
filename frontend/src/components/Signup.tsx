import React, { useState } from "react";
import EmailVerification from "./EmailVerification";

function Signup({
  onNavigateToLogin,
  onSignupComplete,
}: {
  onNavigateToLogin?: () => void;
  onSignupComplete?: (email: string) => void;
}) {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Check if user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/dashboard';
    return null;
  }

  function doSignup(event: any): void {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch("https://poosdboard.com/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: username }),
    })
      .then(async (res) => {
        const data = await res.json();

        // If backend says the account exists but needs verification, show the code screen
        if (data.needsEmailVerification) {
          setVerificationEmail(email);
          setShowEmailVerification(true);
          return;
        }

        if (data.error && data.error !== "Signed up" && !data.error.includes("Signed up")) {
          throw new Error(data.error);
        }

        console.log("Signup successful:", data);

        // Show email verification screen
        setVerificationEmail(email);
        setShowEmailVerification(true);
      })
      .catch((err) => {
        console.error("Signup error:", err);
        alert("Signup failed: " + err.message);
      });
  }

  const layoutStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "calc(100vh - 150px)",
    margin: 0,
    padding: "clamp(20px, 5vw, 40px) clamp(16px, 4vw, 20px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "Inter, sans-serif",
    position: "relative",
  };

  const backgroundOverlayStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.15) 0%, transparent 25%),
      radial-gradient(circle at 75% 25%, rgba(78, 205, 196, 0.15) 0%, transparent 25%),
      radial-gradient(circle at 25% 75%, rgba(255, 143, 199, 0.15) 0%, transparent 25%),
      radial-gradient(circle at 75% 75%, rgba(253, 184, 19, 0.15) 0%, transparent 25%)
    `,
    zIndex: 1,
    pointerEvents: "none" as const,
  };

  const cardStyle: React.CSSProperties = {
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.75)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "clamp(16px, 4vw, 32px)",
    padding: "clamp(24px, 5vw, 50px) clamp(20px, 5vw, 60px)",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    zIndex: 10,
    boxSizing: "border-box",
  };

  const titleStyle = {
    fontSize: "clamp(20px, 4vw, 24px)",
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center" as const,
    marginBottom: "clamp(20px, 4vw, 32px)",
  };

  const inputStyle = {
    width: "100%",
    padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "12px",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    color: "#1f2937",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginBottom: "clamp(12px, 2.5vw, 16px)",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    marginTop: "clamp(8px, 2vw, 10px)",
    background: "linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)",
    color: "white",
    border: "none",
    padding: "clamp(12px, 2.5vw, 14px) 0",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "clamp(14px, 2.5vw, 16px)",
    boxShadow: "0 6px 20px rgba(85, 85, 255, 0.3)",
    transition: "all 0.3s ease",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
  };

  const linkStyle: React.CSSProperties = {
    color: "#ff0099",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
    transition: "color 0.3s ease",
  };

  const loginLinkStyle = {
    textAlign: "center" as const,
    marginTop: "clamp(16px, 3vw, 20px)",
    fontSize: "clamp(13px, 2.5vw, 14px)",
    color: "#4b5563",
  };

  const handleLoginClick = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      window.location.href = "/login";
    }
  };

  const handleEmailVerificationComplete = () => {
    setShowEmailVerification(false);
    if (onSignupComplete) onSignupComplete(verificationEmail);
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      window.location.href = "/login";
    }
  };

  // If showing email verification, render that component
  if (showEmailVerification) {
    return (
      <EmailVerification
        email={verificationEmail}
        onVerificationComplete={handleEmailVerificationComplete}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.95; }
        }
      `}</style>

      <div style={layoutStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Create Your Account</h2>

          <form onSubmit={doSignup} style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
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
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
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
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
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
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
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
            />

            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
                (e.target as HTMLElement).style.boxShadow = "0 8px 24px rgba(85, 85, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
                (e.target as HTMLElement).style.boxShadow = "0 6px 20px rgba(85, 85, 255, 0.3)";
              }}
            >
              Sign Up
            </button>
          </form>

          <div style={loginLinkStyle}>
            Already have an account?{" "}
            <span style={linkStyle} onClick={handleLoginClick}>
              Log in here!
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
