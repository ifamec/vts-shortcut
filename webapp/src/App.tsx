import { useState } from 'react';
import { useVTubeStudio } from './hooks/useVTubeStudio';
import { useNetworkLinks } from './hooks/useNetworkLinks';
import { Header } from './components/Header';
import { NetworkModal } from './components/NetworkModal';
import { ExpressionGrid } from './components/ExpressionGrid';
import { HotkeyTabs } from './components/HotkeyTabs';
import { HotkeyGrid } from './components/HotkeyGrid';
import './index.css';

function App() {
  const { 
    currentModel, isConnected, error, resetModel,
    expressions, toggledExpressions, toggleExpression,
    hotkeys, toggledHotkeys, triggerHotkey
  } = useVTubeStudio();
  
  const { networkLinks } = useNetworkLinks();
  const [showNetworkPopup, setShowNetworkPopup] = useState(false);
  const [viewMode, setViewMode] = useState<'Expressions' | 'Hotkeys'>('Expressions');
  const [activeTab, setActiveTab] = useState<string>('All');

  const hotkeyTypes = hotkeys.length > 0 
    ? ['All', ...Array.from(new Set(hotkeys.map(h => h.type)))] 
    : [];

  const currentTab = hotkeyTypes.includes(activeTab) ? activeTab : 'All';

  const filteredHotkeys = currentTab === 'All' 
    ? hotkeys 
    : hotkeys.filter(h => h.type === currentTab);

  return (
    <div className="container">
      <Header 
        currentModel={currentModel} 
        isConnected={isConnected} 
        networkLinks={networkLinks} 
        resetModel={resetModel} 
        setShowNetworkPopup={setShowNetworkPopup} 
      />
      
      {error && <div className="error-banner">{error}</div>}

      <main>
        <section className="hotkeys-section">
          <div className="section-header view-mode-header">
            <div className="view-mode-tabs">
              <button 
                className={`view-mode-btn ${viewMode === 'Expressions' ? 'active' : ''}`}
                onClick={() => setViewMode('Expressions')}
              >
                Expressions ({expressions.length})
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'Hotkeys' ? 'active' : ''}`}
                onClick={() => setViewMode('Hotkeys')}
              >
                Hotkeys ({hotkeys.length})
              </button>
            </div>
          </div>
          
          {viewMode === 'Expressions' && (
            expressions.length === 0 ? (
              <div className="empty-state">
                <p>No expressions found for this model or not connected.</p>
              </div>
            ) : (
              <div className="hotkeys-container">
                <ExpressionGrid 
                   expressions={expressions} 
                   toggledExpressions={toggledExpressions} 
                   toggleExpression={toggleExpression} 
                />
              </div>
            )
          )}

          {viewMode === 'Hotkeys' && (
            hotkeys.length === 0 ? (
              <div className="empty-state">
                <p>No hotkeys found for this model or not connected.</p>
              </div>
            ) : (
              <div className="hotkeys-container">
                <HotkeyTabs hotkeyTypes={hotkeyTypes} activeTab={currentTab} setActiveTab={setActiveTab} />
                <HotkeyGrid filteredHotkeys={filteredHotkeys} toggledHotkeys={toggledHotkeys} triggerHotkey={triggerHotkey} />
              </div>
            )
          )}
        </section>
      </main>

      {showNetworkPopup && (
        <NetworkModal networkLinks={networkLinks} setShowNetworkPopup={setShowNetworkPopup} />
      )}
    </div>
  );
}

export default App;
