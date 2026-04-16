import { useRef, useCallback } from 'react';

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

            if (data.type === 'TOGGLE_FILE') {
              var filePath = data.file;
              var enabled = data.enabled;
              // Convert ../web/site/path to /site/path for matching
              var matchPath = '/' + filePath.replace(/^\\.\\.\\/web\\//, '');

              // Try CSS: match <link href="..."> and <style> with data-file
              document.querySelectorAll('link[rel="stylesheet"]').forEach(function(el) {
                if (el.href && el.href.includes(matchPath)) {
                  el.disabled = !enabled;
                }
              });

              // Try JS: can't truly disable after load, but we can remove/re-add script tags
              // For scripts loaded via <script src>, we toggle a visual indicator
              document.querySelectorAll('script[src]').forEach(function(el) {
                if (el.src && el.src.includes(matchPath)) {
                  if (!enabled) {
                    el.dataset.toggledOff = 'true';
                    el.type = 'text/disabled';
                  }
                }
              });
              // Show badge for disabled JS files
              var disabledScripts = document.querySelectorAll('script[data-toggled-off]');
              var jsBadge = document.getElementById('__js_disabled_badge');
              if (disabledScripts.length > 0) {
                if (!jsBadge) {
                  jsBadge = document.createElement('div');
                  jsBadge.id = '__js_disabled_badge';
                  jsBadge.style.cssText = 'position:fixed;bottom:8px;right:8px;background:#ef4444;color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;z-index:99999;font-family:sans-serif;opacity:0.9;';
                  document.body.appendChild(jsBadge);
                }
                jsBadge.textContent = disabledScripts.length + ' JS file(s) disabled (reload to apply)';
              } else if (jsBadge) {
                jsBadge.remove();
              }

              // Try fonts: match <link href="..."> for font files or @font-face in stylesheets
              var fontExts = ['.woff', '.woff2', '.ttf', '.eot', '.otf'];
              var isFont = fontExts.some(function(ext) { return matchPath.toLowerCase().endsWith(ext); });
              if (isFont) {
                // Disable preload/font links
                document.querySelectorAll('link').forEach(function(el) {
                  if (el.href && el.href.includes(matchPath)) {
                    el.disabled = !enabled;
                  }
                });
                // Toggle @font-face rules that reference this file
                for (var s = 0; s < document.styleSheets.length; s++) {
                  try {
                    var rules = document.styleSheets[s].cssRules;
                    for (var r = 0; r < rules.length; r++) {
                      if (rules[r].type === CSSRule.FONT_FACE_RULE) {
                        var src = rules[r].style.getPropertyValue('src') || '';
                        if (src.includes(matchPath.split('/').pop())) {
                          if (!enabled) {
                            rules[r].__origSrc = src;
                            rules[r].style.setProperty('src', 'none');
                          } else if (rules[r].__origSrc) {
                            rules[r].style.setProperty('src', rules[r].__origSrc);
                          }
                        }
                      }
                    }
                  } catch(e) {}
                }
              }

              // Try images: match <img src="...">
              document.querySelectorAll('img').forEach(function(img) {
                if ((img.src && img.src.includes(matchPath)) ||
                    (img.dataset.originalSrc && img.dataset.originalSrc.includes(matchPath))) {
                  if (!enabled) {
                    if (!img.dataset.originalSrc) {
                      img.dataset.originalSrc = img.src;
                    }
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    img.style.opacity = '0.15';
                    img.style.outline = '2px dashed #ef4444';
                  } else {
                    if (img.dataset.originalSrc) {
                      img.src = img.dataset.originalSrc;
                      delete img.dataset.originalSrc;
                    }
                    img.style.opacity = '';
                    img.style.outline = '';
                  }
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

  const toggleFile = useCallback((file: string, enabled: boolean) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: 'TOGGLE_FILE', file, enabled }, '*');
  }, []);

  return { iframeRef, injectScript, postHighlight, toggleFile };
}
