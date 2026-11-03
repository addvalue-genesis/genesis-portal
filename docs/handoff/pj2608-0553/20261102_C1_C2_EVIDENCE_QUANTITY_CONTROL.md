# PJ2608-0553 — C1/C2 evidence and quantity control, 2 November 2026

## Corrected quotation obligation — R70

The owner correctly challenged the earlier phrase "optional quotation". Fresh original-document readback confirms BOD §11.1 and SPE §8.1 require priced **both capital and two-year spare lists**, with part numbers and lead times. All four MR §5 require the two-year quotation; their "quotation only" qualifies separate purchaser selection of physical supply, not permission to omit the bid schedule. DTS0001–0004 establish equipment characteristics and do not remove this BOD/SPE obligation. No complete-unit spare quantity is inferred from these clauses.

`c1QuotationRequired=true` and `c2QuotationRequired=true` are now explicit for each MR review. Legacy `c1Mandatory=false` is retained only for the historical **mandatory complete-unit** question and must never be used to decide whether C1 needs to be quoted. The C1/C2 UI states REQUIRED QUOTATION. Individual item-level NOT_RECOMMENDED evidence can be recorded, but an all-excluded scenario cannot produce a complete priced quotation or a zero total; purchaser disposition is required. The lifecycle requirement source now correctly cites BOD/SPE for capital spares, rather than MR Attachment7 (which concerns two-year spares). Current C1/C2 conditional quoted amounts and the financial/export sources remain unchanged and do not prove schedule completeness.

The owner's customer asked why the offered C1 included a complete RACON spare but no comparable capital-spare treatment for SCADA, L3 switch, BDA, IP phone or sounder. The owner instructed review of original BOD, DTS, SPE and STD and then implementation of the existing quantity controls for C1/C2 only. This change connects the existing installed-source coverage to a nonposting engineering review. It does not reprice the offer or create new business modules.

## Requirements read

- BOD `MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2`, 24-Aug-2026, §11.1–11.2 printed p22: price capital/two-year spares with part numbers and lead times; itemize necessary tools. §6.5 design availability/MTBF is not measured failure-rate evidence for spare sizing.
- SPE `MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2`, 24-Aug-2026, §8.1–8.2 printed p27–28: priced lists, commissioning/start-up scope, project SPIR and special tools.
- DTS-0001/0002/0003/0004 Rev.C1: SCADA including L3 switch, DMR LNA, Ex phone/sounder and RACON technical configuration. No explicit requirement for one complete capital spare of each equipment type or one complete RACON spare was found in these four DTS.
- `10008-STD-6-TEL-001-R01` §4.7 printed p35: identify commissioning and two-year spares; itemize and price tools. TEL-018-R01 includes commissioning/two-year/tool lists in engineering deliverables. TEL-011-R00 and TEL-016-R00 were also checked; they do not establish the selected complete RACON quantity.
- Each MR0001–0004 Rev.C1, 28-Aug-2026, §5: commissioning kit per platform, tools per phase, two-year spares quotation only. Attachment 7 requires part information and itemized prices and excludes commissioning/start-up list items. A kit is not one complete unit of every installed equipment item.
- Owner folder `1Is9IzXEkWdcAhEpTyYIf6NRV1xdFPQKF`: EXA-A8 Att-1 minimum commissioning parts and Att-2 operational tools. The PLC-based SCADA section in Att-1 is not an automatic percentage rule for SCADA radio/L3 switch. Its lack of a dedicated radio-spares table does not remove the MR/OEM obligation. Att-2's TETRA function needs applicability review against the selected DMR/BDA scope.

Exact document URLs and the controlling clauses are retained in `C1C2_REQUIREMENT_EVIDENCE_0553` and displayed inside the C1/C2 review. No external instruction, contract acceptance or supplier quote was generated.

## Existing price source is preserved

| Owner | Selected conditional offer | Actual existing basis |
|---|---:|---|
| C1 | USD97,500 | One complete RACON budget scenario: installed FCA USD75,000 comparator × existing 1.30 SELL factor. Not an independent OEM spare quotation. |
| C2 | USD23,000 | Twelve historical reference rows, THB721,806.60 /31.50, rounded upward once at category level to USD100. No new markup. |

Both remain options excluded from A+B USD902,900. B1 USD27,400, B14 USD25,000 and B4/B12 N/A remain unchanged. C1's one price reference and C2's twelve price references remain in the exact existing native export and Source→Release→Source paths. Historical references do not prove current SKU compatibility or all-system completeness.

## Data flow and gates

`selectC1C2EngineeringControl0553` reuses `selectSpareCoverageEngineering0553`, existing option price selection, and the existing B10/C2 conflict register. It groups existing exact MR/site/TAG source records for display; the original source identity, source quantity authority and individual record remain visible. The site-specific MR0002 BDA positions are retained (ZWP20 TCAB-508-002; ZWP21/ZWP22 TCAB-508-001); they must not be merged with neighboring surge enclosures. RACON remains absent from ZWP23.

