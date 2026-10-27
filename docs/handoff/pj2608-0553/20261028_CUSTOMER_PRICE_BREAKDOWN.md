# PJ2608-0553 Customer Price Breakdown — 28 October 2026

The buyer requested a price breakdown. The forwarded JUTAL commercial instructions dated 20 October also require a detailed itemized quotation and a spare-parts schedule, and allow the bidder's own supply-scope template. Evidence: Gmail message `1a17ac2cc20c974d`, forwarded 27 October; it has no attachment proving the amount actually submitted on 26 October.

## Baseline and location

Implementation starts from GitHub `b2ff217ba9573e50b2629ddf6e53c6082683f152` on `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`. Work branch: `feat/pj2608-0553-price-breakdown-20261028`.

The project-hub commit `6b3b7448` has an older 0553 Release model without the later conditional C1/C2 changes. Do not replace this feature's baseline with that older model or overwrite ongoing 0550 work. This feature is not merged into the project hub or Customer Release.

- Existing `bid.budget.bom`: Source → Price Breakdown selector and exact source-row inspection.
- Existing `bid.budget.pricing` / Release 10.3.3: internal MR/Location/Item breakdown with source links.
- Existing `bid.budget.pricing.official` / 10.3.4: breakdown review and **Export Breakdown — Draft / 10 sheets**.
- Existing module IDs, quantities, FX policy, margins, financial owners and six original export sheets are retained.

### Customer and Internal screen views

Official 10.3.4 defaults to **Customer · สรุปตาม MR**: 17 MR/site summaries (A1 seven, A2 three, A3 four, A4 three). Internal Release defaults to the complete 141 source rows. Both provide Customer/Internal view buttons and **ซ่อนราคาย่อย / แสดงราคาย่อย** controls. Prices are hidden by default; showing them in Customer exposes the site-package allocation, not component supplier prices. System totals remain visible in both modes. Official's Internal selection survives exact Source roundtrips.

The summary is a presentation of the received MR scope and current offer, not a transcription of original MR line numbers. `A1.S1` etc. are summary identifiers. Quantity evidence comes from the existing MR0001 particular requirements (§5), MR0002 MR-summary basis, and MR0003/0004 C1 scope model. The three SCADA brownfield locations (ZPQ, ZWP8, ZWP11) show **See MR §5** with no invented aggregate quantity or unit price. MR0003 includes ZWP23; MR0004 does not. RACON's adapter/charging kit remains one shared phase requirement, never three separately charged kits.

Every internal row maps once to an MR/site summary using `[mr, site]`; the internal table displays its summary identifier and retains the exact `[mr, site, item id]` Source link. Summary amounts are sums of the already allocated row cents, not a second allocation or new ledger. Unknown locations, missing site coverage and duplicate ownership fail validation. Customer rows show the MR reference and concise scope qualifications; raw vendor/source descriptions remain in Internal. B/C services and spares retain their existing owners and prices.

These choices affect the screen only. **Export Breakdown — Draft / 10 sheets** still produces the detailed 141-row review workbook; the screen explicitly says so. Neither display mode is an access-control mechanism. No revised customer submission has been issued.

## Price and trace contract

The canonical System × Location × MTO projection remains the source. The internal breakdown contains all 141 rows: 83 priced, 23 included without another charge, and 35 not priced. It is not a new price ledger.

| Parent | Existing Release USD | Priced | Included | Not priced |
|---|---:|---:|---:|---:|
| A1 / MR0001 | 241,100 | 55 | 0 | 0 |
| A2 / MR0002 | 137,000 | 21 | 6 | 6 |
| A3 / MR0003 | 34,200 | 4 | 8 | 20 |
| A4 / MR0004 | 292,500 | 3 | 9 | 9 |

Each parent's existing USD amount is apportioned by its existing source selling-price weights. Largest fractional cents are assigned in stable MR/site/item-key order; sorting cannot change ownership of rounding cents. This is a draft allocation, not an independently quoted supplier unit rate. A/B subtotal stays USD 863,900; C1 USD 97,500 and C2 USD 23,000 remain conditional options outside A+B. Existing unquoted B4/B12/B14 remain unquoted.

Row identity is the JSON tuple `[mr, site, source item id]`, not TAG alone and not a displayed sequence number. Duplicate identities, stale Release/source parent prices and orphan rows are rejected. Source → Release and Release → Source → same Release row are navigation only; they do not post a price or change approval.

## Excel format

The existing six native sheets are exported unchanged, then four MR sheets are appended. The new sheets have Item, Location, TAG, Description, Qty, Unit, Unit Price USD, Amount USD and Remarks. Source IDs masquerading as TAGs are shown as TBC, and supplier-credit/internal accounting notes are replaced with customer descriptions that retain open technical scope.

Amounts use `ROUND(Qty*UnitPrice,2)`; priced subtotals use `ROUND(SUM(...),2)` and reconcile against the original Scope of supply A1–A4 cells. Included or unpriced amounts remain blank with explicit remarks. Four frozen header rows, repeated print titles, landscape printing and wrapping support review without dropping rows. No internal cost, margin, source URL or raw source object is serialized into the appended sheets.

## Release limit

The actually submitted commercial proposal has not been matched to this code snapshot. The new export is explicitly DRAFT / NOT ISSUED and cannot represent an approved replacement quotation. The new model's `releaseAllowed` remains false. The original export workflow is retained. Before a final customer issue, match the sent proposal revision and parent amounts, then resolve/retain each scope qualification explicitly; do not change amounts merely to close a display gap.

## Validation

Run `npm run validate:0553-price-breakdown` for source identity, complete row retention, price conservation, deterministic rounding, missing versus zero values, export privacy and all ten sheet relationships. The test also checks that the six original worksheets are byte-identical to the original exporter output.

Run `scripts/validate-0553-price-breakdown-browser.cjs` with provisioned Playwright and Chromium. It tests the 17-row default Customer view, price visibility in both modes, all source-to-summary mappings, then all 141 Official/Internal→Source→same-row routes, the internal Release return, four MR forward Source→Release→Source routes and a real XLSX download. `QA_SAMPLE=1` restricts repeated reverse testing to 13 boundary/included/pending examples.

The full repository build completed with 162 PASS markers and the existing three webpack asset-size/performance warnings. All 141 reverse routes passed. The final refinements passed another 13 boundary/included/pending reverse routes and all four MR Source→Release→Source routes, plus actual browser download. The final breakdown, original USD/native export, module-link and spare-lifecycle validators and production build passed. The generated workbook was imported and recalculated independently with Artifact Tool: four MR subtotals equal parent amounts, four differences are zero, and no formula errors were found. Desktop Excel on the user's Windows machine has not been exercised.

The MR summary update passed 17-row Customer/141-row Internal rendering, both price modes, complete one-owner mapping, 13 sampled exact source roundtrips and four MR forward routes in Chromium. Breakdown, Official USD, module-link and spare-lifecycle validators passed; production webpack compiled with the existing three performance warnings. The downloaded XLSX remained byte-identical (SHA-256 `72e5386f4424ad0805d82092be931e4e390eba9201a6ac6856083d76d2d9213b`).
