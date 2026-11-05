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
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(90000);
 const ready=()=>page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 const read=()=>page.evaluate(()=>new Promise(resolve=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=()=>{resolve(r.result);db.close();};};}));
 const jump=async id=>{const search=page.getByLabel('Project Module Search',{exact:true});await search.fill(id);await search.press('Enter');};
 await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');await ready();console.log('QA ready');const before=await read();
 await jump('bid.working-preview.step.7');const panel=page.getByRole('region',{name:'Customer TAG Supplier mapping',exact:true});await panel.waitFor();
 assert.equal(await panel.locator('[data-tag-system]').count(),20);assert((await panel.innerText()).includes('88 เจ้าของต้นทุน'));assert((await panel.innerText()).includes('ขาดฐานตัวเลข 0'));console.log('QA all-system projection');
 await panel.getByLabel('Search customer TAG mapping',{exact:true}).fill('REQDEF-MR-B1-11-APF-08');
 const row=panel.locator('[data-tag-mapping="REQDEF-MR-B1-11-APF-08"]');await row.locator(':scope > summary').click();assert((await row.innerText()).includes('MAP-01 · OPEN'));assert((await row.innerText()).includes('MAP-08 · PASS'));assert.equal(await row.locator('li').count(),10);
 await row.getByRole('button',{name:'เปิด Mapping เดิม / หลักฐาน TAG',exact:true}).click();const mapping=page.getByRole('form',{name:'Requirement Mapping editor',exact:true});await mapping.waitFor();
 const tags=mapping.getByRole('group',{name:'Customer TAG evidence bindings',exact:true});await tags.waitFor();assert((await tags.innerText()).includes('ยังไม่มี TAG ที่บันทึก'));assert.equal(await mapping.getByLabel('Record review status',{exact:true}).inputValue(),'DRAFT');
 assert.deepEqual(await read(),before,'Inspection is read only');await tags.locator(':scope > details > summary').click();
 const candidate=tags.locator(':scope > details > div').filter({has:page.getByText('APF / APF-ANT-0001 · 1 PC',{exact:true})}).first();await candidate.waitFor();assert((await candidate.innerText()).includes('HISTORICAL'));
 await candidate.getByRole('button',{name:'อ้างแถวนี้เป็นร่าง TAG',exact:true}).click();const binding=tags.locator('[data-tag-binding]');assert.equal(await binding.count(),1);
 const req=before.integrationWorkspace.requirements.find(r=>r.id==='REQDEF-MR-B1-11-APF-08');
 const child=before.offers.find(o=>o.supplierQuoteRow?.parentOfferId===req.offerIds[0]&&o.supplierQuoteRow?.itemCode==='2')||before.offers.find(o=>o.supplierQuoteRow?.parentOfferId===req.offerIds[0]);
 assert(child,'Use the actual source child of the original NET');
 await binding.getByLabel('TAG supplier Item IDs',{exact:true}).selectOption(child.id);await binding.getByLabel('TAG Working references',{exact:true}).selectOption(req.workLineIds[0]);
 await binding.getByLabel('TAG mapping basis',{exact:true}).fill('QA explicit historical source draft only; current revision and engineering review pending');assert.deepEqual(await read(),before,'Unsaved TAG draft is not persistent');
 await mapping.getByRole('button',{name:'บันทึกข้อกำหนดและ Mapping',exact:true}).click();await page.waitForFunction(rev=>document.querySelector('.p55-bid-save')?.textContent.includes('Revision '+(rev+1)),before.revision);console.log('QA explicit canonical save');
 const after=await read(),saved=after.integrationWorkspace.requirements.find(r=>r.id===req.id);assert.equal(saved.tagBindings.length,1);assert.equal(saved.status,'DRAFT');assert.equal(saved.reviewer,req.reviewer);assert.equal(saved.reviewedOn,req.reviewedOn);assert.deepEqual(saved.tagBindings[0].offerIds,[child.id]);assert.equal(saved.tagBindings[0].tag,'APF-ANT-0001');assert.equal(saved.tagBindings[0].ruleVersion,'genesis.controlled-tag-mapping/2');
 for(const key of Object.keys(before).filter(k=>!['revision','updatedAt','audit','integrationWorkspace'].includes(k)))assert.deepEqual(after[key],before[key],key+' unchanged');
 for(const key of Object.keys(before.integrationWorkspace).filter(k=>k!=='requirements'))assert.deepEqual(after.integrationWorkspace[key],before.integrationWorkspace[key],key+' unchanged');
 const strip=r=>{const {tagBindings,basisKey,...rest}=r;return rest;};assert.deepEqual(strip(saved),strip(req));
 assert.deepEqual(after.integrationWorkspace.requirements.filter(r=>r.id!==req.id),before.integrationWorkspace.requirements.filter(r=>r.id!==req.id));
 await jump('bid.working-preview.step.7');await panel.getByLabel('Search customer TAG mapping',{exact:true}).fill(req.id);if(!await row.evaluate(e=>e.open))await row.locator(':scope > summary').click();assert((await row.innerText()).includes('TAG_CURRENT_SOURCE_OPEN'));assert((await row.innerText()).includes('MAP-08 · PASS'));assert((await row.innerText()).includes('APF-ANT-0001'));
 await page.reload();await ready();await jump('bid.working-preview.requirement.'+req.id);await mapping.waitFor();assert.equal(await tags.locator('[data-tag-binding]').count(),1);assert.deepEqual(await read(),after);console.log('QA durable TAG draft and unchanged money/source/history');
 await jump('bid.budget.official.summary');const summaryPanel=page.getByRole('region',{name:'Customer TAG Supplier mapping summary',exact:true});await summaryPanel.waitFor();assert.equal(await summaryPanel.locator('[data-tag-system]').count(),20);
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await summaryPanel.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Contained at '+width);}
 if(process.env.PJ0550_TAG_SCREENSHOT){await page.setViewportSize({width:1440,height:1000});await summaryPanel.scrollIntoViewIfNeeded();await page.screenshot({path:process.env.PJ0550_TAG_SCREENSHOT});}
 await summaryPanel.locator('[data-tag-system="COMMON"]').getByRole('button',{name:'เปิด Working เดิม',exact:true}).click();await page.locator('details[data-component-key="bid.budget.working.lines"][open]').waitFor();
 assert.deepEqual(errors,[]);assert.deepEqual(await read(),after);console.log('PASS production actual browser: all19+COMMON in existing WP.7/summary,10 MAP stages,real historical TAG/source/native Supplier Item,explicit canonical DRAFT save/reload,no false approval or financial/source/history writes,1440/390 containment.');
}catch(e){console.error('QA failure before cleanup:',e);throw e;}finally{if(browser)await Promise.race([browser.close(),new Promise(r=>setTimeout(r,10000))]);server.closeAllConnections();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
