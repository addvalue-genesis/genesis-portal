const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { buildJutalResponseWordHtml0553 } = require("./export-0553-jutal-response-word.cjs");

const snapDir = path.resolve(__dirname, "../src/project0553/data/snapshots");
const rev03Bytes = fs.readFileSync(path.join(snapDir, "release.rev03.20261103.json"));
const rev03Hash = crypto.createHash("sha256").update(rev03Bytes).digest("hex");
assert.equal(rev03Hash, "7e84bc298a32c95858b458c06fd67bfdd6d0128d7b384a03d1e2edcaf678064f", "Rev03 SHA-256 must remain unchanged");

const rev03 = JSON.parse(rev03Bytes.toString("utf8"));
const jutalSnap = JSON.parse(fs.readFileSync(path.join(snapDir, "jutal.comments.response.20261118.json"), "utf8"));

assert.equal(jutalSnap.derivedFrom, "release.rev03.20261103.json");
assert.equal(jutalSnap.replacesRev03, false);
assert.equal(jutalSnap.priced, false);
assert.equal(jutalSnap.responseRound, "R1");
assert.equal(jutalSnap.jutalEmailDate, "2026-11-17");
assert.equal(jutalSnap.items.length, 14);
assert.equal(jutalSnap.items.filter((x) => x.kind === "DEVIATION").length, 1);
assert.equal(jutalSnap.items.filter((x) => x.kind === "TC").length, 13);

const forbiddenInResponse = [/\bUSD\b/i, /\bTHB\b/i, /\d[\d,.]*\s*(?:USD|THB|\$)/i, /\bItem\s*7\b/i, /SAMTEL\s*5%/i, /\bmarkup\b/i, /\bdirectCost\b/i, /\bsourceRef\b/i, /\bINTERNAL\b/i];

for (const item of jutalSnap.items) {
  assert.ok(item.id && item.response && item.treatment, "Missing fields on " + item.id);
  for (const re of forbiddenInResponse) {
    assert.equal(re.test(item.response), false, `${item.id} response leaked forbidden pattern ${re}`);
  }
  const revRow = rev03.rows.find((r) => r.code === item.rev03PriceRef.code);
  assert.ok(revRow, "Unknown rev03PriceRef code " + item.rev03PriceRef.code);
  assert.equal(item.rev03PriceRef.amountUSD, revRow.amountUSD ?? null, "rev03PriceRef mismatch for " + item.id);
}

// Also scan the generated Word document (Q3)
const wordHtml = buildJutalResponseWordHtml0553(jutalSnap);
assert.equal(wordHtml.includes("PJ2608-0553"), true);
assert.equal(wordHtml.includes("DEV-TECH-01"), true);
assert.equal(wordHtml.includes("CCL-COMM-06"), true);
for (const re of forbiddenInResponse) {
  assert.equal(re.test(wordHtml), false, `Generated Word HTML leaked forbidden pattern ${re}`);
}
// Ensure rev03PriceRef amounts do not appear in Word output
for (const amt of ["137,130", "137130", "241,290", "241290", "73,800", "73800", "181,100", "181100"]) {
  assert.equal(wordHtml.includes(amt), false, `Generated Word HTML must not render Rev03 price ${amt}`);
}

console.log("PASS: 0553 JUTAL response snapshot (14 items), Rev03 parity, & zero-price/zero-leak Word export");
