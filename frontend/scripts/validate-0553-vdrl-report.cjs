const assert = require("node:assert/strict");
const path = require("node:path");
const babel = require("@babel/core");

const root = path.resolve(__dirname, "../src");
const original = require.extensions[".js"];
for (const ext of [".js", ".jsx"]) {
  require.extensions[ext] = (m, f) =>
    f.startsWith(root + path.sep)
      ? m._compile(
          babel.transformFileSync(f, {
            babelrc: false,
            configFile: false,
            presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-react"],
          }).code,
          f
        )
      : original(m, f);
}
require.extensions[".css"] = () => {};

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { L3_TABS_0553 } = require("../src/project0553/lifecycleNavigation");
const {
  PTTEP_VDRL_NAMING_SPEC_0553,
  selectVdrlReportCatalog0553,
  buildVdrlDocumentPreview0553,
} = require("../src/project0553/data/vdrlReportCatalog0553");
const { VdrlReportWorkspace0553 } = require("../src/project0553/VdrlReportWorkspace0553");
const {
  CUSTOMER_RELEASE_GATE_EQUATIONS,
  evaluateCustomerReleaseGate,
} = require("../src/common/engineering/vdrlCustomerDeliverableStandard");
const { buildVdrlXlsxBytes0553 } = require("../src/project0553/data/simpleXlsxExport0553");

assert.equal(L3_TABS_0553.some(([id]) => id === "vdrl"), true, "L3_TABS_0553 must include vdrl tab");
assert.equal(PTTEP_VDRL_NAMING_SPEC_0553.companyCode, "ADDV", "Company code must be ADDV, never ADV");

const catalog = selectVdrlReportCatalog0553();
assert.equal(catalog.counts.total, 143, "All 143 VDRL deliverables must be present");
for (const row of catalog.records) {
  assert.equal(row.addvalueDocNo.includes("-ADDV-"), true, `Doc number must use ADDV: ${row.addvalueDocNo}`);
  assert.equal(/-ADV-/.test(row.addvalueDocNo), false, `Doc number must never use ADV: ${row.addvalueDocNo}`);
}

const mtoRow = catalog.records.find((r) => r.id === "VDRL-004");
assert.ok(mtoRow);
const mtoPreview = buildVdrlDocumentPreview0553(mtoRow);
assert.equal(mtoPreview.header.unpriced, true);
assert.equal(mtoPreview.rows.length > 0, true, "MTO preview must populate unpriced Part A rows");
const xlsxBytes = buildVdrlXlsxBytes0553(mtoPreview);
assert.equal(xlsxBytes[0], 0x50, "XLSX must start with PK zip signature");
assert.equal(xlsxBytes[1], 0x4b, "XLSX must start with PK zip signature");

const lisRow = catalog.records.find((r) => r.docType === "LIS");
const lisPreview = buildVdrlDocumentPreview0553(lisRow);
assert.deepEqual(lisPreview.columns, ["No.", "TAG NUMBER", "SERVICE AND EQUIPMENT DESCRIPTION", "Brand", "Model", "Part No.", "LOCATION", "QTY.", "UNIT", "REMARKS"]);

const allMtoPreview = buildVdrlDocumentPreview0553(mtoRow, { includeAllMrs: true });
const leakedRows = allMtoPreview.rows.filter((r) => /\b(EXION|PROSPER|MDS|QTORG\w+|allowance|budget|extrapolated|owner-selected|OEM specification pending|TBC)\b/i.test(r.join(" | ")));
assert.equal(leakedRows.length, 0, `MTO ALL preview must not leak supplier names, internal notes, or TBC: ${JSON.stringify(leakedRows)}`);
assert.equal((allMtoPreview.grouped || []).every((g) => g.rows[0][0] === "A-1" && g.rows[g.rows.length - 1][0] === `A-${g.rows.length}`), true, "Each Location group must reset numbering starting at A-1");
assert.equal((allMtoPreview.grouped || []).every((g) => !/\(\d+\)$/.test(g.title)), true, "Group banners must not contain internal row counts like '(8)'");
assert.equal(CUSTOMER_RELEASE_GATE_EQUATIONS.length, 4, "All 4 universal VDRL/SDRL release gate equations must be registered");
assert.equal(evaluateCustomerReleaseGate(allMtoPreview).passed, true, "All-MR MTO must pass G01-G04 Customer Release Gate");
assert.equal(evaluateCustomerReleaseGate(lisPreview).passed, true, "LIS must pass G01-G04 Customer Release Gate");

const mr0002MtoPreview = buildVdrlDocumentPreview0553(mtoRow, { includeAllMrs: false, filterMr: "MR-0002" });
assert.equal(mr0002MtoPreview.header.mr, "MR-0002", "Filtered preview header must show MR-0002");
assert.equal(mr0002MtoPreview.rows.length > 0, true, "MR-0002 filtered preview must return MR-0002 rows");
assert.equal(mr0002MtoPreview.rows.every((r) => r[1] === "MR-0002"), true, "Every row in MR-0002 filtered preview must belong to MR-0002");

const html = renderToStaticMarkup(React.createElement(VdrlReportWorkspace0553, {}));
assert.equal(html.includes("bid.vdrl"), true);
assert.equal(html.includes("16.1"), true);
assert.equal(html.includes("16.2"), true);
assert.equal(html.includes("MM-ZTK-1F-GEN-ADDV-TEL-"), true);
assert.equal(/\bUSD\b|\bTHB\b/.test(html), false, "Report - VDRL must remain strictly unpriced");

console.log(`PASS: 0553 Report - VDRL (${catalog.counts.total} deliverables, ${catalog.counts.withBid} With Bid, ADDV naming, unpriced templates)`);
