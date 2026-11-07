# Existing WP.1 responsibility / Vendor / Working overview

Starting branch HEAD: `650bce165e3b79d987679d629bdd5d6450730689`.
UI: `2026-11-04.10`. Same branch / draft PR53 / port3050.

## Behavior and canonical ownership

The existing WP.1 all-system scope table now separates TSI supply, COMPANY
responsibility, TSI services, unresolved responsibility/type and reviewed N/A.
Counts are requirement records, not equipment quantities or completeness scores.
All canonical systems, COMMON and additional authored scope remain visible.
Selected-system mode shows the same summary above the original constraint worklist.

Classification uses the current canonical requirement responsibility and linked
Working WBS (MR catalogue WBS only for its exact seed when no linked line is found).
Mixed or untyped work stays unresolved; title keywords do not decide scope.
Requirement groups open the existing record editor and materialize their record
lists only when expanded. Scope review/problems and its existing editor remain.

Offer presence uses the existing Vendor register projection, including exact
quotation system tokens and current requirement/Working bindings. Valid linked IDs,
missing references and canonical REVIEWED_MAPPING are separate counts. No link is
not evidence of no Vendor or an instruction to procure COMPANY equipment.

Working references use the existing MR owner-validation rule before accepting an
included owner, then deduplicate selected owners per system. Missing, deselected or
invalid owner references remain visible. Known-price counts use the existing finite
provisionalCustomerTHB (including zero), not Official/Release approval. COMMON or
shared owners are not allocated, added or summed across systems. COMPANY and
reviewed N/A records do not create TSI procurement-price gaps. Unlinked requirements
are shown separately. All navigation reuses original record/module IDs.

## Domain limits

VSAT retains COMPANY main equipment, TSI accessories/services and clarification;
AIS retains COMPANY supply and TSI engineering/testing. The two MGW Ku dishes
remain TEL-ES, not inferred TEL-VSAT-KU Internet. VCS catalogue requirements are
not treated as accepted MGW endpoints. MR is one source of requirements, not an
override of applicable PHI/DTS/SPE/drawings/standards/contracts.

ADR0550-001 principles1–6,8–14 guide the change: preserve source/requirement lineage,
separate supplier evidence from adequacy, preserve SI work and single cost ownership,
and distinguish received CAL/RPT from derived proof and frozen issues. This view is
read-only. It does not implement semantic document extraction, accept applicability,
resolve conflicts, prove capacities/quantity allocation, change AVL or pass Release.
Actual all-system engineering and owner Windows deployment remain unverified.

## Validation

- Extended system-constraints logic/SSR checks: VSAT/AIS split, VCS and Ku scope,
  exact MGW dish tokens, all/additional systems, exclusive record classification,
  valid/missing Offer IDs, zero/missing prices, valid/invalid/deselected/missing
  owners, mixed scope, reviewed N/A, no mutations and unchanged architectural IDs.
- Existing Working Preview and commercial Release-issue validators passed,
  including source staleness, unchanged financial inputs and immutable history.
- Existing context `--check` passed. `git diff --check` passed.
- Production webpack passed; one existing asset-size warning (105.bundle.js).
- Actual Source Rev11 / A Rev07 isolated browser:678 sources,20 scope options;
  VCS/VSAT/Ku/AIS/LAN/CCTV/COMMON, scope editor, requirement editor, source reverse
  navigation, search,1440/390 containment, reload, exact saved-workspace preservation
  and no page errors passed. Opening a lazily rendered responsibility group also
  navigated to the existing requirement editor without saving.

Private DATA is not bundled or changed. Git pull updates this view, not a browser
workspace backup. No financial adoption, customer issue, merge or deployment claim.

## Antigravity comment reviewed during this continuation

Owner supplied a report explicitly based on d641c9f0. Compared with branch650bce16
and the bounded WP.1 changes above; the report is evidence to evaluate, not an
instruction to replace the architecture or alter native customer forms.

- bidVolumes0550 derives active rows from model.official.lines (line81), and binding
  amount from line.customerUSD (line98). Bindings allocate scope/terms, not another
  editable price store. Missing allocations do produce HOLD. The existing synthetic
  validator reaches ready=true and equal baseAssigned/official.baseUSD; HOLD is not
  structurally permanent or proof of disconnection.
- Different WBS / Schedule code names do not change treatment or amounts. Existing
  scheduleAllocationPlan0550 is deterministic draft guidance and has an explicit
  saveScheduleAllocationDrafts0550 path preserving saved allocations. It remains
  deliberately unreviewed; this is not automatic semantic acceptance.
- B7/B8/B9 are absent from the reference customerForm rows. Real seed gap:4+5+4
  catalogue lines import with unmapped customerRowCode. Runtime mappingValid accepts
  any of these WBS under an existing Part B row (tested B1); that test is not a
  project allocation decision. Resolve default/allocation basis with the actual
  customer form, preserve saved decisions and shared owners; do not add native
  customer rows or reprice to silence the gate.
