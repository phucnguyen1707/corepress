import { execSync, spawn } from "child_process";
import robot from "robotjs";
import clipboardy from "clipboardy";

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";

const MOD_KEY = isMac ? "command" : "control";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function openBrowser(url) {
  if (isMac) {
    // macOS: try open with specific browsers
    try {
      execSync(`open -a Firefox "${url}"`, { stdio: "ignore" });
      console.log(`Opening Firefox with url: ${url}\n`);
      return;
    } catch {}
    try {
      execSync(`open -a "Google Chrome" "${url}"`, { stdio: "ignore" });
      console.log(`Opening Chrome with url: ${url}\n`);
      return;
    } catch {}
    // Fallback to default browser
    execSync(`open "${url}"`, { stdio: "ignore" });
    console.log(`Opening default browser with url: ${url}\n`);
  } else if (isWindows) {
    // Windows: try specific browsers then fallback
    const browsers = [
      ["C:\\Program Files\\Mozilla Firefox\\firefox.exe", "Firefox"],
      ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "Chrome"],
    ];
    for (const [path, name] of browsers) {
      try {
        spawn(path, ["--new-window", url], { detached: true, stdio: "ignore" }).unref();
        console.log(`Opening ${name} with url: ${url}\n`);
        return;
      } catch {}
    }
    // Fallback to default browser
    execSync(`start "" "${url}"`, { stdio: "ignore", shell: true });
    console.log(`Opening default browser with url: ${url}\n`);
  } else {
    // Linux: try specific browsers then fallback
    const browsers = ["firefox", "google-chrome", "chrome", "chromium"];
    for (const cmd of browsers) {
      try {
        spawn(cmd, ["--new-window", url], { detached: true, stdio: "ignore" }).unref();
        console.log(`Opening ${cmd} with url: ${url}\n`);
        return;
      } catch {}
    }
    // Fallback to xdg-open
    execSync(`xdg-open "${url}"`, { stdio: "ignore" });
    console.log(`Opening default browser with url: ${url}\n`);
  }
}

function closeBrowser() {
  if (isMac) {
    robot.keyTap("q", MOD_KEY);
  } else {
    robot.keyTap("f4", "alt");
  }
}

export async function fetchHtml(webUrl) {
  console.log("-----------------------------");
  console.log("Extracting HTML via Browser");
  console.log("-----------------------------");

  openBrowser(webUrl);

  console.log("Waiting for 10 seconds\n");
  await sleep(10000);

  console.log("View page source\n");
  robot.keyTap("u", MOD_KEY);
  await sleep(3000);

  console.log("Copying html\n");
  robot.keyTap("a", MOD_KEY);
  robot.keyTap("c", MOD_KEY);

  console.log("Waiting for 1.5 seconds\n");
  await sleep(1500);

  console.log("Closing browser\n");
  closeBrowser();

  console.log("Getting clipboard content\n");
  return clipboardy.read();
}
