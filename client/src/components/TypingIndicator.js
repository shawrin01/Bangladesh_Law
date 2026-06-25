import React from 'react';
import './TypingIndicator.css';

function TypingIndicator() {
  return (
    <div className="typing-wrapper fade-in-up">
      <div className="typing-avatar">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M9 1C4.58 1 1 4.58 1 9c0 1.85.57 3.57 1.54 5L1 17l3-1.54A7.94 7.94 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z"/>
        </svg>
      </div>
      <div className="typing-bubble">
        <span className="typing-label">আইন সহায়ক is analyzing...</span>
        <div className="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
