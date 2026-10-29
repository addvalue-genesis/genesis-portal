# 0550 — MGW detailed price preparation and currency conversion

29-Oct-2026. Base `628133c2`, UI `2026-10-29.11-preview`.

## User decisions implemented

Use MGW details where cover totals conflict; finish the quoted-source pricing and
identify specific decisions rather than withholding all calculation. The user
corrected an initial Jason selection to **MGW Marine/Aero/SSB**. Include the full
known **USD255,500 Other charges** in the draft pending scope adjustment/BOSCH
credit; do not assume that credit or an on-site price. INDUSTRONIC remains PAGA.

## Runtime behavior

- Every one of the 130 MGW source rows belongs to exactly one of 20 disjoint
  quoted-scope groups. Seventeen groups are selected in a fresh prepared draft:
  detailed equipment, MET/NDB quoted cover packages and five priced bought-in
  service groups. BOSCH PAGA, its coverage study and unpriced on-site service
  remain unselected. Quote scope is not substituted for required MR quantities.
- Group cost is dynamically summed from the canonical saved offers and original
  quoted quantities. Source version/hash and quoted quantity/unit rows are retained
  in each package's validated basis, including in a frozen workspace; a later
  catalogue edit cannot silently change those saved quantities. No duplicate manual cost ledger or second selling equation
  is introduced. Existing E12/E13 Procured Cost treatment prices the bought-in
  scope; no protected personnel rate is invented.
- The three exact legacy Jason radio anchor records are deselected, retained
  intact as alternatives, and listed in preparation metadata. INDUSTRONIC and
  tower selections remain. Other existing priced user records are retained and
  affected MGW groups are prepared as alternatives. Preparation is one-time;
  later edits/deselections are not undone on reload.
- Source prices, units, missing rates, source/quote dates and validity are checked.
  Selected group/source-offer ownership overlap is detected. Canonical offers
  and group definitions enter the Official review dependency key, so source-rate
  changes recalculate costs and stale the relevant review.
- Shared radio consoles/cables are charged once under A1-07 with an explicit
  remark; they are not allocated into each radio system again. Supplier factory
  integration/FAT is provisionally allocated with design/integration in B1, not
  mislabelled as on-site field assistance. Packing/delivery remains one B2 bundle.
  This price-row allocation is a draft interpretation, not customer acceptance.
- Existing Working sources show each priced group, inclusion detail, source-offer
  navigation, selection state and editable selling policy. Working, Budget and
  draft 10.7 use the same canonical model. MR rows remain to demonstrate gaps;
  source quote packages do not stamp MR coverage or engineering acceptance.
- Existing `bid.budget.fx` accepts THB/EUR directly or USD/EUR. Cross entry derives
  THB/EUR = USD/EUR × THB/USD, records direction/inputs in the existing source
  field and saves the same four-field FX record. Rates are not rounded to cents.
  A preview shows EUR → THB → USD before saving, independent of engineering gates.
  No actual EUR rate is guessed or embedded in code. Saved rates feed every
  projection; relevant reviews stale, frozen issues do not change.
- Optional preparation metadata and group binding fields are validated. Old
  workspaces/backups remain valid. No existing Module ID, snapshot, source fact,
  customer column, issued output or 0553 behavior is migrated.

## Principles applied and checks

ADR-0550-001 **2–6 and 8–14**: original source vs draft interpretation, many-to-many
package coverage, single cost ownership, explicit remaining inputs, canonical
price/source trace, dependencies, frozen history and project-wide scope.

Validation includes real-repository totals/partitioning, the corrected radio
selection and retained original values, full known other charges, current offer
changes and review invalidation, source-owner overlap, missing on-site price,
old-workspace schema, direct/cross FX direction and precision/range, unchanged
financial inputs when only FX is saved, and real UI/IndexedDB/draft XLSX/reload.
Final test results are recorded after completion below.

Final validation: all 17 non-browser 0550 validators and four current browser
suites (MGW/FX, controlled issue, recovery, SI/private work package) passed.
Production compilation passed with the existing asset-size warning. The old
bidding browser harness retains its documented obsolete tab-count assumption;
it is not included in this pass claim. No 0553 full-suite rerun is claimed.

## Limits

The calculation prices available supplier scope; it does not establish complete
project design or contractual acceptance. Unknown on-site service remains null;
scope/quantity/credit decisions remain visible. Engineering acceptance, exact MR
coverage, customer deviations, extra SI execution resources and formal issue are
separate work. The FX tool can convert immediately when its chosen rate is entered;
lack of engineering approval does not prevent its use or a priced draft export.
