const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const url = process.env.GENESIS_HUB_TEST_URL || 'http://127.0.0.1:3012';
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.GENESIS_CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1080}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.locator('[data-project-code="0550"]').waitFor();
    assert.equal(await page.locator('[data-project-code]').count(), 4);
    const routes = [
      ['0550', '/projects/pj2608-0550', 'PJ2608-0550', 'ASK Onshore Telecom'],
      ['0553', '/projects/pj2608-0553', 'PJ2608-0553', 'PJ2608-0553'],
      ['0510', '/projects/pj2601-0510/sat', 'PJ2601-0510', 'SAT Document Workspace'],
      ['0541', '/projects/0541', '0541', '0541 — รอเชื่อม workspace เดิม'],
    ];
    for (const [code, path, id, heading] of routes) {
      await page.goto(url);
      const card = page.locator(`[data-project-code="${code}"]`);
      assert.equal(await card.getAttribute('href'), path);
      assert.equal(await page.locator('nav a').filter({hasText: id}).getAttribute('href'), path);
      await card.click();
      await page.locator('main h1').filter({hasText: heading}).first().waitFor({timeout: 60000});
      assert.equal(new URL(page.url()).pathname, path);
      await page.reload();
      await page.locator('main h1').filter({hasText: heading}).first().waitFor({timeout: 60000});
      assert.equal(await page.getByRole('alert').count(), 0);
      if (code === '0510') {
        await page.getByRole('button', {name: 'SAT Tests', exact: true}).click();
        await page.getByRole('heading', {name: 'SAT Test Register'}).waitFor();
        assert.deepEqual(await page.locator('main tbody select').evaluateAll(nodes => nodes.map(node => node.value)), Array(4).fill('NOT TESTED'));
        assert.match(await page.locator('.project-hub-service-note').innerText(), /8051/);
      }
      if (code === '0541') assert.match(await page.locator('main').innerText(), /ยังไม่มีข้อมูลวิศวกรรมหรือราคา/);
      await page.locator('nav a[href="/"]').click();
      await page.locator('[data-project-code="0550"]').waitFor();
    }
    for (const [code, path, id, heading] of routes.slice(0, 3)) {
      await page.locator(`nav a[href="${path}"]`).click();
      await page.locator('main h1').filter({hasText: heading}).first().waitFor({timeout: 60000});
    }
    await page.goto(url + '/projects/pj2601-0510');
    await page.waitForURL('**/projects/pj2601-0510/sat');
    await page.goto(url + '/projects/not-registered');
    await page.getByRole('heading', {name: 'ไม่พบหน้าที่เรียก'}).waitFor();
    await page.goto(url + '/projects');
    await page.waitForURL(url + '/');
    await page.getByLabel('Language').selectOption('en');
    await page.getByRole('heading', {name: 'All projects', exact: true}).waitFor();
    assert.equal(await page.locator('nav a').filter({hasText: 'PJ2608-0553'}).count(), 1);
    await page.getByLabel('Language').selectOption('th');
    if (process.env.GENESIS_HUB_SCREENSHOT) await page.screenshot({path: process.env.GENESIS_HUB_SCREENSHOT, fullPage: true});
    await page.setViewportSize({width: 390, height: 844});
    assert.equal(await page.locator('[data-project-code]').count(), 4);
    const widths = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, view: innerWidth}));
    assert(widths.scroll <= widths.view + 1, 'Project directory overflows mobile viewport');
    assert.deepEqual(errors, [], 'Unexpected runtime exceptions');
    console.log('PASS project hub: four cards/nav targets, three workspaces, truthful 0541 status, direct reloads, same-tab transitions, 0510 tests, language, aliases, missing-route fallback and mobile width.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
