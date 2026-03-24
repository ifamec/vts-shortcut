import { useState, useEffect, useRef } from 'react';
import { ApiClient } from 'vtubestudio';
import './index.css';

function App() {
  const [api, setApi] = useState<ApiClient | null>(null);
  const [currentModel, setCurrentModel] = useState<{name: string, id: string} | null>(null);
  const [hotkeys, setHotkeys] = useState<any[]>([]);
  const [toggledHotkeys, setToggledHotkeys] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef<ApiClient | null>(null);

  useEffect(() => {
    if (apiRef.current) return; // Prevent double connection in React StrictMode

    const connectToVTS = async () => {
      try {
        const vts = new ApiClient({
          authTokenGetter: () => localStorage.getItem('vts_token'),
          authTokenSetter: async (token) => { localStorage.setItem('vts_token', token); },
          pluginName: 'VTS Shortcut Web',
          pluginDeveloper: 'Local Developer',
          url: `ws://${window.location.hostname}:8001`,
        });
        
        apiRef.current = vts;

        vts.on('connect', async () => {
          setApi(vts);
          setIsConnected(true);
          setError(null);

          try {
            // Fetch model
            const modelRes = await vts.currentModel();
            if (modelRes.modelLoaded) {
              setCurrentModel({ name: modelRes.modelName, id: modelRes.modelID });
              
              const hotkeyRes = await vts.hotkeysInCurrentModel({ modelID: modelRes.modelID });
              setHotkeys(hotkeyRes.availableHotkeys || []);
            } else {
              setCurrentModel(null);
              setHotkeys([]);
            }
          } catch (e: any) {
            console.error("Error fetching model/hotkeys", e);
          }
        });

        vts.on('disconnect', () => {
          setIsConnected(false);
          setCurrentModel(null);
          setHotkeys([]);
          setApi(null);
        });

        vts.on('error', (e: any) => {
          console.error('VTS Error', e);
          if (!isConnected) {
            setError('Failed to connect to VTubeStudio. Make sure it is running and the API is enabled on port 8001.');
          }
        });

        // Event: Model Loaded
        vts.events.modelLoaded.subscribe(async (data) => {
          if (data.modelLoaded) {
              setCurrentModel({ name: data.modelName, id: data.modelID });
              const hotkeyRes = await vts.hotkeysInCurrentModel({ modelID: data.modelID });
              setHotkeys(hotkeyRes.availableHotkeys || []);
              setToggledHotkeys({});
          } else {
              setCurrentModel(null);
              setHotkeys([]);
              setToggledHotkeys({});
          }
        }, {});

        // Event: Model Config Changed (Hotkeys added/removed)
        vts.events.modelConfigChanged.subscribe(async (data) => {
           if (data.hotkeyConfigChanged) {
              const hotkeyRes = await vts.hotkeysInCurrentModel({ modelID: data.modelID });
              setHotkeys(hotkeyRes.availableHotkeys || []);
           }
        }, {});

      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Failed to initialize VTubeStudio client.');
      }
    };

    connectToVTS();

    return () => {
      if (apiRef.current) {
         apiRef.current.disconnect();
         apiRef.current = null;
      }
    };
  }, []);

  const triggerHotkey = async (hotkeyID: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Visual toggle
    setToggledHotkeys(prev => ({
      ...prev,
      [hotkeyID]: !prev[hotkeyID]
    }));

    // Trigger animation
    e.currentTarget.classList.add('active-anim');
    setTimeout(() => {
        e.currentTarget.classList.remove('active-anim');
    }, 200);

    if (!api) return;
    try {
      await api.hotkeyTrigger({ hotkeyID });
    } catch (err: any) {
      console.error('Failed to trigger hotkey', err);
    }
  };

  const resetModel = async () => {
    if (!api || !currentModel) return;
    try {
      // Reloading the model acts as a full reset in VTS
      await api.modelLoad({ modelID: currentModel.id });
      setToggledHotkeys({});
    } catch (err: any) {
      console.error('Failed to reset model', err);
    }
  };

  const [activeTab, setActiveTab] = useState<string>('All');

  const hotkeyTypes = hotkeys.length > 0 
    ? ['All', ...Array.from(new Set(hotkeys.map(h => h.type)))] 
    : [];

  const filteredHotkeys = activeTab === 'All' 
    ? hotkeys 
    : hotkeys.filter(h => h.type === activeTab);

  return (
    <div className="container">
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
              <div className="tabs">
                {hotkeyTypes.map(type => (
                  <button 
                    key={type} 
                    className={`tab-btn ${activeTab === type ? 'active' : ''}`}
                    onClick={() => setActiveTab(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid">
                {filteredHotkeys.map((hotkey) => {
                  const isToggled = toggledHotkeys[hotkey.hotkeyID];
                  return (
                    <button 
                      key={hotkey.hotkeyID} 
                      className={`hotkey-card ${isToggled ? 'toggled' : ''}`}
                      onClick={(e) => triggerHotkey(hotkey.hotkeyID, e)}
                    >
                      <div className="hotkey-content">
                        <span className="hotkey-name">{hotkey.name}</span>
                        <span className="hotkey-type">{hotkey.type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
