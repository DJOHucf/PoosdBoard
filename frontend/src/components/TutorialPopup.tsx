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
            title: "Welcome to POOSDBoard!",
            content: (
                <div style={pageContentStyle}>
                    <img src="tutorial1.png" alt="Illustration" style={imageStyle} />
                    <p style={textStyle}>For the duration of the game, your device has been transformed into your own game board!</p>
                </div>
            ),
        },
        {
            title: "Pay attention!",
            content: (
                <div style={pageContentStyle}>
                    <div style={imageRowStyle}>
                        <img src="tutorial2.png" alt="Illustration" style={smallImageStyle} />
                        <img src="tutorial3.png" alt="Illustration" style={smallImageStyle} />
                    </div>
                    <p style={textStyle}>Numbers will pop up on the host's screen each time a new number is called. If you see that number on your own board, tap it!</p>
                </div>
            ),
        },
        {
            title: "Be the first to win!",
            content: (
                <div style={pageContentStyle}>
                    <div style={imageRowStyle}>
                        <img src="tutorial5.png" alt="Illustration" style={smallImageStyle} />
                        <img src="tutorial4.png" alt="Illustration" style={smallImageStyle} />
                    </div>
                    <p style={textStyle}>When you have 5 marked spaces in a row, drag your finger across them to mark them as a win!</p>
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
        <>
            <style>{`
                @keyframes tutorialGradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .tutorial-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }
                
                .tutorial-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                }
                
                @media (max-width: 640px) {
                    .tutorial-images-row {
                        flex-direction: column;
                        gap: 12px;
                    }
                }
            `}</style>
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
                        <h2 style={titleStyle}>{tutorialPages[pageIndex].title}</h2>
                    </header>

                    <section style={contentStyle}>
                        {tutorialPages[pageIndex].content}
                    </section>

                    <footer style={footerStyle}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <button
                                onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                                disabled={isFirst}
                                style={backButtonStyle}
                                className="tutorial-button"
                            >
                                Back
                            </button>

                            <button
                                onClick={() => {
                                    if (!isLast) setPageIndex((i) => i + 1);
                                    else onClose();
                                }}
                                style={primaryButtonStyle}
                                className="tutorial-button"
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
                                        opacity: idx === pageIndex ? 1 : 0.4,
                                        transform: idx === pageIndex ? "scale(1.3)" : "scale(1)",
                                    }}
                                    aria-hidden
                                />
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

/* ---------- Inline styles ---------- */

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "12px",
};

const popupStyle: React.CSSProperties = {
    position: "relative",
    width: "min(680px, 100%)",
    maxHeight: "90vh",
    background: "linear-gradient(135deg, #5555ff 0%, #aa00ff 50%, #ff0099 100%)",
    backgroundSize: "200% 200%",
    animation: "tutorialGradient 8s ease infinite",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "2px solid rgba(255, 255, 255, 0.3)",
};

const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: 12,
    right: 12,
    border: "none",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    fontSize: 28,
    lineHeight: 1,
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    zIndex: 10,
};

const headerStyle: React.CSSProperties = {
    padding: "24px 24px 16px 24px",
    borderBottom: "none",
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    color: "white",
    fontSize: "clamp(20px, 4vw, 28px)",
    fontWeight: 800,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
};

const contentStyle: React.CSSProperties = {
    padding: "16px 24px 24px 24px",
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 120,
};

const pageContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
};

const imageStyle: React.CSSProperties = {
    maxWidth: "100%",
    height: "auto",
    maxHeight: "clamp(200px, 40vh, 400px)",
    borderRadius: 12,
    objectFit: "contain",
};

const imageRowStyle: React.CSSProperties = {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
};

const smallImageStyle: React.CSSProperties = {
    maxWidth: "45%",
    height: "auto",
    maxHeight: "clamp(150px, 30vh, 300px)",
    borderRadius: 12,
    objectFit: "contain",
    flex: "1 1 auto",
    minWidth: "150px",
};

const textStyle: React.CSSProperties = {
    color: "white",
    fontSize: "clamp(14px, 2.5vw, 18px)",
    lineHeight: 1.6,
    textAlign: "center",
    margin: 0,
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
    fontWeight: 500,
};

const footerStyle: React.CSSProperties = {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.1)",
};

const backButtonStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: 10,
    border: "2px solid rgba(255, 255, 255, 0.5)",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: 600,
    color: "white",
    transition: "all 0.2s ease",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
};

const primaryButtonStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #ffaa00 0%, #ff0099 100%)",
    cursor: "pointer",
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: 700,
    color: "white",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
};

const dotsStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    alignItems: "center",
};

const dotStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: 10,
    background: "white",
    transition: "all 200ms ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};