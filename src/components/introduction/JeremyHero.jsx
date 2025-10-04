import React from 'react'
import './JeremyHero.css'

export default function JeremyHero({ onStart }) {
  return (
    <div className="jeremy-hero" role="region" aria-label="Jeremy Hansen hero">
      <div className="jeremy-content">
        <div className="img-wrap">
          <img src={'/jeremyhansenfront.jpg'} alt="Jeremy Hansen" className="jeremy-img"/>
          <button className="img-cta" onClick={() => onStart && onStart()}>Begin</button>
          <h1 className="jeremy-name">Jeremy Hansen</h1>
        </div>
        <p className="subtitle">Canadian Astronaut — Welcome to the Solar Mission</p>
      </div>
    </div>
  )
}
