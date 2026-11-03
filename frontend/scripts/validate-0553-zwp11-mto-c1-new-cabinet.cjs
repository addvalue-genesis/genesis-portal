// Execute real source -> working overlay -> release -> quoted breakdown.
// No build dependencies are required; Node's VM ESM loader reads project data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
if(!vm.SourceTextModule){
 const r=require('node:child_process').spawnSync(process.execPath,['--experimental-vm-modules',__filename],{stdio:'inherit'});
 process.exit(r.status??1);
}
async function main(){
 const root=path.resolve(__dirname,'../src/project0553/data');
 const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/0553-before-zwp11-new-cabinet-20261103.json'),'utf8'));
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
  import {selectMR0001TagCostRows0553} from './mr0001TagCostLedger0553.js';
  import {selectMR0001Rev03TagCostRows0553} from './mr0001Rev03CostOverlay0553.js';
  const rawBefore=JSON.stringify(selectMR0001TagCostRows0553('ZWP11'));
  const current=selectMR0001Rev03TagCostRows0553('ZWP11');
  const source=buildReleaseCommercialModel0553({thbPerUsd:31.5});
  const official=buildOfficialUsdRelease0553(source);
  const breakdown=buildCustomerPriceBreakdown0553(source,official);
  export const result={rawBefore,rawAfter:JSON.stringify(selectMR0001TagCostRows0553('ZWP11')),current,source,official,breakdown};
 `,{identifier:path.join(root,'validation-entry.mjs'),context});
 await entry.link((s,ref)=>get(resolve(s,ref.identifier)));await entry.evaluate();
 const {rawBefore,rawAfter,current,source,official,breakdown}=JSON.parse(JSON.stringify(entry.namespace.result));
 assert.equal(rawBefore,rawAfter,'Protected cost source mutated');
 const raw=JSON.parse(rawAfter).find(r=>r.tag==='TCAB-500-003'&&r.row===51);
 assert.equal(raw.procurementQty,0);assert.equal(raw.extended,0);
 const cabinets=current.filter(r=>r.tag==='TCAB-500-003'&&r.row===51);
 assert.equal(cabinets.length,1,'One physical cabinet, one posting owner');
 const cab=cabinets[0];
 assert.equal(cab.procurementQty,1);assert.equal(cab.sourceQty,1);
 assert.equal(cab.unitCost,raw.referenceUnitCost);assert.equal(cab.extended,39200);
 assert.equal(cab.countedInWorkingTotal,true);assert.equal(cab.releaseAllowed,false);
 assert.equal(cab.originProcurementQty,0);assert.equal(cab.originRawTHB,0);
 assert.equal(cab.ownerDecision.date,'2026-11-03');
 assert.equal(official.a.find(x=>x.code==='A1').amountUSD,241100);
 assert.equal(official.a.find(x=>x.code==='A2').amountUSD,137000);
 assert.equal(official.totalUSD,894590);
 assert.equal(official.commercialPriceHold.additionalPartAChargeUSD,0);
 assert.deepEqual(official.b,baseline.b);assert.deepEqual(official.c,baseline.c);
 const leaf=breakdown.groups.flatMap(g=>g.rows);
 assert.equal(leaf.length,baseline.rows.length);
 const cabinet=leaf.find(r=>r.site==='ZWP11'&&r.tag==='TCAB-500-003');
 assert(cabinet.amountUSD>0);assert.equal(cabinet.customerSellTHB,50960);
 for(const row of leaf.filter(r=>!['A1','A2'].includes(r.code))){
  const old=baseline.rows.find(x=>x.key===row.key);assert(old);
  assert.equal(row.amountUSD,old.amountUSD);assert.equal(row.unitUSD,old.unitUSD);
 }
 for(const g of breakdown.groups){assert.equal(g.varianceUSD,0);assert.equal(g.rows.reduce((n,r)=>n+(r.amountUSD??0),0),g.parentUSD);}
 assert.equal(breakdown.reconciled,true);assert.equal(official.issued,false);
 const owned=source.a.find(x=>x.code==='A1').sourceRows.filter(r=>r.site==='ZWP11'&&r.tag==='TCAB-500-003');
 assert.equal(owned.length,1);assert.equal(owned[0].costTHB,39200);
 console.log('PASS ZWP11 MTO C1: 1 new cabinet, existing THB39200 cost once; cabinet direct cost retained inside owner-held A1 USD241100; A2 USD137000; base894590; B/C and frozen source unchanged.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
