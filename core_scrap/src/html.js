import * as cheerio from "cheerio";
import { extractUrlsFromCssString } from "./css.js";

export async function processHtml(downloader, htmlContent) {
  const $ = cheerio.load(htmlContent);

  const downloadUrls = [];
  const styleContents = [];

  $("script, link, img, image, style").each((_, el) => {
    const tag = el.tagName;

    if (tag === "script" || tag === "link") {
      const src = $(el).attr("src") || $(el).attr("href");
      const typeAttr = $(el).attr("type") || "";
      const rel = $(el).attr("rel") || "";

      if (
        src &&
        ((src.includes(".js") && typeAttr !== "application/json") ||
          (src.includes(".css") && rel === "stylesheet"))
      ) {
        downloadUrls.push(src);
      }
    } else if (tag === "img" || tag === "image") {
      const src = $(el).attr("src");
      if (src) {
        downloadUrls.push(src);
      }
    } else if (tag === "style") {
      styleContents.push($(el).html());
    }
  });

  // Process standard assets (JS, CSS, Images)
  for (const url of downloadUrls) {
    htmlContent = await downloader.downloadAndSave(url, htmlContent);
  }

  // Process inline CSS <style> tags
  for (const style of styleContents) {
    if (!style) continue;
    let modifiedStyle = await extractUrlsFromCssString(
      style,
      downloader,
      style
    );
    htmlContent = htmlContent.replace(style, modifiedStyle);
  }

  return htmlContent;
}
