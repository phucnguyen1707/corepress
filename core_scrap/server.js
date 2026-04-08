const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Host the scraped files
app.use(express.static(path.join(__dirname, 'public')));

// New API to list all files
app.get('/api/files', (req, res) => {
  try {
    const files = getAllFiles(path.join(__dirname, 'public'));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Could not list files' });
  }
});

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      let relativePath = path.relative(path.join(__dirname, 'public'), fullPath);
      relativePath = relativePath.split(path.sep).join('/');
      arrayOfFiles.push(relativePath);
    }
  });

  return arrayOfFiles;
}

app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});