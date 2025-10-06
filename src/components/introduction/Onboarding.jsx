import { useState } from 'react'
import './Onboarding.css'

export function AstronautIntro({ onComplete, onStartMission }) {
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
        <img src={'/astronaut.png'} alt="Astronaut speaking (AI-generated)" className="intro-img"/>

        <div className="speech">
          {!submitted ? (
            <>
              <p className="speech-text">"Hello there, Space Cadet. My name is Marcus Reid and I'm a Canadian Astronaut! I don't know you quite yet, what's your name?"</p>

              <form className="name-form" onSubmit={handleSubmit}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" aria-label="Your name" />
                <button type="submit" className="primary">Tell Astronaut</button>
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
        <img src={'/astronaut.png'} alt="Astronaut (AI-generated)" className="mission-img"/>
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
        <img src={'/astronaut.png'} alt="Astronaut (AI-generated)" className="facts-img"/>
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

export function AsteroidQuiz({ player, onBack, onContinue }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  const questions = [
    {
      question: "How fast can asteroids travel through space?",
      options: [
        "As fast as a car (100 km/h)",
        "As fast as a bullet (1 km/s)",
        "Up to 70 km/s or more",
        "Asteroids don't move"
      ],
      correct: 2,
      explanation: "Asteroids can travel at incredible speeds - some reaching over 70 km/s! That's about 252,000 km/h!"
    },
    {
      question: "What happened 66 million years ago?",
      options: [
        "First asteroid was discovered",
        "Asteroid impact killed the dinosaurs",
        "Moon was formed",
        "First humans appeared"
      ],
      correct: 1,
      explanation: "A massive asteroid impact in Mexico's Yucatan Peninsula caused the extinction of the dinosaurs and 75% of all species on Earth!"
    },
    {
      question: "How many asteroids does NASA track?",
      options: [
        "About 100",
        "About 1,000",
        "Over 1,000,000",
        "We don't track asteroids"
      ],
      correct: 2,
      explanation: "NASA tracks over 1 million asteroids! Most are harmless, but we keep a close eye on Near-Earth Objects (NEOs)."
    },
    {
      question: "What would happen if a 1 km asteroid hit Earth today?",
      options: [
        "Nothing major",
        "A small crater",
        "Regional devastation",
        "Global catastrophe"
      ],
      correct: 3,
      explanation: "A 1 km asteroid impact would cause global catastrophe - massive tsunamis, earthquakes, and years of climate change from debris blocking sunlight!"
    }
  ]

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return "Perfect! You're a true Space Cadet! 🌟"
    if (percentage >= 75) return "Excellent work! You really know your asteroids! 🚀"
    if (percentage >= 50) return "Good job! You're learning fast! 👍"
    return "Nice try! You'll learn more in the simulator! 💫"
  }

  return (
    <div className="mission-root">
      <div className="mission-card" style={{ maxWidth: '900px' }}>
        <img src={'/astronaut.png'} alt="Astronaut (AI-generated)" className="mission-img"/>
        <div className="mission-copy">
          {!quizComplete ? (
            <>
              <h2>Asteroid Knowledge Quiz</h2>
              <p className="lead">Question {currentQuestion + 1} of {questions.length}</p>

              <div className="quiz-container">
                <p className="quiz-question">{questions[currentQuestion].question}</p>

                <div className="quiz-options">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && handleAnswer(index)}
                      disabled={showResult}
                      className={`quiz-option ${
                        showResult && index === questions[currentQuestion].correct
                          ? 'correct'
                          : showResult && index === selectedAnswer
                          ? 'incorrect'
                          : selectedAnswer === index
                          ? 'selected'
                          : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className={`quiz-result ${selectedAnswer === questions[currentQuestion].correct ? 'correct-result' : 'incorrect-result'}`}>
                    <p className="result-title">
                      {selectedAnswer === questions[currentQuestion].correct ? '✅ Correct!' : '❌ Not quite!'}
                    </p>
                    <p className="result-explanation">{questions[currentQuestion].explanation}</p>
                    <button className="primary" onClick={handleNext}>
                      {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
                    </button>
                  </div>
                )}

                {!showResult && (
                  <div className="quiz-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Quiz Complete! 🎉</h2>
              <div className="quiz-score">
                <p className="score-big">Your Score: {score}/{questions.length}</p>
                <p className="score-message">{getScoreMessage()}</p>
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
                Great job, {player}! Now you're ready to see these concepts in action with the Crater Maker simulator.
              </p>
              <div className="mission-actions" style={{ marginTop: '2rem' }}>
                <button className="secondary" onClick={onBack}>Back</button>
                <button className="primary" onClick={onContinue}>Continue to Simulator →</button>
              </div>
            </>
          )}
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
