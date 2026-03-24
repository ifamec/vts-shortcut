interface HotkeyTabsProps {
  hotkeyTypes: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function HotkeyTabs({ hotkeyTypes, activeTab, setActiveTab }: HotkeyTabsProps) {
  if (hotkeyTypes.length === 0) return null;
  return (
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
  );
}
