// Pure read-only adapter: prepared totals -> customer A-line display data.
// No engineering quantity, unit-rate, extended-cost, FX or margin derivations here.
import {workingBomByCustomerA0553} from "./workingBomAggregation0553";
import {deriveA5BulkAttribution0553} from "./a5BulkAttribution0553";
export function selectCustomerEquipmentDisplay0553(){
 const projections=workingBomByCustomerA0553();
 const result=Object.fromEntries(Object.entries(projections).map(([code,p])=>[code,{
  thb:p.currencies.THB??null,usd:p.currencies.USD??null,
  status:(p.scenario?"SCENARIO / NOT BOOKED; ":"WORKING SOURCE; ")+
   p.priced+" counted, "+p.unresolved+" unresolved; NOT RELEASED",
  source:p.basis,
  detail:p
 }]));
 // A5 is kept outside A1–A4 source totals: attribution overlaps until row-level owners are settled.
 const bulk=deriveA5BulkAttribution0553();
 result.A5={thb:Number.isFinite(bulk.a5PriceTHB)?bulk.a5PriceTHB:null,usd:null,
  status:"Attribution reference; OVERLAP UNRECONCILED / NOT ADDITIVE",
  source:"A5 source-MTO bulk attribution"};
 return result;
}
