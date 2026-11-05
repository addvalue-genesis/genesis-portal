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
(async()=>{let browser,page;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--in-process-gpu','--no-zygote','--single-process']});
 console.log('CHECK browser launched');
 page=await browser.newPage({viewport:{width:1440,height:1050},timezoneId:'Asia/Bangkok'});const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message)});page.setDefaultTimeout(fixture?90000:30000);
 const savedHash=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=async()=>{const bytes=new TextEncoder().encode(JSON.stringify(r.result)),digest=await crypto.subtle.digest('SHA-256',bytes);db.close();resolve(Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join(''));};};}));
 const nav=async id=>{const input=page.getByLabel('Project Module Search');await input.fill(id);await input.press('Enter');};
 console.log('CHECK loading workspace');await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');await page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 console.log('CHECK startup ready');await nav('bid.budget.working.group.TEL-VSAT-KU');
 const ku=page.getByLabel('Supplier to Working trace TEL-VSAT-KU',{exact:true});await ku.waitFor();const before=await savedHash();
 assert((await ku.innerText()).includes('ไม่ใช่ต้นทุน Supplier เป็นศูนย์'));
 const mapping=ku.locator('details').filter({hasText:'MR → ใบเสนอราคา → Working'}).first();await mapping.locator(':scope > summary').click();
 const table=ku.getByRole('table',{name:'MR supplier mapping TEL-VSAT-KU',exact:true});assert.equal(await table.locator('tbody tr').count(),2);assert((await table.innerText()).includes('OPEN · ยังไม่มี Offer เชื่อมกับรายการนี้'));console.log('PASS two unquoted native KU rows');
 if(fixture){
  const estimate=ku.locator('details').filter({hasText:'ฐานราคา Working ที่ไม่มี Offer'}).first();await estimate.locator(':scope > summary').click();assert((await estimate.innerText()).includes('12 planning months'));
  await estimate.getByRole('button').click();await page.locator('[data-component-key="bid.budget.working.line.LINE-BID-SUPPORT-TEL-VSAT-KU-0550"]').waitFor({state:'visible'});console.log('PASS separate estimate and existing owner');
 }
 await nav('bid.budget.working.group.TEL-VSAT-KU');await ku.waitFor();for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await ku.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page contained at '+width);}
 assert.equal(await savedHash(),before,'Disclosure and owner inspection preserve the entire saved workspace');
 await page.setViewportSize({width:1440,height:1000});await page.reload();await page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();await nav('bid.budget.working.group.TEL-VSAT-KU');await ku.getByRole('button',{name:'07.2 · เปิดโมดูลราคาผู้ขาย',exact:true}).waitFor({state:'visible'});assert.equal(await savedHash(),before);console.log('PASS mobile, reload and saved workspace hash');
 await ku.getByRole('button',{name:'07.2 · เปิดโมดูลราคาผู้ขาย',exact:true}).click();await page.locator('[data-component-key="bid.vendor.offers"]').waitFor({state:'visible'});console.log('PASS Vendor07.2 navigation');
 await nav('bid.budget.working.group.TEL-VSAT-KU');await ku.getByRole('button',{name:'WP.7 · ตรวจ Mapping Supplier',exact:true}).click();await page.locator('[data-component-key="bid.working-preview.step.7"]').waitFor({state:'visible'});assert.equal(await savedHash(),before);assert.deepEqual(errors,[]);
 console.log('PASS KU: explicit missing supplier originals, canonical MR display, separate manual basis, existing owner/Vendor07.2/WP.7 navigation,1440/390 containment, exact saved workspace/reload and no page errors.');
 }catch(e){console.error('BROWSER FAILURE',e);if(page)console.error((await page.locator('body').innerText({timeout:5000})).slice(0,2500));throw e;}finally{server.closeAllConnections();if(browser)await Promise.race([browser.close(),new Promise(r=>setTimeout(r,5000))]);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
