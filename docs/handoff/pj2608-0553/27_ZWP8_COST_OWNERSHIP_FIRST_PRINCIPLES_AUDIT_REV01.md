# PJ2608-0553 — ZWP8 Cost Ownership & First-Principles Audit Rev01

Date: 2026-10-13
Status: SOURCE-RECONCILED DEFECT FOUND / ENGINEERING NEW–REUSE AND OEM GATES OPEN
Module: `PJ2608-0553 / bid.budget.bom.zwp8`
New read-only diagnostic: `PJ2608-0553 / bid.budget.bom.zwp8.cost-ownership-audit`
**Important:** This document records a verified double-charge in the CURRENT internal working ledger, but DOES NOT authorize changing the frozen ledger, vendor quote, pricing basis, approved scope or customer release.

## Executive finding / ทำไม ZWP8 สูงกว่า Location อื่นมาก?
- Current ZWP8 MR0001 Working Allocated Cost at INTERNAL PLANNING FX 31.5 THB/USD: **THB 1,375,485.67**, compared with ZWP20 THB 921,425.22 (difference THB 454,060.45).
- Main structural driver: original MTO Rev04 row 43 is a GROUPED row with **2 Radio ODU, 2 IDU, 2 Antenna** source TAGs, unlike ZWP20's one-set radio/antenna chain. ZWP8 is a Brownfield network hub with three RPT links (two PTMP to ZWP20/ZWP22 and one PTP from ZPQ). Double radio/antenna budgets are a MANAGEMENT REPLACEMENT scenario, not yet verified new procurement or installed physical quantities.
- Verified financial defect: each ODU source unit rate **USD 8,574.12** includes **B-8 Ethernet Surge USD 614.20**; separate SA-502-002 and SA-502-003 both also post **B-8 USD 614.20**. Thus **B-8 duplicate = 2 × USD 614.20 = USD 1,228.40 = THB 38,694.60** at planning FX.
- Classification/ownership defect (NOT another add-on cost): ODU unit price also includes B-6/B-7 indoor PoE power + cord USD 671.27 each, **USD 1,342.54 / THB 42,290.01** under the wrong physical owner. Both IDU source TAGs MR-502-003A and MR-502-004A remain unpriced in the current ledger (9/11 posted). The original MTO IDU functionality is not proven by including just an industrial PoE/cord price.

## Current ZWP8 working cost bridge (this reproduces the locked ledger, not a new estimate)
| Source / physical owner as CURRENTLY posted | Original amount | THB @31.5 |
|---|---:|---:|
| Radio ODU MR-502-003 + MR-502-004 = 2 × (B-1/B-2/B-3/B-5/B-6/B-7/B-8) | USD 17,148.24 | 540,169.56 |
| Antenna ANT-502-002 + ANT-502-003 = 2 × 4ft B-12 | USD 9,419.54 | 296,715.51 |
| Surge SA-502-002 + SA-502-003 = 2 × B-8 | USD 1,228.40 | 38,694.60 |
| Cisco LAN-502-002 working bundle | THB 423,530 | 423,530.00 |
| TCAB-500-003 historical Ex enclosure analogue | THB 39,200 | 39,200.00 |
| Brownfield 69m CAT6A + M20 gland management allowance | THB 37,176 | 37,176.00 |
| **CURRENT ZWP8 LEDGER** | **USD 27,796.18 + THB 499,906** | **THB 1,375,485.67** |

Unpriced physical owner/source TAGs: MR-502-003A and MR-502-004A (separately required IDU).

### Illustrative correct **unique Cost Owner** bridge — NOT POSTED
- Radio ODU 2 × B1+B2+B3+B5 = 2 × USD 7,288.65 = USD 14,577.30.
- IDU PoE Interface 2 × B6+B7 = 2 × USD 671.27 = USD 1,342.54 (re-assign from ODU; not additional cost or proof of complete IDU).
- Surge 2 × B8 = 2 × USD 614.20 = USD 1,228.40 (existing separate SA source cost).
- Antenna 2 × B12 = 2 × USD 4,709.77 = USD 9,419.54 (still a provisional 4ft assumption).
- Non-USD Cisco + TCAB + Bulk unchanged at THB 499,906.
- Thus unique-price-owner **USD 26,567.78 + THB 499,906 = THB 1,336,791.07 at FX31.5**, lower by THB 38,694.60. This is solely the reconciled, no-double-B8 scenario and still not compliant/complete cost.

