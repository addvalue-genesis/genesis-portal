// PJ2608-0553 | 02 First Principles/GEQ/PEQ execution adapter -> 10.2 B1/B2.
// GEQ-001…033 and PEQ-B1/B2 are FROZEN: no invented GEQ-034, rate, cycle or revision.
// MR Table 11 is a minimum REQUIREMENT list, not confirmed executed document copies.
// Works without a rate. Incomplete derivations MUST stay OPEN_INPUT and never overwrite
// the separate approved-source 964 MH / THB510k or B2 THB580k baseline.
import VDRL from "./bcVdrlSourceLedger0553.json";
import {deriveManHours,deriveDocumentHours} from "../../common/cost/derivationKernel";

const freeze = x => Object.freeze(x);
const MR_CODES=freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const GEQ=freeze(["GEQ-001","GEQ-004","GEQ-005","GEQ-006","GEQ-007","GEQ-009","GEQ-010","GEQ-011","GEQ-024","GEQ-025","GEQ-026"]);
const PEQ_B1=freeze(["PEQ-B1-001","PEQ-B1-002","PEQ-B1-003","PEQ-B1-004","PEQ-B1-005","PEQ-B1-006","PEQ-B1-007"]);
const PEQ_B2=freeze(Array.from({length:14},(_,i)=>"PEQ-B2-"+String(i+1).padStart(3,"0")));
const normalize=x=>String(x||"").trim().toLowerCase().replace(/\s+/g," ");
const kind=title=>{
 const s=normalize(title);
 if(/\b(fat|sat) report\b|inspection report|commissioning test report/.test(s))return "TEST_EVIDENCE_B3";
 if(/calculation|schematic|wiring|termination|general arrangement|installation detail|data sheet|drawing|radio coverage/.test(s))return "TECHNICAL_B1_OR_OEM";
 if(/vdr|register|report|meeting|dossier|index|table of contents|shipping|packing|certificate|catalog|brochure|schedule|contact directory/.test(s))return "DOCUMENT_CONTROL_B2_VENDOR_PAYLOAD";
 return "OWNER_TECHNICAL_REVIEW_PENDING";
};
const recurrence=record=>{
 const trigger=normalize(record.submissionTrigger);
 const title=normalize(record.title);
 if(/every\s*\d+\s*w/.test(trigger))return "SCHEDULE_RECURRENCE_DURATION_REQUIRED";
 if(/document register|vdrs/.test(title))return "UPDATE_UNTIL_APPROVED_DURATION_REQUIRED";
 if(/minute of meeting|kick of meeting/.test(title))return "MEETING_EVENT_COUNT_REQUIRED";
 if(/after test|before test/.test(trigger)||/fat report|sat report/.test(title))return "EVENT_QUANTITY_TO_CONFIRM";
 return "BASE_SOURCE_ROW_NOT_MULTIPLIED_BY_FACILITY";
};
const requirements=freeze(VDRL.records.map(row=>{
 const documentKey=row.mr+"|"+row.projectDocumentNo;
 const workKind=kind(row.title);
 const occurrenceRule=recurrence(row);
 // Quantity of source VDRL obligations = 1. Actual documents, submissions,
 // repeat events, approved revisions and as-built splits remain independently OPEN.
 const engineering=deriveManHours({
  applicable:1,quantity:null,unitHours:null,factor:null,
  evidence:row.evidenceUrl+" Table 11 "+row.sourceItem+" / "+row.id
 });
 const document=deriveDocumentHours({
  documents:null,initialHours:null,reviewCycles:null,cycleHours:null,finalHours:null,
  evidence:row.evidenceUrl+" Table 11 "+row.sourceItem+"; STD003 §4.5/§4.6 / GEQ-009/024"
 });
 return freeze({
  ...row,documentKey,moduleId:"bid.engineering.equations.b1-b2."+row.id.toLowerCase(),
  sourceRequirementQuantity:1,documentInstances:null,documentIssues:null,revisionCycles:null,
  projectTitleType:normalize(row.title),workKind,occurrenceRule,
  documentControlOwner:"B2", // Control/transmittal only; technical content stays separate.
  technicalWorkOwner:workKind==="TEST_EVIDENCE_B3"?"B3_OR_OEM_FOR_TEST_CONTENT":
   workKind==="TECHNICAL_B1_OR_OEM"?"B1_OR_OEM_SCOPE_TO_VERIFY":"OEM_OR_ADDVALUE_CONTENT_TO_VERIFY",
  technicalWorkState:"CONTRACTUAL_VENDOR_DELIVERABLE_ADDVALUE_INCREMENT_TO_VERIFY",
  documentControlEquationIds:freeze(["GEQ-009","GEQ-024","PEQ-B2-001","PEQ-B2-003","PEQ-B2-004"]),
  technicalEquationIds:freeze(["GEQ-005","PEQ-B1-003"]),
  engineeringEquationProof:engineering,documentationEquationProof:document,
  calculatedB1MH:engineering.value,calculatedB2MH:document.value,
  technicalCostTHB:null,documentCostTHB:null,pricePostingAllowed:false
 });
}));
const documentKeyCounts=requirements.reduce((m,row)=>{
 m[row.documentKey]=(m[row.documentKey]||0)+1;
 return m;
},{});
const duplicateKeys=Object.keys(documentKeyCounts).filter(key=>documentKeyCounts[key]>1);
const totals=freeze({
 sourceRows:requirements.length,uniqueTitleTypes:new Set(requirements.map(x=>x.projectTitleType)).size,
 sourceDocumentKeys:new Set(requirements.map(x=>x.documentKey)).size,
 uniqueDocumentInstances:null,projectReportOccurrences:null,revisionCycles:null,
 approvalA:requirements.filter(x=>x.approvalClass==="A").length,
 informationI:requirements.filter(x=>x.approvalClass==="I").length,
 blankApproval:requirements.filter(x=>x.approvalClass===null).length,
 actualB1MH:null,actualB2MH:null,verifiedB1CostTHB:null,verifiedB2CostTHB:null
});
const byMr=freeze(Object.fromEntries(MR_CODES.map(mr=>[mr,freeze({
 mr,sourceRows:requirements.filter(x=>x.mr===mr).length,
 A:requirements.filter(x=>x.mr===mr&&x.approvalClass==="A").length,
 I:requirements.filter(x=>x.mr===mr&&x.approvalClass==="I").length,
 blank:requirements.filter(x=>x.mr===mr&&x.approvalClass===null).length,
 rows:freeze(requirements.filter(x=>x.mr===mr))
})])));
const rules=freeze([
 freeze({id:"VAL-01",title:"Document Identity / unique source contract keys",status:duplicateKeys.length?"FAILED_SOURCE_IDENTITY":"PASS_SOURCE_IDENTITY_ONLY",detail:"143 distinct MR+project document numbers; title type is NOT a physical document instance; do not infer one issue or one facility copy."}),
 freeze({id:"VAL-02",title:"Cost ownership / OEM vs B1/B2/B3",status:"TRACE_BOUNDARY_PARTIAL",detail:"B2 owns document-control event. B1/OEM owns technical content subject to award scope; B3/OEM test content. Per-document author responsibility still unverified."}),
 freeze({id:"VAL-03",title:"Revision evidence / schedule vs paid hours",status:"OPEN_REVIEW_CYCLES",detail:"PTTEP STD003 review 10 working days is elapsed review constraint, NOT paid man-days; fixed approval/revision count does not exist. Per-document N_cycles is OPEN_INPUT."}),
 freeze({id:"VAL-04",title:"Independent baseline reconciliation",status:"OPEN_PRODUCTIVITY_AND_ROLE_RATES",detail:"GEQ/PEQ execution must derive MH independently. 964 WBS MH and 510k/580k Working SELL cannot be forced into computed values."})
]);
export function selectBcB1B2EquationExecution0553(b1WorkLines=[]){
 const b1=freeze(b1WorkLines.filter(x=>x.code==="B1"&&x.id.startsWith("B1-WBS-")).map(line=>{
  // WBS task line is ONE SOURCE ROW, NOT evidence of Q work objects or productivity.
  const calc=deriveManHours({applicable:1,quantity:null,unitHours:null,factor:null,
   evidence:line.sourceRef+"; GEQ-005 / PEQ-B1-001/003"});
  return freeze({
   id:line.id,group:line.group,name:line.name,baselineMH:line.quantity,
   baselineRoles:line.roleMH,calculatedMH:calc.value,equationStatus:calc.status,
   missingInputs:calc.missing,GEQ:"GEQ-005",PEQ:"PEQ-B1-003",
   owner:"B1_ADDITIONAL_SCOPE_VS_OEM_UNVERIFIED",costTHB:null
  });
 }));
 const baselineMH=b1.reduce((sum,x)=>sum+x.baselineMH,0);
 const validation=freeze([
  ...rules,
  freeze({id:"VAL-05",title:"Source and baseline integrity",status:
   requirements.length===143&&totals.uniqueTitleTypes===38&&totals.approvalA===102&&
   totals.informationI===37&&totals.blankApproval===4&&duplicateKeys.length===0&&
   (!b1.length||(b1.length===27&&baselineMH===964))?"PASS_SOURCE_RECONCILIATION":"FAILED_SOURCE_RECONCILIATION",
   detail:"MR1-4 source 37+36+35+35, A/I/blank 102/37/4, 38 title types; WBS B1 27/964 if provided. This is NOT productivity approval."
  })
 ]);
 if(validation[validation.length-1].status!=="PASS_SOURCE_RECONCILIATION")
  throw Error("02 VDRL / 10.2 B1 source integrity failed");
 return freeze({
  moduleId:"bid.engineering.equations.b1-b2",workflowNumber:"02",
  kernelPath:"frontend/src/common/cost/derivationKernel.js",equationRegister:"GEQ-001…033; PEQ-B1-001…007; PEQ-B2-001…014",
  GEQ,PEQ_B1,PEQ_B2,sourceUrl:VDRL.sourceUrl,sourceRevision:VDRL.sourceRevision,
  revisionControl:freeze({reviewDaysWorking:10,contractorResubmitDaysCalendar:15,
   reviewDaysAreBillableMH:false,reviewCyclesRequiredForMH:true,
   standardRevisionContractBinding:"MR0001 references GEN003-R01; file copy internally labeled R02, resolve precedence",
   source:"PTTEP GEN-003 §4.6.4/5; GEN-004 §7.2.5; MR0001 Rev.C1 §10/§11 Attachment 1"}),
  totals,byMr,records:requirements,b1Activities:b1,b1BaselineMH:b1.length?baselineMH:null,
  b1WorkingSellTHB:510000,b2WorkingSellTHB:580000,
  managementB2ScenarioTHB:200000,managementScenarioState:"TEMP_SEPARATE_NOT_POSTED",
  b1CalculatedMH:null,b2CalculatedMH:null,b1VerifiedCostTHB:null,b2VerifiedCostTHB:null,
  validation,customerReleaseAllowed:false,postToCostLedger:false,
  b3Handoff:freeze({status:"READY_FOR_SEPARATE_B3_AUDIT_NOT_B1B2_PROVEN",
    rule:"B3 test labour/physical evidence is not charged again in B1/B2. Requires ITP event keys, Bangkok FAT vs OEM pretest, 5-trip offshore SAT/COMM evidence and no MOB/DEMOB double count."})
 });
}
