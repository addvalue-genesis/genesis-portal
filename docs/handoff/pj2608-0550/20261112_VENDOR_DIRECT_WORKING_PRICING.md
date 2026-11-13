# Vendor Offers as the Working price source

12 November 2026 · PJ2608-0550 · Base `ccc4ad37`

In 10.2, open ALIE R2 Supplier source trace and select **เตรียม Working จาก Offer** on an eligible 07.2 source row. The existing Working editor receives the Offer ID, system, TAG, source, unit, currency and documented equipment quantity. Saving creates one canonical Working owner. The source rate stays on the Offer and the Working model calculates cost, ADDVALUE sell and the Prime selling layer. Service rates per day or trip require a Working workload. Priced option spares can start in Working C2 or C3 when the source explicitly identifies Schedule C4 or C3. Actual-cost, ambiguous option, included component and already allocated rows need review of their source or existing owner.

Working Preview in Volume I uses a compatible Vendor schedule tag for an unallocated selected owner. Existing saved allocations, special current-tender allocations and SI spare-equation rules retain priority. E/F draw from their existing A1 Others owners. Mapping remains available for MR evidence, scope review and exceptions. Official review and the frozen issue path continue to use their existing evidence and approval rules.

PAGA Working A1-05 can select INDUSTRONIC A20261632-005 as one discounted NET Lot on the existing owner. Choosing the Offer applies the project direct-supplier E11 markup and uses the recorded Prime rate, with the project goods default when no Prime rate is entered. Registering the quotation leaves the existing selected revision in place until the Working owner is edited. Item 25010 is the commissioning kit for -005. The included kit in -002/-003 remains Item 18020. Included quote detail stays non-additive.

## PAGA Appendix 1.4 selling policy

12 November 2026 · Follow-up to `ea134091`. The selected INDUSTRONIC Part A owner under A1-05 uses ADDVALUE 25% markup on its sourced cost (E11) and SAMTEL 20% markup on the ADDVALUE sell price (E13). The customer price is 1.50 times the sourced cost before currency conversion and rounding. The policy applies in the Working editor, on offer selection, at startup and when saving live Working. The existing offer, quantity, FX, Volume I binding and issue snapshots retain their own records. The earlier scope notes and checks below describe the initial Vendor intake implementation.

The change follows ADR-0550-001 principles 2, 5 and 8–11. The ALIE regression verifies migration from the earlier selling basis, idempotence, scope isolation and an updated Official review fingerprint. The private -005 check verifies the single NET owner and the common Working, draft Release and C1 amount. Source costs stay on the existing Offer. Official issue review follows the existing controls.

## Checks and scope

- ADR-0550-001 principles 2–6 and 8–13 guided the separation of quoted facts from working scope, one financial owner, transparent OPEN items, direct source trace, revision review and preserved issue history.
- The ALIE regression checks live Offer repricing, E11 and E13, duplicate and included-row protection, OPEN service workload, Base/Option routing and source-tagged Schedule preview. The private -005 register checks the actual NET owner, its included kit, 50% ADDVALUE and 20% SAMTEL in the fixture and duplicate NET suppression. No private source file is tracked in Git.
- Working Schedules, Bid Volumes, Bid Completion, Supplier Revision and controlled Release Issue validators passed. Development and production webpack compiled. Chromium launch is blocked by the execution environment's socket permissions, so browser interaction and the owner's Windows IndexedDB remain unverified.
- The parent repository-basis fixture expects 117 registered Offers and finds 116. The MGW detail validator on the parent also stops while checking a RADIO component inside a nested HTML table.

## 13 November · APF IP PBX Server

The existing APF MR 9.0 Working owner for A1-04 takes one Dell R660 server bundle at the registered CHEVALIER CITT-QT-392-2026 Rev.01 item 1.1.1 unit rate. The two-bundle Offer and package-level discount remain in 07.2. Working uses the MR quantity and the existing Goods selling basis. The draft still needs supplier confirmation of the one-bundle rate and SI review of the second server's role and placement.

The automatic 07.2 load and manual Vendor registration both use this source when the generated Working owner is eligible. 10.7 Draft and 11.C1 item 1.3.P1 use the same owner and price. The quoted NET package and the allocated server bundle cannot both charge the same source. The old MGW Offer remains traceable. Authored costs, reviewed allocations, and frozen issues retain their existing records.

