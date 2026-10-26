// PJ2608-0553, B11/B13/C1/C2 priced budgetary draft tied to existing Working
// sources. This is a review projection, NOT approval of an OEM SPIR or DDP quote.
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {REV08_BASELINE} from "./rev08CommercialBaseline";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const frozen=Object.freeze, FX=31.5;
const codes=frozen(["B11","B13","C1","C2"]);
export function selectSparePricedBudgetReview0553(){
 const s=selectSpareCustomerSchedule0553();
 const makeCurrent=(code)=>s.currentByCode[code].map((x,i)=>{
  if(!Number.isFinite(x.qty)||!Number.isFinite(x.unitPriceTHB)||!Number.isFinite(x.extendedTHB))
   throw Error("0553 current Working SELL source missing for "+x.id);
  if(Math.abs(round(x.qty*x.unitPriceTHB)-x.extendedTHB)>0.01)
   throw Error("0553 source Qty×Unit mismatch "+x.id);
  return frozen({
   id:x.id,code,tag:x.tagNo,description:x.displayDescription||x.description,
   specification:x.displaySpecification,materials:x.displayMaterials,
   sourceId:x.id,sourceRowModuleId:x.sourceRowModuleId,traceId:x.traceId,
   quantity:x.qty,unit:x.unit,unitPriceTHB:x.unitPriceTHB,
   extendedTHB:x.extendedTHB,
   evidenceClass:"CURRENT_WORKING_PARAMETRIC_SELL_NOT_OEM_QUOTE",
   sourceDocument:x.evidenceSource,priceSelectedInWorking:true,
   independentlyVerifiedOemSku:false,ddpVerified:false,
   duplicatePhysicalStockCleared:false,customerIssueAllowed:false
  });
 });
 const b11=makeCurrent("B11"),b13=makeCurrent("B13");
 const c1src=s.currentByCode.C1[0];
 const c1ref=s.sparePriceEvidence.c1CurrentOptionalReference;
 if(c1src?.id!=="C1-PTTEP-01"||c1ref?.referenceFcaUnitUSD!==75000)
  throw Error("0553 C1 existing owner/comparable changed");
 const c1=frozen([frozen({
  id:"C1-REF-MDS-RACON-1",code:"C1",tag:c1src.tagNo,
  description:"Complete marine RACON — independent capital spare scenario (1 unit)",
  specification:"SeaBeacon-2 X/S Ex; MDS/ORGA installed FCA USD75,000×31.5×1.30; not DDP, spare compatibility pending",
  materials:"OEM marine Ex assembly (verify exact replaceable model)",
  sourceId:c1src.id,sourceRowModuleId:c1src.sourceRowModuleId,traceId:c1src.traceId,
  quantity:1,unit:"set",unitPriceTHB:c1ref.indicativeFullReplacementSellScenarioTHB,
  extendedTHB:c1ref.indicativeFullReplacementSellScenarioTHB,
  evidenceClass:"INSTALLED_FCA_RACON_COMPARABLE_NOT_SPARE_QUOTE",
  sourceDocument:"MDS QTORG2609244 / Working C1 option",priceSelectedInWorking:false,
  independentlyVerifiedOemSku:false,ddpVerified:false,
  duplicatePhysicalStockCleared:false,customerIssueAllowed:false,leadTime:"8 wk installed-quote indication only"
 })]);
 const rev08=REV08_BASELINE.detail.C2;
 const flagged=x=>/PoE|Cisco power|RF surge|Ethernet surge|fuse|N-male|M20/i.test(x)?"B10_SPARE_FAMILY_POTENTIAL_OVERLAP":
  /7\/8-inch/.test(x)?"INCOMPATIBLE_7_8_RF_FEEDER":/CAT6A/.test(x)?"A5_B13_CABLE_OVERLAP":"OEM_PRICE_AND_SKU_OPEN";
 const c2=frozen(rev08.map(([description,qty,oldUSD],i)=>{
  const unitTHB=round(oldUSD*FX*10000)/10000;
  return frozen({
   id:"C2-REV08-"+String(i+1).padStart(2,"0"),code:"C2",tag:"OEM TAG crosswalk pending",
   description,specification:"Historical Rev08 USD "+oldUSD+" × planning FX31.5; "+flagged(description),
   materials:"Exact OEM spare part pending",
   sourceId:null,sourceRowModuleId:null,traceId:null,
   quantity:qty,unit:/cable.*\(m\)/i.test(description)?"m":"EA",
   unitPriceTHB:unitTHB,extendedTHB:round(qty*oldUSD*FX),
   evidenceClass:"HISTORICAL_REV08_REFERENCE_ONLY_NO_CURRENT_OEM_QUOTE",
   sourceDocument:"4-Scope of Supply.xlsx Rev08 / C2 item "+(i+1),
   conflict:flagged(description),priceSelectedInWorking:false,
   independentlyVerifiedOemSku:false,ddpVerified:false,
   duplicatePhysicalStockCleared:false,customerIssueAllowed:false,leadTime:"OEM lead-time not established"
  });
 }));
 const rows=frozen({B11:frozen(b11),B13:frozen(b13),C1:c1,C2:c2});
 const totals=Object.fromEntries(codes.map(code=>[code,round(rows[code].reduce((n,x)=>n+x.extendedTHB,0))]));
 if(totals.B11!==157657.5||totals.B13!==46683||totals.C1!==3071250||
  Math.abs(totals.C2-721806.60)>0.02)throw Error("0553 spare price-review source totals changed");
 return frozen({
  moduleId:"bid.budget.working.bc.spare-priced-budget-review",
  codes,rows,totals:frozen(totals),
  c2HistoricalOnly:true,allPricesDdpVerified:false,
  c1IncludedInOfficial:false,c2IncludedInOfficial:false,
  issueAllowed:false,
  note:"B11/B13 source Working SELL; C1 installed RACON FCA comparable; C2 superseded Rev08 historical USD SELL at FX31.5 (without another markup). No C1/C2 approved OEM spare quote."
 });
}