// Executable COMMON contract + real0553 adapter/exports. No financial fixture rewrite.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,p));
async function main(){
 const money=from('common/cost/quotationRounding'),k=from('common/governance/quotationBaseline');
 for(const [x,s,y] of [['1824','10','1830'],['10','10','10'],['10.000000000001','10','20'],['0','10','0'],['1.01','0.05','1.05'],['9007199254740993.01','0.1','9007199254740993.1']])assert.equal(money.roundUnitUp(x,s),y);
 assert.equal(money.roundUnitUp(null,10),null);assert.equal(money.quotedLineAmount('3','0.335'),'1.01');assert.equal(money.quotedLineAmount('4','160'),'640');
 for(const bad of [-1,NaN,Infinity,undefined,'1e3'])assert.throws(()=>money.roundUnitUp(bad,10));assert.throws(()=>money.roundUnitUp(2,0));
 const equal=[{id:'c',qty:1,weight:'1'},{id:'b',qty:1,weight:'1'},{id:'a',qty:1,weight:'1'}];
 const allocation=money.allocateFixedParent(equal,'100','10');assert.deepEqual(allocation,[{id:'c',amount:'30'},{id:'b',amount:'30'},{id:'a',amount:'40'}]);
 assert.deepEqual(money.allocateFixedParent([...equal].reverse(),'100','10').reverse(),allocation,'Stable tie-break independent of input order');
 assert.throws(()=>money.allocateFixedParent([{id:'a',qty:2,weight:1}],100,10));assert.throws(()=>money.allocateFixedParent(equal,101,10));assert.throws(()=>money.allocateFixedParent([equal[0],equal[0]],100,10));
 assert.equal(k.canonicalJson({b:2,a:1}),k.canonicalJson({a:1,b:2}));assert.throws(()=>k.canonicalJson({x:NaN}));assert.throws(()=>k.canonicalJson({x:undefined}));assert.throws(()=>k.canonicalJson(Array(1)));
 const scope={projectId:'TEST-P1',proposalStreamId:'QUOTE',recipientGroupId:'CUSTOMER'},createdAt='2026-11-04T02:00:00Z';
 const input={qty:'1',unitUSD:'1830.00',totalUSD:'1830.00',fx:'31.5',notes:'not separately quoted',included:null};
 const artifact=await k.makeArtifact({id:'quotation',filename:'quote.xlsx',mimeType:'application/test',audience:'CUSTOMER',bytes:new Uint8Array([1,2,3,255])});
 const record=await k.createBaseline({scope,label:'Revision1',actor:'test-owner',createdAt,snapshot:input,artifacts:[artifact]});
 input.qty='99';assert.equal(record.snapshot.qty,'1');assert(Object.isFrozen(record.snapshot));
 let register=await k.addBaseline(k.emptyBaselineRegister(scope),record),before=k.canonicalJson(register.records);
 register=await k.recordBaselineEvent(register,{type:'SELECTED',revisionId:record.id,actor:'owner',recordedAt:createdAt,purpose:'select'});
 register=await k.recordBaselineEvent(register,{type:'OWNER_ATTESTED_USED',revisionId:record.id,actor:'owner',recordedAt:createdAt,occurredAt:null,purpose:'actually used; old date unknown'});
 assert.equal(register.lastUsedRevisionId,record.id);assert.equal(register.events[1].occurredAt,null);assert.equal(k.canonicalJson(register.records),before);
 assert.equal((await k.recordBaselineEvent(register,{...register.events[1]})).events.length,2,'Retry is idempotent');
 await assert.rejects(k.recordBaselineEvent(register,{type:'SENT',revisionId:record.id,actor:'owner',recordedAt:createdAt,purpose:'download'}));
 await assert.rejects(k.recordBaselineEvent(register,{type:'OWNER_ATTESTED_USED',revisionId:record.id,actor:'owner',recordedAt:createdAt,occurredAt:'2026-02-30',purpose:'bad date'}));
 for(const mutate of [x=>x.snapshot.qty='2',x=>x.label='changed',x=>x.artifacts[0].base64='AAAA',x=>x.artifacts[0].filename='other.xlsx']){const bad=JSON.parse(JSON.stringify(record));mutate(bad);await assert.rejects(k.verifyBaseline(bad));}
 const corrupt=JSON.parse(JSON.stringify(register));corrupt.selectedRevisionId='foreign';await assert.rejects(k.verifyRegister(corrupt));
 const encoded=await k.serializeBaselineRegister(register),decoded=await k.parseBaselineRegister(encoded,scope);assert.equal(await k.serializeBaselineRegister(decoded),encoded);
 const downloaded=await k.recordBaselineEvent(register,{type:'DOWNLOAD_STARTED',revisionId:record.id,artifactId:'quotation',actor:'owner',recordedAt:createdAt,purpose:'download bytes'});
 assert.equal(downloaded.lastUsedRevisionId,record.id);assert.equal(downloaded.events.at(-1).artifactSha256,artifact.sha256);await k.verifyRegister(downloaded);
 await assert.rejects(k.recordBaselineEvent(register,{type:'DOWNLOAD_STARTED',revisionId:record.id,artifactId:'missing',actor:'owner',recordedAt:createdAt,purpose:'bad artifact'}));
 const restored=await k.restoreBaselineRegister(k.emptyBaselineRegister(scope),decoded);assert.equal(restored.lastUsedRevisionId,record.id);assert.equal(k.canonicalJson(restored.records),before);
 await assert.rejects(k.restoreBaselineRegister(register,k.emptyBaselineRegister(scope)),'Cannot remove history');
 await assert.rejects(k.parseBaselineRegister(encoded,{...scope,projectId:'TEST-P2'}));
 const second=await k.createBaseline({scope,label:'Revision2 same total changed detail',actor:'owner',createdAt,snapshot:{qty:'2',unitUSD:'915',totalUSD:'1830.00',fx:'31.5'},artifacts:[artifact]});
 assert.notEqual(second.snapshotHash,record.snapshotHash,'Same total cannot identify revision');
 const next=await k.addBaseline(register,second);assert.equal(next.lastUsedRevisionId,record.id,'New draft cannot replace used baseline');
 const otherDownload=await k.recordBaselineEvent(next,{type:'DOWNLOAD_STARTED',revisionId:second.id,artifactId:'quotation',actor:'owner',recordedAt:createdAt,purpose:'download different revision'});
 assert.equal(otherDownload.selectedRevisionId,record.id);assert.equal(otherDownload.lastUsedRevisionId,record.id);
 assert(k.assertBaselineWrite(register,register.version,next));
 assert.throws(()=>k.assertBaselineWrite(register,register.version-1,next),/another tab/);
 assert.throws(()=>k.assertBaselineWrite(register,register.version,{...next,records:[]}));
 assert.throws(()=>k.assertBaselineWrite(register,register.version,{...next,version:register.version}));
 const diff=k.baselineDifferences([{id:'a',qty:1},{id:'b',qty:2}],[{id:'b',qty:2},{id:'a',qty:3}]);assert.equal(diff.count,1);assert(diff.changes[0].path.includes('id=a'));
 assert.equal(k.baselineDifferences({x:null},{x:0}).count,1,'Unknown is not zero');
 const source=from('project0553/data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5}),sourceBefore=JSON.stringify(source);
 const adapter=from('project0553/data/quotationBaseline0553'),ref=from('project0553/data/officialUsdRelease0553').selectCurrentReleaseRev03_0553();
 const bytes=fs.readFileSync(path.resolve(__dirname,'../public'+ref.originalWorkbookPath));
 const capture=await adapter.captureQuotation0553({mode:'CURRENT_REV03',reference:ref,source,label:'Actual Rev03',actor:'test',createdAt,
  fetchFile:async url=>{assert.equal(url,ref.originalWorkbookPath);return {ok:true,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};}});
 assert.equal(JSON.stringify(source),sourceBefore);assert.equal(capture.snapshot.quotation.reference.totalBaseUSD,894910);
 assert.equal(capture.snapshot.issued,false);assert.deepEqual(capture.snapshot.policyBindings.fixedParentCodes,['A1','A2','A3']);
 assert.equal(capture.artifacts[0].sha256,ref.sourceWorkbookSha256);assert.deepEqual(Buffer.from(k.base64ToBytes(capture.artifacts[0].base64)),bytes);
 assert.equal(capture.artifacts.length,4);assert.equal(capture.snapshot.derivedContext.model.totalUSD,894910);
 assert(capture.snapshot.derivedContext.status.includes('NOT_PROVEN_PREVIOUSLY_ISSUED'));
 const historical=from('project0553/data/officialUsdRelease0553').selectSubmittedRev02Release0553();
 const historyBytes=fs.readFileSync(path.resolve(__dirname,'../public'+historical.originalWorkbookPath));
 const history=await adapter.captureQuotation0553({mode:'SUBMITTED_REV02',reference:historical,source,label:'Rev02 historical',actor:'test',createdAt,
  fetchFile:async()=>({ok:true,arrayBuffer:async()=>historyBytes.buffer.slice(historyBytes.byteOffset,historyBytes.byteOffset+historyBytes.length)})});
 assert.equal(history.snapshot.workingSource,null);assert.equal(history.snapshot.derivedContext,null);assert.equal(history.snapshot.policyBindings.originalPricingPolicyReconstructed,false);assert.equal(history.snapshot.quotation.reference.totalBaseUSD,902900);assert.equal(history.artifacts.length,1);
 await assert.rejects(adapter.captureQuotation0553({mode:'CURRENT_REV03',reference:ref,source,label:'bad file',actor:'test',createdAt,
  fetchFile:async()=>({ok:true,arrayBuffer:async()=>new Uint8Array(bytes.length).buffer})}),/hash mismatch/);
 const draft=await adapter.captureQuotation0553({mode:'WORKING_DRAFT',source,label:'Frozen Working',actor:'test',createdAt});
 assert.equal(draft.snapshot.quotation.model.totalUSD,894910);assert.equal(draft.artifacts.length,3);assert(draft.artifacts.every(a=>a.audience==='INTERNAL'));
 const React=require('react'),SSR=require('react-dom/server'),View=from('project0553/RecordedQuotation0553.jsx').RecordedQuotation0553;
 for(const r of [capture,draft]){const html=SSR.renderToStaticMarkup(React.createElement(View,{record:r,source:{totalUSD:1}}));assert(html.includes('894,910.00'));assert(!html.includes('USD 1.00'));}
 const persisted=await k.addBaseline(k.emptyBaselineRegister(adapter.QUOTATION_SCOPE_0553),capture);
 assert.equal((await k.parseBaselineRegister(await k.serializeBaselineRegister(persisted),adapter.QUOTATION_SCOPE_0553)).records[0].id,capture.id);
 // Real control handlers with injected persistence. Browser IndexedDB remains a
 // separate acceptance check; this harness verifies the selection/use workflow.
 const Module=require('node:module'),file=path.join(root,'project0553/QuotationBaselineControl0553.jsx');
 let memory=k.emptyBaselineRegister(adapter.QUOTATION_SCOPE_0553),savedSelections=[],downloads=0,props;
 let states=[],refs=[],effects=[],cursor=0;
 const node=(type,props,...children)=>({type,props:{...props,children}});
 const hooks={createElement:node,useState(initial){const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];},useRef(initial){const i=cursor++;return refs[i]||(refs[i]={current:initial});},useEffect(fn,deps){const i=cursor++;if(!deps||!effects[i]||deps.some((v,j)=>v!==effects[i][j])){effects[i]=deps;fn();}}};
 const mod=new Module(file,module);mod.filename=file;mod.require=id=>{
  if(id==='react')return hooks;
  if(id==='../common/governance/quotationBaseline')return k;
  if(id==='../common/governance/quotationBaselineStore')return {loadBaselineRegister:async()=>k.cloneBaselineJson(memory),commitBaselineRegister:async(scope,version,value)=>{k.assertBaselineWrite(memory,version,value);memory=k.cloneBaselineJson(value);}};
  if(id==='./data/quotationBaseline0553')return {...adapter,captureQuotation0553:async()=>capture};
  throw Error('Unexpected baseline control import '+id);
 };
 mod._compile(babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,file);
 const documentBefore=global.document,timerBefore=global.setTimeout;
 global.document={createElement:()=>({click(){downloads++;},remove(){}}),body:{appendChild(){}}};global.setTimeout=fn=>{fn();return 0;};
 const all=tree=>{const out=[];function walk(x){if(Array.isArray(x))return x.forEach(walk);if(x&&typeof x==='object'){out.push(x);walk(x.props?.children);}}walk(tree);return out;};
 const text=x=>typeof x==='string'?x:Array.isArray(x)?x.map(text).join(''):x?.props?text(x.props.children):'';
 const render=()=>{cursor=0;return mod.exports.QuotationBaselineControl0553(props);};
 const flush=async()=>{await new Promise(resolve=>setImmediate(resolve));};
 try{
  props={mode:'CURRENT_REV03',reference:ref,source,controllerRef:{current:null},onSelectRecord:r=>{savedSelections.push(r.id);props.mode='RECORDED';}};
  render();await flush();let tree=render();
  const inputs=all(tree).filter(n=>n.type==='input');inputs[0].props.onChange({target:{value:'owner'}});tree=render();
  const button=label=>all(tree).find(n=>n.type==='button'&&text(n).includes(label));
  await button('ตรึงฉบับที่เปิดอยู่').props.onClick();tree=render();
  assert.equal(memory.records.length,1);assert.equal(memory.selectedRevisionId,capture.id);assert.equal(memory.lastUsedRevisionId,null);assert.equal(downloads,1);
  assert.equal(typeof props.controllerRef.current.capture,'function','Official export uses the registered capture flow');
  await button('CUSTOMER ·').props.onClick();tree=render();assert.equal(downloads,2);assert.equal(memory.events.at(-1).type,'DOWNLOAD_STARTED');assert.equal(memory.lastUsedRevisionId,null,'Downloading is not actual-use attestation');
  assert.equal(button('ยืนยันว่าใช้ฉบับที่เลือก').props.disabled,false);
  await button('ยืนยันว่าใช้ฉบับที่เลือก').props.onClick();tree=render();
  assert.equal(memory.lastUsedRevisionId,capture.id);assert.equal(memory.events.filter(e=>e.type==='OWNER_ATTESTED_USED').length,1);assert.equal(downloads,3);
  props.mode='WORKING_DRAFT';tree=render();assert.equal(button('ยืนยันว่าใช้ฉบับที่เลือก').props.disabled,true,'Cannot attest old selected record while viewing different live draft');
  const beforeRestore=k.canonicalJson(memory);all(tree).find(n=>n.type==='input'&&n.props.type==='file').props.onChange({target:{files:[{size:4,text:async()=>'{bad'}],value:'x'}});await flush();tree=render();assert.equal(k.canonicalJson(memory),beforeRestore);assert(all(tree).some(n=>n.props.role==='alert'));
  states=[];refs=[];effects=[];savedSelections=[];props.mode='CURRENT_REV03';render();await flush();tree=render();assert.deepEqual(savedSelections,[capture.id],'Reopening restores saved selection instead of live default');
  assert(text(tree).includes('Actual Rev03'));assert.equal(k.canonicalJson(memory.records[0]),k.canonicalJson(capture));
 }finally{global.document=documentBefore;global.setTimeout=timerBefore;}
 console.log('PASS COMMON decimal up-step/fixed-parent equations; immutable snapshots, exact artifacts/hashes, same-total-different-detail, explicit use/not-sent, idempotence, unknown date, tamper/cross-project/pointer/history rejection, portable round-trip, stable-ID diff; real0553 Rev03 + current Working capture and exact XLSX bytes; frozen view ignores live inputs; prices/FX/source unchanged. Browser IndexedDB acceptance is separate.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
