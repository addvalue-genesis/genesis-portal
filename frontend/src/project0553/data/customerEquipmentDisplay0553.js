// Read-only customer presentation of already calculated MR costs and verified A5 transfer.
// No quantity, vendor price, FX, margin, or engineering derivation is performed here.
import {workingBomByCustomerA0553} from "./workingBomAggregation0553";
import {deriveA5BulkAttribution0553} from "./a5BulkAttribution0553";
const round=n=>Math.round(n*100)/100;
export function selectCustomerEquipmentDisplay0553(){
 const projections=workingBomByCustomerA0553();
 const result=Object.fromEntries(Object.entries(projections).map(([code,p])=>[code,{
  thb:p.currencies.THB??null,usd:p.currencies.USD??null,
  status:(p.scenario?"SCENARIO / NOT BOOKED; ":"WORKING SOURCE; ")+p.priced+
   " counted, "+p.unresolved+" unresolved; NOT RELEASED",
  source:p.basis,detail:p
 }]));
 const bulk=deriveA5BulkAttribution0553();
 // Only a fully source-reconciled row-level transfer may be removed from A1.
 // Missing/failed attribution is NULL, never guessed, never deducted.
 const verified=bulk.state==="PARTIAL_WORKING_PRICED_BULK__RECLASS_FROM_A1"&&
  Number.isFinite(bulk.a1CostToReclassifyTHB)&&Number.isFinite(bulk.a5PriceTHB)&&
  bulk.a1CostToReclassifyTHB===bulk.a5PriceTHB;
 const gross=result.A1?.thb;
 if(verified&&Number.isFinite(gross)){
  result.A1={...result.A1,thb:round(gross-bulk.a1CostToReclassifyTHB),
   grossMrTHB:gross,transferredToA5THB:bulk.a1CostToReclassifyTHB,
   status:result.A1.status+" VERIFIED A5 row transfer deducted from A1 display (not from source ledger)"};
 }else if(result.A1){
  result.A1={...result.A1,grossMrTHB:gross,transferredToA5THB:null,
   thb:null,status:result.A1.status+" A1 EQUIPMENT-ONLY THB NOT ESTABLISHED: A5 transfer unverified"};
 }
 result.A5={thb:verified?bulk.a5PriceTHB:null,usd:null,
  status:verified?"VERIFIED SOURCE ROW TRANSFER FROM A1 (NOT ADDITIVE)":"A5 SOURCE ROW RECONCILIATION FAILED / NOT BOOKED",
  source:"A5 source-MTO bulk attribution",reclassifiedFromA1:verified};
 return result;
}
