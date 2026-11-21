// BID-RSK owns the display of the two existing contingency factors.
// Neither factor is recalculated here. The 10% SCADA envelope is not part of
// the customer total. The 5% omission reserve is already inside the Part A/C
// 1.30 price factor and must not be added a second time.
export const SCADA_ENVELOPE_CONTINGENCY_PCT_0553=10;
export const PART_AC_OMISSION_RESERVE_PCT_0553=5;
export function selectContingencyRegister0553(){
 return Object.freeze({
  moduleId:"bid.risk.contingency",
  lines:Object.freeze([
   Object.freeze({
    id:"SCADA-ENVELOPE-10",
    pct:SCADA_ENVELOPE_CONTINGENCY_PCT_0553,
    source:"frontend/src/project0553/data/scadaBudgetEnvelope0553.js",
    basis:"Illustrative 10% on the priced SCADA envelope floor only.",
    includedInCustomerTotal:false,
    customerTotalEffect:"NOT_INCLUDED"
   }),
   Object.freeze({
    id:"AC-OMISSION-RESERVE-5",
    pct:PART_AC_OMISSION_RESERVE_PCT_0553,
    source:"RELEASE_POLICY_0553.aAndC.omissionReserveCostPct",
    basis:"5% of Part A/C direct cost. It is one part of the existing 1.30 price factor (20% SAMTEL + 5% ADDVALUE + 5% omission) and is already inside previewSellTHB.",
    includedInCustomerTotal:true,
    customerTotalEffect:"INSIDE_PART_A_AND_C_PRICE_FACTOR_NOT_ADDED_AGAIN"
   })
  ])
 });
}
