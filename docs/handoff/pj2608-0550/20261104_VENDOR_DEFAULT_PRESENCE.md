# Default Vendor presence and automatic private-rate completion

4-Nov-2026; parent `7497a0f1`; same Official Working branch/PR53/port3050;
UI2026-11-04.6. Owner reported pressing Load still showed only four suppliers and
required IDIE to be present by default. This supersedes the preceding requirement
that IDIE's identity itself wait for a successful Drive read.

## Cause and correction

Previous startup automatically attempted the Vendor endpoint but could create
IDIE only after a successful private package read. A missing Windows mount/file
therefore hid the entire supplier. Isolated success did not prove the owner's
actual mount. No specific Windows path/configuration failure was established.

- Versioned public catalog contains one IDIE identity and four QO26163 row
  identities/source locators/native units only. Both current/original money
  fields are null; original commercial terms are absent. This is source metadata,
  not an issued price, completed engineering or invented zero. Private rates/terms
  remain in the existing prepared project DATA file, outside public Git.
- Existing startup preparation writes defaults once through the existing
  optimistic-revision transaction, before Drive requests. Existing07.1/07.2
  display the supplier/rows even when the Vendor bridge is unavailable.
- A separate defaults batch uses existing supplierRevisionImports, not another
  database/schema/module. Exact untouched OPEN defaults may receive their same
  original private quote, preserving Offer IDs and avoiding duplicate rows.
  Edited/priced rows and deliberate deletions remain; a prior actual quote import
  takes precedence over defaults, including deletions. Ambiguous existing IDs
  are left alone rather than failing startup or commandeering source identity.
- Original private rates, source evidence and terms fill only untouched defaults.
  Updated-offer counts distinguish this from adding another supplier/four offers.
  Imported quoted quantities are reference quantities, not adopted service days,
  crew sizes or trips. No Working line, selection or cost/sell/FX/margin change.
- Pending original rates show OPEN and an inline existing07.1 status. Up to three
  background retry attempts follow the initial request at5second intervals;
  retries defer while a workspace transaction is busy. They read current saved
  data and use the same lock/revision guard. No Load, Refresh or file chooser is
  required when DATA arrives during these attempts. They do not run forever.
- If an old explicit CUS directory has no Vendor file, only the Vendor loader
  also checks normal Drive project discovery. CUS/A root selection is unchanged.
  Read bounds, project/schema checks, conflict rejection and loopback controls
  remain. A completely missing Drive mount still leaves original rates OPEN;
  default visibility is independent of that Windows-side availability.

## Preservation / versioning

ADR0550-001 principles1–3,5–6,8–12: facts/interpretation/engineering remain distinct;
no new cost owner, price adoption, source authority/review or issue approval.
Keep the original15 architectural IDs, Vendor07.1/07.2 anchors/CopyIDs/colours/+−,
existing saved records, frozen issues and exact export archive. No0553 facts.

Default catalog version1/batch and its hydration comparison are immutable. A future
catalog change needs a new version and explicit predecessor handling; do not edit
a consumed default batch or reset receipts to refill deleted rows. Real revision
identity and default identity are separate. Public default metadata is not an
alternate financial baseline or a replacement for the private original source.

## Verification

- Default model/SSR with actual private QO26163 passed: independent offline
  presence, four null rates, no financial inputs, exact original-rate/terms
  completion without duplicates, full/default/alias/edit/delete/identity-conflict
  preservation and explicit pending status. Public catalog money fields are all
  null and original pricing terms are absent.
- Real isolated production Chromium passed with the actual private package:
  initial Vendor503 still shows IDIE/four OPEN rows; later temporary DATA arrival
  fills all four original rates without Load/reload/import clicks; existing company
  and system projections work; all old financial/source/history fields match;
  repeated reload does not save/duplicate and deliberate deletion survives.
- Existing real Release/archive browser passed: actual synthetic readiness and
  authorization, exact bytes/SHA, selected reference, backup/tamper/restore, reload,
  stale-tab rejection, mobile containment, transmittal and historical-backup
  preservation. Browser fixtures pre-observe metadata defaults without adopting
  rates or weakening runtime gates. No page errors or external sending.
- Existing Vendor model/grouping, automatic Vendor/Drive bridge and controlled
  commercial-issue checks passed. Production webpack passed with the existing
  asset warning class, largest project chunk3.38MiB. Final context/diff checks are
  recorded at delivery; no whole-monorepo chain or Windows deployment is claimed.

Pull and restart the development server to replace cached bridge middleware.
Normal project startup then shows IDIE without a Load click. This verifies code
and default presence, not actual owner Windows Drive access or price adoption.
