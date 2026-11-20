import {INNOVA_0553_PROVISIONAL_PRICES} from "./innovaHistoricalBudgetPrices";
// Scenario is an internal quoteable PARTIAL price floor, not a certified finished MTO.
export function deriveZwp20BulkPricingBridge0553(){
 const q=INNOVA_0553_PROVISIONAL_PRICES.quotations.find(x=>x.number==="QA24-0604");
 const cable=q.lines.find(x=>x.description.includes("TECKNIKABEL"));
 const gland=q.lines.find(x=>x.partNumber==="501/453/UNIV/A/M20");
 const adapter=q.lines.find(x=>x.partNumber==="AFU113030");
 const entries=[
  {id:"FEEDER_ROUTE",functionId:"FEEDER_ROUTE",qty:69,unit:"m",unitRateTHB:cable.unitPriceExVat,
   source:"INNOVA QA24-0604 line1",quantityBasis:"60m management route plus 15% material allowance",confidence:"BUDGETARY_ROUTE"},
  {id:"GLANDS",functionId:"GLANDS",qty:3,unit:"set",unitRateTHB:gland.unitPriceExVat,
   source:"INNOVA QA24-0604 line4",quantityBasis:"Internal scenario: one Ethernet, one DC power and one conditional data/control gland; sizes not approved",confidence:"BUDGETARY_CABLE_END_SCENARIO"},
  {id:"RF_CONNECTOR",functionId:"RF_CONNECTOR",qty:1,unit:"ea",unitRateTHB:adapter.unitPriceExVat,
   source:"INNOVA QA24-0604 line3 AFU113030",quantityBasis:"Outdoor adapter allowance only, not evidence of NPT mating suitability; vendor MOQ 10 requires procurement review",confidence:"CONDITIONAL_ADAPTER"}
 ].map(x=>({...x,extendedTHB:x.qty*x.unitRateTHB}));
 const scenarioTHB=entries.reduce((s,x)=>s+x.extendedTHB,0);
 const previousTHB=69*cable.unitPriceExVat+gland.unitPriceExVat;
 return {site:"ZWP20",row:11,entries,scenarioTHB,previousTHB,deltaTHB:scenarioTHB-previousTHB,
  source:"INNOVA QA24-0604 2024 vendor rates + approved route baseline + conditional interface model",
  appliesTo:"ONE_ROW11_BULK_LOT",priceComplete:false,nonAdditiveToLedger:true,
  includedRisk:["Earthing","Supports","MCT","Outdoor certified gland/OD verification","RF jumper/feeder if not vendor-included"],
  note:"THB scenario is priced known line floor; uncovered items must remain priced-risk exposure, never a zero-cost assumption."};
}