- nativePages uses chunks/continuation pages, including35 C1 rows across2 pages;
  native Word uses the same page projection, and the C1 versioned Word builder.
  Existing native/bid-volume/Working-schedule validators passed, including overflow,
  current-price propagation, canonical financial preservation and frozen exports.
- Current RFQ catalogue is85 expected inputs:78 DOCUMENT,2 EMBEDDED (both have
  excerpts),5 ATTACHMENT. Actual text is in private Source Intake (678 sources in
  the tested Rev11 pair); sourceReadiness checks bound sources, authority/revision,
  read state, embedded excerpts and document reviews. Expected-input metadata is
  not a claim of completed reading/engineering.
- PAGA/Master/IDIE/CERAGON private quotation/default/loader work is documented in
  prior checkpoints; MGW is not the only supported Vendor JSON. Detailed coverage
  for remaining legacy radio offers must still be checked individually.
- Discovery accepts GENESIS_0550_PROJECT_DIR and established Drive project/DATA
  paths. The report's Downloads/0550 listing cannot establish failure on the
  owner's Windows mount or prove private DATA absent. Do not claim Windows
  deployment from repository inspection or isolated browser tests.

Keep separate CUS sources, supplier evidence and authored SI mappings; do not use
Vendor quotations to rewrite the MR requirement catalogue. Follow canonical Working
pricing into both presenters, with explicit reviewed Schedule allocation and exact
reconciliation; do not delete HOLD controls or frozen-history protections.

## 7-Nov-2026. Working results by system

WP.1 `10.2.2.1.3` shows the existing Volume II draft and selected Working
owners for each system while CUS review is open. It displays THB subtotals for
Base A/B and Option C separately, retaining open owner rows and non-additive
references to other systems and COMMON. Existing CUS findings link back to
their source records. ADR §§4–6, 8–13 govern the projection.

The Rev.36 Drive pair combined with the reconstructed Working fixture produces
19 system drafts and COMMON. Selected Working owners appear once across those
rows. Hazardous Area Telephone references the existing PABX package and AIS
references COMMON activities. The two tower equipment prices remain open in
the tested fixture. The canonical reviews, quantities, prices and issue state
are unchanged. Context, system constraints and Working Preview validation and
the development webpack build passed. The owner's saved Windows workspace has
yet to be verified.

## 7-Nov-2026. Customer quantity and separate supply prices

The MR Rev.B1 Appendix 1.5 quantity is two installed dishes at each endpoint.
PHI §7.3.11 and SPE §7.2 establish 7 GHz, 99.99% and diversity assessment.
DTS-0010 sets the 1.2 m antenna basis and LIS-0004 item 12 assigns complete
system supply to TSI. The earlier ACP LIS cable-schedule comment refers to one
antenna. CERAGON Rev.A1 BoQ F93/G93 includes one shared dish per site. Add one
per site in the bid draft and retain the Full Outdoor versus separate IDU/ODU
architecture, link design and cable reconciliation as technical review.

The native APF DWG-0001 C4 and ACP DWG-0001 C1, sheet 2/2 Item 02, show
one microwave dish at 50 m and 29 m respectively. APF LAY-0010 C4 sheet 8
and ACP LAY-0003 C1 sheet 3 identify one microwave tag each in Detail A and
call for EPC to revisit quantities. DTS-0010 B1 sheet 4 likewise has one
microwave antenna tag per site. The layouts, drawings, older LIS and
RPT-0001 C4 are useful for interfaces and layout verification. The MR retains
two dishes per site as the bid baseline and calls for detailed BOQ adjustment
after the approved path and availability study. PHI text says about 40 km
and its Figure 7-15 labels 12 km. Verify the actual path and available
mounting separation before claiming space diversity or 99.99% availability.
Both MTO-0001s are bulk takeoffs. APF C5 item 4 gives 400 m of 50-ohm coax
before allowance and ACP C1 item 5 gives 360 m. These bulk values repeat in
MR Appendix 1.8 and cannot establish the microwave circuit quantity. Keep
the 200 m per site in Appendix 1.5 until the cable and route reconciliation.

The existing Working preparation installs four source-bound cost adjustments
after the controlled sources and original quote basis are present. It prices
each native tower row from that site's Master Tower items 2–5. Erection Item
10 stays in Base B4 and physical foundation construction Item 9 is excluded.
The CERAGON dish and MGW handheld differences are separate estimates. The dish
reserve uses the R11 non-protected link price less R12 two spare radios, and
the handheld reserve uses the Q26-063 mixed-lot rate divided by the quoted 122
radios. Neither calculation establishes an OEM unit rate. The Volume II
draft lists the bid scope and quantities without these costs. Reconcile the
previous budget-derived reserves before use.

