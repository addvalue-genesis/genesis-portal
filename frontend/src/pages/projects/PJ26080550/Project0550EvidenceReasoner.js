import EVIDENCE_MEMORY from "./Project0550EvidenceMemory.json";
import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";
import { PROJECT0550_PRICING_BASELINE } from "./Project0550PricingBaseline";
import { PROJECT0550_VENDOR_OFFER_REGISTER } from "./Project0550VendorOfferRegister";

/*
PJ2608-0550 — CONTROLLED EVIDENCE REASONER

This engine is intentionally split into two roles:
1) source reader/extractor (human / AI / connector / API) creates an evidence packet;
2) deterministic code validates, binds, reconciles and proposes controlled updates.

It does NOT silently rewrite requirements, final quantities, commercial rules or release state.
Those remain human-controlled gates per Project0550EngineeringDoctrine.js.
*/

export const PROJECT0550_EVIDENCE_MEMORY = EVIDENCE_MEMORY;

const SOURCE_PRIORITY = {
  APPROVED_HUMAN_DECISION: 100,
  GOVERNING_PROJECT_SOURCE: 90,
  CURRENT_VENDOR_QUOTE: 80,
  CURRENT_PROJECT_CALCULATION: 75,
  CURRENT_MARKET_SANITY: 60,
  HISTORICAL_REFERENCE: 35,
  ASSUMPTION: 10
};

function num(v){
  return v === null || v === undefined || v === "" ? null : Number(v);
}

function sameValue(a,b){
  if(a === null || a === undefined || b === null || b === undefined) return a === b;
  if(typeof a === "number" || typeof b === "number") return Number(a) === Number(b);
  return JSON.stringify(a) === JSON.stringify(b);
}

function assertionKey(a){
  return [
    a.domain || "UNKNOWN",
    a.systemToken || "COMMON",
    a.priceLine || "NO_PRICE_LINE",
    a.location || "ALL",
    a.object || a.key || "UNNAMED"
  ].join("|");
}

function allAssertions(memory=PROJECT0550_EVIDENCE_MEMORY){
  return (memory.sources || []).flatMap(source =>
    (source.assertions || []).map(assertion => ({
      ...assertion,
      sourceId: source.sourceId,
      sourceType: source.sourceType,
      evidenceClass: source.evidenceClass,
      sourceRef: source.sourceRef,
      sourcePriority: SOURCE_PRIORITY[source.sourceType] || 0
    }))
  );
}

export function evidenceForSystem(systemToken,memory=PROJECT0550_EVIDENCE_MEMORY){
  return allAssertions(memory).filter(a => a.systemToken === systemToken);
}

export function evidenceForPriceLine(priceLine,memory=PROJECT0550_EVIDENCE_MEMORY){
  return allAssertions(memory).filter(a => a.priceLine === priceLine);
}

export function vendorOfferSubtotalForPriceLine(priceLine,memory=PROJECT0550_EVIDENCE_MEMORY){
  const rows = evidenceForPriceLine(priceLine,memory)
    .filter(a => a.domain === "VENDOR_OFFER" && Number.isFinite(num(a.total)));
  return rows.reduce((sum,row) => sum + Number(row.total),0);
}

export function validateProject0550EvidenceMemory(memory=PROJECT0550_EVIDENCE_MEMORY){
  const findings = [];
  const sourceIds = new Set();
  const assertionIds = new Set();

  for(const source of memory.sources || []){
    if(!source.sourceId){
      findings.push({severity:"BLOCKER",code:"EVD-SRC-001",message:"Evidence source has no sourceId."});
      continue;
    }
    if(sourceIds.has(source.sourceId)){
      findings.push({severity:"BLOCKER",code:"EVD-SRC-002",message:`Duplicate sourceId ${source.sourceId}.`});
    }
    sourceIds.add(source.sourceId);

    for(const a of source.assertions || []){
      if(!a.assertionId){
        findings.push({severity:"BLOCKER",code:"EVD-AST-001",sourceId:source.sourceId,message:"Assertion has no assertionId."});
      }else if(assertionIds.has(a.assertionId)){
        findings.push({severity:"BLOCKER",code:"EVD-AST-002",sourceId:source.sourceId,message:`Duplicate assertionId ${a.assertionId}.`});
      }else{
        assertionIds.add(a.assertionId);
      }
      if(a.systemToken && !PROJECT0550_SYSTEMS.some(s => s.token === a.systemToken)){
        findings.push({severity:"BLOCKER",code:"EVD-SYS-001",sourceId:source.sourceId,assertionId:a.assertionId,message:`Unknown 0550 system token ${a.systemToken}.`});
      }
      if(a.state === "TBC" && a.qty === 0){
        findings.push({severity:"BLOCKER",code:"EVD-QTY-001",sourceId:source.sourceId,assertionId:a.assertionId,message:"TBC quantity is encoded as zero."});
      }
    }

    if(source.sourceType === "CURRENT_VENDOR_QUOTE" && Number.isFinite(num(source.quotedTotalExVat))){
      const quotedItemTotal = (source.assertions || [])
        .filter(a => a.domain === "VENDOR_OFFER" && Number.isFinite(num(a.total)))
        .reduce((sum,a) => sum + Number(a.total),0);
      if(Math.abs(quotedItemTotal - Number(source.quotedTotalExVat)) > 0.01){
        findings.push({
          severity:"BLOCKER",
          code:"EVD-QT-001",
          sourceId:source.sourceId,
          message:`Quoted item total ${quotedItemTotal} does not reconcile to source total ${source.quotedTotalExVat}.`
        });
      }
    }
  }

  return {
    status: findings.some(f => f.severity === "BLOCKER") ? "BLOCKED" : "VALID",
    sourceCount: sourceIds.size,
    assertionCount: assertionIds.size,
    findings
  };
}

