const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),http=require('node:http'),babel=require('@babel/core');
const {discoverProjects,loadDriveIntake,createMiddleware,permitted,MAX_BYTES}=require('./source-drive-0550.cjs');
const root=path.resolve(__dirname,'../src'),oldJS=require.extensions['.js'];
require.extensions['.js']=(mod,file)=>file.startsWith(root+path.sep)?mod._compile(babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,file):oldJS(mod,file);
(async()=>{
 const {selectAutomaticSource,fetchAutomaticSource}=require(path.join(root,'project0550/data/sourceAutoLoad.js'));
 const {emptyBidWorkspace,deriveBidWorkspace}=require(path.join(root,'project0550/data/bidWorkspaceModel.js'));
 const {SYSTEMS,DATA_LAYER_META}=require(path.join(root,'project0550/data.js'));
 const tokens=SYSTEMS.map(s=>s.token),workspace=emptyBidWorkspace(DATA_LAYER_META.datasetId);
 const source={id:'SYNTHETIC',provider:'GDRIVE',title:'Synthetic only',documentNo:'',revision:'',issuedDate:'',receivedDate:'',url:'https://drive.google.com/file/d/synthetic/view',readState:'TEXT_READ',authority:'CURRENT_TENDER',content:'Synthetic',note:'',replaces:[]};
 const intake={schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'PJ2608-0550-SOURCE-INTAKE-REV02-20261027',reviewedOn:'2026-10-27',coverageNote:'Synthetic only',sources:[source],findings:[],milestones:[]};
 const selected=selectAutomaticSource(workspace,intake,tokens);
 assert.equal(selected.state,'UPDATED');assert.equal(workspace.sourceIntake,undefined);
 assert.deepEqual(deriveBidWorkspace(selected.workspace,tokens,'2026-10-27'),deriveBidWorkspace(workspace,tokens,'2026-10-27'));
 assert.equal(selectAutomaticSource(selected.workspace,intake,tokens).state,'CURRENT');
 assert.equal(selectAutomaticSource(selected.workspace,{...intake,batchId:'PJ2608-0550-SOURCE-INTAKE-REV01-20261027'},tokens).state,'LOCAL_NEWER');
 assert.throws(()=>selectAutomaticSource(selected.workspace,{...intake,coverageNote:'different'},tokens),/CONFLICT/);
 assert.throws(()=>selectAutomaticSource(selected.workspace,{...intake,batchId:'PJ2608-0550-SOURCE-INTAKE-REV03-20261027',sources:[]},tokens),/HISTORY_MISSING/);
 assert.throws(()=>selectAutomaticSource(workspace,{...intake,projectId:'PJ2608-0553'},tokens));
 assert.throws(()=>selectAutomaticSource(workspace,{...intake,reviewedOn:'2026-10-26'},tokens),/INVALID/);
 const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'0550-drive-test-'));let server;
 try {
  const project=path.join(tmp,'.shortcut-targets-by-id','synthetic-id','PJ2608-0550 Synthetic');
  const dir=path.join(project,'90_SYSTEM_WORKING','DATA');await fs.mkdir(dir,{recursive:true});
  const file=path.join(dir,'PJ2608-0550_Source_Intake_Rev02_20261027.json');await fs.writeFile(file,JSON.stringify(intake));
  const foreign=path.join(tmp,'.shortcut-targets-by-id','other','PJ2608-0553 Synthetic','90_SYSTEM_WORKING','DATA');await fs.mkdir(foreign,{recursive:true});
  assert.deepEqual(await discoverProjects({roots:[tmp]}),[project]);
  assert.deepEqual(JSON.parse(await loadDriveIntake({roots:[tmp]})),intake);
  assert.deepEqual(JSON.parse(await loadDriveIntake({projectDir:project})),intake);
  const missing=path.join(tmp,'missing');await assert.rejects(loadDriveIntake({projectDir:missing}),/NOT_FOUND/);
  const older=path.join(dir,'PJ2608-0550_Source_Intake_Rev01_20261027.json');await fs.writeFile(older,JSON.stringify({...intake,batchId:'PJ2608-0550-SOURCE-INTAKE-REV01-20261027'}));
  assert.equal(JSON.parse(await loadDriveIntake({roots:[tmp]})).batchId,intake.batchId);
  await fs.writeFile(older,JSON.stringify({...intake,coverageNote:'conflicting content'}));await assert.rejects(loadDriveIntake({roots:[tmp]}),/CONFLICT/);await fs.unlink(older);
  const original=await fs.readFile(file);await fs.writeFile(file,' '.repeat(MAX_BYTES+1));await assert.rejects(loadDriveIntake({roots:[tmp]}),/TOO_LARGE/);await fs.writeFile(file,original);
  const request={socket:{remoteAddress:'127.0.0.1'},headers:{host:'localhost:3001',origin:'http://localhost:3001','sec-fetch-site':'same-origin'}};
  assert(permitted(request));assert(!permitted({...request,socket:{remoteAddress:'192.168.1.10'}}));
  assert(!permitted({...request,headers:{...request.headers,origin:'https://evil.example'}}));
  assert(!permitted({...request,headers:{...request.headers,host:'evil.example'}}));
  assert(!permitted({...request,headers:{...request.headers,'sec-fetch-site':'cross-site'}}));
  const middleware=createMiddleware(()=>loadDriveIntake({roots:[tmp]}));
  server=http.createServer((req,res)=>middleware(req,res,()=>{res.statusCode=404;res.end();}));
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const base='http://127.0.0.1:'+server.address().port;
  const fetcher=(url,options)=>fetch(base+url,options);
  assert.deepEqual(await fetchAutomaticSource(fetcher),intake);
  const remote=await fetch(base+'/api/local/pj2608-0550/source-intake',{headers:{origin:'https://evil.example'}});assert.equal(remote.status,403);
  const post=await fetch(base+'/api/local/pj2608-0550/source-intake',{method:'POST'});assert.equal(post.status,405);
  const response=await fetch(base+'/api/local/pj2608-0550/source-intake');assert.equal(response.headers.get('cache-control'),'no-store');
  await assert.rejects(fetchAutomaticSource(async()=>new Response('<html/>',{headers:{'content-type':'text/html'}})),/BRIDGE_UNAVAILABLE/);
  if(process.argv[2]) {
   const actual=JSON.parse(await fs.readFile(process.argv[2],'utf8'));await fs.writeFile(file,JSON.stringify(actual));
   const loaded=await fetchAutomaticSource(fetcher),result=selectAutomaticSource(workspace,loaded,tokens);
   assert.deepEqual(result.workspace.sourceIntake,actual);
   assert.deepEqual(deriveBidWorkspace(result.workspace,tokens,'2026-10-27'),deriveBidWorkspace(workspace,tokens,'2026-10-27'));
   console.log('PASS private Drive payload through local HTTP bridge, fetch and financial-preserving selection');
  }
  console.log('PASS Drive Desktop bridge: bounded project discovery, offline failure, schema/project checks, batch conflict/no-downgrade/history preservation, loopback/origin restriction, HTTP fetch. User Windows mount remains to verify.');
 } finally {if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(tmp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{require.extensions['.js']=oldJS;});
