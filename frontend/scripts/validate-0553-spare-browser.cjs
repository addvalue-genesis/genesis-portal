// Real browser test. Requires Playwright (or PLAYWRIGHT_MODULE) and a browser.
// CHROMIUM_EXECUTABLE may select a provisioned Chromium. No financial writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const cwd=path.resolve(__dirname,'..'),out=process.env.QA_OUTPUT_DIR||path.join(require('node:os').tmpdir(),'genesis-spare-qa');
const port=process.env.QA_PORT||'3090';
const exportsOnly=process.argv.includes('--exports-only');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const server=spawn(process.execPath,['node_modules/webpack-cli/bin/cli.js','serve','--mode','development','--port',port,'--no-hot','--no-live-reload'],{cwd,stdio:['ignore','pipe','pipe']});
 let browser;
 try{
  await new Promise((resolve,reject)=>{
   let log='';const timer=setTimeout(()=>reject(Error('Dev server timeout: '+log.slice(-3000))),60000);
   const read=b=>{log+=b;if(log.includes('compiled successfully')){clearTimeout(timer);resolve();}};
   server.stdout.on('data',read);server.stderr.on('data',read);
   server.on('exit',code=>{clearTimeout(timer);reject(Error('Dev server '+code+': '+log.slice(-3000)));});
  });
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,
   args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let fileChoosers=0;page.on('filechooser',()=>fileChoosers++);
  await page.goto('http://localhost:'+port+'/projects/pj2608-0553');
  const search=page.getByRole('textbox',{name:'ค้นหา Module ทั้งโครงการ'});
  await search.fill('bid.budget.pricing.official');await search.press('Enter');
  const official=page.locator('[data-component-key="bid.budget.pricing.official"]');
  await official.waitFor();
  const summary=await official.innerText();
  for(const amount of ['863,900.00','97,500.00','23,000.00'])assert(summary.includes(amount));
  assert.equal(await official.locator('[data-option-price-status="CONDITIONAL_BUDGETARY_OFFER"]').count(),2);
  const download=page.waitForEvent('download');
  await official.getByRole('button',{name:'Export Excel — English / USD',exact:true}).click();
  await (await download).saveAs(path.join(out,'official.xlsx'));
  await official.getByRole('tab',{name:'B10 CommSpares',exact:true}).click();
  const b10ids=exportsOnly?[]:await official.locator('[data-native-b10-source-id]').evaluateAll(rs=>rs.map(r=>r.getAttribute('data-native-b10-source-id')));
  if(!exportsOnly)assert.equal(b10ids.length,14);
  for(const id of b10ids){
   await official.locator('[data-native-b10-source-id="'+id+'"]').getByRole('button',{name:'↗ Source',exact:true}).click();
   const source=page.locator('[data-component-key="bid.budget.working.bc.b10.stage-spare-selection.'+id.toLowerCase()+'"]');
   await source.waitFor({state:'visible'});
   const banner=page.locator('[data-spare-return-code="B10"]');
   await banner.getByRole('button').click();
   const target=page.locator('[data-component-key="bid.budget.pricing.release.preview"] [data-native-b10-source-id="'+id+'"]');
   await target.waitFor({state:'visible'});
   await page.waitForFunction(el=>el.classList.contains('p553-release-row-focus'),await target.elementHandle());
   await page.getByRole('button',{name:/10\.3\.4 · Official Release/}).click();
   await official.getByRole('tab',{name:'B10 CommSpares',exact:true}).click();
  }
  if(!exportsOnly)console.log('PASS browser B10: 14 exact function Source→Release roundtrips');
  const counts=exportsOnly?{}:{B11:4,B13:3,C1:1,C2:12};
  for(const [code,count] of Object.entries(counts)){
   await official.getByRole('tab',{name:new RegExp('^'+code+' ')}).click();
   const rows=official.locator('[data-other-spare-source-id]');assert.equal(await rows.count(),count);
   const ids=await rows.evaluateAll(rs=>rs.map(r=>r.getAttribute('data-other-spare-source-id')));
   for(const id of ids){
    const row=official.locator('[data-other-spare-source-id="'+id+'"]');
    const parent=await row.getAttribute('data-parent-source-id');
    await row.getByRole('button',{name:code==='C2'?'↗ Rev08 Source':'↗ Working Source',exact:true}).click();
    const source=code==='C2'?
     page.locator('[data-component-key="bid.budget.working.bc.c2.priced-budget-review.'+id.toLowerCase()+'"]'):
     page.locator('[data-component-key="bid.budget.working.bc.'+code.toLowerCase()+'.spare-line.'+parent.toLowerCase()+'"]');
    await source.waitFor({state:'visible'});
    const banner=page.locator('[data-spare-return-code="'+code+'"]');
    assert.equal(await banner.getAttribute('data-spare-return-source-id'),code==='C2'?id:parent);
    await banner.getByRole('button').click();
    const release=page.locator('[data-component-key="bid.budget.pricing.release.preview"]');
    const target=code==='C2'?release.locator('[data-other-spare-source-id="'+id+'"]'):
     release.locator('[data-component-key="bid.budget.pricing.release.preview.annex.'+code.toLowerCase()+'.'+parent.toLowerCase()+'"]');
    await target.waitFor({state:'visible'});
    await page.waitForFunction(el=>el.classList.contains('p553-release-row-focus'),await target.elementHandle());
    if(code.startsWith('C')){
     const annex=release.locator('[data-original-spare-annex="'+code+'"]');
     assert((await annex.innerText()).includes(code==='C1'?'3,071,250.00':'721,806.60'));
     assert((await annex.innerText()).includes('UNIT PRICE (THB)'));
    }
    await page.getByRole('button',{name:/10\.3\.4 · Official Release/}).click();
    await official.getByRole('tab',{name:new RegExp('^'+code+' ')}).click();
   }
   console.log('PASS browser '+code+': '+count+' exact Source→Release roundtrips');
  }
  await page.getByRole('button',{name:/10\.3\.3 · Release/}).click();
  const release=page.locator('[data-component-key="bid.budget.pricing.release.preview"]');
  await release.getByRole('tab',{name:'Scope of supply',exact:true}).click();
  const body=await release.innerText();
  for(const amount of ['27,192,339.36','3,071,250.00','721,806.60'])assert(body.includes(amount));
  const workingDownload=page.waitForEvent('download');
  await release.getByRole('button',{name:'Export Excel — WORKING DRAFT',exact:true}).click();
  await (await workingDownload).saveAs(path.join(out,'working.xlsx'));
  await release.screenshot({path:path.join(out,'release-summary.png')});
  assert.equal(fileChoosers,0);assert.deepEqual(errors,[]);
  console.log('PASS browser: THB/USD summary parity; both native downloads, no chooser; zero page errors. '+out);
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
