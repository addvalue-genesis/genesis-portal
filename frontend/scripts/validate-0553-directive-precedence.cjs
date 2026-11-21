// Validator for EQ-0553-PARTICULAR-01, EQ-0553-DRAWING-01, EQ-0553-DOC-ENGINE-01,
// Rev02 VDRL routing, Rev03 R-01..R-05, and Step 2 S01..S05.
const assert = require("node:assert/strict");
const path = require("node:path");
const babel = require("@babel/core");

const root = path.resolve(__dirname, "../src");
const orig = require.extensions[".js"];
require.extensions[".js"] = (mod, file) => {
  if (file.startsWith(root + path.sep)) {
    const out = babel.transformFileSync(file, {
      babelrc: false,
      configFile: false,
      presets: [["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }]],
    });
    mod._compile(out.code, file);
  } else {
    orig(mod, file);
  }
};

const {
  evaluateParticularDirective0553,
  evaluateDrawingBoundary0553,
  extractVdrlDocType0553,
  resolveDocumentPrecedence0553,
} = require(path.join(root, "project0553/data/particularDirectiveRule0553.js"));
const { selectBcB1B2EquationExecution0553 } = require(path.join(
  root,
  "project0553/data/bcB1B2EquationExecution0553.js"
));
const particularReqs = require(path.join(
  root,
  "project0553/data/documentParticularRequirements0553.json"
));

let count = 0;
const pass = () => { count += 1; };

// D01-D10: Directive polarity, DEV_RE false positive, and strike precedence (F-01, R-04, R-05)
assert.equal(evaluateParticularDirective0553({ text: "UPS is not required" }).directive, "DO_NOT", "D01"); pass();
assert.equal(evaluateParticularDirective0553({ text: "Contractor shall not supply UPS" }).directive, "DO_NOT", "D02"); pass();
assert.equal(evaluateParticularDirective0553({ text: "Items excluded from scope" }).directive, "DO_NOT", "D03"); pass();
assert.equal(evaluateParticularDirective0553({ text: "Excluding civil works" }).directive, "DO_NOT", "D04"); pass();
assert.equal(evaluateParticularDirective0553({ text: "Mandatory package services" }).directive, "MUST_DO", "D05"); pass();
const d06 = evaluateParticularDirective0553({ text: "Optional items shall not be included in lump sum" });
assert.equal(d06.directive, "CLARIFY_CUS", "D06 directive");
assert.equal(d06.ambiguity, true, "D06 ambiguity"); pass();
const d07 = evaluateParticularDirective0553({ text: "Remove existing antenna and install new" });
assert.notEqual(d07.directive, "DO_NOT", "D07 never DO_NOT"); pass();
assert.equal(
  evaluateParticularDirective0553({ text: "Deviation: BDA in lieu of LNA; LNA is not required" }).directive,
  "DEVIATION_SI",
  "D08 deviation + negation"
); pass();
assert.equal(
  evaluateParticularDirective0553({ text: "Provide an 8-port switch" }).directive,
  "MUST_DO",
  "D09 R-04 plain 8-port spec"
); pass();
assert.equal(
  evaluateParticularDirective0553({ text: "BDA in lieu of LNA", signals: { strike: 1 } }).directive,
  "DO_NOT",
  "D10 R-05 strike precedence"
); pass();

// T01-T08: Document-type extraction & RPT split (F-03, R-01, R-02)
assert.equal(extractVdrlDocType0553("MR0001"), "MR", "T01"); pass();
assert.equal(extractVdrlDocType0553("CAL01"), "CAL", "T02"); pass();
assert.equal(extractVdrlDocType0553("MR-502-001"), "OTHER", "T03 equipment tag collision"); pass();
assert.equal(extractVdrlDocType0553("10008-TEL-BLD-0001 Rev.C1 - Block Diagram"), "BLD", "T04 Rev suffix"); pass();

const vdrlModel = selectBcB1B2EquationExecution0553([]);
const rows = vdrlModel.records;
const docDist = {};
for (const r of rows) {
  const dt = extractVdrlDocType0553({ doc: r.projectDocumentNo, title: r.title });
  docDist[dt] = (docDist[dt] || 0) + 1;
  if (r.mr === "MR-0004") {
    const segs = String(r.projectDocumentNo || "").toUpperCase().split("-");
    const segCode = segs.length >= 5 ? segs[segs.length - 2] : "";
    if (segCode !== "MR") assert.notEqual(dt, "MR", `T05 MR-0004 false MR on ${r.projectDocumentNo}`);
  }
}
pass(); // T05
assert.equal(extractVdrlDocType0553("MR-LQM-202-025A"), "OTHER", "T06 4-seg tag"); pass();
assert.equal(extractVdrlDocType0553("MR-502-001 ODU"), "OTHER", "T07 tag with suffix"); pass();
assert.equal(extractVdrlDocType0553("FAT Report RPT-010"), "RPT_TEST", "T08 RPT_TEST split"); pass();
assert.equal(extractVdrlDocType0553("Radio Coverage Study RPT-001"), "RPT_STUDY", "T09 RPT_STUDY split"); pass();

// P01-P04: Document precedence & null/phase/tie-break (F-02, F-05, F-06)
const p01 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "MR-0001", value: "IP66" },
  { doc: "DTS-001", value: null },
]);
assert.equal(p01.winner.docType, "MR", "P01 winner");
assert.equal(p01.providedByCustomer, true, "P01 provided");
assert.equal(p01.conflict, false, "P01 no false conflict"); pass();

