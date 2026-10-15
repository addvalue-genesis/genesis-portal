# PJ2608-0553 — B1/B2 Document-Driven Budgetary Scenario (Management Only)
Date: 2026-10-15
Status: **TEMP_ESTIMATING / MANAGEMENT SCENARIO — NOT APPROVED DIRECT COST OR SELL / NO CUSTOMER RELEASE**.
This is an independent, non-posting estimate. **Do not overwrite** approved WBS Rev05 B1 MH 964, B1 working sell THB510,000 or B2 working sell THB580,000; preserve project cost baseline manifests.

## 1. Evidence and contractual scope
- Customer Part B original 4-Scope of Supply: `B1 Engineering and design`; `B2 DDP delivery of Documentation including final as-built documents, as per MR`. Existing ADDVALUE priced working copy: https://docs.google.com/spreadsheets/d/1xXgS-OI9WngkezwwIFe5fKx31-M4Z3Ej/edit
- MR0001 Rev.C1 §§10–11, Table 11 and Attachment 1, user-supplied PDF. MR §10 requires VDS implementation immediately after award with revision, dates, approvals; §11 documents minimum; Attachment 1 requires facility/tag/PO, revision stamp, engineering document approval before fabrication.
- BOD0001 Rev.C2 §§11.3–11.4, user link: https://drive.google.com/file/d/1YPVUfUIy8X5lVOHbTcQ3i6J2zc4bLTFQ/view?usp=sharing. §11.3: design documentation approval before fabrication; §11.4 vendor standard O&M manuals to be furnished, not automatically authored afresh by ADDVALUE.
- STD003 §4.5/4.6.4/4.6.5: VDRS and revision/submission control; COMPANY 10 working day review window does not equal 10 billable man-days; successive revision count **not fixed in PTTEP standard**. STD004 §7.2.5: contractor's 15 calendar day re-submission deadline is not 15 billable MD.
- Master VDRL 143 = MR0001 37 + MR0002 36 + MR0003 35 + MR0004 35; 102 A, 37 I, 4 source blank. Source: https://docs.google.com/spreadsheets/d/1fet1uloSMrZvLUDbw1yNx3IC8OuBQYsF/edit
- 38 unique document *titles* are not 38 actual document *instances*. The older document model deduplicated to **131 provisional work objects**, which remains human-review required.
- B1 Rev05 27 engineering tasks, 964 MH, working sell THB510,000; 0 Document Controller MH in those lines. B2 Rev05 working sell THB580,000 (no certified independent B2 DC/MH output): https://docs.google.com/spreadsheets/d/1vXwV3py-FwdyvZaNq-OvsDyefZEJKPqz/edit
- Older B2 cost-owner workbook Rev00d: https://docs.google.com/spreadsheets/d/1IqPjwnJktYaLwWLg2PU9HXdOxTnOvAbz/edit; TEMP VDRL detailed MH 964.2785625, of which Lead 47.34, Sr230.37975, Eng339.8635, Draft125.4825 = **743.06575 technical MH** and Document Controller **221.2128125 MH**. Cannot add all 964 B2 MH to B1's 964 MH without overlapping technical tasks; equally cannot discard technical work without matching scope and owner. Older workbook B2 440k+120k=560k included mixed roles and temporary approximations; cannot use it as independent validation of current 580k.

## 2. Correct cost-owner boundary; do not reinterpret original B1 label as all admin
- B1 Engineering/Design: ADDVALUE particular engineering technical authoring/review, integration, Brownfield verification, project design-basis and technical coordination; OEM-generated engineering remains included in OEM/package cost **unless** a separately priced ADDVALUE scope is contractually evidenced.
- B2 DDP Documentation: VDRL/VDRS/MDR, transmittal, issue/return status, document revision control, project numbering, collation, final/as-built dossier compilation, hardcopy/native media physical delivery; not replicate B1 calculation hours.
- B3 FAT/SAT execution and actual test-evidence technical work; B6/appropriate owner customs/permit acquisition, not B1/B2 simply because paperwork exists.
- One document can generate B1/B2/B3 activities, but each concrete labor activity has one owner and gets priced once.
- PTTEP review 10 WD and contractor response 15 calendar days are **duration constraints**, not multiplier for paid labor MH.

