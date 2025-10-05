import './ChatPopup.css';
import { useState } from 'react';

function ChatPopup({ message, loading, onClose }) {
  const isMobile = window.innerWidth <= 768;
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Avatar - Fixed at bottom right */}
      <img
        src="/chat_avatar.png"
        alt="Jeremy Hansen"
        onClick={() => setIsMinimized(!isMinimized)}
        style={{
          position: 'absolute',
          bottom: isMobile ? '20px' : '30px',
          right: isMobile ? '20px' : '30px',
          width: isMobile ? '60px' : '80px',
          height: isMobile ? '60px' : '80px',
          borderRadius: '50%',
          border: '4px solid #ff6b35',
          boxShadow: '0 4px 20px rgba(255, 107, 53, 0.6)',
          backgroundColor: '#1a1a1a',
          zIndex: 3,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 25px rgba(255, 107, 53, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.6)';
        }}
      />

      {/* Message Bubble */}
      {!isMinimized && (
      <div className="chat-popup" style={{
        position: 'absolute',
        bottom: isMobile ? '20px' : '30px',
        right: isMobile ? 'calc(20px + 60px + 15px)' : 'calc(30px + 80px + 20px)',
        maxWidth: isMobile ? 'calc(100% - 120px)' : '450px',
        zIndex: 3
      }}>
        <div style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: isMobile ? '16px 18px' : '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          maxHeight: isMobile ? '60vh' : '500px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {/* Speech Bubble Tail - pointing right to avatar */}
          <div style={{
            position: 'absolute',
            right: '-12px',
            bottom: '30px',
            width: '0',
            height: '0',
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            borderLeft: '12px solid rgba(255, 255, 255, 0.95)'
          }}></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: '#999',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              lineHeight: '1'
            }}
            onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
            onMouseLeave={(e) => e.target.style.color = '#999'}
          >
            ×
          </button>

          {/* Name Label */}
          <div style={{
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: 'bold',
            color: '#ff6b35',
            marginBottom: '10px'
          }}>
            Jeremy Hansen
          </div>

          {/* Message Content */}
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#666',
              padding: '8px 0'
            }}>
              <div className="loading-dots" style={{
                display: 'flex',
                gap: '6px'
              }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ff6b35',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0s'
                }}></span>
                <span style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ff6b35',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.16s'
                }}></span>
                <span style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ff6b35',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.32s'
                }}></span>
              </div>
              <span style={{ fontSize: isMobile ? '14px' : '15px' }}>Analyzing impact data...</span>
            </div>
          ) : message ? (
            <div style={{
              color: '#1a1a1a',
              fontSize: isMobile ? '14px' : '15px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {message}
            </div>
          ) : null}
        </div>
      </div>
      )}
    </>
  );
}

export default ChatPopup;
