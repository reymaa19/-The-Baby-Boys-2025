import AsteroidFilters from './AsteroidFilters';
import AsteroidListItem from './AsteroidListItem';

const AsteroidSidebar = ({
  isSidebarOpen,
  loading,
  onBack,
  asteroids,
  filteredAsteroids,
  selectedAsteroid,
  onSelectAsteroid,
  searchText,
  setSearchText,
  showOnlyHazardous,
  setShowOnlyHazardous,
  minDiameter,
  setMinDiameter,
  onSidebarClose
}) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: isSidebarOpen ? 0 : '-100%',
      width: isMobile ? '85vw' : '350px',
      maxWidth: '350px',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(15px)',
      color: 'white',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 2,
      boxShadow: '2px 0 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      border: 'none',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'left 0.3s ease'
    }}>
      <h2 style={{
        margin: '0 0 20px 0',
        fontSize: isMobile ? '20px' : '24px',
        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: 'Arial Black, Arial, sans-serif',
        letterSpacing: '0.5px'
      }}>
        Asteroid Impact Simulator
      </h2>

      {onBack && (
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Home
        </button>
      )}

      {loading ? (
        <p>Loading asteroids from NASA...</p>
      ) : (
        <>
          <p style={{ fontSize: '13px', marginBottom: '20px', color: '#aaa' }}>
            Select an asteroid from NASA's database, then {isMobile ? 'tap' : 'click'} anywhere on the map to simulate its impact.
          </p>

          <AsteroidFilters
            searchText={searchText}
            setSearchText={setSearchText}
            showOnlyHazardous={showOnlyHazardous}
            setShowOnlyHazardous={setShowOnlyHazardous}
            minDiameter={minDiameter}
            setMinDiameter={setMinDiameter}
          />

          {/* Asteroid list with count */}
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
            Showing {filteredAsteroids.length} of {asteroids.length} asteroids
          </div>

          {filteredAsteroids.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
              No asteroids match your filters.
            </p>
          ) : (
            filteredAsteroids.map(asteroid => (
              <AsteroidListItem
                key={asteroid.id}
                asteroid={asteroid}
                isSelected={selectedAsteroid?.id === asteroid.id}
                onSelect={() => {
                  onSelectAsteroid(asteroid);
                  if (isMobile) onSidebarClose();
                }}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AsteroidSidebar;
