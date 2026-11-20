# Vendor automatic loading — owner correction

4-Nov-2026, parent `ed26995d`, existing PR53 branch / port3050,
UI2026-11-04.5. The owner corrected the manual-download/import instruction:
prepare the data and make it arrive through the usual Git update/startup flow.
This supersedes the manual-install boundary of the earlier Vendor checkpoint;
it does not authorize Working price adoption or a customer issue.

## Concrete correction

The earlier code added a valid Vendor importer and company/system projection but
did not connect prepared Vendor JSON to startup. Git pull alone therefore exposed
the new controls while leaving the owner's saved vendors/offers unchanged.

- Prepared the existing private IDIE QO26163 Vendor_Register JSON in the verified
 0550 Google Drive project root under `90_SYSTEM_WORKING/DATA`. The target working
 and DATA folders were absent and were created there, without moving any original
 documents or changing sharing. Upload/readback confirmed the filename, JSON MIME,
 size11768bytes and parent. There is one new vendor and four source rate/option
 records; original units, native currency, source version/hash/locator and terms
 remain exactly in the private package. No private payload/rates entered Git.
- Extended the existing local-only source bridge with `/vendor-registers` and
 the same bounded project discovery, loopback/origin/method/no-store guards.
 It reads prepared `PJ2608-0550_*Vendor_Register_YYYYMMDD.json` packages from DATA;
 it does not need a CUS intake/preparation file to register independent supplier
 evidence. All prepared quote revisions are retained, not a newest-price rule.
- Identical semantic copies of a batch are deduplicated; conflicting copies fail
 closed. Limit100files,4MiB per file,16MiB combined response plus bounded envelope.
 No recursive other-project content scan, arbitrary paths or remote Drive HTTP
 credentials. The private data stays on Drive Desktop/the browser's existing DB.
- Startup fetches CUS and Vendor independently/concurrently, plans all Vendor
 additions before one optimistic-revision transaction, then processes the existing
 CUS path. A CUS failure does not undo a saved Vendor update; a Vendor conflict
 does not suppress the existing CUS path. Concurrent writes reload current data.
- Reuses `planVendorRegister0550`, canonical vendors/offers and the existing
 supplierRevisionImports receipts. Manual imports are recognized; consumed edits
 and deletions are not overwritten/refilled. No new schema field or migration.
- Existing07.1 reports startup status inline; existing07.2 groups the same canonical
 Offer IDs in either direction. Original IDs/CopyIDs, colours and +/− remain.

## Preservation and actual limits

ADR0550-001 principles1–3,5–6,8–12 apply. No Working rows/selections, durations,
quantities, cost/sell assumptions, FX/margins, source authority/reviews, engineering
approval, native template or frozen history change. New supplier evidence is not
a complete SI design or final commissioning budget. No0553 facts are imported.

The existing middleware is loaded when webpack dev server starts: after pulling,
stop the old server withCtrl+C and run `npm start` from frontend. A browser Refresh
alone cannot replace middleware already cached by an old server. Drive Desktop
must sync the prepared project DATA file; actual Windows mount/profile/sync and
the owner's IndexedDB remain outside this isolated verification. No manual JSON
download or file-picker import is required by the new startup path.

## Verification

- New DATA/HTTP/model validator passed with the actual private QO26163 JSON:
 1vendor/4native offers, CUS-independent load, full original financial/source/history
 field preservation, manual/automatic idempotence, edit/deletion retention, atomic
 invalid-package rejection, copy conflict, every revision retained, size limits
 and loopback/origin/method/no-store controls.
- Real isolated Chromium, production app, temporary Drive-like DATA and actual
 private JSON passed without file chooser/import clicks: initial old register,
 reload adds IDIE/four offers in one saved revision, both existing group views,
 exact preservation of all old workspace fields, reload without duplicate/save,
 and deliberate offer deletion retained. No page errors or external sending.
- Existing Drive/source-workspace auto-loading, Vendor registration/grouping and
 controlled commercial-issue regressions passed. Production webpack passed with
 the existing asset-size warning class (largest project chunk3.37MiB).
- Current context/contracts and final diff checks are recorded at delivery.
 No full chained monorepo build, Windows installation, PR merge or owner issue
 authorization is claimed. Drive placement is verified separately from Windows
 consumption; current Git is code, not a backup of saved browser work.
