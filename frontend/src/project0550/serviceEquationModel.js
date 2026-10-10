import { SERVICE_EQUATIONS } from "../common/cost/serviceEquations";
export { SERVICE_EQUATIONS } from "../common/cost/serviceEquations";
// PJ2608-0550 Service / Cost Equation Model binding
// Recovered from PJ2608-0550_Service-Equation-Model_Rev00_20260914.xlsx.
// This is a calculation-method source, not permission to invent missing driver values.
// Blank/OWNER OPEN inputs remain open; TBC is not zero.

export const SERVICE_EQUATION_SOURCE = {
  id: "0550-SERVICE-EQUATION-REV00",
  file: "PJ2608-0550_Service-Equation-Model_Rev00_20260914.xlsx",
  date: "14-Sep-2026",
  sheets: ["Summary", "Rates", "Engineering", "Events", "Trips", "Compliance", "Equations", "Historical", "Sources", "Original0553"],
  purpose:
    "Bottom-up engineering/service workload model for the 19 ASK telecom systems. It links work objects, roles, man-hours, events, trips, OEM cash cost and selling-rate logic.",
  control:
    "REUSE METHOD — REBIND PARTICULAR INPUTS. PJ2608-0553 equations/rates are methodology or historical calibration only unless separately adopted for 0550.",
  keyRule: "Unknown / OWNER OPEN / TBC inputs do not become zero and must not be force-allocated to match a lump-sum allowance."
};

const byId = Object.fromEntries(SERVICE_EQUATIONS.map((x) => [x.id, x]));

function methods(ids) {
  return ids.map((id) => byId[id]).filter(Boolean);
}

