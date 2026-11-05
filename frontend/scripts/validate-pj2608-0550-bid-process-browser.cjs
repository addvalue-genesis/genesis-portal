// Isolated browser and optional private fixture; never reads the owner's browser.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),fixture=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2],'utf8')):null;
const boot=`(async()=>{if(!sessionStorage.getItem('bid-process-fixture')){const data=await fetch('/qa-workspace.json').then(r=>r.json());if(data)await new Promise((resolve,reject)=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onupgradeneeded=()=>{q.result.createObjectStore('workspace');q.result.createObjectStore('revisions');};q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,t=db.transaction(['workspace','revisions'],'readwrite');t.objectStore('workspace').put(data,'active');t.objectStore('revisions').put(data,data.revision);t.oncomplete=()=>{db.close();resolve();};t.onerror=()=>reject(t.error);};});sessionStorage.setItem('bid-process-fixture','ready');}const s=document.createElement('script');s.src='/bundle.js';document.body.append(s);})().catch(e=>{document.getElementById('root').textContent=e.stack;});`;
const server=http.createServer((req,res)=>{
 const url=req.url.split('?')[0];
 if(url==='/qa-workspace.json'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(fixture));}
 if(url==='/qa-bootstrap.js'){res.setHeader('Content-Type','text/javascript');return res.end(boot);}
 if(url.startsWith('/api/local/')){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({code:'DRIVE_SOURCE_NOT_FOUND'}));}
 const asset=/^\/(?:bundle|\d+(?:\.bundle)?)\.(?:js|css)$/.test(url),file=asset?path.join(root,'dist',url):path.join(root,'public/index.html');
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
 res.end(asset?fs.readFileSync(file):fs.readFileSync(file,'utf8').replace('<script src="/bundle.js"></script>','<script src="/qa-bootstrap.js"></script>'));
});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1050},timezoneId:'Asia/Bangkok'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
 const read=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=()=>{resolve(r.result);db.close();};};}));
 const nav=async id=>{const input=page.locator('input[aria-label="Project Module Search"]');await input.fill(id);await input.press('Enter');};
 const ready=()=>page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 console.log('CHECK browser launched / fixture',Boolean(fixture));await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');await ready();
 console.log('CHECK startup ready');await nav('bid.budget.official.summary');console.log('CHECK summary nav');const result=page.locator('section[aria-label="RFQ bid process result"]');
 await result.waitFor();console.log('CHECK result visible');const saved=await read();console.log('CHECK saved read');assert(saved.repositoryBasisImport.bidProcess,'Startup executes bid preparation');
 const prices=page.locator('table[aria-label="ABC bid process prices"]');assert.equal(await prices.locator('tbody tr').count(),3);
 await result.locator('details > summary').filter({hasText:'ขอบเขตและแผนส่งมอบทั้ง 19 ระบบ'}).click();const plan=page.locator('table[aria-label="System bid delivery plan"]');assert.equal(await plan.locator('tbody tr').count(),19);
 if(fixture){
  assert.equal(saved.repositoryBasisImport.bidProcess.controlLineIds.length,4);const cer=saved.lines.find(l=>l.id==='LINE-CERAGON-ASK-REVA1-BASE');assert(cer&&cer.selected&&cer.quantity===1);
  for(const key of Object.keys(fixture).filter(k=>!['revision','audit','lines','repositoryBasisImport','integrationWorkspace'].includes(k)))assert.deepEqual(saved[key],fixture[key],key+' preserved by preparation');
  for(const [key,records] of Object.entries(fixture.integrationWorkspace)){if(!Array.isArray(records)){assert.deepEqual(saved.integrationWorkspace[key],records);continue;}for(const record of records)assert.deepEqual(saved.integrationWorkspace[key].find(r=>r.id===record.id),record,'Saved SI record preserved / '+record.id);for(const record of saved.integrationWorkspace[key].filter(r=>!records.some(x=>x.id===r.id)))assert.equal(record.status,'DRAFT','Existing AVL preparation only adds drafts');}
  for(const old of fixture.lines){const row=saved.lines.find(l=>l.id===old.id),completion=saved.repositoryBasisImport.bidCompletion?.rows.find(r=>r.lineId===old.id);if(completion){if(old.wbs==='A')assert.deepEqual(row,old,'Native equipment input preserved / '+old.id);for(const key of ['quantity','manualCost','sellRate',...((Number.isFinite(old.manualCost)||Number.isFinite(old.sellRate))?['markupPct','marginPct','primePct']:[])])if(Number.isFinite(old[key]))assert.equal(row[key],old[key],'Previously authored numeric input / '+old.id+' / '+key);if(Number.isFinite(old.sellRate))assert.equal(row.sellMode,old.sellMode,'Protected selling method');}else assert.deepEqual(row,saved.repositoryBasisImport.bidProcess.controlLineIds.includes(old.id)?{...old,selected:false}:old,'Prior Working input preserved / '+old.id);} 
  assert((await plan.innerText()).includes('P+4'));assert((await prices.innerText()).includes(saved.repositoryBasisImport.bidCompletion?'คำนวณราคาครบแถวที่เลือก':'ยอดที่มีฐานแล้ว'));if(saved.repositoryBasisImport.bidCompletion){const basis=page.locator('[aria-label="Bid estimate basis"]');assert(await basis.isVisible());await basis.locator('details > summary').click();const rows=page.locator('table[aria-label="Bid completion basis"]');assert((await rows.innerText()).includes('ESTIMATE'));assert((await rows.innerText()).includes('QUOTED'));assert((await rows.innerText()).includes('ไม่บวกเพิ่ม')||((await rows.innerText()).includes('ไม่มีราคาเพิ่ม')));assert(!(await rows.innerText()).includes('OPEN'));await basis.locator('details > summary').click();}
 }
 console.log('CHECK plan and inputs');
 await nav('bid.working-preview.step.5');
 const stage=page.locator('[data-component-key="bid.working-preview.step.5"]');
 const select=page.locator('select[aria-label="Working Preview system"]');
 const groups=stage.locator('[data-wp-quantity-system]');
 await groups.first().waitFor();
 assert(await groups.count()>1,'All-system view shows separate groups');
 const table=stage.getByRole('table',{name:'Physical requirement Working allocation',exact:true});
 assert.equal(await stage.locator('table[aria-label="Physical requirement Working allocation"]').count(),0,'Collapsed groups do not mount quantity rows');
 const common=stage.locator('[data-wp-quantity-system="COMMON"]');
 const summary=common.locator(':scope > summary');
 assert(await summary.getByText('+',{exact:true}).isVisible());
 await summary.click();
 await table.waitFor();
 assert(await summary.getByText('−',{exact:true}).isVisible());
 assert.equal(await stage.locator('[data-wp-quantity-system][open]').count(),1);
 const expectedCount=Number((await summary.innerText()).match(/(\d+) ข้อกำหนด/)[1]);
 assert.equal(await table.locator('tbody tr').count(),expectedCount);
 await summary.press('Space');
 await table.waitFor({state:'detached'});
 assert(await summary.getByText('+',{exact:true}).isVisible());
 // Selecting a requirement from an initially collapsed WP.5 opens and locates
 // its exact row, including the case where APF and ACP share a price owner.
 const towerId='REQDEF-MR-B1-11-ACP-06';
 const picker=stage.getByLabel('Working requirement',{exact:true});
 await picker.selectOption(towerId);
 const tower=stage.locator('[data-wp-quantity-system="TEL-TELT"]');
 const focused=tower.locator('[data-bid-requirement="'+towerId+'"].p55-wp-quantity-target');
 await focused.waitFor();
 assert((await focused.innerText()).includes('ข้อกำหนดที่เลือก · ACP'));
 assert.equal(await stage.locator('[data-wp-quantity-system][open]').count(),1);
 assert(await focused.evaluate(row=>{const {top,bottom}=row.getBoundingClientRect();return top<innerHeight&&bottom>0;}),'Jump places ACP in the viewport');
 await tower.locator(':scope > summary').click();
 await focused.waitFor({state:'detached'});
 await stage.getByRole('button',{name:'ดูแถวที่เลือกใน WP.5',exact:true}).click();
 await focused.waitFor();
 if(fixture){
  const unlinked=saved.integrationWorkspace.requirements.find(requirement=>!requirement.workLineIds.length);
  if(unlinked){
   await picker.selectOption(unlinked.id);
   await stage.getByText('ข้อที่เลือกยังไม่มีรหัสอ้างอิง Working',{exact:true}).waitFor();
   assert.equal(await stage.locator('.p55-wp-quantity-target').count(),0);
   await stage.getByRole('button',{name:'เปิดข้อที่เลือกใน WP.4',exact:true}).click();
   await page.getByRole('form',{name:'Requirement Mapping editor',exact:true}).filter({hasText:unlinked.id}).waitFor();
   await nav('bid.working-preview.step.5');
  }
 }
 console.log('CHECK exact requirement focus');
 await select.selectOption('COMMON');
 await table.waitFor();
 assert.equal(await groups.count(),1,'A selected system opens its only group');
 assert(!(await table.innerText()).includes('Proof OPEN'));
 // A null stored quantity is expected when the canonical equation supplies it.
 const candidates=saved.lines.filter(l=>l.calculationId&&l.quantity===null&&l.systemToken==='COMMON');let calculatedShown=false;
 for(const line of candidates){const rows=table.locator('[data-bid-working-line="'+line.id+'"]');if(!await rows.count())continue;const text=await rows.first().innerText();if(!text.includes('ปริมาณจากสมการ'))continue;assert(!text.includes('ยังไม่มีฐานปริมาณ'),line.id+' uses computed quantity');calculatedShown=true;break;}
 console.log('CHECK computed quantity',calculatedShown);assert(calculatedShown,'WP.5 renders the quantity from a canonical equation');
 if(fixture){
  await select.selectOption('TEL-TELT');assert(await table.locator('[data-bid-price-owner="LINE-LEGACY-TEL-TELT-1"]').count(),'Validated tower owner is visible from included MR rows');
  await select.selectOption('TEL-PAGA');assert(await table.locator('[data-bid-package-reference], [data-bid-price-owner]').count(),'Existing PAGA package price remains visible from retained Working references before exact allocation');
  assert((await table.innerText()).includes('ไม่ใช่ราคาเพิ่มต่อแถว MR'));
  const ref=table.locator('[data-bid-package-reference], [data-bid-price-owner]').first(),button=ref.getByRole('button');await button.click();assert(await page.locator('[data-component-key="bid.budget.working.editor"]').isVisible(),'Existing owner navigation works');
 }
 console.log('CHECK WP5 references');await nav('bid.budget.release');const release=page.locator('[data-component-key="bid.budget.release"]');assert(!(await release.innerText()).includes('NOT SELECTED'));
 assert(await release.getByText('รายการอ้างอิงที่ไม่ได้เลือก / COMPANY',{exact:false}).count());
 await page.setViewportSize({width:390,height:844});await nav('bid.budget.official.summary');const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,boxes:[...document.querySelectorAll('html,body,#root,.p55,.p55-bid-presentation,.p55-bid-content,.p55-bid-module,.p55-table-wrap')].filter(e=>e.getBoundingClientRect().width>0).slice(0,35).map(e=>({tag:e.tagName,cls:e.className,client:e.clientWidth,scroll:e.scrollWidth,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right,overflow:getComputedStyle(e).overflowX})),offenders:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&e.getBoundingClientRect().width>0&&getComputedStyle(e).position!=='fixed'&&!(()=>{for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement)if(['auto','scroll','hidden','clip'].includes(getComputedStyle(p).overflowX))return true;return false;})()).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,txt:e.textContent.slice(0,80)}))}));if(mobile.scroll>mobile.width+1){console.log('MOBILE_OVERFLOW',JSON.stringify(mobile));await page.screenshot({path:'/tmp/pj0550-overflow.png'});}assert(mobile.scroll<=mobile.width+1,'Mobile page containment');
 assert.deepEqual(await read(),saved,'Read-only pricing, quantities, plans and owner navigation never save');
 console.log('CHECK mobile/read-only');await page.reload();await ready();await nav('bid.budget.official.summary');assert.deepEqual(await read(),saved,'Repeat startup preserves exact workspace and creates no duplicate costs');assert.deepEqual(errors,[]);
 console.log('PASS bid process browser: A/B/C money and19-system plan, collapsed and filtered WP.5 groups, computed quantities, existing owner/package price references, neutral release references, original inputs/history, idempotent reload,390px containment and zero page errors'+(fixture?' / actual private workspace.':' / repository seed.'));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
