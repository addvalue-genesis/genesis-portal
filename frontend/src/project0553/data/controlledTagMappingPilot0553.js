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
 const blocked=(source=null,details=[])=>{
  for(const eq of EQ.equations)if(!stages.some(x=>x.id===eq.id))stages.push({id:eq.id,name:eq.name,status:"SKIPPED",details:"Previous mandatory mapping stage failed; no downstream result evaluated"});
  return {pilot:PILOT,equations:EQ.equations,stages,errors,details,status:"MAPPING_BLOCKED",
   source,ownerReconciliation:[],technical:[],budgetaryProceed:false,
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
  // B-8 and B-12 are attached to their own customer TAGs, so not in ODU derivation.
  const sourceMatch=Boolean(original&&inCatalog&&tech
   &&original.partNumber===inCatalog.productKey&&original.unitPrice===inCatalog.unitPrice
   &&inCatalog.quantity===original.qty
   &&inCatalog.currency===originalQuote.currency
   &&tech.partNumber===original.partNumber
   &&tech.functionId===(code==="B-12"?"ANTENNA_PARABOLIC":FUNCTION[code]));
  details.push({quoteLine:code,partNumber:original?.partNumber||null,
   sourceQuoteId:originalQuote.id,catalogRelationshipId:stableId,catalogCompanyId:inCatalog?.companyId||null,
   manufacturerEvidence:"NEXTG_VENDOR_QUOTED_MODEL_UNVERIFIED_OEM_CERTIFICATION",
   functionId:FUNCTION[code],costOwner:costOwnerFrom(code),sourceMatch,
   sourceQuoteQty:original?.qty??null,sourceUnitPriceUSD:original?.unitPrice??null,sourceCurrency:originalQuote.currency,
   quotePricingState:original?.pricingState||null,engineeringQty:ledgerComponent?.requiredQty??null,
   engineeringState:ledgerComponent?.quantityState||null,
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
 const qOK=details.filter(x=>["B-1","B-2","B-3","B-4","B-5","B-6","B-7"].includes(x.quoteLine))
 .every(x=>x.engineeringQty===1&&["DOCUMENT_DERIVED_PRELIMINARY","PARAMETRIC_1_PER_RADIO_ASSUMPTION","ENGINEERING_SOURCE"].includes(x.engineeringState));
 // Vendor source rate must remain NULL for region, no fabricated zero quoted rate.
 push("MAP-06",Boolean(qOK),"Quantity one per applicable working function has separate MTO/Topology basis; NG quoted quantity three remains evidence only");
 const ownerIds=new Set(details.map(x=>x.quoteLine));
 const ownersOK=ownerIds.size===details.length&&
  FINANCIAL_CODES.every(c=>!!COST_OWNER[c])&&
  details.filter(d=>["B-6","B-7"].includes(d.quoteLine)).every(d=>d.costOwner==="MR-502-001A.5")&&
  details.find(d=>d.quoteLine==="B-8")?.costOwner==="SA-502-001.10"&&
  details.find(d=>d.quoteLine==="B-12")?.costOwner==="ANT-502-001.6";
 push("MAP-07",Boolean(ownersOK),"Every named quote line has exactly one intended TAG+row owner; power IDU row5, surge row10, antenna row6");
 const rateRows=details.filter(x=>["B-1","B-2","B-3","B-4","B-5","B-6","B-7"].includes(x.quoteLine));
 const ratesOK=rateRows.every(x=>x.engineeringQty===1&&
  (x.quoteLine==="B-4"?
   (x.sourceUnitPriceUSD===null&&x.managementZeroAssumption&&x.mappingRateUSD===0):
   (Number.isFinite(x.sourceUnitPriceUSD)&&x.mappingRateUSD===x.sourceUnitPriceUSD
    &&x.mappingExtendedUSD===cents(x.sourceUnitPriceUSD*x.engineeringQty))));
 push("MAP-08",Boolean(ratesOK),
  "Original B-4 source is NULL and separate management incremental assumption is 0; sourced B-1/B-2/B-3/B-5/B-6/B-7 rates match exact USD amounts");
 const mappedOduUSD=cents(rateRows.filter(x=>x.costOwner==="MR-502-001.4")
  .reduce((n,x)=>n+(Number.isFinite(x.mappingExtendedUSD)?x.mappingExtendedUSD:0),0));
 const mappedIndoorUSD=cents(rateRows.filter(x=>x.costOwner==="MR-502-001A.5")
  .reduce((n,x)=>n+(Number.isFinite(x.mappingExtendedUSD)?x.mappingExtendedUSD:0),0));
 const checkOwners=[
  {id:"MR-502-001.4",row:4,mappedUSD:mappedOduUSD},
  {id:"MR-502-001A.5",row:5,mappedUSD:mappedIndoorUSD},
  {id:"SA-502-001.10",row:10,mappedUSD:details.find(x=>x.quoteLine==="B-8")?.sourceUnitPriceUSD??null},
  {id:"ANT-502-001.6",row:6,mappedUSD:details.find(x=>x.quoteLine==="B-12")?.sourceUnitPriceUSD??null}
 ].map(owner=>{
  const old=siteRows.find(r=>r.row===owner.row);
  const compatible=old?.currency==="USD"&&Number.isFinite(old.extended)&&Number.isFinite(owner.mappedUSD);
  return {...owner,sourceTag:old?.tag||null,ledgerUSD:old?.extended??null,
   deltaUSD:compatible?cents(owner.mappedUSD-old.extended):null,
   pass:compatible&&Math.abs(cents(owner.mappedUSD-old.extended))<=0.01};
 });
 const reconOK=checkOwners.every(x=>x.pass)&&row4?.detail?.length>=7;
 push("MAP-09",reconOK,
  reconOK?"All 4 separate owner totals reconciled to immutable ZWP20 Ledger at USD0.01 tolerance (ODU/IDU/Surge/Antenna)":
   "Cost owner allocation differs from the original ledger, is missing, or has currency mismatch; do not update");
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
