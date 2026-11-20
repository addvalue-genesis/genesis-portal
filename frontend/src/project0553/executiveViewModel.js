import { getProject0553Dataset } from "./data/repository";
import { BID_COST_SPINE_0553 } from "./data/bidCostSpine";
const d=getProject0553Dataset();
const gates=d.gates;
export const EXECUTIVE_0553={
 description:"Engineering/commercial closure and bid preparation are controlled as separate states. Final customer release remains HOLD while the original and amended tender instructions require verification.",
 notices:[
 {title:"Engineering / Final Customer Release",state:"HOLD / CONTROLLED",description:"RFQ amendment, engineering proofs, manufacturer authorization, quantities and commercial review remain open.",warning:true},
 {title:"Bid Preparation",state:"WORKING REVIEW",description:"MTO Rev04, four technical clarifications and vendor source register are indexed; no customer issue asserted."}
 ],
 metrics:[
 {label:"Systems",value:String(d.project.systems.length),sub:"MR0001–MR0004; controlled engineering spine"},
 {label:"Final release",value:"HOLD",sub:"RELEASED_SELL not authorized",tone:"warn"},
 {label:"Known preliminary equipment cost",value:"THB "+BID_COST_SPINE_0553.knownPreliminaryCost.THB.toLocaleString("en-US"),sub:"Cisco source scenario only; "+BID_COST_SPINE_0553.unpricedRows+" MR0001 items unpriced"},
 {label:"Budgetary base",value:"OPEN",sub:"A+B+C full estimate still requires reconciliation"},
 {label:"Spares / options",value:"OPEN",sub:"Vendor-backed inventory and pricing required"},
 {label:"Priced proposal",value:"HOLD",sub:"Itemized customer quotation not approved",tone:"warn"},
 {label:"Closing instruction",value:"VERIFY",sub:"Original amendment / routing still open"}
 ],
 chain:["Source / Evidence","Atomic Requirement","Fundamental Need","Constraint","Engineering Law / Math Model","CAL / RPT","Physical Object","Quantity","Work / Rate","Cost"],
 methodNote:"Selection follows Requirement → Constraint → CAL/Study/RPT → Engineering Proof → Quantity → Cost. OPEN/TBC is not zero or compliant.",
 selected:{eyebrow:"CURRENT VENDOR QUOTATION BASIS",title:"0553 Vendor package comparison",state:"REVIEW",rows:[
 {label:"SCADA / MR0001",value:"NextG / Aviat and VST Cisco — quotation reconciliation OPEN",state:"OPEN"},
 {label:"DMR / MR0002",value:"MGW P26-058 multi-system quotation — allocation and compliance OPEN",state:"OPEN"},
 {label:"Telephone / RACON",value:"J&R / Gai-Tronics and Orga / MGW alternatives — selection OPEN",state:"OPEN"}
 ]},
 controlTitle:"What management should watch before final bid release",
 controlDescription:"Priority source, engineering and commercial gates. This is an internal working state; no price release is authorized.",
 controls:gates.filter(g=>g.priority==="P0").slice(0,6).map(g=>({title:g.title,description:g.detail,state:g.status}))
};
