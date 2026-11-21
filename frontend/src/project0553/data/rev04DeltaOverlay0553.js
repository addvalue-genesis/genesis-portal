// PJ2608-0553 — Rev 04 Particular & Delta Overlay (Source -> SI Equations -> Working Rev 04).
// Reads immutable Rev 03 baseline + live VND/CUS sources + existing SI equations.
// Never mutates Rev 02 or Rev 03 historical snapshots; customer release remains gated.
import { MR0002_PRICE_REGISTRY_0553 } from "./mr0002PriceRegistry0553";
import { priceAorCFromCost0553 } from "./releaseCommercialModel0553";
import { OFFICIAL_USD_POLICY_0553, selectCurrentReleaseRev03_0553 } from "./officialUsdRelease0553";
import { ONSHORE_ROLE_WORKING_SELL_RATES_0553 } from "./onshoreWorkingRate0553";
import { SAMTEL_ENGINEERING_SERVICE_MARKUP_0553 } from "./samtelEngineeringServiceMarkup0553";
import JUTAL_RESPONSE_20261118 from "./snapshots/jutal.comments.response.20261118.json";

const roundUp = (value, step) => Math.ceil(value / step) * step;
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function buildRev04DeltaOverlay0553({ includeMotFatInB3 = false, includeMotOffshoreInServices = false } = {}) {
  const rev03 = selectCurrentReleaseRev03_0553();
  const fx = OFFICIAL_USD_POLICY_0553.thbPerUsd;
  const step = OFFICIAL_USD_POLICY_0553.incrementUSD;
  const serviceMarkup = SAMTEL_ENGINEERING_SERVICE_MARKUP_0553;

  // 1. A2 (MR-0002 Trunk Radio LNA + Self-Prepared Ex d Enclosure + CMP SS Glands) from VND + SI A/C Equation (x1.30 / FX)
  const mr0002EquipmentIds = new Set([
    ...Array.from({ length: 9 }, (_, i) => `MOT-${i + 1}`),
    "PROSPER-BARTEC-LNA-EXD-EST",
    "CMP-M20-LNA-EXD",
    "CMP-PLUG-LNA-EXD"
  ]);
  const a2SourceLines = MR0002_PRICE_REGISTRY_0553.filter((x) => mr0002EquipmentIds.has(x.id) && x.selected);
  const a2DirectCostTHB = round2(a2SourceLines.reduce((sum, x) => sum + (x.quotedTotal ?? x.unitRate * (x.qty ?? x.quoteQty ?? 0)), 0));
  const a2Commercial = priceAorCFromCost0553(a2DirectCostTHB);
  const a2RawUSD = round2(a2Commercial.customerSellTHB / fx);
  const a2AmountUSD = roundUp(a2RawUSD, step);

  // 2. MOT Optional Labor (Items 10-12) via SI Purchased Service Equation (x1.30 / FX)
  const motFatLine = MR0002_PRICE_REGISTRY_0553.find((x) => x.id === "MOT-10");
  const motOffshoreLines = MR0002_PRICE_REGISTRY_0553.filter((x) => x.id === "MOT-11" || x.id === "MOT-12");
  const motFatCostTHB = motFatLine?.quotedTotal ?? 0;
  const motOffshoreCostTHB = round2(motOffshoreLines.reduce((sum, x) => sum + (x.quotedTotal ?? 0), 0));
  const motFatSellTHB = priceAorCFromCost0553(motFatCostTHB).customerSellTHB;
  const motOffshoreSellTHB = priceAorCFromCost0553(motOffshoreCostTHB).customerSellTHB;

  // 3. B3 (FAT 2+1 -> 5 days at SAMTEL Warehouse; Offshore SAT moved to Proposal of Services per CCL-COMM-02)
  const baseFatWorkingSellTHB = 452850; // b3WorkingSellBreakdown0553 fatSell (20 rows)
  const extraFatDays = 2; // 2+1 (3d) -> 5d
  const extraFatWorkingSellTHB = extraFatDays * ONSHORE_ROLE_WORKING_SELL_RATES_0553.twoPersonSeniorPlusFieldTeamTHBPerDay;
  const b3FatWorkingSellTHB = baseFatWorkingSellTHB + extraFatWorkingSellTHB;
  const b3FatReleaseTHB = round2(b3FatWorkingSellTHB * serviceMarkup + (includeMotFatInB3 ? motFatSellTHB : 0));
  const b3AmountUSD = roundUp(b3FatReleaseTHB / fx, step);

  // 4. Proposal of Services (SAT + Survey + VeEX + B8 Residual + B9 Zhuhai)
  const satSurveyVeexWorkingSellTHB = 1587600 + 252000 + 30000; // b3WorkingSellBreakdown0553 satSell
  const satSurveyVeexReleaseUSD = round2((satSurveyVeexWorkingSellTHB * serviceMarkup) / fx);
  const motOffshoreServicesUSD = includeMotOffshoreInServices ? roundUp(motOffshoreSellTHB / fx, step) : 0;

  const b8ResidualWorkingSellTHB = 50400 + 10000; // 4x OEM online + 4x training packs (SAMTEL 1+1d dropped per CCL-COMM-04)
  const b8ServicesUSD = roundUp((b8ResidualWorkingSellTHB * serviceMarkup) / fx, step);
  const b9ServicesUSD = rev03.rows.find((r) => r.code === "B9")?.amountUSD ?? 15300; // Moved to Proposal of Services per CCL-COMM-05

  // 5. B10 (Keep 1.01, 1.03, 1.04 per CCL-COMM-06) & C1 (Keep 1.1, 1.2 per CCL-COMM-09)
  const b10Sheet = rev03.worksheets["1"]?.rows || [];
  const b10KeptCodes = new Set(["1.01", "1.03", "1.04"]);
  const b10AmountUSD = round2(
    b10Sheet
      .filter((row) => b10KeptCodes.has(String(row?.[1]?.value ?? "")))
      .reduce((sum, row) => sum + Number(row?.[8]?.value ?? 0), 0)
  );

  const c1Sheet = rev03.worksheets["4"]?.rows || [];
  const c1KeptCodes = new Set(["1.1", "1.2"]);
  const c1AmountUSD = round2(
    c1Sheet
      .filter((row) => c1KeptCodes.has(String(row?.[1]?.value ?? "")))
      .reduce((sum, row) => sum + Number(row?.[8]?.value ?? 0), 0)
  );

  // 6. Build Delta Overlay rows preserving Rev 03 structure & EQ-DISP display equations
  const rev04Overrides = new Map([
    ["A2", { amountUSD: a2AmountUSD, priceText: null, deltaSource: "MOT EN113/69 + Prosper/BARTEC Ex d + Versed CMP QT2603-149 (x1.30 / 31.5)" }],
    ["B3", { amountUSD: b3AmountUSD, priceText: null, deltaSource: "CCL-COMM-02: FAT 5d (B3) + Offshore SAT moved to Proposal of Services" }],
    ["B8", { amountUSD: null, priceText: "Moved to Services", deltaSource: "CCL-COMM-04: Drop SAMTEL 1+1d; residual moved to Proposal of Services" }],
    ["B9", { amountUSD: null, priceText: "Moved to Services", deltaSource: "CCL-COMM-05: Onshore specialist moved to Proposal of Services" }],
    ["B10", { amountUSD: b10AmountUSD, priceText: null, deltaSource: "CCL-COMM-06: Kept 1.01, 1.03, 1.04; BDA/removed spares struck through" }],
    ["C1", { amountUSD: c1AmountUSD, priceText: null, deltaSource: "CCL-COMM-09: Kept 1.1, 1.2; lines 2, 3, 4 (BDA), 5 withdrawn" }]
  ]);

  const rows = rev03.rows.map((r) => {
    const ov = rev04Overrides.get(r.code);
    const amountUSD = ov ? ov.amountUSD : r.amountUSD;
    const priceText = ov ? ov.priceText : r.priceText;
    const eqDisp = Number.isFinite(amountUSD) ? "EQ-DISP-PRICE" : "EQ-DISP-NA";
    return Object.freeze({
      code: r.code,
      sourceCell: r.sourceCell,
      rev03AmountUSD: r.amountUSD,
      amountUSD,
      priceText,
      deltaUSD: Number.isFinite(amountUSD) && Number.isFinite(r.amountUSD) ? round2(amountUSD - r.amountUSD) : null,
      displayEquation: eqDisp,
      deltaSource: ov ? ov.deltaSource : "UNCHANGED_FROM_REV03"
    });
  });

  const baseRows = rows.filter((r) => !["C1", "C2"].includes(r.code));
  const totalBaseUSD = round2(baseRows.reduce((sum, r) => sum + (Number.isFinite(r.amountUSD) ? r.amountUSD : 0), 0));
  const proposalOfServicesUSD = round2(satSurveyVeexReleaseUSD + b8ServicesUSD + b9ServicesUSD + motOffshoreServicesUSD);

  return Object.freeze({
    projectId: "PJ2608-0553",
    revision: "Rev03.1 (GF-LNA)",
    scopeVariant: "GF-LNA",
    targetFilename: "4-Scope of Supply Rev03.1 (GF-LNA).xlsx",
    supersedesDeviation: "DEV-TECH-01 (BDA -> LNA)",
    bfScopeSeparated: "10B B3-BF (ZPQ, ZWP8, ZWP11)",
    derivedFrom: rev03.revision,
    jutalResponseRef: JUTAL_RESPONSE_20261118.createdDate,
    fxTHBPerUSD: fx,
    a2Breakdown: Object.freeze({
      directCostTHB: a2DirectCostTHB,
      customerSellTHB: a2Commercial.customerSellTHB,
      rawUSD: a2RawUSD,
      roundedUSD: a2AmountUSD
    }),
    totalBaseUSD,
    rev03TotalBaseUSD: rev03.totalBaseUSD,
    deltaBaseUSD: round2(totalBaseUSD - rev03.totalBaseUSD),
    proposalOfServices: Object.freeze({
      satSurveyVeexUSD: satSurveyVeexReleaseUSD,
      b8ResidualUSD: b8ServicesUSD,
      b9ZhuhaiUSD: b9ServicesUSD,
      motOffshoreServicesUSD,
      totalUSD: proposalOfServicesUSD
    }),
    combinedBaseAndServicesUSD: round2(totalBaseUSD + proposalOfServicesUSD),
    rows,
    releaseAllowed: false
  });
}
export const buildRev031GfLnaOverlay0553 = buildRev04DeltaOverlay0553;
