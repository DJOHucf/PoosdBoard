import React from "react";

export interface BingoTileProps {
    text?: React.ReactNode;
    color?: string;
    clickable?: boolean;
    onClick?: () => void;
    selected?: boolean;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    state?: "default" | "correct" | "incorrect" | "winning" | "title" | "center";
    onIncorrectComplete?: () => void;
}

const BingoTile: React.FC<BingoTileProps> = ({
    text,
    color = "#fff",
    clickable = false,
    onClick,
    selected = false,
    size = 100,
    className,
    style,
    state = "default",
    onIncorrectComplete,
}) => {
    const [isShaking, setIsShaking] = React.useState(false);

    React.useEffect(() => {
        if (state === "incorrect") {
            setIsShaking(true);
            const timer = setTimeout(() => {
                setIsShaking(false);
                if (onIncorrectComplete) {
                    onIncorrectComplete();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [state, onIncorrectComplete]);

    // Determine the background color based on state with glassmorphism
    const getBackgroundColor = () => {
        if (state === "incorrect") return "rgba(248, 113, 113, 0.85)"; // red with transparency
        if (state === "correct" || state === "center") return "rgba(134, 239, 172, 0.85)"; // green with transparency
        if (state === "winning") return "rgba(34, 197, 94, 0.9)"; // bright green
        if (state === "title") return "transparent";
        // Default: white glass
        return "rgba(255, 255, 255, 0.7)";
    };
    
    const getBackgroundImage = () => {
        if (state === "title") {
            // Use the color prop as-is since it will be passed as a gradient
            return color;
        }
        return undefined;
    };

    const getStateStyles = (): React.CSSProperties => {
        const stateStyles: React.CSSProperties = {};
        
        if (state === "winning") {
            stateStyles.boxShadow = "0 0 20px 4px rgba(34, 197, 94, 0.6), 0 0 40px 8px rgba(34, 197, 94, 0.3)";
            stateStyles.animation = "radialShine 2s ease-in-out infinite";
            stateStyles.backdropFilter = "blur(8px) saturate(150%)";
        } else if (state === "title") {
            stateStyles.fontSize = "clamp(24px, 8vw, 48px)";
            stateStyles.fontWeight = 700;
            stateStyles.animation = "gradientCycle 12s ease-in-out infinite";
            stateStyles.cursor = "default";
            stateStyles.backgroundSize = "200% 200%";
        } else if (state === "center") {
            stateStyles.fontSize = "clamp(32px, 6vw, 48px)";
            stateStyles.fontWeight = 700;
            stateStyles.backdropFilter = "blur(10px) saturate(180%)";
        } else if (state === "correct") {
            stateStyles.backdropFilter = "blur(10px) saturate(180%)";
        } else if (state === "incorrect") {
            stateStyles.backdropFilter = "blur(8px) saturate(150%)";
        } else if (selected) {
            stateStyles.boxShadow = "inset 0 0 0 3px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.12)";
            stateStyles.backdropFilter = "blur(10px) saturate(180%)";
        } else {
            // Default glass effect
            stateStyles.boxShadow = "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)";
            stateStyles.backdropFilter = "blur(10px) saturate(180%)";
        }

        return stateStyles;
    };

    const baseStyle: React.CSSProperties = {
        width: size,
        height: size,
        maxWidth: size,
        maxHeight: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getBackgroundColor(),
        backgroundImage: getBackgroundImage(),
        color: state === "title" ? "#fff" : (state === "incorrect" || state === "winning" || state === "correct" || state === "center") ? "#fff" : "#1f2937",
        borderRadius: 12,
        border: state === "default" ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.5)",
        userSelect: "none",
        padding: 8,
        textAlign: "center",
        fontWeight: 600,
        fontSize: "clamp(14px, 3vw, 20px)",
        cursor: (clickable && state !== "title") ? "pointer" : "default",
        transition: "all 200ms ease",
        transform: "translateZ(0)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box", 
        ...getStateStyles(),
        ...style,
    };

    const content = (
        <>
            <div style={baseStyle} className={isShaking ? "shake" : ""}>
                {state === "center" ? "★" : text}
                {(state === "correct" || state === "center") && (
                    <div className="stamp-circle"></div>
                )}
                {state === "winning" && (
                    <div className="sparkles">
                        <span className="sparkle" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>✨</span>
                        <span className="sparkle" style={{ top: '15%', right: '15%', animationDelay: '0.3s' }}>✨</span>
                        <span className="sparkle" style={{ bottom: '10%', left: '15%', animationDelay: '0.6s' }}>✨</span>
                        <span className="sparkle" style={{ bottom: '15%', right: '10%', animationDelay: '0.9s' }}>✨</span>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }

                @keyframes radialShine {
                    0%, 100% {
                        filter: brightness(1);
                    }
                    50% {
                        filter: brightness(1.2);
                    }
                }

                @keyframes gradientCycle {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes sparkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2) rotate(180deg);
                    }
                }

                .shake {
                    animation: shake 0.5s ease-in-out;
                }

                .stamp-circle {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 70%;
                    height: 70%;
                    border: 4px solid #4ade80;
                    border-radius: 50%;
                    pointer-events: none;
                    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
                    animation: stampAppear 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                }

                @keyframes stampAppear {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }

                .sparkles {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .sparkle {
                    position: absolute;
                    font-size: 20px;
                    animation: sparkle 1.5s ease-in-out infinite;
                    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
                }
            `}</style>
        </>
    );

    if (clickable && state !== "title") {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-pressed={selected}
                className={className}
                style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    display: "inline-flex",
                    cursor: "pointer",
                    outline: "none",
                }}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={className} style={{ display: "inline-flex" }}>
            {content}
        </div>
    );
};

export default BingoTile;