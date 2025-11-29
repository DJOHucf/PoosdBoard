import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import WinnerPopup from "../components/winnerPopup";
import { BingoWebsocketHost } from "../components/Websockets";

type Params = {
  gameId?: string;
};

const QRCode: React.FC<{ url: string; size?: number }> = ({ url, size = 160 }) => {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    url
  )}`;
  return <img src={src} alt={`QR code for ${url}`} width={size} height={size} style={{ borderRadius: 8 }} />;
};

const BingoHostPage: React.FC = () => {
  const { gameId } = useParams<Params>();
  const navigate = useNavigate();
  const [actualGameId, setActualGameId] = useState<string>(gameId || "");
  const hostUrl = `https://poosdboard.com/play/${actualGameId}`;

  // space for players' names to pop up as they join
  const [players, setPlayers] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [numberColors, setNumberColors] = useState<{[key: number]: string}>({});
  const [showWinnerPopup, setShowWinnerPopup] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string>("Test Winner");
  const [isSpinning, setIsSpinning] = useState<boolean>(false); 
  const [ballColor, setBallColor] = useState<string>('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

const ballColors = [
  'linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)', 
  'linear-gradient(135deg, #ffaa00 0%, #ff0099 100%)', 
  'linear-gradient(135deg, #ff0000 0%, #ff1493 100%)', 
  'linear-gradient(135deg, #00d4aa 0%, #0099ff 100%)', 
  'linear-gradient(135deg, #ff006e 0%, #8b00ff 100%)', 
  'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)', 
  'linear-gradient(135deg, #ff4500 0%, #ffd700 100%)', 
  'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
];
  
  const layoutStyle: React.CSSProperties = {
    width:"100%", 
    minHeight: "100vh", 
    margin:0, 
    padding: 0, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "flex-start", 
    fontFamily: "Inter, system-ui, -apple-system, sans-serif", 
    position: "absolute", 
    top: 0,
    left:0,
    paddingTop: 40,
    paddingBottom: 40, 
    overflow: "hidden", 
    boxSizing: "border-box", 
    background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
  };

  const backgroundOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.15) 0%, transparent 25%),
      radial-gradient(circle at 75% 25%, rgba(78, 205, 196, 0.15) 0%, transparent 25%),
      radial-gradient(circle at 25% 75%, rgba(255, 143, 199, 0.15) 0%, transparent 25%),
      radial-gradient(circle at 75% 75%, rgba(253, 184, 19, 0.15) 0%, transparent 25%)
    `,
    zIndex: 1,
    pointerEvents: "none",
  };

  const cardStyle: React.CSSProperties = { 
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.3)",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "32px",
    padding: "40px 50px",
    width: "90%",
    maxWidth: "800px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
    marginBottom: 40,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px", 
    fontWeight: "bold", 
    color: "white",
    textAlign: "center", 
    marginTop: 0, 
    marginBottom: 30, 
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(253, 184, 19, 0.9), rgba(255, 143, 199, 0.9))",
    color: "white",
    border: "3px solid rgba(255, 255, 255, 0.5)",
    padding: "14px 28px",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "18px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
  };

  
const animationStyles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes spinBall {
    0% { 
      transform: translateY(-80px) rotateX(0deg) scale(0.8);
      opacity: 0.7;
    }
    20% { 
      transform: translateY(0px) rotateX(360deg) scale(1.1);
      opacity: 1;
    }
    35% { 
      transform: translateY(-40px) rotateX(540deg) scale(1.05);
    }
    50% { 
      transform: translateY(0px) rotateX(720deg) scale(1.08);
    }
    65% { 
      transform: translateY(-20px) rotateX(900deg) scale(1.03);
    }
    80% { 
      transform: translateY(0px) rotateX(1080deg) scale(1.05);
    }
    90% { 
      transform: translateY(-8px) rotateX(1170deg) scale(1.02);
    }
    100% { 
      transform: translateY(0px) rotateX(1260deg) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes rotateHighlight {
    0% { 
      transform: translateX(-30%) translateY(-30%) scale(1);
      opacity: 0.8;
    }
    25% { 
      transform: translateX(0%) translateY(-40%) scale(1.2);
      opacity: 0.6;
    }
    50% { 
      transform: translateX(30%) translateY(-30%) scale(1);
      opacity: 0.5;
    }
    75% { 
      transform: translateX(0%) translateY(-20%) scale(0.8);
      opacity: 0.7;
    }
    100% { 
      transform: translateX(-30%) translateY(-30%) scale(1);
      opacity: 0.8;
    }
  }
`;

  // WebSocket connection for host
  const wsRef = useRef<BingoWebsocketHost | null>(null);
  const wsInitializedRef = useRef<boolean>(false);

  // Initialize WebSocket connection
  useEffect(() => {
    // Prevent multiple WebSocket initializations
    if (wsInitializedRef.current) {
      console.log('WebSocket already initialized, skipping...');
      return;
    }
    
    wsInitializedRef.current = true;
    console.log('Initializing WebSocket connection for gameId:', gameId);
    
    // Small delay to handle React Strict Mode double-mounting in development
    const initTimer = setTimeout(() => {
      const hostName = localStorage.getItem('hostName') || 'Host';
      
      // Check if we're reconnecting to an existing game or creating a new one
      if (gameId && gameId !== 'pending') {
        // Reconnecting to existing game
        console.log('Reconnecting to existing game:', gameId);
        setActualGameId(gameId);
        
        // Create WebSocket with reconnection
        wsRef.current = new BingoWebsocketHost(hostName, gameId);
      } else {
        // Creating a new game (gameId is 'pending' or not set)
        console.log('Creating new game...');
        wsRef.current = new BingoWebsocketHost(hostName);
      }
      
      // Set up callback for when game is created on the server
      wsRef.current.onGameCreated = (serverGameId) => {
        console.log('Game created on server with ID:', serverGameId);
        setActualGameId(serverGameId);
        // Store the server-generated game ID
        if(localStorage.getItem('isHostActive') !== 'false')
          localStorage.setItem('gameId', serverGameId);
        
        // Always update the URL to the server's game ID
        console.log(`Updating URL to /host/${serverGameId}`);
        navigate(`/host/${serverGameId}`, { replace: true });
      };
      
      // Set up callbacks to update state
      wsRef.current.onPlayersUpdate = (playerList) => {
        console.log('Players updated:', playerList);
        setPlayers(playerList.map(p => p.name));
      };
      
      wsRef.current.onPulledTilesUpdate = (tiles) => {
        // Filter out any invalid numbers (like -1 or 0) that might be initialization artifacts
        const validTiles = tiles.filter(num => num > 0 && num <= 75);
        setCalledNumbers(validTiles);
        if (validTiles.length > 0) {
          const latestNumber = validTiles[validTiles.length - 1];
          setCurrentNumber(latestNumber);
          // Assign a random color to the new number if it doesn't have one yet
          setNumberColors(prev => {
            if (!prev[latestNumber]) {
              const randomColorIndex = Math.floor(Math.random() * ballColors.length);
              return {...prev, [latestNumber]: ballColors[randomColorIndex]};
            }
            return prev;
          });
        } else {
          setCurrentNumber(null);
        }
      };
      
      // Set up callback to handle game state updates (including started status)
      wsRef.current.onGameStateUpdate = (gameState) => {
        if (gameState.started) {
          console.log('Game already started, restoring game state');
          setGameStarted(true);
        }
      };

      // When server reports a winner, show the winner popup
      wsRef.current.onWinner = (name: string) => {
        console.log('Received winner from server:', name);
        try {
          setWinnerName(name);
          setShowWinnerPopup(true);
        } catch (err) {
          console.error('Error showing winner popup:', err);
        }
      };
    }, 100); // 100ms delay
    
    return () => {
      console.log('Cleanup: closing WebSocket connection');
      clearTimeout(initTimer);
      wsInitializedRef.current = false; // Reset flag on cleanup
      if (wsRef.current) {
        wsRef.current.shouldReconnect = false;
        wsRef.current.ws?.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Check if the user is authorized to host this game
  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId');
    console.log('Authorization check:', { gameId, storedGameId, actualGameId, match: gameId === storedGameId || actualGameId === storedGameId });
    
    // Allow access if:
    // 1. gameId is "pending" (new game being created)
    // 2. gameId matches stored gameId
    // 3. actualGameId matches stored gameId (after server responds)
    if (gameId === 'pending') {
      setIsAuthorized(true);
    } else if (gameId && gameId !== 'pending') {
      // For any actual game ID, it must match the stored game ID
      if (gameId === storedGameId) {
        setIsAuthorized(true);
      } else {
        console.log('Setting isAuthorized to false - game ID mismatch');
        setIsAuthorized(false);
      }
    } else {
      console.log('Setting isAuthorized to false - no game ID');
      setIsAuthorized(false);
    }
  }, [gameId, actualGameId]);

  console.log('Rendering BingoHostPage, isAuthorized:', isAuthorized);

  // If not authorized, show error message
  if (!isAuthorized) {
    return (
      <>
        <style>{animationStyles}</style>
        <div style={layoutStyle}>
          <div style={backgroundOverlayStyle}></div>
          <div style={cardStyle}>
            <h2 style={titleStyle}>This game is off limits.</h2>
            <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 16, textAlign: 'center' }}>
              You don't have permission to host this game.
            </p>
            <div style={{ textAlign: 'center' }}>
              <Link to="/dashboard">
                <button 
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))";
                    (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))";
                    (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
                  }}
                >
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const onStart = () => {
    // Start the game
    console.log("Start clicked for gameId:", actualGameId);
    setGameStarted(true);
    
    // Send game start message to all players via WebSocket
    if (wsRef.current) {
      wsRef.current.StartGame();
    }
  };

  const callNumber = () => {
    
    setIsSpinning(true);
    const randomColorIndex = Math.floor(Math.random() * ballColors.length); 
    const selectedColor = ballColors[randomColorIndex];
    setBallColor(selectedColor); 

    // Use WebSocket to pull a tile from the server
    if (wsRef.current) {
      wsRef.current.PullTile();
    } else {
      // Fallback to local random generation (for testing without server)
      const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
        .filter(num => !calledNumbers.includes(num));
      
      if (availableNumbers.length === 0) {
        alert("All numbers have been called!");
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const newNumber = availableNumbers[randomIndex];
      
      setCurrentNumber(newNumber);
      setCalledNumbers([...calledNumbers, newNumber]);
      setNumberColors({...numberColors, [newNumber]: selectedColor});
    }
    //will change the ball color randomly 

    setTimeout(() => {
      setIsSpinning(false);
    }, 1200)
  };

  if (gameStarted) {
    return (
      <>
        <WinnerPopup
              show={showWinnerPopup}
              winnerName={winnerName}
              onContinue={() => setShowWinnerPopup(false)}
              onEnd={() => {
                setShowWinnerPopup(false);
                setGameStarted(false);
                setCalledNumbers([]);
                setCurrentNumber(null);
                
                if (wsRef.current) {
                  wsRef.current.sendRaw({ type: "new game", name: wsRef.current.hostName });
                }

                // Clear gameId and set isActive to false
                localStorage.removeItem('gameId');
		            localStorage.setItem('isHostActive', 'false');

                navigate('/dashboard');
              }}
            />
        <style>{animationStyles}</style>
        <div style={layoutStyle}>
          <div style={backgroundOverlayStyle}></div>
          <div style={{...cardStyle, textAlign: 'center'}}>
            <h2 style={titleStyle}>Game ID: {actualGameId}</h2>
          
            {/* Large circle displaying current number */}
            <div style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: ballColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '40px auto',
              boxShadow: `
                0 30px 80px rgba(0,0,0,0.35),
                inset -25px -25px 50px rgba(0, 0, 0, 0.3),
                inset 25px 25px 50px rgba(255, 255, 255, 0.15)
              `,
              animation: isSpinning ? 'spinBall 1.2s ease-in-out' : 'none', 
              transition: 'background 0.3s ease', 
              position: "relative", 
              transform: 'perspective(1000px)', 
              transformStyle: 'preserve-3d',
            }}>

            <div style={{
              position: 'absolute',
              top: '15%',
              left: '15%',
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 70%)',
              pointerEvents: 'none',
              animation: isSpinning ? 'rotateHighlight 1.2s ease-out' : 'none',
            }}></div>
              
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '20%',
              width: '60%',
              height: '40%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
              pointerEvents: 'none',
              filter: 'blur(8px)',
            }}></div>
              
            <div style={{ 
              fontSize: 120, 
              fontWeight: 'bold', 
              color: 'white',
              textShadow: '2px 2px 10px rgba(0,0,0,0.3.)',
              position:'relative', 
              zIndex: 2, 
            }}>
              {currentNumber ?? '—'}
            </div>
          </div>

            {/* Call button */}
            <button
              onClick={callNumber}
              style={{
                ...buttonStyle,
                padding: "20px 60px",
                fontSize: 28,
                marginBottom: 20,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))";
                (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))";
                (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
              }}
            >
              Call
            </button>

            

            {/* Numbers called so far */}
            <div style={{ marginTop: 40 }}>
              <h3 style={{ color: 'white', marginBottom: 20 }}>Called Numbers ({calledNumbers.length}/75)</h3>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 8, 
                justifyContent: 'center',
                maxWidth: 600,
                margin: '0 auto'
              }}>
                {calledNumbers.map(num => (
                  <div key={num} style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: numberColors[num] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'white',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                    boxShadow: `
                      0 4px 12px rgba(0,0,0,0.25),
                      inset -3px -3px 8px rgba(0, 0, 0, 0.2),
                      inset 3px 3px 8px rgba(255, 255, 255, 0.15)
                    `,
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8%',
                      left: '15%',
                      width: '35%',
                      height: '35%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
                      pointerEvents: 'none',
                    }}></div>
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div style={layoutStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Host Game</h2>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            marginBottom: 30,
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            <div style={{ minWidth: 250 }}>
              <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 600, marginBottom: 8 }}>Game ID</div>
              <div style={{
                padding: "14px 18px",
                background: "rgba(255, 255, 255, 0.9)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: 12,
                fontSize: 24,
                fontWeight: 700,
                color: "#374151",
                textAlign: "center",
              }}>
                {actualGameId || "Generating..."}
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
                {actualGameId ? "Share this with players or scan QR" : "Creating your game..."}
              </div>
            </div>

            {actualGameId && (
              <div style={{
                padding: 12,
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: 12,
                border: "2px solid rgba(255, 255, 255, 0.4)",
              }}>
                <QRCode url={hostUrl} size={160} />
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <button
              onClick={onStart}
              disabled={!actualGameId}
              style={{
                ...buttonStyle,
                fontSize: 20,
                padding: "16px 48px",
                opacity: actualGameId ? 1 : 0.6,
                cursor: actualGameId ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (actualGameId) {
                  (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))";
                  (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (actualGameId) {
                  (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))";
                  (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
                }
              }}
            >
              {actualGameId ? "Start!" : "Generating Game..."}
            </button>
          </div>

          <section>
            <h3 style={{ marginBottom: 16, color: '#374151', fontSize: 20 }}>Players</h3>
            <div style={{
              minHeight: 100,
              padding: 20,
              background: "rgba(255, 255, 255, 0.5)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 16,
            }}>
              {players.length === 0 ? (
                <div style={{ color: "#6b7280", fontSize: 16 }}>Waiting for players to join...</div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {players.map((p) => (
                    <li key={p} style={{ 
                      padding: "8px 0", 
                      fontSize: 17,
                      color: '#374151',
                      fontWeight: 500,
                    }}>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BingoHostPage;