# PJ2608-0550 — active bidding workflow

2026-10-27 (Asia/Bangkok). Software implementation for preparing the next bid. No customer issue, approval, merge or deployment is implied.

## Reference and scope

Continue the existing 0550 portal and data facade. This increment is based on PR #47, remote commit `75397497de7f812e6d00aece2d084502f9d364f5`, after the Windows CRLF snapshot fix. Protected baseline and issued history remain unchanged.

Read PR #45 AGENTS.md, Formal Handoff and Equation Reuse Manifest at `64bb422c3fc2b1dfb6cdae9893478c6447ef3122`. PERF-00 in PR #44 remains the performance reference. Inspecting and executing existing definitions does not establish engineering acceptance or equivalence to every GEQ family.

0553 references inspected:

- Commercial workspace, live release model and view registry at `b2ff217ba9573e50b2629ddf6e53c6082683f152`, branch `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024` (PR #39).
- Lifecycle navigation, common Copy ID pattern, source-row navigation and module/vendor relationships at integration reference `4c6ef6bbc668d4e28e5dc681e98863e01951ae37`.

Adopt the useful L3 work areas and one-source commercial projections. Do not port 0553 financial sources, FX, vendor amounts, WBS, locations, confidential records, native workbook mappings or markup policy. No Dolibarr/ERP connection is added.

## Active workspace

| Module / capability | Implementation and boundary |
|---|---|
| L3 navigation | A Original Documents; B Engineering & Bid Preparation; C Communications & Submissions. Ten active B tabs, wrapping visibly; no future-stage placeholder panels. Default is Bidding / Working. |
| E01–E18 | Executable bindings of the existing 0550 definitions, missing-input and domain checks, saved calculation IDs. E05 exposes both MD and paid MH. E11 markup and E12 margin remain distinct. |
| Engineering kernels | Executable PAGA SPL threshold, UPS energy, amplifier headroom and availability functions; existing eight-kernel library retained. Calculated does not mean accepted. Acoustic coverage, detailed RF/network/mechanical design are not replaced by these scalar functions. |
| Vendor / Offer | Separate vendor master and multiple dated offers/rates; original currency, unit, quotation/source and validity retained. Select an offer in Working or enter a manual rate with its basis. Existing controlled sources stay available as references. |
| Working Preview | System/WBS owner, unique scope key, requirement/TAG/source references, vendor/offer, saved quantity driver or manual quantity, cost, direct sell/markup/margin and prime treatment. No default project rates or FX. Unselected alternatives do not post. |
| Budget THB / Release USD | Read-only projections of the same derived selected rows, source IDs and revision. E17 uses explicit dated FX. Base A+B and optional Part C displayed separately. Partial scope is never labelled a full project total. |
| Trace and IDs | Existing 15 Module Registry IDs preserved; copyable project-qualified page/section/entity IDs; search opens the selected module and ancestors. New Working ↔ Release row navigation is exact and does not change quantities. Original RFQ native-sheet roundtrip remains open. |
| Schematic | Overall and per-system views of registered nodes/interfaces with drawing references. Nodes open the corresponding system. Initial scope inventory is labelled as inventory, with no invented topology. Real designs must be registered from controlled drawings. |
| Coverage | Existing 19-system matrix, ten PAGA review threads, native evidence review and outstanding requirement/TAG/ownership gates retained. Prices do not automatically close these gates. |
| Export | New THB/USD review XLSX derives from the same selected rows and excludes vendor/internal cost columns. Marked NOT ISSUED; original customer-form regrouping and approval remain pending. Frozen SAMTEL Rev00 export stays byte-identical. |

0553 GEQ/PEQ crosswalk remains reference-only until particular inputs, calibration and equivalence are reviewed. GMR row navigation is implemented for the new workspace; this is not a claim that all GMR contracts are implemented. GKR decision-store and GPE DAG/cache infrastructure are not imported.

## Data and calculations

`data.js` / existing repository now expose a separate mutable bidding-workspace adapter alongside the immutable controlled snapshot adapter. Current bid data has one canonical selector (`deriveBidWorkspace`); Budget, Release and review export consume it. Issued history continues to use the controlled snapshot. There is no second authoritative source of current bid prices.

Private user entries are stored in browser IndexedDB `GENESIS-PJ2608-0550-BIDDING`, schema `genesis.0550.bidding.v1`. Every save increments revision and retains the prior versions in that browser. Optimistic revision checks reject a stale tab instead of overwriting a newer save. Failed saves retain the form and show the error. There is no server synchronization, central multiuser database or cryptographically attested audit trail.

Use **09 Data / Trace → Export workspace backup** after a work session and before changing computer, browser or URL/port. Import validates project/schema/baseline and replaces the current workspace as a new revision. Browser storage can be cleared or evicted; private backups remain essential. The older PAGA evidence importer remains session-local and is not included in this workspace backup; retain its original evidence JSON separately. No private payload is bundled in the repository.

Unknown inputs remain null/OPEN. Expired/missing quote evidence, absent FX, inconsistent units, missing calculation references and duplicate selected scope keys block the corresponding price result. Zero is allowed only as an explicit numeric entry, never a substitute for missing data. Unit labels are preserved without automatic conversion. A selected offer edit recalculates every row referencing that Offer ID; a different quotation revision should be entered as a new offer.

Commercial chain: explicit quantity × native unit cost; direct selling rate (E10), cost markup (E11), or margin (E12); explicit prime markup (E13); conversion into THB and USD (E17). Customer line amounts are rounded to two decimals; selected totals sum the rounded lines. Manual assumptions remain manual evidence, not approved quotations.

## Existing records and remaining engineering work

The controlled Rev10, issued SAMTEL Rev00, original project module IDs, B1 reconciliation and existing HOLD/OPEN states are retained under **History** or their relevant engineering/risk views. Archive content mounts only when opened. No old bid price is silently adopted as authority for a fresh bid revision.

Still needed for an actual customer issue: approved current project evidence and vendor validity, completed installed TAG/MTO reconciliation, engineering proof acceptance, causal shared-cost ownership and inclusions review, remaining 19-system and B/C scope, and mapping/rounding acceptance in the original customer form. Release authorization remains HOLD. The software does not claim a complete priced offer merely because its selected rows calculate.

The new review export is for checking the current schedule, not a replacement for the native customer workbook or a submission transmittal. Area C shows the known historic issue and explicitly states that no new issue has been recorded.

## Validation

- `npm run build`: snapshot LF/CRLF regression, controlled data, coverage, evidence and new bidding validators, followed by production webpack.
- New pure-model tests: all E01–E18 plus four engineering functions, null/domain/overflow behavior, shared ownership, direct/markup/margin, offer validity, FX and unit gates, alternate exclusion, options separation, malicious/foreign schema rejection, review export and immutable Rev10.
- New production-browser script: `frontend/scripts/validate-pj2608-0550-bidding-browser.cjs`. Replaces the old pre-bidding navigation profiler for this UI revision. Requires Playwright and Chromium supplied by the test environment; no application dependency was added.
- Synthetic end-to-end scenario: 2 events × 3 days × 4 people = 24 MD / 192 MH; USD 100 cost/MD, USD 150 sell/MD, 10% prime and THB 40/USD yield THB 96,000 cost, THB 158,400 customer and USD 3,960. Changing crew to 5 updates USD to 4,950. These are synthetic regression inputs only, not project rates.
- Browser verifies persistence/reload, JSON backup/import, wrong-project rejection, duplicate ownership, concurrent stale-save rejection, schematic registration and navigation, module search/Copy ID, all ten tabs, prior PAGA evidence import, and protected historical display/export parity.
- Rev10 canonical LF SHA-256: `78832b4ea11b3c2781d3fe10183db071967056966e908bd63b570475fb84ed41`.
- Issued XLSX SHA-256: `2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`.

Browser metrics and digests are in `performance/bidding-browser-before.json` and `performance/bidding-browser-after.json`. Baseline was captured before application edits. Chromium headless on Linux at 1440×1000; click-to-two-animation-frames, not pure React commit time or a Windows benchmark. Content changed, so these samples do not prove a speedup. Three webpack bundle-size warnings remain (approximately 599 KiB JS). No speculative cache/selector optimization was made. Thai font glyphs were unavailable in the headless test image; layout and English controls were visually checked, while Thai user-device rendering remains to verify.

Reproduce from `frontend`:

```sh
npm ci --no-audit --no-fund
npm run build
# Provide PLAYWRIGHT_MODULE_PATH / CHROMIUM_EXECUTABLE_PATH if needed.
BASELINE_REPORT=../docs/handoff/pj2608-0550/performance/bidding-browser-before.json \
  node scripts/validate-pj2608-0550-bidding-browser.cjs /tmp/0550-bidding-browser.json
# Optional: PRIVATE_EVIDENCE_FILE points to a locally retained private PAGA evidence JSON.
npm start -- --port 3001
```

Open `http://localhost:3001/projects/pj2608-0550`. Work sequence: **Vendors / Evidence → First Principles (or Execution) → Working → Budget THB → Release USD → Backup**. Rates, FX and current bid rows start empty intentionally; use the retained controlled references and current evidence to populate them.
