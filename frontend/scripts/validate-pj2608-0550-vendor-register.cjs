const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const R=require(root+'/project0550/data/vendorRegister0550.js'),W=require(root+'/project0550/data/bidWorkspaceModel.js'),D=require(root+'/project0550/data.js');
const tokens=D.SYSTEMS.map(s=>s.token),data=W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),pack=require('./fixtures/0550-vendor-register.cjs').vendorRegisterFixture0550();
const before=JSON.stringify(data),planned=R.planVendorRegister0550(data,pack,tokens),next=planned.workspace;
assert.equal(JSON.stringify(data),before);assert.equal(next.vendors.length,1);assert.equal(next.offers.length,4);assert.equal(next.lines.length,0);
for(const k of Object.keys(data).filter(k=>!['vendors','offers'].includes(k)))assert.deepEqual(next[k],data[k],k+' must be unchanged');
assert.equal(R.planVendorRegister0550(next,pack,tokens).workspace,next);
const deleted=structuredClone(next);deleted.offers=[];deleted.vendors=[];assert.equal(R.planVendorRegister0550(deleted,pack,tokens).workspace,deleted,'Consumed batch does not restore deletions');
const changed=structuredClone(pack);changed.coverageNote+='changed';assert.throws(()=>R.planVendorRegister0550(next,changed,tokens),/consumed batch changed/);
const edited=structuredClone(next);edited.supplierRevisionImports=[];edited.offers[0].unitCost=777;assert.equal(R.planVendorRegister0550(edited,pack,tokens).workspace.offers[0].unitCost,777,'Retain saved offer edit');
const canonical=structuredClone(data);canonical.vendors=[{...pack.vendors[0],id:'EXISTING-SUPPLIER'}];const reused=R.planVendorRegister0550(canonical,pack,tokens).workspace;assert.equal(reused.vendors.length,1);assert(reused.offers.every(o=>o.vendorId==='EXISTING-SUPPLIER'));
const alias=structuredClone(pack);alias.batchId+='-ALIAS';alias.offers.forEach(o=>{o.id+='-COPY';o.quoteEvidence.sourceId='ANOTHER-DRIVE-COPY';});assert.equal(R.planVendorRegister0550(next,alias,tokens).workspace.offers.length,4,'Same content/row is not duplicated by another Drive ID');
const revision=structuredClone(pack);revision.batchId+='-REV2';revision.offers.forEach(o=>{o.id+='-REV2';o.quoteEvidence.revision='2';o.quoteEvidence.sourceSha256='b'.repeat(64);});const both=R.planVendorRegister0550(next,revision,tokens).workspace;assert.equal(both.offers.length,8);
const collision=structuredClone(pack);collision.batchId+='-COLLISION';collision.offers[0].quoteEvidence.sourceSha256='b'.repeat(64);assert.throws(()=>R.planVendorRegister0550(next,collision,tokens),/another quotation/);
for(const mutate of [p=>p.projectId='PJ2608-0553',p=>p.offers[0].currency='CNY',p=>p.offers[0].quoteEvidence.systemTokens=['INVENTED'],p=>p.offers[0].quoteEvidence.quotedQuantity=0,p=>p.offers[0].quoteEvidence.sourceUrl='javascript:alert(1)',p=>p.offers[0].quoteEvidence.sourceSha256='bad',p=>p.offers[0].quoteEvidence.classification='NET_PACKAGE',p=>p.offers[0].officialReview={},p=>p.lines=[]]){
 const invalid=structuredClone(pack);mutate(invalid);assert.throws(()=>R.planVendorRegister0550(data,invalid,tokens));
}
const shared=structuredClone(next);shared.offers[0].quoteEvidence.systemTokens.push('TEL-CCTV');const unknown={...pack.offers[1],id:'UNKNOWN-OFFER'};delete unknown.quoteEvidence;shared.offers.push(unknown);
const frozen=JSON.stringify(shared),entries=R.vendorOfferEntries0550(shared);
for(const mode of ['company','system']){
 const groups=R.groupVendorOffers0550(entries,mode,D.SYSTEMS);
 const unique=new Set(groups.flatMap(g=>g.children.flatMap(c=>c.quotes.flatMap(q=>q.entries.map(e=>e.offer.id)))));
 assert.equal(unique.size,shared.offers.length);assert.equal(JSON.stringify(shared),frozen,'Grouping cannot write');
 assert(groups.some(g=>g.key==='UNASSIGNED'||g.children.some(c=>c.key==='UNASSIGNED')));
}
assert.equal(R.groupVendorOffers0550(R.vendorOfferEntries0550(both),'company',D.SYSTEMS)[0].children[0].quotes.length,2,'Keep distinct revisions');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{VendorOfferGroups0550}=require(root+'/project0550/VendorOfferGroups0550.jsx');
const html=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:shared,onEdit:()=>{}}));
assert(html.includes('บริษัท → ระบบ')&&html.includes('ระบบ → บริษัท'));assert(html.includes('OPTION'));assert(html.includes('ต้นทุน / หน่วยเรต'));
const ids=[...html.matchAll(/data-component-key="(bid\.vendor\.offer\.[^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,shared.offers.length);assert.equal(new Set(ids).size,ids.length,'One canonical navigation anchor per Offer ID');
const unsafe=structuredClone(shared);unsafe.offers[0].description='<script>unsafe</script>';assert(renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:unsafe,onEdit:()=>{}})).includes('&lt;script&gt;'));
const companyScoped=structuredClone(next);companyScoped.lines=[{id:'COMPANY-LINE',systemToken:'TEL-PAGA',offerId:next.offers[0].id,selected:true,responsibility:'COMPANY'}];assert(!renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:companyScoped,onEdit:()=>{}})).includes('มี Working ที่เลือกใช้'),'Company supply is not an active cost selection');
// Two complete source quotations can be registered before choosing Working.
const native=structuredClone(pack);native.batchId='SYNTHETIC-ORIGINAL-QUOTES';
native.offers=native.offers.slice(0,3).map((o,i)=>({...o,unit:i?'U':'Lot',unitCost:i===2?null:i===1?75:100,
 supplierQuoteRow:{sourceId:o.quoteEvidence.sourceId,itemCode:i===0?'NET':i===1?'5010':'INCLUDED',classification:i===0?'NET_PACKAGE':i===1?'BASE_PRICE':'INCLUDED_REFERENCE',quantity:i===1?2:1,quotedUnit:i?'U':'Lot',parentOfferId:native.offers[0].id,discountable:i===1},
 quoteEvidence:{...o.quoteEvidence,locator:'PDF p'+(i+2)+' / item '+i,quotedQuantity:i===1?2:1,quotedUnit:i?'U':'Lot',quotedUnitCost:i===2?null:i===1?75:100,quotedTotal:i===2?null:i===1?150:100,originBatchId:'SYNTHETIC-PRIOR-REVISION'}}));
