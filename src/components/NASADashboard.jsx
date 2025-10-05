import { useMemo } from 'react';
import './introduction/Onboarding.css';

const NASADashboard = ({ asteroids, onBack }) => {
  const isMobile = window.innerWidth <= 768;

  // Calculate statistics
  const stats = useMemo(() => {
    if (!asteroids || asteroids.length === 0) return null;

    const total = asteroids.length;
    const hazardous = asteroids.filter(a => a.isPotentiallyHazardous);
    const hazardousCount = hazardous.length;
    const hazardRate = ((hazardousCount / total) * 100).toFixed(1);

    // Find superlatives
    const largest = asteroids.reduce((max, a) => a.diameter > max.diameter ? a : max, asteroids[0]);
    const fastest = asteroids.reduce((max, a) => a.velocity > max.velocity ? a : max, asteroids[0]);
    const soonest = asteroids.reduce((min, a) =>
      new Date(a.closeApproachDate) < new Date(min.closeApproachDate) ? a : min,
      asteroids[0]
    );
    const mostDangerous = hazardous.length > 0
      ? hazardous.reduce((max, a) => a.diameter > max.diameter ? a : max, hazardous[0])
      : null;

    // Size categories
    const giant = asteroids.filter(a => a.diameter > 1).length;
    const large = asteroids.filter(a => a.diameter > 0.5 && a.diameter <= 1).length;
    const medium = asteroids.filter(a => a.diameter > 0.1 && a.diameter <= 0.5).length;
    const small = asteroids.filter(a => a.diameter <= 0.1).length;

    // Averages
    const avgDiameter = (asteroids.reduce((sum, a) => sum + a.diameter, 0) / total).toFixed(2);
    const avgVelocity = (asteroids.reduce((sum, a) => sum + a.velocity, 0) / total).toFixed(1);

    // Days until next approach
    const now = new Date();
    const nextDate = new Date(soonest.closeApproachDate);
    const daysUntil = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));

    // Date range for tracking period
    const dates = asteroids.map(a => new Date(a.closeApproachDate));
    const earliestDate = new Date(Math.min(...dates));
    const latestDate = new Date(Math.max(...dates));

    return {
      total,
      hazardousCount,
      nonHazardousCount: total - hazardousCount,
      hazardRate,
      largest,
      fastest,
      soonest,
      mostDangerous,
      sizeCategories: { giant, large, medium, small },
      avgDiameter,
      avgVelocity,
      daysUntil,
      earliestDate,
      latestDate
    };
  }, [asteroids]);

  if (!stats) {
    return (
      <div className="intro-root">
        <div className="intro-card">
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading NASA data...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderProgressBar = (count, total, color) => {
    const percentage = (count / total) * 100;
    return (
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '8px'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          transition: 'width 0.8s ease'
        }} />
      </div>
    );
  };

  return (
    <div className="mission-root" style={{
      padding: isMobile ? '1rem' : '2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: isMobile ? '1.5rem' : '2.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          animation: 'floatUp 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: isMobile ? '1.5rem' : '3rem',
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Arial Black, Arial, sans-serif',
            letterSpacing: isMobile ? '0.5px' : '1px',
            textAlign: 'center'
          }}>
            📊 NASA Data Dashboard
          </h1>
          <p style={{
            fontSize: isMobile ? '0.9rem' : '1.2rem',
            color: '#fff',
            margin: '0 0 10px 0',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            lineHeight: '1.4'
          }}>
            Live Near-Earth Object tracking from NASA's NeoWs API
          </p>
          <p style={{
            fontSize: isMobile ? '0.8rem' : '1rem',
            color: '#ff6b35',
            margin: '0 0 20px 0',
            textAlign: 'center',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            📅 Tracking Period: {formatDate(stats.earliestDate)} - {formatDate(stats.latestDate)}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onBack}
              className="secondary"
            >
              ← Back to Simulator
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '20px'
        }}>
          {/* Summary Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: isMobile ? '1.5rem' : '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'floatUp 0.8s ease-out'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: isMobile ? '1.2rem' : '1.8rem',
              color: '#ff6b35',
              textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
            }}>
              🌍 This Week's NEO Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '15px' : '20px' }}>
              <div>
                <p style={{ margin: '0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>Total Tracked</p>
                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', fontSize: isMobile ? '28px' : '36px', color: '#4a9eff' }}>
                  {stats.total}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: isMobile ? '11px' : '12px', opacity: 0.6, color: '#fff' }}>asteroids</p>
              </div>
              <div>
                <p style={{ margin: '0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>Hazardous</p>
                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', fontSize: isMobile ? '28px' : '36px', color: '#ff4444' }}>
                  {stats.hazardousCount}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: isMobile ? '11px' : '12px', opacity: 0.6, color: '#fff' }}>{stats.hazardRate}% of total</p>
              </div>
            </div>
          </div>

          {/* Next Approach Countdown */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: isMobile ? '1.5rem' : '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'floatUp 0.8s ease-out'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: isMobile ? '1.2rem' : '1.8rem',
              color: '#ff6b35',
              textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
            }}>
              ⏱️ Next Close Approach
            </h2>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>Coming Up</p>
              <p style={{ margin: '8px 0', fontWeight: 'bold', fontSize: isMobile ? '36px' : '48px', color: '#ff6b35' }}>
                {stats.daysUntil > 0 ? stats.daysUntil : '0'}
              </p>
              <p style={{ margin: '4px 0 16px 0', fontSize: isMobile ? '12px' : '14px', color: '#fff' }}>
                {stats.daysUntil === 1 ? 'day' : 'days'}
              </p>
              <p style={{ margin: '0', fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#fff', lineHeight: '1.3' }}>
                {stats.soonest.name.replace(/[()]/g, '')}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: isMobile ? '12px' : '14px', color: '#4a9eff' }}>
                📅 {formatDate(new Date(stats.soonest.closeApproachDate))}
              </p>
            </div>
          </div>

          {/* Record Holders - Full Width */}
          <div style={{
            gridColumn: isMobile ? '1' : '1 / -1',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: isMobile ? '1.5rem' : '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'floatUp 0.8s ease-out'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: isMobile ? '1.2rem' : '1.8rem',
              color: '#ff6b35',
              textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
            }}>
              🏆 Record Holders
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '15px' : '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                borderRadius: '15px',
                padding: isMobile ? '1rem' : '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>🥇 Largest</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: isMobile ? '14px' : '18px', color: '#fff', lineHeight: '1.3' }}>
                  {stats.largest.name.replace(/[()]/g, '')}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: isMobile ? '12px' : '14px', color: '#4a9eff' }}>
                  {stats.largest.diameter.toFixed(2)} km diameter
                </p>
                <p style={{ margin: '0', fontSize: isMobile ? '11px' : '12px', color: '#888' }}>
                  📅 {formatDate(new Date(stats.largest.closeApproachDate))}
                </p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                borderRadius: '15px',
                padding: isMobile ? '1rem' : '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>⚡ Fastest</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: isMobile ? '14px' : '18px', color: '#fff', lineHeight: '1.3' }}>
                  {stats.fastest.name.replace(/[()]/g, '')}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: isMobile ? '12px' : '14px', color: '#4a9eff' }}>
                  {stats.fastest.velocity.toFixed(1)} km/s
                </p>
                <p style={{ margin: '0', fontSize: isMobile ? '11px' : '12px', color: '#888' }}>
                  📅 {formatDate(new Date(stats.fastest.closeApproachDate))}
                </p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                borderRadius: '15px',
                padding: isMobile ? '1rem' : '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>📅 Soonest</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: isMobile ? '14px' : '18px', color: '#fff', lineHeight: '1.3' }}>
                  {stats.soonest.name.replace(/[()]/g, '')}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: isMobile ? '12px' : '14px', color: '#4a9eff' }}>
                  {stats.daysUntil > 0 ? `In ${stats.daysUntil} days` : 'Today!'}
                </p>
                <p style={{ margin: '0', fontSize: isMobile ? '11px' : '12px', color: '#888' }}>
                  📅 {formatDate(new Date(stats.soonest.closeApproachDate))}
                </p>
              </div>
              {stats.mostDangerous && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 68, 68, 0.1))',
                  borderRadius: '15px',
                  padding: isMobile ? '1rem' : '1.5rem',
                  border: '1px solid rgba(255, 68, 68, 0.3)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>⚠️ Most Dangerous</p>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: isMobile ? '14px' : '18px', color: '#fff', lineHeight: '1.3' }}>
                    {stats.mostDangerous.name.replace(/[()]/g, '')}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: isMobile ? '12px' : '14px', color: '#ff4444' }}>
                    {stats.mostDangerous.diameter.toFixed(2)} km - Hazardous
                  </p>
                  <p style={{ margin: '0', fontSize: isMobile ? '11px' : '12px', color: '#888' }}>
                    📅 {formatDate(new Date(stats.mostDangerous.closeApproachDate))}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Size Breakdown - Full Width */}
          <div style={{
            gridColumn: isMobile ? '1' : '1 / -1',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: isMobile ? '1.5rem' : '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'floatUp 0.8s ease-out'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: isMobile ? '1.2rem' : '1.8rem',
              color: '#ff6b35',
              textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
            }}>
              📏 Size Distribution
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: isMobile ? '14px' : '16px', color: '#fff' }}>Giant (&gt;1km)</span>
                  <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px', color: '#ff4444' }}>{stats.sizeCategories.giant}</span>
                </div>
                {renderProgressBar(stats.sizeCategories.giant, stats.total, '#ff4444')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: isMobile ? '14px' : '16px', color: '#fff' }}>Large (0.5-1km)</span>
                  <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px', color: '#ff8c00' }}>{stats.sizeCategories.large}</span>
                </div>
                {renderProgressBar(stats.sizeCategories.large, stats.total, '#ff8c00')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: isMobile ? '14px' : '16px', color: '#fff' }}>Medium (0.1-0.5km)</span>
                  <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px', color: '#ffd700' }}>{stats.sizeCategories.medium}</span>
                </div>
                {renderProgressBar(stats.sizeCategories.medium, stats.total, '#ffd700')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: isMobile ? '14px' : '16px', color: '#fff' }}>Small (&lt;0.1km)</span>
                  <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px', color: '#4a9eff' }}>{stats.sizeCategories.small}</span>
                </div>
                {renderProgressBar(stats.sizeCategories.small, stats.total, '#4a9eff')}
              </div>
            </div>
          </div>

          {/* Average Statistics */}
          <div style={{
            gridColumn: isMobile ? '1' : '1 / -1',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: isMobile ? '1.5rem' : '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'floatUp 0.8s ease-out'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: isMobile ? '1.2rem' : '1.8rem',
              color: '#ff6b35',
              textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
            }}>
              📊 Average Statistics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '15px' : '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>Average Diameter</p>
                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', fontSize: isMobile ? '28px' : '36px', color: '#4a9eff' }}>
                  {stats.avgDiameter}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: isMobile ? '12px' : '14px', opacity: 0.6, color: '#fff' }}>kilometers</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: isMobile ? '12px' : '14px', opacity: 0.7, color: '#fff' }}>Average Velocity</p>
                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', fontSize: isMobile ? '28px' : '36px', color: '#4a9eff' }}>
                  {stats.avgVelocity}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: isMobile ? '12px' : '14px', opacity: 0.6, color: '#fff' }}>km/s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NASADashboard;
