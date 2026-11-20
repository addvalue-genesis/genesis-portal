"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { assertControlledSnapshot } = require("./assert-pj2608-0550-snapshot.cjs");
const raw = fs.readFileSync(path.resolve(__dirname, "../src/project0550/data/snapshots/pj2608-0550.rev07.json"));
assertControlledSnapshot(raw);
const lf = raw.toString("utf8").replace(/\r\n/g, "\n");
const crlf = Buffer.from(lf.replace(/\n/g, "\r\n"));
// Exact reported Windows checkout, reproduced without changing the source file.
assert.equal(crypto.createHash("sha256").update(crlf).digest("hex"), "acfc30a99bd963947765ea0fb4b8402f303cf6c7d8b419cb8a9c6c469a5834bc");
for (const text of [lf, crlf.toString("utf8"), lf.replace("\n", "\r\n")]) {
  const input = Buffer.from(text), before = Buffer.from(input);
  assert.doesNotThrow(() => assertControlledSnapshot(input));
  assert.deepEqual(input, before, "Integrity check must not modify source bytes");
  assert(text.includes('"HOLD"'), "Missing release-state regression fixture");
  assert.throws(() => assertControlledSnapshot(Buffer.from(text.replace('"HOLD"', '"OPEN"'))), /Controlled Rev10 snapshot changed/);
  // A one-digit numeric edit must remain a failure under both checkout styles.
  const number = /:\s*(-?\d+(?:\.\d+)?)/.exec(text);
  assert(number, "Missing numeric regression fixture");
  const offset = number.index + number[0].lastIndexOf(number[1]);
  const changed = text.slice(0, offset) + (Number(number[1]) + 1) + text.slice(offset + number[1].length);
  assert.throws(() => assertControlledSnapshot(Buffer.from(changed)), /Controlled Rev10 snapshot changed/);
}
for (const changed of ["\uFEFF" + lf, lf + " ", lf.replace("\n", "\r"), lf.replace("PJ2608-0550", "PJ2608-0553")]) {
  assert.notEqual(changed, lf);
  assert.throws(() => assertControlledSnapshot(Buffer.from(changed)), /Controlled Rev10 snapshot changed/);
}
console.log("PASS Rev10 integrity: LF/CRLF checkout parity, exact reported Windows hash reproduced; state/value/whitespace/BOM/project edits rejected; source bytes untouched.");
