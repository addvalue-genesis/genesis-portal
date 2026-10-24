# PJ2608-0553 — B1 27-activity ownership review and two-group presentation

Date: 2026-10-24 (Asia/Bangkok). Read-only pricing audit; no production price or UI changes.
Remote branch checked: `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`, head `232589a32360293d43b103d2d3b62d2268c1bf7d`.
Local tested source tree: `72a528ddf700f09f2eb2486865fe94604f0a1e17`.

## Result

The 27 historical B1 engineering titles are NOT 27 additional chargeable jobs.
Nine titles substantially overlap document production/review already priced in B2; two test-content titles overlap B2 procedure work and B3 execution. The remaining 16 need a split between existing support/document/field/vendor work and distinct ADDVALUE engineering deliverables. This is a source-model ownership assessment, not customer approval or proof that every deliverable has sufficient hours.

Two explicit technical-author gaps exist in B2: WO-129 Link Budget calculations and WO-130 Radio Coverage Calculations retain only 0.75 document-control hour each. Their excluded source hours (0.26 each) are NOT a credible new engineering estimate and must not be restored as the price of a full calculation.

Next G has supplied a five-link engineering summary, so link engineering is not entirely absent. However, the selected quote evidence does not establish paid responsibility for all final project calculations, checks, revisions and brownfield interfaces. Existing MGW service quotations likewise do not establish selected service coverage: the current owner decision is equipment supply only. Do not request an MGW requotation or silently restore historical SERV-1.

## Verified current budget evidence

- B1: 242 support hours, cost THB181,400, Working SELL THB211,600. These are planning values, not verified payroll.
- B2: 131 work objects / 143 requirement rows; selected 963.76 hours; cost proxy loaded to THB189,696.90; Working SELL THB237,121.13. B2 includes Lead, Senior, Engineer, CAD and Document Control roles, not document control alone. Current rates/workload/RACI remain provisional.
- B3: THB2,322,450, including local SAMTEL preparation/FAT, selected SAT28, conditional brownfield survey and temporary VeEX. Preparation includes four Senior and four Field person-days. Physical preparation/configuration is not proof of a separate office design budget.
- B9: THB480,550, two-person onshore team for seven working days plus two travel days each. This is Yard execution, not a general project-design allowance.
- A supplier evidence: Next G/VST for MR0001, MGW equipment for MR0002, EXION for MR0003, MDS/ORGA for MR0004. None of the inspected selected-price models proves complete ADDVALUE system engineering is included in A.

## Full 27-title crosswalk

IDs below are the suffixes of `B1-ENG-REVIEW-01` through `27`. D = substantial existing B2 document/review overlap; T = B2 test-content / B3 execution split; R = mixed/residual engineering review. No row authorizes a new charge or a deduction.

