import { useState } from 'react';
import MainApp from './components/MainApp';
import StartupPopup from './components/StartupPopup';
import MapComponent from './components/Map';

function App() {
  const [showStartup, setShowStartup] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const handleStart = () => {
    setShowStartup(false);
  };

  const handleGoToMap = () => {
    setShowMap(true);
  };

  const handleBackToMain = () => {
    setShowMap(false);
  };

  const appStyle = {
    width: '100%',
    minHeight: '100vh',
    background: '#0a0a0a'
  };

  return (
    <div style={appStyle}>
      {showStartup && <StartupPopup onStart={handleStart} />}
      {!showStartup && !showMap && <MainApp onGoToMap={handleGoToMap} />}
      {!showStartup && showMap && <MapComponent onBack={handleBackToMain} />}
    </div>
  );
}

export default App;
