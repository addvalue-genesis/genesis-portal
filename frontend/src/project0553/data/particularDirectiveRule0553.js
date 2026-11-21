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
 * 3. Directive Polarity Resolution Order D(x):
 *      (1) Strike (`c_strike == 1`)                        -> DO_NOT
 *      (2) Deviation (`in lieu of / offered != MR`)       -> DEVIATION_SI (even with NEG)
 *      (3) Conflicting multi-match ({NEG+OPT/MUST}, etc.) -> CLARIFY_CUS (ambiguity: true)
 *      (4) Negation (`not required / shall not / excl.`)  -> DO_NOT
 *      (5) Optional (`optional / if required`)            -> OPTIONAL_SCOPE
 *      (6) Bare `remove` (without `do not remove`)        -> CLARIFY_CUS
 *      (7) Obligation (`shall / must / mandatory`)        -> MUST_DO (or structural TAG fallback)
 *      (8) Fallback                                       -> CLARIFY_CUS
 *
 * 4. 3-Tier Routing Phi(x) = (CUS, VND, SI) in {0, 1}^3
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
const DEV_RE = /\b(in\s+lieu\s+of|deviation|versus|vs\.?|changed\s+from\s+dtrs)\b/i;
const DEVIATION_KEYWORDS_0553 = /\b(8-port)\b/i;
const DEVIATION_CONTEXT_0553 = /\b(in\s+lieu\s+of|offered|instead\s+of|vs\.?)\b/i;
const MUST_RE =
  /\b(shall|must|mandatory|minimum|min\s|provide|include|required|comply|obtain|install|at\s+least)\b/i;

