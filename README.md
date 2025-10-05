# 🌠 Asteroid Impact Simulator

## NASA Space Apps Challenge 2025 Submission - Team "The Baby Boys"

An interactive educational tool that simulates asteroid impacts on Earth using real NASA data, featuring Canadian astronaut Jeremy Hansen as your guide through space exploration and planetary defense.

![Asteroid Impact Simulator](./public/jeremyhansenfront.png)

## 🚀 Live Demo

Experience the simulator at: [Your Deployment URL]

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Docker Deployment](#docker-deployment)
- [Development](#development)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## 🌍 Overview

The Asteroid Impact Simulator is an educational web application developed for the NASA Space Apps Challenge 2025. It combines real astronomical data with interactive visualization to help users understand asteroid threats and their potential impacts on Earth.

### Key Educational Goals:
- **Asteroid Awareness**: Learn about Near-Earth Objects (NEOs) and their characteristics
- **Impact Physics**: Understand the science behind asteroid impacts and their effects
- **Planetary Defense**: Explore mitigation strategies and defense systems
- **Space Science**: Engage with real NASA data and astronaut expertise

## ✨ Features

### 🎮 Interactive Experience
- **Cinematic Startup**: Immersive asteroid impact animation with Earth destruction sequence
- **Astronaut Guide**: Jeremy Hansen (Canadian Astronaut) leads you through the experience
- **Personal Journey**: Enter your name and receive personalized mission briefings

### 🗺️ Real-Time Simulation
- **NASA Data Integration**: Live asteroid data from NASA's NeoWs API
- **Interactive Mapping**: Click anywhere on Earth to simulate impact
- **Realistic Physics**: Science-based impact calculations including:
  - Crater diameter estimation
  - Blast radius zones (total destruction, severe blast, thermal radiation)
  - Energy release in megatons TNT equivalent
  - Earthquake magnitude prediction

### 📊 Advanced Visualizations
- **3D Meteor Animation**: Realistic meteor entry from space to impact
- **Multi-Zone Impact Areas**: Color-coded destruction zones
- **Real Asteroid Database**: 20+ largest current NEOs with orbital data
- **Mobile Responsive**: Fully optimized for all devices

### 🤖 AI-Powered Analysis
- **Smart Chat Assistant**: AI-powered impact analysis and recommendations
- **Educational Content**: Learn about asteroid composition, orbital mechanics, and defense strategies

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **Vite 7.1.7** - Fast build tool and development server
- **Framer Motion 12.23.22** - Smooth animations and transitions

### Mapping & Visualization
- **Mapbox GL JS 3.15.0** - Interactive 3D mapping
- **React Map GL 8.1.0** - React wrapper for Mapbox

### APIs & Data
- **NASA NeoWs API** - Real asteroid and orbital data
- **Mapbox API** - Satellite imagery and geographic data
- **Custom Webhook Integration** - AI analysis pipeline

### Development & Deployment
- **Docker** - Containerized deployment
- **GitHub Actions** - Automated CI/CD pipeline
- **ESLint** - Code quality and consistency

## 🚀 Installation

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Mapbox API key
- NASA API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/reymaa19/-The-Baby-Boys-2025.git
   cd -The-Baby-Boys-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_MAPBOX_API=your_mapbox_api_key_here
   VITE_NASA_API_KEY=your_nasa_api_key_here
   VITE_N8N_WEBHOOK_URL=your_webhook_url_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Getting API Keys

#### Mapbox API Key
1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Go to your [Account page](https://account.mapbox.com/)
3. Create a new access token with appropriate scopes

#### NASA API Key
1. Request a key at [NASA Open Data](https://api.nasa.gov/)
2. Use in the NeoWs (Near Earth Object Web Service) API

## 🎯 Usage

### Basic Workflow

1. **Launch Sequence**: Experience the cinematic asteroid impact intro
2. **Meet Jeremy**: Interact with Canadian astronaut Jeremy Hansen
3. **Mission Briefing**: Learn about your asteroid analysis mission
4. **Select Asteroid**: Choose from real NASA asteroid database
5. **Target Impact**: Click anywhere on Earth to simulate impact
6. **Analyze Results**: Review detailed impact calculations and effects
7. **AI Analysis**: Get smart recommendations from the chat assistant

### Simulation Features

#### Asteroid Selection
- Browse 20+ largest current Near-Earth Objects
- View real data: diameter, velocity, close approach dates
- Identify potentially hazardous asteroids (marked with ⚠️)

#### Impact Modeling
- **Crater Formation**: Calculate exact crater diameter
- **Destruction Zones**: 
  - Red: Total destruction radius
  - Orange: Severe blast damage radius  
  - Yellow: Thermal radiation radius
- **Seismic Effects**: Estimated earthquake magnitude
- **Energy Release**: TNT equivalent in megatons

## 📁 Project Structure

```
-The-Baby-Boys-2025/
├── public/
│   ├── Globe.svg                 # Earth visualization asset
│   └── jeremyhansenfront.png     # Astronaut profile image
├── src/
│   ├── components/
│   │   ├── introduction/
│   │   │   ├── JeremyHero.jsx    # Astronaut introduction component
│   │   │   ├── Onboarding.jsx    # Mission briefing sequence
│   │   │   └── *.css             # Component-specific styles
│   │   ├── ChatPopup.jsx         # AI assistant interface
│   │   ├── Map.jsx               # Main simulation map
│   │   ├── MainApp.jsx           # Dashboard component
│   │   └── StartupPopup.jsx      # Cinematic intro sequence
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React application entry point
│   └── index.css                 # Global styles and animations
├── .github/workflows/
│   └── docker-build.yml          # CI/CD pipeline
├── Dockerfile                    # Container configuration
├── package.json                  # Dependencies and scripts
└── vite.config.js               # Build configuration
```

## 🔌 API Integration

### NASA NeoWs API
```javascript
// Fetch current asteroid data
const response = await fetch(
  `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${endDate}&api_key=${NASA_API_KEY}`
);
```

### Impact Calculations
The simulator uses physics-based formulas to calculate:
- **Energy**: E = ½mv² (kinetic energy)
- **Crater Size**: Based on energy and impact angle
- **Blast Zones**: Scaled from nuclear blast research
- **Seismic Activity**: Richter scale estimation from energy release

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t asteroid-simulator \
  --build-arg VITE_MAPBOX_API=your_key \
  --build-arg VITE_NASA_API_KEY=your_key \
  .

# Run the container
docker run -p 3000:3000 asteroid-simulator
```

### Automated Deployment
The project includes GitHub Actions for automated Docker Hub deployment:
- Triggers on push to `main` branch
- Builds multi-stage optimized image
- Deploys to Docker Hub registry

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint code analysis
```

### Code Style
- ESLint configuration for React and modern JavaScript
- Consistent formatting and best practices
- Component-based architecture with hooks

### Performance Optimizations
- Lazy loading for large components
- Optimized map rendering with Mapbox GL
- Efficient asteroid data caching
- Mobile-responsive design patterns

## 🤝 Contributing

We welcome contributions to improve the Asteroid Impact Simulator!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and structure
- Add comments for complex calculations
- Test on multiple devices and browsers
- Ensure all APIs are properly handled

## 👥 Team "The Baby Boys"

**NASA Space Apps Challenge 2025 Participants**

Our team is passionate about space education and making complex astronomical concepts accessible to everyone through interactive technology.

### Special Thanks
- **Jeremy Hansen** - Canadian Space Agency astronaut and inspiration
- **NASA** - For providing excellent APIs and educational resources
- **Mapbox** - For powerful mapping and visualization tools

## 📜 License

This project was created for the NASA Space Apps Challenge 2025. 

### Educational Use
This simulator is designed for educational purposes to increase public awareness of asteroid threats and planetary defense strategies.

---

## 🌟 Acknowledgments

- NASA Space Apps Challenge for the opportunity to contribute to space education
- Canadian Space Agency for astronaut Jeremy Hansen's inspiring work
- The global space community working on planetary defense
- Open source contributors who made this project possible

---

**Made with ❤️ for space education and planetary defense awareness**

*"Understanding asteroid threats today helps protect Earth tomorrow"* - Team The Baby Boys
