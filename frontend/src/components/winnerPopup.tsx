import { useEffect, useRef } from "react";

type WinnerPopupProps = {
    winnerName: string;
    show: boolean;
    onContinue: () => void;
    onEnd: () => void;
};

export default function WinnerPopup({
    winnerName,
    show,
    onContinue,
    onEnd,
}: WinnerPopupProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fallingContainerRef = useRef<HTMLDivElement | null>(null);
    const explosionTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!show) {
            cleanupAll();
            return;
        }

        // Start explosion first
        createExplosion(35);

        // After explosion, show overlay dim and start falling confetti
        explosionTimeoutRef.current = window.setTimeout(() => {
            startFallingConfetti(40);
        }, 800); // matches explosion animation duration

        return () => {
            cleanupAll();
            if (explosionTimeoutRef.current) {
                window.clearTimeout(explosionTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    function cleanupAll() {
        const c = containerRef.current;
        if (c) {
            // remove all dynamic confetti children
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
        // center point near popup center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2 - 20;

        for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            el.className = "confetti-piece confetti-explode";
            // random color
            el.style.background = randomColor();
            // set starting position at center
            el.style.left = `${centerX}px`;
            el.style.top = `${centerY}px`;

            // compute random target vector
            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * 220;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist * 0.6 - Math.random() * 60; // bias upwards a bit
            el.style.setProperty("--tx", `${tx}px`);
            el.style.setProperty("--ty", `${ty}px`);
            el.style.setProperty("--rot", `${Math.floor(Math.random() * 720)}deg`);
            el.style.opacity = "1";
            container.appendChild(el);

            // remove after animation
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
            // random horizontal position
            el.style.left = `${Math.random() * 100}%`;
            // set size
            const w = 6 + Math.random() * 10;
            const h = 8 + Math.random() * 16;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            // random delay and duration
            const delay = Math.random() * 3000;
            const dur = 3000 + Math.random() * 4000;
            el.style.animationDelay = `${delay}ms`;
            el.style.animationDuration = `${dur}ms`;
            // random horizontal sway via CSS variable
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
        <div ref={containerRef} className="winner-overlay" aria-modal="true" role="dialog">
            {/* falling confetti layer (visible after explosion) */}
            <div ref={fallingContainerRef} className="falling-confetti" />

            <div className="popup">
                <div className="title">{winnerName} got POOSD!</div>
                <div className="actions">
                    <button className="btn continue" onClick={onContinue}>
                        Continue game
                    </button>
                    <button className="btn end" onClick={onEnd}>
                        End game
                    </button>
                </div>
            </div>

            <style>{`
                .winner-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: auto;
                    z-index: 9999;
                }

                /* initial transparent until explosion finishes, then dim */
                .winner-overlay::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0); /* switched to dim by adding class via JS? We'll transition */
                    transition: background 400ms ease;
                }

                /* We manually toggle dim by starting falling confetti; use CSS to make overlay dim when falling exists */
                .falling-confetti + .popup ~ .winner-overlay {}

                .falling-confetti {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 9999;
                }

                /* dim the background once falling confetti elements added */
                .winner-overlay .falling-confetti:empty ~ .popup ~ .dummy {
                }
                /* Instead of complex sibling selectors, just force dim by setting background on overlay when show —
                     we do a CSS trick: always dim but keep popup area visually distinct via backdrop-like blur. */
                .winner-overlay::before {
                    background: rgba(0,0,0,0.55);
                }

                .popup {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(180deg, #fff 0%, #f7f9fb 100%);
                    border-radius: 12px;
                    padding: 32px 28px;
                    min-width: 320px;
                    max-width: 90%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
                    text-align: center;
                    z-index: 10000;
                }

                .title {
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: 0.02em;
                    margin-bottom: 8px;
                    color: #0b2545;
                }

                .subtitle {
                    font-size: 16px;
                    color: #334e68;
                    margin-bottom: 20px;
                }

                .actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .btn {
                    padding: 10px 16px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    min-width: 140px;
                }

                .btn.continue {
                    background: #00D1B2;
                    color: #05323a;
                }

                .btn.end {
                    background: #FF3860;
                    color: #fff;
                }

                /* confetti base */
                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 14px;
                    border-radius: 2px;
                    z-index: 10001;
                    pointer-events: none;
                    transform-origin: center;
                }

                /* explosion animation — uses CSS variables set inline for target offset */
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

                /* ensure modal stays above confetti */
                .popup {
                    transform: translate(-50%, -50%) translateZ(0);
                }

                @media (max-width: 420px) {
                    .title { font-size: 22px; }
                    .btn { min-width: 120px; padding: 8px 12px; }
                }
            `}</style>
        </div>
    );
}