// PJ2608-0553 — source-driven BULK completeness and source-to-release audit.
// DO NOT treat a priced "1 Lot" as a certified physical takeoff.
// Read ONLY: requirements and gaps never mutate Cost, Working Sell or Release.
import ORIGINAL_MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import {deriveBulkMrLocationCoverage0553} from "./bulkMrLocationCoverage0553";
import {selectWorkingBomProjection0553} from "./workingBomAggregation0553";
import {MGW_P26_058_R2_SELECTED_0553 as MGW} from "./mgwP26058R2Selected0553";
import {deriveMR0002RfPhysicalRouteReconciliation0553} from "./mr0002RfPhysicalRouteReconciliation0553";
import {derivePhysicalCableEndRegister0553} from "./physicalCableEndRegister0553";

const MR_TO_CUSTOMER=Object.freeze({"MR-0001":"A1","MR-0002":"A2","MR-0003":"A3","MR-0004":"A4"});
const SOURCE_REFS=Object.freeze({
 "MR-0001":{doc:ORIGINAL_MTO.source.file,revision:ORIGINAL_MTO.source.revision,
  requirement:"SCADA Bulk Material 1 Lot per Location; coaxial/Ethernet fire performance TC-0001 Items 7–8",
  authority:"REV04_MTO_SOURCE_ROWS",bulkUnit:"Lot"},
 "MR-0002":{doc:"MM-ZTK-1F-GEN-TEL-MR-0002 Rev.C1",revision:"C1",
  sourceUrl:"https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view",
  pages:"10–11/31",requirement:"DMR Bulk Material 1 Lot/platform: fire-resistant coaxial, Ethernet, glands, grounding",
  authority:"MR0002_C1_SCOPE_1LOT_SITE",bulkUnit:"Lot"},
 "MR-0003":{doc:"MM-ZTK-1F-GEN-TEL-MR-0003 Rev.C1",revision:"C1",
  sourceUrl:"https://drive.google.com/file/d/1RYFm75mMuLr5brbXjLNu8UWIDUptRP-Q/view",
  pages:"10–11/30",requirement:"Ex phone/sounder/JB 1 System/site, special cable if required; NO distinct BULK lot",
  authority:"MR0003_C1_SYSTEM_SPECIAL_CABLE_CONDITIONAL",bulkUnit:null},
 "MR-0004":{doc:"MM-ZTK-1F-GEN-TEL-MR-0004 Rev.C1",revision:"C1",
  sourceUrl:"https://drive.google.com/file/d/17oOEMjDVQy3PgOQYbPYyXyaxk3P_rrNC/view",
  pages:"10/30",requirement:"RACON 1 Set/platform plus Bulk Adapter and Charging Kit 1 Set PER PHASE (shared)",
  authority:"MR0004_C1_PHASE_SHARED_KIT",bulkUnit:"Set per Phase"}
});
const REQUIRED_ITEMS=Object.freeze({
 "MR-0001":["ODU_CAT6A","PANEL_M20","RF_JUMPER","RF_SURGE","EARTH","MCT-PENETRATION"],
 "MR-0002":["DMR-MR-C1-BULK-LOT","FEEDER-KIT","FEEDER-CONNECTORS","BDA-RF-PORTS","BDA-EX-GLANDS","BDA-GROUND","ADDVALUE-NEK-FIELD-FEEDER"],
 "MR-0003":["PHONE-SPECIAL-CABLE-C1","PHONE-SET","PHONE-VOIP-CABLE","PHONE-SOUNDER-CABLE","PHONE-UPLINK","PHONE-EX-GLANDS"],
 "MR-0004":["RACON-PHASE-ADAPTER-CHARGER","RACON-SET","RACON-DB5P","RACON-EX-CONTROL","RACON-GLANDS","RACON-EARTH"]
});
const ORIGIN_BULK=ORIGINAL_MTO.itemRows.filter(x=>String(x.sourcePartText||"").trim().toUpperCase()==="BULK MATERIAL");
const SOURCE_ROW_BY_SITE=Object.fromEntries(ORIGIN_BULK.map(x=>[x.platform,x]));
const normativeId=(group)=>"bid.budget.bom."+group.site.toLowerCase()+"."+
 group.mr.toLowerCase().replace("-","")+".bulk.source-to-release";
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
export function deriveBulkSourceToReleaseTrace0553({releaseModel=null}={}){
 const coverage=deriveBulkMrLocationCoverage0553();
 const cableEnds=derivePhysicalCableEndRegister0553();
 const rfRoutesBySite=Object.fromEntries(deriveMR0002RfPhysicalRouteReconciliation0553().sites.map(x=>[x.site,x]));
 const working=Object.fromEntries(Object.keys(MR_TO_CUSTOMER).map(mr=>
  [mr,selectWorkingBomProjection0553({mr})]));
 const source=ORIGIN_BULK;
 if(source.length!==7||new Set(source.map(x=>x.platform)).size!==7)
  throw Error("MR0001 source BULK must have seven unique MTO 1-Lot entries");
 const groups=coverage.groups.filter(g=>g.active).map(g=>{
  const base=SOURCE_REFS[g.mr];
  const src=g.mr==="MR-0001"?SOURCE_ROW_BY_SITE[g.site]:null;
  if(!base)throw Error("BULK MR source missing "+g.mr);
  if(g.mr==="MR-0001"&&(src?.sourceRowIndex!==g.sourceMtoRow||
     src?.sourceQty!==1||src?.sourceUnit!=="Lot"||
     !/TC-0001 Items 7.?8/i.test(src.sourceDescription||"")))
   throw Error("MR0001 MTO source BULK location/TC reference inconsistent: "+g.site);
  const ids=new Set(g.items.map(x=>x.id));
  const missingRequired=REQUIRED_ITEMS[g.mr].filter(x=>!ids.has(x));
  if(missingRequired.length)throw Error(g.site+" "+g.mr+" missing required BULK function "+missingRequired.join(", "));
  const phaseKit=g.items.find(x=>x.id==="RACON-PHASE-ADAPTER-CHARGER");
  if(g.mr==="MR-0004"&&(phaseKit?.phaseRequiredQty!==1||
     phaseKit?.phaseSharedRequirementId!=="MR0004-RACON-ADAPTER-CHARGING-ONE-PHASE"||
     phaseKit.purchaseQty!==null||phaseKit.siteAllocatedQty!==null))
   throw Error("MR0004 requires ONE shared phase adapter/charging kit; not three per-site purchases");
  const pricedSourceCost=g.mr==="MR-0001"?g.bookedA5THB:null;
  const inspected=working[g.mr].lines.filter(x=>x.site===g.site);
  const countedWorking=inspected.filter(x=>x.counted);
  const expectedPriceRow=releaseModel?.a?.find(x=>x.mr===g.mr);
  const sourceComplianceGates={
   "MR-0001":["TC0001_7_8_FIRE_RATING_CLIENT_REPLY_UNVERIFIED","AFC_CABLE_END_ROUTES_AND_GLAND_OD_OPEN","SUPPLIER_INSTALLED_BULK_INCLUSION_OPEN"],
   "MR-0002":["AFC_LAY_TCAB508_ROLE_SITE_SPECIFIC_VERIFIED","MGW_BDA_REPLACES_AFC_LNA__UPDATED_GA_BLD_EX_DEVIATION_HOLD","MGW_FORLLER_IEC60331_AND_EX_CERT_OPEN","RF_RUNS_AND_CONNECTORS_UNMEASURED","NEK_INSTALLATION_SPARE_SEPARATE_NOT_APPROVED"],
   "MR-0003":["PHONE_SOUND_DC_POE_TERMINATION_UNVERIFIED","EX_WAROM_GLAND_INCLUDED_CREDIT_AND_OD_UNVERIFIED","SPECIAL_CABLE_IF_REQUIRED_NOT_DERIVED"],
   "MR-0004":["ADAPTER_CHARGING_KIT_ONE_PER_PHASE_VENDOR_PRICE_OPEN","RACON_CONTROL_BOX_AND_PROGRAMMING_INCLUSION_OPEN","RACON_POWER_ALARM_CABLE_END_AND_EX_GLAND_UNVERIFIED"]
  }[g.mr];
  const unverifiedItems=g.items.filter(x=>!x.approvedProcurement&&x.state!=="VENDOR_INCLUDED");
  return Object.freeze({
   id:g.site+"-"+g.mr,site:g.site,mr:g.mr,customerLine:MR_TO_CUSTOMER[g.mr],
   moduleId:normativeId(g),sourceModuleId:g.moduleId,sourceDocument:base.doc,
   sourceRevision:base.revision,sourceUrl:base.sourceUrl||null,sourcePages:base.pages||null,
   sourceAuthority:base.authority,sourceRequirement:base.requirement,
   sourceMtoRow:g.mr==="MR-0001"?src.sourceRowIndex:null,
   sourceMtoDescription:src?.sourceDescription||null,
   sourceLotQty:g.mr==="MR-0001"||g.mr==="MR-0002"?1:null,
   sourceLotUnit:base.bulkUnit,sourceLotIsMaterialBreakdown:false,
   mr0003SystemQty:g.mr==="MR-0003"?1:null,
   mr0004PhaseSharedQty:g.mr==="MR-0004"?1:null,
   mr0004SiteAllocatedPhaseKitQty:null,
   afcLayoutDrawing:g.site.startsWith("ZWP2")?"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1":null,
   afcBlockDrawing:g.site.startsWith("ZWP2")||g.site==="ZWP8"?"MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev.C1":null,
   internalSchematic:{document:"MM-ZTK-1F-GEN-SCADA-TEL-DWG-0001 Rev00",
    role:"INTERNAL_ENGINEERING_CROSSCHECK_ONLY",pricingAuthority:false,measuredCableLengthAuthority:false},
   mr0002OriginalAfcLnaTag:g.mr==="MR-0002"?rfRoutesBySite[g.site]?.afcLnaEnclosureTag:null,
   mr0002OriginalAfcSurgeTag:g.mr==="MR-0002"?rfRoutesBySite[g.site]?.afcSurgeEnclosureTag:null,
   mr0002SelectedBdaAfcApproved:g.mr==="MR-0002"?false:null,
   physicalCableEndModuleId:"bid.budget.bom.physical-cable-end-register",
   functionalCableEndCandidates:cableEnds.lines.filter(x=>x.site===g.site&&x.mr===g.mr).length,
   bdaDeviationSource:g.mr==="MR-0002"?"5-Deviation List Rev00.xlsx / row 13":null,
   bdaDeviationOpen:g.mr==="MR-0002"?true:null,
   proposedServiceAntennaElevationM:g.mr==="MR-0002"?18.3:null,
   itemCount:g.items.length,requiredFunctionCount:REQUIRED_ITEMS[g.mr].length,
   missingRequiredFunctionIds:missingRequired,
   knownSourceFloorTHB:pricedSourceCost,
   bookedCostAlreadyInPartA:pricedSourceCost!==null,
   sourcePriceClass:g.mr==="MR-0001"?"PARTIAL_A5_RECLASS_IN_SOURCE_MR0001__NON_ADDITIVE":
    "WORKING_CANONICAL_A_"+g.mr.slice(-1)+"_NO_NEW_BULK_BOOKING",
   workingSourceModuleId:"bid.budget.bom.system-location-mto",
   releaseSourceModuleId:"bid.budget.pricing.release",
   selectedQuoteId:g.mr==="MR-0001"?null:MGW.id,
   selectedQuoteScopeConfirmed:g.mr==="MR-0001"?null:false,
   countedWorkingLines:countedWorking.length,
   workingAmountByCurrency:Object.freeze(countedWorking.reduce((x,v)=>{
    if(v.currency&&Number.isFinite(v.extended))x[v.currency]=round2((x[v.currency]||0)+v.extended);
    return x;
   },{})),
   releasePart:expectedPriceRow?.code||MR_TO_CUSTOMER[g.mr],
   releasePartPreviewSellTHB:Number.isFinite(expectedPriceRow?.previewSellTHB)?expectedPriceRow.previewSellTHB:null,
   releasePartCostComplete:Boolean(expectedPriceRow?.costComplete),
   openMaterialEvidenceCount:unverifiedItems.length,
   openEvidenceGates:Object.freeze(sourceComplianceGates),
   sourceLinked:true,physicalTakeoffApproved:false,
   pricedComplete:false,installationComplianceApproved:false,
   conditionalAllowanceApproved:false,
   sourceToReleaseReady:false,customerReleaseAllowed:false,
   additionalPostingTHB:0,releasePriceMutationAllowed:false,
   latestEvidenceStatus:"SOURCE_KNOWN__ENGINEERING_BULK_COMPLETENESS_HOLD"
  });
 });
 const groupedCount=Object.fromEntries(Object.keys(MR_TO_CUSTOMER).map(mr=>[mr,groups.filter(g=>g.mr===mr).length]));
 if(groupedCount["MR-0001"]!==7||groupedCount["MR-0002"]!==3||
    groupedCount["MR-0003"]!==4||groupedCount["MR-0004"]!==3)
  throw Error("BULK MR/Location scope totals not 7+3+4+3");
 const raconPhase=new Set(groups.filter(g=>g.mr==="MR-0004").map(g=>
  g.mr0004PhaseSharedQty===1?"MR0004-RACON-ADAPTER-CHARGING-ONE-PHASE":"INVALID"));
 if(raconPhase.size!==1||!raconPhase.has("MR0004-RACON-ADAPTER-CHARGING-ONE-PHASE"))
  throw Error("MR0004 one-phase adapter/charging-kit source scope lost");
 return Object.freeze({
  moduleId:"bid.budget.bom.bulk-source-to-release",
  releaseModuleId:"bid.budget.pricing.release.bulk-source-audit",
  scopeSlots:coverage.groups.length,applicable:groups.length,
  scopeByMR:Object.freeze(groupedCount),originalMR0001SourceRows:source.map(x=>({
   site:x.platform,row:x.sourceRowIndex,qty:x.sourceQty,unit:x.sourceUnit
  })),
  groups,sourceMR0004PhaseKitQty:1,sourceMR0004PhaseKitSitePurchaseQty:null,
  physicalCableEndModuleId:cableEnds.modelId,
  totalFunctionalCandidates:cableEnds.registeredFunctionalCandidates,
  originalA5PartialTHB:coverage.originalA5BookedTHB,
  additionalPostingTHB:0,workingSellChanged:false,releasePriceChanged:false,
  fullMaterialQuantityPriceReady:false,sourceToReleaseReady:false,releaseAllowed:false,
  missingApprovalPolicy:"NEVER infer procured SKU, measured cable length, approved price, Ex/fire compliance or vendor kit inclusion from 1 Lot or historical quote",
  conditions:["MR0001 original 7 MTO BULK lot rows remain source-cost partial only",
   "MR0002 full MGW complete RF scope remains MGW; NEK is ADDVALUE optional unbooked spare",
   "MR0003 special cable is conditional within 1 system/site; no fake separate Bulk MTO lot",
   "MR0004 adapter/charging kit is ONE shared kit per project phase, not per WP",
   "10.3 and 10.5 consume existing canonical 10.1/10.2 data; this audit never posts a new price"]
 });
}
