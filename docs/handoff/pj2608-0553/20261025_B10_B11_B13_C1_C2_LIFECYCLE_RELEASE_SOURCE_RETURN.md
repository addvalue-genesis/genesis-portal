# PJ2608-0553 | B10/B11/B13/C1/C2 — Release → Source → Release Round-trip and cross-category physical owner controls

Date: 2026-10-25. Repo: addvalue-genesis/genesis-portal.
Branch: fix/pj2608-0553-urgent-thailand-cif-pricing-20261024.
Starting head verified identical to d64b79844a575440f53ff9cbcb6b18890a38e673.
PR #39 draft/unmerged. All updates are commits to this existing branch.

## Request
Make B10 erection/precommissioning/commissioning/start-up spares, B11 special tools, B13 consumables, C1 capital spares, and C2 two-year spares one coherent source-to-release controlled flow with **Release -> Source -> Release** exact row navigation. Avoid double posting equipment physically or financially across A/B/C categories. Preserve existing OEM evidence/data, calculations, budget assumptions and original Excel format until source proof is approved.

## Added nonposting shared registry
`frontend/src/project0553/data/spareLifecycleTrace0553.js`
`buildSpareLifecycleTrace0553(schedule,release)` consumes current canonical 10.2 `selectSpareCustomerSchedule0553()` and existing 10.3.3 `buildReleaseCommercialModel0553(...)`, not any extra price calculation.

- 16/16 source finance lines B10 four, B11 four, B13 three, C1 one, C2 four (unchanged identifiers).
- For each ID, verify `sourceId`, `traceId`, `sourceRowModuleId`, `nativeRow`, `nativeSheet`, `Qty`, Source Working THB and reverse mapping from the existing `release.annexTraceAudit`.
- Category sums B10 509,827.50; B11 157,657.50; B13 46,683.00 THB; C1/C2 remain **not quoted**, without zero/implied cost.
- Standard seven cross-boundary gates (still HOLD pending OEM):
  B10-A installed vs commissioning physical stock; B10-C1 capital; B10-C2 operating spares excluded by MR Attachment 7; B11-A software licence/tool owner; B11-B3 rental/SAT tester; B13-B5 packing; B13-A5 installed bulk.
- Requirement table identifies documentary minimum/gap for all 5 categories: MR Attachment 5/7, SPE 8.1/8.2, EXA-A8 Attachment 1/2, MR Attachment 9. B11's five Annex-8 telecom tool requirements remain to be reconciled with four MR phase pricing envelopes, not five additive quote lines. TETRA vs selected DMR gate still HOLD.
- Does not manufacture approved OEM spare SKU, Qty, unit price, interchangeability, cost credits, remove any physical stock, or mutate release data.

## UI and bidirectional navigation
`frontend/src/project0553/SpareLifecycleControl0553.jsx` — collapsed Internal five-category reviewer:
- cross-category 5-way summary and same selected Working Sell totals;
- documented quantity minima / OEM SPIR gates;
- all 16 exact row links to 10.2 Source and 10.3.3 Release;
- 7 cross-category No Double Count gates and legacy functional overlaps.

`frontend/src/project0553/CommercialWorkspace.jsx`
- Integrates the reviewer in 10.2 and Internal Release, without customer workbook content pollution.
- On 10.3.3 exact row Source click:
  1. check that the supplied row ID, `traceId` and `sourceRowModuleId` exactly match current Release;
  2. switch to 10.2 Working owner, select same B10/B11/B13/C1/C2 tab;
  3. reveal exact Source DOM anchor (existing nested row source ID);
  4. expose **"Return to exact 10.3.3 Release row"** button with saved `{code,sourceId,traceId,sourceRowModuleId}`;
  5. use existing `openReleaseAnnexRow` to focus `bid.budget.pricing.release.preview.annex.<code>.<sourceId>` and select correct Annex tab.
- Category-only Release Source Navigator lacks row identity; return button truthfully identifies a category Annex rather than falsely claiming the first row is the exact starting row.
- Existing Working row "↗ 10.3 Release" unchanged. Reopening either direction is UI-only, does not post or approve prices.
- The new review panel is collapsed and source links are Internal only. Native original six-sheet workbook export, official USD rounding and fixed 13-row physical annex constraints unchanged.

## Test and build
`frontend/scripts/validate-0553-spare-lifecycle-roundtrip.cjs`
- Asserts 16/16 source/release/trace identity, five category totals & C1/C2 null prices, 7 controls, SSR mapping, UI exact/category callbacks, unchanged official summary USD and XLSX geometry/approval HOLD.
- `frontend/package.json` registers `npm run validate:0553-spare-lifecycle-roundtrip` and runs it **before** the existing build validations.

From actual PJ2608-0553 checked-out frontend on Windows:
```powershell
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-existing-spare-owners-2026
npm run validate:0553-official-usd-release
npm run build
npm start
```
Please send actual console output: connected GitHub can commit/read source but cannot run this user's local Node/Webpack/browser, and there are no reported GitHub Actions runs on these commits. Do not claim validation success without a real run.

## UI manual test
1. Open PJ2608-0553 / 10.3.3 Release; switch customer preview mode to **Internal** (Internal viewer is enabled only for INTERNAL recipient).
2. Select B10, click "↗ 10.2 Source" for `B10-PTTEP-01`.
3. Working B10 source row must be highlighted/opened; click "↩ Return to exact 10.3.3 Release row".
4. 10.3.3 opens B10 and scrolls to same `B10-PTTEP-01`.
5. Repeat with B11 `B11-PTTEP-01`, B13 `B13-PTTEP-01`, C1 `C1-PTTEP-01`, C2 `C2-PTTEP-01` (C1/C2 prices remain NOT QUOTED).
6. Click category-only source link in existing Release navigator; return button must say "Return to 10.3.3 Bxx Annex" rather than exact source row.
7. Expand Internal five-category control to inspect requirement gates and 16 source/Release rows; do not confuse 14 B10 kit obligations with OEM spare SKU inventory.

## Outstanding scope beyond this UI/data-control update
- True purchasable SKU-level cost for B10/B11/B13/C1/C2 is **still not established** where OEM SPIR / actual delivered quantity / acceptable rate are missing.
- EXA-A8 edition precedence mismatch: SPE refers MMC23-5025 while accessible attachment is MMC25-5001.
- C2 excludes confirmed exact B10 physical spare stock under MR Attachment 7; do not use a mere functional name match for automatic removal.
- C1 complete RACON comparison is installed MDS FCA price, not independent spare price.
- Export of >13 **verified** B10 SKU rows on the *same* original XLSX sheet needs safe native row insertion/merged-cell/formula/print-area rewrite and full byte-level test; this turn does not change the export writer.
- Final customer release still requires full source/price approval.
