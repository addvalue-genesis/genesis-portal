// ZWP8 grouped-row 43 quote-rate worksheet. No inferred site allocation or OEM approval.
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
const source=MTO.itemRows.find(r=>r.platform==="ZWP8"&&r.sourceRowIndex===43);
const lines=new Map(NEXTG.lines.map(q=>[q.code,q]));
const families={
 "MR-502-003":{role:"PTMP BASE Radio ODU — ZWP20 and ZWP22",codes:["A-1","A-2","A-4","A-5"]},
 "MR-502-003A":{role:"PTMP BASE IDU Power Interface ONLY — additional integrated IDU proof required",codes:["A-6","A-7"]},
 "ANT-502-002":{role:"PTMP 90-degree SECTOR antenna shared by ZWP20 / ZWP22",codes:["A-12"]},
 "MR-502-004":{role:"PTP Additional-Link Endpoint ODU candidate — EXISTING ZPQ/ZWP8 LINK PRESERVED",codes:["B-1","B-2","B-3","B-5"]},
 "MR-502-004A":{role:"PTP Additional-Link IDU Power Interface ONLY — complete IDU proof required",codes:["B-6","B-7"]},
 "ANT-502-003":{role:"PTP Additional-Link 4ft parabolic antenna — existing link not replaced",codes:["B-11","B-12"]}
};
if(!source||source.sourceItemCodes.length!==6)throw Error("ZWP8 source row 43 must have six codes");
const quoteUnit=code=>{
 const x=lines.get(code);
 return x&&Number.isFinite(x.unitPrice)?x.unitPrice:null;
};
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const priced=(codes)=>codes.every(code=>quoteUnit(code)!==null)?
 round(codes.reduce((sum,code)=>sum+quoteUnit(code),0)):null;
// Exactly one cost owner per RF function. B-8 and A-8 are allocated to SA tags
// on source row 45, never doubled into the radio ODU. No cable-gland takeoff here.
const ownerCodes={
 "MR-502-003":["A-1","A-2","A-4","A-5"],
 "MR-502-003A":["A-6","A-7"],
 "ANT-502-002":["A-12"],
 "MR-502-004":["B-1","B-2","B-3","B-5"],
 "MR-502-004A":["B-6","B-7"],
 "ANT-502-003":["B-12"]
};
const ownerCosts=Object.fromEntries(Object.entries(ownerCodes).map(([tag,codes])=>[tag,priced(codes)]));
const workingEquipmentUSD=Object.values(ownerCosts).every(Number.isFinite)?
 round(Object.values(ownerCosts).reduce((a,b)=>a+b,0)):null;
// Archival diagnostic ONLY; never used to post a new TAG.
const legacyRadioCodes=["B-1","B-2","B-3","B-5","B-6","B-7","B-8"];
const legacyRadioRate=priced(legacyRadioCodes);
const referenceScenarios=[{
 id:"ZWP8-ROW43-AFC-ROLE-SPLIT",currency:"USD",
 assumedRadioAssemblies:2,assumedAntennas:2,
 radioCodes:legacyRadioCodes,radioAssemblyUnitUSD:legacyRadioRate,
 antennaLabel:"PTMP SECTOR 90° + PTP PARABOLIC 4FT",
 antennaQuoteLine:"A-12 / B-12",
 preferredOwnerCodes:ownerCodes,preferredOwnerCostsUSD:ownerCosts,
 partialEquipmentUSD:workingEquipmentUSD,
 assumption:"ONE new PTMP Base+90° sector to serve ZWP20/22; ONE additional PTP endpoint candidate at ZWP8 while the existing ZPQ-ZWP8 link is retained",
 excluded:"REGION A-3/B-4 prices NULL; OEM/AFC RF pattern gain, throughput, GPS/A-11 choice, complete IDU function and contract acceptance remain OPEN",
 state:"BUDGETARY_PARTIAL__AFC_ROLE_ALIGNED__OEM_NOT_APPROVED"
}];

export const ZWP8_ROW43_COST_TRACE=Object.freeze({
 site:"ZWP8",mr:"MR-0001",sourceRow:43,sourceQtyText:source.sourceQuantityText,
 sourceRevision:"MTO Rev04",quote:NEXTG.quoteNumber,
 items:source.sourceItemCodes.map((tag,i)=>({
  id:"PJ2608-0553 / bid.budget.bom.zwp8."+tag.toLowerCase()+".43",
  tag,role:families[tag].role,sourceScopeText:source.sourceQuantityText.split("\n")[i]||null,
  sourceQty:1,sourceUnit:"Set",physicalQty:null,selectedSKU:null,selectedRate:null,
  candidates:families[tag].codes.map(code=>lines.get(code)).filter(Boolean).map(q=>({
   quoteLine:q.code,sku:q.partNumber,quoteQty:q.qty,unitPriceUSD:q.unitPrice,
   quotedExtendedUSD:q.quotedTotal,pricingState:q.pricingState
  })),
  provisionalExtendedUSD:null,verifiedExtendedUSD:null,
  decision:tag.endsWith("A")?"Determine whether IDU is integrated or separately supplied; never double count":"Verify RF topology, antenna dimensions, capacity, included accessories and site ownership",
  state:"REQUIRES_ENGINEERING_ALLOCATION"
 })),
 quotedTotalUSD:NEXTG.quotedGrandTotal,allocatedSiteTotalUSD:null,
 ownerCodes,ownerCosts,legacyAudit:{radioCodes:legacyRadioCodes,radioUnitUSD:legacyRadioRate,legacyPreferredTotalUSD:round(2*legacyRadioRate+2*quoteUnit("B-12"))},
 preferredBudgetaryAntenna:"PTMP-90-DEG-SECTOR_AND_PTP-4FT",preferredScenarioId:"ZWP8-ROW43-AFC-ROLE-SPLIT",
 preferenceBasis:"SPE-0001 C2 §6.1.3, BOD-0001 C2 §7.2 and BLD-0001 C1 identify PTMP base/sector 90° and added PTP link. RPT C1 uses sector 60° so OEM RF pattern/availability remains UNVERIFIED; existing PTP baseline is not replaced.",
 referenceScenarios,
 caution:"Quote group quantities are global, not per-ZWP8 site. This is a role-aligned working budget only; existing PTP connection retained, and A-3/B-4 country licence NULL. Cable gland counts are explicitly OUT OF SCOPE."
});
