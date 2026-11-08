// Isolated browser; the user's private saved workspace is never accessed.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],asset=/^\/(?:bundle|[0-9]+(?:\.bundle)?)\.(?:js|css)$/.test(url),file=asset?path.join(root,'dist',url):path.join(root,'public/index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
 await page.goto(`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`);await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();
 const read=()=>page.evaluate(()=>new Promise(resolve=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onsuccess=()=>{const db=q.result,t=db.transaction('workspace','readonly'),r=t.objectStore('workspace').get('active');r.onsuccess=()=>resolve(r.result);t.oncomplete=()=>db.close();};}));
 const nav=async id=>{await page.getByLabel('Project Module Search').fill(id);await page.getByLabel('Project Module Search').press('Enter');};
 const initial=await read();await nav('bid.budget.official.summary');
 // Top-level reading order is independent of shortcuts and pricing basis.
 const expected=Array.from({length:9},(_,i)=>'10.'+i);
 const sections=page.locator('[data-testid="bid-commercial"] > details[data-module-number]');
 const checkOrder=async()=>{
  assert.deepEqual(await sections.evaluateAll(nodes=>nodes.map(n=>n.dataset.moduleNumber)),expected);
  for(const section of await sections.all())assert(await section.locator(':scope > summary').isVisible(),'Every top-level heading stays visible');
  const working=page.locator('[data-component-key="bid.budget.working.lines"]');
  const children=working.locator(':scope > .p55-bid-content > [data-module-number]');
  assert.deepEqual(await children.evaluateAll(nodes=>nodes.map(n=>[n.dataset.moduleNumber,n.dataset.componentKey])),[
   ['10.2.0','bid.budget.working.lines.principles'],
   ['10.2.1','bid.working-preview.particulars'],
   ['10.2.2','bid.working-preview'],
   ['10.2.A','bid.budget.working.part.A'],
   ['10.2.B','bid.budget.working.part.B'],
   ['10.2.C','bid.budget.working.part.C'],
   ['10.2.3','bid.budget.working.editor']
  ],'Working follows document reading, SI review, scope selection and line editing');
  assert.equal(await working.locator('[data-component-key="bid.working-preview"]').getByText('10.2.2.1.1 · ตารางระบบและเอกสาร CUS',{exact:true}).count(),1);
  for(let step=1;step<=8;step++)assert.equal(await working.locator('[data-component-key="bid.working-preview.step.'+step+'"]').count(),1);
  assert.equal(await page.locator('[data-component-key="bid.budget.official.summary"]').count(),1);
  assert.equal(await page.locator('[data-component-key="bid.budget.fx"]').count(),1);
 };
 await checkOrder();
 // Bulk disclosure belongs to the existing Part, without changing records,
 // another Part, or the nested quotation/reference reading choices.
 await nav('bid.budget.working.part.A');
 const partA=page.locator('[data-component-key="bid.budget.working.part.A"]'),partB=page.locator('[data-component-key="bid.budget.working.part.B"]'),groupsA=partA.locator(':scope > details.p55-price-group'),groupsB=partB.locator(':scope > details.p55-price-group'),partControls=partA.getByRole('group',{name:'Working A expand collapse',exact:true});
 assert.equal(await groupsA.count(),20,'All nineteen systems plus COMMON keep their existing headings');
 const beforeB=await groupsB.evaluateAll(ns=>ns.map(n=>n.open));
 const dtrs=partA.locator('[data-component-key="bid.budget.working.group.TEL-RADIO-DTRS"]'),marine=partA.locator('[data-component-key="bid.budget.working.group.TEL-RADIO-MARINE"]');
 const nestedBefore=await groupsA.locator('details').evaluateAll(ns=>ns.map(n=>n.open));
 await partControls.getByRole('button',{name:'− หุบทุกหัวข้อ',exact:true}).click();assert(await groupsA.evaluateAll(ns=>ns.every(n=>!n.open)));assert(await partA.evaluate(n=>n.open),'Keep Part A itself open');assert.deepEqual(await groupsB.evaluateAll(ns=>ns.map(n=>n.open)),beforeB);
 await dtrs.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert(await dtrs.evaluate(n=>n.open));assert.equal(await marine.evaluate(n=>n.open),false,'Individual keyboard disclosure stays independent');
 await partControls.getByRole('button',{name:'+ ขยายทุกหัวข้อ',exact:true}).click();assert(await groupsA.evaluateAll(ns=>ns.every(n=>n.open)));assert.deepEqual(await groupsA.locator('details').evaluateAll(ns=>ns.map(n=>n.open)),nestedBefore,'Bulk commands retain nested reading choices');
 await partControls.getByRole('button',{name:'− หุบทุกหัวข้อ',exact:true}).click();await nav('bid.budget.working.group.TEL-RADIO-MARINE');await page.waitForFunction(()=>document.querySelector('[data-component-key="bid.budget.working.group.TEL-RADIO-MARINE"]')?.open);assert(await marine.evaluate(n=>n.open));assert.equal(await dtrs.evaluate(n=>n.open),false,'Module Search opens only the requested collapsed group');
 assert(await marine.locator(':scope > summary').getByRole('button',{name:'Copy component ID bid.budget.working.group.TEL-RADIO-MARINE',exact:true}).isVisible());
 for(const part of ['B','C']){await nav('bid.budget.working.part.'+part);const panel=page.locator('[data-component-key="bid.budget.working.part.'+part+'"]'),groups=panel.locator(':scope > details.p55-price-group'),controls=panel.getByRole('group',{name:'Working '+part+' expand collapse',exact:true});await controls.getByRole('button',{name:'− หุบทุกหัวข้อ',exact:true}).click();assert(await groups.evaluateAll(ns=>ns.every(n=>!n.open)));await controls.getByRole('button',{name:'+ ขยายทุกหัวข้อ',exact:true}).click();assert(await groups.evaluateAll(ns=>ns.every(n=>n.open)));assert(await marine.evaluate(n=>n.open));assert.equal(await dtrs.evaluate(n=>n.open),false);}
 await nav('bid.budget.working.part.A');await page.setViewportSize({width:390,height:844});assert(await partControls.getByRole('button',{name:'− หุบทุกหัวข้อ',exact:true}).isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Working bulk controls fit mobile');await page.setViewportSize({width:1440,height:1100});
 assert.deepEqual(await read(),initial,'Bulk/individual disclosure and Module Search never save financial or source/history records');
 if(process.env.PJ0550_WORKING_GROUPS_ONLY){assert.deepEqual(errors,[]);console.log('PASS Working bulk disclosure: all20 Part A groups, independent A/B/C commands and individual keyboard toggles, nested reading state, Module Search/Copy ID, mobile containment and unchanged canonical workspace.');return;}
 await nav('bid.budget.official.summary');
 const stages=page.getByRole('group',{name:'Bidding pricing stages'});
 for(const [label,id] of [['Budget THB','bid.budget.budget-thb'],['Release Preview USD','bid.budget.release'],['Working Preview','bid.budget.working.lines']]){
  await stages.getByRole('button').filter({hasText:label}).click();
  await page.locator('[data-module-focused="true"][data-component-key="'+id+'"]').waitFor({state:'visible'});
  assert(await page.locator('[data-component-key="'+id+'"]').evaluate(e=>e.open));await checkOrder();
 }
 await nav('bid.working-preview.step.7');
 await page.locator('[data-component-key="bid.working-preview.step.7"]').waitFor({state:'visible'});
 await nav('bid.budget.official.summary');
 assert.deepEqual(await read(),initial,'Ordering, shortcuts and nested WP navigation never rewrite canonical data');
 await sections.evaluateAll(nodes=>nodes.forEach(n=>{n.open=false;}));
 await checkOrder();await page.setViewportSize({width:390,height:844});await checkOrder();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Numbered overview fits mobile');
 if(process.env.PJ0550_SUMMARY_QA_DIR){
  fs.mkdirSync(process.env.PJ0550_SUMMARY_QA_DIR,{recursive:true});
  await sections.first().scrollIntoViewIfNeeded();await page.locator('[data-testid="bid-commercial"]').screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'ordered-overview-mobile.png')});
 }
 await page.setViewportSize({width:1440,height:1100});
 if(process.env.PJ0550_SUMMARY_QA_DIR){await sections.first().scrollIntoViewIfNeeded();await page.locator('[data-testid="bid-commercial"]').screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'ordered-overview-desktop.png')});}
 await nav('bid.budget.official.summary');
 console.log('CHECK fixed 10.0–10.8 order, nested WP, unique summary/FX, shortcuts and mobile overview');
 console.log('CHECK summary navigation');
 const summary=page.locator('[data-component-key="bid.budget.official.summary"]');await summary.getByRole('table',{name:'Known customer prices by part',exact:true}).waitFor();
 const customer=summary.getByRole('table',{name:'Known customer prices by part',exact:true}),native=summary.getByRole('table',{name:'Known native Working prices',exact:true});
 assert((await customer.innerText()).includes('$'));assert((await customer.innerText()).includes('ยังขาด'));assert((await native.innerText()).includes('EUR'));assert((await summary.innerText()).includes('OPEN'));
 assert.deepEqual(await read(),initial,'Opening summary does not save or rewrite any price/history');
 await page.getByRole('button',{name:'Official · ตรวจทบทวนแล้ว',exact:true}).click();assert((await customer.innerText()).includes('$'),'Provisional candidate prices remain explicitly visible alongside Official OPEN');
 await page.getByRole('group',{name:'Bidding pricing stages'}).getByRole('button').filter({hasText:'Release Preview USD'}).click();await summary.getByRole('table',{name:'Known customer prices by part',exact:true}).waitFor();assert((await summary.innerText()).includes('PROVISIONAL'));
 await page.getByRole('button',{name:'Working · รอทบทวน',exact:true}).click();
 console.log('CHECK release table');
 const release=page.locator('[data-component-key="bid.budget.release"]'),identity=release.getByRole('region',{name:'Release table Module ID'}),table=release.getByRole('table',{name:'Official customer form',exact:true});
 await table.waitFor({state:'visible'});
 assert.equal(await release.locator('[aria-label="Part A Full Bid inventory"]').count(),0);
 if(process.env.PJ0550_PART_ID_ONLY){
  await release.getByRole('group',{name:'Release expand collapse'}).getByRole('button',{name:'− หุบทั้งหมด',exact:true}).click();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.releaseCopyValue=value;}}}));
  for(const part of ['A','B','C']){
   const id='bid.budget.release.part.'+part,row=table.locator('[data-component-key="'+id+'"]'),toggle=row.locator('[data-release-toggle="part:'+part+'"]');
   assert(await row.isVisible());assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   await row.getByRole('button',{name:'Copy component ID '+id,exact:true}).click();assert.equal(await page.evaluate(()=>window.releaseCopyValue),'PJ2608-0550 / '+id);
   assert.equal(await toggle.getAttribute('aria-expanded'),'false','Copy must not toggle the section');
   const subtotal=await row.locator('td').nth(6).innerText();
   await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
   assert.equal(await row.locator('td').nth(6).innerText(),subtotal);
   if(part==='A'){
    assert(await table.locator('tr.p55-release-mr-category').first().isVisible());
    assert.equal(await release.locator('[aria-label="Part A Full Bid inventory"]').count(),0);
   }
   await toggle.click();
  }
  await nav('bid.budget.release.part.B');
  await page.waitForFunction(()=>document.querySelector('[data-release-toggle="part:B"]')?.getAttribute('aria-expanded')==='true');
  assert.equal(await table.locator('[data-release-toggle="part:A"]').getAttribute('aria-expanded'),'false');
  await page.setViewportSize({width:390,height:844});
  for(const part of ['A','B','C'])assert(await table.locator('[data-component-key="bid.budget.release.part.'+part+'"]').getByRole('button',{name:'Copy component ID bid.budget.release.part.'+part,exact:true}).isVisible());
  assert.deepEqual(await read(),initial);assert.deepEqual(errors,[]);
  console.log('PASS Release A/B/C IDs: all three collapsed headers expose unique IDs and copy full project-qualified values, copy preserves +/- state, toggles remain independent, Module Search opens Part B, mobile header copies remain visible, unchanged IndexedDB and no page errors.');return;
 }
 const radioId='bid.budget.release.line.REQ-MR-B1-11-APF-01',radio=table.locator('[data-component-key="'+radioId+'"]');
 const radioToggle=table.locator('[data-release-toggle="bid.budget.release.customer.A1-07"]');
 const partARow=table.locator('[data-component-key="bid.budget.release.part.A"]'),partAControls=partARow.getByRole('group',{name:'Part A expand collapse'});
 const appendixToggle=table.locator('[data-release-toggle="mr:1.1"]');
 const appendixRow=appendixToggle.locator('xpath=ancestor::tr');
 const otherParts=table.locator('[data-release-toggle="part:B"],[data-release-toggle="part:C"],[data-release-toggle="part:B:other"],[data-release-toggle="part:C:other"]');
 const otherStates=await otherParts.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('aria-expanded')));
 const subtotal=await partARow.locator('td').nth(6).innerText();
 assert(await radio.isVisible(),'Part A items are visible in the initial view');
 assert.deepEqual(await appendixRow.locator('td').allInnerTexts(),['−','MR App. 1.1','VHF and MF/HF','']);
 assert.equal(await appendixToggle.getAttribute('aria-label'),'หุบ MR App. 1.1 · VHF and MF/HF');
 await partAControls.getByRole('button',{name:'− หุบรายการ A',exact:true}).click();
 assert.equal(await radio.isVisible(),false);
 assert(await partARow.isVisible());
 assert.equal(await partARow.locator('td').nth(6).innerText(),subtotal);
 if(process.env.PJ0550_SUMMARY_QA_DIR){fs.mkdirSync(process.env.PJ0550_SUMMARY_QA_DIR,{recursive:true});await identity.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'release-mr-collapsed.png')});}
 await appendixToggle.click();assert(await radio.isVisible(),'Reopening an appendix restores its nested detail state');
 await appendixToggle.click();assert.equal(await radio.isVisible(),false);
 await partAControls.getByRole('button',{name:'+ ขยายรายการ A',exact:true}).click();
 assert(await radio.isVisible());
 assert.equal(await table.locator('[data-release-toggle="working:A"]').count(),0);
 assert(await table.locator('[data-component-key="bid.budget.release.line.LINE-LEGACY-TEL-PAGA-1"]').isVisible(),'Package price row remains visible under its Lot');
 assert.deepEqual(await otherParts.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('aria-expanded'))),otherStates);
 await appendixToggle.click();assert.equal(await radio.isVisible(),false);
 await appendixToggle.click();assert(await radio.isVisible());
 assert.deepEqual(await table.locator('tr.p55-customer-group').evaluateAll(rows=>rows.slice(0,4).map(r=>r.getAttribute('data-component-key'))),['A1-07','A1-08','A1-10','A1-09'].map(c=>'bid.budget.release.customer.'+c));
 await radioToggle.click();assert.equal(await radio.isVisible(),false);
 await radioToggle.click();assert.equal(await radio.isVisible(),true);
 const siteToggle=table.locator('[data-release-toggle="bid.budget.release.customer.A1-07/site/APF"]');
 const siteRow=siteToggle.locator('xpath=ancestor::tr');
 const marineSite=table.locator('[data-release-toggle="bid.budget.release.customer.A1-08/site/APF"]').locator('xpath=ancestor::tr');
 assert.equal(await siteRow.locator('td').nth(1).innerText(),'Lot A1-07');
 assert.equal(await marineSite.locator('td').nth(1).innerText(),'Lot A1-08');
 assert(await siteRow.locator('td').nth(2).getByRole('button',{name:/A1-07 · APF/}).isVisible());
 const descriptionIndent=row=>row.locator('td').nth(2).evaluate(cell=>parseFloat(getComputedStyle(cell).paddingLeft));
 assert(await descriptionIndent(radio)>await descriptionIndent(siteRow),'Items are nested deeper than their site headings');
 await radioToggle.click();assert.equal(await siteRow.isVisible(),false);assert(await marineSite.isVisible());
 await radioToggle.click();assert(await siteRow.isVisible());
 await siteToggle.focus();await siteToggle.press('Enter');assert.equal(await radio.isVisible(),false,'Keyboard collapses its own site');
 await siteToggle.press('Enter');assert.equal(await radio.isVisible(),true);
 await release.getByRole('group',{name:'Release expand collapse'}).getByRole('button',{name:'− หุบทั้งหมด',exact:true}).click();
 await nav(radioId);await radio.waitFor({state:'visible'});assert.equal(await radioToggle.getAttribute('aria-expanded'),'true','Module search opens all collapsed ancestors');
 await nav('bid.budget.release');
 await release.getByRole('group',{name:'Release expand collapse'}).getByRole('button',{name:'+ ขยายทั้งหมด',exact:true}).click();
 await identity.scrollIntoViewIfNeeded();assert((await identity.innerText()).includes('PJ2608-0550 /'));assert((await identity.innerText()).includes('bid.budget.release'));
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.releaseCopyValue=value;}}}));
 await identity.getByRole('button',{name:'Copy component ID bid.budget.release',exact:true}).click();assert.equal(await page.evaluate(()=>window.releaseCopyValue),'PJ2608-0550 / bid.budget.release');
 assert(await table.locator('tr.p55-customer-line').evaluateAll(rows=>rows.some(r=>/^\$[\d,]+\.\d{2}$/.test(r.cells[6].textContent))),'Known USD amounts display in actual Release line cells');
 assert((await table.innerText()).includes('เหตุผลที่ยังเป็น OPEN'));assert((await table.innerText()).includes('ราคาย่อยที่คำนวณได้'));
 await page.evaluate(()=>window.scrollBy(0,2500));
 const sticky=await identity.evaluate(e=>({top:e.getBoundingClientRect().top,headerBottom:document.querySelector('.genesis-topbar').getBoundingClientRect().bottom,position:getComputedStyle(e).position}));
 assert(sticky.top>=sticky.headerBottom,'Sticky table identity remains below the global header while reading long detail rows: '+JSON.stringify(sticky));
 console.log('CHECK sticky identity and prices');
 const candidate=table.locator('.p55-release-price-notes details').filter({has:page.locator('summary',{hasText:'มีราคา package ผู้ขายให้ตรวจ Mapping'})}).first();
 await candidate.locator('summary').click();assert((await candidate.innerText()).includes('ยังไม่จัดสรรราคา package นี้เข้าแถว MR'));
 console.log('CHECK package reference');
 const mr= candidate.locator('xpath=ancestor::tr');assert.equal(await mr.locator('td').nth(6).innerText(),'OPEN');
 await candidate.getByRole('button').first().click();await page.locator('[data-component-key="bid.budget.working.lines"]').waitFor({state:'visible'});
 console.log('CHECK source navigation');
 await nav('bid.budget.release');await identity.scrollIntoViewIfNeeded();
 if(process.env.PJ0550_SUMMARY_QA_DIR){fs.mkdirSync(process.env.PJ0550_SUMMARY_QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'release-desktop.png')});}
 if(process.env.PJ0550_SUMMARY_QA_DIR){fs.mkdirSync(process.env.PJ0550_SUMMARY_QA_DIR,{recursive:true});await summary.screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'summary-desktop.png')});}
 await summary.getByRole('button',{name:'เปิด Working เพื่อตรวจราคา / รายการที่ยังขาด',exact:true}).click();await page.locator('[data-component-key="bid.budget.working.lines"]').waitFor({state:'visible'});
 await nav('bid.budget.official.summary');await page.setViewportSize({width:390,height:844});await summary.scrollIntoViewIfNeeded();
 assert(await summary.evaluate(e=>e.getBoundingClientRect().width<=innerWidth),'Summary fits mobile viewport');
 if(process.env.PJ0550_SUMMARY_QA_DIR)await summary.screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'summary-mobile.png')});
 await nav('bid.budget.release');await identity.scrollIntoViewIfNeeded();assert(await identity.evaluate(e=>e.getBoundingClientRect().width<=innerWidth),'Release identity fits mobile viewport');
 if(process.env.PJ0550_SUMMARY_QA_DIR)await page.screenshot({path:path.join(process.env.PJ0550_SUMMARY_QA_DIR,'release-mobile.png')});
 await page.setViewportSize({width:1440,height:1100});await radioToggle.click();
 await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();await nav('bid.budget.release');
 assert.equal(await radioToggle.getAttribute('aria-expanded'),'false','Per-system UI preference survives reload');assert.equal(await radio.isVisible(),false);
 assert.equal(await table.locator('[data-release-toggle="bid.budget.release.customer.A1-08"]').getAttribute('aria-expanded'),'true','Other systems keep independent UI state');
 assert.deepEqual(await read(),initial);assert.deepEqual(errors,[]);
 console.log('PASS summary/release browser: MR order and nested +/- toggles, keyboard operation, collapsed-row module navigation, independent persisted state after reload, actual price cells/copy/OPEN/package navigation, desktop/mobile containment, unchanged IndexedDB and no page errors.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
