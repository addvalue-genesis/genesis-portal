# PJ2608-0553 — B10 Itemized Purchasable Evidence Audit / 25 Oct 2026

## Status and price authority
- Before edits, remote branch `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024` was identical to `752de1806882248e714148af2a6f79b1081d34b3`. All edits below were committed onto this remote branch.
- This change is a **safe, source-linked internal physical purchase audit**, NOT a fully approved spare-parts procurement BOM, not a new supplier quote and not customer-ready issuance.
- `B10-PTTEP-01..04` continue to represent **4/3/4/3 = 14 sets**, controlled `Working SELL = THB 509,827.50`. Derived older budget **cost envelope = THB 392,175** at factor 1.30. Values unchanged; no duplicated B10/A1/C1/C2 posting.
- `10.3.4` keeps B10 summary **USD 16,200** by existing FX/rounding policy. It still has **four priced system/kit envelope lines** and is NOT itemized at confirmed physical spare SKU level. No historical or expired vendor quote rates are silently promoted to the official annex.
- No MGW request; no invented engineering requirements 1–8; no DB/global Manual Input modifications.

## Customer minimum document requirements
MR0001–0004 Rev.C1 §5 and Attachment 5: supply commissioning/start-up spares (one set per applicable platform) **and itemized part names/part numbers, qty, prices, availability/lead time, installed equipment references and applicable OEM compatibility**. A set is **not** a specific SKU. MR Attachment 7 instruction 6 requires excluding actual B10 startup spares from optional C2 two-year stock.

Original sources:
- https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view (MR0001)
- https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view (MR0002)
- https://drive.google.com/file/d/1RYFm75mMuLr5brbXjLNu8UWIDUptRP-Q/view (MR0003)
- https://drive.google.com/file/d/17oOEMjDVQy3PgOQYbPYyXyaxk3P_rrNC/view (MR0004)

## Original NextG supplier quote — full D/E stock evidence

`NG/260916-ADV-DAP1`, 16 Sep 2026, valid until **1 Oct 2026** (expired). Original PDF: https://drive.google.com/file/d/1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd/view . Source-transcribed 53-row BOQ is `data/quotes/NG-260916-ADV-DAP1.full.json`.

D Base Station Spares + E Subscriber Spares contain **16 original source rows, 14 priced and 2 region licence entries with dash (NULL, NOT ZERO)**, D total USD15,566.53, E total USD13,253.18, gross priced USD28,819.71 (~THB907,820.87 at fixed internal FX31.5). The *entire optional offer* exceeds the existing B10 cost envelope THB392,175. D/E are **separate stock proposals** from A/B/C installed-system quotation lines. Quote-offered Qty1/line is NOT the approved B10 purchase quantity; don't multiply by four B10 platforms or copy into B10 purchased stock.

Classification:
- **6 candidate spare accessories**: D/E-2 `FLK-MAR-4958-EXT-D1` RF **filter** (not necessarily RF surge protector) USD2348.19 each; D/E-5 `PS-DCDC-HAZ-POE-IND-01` PoE power supply USD667.67 each; D/E-6 `PPT-B` US/North-American power cord USD3.60 each. Combined USD6038.92 (~THB190,225.98). All original offered quantities 1 per D and E line, B10 selected purchasing quantity still **NULL**; North-American cable suitability unverified.
- **2 whole major radio candidate assemblies**: D-1 `3K-SC-HAZ-RF4958-GPS-01` USD3712.46; E-1 `CONN-OW-HAZ-4958ER-01` USD3456.50; combined USD7168.96. C1/bulk replacement ownership needs decision, not mandatory B10.
- **4 software/region entitlement rows** D/E-3/4: two priced USD7811.83, two dashes; not physical startup spare stock.
- **4 warranty rows** D/E-7/8: summed quoted USD7800, may be alternate/overlapping warranty durations and cannot be blindly purchased together.
- Hardware gross USD13207.88 includes the two whole radio assemblies; remaining software/warranty gross USD15611.83. Combined USD28819.71. Software and warranty not automatically B10 spares.
- Some identical SKU appear in both D and E: separate quote lines do not establish whether two separate physical items are needed or if one project stock pool is shared.

