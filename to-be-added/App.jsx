import { useState } from 'react'
import './App.css'
import { JeremyIntro, MissionIntro, EarthFacts, CraterMaker } from './components/Onboarding'

function App() {
  const [player, setPlayer] = useState(null)
  const [screen, setScreen] = useState('intro')

  return (
    <div>
      {screen === 'intro' && (
        <JeremyIntro
          onComplete={name => setPlayer(name)}
          onStartMission={name => { setPlayer(name); setScreen('mission') }}
        />
      )}

      {screen === 'mission' && (
        <MissionIntro player={player} onBack={() => setScreen('intro')} onContinue={() => setScreen('facts')} />
      )}

      {screen === 'facts' && (
        <EarthFacts player={player} onBack={() => setScreen('mission')} onLaunch={() => setScreen('crater')} />
      )}

      {screen === 'crater' && (
        <CraterMaker player={player} onBack={() => setScreen('facts')} />
      )}
    </div>
  )
}

export default App
