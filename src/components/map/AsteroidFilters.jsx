const AsteroidFilters = ({
  searchText,
  setSearchText,
  showOnlyHazardous,
  setShowOnlyHazardous,
  minDiameter,
  setMinDiameter
}) => {
  const hasActiveFilters = searchText || showOnlyHazardous || minDiameter > 0;

  const clearFilters = () => {
    setSearchText('');
    setShowOnlyHazardous(false);
    setMinDiameter(0);
  };

  return (
    <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
      <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#ff6b00' }}>🔍 Filters</h3>

      {/* Search by name */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '5px',
          color: 'white',
          fontSize: '13px'
        }}
      />

      {/* Hazardous filter */}
      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer', fontSize: '13px' }}>
        <input
          type="checkbox"
          checked={showOnlyHazardous}
          onChange={(e) => setShowOnlyHazardous(e.target.checked)}
          style={{ marginRight: '8px', cursor: 'pointer' }}
        />
        Show only hazardous ⚠️
      </label>

      {/* Min diameter slider */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ fontSize: '13px', color: '#ccc', display: 'block', marginBottom: '5px' }}>
          Min diameter: {minDiameter.toFixed(2)} km
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={minDiameter}
          onChange={(e) => setMinDiameter(parseFloat(e.target.value))}
          style={{
            width: '100%',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
            width: '100%',
            padding: '6px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default AsteroidFilters;
