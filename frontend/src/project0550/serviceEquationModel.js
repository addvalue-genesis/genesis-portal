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

export const SERVICE_EQUATIONS = [
  { id:"E01", purpose:"Applicability and cost ownership", equation:"MH_i,r = I_i × Q_i × UMH_i,r × F_i", control:"I=0/1 only when scope is established; ownership is separate. Unknown is OPEN, not zero." },
  { id:"E02", purpose:"Document lifecycle", equation:"MH_doc = Q_doc × (H_initial + N_cycles × H_cycle + H_final)", control:"One row per work-object family/role; review, revision and document-control effort must not overlap." },
  { id:"E03", purpose:"PM and coordination", equation:"MH_PM = Months × FTE × H_month", control:"Calendar presence; no blanket document-review multiplier on PM. Site work is separate." },
  { id:"E04", purpose:"Interface engineering", equation:"MH_int,r = Σ_edges I_edge × UMH_edge,r × F_edge", control:"Count each controlled interface edge once; do not create N² duplication." },
  { id:"E05", purpose:"Event attendance", equation:"MD = Events × Days × Crew; MH_attend = MD × H_day", control:"Attendance hours govern pay/invoicing. Productive efficiency must not reduce paid attendance." },
  { id:"E06", purpose:"Capacity and duration", equation:"Days = MH_work / (Crew × H_day × η)", control:"Use only for output-driven work and check access/crew caps." },
  { id:"E07", purpose:"Internal labor cost", equation:"C_labor = Σ_r MH_paid,r × C_rate,r", control:"Internal cost rate must be an explicit loaded rate; do not reverse-engineer payroll from selling rates." },
  { id:"E08", purpose:"Trip cost", equation:"C_trip = Fare + Hotel + PerDiem + Transport + Permits + Insurance + Other", control:"Count once per physical trip; shared FAT/training travel is not duplicated." },
  { id:"E09", purpose:"Direct service cost", equation:"C_service = C_labor + C_trip + C_OEM + C_test + C_other", control:"Goods/installation by others remain outside; deduct OEM inclusions only with evidence." },
  { id:"E10", purpose:"Direct selling rates", equation:"P_service = Σ(MH × R_sell_hr) + Σ(MD × R_sell_day) + P_other", control:"Hourly/day-rate and cost-plus bases are alternatives where applicable, not automatically additive." },
  { id:"E11", purpose:"Cost-plus markup", equation:"P = C_loaded × (1 + markup)", control:"Do not double count overhead/risk." },
  { id:"E12", purpose:"Target gross margin", equation:"P = C_loaded / (1 − margin)", control:"Markup and gross margin are different quantities." },
  { id:"E13", purpose:"Prime-contractor layer", equation:"P_customer = P_ADDVALUE × (1 + prime_markup)", control:"Keep prime layer separate from ADDVALUE cost/margin." },
  { id:"E14", purpose:"Shared cost allocation", equation:"w_s = Driver_s / ΣDriver; Allocated_s = Pool × w_s", control:"Use a causal driver. No equal split across 19 systems by default." },
  { id:"E15", purpose:"Variation and retest", equation:"ΔC = Σ(ΔMH × C_rate) + Δtrip + ΔOEM", control:"Retest cost depends on cause and entitlement." },
  { id:"E16", purpose:"Training", equation:"MH_train = Sessions × Days × Trainers × H_day + PrepMH + CloseMH", control:"Trainees are not trainers. PAGA/CCTV have three trainee categories of five in the recovered model." },
  { id:"E17", purpose:"FX conversion", equation:"USD = THB / FX_THB_per_USD", control:"FX requires controlled source/date; historical FX is not automatically current." },
  { id:"E18", purpose:"Material-to-labor driver", equation:"MH_install = Σ(Q_installed_activity × UMH_activity)", control:"Purchase quantity/spares/pack rounding do not automatically create installation labor." }
];

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
