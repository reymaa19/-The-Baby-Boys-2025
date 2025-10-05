import { useState } from 'react';

const ImpactResultsPanel = ({ impactData, selectedAsteroid, onReset }) => {
  const isMobile = window.innerWidth <= 768;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      top: isMobile ? '60px' : '20px',
      right: isMobile ? '10px' : '20px',
      width: isExpanded ? (isMobile ? 'calc(100% - 20px)' : '320px') : 'auto',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(15px)',
      color: 'white',
      padding: isExpanded ? (isMobile ? '12px' : '20px') : isMobile ? '8px' : '12px',
      borderRadius: isExpanded ? '20px' : '50%',
      zIndex: 2,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: isExpanded ? '8px' : '0',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            width: isMobile ? '35px' : '45px',
            height: isMobile ? '35px' : '45px',
            borderRadius: '50%',
            border: '2px solid #ff6b00',
            boxShadow: '0 2px 10px rgba(255, 107, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8800 100%)',
            fontSize: isMobile ? '20px' : '24px'
          }}
        >
          💥
        </div>
        {isExpanded && (
          <h3 style={{ margin: 0, color: '#ff6b00', fontSize: isMobile ? '14px' : '18px', flex: 1 }}>
            💥 Impact Results
          </h3>
        )}
      </div>
      {isExpanded && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ fontSize: isMobile ? '11px' : '14px', lineHeight: '1.4' }}>
        <p style={{ margin: '3px 0' }}><strong>Asteroid:</strong> {selectedAsteroid.name}</p>
        <p style={{ margin: '3px 0' }}>
          <strong>Location:</strong> {impactData.location.latitude.toFixed(2)}°, {impactData.location.longitude.toFixed(2)}°
        </p>
        <hr style={{ border: '1px solid #333', margin: '6px 0' }} />
        <p style={{ margin: '3px 0' }}><strong>Energy:</strong> {impactData.energyMegatons.toFixed(2)} MT TNT</p>
        <p style={{ margin: '3px 0' }}><strong>Crater:</strong> {impactData.craterDiameter.toFixed(2)} km</p>
        <p style={{ margin: '3px 0' }}>
          <strong>Total Destruction:</strong> {impactData.totalDestructionRadius.toFixed(2)} km
        </p>
        <p style={{ margin: '3px 0' }}>
          <strong>Severe Blast:</strong> {impactData.severeBlastRadius.toFixed(2)} km
        </p>
        <p style={{ margin: '3px 0' }}>
          <strong>Thermal Radiation:</strong> {impactData.thermalRadiationRadius.toFixed(2)} km
        </p>
        <p style={{ margin: '3px 0' }}>
          <strong>Earthquake:</strong> {impactData.earthquakeMagnitude} magnitude
        </p>
      </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: isMobile ? '8px' : '10px',
            background: 'linear-gradient(45deg, #ff4444 0%, #ff6b6b 50%, #ff4444 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: 'bold',
            boxShadow: '0 5px 15px rgba(255, 68, 68, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 8px 25px rgba(255, 68, 68, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 5px 15px rgba(255, 68, 68, 0.4)';
          }}
        >
          Reset Simulation
        </button>
      </div>
      )}
    </div>
  );
};

export default ImpactResultsPanel;

// Add keyframe animation in a style tag or CSS file
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