function currentFactIndex(memory=PROJECT0550_EVIDENCE_MEMORY){
  const index = new Map();
  for(const a of allAssertions(memory)){
    const key = assertionKey(a);
    const prior = index.get(key);
    if(!prior || a.sourcePriority > prior.sourcePriority){
      index.set(key,a);
    }
  }
  return index;
}

export function ingestProject0550EvidencePacket(packet,memory=PROJECT0550_EVIDENCE_MEMORY){
  const findings = [];
  const proposals = [];
  if(!packet || !packet.sourceId || !packet.sourceType || !Array.isArray(packet.assertions)){
    return {
      status:"REJECTED",
      findings:[{severity:"BLOCKER",code:"ING-001",message:"Packet requires sourceId, sourceType and assertions[]."}],
      proposals:[]
    };
  }

  const current = currentFactIndex(memory);
  const packetPriority = SOURCE_PRIORITY[packet.sourceType] || 0;

  for(const incoming of packet.assertions){
    if(!incoming.assertionId || !incoming.domain){
      findings.push({severity:"BLOCKER",code:"ING-002",assertionId:incoming.assertionId || null,message:"Incoming assertion requires assertionId and domain."});
      continue;
    }

    const key = assertionKey(incoming);
    const existing = current.get(key);
    const incomingValue = Object.prototype.hasOwnProperty.call(incoming,"value") ? incoming.value :
      Object.prototype.hasOwnProperty.call(incoming,"qty") ? incoming.qty :
      Object.prototype.hasOwnProperty.call(incoming,"total") ? incoming.total : null;
    const existingValue = existing ? (
      Object.prototype.hasOwnProperty.call(existing,"value") ? existing.value :
      Object.prototype.hasOwnProperty.call(existing,"qty") ? existing.qty :
      Object.prototype.hasOwnProperty.call(existing,"total") ? existing.total : null
    ) : null;

    let disposition = "NEW_EVIDENCE";
    if(existing && !sameValue(incomingValue,existingValue)){
      if(packetPriority > (existing.sourcePriority || 0)) disposition = "SUPERSEDE_CANDIDATE";
      else if(packetPriority === (existing.sourcePriority || 0)) disposition = "SOURCE_CONFLICT";
      else disposition = "LOWER_PRIORITY_REFERENCE";
    }

    const actionByDomain = {
      REQUIRED_QUANTITY:"PROPOSE_REQUIREMENT_QUANTITY_UPDATE",
      REQUIREMENT:"PROPOSE_REQUIREMENT_UPDATE",
      VENDOR_OFFER:"PROPOSE_VENDOR_RECONCILIATION",
      EXCLUSION:"PROPOSE_SCOPE_GAP_UPDATE",
      PROOF:"PROPOSE_PROOF_STATE_UPDATE",
      COST_INPUT:"PROPOSE_COST_INPUT_UPDATE",
      COMMERCIAL:"PROPOSE_COMMERCIAL_REVIEW"
    };

    const proposal = {
      proposalId:`PROP-${packet.sourceId}-${incoming.assertionId}`,
      sourceId:packet.sourceId,
      assertionId:incoming.assertionId,
      systemToken:incoming.systemToken || null,
      priceLine:incoming.priceLine || null,
      action:actionByDomain[incoming.domain] || "PROPOSE_CONTROLLED_STATE_REVIEW",
      disposition,
      currentAssertionId:existing?.assertionId || null,
      currentSourceId:existing?.sourceId || null,
      autoApply:false,
      approvalRequired:true,
      reason:"New evidence is converted into a reviewable proposal; project facts and release gates are never silently rewritten."
    };
    proposals.push(proposal);

    if(disposition === "SOURCE_CONFLICT"){
      findings.push({
        severity:"BLOCKER",
        code:"ING-CONFLICT",
        assertionId:incoming.assertionId,
        message:`Incoming evidence conflicts with equal-priority current evidence for ${key}.`
      });
    }
  }

  return {
    status: findings.some(f => f.severity === "BLOCKER") ? "REVIEW_BLOCKED" : "REVIEW_REQUIRED",
    findings,
    proposals
  };
}

