import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mime from "mime-types";
import livereload from "livereload";
import connectLivereload from "connect-livereload";

import { setupWorkspace, extractBaseOrigin, createLog } from "./src/utils.js";
import { fetchHtml } from "./src/browser.js";
import { Downloader } from "./src/downloader.js";
import { processHtml } from "./src/html.js";
import { processCssDirectory } from "./src/css.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// State: track file enabled/disabled status
const fileState = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Livereload setup
const lrServer = livereload.createServer({ delay: 300 });
lrServer.watch(path.join(__dirname, "web"));
app.use(connectLivereload());

// --- HTML injection middleware for serving scraped site preview ---
app.use((req, res, next) => {
  // Skip static asset requests
  if (req.path.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/)) {
    return next();
  }

  // Skip API and admin routes
  if (req.path.startsWith("/api/")) {
    return next();
  }

  const staticPath = path.join(
    __dirname,
    "web",
    req.path === "/" ? "index.html" : req.path,
  );
  if (!fs.existsSync(staticPath)) return next();

  let html = fs.readFileSync(staticPath, "utf-8");

  const script = `
  <script>
    window.addEventListener('message', function(event) {
      document.querySelectorAll('img[data-highlighted]').forEach(function(el) {
        el.style.outline = '';
        el.removeAttribute('data-highlighted');
      });
      var file = event.data && event.data.file;
      if (!file) return;
      var relativePath = file.replace('../web/', '/');
      document.querySelectorAll('img').forEach(function(img) {
        if (img.src && img.src.includes(relativePath)) {
          img.style.outline = '3px solid #f97316';
          img.setAttribute('data-highlighted', 'true');
          img.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  </script>`;

  html = html.replace("</body>", script + "</body>");
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

// Serve static files from web/
app.use(express.static(path.join(__dirname, "web")));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// --- API Routes ---

// GET /api/files - List all files in web/
// Returns an array of file paths (for core_iframe compatibility)
// or an object with enabled status when ?format=admin is passed (for admin dashboard)
app.get("/api/files", (_req, res) => {
  try {
    const files = [];
    const webDir = path.join(__dirname, "web");

    const walkDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const relativePath = path
            .relative(webDir, fullPath)
            .replace(/\\/g, "/");

          // Check if the file is enabled in your fileState map
          const isEnabled = fileState.has(relativePath)
            ? fileState.get(relativePath)
            : true;

          // Push BOTH the path and the state as a combined object
          files.push({
            path: relativePath,
            enabled: isEnabled
          });
        }
      }
    };

    walkDir(webDir);

    // Return the combined array to the frontend
    res.json(files);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not list files" });
  }
});

// POST /api/toggle - Toggle a file's enabled/disabled status
app.post("/api/toggle", (req, res) => {
  const { filepath, enabled } = req.body;
  fileState.set(filepath, enabled);
  res.sendStatus(200);
});

// POST /api/save - Delete all disabled files
app.post("/api/save", (req, res) => {
  const webDir = path.join(__dirname, "web");
  for (const [filePath, isEnabled] of fileState.entries()) {
    if (!isEnabled) {
      const fullPath = path.join(webDir, filePath);
      try {
        fs.unlinkSync(fullPath);
      } catch {
        // ignore if file doesn't exist
      }
    }
  }
  res.send("Unnecessary files deleted successfully!");
});

// GET /api/scrap-progress - SSE endpoint for scrape progress
app.get("/api/scrap-progress", (req, res) => {
  const folderName = req.query.folder;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  if (!folderName) {
    return res.end();
  }

  const targetDir = path.join(__dirname, "web", folderName);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const watcher = fs.watch(targetDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      const data = JSON.stringify({ file: filename });
      res.write(`data: ${data}\n\n`);
    }
  });

  req.on("close", () => {
    watcher.close();
  });
});

// POST /api/scrap - Start scraping a URL (now handled directly)
app.post("/api/scrap", async (req, res) => {
  try {
    const { url, outputDir } = req.body;

    if (!url || !outputDir) {
      return res.status(400).json({ error: "Missing url or outputDir" });
    }

    const fullOutputDir = path.join(__dirname, "web", outputDir);

    setupWorkspace(fullOutputDir);
    createLog();

    let htmlContent = await fetchHtml(url);
    const baseOrigin = extractBaseOrigin(url);
    const downloader = new Downloader(baseOrigin, fullOutputDir);

    console.log("Processing HTML Assets");
    htmlContent = await processHtml(downloader, htmlContent);
    fs.writeFileSync(path.join(fullOutputDir, "index.html"), htmlContent);

    console.log("Processing CSS Assets");
    await processCssDirectory(downloader, fullOutputDir);

    console.log("Scraping completed successfully!");
    res.json({ message: "Website scrapped successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /web/* - Serve web files with interception (disabled files return empty)
app.get("/web/{*filepath}", (req, res) => {
  const filePath = Array.isArray(req.params.filepath)
    ? req.params.filepath.join("/")
    : req.params.filepath;
  const isEnabled = fileState.has(filePath) ? fileState.get(filePath) : true;
  const fullPath = path.join(__dirname, "web", filePath);
  const mimeType = mime.lookup(fullPath) || "application/octet-stream";

  if (!isEnabled) {
    res.set("Content-Type", mimeType);
    return res.status(200).send("");
  }

  if (!fs.existsSync(fullPath)) {
    return res.sendStatus(404);
  }

  res.set("Content-Type", mimeType);
  res.send(fs.readFileSync(fullPath));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
