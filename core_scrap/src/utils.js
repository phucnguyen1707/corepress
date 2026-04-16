import fs from "fs";
import path from "path";

export function setupWorkspace(outputDir) {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
}

export function extractBaseOrigin(input) {
  const url = new URL(input);
  return url.origin;
}

export function convertUrl(url, webUrl) {
  if (url.startsWith("http")) {
    return url;
  } else if (url.startsWith("//")) {
    return `https:${url}`;
  } else if (url.startsWith("/")) {
    return `${webUrl}${url}`;
  } else {
    return `${webUrl}/${url}`;
  }
}

export function createLog() {
  fs.writeFileSync("log.txt", "");
}

export function writeLog(msg) {
  try {
    fs.appendFileSync("log.txt", `\n${msg}`);
  } catch {
    // silently ignore log write failures
  }
}
