// Execute real source -> working overlay -> release -> quoted breakdown.
// No build dependencies are required; Node's VM ESM loader reads project data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
if(!vm.SourceTextModule){
 const r=require('node:child_process').spawnSync(process.execPath,['--experimental-vm-modules',__filename],{stdio:'inherit'});
 process.exit(r.status??1);
}
async function main(){
 const root=path.resolve(__dirname,'../src/project0553/data');
 const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/0553-before-mto-reconciliation-20261103.json'),'utf8'));
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
  import {buildReleaseCommercialModel0553} from './releaseCommercialModel0553.js';
  import {buildOfficialUsdRelease0553} from './officialUsdRelease0553.js';
  import {buildCustomerPriceBreakdown0553} from './customerPriceBreakdown0553.js';
  import {deriveCustomerMtoC1Coverage0553,deriveBulkMrLocationCoverage0553} from './bulkMrLocationCoverage0553.js';
  import {MR0002_WORKING_BOM_0553} from './mr0002WorkingBom0553.js';
  import {MR0003_MGW_WORKING_BOM_0553} from './mr0003MgwWorkingBom0553.js';
  import {selectMR0002Rate0553} from './mr0002PriceRegistry0553.js';
  const source=buildReleaseCommercialModel0553({thbPerUsd:31.5});
  const official=buildOfficialUsdRelease0553(source);
  export const result={source,official,breakdown:buildCustomerPriceBreakdown0553(source,official),
   mto:deriveCustomerMtoC1Coverage0553(),gf:deriveCustomerMtoC1Coverage0553({site:'ZWP20'}),
   wp8:deriveCustomerMtoC1Coverage0553({site:'ZWP8'}),bulk:deriveBulkMrLocationCoverage0553(),
   dmr:MR0002_WORKING_BOM_0553,phone:MR0003_MGW_WORKING_BOM_0553,oldBoxRate:selectMR0002Rate0553('LNA-BOX')};
 `,{identifier:path.join(root,'validation-entry.mjs'),context});
 await entry.link((s,ref)=>get(resolve(s,ref.identifier)));await entry.evaluate();
 const x=JSON.parse(JSON.stringify(entry.namespace.result));
 assert.equal(x.oldBoxRate.selected,false);
 for(const site of x.dmr.sites){
  const box=site.items.find(r=>r.id.endsWith('-BULK-LNA-BOX'));
  assert(box,'Historical row identity must remain visible');
  assert.equal(box.countedInWorkingTotal,false);assert.equal(box.extended,null);
  assert.equal(box.historicalExtendedTHB,57939.81);
  assert.equal(box.parentPackage,site.site+'-RFI-BDA');
  assert.equal(site.items.find(r=>r.id.endsWith('-RFI-BDA')).extended,31474);
  assert.equal(site.items.find(r=>r.id.endsWith('-BDA-M20-GLANDS')).countedInWorkingTotal,false);
  assert.equal(site.items.find(r=>r.id.endsWith('-BDA-RF-FEEDTHROUGHS')).countedInWorkingTotal,false);
 }
 for(const site of x.phone.sites){
  const jb=site.items.find(r=>r.id.endsWith('-MGW-PHONE1-JB'));
  assert.equal(jb.qty,1);assert.equal(jb.tag,'TCAB-504-001');assert.equal(jb.extended,null);
  assert.equal(jb.countedInWorkingTotal,false);assert.equal(jb.budgetReference.unitCostTHB,22000);
  assert.equal(jb.budgetReference.sourceCableEntries,3);assert.equal(jb.requiredCableEntries,4);
  assert.equal(jb.budgetReference.selected,false);assert.equal(jb.budgetReference.additive,false);
 }
 assert.equal(x.mto.rows.length,57);assert.equal(new Set(x.mto.rows.map(r=>r.id)).size,57);
 for(const row of x.mto.rows){
  assert.equal(row.requiredQty,Number(row.sourceColumns[15]));
  assert.equal(row.sourceColumns.length,18);assert(row.sourceColumns[16].includes('Telecom Vendor'));
  assert.equal(row.countedInWorkingTotal,false);assert.equal(row.incrementalCost,null);
 }
 const sum=t=>x.mto.rows.filter(r=>r.materialType==='Cable'&&r.description.startsWith(t)).reduce((n,r)=>n+r.requiredQty,0);
 assert.equal(sum('T4'),35);assert.equal(sum('T5'),535);assert.equal(sum('T6'),400);assert.equal(sum('E1'),5);
 assert.equal(x.gf.rows.length,26);assert.equal(x.wp8.rows.length,12);
 assert.equal(x.gf.rows.find(r=>r.sourceItem==='B-2').requiredQty,498);
 assert.equal(x.mto.quantitySummary.cat6aBookedEquivalentM,483);
 assert.equal(x.mto.quantitySummary.automaticCableCreditAllowed,false);
 assert.equal(x.mto.quantitySummary.netAdditionalUnpricedScopeTHB,null);
 assert.equal(x.bulk.postAdditionalTHB,0);assert.equal(x.mto.pricesComplete,false);
 assert.equal(x.official.a.find(r=>r.code==='A2').amountUSD,129870);
 assert.equal(x.official.totalUSD,889270);assert.equal(x.official.totalUSD-baseline.totalUSD,-7260);
 for(const row of x.official.a.filter(r=>r.code!=='A2'))assert.deepEqual(row,baseline.a.find(r=>r.code===row.code));
 assert.deepEqual(x.official.b,baseline.b);assert.deepEqual(x.official.c,baseline.c);
 const changed=[];
 for(const row of x.breakdown.groups.flatMap(g=>g.rows)){
  const old=baseline.rows.find(r=>r.key===row.key);assert(old,'Row identity changed');
  if(row.qty!==old.qty){assert(row.id.endsWith('-MGW-PHONE1-JB'));assert.equal(row.qty,1);}
  if(row.amountUSD!==old.amountUSD||row.unitUSD!==old.unitUSD)changed.push(row);
 }
 assert.equal(changed.length,9);
 for(const r of changed){assert.equal(r.code,'A2');assert(/-BULK-LNA-BOX$|-RFI-BDA$|-UHF-4$/.test(r.id));}
 assert.equal(changed.filter(r=>r.id.endsWith('-BULK-LNA-BOX')&&r.status==='INCLUDED'&&r.amountUSD===null).length,3);
 assert.equal(x.breakdown.reconciled,true);assert.equal(x.official.issued,false);
 console.log('PASS MTO C1: 57 exact source rows; 3 unselected LNA allowances nonposting; 4 JB quantities sourced, candidate cost not posted; cable overlap not credited; actual A2 129870, A+B 889270; unchanged A1/A3/A4/B/C.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
