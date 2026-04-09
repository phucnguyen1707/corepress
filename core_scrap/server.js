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

  const staticPath = path.join(__dirname, "web", req.path === "/" ? "index.html" : req.path);
  if (!fs.existsSync(staticPath)) return next();

  let html = fs.readFileSync(staticPath, "utf-8");

  const script = `
  <script>
    window.addEventListener('message', function(event) {
      console.log('[iframe received]', event.data);
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

  html = html.replace('</body>', script + '</body>');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-store');
  res.send(html);
});

// Host the scraped files
app.use(express.static(path.join(__dirname, "web")));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// New API to list all files
app.get("/api/files", (_req, res) => {
  try {
    const files = getAllFiles(path.join(__dirname, "web"));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Could not list files" });
  }
});

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      let relativePath = path.relative(
        path.join(__dirname, "public"),
        fullPath,
      );
      relativePath = relativePath.split(path.sep).join("/");
      arrayOfFiles.push(relativePath);
    }
  });

  return arrayOfFiles;
}

app.post("/api/scrap", (req, res) => {
  try {
    const { url, outputDir } = req.body;

    const output = execSync(
      `./tool/life-scrap --url ${url} --output-dir ${outputDir}`,
      {
        encoding: "utf-8",
        stdio: "pipe",
      },
    );

    console.log(output);

    res.json({ message: "Website scrapped successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
