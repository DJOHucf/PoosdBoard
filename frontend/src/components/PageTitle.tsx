import { useNavigate } from 'react-router-dom';

function PageTitle() {
  const navigate = useNavigate();
  
  return (
    <img 
      src="logo2.png" 
      alt="PoosdBoard Logo" 
      onClick={() => navigate('/')}
      style={{ 
        display: 'block', 
        margin: '20px auto', 
        maxWidth: '400px',  // Made it bigger! Was 200px
        height: 'auto',     // Maintains aspect ratio
        width: '100%',      // Responsive - scales down on smaller screens
        cursor: 'pointer'   // Shows it's clickable
      }} 
    />
  );
};

export default PageTitle;