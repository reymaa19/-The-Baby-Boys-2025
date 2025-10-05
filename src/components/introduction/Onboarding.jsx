import { useState } from 'react'
import './Onboarding.css'

export function JeremyIntro({ onComplete, onStartMission }) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitted(true)
    onComplete && onComplete(name.trim())
  }

  return (
    <div className="intro-root">
      <div className="intro-card">
        <img src={'/jeremyhansenfront.png'} alt="Jeremy Hansen speaking" className="intro-img"/>

        <div className="speech">
          {!submitted ? (
            <>
              <p className="speech-text">"Hello there, Space Cadet. My name is Jeremy Hansen and I'm a Canadian Astronaut! I don't know you quite yet, what's your name?"</p>

              <form className="name-form" onSubmit={handleSubmit}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" aria-label="Your name" />
                <button type="submit" className="primary">Tell Jeremy</button>
              </form>
            </>
          ) : (
            <>
              <p className="speech-text">Nice to meet you, <strong>{name}</strong>! Ready for your mission?</p>
              <div className="start-actions">
                <button className="primary" onClick={() => onStartMission && onStartMission(name)}>Start Mission</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function MissionIntro({ player, onBack, onContinue }) {
  const [choice, setChoice] = useState(null)

  function handleChoice(ch) {
    setChoice(ch)
  }

  let response = null
  if (choice === 'yes') response = "Alright, let's start your training"
  if (choice === 'no') response = "Well you're here anyways, might as well learn"

  return (
    <div className="mission-root">
      <div className="mission-card">
        <img src={'/jeremyhansenfront.png'} alt="Jeremy Hansen" className="mission-img"/>
        <div className="mission-copy">
          <h2>Alright Cadet {player}, nice to meet you!</h2>
          <p className="lead">Let me show you around.</p>

          <div className="yesno">
            <p className="prompt">Would you like to start training now?</p>
            <div className="yesno-actions">
              <button className="primary" onClick={() => handleChoice('yes')}>Yes</button>
              <button className="secondary" onClick={() => handleChoice('no')}>No</button>
            </div>
          </div>

          {choice && (
            <div className="response">
              <p>{response}</p>
            </div>
          )}

          <div className="mission-actions">
            <button onClick={() => onBack && onBack()} className="secondary">Back</button>
            {choice && (
              <button className="primary" onClick={() => onContinue && onContinue()}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EarthFacts({ player, onBack, onLaunch }) {
  return (
    <div className="facts-root">
      <div className="facts-card">
        <img src={'/jeremyhansenfront.png'} alt="Jeremy Hansen" className="facts-img"/>
        <div className="facts-copy">
          <h2>Hey Cadet {player}!</h2>
          <div className="crater">
            <p>As an Astronaut, my job is to not only get my self physically ready to go into outer space, but also learn as much as possible. Let me show you one of the applications we use as astronauts, called "Crater Maker". The purpose of this application is to show us how asteroids fall towards the earth and what the damages are to the surrounding area.</p>
            <div className="facts-actions">
              <button className="primary" onClick={() => onLaunch && onLaunch()}>Launch Crater Maker</button>
              <button className="secondary" onClick={() => onBack && onBack()}>Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CraterMaker({ player, onBack }) {
  return (
    <div className="crater-root">
      <div className="crater-card">
        <h1>Crater Maker (Demo)</h1>
        <p>Welcome, {player}. This demo will show how an asteroid impacts and the expected damage area.</p>
        <div className="crater-actions">
          <button className="secondary" onClick={() => onBack && onBack()}>Back</button>
        </div>
      </div>
    </div>
  )
}
