import React, { useState } from 'react';
import './Message.css';

const detectLang = (text) => /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en';

function Message({ conversation, index }) {
  const [copied, setCopied] = useState(false);
  const qLang = detectLang(conversation.question);
  const aLang = detectLang(conversation.answer);

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(conversation.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAnswer = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^#{1,3}\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul])(.+)$/gm, (match) => match.startsWith('<') ? match : `<p>${match}</p>`);
  };

  return (
    <div className="message-pair fade-in-up" style={{ animationDelay: `${index * 0.03}s` }}>
      {/* Question */}
      <div className="message question-msg">
        <div className="msg-avatar question-avatar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 1a8 8 0 110 16A8 8 0 019 1zm0 10a1 1 0 100 2 1 1 0 000-2zm0-7a3 3 0 00-2.83 4H8a1.5 1.5 0 112.76.77l-.03.07A2 2 0 009 10.5a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 .5.5 0 01.5-.5 3 3 0 10-1.5-5.5V6a1 1 0 002 0v-.17A3 3 0 009 4z"/>
          </svg>
        </div>
        <div className="msg-content">
          <span className={`lang-tag ${qLang}`}>
            {qLang === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
          </span>
          <p className={qLang === 'bn' ? 'text-bn' : ''}>{conversation.question}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="message answer-msg">
        <div className="msg-avatar answer-avatar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 1C4.58 1 1 4.58 1 9c0 1.85.57 3.57 1.54 5L1 17l3-1.54A7.94 7.94 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8zm0 2a6 6 0 110 12A6 6 0 019 3zm0 2a1 1 0 100 2 1 1 0 000-2zm-1 3h2v5H8V8z"/>
          </svg>
        </div>
        <div className="msg-content answer-content">
          <div className="answer-header">
            <span className={`lang-tag ${aLang}`}>
              {aLang === 'bn' ? '🇧🇩 আইন সহায়ক' : '⚖️ Law Assistant'}
            </span>
            <div className="answer-meta">
              {conversation.modelUsed && (
                <span className={`model-badge model-${conversation.modelUsed.replace('-fallback','')}`}>
                  {conversation.modelUsed === 'custom' ? '🤖 Custom Model' :
                   conversation.modelUsed === 'claude-fallback' ? '⚡ Claude (fallback)' :
                   '⚡ Claude AI'}
                </span>
              )}
              <button className="copy-btn" onClick={copyAnswer} title="Copy answer">
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M12 2L5 9 2 6"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="4" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M2 4H1a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div
            className={`answer-text ${aLang === 'bn' ? 'text-bn' : ''}`}
            dangerouslySetInnerHTML={{ __html: formatAnswer(conversation.answer) }}
          />
          <div className="msg-timestamp">
            {new Date(conversation.timestamp).toLocaleTimeString('en-BD', {
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