const originals=R.planVendorRegister0550(data,native,tokens).workspace;
assert.equal(originals.lines.length,0,'Registering a source is not choosing a Working owner');
const noMetadata={...data,offers:native.offers.map(({quoteEvidence,...o})=>o),vendors:native.vendors};
const enriched=R.planVendorRegister0550(noMetadata,native,tokens).workspace;
assert.deepEqual(enriched.offers.map(({quoteEvidence,...o})=>o),noMetadata.offers,'Source metadata never changes existing offer fields');
const second=structuredClone(native);second.batchId+='-Q2';second.offers=second.offers.map(o=>({...o,id:o.id+'-Q2',quoteRef:'SYNTHETIC-Q2',supplierQuoteRow:{...o.supplierQuoteRow,parentOfferId:o.supplierQuoteRow.parentOfferId+'-Q2'},quoteEvidence:{...o.quoteEvidence,sourceSha256:'c'.repeat(64)}}));
const twoQuotes=R.planVendorRegister0550(originals,second,tokens).workspace;
for(const mode of ['company','system'])assert.equal(R.groupVendorOffers0550(R.vendorOfferEntries0550(twoQuotes),mode,D.SYSTEMS)[0].children[0].quotes.length,2);
const editedSource=structuredClone(originals);editedSource.offers[1].unitCost=999;
const sourceHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:editedSource,onEdit:()=>{}}));
assert(sourceHtml.includes('Total Price ต้นฉบับ')&&sourceHtml.includes('150.00')&&sourceHtml.includes('75.00')&&sourceHtml.includes('999.00'));
const withoutMeta=structuredClone(enriched);delete withoutMeta.offers[1].quoteEvidence;
assert.equal(R.groupVendorOffers0550(R.vendorOfferEntries0550(withoutMeta),'company',D.SYSTEMS)[0].children[0].quotes.length,1,'Unenriched saved edits stay in their one unambiguous source quotation');
const deletedPrior={...data,vendors:native.vendors,supplierRevisionImports:[{batchId:'SYNTHETIC-PRIOR-REVISION',packageKey:'prior',importedOn:'2026-11-03'}]};
assert.equal(R.planVendorRegister0550(deletedPrior,native,tokens).workspace.offers.length,0,'A separate source receipt preserves previously deleted quote rows');
const invalidTotal=structuredClone(native);invalidTotal.offers[0].quoteEvidence.quotedTotal=-1;assert.throws(()=>R.planVendorRegister0550(data,invalidTotal,tokens));
const badParent=structuredClone(native);badParent.offers[1].supplierQuoteRow.parentOfferId='MISSING';assert.throws(()=>R.planVendorRegister0550(data,badParent,tokens));
if(process.env.PJ0550_VENDOR_REGISTER_FILE){
 const actual=JSON.parse(fs.readFileSync(process.env.PJ0550_VENDOR_REGISTER_FILE,'utf8')),actualBefore=JSON.stringify(actual),registered=R.planVendorRegister0550(data,actual,tokens).workspace;
 assert.equal(registered.offers.length,4);assert.equal(registered.lines.length,0);assert.equal(JSON.stringify(actual),actualBefore);
 assert(registered.offers.every(o=>o.quoteEvidence.sourceSha256===actual.offers[0].quoteEvidence.sourceSha256));
 assert.deepEqual(registered.offers.map(o=>o.unitCost),actual.offers.map(o=>o.unitCost));assert.deepEqual(registered.offers.map(o=>o.unit),actual.offers.map(o=>o.unit));
 assert(registered.offers.every(o=>o.validUntil===''&&o.quoteEvidence.quotedQuantity===1));assert.equal(registered.offers[3].quoteEvidence.classification,'OPTION');
}
console.log('PASS Vendor registration/grouping: canonical offers only, edit/deletion/financial preservation, idempotence/tampering, source-copy dedupe, revision identity, scope validation, both grouping projections, unique anchors, native cost/unit/terms and escaped SSR. Private JSON checked only when supplied.');
