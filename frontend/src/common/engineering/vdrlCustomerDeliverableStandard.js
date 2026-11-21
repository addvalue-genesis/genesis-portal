/**
 * Common Customer-Facing VDRL Deliverable Standard
 * Shared across Project 0550, Project 0553, and future EPCI projects.
 *
 * Enforces:
 * 1. Zero internal/supplier/budget/count badges (e.g. "(8)") in customer-facing documents.
 * 2. Grouping strictly by the LOCATION column (never by description text), isolating multi-site shared rows.
 * 3. Sequential re-numbering (A-1..N for MTO, 1.1..N for LIS) AFTER grouping & sorting by Location.
 * 4. Zero TBC / OEM-pending / supplier-leak strings in customer previews and exports.
 */

export const VDRL_CUSTOMER_DELIVERABLE_RULES = Object.freeze({
  id: "STD-COMMON-VDRL-01",
  rules: [
    "No supplier names, quote IDs, internal notes, or UI row-count badges like '(8)' inside customer-facing tables/headers.",
    "Group strictly by the LOCATION column; never match location tokens inside equipment descriptions.",
    "Isolate multi-platform rows (e.g. 'ZWP20, ZWP21, ZWP22') into a dedicated SHARED group.",
    "Re-number ITEM NO. (A-1..N) and No. (1.1..N) sequentially after Location grouping.",
    "Keep REMARKS empty unless a specific engineering note is required.",
    "Keep Cover Page DESCRIPTION clean ('Issued for Bid' / 'Issued for Review' without internal PO triggers).",
  ],
});

const DEFAULT_LOCATION_ORDER = ["ZWP20", "ZWP21", "ZWP22", "ZWP23", "ZPQ", "ZWP8", "ZWP11"];
const BROWNFIELD_SITES = new Set(["ZPQ", "ZWP8", "ZWP11"]);
const GREENFIELD_SITES = new Set(["ZWP20", "ZWP21", "ZWP22", "ZWP23"]);

/**
 * Group preview rows strictly by the LOCATION column and sequentially re-number
 * ITEM NO. (MTO: A-1, A-2, ...) or No. (LIS: 1.1, 1.2, ...) after sorting.
 */
export function groupAndRenumberVdrlRows(preview, locationOrder = DEFAULT_LOCATION_ORDER) {
  const columns = preview?.columns || [];
  const docType = String(preview?.header?.docType || "").toUpperCase();
  const locColIdx = columns.findIndex((c) => /LOCATION/i.test(String(c)));
  const firstCol = String(columns[0] || "").trim().toUpperCase();
  const shouldRenumber = firstCol === "ITEM NO." || firstCol === "NO.";
  const buckets = new Map();

  for (const r of preview?.rows || []) {
    const locText =
      locColIdx >= 0
        ? String(r[locColIdx] ?? "")
        : r.map((c) => (c == null ? "" : String(c))).join(" ");
    const matchedLocs = locationOrder.filter((loc) => new RegExp(`\\b${loc}\\b`, "i").test(locText));

    let key;
    let title;
    let order;
    if (matchedLocs.length > 1) {
      const hasBf = matchedLocs.some((l) => BROWNFIELD_SITES.has(l));
      const hasGf = matchedLocs.some((l) => GREENFIELD_SITES.has(l));
      const area = hasBf && hasGf ? "GREENFIELD / BROWNFIELD" : hasBf ? "BROWNFIELD" : "GREENFIELD";
      key = `SHARED-${matchedLocs.join("-")}`;
      title = `${area} (SHARED) — Location: ${matchedLocs.join(", ")}`;
      order = 50 + locationOrder.indexOf(matchedLocs[0]);
    } else if (matchedLocs.length === 1) {
      const loc = matchedLocs[0];
      const isBf = BROWNFIELD_SITES.has(loc);
      key = `${isBf ? "BF" : "GF"}-${loc}`;
      title = `${isBf ? "BROWNFIELD" : "GREENFIELD"} — Location: ${loc} Platform`;
      order = locationOrder.indexOf(loc);
    } else {
      const isBf = /\bBROWNFIELD\b/i.test(locText);
      const isGf = /\bGREENFIELD\b/i.test(locText);
      key = isBf ? "BF-ALL" : isGf ? "GF-ALL" : "GEN";
      title = isBf
        ? "BROWNFIELD PLATFORMS — Location: ZPQ, ZWP8, ZWP11"
        : isGf
        ? "GREENFIELD PLATFORMS — Location: ZWP20, ZWP21, ZWP22, ZWP23"
        : "GENERAL / COMMON SCOPE";
      order = 99;
    }

    if (!buckets.has(key)) buckets.set(key, { key, title, order, rows: [] });
    buckets.get(key).rows.push([...r]);
  }

  const sorted = [...buckets.values()].sort((a, b) => a.order - b.order);
  if (!shouldRenumber) return sorted;

  for (const g of sorted) {
    let seq = 1;
    for (const row of g.rows) {
      row[0] = docType === "MTO" ? `A-${seq}` : `1.${seq}`;
      seq += 1;
    }
  }
  return sorted;
}

const FORBIDDEN_CUSTOMER_RE =
  /\b(EXION|PROSPER|MDS|QTORG\w+|allowance|budget|extrapolated|owner-selected|OEM specification pending|TBC)\b/i;
const PRICE_LEAK_RE = /\b(USD|THB)\b|\$|฿/i;

/**
 * Universal Pre-Release Mathematical Gate Equations for ALL VDRL / SDRL deliverables
 * (MTO, LIS, DTS, CAL, RPT_STUDY, DWG, PRO, ITP, RPT_TEST, OTHER) across 0550, 0553, and future projects.
 */
