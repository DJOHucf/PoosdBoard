import PageTitle from "../components/PageTitle";
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const layoutStyle: React.CSSProperties = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
    };

    const backgroundOverlay1Style: React.CSSProperties = {
        position: 'absolute',
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
        gap: '40px',
        padding: '60px',
        maxWidth: '1400px',
        margin: '0 auto',
        zIndex: 10,
        position: 'relative',
        alignItems: 'stretch',
    };

    const aboutCardStyle: React.CSSProperties = {
        flex: 1,
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '32px',
        padding: '50px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const aboutTitleStyle: React.CSSProperties = {
        fontSize: '36px',
        fontWeight: 800,
        color: 'white',
        marginBottom: '24px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    };

    const aboutTextStyle: React.CSSProperties = {
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: '1.8',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
        fontWeight: 500,
    };

    const rightColumnStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
    };

    const sectionCardStyle: React.CSSProperties = {
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '32px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 800,
        color: 'white',
        marginBottom: '24px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    };

    const buttonStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, rgba(253, 184, 19, 0.9), rgba(255, 143, 199, 0.9))',
        backdropFilter: 'blur(10px)',
        color: 'white',
        border: '3px solid rgba(255, 255, 255, 0.5)',
        padding: '20px 40px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        width: '100%',
        marginBottom: '12px',
    };

    const smallButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        fontSize: '16px',
        padding: '14px 28px',
    };

    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        marginTop: '12px',
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

                <PageTitle />

                <div style={contentContainerStyle}>
                    {/* Left Side - About Section */}
                    <div style={aboutCardStyle}>
                        <h2 style={aboutTitleStyle}>About POOSD Board</h2>
                        <p style={aboutTextStyle}>
                            Welcome to POOSD Board, your ultimate interactive bingo experience! 
                            Whether you're hosting a game night with friends or joining a fun 
                            community event, we've got you covered.
                        </p>
                        <p style={{...aboutTextStyle, marginTop: '16px'}}>
                            <strong style={{fontSize: '20px', display: 'block', marginBottom: '8px'}}>
                                🎮 For Players:
                            </strong>
                            Jump right into the action! No sign-up required. Just enter a game 
                            code and start playing instantly.
                        </p>
                        <p style={{...aboutTextStyle, marginTop: '16px'}}>
                            <strong style={{fontSize: '20px', display: 'block', marginBottom: '8px'}}>
                                🎲 For Hosts:
                            </strong>
                            Create custom bingo boards, manage games in real-time, and bring 
                            people together for unforgettable moments.
                        </p>
                    </div>

                    {/* Right Side - Action Sections */}
                    <div style={rightColumnStyle}>
                        {/* Play Section */}
                        <div style={sectionCardStyle}>
                            <h3 style={sectionTitleStyle}>🎮 Play</h3>
                            <p style={{
                                ...aboutTextStyle,
                                marginBottom: '20px',
                                fontSize: '16px',
                            }}>
                                No sign-up required!
                            </p>
                            <button
                                style={buttonStyle}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 
                                        'linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))';
                                    (e.currentTarget as HTMLElement).style.transform = 
                                        'translateY(-3px) scale(1.03)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 
                                        '0 12px 32px rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 
                                        'linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))';
                                    (e.currentTarget as HTMLElement).style.transform = 
                                        'translateY(0) scale(1)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 
                                        '0 8px 24px rgba(0, 0, 0, 0.2)';
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
                                fontSize: '16px',
                            }}>
                                Create and manage bingo games
                            </p>
                            <div style={buttonContainerStyle}>
                                <button
                                    style={{...smallButtonStyle, flex: 1}}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 
                                            'linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))';
                                        (e.currentTarget as HTMLElement).style.transform = 
                                            'translateY(-3px) scale(1.03)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 
                                            '0 12px 32px rgba(0, 0, 0, 0.25)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 
                                            'linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))';
                                        (e.currentTarget as HTMLElement).style.transform = 
                                            'translateY(0) scale(1)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 
                                            '0 8px 24px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onClick={() => navigate('/login')}
                                >
                                    LOG IN
                                </button>
                                <button
                                    style={{...smallButtonStyle, flex: 1}}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 
                                            'linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))';
                                        (e.currentTarget as HTMLElement).style.transform = 
                                            'translateY(-3px) scale(1.03)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 
                                            '0 12px 32px rgba(0, 0, 0, 0.25)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 
                                            'linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))';
                                        (e.currentTarget as HTMLElement).style.transform = 
                                            'translateY(0) scale(1)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 
                                            '0 8px 24px rgba(0, 0, 0, 0.2)';
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