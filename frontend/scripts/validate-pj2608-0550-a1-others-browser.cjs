// Isolated browser regression. All financial inputs below are synthetic.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const name=req.url.split('?')[0];
 const file=/^\/(?:bundle|\d+(?:\.bundle)?)\.(?:js|css)$/.test(name)?path.join(root,'dist',name):path.join(root,'public/index.html');
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
 res.end(fs.readFileSync(file));
});

(async()=>{
 let browser;
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const workspace=(mode,data)=>page.evaluate(({mode,data})=>new Promise(resolve=>{
   const request=indexedDB.open('GENESIS-PJ2608-0550-BIDDING',1);
   request.onsuccess=()=>{
    const db=request.result,tx=db.transaction('workspace',mode),store=tx.objectStore('workspace');
    const query=data?store.put(data,'active'):store.get('active');
    tx.oncomplete=()=>{db.close();resolve(query.result);};
   };
  }),{mode,data});
  const read=()=>workspace('readonly'),write=data=>workspace('readwrite',data);
  const ready=()=>page.locator('.p55-bid-save').filter({hasText:/Revision \d/}).waitFor();
  await page.goto('http://127.0.0.1:'+server.address().port+'/projects/pj2608-0550');
  await ready();
  const seed=await read();
  const a1=page.getByRole('table',{name:'Schedule A1 preview',exact:true});
  const moduleSearch=page.getByLabel('Project Module Search',{exact:true});
  const othersSeed=structuredClone(seed);
  const serviceIds=['REQ-MR-ACT-B8-D03','REQ-MR-ACT-B2-D01','REQ-MR-ACT-B2-D04','REQ-MR-ACT-B9-D02','REQ-MR-ACT-B9-D04'];
  othersSeed.lines.forEach(line=>{line.selected=false;});
  for(const [index,id] of serviceIds.entries()){
   const line=othersSeed.lines.find(l=>l.id===id);assert(line);
   Object.assign(line,{selected:index<4,quantity:2,unit:index===0?'MH':'Lot',currency:'USD',manualCost:5,sellMode:'DIRECT',sellRate:(index+1)*10,primePct:0,calculationId:'',offerId:'',coveredByLineId:'',sourceRef:'SYNTHETIC OTHERS TEST'});
  }
  for(const [id,sellRate] of [['REQ-MR-ACT-B5-D01',100],['REQ-MR-ACT-C3-D02',75]]){
   const line=othersSeed.lines.find(l=>l.id===id);assert(line);
   Object.assign(line,{selected:true,quantity:1,unit:'Lot',currency:'USD',manualCost:50,sellMode:'DIRECT',sellRate,primePct:0,calculationId:'',offerId:'',coveredByLineId:'',sourceRef:'SYNTHETIC SPARES TEST'});
  }
  Object.assign(othersSeed.fx,{thbPerUSD:32.5,source:'SYNTHETIC OTHERS FX',date:'2026-11-05'});
  await write(othersSeed);await page.reload();await ready();
  await page.getByRole('navigation',{name:'PJ2608-0550 sections'}).getByRole('button',{name:'Quotation',exact:true}).click();
  const othersRow=a1.getByRole('row').filter({hasText:'Others (Please specify)'});
  const E=page.getByRole('table',{name:'Licences & Other Costs table',exact:true}),F=page.getByRole('table',{name:'Insurance Breakdown table',exact:true});
  const storedOthers=await read();
  for(const [currency,eTotal,fTotal,parentTotal] of [['USD','60.00','140.00','200.00'],['THB','1,950.00','4,550.00','6,500.00']]){
   await page.getByLabel('Currency',{exact:true}).selectOption(currency);
   assert.equal(await othersRow.locator('td').nth(6).innerText(),parentTotal);
   await page.getByRole('button',{name:'11.E · A1 Others / Licences & Other Costs',exact:true}).click();
   await E.waitFor();
   assert.deepEqual(await E.locator('[data-working-line]').evaluateAll(rows=>rows.map(row=>row.dataset.workingLine)),serviceIds.slice(0,2));
   assert.equal(await E.locator('tfoot td').first().innerText(),eTotal);
   await moduleSearch.fill('bid.quotation.F');await moduleSearch.press('Enter');await F.waitFor();
   assert.deepEqual(await F.locator('[data-working-line]').evaluateAll(rows=>rows.map(row=>row.dataset.workingLine)),serviceIds.slice(2,4));
   assert.equal(await F.locator('tfoot td').first().innerText(),fTotal);
   await page.getByRole('button',{name:'เปิด 11.A1 · ยอดรวม 1 Lot',exact:true}).click();
  }
  const c2Row=a1.getByRole('row').filter({hasText:'Pre-commissioning, Commissioning Spare parts'});
  const c3Row=a1.getByRole('row').filter({hasText:'Two years Operation Spare parts'});
  assert.match(await c2Row.innerText(),/3,250\.00/);
  assert.match(await c3Row.innerText(),/THB 2,437\.50.*Excluded from Base/);
  await page.getByRole('button',{name:'11.C2 · Commissioning Spares',exact:true}).click();
  assert.match(await page.locator('[data-native-schedule="C2"]').innerText(),/Schedule C2 Working price: THB 3,250\.00/);
  await page.getByRole('button',{name:'11.A1',exact:true}).click();
  await page.getByRole('button',{name:'11.C3 · Two-year Operation Spares',exact:true}).click();
  assert.match(await page.locator('[data-native-schedule="C3"]').innerText(),/Schedule C3 Working price: THB 2,437\.50/);
  await page.getByRole('button',{name:'11.A1',exact:true}).click();
  await page.getByRole('button',{name:'11.F · A1 Others / Insurance Breakdown',exact:true}).click();
  await page.getByLabel('Schedule price view').selectOption('REVIEWED');
  assert.equal(await F.locator('tfoot td').first().innerText(),'OPEN','Unreviewed Working prices stay out of Reviewed view');
  assert.deepEqual(await read(),storedOthers,'11.E/F leave prices, allocations and history intact');
  assert.deepEqual(errors,[]);
  console.log('PASS 11.A1: C2 Base and C3 Option reference, existing C2/C3 navigation, 11.E/F currency tie-out, Module Search and read-only Reviewed separation.');

 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
