import PageTitle from '../components/PageTitle.tsx';
import Signup from '../components/Signup.tsx';

interface SignupPageProps {
    onNavigateToLogin?: () => void;
    onSignupComplete?: (email: string) => void;
}

const SignupPage = ({ onNavigateToLogin, onSignupComplete }: SignupPageProps) => {
    return (
        <>
            <style>{`
                *{
                    margin: 0; 
                    padding:0; 
                    box-sizing: border-box
                }
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow-x: hidden;
                }
                #root {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            
            <div style={{
                minHeight: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                background: 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 20%, #FF8FC7 40%, #4ECDC4 60%, #45B7D1 80%, #FDB813 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                position: 'absolute',
                top: 0, 
                left:0,
                boxSizing: 'border-box',
            }}>
                <PageTitle />
                <Signup 
                    onNavigateToLogin={onNavigateToLogin}
                    onSignupComplete={onSignupComplete}
                />
            </div>
        </>
    );
};

export default SignupPage;