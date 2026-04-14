import { useState, useRef, useEffect } from 'react';
import { useScrape } from '../hooks/useScrape';

interface ScrapeFormProps {
  dismissible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function ScrapeForm({
  dismissible,
  onDismiss,
  onSuccess,
}: ScrapeFormProps) {
  const [url, setUrl] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const { scrape, scraping, error, logs, milestone } = useScrape({
    onSuccess: () => {
      setUrl('');
      setOutputDir('');
      onSuccess();
    },
  });

  const handleSubmit = () => scrape({ url, outputDir });

  // Auto-scroll the terminal logs to the bottom as new files arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="scrape-overlay">
      <div className="scrape-card" style={{ minWidth: '400px' }}>
        {dismissible && !scraping && (
          <button className="close-btn" onClick={onDismiss}>
            ✕
          </button>
        )}

        {!scraping ? (
          // ========================================
          // DEFAULT FORM VIEW
          // ========================================
          <>
            <h2>Scrape a website</h2>
            <p>Enter a URL and folder name to save the files locally.</p>

            <label htmlFor="scrape-url">Website URL</label>
            <input
              id="scrape-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />

            <label htmlFor="scrape-dir">Folder name</label>
            <input
              id="scrape-dir"
              type="text"
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              placeholder="my-site"
            />

            {error && (
              <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>
            )}

            <button
              className="scrape-btn"
              disabled={!url || !outputDir}
              onClick={handleSubmit}
            >
              Scrape website
            </button>
          </>
        ) : (
          // ========================================
          // ULTIMATE UX: REAL-TIME PROGRESS VIEW
          // ========================================
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <h2 style={{ textAlign: 'center', margin: 0 }}>{milestone}</h2>

            <p
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'gray',
                margin: 0,
              }}
            >
              {logs.length} files downloaded
            </p>

            {/* Terminal Window */}
            <div
              style={{
                backgroundColor: '#1e1e1e',
                color: '#4ade80', // hacker green
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                height: '250px',
                overflowY: 'auto',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {logs.length === 0 ? (
                <div style={{ color: '#888' }}>Waiting for server...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index}>
                    <span style={{ color: '#888' }}>
                      [{new Date().toLocaleTimeString()}]
                    </span>{' '}
                    {log}
                  </div>
                ))
              )}
              {/* Invisible div to scroll to */}
              <div ref={logEndRef} />
            </div>

            {error && (
              <p
                style={{
                  color: '#ef4444',
                  textAlign: 'center',
                  marginTop: '10px',
                }}
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
