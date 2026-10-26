"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

// Git can check out the unchanged text blob with CRLF on Windows. Normalize
// only those line endings; do not parse/reserialize, trim, or remove a BOM.
const CONTROLLED_REV10_SHA256 = "78832b4ea11b3c2781d3fe10183db071967056966e908bd63b570475fb84ed41";
function assertControlledSnapshot(raw) {
  assert(Buffer.isBuffer(raw), "Snapshot integrity check requires the original file bytes");
  const canonical = raw.toString("utf8").replace(/\r\n/g, "\n");
  assert.equal(
    crypto.createHash("sha256").update(canonical, "utf8").digest("hex"),
    CONTROLLED_REV10_SHA256,
    "Controlled Rev10 snapshot changed; explicit new authority/revision required (only CRLF line endings are normalized)"
  );
}
module.exports = { assertControlledSnapshot };
