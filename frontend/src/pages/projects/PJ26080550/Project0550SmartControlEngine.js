import { PROJECT0550_ENGINEERING_DOCTRINE } from "./Project0550EngineeringDoctrine";

const CLOSED = new Set(["FACT","DERIVED","PASS","APPROVED","CONTROLLED","READY","NOT_APPLICABLE"]);
const SOFT = new Set(["WORKING","PARTIAL","PRELIMINARY","ASSUMPTION"]);
const OPEN = new Set(["OPEN","TBC","NOT_FOUND","SOURCE_CONFLICT","MISSING"]);

function stateOf(value){
  if(value == null) return "MISSING";
  if(typeof value === "string") return value.toUpperCase();
  return String(value.state || "MISSING").toUpperCase();
}

function isClosed(value){ return CLOSED.has(stateOf(value)); }
function isSoft(value){ return SOFT.has(stateOf(value)); }
function isOpen(value){ return OPEN.has(stateOf(value)); }

function severityFor(intent, hard=false){
  if(hard) return "BLOCKER";
  return intent === "BUDGETARY" ? "WARN" : "BLOCKER";
}

function add(findings, severity, code, stage, message, action){
  findings.push({severity,code,stage,message,action});
}

function valueKnown(value){
  return value !== null && value !== undefined && value !== "";
}

function constraintSummary(constraints=[]){
  const open = constraints.filter(c=>isOpen(c)||isSoft(c));
  const conflict = constraints.filter(c=>stateOf(c)==="SOURCE_CONFLICT");
  return {total:constraints.length,open:open.length,conflict:conflict.length};
}

