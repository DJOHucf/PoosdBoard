import PageTitle from '../components/PageTitle.tsx';

interface EmailVerificationWaitingPageProps {
    userEmail?: string;
    onResendEmail?: () => void;
    onBackToLogin?: () => void;
}

const EmailVerificationWaitingPage = ({ 
    userEmail, 
    onResendEmail, 
    onBackToLogin 
}: EmailVerificationWaitingPageProps) => {
    const containerStyle = {
        maxWidth: '500px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center' as const
    };

    const iconStyle = {
        fontSize: '4rem',
        color: '#16a34a',
        marginBottom: '20px'
    };

    const titleStyle = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: '16px'
    };

    const subtitleStyle = {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '24px'
    };

    const emailStyle = {
        fontSize: '16px',
        color: '#2563eb',
        fontWeight: '600',
        background: '#eff6ff',
        padding: '8px 16px',
        borderRadius: '6px',
        margin: '16px 0',
        display: 'inline-block'
    };

    const instructionStyle = {
        fontSize: '16px',
        color: '#6b7280',
        lineHeight: '1.6',
        marginBottom: '32px'
    };

    const buttonStyle = {
        background: '#16a34a',
        color: 'white',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '8px',
        transition: 'background-color 0.2s ease'
    };

    const secondaryButtonStyle = {
        background: 'transparent',
        color: '#6b7280',
        fontWeight: '500',
        padding: '12px 24px',
        borderRadius: '8px',
        border: '2px solid #e5e7eb',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '8px',
        transition: 'all 0.2s ease'
    };

    const loadingDotsStyle = {
        display: 'inline-block',
        animation: 'pulse 2s infinite',
        color: '#16a34a',
        fontSize: '20px',
        marginTop: '20px'
    };

    const handleResendEmail = () => {
        if (onResendEmail) {
            onResendEmail();
        } else {
            alert('Resending verification email...');
        }
    };

    const handleBackToLogin = () => {
        if (onBackToLogin) {
            onBackToLogin();
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <div>
            <PageTitle />
            <div style={containerStyle}>
                <div style={iconStyle}>📧</div>
                
                <h1 style={titleStyle}>Check Your Email</h1>
                
                <p style={subtitleStyle}>
                    We've sent a verification link to:
                </p>
                
                <div style={emailStyle}>
                    {userEmail || 'your@email.com'}
                </div>
                
                <div style={instructionStyle}>
                    <p>Click the magic link in your email to verify your account and complete your registration.</p>
                    <p>The link will expire in 24 hours.</p>
                </div>
                
                <div style={loadingDotsStyle}>
                    ⏳ Waiting for verification...
                </div>
                
                <div style={{ marginTop: '32px' }}>
                    <button 
                        style={buttonStyle}
                        onClick={handleResendEmail}
                    >
                        Resend Email
                    </button>
                    
                    <br />
                    
                    <button 
                        style={secondaryButtonStyle}
                        onClick={handleBackToLogin}
                        
                    >
                        Back to Login
                    </button>
                </div>
                
                <div style={{ 
                    marginTop: '24px', 
                    fontSize: '14px', 
                    color: '#9ca3af',
                    lineHeight: '1.4'
                }}>
                    <p>Didn't receive the email? Check your spam folder or try a different email address.</p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationWaitingPage;