# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Asteroid Impact Simulator is an interactive educational web application for NASA Space Apps Challenge 2025. It uses real NASA asteroid data to simulate impact scenarios with physics-based calculations, featuring Canadian astronaut Jeremy Hansen as a guide.

## Core Technologies

- **React 19.1.1** with Vite 7.1.7 build tool
- **Mapbox GL JS 3.15.0** for interactive 3D mapping and visualization
- **Framer Motion 12.23.22** for animations
- **NASA NeoWs API** for real-time asteroid data
- **n8n webhook** for AI-powered impact analysis

## Development Commands

```bash
npm run dev      # Start development server on http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Environment Variables

Required environment variables (in `.env`):
- `VITE_MAPBOX_API` - Mapbox API token for map rendering
- `VITE_NASA_API_KEY` - NASA API key for asteroid data (get from api.nasa.gov)
- `VITE_N8N_WEBHOOK_URL` - Webhook endpoint for AI chat assistant

## Application Architecture

### Flow Sequence

The app follows a linear progression managed by state in `App.jsx`:

1. **StartupPopup** - Cinematic asteroid impact intro animation
2. **JeremyIntro** - Astronaut introduction with name input
3. **MissionIntro** - Mission briefing from Jeremy Hansen
4. **EarthFacts** - Educational content about Earth and asteroids
5. **CraterMaker** - Interactive lesson about crater formation
6. **MapComponent** - Main simulation interface

The entire experience is controlled by `currentStep` state transitions in `App.jsx:6-70`.

### Map Component Structure

`Map.jsx` is the core simulation component containing:

- **Asteroid Data Flow**: Fetches from NASA NeoWs API on mount (`https://api.nasa.gov/neo/rest/v1/feed`), sorts by size, displays top 20 largest asteroids from a 7-day window
- **Simulation Lifecycle**:
  1. User selects asteroid from sidebar → enters targeting mode
  2. Map click triggers `animateMeteorEntry()` → meteor animation from space
  3. Animation completes → calculates impact → displays results → triggers webhook
  4. Shockwave animation + blast zone visualization + chat popup appear

- **Key State Management**:
  - `selectedAsteroid` - Current asteroid for simulation
  - `targetingMode` - Boolean to enable/disable map click targeting
  - `impactData` - Calculated impact results from `impactCalculations.js`
  - `isMeteorAnimating` - Controls meteor entry animation
  - `showShockwave` - Triggers expanding shockwave effect
  - `meteorPosition` & `meteorTrail` - Track meteor animation positions

### Physics Calculations

`src/components/map/impactCalculations.js` contains the core science:

- **calculateImpact()**: Uses asteroid diameter, velocity, and assumed density (3000 kg/m³) to calculate:
  - Mass from spherical volume
  - Kinetic energy (E = ½mv²)
  - Energy in megatons TNT equivalent (E / 4.184 × 10¹⁵)
  - Crater diameter: energyMegatons^0.3 × 1000 meters
  - Three blast zones: total destruction (crater × 1.5), severe blast (× 2), thermal radiation (× 3)
  - Earthquake magnitude: 0.67 × log₁₀(energyMegatons) + 3.87

- **createBlastZoneGeoJSON()**: Generates MapboxGL-compatible GeoJSON circles for visualization
  - Creates 64-point polygons for smooth circles
  - Uses lat/lng to meter conversions (1° lat ≈ 110.574 km, 1° lng ≈ 111.320 km × cos(lat))

- **filterAsteroids()**: Filters asteroid list by name, hazardous status, and minimum diameter

### Component Organization

- `components/introduction/` - Onboarding sequence components:
  - `JeremyHero.jsx` - Astronaut introduction component
  - `Onboarding.jsx` - Contains JeremyIntro, MissionIntro, EarthFacts, CraterMaker as named exports
  - `*.css` - Component-specific styles

