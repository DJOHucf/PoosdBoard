import React, { useState, useRef, useEffect } from "react";
import BingoTile from "../components/BingoTile";
import HelpButton from "../components/HelpButton";
import TutorialPopup from "../components/TutorialPopup";
import PoosdWinnerPopup from "../components/poosdWinnerPopup";
import GameEndedPopup from "../components/gameEndedPopup";
import { BingoWebsocketPlayer } from "../components/Websockets";

const BingoBoardPage: React.FC = () => {
	const gamePIN = localStorage.getItem('gamePIN');
	if (!gamePIN) {
		window.location.href = '/play';
		return null;
	}

    const [showTutorial, setShowTutorial] = useState(true);
    const [showPoosd, setShowPoosd] = useState(false);
    const [showGameEnded, setShowGameEnded] = useState(false);
    const [tileStates, setTileStates] = useState<Record<number, "default" | "correct" | "incorrect" | "winning" | "title" | "center">>({});

    // Debug: Log when showGameEnded changes
    useEffect(() => {
        console.log("🎮 showGameEnded state changed to:", showGameEnded);
    }, [showGameEnded]);
    const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
    const [boardNumbers, setBoardNumbers] = useState<number[]>([]);
    const [selectedTiles, setSelectedTiles] = useState<Set<number>>(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [tileSize, setTileSize] = useState(70);
    const cols = 5;
    const rows = 5;

    // gradients
    const swipeGradients = [
        'linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)', 
        'linear-gradient(135deg, #ffaa00 0%, #ff0099 100%)', 
        'linear-gradient(135deg, #ff0000 0%, #ff1493 100%)', 
        'linear-gradient(135deg, #00d4aa 0%, #0099ff 100%)', 
        'linear-gradient(135deg, #ff006e 0%, #8b00ff 100%)', 
        'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)', 
        'linear-gradient(135deg, #ff4500 0%, #ffd700 100%)', 
        'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
    ];

    //calculates responsive tile size
    useEffect(() => {
        const calculateTileSize = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            //more conservative padding calculation
            const containerPadding = 16; 
            const gridGap = viewportWidth < 640 ? 12 : 8; // Larger gap for mobile
            const totalGapWidth = gridGap * (cols - 1);
            const totalGapHeight = gridGap * (rows - 1);
            
            //account for UI elements
            const headerHeight = 64;
            const titleRowApproxHeight = 70; // Title tiles + gap
            const instructionsHeight = 80;
            const verticalSpacing = 20;
            const verticalReserved = headerHeight + titleRowApproxHeight + instructionsHeight + verticalSpacing;
            
            //calculates max tile size - be more conservative with width
            const availableWidth = viewportWidth - (containerPadding * 2);
            const availableHeight = viewportHeight - verticalReserved;
            
            const maxWidthPerTile = (availableWidth - totalGapWidth) / cols;
            const maxHeightPerTile = (availableHeight - totalGapHeight) / rows;
            
            //uses smaller dimension with tight bounds
            const calculatedSize = Math.floor(Math.min(maxWidthPerTile, maxHeightPerTile));
            const size = Math.max(Math.min(calculatedSize, 85), 55); 
            
            return size;
        };
        
        const updateSize = () => {
            const newSize = calculateTileSize();
            setTileSize(newSize);
        };
        
        // Initial calculation
        updateSize();
        
        // Recalculate on window resize
        window.addEventListener('resize', updateSize);
        window.addEventListener('orientationchange', updateSize);
        
        return () => {
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('orientationchange', updateSize);
        };
    }, []);

    // WebSocket connection for player
    const wsRef = useRef<BingoWebsocketPlayer | null>(null);

    // Initialize WebSocket connection
    useEffect(() => {
        // Get player name and game PIN from localStorage
        const playerName = localStorage.getItem('playerName') || 'Player';
        const gameString = localStorage.getItem('gamePIN') || '';
        
        if (!gameString) {
            console.warn('No game PIN found in localStorage');
            return;
        }
        
        // Create WebSocket connection
        wsRef.current = new BingoWebsocketPlayer(playerName, gameString);
        
        // Set up callback to update called numbers
        wsRef.current.onCalledNumbersUpdate = (numbers: number[]) => {
            setCalledNumbers(numbers);
        };
        
        // Set up callback to receive the board when joining is successful
        wsRef.current.onJoinSuccess = () => {
            if (wsRef.current?.board) {
                // Extract the numbers from the board tiles
                const numbers = wsRef.current.board.array.map((tile: any) => tile.value);
                setBoardNumbers(numbers);
                
                // Restore marked tiles state from the board
                const restoredStates: Record<number, "default" | "correct" | "incorrect" | "winning" | "title" | "center"> = {};
                wsRef.current.board.array.forEach((tile: any, index: number) => {
                    if (tile.value === -1) {
                        // Center tile is always in "center" state
                        restoredStates[index] = "center";
                    } else if (tile.marked) {
                        restoredStates[index] = "correct";
                    }
                });
                setTileStates(restoredStates);
            }
        };
        
        // Set up error handler to redirect on game not found
        wsRef.current.onError = (error: string) => {
            console.error('WebSocket error:', error);
            if (error.includes('game not found') || error.includes('invalid game')) {
                // Redirect back to play page if game doesn't exist
                window.location.href = '/play';
            } else {
                // Show alert for other errors
                alert("Error: " + error);
            }
        };
        
        // Set up callback for when game ends
        wsRef.current.onGameEnded = () => {
            console.log("🎮 onGameEnded callback triggered in BingoBoardPage!");
            console.log("🎮 Setting showGameEnded to true...");
            setShowGameEnded(true);
            console.log("🎮 showGameEnded state updated");
        };
        
        console.log("✅ WebSocket callbacks registered, including onGameEnded");
        
        return () => {
            if (wsRef.current) {
                wsRef.current.shouldReconnect = false;
                wsRef.current.ws?.close();
            }
        };
    }, []);

    // Check if selected tiles form a valid bingo
    const checkBingo = (tiles: Set<number>): boolean => {
        if (tiles.size !== 5) return false;
        
        // Check rows
        for (let row = 0; row < rows; row++) {
            const rowTiles = Array.from({ length: cols }, (_, i) => row * cols + i);
            if (rowTiles.every(tile => tiles.has(tile))) {
                return true;
            }
        }
        
        // Check columns
        for (let col = 0; col < cols; col++) {
            const colTiles = Array.from({ length: rows }, (_, i) => i * cols + col);
            if (colTiles.every(tile => tiles.has(tile))) {
                return true;
            }
        }
        
        // Check diagonal (top-left to bottom-right)
        const diag1 = Array.from({ length: cols }, (_, i) => i * cols + i);
        if (diag1.every(tile => tiles.has(tile))) {
            return true;
        }
        
        // Check diagonal (top-right to bottom-left)
        const diag2 = Array.from({ length: cols }, (_, i) => i * cols + (cols - 1 - i));
        if (diag2.every(tile => tiles.has(tile))) {
            return true;
        }
        
        return false;
    };

    // Handle drag/swipe to select tiles
    const handleTileEnter = (index: number) => {
        if (isDragging && (tileStates[index] === "correct" || tileStates[index] === "center")) {
            setSelectedTiles(prev => new Set([...prev, index]));
        }
    };

    const handleDragStart = (index: number, event?: React.MouseEvent | React.TouchEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (tileStates[index] === "correct" || tileStates[index] === "center") {
            setIsDragging(true);
            setSelectedTiles(new Set([index]));
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element) {
            const tileDiv = element.closest('[data-tile-index]');
            if (tileDiv) {
                const tileIndex = tileDiv.getAttribute('data-tile-index');
                if (tileIndex !== null) {
                    const index = parseInt(tileIndex);
                    if (tileStates[index] === "correct" || tileStates[index] === "center") {
                        setSelectedTiles(prev => new Set([...prev, index]));
                    }
                }
            }
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        // Check if the selected tiles form a bingo
        if (checkBingo(selectedTiles)) {
            
            // Mark winning tiles
            setTileStates(prev => {
                const newStates = { ...prev };
                selectedTiles.forEach(tile => {
                    newStates[tile] = "winning";
                });
                return newStates;
            });
            
            // Show winner popup
            setShowPoosd(true);
            
            // Send bingo to server
            if (wsRef.current) {
                const tilesArray = Array.from(selectedTiles);
                wsRef.current.checkBingo(tilesArray);
            }

        }
        
        // Clear selection
        setSelectedTiles(new Set());
    };

    // Letters to display above columns
    const letters = ["P", "O", "O", "S", "D"];
    
    // Gradient colors for title tiles
    const titleGradients = [
        'linear-gradient(135deg, #5555ff 0%, #aa00ff 100%)', 
        'linear-gradient(135deg, #ffaa00 0%, #ff0099 100%)', 
        'linear-gradient(135deg, #ff0000 0%, #ff1493 100%)', 
        'linear-gradient(135deg, #00d4aa 0%, #0099ff 100%)', 
        'linear-gradient(135deg, #ff006e 0%, #8b00ff 100%)',
    ];

    const animationStyles = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes swipePulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
        }
    `;

    const renderBody = () => {
        const bodyTiles = cols * rows;
        
        return Array.from({ length: bodyTiles }).map((_, i) => {
            const tileNumber = boardNumbers.length > 0 ? boardNumbers[i] : '?';
            const displayText = tileNumber === -1 ? 'FREE' : String(tileNumber);
            
            // Get gradient for this tile when swiping
            const getSwipeGradient = () => {
                if (selectedTiles.has(i) && isDragging) {
                    const selectedArray = Array.from(selectedTiles).sort((a, b) => a - b);
                    const position = selectedArray.indexOf(i);
                    return swipeGradients[position % swipeGradients.length];
                }
                return null;
            };
            
            const swipeGradient = getSwipeGradient();
            
            // Determine the state for this tile
            const getTileState = () => {
                if (tileNumber === -1) return "center";
                if (selectedTiles.has(i) && isDragging) return "winning";
                return tileStates[i] || "default";
            };
            
            return (
                <div
                    key={`body-${i}`}
                    onMouseDown={(e) => handleDragStart(i, e)}
                    onMouseUp={handleDragEnd}
                    onMouseEnter={() => handleTileEnter(i)}
                    onTouchStart={(e) => handleDragStart(i, e)}
                    onTouchEnd={handleDragEnd}
                    onTouchMove={handleTouchMove}
                    data-tile-index={i}
                    style={{ 
                        touchAction: 'none',
                        position: 'relative',
                    }}
                >
                    {swipeGradient && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: swipeGradient,
                            borderRadius: 12,
                            animation: 'swipePulse 0.6s ease-in-out infinite',
                            zIndex: 1,
                            pointerEvents: 'none',
                        }} />
                    )}
                    <BingoTile
                        text={displayText}
                        color="#f0f0f0"
                        clickable={true}
                        state={getTileState()}
                        size={tileSize}
                        onClick={() => {
                            
                            if (tileStates[i] === "correct" || tileStates[i] === "center") {
                                return;
                            }
                            
                            if (tileNumber === -1) {
                                setTileStates(prev => ({ ...prev, [i]: "center" }));
                                if (wsRef.current) {
                                    wsRef.current.markCell(i);
                                }
                                return;
                            }
                            
                            if (!calledNumbers.includes(tileNumber as number)) {
                                setTileStates(prev => ({ ...prev, [i]: "incorrect" }));
                            } else {
                                setTileStates(prev => ({ ...prev, [i]: "correct" }));
                                
                                if (wsRef.current) {
                                    wsRef.current.markCell(i);
                                }
                            }
                        }}
                        onIncorrectComplete={() => {
                            setTileStates(prev => {
                                const newStates = { ...prev };
                                delete newStates[i];
                                return newStates;
                            });
                        }}
                    />
                </div>
            );
        });
    };

    return (
        <>
            <style>{animationStyles}</style>
            <div style={{ 
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                overflow: "hidden",
                overscrollBehavior: "none",
            }}>
                {/* Background overlay */}
                <div style={{
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
                    pointerEvents: "none",
                }}></div>

                {/* Content container */}
                <div style={{ 
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    padding: "8px",
                    paddingTop: "64px",
                    paddingBottom: "12px",
                    position: "relative",
                    zIndex: 10,
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}>
                    {/* Game PIN display - Glassmorphism */}
                    <div style={{ 
                        position: "fixed", 
                        top: 12, 
                        left: 12, 
                        zIndex: 1000,
                        backdropFilter: "blur(12px) saturate(180%)",
                        background: "rgba(255, 255, 255, 0.75)",
                        padding: '8px 14px',
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#1f2937',
                    }}>
                        PIN: {gamePIN}
                    </div>
                    
                    {/* Help button - Glassmorphism */}
                    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 1000}}>
                        <HelpButton />
                    </div>
                    
                    {/* Main content wrapper */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        gap: "12px",
                        minHeight: 0,
                    }}>
                        {/* POOSD Title using BingoTiles */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                gap: window.innerWidth < 640 ? "12px" : "8px",
                                width: "100%",
                                maxWidth: "480px",
                                margin: "0 auto",
                                boxSizing: "border-box",
                            }}
                        >
                            {letters.map((letter, i) => {
                                return (
                                    <BingoTile
                                        key={`title-${i}`}
                                        text={letter}
                                        color={titleGradients[i]}
                                        state="title"
                                        size={tileSize}
                                    />
                                );
                            })}
                        </div>

                        {/* Bingo grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                gap: window.innerWidth < 640 ? "8px" : "6px",
                                width: "100%",
                                maxWidth: "480px",
                                margin: "0 auto",
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                touchAction: "none",
                                boxSizing: "border-box",
                            }}
                        >
                            {renderBody()}
                        </div>
                    </div>

                    {/* Instructions - Glassmorphism */}
                    <div style={{
                        padding: 12,
                        backdropFilter: "blur(12px) saturate(180%)",
                        background: "rgba(255, 255, 255, 0.75)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        borderRadius: 14,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        textAlign: "center",
                        flexShrink: 0,
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>
                            Got BINGO?
                        </div>
                        <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.4 }}>
                            Tap tiles to mark, then swipe across your winning line!
                        </div>
                    </div>
                </div>

                <TutorialPopup isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
                <PoosdWinnerPopup 
                    show={showPoosd} 
                    duration={3000}
                    onComplete={() => {
                        setShowPoosd(false);
                    }}
                />
                <GameEndedPopup show={showGameEnded} />
            </div>
        </>
    );
};

export default BingoBoardPage;