# PJ2608-0553 — B10 Price-to-Win Review / 25 Oct 2026

## Executive finding
This is **a MANAGEMENT WHAT-IF**, not a new current OEM offer, customer issuance, or confirmed itemized SPIR. The current B10 Working SELL is THB 509,827.50 and the official English/USD B10 summary is USD 16,200. Neither is changed.

### 1. Sources and classification

- Customer MR0001–MR0004 Rev.C1 §5 + Att.5: B10 startup/commissioning physical spare one **kit per new platform**, 4/3/4/3 = 14 kit envelopes. Each ultimately needs exact replaceable OEM SKU, installed site/TAG, required spare quantity, rating, unit price, availability and net stock ownership. MR Att.7 instruction 6 excludes the matching B10 physical stock from C2.
- NextG offer `NG/260916-ADV-DAP1`, 16 Sep 2026, **expired on 1 Oct 2026**, D/E groups: 16 separate optional spare source lines. 14 with price, two region entitlement rows with dashes/unknown. Full gross quoted USD 28,819.71 ≠ B10 cost, because it mixes physical radio assemblies, accessories, software licences and warranty.
- D/E RF filter quoted SKU `FLK-MAR-4958-EXT-D1`, D-2 and E-2: 1 offer each × USD 2,348.19; PoE `PS-DCDC-HAZ-POE-IND-01`, D-5 and E-5: 1 offer each × USD 667.67. These **4 accessory quote rows = USD 6,031.72**. These are **vendor-offered quantities** used for simulation, not physical purchase quantities approved by PTTEP/ADDVALUE. D/E US-only cord `PPT-B` USD 3.60 each excluded by default as applicability unconfirmed. Optional inclusion adds USD 7.20.
- D-1 and E-1 are **complete radio assemblies** totaling USD 7,168.96; considered capital-spare scope candidates, excluded from B10 base simulation. Scenario checkbox can show their cost impact but does not authorize posting.
- D/E software + warranty rows are not physical spare inventory; quote total USD 15,611.83 with two unpriced region rows, no double-counted B10 hardware.
- Same NextG quote line part numbers occur in original A/B/C equipment offer; separate D/E quoted source rows are not an accepted installed-equipment allocation (see `mr0001OfferAllocationAudit.js`). No automatic repeat of source hardware or license entitlements.
- Public source references are **independent nonposting market observations**:
  - PolyPhaser `IS-B50LN-C2`, USD 118.17 displayed at Richardson RFPD, stock 0 at displayed search; same Part No as MGW UHF-2 included installed RF-surge element. This *does not* prove separately certified Ex assembly or required B10 stock quantity: https://shop.richardsonrfpd.com/Products/Product/IS-B50LN-C2
  - Hawke `501/453/UNIV/A/M20/NP/KIT`, RS Thailand THB 2,002.09 ex VAT. An M20 Ex cable-gland **comparable**, not selected OEM-matching replacement: https://th.rs-online.com/web/p/cable-glands/0716022
  - Eaton `DB3BDGD048N2BPNR` sounder THB 56,108.77 ex VAT on RS Thailand. Different suffix from EXION `DB3BDG048N2BNR`, so never treated as identical spare/quote: https://th.rs-online.com/web/p/electronic-sounders/2299717

### 2. Cost authority and scenario logic

The current **internal parametric** B10 cost envelopes are USD: MR1 4 kits × 1,400 = 5,600; MR2 3 kits × 700 = 2,100; MR3 4 kits × 550 = 2,200; MR4 3 kits × 850 = 2,550, for USD 12,450 (THB 392,175 at FX 31.5); selected Working SELL = ×1.30 = THB 509,827.50.

We **credit USD 5,600 of MR1 historical source estimate** and replace it with USD 6,031.72 of NextG D/E RF filter+PoE accessory offer. Keep MR2+MR3+MR4 at **USD 6,850 of unitemized planning cost reserves** (not verified supplier cost/Part Nos). This produces **USD 12,881.72** scenario cost, or **THB 405,774.18**. This is **NOT full B10 cost completeness**: B10 MR1 remaining requirement families, Ex/connector spare stock and brownfield applicability are still open.

Profit policy **internal planning proposal**:
```
Cost C = quoted-selected-candidate D/E lines + prior MR2/3/4 unitemized cost envelope
selling factor = (1 + risk_cost_pct) / (1 - SAMTEL_pct_of_sell - target_ADDVALUE_profit_pct_of_sell)
base: risk=5% of C, SAMTEL=5% of customer sell, ADDVALUE profit target=20% of customer sell
factor = (1.05)/(1 - .05 - .20) = 1.40
Proposed Working-equivalent SELL THB = C_USD × FX31.5 ×1.40
Proposed 10.3.4 Summary USD = round UP to next USD100, only once at parent
```
The risk allowance is accounted for INSIDE the 1.40 multiplier, not added to B10 or B5/B6 again. The scenario **does not** separately add currently B5 packing, B6 CIF freight/insurance, B11 equipment/tools or Part A equipment costs.

