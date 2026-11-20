# 0550 — Open the project, load existing JSON into A/B

UI `2026-10-30.3-preview`, based on `055ddb0020ae9535d5a3ee0dbf3a1ad5d91dfa25`.
Preserves dedicated 0550 routes and default port 3050 from `.2-preview`.

The owner corrected the previous manual ZIP/import instruction: the application
already has JSON data and a loader. Normal operation must use that path. No new
database, customer module ID or private source content is added to the Git bundle.

## Normal startup

The existing local Drive bridge now returns a paired JSON envelope from
`/api/local/pj2608-0550/source-workspace`. It discovers the same project DATA
directory, selects the controlled source intake and the linked A preparation for
that exact source batch. Current files are already stored in DATA. After the
normal Git pull/server restart, the owner does not download, select or upload
these files to populate A/B. The old source-only endpoint remains supported.

The client validates both records, the exact source fingerprint and DRAFT-only
preparation before one saved-workspace update. Different same-day package copies
or changed batches are held for reconciliation; a mismatched package cannot save
half of a newer source bundle. Source-only/offline loading retains its previous
behavior and saved user data. Loopback/origin/method and per-file size limits
remain; the paired response has a bounded combined size.

`sourcePreparationImports` is optional receipt metadata in the **existing**
canonical workspace/JSON backup. It is not another database or an approval. It
records a consumed preparation version so reopening does not resurrect rows the
user deliberately deleted. Existing edited rows/bindings are preserved. An older
explicit import is adopted using its existing exact audit action, without
refilling deletions. A newer local source/preparation is not downgraded.
Old workspaces without receipts remain valid; older strict readers must preserve
unknown records with their raw recovery path. Fingerprints detect changes and
are not authorization signatures.

Git still owns application code and reference JSON. Current private received
evidence remains in the existing DATA source path, and authored values/reviews
remain in the existing saved workspace. This change connects those existing
layers; it does not claim that Git is a live writeback database. Manual file
controls are explicitly fallback/recovery tools, not a prerequisite of startup.

## Principles and verification

ADR-0550-001 **1–2, 6, 8–13**: preserve source identity and gaps, use canonical
records, protect local decisions/history and show synchronization state. No
financial, quantity, FX, supplier-selection or frozen-issue values are changed by
source/preparation selection. Imported jobs/requirements remain unstamped DRAFTs;
the seven unmatched inputs, unreadable TEL018 R00 and engineering review stay OPEN.

- All 22 non-browser 0550 validators passed, including the new paired-loading
  contract. Subsequent adoption handling passed its targeted validator.
- Real private Rev08 and its linked package passed the actual local HTTP bridge:
  676 source records, 140 source-clause drafts, 249 reading jobs; second load is
  unchanged.
- An isolated browser opened with that actual paired JSON and no file-selection,
  upload or import click. It verified saved canonical records, retained user edits
  and deliberate deletions after reload, mismatched-source atomic rejection,
  unchanged financial/history records, GET-only reads and no page errors.
- Four browser suites passed against the final build: automatic actual JSON,
  existing A reading/manual fallback, commercial issue, and workspace recovery.
  Production webpack passed with the existing asset-size warning. Actual Windows
  installation and Drive Desktop mount/sync are not inferred from these tests.

The earlier `.1-preview` handoff and its ZIP describe preparation contents and
fallback import. Their manual startup instruction is superseded by this checkpoint.
