// Execute real source -> working overlay -> release -> quoted breakdown.
// No build dependencies are required; Node's VM ESM loader reads project data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
if(!vm.SourceTextModule){
 const r=require('node:child_process').spawnSync(process.execPath,['--experimental-vm-modules',__filename],{stdio:'inherit'});
 process.exit(r.status??1);
}
async function main(){
 const root=path.resolve(__dirname,'../src/project0553/data');
 const cache=new Map(),context=vm.createContext({console,TextDecoder,TextEncoder,Uint8Array,URL});
 function resolve(s,ref){
  assert(s.startsWith('.'),'Unexpected external data dependency: '+s);
  const p=path.resolve(path.dirname(ref),s);
  const found=[p,p+'.js',p+'.json',p+'.jsx',path.join(p,'index.js')].find(fs.existsSync);
  assert(found,'Missing source dependency: '+s);return found;
 }
 function get(p){
  if(cache.has(p))return cache.get(p);
  let mod;
  if(p.endsWith('.json')){
   const data=JSON.parse(fs.readFileSync(p,'utf8'));
   mod=new vm.SyntheticModule(['default'],function(){this.setExport('default',data);},{identifier:p,context});
  }else mod=new vm.SourceTextModule(fs.readFileSync(p,'utf8'),{identifier:p,context});
  cache.set(p,mod);return mod;
 }


 const entry=new vm.SourceTextModule(`
  import {MR0003_MGW_WORKING_BOM_0553 as phone} from './mr0003MgwWorkingBom0553.js';
  import {deriveMR0003ProductLedger0553} from './mr0003ProductCostLedger0553.js';
  import {selectWorkingBomProjection0553} from './workingBomAggregation0553.js';
  import {deriveCustomerMtoC1Coverage0553} from './bulkMrLocationCoverage0553.js';
  import {buildReleaseCommercialModel0553} from './releaseCommercialModel0553.js';
  import {buildOfficialUsdRelease0553,selectSubmittedRev02Release0553} from './officialUsdRelease0553.js';
  import {deriveWpSystemBulkBudget0553} from './wpSystemBulkBudget0553.js';
  const source=buildReleaseCommercialModel0553({thbPerUsd:31.5});
  const before=JSON.stringify(source),archived=selectSubmittedRev02Release0553();
  export const result={phone,product:deriveMR0003ProductLedger0553(),
   projection:selectWorkingBomProjection0553({mr:'MR-0003'}),source,
   mto:deriveCustomerMtoC1Coverage0553({mr:'MR-0003'}),
   bulk:deriveWpSystemBulkBudget0553(),official:buildOfficialUsdRelease0553(source),
   before,after:JSON.stringify(source),archived};
 `,{identifier:path.join(root,'validation-entry.mjs'),context});
 await entry.link((s,ref)=>get(resolve(s,ref.identifier)));await entry.evaluate();
 const x=JSON.parse(JSON.stringify(entry.namespace.result));
 assert.equal(x.phone.budgetTotalTHB,926000);assert.equal(x.phone.exionQuotedTotalTHB,828000);
 assert.equal(x.phone.jbBudgetAllowanceTHB,98000);
 assert.deepEqual(x.phone.sites.map(s=>s.site),['ZWP20','ZWP21','ZWP22','ZWP23']);
 for(const s of x.phone.sites){
  const jb=s.items.find(r=>r.id===s.site+'-MGW-PHONE1-JB');
  assert.equal(jb.tag,'TCAB-504-001');assert.equal(jb.qty,1);
  assert.equal(jb.unitCost,24500);assert.equal(jb.extended,24500);assert.equal(jb.currency,'THB');
  assert.equal(jb.countedInWorkingTotal,true);assert.equal(jb.priceInclusion,null);
  assert.equal(jb.budgetAllowance.currentSupplierQuoteVerified,false);
  assert.equal(jb.budgetAllowance.technicalApproval,false);assert.equal(jb.budgetAllowance.sourceLine,'3');
  assert.equal(jb.budgetReference.selected,false);assert.equal(jb.budgetReference.additive,false);
  assert.equal(jb.budgetReference.unitCostTHB,22000);
  assert.equal(s.controlledTotalTHB,231500);
  assert.equal(s.items.filter(r=>r.countedInWorkingTotal).reduce((n,r)=>n+r.extended,0),231500);
  assert(s.items.filter(r=>r.id.includes('BULK-')).every(r=>!r.countedInWorkingTotal&&r.extended===null));
 }
 assert.equal(x.projection.currencies.THB,926000);assert.equal(x.projection.priced,8);
 assert.equal(x.projection.invalidPosting.length,0);
 assert.equal(x.projection.lines.filter(r=>r.counted&&r.tag==='TCAB-504-001').reduce((n,r)=>n+r.extended,0),98000);
 assert.equal(x.product.equipmentReferenceTHB,926000);
 const a3=x.source.a.find(r=>r.code==='A3');assert.equal(a3.previewCostTHB,926000);
 assert.equal(a3.previewSellTHB,1203800);assert.equal(a3.costComplete,false);
 assert.equal(x.before,x.after,'Release must not mutate Working costs');
 assert.equal(x.official.a.find(r=>r.code==='A3').amountUSD,34200);
 assert.equal(x.official.totalUSD,894590);assert.equal(x.official.issued,false);
 const g=x.official.customerPriceBreakdown.groups.find(r=>r.code==='A3');
 assert.equal(g.rows.filter(r=>r.id.endsWith('-MGW-PHONE1-JB')&&r.amountUSD>0).length,4);
 assert.equal(g.rows.reduce((n,r)=>n+(r.amountUSD||0),0),34200);
 assert.equal(x.archived.totalBaseUSD,902900);assert.equal(x.archived.rows.find(r=>r.code==='A3').amountUSD,34200);
 const mto=x.mto.rows.find(r=>r.sourceItem==='A-3');assert.equal(mto.budgetAllowanceTHB,98000);
 assert.equal(mto.countedInWorkingTotal,false);assert.equal(mto.incrementalCost,null);
 for(const site of x.bulk){
  const mirror=site.systems.find(r=>r.id==='EX_IP_PHONE')?.items.find(r=>r.id==='EX-PHONE-JB');
  if(mirror)assert.equal(mirror.extendedTHB,null,'JB bulk mirror must not post again');
 }
 console.log('PASS telephone JB allowance: four stable rows x THB24500 =98000 once; active/product Working926000; glands/technical gates open; A3USD34200 and submitted Rev02USD902900 unchanged.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
