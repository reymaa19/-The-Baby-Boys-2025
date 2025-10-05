# 🌠 Asteroid Impact Simulator

## NASA Space Apps Challenge 2025 Submission - Team "The Baby Boys"
![Asteroid Impact Simulator](./public/jeremyhansenfront.png)

## 🚀 Live Demo

Experience the simulator at: [cratermarker](https://cratermaker.earth)

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Team](#team)

# Overview

The Asteroid Impact Simulator is an educational web application developed for the NASA Space Apps Challenge 2025. It combines real astronomical data with interactive visualization to help users understand asteroid threats and their potential impacts on Earth.

# Installation

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

# Team

- Gino Pursina
- Ryan Le
- Reynald Maala