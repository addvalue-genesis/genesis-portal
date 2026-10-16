// PJ2608-0553 / Section 06 and 10.2 B1 — ADDVALUE regulatory coordination.
// This is a sub-ledger of B1, not a new customer pricing category.
// All travel/agent/official-fee rate and trip-count inputs are OPEN until
// approved; absence of rate is null, never zero. No unofficial payments.
import {derivePartBcWorkingWbs0553} from "./partBCWorkingWbs0553";
import {deriveManHours,deriveLaborCost} from "../../common/cost/derivationKernel";
const frozen=x=>Object.freeze(x);
const S=frozen([
 frozen({id:"B1-REG-01",description:"Import/Radio Operating License — Engineering technical documents and frequency/equipment dossier",driver:"approved technical deliverables × engineering MH per deliverable",owner:"B1",category:"ENGINEERING",source:"MR0001–0004 Rev.C1 §5 licensing and radio approval; BOD/DTS/SPE; GEQ-005",role:"Senior Telecom Engineer",quantity:null,rateTHB:null,unit:"document"}),
 frozen({id:"B1-REG-02",description:"Regulatory and project technical coordination with local authorized parties",driver:"verified meeting/event count × engineering MH per event",owner:"B1",category:"ENGINEERING",source:"MR0001–0004 Rev.C1 §5 vendor authorization and licensing obligations; GEQ-005",role:"Project Manager / Chief Telecom",quantity:null,rateTHB:null,unit:"meeting"}),
 frozen({id:"B1-REG-03",description:"Permit coordination MOB/DEMOB — actual airfare and travel",driver:"approved trip ID × travelers × sourced ticket rate",owner:"B1",category:"TRAVEL",source:"Regulatory trip plan and travel invoice/quotation required; separate from B3 SAT and B9 China yard",role:"Project Manager / Chief Telecom",quantity:null,rateTHB:null,unit:"person-trip"}),
 frozen({id:"B1-REG-04",description:"Regulatory coordination accommodation",driver:"approved trip ID × person-nights × hotel rate",owner:"B1",category:"TRAVEL",source:"Permit trip itinerary, person-nights and hotel rate required",role:"Assigned regulatory traveler",quantity:null,rateTHB:null,unit:"person-night"}),
 frozen({id:"B1-REG-05",description:"Regulatory local transport and necessary subsistence",driver:"approved trip ID × verified travel days × local rate",owner:"B1",category:"TRAVEL",source:"Trip approval and documented local transport/per diem policy required",role:"Assigned regulatory traveler",quantity:null,rateTHB:null,unit:"person-day"}),
 frozen({id:"B1-REG-06",description:"Visa/immigration/work permit for regulatory coordination trip",driver:"approved regulatory travelers × lawful official fee",owner:"B1",category:"PERMIT",source:"Official published visa/permit fees and documented role/travel necessity required",role:"Assigned regulatory traveler",quantity:null,rateTHB:null,unit:"application"}),
 frozen({id:"B1-REG-07",description:"Licensed local technical/regulatory filing consultant",driver:"written scope of services × verified contracted legal fee",owner:"B1",category:"THIRD_PARTY_SERVICE",source:"Signed engagement, deliverables, beneficial-owner due diligence and invoice required",role:"Approved third party",quantity:null,rateTHB:null,unit:"service"}),
 frozen({id:"B1-REG-08",description:"Official authority application/license fee borne by ADDVALUE",driver:"official schedule × legally payable license/application",owner:"B1",category:"PERMIT",source:"Authority fee schedule and contractual liability allocation; avoid duplicate OEM/SAMTEL fee",role:"Licensed applicant / ADDVALUE if contract owner",quantity:null,rateTHB:null,unit:"application"})
]);
export function selectB1RegulatoryCost0553(){
 const b1=derivePartBcWorkingWbs0553().rows.find(x=>x.code==="B1");
 if(!b1||b1.sellTHB!==510000||b1.qty!==964)throw Error("B1 baseline/GEQ linkage changed");
 const rows=S.map(x=>{
  const hours=x.category==="ENGINEERING"?deriveManHours({applicable:1,quantity:x.quantity,unitHours:null,factor:1,evidence:null}):null;
  const labor=x.category==="ENGINEERING"?deriveLaborCost({hours:hours.value,loadedRate:null,evidence:null}):null;
  return frozen({...x,derivedMH:hours?.value??null,derivedDirectCostTHB:labor?.value??null,
   budgetExtendedTHB:Number.isFinite(x.quantity)&&Number.isFinite(x.rateTHB)?x.quantity*x.rateTHB:null,
   sourceRateStatus:"OPEN_SOURCE_QTY_AND_RATE",pricePostingAllowed:false,
   riskClass:x.id==="B1-REG-07"?"THIRD_PARTY_ANTI_BRIBERY_DUE_DILIGENCE_REQUIRED":"NORMAL_COST_EVIDENCE_GATE",
   purposeKey:"REGULATORY_COORDINATION",tripId:null,scopeBoundary:"NOT_B3_SAT_NOT_B6_CARGO_NOT_B9_CHINA_YARD_NOT_B14_INSURANCE"});
 });
 if(rows.length!==8||rows.some(x=>x.budgetExtendedTHB!==null||x.pricePostingAllowed))throw Error("Regulatory prices unexpectedly assumed");
 return frozen({moduleId:"bid.budget.working.bc.b1.regulatory",owner:"ADDVALUE",
  category:"B1",group:"Regulatory, Import & Operating Licence Coordination",
  equationIds:["GEQ-005","GEQ-013","GEQ-016","GEQ-018","MAP-07","MAP-08"],
  protectedWorkingSellTHB:b1.sellTHB,originalEngineeringMH:b1.qty,
  rows,computedRegulatoryDirectCostTHB:null,incrementalWorkingSellTHB:null,
  currentBudgetTotalTHB:null,approvedTripCount:null,approvedPersonNights:null,
  sourcePolicy:"MR0001–0004 §5 + existing B1 WBS Rev05; actual trip and source rates needed",
  duplicatePrevention:"Each approved Trip ID, Purpose and Cost Owner booked once; regulatory B1 excludes SAT B3, goods B6, JUTAL-China B9, insurance B14.",
  compliance:"No unofficial facilitation payment, influence fee or unverified commission can be recorded or priced.",
  workingSellPosted:false,customerReleaseAllowed:false});
}
