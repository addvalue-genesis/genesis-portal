const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const port=process.env.QA_PORT||'3094';
 const server=process.env.QA_URL?null:require('node:child_process').spawn(process.execPath,['node_modules/webpack-cli/bin/cli.js','serve','--mode','development','--host','127.0.0.1','--port',port],{cwd:path.resolve(__dirname,'..'),stdio:'ignore'});
 const url=process.env.QA_URL||'http://127.0.0.1:'+port+'/projects/pj2608-0553';
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(let i=0;i<150;i++){try{if((await fetch(url)).ok)break;}catch(e){}await new Promise(r=>setTimeout(r,200));}
  const page=await browser.newPage({viewport:{width:1600,height:1100},acceptDownloads:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  const search=page.getByRole('textbox',{name:'ค้นหา Module ทั้งโครงการ'});
  await search.fill('bid.budget.pricing.official');await search.press('Enter');
  const official=page.locator('[data-component-key="bid.budget.pricing.official"]');await official.waitFor();
  const summaryBefore=await official.locator('[data-quote-code]').allTextContents();
  const review=official.getByRole('region',{name:'Price breakdown review'});
  const keys=await review.locator('[data-breakdown-key]').evaluateAll(rs=>rs.map(r=>r.dataset.breakdownKey));
  assert.equal(keys.length,141);assert.equal(new Set(keys).size,141);
  for(const [index,key] of keys.entries()){
   if(process.env.QA_SAMPLE&&!new Set([0,54,55,56,57,87,88,89,90,119,120,121,140]).has(index))continue;
   const row=review.locator('[data-breakdown-key]').nth(index);
   await row.evaluate(r=>r.closest('details').open=true);
   await row.getByRole('button',{name:'↗ Source',exact:true}).click();
   const source=page.locator('[data-breakdown-source-key]');await source.waitFor({state:'visible'});
   assert.equal(await source.getAttribute('data-breakdown-source-key'),key);
   await source.getByRole('button',{name:'↩ Return to exact Breakdown row',exact:true}).click();
   await official.waitFor();
   await page.waitForFunction(key=>[...document.querySelectorAll('[data-breakdown-key]')].some(r=>r.dataset.breakdownKey===key&&r===document.activeElement),key);
   if((index+1)%25===0)console.log('Verified '+(index+1)+' exact roundtrips');
  }
  assert.deepEqual(await official.locator('[data-quote-code]').allTextContents(),summaryBefore);
  const download=page.waitForEvent('download');await official.getByRole('button',{name:'Export Breakdown — Draft / 10 sheets',exact:true}).click();
  const downloaded=await download;assert(downloaded.suggestedFilename().endsWith('DRAFT_NOT_ISSUED.xlsx'));
  const output=process.env.QA_OUTPUT_DIR;if(output){fs.mkdirSync(output,{recursive:true});await downloaded.saveAs(path.join(output,'breakdown-browser.xlsx'));}
  // Also verify the internal Release view's return destination, not only Official.
  await page.getByRole('button',{name:/10\.3\.3 · Release/}).click();
  const internal=page.getByRole('region',{name:'Price breakdown review'});
  await internal.locator('details').first().evaluate(d=>d.open=true);
  const first=internal.locator('[data-breakdown-key]').first(),key=await first.getAttribute('data-breakdown-key');
  await first.getByRole('button',{name:'↗ Source',exact:true}).click();
  await page.locator('[data-breakdown-source-key]').getByRole('button').click();
  assert.equal(await official.count(),0);assert.equal(await internal.locator('.p553-release-row-focus').getAttribute('data-breakdown-key'),key);
  for(const mr of ['MR-0001','MR-0002','MR-0003','MR-0004']){
   const picker=page.locator('[data-breakdown-source-picker]');
   await picker.evaluate(d=>{for(let p=d;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
   const value=keys.find(k=>JSON.parse(k)[0]===mr);
   await picker.getByRole('combobox',{name:'Source item for price breakdown'}).selectOption(value);
   await picker.getByRole('button',{name:'Open selected Breakdown row ↗',exact:true}).click();
   await page.waitForFunction(key=>[...document.querySelectorAll('[data-breakdown-key]')].some(r=>r.dataset.breakdownKey===key&&r===document.activeElement),value);
   const focused=internal.locator('.p553-release-row-focus');assert.equal(await focused.getAttribute('data-breakdown-key'),value);
   await focused.getByRole('button',{name:'↗ Source',exact:true}).click();
   assert.equal(await page.locator('[data-breakdown-source-key]').getAttribute('data-breakdown-source-key'),value);
   await page.locator('[data-breakdown-source-key]').getByRole('button').click();
  }
  if(output){await internal.locator('details').nth(1).evaluate(d=>d.open=true);await internal.screenshot({path:path.join(output,'breakdown-review.png')});}
  assert.deepEqual(errors,[]);console.log('PASS browser: '+(process.env.QA_SAMPLE?'13 sampled':'141')+' exact Official→Source→same-row roundtrips, four MR Source→Release→Source routes, internal Release return, source prices unchanged, draft Excel downloaded, no runtime errors.');
 }finally{await browser.close();server?.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
