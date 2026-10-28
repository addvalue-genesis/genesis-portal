import {PROJECT_0553_FACTS} from "../projectFacts";
import requirements from "./documentParticularRequirements0553.json";
import {MR0003_MR0004_SCOPE_C1} from "./mr0003Mr0004ScopeC1";
import {LNA_0553_BASIS} from "./lnaEvidence";

// Display aggregation only. These are MR/site summaries, NOT original MR line numbers
// or a new physical BOM. Unknown package quantities must not become invented "1 lot".
export const mrSummaryKey0553 = (mr,site) => JSON.stringify([mr,site]);
const sitesByMr={
 "MR-0001":["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"],
 "MR-0002":["ZWP20","ZWP21","ZWP22"],
 ...Object.fromEntries(MR0003_MR0004_SCOPE_C1.systems.map(s=>[s.mr.replace("MR","MR-"),s.sites]))
};
const qualifications={
 "MR-0001":"Equipment and bulk scope subject to the referenced MR and technical clarifications.",
 "MR-0002":"Selected BDA substitution and Ex assembly/cable compliance remain subject to confirmation.",
 "MR-0003":"Telephone junction box, glands and interfaces remain subject to scope/price confirmation.",
 "MR-0004":"Field cables, glands and shared phase kit scope remain subject to confirmation. Adapter/charging kit is one set per phase, not one per site."
};
function quantityBasis(mr,site){
 if(mr==="MR-0001"){
  const requirement=requirements.records.find(r=>r.id==="REQ0553-002");
  return requirement.tags.includes(site)
   ?{qty:1,unit:"set",quantityBasis:"MR §5: one SCADA radio set/platform"}
   :{qty:null,unit:"See MR §5",quantityBasis:"Brownfield equipment scope; no aggregate system quantity asserted"};
 }
 if(mr==="MR-0002"){
  if(!LNA_0553_BASIS.qtyBasis.includes(site))throw Error("MR0002 summary quantity evidence missing");
  return {qty:1,unit:"set",quantityBasis:"MR summary: one set/platform; selected BDA deviation remains open"};
 }
 const scope=MR0003_MR0004_SCOPE_C1.systems.find(s=>s.mr===mr.replace("-",""));
 return {qty:scope.quantityPerSite,unit:scope.unit,quantityBasis:"MR §5 contractual system/set; constituent equipment not added as another package"};
}

export function buildMrCustomerSummary0553(breakdown){
 const groups=breakdown.groups.map(group=>{
  const fact=PROJECT_0553_FACTS.systems.find(s=>s.mr===group.mr),sites=sitesByMr[group.mr];
  if(!fact||!sites||group.rows.some(r=>!sites.includes(r.site)))throw Error("Unmapped MR summary site: "+group.mr);
  const rows=sites.map((site,index)=>{
   const children=group.rows.filter(r=>r.site===site);
   if(!children.length)throw Error("Missing MR summary source rows: "+group.mr+" / "+site);
   const amountUSD=children.some(r=>Number.isFinite(r.amountUSD))
    ?children.reduce((s,r)=>s+Math.round((r.amountUSD??0)*100),0)/100:null;
   const basis=quantityBasis(group.mr,site);
   return {key:mrSummaryKey0553(group.mr,site),item:group.code+".S"+(index+1),mr:group.mr,site,
    description:fact.name+(group.mr==="MR-0001"&&basis.qty===null?" — brownfield equipment scope":""),
    ...basis,amountUSD,unitUSD:basis.qty>0&&amountUSD!==null?amountUSD/basis.qty:null,
    mrReference:fact.rfqSource.title+" "+fact.rfqSource.revision+" §5",
    qualification:qualifications[group.mr],
    sourceKeys:children.map(r=>r.key)};
  });
  const keys=rows.flatMap(r=>r.sourceKeys);
  if(keys.length!==group.rows.length||new Set(keys).size!==keys.length)throw Error("MR summary must own every source row exactly once");
  const totalUSD=rows.some(r=>r.amountUSD!==null)?rows.reduce((s,r)=>s+Math.round((r.amountUSD??0)*100),0)/100:null;
  if(totalUSD!==group.totalUSD)throw Error("MR summary changed Release total");
  return {code:group.code,mr:group.mr,description:fact.name,rows,totalUSD,parentUSD:group.parentUSD,
   varianceUSD:group.varianceUSD,qualification:qualifications[group.mr]};
 });
 return {groups,totalUSD:breakdown.totalUSD,issued:false,releaseAllowed:false};
}
