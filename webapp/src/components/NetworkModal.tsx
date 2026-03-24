
import { QRCodeSVG } from 'qrcode.react';

interface NetworkModalProps {
  networkLinks: string[];
  setShowNetworkPopup: (show: boolean) => void;
}

export function NetworkModal({ networkLinks, setShowNetworkPopup }: NetworkModalProps) {
  return (
    <div className="modal-overlay" onClick={() => setShowNetworkPopup(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Network Access</h2>
          <button className="close-btn" onClick={() => setShowNetworkPopup(false)}>×</button>
        </div>
        <div className="modal-body">
          <p>Scan the QR code or visit the link on your mobile device to control VTubeStudio remotely on port 10086.</p>
          <div className="links-list">
            {networkLinks.map(link => (
              <div key={link} className="qr-card">
                <QRCodeSVG value={link} size={150} level="H" includeMargin={true} />
                <a href={link} target="_blank" rel="noreferrer" className="network-link">{link}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
