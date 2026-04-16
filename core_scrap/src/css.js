import fs from "fs";
import path from "path";
import * as csstree from "css-tree";

function extractUrlsFromAst(css) {
  const imageUrls = [];
  const fontUrls = [];

  let ast;
  try {
    ast = csstree.parse(css, { parseValue: true });
  } catch {
    return { imageUrls, fontUrls };
  }

  csstree.walk(ast, {
    visit: "Url",
    enter(node, item, list) {
      const url = node.value.trim().replace(/^['"]|['"]$/g, "");
      if (!url || url.startsWith("data:")) return;

      // Walk up to find if we're inside an @font-face rule
      let parent = this.atrule;
      if (parent && parent.name === "font-face") {
        fontUrls.push(url);
      } else {
        imageUrls.push(url);
      }
    },
  });

  return { imageUrls, fontUrls };
}

export async function extractUrlsFromCssString(css, downloader, cssContent) {
  const { imageUrls, fontUrls } = extractUrlsFromAst(css);

  for (const rawUrl of imageUrls) {
    cssContent = await downloader.downloadAndSave(rawUrl, cssContent);
  }

  for (const rawUrl of fontUrls) {
    cssContent = await downloader.downloadAndSave(rawUrl, cssContent);
  }

  return cssContent;
}

export async function processCssDirectory(downloader, outputDir) {
  const walkDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const files = walkDir(outputDir);

  for (const filePath of files) {
    if (path.extname(filePath) === ".css") {
      console.log(`Processing CSS file: ${filePath}`);
      let cssContent = fs.readFileSync(filePath, "utf-8");

      cssContent = await extractUrlsFromCssString(
        cssContent,
        downloader,
        cssContent
      );

      fs.writeFileSync(filePath, cssContent);
    }
  }
}
