function Dashboard({ onNavigateToLogin }: { onNavigateToLogin?: () => void }) {
	const name = localStorage.getItem('name') || 'User';

	useEffect(() => {
		// Redirect to login if not authenticated
		const token = localStorage.getItem('token');
		if (!token) {
			window.location.href = '/login';
		}
	}, []);

	function handleLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		window.location.href = '/login';
	}

	function handleStartGame() {
		alert('Starting a new game...');
        //NEED TO FIX THIS WHEN WE IMPLEMENT A GAME!
		//window.location.href = '/newgame';
	}

	// Styles
	const layoutStyle = {
		display: 'flex',
		minHeight: '100vh',
		fontFamily: 'Arial, sans-serif',
		backgroundColor: '#f3f4f6',
	};

	const sidebarStyle = {
		width: '250px',
		backgroundColor: '#2563eb',
		color: 'white',
		display: 'flex',
		flexDirection: 'column' as const,
		padding: '24px',
		boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
	};

	const sidebarItem = {
		marginBottom: '20px',
		cursor: 'pointer',
		fontSize: '16px',
		fontWeight: 500,
		transition: 'color 0.2s ease',
	};

	const mainContentStyle = {
		flex: 1,
		padding: '60px',
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center' as const,
	};

	const headerStyle = {
		fontSize: '32px',
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: '10px',
	};

	const subTextStyle = {
		color: '#6b7280',
		marginBottom: '30px',
		fontSize: '18px',
	};

	const buttonStyle = {
		backgroundColor: '#2563eb',
		color: 'white',
		border: 'none',
		padding: '14px 28px',
		borderRadius: '8px',
		cursor: 'pointer',
		fontWeight: 600,
		fontSize: '16px',
		boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
		transition: 'transform 0.2s ease, background-color 0.2s ease',
	};

	return (
		<div style={layoutStyle}>
			{/* Sidebar */}
			<div style={sidebarStyle}>
				<h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '30px' }}>
					📊 Dashboard
				</h2>
				<div style={sidebarItem}>🏠 Home</div>
				<div style={sidebarItem}>👤 Profile</div>
				<div style={sidebarItem}>🎮 Saved Games</div>
				<div style={sidebarItem}>⚙️ Settings</div>
				<div
					style={{ ...sidebarItem, color: '#f87171', marginTop: 'auto' }}
					onClick={handleLogout}
				>
					Log Out
				</div>
			</div>

			{/* Main content */}
			<div style={mainContentStyle}>
				<h1 style={headerStyle}>Welcome back, {name}! 🎉</h1>
				<p style={subTextStyle}>Ready to play? Start a new game below!</p>

				<button
					style={buttonStyle}
					onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#1e40af')}
					onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = '#2563eb')}
					onClick={handleStartGame}
				>
					Start New Game
				</button>
			</div>
		</div>
	);
}

export default Dashboard;
