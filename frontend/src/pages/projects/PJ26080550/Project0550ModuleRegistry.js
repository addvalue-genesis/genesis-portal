import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";

export const PROJECT0550_MODULES = [
  { id:"1.0", key:"overview", title:"Bid Overview", parent:null, kind:"KNOWLEDGE", authority:"SYSTEM_RESOLUTION", purpose:"Understand the bid, source pack, obligations and required outputs." },
  { id:"1.1", key:"bid-input", title:"Bid Input Pack", parent:"1.0", kind:"SOURCE", authority:"SYSTEM_RESOLUTION", purpose:"Controlled source groups and document authority." },
  { id:"1.2", key:"bid-output", title:"Required Submission Outputs", parent:"1.0", kind:"OUTPUT", authority:"SYSTEM_RESOLUTION", purpose:"What the customer must receive." },
  { id:"1.3", key:"bid-logic", title:"Requirement-to-Submission Logic", parent:"1.0", kind:"KNOWLEDGE", authority:"SYSTEM_RESOLUTION", purpose:"Connect source, need, response, work, deviation and submission." },

  { id:"2.0", key:"strategy", title:"Executive Commercial Strategy", parent:null, kind:"EXECUTIVE", authority:"EXECUTIVE_DECISION", purpose:"Profit policy, risk appetite, target return, bid position and offer authorization." },
  { id:"2.1", key:"commercial-basis", title:"Commercial Basis", parent:"2.0", kind:"COMMERCIAL", authority:"SYSTEM_RESOLUTION", purpose:"Incoterm, tax, payment, warranty and scope basis from documents." },
  { id:"2.2", key:"cost-truth", title:"Cost Truth", parent:"2.0", kind:"COMMERCIAL", authority:"SYSTEM_RESOLUTION", purpose:"Controlled project cost and economic exposure." },
  { id:"2.3", key:"risk-finance", title:"Risk & Financing", parent:"2.0", kind:"COMMERCIAL", authority:"SYSTEM_RESOLUTION", purpose:"Cash carry, accepted conditions and residual exposure." },
  { id:"2.4", key:"profit-policy", title:"Profit Policy", parent:"2.0", kind:"EXECUTIVE", authority:"EXECUTIVE_DECISION", purpose:"Margin/markup/partner layer, minimum and target return." },
  { id:"2.5", key:"authorised-offer", title:"Authorised Offer", parent:"2.0", kind:"EXECUTIVE", authority:"EXECUTIVE_DECISION", purpose:"Strategic price position and final authorization." },

  { id:"3.0", key:"model", title:"First Principles / Constraint / Parametric Model", parent:null, kind:"KNOWLEDGE", authority:"SYSTEM_RESOLUTION", purpose:"Execute the controlled method: Source/Requirement → Need/Constraint → Proof → Required Quantity/Work → Parametric Cost → Release." },
  { id:"3.1", key:"evidence-chain", title:"Evidence Chain", parent:"3.0", kind:"SOURCE", authority:"SYSTEM_RESOLUTION", purpose:"Source → requirement → fundamental need → interpretation → answer." },
  { id:"3.2", key:"technical-proof", title:"Technical Proof Tools", parent:"3.0", kind:"TECHNICAL", authority:"SYSTEM_RESOLUTION", purpose:"CAL/SDY/RPT/equations only where proof is actually needed." },
  { id:"3.3", key:"method-library", title:"Reusable Method Library", parent:"3.0", kind:"METHOD", authority:"SYSTEM_RESOLUTION", purpose:"Controlled reusable methods without importing project facts." },

  { id:"4.0", key:"control", title:"Smart Engineering Control Spine", parent:null, kind:"CONTROL", authority:"SYSTEM_RESOLUTION", purpose:"Algorithmically evaluate evidence, constraints, proof gates, quantity/vendor gaps, lifecycle, cost completeness and release readiness." },

  { id:"5.0", key:"form", title:"Bid Form Tracker", parent:null, kind:"OUTPUT", authority:"SYSTEM_RESOLUTION", purpose:"Customer response form control." },
  { id:"6.0", key:"scope", title:"Scope / Compliance", parent:null, kind:"CONTROL", authority:"SYSTEM_RESOLUTION", purpose:"Resolve obligations and compliance from governing sources." },
  { id:"7.0", key:"price", title:"ASK-TSI Priced Breakdown", parent:null, kind:"COMMERCIAL", authority:"SYSTEM_RESOLUTION", purpose:"Generate/map the controlled engineering and commercial result into ASK-TSI Priced Breakdown List.xlsx form structure." },
  { id:"8.0", key:"deviation", title:"Deviation Control", parent:null, kind:"DEVIATION", authority:"MIXED", purpose:"Technical/commercial deviation after evidence-based resolution is exhausted." },
  { id:"9.0", key:"vdrl", title:"VDRL / Document Production", parent:null, kind:"CONTROL", authority:"SYSTEM_RESOLUTION", purpose:"Document obligation, workload, revision and issue control." },
  { id:"10.0", key:"submission", title:"Submission Outputs", parent:null, kind:"OUTPUT", authority:"SYSTEM_RESOLUTION", purpose:"Ready-to-submit controlled bid package." },
  { id:"11.0", key:"access", title:"Team Access / Governance", parent:null, kind:"GOVERNANCE", authority:"EXECUTIVE_POLICY", purpose:"Access, roles, permissions and governance policy." },

  { id:"12.0", key:"systems", title:"System Engineering — 19 Systems", parent:null, kind:"TECHNICAL", authority:"SYSTEM_RESOLUTION", purpose:"Per-system evidence-controlled engineering using the GDrive 19-System Master as the internal sequence and RFQ documents as governing evidence." },
  ...PROJECT0550_SYSTEMS.map(s=>({
    id:s.moduleId,
    key:s.key,
    title:s.name,
    parent:"12.0",
    kind:"TECHNICAL",
    authority:"SYSTEM_RESOLUTION",
    purpose:`System ${String(s.no).padStart(2,"0")} · ${s.token} · RFQ-bound engineering resolution`
  })),
  { id:"12.7.1", key:"paga-system", title:"System Picture", parent:"12.7", kind:"TECHNICAL", authority:"SYSTEM_RESOLUTION", purpose:"PAGA system context and architecture." },
  { id:"12.7.2", key:"paga-trace", title:"Requirement / Evidence", parent:"12.7", kind:"SOURCE", authority:"SYSTEM_RESOLUTION", purpose:"What PAGA requires, why and from where." },
  { id:"12.7.3", key:"paga-proof", title:"Engineering Proof", parent:"12.7", kind:"TECHNICAL", authority:"SYSTEM_RESOLUTION", purpose:"PAGA CAL/SDY/RPT proof objects where technical proof is required." },
  { id:"12.7.4", key:"paga-mto", title:"Required MTO / Vendor", parent:"12.7", kind:"TECHNICAL", authority:"SYSTEM_RESOLUTION", purpose:"PAGA required design vs vendor offered evidence." },
  { id:"12.7.5", key:"paga-vdrl", title:"VDRL / Workload", parent:"12.7", kind:"CONTROL", authority:"SYSTEM_RESOLUTION", purpose:"PAGA deliverables and engineering/document workload." },
  { id:"12.7.6", key:"paga-lifecycle", title:"Lifecycle / Cost", parent:"12.7", kind:"CONTROL", authority:"SYSTEM_RESOLUTION", purpose:"PAGA FAT/IFAT/logistics/site/commissioning/SAT/cost chain." },
  { id:"12.7.7", key:"paga-resolution", title:"Technical Resolution Queue", parent:"12.7", kind:"TECHNICAL", authority:"SYSTEM_RESOLUTION", purpose:"Resolve PAGA technical questions from RFQ/STD/PHI/BOD/SPE/DWG/TC/vendor evidence before any executive escalation." },

  { id:"13.0", key:"review", title:"Independent Review / Audit", parent:null, kind:"REVIEW", authority:"REVIEW_CONTROL", purpose:"Claude/Grok/ChatGPT challenge, audit comments and dispositions." }
];

export const BID_NAV_MODULES = [
  "1.0","2.0","3.0","4.0","5.0","6.0","7.0","8.0","9.0","10.0"
].map(id=>PROJECT0550_MODULES.find(x=>x.id===id));

export const PAGA_VIEW_MODULES = [
  ["system","12.7.1"],["trace","12.7.2"],["proof","12.7.3"],["mto","12.7.4"],["vdrl","12.7.5"],["lifecycle","12.7.6"]
].map(([key,id])=>({key,...PROJECT0550_MODULES.find(x=>x.id===id)}));

export function moduleById(id){
  return PROJECT0550_MODULES.find(x=>x.id===id);
}
