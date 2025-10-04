import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StartupPopup = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [impactPhase, setImpactPhase] = useState('approach'); // 'approach', 'impact', 'miniExplosion', 'explosion'

  useEffect(() => {
    // Start impact sequence
    const impactTimer = setTimeout(() => {
      setImpactPhase('impact');
    }, 1000);

    // Trigger mini explosion when asteroid reaches Earth center
    const miniExplosionTimer = setTimeout(() => {
      setImpactPhase('miniExplosion');
    }, 16000);

    // Trigger massive explosion after mini explosion
    const explosionTimer = setTimeout(() => {
      setImpactPhase('explosion');
    }, 17500);

    // Reset to approach phase after explosion completes to allow PLAY button to work
    const resetTimer = setTimeout(() => {
      setImpactPhase('approach');
    }, 30000);

    return () => {
      clearTimeout(impactTimer);
      clearTimeout(miniExplosionTimer);
      clearTimeout(explosionTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  const handleStart = () => {
    setIsVisible(false);
    setTimeout(() => onStart(), 500);
  };

  if (!isVisible) return null;

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
    overflow: 'hidden',
    background: impactPhase === 'explosion' 
      ? 'radial-gradient(circle at 85% 85%, #ff4500 0%, #ff8c00 15%, #ff0000 30%, #8b0000 60%, #000000 100%)'
      : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    animation: impactPhase === 'explosion' ? 'screenShake 1s ease-in-out' : 'none',
    transition: 'background 2s ease-out'
  };

  const backgroundStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  };

  const starsContainerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%'
  };

  const starStyle = {
    position: 'absolute',
    width: '2px',
    height: '2px',
    backgroundColor: 'white',
    borderRadius: '50%',
    animation: 'twinkle 4s infinite'
  };

  const earthStyle = {
    position: 'absolute',
    bottom: '-150px',
    right: '-50px',
    width: '350px',
    height: '350px',
    filter: 'drop-shadow(0 0 50px rgba(74, 144, 226, 0.3))',
    animation: impactPhase === 'explosion' ? 'earthDestruction 2s ease-in forwards' : 'none',
    opacity: impactPhase === 'explosion' ? 0 : 1,
    transition: 'opacity 1s ease-out'
  };

  const asteroidStyle = {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: '300px',
    height: '250px',
    background: `
      radial-gradient(ellipse at 30% 20%, #8a8a8a 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, #7a7a7a 0%, transparent 30%),
      radial-gradient(ellipse at 20% 70%, #6a6a6a 0%, transparent 40%),
      linear-gradient(135deg, #6a6a6a 0%, #4a4a4a 50%, #2a2a2a 100%)
    `,
    borderRadius: '45% 35% 55% 40%',
    boxShadow: `
      inset -30px -30px 60px rgba(0, 0, 0, 0.9),
      inset 20px 20px 40px rgba(150, 150, 150, 0.2),
      0 0 80px rgba(80, 80, 80, 0.3),
      0 0 120px rgba(60, 60, 60, 0.2)
    `,
    zIndex: 5,
    animation: impactPhase === 'impact' ? 'asteroidRealImpact 15s linear forwards' : 'none',
    opacity: (impactPhase === 'miniExplosion' || impactPhase === 'explosion') ? 0 : 1,
    transition: 'opacity 1s ease-out'
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '2rem'
  };

  const isMobile = window.innerWidth <= 768;

  const title1Style = {
    fontSize: isMobile ? '2rem' : '4rem',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0,
    textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)',
    fontFamily: 'Arial Black, Arial, sans-serif',
    zIndex: 10,
    position: 'relative'
  };

  const title2Style = {
    fontSize: isMobile ? '3rem' : '5rem',
    fontWeight: 'bold',
    color: '#ff6b35',
    margin: isMobile ? '0 0 2rem 0' : '0 0 3rem 0',
    textShadow: '0 0 15px rgba(255, 107, 53, 1), 0 0 30px rgba(255, 107, 53, 0.8), 0 0 45px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 107, 53, 0.4)',
    fontFamily: 'Arial Black, Arial, sans-serif',
    animation: 'glow 2s ease-in-out infinite alternate',
    letterSpacing: isMobile ? '1px' : '2px',
    zIndex: 10,
    position: 'relative'
  };

  const buttonStyle = {
    position: 'relative',
    marginTop: isMobile ? '2rem' : '4rem',
    padding: isMobile ? '1rem 2.5rem' : '1.5rem 4rem',
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    background: 'linear-gradient(45deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    fontFamily: 'Arial Black, Arial, sans-serif',
    letterSpacing: isMobile ? '1px' : '2px',
    zIndex: 10
  };

  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push(
        <div
          key={i}
          style={{
            ...starStyle,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      );
    }
    return stars;
  };

  return (
    <motion.div 
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={backgroundStyle}>
        {/* Stars */}
        <div style={starsContainerStyle}>
          {generateStars()}
        </div>
        
        {/* Earth using Globe.svg */}
        <div style={earthStyle}>
          <img 
            src="/Globe.svg" 
            alt="Earth Globe" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* Asteroid with Enhanced Details */}
        <div style={asteroidStyle}>

          {/* Enhanced crater details with varying sizes and depths */}
          {/* Large crater */}
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '40px',
            width: '35px',
            height: '28px',
            background: 'radial-gradient(ellipse at 30% 30%, #111 0%, #222 50%, #333 100%)',
            borderRadius: '60% 40% 50% 70%',
            boxShadow: 'inset -8px -8px 15px rgba(0, 0, 0, 0.9), inset 2px 2px 5px rgba(100, 100, 100, 0.1)'
          }} />
          {/* Medium crater */}
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '50px',
            width: '25px',
            height: '20px',
            background: 'radial-gradient(ellipse at 40% 40%, #111 0%, #222 60%, #333 100%)',
            borderRadius: '50% 60% 40% 80%',
            boxShadow: 'inset -6px -6px 12px rgba(0, 0, 0, 0.9), inset 1px 1px 3px rgba(80, 80, 80, 0.1)'
          }} />
          {/* Small crater */}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '70px',
            width: '18px',
            height: '15px',
            background: 'radial-gradient(ellipse at 35% 35%, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
            borderRadius: '45% 70% 55% 60%',
            boxShadow: 'inset -4px -4px 8px rgba(0, 0, 0, 0.9)'
          }} />
          {/* Tiny crater */}
          <div style={{
            position: 'absolute',
            top: '120px',
            left: '90px',
            width: '12px',
            height: '10px',
            background: 'radial-gradient(ellipse at 30% 30%, #000 0%, #111 40%, #222 100%)',
            borderRadius: '50%',
            boxShadow: 'inset -3px -3px 6px rgba(0, 0, 0, 0.9)'
          }} />
          {/* Surface rocks and bumps */}
          <div style={{
            position: 'absolute',
            top: '150px',
            right: '80px',
            width: '8px',
            height: '6px',
            background: '#555',
            borderRadius: '60% 40% 80% 20%',
            boxShadow: 'inset -2px -2px 4px rgba(0, 0, 0, 0.7)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '100px',
            right: '30px',
            width: '10px',
            height: '8px',
            background: '#444',
            borderRadius: '70% 30% 60% 40%',
            boxShadow: 'inset -2px -2px 4px rgba(0, 0, 0, 0.8)'
          }} />
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '20px',
            width: '6px',
            height: '5px',
            background: '#666',
            borderRadius: '80% 20% 70% 30%',
            boxShadow: 'inset -1px -1px 3px rgba(0, 0, 0, 0.6)'
          }} />
        </div>

        {/* Mini Explosion - appears first when asteroid disappears */}
        {impactPhase === 'miniExplosion' && (
          <div style={{
            position: 'absolute',
            bottom: '10vh',
            right: '10vw',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, #ffffff 0%, #ffff00 20%, #ff8c00 50%, #ff4500 80%, transparent 100%)',
            borderRadius: '50%',
            animation: 'miniExplosion 1.5s ease-out forwards',
            zIndex: 5,
            filter: 'blur(1px)',
            boxShadow: '0 0 100px #ff4500, inset 0 0 30px #ffffff'
          }} />
        )}

        {/* MASSIVE EXPLOSION EFFECTS */}
        {impactPhase === 'explosion' && (
          <>
            {/* Main Explosion Core */}
            <div style={{
              position: 'absolute',
              bottom: '15vh',
              right: '15vw',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, #ffffff 0%, #ffff00 10%, #ff8c00 25%, #ff4500 45%, #ff0000 70%, #8b0000 90%, transparent 100%)',
              borderRadius: '50%',
              animation: 'massiveExplosion 8s ease-out forwards',
              zIndex: 8,
              filter: 'blur(3px)',
              boxShadow: '0 0 300px #ff4500, inset 0 0 100px #ffffff'
            }} />

            {/* Secondary Explosion Rings */}
            <div style={{
              position: 'absolute',
              bottom: '10vh',
              right: '10vw',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, transparent 30%, #ff8c00 40%, #ff4500 50%, #ff0000 65%, transparent 80%)',
              borderRadius: '50%',
              animation: 'massiveExplosion 9s ease-out forwards',
              animationDelay: '0.3s',
              zIndex: 7,
              filter: 'blur(5px)'
            }} />

            {/* Outer Blast Ring */}
            <div style={{
              position: 'absolute',
              bottom: '5vh',
              right: '5vw',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, transparent 40%, rgba(255, 100, 0, 0.6) 50%, rgba(255, 0, 0, 0.4) 70%, transparent 80%)',
              borderRadius: '50%',
              animation: 'massiveExplosion 10s ease-out forwards',
              animationDelay: '0.5s',
              zIndex: 6,
              filter: 'blur(8px)'
            }} />

            {/* Multiple Shockwaves */}
            <div style={{
              position: 'absolute',
              bottom: '15vh',
              right: '15vw',
              width: '100px',
              height: '100px',
              border: '8px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              animation: 'shockwave 6s ease-out forwards',
              zIndex: 5
            }} />

            <div style={{
              position: 'absolute',
              bottom: '15vh',
              right: '15vw',
              width: '100px',
              height: '100px',
              border: '6px solid rgba(255, 140, 0, 0.7)',
              borderRadius: '50%',
              animation: 'shockwave 7s ease-out forwards',
              animationDelay: '0.6s',
              zIndex: 4
            }} />

            <div style={{
              position: 'absolute',
              bottom: '15vh',
              right: '15vw',
              width: '100px',
              height: '100px',
              border: '4px solid rgba(255, 60, 0, 0.5)',
              borderRadius: '50%',
              animation: 'shockwave 8s ease-out forwards',
              animationDelay: '1.2s',
              zIndex: 3
            }} />

            {/* Debris Field */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i * 12) * (Math.PI / 180);
              const distance = 300 + Math.random() * 500;
              const debrisX = Math.cos(angle) * distance;
              const debrisY = Math.sin(angle) * distance;
              
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    bottom: '15vh',
                    right: '15vw',
                    width: `${10 + Math.random() * 20}px`,
                    height: `${10 + Math.random() * 20}px`,
                    background: i % 4 === 0 ? '#8B4513' : i % 4 === 1 ? '#A0522D' : i % 4 === 2 ? '#CD853F' : '#DEB887',
                    borderRadius: Math.random() > 0.5 ? '50%' : `${Math.random() * 50}%`,
                    animation: 'debrisExplosion 6s ease-out forwards',
                    animationDelay: `${Math.random() * 1.5}s`,
                    zIndex: 2,
                    '--debris-x': `${debrisX}px`,
                    '--debris-y': `${debrisY}px`,
                    boxShadow: '0 0 10px rgba(255, 100, 0, 0.5)'
                  }}
                />
              );
            })}

            {/* Plasma Flares */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`flare-${i}`}
                style={{
                  position: 'absolute',
                  bottom: '15vh',
                  right: '15vw',
                  width: '6px',
                  height: `${150 + Math.random() * 200}px`,
                  background: 'linear-gradient(to top, #ff0000, #ff8c00, #ffff00, #ffffff, transparent)',
                  transform: `rotate(${i * 30}deg)`,
                  transformOrigin: 'bottom center',
                  animation: 'massiveExplosion 5s ease-out forwards',
                  animationDelay: `${0.3 + i * 0.08}s`,
                  zIndex: 1,
                  filter: 'blur(2px)',
                  boxShadow: '0 0 20px rgba(255, 200, 0, 0.8)'
                }}
              />
            ))}

            {/* Screen Flash */}
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'radial-gradient(circle at 85% 85%, rgba(255,255,255,0.95) 0%, rgba(255,200,0,0.8) 20%, rgba(255,100,0,0.6) 40%, rgba(255,50,0,0.3) 70%, transparent 100%)',
              animation: 'massiveExplosion 4s ease-out forwards',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
          </>
        )}
      </div>
      
      {/* Content */}
      <div style={contentStyle}>
        <motion.h1 
          style={title1Style}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Come clear about
        </motion.h1>
        
        <motion.h1 
          style={title2Style}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          ASTEROIDS!!!
        </motion.h1>
        
        <motion.button 
          style={buttonStyle}
          onClick={handleStart}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 15px 40px rgba(255, 107, 53, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          PLAY
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StartupPopup;