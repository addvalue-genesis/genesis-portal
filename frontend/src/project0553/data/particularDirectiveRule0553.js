/**
 * Common Mathematical Control Equation for Particular & Markup Directives (EQ-0553-PARTICULAR-01):
 *
 * 1. Signal Vector:
 *      s(x) = (c_red, c_blue, c_strike, c_yellow, c_revbar) in {0, 1}^5
 *
 * 2. Particularity Gate:
 *      w(x) = max(c_red, c_blue, c_strike, c_yellow, c_revbar) in {0, 1}
 *      w(x) = 1 => Particular / Actionable Clause
 *
 * 3. Directive Polarity D(x):
 *      - DO_NOT         if c_strike == 1 or matches exclude/remove/not require/not accept/withdrawn
 *      - OPTIONAL_SCOPE if matches optional / if required / conditional
 *      - DEVIATION_SI   if offered(x) != MR(x) (e.g. BDA in lieu of LNA, 8-port vs 16+2)
 *      - MUST_DO        if matches shall / must / minimum / provide / include / required / >=
 *      - CLARIFY_CUS    otherwise
 *
 * 4. 3-Tier Routing Phi(x) = (CUS, VND, SI) in {0, 1}^3:
 *      - CUS = 1 for all customer-facing scope/clarify/deviation/option obligations
 *      - VND = 1 when equipment brand/model/part/Ex/cert/spares/tools are affected
 *      - SI  = 1 when cost/MH/link budget/deviation/logistics/engineering are affected
 */
export const PARTICULAR_DIRECTIVE_EQUATION_0553 = Object.freeze({
  id: "EQ-0553-PARTICULAR-01",
  formula:
    "w(x)=max(s(x)); D(x) in {DO_NOT, OPTIONAL_SCOPE, DEVIATION_SI, MUST_DO, CLARIFY_CUS}; Phi(x)=(CUS, VND, SI)",
});

const NEG_RE =
  /\b(do\s+not|does\s+not|shall\s+not|must\s+not|will\s+not|not\s+(?:be\s+)?(?:required|accepted|included|supplied|provided|in\s+scope)|not\s+accept\w*|withdrawn|struck\s+through|exclud\w*|by\s+others|no\s+lna|not\s+share|no\s+fabrication)\b/i;
const DO_NOT_REMOVE_RE = /\b(do\s+not|shall\s+not|must\s+not)\s+remove\b/i;
const BARE_REMOVE_RE = /\bremove\b/i;
const OPT_RE = /\b(optional|if\s+required|if\s+used|conditional|where\s+applicable)\b/i;
const DEV_RE = /\b(in\s+lieu\s+of|deviation|versus|vs\.?|conflict|changed\s+from\s+dtrs|8-port)\b/i;
const MUST_RE =
  /\b(shall|must|mandatory|minimum|min\s|provide|include|required|comply|obtain|install|at\s+least)\b/i;

export function evaluateParticularDirective0553({
  text = "",
  topic = "",
  signals = {},
  decisionStatus = "",
} = {}) {
  const s = {
    red: signals.red ? 1 : 0,
    blue: signals.blue ? 1 : 0,
    strike: signals.strike ? 1 : 0,
    yellow: signals.yellow ? 1 : 0,
    revbar: signals.revbar ? 1 : 0,
  };
  const w = Math.max(s.red, s.blue, s.strike, s.yellow, s.revbar);
  const full = `${topic} ${text}`.toLowerCase();

  const hasPreserveNoRemove = DO_NOT_REMOVE_RE.test(full);
  const strippedForMust = full.replace(new RegExp(NEG_RE.source, "gi"), " ");
  const hasNeg = s.strike === 1 || (!hasPreserveNoRemove && NEG_RE.test(full));
  const hasOpt = OPT_RE.test(full);
  const hasDev = DEV_RE.test(full) || decisionStatus === "DEVIATION";
  const hasMust = hasPreserveNoRemove || MUST_RE.test(strippedForMust);
  const hasBareRemoveOnly = !hasPreserveNoRemove && BARE_REMOVE_RE.test(full) && !hasNeg;

  const matchedClasses = [];
  if (hasNeg) matchedClasses.push("NEG");
  if (hasOpt) matchedClasses.push("OPT");
  if (hasDev) matchedClasses.push("DEV");
  if (hasMust) matchedClasses.push("MUST");

  let directive = "CLARIFY_CUS";
  let ambiguity = false;

  if (hasDev) {
    // Deviation + Negation (e.g. "BDA in lieu of LNA; LNA not required") is DEVIATION_SI
    directive = "DEVIATION_SI";
  } else if (
    (hasNeg && hasOpt) ||
    (hasNeg && hasMust) ||
    (hasOpt && hasMust)
  ) {
    directive = "CLARIFY_CUS";
    ambiguity = true;
  } else if (hasNeg) {
    directive = "DO_NOT";
  } else if (hasOpt) {
    directive = "OPTIONAL_SCOPE";
  } else if (hasBareRemoveOnly) {
    directive = "CLARIFY_CUS";
  } else if (hasMust) {
    directive = "MUST_DO";
  }

  const cus = 1;
  const vnd = /\b(brand|model|part|antenna|lna|bda|switch|enclosure|gland|cable|sounder|telephone|racon|spare|tool|spir|ex d|ex de|atex|iecex|ip66|m20|m25|datasheet|oem)\b/i.test(
    full
  )
    ? 1
    : 0;
  const si =
    directive === "DEVIATION_SI" ||
    /\b(cost|price|budget|link|throughput|survey|fat|sat|commissioning|vdrl|import|license|licence|approval|yard|delivery|packing|storage|warranty|engineering)\b/i.test(
      full
    )
      ? 1
      : 0;

  return {
    w,
    signals: s,
    directive,
    ambiguity,
    matchedClasses,
    phi: { cus, vnd, si },
  };
}