export function evaluateParticularDirective0553({
  text = "",
  topic = "",
  signals = {},
  decisionStatus = "",
  recordType = "",
  tags = [],
} = {}) {
  const s = {
    red: signals.red ? 1 : 0,
    blue: signals.blue ? 1 : 0,
    strike: signals.strike ? 1 : 0,
    yellow: signals.yellow ? 1 : 0,
    revbar: signals.revbar ? 1 : 0,
  };
  const w = Math.max(s.red, s.blue, s.strike, s.yellow, s.revbar);
  const signalSource = w === 1 ? "EXTRACTED" : "NOT_EXTRACTED";
  const full = `${topic} ${text}`.toLowerCase();

  const hasPreserveNoRemove = DO_NOT_REMOVE_RE.test(full);
  const strippedForMust = full.replace(new RegExp(NEG_RE.source, "gi"), " ");
  const hasStrike = s.strike === 1;
  const hasNeg = !hasStrike && !hasPreserveNoRemove && NEG_RE.test(full);
  const hasOpt = OPT_RE.test(full);
  const hasContextualDevKeyword =
    DEVIATION_KEYWORDS_0553.test(full) && DEVIATION_CONTEXT_0553.test(full);
  const hasDev =
    DEV_RE.test(full) || hasContextualDevKeyword || decisionStatus === "DEVIATION";
  const hasMust = hasPreserveNoRemove || MUST_RE.test(strippedForMust);
  const hasBareRemoveOnly = !hasPreserveNoRemove && BARE_REMOVE_RE.test(full) && !hasNeg;

  const matchedClasses = [];
  if (hasStrike || hasNeg) matchedClasses.push("NEG");
  if (hasOpt) matchedClasses.push("OPT");
  if (hasDev) matchedClasses.push("DEV");
  if (hasMust) matchedClasses.push("MUST");

  let directive = "CLARIFY_CUS";
  let ambiguity = false;
  let directiveSource = "FALLBACK_CLARIFY";

  if (hasStrike) {
    directive = "DO_NOT";
    directiveSource = "MARKUP_STRIKE";
  } else if (hasDev) {
    directive = "DEVIATION_SI";
    directiveSource = "MODAL_TEXT";
  } else if (
    (hasNeg && hasOpt) ||
    (hasNeg && hasMust) ||
    (hasOpt && hasMust)
  ) {
    directive = "CLARIFY_CUS";
    ambiguity = true;
    directiveSource = "AMBIGUOUS_CONFLICT";
  } else if (hasNeg) {
    directive = "DO_NOT";
    directiveSource = "MODAL_TEXT";
  } else if (hasOpt) {
    directive = "OPTIONAL_SCOPE";
    directiveSource = "MODAL_TEXT";
  } else if (hasBareRemoveOnly) {
    directive = "CLARIFY_CUS";
    directiveSource = "BARE_REMOVE";
  } else if (hasMust) {
    directive = "MUST_DO";
    directiveSource = "MODAL_TEXT";
  } else if (
    recordType === "TAG_SUPPLY" ||
    (recordType === "CLAUSE" && Array.isArray(tags) && tags.length > 0)
  ) {
    directive = "MUST_DO";
    directiveSource = "STRUCTURAL_TYPE";
  }

  const cus =
    directive === "CLARIFY_CUS" ||
    directive === "OPTIONAL_SCOPE" ||
    directive === "DEVIATION_SI" ||
    /\b(scope|client|company|jutal|pttep|clarify|confirm|approval|submit|vdrl|fat|sat|warranty|exclude|not required)\b/i.test(
      full
    )
      ? 1
      : 0;
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
    signalSource,
    directive,
    directiveSource,
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
 * Unified VDRL-Extensible Document Precedence Engine (EQ-0553-DOC-ENGINE-01):
 *   Lexicographic sort: (authority DESC, w DESC, revisionDate DESC, revisionCode DESC)
 *   - Evidence docs (CAL, RPT_STUDY, RPT_TEST) never win contractual precedence or set providedByCustomer.
 *   - Agreed/closed TC overrides baseline peers in R1_PLUS_CLARIFY; open TC stays in openTcRefs.
 *   - Baseline peer conflicts apply MOST_STRINGENT comparator (e.g., IP66/IP67 composite, range hull).
 *
 * Phases:
 *   - "R0_INITIAL"      : Initial bid before TC/CCL -> MR is #1
 *   - "R1_PLUS_CLARIFY" : Post-R0 clarification     -> Agreed TC/CCL overlays MR (MR + Delta)
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

const PTTEP_DOCTYPE_MAP_0553 = Object.freeze({
  TC: "TC", CCL: "TC", PHI: "PHI", BOD: "BOD", MR: "MR", DTS: "DTS",
  SPE: "SPE", LIS: "LIS", MTO: "MTO", RPT: "RPT", CAL: "CAL", BLD: "BLD",
  LAY: "LAY", DWG: "DWG", PRO: "PRO", ITP: "ITP", SPIR: "SPIR",
  PRC: "PRO", PDR: "PRO", REP: "RPT_TEST", FAT: "RPT_TEST", SAT: "RPT_TEST",
  WIR: "DWG", GA: "DWG",
  DSS: "OTHER", CER: "OTHER", SCD: "OTHER", DOC: "OTHER", CAT: "OTHER", MOM: "OTHER", VDR: "OTHER",
});
const VALID_DOC_TYPES_0553 = new Set([
  "TC", "CCL", "PHI", "BOD", "MR", "DTS", "SPE", "LIS", "MTO",
  "RPT", "RPT_STUDY", "RPT_TEST", "CAL", "BLD", "LAY", "DWG", "PRO", "ITP", "SPIR",
]);
const EQUIP_TAG_RE_0553 = /^[A-Z]{2,4}-(?:[A-Z]{2,4}-)?\d{3}-\d{3}[A-Z]?\b/i;
const NUMBERED_DOC_RE_0553 =
  /(?:^|[-_ ])(TC|CCL|PHI|BOD|MR|DTS|SPE|LIS|MTO|RPT|CAL|BLD|LAY|DWG|PRO|ITP|SPIR)[-_ ]?\d{2,4}(?:[-_ ]?[A-Z]\d?)?(?=$|[\s_(§,])/i;
const WORD_DOC_RE_0553 =
  /\b(TC|CCL|PHI|BOD|MR|DTS|SPE|LIS|MTO|RPT|CAL|BLD|LAY|DWG|PRO|ITP|SPIR)\b/i;
const RPT_TEST_HINT_RE = /\b(fat|sat|test|inspection)\b/i;

function classifyRpt0553(context = "") {
  return RPT_TEST_HINT_RE.test(String(context || "")) ? "RPT_TEST" : "RPT_STUDY";
}

export function extractVdrlDocType0553(docCodeOrCandidate = "", titleHint = "") {
  if (docCodeOrCandidate && typeof docCodeOrCandidate === "object") {
    const explicit = String(docCodeOrCandidate.docType || "").trim().toUpperCase();
    if (VALID_DOC_TYPES_0553.has(explicit)) {
      if (explicit === "CCL") return "TC";
      if (explicit === "RPT") return classifyRpt0553(docCodeOrCandidate.title || docCodeOrCandidate.doc);
      return explicit;
    }
    return extractVdrlDocType0553(
      docCodeOrCandidate.doc || docCodeOrCandidate.projectDocumentNo || docCodeOrCandidate.title || "",
      docCodeOrCandidate.title || ""
    );
  }
  const s = String(docCodeOrCandidate || "").trim().toUpperCase();
  if (!s || EQUIP_TAG_RE_0553.test(s)) return "OTHER";

  const coreToken = s.split(/[\s_(§,]/)[0];
  const segs = coreToken.split("-");
  if (segs.length >= 5 && /^\d{2,4}$/.test(segs[segs.length - 1])) {
    const rawCode = segs[segs.length - 2];
    const mapped = PTTEP_DOCTYPE_MAP_0553[rawCode];
    if (mapped === "RPT") return classifyRpt0553(`${s} ${titleHint}`);
    return mapped || "OTHER";
  }

  const numMatch = s.match(NUMBERED_DOC_RE_0553);
  if (numMatch) {
    const code = numMatch[1] === "CCL" ? "TC" : numMatch[1];
    return code === "RPT" ? classifyRpt0553(`${s} ${titleHint}`) : code;
  }
  const wordMatch = s.match(WORD_DOC_RE_0553);
  if (wordMatch) {
    const code = wordMatch[1] === "CCL" ? "TC" : wordMatch[1];
    return code === "RPT" ? classifyRpt0553(`${s} ${titleHint}`) : code;
  }
  return "OTHER";
}

const ATTRIBUTE_AUTHORITY_RANK_0553 = Object.freeze({
  QTY:       ["TC", "MR", "MTO", "LIS", "SPIR", "BLD", "LAY", "DWG"],
  SPEC:      ["TC", "DTS", "SPE", "RPT_STUDY", "BOD", "MR", "BLD", "PHI"],
  LOCATION:  ["TC", "LAY", "DWG", "RPT_STUDY", "BLD", "MTO", "MR"],
  INTERFACE: ["TC", "BLD", "DWG", "PHI", "SPE", "DTS"],
  TESTING:   ["TC", "MR", "ITP", "PRO", "SPE", "BOD", "DTS", "LIS"],
});

const EVIDENCE_DOC_TYPES_0553 = new Set(["CAL", "RPT_STUDY", "RPT_TEST"]);
const AGREED_TC_STATUSES_0553 = new Set([
  "AGREED", "CLOSED", "CLOSED_NOTED", "APPROVED", "ACCEPTED",
]);
const normValue0553 = (v) => String(v).toUpperCase().replace(/\s+/g, "");

function comparePeerValues0553(v1, v2) {
  const s1 = String(v1).trim();
  const s2 = String(v2).trim();
  const ip1 = s1.match(/^IP(\d)(\d)$/i);
  const ip2 = s2.match(/^IP(\d)(\d)$/i);
  if (ip1 && ip2) {
    const d1Max = Math.max(Number(ip1[1]), Number(ip2[1]));
    const b1 = Number(ip1[2]);
    const b2 = Number(ip2[2]);
    if ((b1 >= 7 && (b2 === 5 || b2 === 6)) || (b2 >= 7 && (b1 === 5 || b1 === 6))) {
      const lo = Math.min(b1, b2);
      const hi = Math.max(b1, b2);
      return { stricterValue: `IP${d1Max}${lo}/IP${d1Max}${hi}`, compositeRequirement: true };
    }
    return { stricterValue: `IP${d1Max}${Math.max(b1, b2)}`, compositeRequirement: false };
  }
  const r1 = s1.match(/^([+-]?\d+(?:\.\d+)?)\s*\.\.\s*([+-]?\d+(?:\.\d+)?)$/);
  const r2 = s2.match(/^([+-]?\d+(?:\.\d+)?)\s*\.\.\s*([+-]?\d+(?:\.\d+)?)$/);
  if (r1 && r2) {
    const lo = Math.min(Number(r1[1]), Number(r2[1]));
    const hi = Math.max(Number(r1[2]), Number(r2[2]));
    const fmt = (n) => (n > 0 ? `+${n}` : `${n}`);
    return { stricterValue: `${fmt(lo)}..${fmt(hi)}`, compositeRequirement: false };
  }
  return { stricterValue: null, compositeRequirement: false };
}

export function resolveDocumentPrecedence0553(
  attr = "SPEC",
  candidates = [],
  { phase = "R1_PLUS_CLARIFY", conflictPolicy = "MOST_STRINGENT" } = {}
) {
  const baseRank = ATTRIBUTE_AUTHORITY_RANK_0553[attr] || ATTRIBUTE_AUTHORITY_RANK_0553.SPEC;
  const rank = phase === "R0_INITIAL" ? baseRank.filter((d) => d !== "TC") : baseRank;

  const valued = [];
  const evidence = [];
  const openTcRefs = [];

  for (const c of candidates || []) {
    if (!c || c.value == null || String(c.value).trim() === "") continue;
    const docType = extractVdrlDocType0553(c);
    if (EVIDENCE_DOC_TYPES_0553.has(docType)) {
      evidence.push({ ...c, docType });
      continue;
    }
    if (docType === "TC") {
      if (phase === "R0_INITIAL") continue;
      if (Array.isArray(c.deltaAttrs) && !c.deltaAttrs.includes(attr)) continue;
      const st = String(c.status || "").trim().toUpperCase();
      if (!AGREED_TC_STATUSES_0553.has(st)) {
        openTcRefs.push({ ...c, docType });
        continue;
      }
    }
    valued.push({ ...c, docType });
  }

  const scored = valued.map((c) => {
    const idx = rank.indexOf(c.docType);
    const baseAuth = idx === -1 ? 1 : rank.length - idx + 1;
    const w = c.hasMarkup ? 1 : 0;
    return { ...c, authority: baseAuth, w };
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
  const differing = winner
    ? scored.slice(1).filter((c) => normValue0553(c.value) !== winnerNorm)
    : [];
  const conflictsWith = [...new Set(differing.map((c) => c.docType))];
  const conflict = conflictsWith.length > 0;
  const providedByCustomer = !!winner;

  let policyApplied = winner?.docType === "TC" ? "AGREED_TC_DELTA" : "PRECEDENCE_WINNER";
  let stricterValue = winner ? winner.value : null;
  let compositeRequirement = false;

  if (conflict && winner && winner.docType !== "TC" && conflictPolicy === "MOST_STRINGENT") {
    for (const peer of differing) {
      const cmp = comparePeerValues0553(stricterValue, peer.value);
      if (cmp.stricterValue) {
        stricterValue = cmp.stricterValue;
        compositeRequirement = compositeRequirement || cmp.compositeRequirement;
        policyApplied = "MOST_STRINGENT_BASELINE";
      }
    }
  }

  const resolutionNote = !providedByCustomer
    ? "Not specified in customer documents — open TC or vendor confirmation."
    : policyApplied === "AGREED_TC_DELTA"
      ? `Agreed TC delta: ${winner.docType} (${stricterValue}).`
      : conflict
        ? `Conflict (${winner.docType} vs ${conflictsWith.join(", ")}) — ${policyApplied}: ${stricterValue}.`
        : `Precedence winner: ${winner.docType} — use directly and append as customer basis.`;

  return {
    attribute: attr,
    phase,
    winner,
    providedByCustomer,
    conflict,
    conflictsWith,
    evidence,
    openTcRefs,
    policyApplied,
    stricterValue,
    compositeRequirement,
    stricterRuleApplies: conflict && winner?.docType !== "TC",
    resolutionNote,
    ranked: scored,
  };
}
