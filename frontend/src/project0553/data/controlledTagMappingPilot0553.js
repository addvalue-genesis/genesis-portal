// Controlled, read-only TAG → Function → 07 Vendor → Cost-Owner mapping audit.
// This NEVER changes the authoritative Engineering BOM or Cost Ledger.
import EQ from "./controlledTagMappingEquations0553.json";
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {VENDOR_UNIFIED_CATALOG_0553} from "./vendorUnifiedCatalog0553";
import {AVIAT_0553_TECHNICAL_EVALUATION} from "./aviatTechnicalBidEvaluation";
import {SCADA_LINKS_0553} from "./scadaLinkEvidence";
import {traceTagParticular0553} from "./documentParticularTrace0553";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {deriveSourcedExtended,matchQuotedSourceLine,reconcileTagCostOwners,normalizedEquipmentTag} from "../../common/engineering/controlledTagMappingKernel";

const PILOT=Object.freeze({projectId:"PJ2608-0553",mr:"MR-0001",site:"ZWP20",tag:"MR-502-001",row:4});
const COST_OWNER=Object.freeze({
 "B-1":"MR-502-001.4","B-2":"MR-502-001.4","B-3":"MR-502-001.4",
 "B-4":"MR-502-001.4","B-5":"MR-502-001.4",
 "B-6":"MR-502-001A.5","B-7":"MR-502-001A.5",
 "B-8":"SA-502-001.10","B-12":"ANT-502-001.6"
});
const FUNCTION=Object.freeze({
 "B-1":"RADIO_EQUIPMENT","B-2":"RF_FILTER","B-3":"CAPACITY_KEY",
 "B-4":"REGION_KEY","B-5":"MOUNT_FEEDER","B-6":"POWER","B-7":"POWER_CORD",
 "B-8":"ETHERNET_SURGE","B-12":"ANTENNA_RF"
});
const FINANCIAL_CODES=Object.freeze(["B-1","B-2","B-3","B-4","B-5","B-6","B-7","B-8","B-12"]);
const cents=n=>Math.round(n*100)/100;
const keyOf=(r)=>String(r.sourcePartText||"").replace(/\s+/g,"").toUpperCase();
const fail=(id,details)=>({id,status:"ERROR",details});
const pass=(id,details,status="PASS")=>({id,status,details});
const quoteLineByCode=new Map(NEXTG.lines.map((r,i)=>[r.code,{...r,originalIndex:i}]));
const techByLine=new Map(AVIAT_0553_TECHNICAL_EVALUATION.rows.map(r=>[r.quoteLine,r]));
const catalogIndex=new Map(VENDOR_UNIFIED_CATALOG_0553.relationships.filter(r=>r.quoteId===NEXTG.id)
 .map(r=>[r.id,r]));
const detailedLedger=()=>deriveZWP20SiteCost0553().rows;
const costOwnerFrom=code=>COST_OWNER[code]||null;

