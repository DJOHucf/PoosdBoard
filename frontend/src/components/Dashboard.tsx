import React, { useState } from 'react';

function Dashboard() {  
	const name = localStorage.getItem('name') || 'User';
	const token = localStorage.getItem('token');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	if (!token) {
		window.location.href = '/login';
		return null;
	}

	function handleLogout() {
		console.log('Logout clicked');
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		localStorage.removeItem('gameId');
		window.location.href = '/login';
	}

	function handleStartGame() {
		console.log('Start game clicked');
		// Generate a temporary game ID
		const tempGameId = 'pending';
		localStorage.setItem('gameId', tempGameId);
		// Navigate to host page
		window.location.href = `/host/${tempGameId}`;
		localStorage.setItem('isHostActive', 'true');
	}

	const layoutStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
		width: '100vw',
		margin: 0,
		padding: 0,
		fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
		background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
		backgroundSize: '400% 400%',
		backgroundAttachment: 'fixed',
		animation: 'gradientShift 15s ease infinite',
		position: 'fixed',
		top: 0,
		left: 0,
		overflow: 'hidden',
		boxSizing: 'border-box',
	};

	const backgroundOverlay1Style = {
		position: 'absolute' as const,
		top: '50%',
		left: '50%',
		width: '150vw',
		height: '150vh',
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

	const mobileHeaderStyle: React.CSSProperties = {
		display: 'none',
		padding: '12px 20px',
		backdropFilter: 'blur(20px)',
		background: 'rgba(255, 255, 255, 0.3)',
		borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
		position: 'relative',
		zIndex: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
	};

	const hamburgerStyle: React.CSSProperties = {
		fontSize: '28px',
		cursor: 'pointer',
		color: 'white',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
	};

	const contentWrapperStyle: React.CSSProperties = {
		display: 'flex',
		flex: 1,
		position: 'relative',
		zIndex: 10,
	};

	const sidebarStyle: React.CSSProperties = {
		width: '280px',
		backdropFilter: 'blur(20px)',
		background: 'rgba(255, 255, 255, 0.3)',
		borderRight: '1px solid rgba(255, 255, 255, 0.4)',
		display: 'flex',
		flexDirection: 'column',
		padding: '32px 20px',
		boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
		position: 'relative',
		zIndex: 10,
	};

	const mobileSidebarStyle: React.CSSProperties = {
		width: '280px',
		backdropFilter: 'blur(20px)',
		background: 'rgba(255, 255, 255, 0.3)',
		borderRight: '1px solid rgba(255, 255, 255, 0.4)',
		display: 'flex',
		flexDirection: 'column',
		padding: '32px 20px',
		boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
		position: 'fixed',
		top: 0,
		left: 0,
		height: '100vh',
		transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
		transition: 'transform 0.3s ease',
		zIndex: 30,
	};

	const overlayStyle: React.CSSProperties = {
		display: sidebarOpen ? 'block' : 'none',
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: 'rgba(0, 0, 0, 0.5)',
		zIndex: 25,
	};

	const sidebarItem = {
		marginBottom: '16px',
		cursor: 'pointer',
		fontSize: 'clamp(14px, 2.5vw, 16px)',
		fontWeight: 600,
		padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 20px)',
		borderRadius: '16px',
		background: 'rgba(255, 255, 255, 0.2)',
		backdropFilter: 'blur(10px)',
		border: '2px solid rgba(255, 255, 255, 0.3)',
		color: 'white',
		transition: 'all 0.3s ease',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
		transform: 'translateX(0)'
	};

	const sidebarItemHover = {
		background: 'rgba(255, 255, 255, 0.35)',
		transform: 'translateX(8px)',
		boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
		borderColor: 'rgba(255, 255, 255, 0.5)',
	};

	const mainContentStyle: React.CSSProperties = {
		flex: 1,
		padding: 'clamp(20px, 5vw, 60px)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		position: 'relative',
		zIndex: 10,
		overflowY: 'auto',
	};

	const contentCardStyle: React.CSSProperties = {
		backdropFilter: 'blur(20px)',
		background: 'rgba(255, 255, 255, 0.3)',
		border: '2px solid rgba(255, 255, 255, 0.4)',
		borderRadius: 'clamp(16px, 4vw, 32px)',
		padding: 'clamp(30px, 6vw, 60px) clamp(20px, 6vw, 80px)',
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
		maxWidth: '600px',
		width: '100%',
		boxSizing: 'border-box',
	};

	const headerStyle: React.CSSProperties = {
		fontSize: 'clamp(24px, 5vw, 42px)',
		fontWeight: 800,
		color: 'white',
		marginBottom: 'clamp(12px, 2vw, 16px)',
		textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
		wordBreak: 'break-word',
	};

	const subTextStyle: React.CSSProperties = {
		color: 'rgba(255, 255, 255, 0.95)',
		marginBottom: 'clamp(24px, 4vw, 40px)',
		fontSize: 'clamp(16px, 3vw, 20px)',
		fontWeight: 500,
		textShadow: '1px 1px 3px rgba(0, 0, 0, 0.15)',
	};

	const buttonStyle: React.CSSProperties = {
		background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8FC7 100%)',
		color: 'white',
		border: 'none',
		padding: 'clamp(14px, 3vw, 18px) clamp(32px, 6vw, 48px)',
		borderRadius: '16px',
		cursor: 'pointer',
		fontWeight: 700,
		fontSize: 'clamp(16px, 3vw, 18px)',
		boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
		transition: 'all 0.3s ease',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
		width: '100%',
		maxWidth: '300px',
	};

	return (
		<>
			<style>{`
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				
				@keyframes gradientShift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				@keyframes rotate {
					from { transform: translate(-50%, -50%) rotate(0deg); }
					to { transform: translate(-50%, -50%) rotate(360deg); }
				}
				
				@media (max-width: 768px) {
					.mobile-header {
						display: flex !important;
					}
					.desktop-sidebar {
						display: none !important;
					}
				}
			`}</style>
			<div style={layoutStyle}>
				<div style={backgroundOverlay1Style}></div>
				<div style={backgroundOverlay2Style}></div>

				{/* Mobile Header */}
				<div style={mobileHeaderStyle} className="mobile-header">
					<span 
						style={hamburgerStyle} 
						onClick={(e) => {
							e.stopPropagation();
							setSidebarOpen(true);
						}}
					>
						☰
					</span>
					<img 
						src="/logo2.png" 
						alt="PoosdBoard Logo"
						style={{
							height: '40px',
							width: 'auto',
						}}
					/>
					<div style={{ width: '28px' }}></div>
				</div>

				{/* Overlay for mobile */}
				<div 
					style={overlayStyle} 
					onClick={(e) => {
						e.stopPropagation();
						setSidebarOpen(false);
					}}
				></div>

				<div style={contentWrapperStyle}>
					{/* Desktop Sidebar - Always visible on desktop */}
					<div style={sidebarStyle} className="desktop-sidebar">
						<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
							<img 
								src="/logo2.png" 
								alt="PoosdBoard Logo"
								style={{
									width: '100%',
									maxWidth: '220px',
									height: 'auto',
									filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))',
								}}
							/>
						</div>
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

					{/* Mobile Sidebar - Slides in from left on mobile */}
					<div style={mobileSidebarStyle}>
						<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px' }}>
							<span 
								style={{ fontSize: '28px', cursor: 'pointer', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} 
								onClick={(e) => {
									e.stopPropagation();
									setSidebarOpen(false);
								}}
							>
								✕
							</span>
						</div>
						<div
							style={sidebarItem}
							onClick={(e) => {
								e.stopPropagation();
								setSidebarOpen(false);
							}}
						>
							🏠 Home
						</div>
						<div
							style={sidebarItem}
							onClick={(e) => {
								e.stopPropagation();
								setSidebarOpen(false);
							}}
						>
							👤 Profile
						</div>
						<div
							style={sidebarItem}
							onClick={(e) => {
								e.stopPropagation();
								setSidebarOpen(false);
							}}
						>
							🎮 Saved Games
						</div>
						<div
							style={sidebarItem}
							onClick={(e) => {
								e.stopPropagation();
								setSidebarOpen(false);
							}}
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
							onClick={(e) => {
								e.stopPropagation();
								handleLogout();
							}}
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
									(e.target as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
									(e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(255, 107, 107, 0.4)';
								}}
								onMouseLeave={(e) => {
									(e.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
									(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(255, 107, 107, 0.3)';
								}}
								onClick={(e) => {
									e.stopPropagation();
									handleStartGame();
								}}
							>
								🎲 Start New Game
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;