| ID | Existing engineering title | Class | Existing priced evidence / owner | Residual decision |
|---|---|---|---|---|
| 01 | COMMON — Project kickoff / design-basis review | R | B1 K00/K01 office support; B2 WO-023/024 KOM/MOM | Keep meeting management and records with existing owners. Distinct technical design-basis decisions need an engineering deliverable; PMO hours do not prove technical-author coverage. |
| 02 | COMMON — Cross-system interface register / BLD review | R | B2 WO-029–032 schematics and WO-053–056 wiring/termination | Document review is priced. Cross-system interface architecture/register authoring is not demonstrated as a separate selected resource; B1 candidate only for residual work. |
| 03 | COMMON — Vendor technical coordination / TBE support | R | B1 coordination/procurement; B2 WO-010–013 bought-out lists and WO-037–044 data/brochure reviews | Do not repeat routine chasing or document review. Technical bid evaluation and resolution of cross-vendor incompatibilities need a separate deliverable boundary. |
| 04 | COMMON — IFC / final engineering closeout | D | B2 WO-025–056 drawings and WO-105–108/121–128 dossiers; B1 K18 administration | Use B2 for included document issue/revision and B1 for existing administrative closure. Unique final engineering acceptance remains to allocate; no blanket extra B1 line. |
| 05 | MR1 — Requirement / DTS / BOD review | R | B2 WO-037/041 equipment data/brochure review; selected A1 evidence | Establish the residual system requirement/compliance review beyond existing document review; do not add the whole historic task. |
| 06 | MR1 — Link budget / RF / network design | R | B2 WO-129 explicitly DC-only; Next G five-link summary exists | Reuse supplier results, but identify responsibility for final RF proof, changed configurations and approval revisions. A1 inclusion is unproven; residual B1 engineering remains open. |
| 07 | MR1 — Brownfield interface ZPQ/ZWP08/ZWP11 | R | B3 selected BF survey and BF SAT; B2 WO-131 loose-items list | Survey/test inputs and filing are priced. Brownfield cutover/interface engineering, compatibility and rollback design are not proven included by field days alone. |
| 08 | MR1 — GA / schematic / wiring / installation review | D | B2 WO-025/029/045/053 | Review/drawing allowance exists. Do not duplicate in B1; distinguish OEM originals from ADDVALUE document review. |
| 09 | MR1 — NMS / L3 / IP integration technical content | R | A equipment/software candidates; B3 PREP-SENIOR and SAT; B9 Yard configuration | Physical configuration/test is budgeted. Authoritative IP/VLAN/NMS architecture and integration decisions need ownership beyond execution; software licences are not labour. |
| 10 | MR1 — Internal check / revision | D | B2 review-cycle factors on MR1 WOs | Keep included document checks/revisions in B2. Rework of a separate residual B1 design must be included once in that design task. |
| 11 | MR2 — Requirement / BOD / DTS review | R | B2 WO-038/042; selected A2 equipment data | Residual system requirement/compliance decisions beyond document review need ownership; no assumption of included MGW service. |
| 12 | MR2 — Radio coverage / link budget | R | B2 WO-130 explicitly DC-only; A2 equipment package | No selected resource for full coverage calculation demonstrated. Establish passive/active RF model and required coverage proof; B1 residual candidate. |
| 13 | MR2 — ZPQ DMR integration | R | B3 BF/SIT execution; B2 MR2 schematics | Host-system integration design and approved interface configuration are not proven covered by test attendance. Split from field execution. |
| 14 | MR2 — GA / schematic / wiring / installation review | D | B2 WO-026/030/046/054 | Included B2 review/drawing scope; no additional B1 charge for same outputs. |
| 15 | MR2 — Talk-group / configuration technical content | R | B3 preparation and B9 configuration support | First verify applicability to selected BDA/LNA package and host DMR system. Do not assume a new trunk-radio controller or invent talk-group engineering quantities. |
| 16 | MR2 — Internal check / revision | D | B2 review-cycle factors on MR2 WOs | Same boundary as ID10; no duplicate revision allowance. |
| 17 | MR3 — Requirement / Ex compliance review | R | B2 WO-039/043/091 equipment/certificate review | Certificate review is already priced. Applied Ex suitability of the final installation/interface is distinct and requires a responsibility check. |
| 18 | MR3 — Telephone / PABX interface | R | B3 SIP/configuration preparation and SAT; B2 WO-031/055 | Physical SIP checks are not proof of network/PABX interface design ownership. Keep only the residual engineering as B1 candidate. |
| 19 | MR3 — Ex cable / gland / JB engineering | R | A3 phone/bulk models; B2 WO-047/055/091; B3 installation checks | Purchased hardware and document checking are not full cable-entry/Ex-system design labour. Current EXION quote has no proved JB/gland inclusion; resolve selected configuration before pricing residual design. |
| 20 | MR3 — GA / wiring / termination / installation review | D | B2 WO-027/031/047/055 | Existing B2 review/drawing allowance; no duplicate B1 charge. |
| 21 | MR3 — Test technical content | T | B2 WO-063/067/071/079/083; B3 physical FAT/SAT | B2 already prices ITP/procedure/report document work; B3 executes tests and records physical results. Current B1 keyword classification as B3-only is too coarse. |
| 22 | MR3 — Internal check / revision | D | B2 review-cycle factors on MR3 WOs | Existing B2 document revisions; separate residual engineering revision only if its task is established. |
| 23 | MR4 — Requirement / marine-nav review | R | B2 WO-040/044; A4 MDS RACON package | Equipment review is priced. Project-specific navigational/interface decisions need responsibility confirmation; Myanmar authority applications belong in licensing group, not a second engineering fee. |
| 24 | MR4 — Power / interface / hazardous review | R | A4 included DB-5P/control box; B2 WO-032/048/056/092 | Included OEM package and B2 review must be credited in scope. Residual platform power/alarm/Ex interface design is not proven included. |
| 25 | MR4 — GA / wiring / installation detail review | D | B2 WO-028/032/048/056 | Existing B2 review/drawing allowance; no extra B1 for same deliverables. |
| 26 | MR4 — Test technical content | T | B2 WO-064/068/072/080/084; B3 RACON test/preparation | Same B2 document/B3 execution split as ID21. OEM test access/capability gaps do not justify double charging procedure authorship. |
| 27 | MR4 — Internal check / revision | D | B2 review-cycle factors on MR4 WOs | Existing B2 revision allowance; no blanket additional B1. |

Count: D=9, T=2, R=16; total=27. The R count is NOT an approved count of 16 extra jobs. B2 title matches establish existing budget overlap, not complete technical delivery or sufficient labour.

## Other owner boundaries (B4–B14)

