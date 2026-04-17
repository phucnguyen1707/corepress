'use client';
import { useState, useEffect, useCallback } from 'react';

import { useFiles } from '../hooks/useFiles';
import { useIframeHighlight } from '../hooks/useIframeHighlight';
import { Sidebar } from '../components/Sidebar';
import { ScrapeForm } from '../components/ScrapeForm';
import { ChatPanel } from '../components/ChatPanel';
import { IframeToolbar, DEVICE_WIDTHS } from '../components/IframeToolbar';
import { FileDetailPanel } from '../components/FileDetailPanel';
import type { FileInfo } from '../components/Sidebar';

const IFRAME_SRC = 'http://localhost:3001';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showScrapeForm, setShowScrapeForm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  // eslint-disable-next-line react-hooks/purity
  const [reloadKey, setReloadKey] = useState(Date.now());
  const [zoom, setZoom] = useState(1);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );

  const [detailFile, setDetailFile] = useState<FileInfo | null>(null);

  const { files, filePaths, fetchFiles } = useFiles();

  const { iframeRef, injectScript, toggleFile } = useIframeHighlight();

  const isEmpty = files.length === 0;
  const scrapeFormVisible = isEmpty || showScrapeForm;

  const handleScrapeSuccess = () => {
    fetchFiles();
    setReloadKey(Date.now());
    setShowScrapeForm(false);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.25));
  const handleZoomReset = () => setZoom(1);
  const handleReload = () => setReloadKey(Date.now());

  const handleToggleFile = useCallback(
    async (filePath: string, statusFile: boolean) => {
      await toggleFile(filePath, statusFile);
      await fetchFiles();
      setReloadKey(Date.now());
    },
    [toggleFile, fetchFiles]
  );

  useEffect(() => {
    setMounted(true);
    fetchFiles();
  }, [fetchFiles]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (detailFile) setDetailFile(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [detailFile]);

  const deviceWidth = DEVICE_WIDTHS[device];

  return (
    <div className="app-container">
      <Sidebar
        files={files}
        onFileDetail={(file) => setDetailFile(file)}
        onToggleFile={handleToggleFile}
        onAddSite={() => setShowScrapeForm(true)}
        onToggleChat={() => setChatOpen((p) => !p)}
        chatOpen={chatOpen}
      />

      <main className="preview-area">
        {scrapeFormVisible && (
          <ScrapeForm
            dismissible={!isEmpty}
            onDismiss={() => setShowScrapeForm(false)}
            onSuccess={handleScrapeSuccess}
          />
        )}

        {mounted && !scrapeFormVisible && (
          <>
            <IframeToolbar
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              onReload={handleReload}
              device={device}
              onDeviceChange={setDevice}
              iframeSrc={IFRAME_SRC}
            />
            <div className="iframe-wrapper">
              <div
                className="iframe-device-frame"
                style={{
                  width: deviceWidth,
                  maxWidth: '100%',
                  margin: device !== 'desktop' ? '0 auto' : undefined,
                  height: '100%',
                }}
              >
                <iframe
                  key={reloadKey}
                  ref={iframeRef}
                  src={IFRAME_SRC}
                  onLoad={injectScript}
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`,
                    minWidth: '100%',
                    minHeight: '100%',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {chatOpen && <ChatPanel contextFiles={filePaths} />}

      {detailFile && (
        <FileDetailPanel
          file={detailFile}
          onClose={() => setDetailFile(null)}
        />
      )}
    </div>
  );
}
