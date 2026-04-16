import { useState, useEffect } from 'react';
import type { FileInfo } from './Sidebar';

const API_BASE = 'http://localhost:3001';

interface FileDetailPanelProps {
  file: FileInfo;
  onClose: () => void;
}

function getFileType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  if (['html', 'htm'].includes(ext)) return 'html';
  if (['css'].includes(ext)) return 'css';
  if (['js', 'mjs'].includes(ext)) return 'javascript';
  if (['json'].includes(ext)) return 'json';
  if (['svg'].includes(ext)) return 'svg';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico'].includes(ext))
    return 'image';
  if (['woff', 'woff2', 'ttf', 'eot', 'otf'].includes(ext)) return 'font';
  return 'unknown';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDetailPanel({ file, onClose }: FileDetailPanelProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileType = getFileType(file.path);
  const fileName = file.path.split('/').pop() || file.path;
  const fetchPath = '/' + file.path;

  useEffect(() => {
    setLoading(true);
    setError(null);
    setContent(null);
    setCopied(false);

    if (fileType === 'image' || fileType === 'font') {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}${fetchPath}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [file.path, fileType, fetchPath]);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const lineCount = content ? content.split('\n').length : 0;

  return (
    <div className="file-detail-overlay" onClick={onClose}>
      <div className="file-detail-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="file-detail-header">
          <div className="file-detail-title">
            <span className={`file-type-badge badge-${fileType}`}>
              {fileType.toUpperCase()}
            </span>
            <h3>{fileName}</h3>
          </div>
          <div className="file-detail-actions">
            {content !== null && (
              <button className="detail-action-btn" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="file-detail-meta">
          <div className="meta-row">
            <span className="meta-label">Source</span>
            <span className="meta-value mono">{file.sourcePath}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Relative</span>
            <span className="meta-value mono">{file.path}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Size</span>
            <span className="meta-value">{formatFileSize(file.size)}</span>
            {lineCount > 0 && (
              <>
                <span className="meta-sep">|</span>
                <span className="meta-label">Lines</span>
                <span className="meta-value">{lineCount}</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="file-detail-content">
          {loading && <div className="file-detail-loading">Loading...</div>}

          {error && (
            <div className="file-detail-error">Failed to load: {error}</div>
          )}

          {!loading && fileType === 'image' && (
            <div className="file-detail-image">
              <img
                src={`${API_BASE}${fetchPath}`}
                alt={fileName}
              />
            </div>
          )}

          {!loading && fileType === 'font' && (
            <div className="file-detail-font">
              <style>{`@font-face { font-family: 'preview-font'; src: url('${API_BASE}${fetchPath}'); }`}</style>
              <p
                className="font-preview-large"
                style={{ fontFamily: 'preview-font' }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <p
                className="font-preview-small"
                style={{ fontFamily: 'preview-font' }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz
                0123456789 !@#$%^&*()
              </p>
              <div className="font-preview-sizes">
                {[12, 16, 20, 28, 36, 48].map((size) => (
                  <span
                    key={size}
                    style={{ fontFamily: 'preview-font', fontSize: `${size}px` }}
                  >
                    Aa
                  </span>
                ))}
              </div>
            </div>
          )}

          {!loading &&
            content !== null &&
            fileType !== 'image' &&
            fileType !== 'font' && (
              <div className="code-wrapper">
                <div className="line-numbers">
                  {content.split('\n').map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <pre className="file-detail-code">
                  <code>{content}</code>
                </pre>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
