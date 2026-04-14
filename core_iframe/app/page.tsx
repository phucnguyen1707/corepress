'use client';
import { useState, useEffect } from 'react';

import { useFiles } from '../hooks/useFiles';
import { useIframeHighlight } from '../hooks/useIframeHighlight';
import { Sidebar } from '../components/Sidebar';
import { ScrapeForm } from '../components/ScrapeForm';
import { ChatPanel } from '../components/ChatPanel';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showScrapeForm, setShowScrapeForm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  // eslint-disable-next-line react-hooks/purity
  const [reloadKey, setReloadKey] = useState(Date.now());

  const { files, groupedFiles, fetchFiles } = useFiles();
  const { iframeRef, injectScript, postHighlight } = useIframeHighlight();

  const isEmpty = files.length === 0;
  const scrapeFormVisible = isEmpty || showScrapeForm;

  const handleScrapeSuccess = () => {
    fetchFiles();
    setReloadKey(Date.now());
    setShowScrapeForm(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="app-container">
      <Sidebar
        groupedFiles={groupedFiles}
        onFileClick={postHighlight}
        onAddSite={() => setShowScrapeForm(true)}
        onToggleChat={() => setChatOpen((p) => !p)}
        chatOpen={chatOpen}
      />

      <main className="preview-area" style={{ position: 'relative' }}>
        {scrapeFormVisible && (
          <ScrapeForm
            dismissible={!isEmpty}
            onDismiss={() => setShowScrapeForm(false)}
            onSuccess={handleScrapeSuccess}
          />
        )}

        {mounted && !scrapeFormVisible && (
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src="http://localhost:3001"
            onLoad={injectScript}
          />
        )}
      </main>

      {chatOpen && <ChatPanel contextFiles={files} />}
    </div>
  );
}
