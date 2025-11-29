function PageTitle() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px 16px',
      position: 'relative',
      zIndex: 20,
    }}>
      <a href="/" style={{ cursor: 'pointer' }}>
        <img 
          src="/logo2.png"  
          alt="PoosdBoard Logo" 
          style={{ 
            display: 'block', 
            maxWidth: '400px',
            width: '100%',  
            height: 'auto',
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))', 
          }} 
        />
      </a>
    </div>
  );
}

export default PageTitle;