/**
 * Drawing Line-Style & Boundary Equation for BLD / DWG / LAY (EQ-0553-DRAWING-01):
 *   DASHED (- - -)      => EXISTING_NO_SUPPLY (Existing installation; reuse/interface only)
 *   DASH_DOT (-.-.-)    => BY_OTHERS_EXCLUDED (Provided by Other, e.g. PCS / Wireless Gateway)
 *   SOLID (----)        => IN_SCOPE_SUPPLY    (New Telecom Package supply)
 *   CLOUD_C1            => REV_C1_DELTA       (Revision C1 change; verify against MR/TC)
 */
export const DRAWING_LINE_LEGEND_0553 = Object.freeze({
  DASHED: { code: "EXISTING_NO_SUPPLY", scope: "OUT_OF_SUPPLY_EXISTING", label: "Dashed (- - -): Existing equipment installation" },
  DASH_DOT: { code: "BY_OTHERS_EXCLUDED", scope: "OUT_OF_SUPPLY_OTHER", label: "Dash-Dot (- · -): Equipment provided by other (PCS/Instrument)" },
  SOLID: { code: "IN_SCOPE_SUPPLY", scope: "IN_TELECOM_SCOPE", label: "Solid (———): New Telecom package supply" },
  CLOUD_C1: { code: "REV_C1_DELTA", scope: "REQUIRES_MR_TC_CHECK", label: "Revision Cloud C1: Rev.C1 delta / modification" },
});

export function evaluateDrawingBoundary0553({
  lineStyle = "",
  hasCloudC1 = false,
  legendVerified = false,
} = {}) {
  const key = String(lineStyle || "").trim().toUpperCase();
  const base =
    key === "SOLID" || key === "DASHED" || key === "DASH_DOT"
      ? DRAWING_LINE_LEGEND_0553[key]
      : null;
  const revDelta = hasCloudC1 ? "REV_C1_DELTA" : null;
  const legendStatus = legendVerified ? "LEGEND_VERIFIED" : "LEGEND_NOT_VERIFIED";
  if (!base) {
    return {
      code: "UNRESOLVED_LINESTYLE",
      scope: "CLARIFY_REQUIRED",
      label: "Unresolved / missing drawing line style",
      hasCloudC1: !!hasCloudC1,
      revDelta,
      requiresMrTcCheck: !!hasCloudC1,
      legendStatus,
      directive: "CLARIFY_CUS",
      supplyDirective: "CLARIFY_CUS",
      interfaceDirective: "CLARIFY_CUS",
    };
  }
  const supplyDirective =
    key === "DASHED" || key === "DASH_DOT" ? "DO_NOT" : "MUST_DO";
  const interfaceDirective =
    key === "DASH_DOT" ? "CLARIFY_CUS" : "MUST_DO";
  return {
    ...base,
    hasCloudC1: !!hasCloudC1,
    revDelta,
    requiresMrTcCheck: !!hasCloudC1,
    legendStatus,
    directive: supplyDirective,
    supplyDirective,
    interfaceDirective,
  };
}

/**
 * Unified VDRL-Extensible Document Sub-Equations (EQ-0553-DOC-ENGINE-01):
 *   R*(x, phase) = argmax_{d in D} (Authority(d, attr, phase) + 0.25 * w_d(x))
 *   (Bounded +0.25*w tie-breaker preserves strict contractual rank order.)
 *
 * Phases:
 *   - "R0_INITIAL"      : Initial bid before TC/CCL -> MR is #1
 *   - "R1_PLUS_CLARIFY" : Post-R0 clarification     -> Agreed TC/CCL overlays MR (MR + Delta)
 *
 * Extensible via VDRL document codes (PHI, BOD, MR, DTS, SPE, LIS, MTO, BLD, LAY, DWG, RPT, CAL, PRO, ITP, SPIR).
 */
