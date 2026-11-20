# 0550 — Workspace load diagnostics and original-data backup

UI `2026-10-29.7-preview`; base `a9eed7b0`.

The user observed `Unsupported workspace field` after pulling/restarting. The
exact unrecognized key and running build were not available in the screenshot.
An old server remained a hypothesis, not a confirmed root cause. All historical
top-level field lists in this branch are subsets of the current validator's list.
Do not delete browser storage or relax validation to make this error disappear.

The validator now names every unrecognized top-level field and returns a typed
error with its key list. The repository attaches the original saved record to a
load-validation error without transforming or saving it. The provider clears
unusable in-memory projections, stops automatic preparation/source loading for
that failure, and exposes recovery metadata. It does not seed an empty record.

The save-status panel shows a failed-load state, app version and build commit,
an original-record JSON download and copyable diagnostics. Diagnostics include
field names, schema/project/revision and build/origin, excluding field values,
prices, FX, source text and vendor content. The private RAW backup remains a
local download and contains the original active record, including unsupported
JSON fields. Earlier IndexedDB revisions remain untouched.

Strict loading/import/saving remains in place. This change is diagnostic and
recovery support; it is not a migration for an unidentified field. The next
schema correction requires the actual key names shown by the user's browser.
Release HOLD, module IDs, rates, quantities, FX, suppliers and issued history
are unchanged.

ADR-0550-001 principles **6, 9–12** apply: expose the incompatibility, preserve
source/user decisions and revision history, retain canonical ownership and make
the real state inspectable. No unidentified data is silently discarded.

Verified:

- `validate:pj0550-workspace-recovery`: exact key diagnostics, original record
  identity, zero load-recovery writes, strict save rejection, private diagnostic
  value exclusion, real backup UI, and known optional-field compatibility.
- Existing Working Preview, selected INDUSTRONIC AVL, Deviation Release and SI
  package regressions passed.
- Production compilation passed with the existing bundle-size warning.
- Isolated browser: injected incompatible fixture, named error/build, original
  RAW download, diagnostic value exclusion, reload/retry with unchanged financial
  inputs and revision store, and no page errors.

The user's Windows record has not been read or repaired by these tests.
