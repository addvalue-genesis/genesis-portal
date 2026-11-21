import React, { useEffect, useMemo, useState } from "react";
import { ComponentCopyId } from "../common/ui/ComponentCopyId";
import {
  BRAND_MODEL_PART_EQUATION_0553,
  resolveVendorBrandModelPart0553,
} from "./data/vendorBrandModelPart0553";
import "./scheduleC1Breakdown0553.css";

const money = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

const unitMoney = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })
    : "—";

export function ScheduleC1Breakdown0553({
  group,
  sourceGroup = null,
  internal = false,
  defaultPricingMode = "itemized",
  showSubPrices,
  onPricingModeChange,
  onOpenSource,
  onTraceItem,
  moduleId = "bid.budget.pricing.release.schedule-c1",
  titlePrefix = "Schedule C1",
  subtitle = "",
}) {
  const [viewMode, setViewMode] = useState("interactive"); // "interactive" | "expandAll"
  const [localPricingMode, setLocalPricingMode] = useState(defaultPricingMode); // "lumpsum" | "itemized"
  const pricingMode =
    typeof showSubPrices === "boolean"
      ? showSubPrices
        ? "itemized"
        : "lumpsum"
      : localPricingMode;

  const setPricingMode = (next) => {
    setLocalPricingMode(next);
    if (onPricingModeChange) onPricingModeChange(next === "itemized");
  };

  const [selectedSite, setSelectedSite] = useState("ALL");
  const [expandedSystem, setExpandedSystem] = useState(true);
  const [expandedSites, setExpandedSites] = useState(() =>
    Object.fromEntries(
      [...new Set((group?.rows || []).map((r) => r.site || "GENERAL"))].map((s) => [s, true])
    )
  );
  const [expandedBoms, setExpandedBoms] = useState({});

  const sourceRowsByKey = useMemo(() => {
    const map = new Map();
    for (const sr of sourceGroup?.sourceRows || []) {
      const k1 = `${sr.site || ""}::${sr.tag || ""}::${sr.id || ""}`;
      const k2 = `${sr.site || ""}::${sr.tag || ""}`;
      map.set(k1, sr);
      if (!map.has(k2)) map.set(k2, sr);
    }
    return map;
  }, [sourceGroup]);

  const sites = useMemo(() => {
    const order = [];
    const bySite = new Map();
    (group?.rows || []).forEach((r, idx) => {
      const site = r.site || "GENERAL";
      if (!bySite.has(site)) {
        bySite.set(site, []);
        order.push(site);
      }
      const match =
        sourceRowsByKey.get(`${site}::${r.tag || ""}::${r.id || ""}`) ||
        sourceRowsByKey.get(`${site}::${r.tag || ""}`);
      const parsed = resolveVendorBrandModelPart0553({
        tag: r.tag,
        description: r.description,
        rawSpec: match?.specification || r.specification,
      });
      bySite.get(site).push({
        ...r,
        itemCode: `${group.code}.${idx + 1}`,
        sourceRow: match || null,
        parsedSpec: parsed,
      });
    });
    return order.map((site, i) => {
      const rows = bySite.get(site);
      const subtotalUSD =
        rows.reduce((s, x) => s + Math.round((x.amountUSD || 0) * 100), 0) / 100;
      return {
        site,
        sn: `${group.code}.${i + 1}`,
        rows,
        subtotalUSD,
      };
    });
  }, [group, sourceRowsByKey, internal]);

  useEffect(() => {
    if (sites.length > 0) {
      setExpandedSites(Object.fromEntries(sites.map((s) => [s.site, true])));
    }
    setSelectedSite("ALL");
    setExpandedBoms({});
    setExpandedSystem(true);
  }, [group?.code]);

  const visibleSites = useMemo(
    () => (selectedSite === "ALL" ? sites : sites.filter((s) => s.site === selectedSite)),
    [sites, selectedSite]
  );

  const handleExpandAllDocument = () => {
    setViewMode("expandAll");
    setExpandedSystem(true);
    setExpandedSites(Object.fromEntries(sites.map((s) => [s.site, true])));
    const allBoms = {};
    sites.forEach((s) => s.rows.forEach((r) => (allBoms[r.key] = true)));
    setExpandedBoms(allBoms);
  };

  const handleCollapseToPlatforms = () => {
    setViewMode("interactive");
    setExpandedSystem(true);
    setExpandedSites({});
    setExpandedBoms({});
  };

  const handleShowAllSystemRows = () => {
    setViewMode("interactive");
    setExpandedSystem(true);
    setExpandedSites(Object.fromEntries(sites.map((s) => [s.site, true])));
    setExpandedBoms({});
  };

  const handleExpandAllBomTables = () => {
    setViewMode("expandAll");
    setExpandedSystem(true);
    setExpandedSites(Object.fromEntries(sites.map((s) => [s.site, true])));
    const allBoms = {};
    visibleSites.forEach((s) => s.rows.forEach((r) => (allBoms[r.key] = true)));
    setExpandedBoms(allBoms);
  };

  const isItemized = pricingMode === "itemized";
  const colSpanTotal = 7;

  return (
    <section
      className="p553-sc1"
      data-component-key={moduleId}
      aria-label={`${group.code} Schedule C1 breakdown`}
    >
      <div className="p553-sc1-header">
        <h4 className="p553-sc1-title">
          {titlePrefix} — {group.code} · {group.mr} Breakdown of Lump Sum Price{" "}
          <ComponentCopyId projectId="PJ2608-0553" componentKey={moduleId} />
        </h4>
        <span className="p553-sc1-meta">
          {subtitle || `${sites.length} Platforms · ${group.rows.length} Equipment Items · Currency: USD`}
          {internal && ` · ${BRAND_MODEL_PART_EQUATION_0553.id}`}
        </span>
      </div>

      <div className="p553-sc1-toolbar" role="toolbar" aria-label="Schedule C1 view controls">
        <button
          type="button"
          className={`p553-sc1-btn ${viewMode === "interactive" ? "is-active" : ""}`}
          onClick={() => setViewMode("interactive")}
        >
          Interactive View (+/-)
        </button>
        <button
          type="button"
          className={`p553-sc1-btn ${viewMode === "expandAll" ? "is-active" : ""}`}
          onClick={handleExpandAllDocument}
        >
          Expand All Document Mode
        </button>
        <span className="p553-sc1-divider" />
        <button
          type="button"
          className={`p553-sc1-btn ${!isItemized ? "is-active" : ""}`}
          aria-pressed={!isItemized}
          onClick={() => setPricingMode("lumpsum")}
        >
          Lump Sum Lot Mode
        </button>
        <button
          type="button"
          className={`p553-sc1-btn ${isItemized ? "is-active" : ""}`}
          aria-pressed={isItemized}
          onClick={() => setPricingMode("itemized")}
        >
          Itemized Pricing Mode
        </button>
        <span className="p553-sc1-divider" />
        <button type="button" className="p553-sc1-btn" onClick={handleCollapseToPlatforms}>
          Collapse to Platforms
        </button>
        <button type="button" className="p553-sc1-btn" onClick={handleShowAllSystemRows}>
          Show All System Rows
        </button>
        <button type="button" className="p553-sc1-btn" onClick={handleExpandAllBomTables}>
          Expand All BOM Tables
        </button>
      </div>

      <div className="p553-sc1-pills" role="group" aria-label="Platform filter">
        <button
          type="button"
          className={`p553-sc1-pill ${selectedSite === "ALL" ? "is-active" : ""}`}
          onClick={() => setSelectedSite("ALL")}
        >
          All Platforms ({sites.length})
        </button>
        {sites.map((s) => (
          <button
            key={s.site}
            type="button"
            className={`p553-sc1-pill ${selectedSite === s.site ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSite(s.site);
              setExpandedSystem(true);
              setExpandedSites((prev) => ({ ...prev, [s.site]: true }));
            }}
          >
            {s.site} ({s.rows.length})
          </button>
        ))}
      </div>

      <div className="p553-sc1-table-wrap">
        <table className="p553-sc1-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Item Description</th>
              <th>Unit</th>
              <th className="is-num">Qty</th>
              <th className="is-num">Unit Rates (USD)</th>
              <th className="is-num">Total Price (USD)</th>
              <th>{internal ? "Notes / Source" : "Notes"}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="p553-sc1-row-system">
              <td>{group.code}</td>
              <td>
                <div className="p553-sc1-desc-row">
                  <button
                    type="button"
                    className="p553-sc1-toggle"
                    aria-expanded={expandedSystem}
                    onClick={() => setExpandedSystem((v) => !v)}
                  >
                    {expandedSystem ? "−" : "+"}
                  </button>
                  <span>{group.mr} · SCOPE OF SUPPLY ({sites.length} Platforms, {group.rows.length} Items)</span>
                </div>
              </td>
              <td>Lot</td>
              <td className="is-num">1</td>
              <td className="is-num">{money(group.parentUSD)}</td>
              <td className="is-num">{money(group.parentUSD)}</td>
              <td>{internal ? `Rev03 Target · Var ${money(group.varianceUSD)}` : "Priced items subtotal"}</td>
            </tr>

            {expandedSystem &&
              visibleSites.map((siteBlock) => {
                const siteOpen = viewMode === "expandAll" || !!expandedSites[siteBlock.site];
                return (
                  <React.Fragment key={siteBlock.site}>
                    <tr className="p553-sc1-row-platform">
                      <td>{siteBlock.sn}</td>
                      <td>
                        <div className="p553-sc1-desc-row">
                          <button
                            type="button"
                            className="p553-sc1-toggle"
                            aria-expanded={siteOpen}
                            onClick={() =>
                              setExpandedSites((prev) => ({
                                ...prev,
                                [siteBlock.site]: !prev[siteBlock.site],
                              }))
                            }
                          >
                            {siteOpen ? "−" : "+"}
                          </button>
                          <span>Platform: {siteBlock.site} ({siteBlock.rows.length} equipment lines)</span>
                        </div>
                      </td>
                      <td>Lot</td>
                      <td className="is-num">1</td>
                      <td className="is-num">
                        {isItemized ? money(siteBlock.subtotalUSD) : "Included"}
                      </td>
                      <td className="is-num">
                        {isItemized ? money(siteBlock.subtotalUSD) : "Included in Lot"}
                      </td>
                      <td>Platform Subtotal</td>
                    </tr>

                    {siteOpen &&
                      siteBlock.rows.map((r) => {
                        const bomOpen = viewMode === "expandAll" || !!expandedBoms[r.key];
                        return (
                          <React.Fragment key={r.key}>
                            <tr
                              className="p553-sc1-row-item"
                              tabIndex={-1}
                              data-breakdown-key={r.key}
                              data-release-a-source-key={r.key}
                            >
                              <td>{r.itemCode}</td>
                              <td>
                                <div className="p553-sc1-desc-row">
                                  <button
                                    type="button"
                                    className="p553-sc1-toggle"
                                    aria-expanded={bomOpen}
                                    onClick={() =>
                                      setExpandedBoms((prev) => ({
                                        ...prev,
                                        [r.key]: !prev[r.key],
                                      }))
                                    }
                                  >
                                    {bomOpen ? "−" : "+"}
                                  </button>
                                  <div>
                                    <strong>{r.tag || "TBC"}</strong> · {r.description}
                                    <span className="p553-sc1-subtext">
                                      {r.parsedSpec.brand} · {r.parsedSpec.model}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>{r.unit || "Set"}</td>
                              <td className="is-num">{r.qty ?? "TBC"}</td>
                              <td
                                className="is-num"
                                {...(isItemized ? { "data-price-detail": "unit" } : {})}
                              >
                                {isItemized ? unitMoney(r.unitUSD) : "Included"}
                              </td>
                              <td
                                className="is-num"
                                {...(isItemized ? { "data-price-detail": "amount" } : {})}
                              >
                                {isItemized ? money(r.amountUSD) : "Included"}
                              </td>
                              <td>
                                {internal ? (
                                  <>
                                    {onTraceItem && (
                                      <button
                                        type="button"
                                        className="p553-origin-trace"
                                        onClick={() => onTraceItem(r)}
                                      >
                                        Trace
                                      </button>
                                    )}
                                    {onOpenSource && (
                                      <button
                                        type="button"
                                        className="p553-detail-button"
                                        onClick={() =>
                                          onOpenSource({
                                            ...r,
                                            breakdownKey: r.key,
                                            breakdownOrigin: "released",
                                          })
                                        }
                                      >
                                        ↗ Source
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span>
                                    {r.status === "INCLUDED"
                                      ? "Included in package; no separate charge"
                                      : `Details per ${group.mr} §5 (${r.site})`}
                                  </span>
                                )}
                              </td>
                            </tr>

                            {bomOpen && (
                              <tr>
                                <td colSpan={colSpanTotal} className="p553-sc1-bom-cell">
                                  <div className="p553-sc1-bom-box">
                                    <div className="p553-sc1-bom-banner">
                                      <span>
                                        BILL OF MATERIALS (BOM) — {r.site} ({r.tag || r.itemCode})
                                      </span>
                                      <span className="p553-sc1-bom-badge">
                                        {isItemized ? "ITEMIZED PRICING MODE" : "LUMP SUM LOT MODE"}
                                      </span>
                                    </div>
                                    <table className="p553-sc1-bom-table">
                                      <thead>
                                        <tr>
                                          <th>Item</th>
                                          <th>MR Description</th>
                                          <th>Tag No.</th>
                                          <th>Offered Equipment</th>
                                          <th>Brand</th>
                                          <th>Model</th>
                                          <th>Part No.</th>
                                          <th className="is-num">Qty</th>
                                          <th>Unit</th>
                                          <th>Remarks</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>{r.itemCode}.1</td>
                                          <td>{r.description}</td>
                                          <td>{r.tag || "TBC"}</td>
                                          <td>{r.parsedSpec.offeredEquipment}</td>
                                          <td>{r.parsedSpec.brand}</td>
                                          <td>{r.parsedSpec.model}</td>
                                          <td className="p553-sc1-partno">{r.parsedSpec.partNo}</td>
                                          <td className="is-num">{r.qty ?? "TBC"}</td>
                                          <td>{r.unit || "Set"}</td>
                                          <td>
                                            {r.status === "INCLUDED"
                                              ? "Included in package; no separate charge"
                                              : r.customerBudgetIncluded
                                                ? "Included in quoted Part A budget"
                                                : `Per ${group.mr} §5 (${r.site})`}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })}

            <tr className="p553-sc1-foot">
              <td colSpan={4}>Total {group.code} · {group.mr} (USD)</td>
              <td className="is-num">—</td>
              <td className="is-num">{money(group.totalUSD)}</td>
              <td>{internal ? `Diff: ${money(group.varianceUSD)}` : "Priced items total"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
