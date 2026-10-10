import { PROJECT_0553_FACTS } from "./projectFacts";
import MTO_REV04 from "./data/snapshots/mto.rev04.summary.json";
import { BID_0553_GATES } from "./bidReview";
// Bind 0553 source-only records to the ORIGINAL shared SystemsView interface.
export const SYSTEMS_0553 = PROJECT_0553_FACTS.systems.map((system,index)=>{
 const mto=MTO_REV04.systems.find(x=>x.mr===system.mr);
 const gates=BID_0553_GATES.filter(x=>x.system===system.mr);
 return {
  no:index+1, token:system.mr, name:system.name, groupId:"G-0553",
  ref:system.mr+" / "+(mto?.facilities.join(", ")||"LOCATION OPEN"),
  proofState:"OPEN / ENGINEERING REVIEW", costBasis:"VENDOR RECONCILIATION OPEN",
  proof:"MR + TC + CAL/RPT compliance not approved",
  quantityState:"MTO Rev04 WORKING — "+(mto?.rowCount??"OPEN")+" table rows, not confirmed purchase quantity",
  owner:"Scope split / FAT / SAT / import responsibilities OPEN",
  open:gates.length?gates.map(g=>g.id+": "+g.title).join("; "):"Complete source-to-requirement verification"
 };
});
export const SYSTEM_GROUPS_0553=[{id:"G-0553",name:"Telecom Package — MR0001–MR0004",description:"JUTAL ZM169; all four MR systems reviewed against controlled sources"}];
