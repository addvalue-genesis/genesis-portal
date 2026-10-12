// Eight functional checkpoints are mandatory in every MR0001 site view.
// An absent MTO tag is a gap / reuse / by-others decision, NEVER a fabricated BOM line.
import {selectMR0001TagCostRows0553} from "./mr0001TagCostLedger0553";
export const MR0001_FUNCTIONS_0553=Object.freeze([
 {id:"RADIO_ODU",label:"Radio ODU",test:t=>/^MR-(502|LQM)-/.test(t)&&!/A$|B$/.test(t)},
 {id:"RADIO_IDU",label:"Radio IDU / Indoor Function",test:t=>/^MR-(502|LQM)-/.test(t)&&/A$|B$/.test(t)},
 {id:"ANTENNA",label:"Antenna",test:t=>/^ANT-/.test(t)},
 {id:"LAN",label:"LAN / Network Switch",test:t=>/^LAN-/.test(t)},
 {id:"DATO",label:"DATO / Disconnect Interface",test:t=>/^DATO-/.test(t)},
 {id:"TCAB",label:"Telecom Enclosure",test:t=>/^TCAB-/.test(t)},
 {id:"SURGE",label:"Surge Protection",test:t=>/^SA-/.test(t)},
 {id:"BULK",label:"Bulk Material",test:t=>/BULK[- ]MATERIAL/i.test(t)}
]);
export function deriveMR0001EightFunctionCoverage0553(site){
 const rows=selectMR0001TagCostRows0553(site);
 return MR0001_FUNCTIONS_0553.map((f,i)=>{
  const matches=rows.filter(r=>f.test(String(r.tag||"").toUpperCase()));
  return {id:f.id,label:f.label,ordinal:i+1,site,rows:matches,
   state:matches.length?matches.every(r=>r.countedInWorkingTotal)?"WORKING_COST_MAPPED":"MTO_PRESENT_COST_OR_SCOPE_PENDING":"NO_MTO_TAG__CHECK_NEW_REUSE_BY_OTHERS",
   costCompleteness:matches.length?matches.filter(r=>r.countedInWorkingTotal).length+"/"+matches.length:"0/0"};
 });
}
