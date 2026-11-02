# 0553 - L3 port basis and MDS exclusions, 2-Nov-2026 (R72)

Owner selected two explicit dispositions in project chat: use the L3 eight-port
basis under TC-0001 Item 13, and "ไม่รวมเราจัดหา" against MDS FAT/cable/gland
exclusions. This is ADDVALUE's bid-planning decision, not supplier confirmation.

| Scope | Selected owner/basis | Financial treatment |
| --- | --- | --- |
| L3 switch | 8 copper ports + 2 SFP, no IEM-3300 expansion | Existing THB371,580 TAG package retained |
| RACON/control box/DB-5P | Included MDS package | Existing USD75,000 per quoted system; included boxes non-additive |
| FAT | ADDVALUE B3 integrated FAT at SAMTEL Thailand | Existing B3 labour retained; no supplier FAT credit or automatic second allowance |
| Field/interconnection cables | ADDVALUE MR0004 field bulk | Effective MDS credit zero; measured takeoff/rate/cost adequacy open |
| Field cable glands | ADDVALUE MR0004 field bulk | Effective MDS credit zero; actual Ex entry, cable OD, SKU and price open |

QTORG2609244 (22-Sep-2026) has conflicting p4/p5 inclusions and p7/p8 exclusions.
The attached PDF was read and pages4/5/7/8 visually checked. No PDF or original
supplier quote is altered. `raconTerminationBudget0553.js` retains the raw
20m/6-gland quotation evidence but computes effective credit from the shared
`MDS_SCOPE_DECISION_0553` in the existing MR0004 owner. This also propagates to
current selected field bulk, MR/location coverage, FAT routing and C1 review.
The programming cable explicitly included in the package remains included;
field-cable exclusion does not create another programming-tool purchase.

The six existing cable-route scenarios and assumed 60m/6m route lengths are not
changed or promoted to measured quantities. Because the prior conservative case
already replaced short quoted runs in full, total planned cable purchase stays
the same; vendor included metres now correctly show zero. Twelve candidate ends
per site replace the old net six-gland scenario. Twelve is not an approved Ex
gland purchase count: verify actual enclosure/end register and cable OD. All
unmatched purchase rates/costs remain null, not zero. No aggregate bulk or B3
allowance is claimed to cover these costs without reconciliation.

`L3_PORT_DECISION_0553` records owner confirmation in the existing SCADA model.
PoE load, actual port assignment, L3 entitlement and Ex installation remain
technical checks. This decision does not approve C1 spare Qty1 or the supplier's
spare quantities. Every C1 scenario row explicitly keeps quantity approval false.

The C1 planning total USD181,100 is unchanged and remains unselected. Current
C1 USD97,500, C2 USD23,000, A+B USD902,900 and existing native Excel are unchanged.
No module IDs, source row identities, FX, markup, customer approval or cost
posting authority change. These dispositions do not waive required OEM factory
pretests/certificates or replace them with the local integrated FAT.

Validation: new cross-consumer owner-supply/zero-credit/null-cost/SSR regression,
C1 SI arithmetic and C1/C2 evidence gates, TC-0001 eight-port, protected financial
fingerprints, Official/native XLSX, SAMTEL FAT routing, MR/location bulk,
source-to-release and change-log checks all pass. Protected fingerprints retain
the original fixture: only three A4 source-row status labels are explicitly
normalized to their prior values before comparison; no financial difference is
allowed. Production build passes with three existing bundle-size warnings.
Interactive browser QA remains unavailable; component SSR is checked.
