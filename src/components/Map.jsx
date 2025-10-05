import { useState, useEffect } from 'react';
import Map, { NavigationControl, Marker, Layer, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import ChatPopup from './ChatPopup';
import AsteroidSidebar from './map/AsteroidSidebar';
import ImpactResultsPanel from './map/ImpactResultsPanel';
import { calculateImpact, createBlastZoneGeoJSON, filterAsteroids } from './map/impactCalculations';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API;
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

function MapComponent({ onBack, onContinueToDashboard }) {
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

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [showOnlyHazardous, setShowOnlyHazardous] = useState(false);
  const [minDiameter, setMinDiameter] = useState(0);

  // Meteor animation states
  const [isMeteorAnimating, setIsMeteorAnimating] = useState(false);
  const [meteorPosition, setMeteorPosition] = useState(null);
  const [meteorTrail, setMeteorTrail] = useState([]);

  // Shockwave animation states
  const [showShockwave, setShowShockwave] = useState(false);
  const [shockwaveRadius, setShockwaveRadius] = useState(0);

  // Chat popup states
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Fetch asteroid data from NASA NeoWs API
  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${endDate}&api_key=${NASA_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

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

  // Animate meteor entry from space to impact
  const animateMeteorEntry = (targetLng, targetLat, asteroid) => {
    // Validate target coordinates
    if (!targetLat || !targetLng || targetLat < -90 || targetLat > 90 || targetLng < -180 || targetLng > 180) {
      alert("⚠️ You can't do that! Please click on a valid location on Earth.");
      setTargetingMode(true); // Keep targeting mode active
      return;
    }

    // Meteors come from SPACE (nearly vertical entry, 75-85° from horizontal)
    const entryAngle = Math.random() * 360 * (Math.PI / 180);
    const entryDistanceLat = 8;
    const entryDistanceLng = 2;

    // Calculate start position and clamp to valid coordinates
    let startLng = targetLng + Math.cos(entryAngle) * entryDistanceLng;
    let startLat = targetLat + Math.sin(entryAngle) * entryDistanceLat;

    // Clamp latitude to valid range (-90 to 90)
    startLat = Math.max(-90, Math.min(90, startLat));

    // Wrap longitude to valid range (-180 to 180)
    while (startLng > 180) startLng -= 360;
    while (startLng < -180) startLng += 360;

    // Animation based on velocity (faster asteroids = shorter animation)
    const baseSpeed = 2000; // milliseconds
    const duration = Math.max(1000, baseSpeed - (asteroid.velocity * 50));
    const startTime = Date.now();

    let animationFrameId;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Interpolate position
      const currentLng = startLng + (targetLng - startLng) * progress;
      const currentLat = startLat + (targetLat - startLat) * progress;

      setMeteorPosition({ longitude: currentLng, latitude: currentLat });

      // Add to trail (keep last 15 positions)
      setMeteorTrail(prev => {
        const newTrail = [...prev, { longitude: currentLng, latitude: currentLat }];
        return newTrail.slice(-15);
      });

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

        // Trigger shockwave animation
        animateShockwave();

        // Delay showing impact data by 2 seconds
        setTimeout(() => {
          setImpactData(impact);
        }, 2000);

        // Trigger chat popup
        sendWebhookData(targetLng, targetLat, asteroid.diameter);
      }
    };

    setIsMeteorAnimating(true);
    setMeteorTrail([]);
    animationFrameId = requestAnimationFrame(animate);
  };

  // Animate shockwave expanding from impact
  const animateShockwave = () => {
    setShowShockwave(true);
    setShockwaveRadius(0);

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Expand radius (up to 500km equivalent on map)
      setShockwaveRadius(progress * 500);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setShowShockwave(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleMapClick = (event) => {
    if (targetingMode && selectedAsteroid) {
      const { lng, lat } = event.lngLat;
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
    setShowShockwave(false);
    setShockwaveRadius(0);
    setShowChat(false);
    setChatMessage('');
  };

  // Send data to n8n webhook
  const sendWebhookData = async (longitude, latitude, diameter) => {
    setShowChat(true);
    setChatLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longitude,
          latitude,
          diameter
        })
      });

      const text = await response.text();

      let message;
      try {
        const json = JSON.parse(text);
        message = json.message || json.output || JSON.stringify(json, null, 2);
      } catch {
        message = text;
      }

      setChatMessage(message);
      setChatLoading(false);
    } catch (error) {
      console.error('Webhook error:', error);
      setChatMessage('Unable to load analysis.');
      setChatLoading(false);
    }
  };

  // Filter asteroids
  const filteredAsteroids = filterAsteroids(asteroids, searchText, showOnlyHazardous, minDiameter);

  // Create blast zones
  const blastZones = createBlastZoneGeoJSON(impactData);

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="map-container">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          left: isSidebarOpen ? '360px' : '10px',
          zIndex: 3,
          padding: '12px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          border: '1px solid #333',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '20px',
          transition: 'left 0.3s ease',
          display: isMobile ? 'block' : 'none'
        }}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Asteroid Selector Sidebar */}
      <AsteroidSidebar
        isSidebarOpen={isSidebarOpen}
        loading={loading}
        onBack={onBack}
        asteroids={asteroids}
        filteredAsteroids={filteredAsteroids}
        selectedAsteroid={selectedAsteroid}
        onSelectAsteroid={selectAsteroid}
        searchText={searchText}
        setSearchText={setSearchText}
        showOnlyHazardous={showOnlyHazardous}
        setShowOnlyHazardous={setShowOnlyHazardous}
        minDiameter={minDiameter}
        setMinDiameter={setMinDiameter}
        onSidebarClose={() => setIsSidebarOpen(false)}
      />

      {/* Targeting Instruction */}
      {targetingMode && (
        <div className="targeting-banner" style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          padding: isMobile ? '10px 15px' : '15px 30px',
          borderRadius: '50px',
          zIndex: 2,
          fontSize: isMobile ? '14px' : '18px',
          fontWeight: 'bold',
          maxWidth: isMobile ? '90%' : 'none',
          textAlign: 'center',
          animation: 'pulse 2s infinite',
          fontFamily: 'Arial Black, Arial, sans-serif',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          🎯 {isMobile ? 'Tap' : 'Click'} map to simulate impact
        </div>
      )}

      {/* Impact Results Panel */}
      {impactData && (
        <ImpactResultsPanel
          impactData={impactData}
          selectedAsteroid={selectedAsteroid}
          onReset={resetSimulation}
          onContinueToDashboard={() => onContinueToDashboard && onContinueToDashboard(asteroids)}
        />
      )}

      {/* Mapbox GL Map */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/standard"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleMapClick}
        cursor={targetingMode ? 'crosshair' : 'grab'}
      >
        <NavigationControl position="top-right" />

        {/* Impact Location Marker */}
        {impactLocation && (
          <Marker
            longitude={impactLocation.longitude}
            latitude={impactLocation.latitude}
            anchor="center"
          >
            <div style={{
              fontSize: '40px',
              filter: 'drop-shadow(0 0 10px rgba(255,0,0,0.8))'
            }}>
              💥
            </div>
          </Marker>
        )}

        {/* Meteor Animation */}
        {isMeteorAnimating && meteorPosition && (
          <>
            {/* Trail */}
            {meteorTrail.map((pos, i) => (
              <Marker
                key={i}
                longitude={pos.longitude}
                latitude={pos.latitude}
                anchor="center"
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ff6b00',
                  opacity: (i / meteorTrail.length) * 0.7,
                  boxShadow: '0 0 10px #ff6b00'
                }} />
              </Marker>
            ))}

            {/* Meteor Head */}
            <Marker
              longitude={meteorPosition.longitude}
              latitude={meteorPosition.latitude}
              anchor="center"
            >
              <div style={{
                fontSize: '24px',
                filter: 'drop-shadow(0 0 20px rgba(255,107,0,1))',
                animation: 'pulse 0.5s infinite'
              }}>
                ☄️
              </div>
            </Marker>
          </>
        )}

        {/* Shockwave Animation */}
        {showShockwave && impactLocation && (
          <Source type="geojson" data={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [impactLocation.longitude, impactLocation.latitude]
            }
          }}>
            <Layer
              id="shockwave-ring"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0, shockwaveRadius / 100,
                  10, shockwaveRadius
                ],
                'circle-color': '#ff6b00',
                'circle-opacity': Math.max(0, 0.8 - (shockwaveRadius / 500)),
                'circle-stroke-width': 3,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': Math.max(0, 1 - (shockwaveRadius / 500))
              }}
            />
          </Source>
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

      {/* Chat Popup */}
      {showChat && (
        <ChatPopup
          message={chatMessage}
          loading={chatLoading}
          onClose={() => setShowChat(false)}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default MapComponent;
