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

// Host the scraped files
app.use(express.static(path.join(__dirname, "public/web")));

// New API to list all files
app.get("/api/files", (_req, res) => {
  try {
    const files = getAllFiles(path.join(__dirname, "public"));
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