ADR §§3–6 and 8–13 apply. Context, bid completion, live dossier and Working
Preview passed. The Rev.36 reconstruction verified the four prices,
preservation of existing owner totals, staleness after quote or owner change,
deletion/edit preservation and Release HOLD. The user's Windows workspace
remains unverified.

## 7-Nov-2026. Licensing cost visibility and single-dish design evidence

Part B8 displays the five existing regulatory cost owners. They cover
frequency and operating licence coordination, equipment type approval,
import permits, application support and the separate authority/agent fee
allowance. Volume I shows the same IDs and sales amounts in the 11.A1 Others
allocation. The native draft remark identifies the included licensing scope.
Amounts, original allocations, approved outputs and historical issues retain
their canonical owners. MR Appendix 1.0 §2.0(l), SPE-0011 §7.1 and LIS-0004
Item 12 distinguish TSI dossier preparation and representation from COMPANY
licence ownership. Confirm actual application counts and payer before issue.

SPE-0011 §§7.2–7.4 require a 7 GHz link, 99.99% availability and assessment
of diversity. The SPE does not prescribe two dishes per site. DTS equipment
tags, BLD-0011, DWG, LAY and RPT-0001 C4 §8.1 equipment schedules support
one dish per site as the design candidate. RPT §11.1 separately describes
space diversity. The MR Appendix 1.5 schedule remains two dishes per site
and permits detailed BOQ adjustment after approval of the link study.
Confirm this difference before removing the two-dish bid allowance.

## 7-Nov-2026. Licensing budget evidence and logistics checks

The internal B8 panel now shows the basis of the existing THB 300,000
authority/agent reserve: two import/export work packages at THB 25,000 and
five radio approval work packages at THB 50,000. These are planning drivers,
not an application count or statutory fee. The Rev.36 reconstruction adds
THB 80,000 of existing TSI labour for THB 380,000 total. Volume I continues to
read the existing price owners through A1 Others.

R03 Table 6.1 and §§6.1.2 and 6.1.5 identify the FaFE and prior-approval
requirements. The cost detail distinguishes approval preparation, agency and
authority fees, and physical logistics/customs costs. Confirm the intended
Satellite Systems route and the respective applicant and payer with COMPANY.
The planning schedule allows 5–6 months for sequential prior approval and
MOC licence processing while noting Table 6.1 lists 4–5 months.

The 0553 requirements JSON and costing JS are separate references.
0553's THB 200,000 was a project-specific external budget including agency,
fee allowance and reserves. The THB 100,000 Instrument figure was a separate
provisional SELL allowance with unknown direct cost. Neither is a 0550 charge
or an authority tariff.

## 7-Nov-2026. Official fee payer and payment milestones

B8 distinguishes the licensee/applicant, TSI application work, statutory
payment, and any authorized advance/recovery. MR Appendix 1.0 §2.0(l),
SPE-0011 §7.1 and LIS-0004 Item 12 establish different application roles.
The documents reviewed do not establish an ADDVALUE advance with recovery
via CNEEC. The working proposal is for the licensee to pay or for CNEEC to
arrange an agreed route. An ADDVALUE advance requires written terms.

The internal comparison shows MOC's CIF-based import reference and the
PTD Link by Link example at 7 GHz and 28 MHz. The PTD page was posted in
2018. Neither estimate is booked as a project fee. Before issue confirm
whether a fresh licence is needed, the PTD charging unit, first-year and
renewal payer, and FX. The Purchase Agreement ties customs to Incoterms;
the upstream EPC §31.5.2 net-cost reimbursement is conditional and is
separate from licence fees and from any ADDVALUE entitlement.
Annex 6 §5.3.1 sets a FaFE filing milestone at least six months ahead of
shipment. Payment timing follows the applicable authority's notice.

## 7-Nov-2026. Import and operating licence review by system

Working Part B8 lists all 19 canonical systems. The review covers goods
imported by TSI, COMPANY, its service provider, or Offshore under the relevant
package. Applications and their charges are tracked by the importer and
application, which can cover multiple systems. The system links open the
existing Part A groups. Operating licence notes reference LIS-0004 Rev.B1
items, with the Microwave SPE and Logistics Instruction cited where relevant.
The review distinguishes seven systems with a stated licence check, three
conditional checks and nine with no system-specific RF licence found in the
reviewed basis. Actual BOM, applicant, applicable approvals, payer and
renewals still need reconciliation for payment.

Internal B8 presents the published TradeNet CIF bands and the PTD 2018
Microwave example and selected Private Network/VSAT unit rates in MMK and
equivalent THB. The 6-Nov-2026 CBM snapshot
uses 109.11 MMK/THB as the indicative Market Trading basis, alongside the
62.60 MMK/THB Reference basis. Actual settlement terms remain open. The
comparison has no cost allocation. B8-D05 remains the shared provisional
fee owner and Volume I reads the same existing A1 Others bindings.
