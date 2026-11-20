# PJ2608-0553 — Internal Cost vs Customer Proposal Identity Policy / B3+B8 7-day allocation

Date: 2026-10-21. This is an INTERNAL pre-award model. No automatic Customer Proposal release.

## Non-negotiable naming rule
- **Customer contract line B1–B14 / C1–C2 is immutable.** The suffix B3 is the buyer's Scope of Supply category, NOT our Internal Cost Activity code.
- **SOW-B3** / **SOW-B8**: customer Scope of Supply lines only, mapped to the original numbered B3/B8 tender rows. Do not rename the tender reference or the original Module ID.
- **IC-FAT-001** / **IC-TRN-001**: ADDVALUE Internal Cost Activity identities; require measured working cost/payroll evidence before treating as actual Cost; never printed as the customer's B3 line number.
- **WS-B3** / **WS-B8**: Internal Working SELL/Pre-award estimate, not an issued customer quotation or supplier cost.
- **CP-B3** / **CP-B8**: reserved customer Commercial Proposal line mapping, NEVER 'issued' until controlled Pricing Release.
- **VQ-MGW-SERV-2** / **VQ-MGW-SERV-4**: original supplier quote identities. Their USD prices are not B3 ADDVALUE Working SELL.
- **SC-B3-FAT**: conditional scenario/pre-award what-if. **AU-**: audit-only evidence, no sell/cost posting.
- Keep Technical Module IDs such as bid.budget.working.bc.b3 and bid.budget.working.bc.b8 unchanged; namespaced identifiers are supplementary finance identities, not alternative routes. One and only one Cost Owner for each person-day/invoice/document.

## 7-day integrated work programme (source decision, NOT approved customer substitution)
A 2-person ADDVALUE team shares 7 on-site working days / 14 paid person-days:
- Days 1–2 MGW Internal iFAT: 2 ADDVALUE FAT MD each day → 4 B3 MD
- Days 3–4 training/parallel FAT readiness: 1 B8 training + 1 B3 FAT MD each day → 2 B8 / 2 B3 MD
- Days 5–7 witnessed Customer FAT: 2 B3 MD each day → 6 B3 MD
- Therefore **12 B3 FAT MD + 2 B8 Training MD = 14 unique on-site MD**.
- MOB/DEMOB travel: 2 days/person × 2 persons = **4 travel MD**, accounted **ONCE** in current B3 FAT budget, outside the seven on-site working days.
- Existing B3 China visit assumes 14 hotel room-nights; seven on-site days assumes 16 room-nights, a **2 room-night** provisional difference.
- No extra ADDVALUE travel labour, airfare, visa, insurance or local transportation amount is re-posted for the B8 trainer.

## Indicative WHAT-IF only (THB, exact source Working SELL)
| Scope | Current 10.2 Working SELL | 7-day Internal Scenario | Delta | Financial identity |
|---|---:|---:|---:|---|
| B3 FAT trip only | 397,400 | 402,400 | +5,000 | IC-FAT-001 / WS-B3 / CP-B3 NOT ISSUED |
| B3 whole owner incl SAT & tools | 2,443,400 | 2,448,400 | +5,000 | SOW-B3 → WS-B3 |
| B8 training owner | 30,000 | 37,800 | +7,800 | IC-TRN-001 / SOW-B8 → WS-B8 |
| Combined B3+B8 | 2,473,400 | 2,486,200 | +12,800 | TWO owners; NO double person-day |

**No 10.2 canonical Working SELL change** from this separate scenario. Existing B3 THB2,443,400 and B8 THB30,000 remain selected; no release, no verified Direct Cost. Future price change is a separate approval and update to all dependent selectors 10.2 → 10.3 → 10.5.

## OPEN input/control issues before any customer offer
1. Contract references B8 Training before FAT and two Yangon batches; training integrated at China MGW facility is a PROPOSAL, not proven customer-approved equivalent.
2. Original B8 44 MH included non-contact preparation/admin. Proposed 2 training MD × 8 h = 16 contact h; **28 MH not reconciled**.
3. MGW iFAT 2 days + minimum 5 end-user FAT facility, combined formal FAT witness only 3 days in the programme. Full original 48h MR/FAT ITP/hold points require witnessed/compressed-plan approval, no unagreed deletion of tests.
4. No-charge extra day is a proposed commercial term, not signed. All actual travel/payroll/equipment price inputs still not verified.
5. MGW SERV-2 USD5,000 / SERV-4 USD2,500 already included in vendor cover USD368,841; supplier Cost Owner and actual amount included in Equipment Part A/B3 open; DO NOT add twice.

## Mandatory 'read old code first'
Read src/project0553/data/b9ChinaWorkingBudget0553.js, b3Fat2Plus5PricingScenario0553.js (older
alternative, do not import blindly), b3B8IntegratedFatTraining0553.js from the original
20-Oct feature branch, b3HierarchicalPriceTable0553.js, bcTurnkeyWorkingCost0553.js,
partBCWorkingWbs0553.js, original MR/BOD/SPE compliance audit and 10.2/10.3/10.5
before altering any new scenario or cost. Existing price source remains the authority,
and a scenario does not justify changing working/pricing/release automatically.

## Validation
- npm run validate:0553-b3-b8-seven-day-identity
- npm run validate:0553-b3-hierarchical-price-table
- npm run validate:0553-b3-breakdown-module-ids
- npm run validate:0553-current-commercial-integration
- npm run build

Draft only; no CI or Windows Local Build executed from this branch yet.
