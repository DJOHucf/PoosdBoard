import PageTitle from '../components/PageTitle.tsx';
function Dashboard() {
	const name = localStorage.getItem('name') || 'User';
	const token = localStorage.getItem('token');

	if (!token) {
		window.location.href = '/';
		return null;
	}

	function handleLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		window.location.href = '/';
	}

	function setGameId() {
		const gameId = Math.floor(100000 + Math.random() * 900000).toString();
		localStorage.setItem('gameId', gameId);
		// TODO: You might want to inform the backend about the new gameId here
	}

	function handleStartGame() {
		setGameId();
		const gameId = localStorage.getItem('gameId');
		window.location.href = `/host/${gameId}`;
	}

	const layoutStyle = {
		display: 'flex',
		minHeight: '100vh',
		fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
		background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
		backgroundSize: '400% 400%',
		animation: 'gradientShift 15s ease infinite',
		position: 'relative' as const,
		overflow: 'hidden',
	};

	const backgroundOverlay1Style = {
		position: 'absolute' as const,
		top: '50%',
		left: '50%',
		width: '800px',
		height: '800px',
		transform: 'translate(-50%, -50%)',
		background: `conic-gradient(
			from 0deg,
			transparent 0deg 20deg,
			rgba(253, 184, 19, 0.1) 20deg 40deg,
			transparent 40deg 60deg,
			rgba(253, 184, 19, 0.1) 60deg 80deg,
			transparent 80deg 100deg,
			rgba(253, 184, 19, 0.1) 100deg 120deg,
			transparent 120deg 140deg,
			rgba(253, 184, 19, 0.1) 140deg 160deg,
			transparent 160deg 180deg,
			rgba(253, 184, 19, 0.1) 180deg 200deg,
			transparent 200deg 220deg,
			rgba(253, 184, 19, 0.1) 220deg 240deg,
			transparent 240deg 260deg,
			rgba(253, 184, 19, 0.1) 260deg 280deg,
			transparent 280deg 300deg,
			rgba(253, 184, 19, 0.1) 300deg 320deg,
			transparent 320deg 340deg,
			rgba(253, 184, 19, 0.1) 340deg 360deg
		)`,
		pointerEvents: 'none' as const,
		zIndex: 1,
		animation: 'rotate 30s linear infinite',
	};

	const backgroundOverlay2Style = {
		position: 'absolute' as const,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundImage: `
			radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.15) 0%, transparent 25%),
			radial-gradient(circle at 75% 25%, rgba(78, 205, 196, 0.15) 0%, transparent 25%),
			radial-gradient(circle at 25% 75%, rgba(255, 143, 199, 0.15) 0%, transparent 25%),
			radial-gradient(circle at 75% 75%, rgba(253, 184, 19, 0.15) 0%, transparent 25%),
			radial-gradient(circle at 50% 50%, rgba(69, 183, 209, 0.1) 0%, transparent 30%)
		`,
		pointerEvents: 'none' as const,
		zIndex: 1,
	};

	const sidebarStyle = {
		width: '280px',
		backdropFilter: 'blur(20px)',
		background: 'rgba(255, 255, 255, 0.25)',
		borderRight: '1px solid rgba(255, 255, 255, 0.4)',
		display: 'flex',
		flexDirection: 'column' as const,
		padding: '32px 20px',
		boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
		position: 'relative' as const,
		zIndex: 10,
	};

	const sidebarItem = {
		marginBottom: '16px',
		cursor: 'pointer',
		fontSize: '16px',
		fontWeight: 600,
		padding: '14px 20px',
		borderRadius: '16px',
		background: 'rgba(255, 255, 255, 0.2)',
		backdropFilter: 'blur(10px)',
		border: '2px solid rgba(255, 255, 255, 0.3)',
		color: 'white',
		transition: 'all 0.3s ease',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
		transform: 'translateX(0)',
	};

	const sidebarItemHover = {
		background: 'rgba(255, 255, 255, 0.35)',
		transform: 'translateX(8px)',
		boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
		borderColor: 'rgba(255, 255, 255, 0.5)',
	};

	const mainContentStyle = {
		flex: 1,
		padding: '60px',
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center' as const,
		position: 'relative' as const,
		zIndex: 10,
	};

	const contentCardStyle = {
		backdropFilter: 'blur(20px)',
		background: 'rgba(255, 255, 255, 0.3)',
		border: '2px solid rgba(255, 255, 255, 0.4)',
		borderRadius: '32px',
		padding: '60px 80px',
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
	};

	const headerStyle = {
		fontSize: '42px',
		fontWeight: 800,
		color: 'white',
		marginBottom: '16px',
		textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
	};

	const subTextStyle = {
		color: 'rgba(255, 255, 255, 0.95)',
		marginBottom: '40px',
		fontSize: '20px',
		fontWeight: 500,
		textShadow: '1px 1px 3px rgba(0, 0, 0, 0.15)',
	};

	const buttonStyle = {
		background: 'linear-gradient(135deg, rgba(253, 184, 19, 0.9), rgba(255, 143, 199, 0.9))',
		backdropFilter: 'blur(10px)',
		color: 'white',
		border: '3px solid rgba(255, 255, 255, 0.5)',
		padding: '18px 48px',
		borderRadius: '20px',
		cursor: 'pointer',
		fontWeight: 700,
		fontSize: '18px',
		boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
		transition: 'all 0.3s ease',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
	};

	return (
		<>
			<style>{`
				@keyframes gradientShift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				@keyframes rotate {
					from { transform: translate(-50%, -50%) rotate(0deg); }
					to { transform: translate(-50%, -50%) rotate(360deg); }
				}
			`}</style>
			<div style={layoutStyle}>
				<div style={backgroundOverlay1Style}></div>
				<div style={backgroundOverlay2Style}></div>

				{/* Sidebar */}
				<div style={sidebarStyle}>
					<PageTitle />
					<h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '40px', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', padding: '0 12px' }}>
						📊 Dashboard
					</h2>
					<div
						style={sidebarItem}
						onMouseEnter={(e) => Object.assign(e.currentTarget.style, sidebarItemHover)}
						onMouseLeave={(e) => Object.assign(e.currentTarget.style, sidebarItem)}
					>
						🏠 Home
					</div>
					<div
						style={sidebarItem}
						onMouseEnter={(e) => Object.assign(e.currentTarget.style, sidebarItemHover)}
						onMouseLeave={(e) => Object.assign(e.currentTarget.style, sidebarItem)}
					>
						👤 Profile
					</div>
					<div
						style={sidebarItem}
						onMouseEnter={(e) => Object.assign(e.currentTarget.style, sidebarItemHover)}
						onMouseLeave={(e) => Object.assign(e.currentTarget.style, sidebarItem)}
					>
						🎮 Saved Games
					</div>
					<div
						style={sidebarItem}
						onMouseEnter={(e) => Object.assign(e.currentTarget.style, sidebarItemHover)}
						onMouseLeave={(e) => Object.assign(e.currentTarget.style, sidebarItem)}
					>
						⚙️ Settings
					</div>
					<div
						style={{
							...sidebarItem,
							background: 'rgba(255, 107, 107, 0.25)',
							borderColor: 'rgba(255, 107, 107, 0.5)',
							marginTop: 'auto',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'rgba(255, 107, 107, 0.4)';
							e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.7)';
							e.currentTarget.style.transform = 'translateX(8px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'rgba(255, 107, 107, 0.25)';
							e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.5)';
							e.currentTarget.style.transform = 'translateX(0)';
						}}
						onClick={handleLogout}
					>
						🚪 Log Out
					</div>
				</div>

				{/* Main content */}
				<div style={mainContentStyle}>
					<div style={contentCardStyle}>
						<h1 style={headerStyle}>Welcome back, {name}! 🎉</h1>
						<p style={subTextStyle}>Ready to play? Start a new game below!</p>

						<button
							style={buttonStyle}
							onMouseEnter={(e) => {
								(e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253, 184, 19, 1), rgba(255, 107, 107, 0.9))';
								(e.target as HTMLElement).style.transform = 'translateY(-4px) scale(1.05)';
								(e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
								(e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.7)';
							}}
							onMouseLeave={(e) => {
								(e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253, 184, 19, 0.9), rgba(255, 143, 199, 0.9))';
								(e.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
								(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
								(e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.5)';
							}}
							onClick={handleStartGame}
						>
							🎲 Start New Game
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
