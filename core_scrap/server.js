import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.path.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/)) {
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

app.use(express.static(path.join(__dirname, "web")));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/api/files", (_req, res) => {
  try {
    const files = getAllFiles(path.join(__dirname, "web"));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Could not list files" });
  }
});

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      let relativePath = path.relative(path.join(__dirname, "public"), fullPath);
      relativePath = relativePath.split(path.sep).join("/");
      arrayOfFiles.push(relativePath);
    }
  });

  return arrayOfFiles;
}

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
  
  // make sure target dir is exits
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // know the file name incoming
  const watcher = fs.watch(targetDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      // Send real-time data to frontend
      const data = JSON.stringify({ file: filename });
      res.write(`data: ${data}\n\n`);
    }
  });

  // do this if user refresh page
  req.on("close", () => {
    watcher.close();
  });
});


app.post("/api/scrap", async (req, res) => {
  try {
    const { url, outputDir } = req.body;

    let fetchResponse = await fetch("http://localhost:8081/scrap", {
      method: "POST",
      body: JSON.stringify({ web_url: url, output_dir: outputDir }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!fetchResponse.ok) throw new Error("Scraper failed to process");
    
    const responseText = await fetchResponse.text();
    console.log(responseText);

    res.json({ message: "Website scrapped successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});