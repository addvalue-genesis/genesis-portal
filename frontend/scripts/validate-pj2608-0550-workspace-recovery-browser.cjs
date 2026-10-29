// Isolated browser fixture: no user origin, Drive connection or stored workspace.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright'),root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],asset=/^\/(?:bundle|[0-9]+(?:\.bundle)?)\.(?:js|css)$/.test(url),file=asset?path.join(root,'dist',url):path.join(root,'public/index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'],headless:true});
  const context=await browser.newContext({acceptDownloads:true}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
  await page.goto(`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`);
  await page.locator('.p55-bid-save').filter({hasText:'Revision 1'}).waitFor();
  const read=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);r.onsuccess=()=>{const d=r.result,t=d.transaction(['workspace','revisions'],'readonly'),a=t.objectStore('workspace').get('active'),n=t.objectStore('revisions').count();t.oncomplete=()=>{d.close();resolve({data:a.result,revisions:n.result});};t.onerror=()=>reject(t.error);};r.onerror=()=>reject(r.error);}));
  const original=await read();
  // The test fixture alone acquires a field this build cannot interpret.
  const raw={...original.data,futureBidWorkflow:{note:'SYNTHETIC PRIVATE VALUE',amount:41888.25}};
  await page.evaluate(value=>new Promise((resolve,reject)=>{const r=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);r.onsuccess=()=>{const d=r.result,t=d.transaction('workspace','readwrite');t.objectStore('workspace').put(value,'active');t.oncomplete=()=>{d.close();resolve();};t.onerror=()=>reject(t.error);};r.onerror=()=>reject(r.error);}),raw);
  const fixture=await read();await page.reload();
  await page.getByRole('alert').filter({hasText:'Unsupported workspace field: futureBidWorkflow'}).waitFor();
  const recovery=page.getByRole('region',{name:'Workspace load recovery'});await recovery.waitFor();
  assert((await recovery.innerText()).includes(require('../src/projectHubRelease.json').version));
  assert((await page.locator('.p55-bid-save').innerText()).includes('เปิดข้อมูล Bidding ไม่สำเร็จ'));
  assert.deepEqual(await read(),fixture,'Failed load cannot overwrite the active record or history');
  const [download]=await Promise.all([page.waitForEvent('download'),recovery.getByRole('button',{name:'สำรองข้อมูลเดิม (RAW backup)',exact:true}).click()]);
  assert.deepEqual(JSON.parse(fs.readFileSync(await download.path(),'utf8')),raw,'RAW export includes the original unknown field and financial inputs');
  await recovery.getByText('รายละเอียดตรวจสอบ · ชื่อ field และรุ่นโปรแกรม',{exact:true}).click();
  const text=await recovery.locator('pre').innerText(),diag=JSON.parse(text);
  assert.deepEqual(diag.unsupportedFields,['futureBidWorkflow']);assert.equal(diag.workspaceRevision,original.data.revision);
  assert(!text.includes('SYNTHETIC PRIVATE VALUE'));assert(!text.includes('41888.25'));
  await page.getByRole('button',{name:'โหลดข้อมูลที่บันทึกใหม่',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Unsupported workspace field: futureBidWorkflow'}).waitFor();assert.deepEqual(await read(),fixture);
  await page.reload();await page.getByRole('region',{name:'Workspace load recovery'}).waitFor();assert.deepEqual(await read(),fixture);
  assert.deepEqual(errors,[]);
  console.log('PASS 0550 recovery browser: persisted incompatible workspace, exact field/build diagnostics, working RAW download, no private diagnostic values, reload/retry retain all financials and revision history, no page errors.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
