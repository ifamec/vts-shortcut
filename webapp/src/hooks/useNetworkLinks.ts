import { useState, useEffect } from 'react';

export function useNetworkLinks() {
  const [networkLinks, setNetworkLinks] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const goObj = (window as any).go;
        if (goObj && goObj.main && goObj.main.App && goObj.main.App.GetNetworkLinks) {
          const links = await goObj.main.App.GetNetworkLinks();
          setNetworkLinks(links || []);
        }
      } catch(e) { console.error('Failed fetching network links', e); }
    };
    fetchLinks();
  }, []);

  return { networkLinks };
}
