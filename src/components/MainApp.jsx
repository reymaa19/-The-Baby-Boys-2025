const MainApp = () => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    padding: '2rem 0',
    borderBottom: '2px solid rgba(255, 107, 53, 0.3)',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    color: '#ff6b35',
    margin: '0 0 1rem 0',
    textShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
    fontWeight: 'bold'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#cccccc',
    margin: 0
  };

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardContainerStyle = {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 107, 53, 0.3)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  };

  const cardTitleStyle = {
    fontSize: '2.5rem',
    color: '#ff6b35',
    marginBottom: '1rem'
  };

  const cardTextStyle = {
    fontSize: '1.3rem',
    color: '#cccccc',
    marginBottom: '3rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem'
  };

  const featureCardStyle = {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 107, 53, 0.2)',
    transition: 'border-color 0.3s ease'
  };

  const featureCardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: '0.75rem'
  };

  const featureCardTextStyle = {
    color: '#cccccc'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>
          Asteroid Impact Simulator
        </h1>
        <p style={subtitleStyle}>
          Interactive visualization tool for asteroid threats and mitigation strategies
        </p>
      </header>
      
      <main style={mainStyle}>
        <div style={cardContainerStyle}>
          <h2 style={cardTitleStyle}>
            🚀 Launch Sequence Initiated
          </h2>
          <p style={cardTextStyle}>
            Your asteroid simulation dashboard is loading...
          </p>
          
          <div style={gridStyle}>
            <div 
              style={featureCardStyle}
              onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255, 107, 53, 0.4)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255, 107, 53, 0.2)'}
            >
              <h3 style={featureCardTitleStyle}>🌍 Impact Simulation</h3>
              <p style={featureCardTextStyle}>Model asteroid impacts with real NASA data</p>
            </div>
            
            <div 
              style={featureCardStyle}
              onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255, 107, 53, 0.4)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255, 107, 53, 0.2)'}
            >
              <h3 style={featureCardTitleStyle}>🛡️ Mitigation Strategies</h3>
              <p style={featureCardTextStyle}>Evaluate deflection methods and defense systems</p>
            </div>
            
            <div 
              style={featureCardStyle}
              onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255, 107, 53, 0.4)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255, 107, 53, 0.2)'}
            >
              <h3 style={featureCardTitleStyle}>📊 Real-time Data</h3>
              <p style={featureCardTextStyle}>Live NEO tracking and orbital mechanics</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainApp;