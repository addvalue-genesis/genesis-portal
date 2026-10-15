// Customer-first B/C working-source routing. Registry only; NO cost postings.
// Distinguish demand, derivation, cost evidence, projection and customer display.
export const BC_WORKING_ROUTES_0553=Object.freeze([
 {workflow:"10.2.1",codes:["B1","B2","B3","B8","B9"],name:"Engineering, documentation, test, training and assistance",owner:"06 Execution WBS",source:["partBCWorkingWbs0553.js"],basis:"WORKING_SELL_REFERENCE_ONLY",next:"10.3 COST DERIVATION REQUIRED"},
 {workflow:"10.2.2",codes:["B4","B5","B6","B7","B14"],name:"OEM work, packing, logistics, storage, bonds and insurance",owner:"Turnkey execution / supplier / contract",source:["partBCWorkingWbs0553.js","documentParticularRequirements0553.json"],basis:"CUSTOMER_REQUIREMENT_NO_CURRENT_COST",next:"10.3 OEM/LOGISTICS/CONTRACT RATE REQUIRED"},
 {workflow:"10.2.3",codes:["B10","B11","B12","B13"],name:"Startup spares, tools, filling and consumables",owner:"Installed BOM + lifecycle requirements",source:["lifecycleSpareScope0553.js","workingBomAggregation0553.js"],basis:"REQUIREMENT_ONLY_NO_VERIFIED_SCHEDULE",next:"10.3 OEM SKU/QTY/RATE REQUIRED"},
 {workflow:"10.2.4",codes:["C1","C2"],name:"Optional capital and two-year spares",owner:"Installed BOM + OEM spares schedule",source:["lifecycleSpareScope0553.js","workingBomAggregation0553.js"],basis:"OPTION_REQUIREMENT_ONLY",next:"10.3 SPARE QTY/RATE REQUIRED"}
]);
export const BC_CUSTOMER_CODES_0553=Object.freeze([...Array.from({length:14},(_,i)=>"B"+(i+1)),"C1","C2"]);
export function validateBcRoutes0553(){
 const codes=BC_WORKING_ROUTES_0553.flatMap(x=>x.codes);
 return codes.length===BC_CUSTOMER_CODES_0553.length&&new Set(codes).size===codes.length&&BC_CUSTOMER_CODES_0553.every(x=>codes.includes(x));
}
// Historical Rev08 sheet numbers are audit evidence only.
// Old lifecycle classes B4/B5/C1/C2 must NOT be treated as customer-class equivalents.
// No SAMTEL/OEM turnkey requirement is excluded due to execution ownership.
