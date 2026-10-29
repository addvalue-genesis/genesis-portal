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
 console.log('CHECK summary navigation');
 const summary=page.locator('[data-component-key="bid.budget.official.summary"]');await summary.getByRole('table',{name:'Known customer prices by part',exact:true}).waitFor();
 const customer=summary.getByRole('table',{name:'Known customer prices by part',exact:true}),native=summary.getByRole('table',{name:'Known native Working prices',exact:true});
 assert((await customer.innerText()).includes('$'));assert((await customer.innerText()).includes('ยังขาด'));assert((await native.innerText()).includes('EUR'));assert((await summary.innerText()).includes('OPEN'));
 assert.deepEqual(await read(),initial,'Opening summary does not save or rewrite any price/history');
 await page.getByRole('button',{name:'Official · ตรวจทบทวนแล้ว',exact:true}).click();assert((await customer.innerText()).includes('$'),'Provisional candidate prices remain explicitly visible alongside Official OPEN');
 await page.getByRole('group',{name:'Bidding pricing stages'}).getByRole('button').filter({hasText:'Release Preview USD'}).click();await summary.getByRole('table',{name:'Known customer prices by part',exact:true}).waitFor();assert((await summary.innerText()).includes('PROVISIONAL'));
 await page.getByRole('button',{name:'Working · ราคาเดิมรออัปเดต',exact:true}).click();
 console.log('CHECK release table');
 const release=page.locator('[data-component-key="bid.budget.release"]'),identity=release.getByRole('region',{name:'Release table Module ID'}),table=release.getByRole('table',{name:'Official customer form',exact:true});
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
 assert.deepEqual(await read(),initial);assert.deepEqual(errors,[]);
 console.log('PASS summary/release browser: numeric prices in actual 10.7 table, table Module ID copy, OPEN reasons and incomplete Lot subtotals, unallocated package source navigation, Official/Provisional and Working/Release navigation, desktop/mobile containment, unchanged IndexedDB prices/history and no page errors.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
