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
const crossSystem={...next,integrationWorkspace:{requirements:['TEL-AIS','TEL-RADIO-DTRS','TEL-VSAT','COMMON'].map(systemToken=>({systemToken,offerIds:[next.offers[0].id]}))}};
const crossEntries=R.vendorOfferEntries0550(crossSystem);
assert.deepEqual(crossEntries[0].sourceSystemTokens,['TEL-PAGA']);
assert(crossEntries[0].systemTokens.includes('TEL-AIS'),'Keep usage trace separately');
assert.deepEqual(R.groupVendorOffers0550(crossEntries,'company',D.SYSTEMS)[0].children.map(c=>c.key),['TEL-PAGA']);
assert.deepEqual(R.groupVendorOffers0550(crossEntries,'system',D.SYSTEMS).map(g=>g.key),['TEL-PAGA']);
const crossHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:crossSystem,onEdit:()=>{}}));
assert(crossHtml.includes('ระบบที่อ้างใน Mapping / Working:'));
assert(!crossHtml.includes('data-vnd-subgroup="TEL-AIS"'));
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
// Printed amount supplements preserve edited active prices and unknown drivers.
const amountSupplement=structuredClone(pack);amountSupplement.batchId+='-AMOUNTS';amountSupplement.offers.forEach((o,i)=>{o.quoteEvidence.fileName='synthetic.pdf';o.quoteEvidence.quotedTotal=i<2?null:o.unitCost;if(i<2)o.quoteEvidence.quotedTotalText='As actual';});
const localRate=structuredClone(next);localRate.offers[0].unitCost=999;
const withAmounts=R.planVendorRegister0550(localRate,amountSupplement,tokens).workspace;
assert.equal(withAmounts.offers[0].unitCost,999);assert.equal(withAmounts.offers[0].quoteEvidence.quotedUnitCost,100);assert.equal(withAmounts.offers[0].quoteEvidence.quotedTotalText,'As actual');
const amountHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:withAmounts,onEdit:()=>{}}));assert(amountHtml.includes('As actual'));
const overwriteAmount=structuredClone(amountSupplement);overwriteAmount.batchId+='-CHANGED';overwriteAmount.offers[2].quoteEvidence.quotedTotal=9999;assert.equal(R.planVendorRegister0550(withAmounts,overwriteAmount,tokens).workspace.offers[2].quoteEvidence.quotedTotal,pack.offers[2].unitCost);
const references=structuredClone(second);references.batchId+='-REFERENCES';references.offers.forEach(o=>o.quoteEvidence.workingReferenceOfferIds=['COMBINED-OWNER']);
const combined={...native.offers[0],id:'COMBINED-OWNER',quoteRef:'Combined previous Working basis',description:'Existing combined Working price'};delete combined.quoteEvidence;delete combined.supplierQuoteRow;
const combinedData={...originals,offers:[...originals.offers,combined]};
const referred=R.planVendorRegister0550(combinedData,references,tokens).workspace;
const referenceEntries=R.vendorOfferEntries0550(referred);assert(referenceEntries.find(e=>e.offer.id==='COMBINED-OWNER').referenceOnly);assert.equal(R.groupVendorOffers0550(referenceEntries,'company',D.SYSTEMS)[0].children[0].quotes.filter(q=>!q.referenceOnly).length,2,'Two original quote identities; aggregate Working reference is not a third quotation');
const referenceHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:referred,onEdit:()=>{}}));assert(referenceHtml.includes('2 ใบเสนอราคา')&&referenceHtml.includes('ฐาน Working เดิม'));
// Quotation THB summaries use native source amounts, never edited Working rates.
const fx={thbPerUSD:35,thbPerEUR:40,source:'SYNTHETIC FX',date:'2026-11-04'};
const quoteOf=d=>R.groupVendorOffers0550(R.vendorOfferEntries0550(d),'company',D.SYSTEMS)[0].children[0].quotes[0];
const pricedQuote=quoteOf(editedSource),snapshot=JSON.stringify(editedSource);
assert.equal(R.vendorQuoteTotals0550(pricedQuote,fx).base.totalTHB,4000,'Net100 EUR, not net plus component150 or saved rate999');
assert.equal(R.vendorQuoteTotals0550(pricedQuote,{}).base.totalTHB,null);
assert.deepEqual(R.vendorQuoteTotals0550(pricedQuote,{}).base.missingFX,['EUR']);
assert.equal(R.vendorQuoteTotals0550(pricedQuote,{...fx,source:''}).base.totalTHB,null);
assert.equal(R.vendorQuoteTotals0550(pricedQuote,{...fx,thbPerEUR:0}).base.totalTHB,null);
assert.equal(R.vendorQuoteTotals0550(pricedQuote,{...fx,thbPerEUR:41}).base.totalTHB,4100,'Live project FX updates display');
const legacyNet=structuredClone(pricedQuote);delete legacyNet.entries[0].offer.supplierQuoteRow;delete legacyNet.totalEntries[0].offer.supplierQuoteRow;legacyNet.entries[0].offer.quoteEvidence.locator='PDF p2 / item NET';
assert.equal(R.vendorQuoteTotals0550(legacyNet,fx).base.totalTHB,4000,'Legacy source NET marker is one owner');
const rateQuotes=quoteOf(withAmounts),rateTotals=R.vendorQuoteTotals0550(rateQuotes,fx);
assert.equal(rateTotals.base.totalTHB,null);assert.equal(rateTotals.base.knownTHB,12000);assert.equal(rateTotals.base.missingPrices,2,'As actual stays unknown');assert.equal(rateTotals.option.totalTHB,20000,'Options remain separate');
const mixed=structuredClone(pricedQuote);mixed.totalEntries=mixed.totalEntries.filter(e=>e.offer.supplierQuoteRow?.classification!=='NET_PACKAGE');mixed.entries=mixed.totalEntries;
mixed.totalEntries[0].offer.quoteEvidence.quotedCurrency='USD';mixed.totalEntries[0].offer.quoteEvidence.quotedTotal=10;
mixed.totalEntries.push(structuredClone(mixed.totalEntries[0]));mixed.totalEntries.at(-1).offer.id='THB-ROW';mixed.totalEntries.at(-1).offer.quoteEvidence.quotedCurrency='THB';mixed.totalEntries.at(-1).offer.quoteEvidence.quotedTotal=20;
assert.equal(R.vendorQuoteTotals0550(mixed,fx).base.totalTHB,370,'Mixed USD and THB source amounts');
assert.equal(R.vendorQuoteTotals0550({...mixed,totalEntries:[...mixed.totalEntries,...mixed.totalEntries]},fx).base.totalTHB,370,'Deduplicate Offer IDs');
const thbOnly=structuredClone(mixed);thbOnly.entries=thbOnly.totalEntries=thbOnly.totalEntries.filter(e=>e.offer.id==='THB-ROW');thbOnly.entries[0].offer.quoteEvidence.quotedTotal=0;
assert.equal(R.vendorQuoteTotals0550(thbOnly,{}).base.totalTHB,0,'Native THB zero needs no foreign FX');
const conflictNet=structuredClone(pricedQuote),extraNet=structuredClone(conflictNet.totalEntries[0]);extraNet.offer.id='SECOND-NET';conflictNet.totalEntries.push(extraNet);
assert.equal(R.vendorQuoteTotals0550(conflictNet,fx).base.totalTHB,null,'Ambiguous net owners never produce a complete total');
const sharedQuote=structuredClone(originals);sharedQuote.offers[1].quoteEvidence.systemTokens=['TEL-PAGA','TEL-CCTV'];
for(const mode of ['company','system'])for(const g of R.groupVendorOffers0550(R.vendorOfferEntries0550(sharedQuote),mode,D.SYSTEMS))for(const c of g.children)for(const q of c.quotes)assert.equal(R.vendorQuoteTotals0550(q,fx).base.totalTHB,4000,'Each system view shows full quotation, not its component subtotal');
const totalHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:{...editedSource,fx},onEdit:()=>{}}));assert(totalHtml.includes('4,000.00')&&totalHtml.includes('1 EUR = 40 THB')&&totalHtml.includes('SYNTHETIC FX'));
assert.equal(JSON.stringify(editedSource),snapshot,'Read-only totals preserve all records');
if(process.env.PJ0550_VENDOR_REGISTER_FILE){
 const actual=JSON.parse(fs.readFileSync(process.env.PJ0550_VENDOR_REGISTER_FILE,'utf8')),actualBefore=JSON.stringify(actual),registered=R.planVendorRegister0550(data,actual,tokens).workspace;
 assert.equal(registered.offers.length,4);assert.equal(registered.lines.length,0);assert.equal(JSON.stringify(actual),actualBefore);
 assert(registered.offers.every(o=>o.quoteEvidence.sourceSha256===actual.offers[0].quoteEvidence.sourceSha256));
 assert.deepEqual(registered.offers.map(o=>o.unitCost),actual.offers.map(o=>o.unitCost));assert.deepEqual(registered.offers.map(o=>o.unit),actual.offers.map(o=>o.unit));
 assert(registered.offers.every(o=>o.validUntil===''&&o.quoteEvidence.quotedQuantity===1));assert.equal(registered.offers[3].quoteEvidence.classification,'OPTION');
}
console.log('PASS Vendor registration/grouping: canonical offers only, edit/deletion/financial preservation, idempotence/tampering, source-copy dedupe, revision identity, scope validation, both grouping projections, unique anchors, native cost/unit/terms and escaped SSR. Private JSON checked only when supplied.');
