import {createComponentRegistry,assignSemanticNames} from "../common/governance/componentRegistry";
export const O_G_LIFECYCLE_0556=Object.freeze([
 ["L1","Concept & Feasibility"],["L2","FEED / Basic Engineering"],["L3","Tendering & Bidding"],["L4","Detailed Engineering"],
 ["L5","Procurement & Manufacturing"],["L6","Construction & Installation"],["L7","Pre-Commissioning & Commissioning"],
 ["L8","Start-up & Handover"],["L9","Operation & Maintenance"],["L10","Modification & Decommissioning"]
].map(([id,title])=>({id,title,state:id==="L3"?"ACTIVE":"LIFECYCLE_SCOPE_REVIEW"})));
export const L3_TABS_0556=Object.freeze([
 ["overview","01 Executive & Project Governance"],["engineering","02 First Principles & Methodology"],
 ["architecture","03 System & Process Architecture"],["systems","04 MR Systems & Document Intelligence"],
 ["schematic","05.3 Schematic & System Drawings"],["execution","06 Execution & Resource Planning"],
 ["documents","07 Vendor & Technical Evidence"],["risk","08 Risk, Assumptions & Change"],
 ["registry","09 Data, Code & Traceability"],["budget","10 Budget & Commercial Analysis"]
]);
export const L3_TAB_GROUPS_0556=Object.freeze([
 {id:"govern",title:"GOVERN · หลักการและโครงสร้าง",tabs:["overview","engineering","architecture"]},
 {id:"analyse",title:"ENGINEER & ANALYSE · วิศวกรรมและการวิเคราะห์",tabs:["systems","schematic","execution","risk"]},
 {id:"commercial",title:"SOURCE & COMMERCIAL · ผู้ขายและงบประมาณ",tabs:["documents","budget"]},
 {id:"control",title:"CONTROL · ข้อมูลและการติดตาม",tabs:["registry"]}
]);
const codes={overview:"BID-GOV",engineering:"BID-FPR",architecture:"BID-ARC",systems:"BID-REQ",schematic:"BID-ENG-SCH",execution:"BID-EXE",documents:"BID-VEN",risk:"BID-RSK",registry:"BID-DAT",budget:"BID-BUD"};
export const TAB_IDENTITY_0556=assignSemanticNames(
 createComponentRegistry({projectId:"PJ2610-0556",stage:"L3",area:"B",tabs:L3_TABS_0556}),
 L3_TABS_0556.map(([route],i)=>({route,code:codes[route],locationCode:"L3-B-"+(route==="schematic"?"05.3":String(i+1).padStart(2,"0")),workflowIds:[],sourcePaths:["frontend/src/pages/PJ26080556.jsx"]}))
);