export const DOCUMENT_SUB_EQUATIONS_0553 = Object.freeze({
  TC:   { id: "EQ-DOC-TC",   vdrlGroup: "CLARIFY",   output: "Agreed Technical/Commercial Delta", formula: "f_TC(x) = MR + Delta(TC/CCL)" },
  PHI:  { id: "EQ-DOC-PHI",  vdrlGroup: "DESIGN",    output: "Topology & Redundancy Constraint", formula: "f_PHI(x) = (availability, redundancy, failSafe)" },
  BOD:  { id: "EQ-DOC-BOD",  vdrlGroup: "DESIGN",    output: "System & RF Design Envelope", formula: "f_BOD(x) = (band, linkBudget, throughput)" },
  MR:   { id: "EQ-DOC-MR",   vdrlGroup: "REQUISITION", output: "Contractual Scope & Attachments 1-9", formula: "f_MR(x) = (Qty_platform, Mandatory/Optional, Annex-8)" },
  DTS:  { id: "EQ-DOC-DTS",  vdrlGroup: "DATASHEET", output: "OEM Compliance Vector", formula: "f_DTS(x) = (ExRating, IP, Power, Entries, Latency)" },
  SPE:  { id: "EQ-DOC-SPE",  vdrlGroup: "SPEC",      output: "Material, Fire & Test Gate", formula: "f_SPE(x) = (IEC/ATEX, FirePerformance, FAT/SAT)" },
  LIS:  { id: "EQ-DOC-LIS",  vdrlGroup: "LIST",      output: "Unique Tag Registry", formula: "f_LIS(x) = Tag x Platform x Service" },
  MTO:  { id: "EQ-DOC-MTO",  vdrlGroup: "TAKEOFF",   output: "Physical Material Takeoff", formula: "f_MTO(x) = sum_site(Qty(tag)) + BulkLot" },
  RPT:  { id: "EQ-DOC-RPT",  vdrlGroup: "STUDY",     output: "Radio / Site Survey Study Evidence", formula: "f_RPT(x) = (pathProfile, fadeMargin, antennaHeight)" },
  CAL:  { id: "EQ-DOC-CAL",  vdrlGroup: "CALC",      output: "Engineering Calculation Proof", formula: "f_CAL(x) = (linkBudget, heatDissipation, poeLoad)" },
  BLD:  { id: "EQ-DOC-BLD",  vdrlGroup: "DRAWING",   output: "Supply Scope Boundary", formula: "f_BLD(x) = LineStyle(Solid | Dashed | Dash-Dot)" },
  LAY:  { id: "EQ-DOC-LAY",  vdrlGroup: "DRAWING",   output: "Physical Placement & Route", formula: "f_LAY(x) = (Deck, Elevation, Cloud_C1, FeederLen)" },
  DWG:  { id: "EQ-DOC-DWG",  vdrlGroup: "DRAWING",   output: "Detail Interface & Mounting", formula: "f_DWG(x) = (Entries, Mounting, Earthing, Dimensions)" },
  PRO:  { id: "EQ-DOC-PRO",  vdrlGroup: "PROCEDURE", output: "FAT / SAT / Commissioning Procedure", formula: "f_PRO(x) = (testCases, witnessNotice, acceptanceCriteria)" },
  ITP:  { id: "EQ-DOC-ITP",  vdrlGroup: "QUALITY",   output: "Inspection & Test Plan Gate", formula: "f_ITP(x) = (100%_func, ExCert, 24hEndurance, ReleaseNote)" },
  SPIR: { id: "EQ-DOC-SPIR", vdrlGroup: "SPARES",    output: "Spare Parts Interchangeability Record", formula: "f_SPIR(x) = (OEM_PartNo, Qty_platform, LeadTime)" },
});

