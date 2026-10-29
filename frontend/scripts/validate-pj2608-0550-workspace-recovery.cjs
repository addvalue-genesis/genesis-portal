// Synthetic load-failure regression; never modify/clear a user's IndexedDB.
const assert=require('node:assert/strict'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const {emptyBidWorkspace,validateBidWorkspace}=require(root+'/project0550/data/bidWorkspaceModel.js');
const {DATA_LAYER_META,SYSTEMS}=require(root+'/project0550/data.js'),tokens=SYSTEMS.map(s=>s.token);
const {bidIndexedDbAdapter:adapter}=require(root+'/project0550/data/adapters/bidIndexedDbAdapter.js');
const {loadProject0550Bid,saveProject0550Bid}=require(root+'/project0550/data/repository.js');
const {workspaceDiagnostic0550}=require(root+'/project0550/data/workspaceRecovery0550.js');
const d=emptyBidWorkspace(DATA_LAYER_META.datasetId);d.revision=7;d.fx={thbPerUSD:35.12345,thbPerEUR:39.45678,source:'SYNTHETIC PRIVATE VALUE',date:'2026-10-29'};
d.audit=[{revision:7,at:'2026-10-29T06:00:00Z',action:'SYNTHETIC HISTORY'}];
d.deviationRelease={projectNo:'SYNTHETIC',project:'',requisition:'',description:'',vendor:''};
validateBidWorkspace(d,DATA_LAYER_META.datasetId,tokens);
const raw={...structuredClone(d),futureBidWorkflow:{secret:'SYNTHETIC PRIVATE VALUE',amount:41888.25},otherFutureField:[]},before=JSON.stringify(raw);
assert.throws(()=>validateBidWorkspace(raw,DATA_LAYER_META.datasetId,tokens),e=>e.code==='WORKSPACE_UNSUPPORTED_FIELDS'&&e.message==='Unsupported workspace field: futureBidWorkflow, otherFutureField'&&e.unsupportedFields.length===2);
const originalLoad=adapter.load,originalSave=adapter.save;let saves=0;
adapter.load=async()=>raw;adapter.save=async()=>{saves++;throw Error('must never save');};
(async()=>{
 try{
  let loadError;try{await loadProject0550Bid();}catch(e){loadError=e;}
  assert(loadError);assert.equal(loadError.rawWorkspace,raw);
  assert.equal(JSON.stringify(raw),before);assert.equal(saves,0);
  await assert.rejects(saveProject0550Bid(raw,7,'TEST'),/Unsupported workspace field: futureBidWorkflow/);assert.equal(saves,0);
  const diag=workspaceDiagnostic0550(loadError,raw,'http://localhost:3001'),serialized=JSON.stringify(diag);
  assert.deepEqual(diag.unsupportedFields,['futureBidWorkflow','otherFutureField']);assert.equal(diag.workspaceRevision,7);
  assert(!serialized.includes('SYNTHETIC PRIVATE VALUE'));assert(!serialized.includes('41888.25'));assert(!serialized.includes('35.12345'));
  const context=require(root+'/project0550/BidWorkspaceContext.jsx');context.useBidWorkspace=()=>({data:null,error:loadError.message,busy:false,reload:()=>{},recovery:{rawWorkspace:raw,diagnostic:diag}});
  const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{BidSaveStatus}=require(root+'/project0550/BidDataControls.jsx');
  const html=renderToStaticMarkup(React.createElement(BidSaveStatus));
  for(const text of ['Workspace load recovery','RAW backup','futureBidWorkflow','คัดลอกข้อมูลตรวจสอบ','2026-10-29.7-preview'])assert(html.includes(text));
  assert(!html.includes('SYNTHETIC PRIVATE VALUE'));assert.equal(JSON.stringify(raw),before);
  adapter.load=async()=>d;assert.equal(await loadProject0550Bid(),d);assert.equal(saves,0,'valid reload does not migrate or save');
  console.log('PASS 0550 workspace recovery: exact unknown-field diagnostics, original raw record retained, strict save validation, zero recovery writes, private values excluded from diagnostics, accessible backup UI and valid legacy optional fields.');
 }finally{adapter.load=originalLoad;adapter.save=originalSave;}
})().catch(e=>{console.error(e);process.exitCode=1;});