### 3. Side-by-side pricing

| Case | Source cost USD | Sell policy | Indicative SELL THB | 10.3.4-equivalent summary USD |
|---|---:|---|---:|---:|
| Existing canonical B10 | 12,450.00 old parametric, not verified direct cost | existing factor1.30 | 509,827.50 | 16,200 |
| Default scope: D/E RF filters + PoE only; MR2–4 parametric | 12,881.72 | 1.40 (5% risk/5% SAMTEL/20% profit) | **568,083.85** | **18,100** |
| Add North-American D/E power cords (fit TBD) | 12,888.92 | 1.40 | 568,401.37 | 18,100 |
| Add complete radio assemblies to default (possible C1 duplication) | 20,050.68 | 1.40 | 884,234.99 | 28,100 |

Quoted filter + PoE what-if unit sell (USD, factor 1.40): RF filter USD 3,287.4660 per piece; PoE USD 934.7380 per piece. Exact OEM SKU/quote price, but 1-per-D and 1-per-E quantity is only source OFFER; **not approved physical purchase quantity**. No price for other 14 article families was fabricated.

Proposed default vs existing canonical Working B10 THB +58,256.35. Indicative summary USD +1,900 (USD 16,200→18,100). The rest of actual official A+B, currently USD 863,900 across partial priced owners, would hypothetically total USD 865,800 **if only this summary line changed**. This is a what-if arithmetic comparison only, not a new Official quotation/export.

### 4. Integration and no-double-count controls
- Source / review: `frontend/src/project0553/data/b10ItemizedPurchaseEvidence0553.js`, new `data/b10PriceToWinReview0553.js`.
- 10.2 canonical B10 owner carries **read-only `b10PriceToWinReview`**. `b10WorkingSellTHB`, financial-owner costs, `directCostTHB` and source 4 parent B10 kits **unchanged**.
- 10.5 Scope B10 propagates the same source-derived review object, no new financial posting.
- 10.3.3 Internal Release B10 propagates the same read model and allows interactive 15/20/25% after-risk target profit, 0/5/10% risk reserve and US cord / whole-radio stress tests. Customer preview mode **does not display any internal what-if amount**.
- 10.3.4 equivalent proposed rounded summary is shown solely as an INTERNAL scenario, not written to customer Official DTO or original Excel. Official 10.3.4 and all six embedded native sheets remain unmodified; none is silently truncated or repriced.
- Public nonposting comparables never increase cash ledger or become a false OEM quote.
- Project-change registry annotated `ENGINEERING / NO_PRICE_CHANGE`.
- New `frontend/scripts/validate-0553-b10-price-to-win-review.cjs` is in `npm run build`: asserts source-credit netting, cost/sell/rounding, each scenario, A1 D/E separation, unchanged official price/annex, no customer leakage.

### 5. Open questions affecting an issuable B10 price
1. Current source D/E offered 1+1 RF filters and PoE do NOT establish what goes in **four MR1 1-kit/platform** commissioning spare sets. Confirm via Part A selected installation and MR Attachment 5 applicability; do not assume one spare per equipment tag.
2. Remaining 3 MRs need actual OEM-matched physical items, quantities, compatible TAGs and cost. MR0002 surges/RF feedthrough and specific Ex certified enclosure; MR0003 model suffix differences and serviceable sounder parts; MR0004 RACON fuse/control gasket/Ex glands. Public comparables are risk bounds only.
3. Check duplicate stock against A1–A4 (equipment/OEM-included parts), B11 (handed-over tools), B5 (packing), B6 (freight), C1 (whole units) and C2 (two-year stock under Attachment 7 instruction6); isolate Brownfield as-required.
4. Reconfirm expired NextG quote, actual import/FX settlement, warranty, Ex certificates, selected country radio region/frequency, delivery scope to CIF Zhuhai and buyer-specific insurance; without these, no claim of final O&G tender price.
5. **Only after physical SKU itemization**, modify source financial B10 Working SELL, downstream Scope, 10.3.3, 10.3.4, Official Excel continuation sheets for >13 rows and run full reconciliation. User asked to see first; approval/posting not implied.

### 6. Code/test status
GitHub branch `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024` updated. Changes are committed and have been read back. **No Node/webpack/browser/Excel tests were executed** in this current tools environment; no GitHub Actions run or commit status was available. Run:

```powershell
& {
 Set-Location "$env:USERPROFILE\DEV\genesis-0553\frontend" -ErrorAction Stop
 git pull --ff-only
 npm run validate:0553-b10-price-to-win-review
 npm run validate:0553-b10-itemized-purchase-evidence
 npm run validate:0553-existing-spare-owners-2026
 npm run validate:0553-official-usd-release
 npm run build
 npm start
}
```
Then open http://localhost:3000/projects/pj2608-0553 → Working B10 Detail, 10.5 Scope B10, or 10.3.3 Internal Release B10 to inspect the new interactive panel.