C1 has eight current primary candidate families; C2 has fourteen current functional families. These are screening groups, not fourteen independent OEM stock SKUs. Some family headings include different assemblies/variants. A family source count is not an approved spare quantity or proof that all members can share one spare. Model/configuration and interchangeability evidence is required for a numerical candidate to become reviewable. OEM SPIR may split these families further before a final itemized offer is selected.

`evaluateC1C2Candidate0553` accepts explicit evidence inputs through a read-only adapter. Nothing defaults to an approved quantity. Supported quantity bases are a documented OEM recommendation, a documented contractual quantity, or the existing SPQ-002 Poisson demand function:

`mu = N × failureRatePerYear × horizonYears`

`q = smallest integer with P(Poisson(mu) ≤ q) ≥ targetConfidence`

C2 always uses two years; a caller-provided different horizon blocks the review. C1 requires a supplied horizon when using SPQ-002. The underlying model assumes independent failures, constant hazard and no repaired-stock replenishment or correlated common-cause demand. Do not use a design-minimum MTBF or assume a service confidence to fill missing evidence. SPQ-001 remains a commissioning budget scenario, not a default one-unit C1/C2 recommendation.

Before a calculated quantity and `Qty × evidence-backed unit SELL THB` can be presented as an evidenced review scenario, require:

- Classification decision, reason and source; a sourced NOT_RECOMMENDED decision is an exclusion for review, not an offered zero-price line.
- Installed configuration/count, OEM manufacturer and part number, Ex/variant/interchangeability proof and stock-location/pooling policy.
- Independent physical stock identity and a quantity method with evidence. Any stated documentary minimum must be sourced and met.
- Explicit SELL rate evidence, actual spare lead time and accepted delivery-basis evidence. A supplier cost is not silently treated as a selling price.
- Verified B10 physical list and reconciliation evidence. Manufacturer+part-identical B10 items block C2; ambiguous historical names are warnings and never automatic financial credits.
- Distinct physical stock identity across C1/C2 and candidate rows. Reusing the same stock ID blocks review pricing, including a reliability-derived quantity.

Missing data return `OPEN_INPUT`, with null reviewed Qty, null reviewed amount and null category sum. Each category total remains null until every applicable family has a sourced recommendation or exclusion. A complete synthetic scenario may calculate a category sum and apply the existing FX/upward-USD100 policy once, but `postToPricing` and `customerReleaseAllowed` always remain false. Neither complete numerical inputs nor a scenario constitute OEM approval or replace selected quotation amounts.

## UI and integration boundary

- Existing Working C1/C2 price-review panels show the all-system control before historical price references. The same component is reused in internal Release review.
- On Official 10.3.4, select C1 CapitalSpares or C2 2Y-Spares. The review is placed **below and outside** the native customer worksheet. It is explicitly an internal engineering review, not additional offered scope.
- The exact customer annex, XLSX generation, financial models and existing business module anchors are unchanged. The new view has no new `data-component-key` business module ID.
- Source links open the existing selected option source. Installed source records and controlling document links are exposed for engineering review. Existing native annex price-row roundtrips remain intact.
- No manual form, database migration, alternative price ledger, automatic repricing or publication is introduced. Future verified SPIR input can call the read-only adapter; default project data correctly remain OPEN.

## Validation

The targeted validator covers all four MR/six main systems, exact installed source identities and BDA positions, absent RACON/ZWP23, default OPEN/null semantics, synthetic SPQ-002 calculations, two-year horizon, contractual minimum, missing evidence, invalid rate, B10 manufacturer/part matching, C1/C2 stock collision, source/model immutability and single category rounding. UI rendering checks both categories and existing parent integration. Run:

```sh
npm run validate:0553-c1-c2-engineering-control
npm run validate:0553-b1-only-selection
npm run validate:0553-official-usd-release
npm run validate:0553-spare-coverage
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-spare-engineering-reconciliation
npm run validate:0553-budget-change-summary
npm run validate:0553-single-project-entry
npm run build:0553
```

Test outcomes and any browser limitations are recorded in the main handoff when execution completes. Do not describe this as a final OEM SPIR, complete priced all-system C1/C2 or issued customer revision.

Execution completed: all targeted commands above passed, plus module navigator and project-isolation validators. Production compilation completed with zero errors and three pre-existing bundle-size/performance warnings. The final bundle contains R69 and the C1/C2 review; its internal review is hidden from printing. Live port3053 project-route/bundle smoke passed and other project page modules were absent. Original financial fingerprints and native XLSX assertions passed. No interactive browser click/visual QA was run; Chromium is not installed. This remains a draft, with no customer issue or merge.
