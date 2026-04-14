import { useState } from 'react';

const API_BASE = 'http://localhost:3001';

interface ScrapeParams {
  url: string;
  outputDir: string;
}

interface UseScrapeOptions {
  onSuccess: () => void;
}

export function useScrape({ onSuccess }: UseScrapeOptions) {
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New States for the Ultimate UX
  const [logs, setLogs] = useState<string[]>([]);
  const [milestone, setMilestone] = useState('');

  const scrape = async ({ url, outputDir }: ScrapeParams) => {
    if (!url || !outputDir || scraping) return;

    setScraping(true);
    setError(null);
    setLogs([]);
    setMilestone('Initializing scraper...');

    // 1. Open SSE connection to listen for files BEFORE we trigger the scrape
    const eventSource = new EventSource(
      `${API_BASE}/api/scrap-progress?folder=${outputDir}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.file) {
        // Add file to logs
        setLogs((prev) => [...prev, data.file]);

        // Dynamically update the milestone text based on what is being downloaded
        const lowerFile = data.file.toLowerCase();
        if (lowerFile.endsWith('.html')) setMilestone('Fetching web pages...');
        else if (lowerFile.endsWith('.css') || lowerFile.endsWith('.js'))
          setMilestone('Processing CSS & JS...');
        else if (lowerFile.match(/\.(png|jpg|jpeg|svg|webp|gif)$/i))
          setMilestone('Downloading images...');
        else if (lowerFile.match(/\.(woff|woff2|ttf)$/i))
          setMilestone('Downloading fonts...');
        else setMilestone('Writing files to disk...');
      }
    };

    // 2. Trigger the actual Scraper
    try {
      const res = await fetch(`${API_BASE}/api/scrap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, outputDir }),
      });

      if (!res.ok) throw new Error(`Scrape failed: ${res.statusText}`);

      // Success! Update UI, wait 1.5s so user sees "Complete" before closing modal
      setMilestone('Scraping Complete! ✅');

      setTimeout(() => {
        eventSource.close();
        setScraping(false);
        onSuccess();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setMilestone('Scraping failed! ❌');
      eventSource.close();
      setScraping(false);
      console.error('[useScrape]', err);
    }
  };

  return { scrape, scraping, error, logs, milestone };
}
