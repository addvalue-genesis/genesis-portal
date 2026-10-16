// PJ2608-0553 — Read-only top-down spare coverage from EXISTING installed-tag sources.
// DO NOT substitute generic historical spare descriptions for OEM SKU compatibility.
// This is a scenario/trace layer, never a second BOM or sell-price ledger.
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {MR0003_MR0004_SCOPE_C1} from "./mr0003Mr0004ScopeC1";
import {selectUnifiedSpareConsumables0553} from "./unifiedSpareConsumables0553";
import {deriveSpareRiskQuantity0553,deriveSpareReliabilityDemand0553,SPQ_001_0553,SPQ_002_0553} from "./spareRiskQuantity0553";
import TAG_EQUATIONS from "./controlledTagMappingEquations0553.json";

const MR_CODES=Object.freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const CAT=Object.freeze(["B10","B11","B13","C1","C2"]);
const actualTag=tag=>/^[A-Z]{2,6}-\d{3}-\d{3}[A-Z]?$/.test(String(tag||"").trim());
const distinct=arr=>[...new Set(arr)];
// Functional classification only; it NEVER asserts approved spare SKU equivalence.
function classify(mr,tag){
 const t=tag.toUpperCase();
 if(mr==="MR-0001"){
  if(/^MR-/.test(t))return {family:/A$/.test(t)?"IDU":"ODU_OR_RADIO",critical:true,b10:true,b13:false,c1:true,c2:true};
  if(/^LAN-/.test(t))return {family:"SCADA_NETWORK_SWITCH",critical:true,b10:true,b13:false,c1:true,c2:true};
  if(/^ANT-/.test(t))return {family:"SCADA_ANTENNA",critical:false,b10:true,b13:false,c1:false,c2:true};
  if(/^SA-/.test(t))return {family:"SCADA_SURGE",critical:false,b10:true,b13:false,c1:false,c2:true};
  return {family:"SCADA_OTHER",critical:false,b10:true,b13:true,c1:false,c2:true};
 }
 if(mr==="MR-0002"){
  if(t==="TCAB-508-001")return {family:"DMR_BDA_ENCLOSURE_ASSEMBLY",critical:true,b10:true,b13:false,c1:true,c2:true};
  if(t==="TCAB-508-002")return {family:"DMR_SURGE_ASSEMBLY",critical:false,b10:true,b13:false,c1:false,c2:true};
  if(/^ANT-/.test(t))return {family:"DMR_ANTENNA",critical:false,b10:true,b13:false,c1:false,c2:true};
  return {family:"DMR_RADIO_INTERFACE",critical:true,b10:true,b13:false,c1:true,c2:true};
 }
 if(mr==="MR-0003"){
  if(/^TPH-/.test(t))return {family:"EX_TELEPHONE",critical:true,b10:true,b13:false,c1:true,c2:true};
  if(/^LSE-/.test(t))return {family:"EX_SOUNDER",critical:true,b10:true,b13:false,c1:true,c2:true};
  return {family:"EX_PHONE_JB",critical:false,b10:true,b13:true,c1:false,c2:true};
 }
 if(/^MAR-/.test(t))return {family:"MARINE_RACON_MAIN",critical:true,b10:true,b13:false,c1:true,c2:true};
 return {family:"MARINE_RACON_CONTROL_BOX",critical:true,b10:true,b13:false,c1:true,c2:true};
}
function sourceInstalledTags(){
 // MR-0001: MTO Rev04 drives tag identity and physical package count.
 const mr1=MR0001_WORKING_PRICED_BOM.items.filter(x=>actualTag(x.sourceTag)).map(x=>({
  mr:"MR-0001",site:x.site,tag:x.sourceTag,description:x.description||"",
  source:"MTO Rev04 / MR0001_WORKING_PRICED_BOM",scopeQty:x.sourceScopeQty,
  authority:"MR0001_MTO_WORKING_PHYSICAL_QTY_NOT_OEM_SKU"
 }));
 // MR-0002: current AFC TEL-LAY source, explicitly filtered to DMR only.
 const mr2=Z1F_TEL_LAYOUT_INDEX_0553.byWP.flatMap(w=>w.equipment.filter(x=>x.system==="DTRS_TRUNK_RADIO"&&actualTag(x.tag)).map(x=>({
  mr:"MR-0002",site:w.wp,tag:x.tag,description:x.description||"",
  source:Z1F_TEL_LAYOUT_INDEX_0553.source,scopeQty:1,authority:"AFC_LAYOUT_TAG__MR_MTO_QUANTITY_CROSSCHECK"
 })));
 // MR0003/4: MR Rev.C1 scope controls even when symbols omitted from layout.
 const mr34=MR0003_MR0004_SCOPE_C1.systems.flatMap(x=>x.sites.flatMap(site=>x.components.filter(c=>actualTag(c.tag)).map(c=>({
  mr:"MR-"+x.mr.slice(-4),site,tag:c.tag,description:c.name,
  source:MR0003_MR0004_SCOPE_C1.sources[x.mr].document+" "+MR0003_MR0004_SCOPE_C1.sources[x.mr].revision+" §5",
  scopeQty:c.budgetQtyPerSystem,authority:"MR_C1_SCOPE__BUDGETARY_COMPONENT_DECOMPOSITION"
 }))));
 const out=new Map();
 for(const x of [...mr1,...mr2,...mr34]){
  const key=[x.mr,x.site,x.tag].join("|");
  if(!out.has(key))out.set(key,Object.freeze({...x,key}));
 }
 return [...out.values()];
}
const relatedCategory=(family,cat,description)=>{
 const d=description.toLowerCase();
 if(cat==="B11")return /racon/.test(d)?family.startsWith("MARINE_RACON"):/rf connector/.test(d)?/ANTENNA|RADIO|BDA/.test(family):/cable termination/.test(d)?/JB|CONTROL|NETWORK|RADIO/.test(family):/configuration/.test(d)?true:false;
 if(family.startsWith("SCADA_")||family==="ODU_OR_RADIO"||family==="IDU"){
  if(family==="SCADA_NETWORK_SWITCH")return /cisco|ethernet/.test(d);
  if(family==="SCADA_SURGE")return /surge/.test(d);
  if(family==="SCADA_ANTENNA")return /rf|antenna|connector|feeder/.test(d);
  return /scada|radio|poe|rf|ethernet|surge|cisco/.test(d);
 }
 if(family.startsWith("DMR_"))return /rf|surge|connector|gland|fuse|relay/.test(d);
 if(family==="EX_TELEPHONE")return /telephone|phone|gland|fuse/.test(d);
 if(family==="EX_SOUNDER")return /sounder|fuse|relay|gland/.test(d);
 if(family==="EX_PHONE_JB")return /gland|relay|fuse/.test(d);
 if(family==="MARINE_RACON_MAIN")return /racon|gland|fuse|relay/.test(d);
 return /racon|gland|fuse|relay/.test(d);
};
export function selectSpareCoverageEngineering0553(){
 const installed=sourceInstalledTags();
 const byMr=Object.fromEntries(MR_CODES.map(mr=>[mr,installed.filter(x=>x.mr===mr)]));
 if(MR_CODES.some(mr=>byMr[mr].length===0))throw Error("Missing installed TAG source for "+MR_CODES.find(mr=>byMr[mr].length===0));
 const master=selectUnifiedSpareConsumables0553();
 const byFamily=new Map();
 for(const x of installed){
  const cls=classify(x.mr,x.tag),key=x.mr+"|"+x.tag;
  if(!byFamily.has(key))byFamily.set(key,{mr:x.mr,tag:x.tag,...cls,instances:[]});
  byFamily.get(key).instances.push(x);
 }
 const groups=[...byFamily.values()].map(x=>{
  const sites=distinct(x.instances.map(y=>y.site));
  const scenario=deriveSpareRiskQuantity0553({installedCount:x.instances.length,critical:x.critical,
    contractualPartMinimum:null,compatibilityProven:false});
  const reliability=deriveSpareReliabilityDemand0553({installedCount:x.instances.length}); // Missing OEM reliability evidence -> OPEN_INPUT, not fabricated failure rate.
  const categoryCandidates=Object.fromEntries(CAT.map(cat=>[cat,(master.byCode[cat]||[]).filter(row=>relatedCategory(x.family,cat,row.description)).map(row=>row.id)]));
  // A textual/reference family match is never a proven spare SKU or actual stock coverage.
  return Object.freeze({
   id:x.mr+"-"+x.tag,mr:x.mr,tag:x.tag,family:x.family,
   installedSites:sites,installedCount:x.instances.length,sourceEvidence:distinct(x.instances.map(y=>y.source)),
   sourceQtyState:distinct(x.instances.map(y=>y.authority)),criticality:x.critical?"COMMISSIONING_CRITICAL_CANDIDATE":"STANDARD_REVIEW",
   categoryApplicability:{B10:x.b10,B11:!x.family.includes("SURGE")&&!x.family.includes("SOUNDER"),B13:x.b13,C1:x.c1,C2:x.c2},
   b10BudgetScenarioQty:x.b10?scenario.budgetQty:null,
   b10QtyEquationId:SPQ_001_0553.id,contractualPartMinimum:scenario.contractualPartMinimum,
   reliabilityEquationId:SPQ_002_0553.id,reliabilityQty:reliability.quantity,reliabilityState:reliability.status,
   contractKitMinimumState:"MR_C1_AND_EXA_A8_SPIR_KIT_COMPOSITION_NOT_YET_RESOLVED",
   interchangeabilityState:"REQUIRES_OEM_SKU_AND_RATING_PROOF",
   estimatedPartQtyState:scenario.status,
   budgetaryExistingSourceIds:categoryCandidates,
   coverageState:"CATEGORY_REFERENCE_ONLY__SPARE_SKU_MAPPING_AND_MINIMUM_AUDIT_OPEN",
   incrementalWorkingSellTHB:null,verifiedDirectCostTHB:null,postToPricing:false,
   sourceModel:"MAP-01/MAP-02/MAP-05/MAP-06/MAP-07/MAP-08/MAP-10 + SPQ-001"
  });
 });
 // MR0002 Rev.C1 lists RAD-508-001 LNA; current selected RFI BDA is
 // represented at TCAB-508-001 in working/layout evidence. Keep the MR
 // requirement as an unresolved crosswalk; never silently deem it replaced.
 const unresolvedRequirementTags=Object.freeze([
  Object.freeze({mr:"MR-0002",tag:"RAD-508-001",
   source:"MM-ZTK-1F-GEN-TEL-MR-0002 Rev.C1 §5",
   candidateCurrentInstalledTag:"TCAB-508-001",
   reason:"MR LNA tag versus selected RFI BDA/Ex d package; technical substitution and spare compatibility crosswalk outstanding",
   status:"REQUIREMENT_TO_SELECTED_PACKAGE_CROSSWALK_OPEN",
   quantity:null,additionalCostTHB:null})
 ]);
 const totals=Object.fromEntries(MR_CODES.map(mr=>[mr,Object.freeze({
  installedTagInstances:byMr[mr].length,uniqueTagTypes:groups.filter(x=>x.mr===mr).length,
  criticalTagTypes:groups.filter(x=>x.mr===mr&&x.criticality==="COMMISSIONING_CRITICAL_CANDIDATE").length,
  categoryRefsB10:distinct(groups.filter(x=>x.mr===mr).flatMap(x=>x.budgetaryExistingSourceIds.B10)).length
 })]));
 const requiredEquations=["MAP-01","MAP-02","MAP-05","MAP-06","MAP-07","MAP-08","MAP-10"];
 if(requiredEquations.some(id=>!TAG_EQUATIONS.equations.some(x=>x.id===id)))throw Error("Required existing tag equation missing");
 if(groups.length!==new Set(groups.map(x=>x.id)).size)throw Error("Duplicate functional spare family grouping");
 if(installed.some(x=>!x.site||!x.tag||!x.source))throw Error("Orphan installed source identity");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.spares-coverage",status:"PRE_AWARD_ENGINEERING_COVERAGE_REVIEW",
  sourceModuleIds:["MR0001_WORKING_PRICED_BOM","Z1F_TEL_LAYOUT_INDEX_0553","MR0003_MR0004_SCOPE_C1"],
  reusedEquationIds:requiredEquations,newEquationIds:[SPQ_001_0553.id,SPQ_002_0553.id],
  installed,groups,byMr,totals,unresolvedRequirementTags,categoryBudgetsTHB:master.budgetTotalsTHB,
  categoryCodes:CAT,customerReleaseAllowed:false,allSpareSkuVerified:false,minimumContractSatisfied:false,
  note:"Candidate category matches are NOT stock, SKU, minimum-spares, OEM, Ex certification or company compliance proof. Current Rev08 Working SELL is unchanged. No new price posting."
 });
}
