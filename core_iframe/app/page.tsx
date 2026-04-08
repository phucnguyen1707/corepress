'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    fetch('http://localhost:3001/api/files')
      .then((res) => res.json())
      .then(setFiles);
  }, []);

  const groupedFiles = files.reduce(
    (acc, file) => {
      const folder = file.includes('/') ? file.split('/')[0] : 'root';
      if (!acc[folder]) acc[folder] = [];
      acc[folder].push(file);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleFileClick = (file: string) => {
    // Only proceed if it's an image
    if (!file.startsWith('img/')) return;

    setSelectedFile(file);

    const selectorMap: Record<string, string> = {
      'img/go-logo-white.svg': '.js-headerLogo',
      'img/ladder.svg': '.Hero-gopherLadder',
      // add your image mappings here
    };

    const iframe = document.querySelector('iframe');
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'HIGHLIGHT_FILE',
          selector: selectorMap[file] || 'img', // Default to highlighting images
        },
        '*'
      );
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Explorer</h2>
        </div>
        <div className="file-list">
          {Object.entries(groupedFiles).map(([folder, fileList]) => (
            <div key={folder} className="folder-group">
              <div
                className="folder-title"
                onClick={() => toggleFolder(folder)}
              >
                <span
                  className={`arrow ${expandedFolders[folder] ? 'open' : ''}`}
                >
                  ▶
                </span>
                {folder}
              </div>
              {expandedFolders[folder] && (
                <ul className="file-items">
                  {fileList.map((file) => {
                    const isImageFolder = folder === 'img';

                    return (
                      <li
                        key={file}
                        onClick={() =>
                          isImageFolder ? handleFileClick(file) : null
                        }
                        className={
                          isImageFolder ? 'clickable' : 'non-clickable'
                        }
                        style={{
                          cursor: isImageFolder ? 'pointer' : 'default',
                          color: isImageFolder ? '#9cdcfe' : '#666',
                        }}
                      >
                        {file.split('/').pop()}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="preview-area">
        {mounted && (
          <iframe
            src="http://localhost:3001"
            title="Preview"
            // onLoad={handleIframeLoad}
          />
        )}
      </main>
    </div>
  );
}