export function runProject0550EvidenceReasoning(memory=PROJECT0550_EVIDENCE_MEMORY){
  const validation = validateProject0550EvidenceMemory(memory);
  const findings = [...validation.findings];
  const controls = [];

  // CCTV stale-data guard.
  const cctvRows = evidenceForSystem("TEL-CCTV",memory).filter(a => a.domain === "REQUIRED_QUANTITY" && Number.isFinite(num(a.qty)));
  const cctvKnown = cctvRows.reduce((sum,a) => sum + Number(a.qty),0);
  const baselineCctv = PROJECT0550_PRICING_BASELINE.cctvMarketSanity || {};
  if(cctvKnown !== Number(baselineCctv.quantityBasis?.knownCameraTotal)){
    findings.push({
      severity:"BLOCKER",
      code:"CCTV-STALE-001",
      message:`Evidence memory yields ${cctvKnown} known cameras but pricing baseline has ${baselineCctv.quantityBasis?.knownCameraTotal}.`,
      action:"Stop output generation and reconcile the controlled CCTV quantity state."
    });
  }else{
    controls.push({code:"CCTV-QTY-CONTROL",status:"PASS",message:`CCTV current known population = ${cctvKnown}; superseded 24-Ex-PTZ proxy remains blocked.`});
  }

  if(Number(baselineCctv.budgetaryCustomerSellThb) !== 4163873.68){
    findings.push({
      severity:"BLOCKER",
      code:"CCTV-STALE-002",
      message:"Current CCTV budgetary customer sell no longer matches the locked Rev07 control THB 4,163,873.68.",
      action:"Review the price build-up before generating ASK-TSI output."
    });
  }

  // Vendor source total and price-line binding checks.
  const jason = (memory.sources || []).find(s => s.sourceId === "SRC-JASON-QT2026-160");
  if(jason){
    const sum = (jason.assertions || []).reduce((t,a) => t + (Number.isFinite(num(a.total)) ? Number(a.total) : 0),0);
    controls.push({
      code:"JASON-QT-TOTAL",
      status:Math.abs(sum-Number(jason.quotedTotalExVat)) <= 0.01 ? "PASS" : "FAIL",
      message:`Jason mapped items THB ${sum.toLocaleString("en-US")} vs source total THB ${Number(jason.quotedTotalExVat).toLocaleString("en-US")}.`
    });

    for(const line of ["A1-08","A1-09","A1-10","A1-14","A1-15"]){
      const reg = PROJECT0550_VENDOR_OFFER_REGISTER[line];
      if(!reg || reg.quoteRef !== "QT2026-160"){
        findings.push({
          severity:"BLOCKER",
          code:"JASON-BIND-001",
          priceLine:line,
          message:`${line} is not bound to Jason QT2026-160 in the vendor-offer register.`,
          action:"Repair the controlled vendor binding before price output."
        });
      }
    }
  }

  // Composite AIS rule: evidence exists, but it must not be blindly added to A1-01.
  const aisRows = evidenceForSystem("TEL-AIS",memory).filter(a => a.domain === "VENDOR_OFFER");
  if(aisRows.length){
    controls.push({
      code:"AIS-COMPOSITE-CONTROL",
      status:"HOLD",
      message:"Current AIS quote evidence exists, but A1-01 is a composite customer-form line. Isolate any embedded historical AIS allowance before replacement/addition."
    });
  }

  const systemsWithEvidence = new Set(allAssertions(memory).map(a => a.systemToken).filter(Boolean));
  const linesWithEvidence = new Set(allAssertions(memory).map(a => a.priceLine).filter(Boolean));
  const blockers = findings.filter(f => f.severity === "BLOCKER").length;
  const warnings = findings.filter(f => f.severity === "WARN").length;

  return {
    memoryRevision:memory.revision,
    baselineRevision:PROJECT0550_PRICING_BASELINE.revision,
    status:blockers ? "BLOCKED" : warnings ? "CONDITIONAL" : "CONTROLLED",
    summary:{
      sources:validation.sourceCount,
      assertions:validation.assertionCount,
      systemsWithEvidence:systemsWithEvidence.size,
      priceLinesWithEvidence:linesWithEvidence.size,
      blockers,
      warnings
    },
    controls,
    findings
  };
}
