// Isolated browser only. Optional exact private DATA paths are never bundled in Git.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), cp = require('node:child_process'), {chromium} = require('playwright');
const root = path.resolve(__dirname, '..'), temp = fs.mkdtempSync(path.join(os.tmpdir(), '0550-constraints-browser-')), fixture = path.join(temp, 'pair.json');
if (!process.argv[2]) cp.execFileSync(process.execPath, [path.join(__dirname, 'validate-pj2608-0550-source-workspace-auto.cjs')], {env: {...process.env, PJ0550_AUTO_FIXTURE: fixture}, stdio: 'pipe'});
const bundle = process.argv[2] ? {schema: 'genesis.0550.source-workspace.v1', sourceIntake: JSON.parse(fs.readFileSync(process.argv[2])), aWorkPackage: JSON.parse(fs.readFileSync(process.argv[3]))} : JSON.parse(fs.readFileSync(fixture));
const server = http.createServer((req, res) => {
 const url = req.url.split('?')[0];
 if (url === '/api/local/pj2608-0550/source-workspace') {res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(bundle));}
 if (url.startsWith('/api/local/')) {res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({code: 'DRIVE_SOURCE_NOT_FOUND'}));}
 const file = /^\/(?:bundle|\d+(?:\.bundle)?)\.(?:js|css)$/.test(url) ? path.join(root, 'dist', url) : path.join(root, 'public/index.html');
 res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html'); res.end(fs.readFileSync(file));
});
(async () => {
 let browser; await new Promise(r => server.listen(0, '127.0.0.1', r));
 try {
  browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage']});
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}}), errors = []; page.on('pageerror', e => {errors.push(e.message); console.error('APP_PAGE_ERROR', e.message);}); page.setDefaultTimeout(60000);
  const read = () => page.evaluate(() => new Promise(resolve => {const q = indexedDB.open('GENESIS-PJ2608-0550-BIDDING', 1); q.onsuccess = () => {const db = q.result, t = db.transaction('workspace'), r = t.objectStore('workspace').get('active'); r.onsuccess = () => resolve(r.result); t.oncomplete = () => db.close();};}));
  // Scope controls directly: real source excerpts make whole-document label scans expensive.
  const navigate = async id => {const search = page.locator('input[aria-label="Project Module Search"]'); await search.fill(id); await page.locator('.p55-module-results button').filter({has: page.getByText(id, {exact: true})}).click();};
  await page.goto('http://127.0.0.1:' + server.address().port + '/projects/pj2608-0550');
  console.log('CHECK constraints: page loaded; waiting for canonical DATA receipt');
  await page.getByRole('button', {name: 'CUS · Customer Requirements', exact: true}).click();
  await page.locator('.p55-a-operating-tools > summary').click();
  await page.getByLabel('Source intake loaded status', {exact: true}).filter({hasText: bundle.sourceIntake.batchId}).waitFor();
  const before = await read(); console.log('CHECK constraints: DATA receipt saved', before.sourceIntake.sources.length); await navigate('bid.working-preview.step.1');
  const preview = page.locator('section.p55-working-preview'), select = preview.locator('select[aria-label="Working Preview system"]'); await select.waitFor();
  const tokens = await select.locator('option').evaluateAll(es => es.map(e => e.value).filter(v => v !== 'ALL'));
  assert(tokens.includes('COMMON')); assert.equal(tokens.length, 20);
  const overview = preview.getByRole('table', {name: 'All system scope reviews', exact: true});
  assert.equal(await overview.locator('tbody tr').count(), 20);
  const vsat = overview.locator('[data-system-responsibility="TEL-VSAT"]');
  assert((await vsat.innerText()).includes('COMPANY รับผิดชอบ'));
  await vsat.getByRole('button', {name: 'ตรวจขอบเขต', exact: true}).click();
  assert.equal(await select.inputValue(), 'TEL-VSAT');
  assert.equal(await overview.locator('tbody tr').count(), 1);
  await preview.getByLabel('Scope completeness / applicability basis', {exact: true}).waitFor();
  assert.equal(JSON.stringify(await read()), JSON.stringify(before), 'Opening responsibility/scope review never saves or approves');
  const supplyGroup = overview.locator('details').filter({has: page.locator('summary', {hasText: /^TSI จัดหา/})}).first();
  await supplyGroup.locator('summary').click();
  const requirementButton = supplyGroup.getByRole('button').first();
  const requirementTitle = await requirementButton.innerText();
  await requirementButton.click();
  await preview.locator('[data-component-key="bid.working-preview.step.4"]').locator('select[aria-label="Working requirement"]').waitFor();
  assert((await preview.locator('[data-component-key="bid.working-preview.step.4"]').innerText()).includes(requirementTitle));
  await navigate('bid.working-preview.step.1');
  assert.equal(JSON.stringify(await read()), JSON.stringify(before), 'Responsibility group opens the existing editor without saving');
  await select.selectOption('ALL');
  for (const width of [1440, 390]) {await page.setViewportSize({width, height: 900}); await overview.scrollIntoViewIfNeeded(); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Overview fits viewport ' + width);}
  await page.setViewportSize({width: 1440, height: 1000});
  const inspectedTokens = process.argv[2] ? ['TEL-LAN-VCS', 'TEL-VSAT', 'TEL-VSAT-KU', 'TEL-AIS', 'TEL-LAN', 'TEL-CCTV', 'COMMON'] : tokens;
  for (const token of inspectedTokens) {await select.selectOption(token); const set = preview.locator('section.p55-system-constraints'); await set.waitFor(); assert((await set.innerText()).includes(token)); assert(await set.getByRole('table', {name: 'System constraint requirements', exact: true}).count()); console.log('CHECK constraints: scope', token);}
  await select.selectOption('TEL-LAN'); const set = preview.locator('section.p55-system-constraints');
  await set.locator('input[aria-label="System constraint search"]').fill('no-such-constraint'); assert.equal(await set.getByRole('table', {name: 'System constraint requirements', exact: true}).locator('tbody tr').count(), 0);
  await set.locator('input[aria-label="System constraint search"]').fill('');
  const common = set.locator('details').filter({has: page.locator('summary', {hasText: /^COMMON ที่ต้องพิจารณาร่วม/})}).first(); await common.locator('summary').first().click(); assert(await set.getByRole('table', {name: 'Common constraint context', exact: true}).count());
  assert.equal(JSON.stringify(await read()), JSON.stringify(before), 'Inspecting all scopes/common/search leaves saved workspace unchanged');
  console.log('CHECK constraints: search and COMMON context preserved workspace');
  const row = set.getByRole('table', {name: 'System constraint requirements', exact: true}).locator('tbody tr').first();
  const identity = await row.locator('td').first().locator('small').first().innerText();
  await row.getByRole('button', {name: 'เปิด record เดิม', exact: true}).click();
  const editorSelection = preview.locator('[data-component-key="bid.working-preview.step.4"]').locator('select[aria-label="Working requirement"]');
  await editorSelection.waitFor();
  const selected = await editorSelection.inputValue(); assert(identity.includes(selected));
  assert.equal(JSON.stringify(await read()), JSON.stringify(before), 'Opening the original editor does not save a draft');
  await navigate('bid.working-preview.step.1'); await select.selectOption('TEL-LAN');
  const sourceButton = set.getByRole('table', {name: 'System constraint requirements', exact: true}).getByRole('button', {name: /^อ่าน A ·/}).first();
  if (await sourceButton.count()) {await sourceButton.click(); await page.locator('section[aria-label="MR driven A workspace"]').waitFor(); await navigate('bid.working-preview.step.1'); await select.selectOption('TEL-LAN');}
  for (const width of [1440, 390]) {await page.setViewportSize({width, height: 900}); await set.scrollIntoViewIfNeeded(); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Constraint panel fits viewport ' + width);}
  if (process.env.PJ0550_CONSTRAINT_SCREENSHOT) await page.screenshot({path: process.env.PJ0550_CONSTRAINT_SCREENSHOT, fullPage: false});
  assert.equal(JSON.stringify(await read()), JSON.stringify(before), 'Read/edit/source navigation preserves user inputs and frozen history');
  await page.reload(); await navigate('bid.working-preview.step.1'); await select.waitFor(); assert.equal(JSON.stringify(await read()), JSON.stringify(before), 'Reload is idempotent with the existing DATA pair');
  assert.deepEqual(errors, []);
  console.log('PASS constraint browser:', JSON.stringify({options: tokens.length, inspectedTokens, sourceCount: before.sourceIntake.sources.length, checks: ['separate COMMON context', 'source-first reading/search', 'original requirement editor', 'A reverse navigation', 'responsive containment', 'reload', 'exact workspace preservation', 'no page errors']}));
 } finally {if (browser) await browser.close(); await new Promise(r => server.close(r)); fs.rmSync(temp, {recursive: true, force: true});}
})().catch(e => {console.error(e); process.exitCode = 1;});