export function evaluateProject0550Object(record,{releaseIntent="PRICE_FREEZE"}={}){
  const c = record.control || {};
  const findings = [];
  const intent = releaseIntent;
  const constraints = constraintSummary(c.constraints || []);

  // Source / requirement gates
  if(!isClosed(c.sourceEvidence)){
    add(findings,severityFor(intent,true),"SRC-001","SOURCE_EVIDENCE",
      "Source/evidence is not controlled. Missing evidence must not become zero scope.",
      "Bind a 0550 source or explicitly hold the scope open.");
  }
  if(!isClosed(c.requirement)){
    add(findings,severityFor(intent,true),"REQ-001","REQUIREMENT",
      "Requirement is not controlled.",
      "Bind requirement to 0550 governing evidence.");
  }
  if(!isClosed(c.fundamentalNeed)){
    add(findings,severityFor(intent,false),"FP-001","FUNDAMENTAL_NEED",
      "Fundamental need has not been resolved.",
      "State what performance / purpose the system must achieve before selecting solution.");
  }

  // Constraint engine
  if(constraints.conflict){
    add(findings,"BLOCKER","CON-001","CONSTRAINT",
      constraints.conflict+" source conflict(s) exist; silent selection is prohibited.",
      "Create explicit conflict disposition with evidence / approval.");
  }
  if(constraints.open){
    add(findings,severityFor(intent,false),"CON-002","CONSTRAINT",
      constraints.open+" technical/non-technical constraint(s) remain open or preliminary.",
      "Close or explicitly disposition each constraint before the selected release intent.");
  }

  // Engineering inputs / proof
  if(isOpen(c.engineeringInputs)){
    add(findings,severityFor(intent,false),"INP-001","ENGINEERING_INPUT",
      "Required engineering inputs are open.",
      "Complete controlled inputs or retain an explicit assumption for budgetary use only.");
  }
  if(c.proof?.required && !isClosed(c.proof)){
    add(findings,severityFor(intent,false),"PRF-001","PROOF",
      "Required CAL / Study / RPT proof has not passed.",
      "Complete the required proof before engineering/final release.");
  }

  // Physical object / quantity logic
  if(isOpen(c.physicalObjects)){
    add(findings,severityFor(intent,false),"OBJ-001","PHYSICAL_OBJECT",
      "Required physical/work object set is not controlled.",
      "Resolve architecture/object classes before final quantity release.");
  }
  if(isOpen(c.quantityDriver)){
    add(findings,severityFor(intent,false),"QTY-001","QUANTITY_DRIVER",
      "Quantity driver is open.",
      "Bind quantity to a source-backed engineering/work driver.");
  }

  const requiredQtyState = stateOf(c.requiredMto);
  const requiredQty = c.requiredMto?.quantity;
  if(requiredQtyState !== "NOT_APPLICABLE" && (isOpen(c.requiredMto) || !valueKnown(requiredQty))){
    add(findings,severityFor(intent,false),"QTY-002","REQUIRED_MTO",
      "Final required quantity is not controlled; it must not be interpreted as zero.",
      "Keep quantity TBC/PRELIMINARY until the driver/proof chain releases it.");
  }
  if(requiredQty === 0 && ["TBC","OPEN","NOT_FOUND","MISSING"].includes(requiredQtyState)){
    add(findings,"BLOCKER","QTY-003","REQUIRED_MTO",
      "Unknown quantity is encoded as numeric zero.",
      "Replace zero with null/TBC and preserve the open scope.");
  }

  // Vendor reconciliation
  const offeredQty = c.vendorOffer?.quantity;
  if(valueKnown(offeredQty) && !valueKnown(requiredQty)){
    add(findings,severityFor(intent,false),"VND-001","VENDOR_RECONCILIATION",
      "Vendor offered quantity exists while required quantity is not released.",
      "Do not adopt vendor quantity as the project requirement; complete required-MTO derivation first.");
  }
  if(valueKnown(offeredQty) && valueKnown(requiredQty) && Number(offeredQty)!==Number(requiredQty) && !isClosed(c.reconciliation)){
    add(findings,severityFor(intent,false),"VND-002","VENDOR_RECONCILIATION",
      "Vendor offered quantity differs from required quantity with no approved disposition.",
      "Reconcile shortage/excess and record technical/commercial treatment.");
  }

  // Work, document and lifecycle controls
  const lifecycleChecks = [
    ["WORK_RESOURCE",c.workResource,"Work/resource model"],
    ["DOCUMENT_QA",c.documentQa,"Document/QA model"],
    ["FAT_IFAT",c.fatIfat,"FAT/IFAT obligation"],
    ["LOGISTICS_REGULATORY",c.logisticsRegulatory,"Logistics/regulatory gate"],
    ["SITE_READINESS",c.siteReadiness,"Site-readiness gate"],
    ["INSTALL_PRECOM",c.installPrecom,"Installation/pre-commissioning gate"],
    ["SAT_COMMISSIONING",c.satCommissioning,"SAT/integration/commissioning gate"],
    ["HANDOVER_WARRANTY",c.handoverWarranty,"Handover/warranty gate"]
  ];
  lifecycleChecks.forEach(([stage,value,label])=>{
    if(isOpen(value)){
      const hardAt = intent==="FINAL" || (intent==="PRICE_FREEZE" && ["WORK_RESOURCE","LOGISTICS_REGULATORY"].includes(stage));
      add(findings,hardAt?"BLOCKER":"WARN","LIFE-"+stage,stage,
        label+" remains open.",
        "Close, exclude with evidence, or explicitly price/allocate the open lifecycle obligation.");
    }
  });

  // Parametric cost rules
  const costState = stateOf(c.costScheduleRisk);
  const costValue = c.costScheduleRisk?.costValue;
  if(costValue === 0 && ["TBC","OPEN","NOT_FOUND","MISSING"].includes(costState)){
    add(findings,"BLOCKER","COST-001","COST_SCHEDULE_RISK",
      "Unknown/TBC cost is encoded as zero.",
      "Use null/TBC or a controlled allowance; never silently convert uncertainty to zero.");
  }
  if((intent==="PRICE_FREEZE" || intent==="FINAL") && !valueKnown(costValue) && costState!=="NOT_APPLICABLE"){
    add(findings,"BLOCKER","COST-002","COST_SCHEDULE_RISK",
      "No controlled cost value is available for price freeze/final release.",
      "Complete the parametric/vendor/allowance basis and record cost state.");
  }
  if(intent==="BUDGETARY" && !valueKnown(costValue) && !["NOT_APPLICABLE","WORKING","PARTIAL"].includes(costState)){
    add(findings,"WARN","COST-003","COST_SCHEDULE_RISK",
      "Budgetary cost is incomplete.",
      "Use an explicit allowance or keep the line visibly unpriced.");
  }

  // Commercial treatment
  if((intent==="PRICE_FREEZE" || intent==="FINAL") && !isClosed(c.commercialTreatment) && !isSoft(c.commercialTreatment)){
    add(findings,"BLOCKER","COM-001","COMMERCIAL_TREATMENT",
      "Commercial treatment is not controlled.",
      "Bind Base / Separate / Option / Excluded / Call-off treatment and owner.");
  }
  if((intent==="PRICE_FREEZE" || intent==="FINAL") && isSoft(c.commercialTreatment)){
    add(findings,"BLOCKER","COM-002","COMMERCIAL_TREATMENT",
      "Commercial treatment is still working/preliminary.",
      "Approve the final customer treatment before price freeze.");
  }

  const blockers = findings.filter(f=>f.severity==="BLOCKER");
  const warnings = findings.filter(f=>f.severity==="WARN");

  // Evidence confidence informs review priority only; it never auto-releases.
  const confidenceSignals = [
    c.sourceEvidence,c.requirement,c.fundamentalNeed,c.interfaceContext,c.engineeringInputs,
    c.proof,c.architecture,c.physicalObjects,c.quantityDriver,c.requiredMto,c.workResource,
    c.documentQa,c.logisticsRegulatory,c.costScheduleRisk,c.commercialTreatment
  ].map(stateOf);
  const scoreMap = {FACT:1,DERIVED:.9,PASS:1,APPROVED:1,CONTROLLED:1,READY:1,NOT_APPLICABLE:1,WORKING:.65,PARTIAL:.5,PRELIMINARY:.4,ASSUMPTION:.35,TBC:.1,OPEN:.1,NOT_FOUND:0,SOURCE_CONFLICT:0,MISSING:0};
  const confidence = Math.round(100 * confidenceSignals.reduce((a,s)=>a+(scoreMap[s]??0),0) / confidenceSignals.length);

  return {
    ...record,
    evaluation:{
      releaseIntent:intent,
      status:blockers.length?"BLOCKED":warnings.length?"CONDITIONAL":"READY",
      blockers:blockers.length,
      warnings:warnings.length,
      confidence,
      findings
    }
  };
}

