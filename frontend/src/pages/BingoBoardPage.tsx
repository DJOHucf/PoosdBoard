import React, { useState } from "react";
import BingoTile from "../components/BingoTile";
import HelpButton from "../components/HelpButton";
import TutorialPopup from "../components/TutorialPopup";

const BingoBoardPage: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(true);
    const cols = 5;
    const rows = 5; // Changed from 6 since we're removing the tile row

    // Letters to display above columns
    const letters = ["P", "O", "O", "S", "D"];

    const renderBody = () => {
        const bodyTiles = cols * rows;
        return Array.from({ length: bodyTiles }).map((_, i) => (
            <BingoTile
                key={`body-${i}`}
                text="1"
                color="#f0f0f0"
                clickable={true}
                onClick={() => {
                    console.log("tile clicked", i);
                }}
            />
        ));
    };

    return (
        <div style={{ padding: 16, maxWidth: 800, margin: "0 auto", position: "relative" }}>
            <div style={{ position: "fixed", top: 24, right: 40, zIndex: 1000}}>
                <HelpButton />
            </div>
            {/* Letter headers */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: 8,
                    marginBottom: 16,
                    textAlign: "center",
                }}
            >
                {letters.map((letter, i) => (
                    <div
                        key={`letter-${i}`}
                        style={{
                            fontSize: 48,
                            fontWeight: 'bold',
                            color: '#e53935',
                            userSelect: 'none',
                        }}
                    >
                        {letter}
                    </div>
                ))}
            </div>

            {/* Bingo grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: 8,
                }}
            >
                {renderBody()}
            </div>
            <TutorialPopup isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
            
        </div>
    );
};

export default BingoBoardPage;