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
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
  const db=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);r.onsuccess=()=>{const d=r.result,t=d.transaction('workspace','readonly'),q=t.objectStore('workspace').get('active');q.onsuccess=()=>resolve(JSON.stringify(q.result));q.onerror=()=>reject(q.error);t.oncomplete=()=>d.close();};r.onerror=()=>reject(r.error);}));
  const nav=async label=>page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name:label,exact:true}).click();
  const find=async id=>{await page.getByLabel('Project Module Search').fill('PJ2608-0550 / '+id);await page.getByLabel('Project Module Search').press('Enter');};
  await page.goto(`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`);
  await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();const before=await db();
  await nav('Architecture');const principles=page.getByRole('region',{name:'หลักการทำงาน System Integrator 0550'});
  await principles.getByRole('table',{name:'SI runtime controls'}).waitFor();assert.equal(await principles.getByRole('table',{name:'SI runtime controls'}).locator('tbody tr').count(),10);
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
  assert.deepEqual(errors,[]);console.log('PASS SI browser: Architecture/Guide equation and live controls, 15 existing-module links, A and Supplier navigation, 10.7-to-Source, Guide-to-Architecture, mobile containment and unchanged IndexedDB after navigation/reload; no page errors.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