const VALID_DOC_TYPES_0553 = new Set([
  "TC", "CCL", "PHI", "BOD", "MR", "DTS", "SPE", "LIS", "MTO",
  "RPT", "CAL", "BLD", "LAY", "DWG", "PRO", "ITP", "SPIR",
]);
const EQUIP_TAG_RE_0553 = /^[A-Z]{2,4}-\d{3}-\d{3}[A-Z]?$/i;
const NUMBERED_DOC_RE_0553 =
  /(?:^|[-_ ])(TC|CCL|PHI|BOD|MR|DTS|SPE|LIS|MTO|RPT|CAL|BLD|LAY|DWG|PRO|ITP|SPIR)[-_ ]?\d{2,4}(?:[-_ ]?[A-Z]\d?)?(?=$|[\s_(§,])/i;
const WORD_DOC_RE_0553 =
  /\b(TC|CCL|PHI|BOD|MR|DTS|SPE|LIS|MTO|RPT|CAL|BLD|LAY|DWG|PRO|ITP|SPIR)\b/i;

export function extractVdrlDocType0553(docCodeOrCandidate = "") {
  if (docCodeOrCandidate && typeof docCodeOrCandidate === "object") {
    const explicit = String(docCodeOrCandidate.docType || "").trim().toUpperCase();
    if (VALID_DOC_TYPES_0553.has(explicit)) return explicit === "CCL" ? "TC" : explicit;
    return extractVdrlDocType0553(docCodeOrCandidate.doc || docCodeOrCandidate.title || "");
  }
  const s = String(docCodeOrCandidate || "").trim().toUpperCase();
  if (!s || EQUIP_TAG_RE_0553.test(s)) return "OTHER";
  const numMatch = s.match(NUMBERED_DOC_RE_0553);
  if (numMatch) return numMatch[1] === "CCL" ? "TC" : numMatch[1];
  const wordMatch = s.match(WORD_DOC_RE_0553);
  if (wordMatch) return wordMatch[1] === "CCL" ? "TC" : wordMatch[1];
  return "OTHER";
}

const ATTRIBUTE_AUTHORITY_RANK_0553 = Object.freeze({
  QTY:       ["TC", "MR", "MTO", "LIS", "SPIR", "BLD", "LAY", "DWG"],
  SPEC:      ["TC", "DTS", "SPE", "CAL", "RPT", "BOD", "MR", "BLD", "PHI"],
  LOCATION:  ["TC", "LAY", "DWG", "RPT", "BLD", "MTO", "MR"],
  INTERFACE: ["TC", "BLD", "DWG", "PHI", "SPE", "DTS"],
  TESTING:   ["TC", "MR", "ITP", "PRO", "SPE", "BOD", "DTS", "LIS"],
});

const normValue0553 = (v) => String(v).toUpperCase().replace(/\s+/g, "");

export function resolveDocumentPrecedence0553(
  attr = "SPEC",
  candidates = [],
  { phase = "R1_PLUS_CLARIFY" } = {}
) {
  const baseRank = ATTRIBUTE_AUTHORITY_RANK_0553[attr] || ATTRIBUTE_AUTHORITY_RANK_0553.SPEC;
  const rank = phase === "R0_INITIAL" ? baseRank.filter((d) => d !== "TC") : baseRank;
  const valued = (candidates || []).filter((c) => {
    if (!c || c.value == null || String(c.value).trim() === "") return false;
    const docType = extractVdrlDocType0553(c);
    if (phase === "R0_INITIAL" && docType === "TC") return false;
    if (docType === "TC" && Array.isArray(c.deltaAttrs) && !c.deltaAttrs.includes(attr)) return false;
    return true;
  });

  const scored = valued.map((c) => {
    const docType = extractVdrlDocType0553(c);
    const idx = rank.indexOf(docType);
    const baseAuth = idx === -1 ? 1 : rank.length - idx + 1;
    const w = c.hasMarkup ? 1 : 0;
    return {
      ...c,
      docType,
      authority: baseAuth,
      w,
      score: baseAuth + 0.25 * w,
    };
  });

  scored.sort((a, b) => {
    if (b.authority !== a.authority) return b.authority - a.authority;
    if (b.w !== a.w) return b.w - a.w;
    const dateCmp = String(b.revisionDate || "").localeCompare(String(a.revisionDate || ""));
    if (dateCmp !== 0) return dateCmp;
    return String(b.revisionCode || "").localeCompare(String(a.revisionCode || ""));
  });

  const winner = scored[0] || null;
  const winnerNorm = winner ? normValue0553(winner.value) : null;
  const conflictsWith = winner
    ? [...new Set(scored.slice(1).filter((c) => normValue0553(c.value) !== winnerNorm).map((c) => c.docType))]
    : [];
  const conflict = conflictsWith.length > 0;
  const providedByCustomer = !!winner;
  const resolutionNote = !providedByCustomer
    ? "Not specified in customer documents — open TC or vendor confirmation."
    : conflict
      ? `Precedence winner: ${winner.docType} (conflict with ${conflictsWith.join(", ")} — confirm stricter rule / TC if needed).`
      : `Precedence winner: ${winner.docType} — use directly and append as customer basis.`;

  return {
    attribute: attr,
    phase,
    winner,
    providedByCustomer,
    conflict,
    conflictsWith,
    stricterRuleApplies: conflict,
    resolutionNote,
    ranked: scored,
  };
}
