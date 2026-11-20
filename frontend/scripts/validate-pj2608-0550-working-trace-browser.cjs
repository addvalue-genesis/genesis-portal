// Isolated browser, optional reconstructed private fixture; no user's browser state.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),fixture=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2],'utf8')):null;
const boot=`(async()=>{if(!sessionStorage.getItem('working-trace-fixture')){const data=await fetch('/qa-workspace.json').then(r=>r.json());if(data)await new Promise((resolve,reject)=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onupgradeneeded=()=>{q.result.createObjectStore('workspace');q.result.createObjectStore('revisions');};q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,t=db.transaction(['workspace','revisions'],'readwrite');t.objectStore('workspace').put(data,'active');t.objectStore('revisions').put(data,data.revision);t.oncomplete=()=>{db.close();resolve();};t.onerror=()=>reject(t.error);};});sessionStorage.setItem('working-trace-fixture','ready');}const s=document.createElement('script');s.src='/bundle.js';document.body.append(s);})().catch(e=>{document.getElementById('root').textContent=e.stack;});`;
const server=http.createServer((req,res)=>{
 const url=req.url.split('?')[0];if(url==='/qa-workspace.json'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(fixture));}
 if(url==='/qa-bootstrap.js'){res.setHeader('Content-Type','text/javascript');return res.end(boot);}
 if(url.startsWith('/api/local/')){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({code:'DRIVE_SOURCE_NOT_FOUND'}));}
 const asset=/^\/(?:bundle|\d+(?:\.bundle)?)\.(?:js|css)$/.test(url),file=asset?path.join(root,'dist',url):path.join(root,'public/index.html');
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
 res.end(asset?fs.readFileSync(file):fs.readFileSync(file,'utf8').replace('<script src="/bundle.js"></script>','<script src="/qa-bootstrap.js"></script>'));
});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--in-process-gpu','--no-zygote','--single-process']});
 console.log('CHECK browser launched');
 const page=await browser.newPage({viewport:{width:1440,height:1050},timezoneId:'Asia/Bangkok'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(90000);
 const savedHash=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=async()=>{const bytes=new TextEncoder().encode(JSON.stringify(r.result)),digest=await crypto.subtle.digest('SHA-256',bytes);db.close();resolve(Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join(''));};};}));
 const nav=async id=>{const input=page.getByLabel('Project Module Search');await input.fill(id);await input.press('Enter');};
 console.log('CHECK loading workspace');await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');await page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 console.log('CHECK startup ready');await nav('bid.budget.working.line.LINE-LEGACY-TEL-PAGA-1');const before=await savedHash(),paga=page.locator('tr[data-component-key="bid.budget.working.line.LINE-LEGACY-TEL-PAGA-1"]');await paga.waitFor();
 assert(!(await paga.innerText()).includes('ราคาเดิม / รออัปเดต'));if(process.env.PJ0550_TRACE_QA_DIR){fs.mkdirSync(process.env.PJ0550_TRACE_QA_DIR,{recursive:true});await paga.screenshot({path:path.join(process.env.PJ0550_TRACE_QA_DIR,'paga-working-row.png')});}
 const trace=paga.locator('.p55-working-requirement-trace');if(await trace.count()){
  assert.equal(await trace.locator('button').count(),0);await trace.locator(':scope > summary').click();await trace.locator('li button').first().waitFor();
  const count=await trace.locator('li button').count();assert(count>0);const label=await trace.locator('li button').first().innerText();assert.notEqual(label,'ข้อกำหนด / CAL–RPT / Supplier');
  const target=await trace.locator('li small').first().innerText(),id=target.split(' · ')[0];await trace.locator('li button').first().click();await page.locator('[data-component-key="bid.working-preview.requirement.'+id+'"]').first().waitFor({state:'visible'});await nav('bid.budget.working.line.LINE-LEGACY-TEL-PAGA-1');
  console.log('PASS named requirement navigation',count);
 }
 if(fixture){const other=paga.locator('[data-working-quote-basis] details');await other.locator('summary').click();assert((await paga.innerText()).includes('A20261632-002'));await other.getByRole('button',{name:/A20261632-002/}).click();const net=fixture.offers.find(o=>o.quoteRef==='A20261632-002'&&o.supplierQuoteRow?.classification==='NET_PACKAGE');assert(net);await page.locator('[data-component-key="bid.vendor.offer.'+net.id+'"]').waitFor({state:'visible'});console.log('PASS exact registered-quote owner navigation');}
 await nav('bid.budget.working.line.LINE-MGW-DETAIL-CCTV');const cctv=page.locator('tr[data-component-key="bid.budget.working.line.LINE-MGW-DETAIL-CCTV"]');await cctv.waitFor();
 const source=cctv.locator('[data-working-mgw-basis]');assert((await source.innerText()).includes('28 รายการที่ใช้คำนวณ'));assert.equal(await source.locator('.p55-working-source-items li').count(),0);
 await source.getByText('รายการและปริมาณที่ใช้ในแพ็กเกจ',{exact:true}).click();await source.locator('.p55-working-source-items li').first().waitFor();assert.equal(await source.locator('.p55-working-source-items li').count(),28);assert((await source.innerText()).includes('Qty ต้นฉบับ'));
 if(process.env.PJ0550_TRACE_QA_DIR)await cctv.screenshot({path:path.join(process.env.PJ0550_TRACE_QA_DIR,'cctv-working-row.png')});
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'Mobile page contained');await page.setViewportSize({width:1440,height:1050});
 assert.equal(await savedHash(),before,'Read-only disclosure and navigation preserve all saved data');await page.reload();await page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();assert.equal(await savedHash(),before,'Reload preserves selected prices/source/history');assert.deepEqual(errors,[]);
 console.log('PASS Working trace browser: quote selection/alternatives, lazy named links, navigation, exact28 saved MGW items, mobile, reload, saved-state hash and zero page errors.');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
