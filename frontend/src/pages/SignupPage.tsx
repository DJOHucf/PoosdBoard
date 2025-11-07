import PageTitle from '../components/PageTitle.tsx';
import Signup from '../components/Signup.tsx';

interface SignupPageProps {
    onNavigateToLogin?: () => void;
    onSignupComplete?: (email: string) => void;
}

const SignupPage = ({ onNavigateToLogin, onSignupComplete }: SignupPageProps) => {
    return (
        <div>
            <PageTitle />
            <Signup 
                onNavigateToLogin={onNavigateToLogin}
                onSignupComplete={onSignupComplete}
            />
        </div>
    );
};

export default SignupPage;
