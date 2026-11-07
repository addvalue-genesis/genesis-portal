// Source-agnostic regression. Actual private rates may be supplied outside Git.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const A=require(root+'/project0550/data/vendorRegisterAuto0550'),C=require(root+'/project0550/data/vendorDefaultCatalog0550'),R=require(root+'/project0550/data/vendorRegister0550'),W=require(root+'/project0550/data/bidWorkspaceModel'),D=require(root+'/project0550/data');
const tokens=D.SYSTEMS.map(s=>s.token),data=W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),families=C.vendorDefaultCatalogs0550(),family=families.find(c=>c.pack.vendors.some(v=>v.id==='VENDOR-CERAGON-0550')),idie=families.find(c=>c!==family);
assert(family);assert.equal(family.pack.offers.length,4);assert(family.pack.offers.every(o=>o.unitCost===null&&o.quoteEvidence.quotedUnitCost===null&&!o.quoteEvidence.terms.length));
assert(family.pack.offers.every(o=>o.quoteEvidence.systemTokens.join()==='TEL-DMR'));assert.equal(family.pack.offers[1].quoteEvidence.quotedQuantity,0);assert.equal(family.pack.offers[1].quoteEvidence.classification,'OPTION');assert.equal(family.pack.offers[3].unit,'year');assert.equal(family.pack.offers[3].quoteEvidence.quotedQuantity,2);
const synthetic=c=>({...structuredClone(c.pack),batchId:c.sourceBatchId,offers:c.pack.offers.map((o,i)=>({...o,unitCost:10+i,quoteEvidence:{...o.quoteEvidence,quotedUnitCost:10+i,quotedTotal:(10+i)*o.quoteEvidence.quotedQuantity,rateBasis:'SYNTHETIC regression, not original rate',terms:['Synthetic only']}}))});
const actual=process.env.PJ0550_CERAGON_REGISTER_FILE?JSON.parse(fs.readFileSync(process.env.PJ0550_CERAGON_REGISTER_FILE,'utf8')):synthetic(family),defaults=A.prepareVendorDefaults0550(data,tokens),snapshot=structuredClone(defaults),bundle={schema:A.VENDOR_REGISTERS_SCHEMA_0550,projectId:'PJ2608-0550',packages:[synthetic(idie),actual]},plan=A.planAutomaticVendorRegisters0550(defaults,bundle,tokens);
assert.equal(plan.updatedOffers,8);assert.equal(plan.addedOffers,0);assert.equal(plan.addedVendors,0);assert.equal(C.pendingVendorDefaultCount0550(plan.workspace),0);assert.deepEqual(defaults,snapshot);
for(const k of Object.keys(data).filter(k=>!['vendors','offers','supplierRevisionImports'].includes(k)))assert.deepEqual(plan.workspace[k],data[k],'Preserve '+k);
for(const o of actual.offers)assert.deepEqual(plan.workspace.offers.find(x=>x.id===o.id),o,'Exact native source fields, including zero option and annual support');
const groups=R.groupVendorOffers0550(R.vendorOfferEntries0550(plan.workspace),'system',D.SYSTEMS),dmr=groups.find(g=>g.key==='TEL-DMR');assert.equal(dmr.children.find(c=>c.key===family.pack.vendors[0].id).quotes[0].entries.length,4);
for(const quantity of [-1,0]){const bad=structuredClone(actual);bad.offers[0].quoteEvidence.quotedQuantity=quantity;assert.throws(()=>R.planVendorRegister0550(data,bad,tokens),/quantity/);}
const badOption=structuredClone(actual);badOption.offers[1].quoteEvidence.quotedQuantity=-1;assert.throws(()=>R.planVendorRegister0550(data,badOption,tokens),/quantity/);
for(const consumed of [family,idie]){
 const first=R.planVendorRegister0550(data,consumed===family?actual:synthetic(idie),tokens).workspace;first.vendors=[];first.offers=[];
 const next=A.prepareVendorDefaults0550(first,tokens),other=consumed===family?idie:family;
 assert.equal(next.offers.length,4);assert(next.offers.every(o=>other.pack.offers.some(x=>x.id===o.id)),'Deleted consumed family cannot suppress independent defaults or return');
}
const edited=structuredClone(defaults);const ids=actual.offers.map(o=>o.id);edited.offers.find(o=>o.id===ids[0]).unitCost=99;edited.offers=edited.offers.filter(o=>o.id!==ids[1]);const kept=A.planAutomaticVendorRegisters0550(edited,bundle,tokens).workspace;
assert.equal(kept.offers.find(o=>o.id===ids[0]).unitCost,99);assert(!kept.offers.some(o=>o.id===ids[1]));assert.equal(A.prepareVendorDefaults0550(kept,tokens),kept);assert.equal(A.planAutomaticVendorRegisters0550(kept,bundle,tokens).workspace,kept);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{VendorOfferGroups0550}=require(root+'/project0550/VendorOfferGroups0550'),html=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:plan.workspace,onEdit:()=>{}}));assert(html.includes('CERAGON'));assert(html.includes('RevA1'));assert(html.includes('0 QTY'));assert(html.includes('/ year'));assert(html.includes('Total Price ต้นฉบับ'));assert(actual.offers.every(o=>typeof o.quoteEvidence.quotedTotal==='number'));for(const o of actual.offers)assert(html.includes(o.quoteEvidence.quotedTotal.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})),'Render each native original total');assert(html.includes('OPTION'));
console.log('PASS CERAGON register: four native rows, zero alternative, two annual support units, separate family receipts, both grouping identities, exact private hydration, edit/delete/idempotency and all other workspace fields preserved.');

const Selection=require(root+'/project0550/data/ceragonSelection0550'),Process=require(root+'/project0550/data/bidProcess0550');
const today=Selection.CERAGON_R11_DECISION_DATE_0550;
const prepared={...plan.workspace,repositoryBasisImport:{version:'test',snapshotId:data.baselineSnapshotId,preparedOn:today,fxInherited:false}};
const mrPrepared=require(root+'/project0550/data/mrWorkingBasis0550').importMrWorkingBasis0550(prepared,D.COMMERCIAL_POLICY,'2026-11-06');
const previous=Process.prepareBidProcess0550(mrPrepared,D.COMMERCIAL_POLICY,'2026-11-06');
assert(previous.lines.some(l=>l.offerId===Selection.CERAGON_R10_0550));
const selected=Process.prepareBidProcess0550(previous,D.COMMERCIAL_POLICY,today);
const current=selected.lines.find(l=>l.id===Selection.CERAGON_LINK_OWNER_0550);
assert.equal(current.offerId,Selection.CERAGON_R11_0550);
assert.equal(current.quantity,1);
assert.equal(selected.lines.length,previous.lines.length);
assert.deepEqual(selected.offers,previous.offers);
assert.strictEqual(Process.prepareBidProcess0550(selected,D.COMMERCIAL_POLICY,today),selected);
const chosenOffers=R.vendorOfferEntries0550(selected);
assert(!chosenOffers.some(entry=>entry.offer.id===Selection.CERAGON_R10_0550));
assert(chosenOffers.some(entry=>entry.offer.id===Selection.CERAGON_R11_0550&&entry.offer.quoteEvidence.quotedQuantity===0));
const price=W.deriveBidWorkspace(selected,tokens,today).provisional.lines.find(l=>l.id===current.id);
assert.equal(price.provisionalCostNative,actual.offers.find(o=>o.id===current.offerId).unitCost);
console.log('PASS CERAGON R11: prior workspace migrates one owner, keeps native option quantity zero, and hides the superseded offer from active views.');
