import { useState } from 'react';
import MainApp from './components/MainApp';
import StartupPopup from './components/StartupPopup';

function App() {
  const [showStartup, setShowStartup] = useState(true);

  const handleStart = () => {
    setShowStartup(false);
  };

  const appStyle = {
    width: '100%',
    minHeight: '100vh',
    background: '#0a0a0a'
  };

  return (
    <div style={appStyle}>
      {showStartup && <StartupPopup onStart={handleStart} />}
      {!showStartup && <MainApp />}
    </div>
  );
}

export default App;
