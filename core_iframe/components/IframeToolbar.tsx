interface IframeToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onReload: () => void;
  device: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  iframeSrc: string;
}

const DEVICES = [
  { key: 'desktop' as const, label: 'Desktop', icon: '🖥', width: '100%' },
  { key: 'tablet' as const, label: 'Tablet', icon: '📱', width: '768px' },
  { key: 'mobile' as const, label: 'Mobile', icon: '📲', width: '375px' },
];

export function IframeToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onReload,
  device,
  onDeviceChange,
  iframeSrc,
}: IframeToolbarProps) {
  return (
    <div className="iframe-toolbar">
      {/* Device selector */}
      <div className="toolbar-group">
        {DEVICES.map((d) => (
          <button
            key={d.key}
            className={`toolbar-device-btn ${device === d.key ? 'active' : ''}`}
            onClick={() => onDeviceChange(d.key)}
            title={`${d.label} (${d.width})`}
          >
            {d.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      {/* URL bar */}
      <div className="toolbar-url-bar">
        <span className="url-icon">&#128274;</span>
        <span className="url-text">{iframeSrc}</span>
      </div>

      <div className="toolbar-divider" />

      {/* Zoom */}
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onZoomOut} title="Zoom out">
          −
        </button>
        <button
          className="toolbar-zoom-value"
          onClick={onZoomReset}
          title="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button className="toolbar-btn" onClick={onZoomIn} title="Zoom in">
          +
        </button>
      </div>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" onClick={onReload} title="Reload">
        ↻
      </button>
    </div>
  );
}

export const DEVICE_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
} as const;
