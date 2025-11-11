import { useState, useEffect } from 'react';

interface PlayerFieldsProps {
	onStepChange?: (step: 'code' | 'nickname' | 'loading') => void;
	gameId?: string;
}

function PlayerFields({ onStepChange, gameId }: PlayerFieldsProps) {
	console.log('PlayerFields initialized with onStepChange:', typeof onStepChange, onStepChange);
	const [joinCode, setJoinCode] = useState(gameId || '');
	const [nickname, setNickname] = useState('');
	const [step, setStep] = useState<'code' | 'nickname' | 'loading'>('code');

	// If gameId is provided and valid, automatically move to nickname step
	
	useEffect(() => {
		if (gameId && /^\d{6}$/.test(gameId)) {
			updateStep('nickname');
		} else {
			// else stay on code step and give warning that code is invalid in red text
			updateStep('code');
			// Optionally, you could also clear the joinCode input
			setJoinCode('');
		}
	}, [gameId]);

	const updateStep = (newStep: 'code' | 'nickname' | 'loading') => {
		console.log('Updating step to:', newStep);
		setStep(newStep);
		if (onStepChange) {
			onStepChange(newStep);
		}
	};

	function handleCodeSubmit(event: any): void {
		event.preventDefault();

		// Validate that it's a 6-digit number
		if (joinCode.length !== 6 || !/^\d{6}$/.test(joinCode)) {
			alert('Please enter a valid 6-digit code');
			return;
		}

		// Move to nickname step
		updateStep('nickname');
	}

	function handleNicknameSubmit(event: any): void {
		event.preventDefault();

		if (!nickname.trim()) {
			alert('Please enter a nickname');
			return;
		}

		// Show loading screen
		updateStep('loading');

		// TODO: Implement join game logic with code and nickname
		// Here you would make your API call with joinCode and nickname
		// Example:
		// fetch('/api/join-game', { method: 'POST', body: JSON.stringify({ joinCode, nickname }) })
		//   .then(response => response.json())
		//   .then(data => {
		//     // Navigate to game or handle success
		//   })
		//   .catch(error => {
		//     alert('Error joining game');
		//     setStep('nickname'); // Go back to nickname step on error
		//   });
	}

	const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only allow numbers and limit to 6 digits
		if (/^\d{0,6}$/.test(value)) {
			setJoinCode(value);
		}
	};

	const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(e.target.value);
	};

	const containerStyle = {
		width: '300px',
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
		color: '#374151',
		marginBottom: '16px',
		transition: 'border-color 0.2s ease',
		outline: 'none',
		boxSizing: 'border-box' as const,
		textAlign: 'center' as const,
		letterSpacing: '0.2em',
		fontSize: '24px',
		fontWeight: '600'
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

	const loadingContainerStyle = {
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		justifyContent: 'center',
		gap: '24px',
		padding: '40px 20px',
	};

	const wheelStyle = {
		width: '60px',
		height: '60px',
		border: '6px solid rgba(37, 99, 235, 0.2)',
		borderTop: '6px solid #2563eb',
		borderRadius: '50%',
		animation: 'spin 1s linear infinite',
	};

	const loadingTextStyle = {
		fontSize: '18px',
		fontWeight: 600,
		color: '#374151',
		textAlign: 'center' as const,
	};

	// If loading, show loading wheel
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
						<div style={wheelStyle}></div>
						<div style={loadingTextStyle}>Joining game {joinCode}...</div>
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
						onFocus={(e) => e.target.style.borderColor = '#2563eb'}
						onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
						inputMode="numeric"
						pattern="[0-9]*"
					/>

					<button
						type="submit"
						id="joinButton"
						style={buttonStyle}
						disabled={joinCode.length !== 6}
						onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
						onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
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
							fontSize: '16px',
							textAlign: 'left',
							letterSpacing: 'normal',
							fontWeight: 'normal'
						}}
						onFocus={(e) => e.target.style.borderColor = '#2563eb'}
						onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
						autoFocus
					/>

					<button
						type="submit"
						id="joinGameButton"
						style={buttonStyle}
						disabled={!nickname.trim()}
						onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
						onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
					>
						Join Game
					</button>

					
				</form>
			)}

		</div>
	);
}

export default PlayerFields;
