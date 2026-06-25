import React from 'react';
import './WelcomeScreen.css';

const features = [
  { icon: '🇧🇩', title: 'Bilingual Support', desc: 'Ask in English or বাংলা — system auto-detects and replies accordingly.' },
  { icon: '⚖️', title: 'Bangladesh Law', desc: 'Constitutional, civil, criminal, family, land, and commercial law.' },
  { icon: '🤖', title: 'Custom Model Ready', desc: 'Plug in your own Colab-trained model anytime via API endpoint.' },
  { icon: '💬', title: 'Multi-turn Chat', desc: 'Maintains conversation context for follow-up questions.' },
];

const quickQuestions = [
  { q: 'What are the fundamental rights in Bangladesh Constitution?', lang: 'en' },
  { q: 'How to file a criminal case in Bangladesh?', lang: 'en' },
  { q: 'বাংলাদেশে জমির মামলা কীভাবে করবেন?', lang: 'bn' },
  { q: 'মুসলিম পারিবারিক আইনে তালাকের নিয়ম কী?', lang: 'bn' },
];

function WelcomeScreen({ onSample }) {
  return (
    <div className="welcome">
      <div className="welcome-hero">
        <div className="welcome-emblem">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="8" r="4" fill="#C8A951"/>
            <line x1="30" y1="8" x2="30" y2="52" stroke="#C8A951" strokeWidth="2"/>
            <line x1="8" y1="18" x2="52" y2="18" stroke="#C8A951" strokeWidth="2"/>
            <ellipse cx="14" cy="26" rx="8" ry="2" stroke="#C8A951" strokeWidth="1.5" fill="none"/>
            <ellipse cx="46" cy="26" rx="8" ry="2" stroke="#C8A951" strokeWidth="1.5" fill="none"/>
            <line x1="8" y1="52" x2="52" y2="52" stroke="#C8A951" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="welcome-title">
          Bangladesh Law<br/>
          <span className="welcome-subtitle-bn">আইনি সহায়তা কেন্দ্র</span>
        </h1>
        <p className="welcome-desc">
          Your AI-powered legal assistant for Bangladesh law.<br/>
          Ask questions in <strong>English</strong> or <strong>বাংলা</strong> — get clear, reliable answers.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-section">
        <div className="quick-label">Try asking:</div>
        <div className="quick-grid">
          {quickQuestions.map((item, i) => (
            <button
              key={i}
              className={`quick-btn ${item.lang === 'bn' ? 'text-bn' : ''}`}
              onClick={() => onSample(item.q)}
            >
              {item.q}
            </button>
          ))}
        </div>
      </div>

      <div className="welcome-disclaimer">
        <span>⚠️</span>
        <span>
          This system provides general legal information, not legal advice.
          Always consult a qualified lawyer for specific legal matters.
          <span className="text-bn"> আইনি পরামর্শের জন্য একজন আইনজীবীর সাথে যোগাযোগ করুন।</span>
        </span>
      </div>
    </div>
  );
}

export default WelcomeScreen;
