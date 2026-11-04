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
 const group=page.locator('[data-component-key="bid.budget.working.group.TEL-TELT"]');
 await jump('bid.budget.working.group.TEL-TELT');await group.waitFor({state:'visible'});
 assert((await group.locator(':scope > summary').innerText()).includes('1 รายการเจ้าของราคา / ตรวจขอบเขต · 2 อ้างอิงราคาไม่บวกซ้ำ'));
 const trace=page.getByLabel('Supplier to Working trace TEL-TELT',{exact:true});assert.equal(await trace.locator('[data-working-source-quote]').count(),2);
 assert.equal(await trace.locator('[data-working-source-item]').count(),30);
 for(const quote of await trace.locator('[data-working-source-quote]').all()){
  assert((await quote.locator(':scope > summary').innerText()).includes('พบลิงก์ราคา 15/15'));
  await quote.locator(':scope > summary').click();assert.equal(await quote.locator('tbody tr').count(),15);
 }
 const erection=trace.locator('[data-working-source-item="OFFER-MASTER-TOWER-2609.95.1-10"]');assert((await erection.innerText()).includes('Part C / C1'));
 await erection.getByRole('button',{name:'PROJECT · Tower erection / lifting / rigging',exact:true}).click();
 assert(await page.locator('[data-component-key="bid.budget.working.line.REQ-MR-ACT-C1-D04"]').isVisible(),'Source row opens existing C1 owner and ancestors');
 await jump('bid.budget.working.group.TEL-TELT');
 await trace.locator('[data-working-source-item="OFFER-MASTER-TOWER-2609.95.1-10"]').getByRole('button',{name:'เปิด Vendor Item 10',exact:true}).click();
 await page.locator('[data-component-key="bid.vendor.offer.OFFER-MASTER-TOWER-2609.95.1-10"]').waitFor({state:'visible'});
 for(const o of before.offers.filter(o=>o.id.startsWith('OFFER-MASTER-TOWER-')&&o.supplierQuoteRow?.classification==='BASE_PRICE')){
  const text=await page.locator('[data-vnd-offer="'+o.id+'"]').innerText();
  assert(!text.includes('ยังไม่เลือกใช้ใน Working'),'Source usage visible / '+o.id);
 }
 await jump('bid.budget.working.group.TEL-TELT');
 const paint=trace.locator('[data-working-source-item="OFFER-MASTER-TOWER-2609.95.1-03"]');assert((await paint.innerText()).includes('70 Gl'));
 const nested=await trace.locator('[data-working-source-quote]').evaluateAll(ns=>ns.map(n=>n.open));
 const controls=page.getByRole('group',{name:'Working A expand collapse',exact:true});await controls.getByRole('button',{name:'− หุบทุกหัวข้อ',exact:true}).click();await controls.getByRole('button',{name:'+ ขยายทุกหัวข้อ',exact:true}).click();
 assert.deepEqual(await trace.locator('[data-working-source-quote]').evaluateAll(ns=>ns.map(n=>n.open)),nested,'Bulk disclosure retains nested source state');
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await trace.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page contained at '+width);}
 if(process.env.PJ0550_TOWER_SCREENSHOT){await page.setViewportSize({width:1440,height:1000});await trace.scrollIntoViewIfNeeded();await page.screenshot({path:process.env.PJ0550_TOWER_SCREENSHOT});}
 assert.deepEqual(await read(),before,'Source inspection/navigation/disclosure never writes any canonical field');
 await page.reload();await ready();await jump('bid.budget.working.group.TEL-TELT');assert.equal(await trace.locator('[data-working-source-item]').count(),30);assert.deepEqual(await read(),before,'Reload retains original workspace');assert.deepEqual(errors,[]);
 console.log('PASS production browser:2 quotes/30 items,1 owner+2 references,22 Vendor allocations,source↔existing C1/Vendor navigation,native units,bulk disclosure,1440/390 containment,unchanged workspace/reload and no page errors.');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