## Four MR functional item decompositions
`b10ItemizedPurchaseEvidence0553.js` now decomposes B10's 4 envelope specifications into **14 requirement-driven physical article family records**; they are *NOT* the 14 contractual kits or committed purchase quantities. Each has a stable `B10-PTTEP-XX-FXX` identity, source MR/parent envelope, site/TAG candidates from actual coverage inventory, SKU quote candidate where related (PoE), explicit `approvedPurchaseQty:null`, `exactSpareSku:null`, `approvedSupplierUnitCostTHB:null`, `postingAllowed:false`. All 14 requirements remain unpriced and not purchasable as exact OEM SKU without the missing evidence.
- MR1: protective fuses, DC PoE injector, Ethernet protection, RF protection.
- MR2: BDA surge/coupler, feeder connectors, Ex seals.
- MR3: IP phone service parts, sounder service parts, glands/seals, CAT6A retermination.
- MR4: RACON fuses, control-box gasket, Ex glands/seals.
- The `source` existing historical Rev08 B10 9 generic lines remain separate comparison candidates. Their prices and quantities are not current vendor quotes.
- MGW UHF-2 PolyPhaser IS-B50LN-C2 is included in the installed RF package but has no separate B10 rate, and a filter is not automatically the same part as a surge protector.
- MR3 EXION THB145k quoted Auteldac `-510` and THB62k sounder are installed-item comparables not verified B10 service parts; `-410` MGW variant does not prove equivalence.
- MR4 MDS installed RACON USD75k FCA full-package rate is not a B10 fuse/gasket/gland part price.

## Code route and financial invariants
New:
- `frontend/src/project0553/data/b10ItemizedPurchaseEvidence0553.js`
- `frontend/src/project0553/B10ItemizedPurchasingEvidence0553.jsx`
- `frontend/scripts/validate-0553-b10-itemized-purchase-evidence.cjs`

Modified:
- `data/bcTurnkeyWorkingCost0553.js` -> B10 `b10ItemizedPurchaseEvidence` source selection.
- `data/scopePartBcReadModel0553.js` -> same B10 value into 10.5 scope.
- `data/releaseCommercialModel0553.js` -> same B10 value into internal 10.3.3 release and explicit `sourceCoverage.b10PurchasableSpirComplete=false`.
- `ScopeBcAnnexDetail0553.jsx` -> 14 requirement families + full 16 supplier source lines, without truncation, via shared UI in Working/Scope.
- `ReleaseCustomerWorkbook0553.jsx` -> same full 14+16 internal source evidence, never customer output.
- `frontend/package.json` -> new `npm run validate:0553-b10-itemized-purchase-evidence` and adds to `npm run build`.
- `data/budgetChangeLog0553.js` -> classified 25-Oct nonposting engineering change.

Important native XLSX boundary: The original customer template has 13 physical annex rows. **14 requirement family rows and 16 separate quote evidence rows are visible in internal JSX** (neither is truncated). They are NOT copied as a false priced procurement offer into the original customer 6-sheet XLSX. The official/native sheet still has four financially priced MR-level kits, not sufficient as a verified itemized purchasing offer. Once actual SKU and supplier item-rate/quantity are established, build source-owned item-level price posting, B10/C2 no-duplicate SKU register and native continuation sheets/pages; never silently truncate >13.

## Validation state

Created targeted validator of all 16 original NextG D/E part-number identities, quoted rates and two nulls; checks quote/physical/license/warranty category math, source-to-Working-to-Scope-to-Release references, 14 MR-driven physical requirement rows and all 16 UI rows, unchanged 509827.50 THB, original 16 canonical annex financial IDs and no official supplier-evidence exposure. It is also registered as first `npm run build` check.

**Not executed here**: GitHub connector can read/write source but does not run Node build; no local checkout or GitHub CI run was available in this session. Validate on workstation before using release:
```powershell
& {
  Set-Location "$env:USERPROFILE\DEV\genesis-0553\frontend" -ErrorAction Stop
  git pull --ff-only
  npm run validate:0553-b10-itemized-purchase-evidence
  npm run validate:0553-existing-spare-owners-2026
  npm run validate:0553-official-usd-release
  npm run build
}
```
Do not claim tests passed unless executed and read back.

## Engineering exit criterion
B10 cannot be advertised as **Itemized Purchasable SKU + approved TAG/Qty/Unit Price** until each physical article has installed equipment model/rating and exact OEM replacement SKU, compatibility and Ex certificate, a physical purchase quantity driven by project one-kit/platform + actual commissioning SPIR, a genuinely applicable supplier quote or transparently approved parametric unit-cost estimate with basis, and explicit Part A/B11/C1/C2 unique-cost stock ownership. Only then replace the four financial price envelopes with properly reconciled item sums and implement native annex continuation/export.

