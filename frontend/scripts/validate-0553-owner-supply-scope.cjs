// Cross-consumer regression: accepted scope must not become a duplicate cost,
// supplier quantity approval, or inherited cable/gland credit.
const assert=require('node:assert/strict'),path=require('node:path');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p));
const {MDS_SCOPE_DECISION_0553:d,MR0004_WORKING_BOM_0553:bom}=from('data/mr0004WorkingBom0553');
const {L3_PORT_DECISION_0553:l3,MR0001_WORKING_PRICED_BOM:scada}=from('data/mr0001WorkingPricedBom');
assert.equal(l3.selectedCopperPorts,8);assert.equal(l3.selectedSfpPorts,2);
assert.equal(l3.expansionSelected,false);assert.equal(l3.customerTechnicalApproval,false);
assert.equal(l3.spareQuantityApproved,false);assert.equal(scada.cisco.technicalApproval,false);
assert.equal(scada.cisco.unitPackageQuotedSumTHB,371580);
assert.equal(scada.cisco.sourceTotalTHB,2117650);
assert(!scada.cisco.items.some(x=>['2.0','2.0.1'].includes(x.quoteLine)));
assert.equal(d.vendorCableCreditM,0);assert.equal(d.vendorGlandCreditQty,0);
assert.equal(d.vendorFatCreditTHB,0);assert.equal(d.supplierConfirmed,false);
for(const key of ['cableCostTHB','glandCostTHB','additionalFatCostTHB'])assert.equal(d[key],null,'Unknown ADDVALUE cost must not become zero');
assert.equal(bom.quotePackageUSD,75000);assert.equal(bom.sourceQuotedQty,1);
assert.equal(bom.budgetTotalUSD,225000);assert.equal(bom.releaseAllowed,false);
for(const site of bom.sites){
 const counted=site.items.filter(x=>x.countedInWorkingTotal);
 assert.equal(counted.length,1);assert.equal(counted[0].extended,75000);
 for(const suffix of ['BFOU-CABLE','FIELD-GLANDS','TOOLS-TEST']){
  const item=site.items.find(x=>x.id.endsWith(suffix));assert(item);
  assert.equal(item.extended,null);assert.equal(item.countedInWorkingTotal,false);
  assert(item.owner.startsWith('ADDVALUE_'));
 }
 assert.equal(site.items.filter(x=>x.priceInclusion==='MDS_FINANCIAL_SUMMARY_INCLUDED_NON_ADDITIVE').length,3);
}
const routes=from('data/raconTerminationBudget0553').deriveRaconTerminationBudget0553();
assert.deepEqual(routes.map(x=>x.wp),['ZWP20','ZWP21','ZWP22']);
for(const r of routes){
 // Keep raw quotation evidence; effective procurement is independently owned.
 assert.equal(r.quotation.cablesIncluded.reduce((n,x)=>n+x.lengthM,0),20);
 assert.equal(r.quotation.glandsIncluded,6);
 assert.equal(r.vendorIncludedCableM,0);assert.equal(r.vendorIncludedGlandQty,0);
 assert.equal(r.additionalCablePurchaseM,r.procurementTotalM);
 assert.equal(r.additionalGlandCandidateQty,r.fieldGlandCandidateQty);
 assert.equal(r.fieldGlandCandidateQty,12,'Scenario of six distinct routes has twelve candidate ends, not certified gland count');
 assert.equal(r.pricedSubtotalTHB,null);
 for(const x of r.rows){assert.equal(x.vendorIncludedM,0);assert.equal(x.additionalPurchaseM,x.procurementM);assert.equal(x.costOwner,d.cableOwner);assert.equal(x.extendedTHB,null);}
}
const field=from('data/mgwR2SelectedFieldBulk0553').deriveMGWSelectedWpSystemBulk0553();
for(const r of routes){
 const sys=field.find(x=>x.wp===r.wp).systems.find(x=>x.id==='MARINE_RACON');
 assert.equal(sys.selectedSupplier,'MDS / ORGA');
 assert(sys.bulkStatus.includes('ADDVALUE_SUPPLY_SELECTED'));
 for(const cable of r.rows){const x=sys.items.find(x=>x.id==='MGW-R2-'+cable.id);assert.equal(x.qty,cable.procurementM);assert.equal(x.extendedTHB,null);}
}
const fat=from('data/fatExecutionBasis0553').FAT_EXECUTION_BASIS_0553;
assert.equal(fat.mrPaths.find(x=>x.mr==='MR-0004').scopeDecision.fatOwner,d.fatOwner);
assert.equal(fat.integratedFat.location,'SAMTEL Warehouse, Thailand');
const c1=from('data/c1SiTagBudget0553').selectC1SiTagBudget0553();
assert(c1.rows.every(x=>x.quantityApproved===false));
assert.equal(c1.ownerDecisions.l3,l3);assert.equal(c1.ownerDecisions.mds,d);
assert.equal(c1.proposedQuoteUSD,181100);assert.equal(c1.selectedInCommercialOffer,false);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const html=renderToStaticMarkup(React.createElement(from('C1SiTagBudget0553.jsx').C1SiTagBudget0553));
assert(html.includes('data-c1-owner-scope="2026-11-02"'));
assert(html.includes('Cable glands')&&html.includes('TC-0001 Item 13')&&html.includes('B3'));
console.log('PASS owner scope: eight-port basis without quantity/technical auto-approval; MDS raw evidence retained, zero effective cable/gland/FAT credits; ADDVALUE B3/field-bulk owners; included boxes once, unknown costs null, no price posting.');
