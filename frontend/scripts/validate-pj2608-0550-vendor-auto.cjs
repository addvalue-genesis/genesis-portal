// Isolated DATA/HTTP/model checks. Private source is optional and never written to Git.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),http=require('node:http'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}]]}).code,f):old(m,f);
const Auto=require(root+'/project0550/data/vendorRegisterAuto0550'),R=require(root+'/project0550/data/vendorRegister0550'),W=require(root+'/project0550/data/bidWorkspaceModel'),D=require(root+'/project0550/data'),bridge=require('./source-drive-0550.cjs');
async function main(){
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'0550-vendor-auto-'));let server;
 try{
  const project=path.join(temp,'PJ2608-0550 Synthetic'),dir=path.join(project,'90_SYSTEM_WORKING','DATA');await fs.mkdir(dir,{recursive:true});
  const options={roots:[temp]},tokens=D.SYSTEMS.map(s=>s.token),data=W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),before=JSON.stringify(data);
  const pack=process.env.PJ0550_VENDOR_REGISTER_FILE?JSON.parse(await fs.readFile(process.env.PJ0550_VENDOR_REGISTER_FILE,'utf8')):require('./fixtures/0550-vendor-register.cjs').vendorRegisterFixture0550(),packBefore=JSON.stringify(pack);
  const file=path.join(dir,'PJ2608-0550_IDIE_QO26163_Vendor_Register_20261104.json');
  await assert.rejects(bridge.loadDriveIntake(options),/NOT_FOUND/);
  assert.equal(JSON.parse(await bridge.loadDriveVendorRegisters(options)).packages.length,0);
  await fs.writeFile(file,JSON.stringify(pack));await fs.writeFile(path.join(dir,'PJ2608-0553_OTHER_Vendor_Register_20261104.json'),'invalid other project must not be read');
  const middleware=bridge.createMiddleware(()=>bridge.loadDriveIntake(options),()=>bridge.loadDriveSourceWorkspace(options),()=>bridge.loadDriveVendorRegisters(options));
  server=http.createServer((req,res)=>middleware(req,res,()=>{res.statusCode=404;res.end();}));await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
  const fetcher=(url,opts)=>fetch(base+url,opts),bundle=await Auto.fetchAutomaticVendorRegisters0550(fetcher),plan=Auto.planAutomaticVendorRegisters0550(data,bundle,tokens),registered=plan.workspace;
  assert.equal(plan.addedVendors,1);assert.equal(plan.addedOffers,4);assert.equal(JSON.stringify(data),before);assert.equal(JSON.stringify(pack),packBefore);
  for(const k of Object.keys(data).filter(k=>!['vendors','offers'].includes(k)))assert.deepEqual(registered[k],data[k],'Preserve '+k);
  assert.deepEqual(registered.offers.map(o=>o.unitCost),pack.offers.map(o=>o.unitCost));assert.deepEqual(registered.offers.map(o=>o.unit),pack.offers.map(o=>o.unit));
  assert.equal(Auto.planAutomaticVendorRegisters0550(registered,bundle,tokens).workspace,registered);
  const edited=structuredClone(registered);edited.offers[0].unitCost+=1;edited.offers.splice(1,1);assert.equal(Auto.planAutomaticVendorRegisters0550(edited,bundle,tokens).workspace,edited,'Consumed receipt preserves edits and deletions');
  const manual=R.planVendorRegister0550(data,pack,tokens).workspace;assert.equal(Auto.planAutomaticVendorRegisters0550(manual,bundle,tokens).workspace,manual,'Manual imports adopted without duplication');
  const bad=structuredClone(pack);bad.batchId+='-INVALID';bad.projectId='PJ2608-0553';assert.throws(()=>Auto.planAutomaticVendorRegisters0550(data,{...bundle,packages:[pack,bad]},tokens));assert.equal(JSON.stringify(data),before,'All packages validate before any save');
  await fs.writeFile(path.join(dir,'PJ2608-0550_COPY_Vendor_Register_20261104.json'),JSON.stringify(pack,null,2));assert.equal(JSON.parse(await bridge.loadDriveVendorRegisters(options)).packages.length,1,'Same batch/semantic content under another copy is one package');
  const conflict=structuredClone(pack);conflict.coverageNote+=' changed';await fs.writeFile(path.join(dir,'PJ2608-0550_COPY_Vendor_Register_20261104.json'),JSON.stringify(conflict));await assert.rejects(Auto.fetchAutomaticVendorRegisters0550(fetcher),/CONFLICT/);await fs.unlink(path.join(dir,'PJ2608-0550_COPY_Vendor_Register_20261104.json'));
  const revision=structuredClone(pack);revision.batchId+='-REV2';revision.offers=revision.offers.map(o=>({...o,id:o.id+'-R2',quoteRef:o.quoteRef+'-R2'}));await fs.writeFile(path.join(dir,'PJ2608-0550_REV2_Vendor_Register_20261104.json'),JSON.stringify(revision));
  const two=await Auto.fetchAutomaticVendorRegisters0550(fetcher);assert.equal(two.packages.length,2);assert.equal(Auto.planAutomaticVendorRegisters0550(data,two,tokens).addedOffers,8,'All quote revisions retained, no newest-price selection');await fs.unlink(path.join(dir,'PJ2608-0550_REV2_Vendor_Register_20261104.json'));
  await fs.writeFile(file,' '.repeat(bridge.MAX_VENDOR_BYTES+1));await assert.rejects(bridge.loadDriveVendorRegisters(options),/TOO_LARGE/);await fs.writeFile(file,JSON.stringify({...pack,projectId:'PJ2608-0553'}));await assert.rejects(bridge.loadDriveVendorRegisters(options),/INVALID/);await fs.writeFile(file,JSON.stringify(pack));
  assert.equal((await fetch(base+bridge.VENDOR_ENDPOINT,{headers:{origin:'https://other.example'}})).status,403);assert.equal((await fetch(base+bridge.VENDOR_ENDPOINT,{method:'POST'})).status,405);assert.equal((await fetch(base+bridge.VENDOR_ENDPOINT)).headers.get('cache-control'),'no-store');
  await assert.rejects(Auto.fetchAutomaticVendorRegisters0550(async()=>new Response('<html/>',{headers:{'content-type':'text/html'}})),/BRIDGE_UNAVAILABLE/);
  await assert.rejects(Auto.fetchAutomaticVendorRegisters0550(async()=>new Response('{}',{headers:{'content-type':'application/json','content-length':String(Auto.VENDOR_REGISTERS_LIMIT_0550+1)}})),/TOO_LARGE/);
  console.log('PASS Vendor auto: private DATA through existing loopback bridge/HTTP/model; independent of CUS;1 vendor/4 native offers; financial/source/history preservation; manual/automatic idempotence, edit/deletion retention, atomic validation, copy conflict, all revisions, bounded reads and origin/method controls.');
 }finally{if(server)await new Promise(r=>server.close(r));await fs.rm(temp,{recursive:true,force:true});}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
