import PageTitle from '../components/PageTitle.tsx';
import Signup from '../components/Signup.tsx';

interface SignupPageProps {
    onNavigateToLogin?: () => void;
    onSignupComplete?: (email: string) => void;
}

const SignupPage = ({ onNavigateToLogin, onSignupComplete }: SignupPageProps) => {
    const token = localStorage.getItem('token');

	if (token) {
		window.location.href = '/dashboard';
		return null;
	}
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
