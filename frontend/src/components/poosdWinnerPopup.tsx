import { useEffect, useRef, useState } from "react";

type PoosdWinnerPopupProps = {
    show: boolean;
    onComplete?: () => void;
    duration?: number; // milliseconds to show the popup (default 3000)
};

export default function PoosdWinnerPopup({
    show,
    onComplete,
    duration = 3000,
}: PoosdWinnerPopupProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fallingContainerRef = useRef<HTMLDivElement | null>(null);
    const explosionTimeoutRef = useRef<number | null>(null);
    const autoCloseTimeoutRef = useRef<number | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!show) {
            cleanupAll();
            setIsClosing(false);
            return;
        }

        // Start explosion first
        createExplosion(40);

        // After explosion, start falling confetti
        explosionTimeoutRef.current = window.setTimeout(() => {
            startFallingConfetti(50);
        }, 400);

        // Start closing animation before actual close
        autoCloseTimeoutRef.current = window.setTimeout(() => {
            setIsClosing(true);
            // Wait for closing animation to finish, then call onComplete
            setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 1000); // 500ms delay + 500ms fadeOut animation
        }, duration - 500);

        return () => {
            cleanupAll();
            if (explosionTimeoutRef.current) {
                window.clearTimeout(explosionTimeoutRef.current);
            }
            if (autoCloseTimeoutRef.current) {
                window.clearTimeout(autoCloseTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    function cleanupAll() {
        const c = containerRef.current;
        if (c) {
            const expl = c.querySelectorAll(".confetti-piece");
            expl.forEach((n) => n.remove());
        }
        const fallC = fallingContainerRef.current;
        if (fallC) {
            fallC.innerHTML = "";
        }
    }

    function createExplosion(count: number) {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            el.className = "confetti-piece confetti-explode";
            el.style.background = randomColor();
            el.style.left = `${centerX}px`;
            el.style.top = `${centerY}px`;

            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 250;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist * 0.6 - Math.random() * 80;
            el.style.setProperty("--tx", `${tx}px`);
            el.style.setProperty("--ty", `${ty}px`);
            el.style.setProperty("--rot", `${Math.floor(Math.random() * 720)}deg`);
            el.style.opacity = "1";
            container.appendChild(el);

            setTimeout(() => {
                el.remove();
            }, 900);
        }
    }

    function startFallingConfetti(count: number) {
        const fallContainer = fallingContainerRef.current;
        if (!fallContainer) return;
        fallContainer.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            el.className = "confetti-piece confetti-fall";
            el.style.background = randomColor();
            el.style.left = `${Math.random() * 100}%`;
            const w = 6 + Math.random() * 10;
            const h = 8 + Math.random() * 16;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            const delay = Math.random() * 3000;
            const dur = 3000 + Math.random() * 4000;
            el.style.animationDelay = `${delay}ms`;
            el.style.animationDuration = `${dur}ms`;
            el.style.setProperty("--sway", `${20 + Math.random() * 60}px`);
            el.style.setProperty("--rotStart", `${Math.floor(Math.random() * 360)}deg`);
            el.style.setProperty("--rotEnd", `${Math.floor(Math.random() * 720) + 360}deg`);
            fallContainer.appendChild(el);
        }
    }

    function randomColor() {
        const colors = ["#FF3860", "#FFCD00", "#00D1B2", "#3273DC", "#7C4DFF", "#FF7BAC"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    if (!show) return null;

    return (
        <div ref={containerRef} className={`poosd-overlay ${isClosing ? 'closing' : ''}`} aria-modal="true" role="dialog">
            {/* falling confetti layer */}
            <div ref={fallingContainerRef} className={`falling-confetti ${isClosing ? 'closing' : ''}`} />

            {/* POOSD image popup */}
            <div className={`poosd-popup ${isClosing ? 'closing' : ''}`}>
                <img src="poosd.png" alt="POOSD!" className="poosd-image" />
            </div>

            <style>{`
                .poosd-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: auto;
                    z-index: 9999;
                    animation: fadeIn 400ms ease forwards;
                }

                @keyframes fadeIn {
                    from {
                        background: rgba(0,0,0,0);
                    }
                    to {
                        background: rgba(0,0,0,0.6);
                    }
                }

                @keyframes fadeOut {
                    from {
                        background: rgba(0,0,0,0.6);
                    }
                    to {
                        background: rgba(0,0,0,0);
                    }
                }

                .poosd-overlay.closing {
                    background: rgba(0,0,0,0.6);
                    animation: fadeOut 500ms ease forwards;
                    animation-delay: 500ms;
                }

                .falling-confetti {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 1;
                    transition: opacity 500ms ease;
                    transition-delay: 500ms;
                }

                .falling-confetti.closing {
                    opacity: 0;
                }

                .poosd-popup {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10000;
                    animation: popIn 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                }

                @keyframes popIn {
                    0% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }

                @keyframes popOut {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0;
                    }
                }

                .poosd-popup.closing {
                    animation: popOut 500ms cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
                }

                .poosd-image {
                    max-width: 90vw;
                    max-height: 90vh;
                    width: auto;
                    height: auto;
                    display: block;
                    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                /* confetti base */
                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 14px;
                    border-radius: 2px;
                    z-index: 9998;
                    pointer-events: none;
                    transform-origin: center;
                }

                /* explosion animation */
                @keyframes explode {
                    0% {
                        opacity: 1;
                        transform: translate(0,0) rotate(0deg) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(var(--tx, 0px), var(--ty, 0px)) rotate(var(--rot, 360deg)) scale(0.8);
                    }
                }
                .confetti-explode {
                    width: 9px;
                    height: 12px;
                    animation: explode 800ms cubic-bezier(.2,.9,.2,1) forwards;
                    animation-delay: 100ms;
                    opacity: 0;
                }

                /* falling animation */
                @keyframes fall {
                    0% {
                        transform: translateY(-10vh) translateX(0) rotate(var(--rotStart, 0deg));
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) translateX(var(--sway, 40px)) rotate(var(--rotEnd, 360deg));
                        opacity: 0.95;
                    }
                }
                .confetti-fall {
                    top: -20vh;
                    width: 8px;
                    height: 12px;
                    opacity: 0.95;
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @media (max-width: 768px) {
                    .poosd-image {
                        max-width: 80vw;
                        max-height: 80vh;
                    }
                }
            `}</style>
        </div>
    );
}
