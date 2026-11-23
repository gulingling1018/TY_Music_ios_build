// 真实Chromium资源检测；HTTP成功不代表WKWebView自定义scheme兼容。
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../Resources/Web');
const output = path.resolve(__dirname, '../../docs/test-reports/evidence/[17]IOS_PROTOTYPE_20261114');
const mime = { '.mjs': 'application/javascript', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml' };

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, bytes) => {
      if (error) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
      res.end(bytes);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const report = { scope: 'Chromium HTTP assets only; not WKWebView/custom scheme or native audio', errors: [], layouts: [] };
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 375, height: 812 }, hasTouch: true });
    page.on('pageerror', error => report.errors.push(error.message));
    const origin = `http://127.0.0.1:${server.address().port}/`;
    await page.goto(origin);
    await page.waitForFunction(() => document.getElementById('message').textContent.includes('UNTRUSTED_ORIGIN'));
    await page.click('#resources');
    await page.waitForFunction(() => document.getElementById('resource-state').textContent.includes('blobImage'));
    report.first = JSON.parse(await page.locator('#resource-state').textContent());
    for (const [name, result] of Object.entries(report.first)) assert.equal(result.status, 'passed', `${name}: ${result.detail}`);
    await page.reload();
    await page.click('#resources');
    await page.waitForFunction(() => document.getElementById('resource-state').textContent.includes('blobImage'));
    report.afterReload = JSON.parse(await page.locator('#resource-state').textContent());
    assert.equal(report.afterReload.localStorage.detail.previous.text, '中文持久化');
    assert.equal(report.afterReload.indexedDB.detail.previousBlob, '中文素材');
    for (const width of [320, 375, 430]) {
      await page.setViewportSize({ width, height: 812 });
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      assert.ok(layout.scrollWidth <= width + 1);
      report.layouts.push(layout);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ path: path.join(output, 'resource-probe.png'), fullPage: true });
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.failure = error.message;
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
    fs.writeFileSync(path.join(output, 'web-resources.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  }
  console.log(JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
