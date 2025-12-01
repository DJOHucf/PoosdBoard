import React, { useState } from "react";
import EmailVerification from "./EmailVerification";
import TwoFactorVerification from "./TwoFactorVerification";

function Login({ onNavigateToSignup }: { onNavigateToSignup?: () => void }) {
	// Check if user is already logged in
	const token = localStorage.getItem('token');
	if (token) {
		window.location.href = '/dashboard';
		return null;
	}

	const [showEmailVerification, setShowEmailVerification] = useState(false);
	const [show2FA, setShow2FA] = useState(false);
	const [verificationEmail, setVerificationEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [resultMessage, setResultMessage] = useState<{ text: string; color: string }>({
		text: '',
		color: '#4b5563',
	});

	function doLogin(event: any): void {
		event.preventDefault();

		const login = (document.getElementById('loginName') as HTMLInputElement).value;
		const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

		if (!login || !password) {
			setResultMessage({ text: 'Please enter your username or email and password.', color: '#ef4444' });
			return;
		}

		setIsLoading(true);

		fetch('https://poosdboard.com/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password }),
		})
			.then(async (response) => {
				const data = await response.json();

				if (data.error && data.error !== '') {
					// Email needs verification before allowing login
					if (data.needsEmailVerification && data.email) {
						setVerificationEmail(data.email);
						setShowEmailVerification(true);
						setResultMessage({ text: 'Please verify your email to continue.', color: '#ef4444' });
						return;
					}
					throw new Error(data.error);
				}

				// If backend requires 2FA, show code entry UI
				if (data.requires2FA && data.email) {
					setVerificationEmail(data.email);
					setShow2FA(true);
					setResultMessage({ text: data.message || 'Verification code sent to your email.', color: '#16a34a' });
					return;
				}

				setResultMessage({ text: 'Login successful!', color: '#16a34a' });

				localStorage.setItem('token', data.auth);
				localStorage.setItem('name', data.name);

				window.location.href = '/dashboard';
			})
			.catch((error) => {
				console.error('Login failed:', error);
				setResultMessage({ text: error.message || 'Login failed.', color: '#ef4444' });
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	const handle2FASuccess = (token: string, name: string) => {
		localStorage.setItem('token', token);
		localStorage.setItem('name', name);
		window.location.href = '/dashboard';
	};

	const handleEmailVerificationComplete = () => {
		setShowEmailVerification(false);
		setResultMessage({ text: 'Email verified! Please log in to continue.', color: '#16a34a' });
	};

	const handle2FACancel = () => {
		setShow2FA(false);
		setResultMessage({ text: 'Login cancelled. Please try again.', color: '#ef4444' });
	};

	const layoutStyle: React.CSSProperties = {
		width: '100%',
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
		background: "linear-gradient(135deg, #FF6B6B 0%, #FF8FC7 100%)",
		color: "white",
		border: "none",
		padding: "clamp(12px, 2.5vw, 14px) 0",
		borderRadius: "12px",
		cursor: "pointer",
		fontWeight: 700,
		fontSize: "clamp(14px, 2.5vw, 16px)",
		boxShadow: "0 6px 20px rgba(255, 107, 107, 0.3)",
		transition: "all 0.3s ease",
		textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
	};

	const linkStyle: React.CSSProperties = {
		color: "#4ECDC4",
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
  
	const resultStyle: React.CSSProperties = {
		marginTop: "16px",
		fontSize: "clamp(13px, 2.5vw, 14px)",
		fontWeight: 600,
		textAlign: "center",
		minHeight: "20px",
	};
  
const handleSignupClick = () => {
	if (onNavigateToSignup) onNavigateToSignup();
	else window.location.href = '/signup';
};

	const handleForgotPasswordClick = () => {
		window.location.href = '/forgot-password';
	};

	// Swap to verification UI when needed
	if (showEmailVerification) {
		return (
			<EmailVerification
				email={verificationEmail}
				onVerificationComplete={handleEmailVerificationComplete}
			/>
		);
	}

	if (show2FA) {
		return (
			<TwoFactorVerification
				email={verificationEmail}
				onVerificationSuccess={handle2FASuccess}
				onCancel={handle2FACancel}
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
					<h2 style={titleStyle}>Welcome back!</h2>

					<form onSubmit={doLogin} style={{ display: "flex", flexDirection: "column" }}>
						<input
							type="text"
							id="loginName"
							placeholder="Email or Username"
							style={inputStyle}
							onFocus={(e) => {
								e.target.style.borderColor = "#FF6B6B";
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
							id="loginPassword"
							placeholder="Password"
							style={inputStyle}
							onFocus={(e) => {
								e.target.style.borderColor = "#FF6B6B";
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
							disabled={isLoading}
							onMouseEnter={(e) => {
								(e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
								(e.target as HTMLElement).style.boxShadow = "0 8px 24px rgba(255, 107, 107, 0.4)";
							}}
							onMouseLeave={(e) => {
								(e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
								(e.target as HTMLElement).style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.3)";
							}}
						>
							{isLoading ? 'Logging in...' : 'Log In'}
						</button>

						<div style={loginLinkStyle}>
							Forgot your password?{" "}
							<span 
								style={linkStyle} 
								onClick={handleForgotPasswordClick}
								onMouseEnter={(e) => {
									(e.target as HTMLElement).style.color = "#45B7D1";
								}}
								onMouseLeave={(e) => {
									(e.target as HTMLElement).style.color = "#4ECDC4";
								}}
							>
								Reset it here
							</span>
						</div>
					</form>

					<div id="loginResult" style={{ ...resultStyle, color: resultMessage.color }}>
						{resultMessage.text}
					</div>

					<div style={loginLinkStyle}>
						New here?{" "}
						<span 
							style={linkStyle} 
							onClick={handleSignupClick}
							onMouseEnter={(e) => {
								(e.target as HTMLElement).style.color = "#45B7D1";
							}}
							onMouseLeave={(e) => {
								(e.target as HTMLElement).style.color = "#4ECDC4";
							}}
						>
							Sign up for free!
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
