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
}

/**
 * Single Bingo tile.
 * - color: background color of the tile
 * - text: content to render inside the tile
 * - clickable: when true renders as a button and accepts onClick
 * - selected: visual "marked" state (only visual)
 * - size: pixel width/height (default 100)
 */
const BingoTile: React.FC<BingoTileProps> = ({
    text,
    color = "#fff",
    clickable = false,
    onClick,
    selected = false,
    size = 100,
    className,
    style,
}) => {
    const baseStyle: React.CSSProperties = {
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        color: getContrastingTextColor(color),
        borderRadius: 8,
        boxShadow: selected ? "inset 0 0 0 4px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.08)",
        userSelect: "none",
        padding: 8,
        textAlign: "center",
        fontWeight: 600,
        cursor: clickable ? "pointer" : "default",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        transform: "translateZ(0)",
        ...style,
    };

    const content = <div style={baseStyle}>{text}</div>;

    if (clickable) {
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

/* Utilities */

function getContrastingTextColor(bg: string): string {
    try {
        // Support hex like "#rrggbb" or "#rgb"
        const hex = bg.replace("#", "");
        const normalized =
            hex.length === 3
                ? hex.split("").map((c) => c + c).join("")
                : hex.length === 6
                ? hex
                : null;
        if (!normalized) return "#000";
        const r = parseInt(normalized.slice(0, 2), 16);
        const g = parseInt(normalized.slice(2, 4), 16);
        const b = parseInt(normalized.slice(4, 6), 16);
        // YIQ formula for contrast
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "#000" : "#fff";
    } catch {
        return "#000";
    }
}