export function evaluateProject0550Portfolio(records,options={}){
  const objects = records.map(r=>evaluateProject0550Object(r,options));
  const findings = objects.flatMap(o=>o.evaluation.findings.map(f=>({...f,objectId:o.id,object:o.object})));
  const blockers = findings.filter(f=>f.severity==="BLOCKER").length;
  const warnings = findings.filter(f=>f.severity==="WARN").length;
  return {
    doctrineId:PROJECT0550_ENGINEERING_DOCTRINE.id,
    releaseIntent:options.releaseIntent || "PRICE_FREEZE",
    objects,
    findings,
    summary:{
      objects:objects.length,
      blockers,
      warnings,
      ready:objects.filter(o=>o.evaluation.status==="READY").length,
      conditional:objects.filter(o=>o.evaluation.status==="CONDITIONAL").length,
      blocked:objects.filter(o=>o.evaluation.status==="BLOCKED").length,
      averageConfidence:Math.round(objects.reduce((a,o)=>a+o.evaluation.confidence,0)/Math.max(1,objects.length))
    },
    status:blockers?"BLOCKED":warnings?"CONDITIONAL":"READY"
  };
}

export function calculateParametricCost(input={}){
  const required = ["quantity","unitMaterialCost","unitManhours","factor","loadedLaborRate"];
  const missingInputs = required.filter(k=>!valueKnown(input[k]));
  if(missingInputs.length){
    return {state:"TBC",missingInputs,materialCost:null,manhours:null,laborCost:null,totalDirectCost:null};
  }
  const quantity = Number(input.quantity);
  const materialCost = quantity * Number(input.unitMaterialCost);
  const manhours = quantity * Number(input.unitManhours) * Number(input.factor);
  const laborCost = manhours * Number(input.loadedLaborRate);
  const otherDirectCost = valueKnown(input.otherDirectCost) ? Number(input.otherDirectCost) : 0;
  return {state:"DERIVED",missingInputs:[],materialCost,manhours,laborCost,totalDirectCost:materialCost+laborCost+otherDirectCost};
}

function median(values){
  const s=[...values].sort((a,b)=>a-b);
  if(!s.length) return null;
  const m=Math.floor(s.length/2);
  return s.length%2?s[m]:(s[m-1]+s[m])/2;
}

export function proposeCalibration(history=[],{minSamples=5}={}){
  const approved = history.filter(x=>x && x.approved===true && Number(x.estimated)>0 && Number(x.actual)>=0);
  if(approved.length<minSamples){
    return {status:"INSUFFICIENT_HISTORY",sampleCount:approved.length,minSamples,candidateFactor:null,dispersion:null,autoApply:false};
  }
  const ratios=approved.map(x=>Number(x.actual)/Number(x.estimated));
  const factor=median(ratios);
  const deviations=ratios.map(x=>Math.abs(x-factor));
  const mad=median(deviations);
  return {
    status:"REVIEW_REQUIRED",
    sampleCount:approved.length,
    candidateFactor:Number(factor.toFixed(4)),
    dispersion:Number((mad||0).toFixed(4)),
    confidence:mad<=0.1?"HIGH":mad<=0.25?"MEDIUM":"LOW",
    autoApply:false,
    rule:"Learning may propose calibration only; adoption requires engineering/commercial approval."
  };
}
