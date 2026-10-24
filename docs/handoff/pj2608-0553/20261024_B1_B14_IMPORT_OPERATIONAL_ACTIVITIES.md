# PJ2608-0553 — B1–B14 activities and three-stage operational budget

## Owner scope and baseline

Owner approved implementing the activity distribution and planning operating costs: supplier→Thailand30,000; Thailand→CIF Zhuhai20,000; Myanmar import/operating approvals200,000 THB. These are internal planning assumptions, not vendor quotations, official fee schedules or a guarantee of government approval. Four MR systems do not imply four licences or shipments. The Thai import basis assumes up to3 import lots; EXION is domestic. Shipment consolidation, weights, import taxes and legal applicant remain to verify.

Checked PR39 remote head232589a3 before editing; local d8b5988f has matching baseline tree72a528ddf700f09f2eb2486865fe94604f0a1e17. Preserve the existing urgent pricing branch. No DB/global Manual Input work, MGW services/requotation, inferred requirements1–8, customer issue, deployment or merge.

## One source and no duplicate cost

`importOperationalBudget0553.js` is the new source for the approved operating assumptions. It feeds the existing B1 resource model and B6 logistics envelope; the canonical selector continues feeding Scope/Budget and Release/native Excel. No independent downstream amounts.

### B1

- Keep all242 office support MH, seven role rates, existing management travel, office and meetings. Admin/Accounting/Procurement/Coordinator are not charged again.
- Replace old filing translation/courier cost7,200 / SELL7,920 with the Myanmar partner package, which includes those tasks.
- Supersede old conditional legal35,000 and fee12,000 costs. They were excluded from Base, so no47,000 credit is deducted from Base.
- Myanmar package cost200,000: agency78,750 (user reference USD2500×planning31.5, NOT quote); unverified official fee allowance25,000; additional approval work/fee reserve75,000; rework contingency21,250.
- Official fee allowance uses SELL factor1.00, not1.10. Services and mixed reserves retain existing expense factor1.10. Mixed reserves are not labelled government fees. Package SELL217,500. This does not create a reimbursable-at-actual contract term or determine accounting revenue recognition. Existing SAMTEL5% deduction remains unchanged.
- New B1 cost =181,400−7,200+200,000 =374,200. New B1 SELL =211,600−7,920+217,500 =421,180.
- Purpose groups preserve all8 account/line IDs: PMO B1.1/.2/.3/.4/.8 cost169,700 /SELL198,055; Myanmar B1.5/.6/.7 cost204,500 /SELL223,125. B1.5 retains ADDVALUE12MH; private partner services are distinct.
- Historical27 engineering titles remain unpriced. Two test-content titles now correctly show B2 procedure/report +B3 execution ownership, not B3-only. Separate27-activity audit describes unresolved engineering; this change does not claim all technical engineering is funded.

### B6

- Incoming administration cost30,000→SELL33,000 replaces old import SELL12,000.
- Outgoing administration cost20,000→SELL22,000.
- Old mixed export SELL25,000 is explicitly **newly allocated for planning** into physical truck/loading/terminal10,000 and replaced service15,000. This is not a verified breakdown of an old invoice and not a supplier credit. Retained physical allowance adequacy is open; review before booking.
- Current outgoing physical10,000 +new services22,000 replace mixed25,000. Net B6 SELL change =33,000−12,000+22,000−15,000 =28,000.
- B6 SELL307,584→335,584. All other logistics lines unchanged. The50,000 operating cost is a partial B6 cost estimate, not the verified cost of the entire route. Never compare cost250,000 directly with an old SELL envelope.
- No China import duty/clearance/port-to-yard or JUTAL platform freight added; current COM-D02 allocation retained. No Thai duty/VAT estimate or exemption invented.

## A/B/C comparison

