import { useState, useRef, useEffect } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatOptions {
  /** Context injected into the system prompt (e.g. list of scraped files). */
  contextFiles: string[];
}

export function useChat({ contextFiles }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = [
        'You are an AI assistant embedded in a web scraper tool.',
        `The user has scraped websites and the following files are available: ${contextFiles.join(', ') || 'none yet'}.`,
        'Help the user understand their scraped content, answer questions about the files, and assist with web scraping tasks.',
      ].join('\n');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: nextMessages,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      const assistantText: string = data.content?.[0]?.text ?? 'No response.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantText },
      ]);
    } catch (err) {
      console.error('[useChat]', err);
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

  return {
    messages,
    input,
    setInput,
    loading,
    messagesEndRef,
    sendMessage,
    handleKeyDown,
  };
}
