// Read-only UI and all-system arithmetic audit. Private fixtures stay outside Git.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const React=require('react'),{renderToStaticMarkup:render}=require('react-dom/server'),T=require(src+'/project0550/WorkingLineTrace0550.jsx'),D=require(src+'/project0550/data.js'),B=require(src+'/project0550/data/bidWorkspaceModel.js'),P=require(src+'/project0550/data/supplierCostProjection0550.js'),G=require(src+'/project0550/bidPresentation0550.js'),Money=require('decimal.js'),tokens=D.SYSTEMS.map(s=>s.token),today='2026-11-05';
const html=(component,props)=>render(React.createElement(component,props));
const reqs=Array.from({length:217},(_,i)=>({id:'R'+i,title:'Requirement '+i,workLineIds:['OWNER'],systemToken:'TEL-PAGA',state:'OPEN'}));
const index=T.workingRequirementIndex0550(reqs);assert.equal(index.get('OWNER').length,217);assert.equal(new Set(index.get('OWNER').map(r=>r.id)).size,217);
const collapsed=html(T.WorkingRequirementTrace0550,{requirements:index.get('OWNER')});assert(collapsed.includes('217 ข้อ'));assert(!collapsed.includes('<button'),'Closed trace creates no repeated link buttons');assert(!collapsed.includes('<ul>'),'Closed trace defers the list');
let seed=B.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);
seed=require(src+'/project0550/data/legacyVendorBasis0550.js').importLegacyVendorBasis0550(seed,{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE,commercialSources:D.COMMERCIAL_SOURCES,commercialPolicy:D.COMMERCIAL_POLICY},today);
seed=require(src+'/project0550/data/mrWorkingBasis0550.js').importMrWorkingBasis0550(seed,D.COMMERCIAL_POLICY,today);
seed=require(src+'/project0550/data/mgwVendorBasis0550.js').importMgwVendorBasis0550(seed,today);
seed=require(src+'/project0550/data/mgwDetailPricing0550.js').prepareMgwDetailPricing0550(seed,D.COMMERCIAL_POLICY,today);
const cctv=seed.lines.find(l=>l.mgwDetailGroupId==='CCTV'),source=html(T.WorkingLineSource0550,{data:seed,line:cctv});assert(source.includes('28 รายการที่ใช้คำนวณ'));assert(!source.includes('class="p55-working-source-items"'),'Native list deferred');assert(source.includes(cctv.sourceRef.replace(/&/g,'&amp;')),'Exact saved basis remains inspectable');
const edited=structuredClone(seed);edited.lines.find(l=>l.id===cctv.id).mgwDetailBasis.rows[0].quantity+=1;
const editedPrice=B.deriveBidWorkspace(edited,tokens,today).provisional.lines.find(l=>l.id===cctv.id),originalPrice=B.deriveBidWorkspace(seed,tokens,today).provisional.lines.find(l=>l.id===cctv.id);
assert(editedPrice.costTHB!==originalPrice.costTHB||editedPrice.provisionalCostNative!==originalPrice.provisionalCostNative,'Saved source quantity drives the package calculation');
const model=B.deriveBidWorkspace(seed,tokens,today);assert(model.provisional.lines.some(l=>l.reviewState.startsWith('PROVISIONAL')));assert(!model.provisional.lines.some(l=>/ราคาเดิม|รออัปเดต/.test(l.reviewState)));
const future=structuredClone(seed),first=future.offers.find(o=>o.id===future.lines.find(l=>l.offerId)?.offerId);if(first){first.date='2099-01-01';assert(B.deriveBidWorkspace(future,tokens,today).lines.some(l=>l.problems.includes('Quote dated in future — confirm source date')));}
if(process.argv[2]){
 const data=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),before=JSON.stringify(data);B.validateBidWorkspace(data,D.DATA_LAYER_META.datasetId,tokens);
 const model=B.deriveBidWorkspace(data,tokens,today),projection=P.supplierCostProjection0550(data),reqIndex=T.workingRequirementIndex0550(data.integrationWorkspace?.requirements||[]),rows=[];
 const sum=values=>values.length?values.reduce((a,v)=>a.plus(v),new Money(0)).toDecimalPlaces(2).toNumber():null;
 for(const part of ['A','B','C']){
  const lines=model.provisional.selected.filter(l=>l.wbs[0]===part),known=lines.filter(l=>Number.isFinite(l.customerTHB));
  for(const l of known){
   const native=l.sellMode==='DIRECT'?new Money(l.quantity).times(l.sellRate):l.sellMode==='MARKUP'?new Money(l.provisionalCostNative).times(new Money(l.markupPct).div(100).plus(1)):new Money(l.provisionalCostNative).div(new Money(1).minus(new Money(l.marginPct).div(100)));
   const rate=l.currency==='THB'?1:data.fx['thbPer'+l.currency];
   const expected=native.times(new Money(l.primePct).div(100).plus(1)).times(rate).toDecimalPlaces(2).toNumber();
   assert(Math.abs(expected-l.customerTHB)<=.011,'Independent Cost/Sell/Prime/FX reconciliation / '+l.id);
  }
  rows.push({part,owners:lines.length,priced:known.length,knownTHB:sum(known.map(l=>l.customerTHB)),duplicateOwners:lines.filter(l=>l.problems.includes('DUPLICATE_SCOPE_OWNER')).map(l=>l.id)});
 }
 assert.equal(model.provisional.baseTHB,sum(model.provisional.selected.filter(l=>['A','B'].includes(l.wbs[0])).map(l=>l.customerTHB)),'Base excludes Part C');
 assert.equal(model.provisional.optionsTHB,sum(model.provisional.selected.filter(l=>l.wbs[0]==='C').map(l=>l.customerTHB)));
 const systems=G.BID_GROUPS_0550.filter(g=>g.part==='A').map(g=>{
  const ls=model.provisional.lines.filter(l=>l.wbs==='A'&&l.systemToken===g.code),owners=ls.filter(l=>l.selected);
  for(const l of ls){const collapsed=html(T.WorkingRequirementTrace0550,{requirements:reqIndex.get(l.id)});assert(!collapsed.includes('<button'));const view=html(T.WorkingQuoteBasis0550,{data,line:l,projection});assert(!view.includes('ราคาเดิม / รออัปเดต'));}
  return {system:g.code,owners:owners.length,priced:owners.filter(l=>Number.isFinite(l.customerTHB)).length,requirements:(data.integrationWorkspace?.requirements||[]).filter(r=>r.systemToken===g.code).length,sourceQuotes:(projection.bySystem.get(g.code)||[]).map(q=>q.title)};
 });assert.equal(systems.length,20);
 const paga=model.provisional.lines.find(l=>l.id==='LINE-LEGACY-TEL-PAGA-1');if(paga){const view=html(T.WorkingQuoteBasis0550,{data,line:paga,projection});assert(view.includes('A20261632'));assert(view.includes('A20261632-002'),'Registered other revision remains visible without changing the selected price');}
 assert.equal(JSON.stringify(data),before,'All-system inspection cannot mutate canonical records');assert.equal(model.official.releaseState,'HOLD');
 console.log('AUDIT',JSON.stringify({basis:'Reconstructed from available project DATA; not Windows saved workspace',parts:rows,systems,pagaSelected:paga?.offer?.quoteRef,unmapped:model.provisional.unmapped.length,priceGaps:model.provisional.requirementGaps.length,maxLinkedRequirements:Math.max(...[...reqIndex.values()].map(rs=>rs.length)),sourceQuotes:projection.quotes.size,official:model.official.releaseState}));
}
console.log('PASS named deferred requirement links, saved MGW source quantities, selected-versus-registered quotation trace, truthful provisional status, all-system read-only arithmetic and HOLD.');
