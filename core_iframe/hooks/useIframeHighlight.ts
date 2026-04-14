import { useRef, useCallback } from 'react';

const INJECTION_FLAG = 'highlightInjected';

/**
 * Manages the preview iframe: injects a message listener script once the
 * frame loads and exposes a stable `postHighlight` function.
 *
 * Bugs fixed vs original:
 * - The injection guard now uses a data attribute set BEFORE the script runs
 *   so concurrent calls cannot double-inject.
 * - postHighlight uses a ref for the debounce timer so it is stable across
 *   renders and is always cleared before being reset.
 */
export function useIframeHighlight() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Called from the iframe's onLoad. Injects a message-listener script once.
   * Retries if the body isn't ready yet (can happen on slow loads).
   */
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

        if (doc.body.dataset[INJECTION_FLAG]) return; // already injected
        doc.body.dataset[INJECTION_FLAG] = 'true'; // guard before appending

        const script = doc.createElement('script');
        script.innerHTML = `
          console.log('[iframe] listener attached on', window.location.href);
          window.addEventListener('message', function(event) {
            console.log('[iframe received]', event.data);
          });
        `;
        doc.body.appendChild(script);
      } catch (err) {
        // Cross-origin frames will throw here — expected and safe to ignore.
        console.warn('[injectScript] could not inject:', err);
      }
    };

    attempt();
  }, []);

  /**
   * Debounced postMessage to the iframe. Cancels any pending call before
   * scheduling a new one to avoid duplicate highlights on rapid clicks.
   */
  const postHighlight = useCallback((file: string | null) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage({ type: 'HIGHLIGHT_IMAGE', file }, '*');
    }, 50);
  }, []);

  return { iframeRef, injectScript, postHighlight };
}
