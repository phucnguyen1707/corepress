/**
 * @param {string} css
 */
function cssToJson(css) {
  const cleanCss = css.replace(/\n/g, " ").replace(/\s\s+/g, " ");

  const stack = [];
  let buffer = "";

  for (let i = 0; i < cleanCss.length; i++) {
    let char = cleanCss[i];

    if (char == "{") {
      stack.push({ [buffer.trim()]: {} });
      buffer = "";
    } else if (char == ";") {
      const lastObj = stack[stack.length - 1];
      const keyValue = buffer.split(":");
      lastObj[keyValue[0].trim()] = keyValue[1].trim();
      buffer = "";
    } else {
      buffer += char;
    }
  }

  console.log(stack);
}

// --- Usage Example ---
const cssInput = `
  .header-1 {
  	display: flex;
  	flex-direction: column;
  	position: sticky;
  	top: 0;
  	z-index: 100;
  	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .hdr-announce {
  		color: #fff;
  		font-size: 14px;
  		position: relative;
  		overflow: hidden;
  	}
  }`;

console.log(cssToJson(cssInput));
