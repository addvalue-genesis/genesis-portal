// PJ2608-0553 / 10.2 B8 — 4-system, 8-trainee, 2-day HYBRID ON-SITE training.
// One ADDVALUE Sr Telecom Engineer is physically onsite for supervised hands-on
// demonstration; four OEM discipline instructors may teach remotely (each 0.5 day).
// PRE-AWARD WORKING SELL allowance; not a supplier quotation or verified direct cost.
// Venue/dates (China vs BOD Yangon), remote OEM teaching price and ITP sequence OPEN.
// Separate-trip costs included conservatively ONCE; possible shared B3/B9 trip
// credits stay NONPOSTING until calendar/expense owner and travel are confirmed.
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
 f({key:"onsite",name:"Onsite Facilitation / Preparation / Travel-day Labour",items:f([
  f({id:"SR-ONSITE",activity:"Senior Telecom Systems Integration Engineer — onsite practical facilitator",qty:2,unit:"person-day",usdUnit:700}),
  f({id:"SR-PREP",activity:"Four-system OEM coordination, material/configuration checks and video rehearsal",qty:1,unit:"person-day",usdUnit:700}),
  f({id:"SR-MOB",activity:"Senior Telecom Engineer mobilisation/demobilisation labour — separate-trip reserve",qty:2,unit:"person-day",usdUnit:700,sharedTripReconciliation:true})
 ])}),
 f({key:"oem",name:"Four OEM Remote Instructor Sessions",items:f([
  ...systems.map(s=>f({id:s.mr+"-ONLINE",activity:s.mr+" — "+s.name+" OEM remote instructor (4-hour interactive class)",mr:s.mr,qty:1,unit:"half-day online session",usdUnit:400,oemFeeNotQuoted:true}))
 ])}),
 f({key:"materials",name:"Training Materials & AV Connectivity",items:f([
  f({id:"TRAINING-PACK",activity:"Four discipline training packs, handouts, exercise checklist, attendee register and assessment for eight people",qty:4,unit:"system training pack",thbUnit:2500}),
  f({id:"VIDEO-CONNECT",activity:"Onsite audio/video, conferencing, connection test and support allowance",qty:1,unit:"two-day session allowance",thbUnit:5000})
 ])}),
 f({key:"travel",name:"Separate Onsite Trip — Cash Expense Allowance",items:f([
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
    workingSellTHB:round(item.qty*unitRateTHB),workingCostTHB:null,actualDirectCostTHB:null,
    costOwner:"WS-B8",postingClass:"ATTRIBUTION_TO_SINGLE_SELECTED_B8_1LS",
    verifiedSourceRate:item.oemFeeNotQuoted?"PARAMETRIC_OEM_REMOTE_SESSION_ALLOWANCE_NOT_VENDOR_QUOTE":
     "PRE_AWARD_RESOURCE_WORKING_SELL_OR_EXPENSE_ALLOWANCE",
    customerLineAllowed:false});
  }));
  const subtotal=round(lines.reduce((sum,x)=>sum+x.workingSellTHB,0));
  return f({key:group.key,name:group.name,id:ROOT+".group."+String(i+1).padStart(2,"0"),
   rows:lines,workingSellTHB:subtotal,independentPostingAllowed:false});
 }));
 const total=round(groups.reduce((sum,g)=>sum+g.workingSellTHB,0));
 const counted=groups.flatMap(g=>g.rows), sharedTripPotential=round(counted.filter(x=>x.sharedTripReconciliation).reduce((s,x)=>s+x.workingSellTHB,0));
 if(total!==216650||groups.map(g=>g.workingSellTHB).join("|")!=="110250|50400|15000|41000"||
  sharedTripPotential!==85100||counted.length!==14||
  fx!==31.5||seniorUSD!==700||
  new Set(counted.map(x=>x.id)).size!==counted.length||
  (workingRow!==null&&(workingRow.workingSellTHB!==total||workingRow.directCostTHB!==null)))
  throw Error("B8 4-system hybrid training source/price identity diverged");
 return f({
  moduleId:ROOT,ownerModuleId:"bid.budget.working.bc.b8",
  code:"B8",systems,trainees:8,systemsCount:4,onsiteTrainingDays:2,
  onsiteContactHours:16,onsitePaidSeniorCount:1,onsiteFieldCount:0,
  trainingMode:"ON_SITE_HANDS_ON_WITH_REMOTE_OEM_DISCIPLINE_INSTRUCTORS",
  assumedBudgetaryVenue:"JUTAL Zhuhai Yard, China — subject to JUTAL written acceptance; BOD Yangon location remains OPEN",
  alternateMode:"FULL_OEM_ONSITE_INSTRUCTOR__UNQUOTED_NONPOSTING",
  originalRev05WorkingSellReferenceTHB:30000,originalRev05TrainingMH:44,
  groups,pricedRows:counted.length,selectedWorkingSellTHB:total,
  selectedTripExpenseBasis:"ONE_INDEPENDENT_ONSITE_CHINA_TRIP_PLANNING_RESERVE__NOT_VERIFIED",
  possibleSharedB3B9TripCreditTHB:sharedTripPotential,
  sharedTripCreditAllowed:false,unverifiedTripCashIncludedOnce:true,
  oemRemoteSessionsVendorConfirmed:false,onsiteVenueApproved:false,
  trainingBeforeFATApproved:false,trainingDeliveryReportApproved:false,
  instructorCashExpenseVerified:false,actualDirectCostTHB:null,verifiedWorkingCostTHB:null,
  customerReleaseAllowed:false,additionalCustomerLineAllowed:false,
  workingSellId:"WS-B8",customerProposalId:"CP-B8",scopeId:"SOW-B8",
  gates:f([
   "Confirm purchaser-approved venue and OEM-led remote instruction; historic BOD training venue Yangon and pre-FAT timing must not be silently overridden",
   "Four manufacturer disciplines × four-hour remote fee USD400 each is a PARAMETRIC allowance, NOT a vendor quotation",
   "One onsite Senior runs demonstration, Q&A, records attendance of eight people, four system training packs and assessment",
   "Confirm whether the actual two-day onsite session overlaps existing B3 China FAT or B9 Yard deployment; only then remove distinct travel/insurance cash and labour without double posting",
   "Source Rev05 THB30000 / 44 MH is superseded as Working SELL but remains historical audit; no payroll or OEM paid direct cost has been established",
   "Training must be onsite for end users even where OEM instructor appears online; fully remote delivery alone is not selected"
  ])
 });
}
