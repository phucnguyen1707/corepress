import { useRef, useCallback } from 'react';
import { API_BASE } from './useFiles';

const INJECTION_FLAG = 'highlightInjected';

export function useIframeHighlight() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const injectScript = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const attempt = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc?.body) {
          setTimeout(attempt, 50);
          return;
        }

        if (doc.body.dataset[INJECTION_FLAG]) return;
        doc.body.dataset[INJECTION_FLAG] = 'true';

        const script = doc.createElement('script');
        script.innerHTML = `
          window.addEventListener('message', function(event) {
            var data = event.data;
            if (!data || !data.type) return;

            if (data.type === 'HIGHLIGHT_IMAGE') {
              document.querySelectorAll('img[data-highlighted]').forEach(function(el) {
                el.style.outline = '';
                el.removeAttribute('data-highlighted');
              });
              var file = data.file;
              if (!file) return;
              var relativePath = '/' + file.replace(/^\\.\\.\\/web\\//, '');
              document.querySelectorAll('img').forEach(function(img) {
                if (img.src && img.src.includes(relativePath)) {
                  img.style.outline = '3px solid #f97316';
                  img.setAttribute('data-highlighted', 'true');
                  img.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              });
            }
          });
        `;
        doc.body.appendChild(script);
      } catch (err) {
        console.warn('[injectScript] could not inject:', err);
      }
    };

    attempt();
  }, []);

  const postHighlight = useCallback((file: string | null) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage({ type: 'HIGHLIGHT_IMAGE', file }, '*');
    }, 50);
  }, []);

  const toggleFile = useCallback(async (file: string, enabled: boolean) => {
    await fetch(`${API_BASE}/api/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepath: file, enabled }),
    });
  }, []);

  return { iframeRef, injectScript, postHighlight, toggleFile };
}
