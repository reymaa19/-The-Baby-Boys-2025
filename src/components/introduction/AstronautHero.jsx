import React from 'react'
import './AstronautHero.css'

export default function AstronautHero({ onStart }) {
  return (
    <div className="astronaut-hero" role="region" aria-label="Astronaut hero">
      <div className="astronaut-content">
        <div className="img-wrap">
          <img src={'/astronaut.png'} alt="Astronaut" className="astronaut-img"/>
          <button className="img-cta" onClick={() => onStart && onStart()}>Begin</button>
          <h1 className="astronaut-name">Astronaut</h1>
        </div>
        <p className="subtitle">Canadian Astronaut — Welcome to the Solar Mission</p>
      </div>
    </div>
  )
}
