import { useState } from 'react';
import { useVTubeStudio } from './hooks/useVTubeStudio';
import { useNetworkLinks } from './hooks/useNetworkLinks';
import { Header } from './components/Header';
import { NetworkModal } from './components/NetworkModal';
import { HotkeyTabs } from './components/HotkeyTabs';
import { HotkeyGrid } from './components/HotkeyGrid';
import './index.css';

function App() {
  const { currentModel, isConnected, error, hotkeys, toggledHotkeys, triggerHotkey, resetModel } = useVTubeStudio();
  const { networkLinks } = useNetworkLinks();
  const [showNetworkPopup, setShowNetworkPopup] = useState(false);
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
          <div className="section-header">
            <h2>Available Hotkeys</h2>
          </div>
          {hotkeys.length === 0 ? (
            <div className="empty-state">
              <p>No hotkeys found for this model or not connected.</p>
            </div>
          ) : (
            <div className="hotkeys-container">
              <HotkeyTabs hotkeyTypes={hotkeyTypes} activeTab={currentTab} setActiveTab={setActiveTab} />
              <HotkeyGrid filteredHotkeys={filteredHotkeys} toggledHotkeys={toggledHotkeys} triggerHotkey={triggerHotkey} />
            </div>
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