| Owner | Before SELL THB | After SELL THB | Change |
|---|---:|---:|---:|
| A known equipment |22,197,552.23|22,197,552.23|0|
| B1 |211,600.00|421,180.00|+209,580.00|
| B6 |307,584.00|335,584.00|+28,000.00|
| Other B owners |unchanged|unchanged|0|
| Known B |4,757,207.13|4,994,787.13|+237,580.00|
| Known A+B draft |26,954,759.36|27,192,339.36|+237,580.00|
| C1/C2 |unquoted|unquoted|no posting|

B4/B12/B14 still null, not zero. No final Base or customer release approval. Day/OT/standby proposals and B3/B9 days/rates unchanged.

## Activity ownership / presentation

`bcExecutionActivities0553.js` provides14 shared activity definitions, boundaries and short customer text. B1 Engineering/PMO/licensing; B2 VDRL; B3 local preparation/FAT2+1 and SAT/survey; B4 coating; B5 packing; B6 transport/border administration; B7 storage; B8 OEM-online Training1+1; B9 JUTAL onshore assistance7+2days/person; B10 start-up spares; B11 handed-over O&M tools; B12 first filling; B13 consumables; B14 bonds/insurance.

Working sections expose activities and cost→sell replacements. B1 uses two nested purpose groups with separate colours, existing account IDs and expand/collapse. Scope and Release read the same metadata. Native Excel appends compact activity notes to the existing14 description cells; original six sheets, column/page dimensions and formulas retained. Notes and style fitting remain idempotent on repeated export. Original title remains; B6 retains selected CIF wording.

## Regulatory completion and evidence

Scope includes preparation/translation, authorised filing, responses/corrections, follow-up, and delivery of applicable approvals. A register must tie each approval/reuse/exemption to model, quantity, site, holder and validity. ADDVALUE manages the telecom dossier/partner; authorised entities sign/apply. JUTAL supplies final shipment/platform details; PTTEPI FaFE/MOE/MOGE and appointed customs broker roles remain. No application has been submitted by this code change.

Document basis:10015-WIS-LOG-MM0001-R03 §6.1.1/6.1.2/6.1.5 and Myanmar Shipment appendix §5/6.2;10008-STD-6-TEL-001-R00 §7.2.4.2/7.2.5.1. MOGE consignee is not an automatic additional licence/fee. Statutory rates and model applicability require confirmation; not all MR equipment automatically requires radio/type approval.

## Verification

Targeted cost-owner test checks250,000 planning cost, official fee no uplift, filing replacement, old conditional exclusion, B6 service replacement, unchanged242MH, two B1 groups, all14 Source→Scope→Release activities, null mandatory gaps and Release HOLD. Existing baseline fixtures stay immutable; historical comparison tests explicitly back out the new B1/B6 deltas. Native export tests retain original geometry/formulas/16 annex rows and repeated-export identity. Final build/browser results are recorded at completion below.


Final verification: all142 build validators and production webpack passed (3 existing size warnings). After the shared Working renderer fix, current-integration, B1 accordion, B/C hierarchy and new operational-budget checks passed again; production webpack rebuilt successfully. Browser passed all14 Working activity owners, both B1 purpose groups and collapse/expand, Customer/Internal14 compact Release notes and B1/B6 values, six viewport checks1366/700/390, direct Excel download with no file chooser and zero page errors. Native test explicitly checks14 source activity notes, all16 annex rows, original structure/formulas and idempotence. Exported B1/B2 and B5–B8 cells were rendered and visually reviewed; no desktop Microsoft Excel test claimed.

## Follow-up: visible priced A+B subtotal
Owner requested the available quotation amount in the Release total row.
Customer and Internal preview now show the source-derived priced A+B subtotal,
and native Excel G38 carries the same numeric value. A38 identifies the priced
items total in THB and unpriced B owners dynamically; H38 says WORKING DRAFT. Current subtotal is 27,192,339.36 THB; B4/B12/B14 stay unpriced.
No source prices, cost assumptions, final Base readiness or Release gates change.
The original six-sheet template and geometry remain in use.
