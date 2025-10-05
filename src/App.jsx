import { useState } from 'react';
import StartupPopup from './components/StartupPopup';
import { JeremyIntro, MissionIntro, EarthFacts, CraterMaker } from './components/introduction/Onboarding';
import MapComponent from './components/Map';
import NASADashboard from './components/NASADashboard';

function App() {
  const [showStartup, setShowStartup] = useState(true);
  const [currentStep, setCurrentStep] = useState('intro');
  const [playerName, setPlayerName] = useState('');
  const [asteroidData, setAsteroidData] = useState([]);

  const handleStart = () => {
    setShowStartup(false);
  };

  const handleIntroComplete = (name) => {
    setPlayerName(name);
  };

  const handleStartMission = (name) => {
    setPlayerName(name);
    setCurrentStep('mission');
  };

  const handleMissionContinue = () => {
    setCurrentStep('facts');
  };

  const handleFactsContinue = () => {
    setCurrentStep('crater');
  };

  const handleLaunchCraterMaker = () => {
    setCurrentStep('map');
  };

  const handleBackToIntro = () => {
    setCurrentStep('intro');
  };

  const handleBackToMission = () => {
    setCurrentStep('mission');
  };

  const handleBackToFacts = () => {
    setCurrentStep('facts');
  };

  const handleContinueToDashboard = (asteroids) => {
    setAsteroidData(asteroids);
    setCurrentStep('dashboard');
  };

  const handleBackToMap = () => {
    setCurrentStep('map');
  };

  const appStyle = {
    width: '100%',
    minHeight: '100vh',
    background: '#0a0a0a'
  };

  return (
    <div style={appStyle}>
      {showStartup && <StartupPopup onStart={handleStart} />}
      {!showStartup && currentStep === 'intro' && (
        <JeremyIntro onComplete={handleIntroComplete} onStartMission={handleStartMission} />
      )}
      {!showStartup && currentStep === 'mission' && (
        <MissionIntro player={playerName} onBack={handleBackToIntro} onContinue={handleMissionContinue} />
      )}
      {!showStartup && currentStep === 'facts' && (
        <EarthFacts player={playerName} onBack={handleBackToMission} onLaunch={handleLaunchCraterMaker} />
      )}
      {!showStartup && currentStep === 'crater' && (
        <CraterMaker player={playerName} onBack={handleBackToFacts} onLaunch={handleLaunchCraterMaker} />
      )}
      {!showStartup && currentStep === 'map' && (
        <MapComponent
          onBack={handleBackToFacts}
          onContinueToDashboard={handleContinueToDashboard}
        />
      )}
      {!showStartup && currentStep === 'dashboard' && (
        <NASADashboard
          asteroids={asteroidData}
          onBack={handleBackToMap}
        />
      )}
    </div>
  );
}

export default App;
