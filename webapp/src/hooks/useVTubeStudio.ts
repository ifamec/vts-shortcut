import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiClient } from 'vtubestudio';

export function useVTubeStudio() {
  const [api, setApi] = useState<ApiClient | null>(null);
  const [currentModel, setCurrentModel] = useState<{name: string, id: string} | null>(null);
  const [hotkeys, setHotkeys] = useState<any[]>([]);
  const [toggledHotkeys, setToggledHotkeys] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef<ApiClient | null>(null);

  useEffect(() => {
    if (apiRef.current) return;

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

  const triggerHotkey = useCallback(async (hotkeyID: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setToggledHotkeys(prev => ({
      ...prev,
      [hotkeyID]: !prev[hotkeyID]
    }));

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
  }, [api]);

  const resetModel = useCallback(async () => {
    if (!api || !currentModel) return;
    try {
      await api.modelLoad({ modelID: currentModel.id });
      setToggledHotkeys({});
    } catch (err: any) {
      console.error('Failed to reset model', err);
    }
  }, [api, currentModel]);

  return { api, currentModel, hotkeys, toggledHotkeys, isConnected, error, triggerHotkey, resetModel };
}
