import PageTitle from "../components/PageTitle";
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

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
        overflow: 'hidden',
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

    const contentContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(20px, 4vw, 40px)',
        padding: 'clamp(20px, 5vw, 60px)',
        maxWidth: '1400px',
        margin: '0 auto',
        zIndex: 10,
        position: 'relative',
        flex: 1,
        width: '100%',
        boxSizing: 'border-box',
    };

    const aboutCardStyle: React.CSSProperties = {
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.75)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: 'clamp(16px, 4vw, 32px)',
        padding: 'clamp(24px, 5vw, 50px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        zIndex: 10,
    };

    const aboutTitleStyle: React.CSSProperties = {
        fontSize: 'clamp(24px, 5vw, 36px)',
        fontWeight: 800,
        color: '#374151',
        marginBottom: 'clamp(16px, 3vw, 24px)',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    };

    const aboutTextStyle: React.CSSProperties = {
        fontSize: 'clamp(14px, 2.5vw, 18px)',
        color: '#4b5563',
        lineHeight: '1.8',
        fontWeight: 500,
    };

    const sectionCardStyle: React.CSSProperties = {
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.75)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: 'clamp(16px, 4vw, 32px)',
        padding: 'clamp(24px, 5vw, 40px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: 'clamp(22px, 4.5vw, 32px)',
        fontWeight: 800,
        color: '#374151',
        marginBottom: 'clamp(16px, 3vw, 24px)',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    };

    const buttonStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)',
        color: 'white',
        border: 'none',
        padding: 'clamp(14px, 3vw, 20px) clamp(24px, 5vw, 40px)',
        borderRadius: '16px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: 'clamp(16px, 2.5vw, 20px)',
        boxShadow: '0 8px 24px rgba(85, 85, 255, 0.3)',
        transition: 'all 0.3s ease',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        width: '100%',
        marginBottom: '12px',
    };

    const smallButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        fontSize: 'clamp(14px, 2.5vw, 16px)',
        padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 4vw, 28px)',
        marginBottom: 0,
    };

    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '12px',
    };

    return (
        <>
            <style>{`
                * {
                    margin: 0; 
                    padding: 0; 
                    box-sizing: border-box; 
                }
                body, html, #root {
                    margin: 0;
                    padding: 0;
                    width: 100%; 
                    overflow-x: hidden;
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
                
                /* Desktop layout - side by side */
                @media (min-width: 768px) {
                    .content-container {
                        flex-direction: row !important;
                        align-items: stretch !important;
                    }
                    .about-card {
                        flex: 1 !important;
                    }
                    .right-column {
                        flex: 1 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 40px !important;
                    }
                    .button-container {
                        flex-direction: row !important;
                    }
                }
            `}</style>

            <div style={layoutStyle}>
                <div style={backgroundOverlay1Style}></div>
                <div style={backgroundOverlay2Style}></div>

                <PageTitle />

                <div style={contentContainerStyle} className="content-container">
                    {/* Left Side - About Section */}
                    <div style={aboutCardStyle} className="about-card">
                        <h2 style={aboutTitleStyle}>About POOSD Board</h2>
                        <p style={aboutTextStyle}>
                            Welcome to POOSD Board, your ultimate interactive bingo experience! 
                            Whether you're hosting a game night with friends or joining a fun 
                            community event, we've got you covered.
                        </p>
                        <p style={{...aboutTextStyle, marginTop: 'clamp(12px, 2vw, 16px)'}}>
                            <strong style={{
                                fontSize: 'clamp(16px, 3vw, 20px)', 
                                display: 'block', 
                                marginBottom: '8px',
                                color: '#1f2937',
                            }}>
                                🎮 For Players:
                            </strong>
                            Jump right into the action! No sign-up required. Just enter a game 
                            code and start playing instantly.
                        </p>
                        <p style={{...aboutTextStyle, marginTop: 'clamp(12px, 2vw, 16px)'}}>
                            <strong style={{
                                fontSize: 'clamp(16px, 3vw, 20px)', 
                                display: 'block', 
                                marginBottom: '8px',
                                color: '#1f2937',
                            }}>
                                🎲 For Hosts:
                            </strong>
                            Create custom bingo boards, manage games in real-time, and bring 
                            people together for unforgettable moments.

                            <br/> <br/> <p style={{fontStyle: 'italic', fontSize: 'clamp(8px, 2vw, 10px)'}}> Made with ❤️ by Process of Object-Oriented Software Development Team 12. </p>
                        </p>
                    </div>

                    {/* Right Side - Action Sections */}
                    <div className="right-column" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(20px, 4vw, 40px)',
                    }}>
                        {/* Play Section */}
                        <div style={sectionCardStyle}>
                            <h3 style={sectionTitleStyle}>🎮 Play</h3>
                            <p style={{
                                ...aboutTextStyle,
                                marginBottom: '20px',
                                fontSize: 'clamp(14px, 2.5vw, 16px)',
                            }}>
                                No sign-up required!
                            </p>
                            <button
                                style={buttonStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(85, 85, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(85, 85, 255, 0.3)';
                                }}
                                onClick={() => navigate('/play')}
                            >
                                JOIN A GAME
                            </button>
                        </div>

                        {/* Host Section */}
                        <div style={sectionCardStyle}>
                            <h3 style={sectionTitleStyle}>🎲 Host</h3>
                            <p style={{
                                ...aboutTextStyle,
                                marginBottom: '20px',
                                fontSize: 'clamp(14px, 2.5vw, 16px)',
                            }}>
                                Create and manage bingo games
                            </p>
                            <div style={buttonContainerStyle} className="button-container">
                                <button
                                    style={{...smallButtonStyle, flex: 1}}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(85, 85, 255, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(85, 85, 255, 0.3)';
                                    }}
                                    onClick={() => navigate('/login')}
                                >
                                    LOG IN
                                </button>
                                <button
                                    style={{...smallButtonStyle, flex: 1}}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(85, 85, 255, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(85, 85, 255, 0.3)';
                                    }}
                                    onClick={() => navigate('/signup')}
                                >
                                    SIGN UP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;