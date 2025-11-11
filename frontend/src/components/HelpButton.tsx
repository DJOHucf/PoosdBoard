import React, { useEffect, useRef, useState } from "react";
import TutorialPopup from "./TutorialPopup";

const buttonSize = 40;

export default function HelpButton(): React.ReactElement {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        const onClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [open]);

    const buttonStyle: React.CSSProperties = {
        width: buttonSize,
        height: buttonSize,
        borderRadius: "50%",
        background: "#f2f2f2",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 18,
        fontWeight: 600,
        color: "#333",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        padding: 0,
        lineHeight: 1,
    };

    return (
        <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label="Help"
                title="Help"
                onClick={() => setOpen((v) => !v)}
                style={buttonStyle}
            >
                ?
            </button>

            {open && (
                // The TutorialPopup component should accept an onClose or similar prop.
                // We pass isOpen and onClose to allow the popup to control closing.
                <TutorialPopup isOpen={open} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}