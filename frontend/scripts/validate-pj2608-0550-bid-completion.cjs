const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,f):old(m,f);
const D=require(src+'/project0550/data.js'),B=require(src+'/project0550/data/bidWorkspaceModel.js'),P=require(src+'/project0550/data/bidProcess0550.js'),C=require(src+'/project0550/data/bidCompletion0550.js'),I=require(src+'/project0550/data/integrationWorkspace0550.js');
const {retireLegacyTowerPricing0550}=require(src+'/project0550/data/towerLegacyPricing0550.js');
const today='2026-11-04',tokens=D.SYSTEMS.map(s=>s.token),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const options=d=>({policies:D.COMMERCIAL_POLICY,team:D.CORE_TEAM,pricing:()=>B.deriveBidWorkspace(d,tokens,today)});
const empty=B.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);assert.equal(C.prepareBidCompletion0550(empty,options(empty),today),empty,'No private evidence means no price/assumption installation');
assert.throws(()=>C.validateBidCompletion0550({version:'unknown'}));
if(process.argv[2]){
 const original=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),data=P.prepareBidProcess0550(retireLegacyTowerPricing0550(original),D.COMMERCIAL_POLICY,today),before=hash(data),beforeModel=B.deriveBidWorkspace(data,tokens,today);
 const ambiguous=structuredClone(data),mr=ambiguous.sourceIntake.sources.find(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&s.authority==='CURRENT_TENDER');ambiguous.sourceIntake.sources.push({...mr,id:'TEST-DUPLICATE-MR'});assert.equal(C.prepareBidCompletion0550(ambiguous,options(ambiguous),today),ambiguous,'Ambiguous current MR cannot install a budget automatically');
 const prepared=C.prepareBidCompletion0550(data,options(data),today);assert.equal(hash(data),before,'Preparation is immutable');B.validateBidWorkspace(prepared,D.DATA_LAYER_META.datasetId,tokens);
 assert.equal(C.prepareBidCompletion0550(prepared,options(prepared),today),prepared,'Repeated preparation is the exact same object');assert.equal(C.bidCompletionBasisChanged0550(prepared),false);
 for(const key of Object.keys(data).filter(k=>!['lines','repositoryBasisImport'].includes(k)))assert.equal(hash(prepared[key]),hash(data[key]),'Original quote/FX/source/calculation/engineering/history preserved / '+key);
 const model=B.deriveBidWorkspace(prepared,tokens,today),result=P.deriveBidProcess0550(prepared,model,D.SYSTEMS),receipt=prepared.repositoryBasisImport.bidCompletion;
 for(const part of result.parts){const pending=part.part==='A'?2:0;assert.equal(part.pending,pending,part.part+' outstanding price owners');assert.equal(part.missingCost,pending,part.part+' outstanding costs');}
 assert.deepEqual(model.provisional.requirementGaps.map(g=>g.id).sort(),['MR-B1-11-ACP-06','MR-B1-11-APF-08']);assert.equal(model.provisional.unmapped.length,0);
 assert.equal(model.provisional.baseTHB,null);assert.equal(model.provisional.baseUSD,null);assert(Number.isFinite(model.provisional.knownTHB));assert(Number.isFinite(model.provisional.optionsUSD));assert.equal(model.official.baseUSD,null,'Budget preparation does not approve engineering or issue');
 // Every previously priced customer amount is retained, including protected sell
 // rates. Only missing internal cost may receive its labelled planning estimate.
 for(const prior of beforeModel.provisional.lines.filter(l=>l.selected&&Number.isFinite(l.customerUSD))){const now=model.provisional.lines.find(l=>l.id===prior.id);assert.equal(now.customerUSD,prior.customerUSD,'Prior selling amount / '+prior.id);if(Number.isFinite(prior.costTHB))assert.equal(now.costTHB,prior.costTHB,'Prior sourced cost / '+prior.id);}
 for(const prior of data.lines.filter(l=>l.wbs==='A'))assert.deepEqual(prepared.lines.find(l=>l.id===prior.id),prior,'Every native MR/equipment record preserved / '+prior.id);
 for(const [id,state] of [['REQ-MR-ACT-C1-D04','CNEEC_OPTION'],['REQ-MR-ACT-C1-D05','CIVIL_INTERFACE_OPEN']]){
  const line=model.provisional.lines.find(l=>l.id===id);
  assert.equal(line.selected,false);assert.equal(line.costTHB,null);assert.equal(line.reviewState,state);
  assert(!receipt.rows.some(row=>row.lineId===id));
 }
 const quoted=items=>data.offers.filter(o=>o.id.startsWith('OFFER-MASTER-TOWER-')&&items.includes(o.supplierQuoteRow?.itemCode)).reduce((n,o)=>n+o.quoteEvidence.quotedTotal,0);
 assert.equal(prepared.lines.find(l=>l.id==='REQ-MR-ACT-B7-D04').manualCost,quoted(['6']));
 assert.equal(prepared.lines.find(l=>l.id==='LINE-TOWER-QUOTED-ENGINEERING-0550').manualCost,quoted(['1','8','15']));
 const capital=prepared.lines.find(l=>l.id==='REQ-MR-ACT-C2-D02');assert.equal(capital.quantity,1);assert(capital.offerId.endsWith('-R12'));assert.equal(model.provisional.lines.find(l=>l.id===capital.id).costTHB,Math.round(data.offers.find(o=>o.id===capital.offerId).unitCost*data.fx.thbPerUSD*100)/100);
 const towerIds=receipt.rows.flatMap(r=>r.offerIds).filter(id=>id.startsWith('OFFER-MASTER-TOWER-'));assert.equal(new Set(towerIds).size,towerIds.length,'No quoted tower service item allocated twice');assert.equal(towerIds.length,10,'Only B1 engineering, B7 TSSR and B2 delivery items remain assigned');
 for(const id of ['REQ-MR-ACT-B3-D05','REQ-MR-ACT-B9-D04','REQ-MR-ACT-B2-D05','REQ-MR-ACT-C2-D01','REQ-MR-ACT-C3-D01']){assert.equal(prepared.lines.find(l=>l.id===id).selected,false);assert(C.bidCompletionReferences0550(prepared,model.provisional.lines).has(id),'Non-additive work resolves to priced owners / '+id);}
 const reference=receipt.rows.find(r=>r.kind==='PRICE_REFERENCE'),changed=structuredClone(prepared);changed.lines.find(l=>l.id===reference.lineId).quantity+=1;
 const changedModel=B.deriveBidWorkspace(changed,tokens,today);assert(!changedModel.provisional.lines.find(l=>l.id===reference.lineId).bidPriceAllocation,'Changed MR input invalidates the previous budget allocation');assert(changedModel.provisional.requirementGaps.length);
 const ownerChanged=structuredClone(prepared),owner=ownerChanged.lines.find(l=>l.id===reference.ownerIds[0]);owner.selected=false;const missing=B.deriveBidWorkspace(ownerChanged,tokens,today);assert(!missing.provisional.lines.find(l=>l.id===reference.lineId).bidPriceAllocation,'Deselected/deleted owners do not leave phantom inclusion');assert(C.bidCompletionBasisChanged0550(ownerChanged));
 const fx=structuredClone(prepared);fx.fx.thbPerUSD+=1;assert(C.bidCompletionBasisChanged0550(fx),'FX changes disclose a stale reserve basis');
 const zero=structuredClone(data);zero.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04').manualCost=0;const zeroKept=C.prepareBidCompletion0550(zero,options(zero),today);assert.deepEqual(zeroKept.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),zero.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),'Authored zero is preserved');
 const edited=structuredClone(data);edited.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04').description='OWNER EDIT';const preserved=C.prepareBidCompletion0550(edited,options(edited),today);assert.deepEqual(preserved.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),edited.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),'Nonfinancial authored edits also survive');
 const deleted=structuredClone(prepared);deleted.lines=deleted.lines.filter(l=>l.id!=='LINE-TOWER-QUOTED-ENGINEERING-0550');assert.equal(C.prepareBidCompletion0550(deleted,options(deleted),today),deleted,'Handled deletions never recreate Working owners');
 const integration=I.deriveIntegration0550(prepared,D.SYSTEMS,today);assert.equal(integration.ready,false,'No implied technical acceptance');
 console.log('ACTUAL',JSON.stringify({parts:result.parts,rows:receipt.rows.reduce((a,r)=>({...a,[r.kind]:(a[r.kind]||0)+1}),{}),baseTHB:model.provisional.baseTHB,baseUSD:model.provisional.baseUSD,optionsTHB:model.provisional.optionsTHB,optionsUSD:model.provisional.optionsUSD,conflicts:receipt.conflicts}));
 if(process.env.PJ0550_COMPLETION_OUTPUT)fs.writeFileSync(process.env.PJ0550_COMPLETION_OUTPUT,JSON.stringify(prepared));
}
console.log('PASS bid completion: private-data guards, quote partitions, explicit estimate assumptions, protected prior prices, native quantities/FX/source/history, no duplicate owner, full draft sums, staleness/edit/deletion preservation and no technical/issue approval.');