ADR-0550-001 principles 2, 3, 5, 6 and 8–13 apply. The private CHEVALIER register test checks the MR and prior MGW paths, source quantity, repeated preparation, A1-04 Release and C1 price parity, competing NET, and protected Working and Schedule records. The Windows workspace must load the prepared CHEVALIER Vendor register through the existing source intake. Its saved state has not been observed.

## 13 November · CHEVALIER full quotation correction

The previous single-R660 draft is superseded. The original CITT-QT-392-2026 Rev.01 PDF reconciles to 34 Products items, two Base service lots, and 15 Options. The successor Vendor register retains the printed rates and quantities and records the fixed discount against Products. Software licences and prepaid OEM support follow the Products lot.

Working A and A1-04 use the discounted Products lot once. C1 displays the shared supply price and all quoted product quantities, including two R660 bundles. CHEVALIER Base items 1.1.15–1.1.17 (Auteldac 6, E2S Sounder and Xenon Beacon, three of each) appear under APF · IP Phone (Ex) in the C1 breakdown. The MR row points to the shared Lot price. Site assignments, handset mix and Ex-phone accessories still require review. The source NET summary and previous MGW Offers remain available in Vendor.

Working B4 carries the two supplier-procured service lots under the existing Procured Cost policy. C7 carries the initial site and integration lot. A1 Others / 11.E carries the two-year remote maintenance lot. Scope and price notes identify the unallocated Options and the outstanding C2–C6, C8, D, E and F requirements. 11.M and 11.P read the same Working allocations. The 11.P draft trace is present in the screen, XLSX, HTML and complete draft Word export. Reviewed and frozen records follow the existing controls.

Verification uses the original two-page PDF and the private Vendor register. It reconciles the 51 item prices, the fixed discount, the three Working owners and the C1, C7 and E amounts. Regression checks cover prior generated owners, overlapping NET, reviewed and authored work, all draft trace destinations and customer exports. Saved Windows consumption is pending verification.

### CHEVALIER PABX working budget

Startup prepares three C2 commissioning spare estimates from the registered
CHEVALIER Base unit rates and one C6 Option for four first-fill kits. The
existing B5 and C1 Working categories feed the native C2 and C6 bindings.
C8 carries three unselected purchaser call-off rates for eight man-days.
The existing schedule receipt preserves later edits and deletions.

The Volume I schedule panels, 11.M and 11.P show PABX shares against the
existing project owners for operating/capital spares, tools, handover,
inspection, import, insurance and Ex phone mounting. The shares are internal
estimates. They add no second price and are flagged for reconciliation if
the owner has no available cost basis. The complete draft exports use the
same bindings and PABX schedule status. Supplier rates remain in the
private Vendor register. The applicable C8 form, spare logistics and
scope, source and commercial reviews remain open.

ADR-0550-001 principles 2, 5, 6 and 8–11 govern the distinction between source
rates, estimates and shared owners, and preserve the reviewed and issued
price paths. The private CHEVALIER fixture validates C2/C6, C8 exclusion
from Base/Option, unchanged shared owners, edit/deletion preservation,
and draft XLSX and Word output. Windows startup requires the current
CHEVALIER register.

### ADDVALUE standard procured-cost selling basis

Working records markup and shortage contingency separately, each at 5% of
the same cost. SAMTEL adds 20% to the resulting ADDVALUE sell price. The
standard customer multiplier is 1.32. The allowance stays on the same price
owner as a selling layer. Quote cost and approved procurement quantities
retain their original basis. Working, Release and Volume I use the same
calculated prices. The C2–C4 spare draft uses the same equation as its
prepared Working owner.

Startup and save update recognized legacy 5% margin / 20% Prime defaults.
Explicitly different pricing, protected labour, pass-through and the special
PAGA, CERAGON and Master Tower markups keep their respective treatments.
Changed price inputs require the existing Official review again. Historical
policy snapshots and issued records retain their saved inputs and outputs.
ADR-0550-001 principles 2, 5 and 8–11 govern cost evidence, single ownership
and traceability. The private CHEVALIER fixture verifies the three quoted
owners through Working and Volume I. Full live project totals depend on the
Windows workspace and its current Vendor data.

## 13 November · PAGA supply and service rates

Working A1-05 selects the current INDUSTRONIC A20261632-005 NET against
the existing generated Part A owner. The price uses ADDVALUE +25% and
SAMTEL +20%. Authored, reviewed and deselected owners retain their
selection. In the Working C1 Appendix 1.4 view, the APF and ACP MR rows
reference the package and the relevant quotation items. Per-site
allocation remains open. The package carries one amount through
Working, draft Release A1-05 and C1.

