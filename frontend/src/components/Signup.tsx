function Signup({ onNavigateToLogin, onSignupComplete }: { 
	onNavigateToLogin?: () => void;
	onSignupComplete?: (email: string) => void;
}) {
	function doSignup(event: any): void {
		event.preventDefault();

		// Get form data
		const formData = new FormData(event.target);
		const email = formData.get('email') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		const name = `${firstName} ${lastName}`.trim();

		if (!email || !firstName || !lastName || !password || !confirmPassword) {
			alert('Please fill in all fields');
			return;
		}

		if (password.length < 8) {
			alert('Password must be at least 8 characters long');
			return;
		}

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		fetch('https://poosdboard.com/api/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, name })
		})
			.then(async (res) => {
				const data = await res.json();
				if (data.error && data.error !== 'Signed up') {
					throw new Error(data.error);
				}

				alert('Account created successfully!');
				console.log('Signup successful:', data);

				// Redirect automatically to login page
				if (onNavigateToLogin) onNavigateToLogin();
				if (onSignupComplete) onSignupComplete(email);
			})
			.catch((err) => {
				console.error('Signup error:', err);
				alert('Signup failed: ' + err.message);
			});
	}

	const containerStyle = {
		maxWidth: '400px',
		margin: '0 auto',
		background: 'white',
		padding: '32px',
		borderRadius: '12px',
		boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
		fontFamily: 'Arial, sans-serif'
	};

	const titleStyle = {
		fontSize: '24px',
		fontWeight: 'bold',
		color: '#374151',
		textAlign: 'center' as const,
		marginBottom: '32px'
	};

	const inputStyle = {
		width: '100%',
		padding: '12px 16px',
		border: '2px solid #e5e7eb',
		borderRadius: '8px',
		fontSize: '16px',
		color: '#374151',
		marginBottom: '16px',
		transition: 'border-color 0.2s ease',
		outline: 'none',
		boxSizing: 'border-box' as const
	};

	const buttonStyle = {
		width: '100%',
		background: '#16a34a', 
		color: 'white',
		fontWeight: '600',
		padding: '12px 16px',
		borderRadius: '8px',
		border: 'none',
		cursor: 'pointer',
		fontSize: '16px',
		transition: 'background-color 0.2s ease',
		marginTop: '8px'
	};

	const resultStyle = {
		marginTop: '16px',
		textAlign: 'center' as const,
		color: '#ef4444'
	};

	const loginLinkStyle = {
		textAlign: 'center' as const,
		marginTop: '20px',
		fontSize: '14px',
		color: '#6b7280'
	};

	const linkStyle = {
		color: '#2563eb',
		textDecoration: 'none',
		fontWeight: '500',
		cursor: 'pointer'
	};

	const handleLoginClick = () => {
		if (onNavigateToLogin) {
			onNavigateToLogin();
		} else {
			window.location.href = '/login';
		}
	};

	return (
		<div style={containerStyle}>
			<h2 style={titleStyle}>Create your account</h2>

			<form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={doSignup}>
				<input
					type="text"
					id="signupFirstName"
					name="firstName"
					placeholder="First Name"
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#16a34a'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
					required
				/>

				<input
					type="text"
					id="signupLastName"
					name="lastName"
					placeholder="Last Name"
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#16a34a'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
					required
				/>

				<input
					type="email"
					id="signupEmail"
					name="email"
					placeholder="Email Address"
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#16a34a'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
					required
				/>

				<input
					type="password"
					id="signupPassword"
					name="password"
					placeholder="Password"
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#16a34a'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
					required
				/>

				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					placeholder="Confirm Password"
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#16a34a'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
					required
				/>

				<button
					type="submit"
					id="signupButton"
					style={buttonStyle}
				>
					Sign Up
				</button>
			</form>

			<div id="signupResult" style={resultStyle}></div>

			<div style={loginLinkStyle}>
				Already have an account?{' '}
				<span
					style={linkStyle}
					onClick={handleLoginClick}
				>
					Log in here!
				</span>
			</div>
		</div>
	);
}

export default Signup;
