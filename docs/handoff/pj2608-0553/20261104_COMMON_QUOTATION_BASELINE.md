# COMMON quotation baseline — 0553 implementation, 4 November 2026

Continue from remote `review/pj2608-0553-b1-lifecycle-20261030`, HEAD
`397556f901c7fe6c8fd2960e9465932d7535ad1c`. No new architectural Module IDs.
The existing `bid.budget.pricing.official` hosts the controls. Supplier costs,
quantities, FX, margins, original archive and current quoted prices stay intact.

## Problem and resulting behavior

An edited Working and a changed software build do not identify what the owner
actually used. Matching a total is insufficient: different details can share
the same total. Rev03 is already the exact selected quotation; its six-sheet
XLSX matches Drive SHA-256 `d350b023e3b24a2fbdbf2ed9285e55fc10d956235461edc906bc34e23fb6333e`.
B10=12960; B11/B12=N/A; B13=1530; B14=25000; base=894910 USD.
C1=181100 and C2=27220 remain outside base. Rev02=902900 remains historical.

The new workflow freezes copies of inputs, policy bindings, calculated details,
source links and exact artifact bytes. It stores explicit selection/use events
without editing any frozen record. Reopening Official restores the selected
frozen view. Live Current/History/Working remain explicit navigation choices.
The last used revision changes only after the owner records actual use.
That action does not send a message, approve engineering or prove acceptance.

## How Jack uses the existing screen

1. Open 10.3.4 Official / Current Rev03; check the selected numbers above.
2. In `ฉบับที่เลือกใช้จริง / ประวัติราคา`, enter recorder name and a revision label.
3. Click `ตรึงฉบับที่เปิดอยู่ + สำรอง`. The selected view becomes the frozen record.
   Keep the automatically downloaded INTERNAL JSON backup; it contains costs.
   Normal Official Export/original-download clicks invoke this same capture
   flow first. Then download the exact requested workbook from the recorded
   artifacts list; it records DOWNLOAD_STARTED bound to that file hash.
4. After deciding to use that exact record, enter purpose and the actual use
   date if known; otherwise leave it empty. Click the explicit use confirmation.
   Recorded time and unknown actual date are stored separately.
5. Edit Working through the original workflow. Reopen the frozen record or
   compare Working inputs with it. Historical values/files do not recalculate.
6. On another machine/browser/port, import the saved INTERNAL JSON. The import
   verifies every snapshot and file hash and scope before changing the register.
   It rejects a backup that removes/rewrites local history or diverges from it.

Changing live view does not silently select/use that live view. Open the recorded
view before confirming actual use. A fresh calculated Working capture is an
INTERNAL draft and retains the existing issue restrictions.

## Common equations and invariants

Let v denote the captured revision, q the quantity, x the authorized pre-round
unit value, s the rounding increment, and R the declared currency rounding.

### UP_UNIT_THEN_SUM

    u_i(v) = s * ceil(x_i(v) / s)
    L_i(v) = R(q_i(v) * u_i(v))
    P_k(v) = sum(L_i(v)) for the single posting leaf level of parent k
    Base(v) = sum(P_k(v)) for base scope only

`roundUnitUp` uses exact decimal integer arithmetic. `quotedLineAmount` implements
nonnegative decimal HALF_UP, default two places. Neither applies FX or markup
again. The project config chooses the increment, currency and applicability.
Unknown/null differs from zero. An included/excluded item requires its explicit
status; a missing price is never silently made zero or N/A.

### FIXED_PARENT_ALLOCATE — quantity-one shares

    T = frozen owner-selected parent price
    N = T / s                         (must be an integer)
    w_i = frozenWeight_i / sum(frozenWeight)
    n_i = floor(N * w_i)
    r = N - sum(n_i)
    add one to r largest fractional shares; break ties by stable line ID
    L_i = s * n_i; sum(L_i) = T

`allocateFixedParent` uses exact decimal/BigInt ratios and rejects duplicate IDs,
invalid increments/weights and non-one quantities. A future different quantity
pattern needs a separately verified allocator; do not change quantities to fit.
In this exact 0553 code **A1/A2/A3**, not all four groups, use fixed parent targets.
**A4** uses upward units. Both adapters now call the COMMON equation functions.
Whole Source/Official JSON was compared with the pre-change execution and is
identical; the COMMON extraction does not adopt new prices.

### IMPORT_EXACT_ARTIFACT

Import and preserve the existing quoted file values and original bytes. Do not
reapply rounding to them. Imported Rev03 has six original worksheets; today's
derived A1–A4 detail is captured as internal context, not misrepresented as a
previously transmitted original detail. Rev02 keeps all its original sheets and
submission metadata without generating a new transmission event.

