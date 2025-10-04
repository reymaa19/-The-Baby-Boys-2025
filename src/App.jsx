import { useState } from 'react';
import StartupPopup from './components/StartupPopup';
import JeremyHero from './components/introduction/JeremyHero';
import { JeremyIntro, MissionIntro, EarthFacts } from './components/introduction/Onboarding';
import MapComponent from './components/Map';

function App() {
  const [showStartup, setShowStartup] = useState(true);
  const [currentStep, setCurrentStep] = useState('hero');
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    setShowStartup(false);
  };

  const handleHeroStart = () => {
    setCurrentStep('intro');
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

  const appStyle = {
    width: '100%',
    minHeight: '100vh',
    background: '#0a0a0a'
  };

  return (
    <div style={appStyle}>
      {showStartup && <StartupPopup onStart={handleStart} />}
      {!showStartup && currentStep === 'hero' && <JeremyHero onStart={handleHeroStart} />}
      {!showStartup && currentStep === 'intro' && (
        <JeremyIntro onComplete={handleIntroComplete} onStartMission={handleStartMission} />
      )}
      {!showStartup && currentStep === 'mission' && (
        <MissionIntro player={playerName} onBack={handleBackToIntro} onContinue={handleMissionContinue} />
      )}
      {!showStartup && currentStep === 'facts' && (
        <EarthFacts player={playerName} onBack={handleBackToMission} onLaunch={handleLaunchCraterMaker} />
      )}
      {!showStartup && currentStep === 'map' && <MapComponent onBack={handleBackToFacts} />}
    </div>
  );
}

export default App;
