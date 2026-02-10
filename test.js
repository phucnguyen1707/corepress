/**
 * @param {string} css
 */
function cssToJson(css) {
  const cleanCss = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ");

  const root = {};
  const stack = [root];
  let buffer = "";

  for (let i = 0; i < cleanCss.length; i++) {
    const char = cleanCss[i];

    if (char === "{") {
      const selector = buffer.trim();
      const parent = stack[stack.length - 1];
      parent[selector] = parent[selector] || {};
      stack.push(parent[selector]);
      buffer = "";
    } else if (char === "}") {
      if (buffer.trim()) {
        const firstColon = buffer.indexOf(":");
        if (firstColon > -1) {
          const key = buffer.slice(0, firstColon).trim();
          const value = buffer.slice(firstColon + 1).trim();
          stack[stack.length - 1][key] = Number.isNaN(Number(value))
            ? value
            : Number(value);
        }
      }
      stack.pop();
      buffer = "";
    } else if (char === ";") {
      const firstColon = buffer.indexOf(":");
      const parent = stack[stack.length - 1];

      if (firstColon > -1) {
        const key = buffer.slice(0, firstColon).trim();
        const value = buffer.slice(firstColon + 1).trim();
        parent[key] = Number.isNaN(Number(value)) ? value : Number(value);
      }

      buffer = "";
    } else {
      buffer += char;
    }
  }

  return root;
}

// --- Usage Example ---
const cssInput = `
.header-1 {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-1 .hdr-announce {
  color: #fff;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.header-1 .hdr-announce::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

.header-1 .hdr-announce .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-1 .announce-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-1 .announce-icon {
  width: 18px;
  height: 18px;
}

.header-1 .announce-text {
  margin: 0;
  font-weight: 500;
}

.header-1 .announce-promo {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.header-1 .announce-close {
  background: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.header-1 .announce-close svg {
  width: 16px;
  height: 16px;
}

.header-1 .announce-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

.header-1 .hdr-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-1 .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 24px;
  color: #1a202c;
  cursor: pointer;
}

.header-1 .logo-icon {
  width: 28px;
  height: 28px;
  color: #667eea;
}

.header-1 .nav {
  display: flex;
  gap: 32px;
  align-items: center;
}

.header-1 .nav-link {
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #4a5568;
  transition: color 0.2s ease;
  position: relative;
  padding: 8px 0;
}

.header-1 .nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.header-1 .nav-link:hover {
  color: #667eea;
}

.header-1 .nav-link:hover::after {
  width: 100%;
}

.header-1 .hdr-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-1 .action-btn {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.header-1 .action-btn svg {
  width: 20px;
  height: 20px;
  color: #4a5568;
}

.header-1 .action-btn:hover {
  background: #f7fafc;
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.header-1 .cart-btn {
  position: relative;
}

.header-1 .cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 200%;
  }
}

@media (max-width:900px) {
  .header-1 .nav {
    display: none;
  }

  .header-1 .hdr-inner {
    padding: 16px 20px;
  }

  .header-1 .announce-text {
    font-size: 12px;
  }
}`;

console.log(JSON.stringify(cssToJson(cssInput), null, 2));
