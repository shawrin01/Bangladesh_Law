import React, { useState } from 'react';
import './ModelStatus.css';

function ModelStatus({ modelInfo }) {
  const [expanded, setExpanded] = useState(false);
  const [switchUrl, setSwitchUrl] = useState('');
  const [switching, setSwitching] = useState(false);
  const [localInfo, setLocalInfo] = useState(modelInfo);

  const switchModel = async (target) => {
    setSwitching(true);
    try {
      const res = await fetch('/api/model/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: target, customUrl: switchUrl || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setLocalInfo(prev => ({
          ...prev,
          activeModel: target,
          customModelUrl: data.customModelUrl,
          customModelConfigured: !!data.customModelUrl
        }));
      }
    } catch (e) {}
    setSwitching(false);
  };

  if (!localInfo) return null;
  const isCustom = localInfo.activeModel === 'custom';

  return (
    <div className="model-status-bar">
      <button className="model-status-btn" onClick={() => setExpanded(e => !e)}>
        <span className={`status-dot ${isCustom ? 'custom' : 'claude'}`}></span>
        <span className="status-text">
          {isCustom ? '🤖 Custom Model Active' : '⚡ Claude AI Active'}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="currentColor"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
        >
          <path d="M2 4l5 5 5-5"/>
        </svg>
      </button>

      {expanded && (
        <div className="model-panel fade-in-up">
          <div className="model-panel-title">Model Configuration</div>

          <div className="model-options">
            <button
              className={`model-opt ${!isCustom ? 'active' : ''}`}
              onClick={() => switchModel('claude')}
              disabled={switching}
            >
              <span>⚡</span>
              <div>
                <div className="opt-name">Claude AI</div>
                <div className="opt-desc">Powered by Anthropic Claude</div>
              </div>
              {!isCustom && <span className="opt-check">✓</span>}
            </button>

            <button
              className={`model-opt ${isCustom ? 'active' : ''}`}
              onClick={() => switchModel('custom')}
              disabled={switching || !localInfo.customModelConfigured}
            >
              <span>🤖</span>
              <div>
                <div className="opt-name">Your Custom Model</div>
                <div className="opt-desc">
                  {localInfo.customModelUrl
                    ? `URL: ${localInfo.customModelUrl.slice(0, 30)}...`
                    : 'Set ngrok URL below to enable'}
                </div>
              </div>
              {isCustom && <span className="opt-check">✓</span>}
            </button>
          </div>

          <div className="colab-section">
            <div className="colab-title">🔗 Connect Your Colab Model</div>
            <p className="colab-hint">
              Run your Colab model with ngrok, paste the public URL below:
            </p>
            <div className="url-input-row">
              <input
                type="url"
                placeholder="https://xxxx-xx-xx.ngrok.io"
                value={switchUrl}
                onChange={e => setSwitchUrl(e.target.value)}
                className="url-input"
              />
              <button
                className="url-apply-btn"
                onClick={() => { switchModel('custom'); }}
                disabled={!switchUrl || switching}
              >
                {switching ? 'Connecting...' : 'Connect & Switch'}
              </button>
            </div>
            <p className="colab-code-hint">
              Your Colab model should expose a <code>POST /predict</code> endpoint<br/>
              accepting <code>{'{"question": "...", "language": "en|bn"}'}</code> and returning<code>{'{"answer": "..."}'}</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelStatus;
