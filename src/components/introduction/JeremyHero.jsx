import React from 'react'
import './JeremyHero.css'

export default function JeremyHero({ onStart }) {
  return (
    <div className="jeremy-hero" role="region" aria-label="Jeremy Ransen hero">
      <div className="jeremy-content">
        <div className="img-wrap">
          <img src={'/jeremyhansenfront.png'} alt="Jeremy Ransen" className="jeremy-img"/>
          <button className="img-cta" onClick={() => onStart && onStart()}>Begin</button>
          <h1 className="jeremy-name">Jeremy Ransen</h1>
        </div>
        <p className="subtitle">Canadian Astronaut — Welcome to the Solar Mission</p>
      </div>
    </div>
  )
}
