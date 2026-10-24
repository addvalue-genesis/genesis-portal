// Four-system training at SAMTEL: 8 trainees, 16 hours, 6 product-family slots.
// ADDVALUE onsite + provisional OEM remote instruction; selected Working SELL, not verified cost.
// Shared instruments charged once in B3. Historical foreign travel remains excluded without a second credit.
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
const ROOT="bid.budget.working.bc.b8.hybrid-training";
const f=Object.freeze;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const rate=ONSHORE_WORKING_SELL_RATE_0553;
const fx=rate.thbPerUsd;
const seniorUSD=rate.roleRates.seniorTelecomEngineerUSDPerPersonDay;
const systems=f([
 f({mr:"MR0001",name:"SCADA / WiMAX / Ethernet Network",day:1,slot:"Morning",hours:4}),
 f({mr:"MR0002",name:"DMR Trunk Radio / BDA",day:1,slot:"Afternoon",hours:4}),
 f({mr:"MR0003",name:"EX Telephone / Sounder",day:2,slot:"Morning",hours:4}),
 f({mr:"MR0004",name:"RACON",day:2,slot:"Afternoon",hours:4})
]);
const def=f([
 f({key:"onsite",name:"Onsite Teaching / Content Preparation · Separate Days from B3",items:f([
  f({id:"SR-ONSITE",activity:"Senior Telecom Systems Integration Engineer — onsite practical facilitator",qty:2,unit:"person-day",usdUnit:700}),
  f({id:"SR-PREP",activity:"Four-system OEM coordination, material/configuration checks and video rehearsal",qty:1,unit:"person-day",usdUnit:700}),
  f({id:"SR-MOB",activity:"Senior Telecom Engineer mobilisation/demobilisation labour — separate-trip reserve",qty:2,unit:"person-day",usdUnit:700,sharedTripReconciliation:true})
 ])}),
 f({key:"oem",name:"Four OEM Remote Instructor Sessions",items:f([
  ...systems.map(s=>f({id:s.mr+"-ONLINE",activity:s.mr+" — "+s.name+" OEM remote instructor (4-hour interactive class)",mr:s.mr,qty:1,unit:"half-day online session",usdUnit:400,oemFeeNotQuoted:true}))
 ])}),
 f({key:"materials",name:"Training Materials & AV Connectivity",items:f([
  f({id:"TRAINING-CATERING",activity:"Lunch and two breaks for 8 trainees + facilitator + host; separate training days",qty:20,unit:"person-day",thbUnit:550,allowanceOnly:true}),
  f({id:"TRAINING-PACK",activity:"Four discipline training packs, handouts, exercise checklist, attendee register and assessment for eight people",qty:4,unit:"system training pack",thbUnit:2500}),
  f({id:"VIDEO-CONNECT",activity:"Onsite audio/video, conferencing, connection test and support allowance",qty:1,unit:"two-day session allowance",thbUnit:5000}),
  f({id:"MR0002-RFI-DEMO",activity:"ADDVALUE RFI UHF BDA practical demo: RF gain/alarm/configuration; temporary spectrum/attenuator/load/interconnect test setup",mr:"MR0002",qty:1,unit:"budgetary RF training setup allowance",thbUnit:15000,allowanceOnly:true,transferredToB3:true,
    evidence:"RFI BD Series configuration and RF interface data; ADDVALUE test instrument rental/use not quoted; exclude any B3 FAT/B11 tools duplicate"}),
  f({id:"MR0004-RACON-DEMO",activity:"ADDVALUE RACON programming/interface practical demonstration — temporary laptop interface and simulated alarm tests",mr:"MR0004",qty:1,unit:"budgetary RACON demo setup allowance",thbUnit:5000,allowanceOnly:true,transferredToB3:true,
    evidence:"MDS ORGA QTORG2609244 selected installed package includes programming cable; phase adapter/charger equivalence, training rental overlap and actual instructor rates remain unconfirmed"})
 ])}),
 f({key:"travel",name:"Shared B3 FAT Trip — EXCLUDED Duplicate B8 Travel (Audit)",items:f([
  f({id:"AIRFARE",activity:"Return airfare for one onsite facilitator, budgetary",qty:1,unit:"ticket",thbUnit:15000,sharedTripReconciliation:true}),
  f({id:"HOTEL",activity:"Hotel for two-day class and travel, four nights",qty:4,unit:"room-night",thbUnit:2500,sharedTripReconciliation:true}),
  f({id:"LOCAL",activity:"Local transport / airport transfer for one facilitator",qty:1,unit:"trip",thbUnit:5000,sharedTripReconciliation:true}),
  f({id:"VISA",activity:"Work authorization / visa conditional allowance",qty:1,unit:"person",thbUnit:4000,sharedTripReconciliation:true}),
  f({id:"INSURANCE",activity:"Travel + technical-work accident insurance allowance",qty:1,unit:"person-policy",thbUnit:7000,sharedTripReconciliation:true})
 ])})
]);
export function selectB8FourSystemHybridTraining0553(workingRow=null){
 if(workingRow!==null && (workingRow.code!=="B8"||!Number.isFinite(workingRow.workingSellTHB)))
  throw Error("Hybrid training dossier requires canonical WS-B8 if supplied");
 const groups=f(def.map((group,i)=>{
  const lines=f(group.items.map(item=>{
   const unitRateTHB=Number.isFinite(item.usdUnit)?round(item.usdUnit*fx):item.thbUnit;
   return f({...item,id:ROOT+".line."+item.id.toLowerCase(),sourceId:item.id,
    sourceModuleId:ROOT,rateUSDPerUnit:Number.isFinite(item.usdUnit)?item.usdUnit:null,
    fxTHBPerUSD:Number.isFinite(item.usdUnit)?fx:null,unitRateTHB,
    workingSellTHB:item.transferredToB3?0:item.sharedTripReconciliation?null:round(item.qty*unitRateTHB),
    separateTripHistoricalReferenceTHB:item.sharedTripReconciliation?round(item.qty*unitRateTHB):null,
    workingCostTHB:null,actualDirectCostTHB:null,
    costOwner:item.transferredToB3?"WS-B3_SHARED_TEMPORARY_TEST_POOL":item.sharedTripReconciliation?"WS-B3_SHARES_FAT_TRAVEL":"WS-B8",
    postingClass:item.transferredToB3?"TRANSFERRED_TO_B3_NO_B8_POSTING":item.sharedTripReconciliation?
     "EXCLUDED_DUPLICATE_B8_TRIP__EXISTING_B3_FAT_OWNER_ONLY":
     "ATTRIBUTION_TO_SINGLE_SELECTED_B8_1LS",
    verifiedSourceRate:item.oemFeeNotQuoted?"PARAMETRIC_OEM_REMOTE_SESSION_ALLOWANCE_NOT_VENDOR_QUOTE":
     "PRE_AWARD_RESOURCE_WORKING_SELL_OR_EXPENSE_ALLOWANCE",
    customerLineAllowed:false});
  }));
  const subtotal=round(lines.reduce((sum,x)=>sum+(x.workingSellTHB??0),0));
  return f({key:group.key,name:group.name,id:ROOT+".group."+String(i+1).padStart(2,"0"),
   rows:lines,workingSellTHB:subtotal,independentPostingAllowed:false});
 }));
 const total=round(groups.reduce((sum,g)=>sum+g.workingSellTHB,0));
 const counted=groups.flatMap(g=>g.rows);
 const sharedTripDeduplication=round(counted.reduce((s,x)=>s+(x.separateTripHistoricalReferenceTHB??0),0));
 const priced=counted.filter(x=>Number.isFinite(x.workingSellTHB));
 const standaloneReferenceTHB=round(151550+sharedTripDeduplication); // Immutable earlier standalone comparison, before demo transfer/catering.
 if(total!==142550||groups.map(g=>g.workingSellTHB).join("|")!=="66150|50400|26000|0"||
  sharedTripDeduplication!==85100||standaloneReferenceTHB!==236650||
  counted.length!==17||priced.length!==11||
  fx!==31.5||seniorUSD!==700||
  new Set(counted.map(x=>x.id)).size!==counted.length||
  (workingRow!==null&&(workingRow.workingSellTHB!==total||workingRow.directCostTHB!==null)))
  throw Error("B8 4-system hybrid training source/price identity diverged");
 return f({
  moduleId:ROOT,ownerModuleId:"bid.budget.working.bc.b8",
  code:"B8",systems,productCoverage:f([
 {mr:"MR0001",product:"Aviat RF / SCADA",hours:2,onlineFeeTHB:6300,provider:"NextG/OEM support unconfirmed"},
 {mr:"MR0001",product:"Cisco switching / VLAN",hours:2,onlineFeeTHB:6300,provider:"VST/OEM support unconfirmed"},
 {mr:"MR0002",product:"RFI BDA / RF path",hours:4,onlineFeeTHB:12600,provider:"RFI specialist unconfirmed; MGW equipment only"},
 {mr:"MR0003",product:"Gai-Tronics IP telephone",hours:2,onlineFeeTHB:6300,provider:"EXION/OEM specialist unconfirmed"},
 {mr:"MR0003",product:"Eaton DB3B sounder",hours:2,onlineFeeTHB:6300,provider:"EXION/OEM specialist unconfirmed"},
 {mr:"MR0004",product:"ORGA RACON",hours:4,onlineFeeTHB:12600,provider:"MDS/ORGA specialist unconfirmed"}
 ]),trainees:8,systemsCount:4,onsiteTrainingDays:2,
  onsiteContactHours:16,onsitePaidSeniorCount:1,onsiteFieldCount:0,
  trainingMode:"ON_SITE_HANDS_ON_WITH_REMOTE_OEM_DISCIPLINE_INSTRUCTORS",
  assumedBudgetaryVenue:"SAMTEL Warehouse, Thailand — training BEFORE FAT; BOD/SPE Yangon and manufacturer-facility requirements remain deviations to reconcile",
  alternateMode:"FULL_OEM_ONSITE_INSTRUCTOR__UNQUOTED_NONPOSTING",
  onsiteAlternative:f({
   selected:false,postingAllowed:false,specialists:6,
   feeBasis:"Same provisional hourly teaching allowance as online, NOT OEM confirmation; replace online fee, never add it twice",
   extraPerSpecialist:f([
    {activity:"Mobilisation labour",qty:2,rateTHB:18900,amountTHB:37800},
    {activity:"Return travel",qty:1,rateTHB:15000,amountTHB:15000},
    {activity:"Accommodation",qty:4,rateTHB:2500,amountTHB:10000},
    {activity:"Transfers",qty:1,rateTHB:5000,amountTHB:5000},
    {activity:"Work authorisation reserve",qty:1,rateTHB:4000,amountTHB:4000},
    {activity:"Travel/work cover reserve",qty:1,rateTHB:7000,amountTHB:7000}
   ]),
   extraTHB:6*(37800+15000+10000+5000+4000+7000),
   wholeB8IllustrativeTHB:total+6*(37800+15000+10000+5000+4000+7000),
   state:"UNQUOTED_ESTIMATOR_ALTERNATIVE_NOT_IN_SELECTED_TOTAL",
   gate:"Six product specialists conservatively assumed; local/combined supplier instructors may reduce travel. Actual instructor fee, nationality, visa, duration and extra hospitality must be confirmed. No booking or customer acceptance."
  }),
  originalRev05WorkingSellReferenceTHB:30000,originalRev05TrainingMH:44,
  trainingEvidence:Object.freeze({
    raconMdsAlternate:Object.freeze({quoteNo:"QTORG2609244",quoteDate:"2026-09-22",uri:"https://drive.google.com/file/d/1Wjod3tJNvte2Wrc3p0fmj8-9i664pEMW/view?usp=drivesdk",supplier:"MDS/ORGA SELECTED; instructor unquoted",cableIncludedInAlternate:true,laptopIncluded:false,specialToolsDeclaredRequired:false,oemTrainingInstructorPriceTHB:null}),
    rfiBda:Object.freeze({reference:"RFI BD Series UHF BDA technical datasheet",uri:"https://drive.google.com/file/d/1orMpdimoB3vpjyyMDDNnZu2k9YXoGWlb/view?usp=drivesdk",configAndMonitoringInterface:true,rfTestToolsQuoted:false,manufacturerInstructorQuoted:false})
  }),
  groups,pricedRows:priced.length,sourceAuditRows:counted.length,selectedWorkingSellTHB:total,
  selectedTripExpenseBasis:"SAMTEL_LOCAL_TRAINING__HISTORICAL_CHINA_DUPLICATE_ALREADY_EXCLUDED__NO_SECOND_CREDIT",
  standaloneTripPreviousWorkingSellTHB:standaloneReferenceTHB,
  excludedDuplicateTripWorkingSellTHB:sharedTripDeduplication,
  possibleSharedB3B9TripCreditTHB:0, // no SECOND credit; all travel excluded already
  sharedTripDeduplicationApplied:true,unverifiedTripCashIncludedOnce:false,
  onsiteSeniorDayOverlapWithB3Pending:false,
  provisionalTrainingDeliveryOwner:"ADDVALUE",
  rfiRaconPracticalTrainingAllowanceTHB:0,transferredDemoAllowanceTHB:20000,
  permanentRfTestEquipmentPurchased:false,instrumentsCustomerDeliverable:false,
  mgwRfiOnlineInstructorQuotationReceived:false,mgwRaconOnlineInstructorQuotationReceived:false,
  oemRemoteSessionsVendorConfirmed:false,onsiteVenueApproved:false,
  trainingBeforeFATApproved:false,trainingDeliveryReportApproved:false,
  instructorCashExpenseVerified:false,actualDirectCostTHB:null,verifiedWorkingCostTHB:null,
  customerReleaseAllowed:false,additionalCustomerLineAllowed:false,
  workingSellId:"WS-B8",customerProposalId:"CP-B8",scopeId:"SOW-B8",
  gates:f([
   "Confirm purchaser-approved venue and OEM-led remote instruction; historic BOD training venue Yangon and pre-FAT timing must not be silently overridden",
   "ADDVALUE owns onsite training delivery; four remote OEM support sessions at USD400 each are provisional parametric risk allowances, NOT supplier confirmations",
   "Former B8 RFI15000 + RACON5000 transferred to B3 shared temporary setups; B8 posts zero for those stable source IDs; no permanent B11 purchase",
   "Selected MDS/ORGA programming cable is equipment scope; no quoted instructor fee or calibrated simulator supplied for this budget",
   "One onsite Senior runs demonstration, Q&A, records attendance of eight people, four system training packs and assessment",
   "Historical B8 China travel THB85100 was already excluded; relocating to SAMTEL produces NO further B8 deduction",
   "Planned Senior days do not overlap: prior B8 content-preparation day, B3 D1–4, B8 D5–6, B3 D7–14. Actual attendance/calendar still to confirm",
   "Confirm purchaser responsibility for eight attendees travel/accommodation to SAMTEL Warehouse Thailand; attendee transport not budgeted in B8",
   "Source Rev05 THB30000 / 44 MH is superseded as Working SELL but remains historical audit; no payroll or OEM paid direct cost has been established",
   "Training must be onsite for end users even where OEM instructor appears online; fully remote delivery alone is not selected"
  ])
 });
}
