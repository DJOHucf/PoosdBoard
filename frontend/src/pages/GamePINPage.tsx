import React, { useEffect, useState } from "react";

const generatePin = (): string =>
    Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");

const GamePINPage: React.FC = () => {
    const [pin, setPin] = useState<string>("");

    useEffect(() => {
        setPin(generatePin());
    }, []);

    const regenerate = () => setPin(generatePin());

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(pin);
            // silent success; you can add UI feedback if desired
        } catch {
            // ignore copy errors
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: 420,
                    maxWidth: "100%",
                    textAlign: "center",
                    borderRadius: 12,
                    padding: 28,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    background: "#fff",
                }}
            >
                <h1 style={{ margin: 0, marginBottom: 16 }}>Game PIN</h1>
                <div
                    style={{
                        fontSize: 48,
                        letterSpacing: 8,
                        fontWeight: 700,
                        marginBottom: 20,
                        background: "#f5f7fb",
                        padding: "18px 24px",
                        borderRadius: 8,
                        display: "inline-block",
                        minWidth: 220,
                    }}
                >
                    {pin}
                </div>

                <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 12 }}>
                    <button
                        onClick={regenerate}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: "1px solid #e3e7ef",
                            background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        Regenerate
                    </button>
                    <button
                        onClick={copyToClipboard}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: "1px solid #e3e7ef",
                            background: "#f0f6ff",
                            cursor: "pointer",
                        }}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePINPage;