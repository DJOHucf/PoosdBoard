import { buildPath } from './Path';

function Login({ onNavigateToSignup }: { onNavigateToSignup?: () => void }) {
	function doLogin(event: any): void {
		event.preventDefault();

		const login = (document.getElementById('loginName') as HTMLInputElement).value; // ✅ changed from username → login
		const password = (document.getElementById('loginPassword') as HTMLInputElement).value;
		const resultDiv = document.getElementById('loginResult');

		if (!login || !password) {
			if (resultDiv) {
				resultDiv.style.color = '#ef4444';
				resultDiv.textContent = 'Please enter your username or email and password.';
			}
			return;
		}

		console.log(buildPath('api/login'));
		fetch(buildPath('api/login'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password }),
		})
			.then(async (response) => {
				if (!response.ok) {
      				const text = await response.text();
      				throw new Error(text || 'Login failed');
    			}

				const data = await response.json();

				// backend returns "error": "Invalid user/pass" if failed
				if (data.error) {
					throw new Error(data.error);
				}

				if (resultDiv) {
					resultDiv.style.color = '#16a34a';
					resultDiv.textContent = 'Login successful!';
				}

				localStorage.setItem('token', data.auth);
				localStorage.setItem('name', data.name);

				// redirects user to homepage
				window.location.href = '/dashboard';
			})
			.catch((error) => {
				console.error('Login failed:', error);
				if (resultDiv) {
					resultDiv.style.color = '#ef4444';
					resultDiv.textContent = error.message || 'Login failed.';
				}
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
		background: '#2563eb',
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

	const signupLinkStyle = {
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

	const handleSignupClick = () => {
		if (onNavigateToSignup) onNavigateToSignup();
		else window.location.href = '/signup';
	};

	return (
		<div style={containerStyle}>
			<h2 style={titleStyle}>Welcome back!</h2>
			
			<form style={{display: 'flex', flexDirection: 'column'}} onSubmit={doLogin}>
				<input 
					type="text" 
					id="loginName" 
					placeholder="Email or Username" // ✅ more accurate label
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#2563eb'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
				/>
				
				<input 
					type="password" 
					id="loginPassword" 
					placeholder="Password"
					style={inputStyle}
					onFocus={(e) => e.target.style.borderColor = '#2563eb'}
					onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
				/>
				
				<button 
					type="submit" 
					id="loginButton" 
					style={buttonStyle}
				>
					Log In
				</button>
			</form>
			
			<div id="loginResult" style={resultStyle}></div>
			
			<div style={signupLinkStyle}>
				New here?{' '}
				<span 
					style={linkStyle}
					onClick={handleSignupClick}
				>
					Sign up for free!
				</span>
			</div>
		</div>
	);
}

export default Login;
