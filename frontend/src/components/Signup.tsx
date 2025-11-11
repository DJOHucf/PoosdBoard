import React from "react";

function Signup({
  onNavigateToLogin,
  onSignupComplete,
}: {
  onNavigateToLogin?: () => void;
  onSignupComplete?: (email: string) => void;
}) {
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
      body: JSON.stringify({ email, password, username }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.error && data.error !== "Signed up") {
          throw new Error(data.error);
        }

        alert("Account created successfully!");
        console.log("Signup successful:", data);

        if (onNavigateToLogin) onNavigateToLogin();
        if (onSignupComplete) onSignupComplete(email);
      })
      .catch((err) => {
        console.error("Signup error:", err);
        alert("Signup failed: " + err.message);
      });
  }

  // === Fixed layout styles ===
  const layoutStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
    background:
      "linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    position: "fixed", // ensures it fills screen even if parent div is small
    top: 0,
    left: 0,
    overflow: "hidden",
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
    background: "rgba(255, 255, 255, 0.3)",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "32px",
    padding: "50px 60px",
    width: "420px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    zIndex: 10,
    color: "white",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center" as const,
    marginBottom: "32px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#374151",
    marginBottom: "16px",
    transition: "border-color 0.2s ease",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "10px",
    background:
      "linear-gradient(135deg, rgba(253, 184, 19, 0.9), rgba(255, 143, 199, 0.9))",
    color: "white",
    border: "3px solid rgba(255, 255, 255, 0.5)",
    padding: "14px 0",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "16px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
  };

  const linkStyle: React.CSSProperties = {
    color: "#FDB813",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
    transition: "color 0.3s ease",
  };

  const loginLinkStyle = {
    textAlign: "center" as const,
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280",
  };

  const handleLoginClick = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
      `}</style>

      <div style={layoutStyle}>
        <div style={backgroundOverlayStyle}></div>

        <div style={cardStyle}>
          {/* 🔹 Logo restored and animated */}
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: "80px",
              height: "80px",
              display: "block",
              margin: "0 auto 25px auto",
              animation: "pulse 3s ease-in-out infinite",
            }}
          />

          <h2 style={titleStyle}>Create Your Account</h2>

          <form onSubmit={doSignup} style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(253,184,19,0.9)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(253,184,19,0.9)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(253,184,19,0.9)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(253,184,19,0.9)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
              required
            />

            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background =
                  "linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))";
                (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background =
                  "linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))";
                (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
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