Working B4 and draft C7 use two ID-IE Offer-linked rows. QO26169 covers
Local FAT execution in Bangkok. QO26163R1 covers OEM site supervision
for the ADDVALUE execution team at APF and ACP, subject to confirmation
of Myanmar applicability. Quantity and service selling inputs are open.
The QO26169 crew-day basis and the number of days require confirmation.
The OEM FAT at Wertheim remains inside the original INDUSTRONIC package.

The PAGA service section displays the existing ADDVALUE protected daily
rates from 06 Execution for the Senior Telecom Engineer and Chief Telecom
Technician. PAGA person-days and the allocation against shared Working B4
activities are pending the execution plan.

ADR-0550-001 principles 2–6 and 8–12 apply. The private register checks
cover the existing owner, C1 and Release tie-out, the five ACP rows,
unpriced ID-IE B4/C7 workloads, the system rates and preservation of
authored selections and deleted service drafts. Vendor registers were
located in the original project DATA. Supplier rates remain in private
DATA. The supplier revision, C1, Working Schedules, Bid Completion, Bid
Volumes and Release Issue validators passed, and production webpack compiled.
Chromium could not start in the test environment. The owner's Windows workspace
still needs a pull and a reload.

## 13 November · MGW FOC and Cables

The supplied Bulk Material and LAN/PBX/FO PDFs match the SHA-256 hashes
in the existing Vendor intake. A fixture transcribed from the PDFs
validated all 33 priced bulk lines and the six Fiber Patch Panel lines.
The draft uses 32 cable and six panel owners in the fixture. The APF RG59
line remains open for overlap with Entertainment coax. APF, ACP and
ABV01 cable items follow the native MR sites. The three pipeline runs
quoted under AMS01 follow the MR FOC-WITH-PIPELINE group. AMS01 site
cables and the remaining VTA scope still require confirmation.

07.2 shows candidate MR locations and the 11.A1, C1, M and P links for
the selected supply. 10.7 retains A1-13 for FOC/Bulk and A1-01 for CAT6A.
Appendix 1.8 displays the six panel lines on four FODP rows using the
quoted set quantities. The LAN cabinet links remain traceable through
Appendix 1.3. The interactive view shows site subtotals. The Appendix
footer carries the priced subtotal on screen and in draft exports.
A2 and D/E/F link to the existing installation, inspection, import
and cargo-insurance Working rows. C2–C8 display existing TEL-FO
allocations or an OPEN status.

ADR-0550-001 principles 2–6 and 8–13 govern source identity, cost
ownership, draft allocations and preserved issued history. The
PDF-derived fixture checked both currencies, site rollups, Appendix
and Working price parity, Vendor/Volume I trace and duplicate-owner
protection. Working Schedules, C1 Appendix, Vendor Register and
Native Exhibit validators passed. Chromium was blocked at process
startup by the execution environment. The user's Windows workspace
and its saved Vendor register were unavailable for inspection.


## 13 November · Appendix 1.4 supplier cost detail

The Working Preview in 11.C1 displays a supplier-cost disclosure directly below
the PAGA package. It reads the original Offer items, quantity, unit rate, line
amount, discount treatment, source page and printed package totals from 07.2.
Original costs are shown in EUR alongside the USD/THB selling-price view.
When Working still uses an older revision, the disclosure identifies its selling
basis and shows the latest registered revision separately. It links to the
existing A1-05 Working line for changing the selected Offer. When the latest
revision is already selected, its details appear once. Expanded MR rows for -005
also show original quote-item costs and quantities where there is a candidate
match. The quantities retain their quotation basis.

ADR-0550-001 principles 2, 3, 5, 6 and 8–12 apply. All cost details are internal
screen projections. The selected package contributes a single selling amount.
The screen's document mode, printing and the native customer exports omit
supplier costs and source links. No private supplier prices were added to Git.

Verified with the original -002 and -005 Vendor registers and ALIE R2: the -005
disclosure renders all 43 original quote items, including the two unpriced
options. The -002 selection still displays the -005 quote alongside the
selected basis, and customer HTML, Word and XLSX exclude the internal figures
and links. C1 Appendix, supplier revision, Working Schedules, continuity
checks and the production portal build passed. The owner's Windows view has
yet to be verified after applying this change.
