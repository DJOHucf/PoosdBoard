import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                background: "#f7f7fb",
            }}
        >
            <div
                style={{
                    maxWidth: 560,
                    width: "100%",
                    textAlign: "center",
                    background: "#fff",
                    padding: 32,
                    borderRadius: 8,
                    boxShadow: "0 6px 18px rgba(20,20,40,0.08)",
                }}
            >
                <h1 style={{ margin: 0, fontSize: 22 }}>Game not found</h1>
                <p style={{ marginTop: 12, marginBottom: 24, color: "#333" }}>
                    This game does not exist or has already ended.
                </p>
                <button
                    onClick={() => navigate("/play")}
                    style={{
                        cursor: "pointer",
                        padding: "10px 18px",
                        fontSize: 15,
                        borderRadius: 6,
                        border: "none",
                        background: "#2563eb",
                        color: "#fff",
                    }}
                >
                    Back to Play
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;