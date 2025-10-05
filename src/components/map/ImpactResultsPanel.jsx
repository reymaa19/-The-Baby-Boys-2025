const ImpactResultsPanel = ({ impactData, selectedAsteroid, onReset }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      position: 'absolute',
      bottom: isMobile ? '10px' : 'auto',
      top: isMobile ? 'auto' : '20px',
      right: isMobile ? '10px' : '20px',
      left: isMobile ? '10px' : 'auto',
      width: isMobile ? 'calc(100% - 20px)' : '320px',
      maxHeight: isMobile ? '50vh' : 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      color: 'white',
      padding: isMobile ? '15px' : '20px',
      borderRadius: '10px',
      zIndex: 2,
      boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#ff6b00', fontSize: isMobile ? '16px' : '18px' }}>
        💥 Impact Results
      </h3>
      <div style={{ fontSize: isMobile ? '12px' : '14px', lineHeight: '1.6' }}>
        <p style={{ margin: '5px 0' }}><strong>Asteroid:</strong> {selectedAsteroid.name}</p>
        <p style={{ margin: '5px 0' }}>
          <strong>Location:</strong> {impactData.location.latitude.toFixed(2)}°, {impactData.location.longitude.toFixed(2)}°
        </p>
        <hr style={{ border: '1px solid #333', margin: '8px 0' }} />
        <p style={{ margin: '5px 0' }}><strong>Energy:</strong> {impactData.energyMegatons.toFixed(2)} MT TNT</p>
        <p style={{ margin: '5px 0' }}><strong>Crater:</strong> {impactData.craterDiameter.toFixed(2)} km</p>
        <p style={{ margin: '5px 0' }}>
          <strong>Total Destruction:</strong> {impactData.totalDestructionRadius.toFixed(2)} km
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Severe Blast:</strong> {impactData.severeBlastRadius.toFixed(2)} km
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Thermal Radiation:</strong> {impactData.thermalRadiationRadius.toFixed(2)} km
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Earthquake:</strong> {impactData.earthquakeMagnitude} magnitude
        </p>
      </div>
      <button
        onClick={onReset}
        style={{
          marginTop: '12px',
          width: '100%',
          padding: '10px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Reset Simulation
      </button>
    </div>
  );
};

export default ImpactResultsPanel;
