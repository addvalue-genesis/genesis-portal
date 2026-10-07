/*
PJ2608-0550 — PART B DERIVATION / EQUATION TRACE

Purpose
-------
Make Part B auditable from First Principles + Constraint-Based Engineering +
Parametric Cost using the existing COMMON/GENERIC equation registry.

This file DOES NOT calculate a second Part B.
It references PROJECT0550_PART_B_MODEL for controlled values and
Project0550EquationCatalog / etm_equation_registry for reusable math.

Each line shows:
Source obligation / quantity-work driver -> COMMON/GENERIC equation chain ->
controlled cost basis -> project commercial treatment -> working customer price.
*/

import {
  PROJECT0550_PART_B_MODEL,
  PROJECT0550_PART_B_POLICY
} from "./Project0550PartBModel";
import { controlledEquationsByIds } from "./Project0550EquationCatalog";

const S=1+PROJECT0550_PART_B_POLICY.serviceSamtelMarkup;
const F=PROJECT0550_PART_B_POLICY.goodsCommercialFactor;

const TRACE = {
  B1:{
    requirementBasis:"Engineering / detailed design / CAL-SDY-RPT / interface engineering / VDRL / PM / vendor coordination required by project scope and deliverable lifecycle.",
    driverBasis:"Applicable engineering objects + interface edges + document issue/revision lifecycle + common project work.",
    equationIds:["GEQ-001","GEQ-004","GEQ-005","GEQ-008","GEQ-009","GEQ-018","GEQ-020","GEQ-021","GEQ-024","GEQ-025"],
    commercialFormula:`P_B1 = P_ADDVALUE_service × (1 + 5%) = P_ADDVALUE_service × ${S.toFixed(2)}`,
    valueBasis:"ADVALUE professional service sell is recovered from the controlled Rev04 parametric workbook; upstream UMH/rate calibration remains a controlled model input, not recreated here."
  },
  B2:{
    requirementBasis:"Transportation / freight / logistics responsibility follows Incoterm, packing, shipping, import/customs and inland handoff scope.",
    driverBasis:"Cargo/shipment + origin/destination + Incoterm + weight/dimensions + duty/insurance/forwarder inputs.",
    equationIds:["GEQ-001","GEQ-012","GEQ-018","GEQ-021","GEQ-033"],
    commercialFormula:`P_B2,known = C_procured,known × 1.20 / 0.95 = C_procured,known × ${F.toFixed(6)}`,
    valueBasis:"Known non-PAGA procured logistics only. PAGA FCA Wertheim onward logistics remains TBC and is not treated as zero."
  },
  B3:{
    requirementBasis:"Training obligation and handover technical delivery derived from MR/SPE/training scope and vendor/ADDVALUE responsibility.",
    driverBasis:"Applicable course/session × preparation/delivery/closeout quantity × role UMH/rate.",
    equationIds:["GEQ-001","GEQ-004","GEQ-005","GEQ-008","GEQ-018","GEQ-021","GEQ-033"],
    commercialFormula:`P_B3 = P_ADDVALUE_training × (1 + 5%) = P_ADDVALUE_training × ${S.toFixed(2)}`,
    valueBasis:"Controlled parametric training service from Rev04; final course count/duration/venue/OEM role remains open."
  },
  B4:{
    requirementBasis:"FAT / IFAT / specialist field assistance / Pre-Com / SAT / commissioning support required by lifecycle obligations and vendor boundary.",
    driverBasis:"Required event keys + role + crew/day/MH + trip grouping + mobilisation + OEM/ADDVALUE responsibility.",
    equationIds:["GEQ-001","GEQ-004","GEQ-005","GEQ-006","GEQ-007","GEQ-008","GEQ-013","GEQ-014","GEQ-015","GEQ-016","GEQ-017","GEQ-018","GEQ-023","GEQ-033"],
    commercialFormula:`P_B4,known = P_ADDVALUE_retained × (1 + 5%) = P_ADDVALUE_retained × ${S.toFixed(2)}`,
    valueBasis:"Selected INDUSTRONIC factory FAT is already inside A1-05 vendor package; retained ADDVALUE work remains B4. PAGA site OEM attendance is TBC."
  },
  B5:{
    requirementBasis:"Pre-commissioning / commissioning / start-up spare requirement is a separate procurement class from installed equipment and 2Y/10Y spares.",
    driverBasis:"Required installed quantity + commissioning consumption/criticality + OEM recommendation.",
    equationIds:["GEQ-001","GEQ-002","GEQ-012","GEQ-032","GEQ-033"],
    commercialFormula:`P_B5,known = C_spares,known × 1.20 / 0.95 = C_spares,known × ${F.toFixed(6)}`,
    valueBasis:"Known non-PAGA startup spares only; PAGA startup/commissioning spare list remains TBC."
  },
  B6:{
    requirementBasis:"Special tools required for operation/maintenance after reconciling tools already included in vendor packages.",
    driverBasis:"Maintenance task/OEM proprietary requirement × quantity per crew/site; deduct vendor-included tools.",
    equationIds:["GEQ-001","GEQ-002","GEQ-012","GEQ-032","GEQ-033"],
    commercialFormula:`P_B6,known = C_tools,known × 1.20 / 0.95 = C_tools,known × ${F.toFixed(6)}`,
    valueBasis:"Known non-PAGA tool cost only; PAGA tools already included in selected INDUSTRONIC offer are removed from separate B6 cost."
  },
  B7:{
    requirementBasis:"Site survey / existing-condition verification is triggered by missing physical inputs, interfaces, tie-ins and measurement needs.",
    driverBasis:"Survey campaign/site/location + specialist measurement + crew-day + travel + report closeout.",
    equationIds:["GEQ-001","GEQ-004","GEQ-005","GEQ-006","GEQ-008","GEQ-013","GEQ-014","GEQ-015","GEQ-016","GEQ-017","GEQ-018","GEQ-021","GEQ-033"],
    commercialFormula:"P_B7 = professional survey sell + SAMTEL 5% layer + explicit survey cash/reimbursable",
    valueBasis:"Integrated survey campaign model; avoids per-system duplicate travel/campaign cost."
  },
  B8:{
    requirementBasis:"Permit / licence / import-export / regulatory coordination triggered by offered equipment, country/authority requirement, type approval and responsibility.",
    driverBasis:"Applicable permit/licence type + application/coordination workload + official/agent pass-through fee.",
    equationIds:["GEQ-001","GEQ-004","GEQ-005","GEQ-008","GEQ-018","GEQ-021","GEQ-033"],
    commercialFormula:"P_B8 = professional coordination customer layer + official/agent pass-through at 0% markup",
    valueBasis:"Professional service and pass-through cash are kept separate; current fee pools must later be replaced by actual authority/agent values."
  },
  B9:{
    requirementBasis:"Insurance / risk-transfer obligations triggered by project/personnel/travel/tools exposure and contract responsibility.",
    driverBasis:"Coverage class + exposure/premium + policy administration/certification workload.",
    equationIds:["GEQ-001","GEQ-004","GEQ-005","GEQ-008","GEQ-018","GEQ-021","GEQ-033"],
    commercialFormula:"P_B9 = pass-through insurance premiums at 0% markup + incremental administration/service customer layer",
    valueBasis:"Current premiums are working pools until broker/insurer quotations and main-contractor overlap are confirmed."
  }
};

export function partBDerivationLine(code){
  const model=PROJECT0550_PART_B_MODEL[code];
  const trace=TRACE[code];
  if(!model||!trace) return null;
  return {
    ...model,
    ...trace,
    equations:controlledEquationsByIds(trace.equationIds),
    controlledComponents:model.components||[],
    openItems:model.openItems||[]
  };
}

export function project0550PartBDerivationRows(){
  return ["B1","B2","B3","B4","B5","B6","B7","B8","B9"].map(partBDerivationLine).filter(Boolean);
}

export const PROJECT0550_PART_B_DERIVATION_RULE =
  "Part B is not a manual lump-sum table. It is a commercial projection of source-backed obligations -> applicability/context -> quantity/work drivers -> COMMON/GENERIC workload/cost equations -> controlled cost basis -> project commercial treatment. Open/TBC drivers remain visible and are never converted to zero.";
