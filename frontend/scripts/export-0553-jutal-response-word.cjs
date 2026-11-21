const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function buildJutalResponseWordHtml0553(snapshot) {
  const esc = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  // Never render rev03PriceRef or any internal pricing/cost fields.
  const rows = (snapshot.items || [])
    .map(
      (item) =>
        `<tr><td>${esc(item.id)}</td><td>${esc(item.code)} (${esc(item.mr)})</td><td>${esc(item.title)}</td><td>${esc(
          item.jutalComment
        )}</td><td>${esc(item.response)}</td><td>${esc(item.treatment)}</td></tr>`
    )
    .join("");
  return (
    `<html><head><meta charset="utf-8"><title>PJ2608-0553 JUTAL Comments Response (${esc(snapshot.responseRound)})</title></head><body>` +
    `<h1>PJ2608-0553 · Response to JUTAL Comments (Unpriced Commercial Proposal)</h1>` +
    `<p><strong>Round:</strong> ${esc(snapshot.responseRound)} · <strong>Reference Email Date:</strong> ${esc(
      snapshot.jutalEmailDate
    )} · <strong>Basis:</strong> Unpriced Commercial Clarification</p>` +
    `<table border="1" cellspacing="0" cellpadding="6"><thead><tr>` +
    `<th>ID</th><th>Ref / MR</th><th>Item</th><th>JUTAL Comment</th><th>AVS / SAMTEL Response</th><th>Treatment</th>` +
    `</tr></thead><tbody>${rows}</tbody></table></body></html>`
  );
}

if (require.main === module) {
  const snapshotPath = path.resolve(__dirname, "../src/project0553/data/snapshots/jutal.comments.response.20261118.json");
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
  const html = buildJutalResponseWordHtml0553(snapshot);
  const outPath = process.argv[2] || path.join(os.tmpdir(), "PJ2608-0553_JUTAL_Comments_Response.doc");
  fs.writeFileSync(outPath, html, "utf8");
  console.log("Wrote JUTAL response Word document:", outPath);
}

module.exports = { buildJutalResponseWordHtml0553 };
