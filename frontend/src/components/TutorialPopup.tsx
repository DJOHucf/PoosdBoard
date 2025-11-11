import React, { useEffect, useState } from "react";

type TutorialPage = {
    title?: string;
    // Replace content with your JSX (images, text, etc.). TODO: add picture and text for this page.
    content?: React.ReactNode;
};

type TutorialPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    pages?: TutorialPage[];
    initialPage?: number;
};

export default function TutorialPopup({
    isOpen,
    onClose,
    pages,
    initialPage = 0,
}: TutorialPopupProps) {
    const defaultPages: TutorialPage[] = [
        {
            title: "Welcome",
            content: (
                <div>
                    {/* TODO: Add picture and descriptive text for page 1 */}
                    <p>TODO: Page 1 — brief intro and an illustrative image.</p>
                </div>
            ),
        },
        {
            title: "How to use",
            content: (
                <div>
                    {/* TODO: Add picture and descriptive text for page 2 */}
                    <p>TODO: Page 2 — instructions and screenshots.</p>
                </div>
            ),
        },
        {
            title: "Tips & Tricks",
            content: (
                <div>
                    {/* TODO: Add picture and descriptive text for page 3 */}
                    <p>TODO: Page 3 — helpful tips and final notes.</p>
                </div>
            ),
        },
    ];

    const tutorialPages = pages && pages.length > 0 ? pages : defaultPages;
    const [pageIndex, setPageIndex] = useState<number>(
        Math.min(Math.max(initialPage, 0), tutorialPages.length - 1)
    );

    useEffect(() => {
        setPageIndex(Math.min(Math.max(initialPage, 0), tutorialPages.length - 1));
    }, [initialPage, tutorialPages.length]);

    // prevent background scroll while open
    useEffect(() => {
        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
        return;
    }, [isOpen]);

    // keyboard handling
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" || e.key === "Enter") {
                if (pageIndex < tutorialPages.length - 1) setPageIndex((i) => i + 1);
                else onClose();
            }
            if (e.key === "ArrowLeft") {
                if (pageIndex > 0) setPageIndex((i) => i - 1);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, pageIndex, tutorialPages.length, onClose]);

    if (!isOpen) return null;

    const isFirst = pageIndex === 0;
    const isLast = pageIndex === tutorialPages.length - 1;

    return (
        <div
            aria-modal="true"
            role="dialog"
            aria-label="Tutorial"
            style={overlayStyle}
            onClick={onClose}
        >
            <div
                style={popupStyle}
                onClick={(e) => e.stopPropagation()} // prevent overlay click from closing when clicking inside popup
            >
                <button
                    aria-label="Close tutorial"
                    onClick={onClose}
                    style={closeButtonStyle}
                >
                    ×
                </button>

                <header style={headerStyle}>
                    <h2 style={{ margin: 0 }}>{tutorialPages[pageIndex].title}</h2>
                </header>

                <section style={contentStyle}>
                    {tutorialPages[pageIndex].content}
                </section>

                <footer style={footerStyle}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                            disabled={isFirst}
                            style={buttonStyle}
                        >
                            Back
                        </button>

                        <button
                            onClick={() => {
                                if (!isLast) setPageIndex((i) => i + 1);
                                else onClose();
                            }}
                            style={primaryButtonStyle}
                        >
                            {isLast ? "Done" : "Next"}
                        </button>
                    </div>

                    <div style={dotsStyle}>
                        {tutorialPages.map((_, idx) => (
                            <span
                                key={idx}
                                style={{
                                    ...dotStyle,
                                    opacity: idx === pageIndex ? 1 : 0.35,
                                    transform: idx === pageIndex ? "scale(1.15)" : "scale(1)",
                                }}
                                aria-hidden
                            />
                        ))}
                    </div>
                </footer>
            </div>
        </div>
    );
}

/* ---------- Inline styles (kept here to be self-contained) ---------- */

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
};

const popupStyle: React.CSSProperties = {
    position: "relative",
    width: "min(760px, 95vw)",
    maxHeight: "90vh",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
};

const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: 8,
    right: 8,
    border: "none",
    background: "transparent",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
    padding: "6px 10px",
};

const headerStyle: React.CSSProperties = {
    padding: "20px 24px 0 24px",
    borderBottom: "none",
};

const contentStyle: React.CSSProperties = {
    padding: 24,
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 120,
};

const footerStyle: React.CSSProperties = {
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(0,0,0,0.06)",
};

const buttonStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "#2563eb",
    color: "white",
    border: "none",
};

const dotsStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    alignItems: "center",
};

const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 8,
    background: "#111827",
    transition: "all 150ms ease",
};