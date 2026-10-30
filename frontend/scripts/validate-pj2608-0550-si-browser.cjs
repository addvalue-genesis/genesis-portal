// Isolated synthetic browser; no user Drive data or signed-in browser session.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const url=req.url.split('?')[0],asset=/^\/(?:bundle|[0-9]+(?:\.bundle)?)\.(?:js|css)$/.test(url);
 const file=asset?path.join(root,'dist',url):path.join(root,'public/index.html');
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'],headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);if(process.env.SI_DEBUG)console.error('PAGE ERROR',e.message);});page.setDefaultTimeout(20000);
  const db=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);r.onsuccess=()=>{const d=r.result,t=d.transaction('workspace','readonly'),q=t.objectStore('workspace').get('active');q.onsuccess=()=>resolve(JSON.stringify(q.result));q.onerror=()=>reject(q.error);t.oncomplete=()=>d.close();};r.onerror=()=>reject(r.error);}));
  const nav=async label=>page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name:label,exact:true}).click();
  const find=async id=>{await page.getByLabel('Project Module Search').fill('PJ2608-0550 / '+id);await page.getByLabel('Project Module Search').press('Enter');};
  await page.goto(`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`);
  await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();const before=await db();
  await nav('Architecture');const principles=page.getByRole('region',{name:'หลักการทำงาน System Integrator 0550'});
  await principles.getByRole('table',{name:'SI runtime controls'}).waitFor();assert.equal(await principles.getByRole('table',{name:'SI runtime controls'}).locator('tbody tr').count(),11);
  assert((await principles.getByRole('table',{name:'SI runtime controls'}).locator('tbody tr').first().innerText()).includes('A · เอกสารตาม RFQ พร้อมให้ B ใช้'),'Current baseline includes the existing A readiness check');
  assert((await principles.innerText()).includes('F_SI(A, S; K, D, Θ)'));assert((await principles.innerText()).includes('HOLD / NOT ISSUED'));
  assert.equal(await principles.getByRole('table',{name:'SI module responsibilities'}).locator('tbody tr').count(),15);
  await principles.getByRole('button',{name:'เปิด A · ต้นทางลูกค้า',exact:true}).click();await page.locator('[data-component-key="l3.original"]').waitFor({state:'visible'});
  await page.getByRole('button',{name:'B · Engineering & Bid Preparation',exact:true}).click();await nav('Architecture');
  await principles.getByRole('button',{name:'เปิดข้อมูล Supplier',exact:true}).click();await page.locator('[data-component-key="bid.vendor.offers"]').waitFor({state:'visible'});
  await nav('Architecture');await principles.getByRole('button',{name:'10.7 Release Preview USD',exact:true}).click();
  await page.getByRole('table',{name:'Official customer form',exact:true}).waitFor({state:'visible'});
  await page.locator('[data-component-key="bid.budget.release"]').getByRole('button',{name:/^กลับ Source/}).first().click();
  await page.locator('[data-module-focused="true"][data-component-key^="bid.budget.working."]').waitFor({state:'visible'});
  await find('bid.budget.guide');const guide=page.locator('[data-component-key="bid.budget.guide"]');
  await guide.getByRole('button',{name:'เปิด 03 Architecture · สมการและการเชื่อมโมดูลทั้งหมด',exact:true}).click();
  await principles.getByRole('table',{name:'SI module responsibilities'}).waitFor({state:'visible'});
  if(process.env.SI_SCREENSHOT)await page.screenshot({path:process.env.SI_SCREENSHOT,fullPage:true});
  await page.setViewportSize({width:390,height:844});if(process.env.SI_DEBUG)console.log(await page.evaluate(()=>[...document.querySelectorAll('.p55,.p55-main,.p55-stack,.p55-si-principles,.p55-table-wrap,.p55-grid')].map(n=>({tag:n.tagName,cls:n.className,width:n.getBoundingClientRect().width,right:n.getBoundingClientRect().right,scroll:n.scrollWidth,overflow:getComputedStyle(n).overflowX}))));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile page must contain wide tables');
  assert.equal(await db(),before,'Navigation and diagnostics must not write financial/source records');
  await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();assert.equal(await db(),before,'Saved inputs survive reload without migration or approval');
  if(process.env.SI_WORK_PACKAGE_PATH){
   page.setDefaultTimeout(60000);
   const pack=JSON.parse(fs.readFileSync(process.env.SI_WORK_PACKAGE_PATH,'utf8'));
   await find('bid.documents.si-work-package');
   await page.getByLabel('Import SI work package').setInputFiles(process.env.SI_WORK_PACKAGE_PATH);
   await page.getByRole('table',{name:'SI draft import changes'}).waitFor();
   await page.getByRole('button',{name:'Apply SI work package',exact:true}).click();
   await page.getByRole('status').filter({hasText:'นำเข้าผลวิเคราะห์แล้ว'}).waitFor();
   const imported=JSON.parse(await db()),original=JSON.parse(before);
   for(const key of ['vendors','offers','lines','calculations','nodes','edges','fx','deviationRelease'])assert.deepEqual(imported[key],original[key],'Import must preserve '+key);
   assert.equal(imported.sourceIntake.batchId,pack.sourceIntake.batchId);
   for(const key of ['requirements','proofs','activities'])for(const record of pack.integrationWorkspace[key])assert(imported.integrationWorkspace[key].some(r=>r.id===record.id));
   assert(imported.integrationWorkspace.requirements.some(r=>r.id==='REQ-AVL-PAGA-INDUSTRONIC'),'Existing selected PAGA AVL work survives import');
   await page.reload();await page.locator('.p55-bid-save').filter({hasText:'Revision '+imported.revision}).waitFor();
   await page.getByRole('button',{name:'A · Original RFQ Documents',exact:true}).click();
   await page.getByLabel('Import SI work package').setInputFiles(process.env.SI_WORK_PACKAGE_PATH);
   await page.getByRole('table',{name:'SI draft import changes'}).waitFor();
   assert(await page.getByRole('button',{name:'Apply SI work package',exact:true}).isDisabled(),'Reimport must add no duplicate records');
   assert.equal(await db(),JSON.stringify(imported),'Reload and preview retain the imported workspace');
   console.log('PASS SI browser work package: actual file preview/apply, existing selected PAGA retained, financial inputs unchanged, canonical records persisted, reload and idempotent preview.');
  }
  assert.deepEqual(errors,[]);console.log('PASS SI browser: Architecture/Guide equation and live controls, 15 existing-module links, A and Supplier navigation, 10.7-to-Source, Guide-to-Architecture, mobile containment and unchanged IndexedDB after navigation/reload; no page errors.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
