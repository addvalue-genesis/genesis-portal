# Existing vendor prices for provisional proposal preparation

Version: 2026-10-28.5-preview. Project: PJ2608-0550 only.

The user authorized using existing vendor prices while updated quotations are pending. Opening this version imports preserved quote evidence into the local Working workspace once, with an audit revision. It adds records; it does not overwrite saved prices, FX, calculations or reviews. Existing selected Part A systems are retained and reported as skipped; their recovered offers remain available in Vendors. A matching existing offer is reused with its saved values. A version marker prevents repeat imports, including after backup/restore.

## Imported basis

| Vendor / scope | Native cost | Treatment |
| --- | ---: | --- |
| INDUSTRONIC PAGA net package | EUR 226,454.05 | Selected |
| INDUSTRONIC AP 712 addition | EUR 3,210.00 | Selected |
| INDUSTRONIC XBC addition | EUR 2,014.00 | Selected |
| Jason Marine | THB 98,150.00 | Selected |
| Jason Aero | THB 212,500.00 | Selected |
| Jason SSB | THB 447,000.00 | Selected |
| Master Tower 30 m + 60 m | THB 3,942,500.00 | Selected |
| Jason MET comparator | THB 120,000.00 | Unselected alternative |
| Jason NDB comparator | THB 2,450,000.00 | Unselected alternative |

Selected source cost is THB 4,700,150 plus EUR 231,678.05, before selling treatment and currency conversion. These are partial vendor scopes, not the complete project total. The migration reads only `EVIDENCE_ANCHOR_NON_ADDITIVE` records from the preserved project snapshot; internal allowances, reference subtotals and gross package details are not added. The PAGA package already includes OEM engineering/FAT/packing; additional B work needs a distinct scope. Other systems without quote evidence remain OPEN.

Goods selling treatment comes from the existing commercial policy: 5% ADDVALUE gross margin and 20% prime markup. Known PAGA quotation/validity dates are retained. Missing dates remain blank. Current workspace FX is reused; no exchange rate is fabricated or substituted from historical assumptions. Native-currency cost and sell are available even when conversion is OPEN.

## Proposal workflow

The default `Working · ราคาเดิมรออัปเดต` view uses provisional calculations for Working, Budget THB and the existing 8-column REL-04 USD customer form. The screen and exported XLSX identify provisional pricing and pending scope/quotation updates. Quote date/expiry warnings do not suppress this authorized draft basis. Structural errors, duplicate scope owners, future quotation dates, invalid quantities and missing prices still block affected amounts. Missing USD/EUR FX leaves conversions OPEN. Missing customer rows keep the full A+B total OPEN; a separately labelled known-items subtotal is incomplete scope.

`Official · ตรวจทบทวนแล้ว` retains the prior evidence and completeness gates. Importing a vendor basis does not stamp reviews or issue a quotation. MR Rev.B1 work order, the 24 customer codes, customer Release ordering, Source/Release navigation, 15 module IDs and frozen historical outputs remain intact.

## Validation

Data, references and bidding-model checks passed. Production build passed with the existing asset-size warning. Chromium integration passed 18 checks with no page/console errors, including initial import, native EUR display, provisional XLSX, idempotent reload, previous review/staleness checks, concurrency and backup/import. Tests use isolated browser storage and synthetic FX. The customer's private localhost database was not accessed.

Frozen SAMTEL XLSX SHA-256 remains `2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`.

## Update the existing Windows review worktree

Stop the development server, then use the existing worktree. Check for local changes before switching; do not discard them.

```powershell
cd "$env:USERPROFILE\DEV\genesis-hub-0550-official-review"
git status --short
git fetch origin feat/pj2608-0550-official-working-20261028
git switch --detach FETCH_HEAD
cd frontend
npm start -- --port 3001
```

Open `/projects/pj2608-0550` on the same localhost origin/browser previously used. Confirm version `2026-10-28.5-preview`; the one-time vendor import runs on load. No dependency change requires reinstalling packages.