- B4 painting/coating, B5 physical packing/marking, B6 freight/cargo insurance and customs per selected CIF boundary, B7 storage: do not move physical costs to B1. Their document production/review remains with priced B2 WOs where applicable.
- B8 teaching/content/online OEM blocks stay B8. PMO scheduling does not duplicate teaching time.
- B9 Yard configuration/support stays B9; a system design deliverable must not be inferred from attendance days.
- B10/B11/B13 physical spares, delivered tools/software and consumables stay with their owners. B2 already has spare-list document review; list production is not physical stock and vice versa.
- B12 applicability and B14 contractual insurance/bonds remain separate open owners. No blanket transfer into B1.
- Legacy B6-LICENSE-MYANMAR is an unpriced requirement reference. Myanmar licence costs proposed in B1 must be cross-referenced once, never posted a second time in B6.

## Requested two-group B1 presentation (proposal, not implemented)

Use work-purpose grouping with separate performer fields. Avoid the title "Myanmar Government" for all costs: the group includes private-company work and ADDVALUE coordination, not only payments to government.

| Group | Included accounts | Current cost | Current SELL | Proposed cost | Proposed SELL |
|---|---|---:|---:|---:|---:|
| ADDVALUE Engineering & PMO | B1.1, B1.2, B1.3, B1.4, B1.8; unique engineering residuals remain unpriced | 169700 | 198055 | 169700 | 198055 |
| Myanmar Regulatory & Licensing Services | Existing B1.5 plus proposed B1.6/B1.7 and separately visible permit reserves | 11700 | 13545 | 211700 | 233545 |
| Total B1 | All groups, counted once | 181400 | 211600 | 381400 | 431600 |

The proposed Myanmar increment is the conversation estimate: cost 200000 / SELL 220000 (existing nonlabour factor 1.10), comprising agency 78750, fee allowance 25000, additional-approval/station/frequency reserve 75000 and execution reserve 21250. All remain nonposted estimates; this audit does not independently validate the adequacy of those allowances or an agency quotation. Old conditional B1.6/B1.7 cost 47000 / SELL 51700 is replaced, not added.

B1.5 follows work purpose into the Myanmar group while performer remains ADDVALUE. No extra posting arises from moving its display. General management trips remain in group 1 until a specific permit trip allocation is evidenced; do not relabel all existing travel as Myanmar travel. Existing B1.5 translation/preparation and any corresponding partner deliverable require a work split to prevent duplication.

The proposed total THB431600 is not a final all-engineering price. Estimate only the distinct engineering outputs left after the 27-row split, with fresh hours/rates; do not reuse historical 964 MH, historical engineering price, offshore selling rates, or treat B2's excluded 0.52 MH as complete engineering effort.

## Reproducible sources

All paths below are under `frontend/src/project0553/`:

- `data/bcWorkCostLines0553.js`: ordered 27 `B1_WBS_ACTIVITIES` titles; old prices/hours remain historical.
- `data/b1ProjectSupportBudget0553.js`: active B1 cost source; keyword-only unpriced engineering classifier; seven support roles and accounts.
- `data/b2VdrlRecalcSourceWorkObjects0553.json`: WO-001–131, work modes and role-hours.
- `data/b2IndependentVdrlRecalculation0553.js`: active B2 default excludes explicit B1 technical-author hours; role-cost derivation and unresolved RACI.
- `data/bcTurnkeyWorkingCost0553.js`: selects current B1/B2/B3/B9 and B4–B14 owners.
- `data/nextgLinkSummary.js`, `data/quotes/NG-260916-commercial-terms.js`: supplied link evidence versus quotation limitations.
- `data/mr0002WorkingBom0553.js`, `data/mgwP26058R2Cover20261020.js`, `data/b3MgwPurchasedFatWorkingSell0553.js`: equipment-only selection versus nonposted historical service evidence.
- `data/quotes/EXION-1260576-R0.current.json`, `data/mr0003PhoneBulkDerivation0553.js`: selected phone/sounder and unresolved field interface.
- `data/mr0004WorkingBom0553.js`: selected MDS package and technical/commercial gaps.
- `data/b9ChinaWorkingBudget0553.js`, `data/b3SelectedSatSurveyPrice0553.js`: current physical preparation, FAT, SAT, survey and Yard work.
- `data/scopePartBcReadModel0553.js`, `data/releaseCommercialModel0553.js`: downstream models read the canonical source; never edit totals independently.

## Validation / limitations

Runtime evaluation confirmed 27 unpriced engineering titles, B1 and B2 totals above, and exactly two B2 objects with excluded technical hours (WO-129/130). Source-mapped audit classifications are engineering judgments, not customer/supplier acceptance. No supplier contacted, no permit applied for, no DB/manual-input work, no customer release, and no price changes. Requirements 1–8 are not reconstructed or claimed closed.


## Subsequent implementation
The later owner-approved three-stage operation change is documented in `20261024_B1_B14_IMPORT_OPERATIONAL_ACTIVITIES.md`. Its B1 cost374,200 /SELL421,180 supersedes the earlier proposal in this audit: filing7,200 removed and official fee allowance has no uplift. The27-title engineering findings remain unpriced; the operating-budget change does not close those engineering gaps.