/** Accepts optional overrides for invariant/negative tests. All normal work uses original sources. */
export function auditZWP20RadioVendorMapping0553(overrides={}){
 const stages=[],errors=[];
 const push=(eq,okay,message,qualified=false)=>{
  const out=okay?pass(eq,message,qualified?"QUALIFIED":"PASS"):fail(eq,message);
  stages.push({...out,name:EQ.equations.find(e=>e.id===eq)?.name||eq});
  if(!okay)errors.push({equationId:eq,message});
 };
 const itemRows=overrides.mtoRows??MTO.itemRows;
 const sourceMatches=itemRows.filter(r=>r.platform===PILOT.site&&r.sourceRowIndex===PILOT.row&&keyOf(r)===PILOT.tag);
 const source=sourceMatches[0]||null;
 const blocked=(source=null,details=[],extra={})=>{
  for(const eq of EQ.equations)if(!stages.some(x=>x.id===eq.id))stages.push({id:eq.id,name:eq.name,status:"SKIPPED",details:"Previous mandatory mapping stage failed; no downstream result evaluated"});
  return {pilot:PILOT,equations:EQ.equations,stages,errors,details,status:"MAPPING_BLOCKED",
   source,ownerReconciliation:extra.ownerReconciliation||[],technical:extra.technical||[],budgetaryProceed:false,
   ledgerMutation:false,approvedVendorSelection:false,technicalCompliancePassed:false,releaseAllowed:false};
 };
 const sourceOK=sourceMatches.length===1&&source.sourceQty===1&&source.sourceUnit==="Set"&&!source.groupedRow;
 push("MAP-01",sourceOK,
  sourceOK?"One exact MTO row: ZWP20 MR-502-001 Row 4, Rev04, 1 Set":"Missing/duplicate MTO row or non-1-Set quantity: strict tag identity failed");
 // Stage-order rule: if source fails, no downstream candidate is promoted as a mapping.
 if(!sourceOK)return blocked();
 const packageRows=MR0001_PACKAGE_COMPOSITION.packages.filter(p=>p.platform===PILOT.site&&p.sourceRowIndex===PILOT.row);
 const linkMatches=SCADA_LINKS_0553.filter(x=>x.from==="ZWP8"&&x.to===PILOT.site&&x.mode==="PTMP");
 const requirements=traceTagParticular0553(PILOT.site,PILOT.tag);
 const docOK=packageRows.length===1&&linkMatches.length===1&&requirements.direct.length>0&&requirements.siteSpecific.length>0;
 push("MAP-02",docOK,docOK?
  "RPT topology ZWP8→ZWP20 PTMP; "+requirements.direct.length+" direct TAG clauses, "+requirements.siteSpecific.length+" site clauses; original document revision stays authoritative":
  "Package row, radio topology or direct/site particular requirements are not uniquely traceable");
 if(!docOK)return blocked(source);
 const packageRow=packageRows[0];
 const expected=new Set(["RADIO_EQUIPMENT","RF_FILTER","CAPACITY_KEY","REGION_KEY","MOUNT_FEEDER","POWER","POWER_CORD"]);
 const actual=new Set(packageRow.components.map(x=>x.functionId));
 const fOK=[...expected].every(x=>actual.has(x))&&source.sourceItemCodes.length===1&&source.sourceItemCodes[0]===PILOT.tag;
 push("MAP-03",fOK,fOK?"Engineering functions decomposed; IDU power and surge/antenna assigned separately":"Missing required engineering function or incorrect grouped MTO identity");
 if(!fOK)return blocked(source);
 const siteRows=overrides.ledgerRows??detailedLedger();
 const row4=siteRows.find(x=>x.row===4&&x.tag===PILOT.tag);
 const details=[];
 const originalQuote=overrides.quote??NEXTG;
 for(const code of FINANCIAL_CODES){
  const original=originalQuote.lines.find(x=>x.code===code);
  const idx=original?originalQuote.lines.findIndex(x=>x.code===code):-1;
  const stableId=original?originalQuote.id+":"+idx:null;
  const inCatalog=stableId?catalogIndex.get(stableId):null;
  const tech=techByLine.get(code);
  const ledgerComponent=(row4?.detail||[]).find(x=>x.budgetaryQuoteLine===code||
     x.budgetarySelectedOffer===code);
  const separateOwnerRow=code==="B-8"?siteRows.find(r=>r.row===10):
   code==="B-12"?siteRows.find(r=>r.row===6):null;
  // B-8 and B-12 are attached to their own customer TAGs, so not in ODU derivation.
  const joined=matchQuotedSourceLine({offer:originalQuote,line:original,index:idx,
   catalogRelationship:inCatalog,technicalRecord:tech,
   expectedFunction:code==="B-12"?"ANTENNA_PARABOLIC":FUNCTION[code]});
  const sourceMatch=joined.matched;
  details.push({quoteLine:code,partNumber:original?.partNumber||null,
   sourceQuoteId:originalQuote.id,catalogRelationshipId:stableId,catalogCompanyId:inCatalog?.companyId||null,
   manufacturerEvidence:"NEXTG_VENDOR_QUOTED_MODEL_UNVERIFIED_OEM_CERTIFICATION",
   functionId:FUNCTION[code],costOwner:costOwnerFrom(code),sourceMatch,
   sourceQuoteQty:original?.qty??null,sourceUnitPriceUSD:original?.unitPrice??null,sourceCurrency:originalQuote.currency,
   quotePricingState:original?.pricingState||null,sourceJoinIssues:joined.issues,
   engineeringQty:ledgerComponent?.requiredQty??separateOwnerRow?.sourceQty??null,
   engineeringState:ledgerComponent?.quantityState||(separateOwnerRow?"MTO_SEPARATE_TAG_QTY":null),
   mappingRateUSD:ledgerComponent?.budgetaryUnitPrice??null,
   mappingExtendedUSD:ledgerComponent?.budgetaryExtended??null,
   supplierQuotedAsZero:original?.unitPrice===0,
   managementZeroAssumption:code==="B-4"&&original?.unitPrice==null,
   sourcePage:original?.sourcePage??null,
   technicalApproval:"NOT_ISSUED",mappingStatus:sourceMatch?"FUNCTION_CANDIDATE":"SOURCE_JOIN_ERROR"});
 }
 const joinsOK=details.every(x=>x.sourceMatch)&&new Set(details.map(x=>x.catalogRelationshipId)).size===details.length;
 push("MAP-04",joinsOK,joinsOK?
  "9 unique quote-code/SKU/price/currency/qty joins verified against 07 Vendor registry and original NG-260916; no quote-wide multiplication":
  "At least one selected quote code failed original vendor-source join: do not map or price");
 if(!joinsOK)return blocked(source,details);
 const quotedDescription=code=>String(originalQuote.lines.find(r=>r.code===code)?.description||"");
 const regionDescription=quotedDescription("B-4");
 const countryExplicit=/\bUS\b|Canada|Oman/i.test(regionDescription);
 const actualMyanmar=/Myanmar/i.test(regionDescription);
 const technical=[
  {id:"TECH-RADIO-ROLE",result:/Remote Terminal/i.test(quotedDescription("B-1"))?"CANDIDATE":"CONFLICT",
   evidence:"ZWP8→ZWP20 PTMP remote role requires a compatible remote unit; B-1 supplier description: "+quotedDescription("B-1")},
  {id:"TECH-EX-ZONE2",result:/HAZ Zone-2/i.test(quotedDescription("B-1"))?"UNVERIFIED":"CONFLICT",
   evidence:"B-1 claimed hazardous-area scope is source text, not complete Ex-certified assembly proof"},
  {id:"TECH-CAPACITY",result:"UNVERIFIED",
   evidence:"B-3 "+quotedDescription("B-3")+"; throughput/QoS/NMS and perpetual entitlement remain unverified"},
  {id:"TECH-COUNTRY-REGION",result:countryExplicit&&!actualMyanmar?"CONFLICT":"UNVERIFIED",
   evidence:"B-4 original source: "+regionDescription+". Requires Myanmar operating entitlement; source price NULL, not vendor-confirmed zero."},
  {id:"TECH-POWER-INTERFACE",result:"UNVERIFIED",
   evidence:"B-6 "+quotedDescription("B-6")+"; B-7 "+quotedDescription("B-7")+"; site 24V IT interface proof required"},
  {id:"TECH-INCLUDED-FITTINGS",result:"UNVERIFIED",
   evidence:"B-5 "+quotedDescription("B-5")+"; RF mounts/jumpers must be counted once against physical interface/Bulk"}
 ];
 push("MAP-05",true,"Six evidence-derived technical checkpoints documented; "+technical.filter(x=>x.result==="CONFLICT").length+" conflicting/unresolved product claims. Compliance is NOT approved.",true);
 const qOK=details.every(x=>x.engineeringQty===1&&
  ["DOCUMENT_DERIVED_PRELIMINARY","PARAMETRIC_1_PER_RADIO_ASSUMPTION","ENGINEERING_SOURCE","MTO_SEPARATE_TAG_QTY"].includes(x.engineeringState));
 // Vendor source rate must remain NULL for region, no fabricated zero quoted rate.
 push("MAP-06",Boolean(qOK),"Every physical function has quantity derived from its TAG or RPT topology, not from supplier offered quantity");
 if(!qOK)return blocked(source,details,{technical});
 const ownerIds=new Set(details.map(x=>x.quoteLine));
 const ownersOK=ownerIds.size===details.length&&
  FINANCIAL_CODES.every(c=>!!COST_OWNER[c])&&
  details.filter(d=>["B-6","B-7"].includes(d.quoteLine)).every(d=>d.costOwner==="MR-502-001A.5")&&
  details.find(d=>d.quoteLine==="B-8")?.costOwner==="SA-502-001.10"&&
  details.find(d=>d.quoteLine==="B-12")?.costOwner==="ANT-502-001.6";
 push("MAP-07",Boolean(ownersOK),"Every named quote line has exactly one intended TAG+row owner; power IDU row5, surge row10, antenna row6");
 if(!ownersOK)return blocked(source,details,{technical});
 // MAP-08: independently calculate every physical function using the shared equation kernel.
 // The vendor B-4 source rate is NULL; the ZERO incremental management scenario is SEPARATE,
 // identified and never represented as a confirmed supplier rate.
 const costEntries=details.map(x=>{
  const assumption=x.quoteLine==="B-4"?{
   unitRate:0,sourceId:"USER_MANAGEMENT_BUDGETARY_INCLUDED_ASSUMPTION",
   status:"UNVERIFIED_MYANMAR_REGION_ENTITLEMENT_NOT_VENDOR_QUOTE"}:null;
  const derived=deriveSourcedExtended({quantity:x.engineeringQty,sourceUnitRate:x.sourceUnitPriceUSD,
   currency:x.sourceCurrency,assumption});
  return {sourceUsageKey:x.sourceQuoteId+":"+x.quoteLine,ownerId:x.costOwner,
   currency:x.sourceCurrency,amount:derived.amount,derivedState:derived.state,
   quoteLine:x.quoteLine,originalSourceUnitPrice:derived.sourceRate};
 });
 const ratesOK=costEntries.every(line=>{
  const x=details.find(d=>d.quoteLine===line.quoteLine);
  const expected=Number.isFinite(x.mappingExtendedUSD)?x.mappingExtendedUSD:line.amount;
  const managementOK=line.quoteLine!=="B-4"||
   (x.sourceUnitPriceUSD===null&&x.mappingRateUSD===0
    &&line.derivedState==="MANAGEMENT_ASSUMPTION_NOT_VENDOR_QUOTE");
  return managementOK&&Number.isFinite(line.amount)&&line.amount===expected;
 });
 push("MAP-08",Boolean(ratesOK),
  "Independent quantity × original currency unit rate; B-4 retains vendor NULL with named incremental management assumption only");
 if(!ratesOK)return blocked(source,details,{technical});
 const ledgerForAudit=[
  {ownerId:"MR-502-001.4",row:4,tag:"MR-502-001"},
  {ownerId:"MR-502-001A.5",row:5,tag:"MR-502-001A"},
  {ownerId:"ANT-502-001.6",row:6,tag:"ANT-502-001"},
  {ownerId:"SA-502-001.10",row:10,tag:"SA-502-001"}
 ].map(x=>{
  const r=siteRows.find(row=>row.row===x.row);
  return {...x,currency:r?.currency||null,extended:r?.extended??null,
   sourceTag:r?.tag||null,sourceQty:r?.sourceQty??null,
   sourceTagMatch:normalizedEquipmentTag(r?.tag)===x.tag,
   sourceQtyMatch:r?.sourceQty===1};
 });
 const costReconciliation=reconcileTagCostOwners({
  items:costEntries,ledger:ledgerForAudit.map(l=>({ownerId:l.ownerId,currency:l.currency,extended:l.extended}))
 });
 const checkOwners=costReconciliation.ownerResults.map(r=>{
  const sourceRecord=ledgerForAudit.find(l=>l.ownerId===r.ownerId);
  return {id:r.ownerId,row:sourceRecord.row,
   sourceTag:sourceRecord.sourceTag,mappedUSD:r.mappedAmount,
   ledgerUSD:r.extended,deltaUSD:r.delta,
   pass:r.pass&&sourceRecord.sourceTagMatch&&sourceRecord.sourceQtyMatch&&r.currency==="USD"};
 });
 const reconOK=costReconciliation.pass&&checkOwners.every(x=>x.pass)&&row4?.detail?.length>=7;
 push("MAP-09",reconOK,
  reconOK?"Four physical TAG owners reconciled to unchanged source ledger with USD0.01 tolerance; distinct source-line allocation verified":
   "Owner, TAG identity, source quantity, rate, currency or cost does not match frozen ZWP20 ledger; no repricing");
 if(!reconOK)return blocked(source,details,{technical,ownerReconciliation:checkOwners});
 const internalProceed=stages.filter(x=>x.id!=="MAP-05").every(x=>x.status==="PASS");
 push("MAP-10",internalProceed,
  internalProceed?"Internal budget may proceed under recorded qualification; release remains forbidden until technical certificates, Myanmar entitlement, NMS, validity and OEM proof":
  "Mapping invariants unresolved; internal budget result must not be adopted");
 return {pilot:PILOT,equations:EQ.equations,
  source:{id:MTO.source.driveId,file:MTO.source.file,revision:MTO.source.revision,site:PILOT.site,
   tag:PILOT.tag,row:source.sourceRowIndex,qty:source.sourceQty,unit:source.sourceUnit},
  quote:{id:NEXTG.id,number:NEXTG.quoteNumber,currency:NEXTG.currency,originalQuoteTotal:NEXTG.quotedGrandTotal},
  stages,errors,requirements:{direct:requirements.direct.map(x=>x.id),site:requirements.siteSpecific.map(x=>x.id),
    common:requirements.common.length,conflicts:requirements.conflicts.map(x=>x.id)},
  technical,details,ownerReconciliation:checkOwners,
  sourceQuoteRegionRate:details.find(x=>x.quoteLine==="B-4")?.sourceUnitPriceUSD??null,
  linkedSourceId:"PJ2608-0553 / bid.vendor.products.supplier.quote-lines",
  budgetaryProceed:internalProceed,status:errors.length?"MAPPING_BLOCKED":"BUDGETARY_RECONCILED_WITH_QUALIFICATIONS",
  sourceOfTruth:"MR0001 MTO Rev04 + RPT/BOD/DTS/SPE + NG-260916 + Existing ZWP20 Ledger",
  ledgerMutation:false,approvedVendorSelection:false,technicalCompliancePassed:false,
  customerPriceReleased:false,releaseAllowed:false};
}
