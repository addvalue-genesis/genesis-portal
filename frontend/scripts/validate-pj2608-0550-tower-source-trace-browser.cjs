// Isolated profile and fixture only; never the owner's Windows browser.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),zlib=require('node:zlib'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),fixture=process.argv[2];
if(!fixture)throw Error('Pass the private completed-workspace JSON path; do not commit private data.');
const zipped=zlib.gzipSync(fs.readFileSync(fixture)),html=fs.readFileSync(path.join(root,'public/index.html'),'utf8').replace('/bundle.js','/qa-bootstrap.js');
const boot=`(async()=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onupgradeneeded=()=>{q.result.createObjectStore('workspace');q.result.createObjectStore('revisions');};const db=await new Promise((r,j)=>{q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});if(!sessionStorage.getItem('qa-tower')){const d=await fetch('/qa-data.json').then(r=>r.json());await new Promise((r,j)=>{const t=db.transaction(['workspace','revisions'],'readwrite');t.objectStore('workspace').put(d,'active');t.objectStore('revisions').put(d,d.revision);t.oncomplete=r;t.onerror=()=>j(t.error);});sessionStorage.setItem('qa-tower','1');}db.close();const s=document.createElement('script');s.src='/bundle.js';document.body.append(s);})()`;
const server=http.createServer((req,res)=>{
 const u=req.url.split('?')[0];
 if(u==='/qa-data.json'){res.writeHead(200,{'Content-Type':'application/json','Content-Encoding':'gzip'});res.end(zipped);return;}
 if(u==='/qa-bootstrap.js'){res.setHeader('Content-Type','text/javascript');res.end(boot);return;}
 if(u.startsWith('/api/local/')){res.writeHead(503,{'Content-Type':'application/json'});res.end('{}');return;}
 const asset=/^\/(?:bundle|\d+(?:\.bundle)?)\.(?:js|css)$/.test(u);
 res.setHeader('Content-Type',asset?(u.endsWith('.js')?'text/javascript':'text/css'):'text/html');res.end(asset?fs.readFileSync(path.join(root,'dist',u)):html);
});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-webgl','--no-zygote','--single-process']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(45000);
 const ready=()=>page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 const read=()=>page.evaluate(()=>new Promise(resolve=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=()=>{resolve(r.result);db.close();};};}));
 const jump=async id=>{const search=page.getByLabel('Project Module Search',{exact:true});await search.fill(id);await search.press('Enter');};
 await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');await ready();const before=await read();
 await jump('bid.budget.working.part.A');
 assert.equal(await page.locator('.p55-supplier-trace').count(),20,'Same source/allocated-cost separation in all nineteen systems plus COMMON');
 assert.equal(await page.locator('[data-working-source-item]').count(),0,'No original item bodies eagerly mounted across all systems');
 const mgw=before.offers.find(o=>o.mgwQuoteLineId).quoteRef;
 await jump('bid.budget.working.group.TEL-LAN');
 const lan=page.getByLabel('Supplier to Working trace TEL-LAN',{exact:true}),lanQuote=lan.locator('[data-working-source-quote]').filter({hasText:mgw}).first();
 const fullIdentity=await lanQuote.getAttribute('data-source-identity'),fullAmount=await lanQuote.locator('.p55-source-amount').innerText();assert(fullAmount.includes('ยอดหน้าสรุปต้นฉบับ')&&fullAmount.includes('CCTV')&&fullAmount.includes('LAN'),'MGW printed-cover/detail conflict stays visible');
 await lanQuote.locator(':scope > summary').click();await lanQuote.locator('tbody tr').first().waitFor();const relevant=await lanQuote.locator('tbody tr').count();
 await lanQuote.getByRole('button',{name:/ดูรายการทั้งใบ/}).click();assert.equal(await lanQuote.locator('tbody tr').count(),108,'Full MGW view retains the current procurement scope');assert(relevant<await lanQuote.locator('tbody tr').count());
 assert.equal(await lanQuote.locator('.p55-source-amount').innerText(),fullAmount,'Relevant/full source-row toggle never changes supplier totals');
 await jump('bid.budget.working.group.TEL-CCTV');const cctv=page.getByLabel('Supplier to Working trace TEL-CCTV',{exact:true}).locator('[data-working-source-quote]').filter({hasText:mgw}).first();assert.equal(await cctv.getAttribute('data-source-identity'),fullIdentity);assert.equal(await cctv.locator('.p55-source-amount').innerText(),fullAmount,'System filter preserves the full original shared quotation');
 await jump('bid.budget.working.group.TEL-VSAT-KU');assert((await page.getByLabel('Supplier to Working trace TEL-VSAT-KU',{exact:true}).innerText()).includes('ไม่ใช่ต้นทุน Supplier เป็นศูนย์'));
 await jump('bid.budget.working.group.TEL-PAGA');const paga=page.getByLabel('Supplier to Working trace TEL-PAGA',{exact:true});assert.equal(await paga.locator('[data-working-source-quote]').count(),3,'Two INDUSTRONIC revisions and the IDIE service quote remain separate');assert((await paga.innerText()).includes('As actual'));
 if(process.env.PJ0550_ALL_SOURCE_SCREENSHOT){await paga.evaluate(el=>scrollTo(0,scrollY+el.getBoundingClientRect().top-80));await page.screenshot({path:process.env.PJ0550_ALL_SOURCE_SCREENSHOT});}

 const group=page.locator('[data-component-key="bid.budget.working.group.TEL-TELT"]');
 await jump('bid.budget.working.group.TEL-TELT');await group.waitFor({state:'visible'});
 for(const [id,ref] of [['REQ-MR-B1-11-APF-08','2609.95.1'],['REQ-MR-B1-11-ACP-06','2609.95.2']]){
  const detail=group.locator('[data-working-mr-vendor="'+id+'"]');await detail.locator(':scope > summary').click();await detail.locator('[data-supplier-source-text]').first().waitFor();
  assert.equal(await detail.locator('[data-working-source-item]').count(),15);
  for(const offer of before.offers.filter(o=>o.quoteRef===ref&&o.supplierQuoteRow?.classification==='BASE_PRICE')){
   const text=await detail.locator('[data-supplier-source-text="'+offer.id+'"]').textContent();for(const source of offer.quoteEvidence.terms)assert(text.includes(source),'Exact original Supplier item description / '+offer.id);
  }
  const towerText=await detail.locator('[data-supplier-source-text="OFFER-MASTER-TOWER-'+ref+'-02"]').innerText();assert(towerText.includes('square self-supporting tower'));assert(towerText.includes(ref.endsWith('.1')?'9.90 x 9.90':'2.0 x 2.0'));
  await detail.locator(':scope > summary').click();
 }
 console.log('PASS native15+15 original item specification/scope text visible beside both MR rows');

 assert((await group.innerText()).includes('ยกเลิกฐานราคาเสารวมเดิม'));
 const owner=before.lines.find(l=>l.id==='LINE-LEGACY-TEL-TELT-1');assert.equal(owner.selected,false);
 const table=group.getByRole('table',{name:'Working cost lines TEL-TELT',exact:true});
 assert.equal(await table.locator(':scope > tbody > tr[data-component-key]').count(),2);
 for(const id of ['REQ-MR-B1-11-APF-08','REQ-MR-B1-11-ACP-06']){
  const row=table.locator('[data-component-key="bid.budget.working.line.'+id+'"]');
  for(const index of [2,3,4])assert((await row.locator('td').nth(index).innerText()).includes('OPEN'));
  assert(!(await row.innerText()).includes('INCLUDED IN OWNER'));
  assert.equal(before.lines.find(l=>l.id===id).coveredByLineId,'');
 }
 const trace=page.getByLabel('Supplier to Working trace TEL-TELT',{exact:true});assert.equal(await trace.locator('[data-working-source-quote]').count(),2);
 assert.equal(await trace.locator('[data-working-source-item]').count(),0,'Source items are lazy');
 const openQuotes=async()=>{for(const q of await trace.locator('[data-working-source-quote]').all()){if(!await q.evaluate(el=>el.open))await q.locator(':scope > summary').click();await q.locator('tbody tr').first().waitFor();}};
 for(const quote of await trace.locator('[data-working-source-quote]').all()){
  assert((await quote.locator(':scope > summary').innerText()).includes('พบลิงก์ราคา 5/15'));
  await quote.locator(':scope > summary').click();await quote.locator('tbody tr').first().waitFor();assert.equal(await quote.locator('tbody tr').count(),15);
 }
 const erection=trace.locator('[data-working-source-item="OFFER-MASTER-TOWER-2609.95.1-10"]');assert((await erection.innerText()).includes('CNEEC Option'));
 await erection.getByRole('button',{name:'เปิดแถวขอบเขต Working',exact:true}).click();
 assert(await page.locator('[data-component-key="bid.budget.working.line.REQ-MR-ACT-C1-D04"]').isVisible(),'Source row opens existing CNEEC scope reference');
 await jump('bid.budget.working.group.TEL-TELT');await openQuotes();
 await trace.locator('[data-working-source-item="OFFER-MASTER-TOWER-2609.95.1-10"]').getByRole('button',{name:'เปิด Vendor Item 10',exact:true}).click();
 await page.locator('[data-component-key="bid.vendor.offer.OFFER-MASTER-TOWER-2609.95.1-10"]').waitFor({state:'visible'});
 for(const o of before.offers.filter(o=>o.id.startsWith('OFFER-MASTER-TOWER-')&&o.supplierQuoteRow?.classification==='BASE_PRICE')){
  const text=await page.locator('[data-vnd-offer="'+o.id+'"]').textContent();
  assert(!text.includes('อ้างอิงเจ้าของราคา Working เดิม'),'Cancelled Part A owner is no longer shown / '+o.id);
  assert.equal(text.includes('จัดสรรต้นทุนใน Working แล้ว'),['1','6','8','14','15'].includes(o.supplierQuoteRow.itemCode),'Only quoted B scope is allocated / '+o.id);
  assert(await page.locator('[data-vnd-offer="'+o.id+'"] [data-supplier-source-text]').count(),'Same source detail in Vendor / '+o.id);
 }
 assert.equal(await page.locator('[data-vnd-offer="OFFER-LEGACY-TEL-TELT-1"]').count(),0);
 const search=page.getByLabel('Project Module Search',{exact:true});await search.fill('PJ2608-0550 / bid.vendor.offer.OFFER-LEGACY-TEL-TELT-1');assert.equal(await page.locator('.p55-module-results button').count(),0);
 await jump('bid.budget.working.group.TEL-TELT');await openQuotes();
 const paint=trace.locator('[data-working-source-item="OFFER-MASTER-TOWER-2609.95.1-03"]');assert((await paint.innerText()).includes('70 Gl'));
 const nested=await trace.locator('[data-working-source-quote]').evaluateAll(ns=>ns.map(n=>n.open));
 const controls=page.getByRole('group',{name:'Working A expand collapse',exact:true});await controls.getByRole('button',{name:'− หุบทุกหัวข้อ',exact:true}).click();await controls.getByRole('button',{name:'+ ขยายทุกหัวข้อ',exact:true}).click();
 assert.deepEqual(await trace.locator('[data-working-source-quote]').evaluateAll(ns=>ns.map(n=>n.open)),nested,'Bulk disclosure retains nested source state');
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await trace.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page contained at '+width);}
 if(process.env.PJ0550_TOWER_SCREENSHOT){await page.setViewportSize({width:1440,height:1000});await trace.scrollIntoViewIfNeeded();await page.screenshot({path:process.env.PJ0550_TOWER_SCREENSHOT});}
 assert.deepEqual(await read(),before,'Source inspection/navigation/disclosure never writes any canonical field');
 await page.reload();await ready();await jump('bid.budget.working.group.TEL-TELT');await openQuotes();assert.equal(await trace.locator('[data-working-source-item]').count(),30);assert.deepEqual(await read(),before,'Reload retains original workspace');assert.deepEqual(errors,[]);
 console.log('PASS production browser:all20 source panels,shared MGW whole-invoice invariance/conflicts,missing quotes,PAGA revisions/IDIE Asactual,lazy native rows,cancelled legacy price and OPEN costs/sell in both MR rows,2 quotes/30 items,10 Vendor price allocations,source↔existing C1/Vendor navigation,native units,bulk disclosure,1440/390 containment,unchanged workspace/reload and no page errors.');
}catch(e){console.error('QA failure before cleanup:',e);throw e;}finally{if(browser)await Promise.race([browser.close(),new Promise(r=>setTimeout(r,10000))]);server.closeAllConnections();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
