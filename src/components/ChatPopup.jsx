import './ChatPopup.css';

function ChatPopup({ message, loading, onClose }) {
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="chat-popup" style={{
      position: 'absolute',
      bottom: isMobile ? '10px' : '20px',
      right: isMobile ? '10px' : '20px',
      width: isMobile ? 'calc(100% - 20px)' : '350px',
      maxHeight: isMobile ? '60vh' : '400px',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
      border: '1px solid #ff6b35',
      zIndex: 3,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid rgba(255, 107, 53, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 53, 0.1)'
      }}>
        <h3 style={{
          margin: 0,
          color: '#ff6b35',
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: 'bold'
        }}>
          🤖 Asteroid Assistant
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ff6b35',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          ×
        </button>
      </div>

      {/* Message Area */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ccc'
          }}>
            <div className="loading-dots" style={{
              display: 'flex',
              gap: '5px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '0s'
              }}></span>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '0.16s'
              }}></span>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '0.32s'
              }}></span>
            </div>
            <span style={{ fontSize: '14px' }}>Analyzing impact data...</span>
          </div>
        ) : message ? (
          <div style={{
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            padding: '12px 16px',
            borderRadius: '12px',
            borderLeft: '3px solid #ff6b35',
            color: 'white',
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ChatPopup;
