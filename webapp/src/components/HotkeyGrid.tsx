interface HotkeyGridProps {
  filteredHotkeys: any[];
  toggledHotkeys: Record<string, boolean>;
  triggerHotkey: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function HotkeyGrid({ filteredHotkeys, toggledHotkeys, triggerHotkey }: HotkeyGridProps) {
  return (
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
  );
}
