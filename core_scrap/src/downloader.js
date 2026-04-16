import axios from "axios";
import fs from "fs";
import path from "path";
import { convertUrl, writeLog } from "./utils.js";

export class Downloader {
  constructor(baseUrl, outputDir) {
    this.baseUrl = baseUrl;
    this.outputDir = outputDir;
    this.client = axios.create({
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
      },
      timeout: 10000,
      responseType: "arraybuffer",
    });
  }

  async downloadAndSave(rawSrc, content) {
    if (
      rawSrc.startsWith("data:") ||
      rawSrc.startsWith("#") ||
      rawSrc === ""
    ) {
      return content;
    }

    // 1. Parse the full URL
    let parsedUrl;
    try {
      parsedUrl = new URL(convertUrl(rawSrc, this.baseUrl));
    } catch {
      return content;
    }

    // 1.2 Ensure we don't try to save weird URL schemes
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return content;
    }

    // 2. Extract the path, ignoring the query
    const urlPath = parsedUrl.pathname;
    const relativePath = urlPath.replace(/^\//, "");

    // 3. Build the local file path
    const writePath = path.join(this.outputDir, relativePath);

    // 4. Create the folder structure if it doesn't exist
    const parentDir = path.dirname(writePath);
    fs.mkdirSync(parentDir, { recursive: true });

    // 5. The path that will replace rawSrc in the HTML
    const replacePath = `/${this.outputDir}/${relativePath}`;

    for (let attempt = 0; attempt <= 10; attempt++) {
      if (attempt > 0) {
        console.log(`Retry Attempt ${attempt} Fetching ${parsedUrl.href}`);
      } else {
        console.log(`Fetching ${parsedUrl.href}`);
      }

      try {
        const response = await this.client.get(parsedUrl.href);

        if (response.status >= 200 && response.status < 300) {
          console.log(`Saving to: ${writePath}`);

          try {
            fs.writeFileSync(writePath, Buffer.from(response.data));
          } catch (e) {
            console.error(`Failed to write file ${writePath}: ${e.message}`);
            return content;
          }

          console.log(`Replacing: ${rawSrc} -> ${replacePath}`);
          content = content.replaceAll(rawSrc, replacePath);
          console.log("-----------------------------");
          return content;
        } else {
          console.error(
            `HTTP Error ${response.status}: ${parsedUrl.href}`
          );
        }
      } catch (err) {
        console.error(`Error fetching ${parsedUrl.href}: ${err.message}`);
      }
    }

    writeLog(`Failed to fetch after 10 retries: ${parsedUrl.href}`);
    return content;
  }
}
