// 0553 project adapter for the COMMON First-Principles View.
// Same review method as 0550; no 0550 project facts, prices, or system records.
import { KNOWLEDGE_KERNEL_DOMAINS, ENGINEERING_LAW_KERNELS, KNOWLEDGE_KERNEL_POLICY } from "../knowledge-kernels/library";
import { SYSTEMS_0553 } from "./systemsBinding";
import { BID_0553_GATES } from "./bidReview";
import { TECHNICAL_HOLDS } from "./evidenceRegistry";
import { SCADA_LINKS_0553 } from "./data/scadaLinkEvidence";

const chain=["Source / Evidence","Atomic Requirement","Fundamental Need","Constraint","Engineering Law / Math Model","Measured / Source Inputs","Interface / Physical Context","CAL / Study / RPT","Engineering Proof","Architecture","Physical / Software Object","Quantity Driver","Required MTO","Bulk","Procurement / Vendor","Work / Service / Resource","VDRL / SDRL","QA / ITP / Inspection","FAT / IFAT","Logistics / Regulatory","Site Readiness","Installation / Technical Termination","Pre-Commissioning","SAT / Integration","Commissioning / Start-up","Training / Handover","Warranty / Support","Cost / Schedule / Risk","Check / Release"];
const dimensions=["Requirement / function","Subsystem / software / licence","Interface / protocol","Capacity / quantity driver","CAL / Study / RPT / engineering proof","Physical object / MTO / bulk","Power / UPS / redundancy","Certification / hazardous-area compliance","VDRL / drawings / manuals","FAT / IFAT / SAT / integration test","Configuration / commissioning / training","Permit / frequency / authority","Startup / 2Y / 10Y spares","Special tools","Warranty / support","Cost coverage / schedule / risk"];
const kernelIdsByMr={
 "MR-0001":["RF-PROP","NET-CAP","POWER","RELIABILITY","MECH"],
 "MR-0002":["RF-PROP","POWER","RELIABILITY","MECH"],
 "MR-0003":["POWER","NET-CAP","RELIABILITY"],
 "MR-0004":["RF-PROP","POWER","RELIABILITY"]
};
const audited=SYSTEMS_0553.map(s=>({
 no:s.no,token:s.token,name:s.name,
 auditState:"AUDIT_STARTED",
 knownFinding:TECHNICAL_HOLDS.filter(h=>h.system===s.token).map(h=>h.id+": "+h.issue).join("; ")||"MR/TC clause-level audit not yet complete"
}));
const seeded=TECHNICAL_HOLDS.map(h=>({
 id:"RC-0553-"+h.id,systemToken:h.system,title:h.issue,
 sourceFact:"0553 source audit finding; verify actual MR/TC/quotation evidence.",
 mappingState:"MAPPED_TO_SYSTEM",threadState:"INCOMPLETE",
 missingControls:["Source clause / revision and vendor model check","Proof or test document verification","Required quantity and budget impact"],
 releaseEffect:"OPEN — customer release requires evidence/approval or controlled exception"
}));
export const ENGINEERING_VIEW_MODEL_0553={
 projectId:"PJ2608-0553",systems:SYSTEMS_0553,chain,domains:KNOWLEDGE_KERNEL_DOMAINS,
 controlRules:["NO SOURCE ≠ ZERO SCOPE","NO FINAL QUANTITY ≠ ZERO QUANTITY","TBC ≠ ZERO COST","Document mapping does not prove technical compliance","Vendor quoted model does not prove RFQ acceptance","OEM final link result does not replace independent engineering review","Risk exceptions and budgetary releases require controlled authorization"],
 costEquations:["No project commercial markup adopted pending controlled 0553 policy","Vendor unit cost × accepted MTO quantity = Equipment Cost (when verified)"],
 completeness:{
  state:"AUDIT_IN_PROGRESS",
  doctrine:"Each 0553 MR/TC requirement must trace source → constraint → engineering proof → MTO/cost or approved exception; no inferred compliance or zero.",
  auditDimensions:dimensions,
  releaseRules:[
   "BLOCK customer release while source clause, OEM confirmation or mandatory CAL/RPT remains open.",
   "BLOCK customer release on unsupported antenna gain/band or certification claims.",
   "BLOCK priced release until all four MR MTO lines reconcile with vendor scope and quotation.",
   "BLOCK release while bid closing/amendment, Incoterms or manufacturer authority are unresolved.",
   "Budgetary estimate is not a final customer price and requires controlled assumptions and approval."
  ],
  seedFindings:seeded,
  systemAudit:audited,
  crossSystemObligations:BID_0553_GATES.filter(g=>g.system==="ALL").map(g=>({id:g.id,title:g.title,source:g.sources.join(", "),mappingState:g.status}))
 },
 lawLibrary:{
  state:"COMMON_GENERIC_KERNEL / PJ2608-0553_BINDING",
  evidenceRule:KNOWLEDGE_KERNEL_POLICY.evidenceRule,
  kernels:ENGINEERING_LAW_KERNELS.map(k=>({...k,appliesTo:SYSTEMS_0553.filter(s=>(kernelIdsByMr[s.token]||[]).includes(k.id)).map(s=>s.token)})),
  systemKernelMap:SYSTEMS_0553.map(s=>({token:s.token,name:s.name,kernelIds:kernelIdsByMr[s.token]||[],auditState:"MAPPED_PRELIMINARY"}))
 },
 pilotLinksCount:SCADA_LINKS_0553.length
};
