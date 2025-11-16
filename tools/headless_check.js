import { chromium } from 'playwright';

const url = 'https://whisper-of-hope-report.vercel.app/';
const outScreenshot = 'vercel_live.png';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const consoleMessages = [];
const networkErrors = [];

page.on('console', msg => {
  try {
    consoleMessages.push({ type: msg.type(), text: msg.text(), location: msg.location() });
  } catch (e) {
    consoleMessages.push({ type: 'console', text: msg.text() });
  }
});

page.on('pageerror', err => {
  consoleMessages.push({ type: 'pageerror', text: err.message, stack: err.stack });
});

page.on('response', response => {
  const status = response.status();
  if (status >= 400) {
    networkErrors.push({ url: response.url(), status, statusText: response.statusText() });
  }
});

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
} catch (err) {
  consoleMessages.push({ type: 'gotoError', text: err.message });
}

// wait a short time for any runtime errors to surface
await page.waitForTimeout(2000);

try {
  await page.screenshot({ path: outScreenshot, fullPage: true });
} catch (e) {
  consoleMessages.push({ type: 'screenshotError', text: e.message });
}

const html = await page.content();

console.log('---CONSOLE_MESSAGES---');
console.log(JSON.stringify(consoleMessages, null, 2));
console.log('---NETWORK_ERRORS---');
console.log(JSON.stringify(networkErrors, null, 2));
console.log('---HTML_SNIPPET_START---');
console.log(html.slice(0, 2000));
console.log('---HTML_SNIPPET_END---');

await browser.close();