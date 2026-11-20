// PJ2608-0553 B14 — ADDVALUE PERSONNEL ONLY.
// 4 management roles; SAT / offshore roster limited to Senior Telecom
// Technician and Chief Telecom Technician per management instruction.
// No SAMTEL bonds, cargo, EPC all-risks, VAT or insurer-approved quotations.
// Published PA rate and explicitly non-binding offshore/China allowances remain separate.
import {derivePartBcWorkingWbs0553} from "./partBCWorkingWbs0553";
const R=n=>Math.round((n+Number.EPSILON)*100)/100;
export const ADDVALUE_INSURED_ROLES_0553=Object.freeze([
 {id:"PM-CHIEF",role:"Project Manager / Chief Telecom",personCount:1,sat:false},
 {id:"SR-TELECOM",role:"Senior Telecom Engineer",personCount:1,sat:false},
 {id:"CHIEF-TECH",role:"Chief Telecom Technician",personCount:1,sat:true},
 {id:"SR-TECH",role:"Senior Telecom Technician",personCount:1,sat:true}
]);
export const ADDVALUE_B14_BASIS_0553=Object.freeze({
 owner:"ADDVALUE",quantitySource:"B3 Rev05 39 offshore team-days, 2 SAT persons, 5 rotations; B9 Rev05 12 China yard team-days, provisional two-person crew",
 insuranceRateSource:"https://www.msig-thai.com/en/business-insurance/employee-group-accident-insurance-small-and-medium-enterprises",
 eligibilityWarning:"MSIG generic SME group PA specifically EXCLUDES offshore work and oil rigs and may require minimum five persons; rate used only as NON-BINDING ordinary-personnel comparator.",
 offshoreExclusionEvidence:"https://www.allianz.co.th/en_TH/travel-insurance/single-plan.html",
 rateClasses:{annualBasicPA_THBPerPerson:3000,offshoreRisk_THBPerPersonDay:500,chinaWorkTravel_THBPerPersonDay:200},
 assumptions:"THB3000/year/person is a visible market comparator (MSIG outdoor class); THB500/offshore person-day and THB200/China person-day are management insurance budget assumptions, NOT insurer rates.",
 exclusions:["SAMTEL bonds and guarantees","EPC / SAMTEL master CAR-EAR","B6 Marine Cargo","Vendor/OEM personnel","Normal employee medical/payroll","Unconfirmed travel/person-days"],
 releaseAllowed:false
});
export function selectAddvalueB14Insurance0553(){
 const w=derivePartBcWorkingWbs0553().rows;
 const b3=w.find(x=>x.code==="B3"),b9=w.find(x=>x.code==="B9");
 if(!b3||!b9||!String(b3.driver).includes("39 offshore team-days")||b9.qty!==12)
  throw Error("B14 must track controlled B3/B9 deployment WBS");
 const roles=ADDVALUE_INSURED_ROLES_0553;
 if(roles.reduce((n,x)=>n+x.personCount,0)!==4||roles.filter(x=>x.sat).length!==2)
  throw Error("B14 ADDVALUE roster / SAT role reconciliation");
 const params=ADDVALUE_B14_BASIS_0553.rateClasses;
 const entries=[
  {id:"B14-AV-01",description:"Ordinary personnel personal accident annual budget comparator",persons:4,days:1,rateTHB:params.annualBasicPA_THBPerPerson,unit:"person-year",basis:"Published ordinary outdoor work PA comparator; 4-person plan eligibility and offshore exclusion unresolved",rateClass:"PUBLISHED_NON_BINDING_COMPARATOR"},
  {id:"B14-AV-02",description:"Offshore SAT and commissioning high-risk PA/medical/evacuation endorsement allowance",persons:2,days:39,rateTHB:params.offshoreRisk_THBPerPersonDay,unit:"person-day",basis:"B3 39 working team-days × Senior Telecom Technician + Chief Telecom Technician; specialist oil/gas offshore underwriting REQUIRED",rateClass:"MANAGEMENT_ALLOWANCE_NOT_INSURER_QUOTE"},
  {id:"B14-AV-03",description:"China yard working-travel / accident extension allowance",persons:2,days:12,rateTHB:params.chinaWorkTravel_THBPerPersonDay,unit:"person-day",basis:"B9 12 team-days × provisional two ADDVALUE travellers (roles/trip need approval)",rateClass:"MANAGEMENT_ALLOWANCE_NOT_INSURER_QUOTE"}
 ].map(x=>Object.freeze({...x,qty:x.persons*x.days,estimatedTHB:R(x.persons*x.days*x.rateTHB),directCostApproved:false,policyConfirmed:false}));
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b14.addvalue-personnel-insurance",
  owner:"ADDVALUE",roles,entries,
  totalBudgetTHB:R(entries.reduce((s,x)=>s+x.estimatedTHB,0)),
  offshoreSATCrew:roles.filter(x=>x.sat).map(x=>x.role),
  b3OffshoreWorkingPersonDays:78,
  b9ChinaProvisionalPersonDays:24,
  managementBudgetOnly:true,workingSellPosted:false,verifiedInsuranceQuoteTHB:null,
  excludesSAMTELBond:true,customerReleaseAllowed:false,
  warnings:["Generic annual accident product cannot be used for offshore oil/gas work without explicit endorsement and insurer confirmation.","4-person group PA may be under minimum policy size; require insurer offer or existing ADDVALUE policy.","B9 two-person China yard roster is provisional; do not charge all four roles for offshore visits."]
 });
}
