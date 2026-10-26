// PJ2608-0553 | Correct requirement-driven B10 selection method.
// One kit/platform is a CONTRACTUAL DELIVERY PACKAGE, not a spare SKU/quantity.
// Only applicable Annex-8 equipment rules may use 10%; never multiply all A1
// required-BOM units by 10% or treat ODU/IDU/Cisco installed Qty as spare Qty.
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {selectB10ItemizedPurchaseEvidence0553} from "./b10ItemizedPurchaseEvidence0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
const frozen=Object.freeze;
const STAGES=frozen(["ERECTION","PRE_COMMISSIONING","COMMISSIONING","START_UP"]);
const RULES=frozen({
 "B10-PTTEP-01-F01":{stages:["PRE_COMMISSIONING","START_UP"],decision:"OEM_REPLACEABLE_PART_AND_RATING_CHECK",tag:["LAN-502-001","MR-502-001A"],why:"Protection fuse only where fuse ratings and replaceability are shown by installed PSU/switch manual"},
 "B10-PTTEP-01-F02":{stages:["PRE_COMMISSIONING","COMMISSIONING","START_UP"],decision:"OEM_REPLACEABLE_POWER_MODULE_CHECK",tag:["MR-502-001A","LAN-502-001"],why:"PoE/DC injector can recover a failed power feed only if exact 24V/PoE and Ex interface matches selected equipment"},
 "B10-PTTEP-01-F03":{stages:["PRE_COMMISSIONING","COMMISSIONING"],decision:"FIELD_REPLACEABLE_SURGE_PROOF",tag:["SA-502-001"],why:"Independent Ethernet surge arrester may need replacement after wiring inspection or SAT fault, subject to certified type"},
 "B10-PTTEP-01-F04":{stages:["COMMISSIONING","START_UP"],decision:"INSTALLED_RF_INTERFACE_AND_OEM_PROOF",tag:["MR-502-001","ANT-502-001"],why:"RF filter/surge service spare requires identical band/connector/Ex rating; quoted RF filter is only a candidate"},
 "B10-PTTEP-02-F01":{stages:["COMMISSIONING","START_UP"],decision:"RFI_WAROM_EX_ASSEMBLY_OEM_PROOF",tag:[],why:"Spare RF surge/coupler only if independently replaceable from the installed BDA package"},
 "B10-PTTEP-02-F02":{stages:["ERECTION","PRE_COMMISSIONING"],decision:"RF_TERMINATION_SPARE_SCOPE_CHECK",tag:[],why:"Separate connector/feeder termination for rework, net of Part A installed bulk"},
 "B10-PTTEP-02-F03":{stages:["ERECTION","START_UP"],decision:"CERTIFIED_EX_SEAL_AND_INCLUDED_STOCK_CHECK",tag:[],why:"Service gasket/seal/entry must match WAROM enclosure certification, not duplicate included fittings"},
 "B10-PTTEP-03-F01":{stages:["COMMISSIONING","START_UP"],decision:"GAI_HANDSET_FIELD_SERVICE_PROOF",tag:[],why:"Telephone handset/cord service spare must be explicitly OEM field replaceable and Ex compatible"},
 "B10-PTTEP-03-F02":{stages:["COMMISSIONING","START_UP"],decision:"EX_SOUNDER_MODULE_RATING_PROOF",tag:[],why:"Sounder service part, terminal/driver only when OEM-rated spare; not another complete Part A sounder by default"},
 "B10-PTTEP-03-F03":{stages:["ERECTION","PRE_COMMISSIONING"],decision:"M20_GLANDLEAK_SEAL_AND_BULK_OWNER_CHECK",tag:[],why:"Extra certified cable entry/gland/stop plug required for installation loss/rework beyond the included Ex JB bill"},
 "B10-PTTEP-03-F04":{stages:["ERECTION","PRE_COMMISSIONING"],decision:"B13_VS_B10_CONSUMPTION_SCOPE_HOLD",tag:[],why:"CAT6A/RJ45 re-termination consumed during installation may belong to B13/A5, not automatically B10 spare stock"},
 "B10-PTTEP-04-F01":{stages:["PRE_COMMISSIONING","START_UP"],decision:"RACON_FUSE_RATING_AND_SERVICE_MANUAL_CHECK",tag:[],why:"RACON protection fuse subject to OEM power/control box design"},
 "B10-PTTEP-04-F02":{stages:["ERECTION","START_UP"],decision:"RACON_EX_BOX_GASKET_SPEC_PROOF",tag:[],why:"Replacement gasket if enclosure opened during assembly/troubleshooting; retain Ex certification"},
 "B10-PTTEP-04-F03":{stages:["ERECTION","PRE_COMMISSIONING"],decision:"RACON_EX_ENTRY_INCLUDED_MATERIAL_CREDIT",tag:[],why:"Certified spare gland/seal/entry net of vendor-included assemblies"}
});
export function selectB10StageSpareSelection0553(){
 const bom=MR0001_WORKING_PRICED_BOM,spare=selectB10ItemizedPurchaseEvidence0553(),schedule=selectSpareCustomerSchedule0553();
 const requiredZwp20=["MR-502-001","MR-502-001A","ANT-502-001","LAN-502-001","DATO-507-001","TCAB-500-001","SA-502-001"];
 const zwp20=bom.items.filter(x=>x.site==="ZWP20");
 for(const tag of requiredZwp20)if(!zwp20.some(x=>x.sourceTag===tag&&x.sourceScopeQty===1))
  throw Error("0553 ZWP20 A1 installed required-BOM basis changed: "+tag);
 if(!zwp20.some(x=>x.sourceTag==="Bulk Material"&&x.sourceScopeUnit==="Lot"))
  throw Error("0553 ZWP20 original installed bulk source missing");
 if(zwp20.find(x=>x.sourceTag==="MR-502-001")?.sourceRow!==4)
  throw Error("0553 ZWP20 MR-502-001 original row/source module 4 changed");
 const kits=schedule.currentByCode.B10;
 if(kits.length!==4||kits.some((x,i)=>x.qty!==[4,3,4,3][i]))
  throw Error("0553 four MR contractual B10 kit minimums changed");
 const stageRows=spare.requirementArticleRows.map(f=>{
  const rule=RULES[f.id];if(!rule)throw Error("MR Attachment 5 B10 screening function not mapped: "+f.id);
  const parent=kits.find(x=>x.id===f.parentB10PriceId);
  const installedTags=f.actualInstalledTagCandidates||[];
  const tags=f.mr==="MR-0001"?
   frozen([...new Set([...installedTags,...rule.tag.filter(t=>zwp20.some(x=>x.sourceTag===t)).map(t=>"ZWP20 / "+t)])]):
   frozen([...installedTags]);
  return frozen({
   id:f.id,mr:f.mr,parentSourceId:f.parentB10PriceId,
   sourceRowModuleId:parent.sourceRowModuleId,traceId:parent.traceId,
   requirementFunction:f.articleFunction,
   installedEquipmentTagCandidates:tags,
   quotedSupplierSpareRows:f.skuCandidateQuoteIds,
   projectSites:frozen([...parent.linkedLocations]),
   commissioningKitSets:parent.qty,
   phaseApplicability:frozen(rule.stages),
   provisionalSelection:"ENGINEERING_SCREENING_CANDIDATE_NOT_CONFIRMED_PURCHASE",
   validationRule:rule.decision,engineeringJustification:rule.why,
   replacementSku:null,physicalSpareQty:null,unitSpareSellUSD:null,ddpOrCifRateVerified:false,
   oemInterchangeabilityVerified:false,contractAnnex8PercentageApplicable:null,
   annex8Proof:"Annex-8 Attachment-1 minimum applies ONLY if listed Equipment category/rating matches installed part; PLC Based SCADA is not WiMAX SCADA Radio",
   docTrace:frozen(["MR0001–0004 §5/Attachment 5","MR0001 Attachment 4 para.7",
    "SPE0001 Rev.C2 §8.1","Relevant DTS C1","EXA-A8 Attachment 1 equipment-specific check"]),
   noDoubleCount:"A installed equipment/A5 bulks; B13 consumables; C1 capital; C2 two-year (Attachment 7 instruction 6)",
   commercialReleaseAllowed:false
  });
 });
 if(stageRows.length!==14||Object.keys(RULES).length!==14)throw Error("B10 screening inventory changed");
 return frozen({
  moduleId:"bid.budget.working.bc.b10.stage-spare-selection",
  upstreamInstalledBomModule:"bid.budget.bom.zwp20.mr-502-001.4.required-bom",
  originalMtoRevision:bom.source,
  originalZwp20RequiredBom:frozen(zwp20.map(x=>frozen({tag:x.sourceTag,description:x.description,installedQty:x.sourceScopeQty,
   unit:x.sourceScopeUnit,sourceRow:x.sourceRow,site:x.site}))),
  commissioningSiteKits:frozen(kits.map(x=>frozen({mr:x.linkedMR[0],sites:frozen([...x.linkedLocations]),kits:x.qty,sourceId:x.id,sourceRowModuleId:x.sourceRowModuleId}))),
  phases:STAGES,stageRows:frozen(stageRows),
  completePhysicalSpareSkuCount:0,actualSparePurchaseQtyVerifiedCount:0,
  documentarySourceBasis:"MR0001 Rev.C1 §5 Table5; Attachment4/5; SPE0001 §8.1; EXA-A8 Att1; MR Attachment7 excludes B10 from C2",
  criticalSeparation:"One commissioning KIT per platform is required (4/3/4/3 by MR). This does NOT prove one spare of every installed Part A unit, nor a blanket 10% rule.",
  exhibitVersionConflict:"SPE references MMC23-5025; supplied Exhibit is MMC25-5001; authority pending",
  priceOwnerUnchanged:true,postingAllowed:false,customerReleaseAllowed:false
 });
}
