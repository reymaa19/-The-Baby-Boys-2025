import React from 'react'
import './Onboarding.css'

export default function WalkthroughMenu({ player, onSelectLesson, onBack }) {
  const lessons = [
    {
      id: 'basics',
      title: 'Asteroid Basics',
      description: 'Learn about what asteroids are and where they come from',
      icon: '🪨'
    },
    {
      id: 'impact',
      title: 'Impact Events',
      description: 'Understand what happens when asteroids hit Earth',
      icon: '💥'
    },
    {
      id: 'detection',
      title: 'Detection Methods',
      description: 'How scientists track and monitor asteroids',
      icon: '🔭'
    },
    {
      id: 'crater-maker',
      title: 'Crater Maker Tool',
      description: 'Interactive simulation of asteroid impacts',
      icon: '🎯'
    }
  ]

  return (
    <div className="walkthrough-root">
      <div className="walkthrough-card">
        <div className="walkthrough-header">
          <h1>Space Training Menu</h1>
          <p>Welcome, Cadet {player}! Choose your training module:</p>
        </div>
        
        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="lesson-card"
              onClick={() => onSelectLesson && onSelectLesson(lesson.id)}
            >
              <div className="lesson-icon">{lesson.icon}</div>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <button className="lesson-btn">Start Lesson</button>
            </div>
          ))}
        </div>
        
        <div className="walkthrough-actions">
          <button className="secondary" onClick={() => onBack && onBack()}>
            Back to Introduction
          </button>
        </div>
      </div>
    </div>
  )
}
