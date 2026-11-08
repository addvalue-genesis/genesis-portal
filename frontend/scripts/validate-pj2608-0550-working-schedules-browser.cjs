const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),fixtureFile=process.env.PJ0550_WORKING_SCHEDULE_FIXTURE||path.join(os.tmpdir(),'0550-working-schedule-browser-'+process.pid+'.json');
if(!process.env.PJ0550_WORKING_SCHEDULE_FIXTURE)execFileSync(process.execPath,[path.join(__dirname,'validate-pj2608-0550-working-schedules.cjs')],{env:{...process.env,PJ0550_WORKING_SCHEDULE_FIXTURE:fixtureFile},stdio:'pipe'});
const fixture=JSON.parse(fs.readFileSync(fixtureFile));
const server=http.createServer((req,res)=>{const u=req.url.split('?')[0],f=/^\/(?:bundle|\d+(?:\.bundle)?)\.(?:js|css)$/.test(u)?path.join(root,'dist',u):path.join(root,'public/index.html');res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage({viewport:{width:1600,height:1100},acceptDownloads:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
 const read=()=>page.evaluate(()=>new Promise(resolve=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=()=>{resolve(r.result);db.close();};};}));
 const write=d=>page.evaluate(d=>new Promise(resolve=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onsuccess=()=>{const db=q.result,tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put(d,'active');tx.oncomplete=()=>{db.close();resolve();};};}),d);
 const ready=()=>page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 await page.goto(`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`);await ready();const seed=await read();
 for(const key of ['vendorBasisImport','mrWorkingImport','mgwQuoteImport','mgwDetailPricingImport','repositoryBasisImport'])if(seed[key])fixture[key]=seed[key];fixture.revision=seed.revision;fixture.audit=seed.audit;await write(fixture);await page.reload();await ready();
 await page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name:'Quotation',exact:true}).click();await page.getByLabel('Schedule price view').waitFor();assert.equal(await page.getByLabel('Schedule price view').inputValue(),'WORKING');const before=await read();assert.equal(await page.getByLabel('Schedules shown',{exact:true}).inputValue(),'ALL');await page.getByRole('table',{name:'Schedule A1 preview',exact:true}).waitFor();assert.deepEqual(await page.locator('.p55-technical-tabs button').allTextContents(),['11.0 Overview / Cross-check','11.1 Power of Attorney / Undertaking','11.A','11.A1','11.A2','11.B','11.C','11.C1','11.C2','11.C3','11.C4','11.C5','11.C6','11.C7','11.C8','11.D Supporting Breakdown','11.E Licences & Other Costs','11.F Insurance Breakdown','11.M Schedule allocation','11.P Preview / Export']);assert((await page.getByLabel('Working to Schedule status').innerText()).includes('556,874.01'));
 await page.locator('.p55-technical-tabs').getByRole('button',{name:'11.C1',exact:true}).click();await page.locator('.p55-c1-internal-diagnostics > summary').click();await page.getByLabel('MGW source details for Schedule C1').waitFor();assert.equal(await page.getByLabel('MGW system in C1').inputValue(),'CCTV');const offers=page.getByRole('table',{name:'MGW Working quote candidates',exact:true});assert.equal(await offers.locator('tbody tr').count(),28);assert((await offers.innerText()).includes('9,947.00'));
 const form=page.getByRole('table',{name:'Schedule C1 preview',exact:true});const text=await form.innerText();assert(text.includes('CCTV System'));assert.equal(await form.locator('.c1-app').count(),8);assert(text.includes('556,874.01'));assert(!text.includes('9,947.00'));assert.equal(await form.locator('[data-c1-mr-id]').count(),179);assert(!text.includes('REQ-MR'));
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export Schedule C1 Word (.docx)',exact:true}).click();const download=await event,bytes=fs.readFileSync(await download.path()).toString();assert(bytes.includes('556,874.01'));assert(bytes.includes('APPENDIX 1.8'));assert(!bytes.includes('9,947.00'));assert(bytes.includes('DRAFT'));assert(!bytes.includes('allocation and prices pending review'));
 for(const key of ['lines','offers','fx','calculations','sourceIntake','releaseRegister'])assert.deepEqual((await read())[key],before[key],'Preview/export preserves '+key);
 await page.getByRole('button',{name:'บันทึกการจัดหมวดร่าง 1 รายการ',exact:true}).click();await page.getByRole('status').filter({hasText:'บันทึกการจัดหมวดเป็นร่างแล้ว'}).waitFor();const saved=await read();assert.equal(saved.bidVolumes.bindings.find(b=>b.id==='TEST-MGW-CCTV').status,'DRAFT');for(const key of ['lines','offers','fx','calculations','sourceIntake','releaseRegister'])assert.deepEqual(saved[key],before[key]);
 await page.getByLabel('Schedule price view').selectOption('REVIEWED');assert.equal(await page.getByLabel('MGW source details for Schedule C1').count(),0);assert(!(await form.innerText()).includes('556,874.01'));await page.getByLabel('Schedule price view').selectOption('WORKING');await page.waitForFunction(()=>document.querySelector('[data-native-schedule="C1"]')?.textContent.includes('556,874.01'));
 const diagnostics=page.getByLabel('Schedule C1 price diagnostics',{exact:true});assert((await diagnostics.innerText()).includes('556,874.01'));await diagnostics.locator('summary').click();await page.getByRole('table',{name:'Schedule C1 Working price sources',exact:true}).waitFor();await diagnostics.getByRole('button',{name:'แก้การจัดรายการ 11.M',exact:true}).click();assert.equal(await page.getByLabel('Working line to allocate',{exact:true}).inputValue(),'TEST-MGW-CCTV');
 await page.locator('.p55-technical-tabs').getByRole('button',{name:'11.P Preview / Export',exact:true}).click();assert.equal(await page.locator('[data-native-schedule]').count(),0,'Collapsed forms are not mounted');
 const previewPanel=page.locator('[data-component-key="bid.quotation.preview"]');assert.equal(await previewPanel.locator(':scope > details').count(),13,'Default preview keeps every existing Schedule');const c1Details=previewPanel.locator(':scope > details').filter({has:page.locator('summary').filter({hasText:'11.C1 · Base Supply Breakdown'})});await c1Details.locator(':scope > summary').click();await c1Details.locator('[data-native-schedule="C1"]').waitFor();assert.equal(await page.locator('[data-native-schedule]').count(),1,'Only the expanded form renders');
 await c1Details.locator('.p55-c1-internal-diagnostics > summary').click();await c1Details.getByLabel('Schedule C1 price diagnostics',{exact:true}).locator('summary').click();assert(await c1Details.evaluate(e=>e.open),'Nested details do not close their Schedule');await c1Details.locator(':scope > summary').click();await page.waitForFunction(()=>document.querySelectorAll('[data-native-schedule]').length===0);
 await page.getByLabel('Schedules shown',{exact:true}).selectOption('ALL');await page.locator('.p55-technical-tabs').getByRole('button',{name:'11.C6',exact:true}).click();assert((await page.getByLabel('Schedule C6 price diagnostics',{exact:true}).innerText()).includes('ตารางว่างยังไม่ใช่ราคา 0'));await page.locator('.p55-technical-tabs').getByRole('button',{name:'11.C8',exact:true}).click();assert((await page.getByLabel('Schedule C8 price diagnostics',{exact:true}).innerText()).includes('COMPANY / PURCHASER'));
 await page.getByLabel('Schedules shown',{exact:true}).selectOption('C1_C2');await page.getByRole('table',{name:'Schedule C1 preview',exact:true}).waitFor();assert.equal(await page.locator('.p55-technical-tabs').getByRole('button',{name:'11.C8',exact:true}).count(),0);assert.deepEqual(await read(),saved,'Display filters do not save or change the workspace');
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile containment');await page.setViewportSize({width:1600,height:1100});
 if(process.env.PJ0550_WORKING_SCHEDULE_SCREENSHOT)await page.locator('[data-native-schedule="C1"]').screenshot({path:process.env.PJ0550_WORKING_SCHEDULE_SCREENSHOT});
 await page.reload();await ready();assert.deepEqual((await read()).bidVolumes,saved.bidVolumes);assert.deepEqual((await read()).releaseRegister,before.releaseRegister);assert.deepEqual(errors,[]);
 // Fresh repository seed in the same isolated test profile, not the owner's store.
 await write(seed);await page.reload();await ready();
 await page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name:'Quotation',exact:true}).click();
 await page.locator('.p55-technical-tabs').getByRole('button',{name:'11.M Schedule allocation',exact:true}).click();
 const trace=page.getByRole('table',{name:'Exhibit C allocation',exact:true}),reconcile=page.getByRole('table',{name:'Official to Schedule reconciliation',exact:true});
 await trace.waitFor();const crossBefore=await read();assert.equal(await reconcile.locator('tbody tr').count(),2);assert((await reconcile.innerText()).toUpperCase().includes('WORKING'));
 assert.equal(await page.getByLabel('Schedule allocation filter',{exact:true}).inputValue(),'OPEN');
 await page.getByLabel('Schedule allocation filter',{exact:true}).selectOption('B7_B9');assert.equal(await trace.locator('tbody tr').count(),13);assert((await page.locator('[data-component-key="bid.quotation.mapping"]').innerText()).includes('32,001.71'));
 assert((await trace.innerText()).includes('CALL-OFF'));assert((await trace.innerText()).includes('ค่าธรรมเนียม'));assert((await trace.innerText()).includes('CLARIFICATION'));
 const scopeRow=trace.locator('[data-allocation-line="REQ-MR-ACT-B7-D01"]');
 await scopeRow.locator('td').nth(1).locator('summary').click();assert(await scopeRow.getByRole('button',{name:'Site survey',exact:true}).count());
 await scopeRow.getByRole('button',{name:'แก้ Schedule REQ-MR-ACT-B7-D01',exact:true}).click();
 assert.equal(await page.getByLabel('Working line to allocate',{exact:true}).inputValue(),'REQ-MR-ACT-B7-D01');
 const editor=page.locator('[data-component-key="bid.quotation.mapping"] form');await editor.waitFor();
 const originalBasis=await editor.getByLabel('Schedule allocation basis',{exact:true}).inputValue();
 await editor.getByLabel('Schedule allocation basis',{exact:true}).fill(originalBasis+' UNSAVED TEST');
 await page.getByRole('button',{name:'11.A1',exact:true}).click();assert(await page.getByRole('status').filter({hasText:'บันทึกหรือยกเลิกร่างก่อนเปลี่ยนแท็บ'}).count());
 await editor.getByRole('button',{name:'ยกเลิกการแก้ไข',exact:true}).click();
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await trace.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Crosswalk mobile containment');}
 await page.setViewportSize({width:1600,height:1100});
 assert.deepEqual(await read(),crossBefore,'Crosswalk filters, expand and editor cancel never write source/financial/history data');
 if(process.env.PJ0550_CROSSWALK_SCREENSHOT){await reconcile.scrollIntoViewIfNeeded();await page.screenshot({path:process.env.PJ0550_CROSSWALK_SCREENSHOT,fullPage:false});}
 await scopeRow.getByRole('button',{name:'Site survey',exact:true}).click();
 const moduleSearch=page.getByLabel('Project Module Search',{exact:true});await moduleSearch.fill('bid.working-preview.step.4');
 await page.locator('.p55-module-results button').filter({has:page.getByText('bid.working-preview.step.4',{exact:true})}).click();
 const selectedRequirement=page.locator('[data-component-key="bid.working-preview.step.4"] select[aria-label="Working requirement"]');await selectedRequirement.waitFor();
 assert.equal(await selectedRequirement.inputValue(),'REQDEF-MR-ACT-B7-D01');
 assert.deepEqual(await read(),crossBefore,'Crosswalk returns to original requirement without saving');
 await page.reload();await ready();assert.deepEqual(await read(),crossBefore,'Crosswalk remains read-only after reload');
 console.log('PASS existing11.M:13 B7-B9 rows, source annotations, saved-vs-suggested price separation, two reconciliation rows, original Schedule editor/dirty guard/cancel, requirement reverse navigation,1440/390 containment, unchanged workspace and reload.');

 const breakdownSeed=structuredClone(seed);
 for(const [id,quantity,sellRate] of [['REQ-MR-ACT-B4-D01',2,500],['REQ-MR-ACT-B4-D02',3,400]]){
  const line=breakdownSeed.lines.find(l=>l.id===id);assert(line);
  Object.assign(line,{selected:true,quantity,unit:'MD',currency:'USD',manualCost:123.45,sellMode:'DIRECT',sellRate,primePct:0,calculationId:'',offerId:'',coveredByLineId:'',sourceRef:'PRIVATE BREAKDOWN TEST'});
 }
 Object.assign(breakdownSeed.fx,{thbPerUSD:32.5,source:'SYNTHETIC BREAKDOWN FX',date:'2026-11-05'});
 await write(breakdownSeed);await page.reload();await ready();
 await page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name:'Quotation',exact:true}).click();
 const a1=page.getByRole('table',{name:'Schedule A1 preview',exact:true});
 const breakdown=page.getByRole('table',{name:'Inspection and tests breakdown',exact:true});
 const breakdownBefore=await read();
 await page.getByRole('button',{name:'11.D · Breakdown for S/N 2',exact:true}).click();
 await breakdown.waitFor();
 const amounts=async()=>breakdown.locator('tbody tr').evaluateAll(rows=>rows.map(row=>[...row.cells].slice(2).map(cell=>cell.textContent)));
 assert.deepEqual(await amounts(),[['2','MD','500.00','1,000.00'],['3','MD','400.00','1,200.00']]);
 assert.equal(await breakdown.locator('tfoot td').innerText(),'2,200.00');
 assert(!/PRIVATE BREAKDOWN TEST|123\.45|REQ-MR-ACT/.test(await breakdown.innerText()));
 await page.getByLabel('Currency',{exact:true}).selectOption('THB');
 const thb=await breakdown.locator('tfoot td').innerText();assert.equal(thb,'71,500.00');
 await page.getByRole('button',{name:'เปิด 11.A1 · ยอดรวม 1 Lot',exact:true}).click();
 assert((await a1.getByRole('row').filter({hasText:'Inspection and tests'}).innerText()).includes(thb));
 await moduleSearch.fill('bid.quotation.D');await moduleSearch.press('Enter');await breakdown.waitFor();
 assert.deepEqual(await read(),breakdownBefore,'Supporting breakdown is read-only');
 assert.deepEqual(errors,[]);
 console.log('PASS 11.D: supporting A1 inspection detail, two MD rates, USD and THB tie-out, Module Search, customer-safe columns and readonly state.');

 console.log('PASS Working Schedule browser: default Working view, actual MGW CCTV 28 rows/costs in internal diagnostics, canonical selling price in MR-based 8-Appendix customer C1, cost-safe Word download, read-only preview/export, one-click DRAFT allocation save, reviewed-view separation, unchanged financials/frozen history, reload/mobile; zero page errors.');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));if(!process.env.PJ0550_WORKING_SCHEDULE_FIXTURE)fs.rmSync(fixtureFile,{force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
