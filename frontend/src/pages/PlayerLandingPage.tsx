import PlayerFields from '../components/PlayerFields';
import PageTitle from '../components/PageTitle';
import { Link, useParams } from 'react-router-dom';

function PlayerLandingPage() {
    const {gameId} = useParams();
    
    console.log('PlayerLandingPage rendered with gameId:', gameId);

    // Only show error if gameId exists but is invalid (not if it's missing)
    if (gameId !== undefined && !/^\d{6}$/.test(gameId)) {
        return (
            <div style={errorContainerStyle}>
                <div style={errorCardStyle}>
                    <h2 style={errorTitleStyle}>Invalid Game ID</h2>
                    <p style={errorTextStyle}>The game PIN you entered is not valid.</p>
                    <Link to="/play">
                        <button style={errorButtonStyle}>Go Back</button>
                    </Link>
                </div>
            </div>
        );
    }

    const layoutStyle: React.CSSProperties = {
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
        backgroundSize: '400% 400%',
        backgroundAttachment: 'fixed',
        animation: 'gradientShift 15s ease infinite',
        position: 'relative',
        overflowX: 'hidden',
    };

    const backgroundOverlay1Style: React.CSSProperties = {
        position: 'absolute',
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
        pointerEvents: 'none',
        zIndex: 1,
        animation: 'rotate 30s linear infinite',
    };

    const backgroundOverlay2Style: React.CSSProperties = {
        position: 'absolute',
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
        pointerEvents: 'none',
        zIndex: 1,
    };

    const contentWrapperStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        position: 'relative',
        padding: '20px 16px',
    };

    return (
        <>
            <style>{`
                * {
                    margin: 0; 
                    padding: 0; 
                    box-sizing: border-box; 
                }
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%; 
                    height: 100%;
                    overflow-x: hidden;
                }
                #root {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    min-height: 100vh;
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
                
                /* Global input styling for better contrast */
                input[type="text"],
                input[type="number"] {
                    background: rgba(255, 255, 255, 0.95) !important;
                    color: #1f2937 !important;
                    border: 2px solid rgba(255, 255, 255, 0.5) !important;
                    border-radius: 12px !important;
                    padding: 14px 16px !important;
                    font-size: clamp(16px, 2.5vw, 18px) !important;
                    font-weight: 600 !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                    transition: all 0.2s ease !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                input[type="text"]:focus,
                input[type="number"]:focus {
                    outline: none !important;
                    border-color: #5555ff !important;
                    box-shadow: 0 0 0 3px rgba(85, 85, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                    background: white !important;
                }
                
                input::placeholder {
                    color: #9ca3af !important;
                    opacity: 1 !important;
                }
                
                button[type="submit"],
                button:not([aria-label]) {
                    background: linear-gradient(135deg, #5555ff 0%, #aa00ff 100%) !important;
                    color: white !important;
                    border: none !important;
                    padding: 14px 32px !important;
                    border-radius: 12px !important;
                    font-size: clamp(16px, 2.5vw, 18px) !important;
                    font-weight: 700 !important;
                    cursor: pointer !important;
                    box-shadow: 0 4px 16px rgba(85, 85, 255, 0.3) !important;
                    transition: all 0.2s ease !important;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2) !important;
                    width: 100% !important;
                }
                
                button[type="submit"]:hover,
                button:not([aria-label]):hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(85, 85, 255, 0.4) !important;
                    background: linear-gradient(135deg, #6666ff 0%, #bb11ff 100%) !important;
                }
                
                button[type="submit"]:active,
                button:not([aria-label]):active {
                    transform: translateY(0) !important;
                }
                
                /* Label styling */
                label {
                    color: white !important;
                    font-weight: 700 !important;
                    font-size: clamp(14px, 2vw, 16px) !important;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3) !important;
                    margin-bottom: 8px !important;
                    display: block !important;
                }
                
                /* Form container improvements */
                form {
                    max-width: 400px !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                }
                
                /* Mobile responsive adjustments */
                @media (max-width: 640px) {
                    input[type="text"],
                    input[type="number"] {
                        font-size: 16px !important;
                        padding: 12px 14px !important;
                    }
                    
                    button[type="submit"],
                    button:not([aria-label]) {
                        font-size: 16px !important;
                        padding: 12px 24px !important;
                    }
                }
            `}</style>

            <div style={layoutStyle}>
                <div style={backgroundOverlay1Style}></div>
                <div style={backgroundOverlay2Style}></div>

                <div style={contentWrapperStyle}>
                    <PageTitle />
                    <PlayerFields gameId={gameId} />
                </div>
            </div>
        </>
    );
}

export default PlayerLandingPage;

/* Error page styles */
const errorContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
};

const errorCardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    padding: 'clamp(24px, 5vw, 40px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    border: '2px solid rgba(255, 255, 255, 0.5)',
};

const errorTitleStyle: React.CSSProperties = {
    color: '#ff0099',
    fontSize: 'clamp(24px, 5vw, 32px)',
    marginBottom: '16px',
    fontWeight: 800,
};

const errorTextStyle: React.CSSProperties = {
    color: '#4b5563',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    marginBottom: '24px',
    lineHeight: 1.6,
};

const errorButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: 12,
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(85, 85, 255, 0.3)',
    transition: 'all 0.2s ease',
};