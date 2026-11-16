// PJ2608-0553 SI-SYNTH-EQ registry.
// The 0550 file siVerificationEquations0550.js is not on any branch in this
// repository, so Ψ_Synth, Λ_SI and μ(s) are not evaluated here. This module
// only reads existing 0553 facts and bid gates. It does not post prices.
import {PROJECT_0553_FACTS} from "../projectFacts";
import {BID_0553_GATES,validateBidReview} from "../bidReview";
import MTO_REV04 from "./snapshots/mto.rev04.summary.json";

export const SI_SYNTH_EQ_ID_0553="SI-SYNTH-EQ";
export const SI_SYNTH_HOMES_0553=Object.freeze({
 definitions:"bid.engineering",
 registry:"bid.systems",
 scorecard:"bid.execution"
});
export const SI_SYNTH_EQUATIONS_0553=Object.freeze([
 Object.freeze({id:"EQ-UI",group:"SI-CAL",tab:"02 First Principles",symbol:null,
  title:"UI verification",status:"OPEN",
  formula:null,reason:"No EQ-UI formula is present in this repository."}),
 Object.freeze({id:"EQ-CUS",group:"SI-REQ",tab:"04 Systems / Requirements",symbol:"Ψ_Synth",
  title:"Holistic context synthesis",status:"OPEN",
  formula:null,reason:"No Ψ_Synth definition or learned-rule schema Λ_SI is present in this repository."}),
 Object.freeze({id:"EQ-VND",group:"SI-ACT",tab:"06 Execution / Resources",symbol:"μ(s)",
  title:"Supplier and cross-volume gate",status:"OPEN",
  formula:null,reason:"No μ(s) markup-routing function or §10 gate rule is present in this repository."})
]);
export const SI_SYNTH_LEARNED_RULES_0553=Object.freeze([]);

const gateState=gates=>{
 if(!gates.length)return "OPEN";
 if(gates.every(gate=>gate.status==="CLOSED_VERIFIED"))return "PASS";
 return "OPEN";
};

export function selectSiSynthScorecard0553(){
 const review=validateBidReview();
 const systems=PROJECT_0553_FACTS.systems.map(system=>{
  const mto=MTO_REV04.systems.find(row=>row.mr===system.mr)||null;
  const gates=BID_0553_GATES.filter(gate=>gate.system===system.mr);
  return Object.freeze({
   id:system.id,mr:system.mr,name:system.name,
   sourceStatus:system.status,
   mrTitle:system.rfqSource?.title||system.mr,
   mrRevision:system.rfqSource?.revision||null,
   mtoRevision:MTO_REV04.revision,
   mtoRows:mto?.rowCount??null,
   locations:Object.freeze([...(mto?.facilities||[])]),
   gates:Object.freeze(gates.map(gate=>Object.freeze({id:gate.id,status:gate.status,title:gate.title}))),
   state:gateState(gates)
  });
 });
 const commonGates=BID_0553_GATES.filter(gate=>gate.system==="ALL");
 const rows=Object.freeze([
  Object.freeze({id:"COMMON",mr:"COMMON",name:"Project-wide bid gates",
   sourceStatus:review.releaseAllowed?"CLOSED_VERIFIED":"OPEN",
   gates:Object.freeze(commonGates.map(gate=>Object.freeze({id:gate.id,status:gate.status,title:gate.title}))),
   state:review.releaseAllowed?"PASS":gateState(commonGates)}),
  ...systems
 ]);
 if(systems.length!==4||systems.some(row=>row.mtoRows==null))
  throw Error("SI-SYNTH-EQ scorecard lost an 0553 MR system or its MTO row count");
 return Object.freeze({
  id:SI_SYNTH_EQ_ID_0553,
  homes:SI_SYNTH_HOMES_0553,
  equations:SI_SYNTH_EQUATIONS_0553,
  learnedRules:SI_SYNTH_LEARNED_RULES_0553,
  rows,
  releaseAllowed:review.releaseAllowed,
  questions:"docs/pj2608-0553/SI-SYNTH-EQ-questions-for-gemini.md"
 });
}
