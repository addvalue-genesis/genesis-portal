// Validator for EQ-0553-PARTICULAR-01, EQ-0553-DRAWING-01, EQ-0553-DOC-ENGINE-01, and Rev02 VDRL routing.
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

// D01-D07: Directive polarity & ambiguity checks (F-01)
assert.equal(evaluateParticularDirective0553({ text: "UPS is not required" }).directive, "DO_NOT", "D01");
assert.equal(evaluateParticularDirective0553({ text: "Contractor shall not supply UPS" }).directive, "DO_NOT", "D02");
assert.equal(evaluateParticularDirective0553({ text: "Items excluded from scope" }).directive, "DO_NOT", "D03");
assert.equal(evaluateParticularDirective0553({ text: "Excluding civil works" }).directive, "DO_NOT", "D04");
assert.equal(evaluateParticularDirective0553({ text: "Mandatory package services" }).directive, "MUST_DO", "D05");
const d06 = evaluateParticularDirective0553({ text: "Optional items shall not be included in lump sum" });
assert.equal(d06.directive, "CLARIFY_CUS", "D06 directive");
assert.equal(d06.ambiguity, true, "D06 ambiguity");
const d07 = evaluateParticularDirective0553({ text: "Remove existing antenna and install new" });
assert.notEqual(d07.directive, "DO_NOT", "D07 never DO_NOT");
assert.equal(
  evaluateParticularDirective0553({ text: "Deviation: BDA in lieu of LNA; LNA is not required" }).directive,
  "DEVIATION_SI",
  "D08 deviation + negation"
);

// T01-T04: Document-type extraction (F-03)
assert.equal(extractVdrlDocType0553("MR0001"), "MR", "T01");
assert.equal(extractVdrlDocType0553("CAL01"), "CAL", "T02");
assert.equal(extractVdrlDocType0553("MR-502-001"), "OTHER", "T03 equipment tag collision");
assert.equal(extractVdrlDocType0553("10008-TEL-BLD-0001 Rev.C1 - Block Diagram"), "BLD", "T04 Rev suffix");

// P01-P04: Document precedence & null/phase/tie-break (F-02, F-05, F-06)
const p01 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "MR-0001", value: "IP66" },
  { doc: "DTS-001", value: null },
]);
assert.equal(p01.winner.docType, "MR", "P01 winner");
assert.equal(p01.providedByCustomer, true, "P01 provided");
assert.equal(p01.conflict, false, "P01 no false conflict");

const p02 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "TC-0001", value: "IP66" },
  { doc: "DTS-001", value: "IP 66" },
]);
assert.equal(p02.conflict, false, "P02 normalized whitespace");

const p03 = resolveDocumentPrecedence0553("SPEC", [{ doc: "TC-0001", value: "X" }], {
  phase: "R0_INITIAL",
});
assert.equal(p03.winner, null, "P03 R0 ignores TC");
assert.equal(p03.providedByCustomer, false, "P03 R0 provided false");

const p04 = resolveDocumentPrecedence0553("SPEC", [
  { doc: "TC-0001", value: "A", hasMarkup: false },
  { doc: "DTS-001", value: "B", hasMarkup: true },
]);
assert.equal(p04.winner.docType, "TC", "P04 TC beats marked-up DTS");

// G01-G03: Drawing boundary fail-closed (F-04)
assert.equal(evaluateDrawingBoundary0553({}).supplyDirective, "CLARIFY_CUS", "G01");
assert.equal(evaluateDrawingBoundary0553({ lineStyle: "DOTTED" }).supplyDirective, "CLARIFY_CUS", "G02");
const g03 = evaluateDrawingBoundary0553({ lineStyle: "DASHED", hasCloudC1: true });
assert.equal(g03.supplyDirective, "DO_NOT", "G03 supply");
assert.equal(g03.interfaceDirective, "MUST_DO", "G03 interface");
assert.equal(g03.revDelta, "REV_C1_DELTA", "G03 revDelta");

// V01: Rev02 VDRL routing invariants (F-09)
const vdrlModel = selectBcB1B2EquationExecution0553([]);
const rows = vdrlModel.records;
assert.equal(rows.length, 143, "V01 row count");
assert.ok(rows.every((r) => r.documentControlOwner === "B2"), "V01 all B2 doc control");
assert.equal(
  rows.filter((r) => r.workKind === "OWNER_TECHNICAL_REVIEW_PENDING").length,
  0,
  "V01 zero pending"
);
assert.equal(
  rows.filter((r) => r.workKind === "TEST_PREP_B3").length,
  0,
  "V01 no TEST_PREP_B3"
);
for (const r of rows) {
  const t = r.projectTitleType;
  if (t.includes("painting")) assert.equal(r.flags.I_B3, 0, "V01 painting I_B3=0");
  if (t.includes("erection, & installation procedure")) {
    assert.equal(r.flags.I_install, 0, "V01 install I_install=0");
  }
  if (t.includes("spares list")) assert.equal(r.flags.createsQty, false, "V01 spares createsQty=false");
  if (t === "inspection and test plan" || t === "fat procedure" || t === "sat procedure") {
    assert.ok(r.technicalWorkOwner.startsWith("B1_"), "V01 ITP/FAT/SAT proc starts with B1_");
  }
}

const dist = rows.reduce((m, r) => {
  m[r.workKind] = (m[r.workKind] || 0) + 1;
  return m;
}, {});
console.log(
  `PASS: 0553 directive/precedence (17 cases) & VDRL Rev02 routing (${rows.length} rows: ${JSON.stringify(dist)})`
);
