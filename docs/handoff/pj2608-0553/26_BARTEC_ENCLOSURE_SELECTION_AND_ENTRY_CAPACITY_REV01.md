# PJ2608-0553 — BARTEC Enclosure Selection and Cable Entry Basis Rev01
**Decision date:** 2026-10-13. **Authority:** user engineering selection for INTERNAL working Z1F model.
**Source:** User-supplied 2022 BARTEC as-built `21G1048t-BA-GA-100X_Z0.pdf` (16 PDF pages); Z1F `MM-ZTK-1F-GEN-TEL-DTS-0001 Rev.C1`; `MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2`.

## Confirmed: retain the BARTEC type/model and drilled holes in working design
The user explicitly confirms that the BARTEC enclosure models in the supplied GA are used and that their **actual pre-drilled hole patterns**, not a silently modified 18-hole retrofit, should be the engineering quantity basis.

| Enclosure | BARTEC GA / PDF pages | Nominal model | Cable entries (M20) PER ASSEMBLY | Original M20 stopping plugs | Separate drain entry | Historical assembly count ONLY |
|---|---|---|---|---:|---:|---:|
| SCADA Type 1 | GA-1001 pp1-2 | 07-56D1-9811, SS316L | 12 top + 2 left + 2 right = **16** | 16 | 1 | 2 |
| SCADA Type 2 | GA-1002 pp4-5 | 07-56D1-9811, SS316L | 12 top + 2 left + 2 right = **16** | 16 | 1 | 4 |
| SCADA Type 3 | GA-1003 pp7-8 | 07-56D1-9811, SS316L | 12 top + 2 left + 2 right = **16** | 16 | 1 | 1 |
| Ex e Telephone JB | GA-1004 pp10-11 | BOM 07-56D1-0811; nameplate 07-56D2-0811 (**needs OEM PN reconciliation**) | 8 top = **8** | 8 | 1 | 4 |
| Ex d TETRA panel reference | GA-1005 pp12-13 | EJB91 | 18 bottom = **18** | 18 | 1 | 4 |
| TETRA selector reference | GA-1006 pp15-16 | 07-56B1-0211 | 4 bottom per BOM (**top/side depiction to reconcile**) = **4** | 4 | 0 | 4 |

**Correction control:** SCADA Type 1/2/3 is **16**, not 18 cable entries. The **18** is a separate historical Ex d TETRA panel. The SCADA and telephone are not the same enclosure. The 2022 historical assembly count and old WP tags do not determine 2026 Z1F location quantities. Never auto-assign legacy TETRA equipment to Z1F MR0002 / DTRS.

## Engineering quantity policy
1. Distinguish **per-enclosure drilled M20 entries**, **number of factory-fitted stopping plugs**, **actual used cable ends**, **retained spare plugs**, **certified active glands**, **additional purchased glands** and **drain valve**; each has an independent unit and cost owner.
2. Cable Gland quantity for installed active entries follows a Z1F per-WP/site/system/TAG `CableEnd(from,to,cableType,outerDiameter,ExConcept,entryThread)` schedule, not the 16 original holes.
3. Factory 16 plugs and corresponding locknuts are assembly evidence. For a used hole, the installed termination and exact certified gland replace the original stopping plug if permitted by OEM design; record included accessories, replacements, remaining plugs and site installation scope. The one drain M20 hole is not a usable data cable entry.
4. **Management capacity screening only:** reserve at least `max(2,ceil(20% of total installed usable holes))` (conservative interpretation of SPE). For 16, reserve 4 and plan no more than 12 used. For 8, reserve 2 and plan max 6; for 18, reserve 4/max 14; for 4, reserve 2/max 2. These are **planning ceilings**, not a verified cable schedule or certificate.
5. Preserve the original MR0001 Row11 CAT6A 69m + 1 M20 budget line and 7-site THB260,232 reclassification. **One booked gland is only a partial budget line**, not confirmation that the SCADA Enclosure has one cable entry. Do not inflate booked cost to 16 glands, add A1/A5 twice, or infer 2022 historical assembly costs as new Z1F installed costs.
6. Vendor/OEM package content is checked separately for factory-fitted glands, plugs, brackets and sealed assembly. Cable gland purchase `max(0,requiredActiveGlands - approvedVendorIncluded - approvedReuse)` subject to matching dimensions/certification. A fitted stop plug is NOT an active gland.
7. Relevant standards and hard constraints (Ex, Zone, IP66, cable OD, thread, penetrations, IEC 60079-14) remain mandatory. No unapproved field drilling or swapping Ex assembly certification.

## Contractual deviation remains OPEN
**`DTS-0001 Rev.C1` SCADA enclosure requires at least 18 cable entries. The user-selected BARTEC Ex e SCADA drawing has 16 entries.** This is an explicit technical discrepancy (shortfall 2 holes per assembly), not evidence of compliance and not automatically solved by spare allowance. Preserve selected BARTEC for internal working quantity, flag `TECHNICAL_DEVIATION_CUSTOMER_DISPOSITION_REQUIRED`, obtain written client acceptance, or an approved revised compliant manufacturer configuration before technical or customer release. Do **not** silently add holes or overwrite the original BARTEC GA.

## GitHub controlled files
- `frontend/src/project0553/data/bartecEnclosureBasis0553.js` — user-confirmed make/model/holes, drain, source pages, planning capacity, deviation state, separate from actual gland quantities
- `frontend/src/project0553/BulkTakeoff0553.jsx` — shows selected BARTEC basis as distinct UI table; no new posted cost
- `frontend/src/project0553/data/zwp20GaBulkReconciliation.js` — connects current physical basis to historical GA reconciliation
- `frontend/src/project0553/data/zwp20BulkScopeAudit0553.js` — clarifies that the booked M20 1-set quantity is a partial ACTIVE gland estimate, not the physical 16 holes

## Remaining quantity work
Complete Z1F per-WP cable-end register from Schematic / BLD / LAY / WIR / MTO for MR0001–MR0004. At each enclosure, verify actual incoming/outgoing circuits, external Ex fittings, spare plugs and no double count for supplied packages. Compare these against BARTEC physical entry capacity and separately price genuinely non-included field glands. Current quantity and customer technical compliance are **not** complete.

**Verification:** GitHub files updated by connector; local Node/Babel validators, Webpack build and browser acceptance on user PC have **not** been executed during this decision update.
