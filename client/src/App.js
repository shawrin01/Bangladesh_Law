import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import ModelStatus from './components/ModelStatus';
import './styles/App.css';
import './styles/variables.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    // Generate session ID
    const sessionId = `session_${Date.now()}`;
    setCurrentSession(sessionId);

    // Fetch model status
    fetch('/api/model/status')
      .then(r => r.json())
      .then(setModelInfo)
      .catch(() => {});
  }, []);

  const startNewChat = () => {
    const sessionId = `session_${Date.now()}`;
    setCurrentSession(sessionId);
    setConversations([]);
  };

  return (
    <div className="app">
      <Header
        onMenuToggle={() => setSidebarOpen(o => !o)}
        onNewChat={startNewChat}
        sidebarOpen={sidebarOpen}
      />
      <div className="app-body">
        {sidebarOpen && (
          <Sidebar
            onNewChat={startNewChat}
            currentSession={currentSession}
          />
        )}
        <main className="main-content">
          {modelInfo && <ModelStatus modelInfo={modelInfo} />}
          <ChatInterface
            sessionId={currentSession}
            conversations={conversations}
            setConversations={setConversations}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
