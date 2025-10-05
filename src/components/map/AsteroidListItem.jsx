const AsteroidListItem = ({ asteroid, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: '12px',
        marginBottom: '10px',
        backgroundColor: isSelected ? '#4a90e2' : '#1a1a1a',
        border: asteroid.isPotentiallyHazardous ? '2px solid #ff4444' : '1px solid #333',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = isSelected ? '#4a90e2' : '#2a2a2a'}
      onMouseLeave={(e) => e.target.style.backgroundColor = isSelected ? '#4a90e2' : '#1a1a1a'}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
        {asteroid.name} {asteroid.isPotentiallyHazardous && '⚠️'}
      </div>
      <div style={{ fontSize: '11px', color: '#ccc' }}>
        Diameter: {(asteroid.diameter).toFixed(2)} km<br/>
        Velocity: {asteroid.velocity.toFixed(1)} km/s<br/>
        Close Approach: {asteroid.closeApproachDate}
      </div>
    </div>
  );
};

export default AsteroidListItem;
