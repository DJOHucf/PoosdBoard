import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GameEndedPopupProps {
    show: boolean;
}

const GameEndedPopup: React.FC<GameEndedPopupProps> = ({ show }) => {
    const navigate = useNavigate();

    if (!show) return null;

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
    };

    const popupStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.5)',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '16px',
        background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    const messageStyle: React.CSSProperties = {
        fontSize: '18px',
        color: '#374151',
        marginBottom: '32px',
        lineHeight: '1.6',
    };

    const buttonStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, #FDB813, #FF8FC7)',
        color: 'white',
        border: '3px solid rgba(255, 255, 255, 0.5)',
        padding: '16px 32px',
        borderRadius: '16px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '18px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
    };

    const handleReturnToPlay = () => {
        // Clear game-related localStorage items
        localStorage.removeItem('gamePIN');
        localStorage.removeItem('playerName');
        console.log("🧹 Cleared gamePIN and playerName from localStorage");
        navigate('/play');
    };

    return (
        <div style={overlayStyle}>
            <div style={popupStyle}>
                <h2 style={titleStyle}>Game Ended</h2>
                <p style={messageStyle}>
                    The host has ended this game. Thank you for playing!
                </p>
                <button
                    onClick={handleReturnToPlay}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-3px) scale(1.05)';
                        (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
                        (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                    }}
                >
                    Return to Play
                </button>
            </div>
        </div>
    );
};

export default GameEndedPopup;
