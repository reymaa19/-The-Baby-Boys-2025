/**
 * Calculate impact effects for an asteroid strike
 * @param {Object} asteroid - The asteroid object with diameter and velocity
 * @param {Object} location - The impact location {longitude, latitude}
 * @returns {Object} Impact data including crater size, blast radii, energy, and earthquake magnitude
 */
export const calculateImpact = (asteroid, location) => {
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

/**
 * Create GeoJSON for blast zone visualization
 * @param {Object} impactData - Impact calculation data
 * @returns {Object} GeoJSON FeatureCollection with blast zone circles
 */
export const createBlastZoneGeoJSON = (impactData) => {
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

/**
 * Filter asteroids based on search criteria
 * @param {Array} asteroids - Array of asteroid objects
 * @param {string} searchText - Text to search in asteroid names
 * @param {boolean} showOnlyHazardous - Filter for hazardous asteroids only
 * @param {number} minDiameter - Minimum diameter in km
 * @returns {Array} Filtered asteroid array
 */
export const filterAsteroids = (asteroids, searchText, showOnlyHazardous, minDiameter) => {
  return asteroids.filter(asteroid => {
    // Search filter
    if (searchText && !asteroid.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    // Hazardous filter
    if (showOnlyHazardous && !asteroid.isPotentiallyHazardous) {
      return false;
    }

    // Diameter filter
    if (asteroid.diameter < minDiameter) {
      return false;
    }

    return true;
  });
};
