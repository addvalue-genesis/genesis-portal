// EQ-DISP snapshot is a display layer over Rev03. It must not change any Rev03 number.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const dir = path.resolve(__dirname, "../src/project0553/data/snapshots");
const rev03Path = path.join(dir, "release.rev03.20261103.json");
const eqPath = path.join(dir, "release.rev03.eqdisp.20261118.json");
const rev03Bytes = fs.readFileSync(rev03Path);
const rev03Hash = crypto.createHash("sha256").update(rev03Bytes).digest("hex");
assert.equal(rev03Hash, "7e84bc298a32c95858b458c06fd67bfdd6d0128d7b384a03d1e2edcaf678064f");
const rev03 = JSON.parse(rev03Bytes.toString("utf8"));
const eq = JSON.parse(fs.readFileSync(eqPath, "utf8"));
assert.equal(eq.snapshotKind, "EQ_DISP_ENABLED");
assert.equal(eq.derivedFrom, "release.rev03.20261103.json");
assert.equal(eq.replacesRev03, false);
assert.equal(eq.createdDate, "2026-11-18");
assert.equal(eq.readOnly, rev03.readOnly);
assert.equal(eq.issued, rev03.issued);
assert.equal(eq.displayPolicy.defaultEquation, "EQ-DISP-PRICE");
assert.match(eq.displayPolicy.note, /does not change prices/i);
assert.equal(eq.displayPolicy.nullAndNaRule.includes("0"), true);
const eqText = fs.readFileSync(eqPath, "utf8");
assert.equal(/project0550|PJ2608-0550/.test(eqText), false);
function numerics(value, at, out) {
  if (Array.isArray(value)) value.forEach((item, index) => numerics(item, at + "[" + index + "]", out));
  else if (value && typeof value === "object") {
    for (const key of Object.keys(value)) numerics(value[key], at + "." + key, out);
  } else if (typeof value === "number") out.push([at, value]);
}
const left = [];
const right = [];
numerics(rev03, "$", left);
numerics(eq, "$", right);
const rightByPath = new Map(right);
for (const [at, value] of left) {
  assert.equal(rightByPath.has(at), true, "missing Rev03 number " + at);
  assert.equal(rightByPath.get(at), value, "changed Rev03 number " + at);
}
const added = right.filter(([at]) => !left.some(([path]) => path === at)).map(([at]) => at);
for (const at of added) assert.match(at, /^\$(?:\.displayPolicy|\.rows\[\d+\]\.display)\b/, "unexpected new number " + at);
function withoutDisplay(value) {
  if (Array.isArray(value)) return value.map(withoutDisplay);
  if (value && typeof value === "object") {
    const copy = {};
    for (const key of Object.keys(value)) {
      if (key === "display" || key === "displayPolicy" || key === "snapshotKind" || key === "derivedFrom" || key === "replacesRev03" || key === "createdDate") continue;
      copy[key] = withoutDisplay(value[key]);
    }
    return copy;
  }
  return value;
}
assert.deepEqual(withoutDisplay(eq), rev03);
const nonPrice = eq.rows.filter(row => row.display.equation !== "EQ-DISP-PRICE");
assert.deepEqual(nonPrice.map(row => row.code), ["B4", "B11", "B12"]);
for (const row of nonPrice) {
  assert.equal(row.amountUSD, null);
  assert.equal(row.priceText, "N/A");
  assert.equal(row.display.equation, "EQ-DISP-NA");
  assert.equal(row.display.format.doNotDisplayAsZero, true);
}
for (const row of eq.rows) {
  assert.equal(typeof row.display.visibleToCustomer, "boolean");
  assert.match(row.display.source, /^release\.rev03\.20261103\.json#rows\[\d+\]\./);
  if (row.display.equation === "EQ-DISP-PRICE") {
    assert.equal(typeof row.amountUSD, "number");
    assert.equal(row.display.format.currency, "USD");
    assert.equal(row.display.format.decimals, 0);
    assert.equal(row.display.format.thousandsSeparator, ",");
  }
}
console.log("PASS 0553 EQ-DISP snapshot: Rev03 sha256 " + rev03Hash + "; " + eq.rows.length + " display rows; non-price " + nonPrice.map(row => row.code).join(", "));