### Identity and explicit use

    S_v = Freeze(source inputs + quantities + costs/sell + FX/margins
                 + trace/mapping + policy/version + output details
                 + scope/terms + software build + template/actual files)
    H_v = SHA256(CanonicalJSON_v1(snapshot))
    F_v,j = SHA256(exact file bytes)
    RevisionId = SHA256(CanonicalJSON_v1(record payload including file bindings))
    Used_v = explicit OWNER_ATTESTED_USED event bound to RevisionId and H_v
    NewWorking != implicit new Used_v

Canonical JSON sorts object keys, preserves arrays, rejects undefined/nonfinite/
sparse/cyclic values, and hashes the accepted JSON payload. Existing model
optional undefined fields are omitted at the project adapter's JSON boundary,
as with existing workspace JSON. The selected existing model numbers remain
unchanged; COMMON money equations accept normalized decimal strings. SHA-256
checks identity/integrity; it is not an identity signature or delivery evidence.

## Files and reuse contract

- `frontend/src/common/cost/quotationRounding.js`: decimal step rounding,
  line amount, fixed-parent allocation; no project prices/FX/vendors.
- `frontend/src/common/governance/quotationBaseline.js`: JSON canonicalization,
  SHA-256, immutable records/files, append-only selection/use events, scoped
  register, history-safe restore, stable-ID input diff and write preconditions.
- `frontend/src/common/governance/quotationBaselineStore.js`: IndexedDB adapter,
  compare-and-swap in one read/write transaction, no silent failure.
- `frontend/src/project0553/data/quotationBaseline0553.js`: PARTICULAR config,
  original file validation, frozen current input copy, actual six/ten-sheet
  exports and source template bytes; records the current build commit.
- `QuotationBaselineControl0553.jsx` and `RecordedQuotation0553.jsx`: controls
  and frozen rendering inside the existing Official component.

Another project supplies its own `(projectId, proposalStreamId, recipientGroupId)`,
sources, policy bindings, snapshot and original/generated file bytes. It calls
the same COMMON functions. No 0553 FX31.5, B codes, vendor or commercial price
belongs in the COMMON kernel. Preserve that project's existing Module/line IDs
and single cost-owner/bidirectional source trace.

## Storage, backup and limits

This is **browser IndexedDB + portable verified backup**, not a central DB or
automatic cross-device synchronization. A different browser/origin/port is a
different local store. Browser data deletion requires restoring a saved backup.
Every successful capture/selection/use/restore starts an INTERNAL JSON download.
Artifact-download events are saved first and start only the requested file
download; manual backup or the next use-confirmation backup includes those
events. A download event proves only the app started a download, not receipt,
actual proposal use, transmission or acceptance. Internal exports in the
existing10.3.3 Source/Working tools remain internal drafts; this guard applies
to the normal Official10.3.4 export/download workflow, not external Drive edits.
The app can start the download, but cannot assert the user retained the file.
A download failure is reported separately from the completed database save.
An unportable register over64MiB is rejected before a write. Quota/write failures
do not report success. A stale tab write is rejected by expectedVersion.

Immutable record/event prefixes cannot be removed/replaced. Corrections are
recorded as a new selection/use event; original events stay. Restore supports an
empty target or strict history extension. Divergent machine histories are
rejected without modifying local records; no automatic history merge is claimed.
External transmission/acceptance capture and authenticated central persistence
remain future integration work, not implemented or inferred here. Browser
typed recorder name is an attestation, not authenticated identity.

## Validation

- `npm run validate:common-quotation-baseline`: exact decimal boundary/fixed
  allocation, stable ties, snapshot independence, file/model/metadata tampering,
  null vs zero, use vs sending, missing use date, idempotence, foreign scope,
  pointer integrity, history rewrite, stale writes and verified backup roundtrip.
  Executes real 0553 original and Working capture with actual native artifacts,
  and frozen rendering with unrelated live inputs. Control hook harness tests
  freeze/backup, use, live-view guard, malformed restore and reopen selection.
- `validate-0553-tens-quote-rollup.cjs`: fixed-parent A1–A3 and current selected
  native Rev03 are now the explicit authorities. The older pre-tens fixture is
  preserved; A4 still checks its original upward rounding invariant. Existing
  six/ten-sheet XML/formula/total and repeat-export checks remain.
- Run exact Rev03 reference, Rev02 archive, existing release-view, isolation,
  single-project entry checks and `npm run build:0553`.

Native browser IndexedDB/click acceptance is separate from the injected-store
hook harness. No actual user ledger is fabricated, no owner use event is seeded,
and no email/customer release/merge is performed by this implementation.

## Continuation

Review this local implementation before publication. Git pull only transports
code/templates/policies; it must not replace business register pointers. Restart
webpack after a code update so the build commit is correct. For a Windows 0553
checkout use `npm run start:0553` on3053. Never pull the 0553 working branch into
the 0550 review directory without first checking its branch/worktree.
