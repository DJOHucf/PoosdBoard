import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BingoWebsocketPlayer } from './Websockets';

interface PlayerFieldsProps {
	onStepChange?: (step: 'code' | 'nickname' | 'loading') => void;
	gameId?: string;
}

function PlayerFields({ onStepChange, gameId }: PlayerFieldsProps) {
	console.log('PlayerFields initialized with onStepChange:', typeof onStepChange, onStepChange);
	const navigate = useNavigate();
	const [joinCode, setJoinCode] = useState(gameId || '');
	const [nickname, setNickname] = useState('');
	const [step, setStep] = useState<'code' | 'nickname' | 'loading'>('code');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const wsRef = useRef<BingoWebsocketPlayer | null>(null);
	const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const apiUrl = 'https://poosdboard.com/api';

	useEffect(() => {
		if (gameId && /^\d{6}$/.test(gameId)) {
			updateStep('nickname');
		} else {
			updateStep('code');
			setJoinCode('');
		}
	}, [gameId]);

	useEffect(() => {
		return () => {
			if (wsRef.current) {
				wsRef.current.shouldReconnect = false;
				wsRef.current.ws?.close();
			}
			if (checkIntervalRef.current) {
				clearInterval(checkIntervalRef.current);
			}
		};
	}, []);

	const checkGameExists = async (gameIdToCheck: string): Promise<boolean> => {
		try {
			const response = await fetch(`${apiUrl}/games`);
			const data = await response.json();
			
			if (data.error) {
				console.error('Error fetching games:', data.error);
				return false;
			}
			
			const gameExists = data.games?.some((game: any) => game.gameId === gameIdToCheck);
			console.log(`Game ${gameIdToCheck} exists:`, gameExists);
			return gameExists;
		} catch (err) {
			console.error('Failed to fetch games:', err);
			return false;
		}
	};

	useEffect(() => {
		if (step === 'loading') {
			console.log('Starting periodic game check for game:', joinCode);
			
			checkGameExists(joinCode).then(exists => {
				if (exists) {
					console.log('Game exists! Can proceed when game starts.');
					if (wsRef.current) {
						localStorage.setItem('gamePIN', joinCode);
						navigate('/bingo');
					}
				} else {
					console.log('Game not found in list yet, will keep checking...');
				}
			});
			
			checkIntervalRef.current = setInterval(async () => {
				const exists = await checkGameExists(joinCode);
				if (!exists) {
					console.log('Game still not found, continuing to wait...');
				}
			}, 2000);
		}
		
		return () => {
			if (checkIntervalRef.current) {
				clearInterval(checkIntervalRef.current);
				checkIntervalRef.current = null;
			}
		};
	}, [step, joinCode]);

	const updateStep = (newStep: 'code' | 'nickname' | 'loading') => {
		console.log('Updating step to:', newStep);
		setStep(newStep);
		if (onStepChange) {
			onStepChange(newStep);
		}
	};

	function handleCodeSubmit(event: any): void {
		event.preventDefault();

		if (joinCode.length !== 6 || !/^\d{6}$/.test(joinCode)) {
			alert('Please enter a valid 6-digit code');
			return;
		}

		updateStep('nickname');
	}

	function handleNicknameSubmit(event: any): void {
		event.preventDefault();

		if (!nickname.trim()) {
			alert('Please enter a nickname');
			return;
		}

		updateStep('loading');
		localStorage.setItem('playerName', nickname.trim());

		wsRef.current = new BingoWebsocketPlayer(nickname.trim(), joinCode);
		
		wsRef.current.onJoinSuccess = () => {
			console.log('Successfully joined game, waiting for game to start...');
		};

		wsRef.current.onGameStart = async () => {
			console.log('Game started! Checking if game exists in list...');
			
			const gameExists = await checkGameExists(joinCode);
			
			if (gameExists) {
				console.log('Game verified in list. Setting localStorage and redirecting to /bingo');
				localStorage.setItem('gamePIN', joinCode);
				navigate('/bingo');
			} else {
				console.warn('Game started but not found in game list. Will retry...');
			}
		};

		const originalHandleMessage = wsRef.current.handleMessage.bind(wsRef.current);
		wsRef.current.handleMessage = (data: any) => {
			if (data.type === 'error') {
				console.error('Error joining game:', data.error);
				setErrorMessage(`Woah there time traveler! Game ${joinCode} does not exist yet! Taking you back...`);
				
				setTimeout(() => {
					updateStep('code');
					setJoinCode('');
					setErrorMessage(null);
					if (wsRef.current) {
						wsRef.current.shouldReconnect = false;
						wsRef.current.ws?.close();
						wsRef.current = null;
					}
				}, 3000);
				
				return;
			}
			originalHandleMessage(data);
		};
	}

	const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d{0,6}$/.test(value)) {
			setJoinCode(value);
		}
	};

	const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(e.target.value);
	};
	
	const containerStyle: React.CSSProperties = {
		width: '100%',
		maxWidth: '400px',
		margin: '0 auto',
		background: 'rgba(255, 255, 255, 0.75)',
		padding: 'clamp(24px, 5vw, 32px)',
		borderRadius: '16px',
		boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
		fontFamily: 'Arial, sans-serif',
		backdropFilter: 'blur(20px)',
		border: '2px solid rgba(255, 255, 255, 0.5)',
	};

	const titleStyle: React.CSSProperties = {
		fontSize: 'clamp(20px, 4vw, 24px)',
		fontWeight: 'bold',
		color: '#374151',
		textAlign: 'center',
		marginBottom: '24px'
	};

	const inputStyle: React.CSSProperties = {
		width: '100%',
		padding: '14px 16px',
		border: '2px solid #e5e7eb',
		borderRadius: '12px',
		color: '#374151',
		marginBottom: '16px',
		transition: 'border-color 0.2s ease',
		outline: 'none',
		boxSizing: 'border-box',
		textAlign: 'center',
		letterSpacing: '0.2em',
		fontSize: 'clamp(20px, 4vw, 24px)',
		fontWeight: '600',
		background: 'white',
	};

	const buttonStyle: React.CSSProperties = {
		width: '100%',
		background: 'linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)',
		color: 'white',
		fontWeight: '700',
		padding: '14px 16px',
		borderRadius: '12px',
		border: 'none',
		cursor: 'pointer',
		fontSize: 'clamp(16px, 2.5vw, 18px)',
		transition: 'all 0.2s ease',
		marginTop: '8px',
		boxShadow: '0 4px 16px rgba(85, 85, 255, 0.3)',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
	};

	const loadingContainerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '24px',
		padding: '40px 20px',
	};

	const wheelStyle: React.CSSProperties = {
		width: '60px',
		height: '60px',
		border: '6px solid rgba(85, 85, 255, 0.2)',
		borderTop: '6px solid #5555ff',
		borderRadius: '50%',
		animation: 'spin 1s linear infinite',
	};

	const loadingTextStyle: React.CSSProperties = {
		fontSize: 'clamp(16px, 3vw, 18px)',
		fontWeight: 600,
		color: '#374151',
		textAlign: 'center',
	};

	if (step === 'loading') {
		return (
			<>
				<style>{`
					@keyframes spin {
						0% { transform: rotate(0deg); }
						100% { transform: rotate(360deg); }
					}
				`}</style>
				<div style={containerStyle}>
					<div style={loadingContainerStyle}>
						{!errorMessage && <div style={wheelStyle}></div>}
						<div style={{
							...loadingTextStyle,
							color: errorMessage ? '#dc2626' : '#374151'
						}}>
							{errorMessage || `Waiting for host of game ${joinCode}...`}
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<div style={containerStyle}>
			<h2 style={titleStyle}>
				{step === 'code' ? 'Enter Game PIN' : 'One last step!'}
			</h2>

			{step === 'code' ? (
				<form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleCodeSubmit}>
					<input
						type="text"
						id="joinCode"
						placeholder="______"
						value={joinCode}
						onChange={handleCodeChange}
						maxLength={6}
						style={inputStyle}
						onFocus={(e) => e.currentTarget.style.borderColor = '#5555ff'}
						onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
						inputMode="numeric"
						pattern="[0-9]*"
					/>

					<button
						type="submit"
						id="joinButton"
						style={buttonStyle}
						disabled={joinCode.length !== 6}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow = '0 6px 20px rgba(85, 85, 255, 0.4)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = '0 4px 16px rgba(85, 85, 255, 0.3)';
						}}
					>
						Continue
					</button>
				</form>
			) : (
				<form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleNicknameSubmit}>
					<input
						type="text"
						id="nickname"
						placeholder="Nickname"
						value={nickname}
						onChange={handleNicknameChange}
						maxLength={20}
						style={{
							...inputStyle,
							fontSize: 'clamp(16px, 3vw, 18px)',
							textAlign: 'left',
							letterSpacing: 'normal',
							fontWeight: '600'
						}}
						onFocus={(e) => e.currentTarget.style.borderColor = '#5555ff'}
						onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
						autoFocus
					/>

					<button
						type="submit"
						id="joinGameButton"
						style={buttonStyle}
						disabled={!nickname.trim()}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow = '0 6px 20px rgba(85, 85, 255, 0.4)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = '0 4px 16px rgba(85, 85, 255, 0.3)';
						}}
					>
						Join Game
					</button>
				</form>
			)}
		</div>
	);
}

export default PlayerFields;