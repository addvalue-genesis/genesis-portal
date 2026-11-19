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

  let directive = "CLARIFY_CUS";
  if (
    s.strike === 1 ||
    /\b(do not|not accept|not require|remove|withdrawn|struck through|exclude|no lna|not share|no fabrication)\b/i.test(
      full
    )
  ) {
    directive = "DO_NOT";
  } else if (/\b(optional|if required|if used|conditional)\b/i.test(full)) {
    directive = "OPTIONAL_SCOPE";
  } else if (
    /\b(in lieu of|deviation|versus|vs\.?|conflict|changed from dtrs|8-port)\b/i.test(full) ||
    decisionStatus === "DEVIATION"
  ) {
    directive = "DEVIATION_SI";
  } else if (
    /\b(shall|must|minimum|min |provide|include|required|comply|obtain|install|at least)\b/i.test(
      full
    )
  ) {
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

export function evaluateDrawingBoundary0553({ lineStyle = "SOLID", hasCloudC1 = false } = {}) {
  const base = DRAWING_LINE_LEGEND_0553[lineStyle] || DRAWING_LINE_LEGEND_0553.SOLID;
  return {
    ...base,
    hasCloudC1: !!hasCloudC1,
    directive:
      lineStyle === "DASHED" || lineStyle === "DASH_DOT"
        ? "DO_NOT"
        : hasCloudC1
          ? "MUST_DO"
          : "MUST_DO",
  };
}

/**
 * Unified 9-Document Mathematical Engine (EQ-0553-DOC-ENGINE-01):
 *   R*(x) = argmax_{d in D} Authority(d, attr) * (1 + 0.5 * w_d(x))
 *
 * Each document family carries its own sub-equation and domain authority:
 *   PHI, BOD, MR, DTS, SPE, LIS, MTO, BLD, DWG/LAY
 */
export const DOCUMENT_SUB_EQUATIONS_0553 = Object.freeze({
  PHI: { id: "EQ-DOC-PHI", output: "Topology & Redundancy Constraint", formula: "f_PHI(x) = (availability, redundancy, failSafe)" },
  BOD: { id: "EQ-DOC-BOD", output: "System & RF Design Envelope", formula: "f_BOD(x) = (band, linkBudget, throughput)" },
  MR:  { id: "EQ-DOC-MR",  output: "Contractual Scope & Attachments 1-9", formula: "f_MR(x) = (Qty_platform, Mandatory/Optional, Annex-8)" },
  DTS: { id: "EQ-DOC-DTS", output: "OEM Compliance Vector", formula: "f_DTS(x) = (ExRating, IP, Power, Entries, Latency)" },
  SPE: { id: "EQ-DOC-SPE", output: "Material, Fire & Test Gate", formula: "f_SPE(x) = (IEC/ATEX, FirePerformance, FAT/SAT)" },
  LIS: { id: "EQ-DOC-LIS", output: "Unique Tag Registry", formula: "f_LIS(x) = Tag x Platform x Service" },
  MTO: { id: "EQ-DOC-MTO", output: "Physical Material Takeoff", formula: "f_MTO(x) = sum_site(Qty(tag)) + BulkLot" },
  BLD: { id: "EQ-DOC-BLD", output: "Supply Scope Boundary", formula: "f_BLD(x) = LineStyle(Solid | Dashed | Dash-Dot)" },
  LAY: { id: "EQ-DOC-LAY", output: "Physical Placement & Route", formula: "f_LAY(x) = (Deck, Elevation, Cloud_C1, FeederLen)" },
  DWG: { id: "EQ-DOC-DWG", output: "Detail Interface & Mounting", formula: "f_DWG(x) = (Entries, Mounting, Earthing, Dimensions)" },
});

const ATTRIBUTE_AUTHORITY_RANK_0553 = Object.freeze({
  QTY:       ["MR", "MTO", "LIS", "BLD", "LAY", "DWG"],
  SPEC:      ["DTS", "SPE", "BOD", "MR", "BLD", "PHI"],
  LOCATION:  ["LAY", "DWG", "BLD", "MTO", "MR"],
  INTERFACE: ["BLD", "DWG", "PHI", "SPE", "DTS"],
  TESTING:   ["MR", "SPE", "BOD", "DTS", "LIS"],
});

export function resolveDocumentPrecedence0553(attr = "SPEC", candidates = []) {
  const rank = ATTRIBUTE_AUTHORITY_RANK_0553[attr] || ATTRIBUTE_AUTHORITY_RANK_0553.SPEC;
  const scored = candidates.map((c) => {
    const idx = rank.indexOf(String(c.doc || "").toUpperCase());
    const baseAuth = idx === -1 ? 1 : rank.length - idx + 1;
    const w = c.hasMarkup ? 1 : 0;
    return { ...c, score: baseAuth * (1 + 0.5 * w) };
  });
  scored.sort((a, b) => b.score - a.score);
  return {
    attribute: attr,
    winner: scored[0] || null,
    conflict: scored.length > 1 && scored[0]?.value !== scored[1]?.value,
    ranked: scored,
  };
}
