'use client';
import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [showScrapeForm, setShowScrapeForm] = useState(false);
  const [url, setUrl] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [scraping, setScraping] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isEmpty = files.length === 0;

  const fetchFiles = () => {
    fetch('http://localhost:3001/api/files')
      .then((res) => res.json())
      .then(setFiles);
  };

  const groupedFiles =
    files.length > 0 &&
    files.reduce(
      (acc, file) => {
        const folder = file.includes('/') ? file.split('/')[1] : 'root';
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(file);
        return acc;
      },
      {} as Record<string, string[]>
    );

  const toggleFolder = (folder: string) =>
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));

  const scrapeFormVisible = isEmpty || showScrapeForm;

  const injectScript = () => {
    const iframe = iframeRef.current;
    if (!iframe) {
      console.log('[inject] no iframe ref');
      return;
    }

    try {
      const doc = iframe.contentDocument;
      console.log(
        '[inject] readyState:',
        doc?.readyState,
        '| body:',
        !!doc?.body,
        '| already injected:',
        !!doc?.body?.dataset.highlightInjected
      );

      if (!doc?.body) {
        setTimeout(injectScript, 50);
        return;
      }
      if (doc.body.dataset.highlightInjected) return;

      doc.body.dataset.highlightInjected = 'true';

      const script = doc.createElement('script');
      script.innerHTML = `
      console.log('[iframe] ✅ listener attached on', window.location.href);
      window.addEventListener('message', function(event) {
        console.log('[iframe received]', event.data);
      });
    `;
      doc.body.appendChild(script);
      console.log('[inject] ✅ script appended');
    } catch (err) {
      console.warn('[inject] ❌ FAILED:', err); // <-- this is the key line
    }
  };

  const afterScrape = () => {
    fetchFiles();
    setReloadKey(Date.now()); // force reload
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMounted(true);
    fetchFiles();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `You are an AI assistant embedded in a web scraper tool.
The user has scraped websites and the following files are available: ${files.join(', ') || 'none yet'}.
Help the user understand their scraped content, answer questions about the files, and assist with web scraping tasks.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages,
        }),
      });

      const data = await response.json();
      const assistantText = data.content?.[0]?.text ?? 'No response.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleScrape = async () => {
    if (!url || !outputDir || scraping) return;
    setScraping(true);
    try {
      const res = await fetch('http://localhost:3001/api/scrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, outputDir }),
      });
      if (!res.ok) throw new Error('Scrape failed');
      afterScrape();
      setUrl('');
      setOutputDir('');
    } catch (err) {
      console.error(err);
    } finally {
      setScraping(false);
    }
  };

  let hoverTimeout: NodeJS.Timeout;

  const handleClickImage = (file: string | null) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      console.log('[postMessage] sending', { type: 'HIGHLIGHT_IMAGE', file });
      const win = iframeRef.current?.contentWindow;
      console.log('[postMessage] contentWindow exists?', !!win);
      win?.postMessage({ type: 'HIGHLIGHT_IMAGE', file }, '*');
    }, 50);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div
          className="sidebar-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2>Explorer</h2>
          <button className="add-btn" onClick={() => setShowScrapeForm(true)}>
            + Add site
          </button>
        </div>
        <div className="file-list">
          {Object.entries(groupedFiles || {}).map(([folder, fileList]) => (
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
                  {fileList.map((file) => (
                    <li
                      key={file}
                      onClick={() => handleClickImage(file)}
                      className={
                        file.includes('.svg') ||
                        file.includes('.png') ||
                        file.includes('.jpg') ||
                        file.includes('.jpeg')
                          ? 'clickable'
                          : 'non-clickable'
                      }
                      style={{
                        cursor:
                          file.includes('.svg') ||
                          file.includes('.png') ||
                          file.includes('.jpg') ||
                          file.includes('.jpeg')
                            ? 'pointer'
                            : 'default',
                        color:
                          file.includes('.svg') ||
                          file.includes('.png') ||
                          file.includes('.jpg') ||
                          file.includes('.jpeg')
                            ? '#9cdcfe'
                            : '#666',
                      }}
                    >
                      {file.split('/').pop()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Chat toggle button at bottom of sidebar */}
        <button
          className="chat-toggle-btn"
          onClick={() => setChatOpen((p) => !p)}
        >
          {chatOpen ? '✕ Close chat' : '💬 AI Chat'}
        </button>
      </aside>

      <main className="preview-area" style={{ position: 'relative' }}>
        {scrapeFormVisible && (
          <div className="scrape-overlay">
            <div className="scrape-card">
              {!isEmpty && (
                <button
                  className="close-btn"
                  onClick={() => setShowScrapeForm(false)}
                >
                  ✕
                </button>
              )}
              <h2>Scrape a website</h2>
              <p>Enter a URL and folder name to save the files locally.</p>
              <label>Website URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={scraping}
              />
              <label>Folder name</label>
              <input
                type="text"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
                placeholder="my-site"
                disabled={scraping}
              />
              <button
                className="scrape-btn"
                disabled={scraping || !url || !outputDir}
                onClick={handleScrape}
              >
                {scraping ? 'Scraping…' : 'Scrape website'}
              </button>
            </div>
          </div>
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

      {/* AI Chat Panel */}
      {chatOpen && (
        <aside className="chat-panel">
          <div className="chat-panel-header">
            <span>AI Chat</span>
            <span className="chat-model-badge">Claude</span>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <p className="chat-empty">
                Ask anything about your scraped files…
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-ai chat-loading">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Claude…"
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ↑
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
