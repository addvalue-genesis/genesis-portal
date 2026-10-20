# PJ2608-0553 — GA / ZWP8 BOD Integration into Latest CFO Release
Date: 2026-10-20
Status: Draft integration only. No technical approval or customer-price release.

## Scope of change
Integration contains only:
- Source authority `zwp8BodNewLinkAuthority0553.js`: BOD C2 §7.2 requires NEW ADDITIONAL ZPQ↔ZWP8 PTP in addition to EXISTING retained link. PTMP base to ZWP20/22 is distinct.
- `mr0001Zwp8RadioOwnerEvidence0553.js` and `ZWP8CostOwnershipAudit0553.jsx`: correct audit wording. Keep two ODU owner prices (USD13,002.00 and USD7,288.65), 2 IDU, 2 surge, 2 antenna and ONE Ex enclosure; no cost mutation.
- New static BOD validation `validate:0553-zwp8-bod-mandatory-link`.
- New React server-render smoke validator `validate:0553-release-ui-render-acceptance`. Requires actual React markup of 10.1 four chosen engineering stages and 10.3 CFO Release. It is not browser E2E.
- `frontend/package.json`: append both tests to existing production build; do not replace the CFO build.
The previous ZWP20 GA 10/16/18 M20 comparison and physical bulk gap evidence is **already present** on Release branch; it is not posted as new cost by this integration.

## Expected Source-Based Values
| Module | Expected and requirement |
|---|---|
| `bid.budget.bom.zwp20.tcab-500-001.9.required-bom` | THB39,200 protected historical cost, Z1F Sheet13 10 bottom M20, 2022 BARTEC 16 holes, Prosper 2024 top10, DTS18; customer-free-issue Cisco/PoE/Surge/Patch not in cabinet price |
| `bid.budget.bom.zwp20.bulk-material.11.required-bom` / `.derivation` | THB37,176 = CAT6A 69m × THB524 + 1 provisional M20 gland THB1,020. Active gland requiredQty NULL; ODU NPT/MCT/earth/RF unresolved |
| `bid.budget.bom.zwp8.mr-502-003.43.required-bom` | PTMP ODU USD13,002.00, separate owner and A-4 MaxPMP licence USD6,634.61 (verify need) |
| `bid.budget.bom.zwp8.mr-502-004.43.required-bom` | NEW additional PTP ODU USD7,288.65 required by BOD; not a replacement of existing PTP |
| `bid.budget.bom.zwp8.cost-ownership-audit` | ZWP8 THB1,335,438.58 @ internal FX31.5; two priced radio owners, one TCAB and 11/11 TAGs |
| `bid.budget.pricing.cfo` | 10.3 CFO uses same MR0001 A1 source cost THB5,840,703.15; price factor1.30 applies once to A, B Working Sell unchanged, C optional pending verified cost |
| `bid.budget.pricing.release.preview` | Latest CFO native-sheet preview uses 4 aggregated MR rows on Part A (not the previous 15-row individual TAG layout), 6-sheet original structure preserved, export HOLD |

## Release gates
- Rev02 protected cost SHAs, Rev03 manifest/overlay unchanged. No source quoted price or Working Sell edited.
- Production build and ALL tests must run **after** integration branch checkout. Earlier PASS log from older release commit does not certify the new SSR test.
- Human browser acceptance required: expand ZWP20 TCAB Row9, Bulk Row11, ZWP8 Radio MR-502-003/MR-502-004 Row43, open Cost Ownership Audit and CFO/Customer Preview. Confirm labels, numeric prices, independent owners and conditional items. Confirm navigation and copy IDs.
- React SSR only confirms actual initial HTML output; does not simulate clicking and does not verify native Excel pixel/cell geometry.
- Until user verifies screenshots and buyer grouping approval, PR must remain DRAFT and native customer file export DISABLED.

## Local commands (current folder: ...\genesis-portal-0553-release\frontend)
```powershell
git -C .. status --short
git -C .. fetch origin
git -C .. switch --track origin/integrate/pj2608-0553-release-cfo-zwp8-bod-qa-r2-20261020
npm run validate:0553-release-ui-render-acceptance
npm run validate:0553-zwp8-bod-mandatory-link
npm run validate:0553-scada-ga-zwp8-radio-evidence
npm run validate:0553-release-cfo
npm run build
npm start
```
If a local integration branch already exists, `git -C .. switch integrate/pj2608-0553-release-cfo-zwp8-bod-qa-r2-20261020` then `git -C .. pull --ff-only`. If detached or worktree is dirty, do not force/reset. For a release worktree reserved for a separate branch, test the integration in another worktree instead.
