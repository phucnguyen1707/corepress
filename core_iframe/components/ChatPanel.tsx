import { useChat } from '../hooks/useChat';

interface ChatPanelProps {
  contextFiles: string[];
}

export function ChatPanel({ contextFiles }: ChatPanelProps) {
  const {
    messages,
    input,
    setInput,
    loading,
    messagesEndRef,
    sendMessage,
    handleKeyDown,
  } = useChat({ contextFiles });

  return (
    <aside className="chat-panel">
      <div className="chat-panel-header">
        <span>AI Chat</span>
        <span className="chat-model-badge">Claude</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Ask anything about your scraped files…</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
            }`}
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
  );
}
