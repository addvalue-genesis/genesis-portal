// Optional browser validation. Requires Playwright and Chromium; no new app dependencies.
// See docs/handoff/pj2608-0550/20261026_PAGA_COVERAGE_IMPLEMENTATION.md.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root=path.resolve(__dirname,'..'), output=process.argv[2],metrics={},hashes={},errors=[];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Local production server and browser share one process lifecycle; no deployment.
const server=http.createServer((req,res)=>{const asset=req.url.split('?')[0];const f=['/bundle.js','/bundle.css'].includes(asset)?path.join(root,'dist',asset):path.join(root,'public/index.html');res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox'],headless:true});try{const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.__longtasks=[];new PerformanceObserver(l=>window.__longtasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});});await page.goto(`http://127.0.0.1:${server.address().port}/projects/pj2608-0550`);await page.getByRole('button',{name:'19 Systems',exact:true}).waitFor();
 const click=async(name,key)=>{const ms=await page.evaluate(async name=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===name);if(!b)throw new Error('Missing '+name);const t=performance.now();b.click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-t;},name);(metrics[key||name]??=[]).push(ms);};
 const save=async k=>hashes[k]=hash(await page.locator('.p55-stack').last().innerText());
 for(let i=0;i<7;i++){
 await click('19 Systems');if(i===0)await save('systems');
 await page.locator('.p55-filterbar select').selectOption('TEL-PAGA');
 for(let j=0;j<2;j++){const ms=await page.evaluate(async()=>{const t=performance.now();document.querySelector('.p55-system__summary').click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-t});(metrics['PAGA toggle']??=[]).push(ms);}
 await click('First Principles');if(i===0)await save('engineering');
 await click('Budget');if(i===0)await save('budgetary');await click('Working Preview');if(i===0)await save('working');await click('Released Customer Output');if(i===0)await save('released');await click('Budgetary Submission');
 }
 if(process.env.CHECK_COVERAGE==='1') {
 await click('First Principles');
 if(await page.locator('table[aria-label="19-system coverage inventory"] tbody tr').count()!==19)throw new Error('Coverage system count');
 await page.getByRole('button',{name:'19 · TEL-AIS',exact:true}).click();
 if(await page.locator('[data-testid="coverage-detail"]').getAttribute('data-system-token')!=='TEL-AIS')throw new Error('System focus failed');
 await page.getByLabel('Coverage system',{exact:true}).selectOption('TEL-PAGA');
 if(await page.locator('[data-source-row-id]').count()!==10)throw new Error('PAGA thread count');
 const speaker=page.locator('tr[data-source-row-id="TEL-PAGA-C04"]');
 await speaker.getByText('Engineering equations / controls',{exact:true}).click();
 await speaker.getByText('SPL_required = Ambient_Noise + Required_SNR_Margin',{exact:true}).waitFor({state:'visible'});
 const ups=page.locator('tr[data-source-row-id="TEL-PAGA-C08"]');
 await ups.getByText('Service owners / E formulas (8)',{exact:true}).click();
 await ups.getByText('E01 · Applicability and cost ownership',{exact:true}).waitFor({state:'visible'});
 await click('Budget');
 }
 if(process.env.PRIVATE_EVIDENCE_FILE) {
 const assert=require('node:assert/strict'), payload=fs.readFileSync(process.env.PRIVATE_EVIDENCE_FILE,'utf8'), evidence=JSON.parse(payload);
 await click('First Principles');
 const panel=page.getByTestId('paga-evidence-review'), input=panel.getByLabel('PAGA Evidence JSON');
 assert.equal(await panel.locator('[data-requirement-id]').count(),0,'Private evidence must not be bundled');
 const importStart=Date.now();await input.setInputFiles({name:'private-evidence.json',mimeType:'application/json',buffer:Buffer.from(payload)});
 await panel.getByText('Final Release: HOLD · Financial posting: NONE',{exact:true}).waitFor();
 metrics['Evidence import']=[Date.now()-importStart];
 assert.equal(await panel.locator('[data-requirement-id]').count(),evidence.requirements.length);
 const groupKeys=[...new Set([...evidence.quantityRows,...evidence.tags].map(r=>`${r.site}/${r.category}`))];
 assert.equal(await panel.locator('[data-quantity-group]').count(),groupKeys.length);
 for(const key of groupKeys){
  const [site,category]=key.split('/'), mr=evidence.quantityRows.filter(q=>q.site===site&&q.category===category), tags=evidence.tags.filter(t=>t.site===site&&t.category===category);
  const qty=mr.length&&mr.every(r=>r.quantity!==null)?mr.reduce((n,r)=>n+r.quantity,0):null;
  const count=tags.length?new Set(tags.map(t=>t.tag)).size:null;
  const cells=await panel.locator(`[data-quantity-group="${key}"] td`).allInnerTexts();
  assert.equal(cells[1],qty===null?'OPEN':String(qty));assert.equal(cells[2],count===null?'OPEN':String(count));
 }
 await panel.locator('[data-requirement-id]').first().locator('summary').click();
 await panel.getByText('Scope responsibility in source:',{exact:false}).first().waitFor({state:'visible'});
 if(process.env.EVIDENCE_SCREENSHOT)await page.screenshot({path:process.env.EVIDENCE_SCREENSHOT});
 await panel.getByText('Source TAG register',{exact:true}).click();
 assert.equal(await panel.getByRole('table',{name:'PAGA source TAG register'}).locator('tbody tr').count(),evidence.tags.length);
 await panel.getByLabel('PAGA TAG site').selectOption('ACP');
 assert.equal(await panel.getByRole('table',{name:'PAGA source TAG register'}).locator('tbody tr').count(),evidence.tags.filter(t=>t.site==='ACP').length);
 await click('Budget');await save('budgetary');await click('Working Preview');await save('working');await click('Released Customer Output');await save('released');await click('Budgetary Submission');
 await click('19 Systems');await save('systems');await click('First Principles');
 assert.equal(await panel.locator('[data-requirement-id]').count(),evidence.requirements.length,'Evidence did not survive tab change');
 await input.setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"projectId":"PJ2608-0553"}')});
 await panel.getByRole('alert').waitFor();assert.equal(await panel.locator('[data-requirement-id]').count(),0,'Invalid import retained stale evidence');
 await input.setInputFiles({name:'private-evidence.json',mimeType:'application/json',buffer:Buffer.from(payload)});
 await panel.getByText('Final Release: HOLD · Financial posting: NONE',{exact:true}).waitFor();
 await panel.getByRole('button',{name:'ล้างชุดหลักฐาน',exact:true}).click();
 assert.equal(await panel.locator('[data-requirement-id]').count(),0,'Clear failed');
 await input.setInputFiles({name:'private-evidence.json',mimeType:'application/json',buffer:Buffer.from(payload)});
 await panel.getByText('Final Release: HOLD · Financial posting: NONE',{exact:true}).waitFor();
 await click('Budget');
 }
 const start=Date.now(),downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export SAMTEL Rev00 XLSX',exact:true}).click();const download=await downloadPromise;const bytes=fs.readFileSync(await download.path());hashes.xlsx=hash(bytes);metrics['XLSX download']=[Date.now()-start];
 const details=await page.evaluate(()=>({longtasks:window.__longtasks,domNodes:document.querySelectorAll('*').length,memory:performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize}:null,navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd}))}));
 const report={evidenceInteractions:process.env.PRIVATE_EVIDENCE_FILE?'PASS':'NOT_RUN',coverageInteractions:process.env.CHECK_COVERAGE==='1'?'PASS':'NOT_RUN',browser:await browser.version(),viewport:'1440x1000',method:'production; click-to-two-animation-frames; warm 7 cycles plus optional evidence interactions; import is wall-clock automation time; headless environment, not user Windows; memory coarse; not React Profiler',metrics:Object.fromEntries(Object.entries(metrics).map(([k,v])=>{const a=v.slice().sort((a,b)=>a-b);return[k,{n:a.length,medianMs:+a[Math.floor(a.length/2)].toFixed(3),maxMs:+a.at(-1).toFixed(3)}]})),hashes,errors,...details};if(errors.length)throw new Error('Browser errors: '+errors.join('; '));
 if(process.env.BASELINE_REPORT){
  const before=JSON.parse(fs.readFileSync(process.env.BASELINE_REPORT,'utf8'));
  for(const key of ['systems','budgetary','working','released','xlsx']) {
   if(before.hashes[key]!==report.hashes[key])throw new Error('Output parity failed: '+key);
  }
  report.protectedOutputParity='PASS';
 }
 if(output)fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
