import React from 'react';
import './Sidebar.css';

const sampleQuestions = {
  en: [
    "What are the fundamental rights in Bangladesh Constitution?",
    "How to file a case in Bangladesh District Court?",
    "What is the divorce procedure under Muslim Family Law?",
    "What are tenant rights under Bangladesh Rent Control Act?",
    "How does bail work in Bangladesh criminal law?",
    "What is the procedure to register land in Bangladesh?",
  ],
  bn: [
    "বাংলাদেশের সংবিধানে মৌলিক অধিকারগুলো কী কী?",
    "বাংলাদেশে জমি নিবন্ধন কীভাবে করবেন?",
    "মুসলিম পারিবারিক আইনে তালাকের প্রক্রিয়া কী?",
    "শ্রমিকের আইনি অধিকার কী কী?",
    "মামলা দায়ের করার পদ্ধতি কী?",
  ]
};

function Sidebar({ onNewChat, currentSession }) {
  const handleSampleClick = (question) => {
    window.dispatchEvent(new CustomEvent('sampleQuestion', { detail: question }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <button className="sidebar-new-chat" onClick={onNewChat}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 0a7 7 0 110 14A7 7 0 017 0zm0 3a.5.5 0 00-.5.5V6h-2.5a.5.5 0 000 1H6.5v2.5a.5.5 0 001 0V7h2.5a.5.5 0 000-1H7.5V3.5A.5.5 0 007 3z"/>
          </svg>
          New Conversation
        </button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">English Questions</div>
        <div className="sample-questions">
          {sampleQuestions.en.map((q, i) => (
            <button key={i} className="sample-q" onClick={() => handleSampleClick(q)}>
              <span className="sample-q-icon">⚖️</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">বাংলা প্রশ্ন</div>
        <div className="sample-questions">
          {sampleQuestions.bn.map((q, i) => (
            <button key={i} className="sample-q text-bn" onClick={() => handleSampleClick(q)}>
              <span className="sample-q-icon">⚖️</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="disclaimer">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" style={{flexShrink:0,marginTop:2}}>
            <path d="M7 0a7 7 0 110 14A7 7 0 017 0zm0 3a1 1 0 100 2 1 1 0 000-2zm0 3.5a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3A.75.75 0 007 6.5z"/>
          </svg>
          <span>For general information only. Consult a licensed lawyer for legal advice.</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
