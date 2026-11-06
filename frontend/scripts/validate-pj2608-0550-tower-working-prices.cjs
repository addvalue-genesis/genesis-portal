const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];require.extensions['.js']=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,f):old(m,f);
const T=require(src+'/project0550/data/towerLegacyPricing0550.js');
const B=require(src+'/project0550/data/bidWorkspaceModel.js');
const D=require(src+'/project0550/data.js');
const C=require(src+'/project0550/data/bidCompletion0550.js');
const V=require(src+'/project0550/data/vendorRegister0550.js');
const {officialCustomerRows}=require(src+'/project0550/data/officialPricing0550.js');
const {RETIRED_TOWER_OFFER_0550:offerId,RETIRED_TOWER_OWNER_0550:ownerId,retireLegacyTowerPricing0550:retire}=T;
const ids=['REQ-MR-B1-11-APF-08','REQ-MR-B1-11-ACP-06'];
const owner={id:ownerId,selected:true,offerId};
const original={lines:[owner,{id:ids[0],coveredByLineId:ownerId,coverageBasis:'Previous basis'},{id:ids[1],coveredByLineId:'AUTHORED-REPLACEMENT',coverageBasis:'New basis'}],offers:[{id:offerId}]};
const retired=retire(original);
assert.equal(retired.lines[0].selected,false);assert.equal(original.lines[0].selected,true);
assert.equal(retired.lines[1].coveredByLineId,'');assert.equal(retired.lines[1].coverageBasis,'');
assert.equal(retired.lines[2],original.lines[2]);assert.equal(retired.offers,original.offers);
assert.equal(retire(retired),retired,'Repeat load is idempotent');
if(process.argv[2]){
 const saved=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const retiredSaved=retire(saved),active=C.reconcileTowerTenderScope0550(retiredSaved),tokens=D.SYSTEMS.map(s=>s.token),today='2026-11-05';
 B.validateBidWorkspace(active,D.DATA_LAYER_META.datasetId,tokens);
 const prior=saved.lines.find(l=>l.id===ownerId);assert(prior.selected&&prior.offerId===offerId);
 assert.deepEqual(retiredSaved.lines.filter(l=>l.id!==ownerId&&!ids.includes(l.id)),saved.lines.filter(l=>l.id!==ownerId&&!ids.includes(l.id)));
 for(const key of Object.keys(saved).filter(k=>k!=='lines'))assert.equal(retiredSaved[key],saved[key]);
 const model=B.deriveBidWorkspace(saved,tokens,today);
 for(const view of [model.provisional,model.official]){
  assert(!view.selected.some(l=>l.id===ownerId||l.offerId===offerId));
  assert(!officialCustomerRows(view).some(r=>r.key===ownerId));
  for(const id of ids){
   const row=view.lines.find(l=>l.id===id);
   assert.equal(row.quantity,1);assert.equal(row.unit,'Pc');assert.equal(row.customerRowCode,'A1-11');
   assert.equal(row.mrScopeState.covered,false);assert.equal(row.costTHB,null);
   assert.equal(row.customerTHB,null);assert(view.requirementGaps.some(g=>'REQ-'+g.id===id));
  }
 }
 assert.equal(C.bidCompletionBasisChanged0550(active),true,'Saved percentage allowances require review');
 assert.equal(V.vendorOfferEntries0550(active).some(e=>e.offer.id===offerId),false);
 assert.equal(V.vendorOfferEntries0550(active).filter(e=>e.offer.id.startsWith('OFFER-MASTER-TOWER-')).length,32);
 assert.equal(C.reconcileTowerTenderScope0550(active),active,'Saved scope migration is idempotent');
 assert.equal(active.offers,saved.offers);
 for(const [id,state] of [['REQ-MR-ACT-C1-D04','CNEEC_OPTION'],['REQ-MR-ACT-C1-D05','CIVIL_INTERFACE_OPEN']]){
  const line=active.lines.find(l=>l.id===id),price=model.provisional.lines.find(l=>l.id===id);
  assert.equal(line.selected,false);assert.equal(price.reviewState,state);assert.equal(price.customerTHB,null);
  assert(!model.provisional.schedule.find(r=>r.code==='C1').children.some(l=>l.id===id));
 }
 const sum=items=>saved.offers.filter(o=>o.id.startsWith('OFFER-MASTER-TOWER-')&&items.includes(o.supplierQuoteRow?.itemCode)).reduce((n,o)=>n+o.quoteEvidence.quotedTotal,0);
 const erectionId='REQ-MR-ACT-C1-D04';
 const approved={...active,sourceIntake:{...active.sourceIntake,findings:[
  ...active.sourceIntake.findings,{id:'A-SI-R33-TOWER-ERECTION-BASE',state:'SOURCE_SUPPORTED'}
 ]}};
 const base=C.reconcileTowerTenderScope0550(approved);
 const baseModel=B.deriveBidWorkspace(base,tokens,today).provisional;
 const erectionRows=baseModel.selected.filter(l=>l.id===erectionId);
 assert.equal(erectionRows.length,1);
 assert.equal(erectionRows[0].wbs,'B4');
 assert.equal(erectionRows[0].costTHB,sum(['10']));
 assert(!baseModel.schedule.find(r=>r.code==='C1').children.some(l=>l.id===erectionId));
 assert.equal(base.lines.find(l=>l.id==='REQ-MR-ACT-C1-D05').selected,false);
 assert.equal(C.reconcileTowerTenderScope0550(base),base);
 const baseReceipt=C.bidCompletionSourceUsages0550(base).find(u=>u.line.id===erectionId);
 assert(baseReceipt.current);
 assert.equal(baseReceipt.offerIds.length,2);
 assert.equal(active.lines.find(l=>l.id==='REQ-MR-ACT-B7-D04').manualCost,sum(['6']));
 assert.equal(active.lines.find(l=>l.id==='LINE-TOWER-QUOTED-ENGINEERING-0550').manualCost,sum(['1','8','15']));
 assert.equal(C.bidCompletionSourceUsages0550(active).filter(u=>u.current).flatMap(u=>u.offerIds).filter(id=>id.startsWith('OFFER-MASTER-TOWER-')).length,10);
 const stale=structuredClone(retiredSaved);stale.lines.find(l=>l.id==='REQ-MR-ACT-B7-D04').manualCost+=1;
 assert.equal(C.reconcileTowerTenderScope0550(stale).lines.find(l=>l.id==='REQ-MR-ACT-B7-D04'),stale.lines.find(l=>l.id==='REQ-MR-ACT-B7-D04'));
 assert.equal(B.deriveBidWorkspace(stale,tokens,today).provisional.lines.find(l=>l.id==='REQ-MR-ACT-B7-D04').costTHB,null,'An authored mixed soil/TSSR basis stays OPEN instead of being overwritten or counted');
 console.log('Tower scope cost deltas THB',JSON.stringify({excludedFoundation:sum(['9']),cneecErection:sum(['10']),pendingCivilInterfaces:sum(['11','12','13']),pendingSoil:sum(['7']),retainedTssr:sum(['6']),retainedOemEngineering:sum(['1','8','15'])}));
 const reassigned=structuredClone(active),row=reassigned.lines.find(l=>l.id===ids[0]);
 row.offerId=offerId;row.sellMode='DIRECT';row.sellRate=1;row.primePct=0;
 assert.equal(B.deriveBidWorkspace(reassigned,tokens,today).provisional.lines.find(l=>l.id===row.id).customerTHB,null,'A restored manual link cannot reuse the cancelled Offer');
}
console.log('PASS tower legacy cancellation: idempotent saved-workspace retirement, two OPEN MR rows, original Vendor and B/C sources, export and replacement guards.');
