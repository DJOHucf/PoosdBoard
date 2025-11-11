import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import WinnerPopup from "../components/winnerPopup";

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
  const hostUrl = `https://poosdboard.com/play/${gameId ?? ""}`;

  // space for players' names to pop up as they join
  const [players, setPlayers] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [showWinnerPopup, setShowWinnerPopup] = useState<boolean>(false);
  const [winnerName] = useState<string>("Test Winner");

  // Check if the user is authorized to host this game
  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId');
    console.log('Authorization check:', { gameId, storedGameId, match: gameId === storedGameId });
    
    if (!gameId || gameId !== storedGameId) {
      // User is not authorized to host this game
      console.log('Setting isAuthorized to false');
      setIsAuthorized(false);
    }
  }, [gameId, navigate]);

  // Example: placeholder effect to simulate players joining (remove in production)
  useEffect(() => {
    // This simulates players joining every 2s for demo purposes
    if (!gameId) return;
    const demoNames = ["Alice", "Bob", "Charlie", "Dana"];
    let i = 0;
    const t = setInterval(() => {
      if (i >= demoNames.length) {
        clearInterval(t);
        return;
      }
      setPlayers((p) => {
        if (p.includes(demoNames[i])) return p;
        return [...p, demoNames[i]];
      });
      i++;
    }, 2000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  console.log('Rendering BingoHostPage, isAuthorized:', isAuthorized);

  // If not authorized, show error message
  if (!isAuthorized) {
    console.log('Showing unauthorized message');
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <h2>This game is off limits.</h2>
        <Link to="/dashboard">
          <button style={{
            padding: "12px 24px",
            fontSize: 16,
            background: "#0b84ff",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}>
            Go back
          </button>
        </Link>
      </div>
    );
  }

  const onStart = () => {
    // Start the game
    console.log("Start clicked for gameId:", gameId);
    setGameStarted(true);
  };

  const callNumber = () => {
    // Generate a random number from 1-75 that hasn't been called yet
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
  };

  // If game has started, show the calling interface
  if (gameStarted) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Game ID: {gameId}</h2>
        
        {/* Large circle displaying current number */}
        <div style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '40px auto',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
        }}>
          <div style={{ fontSize: 120, fontWeight: 'bold', color: 'white' }}>
            {currentNumber ?? '—'}
          </div>
        </div>

        {/* Call button */}
        <button
          onClick={callNumber}
          style={{
            padding: "20px 60px",
            fontSize: 28,
            fontWeight: 700,
            background: "#0b84ff",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            marginBottom: 20,
            marginRight: 12,
          }}
        >
          Call
        </button>

        {/* Test Winner Popup button */}
        <button
          onClick={() => setShowWinnerPopup(true)}
          style={{
            padding: "20px 40px",
            fontSize: 20,
            fontWeight: 700,
            background: "#7C4DFF",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          Test Winner
        </button>

        {/* Winner Popup */}
        <WinnerPopup
          show={showWinnerPopup}
          winnerName={winnerName}
          onContinue={() => {
            console.log("Continue clicked");
            setShowWinnerPopup(false);
          }}
          onEnd={() => {
            console.log("End game clicked");
            setShowWinnerPopup(false);
            setGameStarted(false);
            setCalledNumbers([]);
            setCurrentNumber(null);
            navigate("/dashboard");
          }}
        />

        {/* Numbers called so far */}
        <div style={{ marginTop: 40 }}>
          <h3>Called Numbers ({calledNumbers.length}/75)</h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 8, 
            justifyContent: 'center',
            maxWidth: 600,
            margin: '0 auto'
          }}>
            {calledNumbers.sort((a, b) => a - b).map(num => (
              <div key={num} style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 600,
              }}>
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h2 style={{ marginTop: 0 }}>Host Game</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 200 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Game ID</div>
          <div
            style={{
              marginTop: 6,
              padding: "10px 12px",
              background: "#f5f5f5",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              wordBreak: "break-all",
            }}
          >
            {gameId ?? "—"}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            Share this with players or have them scan the QR.
          </div>
        </div>

        <div>
          <QRCode url={hostUrl} size={160} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onStart}
          style={{
            display: "inline-block",
            padding: "14px 28px",
            fontSize: 20,
            fontWeight: 700,
            background: "#0b84ff",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Start!
        </button>
      </div>

      <section>
        <h3 style={{ marginBottom: 8 }}>Players</h3>
        <div
          style={{
            minHeight: 80,
            padding: 12,
            background: "#fafafa",
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          {players.length === 0 ? (
            <div style={{ color: "#888" }}>Waiting for players to join...</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {players.map((p) => (
                <li key={p} style={{ padding: "6px 0", fontSize: 16 }}>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default BingoHostPage;