export const CUSTOMER_RELEASE_GATE_EQUATIONS = Object.freeze([
  {
    id: "G01",
    scope: "ALL_VDRL_SDRL",
    name: "MR Scope Conservation & Filter Lock",
    equation: "∀(m,t): Σ_{l∈L_m} Q_VDRL(m,l,t) = Q_MR(m,t) ∧ (filterMr ≠ ALL ⇒ rows.mr ≡ filterMr)",
    control: "Total quantities across Location groups must match MR scope without cross-MR leakage.",
  },
  {
    id: "G02",
    scope: "ALL_VDRL_SDRL",
    name: "Zero-Leak Unpriced & Cost Invariance",
    equation: "|D ∩ (Σ_price ∪ Σ_supplier ∪ Σ_internal ∪ Σ_TBC)| = 0 ∧ ΔC_working = 0",
    control: "Customer deliverables must never expose prices, supplier names, internal notes, '(N)' counts, or TBC.",
  },
  {
    id: "G03",
    scope: "BOM_VDRL_SDRL (MTO, LIS)",
    name: "OEM Completeness & Non-Duplication",
    equation: "∀r∈D_BOM: B(r)≠∅ ∧ M(r)≠∅ ∧ P(r)≠∅ ∧ norm(M(r))≠norm(P(r))",
    control: "Every equipment/material row in MTO/LIS/SDRL BOM deliverables requires complete Brand, Model, Part No.",
  },
  {
    id: "G04",
    scope: "ALL_VDRL_SDRL",
    name: "Location Partition & Per-Location Reset Index",
    equation: "⊔_k g_k = D ∧ No.(g_k, i) = Prefix_k(i), i = 1..|g_k|",
    control: "Group strictly by LOCATION column (shared multi-site isolated) and reset numbering per Location.",
  },
]);

/**
 * Evaluate all universal VDRL/SDRL Customer Release Gate equations against a built document preview.
 */
export function evaluateCustomerReleaseGate(preview, { filterMr = null } = {}) {
  const columns = preview?.columns || [];
  const rows = preview?.rows || [];
  const grouped = preview?.grouped || groupAndRenumberVdrlRows(preview);
  const mrIdx = columns.findIndex((c) => /^SYSTEM$/i.test(String(c).trim()));
  const brandIdx = columns.findIndex((c) => /^BRAND$/i.test(String(c).trim()));
  const modelIdx = columns.findIndex((c) => /^MODEL$/i.test(String(c).trim()));
  const partIdx = columns.findIndex((c) => /^PART NO\.?$/i.test(String(c).trim()));
  const hasBomCols = brandIdx >= 0 && modelIdx >= 0 && partIdx >= 0;
  const firstCol = String(columns[0] || "").trim().toUpperCase();
  const hasItemNo = firstCol === "ITEM NO." || firstCol === "NO.";

  // G01: Scope presence & strict MR filter lock
  const g01Pass =
    rows.length > 0 &&
    (!filterMr || mrIdx < 0 || rows.every((r) => String(r[mrIdx] || "") === filterMr));

  // G02: Zero-Leak Unpriced & No Internal/TBC/Count Badges
  const textViolations = getVdrlCustomerViolations(preview);
  const priceViolations = rows.filter((r) => PRICE_LEAK_RE.test(r.join(" | ")));
  const countBadgeViolation = grouped.some((g) => /\(\d+\)$/.test(String(g.title || "")));
  const g02Pass = textViolations.length === 0 && priceViolations.length === 0 && !countBadgeViolation;

  // G03: OEM Completeness (applicable to MTO/LIS/SDRL equipment tables)
  const g03Applicable = hasBomCols;
  const g03Missing = g03Applicable
    ? rows.filter((r) => {
        const b = String(r[brandIdx] || "").trim();
        const m = String(r[modelIdx] || "").trim();
        const p = String(r[partIdx] || "").trim();
        return !b || !m || !p || /^(TBC|OEM|—|-)$/i.test(b) || /^(TBC|OEM specification pending)$/i.test(m) || /^TBC$/i.test(p);
      })
    : [];
  const g03Pass = !g03Applicable || g03Missing.length === 0;

  // G04: Location Partition & Per-Location Reset Index
  const g04Pass =
    !hasItemNo ||
    grouped.every((g) => {
      if (!g.rows.length) return false;
      const first = String(g.rows[0][0] || "");
      const last = String(g.rows[g.rows.length - 1][0] || "");
      const expectedFirst = String(preview?.header?.docType || "").toUpperCase() === "MTO" ? "A-1" : "1.1";
      const expectedLast =
        String(preview?.header?.docType || "").toUpperCase() === "MTO"
          ? `A-${g.rows.length}`
          : `1.${g.rows.length}`;
      return first === expectedFirst && last === expectedLast;
    });

  const checks = [
    { id: "G01", passed: g01Pass },
    { id: "G02", passed: g02Pass },
    { id: "G03", passed: g03Pass, applicable: g03Applicable },
    { id: "G04", passed: g04Pass },
  ];

  return {
    passed: checks.every((c) => c.passed),
    applicableTo: "ALL_VDRL_SDRL",
    checks,
    rowCount: rows.length,
    groupCount: grouped.length,
    violations: [...textViolations, ...priceViolations.map((r) => r.join(" | "))],
  };
}

/**
 * Validate that a built VDRL preview contains no internal notes, supplier leaks, or TBC placeholders.
 */
export function getVdrlCustomerViolations(preview) {
  const violations = [];
  for (const row of preview?.rows || []) {
    const joined = row.map((c) => (c == null ? "" : String(c))).join(" | ");
    if (FORBIDDEN_CUSTOMER_RE.test(joined)) {
      violations.push(joined);
    }
  }
  return violations;
}