## 3. TEMP B2 DOC-CONTROL work-driver reconstruction
The following work objects and hours are sourced from *older modeling assumptions*, NOT original PTTEP time norms. Preserve their pedigree.
| ID | Driver | Formula / Existing GEQ analog | DC MH |
| --- | --- | --- | ---: |
| B2-DC-BASE | Older B2 VDRL 131 WO model's Document Controller share (already assumes 20 report weeks and 2 TEMP review delta cycles for Approval docs) | WBS row-role sum, GEQ-009/024 | 221.2128125 |
| N-01 | Recurring VDRS status updates, 20 weekly cycles TEMP | GEQ-005/024: 20 × 1.5 | 30 |
| N-02 | Final/as-built incremental handling, 131 provisional WOs | GEQ-005/024: 131 × 0.5 | 65.5 |
| N-03 | Final dossier/index compilation, 4 dossier groups TEMP | GEQ-005/024: 4 × 10 | 40 |
| N-04 | Physical documentation DDP admin | GEQ-005/024: 1 × 8 | 8 |
| | **Total provisional DC MH** | | **364.7128125** |

The old N-01–04 explicitly add DC hours excluded from older source base. Other technical/reviewer/drafter hours included in those N lines are **not automatically charged to B2**, pending explicit per-work-object matching with B1 and B3. Printing/media/courier: THB15,000 **TEMP historic workbook placeholder**; not source-confirmed DDP amount.

## 4. Budgetary sensitivity (THB, ex VAT, scenario policy not supplier quotes)
Treat historical 104.125 THB/DC MH as *historical not current*, base 160 and high 200 THB/DC MH as management-only hypothetical loaded rates with no actual payroll validation. Multipliers below are *commercial scenarios*, NOT established industry norms or verified margin. Use `GEQ-005` for MH, `GEQ-008` for direct labor cost, `GEQ-018` for direct cost roll-up, and `GEQ-033` for provisional commercial treatment; `GEQ-009/024` for B2 lifecycle.
`C_B2 = MH_DC × Rate_DC + 15,000` (where 15,000 is TEMP physical document allowance).
`SELL_B2_scenario = C_B2 × Scenario_Multiplier` (commercial policy hypothesis, not validated final sell).
| Scenario | DC rate (THB/MH) | TEMP sell mult. | Direct-cost scenario (THB) | B2 sell scenario (THB) | B1 510k + B2 (THB) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Low — historical seed | 104.125 | 2.5 | 52,975.72 | 132,439.30 | 642,439.30 |
| Base — management trial | 160 | 2.744 | 73,354.05 | 201,283.51 | 711,283.51 |
| High — sensitivity only | 200 | 3.0 | 87,942.56 | 263,827.69 | 773,827.69 |

**Provisional management planning decision: THB200,000 B2 scenario** (rounded from THB201,283.51), **B1 retained THB510,000**, therefore **B1+B2 THB710,000** for sensitivity, vs current source working THB1,090,000, nominal modeled difference THB380,000. This is not established savings, not a quote amendment, and not a cost baseline update.

## 5. Remaining risks; exclusion gates
1. Scope definition and PO/contract acceptance of which document types are vendor-authored vs ADDVALUE B1 authoring. OEM Package documents must not be double billed under B1.
2. Human binding of 131 work object keys and 38 generic titles to all 143 project document numbers and site/tag splits (Attachment 1).
3. Source A/I blank cells (4) remain OPEN; 102 A may need revision after comments; no mandated fixed count of revision cycles.
4. STD003 Appendix B applicability crosswalk (117 leaf checklist items in older workbook; earlier 98 TEMP/TBC) is not closed; do not infer fully included scope.
5. Reporting 20 weeks, 131 work objects, 2 review delta cycles, per-document DC productivity, DDP THB15k and actual loaded salary rates all provisional, not authoritative standards.
6. Technical drafting/review hours reclassified out of B2 must be reconciled *line-by-line* to B1's 27 WBS activities or OEM, not omitted as zero effort.
7. Contingencies for customer additional comments, unforeseen document classes, major revisions, design change or broader DDP responsibility are not automatically priced. Flag Variation/Assumption Register.
8. Source hierarchy: confirm applicable GEN-003 contractual R01 vs retrieved internally labeled R02 (2023); MR0001 cites R01.

## 6. 10.2 adoption instruction
This is a **non-posting read-only budgetary scenario**. Do not edit `frontend/src/project0553/data/partBCWorkingWbs0553.js` current sell 580000 or B1 510000. Do not alter 10.1 or A/B/C customer output. Subsequent development may expose these assumptions as an adjustable read-only Scenario View with source statuses and explicit approval. Do not call this VERIFIED or STANDARD MARKET AVERAGE.