const p02 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "TC-0001", value: "IP66", status: "CLOSED_NOTED" },
  { doc: "DTS-001", value: "IP 66" },
]);
assert.equal(p02.conflict, false, "P02 normalized whitespace"); pass();

const p03 = resolveDocumentPrecedence0553("SPEC", [{ doc: "TC-0001", value: "X", status: "CLOSED_NOTED" }], {
  phase: "R0_INITIAL",
});
assert.equal(p03.winner, null, "P03 R0 ignores TC");
assert.equal(p03.providedByCustomer, false, "P03 R0 provided false"); pass();

const p04 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "TC-0001", value: "A", status: "AGREED", hasMarkup: false },
  { doc: "DTS-001", value: "B", hasMarkup: true },
]);
assert.equal(p04.winner.docType, "TC", "P04 TC beats marked-up DTS"); pass();

// G01-G03: Drawing boundary fail-closed (F-04)
assert.equal(evaluateDrawingBoundary0553({}).supplyDirective, "CLARIFY_CUS", "G01"); pass();
assert.equal(evaluateDrawingBoundary0553({ lineStyle: "DOTTED" }).supplyDirective, "CLARIFY_CUS", "G02"); pass();
const g03 = evaluateDrawingBoundary0553({ lineStyle: "DASHED", hasCloudC1: true });
assert.equal(g03.supplyDirective, "DO_NOT", "G03 supply");
assert.equal(g03.interfaceDirective, "MUST_DO", "G03 interface");
assert.equal(g03.revDelta, "REV_C1_DELTA", "G03 revDelta"); pass();

// S01-S05: Step 2 Evidence exclusion, TC status gate, & Stricter comparator (F-10, Q5)
const s01 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "MR-0001", value: "IP66" },
  { doc: "CAL-001", value: "IP65" },
]);
assert.equal(s01.winner.docType, "MR", "S01 MR beats CAL evidence");
assert.equal(s01.providedByCustomer, true, "S01 provided");
assert.equal(s01.evidence.length, 1, "S01 CAL in evidence[]"); pass();

const s02 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "TC-0001", value: "8-port" },
  { doc: "MR-0001", value: "16-port" },
]);
assert.equal(s02.winner.docType, "MR", "S02 open TC does not override MR");
assert.equal(s02.openTcRefs.length, 1, "S02 open TC in openTcRefs"); pass();

const s03 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "TC-0001", value: "8-port", status: "AGREED", deltaAttrs: ["SPEC"] },
  { doc: "MR-0001", value: "16-port" },
]);
assert.equal(s03.stricterValue, "8-port", "S03 agreed TC relaxation");
assert.equal(s03.policyApplied, "AGREED_TC_DELTA", "S03 policy"); pass();

const s04 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "MR-0001", value: "IP66" },
  { doc: "SPE-0001", value: "IP67" },
]);
assert.equal(s04.stricterValue, "IP66/IP67", "S04 IP66/IP67 composite");
assert.equal(s04.compositeRequirement, true, "S04 compositeRequirement"); pass();

const s05 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "MR-0001", value: "-20..+60" },
  { doc: "DTS-0001", value: "-40..+70" },
]);
assert.equal(s05.stricterValue, "-40..+70", "S05 range hull");
assert.equal(s05.policyApplied, "MOST_STRINGENT_BASELINE", "S05 policy"); pass();

// V01: Rev02 VDRL routing invariants (F-09)
assert.equal(rows.length, 143, "V01 row count");
assert.ok(rows.every((r) => r.documentControlOwner === "B2"), "V01 all B2 doc control");
assert.equal(rows.filter((r) => r.workKind === "OWNER_TECHNICAL_REVIEW_PENDING").length, 0, "V01 zero pending");
assert.equal(rows.filter((r) => r.workKind === "TEST_PREP_B3").length, 0, "V01 no TEST_PREP_B3");
for (const r of rows) {
  const t = r.projectTitleType;
  if (t.includes("painting")) assert.equal(r.flags.I_B3, 0, "V01 painting I_B3=0");
  if (t.includes("erection, & installation procedure")) assert.equal(r.flags.I_install, 0, "V01 install I_install=0");
  if (t.includes("spares list")) assert.equal(r.flags.createsQty, false, "V01 spares createsQty=false");
  if (t === "inspection and test plan" || t === "fat procedure" || t === "sat procedure") {
    assert.ok(r.technicalWorkOwner.startsWith("B1_"), "V01 ITP/FAT/SAT proc starts with B1_");
  }
}
pass(); // V01

// R03: 91-row directive distribution
const dirDist = {};
for (const r of particularReqs.records || []) {
  const res = evaluateParticularDirective0553({
    text: r.requirement,
    topic: r.topic,
    signals: r.markup || {},
    decisionStatus: r.decisionStatus,
    recordType: r.type,
    tags: r.tags,
  });
  dirDist[res.directive] = (dirDist[res.directive] || 0) + 1;
}

console.log(
  `PASS: 0553 directive/precedence (${count} cases) | VDRL 143 docTypes=${JSON.stringify(docDist)} | 91-row directives=${JSON.stringify(dirDist)}`
);
