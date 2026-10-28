// Production-browser integration regression. Synthetic data only; isolated browser DB.
// Requires PLAYWRIGHT_MODULE_PATH and optional CHROMIUM_EXECUTABLE_PATH; no app dependency.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const root=path.resolve(__dirname,'..'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const server=http.createServer((req,res)=>{const asset=req.url.split('?')[0];const f=/^\/(?:bundle|[0-9]+(?:\.bundle)?)\.(?:js|css)$/.test(asset)?path.join(root,'dist',asset):path.join(root,'public/index.html');res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox'],headless:true});
 const errors=[],metrics={},hashes={},checks=[];
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.addInitScript(()=>{window.__longtasks=[];new PerformanceObserver(l=>window.__longtasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});});
  const url=`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`;
  const officialView=async()=>{const b=page.getByRole('button',{name:'Official · ตรวจทบทวนแล้ว',exact:true});if(await b.count())await b.click();};
  const nav=async name=>{await page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name,exact:true}).click();if(name==='Budget')await officialView();};
  const fill=async(label,value,p=page)=>p.getByLabel(label,{exact:true}).fill(String(value));
  const select=async(label,value)=>page.getByLabel(label,{exact:true}).selectOption(value);
  const db=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);r.onsuccess=()=>{const d=r.result,t=d.transaction('workspace','readonly'),q=t.objectStore('workspace').get('active');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);t.oncomplete=()=>d.close();};r.onerror=()=>reject(r.error);}));
  const save=async name=>{const revision=(await db())?.revision||0;await page.getByRole('button',{name,exact:true}).click();await page.waitForFunction(rev=>document.querySelector('.p55-bid-save')?.textContent.includes('Revision '+(rev+1)),revision);assert.equal(await page.getByRole('alert').count(),0);};
  const expand=async id=>{const el=page.locator(`[data-component-key="${id}"]`);if(!await el.evaluate(n=>n.open))await el.locator(':scope > summary').click();};
  const stage=async name=>{await officialView();await page.getByRole('group',{name:'Bidding pricing stages'}).getByRole('button',{name:new RegExp('^'+name)}).click();};
  const money=async(table,value)=>assert((await page.getByRole('table',{name:table,exact:true}).innerText()).includes(value),table+' missing '+value);
  await page.goto(url);await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();
  const seeded=await db();assert.equal(seeded.offers.length,9);assert.equal(seeded.lines.filter(r=>r.selected).length,7);assert.equal(seeded.lines.length,9);
  assert.equal(await page.getByRole('button',{name:'Working · ราคาเดิมรออัปเดต',exact:true}).getAttribute('aria-pressed'),'true');
  await expand('bid.budget.working.part.A');await expand('bid.budget.working.group.TEL-PAGA');await money('Working cost lines TEL-PAGA','226,454.05');
  await page.getByRole('group',{name:'Bidding pricing stages'}).getByRole('button',{name:/^Release Preview USD/}).click();
  const provisionalDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export REL-04 · Provisional Draft XLSX',exact:true}).click();const provisionalBytes=fs.readFileSync(await(await provisionalDownload).path());assert(provisionalBytes.toString().includes('PROVISIONAL'));assert(provisionalBytes.toString().includes('OPEN'));assert(!provisionalBytes.toString().includes('226454.05'));
  await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();assert.equal((await db()).lines.length,9);
  checks.push('Existing vendor basis auto-imported once: 9 offers / 7 selected / 2 unselected alternatives; native EUR visible without FX; provisional customer XLSX');
  // Reset isolated test data while preserving the one-time migration marker.
  await page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);r.onsuccess=()=>{const d=r.result,t=d.transaction('workspace','readwrite'),store=t.objectStore('workspace'),q=store.get('active');q.onsuccess=()=>{const v=q.result;for(const k of ['vendors','offers','calculations','lines','nodes','edges','audit'])v[k]=[];v.revision=0;store.put(v,'active');};t.oncomplete=()=>{d.close();resolve();};t.onerror=()=>reject(t.error);};}));
  await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision 0'}).waitFor();await officialView();
  assert.equal(await page.locator('nav.p55-tabs button').count(),10);await expand('bid.budget.working.editor');await page.getByLabel('Line description',{exact:true}).waitFor();checks.push('10 active L3 tabs; default Working; isolated synthetic regression workspace');
  const workOrder=await page.getByTestId('bid-commercial').locator(':scope > details[data-component-key]').evaluateAll(ns=>ns.map(n=>n.dataset.componentKey));
  assert.deepEqual(workOrder.filter(id=>!id.includes('guide')),['bid.budget.working.sources','bid.budget.working.lines','bid.budget.official.customer-scope','bid.budget.scope-gates','bid.budget.official.summary','bid.budget.official.history-comparison']);
  assert.equal(await page.getByRole('table',{name:'Proposal work plan',exact:true}).locator('tbody tr').count(),24);
  assert((await page.getByRole('table',{name:'Proposal work plan',exact:true}).locator('tbody tr').first().innerText()).includes('A1-07'));
  await page.getByRole('button',{name:'เตรียม A1-05',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[aria-label="Customer form row"]').value==='A1-05');
  assert.equal(await page.getByLabel('Line system',{exact:true}).inputValue(),'TEL-PAGA');assert.equal(await page.getByLabel('Selling method',{exact:true}).inputValue(),'MARGIN');assert.equal(await page.getByLabel('Margin percent',{exact:true}).inputValue(),'5');assert.equal(await page.getByLabel('Prime markup percent',{exact:true}).inputValue(),'20');assert.equal((await db()).lines.length,0,'Preparing a target must not persist prices');
  await page.getByRole('button',{name:'เตรียม B4',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[aria-label="Customer form row"]').value==='B4');
  await select('Project resource role','Chief Telecom Engineer');await page.getByRole('button',{name:'ใช้เรตขายจาก 06',exact:true}).click();assert.equal(await page.getByLabel('Line currency',{exact:true}).inputValue(),'USD');assert.equal(await page.getByLabel('Line unit',{exact:true}).inputValue(),'MD');assert.equal(await page.getByLabel('ADDVALUE sell rate per unit',{exact:true}).inputValue(),'1000');assert.equal(await page.getByLabel('Manual unit cost',{exact:true}).inputValue(),'');assert.equal(await page.getByLabel('Prime markup percent',{exact:true}).inputValue(),'5');
  await page.getByRole('button',{name:'รายการใหม่',exact:true}).click();assert.equal(await page.getByLabel('Line system',{exact:true}).inputValue(),'COMMON');
  checks.push('Work-process order, MR-ordered target plan, 24 existing customer codes, inherited goods policy and protected service selling rate; no automatic persistence');
  // Copy a collapsed group, then locate it by full ID and human-readable number.
  await expand('bid.budget.working.part.B');
  const groupB4=page.locator('[data-component-key="bid.budget.working.group.B4"]');
  assert.equal(await groupB4.getAttribute('data-module-number'),'10.2.B4');
  assert.equal(await groupB4.evaluate(el=>el.open),false);
  await groupB4.locator(':scope > summary').getByRole('button',{name:'Copy component ID bid.budget.working.group.B4',exact:true}).click();
  assert.equal(await groupB4.evaluate(el=>el.open),false,'Copy ID must not toggle a collapsed group');
  const copiedGroup=await page.evaluate(()=>navigator.clipboard.readText());assert.equal(copiedGroup,'PJ2608-0550 / bid.budget.working.group.B4');
  await fill('Project Module Search',copiedGroup);await page.getByLabel('Project Module Search').press('Enter');await page.waitForFunction(()=>document.querySelector('[data-component-key="bid.budget.working.group.B4"]').open);
  assert.equal(await groupB4.getAttribute('data-module-focused'),'true');
  await fill('Project Module Search','10.2.1.0');await page.getByLabel('Project Module Search').press('Enter');await page.getByRole('table',{name:'หลักการ 10.2.1',exact:true}).waitFor();
  const budget=page.getByTestId('bid-commercial');
  assert.equal(await budget.locator('[data-module-number]').evaluateAll(nodes=>nodes.filter(n=>![...n.querySelectorAll('.gns-copy-id button')].some(b=>b.getAttribute('aria-label')==='Copy component ID '+n.getAttribute('data-component-key'))).length),0,'Every numbered module must expose its own Copy ID');
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Module IDs must wrap; tables must scroll inside panels');await page.setViewportSize({width:1440,height:1000});
  await fill('Project Module Search','');checks.push('Numbered modules: own Copy ID, copy without collapse, full-ID search, number search, focus and principles, mobile containment');

  // Reproduce the screenshot regression with an empty workspace: colour cannot depend on price rows.
  const surface=async selector=>page.locator(selector).evaluate(el=>({background:getComputedStyle(el).backgroundColor,accent:getComputedStyle(el).getPropertyValue('--bid-accent').trim()}));
  const moduleHeader=id=>surface(`[data-component-key="${id}"] > summary`);
  const summaryColour=await moduleHeader('bid.budget.official.summary');
  assert.equal(summaryColour.background,'rgb(36, 94, 155)');
  assert.equal((await surface('[data-component-key="bid.budget.official"] > .p55-module-heading')).background,summaryColour.background);
  const sourceColour=await moduleHeader('bid.budget.working.sources');
  assert.notEqual(sourceColour.background,summaryColour.background);
  for(const id of ['bid.budget.official.source-impact','bid.budget.fx'])assert.equal((await moduleHeader(id)).background,sourceColour.background,'Source child inherits its module family colour');
  const tabColours=await page.getByRole('group',{name:'Bidding pricing stages'}).locator('button').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundColor));
  assert.equal(new Set(tabColours).size,3);assert(!tabColours.includes('rgb(255, 255, 255)'),'Inactive stage tabs retain category colours');
  for(const [name,id] of [['Budget THB','bid.budget.budget-thb'],['Release Preview USD','bid.budget.release']]){
   await stage(name);const header=await moduleHeader(id),tab=await surface('.p55-bid-stages[aria-label="Bidding pricing stages"] button.is-active');assert.equal(header.background,tab.background);assert.notEqual(header.background,summaryColour.background);
  }
  await stage('Working Preview');
  await page.locator('[data-component-key="bid.budget.official"]').scrollIntoViewIfNeeded();
  if(process.env.BIDDING_MODULE_SCREENSHOT)await page.screenshot({path:process.env.BIDDING_MODULE_SCREENSHOT});
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(process.env.BIDDING_MODULE_MOBILE_SCREENSHOT)await page.screenshot({path:process.env.BIDDING_MODULE_MOBILE_SCREENSHOT});
  await page.setViewportSize({width:1440,height:1000});
  checks.push('Empty workspace: coloured Official banner, summary, Source family and children, inactive stage tabs, THB/USD active tab/header match, mobile containment');

  for(let i=0;i<5;i++)for(const name of ['First Principles','Schematic','Budget']){
   const duration=await page.evaluate(async name=>{const b=document.querySelector(`nav.p55-tabs button[aria-label="${name}"]`),t=performance.now();b.click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-t;},name);(metrics[name]??=[]).push(duration);
  }
  if(process.env.PRIVATE_EVIDENCE_FILE){
   const evidence=JSON.parse(fs.readFileSync(process.env.PRIVATE_EVIDENCE_FILE,'utf8'));await nav('First Principles');const panel=page.getByTestId('paga-evidence-review');await panel.getByLabel('PAGA Evidence JSON').setInputFiles(process.env.PRIVATE_EVIDENCE_FILE);await panel.getByText('Final Release: HOLD · Financial posting: NONE',{exact:true}).waitFor();assert.equal(await panel.locator('[data-requirement-id]').count(),evidence.requirements.length);await panel.getByText('Source TAG register',{exact:true}).click();assert.equal(await panel.getByRole('table',{name:'PAGA source TAG register'}).locator('tbody tr').count(),evidence.tags.length);checks.push('Existing private PAGA evidence importer: requirement and TAG counts match supplied source; no financial posting');
  }
  await nav('Vendors and Evidence');await fill('Vendor name','Synthetic vendor');await select('Vendor type','SERVICE_PROVIDER');await fill('Vendor reference','TEST ONLY');await save('บันทึก Vendor');
  const vendor=(await db()).vendors[0];await select('Offer vendor',vendor.id);await fill('Product / role / service','Synthetic engineer');await fill('Quotation reference','TEST-QUOTE');await fill('Offer source / file / page','Synthetic source only');await fill('Quote date','2026-10-01');await fill('Valid until','2027-12-31');await select('Offer currency','USD');await select('Offer unit','MD');await fill('Quoted unit cost',100);await save('บันทึกใบเสนอราคา / เรตต้นทุน');
  await nav('First Principles');await fill('Calculation title','Synthetic SAT');await fill('Calculation source / planning basis','Synthetic plan');for(const [k,v] of [['Events',2],['Days/event',3],['Persons',4],['Paid hours/day',8]])await fill(k,v);assert.equal(await page.getByLabel('Equation result').innerText(),'CALCULATED: 24 MD / 192 MH');await save('บันทึกผลและ Inputs');
  assert.equal(await page.getByRole('table',{name:'19-system coverage inventory'}).locator('tbody tr').count(),19);checks.push('Vendor/offer and E05 manual attendance 24 MD / 192 MH; 19-system coverage retained');
  await nav('Budget');await expand('bid.budget.working.sources');await expand('bid.budget.fx');await fill('THB per USD',40);await fill('FX date','2026-10-27');await fill('FX source / decision','SYNTHETIC TEST ONLY');await save('บันทึก FX');
  await page.getByRole('button',{name:'02 สมการ / Inputs',exact:true}).click();await select('Equation','E17');assert.equal(await page.getByLabel('THB per USD',{exact:true}).inputValue(),'40');await nav('Budget');checks.push('New E17 draft inherits current workspace FX through existing 02; no snapshot override');
  await expand('bid.budget.working.editor');await select('Cost owner WBS','B4');await select('Line system','TEL-PAGA');await fill('Line description','Synthetic SAT row');await select('Customer form row','B4');await fill('Unique scope key','TEST.CAMPAIGN.ENGINEER');await fill('Requirement reference','TEST-REQ');await fill('TAG / site reference','TEST-TAG');await fill('Line source / manual basis','Synthetic plan and source');await select('Line vendor',vendor.id);
  let stored=await db();await select('Selected offer',stored.offers[0].id);await select('Quantity source',stored.calculations[0].id);await fill('ADDVALUE sell rate per unit',150);await fill('Prime markup percent',10);await save('บันทึกแถว Working');
  await money('Working cost lines B4','Calculated candidate:');await money('Working cost lines B4','158,400.00');await stage('Budget THB');assert(!(await page.getByRole('table',{name:'Budget THB lines',exact:true}).innerText()).includes('158,400.00'));await stage('Release Preview USD');assert(!(await page.getByRole('table',{name:'Official customer form',exact:true}).innerText()).includes('3,960.00'));
  // Attach synthetic Current Tender through the real import UI, then review through forms.
  await page.getByRole('button',{name:'A · Original RFQ Documents',exact:true}).click();
  await page.getByText('นำเข้าไฟล์ด้วยตนเอง / ทางเลือกสำรอง',{exact:true}).click();await page.getByLabel('Import source intake',{exact:true}).setInputFiles({name:'synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'TEST-ONLY',reviewedOn:'2026-10-27',coverageNote:'SYNTHETIC ONLY',findings:[],milestones:[],sources:[{id:'RFQ-TEST',provider:'GDRIVE',title:'Synthetic current tender',documentNo:'TEST-TEL-MR-001',revision:'B1',issuedDate:'2026-10-01',receivedDate:'2026-10-01',url:'https://drive.google.com/file/d/SYNTHETIC-TEST/view',readState:'TEXT_READ',authority:'CURRENT_TENDER',content:'Synthetic terms',note:'',replaces:[]}]}))});await save('Apply source intake');
  await page.getByRole('button',{name:'B · Engineering & Bid Preparation',exact:true}).click();await nav('Budget');await stage('Working Preview');
  await page.getByRole('button',{name:'แก้ไข / ทบทวน',exact:true}).click();await select('Official decision','RECALCULATE');await fill('Engineering / quantity / ownership basis','TEST verified crew and scope');await fill('Cost / commercial / Incoterm / warranty basis','TEST verified rates and terms');
  const evidence=async prefix=>{await select(prefix+' RFQ sources',['RFQ-TEST']);await fill(prefix+' Clause / page','p1 c1');await fill(prefix+' reason / impact','TEST reviewed scope');await fill(prefix+' reviewer','TEST REVIEWER');await fill(prefix+' review date','2026-10-27');};
  await evidence('Line review');await save('บันทึกผลทบทวน OFF-03');await money('Working cost lines B4','96,000.00');await money('Working cost lines B4','144,000.00');await money('Working cost lines B4','REVIEWED_WORKING');
  const ownerAccent=await page.locator('[data-component-key="bid.budget.working.group.B4"]').evaluate(el=>getComputedStyle(el).getPropertyValue('--bid-accent'));
  const otherAccent=await page.locator('[data-component-key="bid.budget.working.group.B3"]').evaluate(el=>getComputedStyle(el).getPropertyValue('--bid-accent'));assert.notEqual(ownerAccent,otherAccent);
  const workingHeader=await page.getByRole('table',{name:'Working cost lines B4',exact:true}).locator('thead th').first().evaluate(el=>getComputedStyle(el).backgroundColor);assert.notEqual(workingHeader,'rgb(255, 255, 255)');
  if(process.env.BIDDING_HIERARCHY_SCREENSHOT)await page.locator('[data-component-key="bid.budget.working.part.B"]').screenshot({path:process.env.BIDDING_HIERARCHY_SCREENSHOT});

  await page.locator('[data-component-key="bid.budget.official.customer-scope"] summary').first().click();await page.locator('[data-component-key="bid.budget.working.customer.B4"] summary').click();await select('B4 scope decision','REVIEWED');await evidence('B4');await save('บันทึกขอบเขต B4');
  await stage('Budget THB');await money('Budget THB lines','158,400.00');await stage('Release Preview USD');await money('Official customer form','3,960.00');
  checks.push('Unreviewed calculations blocked; RFQ line and customer scope review unlocks only reviewed USD row');
  if(process.env.BIDDING_REVIEWED_SCREENSHOT)await page.screenshot({path:process.env.BIDDING_REVIEWED_SCREENSHOT,fullPage:true});
  const lineId=(await db()).lines[0].id,sourceId='bid.budget.working.line.'+lineId,releaseId='bid.budget.release.line.'+lineId;
  await page.locator(`[data-component-key="${releaseId}"]`).getByRole('button',{name:new RegExp('^กลับ Source')}).click();await page.locator(`[data-component-key="${sourceId}"]`).waitFor();await page.locator(`[data-component-key="${sourceId}"]`).getByRole('button',{name:'ไป REL-04',exact:true}).click();await page.locator(`[data-component-key="${releaseId}"]`).waitFor();
  assert.equal(await page.locator(`[data-component-key="${releaseId}"]`).evaluate(el=>getComputedStyle(el).getPropertyValue('--bid-accent')),ownerAccent,'Source owner colour must survive Release mapping');
  await stage('Budget THB');const thbRow=page.locator(`[data-component-key="bid.budget.budget-thb.line.${lineId}"]`);await thbRow.getByRole('button',{name:'Copy component ID bid.budget.budget-thb.line.'+lineId,exact:true}).click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'PJ2608-0550 / bid.budget.budget-thb.line.'+lineId);await stage('Release Preview USD');checks.push('Owner colour inherited by tables and Source/Release rows; Budget row Copy ID available');
  const copy=page.locator(`[data-component-key="${releaseId}"] .gns-copy-id button`);await copy.click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'PJ2608-0550 / '+releaseId);checks.push('One model: 96,000 cost / 158,400 THB customer / 3,960 USD; exact Source↔Release and Copy ID');
  await nav('First Principles');await page.getByRole('button',{name:'แก้ Inputs',exact:true}).click();await fill('Persons',5);await save('บันทึกผลและ Inputs');await nav('Budget');await stage('Release Preview USD');assert(!(await page.getByRole('table',{name:'Official customer form',exact:true}).innerText()).includes('4,950.00'));assert(!(await page.getByRole('table',{name:'Official customer form',exact:true}).innerText()).includes('3,960.00'));
  await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision'}).waitFor();await stage('Release Preview USD');assert(!(await page.getByRole('table',{name:'Official customer form',exact:true}).innerText()).includes('4,950.00'));assert(!(await page.getByRole('table',{name:'Official customer form',exact:true}).innerText()).includes('3,960.00'));checks.push('Quantity change invalidates line and customer review; reload retains OPEN instead of stale price');
  const down=page.waitForEvent('download');await page.getByRole('button',{name:'Export REL-04 · Official Draft XLSX',exact:true}).click();const bytes=fs.readFileSync(await(await down).path());assert(!bytes.toString().includes('4950'));assert(bytes.toString().includes('OPEN'));assert(!bytes.toString().includes('TEST REVIEWER'));assert(!bytes.toString().includes('Synthetic vendor'));assert(bytes.toString().includes('NOT ISSUED'));hashes.reviewUSD=hash(bytes);
  await page.evaluate(()=>window.scrollTo(0,0));
  if(process.env.BIDDING_SCREENSHOT)await page.screenshot({path:process.env.BIDDING_SCREENSHOT,fullPage:true});
  await nav('Data and Trace');const backupDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export workspace backup',exact:true}).click();const backup=JSON.parse(fs.readFileSync(await(await backupDownload).path(),'utf8'));assert.equal(backup.lines[0].id,lineId);
  const importFile=async obj=>page.getByLabel('Import workspace backup',{exact:true}).setInputFiles({name:'workspace.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(obj))});
  await importFile({...backup,projectId:'PJ2608-0553'});await page.getByRole('alert').waitFor();assert.equal((await db()).revision,backup.revision);
  const duplicate=JSON.parse(JSON.stringify(backup));duplicate.lines.push({...duplicate.lines[0],id:'LINE-DUPLICATE'});await importFile(duplicate);await page.waitForFunction(rev=>document.querySelector('.p55-bid-save').textContent.includes('Revision '+(rev+1)),backup.revision);await nav('Budget');await money('Working cost lines B4','DUPLICATE_SCOPE_OWNER');await stage('Release Preview USD');assert(!(await page.getByRole('table',{name:'Official customer form'}).innerText()).includes('4,950.00'));
  await nav('Data and Trace');await importFile(backup);await page.waitForFunction(rev=>document.querySelector('.p55-bid-save').textContent.includes('Revision '+(rev+2)),backup.revision);checks.push('Backup/import; foreign project rejected; duplicate cost ownership blocks totals');
  // Optimistic concurrency: stale tab never silently overwrites an intervening save.
  const second=await context.newPage();await second.goto(url);await second.locator('.p55-bid-save').filter({hasText:'Revision'}).waitFor();await second.getByRole('button',{name:'Vendors and Evidence',exact:true}).click();await fill('Vendor name','Stale save',second);
  await nav('Vendors and Evidence');await fill('Vendor name','Second synthetic vendor');await save('บันทึก Vendor');await second.getByRole('button',{name:'บันทึก Vendor',exact:true}).click();await second.getByRole('alert').filter({hasText:'Another tab changed'}).waitFor();assert.equal(await second.getByLabel('Vendor name',{exact:true}).inputValue(),'Stale save');assert.equal((await db()).vendors.length,2);await second.close();checks.push('Concurrent stale write rejected without losing form');
  await nav('Schematic');await page.locator('[data-component-key="bid.schematic.editor"] summary').click();for(const name of ['Synthetic controller','Synthetic speaker']){await fill('Node label',name);await fill('Node site','TEST-SITE');await fill('Node function','TEST EQUIPMENT');await fill('Node drawing / revision / page','TEST-DRAWING');await save('บันทึก Node');}
  stored=await db();await select('Interface from',stored.nodes[0].id);await select('Interface to',stored.nodes[1].id);await fill('Interface label','Synthetic speaker circuit');await fill('Interface drawing / revision / page','TEST-DRAWING page1');await save('บันทึก Interface');assert.equal(await page.locator('svg[aria-label="0550 registered schematic"] path').count(),1);await select('Schematic system','TEL-PAGA');assert.equal(await page.locator('svg[aria-label="0550 registered schematic"] [role="button"]').count(),2);await page.getByRole('button',{name:'Open system Synthetic controller',exact:true}).click();await page.locator('[data-component-key="bid.systems.TEL-PAGA"]').waitFor();checks.push('Persisted overall/per-system schematic; node opens exact system');
  await fill('Project Module Search','PJ2608-0550 / bid.vendor.offer.'+stored.offers[0].id);await page.getByLabel('Project Module Search').press('Enter');await page.locator('[data-component-key="bid.vendor.offer.'+stored.offers[0].id+'"]').waitFor({state:'visible'});
  await fill('Project Module Search','MOD-BUDGET-WORKING');await page.getByLabel('Project Module Search').press('Enter');await page.locator('[data-component-key="MOD-BUDGET-WORKING"]').waitFor({state:'visible'});await fill('Project Module Search','');checks.push('Module search resolves persisted Offer and original module registry IDs');
  // Controlled legacy output remains identical despite fresh bidding inputs.
  await nav('Budget');await page.getByRole('group',{name:'Budget context'}).getByRole('button',{name:/HIS-01/}).click();const history=page.locator('.p55-legacy-history');
  hashes.budgetary=hash(await history.locator('.p55-stack').last().innerText());await history.getByRole('button',{name:'Working Preview',exact:true}).click();hashes.working=hash(await history.locator('.p55-stack').last().innerText());await history.getByRole('button',{name:'Released Customer Output',exact:true}).click();hashes.released=hash(await history.locator('.p55-stack').last().innerText());await history.getByRole('button',{name:'Budgetary Submission',exact:true}).click();
  const originalDownload=page.waitForEvent('download');await history.getByRole('button',{name:'Export SAMTEL Rev00 XLSX',exact:true}).click();hashes.xlsx=hash(fs.readFileSync(await(await originalDownload).path()));
  assert.equal(hashes.xlsx,'2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6');
  const topExport=page.waitForEvent('download');await page.getByRole('button',{name:'Export HIS-01 · SAMTEL Rev00 XLSX',exact:true}).click();assert.equal(hash(fs.readFileSync(await(await topExport).path())),hashes.xlsx);
  await fill('Project Module Search','OFF-03');await page.getByLabel('Project Module Search').press('Enter');await page.locator('[data-component-key="bid.budget.official"]').waitFor({state:'visible'});await fill('Project Module Search','REL-04');await page.getByLabel('Project Module Search').press('Enter');await page.getByRole('table',{name:'Official customer form',exact:true}).waitFor();await page.waitForFunction(()=>document.querySelector('[data-component-key="bid.budget.release"]')?.getAttribute('data-module-focused')==='true');await fill('Project Module Search','RFQ-02');await page.getByLabel('Project Module Search').press('Enter');await page.locator('[data-component-key="l3.original"]').waitFor();await page.getByRole('button',{name:'B · Engineering & Bid Preparation',exact:true}).click();await nav('Budget');await fill('Project Module Search','HIS-01');await page.getByLabel('Project Module Search').press('Enter');await page.locator('.p55-legacy-history').waitFor();await fill('Project Module Search','');checks.push('HIS-01 top export byte parity and all four tag navigation targets');
  // Satellite supply responsibility: a saved mixed package cannot silently
  // enter the current bid; COMPANY records remain auditable but leave exports.
  await nav('Data and Trace');const beforeSatellite=await db();
  const satelliteWorkspace=JSON.parse(JSON.stringify(beforeSatellite));
  const satBase={...satelliteWorkspace.lines[0],systemToken:'TEL-VSAT',wbs:'A',scopeKey:'SAT.SYNTHETIC',customerRowCode:'A1-02',description:'Synthetic satellite package',vendorId:'',offerId:'',calculationId:'',quantity:1,unit:'Lot',currency:'THB',manualCost:111,sellRate:222,sellMode:'DIRECT',primePct:0,selected:true,requirementRef:'SYNTHETIC clause',sourceRef:'SYNTHETIC source',scopeBasis:'SYNTHETIC component boundary'};
  delete satBase.officialReview;
  satelliteWorkspace.fx={thbPerUSD:40,thbPerEUR:null,date:'2026-10-28',source:'SYNTHETIC FX'};
  satelliteWorkspace.lines=[{...satBase,id:'SAT-OLD',description:'Synthetic old bundled package'},
   {...satBase,id:'SAT-CPY',scopeKey:'SAT.CPY',description:'Synthetic company terminal',satelliteScope:'COMPANY_SUPPLY'},
   {...satBase,id:'SAT-TSI',scopeKey:'SAT.TSI',description:'Synthetic retained cabinet',satelliteScope:'TSI_EQUIPMENT'},
   {...satBase,id:'SAT-KU',systemToken:'TEL-VSAT-KU',customerRowCode:'A1-01',scopeKey:'SAT.KU',description:'Synthetic unresolved Internet',satelliteScope:'CLARIFICATION'}];
  await importFile(satelliteWorkspace);await page.waitForFunction(rev=>document.querySelector('.p55-bid-save').textContent.includes('Revision '+(rev+1)),beforeSatellite.revision);
  await nav('Budget');await page.getByRole('group',{name:'Budget context'}).getByRole('button',{name:/OFF-03/}).click();await page.getByRole('button',{name:'Working · ราคาเดิมรออัปเดต',exact:true}).click();
  await expand('bid.budget.working.part.A');await expand('bid.budget.working.group.TEL-VSAT');
  const satelliteRow=id=>page.locator('[data-component-key="bid.budget.working.line.'+id+'"]');
  assert((await satelliteRow('SAT-OLD').innerText()).includes('SATELLITE_SCOPE_OPEN'));
  assert((await satelliteRow('SAT-CPY').innerText()).includes('COMPANY จัดหา · ไม่รวมราคา'));
  assert((await satelliteRow('SAT-TSI').innerText()).includes('222.00'));
  await satelliteRow('SAT-OLD').getByRole('button',{name:'แก้ไข / ทบทวน',exact:true}).click();
  await select('Satellite scope responsibility','COMPANY_SUPPLY');await fill('Satellite scope basis','SYNTHETIC confirmed company hardware');await save('บันทึกแถว Working');
  const savedSatellite=await db();const company=savedSatellite.lines.find(r=>r.id==='SAT-OLD');assert.equal(company.selected,false);assert.equal(company.manualCost,111);assert.equal(company.sellRate,222);assert.equal(company.satelliteScope,'COMPANY_SUPPLY');
  // Excluded source navigation targets its retained customer group.
  await satelliteRow('SAT-OLD').getByRole('button',{name:'ไป REL-04',exact:true}).click();
  const satelliteRelease=page.getByRole('table',{name:'Official customer form',exact:true});await satelliteRelease.waitFor();
  const satelliteText=await satelliteRelease.innerText();assert(satelliteText.includes('Synthetic retained cabinet'));assert(satelliteText.includes('5.55'));assert(!satelliteText.includes('Synthetic company terminal'));assert(!satelliteText.includes('Synthetic old bundled package'));assert(satelliteText.includes('Synthetic unresolved Internet'));assert(satelliteText.includes('OPEN'));
  const satelliteDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export REL-04 · Provisional Draft XLSX',exact:true}).click();const satelliteBytes=fs.readFileSync(await(await satelliteDownload).path()).toString();assert(!satelliteBytes.includes('Synthetic company terminal'));assert(!satelliteBytes.includes('Synthetic old bundled package'));assert(satelliteBytes.includes('Synthetic retained cabinet'));assert(satelliteBytes.includes('clarification'));
  if(process.env.SATELLITE_SCREENSHOT)await page.screenshot({path:process.env.SATELLITE_SCREENSHOT,fullPage:false});
  await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision'}).waitFor();assert.equal((await db()).lines.find(r=>r.id==='SAT-OLD').satelliteScope,'COMPANY_SUPPLY');
  await nav('Data and Trace');const revisionBeforeRestore=(await db()).revision;await importFile(beforeSatellite);await page.waitForFunction(rev=>document.querySelector('.p55-bid-save').textContent.includes('Revision '+(rev+1)),revisionBeforeRestore);
  checks.push('Satellite scope: old bundle and KU OPEN; COMPANY excluded from draft totals/export with source trace; TSI retained; editor, reload and backup restore preserve values');
  if(process.env.BASELINE_REPORT){const before=JSON.parse(fs.readFileSync(process.env.BASELINE_REPORT,'utf8'));for(const key of ['budgetary','working','released','xlsx'])assert.equal(hashes[key],before.hashes[key],'Protected output '+key);}
  for(const name of ['Executive','First Principles','Architecture','19 Systems','Schematic','Execution','Vendors and Evidence','Risk & Controls','Data and Trace','Budget']){await nav(name);const ids=await page.locator('[data-component-key]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-component-key')));assert.equal(new Set(ids).size,ids.length,'Duplicate Module ID in '+name);}
  checks.push('All 10 tabs render without duplicate component IDs or console errors');
  checks.push('Protected Rev10 three views and issued XLSX byte parity');assert.equal(errors.length,0,errors.join('\n'));
  const details=await page.evaluate(()=>({longtasks:window.__longtasks,navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd}))}));
  const report={status:'PASS',browser:await browser.version(),method:'Headless production build; synthetic UI-created inputs; 1440x1000; 5 warm tab cycles to two animation frames. New content, not a like-for-like speedup claim.',checks,metrics:Object.fromEntries(Object.entries(metrics).map(([k,v])=>{const a=v.slice().sort((a,b)=>a-b);return[k,{n:a.length,medianMs:+a[Math.floor(a.length/2)].toFixed(3),maxMs:+a.at(-1).toFixed(3)}];})),hashes,errors,...details};
  if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
