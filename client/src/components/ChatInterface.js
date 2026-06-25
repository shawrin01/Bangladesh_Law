import React, { useState, useRef, useEffect, useCallback } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';
import './ChatInterface.css';

function ChatInterface({ sessionId, conversations, setConversations }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversations, loading]);

  // Listen for sidebar sample questions
  useEffect(() => {
    const handler = (e) => setInput(e.detail);
    window.addEventListener('sampleQuestion', handler);
    return () => window.removeEventListener('sampleQuestion', handler);
  }, []);

  const handleSubmit = useCallback(async (questionOverride) => {
    const question = (questionOverride || input).trim();
    if (!question || loading) return;

    setInput('');
    setError(null);
    setLoading(true);

    const historyForAPI = conversations.slice(-6).map(c => ({
      question: c.question,
      answer: c.answer
    }));

    try {
      const response = await fetch('/api/qa/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId, conversationHistory: historyForAPI })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Server error');

      setConversations(prev => [...prev, data.data]);
    } catch (err) {
      setError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, conversations, sessionId, setConversations]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const autoResize = (e) => {
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const detectLang = (text) => /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en';
  const isBn = detectLang(input);

  return (
    <div className="chat-interface">
      <div className="messages-area">
        {conversations.length === 0 && !loading ? (
          <WelcomeScreen onSample={(q) => handleSubmit(q)} />
        ) : (
          <div className="messages-list">
            {conversations.map((conv, i) => (
              <Message key={conv.id || i} conversation={conv} index={i} />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <div className="error-msg fade-in-up">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 9a1 1 0 100 2 1 1 0 000-2zm0-6a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 4z"/>
                </svg>
                {error}
                <button onClick={() => setError(null)}>✕</button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-area">
        <div className={`input-box ${isBn ? 'bn-mode' : ''}`}>
          <div className="lang-indicator">
            <span className={`lang-badge ${isBn ? 'bn' : 'en'}`}>
              {isBn ? 'বাংলা' : 'English'}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e); }}
            onKeyDown={handleKeyDown}
            placeholder={isBn
              ? "বাংলাদেশের আইন সম্পর্কে আপনার প্রশ্ন লিখুন..."
              : "Ask your question about Bangladesh law in English or বাংলা..."
            }
            className={`chat-input ${isBn ? 'text-bn' : ''}`}
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            title="Send (Enter)"
          >
            {loading ? (
              <svg className="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                <path d="M10 2a8 8 0 018 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.105 3.105a1 1 0 011.29-.08L17.895 9.52a1 1 0 010 1.96L4.395 16.975a1 1 0 01-1.29-1.29l1.72-5.185H10a1 1 0 000-2H4.825L3.105 3.395a1 1 0 010-1.29z"/>
              </svg>
            )}
          </button>
        </div>
        <div className="input-hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line · Supports English &amp; বাংলা
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
