import React from 'react';
import './Header.css';

const ScalesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="4" r="2" fill="currentColor"/>
    <line x1="14" y1="4" x2="14" y2="24" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="4" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 8 L2 14 Q4 16 6 14 L8 8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M24 8 L22 14 Q24 16 26 14 L28 8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0"/>
    <path d="M20 8 L18 13 Q20 15 22 13 L24 8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="8" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function Header({ onMenuToggle, onNewChat, sidebarOpen }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuToggle} title="Toggle sidebar">
          <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
            <span></span><span></span><span></span>
          </span>
        </button>
        <div className="brand">
          <span className="brand-icon"><ScalesIcon /></span>
          <div className="brand-text">
            <span className="brand-name">Bangladesh Law</span>
            <span className="brand-sub">আইনি সহায়তা কেন্দ্র</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="header-badge">
          <span className="flag-dots">
            <span className="dot dot-green"></span>
            <span className="dot dot-red"></span>
          </span>
          <span>Legal Q&amp;A System</span>
        </div>
      </div>

      <div className="header-right">
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 3a.5.5 0 00-.5.5v3h-3a.5.5 0 000 1h3v3a.5.5 0 001 0v-3h3a.5.5 0 000-1h-3v-3A.5.5 0 008 4z"/>
          </svg>
          New Chat
        </button>
      </div>
    </header>
  );
}

export default Header;
