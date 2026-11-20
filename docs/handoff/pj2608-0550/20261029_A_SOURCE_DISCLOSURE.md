# PJ2608-0550 — Explicit source-module disclosure indicators

The A source inventory and source-findings headings already used native
`details`/`summary`, but displayed no explicit minus/plus indicator. The shared
summary flex styling could also hide the browser's native marker, making the
available collapse action unclear.

The existing `Module` component now accepts an opt-in `showToggle` presentation
prop. Only `bid.documents.controlled-source-inventory` and the noncompact
`bid.documents.source-findings` enable it. Their headings show minus while open
and plus while closed, with visibility driven by the native `open` attribute.
Native keyboard disclosure and navigation that opens ancestor `details` are
preserved. IDs and Copy ID controls remain unchanged. The compact Risk view and
other modules retain their previous presentation.

ADR-0550-001 principles **10–12** apply: canonical source records are not copied or
modified, issue history remains untouched, and the existing module identities
now expose their disclosure state visibly. No new modules, source-intake schema,
financial logic, stored data or release decisions are introduced.

Validation uses the existing source-render check, direct React server rendering
of both opted-in headings and the unchanged compact Risk view, production webpack
compilation, and `git diff --check`. These are presentation/compilation checks,
not project compliance or financial acceptance.

Browser interaction was not verified: Chromium was absent and the browser
download returned an invalid archive. An additional run of the existing source
renderer with a large private intake exposed a pre-existing assertion expecting
all source rows in the initial server render; the UI deliberately renders only
the first 50 rows. The validator and pagination behavior are unchanged by this
small disclosure change. The normal existing synthetic source-render check passes.
