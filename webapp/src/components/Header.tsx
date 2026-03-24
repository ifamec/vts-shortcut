import React from 'react';

interface HeaderProps {
  currentModel: { name: string; id: string } | null;
  isConnected: boolean;
  networkLinks: string[];
  resetModel: () => void;
  setShowNetworkPopup: (show: boolean) => void;
}

export function Header({ currentModel, isConnected, networkLinks, resetModel, setShowNetworkPopup }: HeaderProps) {
  return (
    <header>
      <div className="header-content">
        <h1>VTubeStudio Shortcuts</h1>
        <div className="header-actions">
          {currentModel && (
            <button className="reset-btn" onClick={resetModel} title="Reload model to clear all toggled states">
              <svg className="reset-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Reset Model
            </button>
          )}
          {networkLinks.length > 0 && (
            <button className="network-btn" onClick={() => setShowNetworkPopup(true)} title="View Local Network Links">
              <svg className="network-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                <line x1="12" y1="20" x2="12.01" y2="20"/>
              </svg>
            </button>
          )}
          <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="dot"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>
      <div className="model-bar">
        <span className="model-label">Current Model:</span>
        <span className="model-name">{currentModel ? currentModel.name : 'Not Connected'}</span>
      </div>
    </header>
  );
}
