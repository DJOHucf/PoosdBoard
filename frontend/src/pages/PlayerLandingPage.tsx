import PlayerFields from '../components/PlayerFields';
import PageTitle from '../components/PageTitle';
import { Link, useParams } from 'react-router-dom';

function PlayerLandingPage() {
    const {gameId} = useParams();
    
    console.log('PlayerLandingPage rendered with gameId:', gameId);

    // Only show error if gameId exists but is invalid (not if it's missing)
    if (gameId !== undefined && !/^\d{6}$/.test(gameId)) {
        return <div>Invalid game ID<br /> <Link to="/play"><button>Go back</button></Link></div>;
    }

    const footerStyle = {
        textAlign: 'center' as const,
        marginTop: 'auto',
        padding: '20px 0',
        fontSize: '14px',
        color: '#6b7280',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTop: '1px solid #e5e7eb',
        backdropFilter: 'blur(10px)',
    };

    const linkStyle = {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: 600,
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column' as const}}>
            <PageTitle />
            <PlayerFields gameId={gameId} />
            <footer style={footerStyle}>
                Host your own game for FREE at{' '}
                <Link 
                    to="/" 
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                    poosdboard.com
                </Link>
            </footer>
        </div>
    );
}

export default PlayerLandingPage;