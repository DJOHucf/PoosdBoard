import { useState } from "react";

function LoginSignup() {
    const [activeTab, setActiveTab] = useState('login'); 
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    function doLogin(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const login = (document.getElementById('loginName') as HTMLInputElement)?.value;
        const password = (document.getElementById('loginPassword') as HTMLInputElement)?.value;
        const resultDiv = document.getElementById('loginResult');
        
        if (!login || !password) {
            if (resultDiv) {
                resultDiv.style.color = '#ef4444';
                resultDiv.textContent = 'Please enter your username or email and password.';
            }
            return;
        }

        fetch('https://poosdboard.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password }),
        })
            .then(async (response) => {
                const data = await response.json();

                if (data.error && data.error !== '') {
                    throw new Error(data.error);
                }

                localStorage.setItem('token', data.auth);
                localStorage.setItem('name', data.name);
                window.location.href = '/dashboard';
            })
            .catch((error) => {
                console.error('Login failed:', error);
                if (resultDiv) {
                    resultDiv.style.color = '#ef4444';
                    resultDiv.textContent = 'Login failed: ' + error.message;
                }
            });
    }

    function doSignup(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const container = (event.target as HTMLButtonElement).closest('div');
        if (!container) return;

        const username = (container.querySelector('input[name="username"]') as HTMLInputElement)?.value;
        const email = (container.querySelector('input[name="email"]') as HTMLInputElement)?.value;
        const password = (container.querySelector('input[name="password"]') as HTMLInputElement)?.value;
        const confirmPassword = (container.querySelector('input[name="confirmPassword"]') as HTMLInputElement)?.value;

        if (!email || !username || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch('https://poosdboard.com/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username })
        })
            .then(async (res) => {
                await res.json();
                alert('Account created successfully!');
                setActiveTab('login');
            })
            .catch((err) => {
                console.error('Signup error:', err);
                alert('Signup failed: ' + err.message);
            });
    }

    function handleForgotPassword(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const emailInput = document.getElementById('resetEmailInput') as HTMLInputElement;
        const email = emailInput?.value;
        
        if(!email) {
            alert('Please enter your email address');
            return;
        }

        fetch('https://poosdboard.com/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(async (res) => {
                await res.json();
                alert(`Password reset link sent to ${email}!`);
                setShowForgotPassword(false);
            })
            .catch((err) => {
                console.error('Password reset error:', err);
                alert('Failed to send reset link: ' + err.message);
            });
    }
    
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 100px)',
    };

    const cardStyle: React.CSSProperties = {
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '32px',
        padding: '50px 60px',
        width: '450px',
        maxWidth: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
    };

    const logoStyle: React.CSSProperties = {
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 800,
        color: 'white',
        marginBottom: '32px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    };

    const tabContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '6px',
        borderRadius: '16px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
    };

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '16px',
        transition: 'all 0.3s ease',
        background: isActive ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        border: isActive ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
        boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    });

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 18px',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '12px',
        fontSize: '16px',
        color: '#374151',
        marginBottom: '16px',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 500,
    };

    const buttonStyle: React.CSSProperties = {
        marginTop: '10px',
        background: 'linear-gradient(135deg, rgba(253, 184, 19, 0.9), rgba(255, 143, 199, 0.9))',
        backdropFilter: 'blur(10px)',
        color: 'white',
        border: '3px solid rgba(255, 255, 255, 0.5)',
        padding: '16px 0',
        borderRadius: '16px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '18px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        width: '100%',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    };

    const forgotPasswordLinkStyle: React.CSSProperties = {
        textAlign: 'right',
        marginTop: '8px',
        marginBottom: '8px',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.95)',
        fontWeight: 600,
        cursor: 'pointer',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
    };

    const modalOverlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const modalStyle: React.CSSProperties = {
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '24px',
        padding: '40px 50px',
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
        position: 'relative',
    };

    const modalTitleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 800,
        color: 'white',
        marginBottom: '16px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    };

    const modalTextStyle: React.CSSProperties = {
        fontSize: '15px',
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: '24px',
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
        lineHeight: '1.5',
    };

    const closeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(255, 107, 107, 0.3)',
        border: '2px solid rgba(255, 107, 107, 0.5)',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 700,
        fontSize: '18px',
        transition: 'all 0.3s ease',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    };

    return (
        <>
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div style={logoStyle}>
                        <img 
                            src="/images/logo.png" 
                            alt="POOSD Board Logo" 
                            style={{ 
                                maxWidth: '280px', 
                                height: 'auto',
                                marginBottom: '8px',
                                filter: 'drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.2))'
                            }} 
                        />
                    </div>
                    <h2 style={titleStyle}>
                        {activeTab === 'login' ? 'Welcome Back!' : 'Join Us Today!'}
                    </h2>

                    <div style={tabContainerStyle}>
                        <div
                            style={tabStyle(activeTab === 'login')}
                            onClick={() => setActiveTab('login')}
                        >
                            Log In
                        </div>
                        <div
                            style={tabStyle(activeTab === 'signup')}
                            onClick={() => setActiveTab('signup')}
                        >
                            Sign Up
                        </div>
                    </div>

                    {activeTab === 'login' ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <input
                                id="loginName"
                                type="text"
                                name="loginName"
                                placeholder="Email or Username"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />

                            <input
                                id="loginPassword"
                                type="password"
                                name="loginPassword"
                                placeholder="Password"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />

                            <div
                                style={forgotPasswordLinkStyle}
                                onClick={() => setShowForgotPassword(true)}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.color = '#FDB813';
                                    (e.currentTarget as HTMLElement).style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.95)';
                                    (e.currentTarget as HTMLElement).style.textDecoration = 'none';
                                }}
                            >
                                Forgot Password?
                            </div>

                            <div id="loginResult" style={{ marginTop: '8px', fontSize: '14px', textAlign: 'center' }}></div>

                            <button
                                style={buttonStyle}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.03)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                                }}
                                onClick={doLogin}
                            >
                                Log In
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                required
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                required
                            />

                            <button
                                type="button"
                                onClick={doSignup}
                                style={buttonStyle}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.03)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>

                {showForgotPassword && (
                    <div style={modalOverlayStyle} onClick={() => setShowForgotPassword(false)}>
                        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                            <div
                                style={closeButtonStyle}
                                onClick={() => setShowForgotPassword(false)}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 107, 107, 0.5)';
                                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 107, 107, 0.3)';
                                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                                }}
                            >
                                ×
                            </div>

                            <h3 style={modalTitleStyle}>Reset Password</h3>
                            <p style={modalTextStyle}>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <input
                                    type="email"
                                    id="resetEmailInput"
                                    name="resetEmail"
                                    placeholder="Enter your email"
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(253,184,19,0.9)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 184, 19, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    style={buttonStyle}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253,184,19,1), rgba(255,107,107,0.9))';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.03)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(253,184,19,0.9), rgba(255,143,199,0.9))';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                                    }}
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default LoginSignup;