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

 const submitted=JSON.parse(fs.readFileSync(path.join(root,'snapshots/submitted.samtel.rev02.20261030.json'),'utf8'));
 const reference=JSON.parse(fs.readFileSync(path.join(root,'snapshots/release.rev03.20261103.json'),'utf8'));
 const quote=new Map(reference.rows.map(r=>[r.code,r.amountUSD]));
 assert.equal(submitted.totalBaseUSD,902900);
 assert.equal(submitted.rows.filter(r=>/^[AB]/.test(r.code)).reduce((n,r)=>n+(r.amountUSD||0),0),902900);
 assert.equal(submitted.messageId,'1a18a66100a2e5e0');
 assert.equal(submitted.submissionEvidenceVerified,true);assert.equal(submitted.customerAcceptanceVerified,false);
 const entry=new vm.SourceTextModule(`
  import {buildReleaseCommercialModel0553} from './releaseCommercialModel0553.js';
  import {buildOfficialUsdRelease0553} from './officialUsdRelease0553.js';
  import {buildCustomerPriceBreakdown0553,customerBreakdownRows0553} from './customerPriceBreakdown0553.js';
  import {MR0002_WORKING_BOM_0553} from './mr0002WorkingBom0553.js';
  import {selectMR0001Rev03TagCostRows0553} from './mr0001Rev03CostOverlay0553.js';
  const source=buildReleaseCommercialModel0553({thbPerUsd:31.5});
  const sourceBefore=JSON.stringify(source);
  const official=buildOfficialUsdRelease0553(source);
  const breakdown=buildCustomerPriceBreakdown0553(source,official);
  export const result={customerA3:customerBreakdownRows0553(breakdown.groups.find(g=>g.code==='A3')),sourceBefore,sourceAfter:JSON.stringify(source),source,official,breakdown,
   dmr:MR0002_WORKING_BOM_0553,zwp11:selectMR0001Rev03TagCostRows0553('ZWP11')};
 `,{identifier:path.join(root,'validation-entry.mjs'),context});
 await entry.link((s,ref)=>get(resolve(s,ref.identifier)));await entry.evaluate();
 const x=JSON.parse(JSON.stringify(entry.namespace.result));
 assert.equal(x.sourceBefore,x.sourceAfter,'Commercial override mutated working cost');
 assert.equal(x.breakdown.groups.flatMap(g=>g.rows).filter(r=>r.customerBudgetIncluded).length,10);
 assert.equal(x.customerA3.filter(r=>r.remark==='Included in quoted Part A budget; no additional charge.').length,4);
 for(const r of x.official.a)assert.equal(r.amountUSD,quote.get(r.code),'Retain current owner Rev03 Part A prices');
 assert.equal(x.official.a.reduce((n,r)=>n+r.amountUSD,0),705120);
 assert.equal(x.official.b.find(r=>r.code==='B10').amountUSD,12960);
 assert.equal(x.official.b.find(r=>r.code==='B11').amountUSD,null);
 assert.equal(x.official.b.find(r=>r.code==='B13').amountUSD,1530);
 for(const r of x.official.b.filter(r=>!['B10','B11','B13'].includes(r.code)))assert.equal(r.amountUSD,quote.get(r.code));
 assert.equal(x.official.totalUSD,894910);
 assert.equal(x.official.totalUSD-submitted.totalBaseUSD,-7990);
 assert.equal(x.official.issued,false);assert.equal(x.official.commercialPriceHold.additionalPartAChargeUSD,0);
 assert.equal(x.official.commercialPriceHold.directCostComplete,false);
 assert.equal(x.zwp11.find(r=>r.row===51).extended,39200);
 assert.equal(x.dmr.sites.filter(s=>s.items.some(r=>r.id.endsWith('-BULK-LNA-BOX')&&r.countedInWorkingTotal)).length,0);
 for(const g of x.breakdown.groups){
  assert.equal(g.parentUSD,g.rows.reduce((n,r)=>n+(r.amountUSD||0),0));assert.equal(g.varianceUSD,0);
  for(const r of g.rows)if(r.amountUSD!==null){assert.equal(r.unitUSD%10,0);assert.equal(r.amountUSD,r.unitUSD*r.qty);}
 }
 assert(x.breakdown.groups.find(g=>g.code==='A3').rows.some(r=>r.id.endsWith('-MGW-PHONE1-JB')&&r.amountUSD>0));
 // Invalid fixed-price quantities must fail instead of silently altering approved totals.
 const invalid={...x.source,a:x.source.a.map(r=>r.code==='A1'?{...r,sourceRows:r.sourceRows.map((v,i)=>i? v:{...v,qty:2})}:r)};
 const module=get(path.join(root,'officialUsdRelease0553.js'));
 assert.throws(()=>module.namespace.buildOfficialUsdRelease0553(invalid),/fixed price allocation requires/);
 console.log('PASS commercial hold: current Rev03 A1/A2/A3 241290/137130/34200 retained; working costs unchanged; B10/B11/B13 adjusted; base894910, delta-7990; fixed total child allocation reconciles; missing cost stays open.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
