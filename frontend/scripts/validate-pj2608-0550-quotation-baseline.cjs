// Real0550 exports, synthetic scope only; never issue project documents.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const k=require(root+'/common/governance/quotationBaseline'),a=require(root+'/project0550/data/quotationBaseline0550'),W=require(root+'/project0550/data/bidWorkspaceModel'),I=require(root+'/project0550/data/integrationWorkspace0550'),R=require(root+'/project0550/data/releaseIssue0550'),D=require(root+'/project0550/data'),X=require(root+'/project0550/exportOriginalPriceForm');
async function main(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'0550-baseline-')),file=path.join(dir,'fixture.json');
 try{
  cp.execFileSync(process.execPath,[path.join(__dirname,'validate-pj2608-0550-bid-volumes.cjs')],{env:{...process.env,PJ0550_VOLUME_FIXTURE:file},stdio:'pipe'});
  const d=JSON.parse(fs.readFileSync(file)),before=JSON.stringify(d),today='2026-10-29',integration=I.deriveIntegration0550(d,D.SYSTEMS,today),model={...W.deriveBidWorkspace(d,D.SYSTEMS.map(s=>s.token),today,integration),integration};
  const frozen=R.prepareReleaseIssue0550(d,model,{id:'ARCHIVE-TEST',number:'SYNTHETIC-Rev00',authorizedBy:'TEST',authorizedOn:today,authorizationRef:'INTERNAL-DO-NOT-LEAK',customerFormConfirmed:true},today),issue=frozen.releaseRegister.issues.at(-1),issueBefore=JSON.stringify(issue);
  const meta={actor:'TEST',createdAt:'2026-11-04T02:00:00Z'},record=await a.captureIssueBaseline0550({issue,...meta});
  assert.equal(record.artifacts.length,9);assert.equal(record.snapshot.previouslySentOriginalVerified,false);assert.equal(record.snapshot.provenance,'GENERATED_FROM_FROZEN_ISSUE_AT_CAPTURE');
  assert.equal(JSON.stringify(issue),issueBefore);assert.equal(JSON.stringify(d),before);
  for(const source of a.issueArtifactInputs0550(issue)){
   const artifact=record.artifacts.find(x=>x.id===source.id);assert.deepEqual(k.base64ToBytes(artifact.base64),source.bytes);assert.equal(artifact.sha256,await k.sha256(source.bytes));assert.equal(artifact.audience,'CUSTOMER');assert(!Buffer.from(source.bytes).includes(Buffer.from('INTERNAL-DO-NOT-LEAK')));
  }
  let reg=await k.addBaseline(k.emptyBaselineRegister(a.QUOTATION_SCOPE_0550),record);assert.equal(reg.selectedRevisionId,null,'Capture never selects');
  reg=await k.recordBaselineEvent(reg,{type:'SELECTED',revisionId:record.id,actor:'TEST',recordedAt:meta.createdAt,purpose:'explicit baseline'});
  const working=await a.captureWorkingBaseline0550({data:d,official:model.official,label:'Draft-2',...meta});assert.equal(working.snapshot.releaseAllowed,false);assert.deepEqual(k.base64ToBytes(working.artifacts[0].base64),X.buildOfficialCustomerXlsx(model.official));
  reg=await k.addBaseline(reg,working);assert.equal(reg.selectedRevisionId,record.id,'New draft cannot select itself');
  const originalBytes=new Uint8Array([37,80,68,70,0,255,13,10]),original={name:'source.pdf',size:originalBytes.length,type:'application/pdf',arrayBuffer:async()=>originalBytes.buffer};
  const imported=await a.captureExternalBaseline0550({file:original,kind:'AGREED_REFERENCE',label:'Owner agreed file',evidence:'TEST agreement source',...meta});assert.deepEqual(k.base64ToBytes(imported.artifacts[0].base64),originalBytes);assert.equal(imported.snapshot.pricingInputs,null);assert.equal(imported.snapshot.transmissionVerified,false);assert.equal(imported.snapshot.customerAcceptanceVerified,false);
  await assert.rejects(a.captureExternalBaseline0550({file:original,kind:'AGREED_REFERENCE',label:'bad',evidence:'',...meta}));await assert.rejects(a.captureExternalBaseline0550({file:original,kind:'AGREED_REFERENCE',label:'bad',evidence:'TEST',expectedSha256:'0'.repeat(64),...meta}));
  const savedBytes=k.base64ToBytes(record.artifacts[0].base64);issue.customerRows[0].cells[0]='Changed template projection';assert.notDeepEqual(X.buildOfficialCustomerXlsx(null,issue),savedBytes);assert.deepEqual(k.base64ToBytes(record.artifacts[0].base64),savedBytes,'Later serializer/projection changes cannot alter archived bytes');assert.notEqual(await a.issueArchiveKey0550(issue),record.snapshot.issueKey);
  const exported=await k.serializeBaselineRegister(reg),decoded=await k.parseBaselineRegister(exported,a.QUOTATION_SCOPE_0550);assert.equal(await k.serializeBaselineRegister(decoded),exported);
  const tampered=JSON.parse(exported);tampered.records[0].artifacts[0].base64='AAAA';await assert.rejects(k.verifyRegister(tampered));await assert.rejects(k.parseBaselineRegister(exported,{...a.QUOTATION_SCOPE_0550,projectId:'PJ2608-0553'}));await assert.rejects(k.restoreBaselineRegister(reg,k.emptyBaselineRegister(a.QUOTATION_SCOPE_0550)));
  assert.throws(()=>k.assertBaselineWrite(reg,reg.version-1,reg),/another tab/);const altered=JSON.parse(exported);altered.records[0].label='rewrite';assert.throws(()=>k.assertBaselineWrite(reg,reg.version,{...altered,version:reg.version+1}),/history/);
  const downloaded=await k.recordBaselineEvent(reg,{type:'DOWNLOAD_STARTED',revisionId:working.id,artifactId:'working-xlsx',actor:'TEST',recordedAt:meta.createdAt,purpose:'test download'});assert.equal(downloaded.selectedRevisionId,record.id);assert.equal(downloaded.lastUsedRevisionId,null);await assert.rejects(k.recordBaselineEvent(reg,{type:'SENT',revisionId:record.id,actor:'TEST',recordedAt:meta.createdAt,purpose:'not authorized inference'}));
  assert.equal(JSON.stringify(d),before);console.log('PASS0550 Common adapter:9 exact native artifacts + SHA-256; Working/unselected capture; exact external source/unknown inputs; no implicit sent/acceptance; stable selection; tamper/cross-project/history/CAS rejection; archive bytes survive changed projection; financial/history preservation.');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
