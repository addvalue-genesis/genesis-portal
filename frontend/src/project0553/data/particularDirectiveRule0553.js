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
