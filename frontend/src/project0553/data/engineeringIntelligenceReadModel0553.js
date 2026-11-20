// PJ2608-0553 project PARTICULAR adapter for reusable Engineering Intelligence.
// Returns non-commercial *recommendation evidence* only; no Budgetary/SQL mutation.
import {evaluateEngineeringCandidate,evaluateOfferedPackageCoverage,findRelevantEngineeringCases,
 INTELLIGENCE_RULE_VERSION} from "../../common/engineering/engineeringIntelligenceCore";
import CASES from "./engineeringDecisionCasebook0553.json";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import {MGW_P26_058_0553} from "./mgwP26058";
import EXION from "./quotes/EXION-1260576-R0.current.json";
import {VENDOR_UNIFIED_CATALOG_0553} from "./vendorUnifiedCatalog0553";

const sourceRow=MTO.itemRows.find(r=>r.platform==="ZWP20"&&r.sourceRowIndex===4&&r.sourcePartText==="MR-502-001");
const region=NEXTG.lines.find(x=>x.code==="B-4");
const radio=NEXTG.lines.find(x=>x.code==="B-1");
const linkedRegion=VENDOR_UNIFIED_CATALOG_0553.relationships.find(x=>
 x.quoteId===NEXTG.id&&x.productKey===region?.partNumber);
const linkedRadio=VENDOR_UNIFIED_CATALOG_0553.relationships.find(x=>
 x.quoteId===NEXTG.id&&x.productKey===radio?.partNumber);
const countryList=["US","Canada","Oman"].filter(country=>
 new RegExp("\\b"+country+"\\b","i").test(String(region?.description||"")));
const phone=MGW_P26_058_0553.lines.find(l=>l[0]==="PHONE-1");
const originalPhoneLink=VENDOR_UNIFIED_CATALOG_0553.relationships.find(x=>
 x.quoteId===MGW_P26_058_0553.id&&x.productKey===phone?.[1]);
const quoteEvidence=(quoteId,lineId)=>quoteId+" / "+lineId;

/** Strong source-backed example cases, not a complete RFQ requirement or full selected BOM. */
export function readProjectEngineeringIntelligence0553(){
 const ready=Boolean(sourceRow&&region&&radio&&linkedRegion&&linkedRadio&&phone&&originalPhoneLink);
 if(!ready)return {state:"SOURCE_EVIDENCE_INCOMPLETE",ready:false,
  sourceOnly:true,autoSelected:false,costPosted:false,examples:[]};
 const regionRequirement={
  id:"0553-ZWP20-RADIO-COUNTRY-ENTITLEMENT",
  functionId:"COUNTRY_FREQUENCY_ENTITLEMENT",
  sourceRefs:[MTO.source.file,quoteEvidence(NEXTG.id,"B-4")],
  constraints:[{id:"COUNTRY-MYANMAR",property:"supportedCountries",operator:"containsAll",
   expected:["Myanmar"],mandatory:true}]
 };
 const offeredRegion={
  id:region.partNumber,manufacturer:"Aviat/RADWIN product family as quoted by Next G (OEM approval unverified)",
  functions:["COUNTRY_FREQUENCY_ENTITLEMENT"],quotationRef:quoteEvidence(NEXTG.id,"B-4"),
  avlStatus:"NOT_VERIFIED",
  properties:{supportedCountries:{value:countryList,sourceRef:quoteEvidence(NEXTG.id,"B-4")}}
 };
 const regionResult=evaluateEngineeringCandidate({requirement:regionRequirement,candidate:offeredRegion});
 const phoneSourceRef=quoteEvidence(MGW_P26_058_0553.id,"PHONE-1");
 const offeredPhonePackage={
  packageId:phone[1],supplier:MGW_P26_058_0553.vendor,quoteId:MGW_P26_058_0553.id,
  included:[
   {functionId:"EX_IP_PHONE",componentId:"JR-JREX106-SIP",inclusion:"INCLUDED",sourceRef:phoneSourceRef},
   {functionId:"EX_ALARM_SOUNDER",componentId:"WAROM-BBJ81",inclusion:"INCLUDED",sourceRef:phoneSourceRef},
   {functionId:"EX_JUNCTION_BOX",componentId:"WAROM-BXJ-S",inclusion:"INCLUDED",sourceRef:phoneSourceRef},
   {functionId:"CERTIFIED_GLAND",componentId:"PACKAGE-CERTIFIED-GLAND",inclusion:"INCLUDED",sourceRef:phoneSourceRef}
  ]
 };
 const phoneRequirements=["EX_IP_PHONE","EX_ALARM_SOUNDER","EX_JUNCTION_BOX","CERTIFIED_GLAND"];
 const mgwCoverage=evaluateOfferedPackageCoverage({requiredFunctions:phoneRequirements,offer:offeredPhonePackage});
 const exionCoverage=evaluateOfferedPackageCoverage({
  requiredFunctions:phoneRequirements,offer:{
   included:[
    {functionId:"EX_IP_PHONE",componentId:EXION.lines[0]?.sku,inclusion:"INCLUDED",
     sourceRef:quoteEvidence(EXION.id,"1")},
    {functionId:"EX_ALARM_SOUNDER",componentId:EXION.lines[1]?.sku,inclusion:"INCLUDED",
     sourceRef:quoteEvidence(EXION.id,"2")}
   ]
  }
 });
 const cases=findRelevantEngineeringCases({
  casebook:CASES,functions:["COUNTRY_FREQUENCY_ENTITLEMENT","EX_ALARM_SOUNDER"],
  context:["MR-0001","MR-0003","ZWP20"]
 });
 return {
  state:"READ_ONLY_CANDIDATE_ASSESSMENT",ready:true,ruleVersion:INTELLIGENCE_RULE_VERSION,
  site:"ZWP20",tag:sourceRow.sourcePartText,mtoRowIndex:sourceRow.sourceRowIndex,
  region:{requirement:regionRequirement,offered:offeredRegion,evaluation:regionResult,
   vendorRate:region.unitPrice,sourcePricingState:region.pricingState,
   linkedVendorEvidenceId:linkedRegion.id,
   note:"Region 04 quote is source evidence, not a confirmed Myanmar licence. Vendor rate remains NULL."},
  phonePackages:{mgw:mgwCoverage,exion:exionCoverage,
   quoteRefs:[phoneSourceRef,EXION.id],
   note:"Alternative packages require engineering completeness comparison and cannot be added together."},
  relevantDecisionCases:cases,
  sourceOnly:true,autoSelected:false,approvedTechnicalCompliance:false,costPosted:false,
  customerReleaseAllowed:false
 };
}
