import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';

interface LoginPageProps {
	onNavigateToSignup?: () => void;
}

const LoginPage = ({ onNavigateToSignup }: LoginPageProps) => {
	return (
		<div>
			<PageTitle />
			<Login onNavigateToSignup={onNavigateToSignup} />
		</div>
	);
};

export default LoginPage;
