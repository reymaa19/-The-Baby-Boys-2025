import { useState, useEffect } from 'react';
import Map, { NavigationControl, Marker, Layer, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API;
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

function MapComponent() {
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });

  const [asteroids, setAsteroids] = useState([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [targetingMode, setTargetingMode] = useState(false);
  const [impactLocation, setImpactLocation] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Meteor animation states
  const [isMeteorAnimating, setIsMeteorAnimating] = useState(false);
  const [meteorPosition, setMeteorPosition] = useState(null);
  const [meteorTrail, setMeteorTrail] = useState([]);

  // Fetch asteroid data from NASA NeoWs API
  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${endDate}&api_key=${NASA_API_KEY}`
        );
        const data = await response.json();

        // Flatten all asteroids from all dates
        const allAsteroids = [];
        Object.values(data.near_earth_objects).forEach(dateArray => {
          dateArray.forEach(asteroid => {
            allAsteroids.push({
              id: asteroid.id,
              name: asteroid.name,
              diameter: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
              velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second),
              closeApproachDate: asteroid.close_approach_data[0].close_approach_date,
              isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid
            });
          });
        });

        // Sort by size (largest first)
        allAsteroids.sort((a, b) => b.diameter - a.diameter);
        setAsteroids(allAsteroids.slice(0, 20)); // Top 20 largest
        setLoading(false);
      } catch (error) {
        console.error('Error fetching asteroids:', error);
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, []);

  // Calculate impact effects
  const calculateImpact = (asteroid, location) => {
    const diameter = asteroid.diameter * 1000; // Convert to meters
    const velocity = asteroid.velocity * 1000; // Convert to m/s
    const density = 3000; // kg/m³ (rock asteroid assumption)

    // Calculate mass
    const radius = diameter / 2;
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * density;

    // Calculate energy (in joules)
    const energy = 0.5 * mass * Math.pow(velocity, 2);
    const energyMegatons = energy / (4.184 * Math.pow(10, 15)); // Convert to megatons TNT

    // Simplified crater calculation (meters)
    const craterDiameter = Math.pow(energyMegatons, 0.3) * 1000;

    // Blast radius zones (km)
    const totalDestructionRadius = craterDiameter / 1000 * 1.5;
    const severeBlastRadius = totalDestructionRadius * 2;
    const thermalRadiationRadius = totalDestructionRadius * 3;

    // Earthquake magnitude (Richter scale)
    const earthquakeMagnitude = 0.67 * Math.log10(energyMegatons) + 3.87;

    return {
      location,
      craterDiameter: craterDiameter / 1000, // km
      totalDestructionRadius,
      severeBlastRadius,
      thermalRadiationRadius,
      energyMegatons,
      earthquakeMagnitude: earthquakeMagnitude.toFixed(1)
    };
  };

  // Animate meteor entry from space to impact
  const animateMeteorEntry = (targetLng, targetLat, asteroid) => {
    // Meteors come from SPACE (nearly vertical entry, 75-85° from horizontal)
    // Small offset to show direction, but mostly straight down from above
    const entryAngle = Math.random() * 360 * (Math.PI / 180); // Random direction from space
    const entryDistanceLat = 8; // Mostly vertical - coming from "above" on map
    const entryDistanceLng = 2; // Small horizontal offset so you can see the angle

    // Start position: mostly above the target with slight random offset
    const startLng = targetLng + (Math.cos(entryAngle) * entryDistanceLng);
    const startLat = targetLat + entryDistanceLat; // Start well above target

    const startTime = Date.now();
    // Duration based on asteroid velocity (faster asteroids = shorter animation)
    const baseDuration = 2500; // 2.5 seconds base
    const duration = Math.max(1500, baseDuration - (asteroid.velocity * 50));

    const trail = [];
    let animationFrameId;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quadratic easing for acceleration (gravity effect)
      const easedProgress = progress * progress;

      // Calculate current position
      const currentLng = startLng + (targetLng - startLng) * easedProgress;
      const currentLat = startLat + (targetLat - startLat) * easedProgress;

      // Update meteor position
      setMeteorPosition({ longitude: currentLng, latitude: currentLat });

      // Add to trail (keep last 8 positions)
      trail.push({ longitude: currentLng, latitude: currentLat, opacity: 1 - progress });
      if (trail.length > 8) trail.shift();
      setMeteorTrail([...trail]);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation complete - trigger impact
        setIsMeteorAnimating(false);
        setMeteorPosition(null);
        setMeteorTrail([]);

        const location = { longitude: targetLng, latitude: targetLat };
        setImpactLocation(location);
        const impact = calculateImpact(asteroid, location);
        setImpactData(impact);
      }
    };

    setIsMeteorAnimating(true);
    setMeteorTrail([]);
    animationFrameId = requestAnimationFrame(animate);
  };

  const handleMapClick = (event) => {
    if (targetingMode && selectedAsteroid) {
      const { lng, lat } = event.lngLat;

      // Start meteor animation instead of immediate impact
      animateMeteorEntry(lng, lat, selectedAsteroid);
      setTargetingMode(false);
    }
  };

  const selectAsteroid = (asteroid) => {
    setSelectedAsteroid(asteroid);
    setTargetingMode(true);
    setImpactLocation(null);
    setImpactData(null);
  };

  const resetSimulation = () => {
    setSelectedAsteroid(null);
    setTargetingMode(false);
    setImpactLocation(null);
    setImpactData(null);
    setIsMeteorAnimating(false);
    setMeteorPosition(null);
    setMeteorTrail([]);
  };

  // Create blast zone circles
  const createBlastZoneGeoJSON = () => {
    if (!impactData) return null;

    const createCircle = (center, radiusKm, color) => {
      const points = 64;
      const coords = [];
      const distanceX = radiusKm / (111.320 * Math.cos(center.latitude * Math.PI / 180));
      const distanceY = radiusKm / 110.574;

      for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        coords.push([center.longitude + x, center.latitude + y]);
      }
      coords.push(coords[0]); // Close the circle

      return {
        type: 'Feature',
        properties: { color },
        geometry: {
          type: 'Polygon',
          coordinates: [coords]
        }
      };
    };

    return {
      type: 'FeatureCollection',
      features: [
        createCircle(impactData.location, impactData.thermalRadiationRadius, '#ff6b00'),
        createCircle(impactData.location, impactData.severeBlastRadius, '#ff0000'),
        createCircle(impactData.location, impactData.totalDestructionRadius, '#8b0000')
      ]
    };
  };

  const blastZones = createBlastZoneGeoJSON();

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Asteroid Selector Sidebar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '350px',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '20px',
        overflowY: 'auto',
        zIndex: 1,
        boxShadow: '2px 0 10px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>🌠 Asteroid Impact Simulator</h2>

        {loading ? (
          <p>Loading asteroids from NASA...</p>
        ) : (
          <>
            <p style={{ fontSize: '14px', marginBottom: '20px', color: '#aaa' }}>
              Select an asteroid from NASA's database, then click anywhere on the map to simulate its impact.
            </p>

            {asteroids.map(asteroid => (
              <div
                key={asteroid.id}
                onClick={() => selectAsteroid(asteroid)}
                style={{
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: selectedAsteroid?.id === asteroid.id ? '#4a90e2' : '#1a1a1a',
                  border: asteroid.isPotentiallyHazardous ? '2px solid #ff4444' : '1px solid #333',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = selectedAsteroid?.id === asteroid.id ? '#4a90e2' : '#2a2a2a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = selectedAsteroid?.id === asteroid.id ? '#4a90e2' : '#1a1a1a'}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {asteroid.name} {asteroid.isPotentiallyHazardous && '⚠️'}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>
                  Diameter: {(asteroid.diameter).toFixed(2)} km<br/>
                  Velocity: {asteroid.velocity.toFixed(1)} km/s<br/>
                  Close Approach: {asteroid.closeApproachDate}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Targeting Instruction */}
      {targetingMode && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff6b00',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          zIndex: 2,
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          animation: 'pulse 2s infinite'
        }}>
          🎯 Click anywhere on the map to simulate impact with {selectedAsteroid.name}
        </div>
      )}

      {/* Impact Results Panel */}
      {impactData && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '320px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 2,
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ff6b00' }}>💥 Impact Results</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <p><strong>Asteroid:</strong> {selectedAsteroid.name}</p>
            <p><strong>Location:</strong> {impactData.location.latitude.toFixed(2)}°, {impactData.location.longitude.toFixed(2)}°</p>
            <hr style={{ border: '1px solid #333', margin: '10px 0' }} />
            <p><strong>Energy Released:</strong> {impactData.energyMegatons.toFixed(2)} megatons TNT</p>
            <p><strong>Crater Diameter:</strong> {impactData.craterDiameter.toFixed(2)} km</p>
            <p><strong>Total Destruction:</strong> {impactData.totalDestructionRadius.toFixed(2)} km radius</p>
            <p><strong>Severe Blast Damage:</strong> {impactData.severeBlastRadius.toFixed(2)} km radius</p>
            <p><strong>Thermal Radiation:</strong> {impactData.thermalRadiationRadius.toFixed(2)} km radius</p>
            <p><strong>Earthquake Magnitude:</strong> {impactData.earthquakeMagnitude}</p>
          </div>
          <button
            onClick={resetSimulation}
            style={{
              marginTop: '15px',
              width: '100%',
              padding: '10px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Reset Simulation
          </button>
        </div>
      )}

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ cursor: targetingMode ? 'crosshair' : 'grab' }}
      >
        <NavigationControl position="top-right" />

        {/* Meteor Trail */}
        {meteorTrail.map((pos, index) => (
          <Marker
            key={`trail-${index}`}
            longitude={pos.longitude}
            latitude={pos.latitude}
            anchor="center"
          >
            <div style={{
              width: `${15 - index}px`,
              height: `${15 - index}px`,
              backgroundColor: '#ff6b00',
              borderRadius: '50%',
              opacity: 0.6 - (index * 0.05),
              boxShadow: `0 0 ${20 - index * 2}px #ff6b00`,
              filter: 'blur(1px)'
            }} />
          </Marker>
        ))}

        {/* Animated Meteor */}
        {meteorPosition && (
          <Marker
            longitude={meteorPosition.longitude}
            latitude={meteorPosition.latitude}
            anchor="center"
          >
            <div style={{
              fontSize: '30px',
              filter: 'drop-shadow(0 0 20px #ff6b00) drop-shadow(0 0 40px #ff0000)',
              animation: 'meteorGlow 0.3s infinite alternate'
            }}>
              ☄️
            </div>
          </Marker>
        )}

        {/* Impact Marker */}
        {impactLocation && !isMeteorAnimating && (
          <Marker
            longitude={impactLocation.longitude}
            latitude={impactLocation.latitude}
            anchor="center"
          >
            <div style={{
              fontSize: '40px',
              animation: 'bounce 1s infinite'
            }}>
              💥
            </div>
          </Marker>
        )}

        {/* Blast Zones */}
        {blastZones && (
          <Source type="geojson" data={blastZones}>
            <Layer
              id="blast-zones"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.3
              }}
            />
            <Layer
              id="blast-zones-outline"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}
      </Map>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes meteorGlow {
          0% {
            filter: drop-shadow(0 0 20px #ff6b00) drop-shadow(0 0 40px #ff0000);
            transform: scale(1);
          }
          100% {
            filter: drop-shadow(0 0 30px #ff6b00) drop-shadow(0 0 60px #ff0000);
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

export default MapComponent;