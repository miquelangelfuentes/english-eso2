import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const pages = readdirSync('.')
  .filter((name) => name === 'index.html' || /^unit\d+(?:-(?:reforc|ampliacio))?\.html$/.test(name))
  .sort();

const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await sleep(1200);

const browser = await chromium.launch({ headless: true });
const failures = [];

async function audit(page, file, theme, scope = 'page') {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: { type: 'rule', values: ['color-contrast'] },
      resultTypes: ['violations'],
    });
  });

  for (const violation of result.violations) {
    for (const node of violation.nodes) {
      failures.push({
        file,
        theme,
        scope,
        target: node.target.join(' '),
        html: node.html.slice(0, 240),
        summary: node.failureSummary,
      });
    }
  }
}

try {
  for (const theme of ['light', 'dark']) {
    for (const file of pages) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
      const page = await context.newPage();
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem('eso2-portal-theme', selectedTheme);
      }, theme);
      await page.goto(`http://127.0.0.1:4173/${file}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      await audit(page, file, theme);

      if (await page.locator('#units-modal').count()) {
        await page.locator('#units-modal').evaluate((modal) => {
          modal.classList.remove('hidden');
          modal.setAttribute('aria-hidden', 'false');
        });
        await page.waitForTimeout(50);
        await audit(page, file, theme, 'units-modal');
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.kill('SIGTERM');
}

if (failures.length) {
  console.error(`Contrast audit failed with ${failures.length} issue(s).`);
  for (const issue of failures.slice(0, 120)) {
    console.error(`\n[${issue.theme}] ${issue.file} (${issue.scope})`);
    console.error(`Target: ${issue.target}`);
    console.error(`HTML: ${issue.html}`);
    console.error(issue.summary || '');
  }
  if (failures.length > 120) console.error(`\n... ${failures.length - 120} additional issue(s) omitted.`);
  process.exit(1);
}

console.log(`Contrast audit passed: ${pages.length} pages checked in light and dark mode, including unit modals.`);
