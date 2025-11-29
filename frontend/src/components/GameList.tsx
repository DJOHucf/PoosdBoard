import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Game {
  gameId: string;
  playerCount: number;
  started: boolean;
  timeStarted: number;
}

interface GameListProps {
  apiUrl?: string;
}

const GameList: React.FC<GameListProps> = ({ apiUrl = 'https://poosdboard.com/api' }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
    // Refresh game list every 5 seconds
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${apiUrl}/games`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGames(data.games || []);
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch games');
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        Loading games...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#dc2626'
      }}>
        Error: {error}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        No active games
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    }}>
      <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>
        Active Games ({games.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {games.map((game) => (
          <div
            key={game.gameId}
            style={{
              padding: '16px',
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.borderColor = '#d4d4d4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fafafa';
              e.currentTarget.style.borderColor = '#e5e5e5';
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'monospace'
                }}>
                  {game.gameId}
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  background: game.started ? '#22c55e' : '#f59e0b',
                  color: 'white'
                }}>
                  {game.started ? 'In Progress' : 'Waiting'}
                </div>
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                {game.playerCount} {game.playerCount === 1 ? 'player' : 'players'} · Started {formatTime(game.timeStarted)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/play/${game.gameId}`}>
                <button style={{
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  background: '#0b84ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0b84ff'}>
                  Join as Player
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