- `components/map/` - Map-specific components:
  - `AsteroidSidebar.jsx` - Asteroid selection panel with filters
  - `ImpactResultsPanel.jsx` - Displays calculated impact data
  - `AsteroidFilters.jsx` - Search and filter controls
  - `AsteroidListItem.jsx` - Individual asteroid display card
  - `impactCalculations.js` - Physics calculations utility

- `components/ChatPopup.jsx` - AI assistant chat interface
- `components/MainApp.jsx` - Dashboard component
- `components/StartupPopup.jsx` - Intro animation
- `components/Map.jsx` - Main map simulation component

### Animation System

Two primary animations in `Map.jsx`:

1. **Meteor Entry** (`animateMeteorEntry:90-147`):
   - Starts 8° latitude above target with random entry angle
   - Uses `requestAnimationFrame` for smooth 60fps motion
   - Duration scales inversely with asteroid velocity (faster asteroids = shorter animation)
   - Leaves 15-point trail using Mapbox markers
   - Triggers impact calculation and shockwave on completion

2. **Shockwave** (`animateShockwave:149-172`):
   - 1.5-second expanding ring from impact point
   - Fades opacity as it grows to 500km
   - Uses Mapbox circle layer with dynamic radius and interpolated zoom scaling

### API Integration

- **NASA NeoWs**:
  - Fetches 7-day asteroid feed on component mount
  - Extracts: diameter (km), velocity (km/s), close approach date, hazardous status
  - Flattens all asteroids from all dates, sorts by diameter, keeps top 20

- **n8n Webhook**:
  - POST request with `{longitude, latitude, diameter}` after impact
  - Displays AI analysis in ChatPopup component
  - Handles both JSON and text responses

## Docker Deployment

Multi-stage Dockerfile:
- **Builder stage**: Node 20 Alpine, runs `npm ci` and `npm run build`
- **Runner stage**: Serves static build via `serve` package on port 3000
- Build args: `VITE_MAPBOX_API`, `VITE_NASA_API_KEY`, `VITE_N8N_WEBHOOK_URL` (baked into build)

Build and run:
```bash
docker build -t asteroid-simulator \
  --build-arg VITE_MAPBOX_API=your_key \
  --build-arg VITE_NASA_API_KEY=your_key \
  --build-arg VITE_N8N_WEBHOOK_URL=your_url \
  .

docker run -p 3000:3000 asteroid-simulator
```

GitHub Actions CI/CD (`.github/workflows/docker-build.yml`):
- Triggers on push to `main` branch
- Builds and pushes to Docker Hub (`ryanle3/web-app:cratermaker`)
- Requires secrets: `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN`, `VITE_MAPBOX_API`, `VITE_NASA_API_KEY`

## Key Implementation Details

- **Responsive Design**: Components check `window.innerWidth <= 768` for mobile adaptations
- **Sidebar Toggle**: Mobile has hamburger menu (☰/✕) to show/hide asteroid selector
- **Targeting UX**: Cursor changes to crosshair when in targeting mode, orange instruction banner appears at top
- **Data Assumptions**: All asteroids treated as rocky (3000 kg/m³ density) for impact calculations
- **Mapbox Style**: Uses `mapbox://styles/mapbox/standard` for satellite imagery base
- **Animation Cleanup**: `resetSimulation()` clears all state when starting new impact
- **Mobile First**: Inline styles adapt based on `isMobile` boolean throughout components

## Branch Structure

- Current branch: `chatbot-styling`
- Main branch: `main`
- Recent work: map wave animation, styling updates, impact calculations, intro styling

## Notes for Development

- All map-related work should modify `Map.jsx` and `components/map/` files
- Impact physics formulas in `impactCalculations.js` are simplified for educational purposes, not exact scientific models
- Animations use a mix of React state, `requestAnimationFrame`, and Mapbox layers
- Mobile responsiveness is inline styled, not separate CSS files (except for introduction components)
- Environment variables must be prefixed with `VITE_` to be accessible in client-side code via `import.meta.env`
- Blast zones are color-coded: yellow (thermal), red (severe blast), dark red (total destruction)
- Meteor entry angle is randomized for visual variety while maintaining steep descent (75-85° from horizontal)
