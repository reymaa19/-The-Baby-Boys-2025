# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Asteroid Impact Simulator** (formerly "Meteor Madness") - A NASA Space Apps Challenge 2025 project by Team "The Baby Boys".

An educational web application that simulates asteroid impacts on Earth using real NASA data, featuring Canadian astronaut Jeremy Hansen as a guide. Users learn about Near-Earth Objects (NEOs), impact physics, and planetary defense through interactive visualization and simulation.

### Application Flow

The app uses a stepped onboarding flow managed in App.jsx:

1. **StartupPopup**: Cinematic asteroid impact animation with Earth destruction sequence
2. **JeremyIntro** (from Onboarding.jsx): Astronaut introduction and player name input
3. **MissionIntro**: Mission briefing with yes/no interaction
4. **EarthFacts**: Educational content about Crater Maker application
5. **CraterMaker**: Pre-simulation information screen
6. **Map**: Interactive asteroid impact simulator with real NASA data

State management uses React hooks in App.jsx with `currentStep` controlling progression and `playerName` persisting across components.

## Architecture

### Core Components

- **App.jsx**: Main application orchestrator
  - Manages 6-step navigation flow with conditional rendering based on `currentStep` state
  - Maintains `playerName` state passed to child components
  - Each step has dedicated back/continue handlers

- **Map.jsx**: Primary impact simulator (~470 lines)
  - **Data fetching**: NASA NeoWs API for 7-day asteroid feed (sorted by diameter, top 20)
  - **Targeting system**: Click-to-target with crosshair cursor when asteroid selected
  - **Meteor animation**: Animated entry with 75-85° vertical angle, velocity-based duration (1-2s)
  - **Shockwave effect**: 1.5s expanding ring animation post-impact
  - **Impact calculations**: Uses `impactCalculations.js` for physics (crater, blast zones, energy, earthquake)
  - **Visualization**: GeoJSON circles for 3 blast zones (thermal/severe/total destruction)
  - **AI chat**: n8n webhook integration for impact analysis (ChatPopup component)
  - **Filtering**: Sidebar supports search, hazardous-only, and diameter filters
  - **Responsive**: Mobile-friendly with collapsible sidebar

- **Onboarding.jsx**: Contains 4 named export components
  - `JeremyIntro`, `MissionIntro`, `EarthFacts`, `CraterMaker`
  - Each handles own navigation via `onBack`/`onContinue`/`onLaunch` props
  - Player name input captured in JeremyIntro

- **impactCalculations.js**: Pure functions for physics calculations
  - `calculateImpact()`: Main calculation engine
  - `createBlastZoneGeoJSON()`: Generates visualization data
  - `filterAsteroids()`: Search/filter logic

### Sub-components (map/)

- **AsteroidSidebar**: Asteroid list with filters and selection
- **AsteroidFilters**: Search and filter controls
- **AsteroidListItem**: Individual asteroid card display
- **ImpactResultsPanel**: Shows impact calculation results with reset button

### Environment Variables

Required in `.env`:
```env
VITE_MAPBOX_API=your_mapbox_access_token
VITE_NASA_API_KEY=your_nasa_api_key
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### API Integration

- **NASA NeoWs API**
  - Endpoint: `https://api.nasa.gov/neo/rest/v1/feed?start_date={today}&end_date={+7days}&api_key={key}`
  - Data extracted per asteroid: `id`, `name`, `estimated_diameter.kilometers.estimated_diameter_max`, `close_approach_data[0].relative_velocity.kilometers_per_second`, `close_approach_data[0].close_approach_date`, `is_potentially_hazardous_asteroid`
  - Results sorted by diameter (largest first), limited to top 20

- **n8n Chat Webhook**
  - POST request on impact with JSON: `{longitude, latitude, diameter}`
  - Response parsed as JSON or plain text, displayed in ChatPopup

## Development Commands

```bash
# Development server (accessible on network via --host flag)
npm run dev

# Production build (outputs to dist/)
npm run build

# Lint with ESLint
npm run lint

# Preview production build locally
npm run preview
```

Note: Dev server runs on port 5173 by default with `--host` flag for network access.

## Docker

Multi-stage build for optimized production image:
- **Build stage**: Node 20 Alpine, runs `npm run build` with build args for env vars
- **Production stage**: Serves dist/ with `serve` package on port 3000

```bash
# Build with environment variables
docker build -t asteroid-simulator \
  --build-arg VITE_MAPBOX_API=your_key \
  --build-arg VITE_NASA_API_KEY=your_key \
  --build-arg VITE_N8N_WEBHOOK_URL=your_webhook \
  .

# Run container
docker run -p 3000:3000 asteroid-simulator
```

## CI/CD

GitHub Actions workflow (`.github/workflows/docker-build.yml`):
- **Trigger**: Push to `main` branch
- **Image**: `ryanle3/web-app:cratermaker`
- **Required secrets**: `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN`, `VITE_MAPBOX_API`, `VITE_NASA_API_KEY`, `VITE_N8N_WEBHOOK_URL`
- **Process**: Checkout → Docker Buildx → Login → Build & Push with build args

## Technical Details

### Impact Physics Formulas (impactCalculations.js)

All calculations assume rock asteroids (density: 3000 kg/m³):

1. **Mass**: Volume (4/3 × π × r³) × density
2. **Kinetic Energy**: E = 0.5 × mass × velocity²
3. **Energy in Megatons TNT**: energy_joules ÷ (4.184 × 10¹⁵)
4. **Crater Diameter (m)**: energyMegatons^0.3 × 1000
5. **Blast Radii (km)**:
   - Total destruction: (crater_diameter / 1000) × 1.5
   - Severe blast: total_destruction × 2
   - Thermal radiation: total_destruction × 3
6. **Earthquake Magnitude**: 0.67 × log₁₀(energyMegatons) + 3.87

### Blast Zone Visualization

GeoJSON circles use lat/lng to meter conversions:
- Latitude: 1° ≈ 110.574 km
- Longitude: 1° ≈ 111.320 km × cos(latitude)

Circles rendered with 64 coordinate points for smooth appearance. Three zones with colors:
- Red (#ff0000): Severe blast
- Dark red (#8b0000): Total destruction
- Orange (#ff6b00): Thermal radiation

### Meteor Animation

Entry trajectory: Random 360° angle, ~8° latitude offset (simulating space entry)
Duration: `max(1000ms, 2000ms - (velocity_km/s × 50))`
Trail: Last 15 positions with fading opacity
Impact triggers: Shockwave animation (1.5s) → Impact data display (2s delay) → Chat popup

### Technology Stack

- **React 19.1.1**: Hooks-based UI (useState, useEffect)
- **Vite 7.1.7**: Fast HMR development server
- **Mapbox GL JS 3.15.0** + **react-map-gl 8.1.0**: 3D globe with "standard" style
- **Framer Motion 12.23.22**: Smooth transitions and animations
- **ESLint 9.36**: Code quality with React hooks plugin, custom rule for unused vars (ignores uppercase/underscore-prefixed)

### Code Style Notes

- ESLint configured with `no-unused-vars` exception for uppercase/underscore-prefixed variables
- Component files use `.jsx` extension
- CSS modules co-located with components (e.g., `Map.jsx` + `Map.css`)
- Environment variables accessed via `import.meta.env.VITE_*`
