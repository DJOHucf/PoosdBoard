import PageTitle from '../components/PageTitle.tsx';
import Dashboard from '../components/Dashboard.tsx'; 

interface DashboardPageProps {
    onNavigateToLogin?: () => void; 
}

const DashboardPage = ({ onNavigateToLogin}: DashboardPageProps) => {
    return ( 
        <div>
            <PageTitle />
            <Dashboard onNavigateToLogin={onNavigateToLogin}/>
        </div>
    );
};

export default DashboardPage; 