export const SERVICE_LINE_DERIVATION = {
  B1: {
    sourceModel: "Engineering sheet — 19 systems + common work objects",
    recoveredStructure:
      "System rows DES/DOC/REV for each system plus COM-PM, COM-COORD, COM-INT, COM-DC, COM-PERMIT, COM-EX, COM-FINAL and COM-SUPPORT.",
    sourceColumns:
      "Quantity · Initial MH/unit · Review cycles · MH/cycle/unit · Final MH/unit · Total MH · Cost USD/MH · Sell USD/MH · Internal Cost · ADDVALUE Sell · Evidence/driver",
    methods: methods(["E01","E02","E03","E04","E07","E09","E10","E14"]),
    driverSummary:
      "Requirement/work-object count + document lifecycle + project duration/FTE + controlled interfaces + role MH/rates.",
    currentStatus:
      "RECOVERED MODEL / DRIVER VALUES PARTLY OWNER OPEN",
    currentAllowanceMeaning:
      "THB 24M is the current budgetary control allowance. It is not yet demonstrated as the closed sum of the recovered bottom-up rows."
  },
  B2: {
    sourceModel: "Rev10 B_Service_Buildup + vendor Incoterms / logistics gates",
    recoveredStructure:
      "Shipment origin, cargo, Incoterm, export-side charges, forwarding, consolidation and applicable trip/cash costs.",
    sourceColumns:
      "Origin · Incoterm · cargo/weight/volume · freight/forwarder quote · export handling · insurance/tax boundary",
    methods: methods(["E08","E09"]),
    driverSummary:
      "Vendor delivery terms + shipment origin + cargo dimensions/weight + route + forwarding/export-side quotations.",
    currentStatus:"ALLOWANCE / FORWARDER QUOTE AND ROUTE OPEN",
    currentAllowanceMeaning:"THB 20M is a package-level logistics allowance pending route/Incoterm and freight evidence."
  },
  B3: {
    sourceModel: "Events sheet — training events by system",
    recoveredStructure:
      "System training events; recovered model explicitly separates sessions/days/trainers from trainee count. PAGA/CCTV include three trainee categories of five.",
    sourceColumns:
      "Events/sessions · Days/event · Trainers · Hours/day · Prep/closeout MH · Trip ID · OEM/test cash · role rates",
    methods: methods(["E05","E07","E08","E09","E10","E16"]),
    driverSummary:
      "Approved course map × sessions × duration × trainers + preparation/closeout + trainer travel/materials + OEM training charges.",
    currentStatus:"RECOVERED MODEL / COURSE MAP AND VENDOR TRAINING QUOTES OPEN",
    currentAllowanceMeaning:"THB 7M is the current training allowance, not a 19× blanket multiplication."
  },
  B4: {
    sourceModel: "Events + Trips sheets — FAT/SAT/commissioning campaigns",
    recoveredStructure:
      "Per-system FAT and SAT/commissioning event rows, plus trip records. AIS FAT/SAT is charge-to-ADDVALUE=0 in the recovered model because offshore vendor executes that scope.",
    sourceColumns:
      "Events · Days/event · Crew · Hours/day · Prep/closeout MH · Person-days · Paid MH · Sell USD/MD · Trip ID · OEM/test sell",
    methods: methods(["E05","E06","E07","E08","E09","E10","E15"]),
    driverSummary:
      "Campaign/event count × days × crew + prep/closeout + specialist day rates + MOB/DEMOB/travel/cash/OEM/test costs.",
    currentStatus:"RECOVERED MODEL / EVENT CREW-DAYS AND TRIP PLAN PARTLY OPEN",
    currentAllowanceMeaning:
      "THB 28M is the current campaign allowance. External specialist minimum USD 1,000/working MD is only one driver; travel, permit, insurance, standby and OEM rates are separate."
  },
  B5: {
    sourceModel:"Rev10 B_Service_Buildup + OEM startup spare lists",
    recoveredStructure:"Startup / pre-commissioning / commissioning spare pool only; explicitly separate from Part A and C2/C3.",
    sourceColumns:"System · OEM spare item · Qty · Unit price · currency · source quotation · inclusion/deduction",
    methods: methods(["E09","E17"]),
    driverSummary:"OEM-recommended startup/commissioning spares by system, priced from vendor evidence.",
    currentStatus:"ALLOWANCE / OEM ITEMIZED LISTS OPEN",
    currentAllowanceMeaning:"THB 10M is a spare allowance pending itemized OEM lists; no arbitrary system allocation."
  },
  B6: {
    sourceModel:"Rev10 B_Service_Buildup + vendor tool/software requirements",
    recoveredStructure:"Special tools, proprietary software/service tools, calibrated test equipment; deduct anything already included in Part A vendor package.",
    sourceColumns:"System · tool/software · Qty · Unit price · calibration/certification · vendor inclusion evidence",
    methods: methods(["E09","E17"]),
    driverSummary:"OEM/vendor tool list + software/licence + required calibrated test equipment.",
    currentStatus:"ALLOWANCE / OEM TOOL LISTS OPEN",
    currentAllowanceMeaning:"THB 8M is the current tools/software/test-equipment allowance."
  },
  B7: {
    sourceModel:"Survey/readiness campaign logic",
    recoveredStructure:"Site survey, existing-condition verification, readiness checks and specialist call-off where competency is required.",
    sourceColumns:"Sites/campaigns · days · crew · role/rate · travel/trip cash",
    methods: methods(["E05","E07","E08","E09","E10"]),
    driverSummary:"Survey campaigns × days × crew + role rates + travel/cash cost.",
    currentStatus:"WORKING / SURVEY PLAN OPEN",
    currentAllowanceMeaning:"THB 6M is a call-off survey/readiness allowance, not physical installation labor."
  },
  B8: {
    sourceModel:"Regulatory dossier / permit coordination logic",
    recoveredStructure:"Frequency/licence/type approval/import-export/work-permit coordination plus statutory/agent fees when assigned.",
    sourceColumns:"Dossiers/actions · role MH · authority/agent fee · travel/cash · owner/applicant",
    methods: methods(["E01","E07","E08","E09","E10"]),
    driverSummary:"Required regulatory actions × engineering/admin workload + actual authority/agent fees.",
    currentStatus:"WORKING / STATUTORY FEE AND OWNER OPEN",
    currentAllowanceMeaning:"THB 10M is a regulatory coordination allowance; exact statutory fees remain open."
  },
  B9: {
    sourceModel:"Risk / insurance treatment",
    recoveredStructure:"Project, personnel, travel/work-risk, medevac and applicable shipment cover; policy wording/premium to replace allowance.",
    sourceColumns:"Policy type · insured basis · period/trip exposure · premium · deductible · exclusion · owner",
    methods: methods(["E08","E09"]),
    driverSummary:"Actual policies/premiums based on personnel-period, trip and shipment exposure.",
    currentStatus:"ALLOWANCE / POLICY WORDING AND PREMIUM OPEN",
    currentAllowanceMeaning:"THB 8M is the current risk-transfer allowance, not a derived premium."
  },
  C1: {
    sourceModel:"Scope boundary control",
    recoveredStructure:"Physical installation construction/civil/pulling-blowing/tower erection remains CNEEC basis unless reassigned.",
    sourceColumns:"Physical work package · owner · quantity · installation equation/rate if scope changes",
    methods: methods(["E18"]),
    driverSummary:"Only calculate if written scope change assigns physical construction to TSI.",
    currentStatus:"EXCLUDED / CNEEC CURRENT BOUNDARY",
    currentAllowanceMeaning:"THB 0 is an explicit boundary exclusion, not an unknown scope treated as zero."
  },
  C2: {
    sourceModel:"OEM 10-year capital spare model",
    recoveredStructure:"System-by-system capital spare list with critical/long-lead/obsolescence items.",
    sourceColumns:"System · OEM spare item · Qty · Unit price · lead time · criticality · source quote",
    methods: methods(["E09","E17"]),
    driverSummary:"Approved OEM capital spare list × quantity × current vendor unit price, then goods commercial treatment.",
    currentStatus:"ALLOWANCE / OEM ITEMIZED LISTS OPEN",
    currentAllowanceMeaning:"THB 32M is a current option allowance, not yet a closed itemized spare sum."
  },
  C3: {
    sourceModel:"OEM 2-year operational spare model",
    recoveredStructure:"System-by-system normal-operation and maintenance replacement spares.",
    sourceColumns:"System · OEM spare item · consumption/replace basis · Qty · Unit price · source quote",
    methods: methods(["E09","E17"]),
    driverSummary:"Approved 2-year OEM operation spare list × quantity × current vendor unit price, then goods commercial treatment.",
    currentStatus:"ALLOWANCE / OEM ITEMIZED LISTS OPEN",
    currentAllowanceMeaning:"THB 18M is a current option allowance, not yet a closed itemized spare sum."
  }
};

export function getServiceLineDerivation(code) {
  return SERVICE_LINE_DERIVATION[code] || null;
}