## Mandatory First Principles + Telecom Constraint-Based Engineering checkpoints
1. **RFQ and contract scope ownership:** ZWP8 Brownfield NEW / REUSE / BY OTHERS decision per equipment and cable interface; management all-new budgetary assumption is not a signed procurement order.
2. **MTO source:** Rev04 grouped row43 has six individual TAGs and six `1 Set` lines; row44 LAN; row45 two SA; row46 TCAB; row47 bulk. Confirm native workbook row/cell mapping before claiming physical installed SKU.
3. **RPT/BLD topology:** ZWP8→ZWP20 PTMP; ZWP8→ZWP22 PTMP; ZPQ→ZWP8 PTP. BLD-0001 C1 notes reuse of ZWP8–ZPQ path. Verify whether two dedicated NEW ODU are needed or existing/PTMP sector can be reused/shared.
4. **RF CAL / antenna:** RPT shows sector (60°) at ZWP8 on two PTMP links and 4ft parabolic on ZPQ–ZWP8 PTP; MTO row43 TC says 6ft/6ft but CAL-0001 A1 says 4ft/4ft. Two 4ft B-12 purchased antennas are NOT an accepted antenna system before coverage, reflection/tide and OEM gain study. B-12 Next G originally quotes Qty 1 globally while ZWP8 scenario allocates 2 at the same reference unit rate. Quantity/availability and other-site allocations need quotation review.
5. **IDU/PoE/power/Ex boundary:** Verify the two standalone IDU functions and their proper 24V/DC PoE, cabinet Ex certificate, cabling/terminations; moving B6/B7 source price is an OWNER FIX not technical IDU compliance.
6. **Vendor source/group options:** Group B/C are alternative global quotation group quantities; never multiply supplier global Qty across all sites, count B8 twice, use unconfirmed region 04 Myanmar licence, or duplicate supplier-included mounting/filter/accessories.
7. **Bulk and WBS:** Determine actual Brownfield RF feeder/CAT6/coax, new tie-ins, cable glands, route, grounding and termination from BLD/LAY/WIR and precise package inclusion; do not re-book ZWP8 bulk projection on top of TAG row47. Part B/C services/spares remain separate.
8. **Change & risk / management control:** Write `Cost Owner Correction` decision (B8 only under SA, B6/7 under IDU, ODU B1–B5) and verify owner-by-owner totals. Confirm NEW/reuse and antenna selection using actual OEM evidence before changing Source Ledger. Preserve the original value and record revision/difference. Add regression that detects any future B8 duplication.

## Verified code issue
- `data/zwp8Row43CostTrace.js`: `radioCodes = ["B-1","B-2","B-3","B-5","B-6","B-7","B-8"]` and scenario `2×radioEach+2×B12`. Original grouped 2 IDU entries have `selectedRate:null`.
- `data/mr0001TagCostLedger0553.js`: grouped row43 returns `selected` first **even for unpriced IDU**; therefore later `deriveMR0001MissingBudget0553(item)` B6/B7 allowance cannot make them booked. Separately, row45 two SA entries book B8 from `mr0001BudgetFill0553.js`. This is a proven source-of-cost-owner mismatch and false 9/11 completeness representation.
- `data/mr0001SiteClassification.js`: source site class BROWNFIELD is not a physical NEW/replacement owner.
- `data/scadaLinkEvidence.js`: topology as reported, not accepted OEM/site package.
- `data/scadaBudgetEnvelope0553.js`: management replacement envelope separate from source ledger, no proof of NEW/REUSE.
- `frontend/src/project0553/ZWP8CostOwnershipAudit0553.jsx` and `data/zwp8CostOwnershipAudit0553.js`: independent read-only diagnostic with visible module ID and two subordinate issue/RPT modules.
- `scripts/validate-0553-zwp8-cost-ownership.cjs`: checks 1,375,485.67 existing, duplicate B8 38,694.60, shifted B6/B7 42,290.01, de-duplicated comparison 1,336,791.07, nine of eleven booked, three links, source currency/ledger immutable.

**Status**: GitHub source inspection and arithmetic checks complete. JS/webpack/browser test on user checkout pending. NO source/ledger prices or quantity altered. NO technical acceptance or customer release.

## Correction 2026-10-13 — ZPQ–ZWP8 PTP is EXISTING baseline

**User-confirmed and source-checked:** The ZPQ↔ZWP8 PTP communication link is EXISTING. BLD-0001 Rev.C1 Sheet 7/7 graphically distinguishes existing (dash-line) infrastructure and BLD notes on ZWP20/22 explicitly call for the existing communication link between ZWP8 and ZPQ to be used. Do not label the pre-existing link "NEW PTP" or assume its existing radio and parabolic antenna must be purchased a second time.

**Separate contractual scope requiring engineering resolution:** BOD-0001 Rev.C2 §7.2 records insufficient surveyed capacity on that existing link and states an **additional new link** shall be provided; SPE-0001 Rev.C2 §6.1.3 also uses language for new PTP base radios at both endpoints. This is a possible expansion/parallel link (or another approved engineering arrangement), **not proof that the original installed link ceased being existing**. Drawing/source discrepancy is a controlled interface/quantity gate: exact new hardware, physical endpoints, installed cable/enclosure reuse, frequency entitlement and OEM CAL must be reconciled before any additional procurement cost.

**Cost-model action:** Existing PTP baseline is NEVER automatically priced as new. The current two-ODU/two-antenna working scenario stays a management scenario only until line/function ownership is verified (PTMP base sector vs PTP endpoint/augmentation); the duplicate B-8, B-6/7 ownership defects are independent and remain open. No source Cost Ledger or vendor quote has been changed in this correction. Link status is carried in `data/scadaLinkEvidence.js` and the ZWP8 audit/UI, and checked by `validate-0553-zwp8-cost-ownership.cjs`.
