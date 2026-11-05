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
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(45000);
 const ready=()=>page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
 const read=()=>page.evaluate(()=>new Promise(resolve=>{const q=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);q.onsuccess=()=>{const db=q.result,r=db.transaction('workspace').objectStore('workspace').get('active');r.onsuccess=()=>{resolve(r.result);db.close();};};}));
 const jump=async id=>{const search=page.getByLabel('Project Module Search',{exact:true});await search.fill(id);await search.press('Enter');};

 await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');await ready();console.log('QA initial ready');const before=await read();console.log('QA fixture read');
 await jump('bid.working-preview.requirement.REQDEF-MR-B1-11-APF-08');
 const mapping=page.getByRole('form',{name:'Requirement Mapping editor',exact:true});await mapping.waitFor();console.log('QA mapping ready');
 assert.equal(await mapping.getByLabel('Requirement system token',{exact:true}).inputValue(),'TEL-TELT');
 assert.equal(await mapping.getByLabel('Record review status',{exact:true}).inputValue(),'DRAFT');
 await jump('bid.working-preview.step.8');
 const punch=page.getByRole('region',{name:'Bid Punch List',exact:true});await punch.waitFor();console.log('QA Punch ready');
 assert((await punch.innerText()).includes('ต้นทุนและราคาคำนวณครบเจ้าของที่เลือกแล้ว'));
 assert((await punch.innerText()).includes('มีราคา 88/88'));
 assert((await punch.innerText()).includes('ฐานต้นทุน/ราคาขาด 0'));
 assert.equal(await punch.getByRole('table',{name:'Bid workflow state meanings'}).isVisible(),false);
 await punch.getByLabel('Bid Punch filter',{exact:true}).selectOption('INPUT');
 assert.equal(await punch.locator('[data-bid-punch]').count(),0);
 await punch.getByLabel('Bid Punch filter',{exact:true}).selectOption('MINOR');
 const task=punch.locator('[data-bid-punch="REVIEW_OPEN|SYSTEM|TEL-TELT"]');await task.waitFor();
 assert((await task.innerText()).includes('เกี่ยวข้อง 4 ข้อกำหนด'));
 await task.getByRole('button',{name:'เปิดต้นทาง / ทำงานเดิม',exact:true}).click();
 await mapping.waitFor();assert.equal(await mapping.getByLabel('Requirement system token',{exact:true}).inputValue(),'TEL-TELT');
 await jump('bid.working-preview.step.8');
 await punch.getByLabel('Bid Punch filter',{exact:true}).selectOption('MINOR');
 assert.deepEqual(await read(),before,'Inspection/filter/navigation must never write canonical state');
 await task.getByRole('button',{name:'จัดแผน Major / Minor',exact:true}).click();
 const editor=page.getByRole('form',{name:'Bid Punch plan editor',exact:true});await editor.waitFor();
 await editor.getByLabel('Punch owner',{exact:true}).fill('SI QA');
 await editor.getByLabel('Punch due date',{exact:true}).fill('2026-11-12');
 await editor.getByLabel('Punch cost / price treatment',{exact:true}).fill('Existing quoted price retained; review documentation only.');
 await editor.getByLabel('Punch source / timing reference',{exact:true}).fill('QA fixture MR B1 reference; no change to contractual submission phase.');
 await editor.getByRole('button',{name:'บันทึกแผนจัดการ Punch',exact:true}).click();
 await punch.getByText('บันทึกแผนจัดการแล้ว · ราคา สถานะต้นทาง และผลตรวจวิศวกรรมใช้ข้อมูลเดิม',{exact:true}).waitFor();
 console.log('QA save rendered');const after=await read(),withoutMeta=d=>{const {bidPunchPlans,revision,audit,...rest}=d;return rest;};
 assert.equal(after.bidPunchPlans.length,1);assert.equal(after.bidPunchPlans[0].owner,'SI QA');assert.equal(after.revision,before.revision+1);
 assert.deepEqual(withoutMeta(after),withoutMeta(before),'Only optional Punch plans and normal revision/audit may change');
 assert((await task.innerText()).includes('มีแผนจัดการ · ต้นทางยังไม่ปิด'));
 assert.equal(after.integrationWorkspace.requirements.find(r=>r.id==='REQDEF-MR-B1-11-APF-08').status,'DRAFT');
 console.log('QA before reload');await page.reload();await ready();console.log('QA reload ready');await jump('bid.working-preview.step.8');
 await page.getByLabel('Working Preview system',{exact:true}).selectOption('TEL-TELT');
 await punch.getByLabel('Bid Punch filter',{exact:true}).selectOption('MINOR');await task.waitFor();
 assert((await task.innerText()).includes('SI QA'));assert(!(await task.innerText()).includes('STALE ·'));
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await punch.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Contained at '+width);}
 await page.setViewportSize({width:1440,height:1000});
 await punch.getByLabel('Bid Punch filter',{exact:true}).selectOption('ALL');
 if(process.env.PJ0550_PUNCH_SCREENSHOT){await punch.evaluate(el=>scrollTo(0,scrollY+el.getBoundingClientRect().top-75));await page.screenshot({path:process.env.PJ0550_PUNCH_SCREENSHOT});}
 await jump('bid.budget.working.group.TEL-TELT');
 const basis=page.getByRole('group',{name:'Pricing basis view',exact:true});assert(await basis.getByRole('button',{name:'Working · รอทบทวน',exact:true}).isVisible());
 const group=page.locator('[data-component-key="bid.budget.working.group.TEL-TELT"]');assert.equal(await group.locator('[data-tower-price-role="DETAIL"]').count(),2);assert(!(await group.innerText()).includes('ราคาเดิม / รออัปเดต'));
 assert.deepEqual(errors,[]);assert.deepEqual(await read(),after,'Reload/navigation does not change plans or saved workspace');
 console.log('PASS production actual browser: correct MR editor target,88/88 costs/prices despite engineering OPEN,zero numeric blockers,consolidated tasks,existing navigation,read-only inspection,durable plan+audit only,no approval/price/source changes,reload,1440/390 containment and new รอทบทวน label.');
}catch(e){console.error('QA failure before cleanup:',e);throw e;}finally{if(browser)await Promise.race([browser.close(),new Promise(r=>setTimeout(r,10000))]);server.closeAllConnections();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
