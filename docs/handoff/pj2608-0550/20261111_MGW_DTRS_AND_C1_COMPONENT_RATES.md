# 11 Nov 2026 · MGW Q26-063 RADIO / DTRS and Schedule C1

## APF MR component breakdown

Working record `REQ-MR-B1-11-APF-01` shows the 11 components of
MR-0001 Rev.B1 Appendix 1.1, APF item 1, printed p09 (PDF p11).
The handheld text includes the full list of five locations. The row
and its editor display the confirmation status. The breakdown links to
both revisions and retains the original Appendix 2 reference.
Rev.A1 p07 specified three Omni antennas and 27 mobile radios, whereas
Rev.B1 specifies two and 21. The total of 98 handhelds stays the same.
Rev.B1 adds MOGE to its listed scope. Appendix 2 confirmation is pending.

ADR-0550-001 principles 2, 5, 6 and 8–12 apply. The correction is in the
existing MR catalogue and its Working views. It changes neither the 1 Lot
owner basis nor source PDFs, C1 source text, procurement or frozen records.

Upstream baseline `bfc7ec4d`. The original Q26-063 ver1.0 PDF SHA-256
`6d11565391a0ca5760cdcc76e9f12e191de44004d59dd7865ae8237b1f2b2a31`
matches the source catalogue. Pages 9–11 and the registered site aliases provide
the basis for the RADIO / DTRS register.

| Original quote row | Site | Working and MR trace |
|---|---|---|
| RADIO-001 | ACO → ACP | One quoted equipment Lot. Draft reference to `MR-B1-11-ACP-01`. |
| RADIO-009 | APF | One subscriber-equipment Lot. Draft reference to `MR-B1-11-APF-01`. |
| Option following RADIO-009 | APF | Optional charger and speaker/microphone. Quantity and amount TBD. |
| RADIO-016 | APM → AMS01 | Source price retained. Unit and MR allocation OPEN. |

There is no evidenced RADIO / DTRS offer for ABV01. APF lists 96 handhelds
against MR 98 and 26 mobiles against MR 21. Fixed radios, licences, the
GTPL relocation and site allocation still require scope reconciliation.
The quotation validity ended on 8 Nov. Keep the two prices provisional until
the refreshed quote and commercial/technical reviews are available.

07.2 registers the versioned Offers at startup. Working uses one separate cost
owner per eligible Lot in A1-07. The 10.2 Working Preview MR entries show the
Offer and owner links. 11.M can save the C1 suggestions as DRAFT. 11.C1 Appendix
1.1 displays the two Lot owners with their quoted components and retains the
related MR scope as OPEN. Component cells use only uniquely matched Working
selling prices on the same description, quantity and unit. The amounts are
included in the parent total. Unpriced or ambiguous rates display a dash.
C1 component rates are on-screen only. The export and frozen-history paths
retain their existing formatting and price basis. MGW's PAGA exclusions remain
in the existing procurement policy.

The MGW source panel shows an internal E14 allocation of the USD 255,500 Other
Charges from page 1. It uses the existing SI design workload of 568 planning
man-hours as a complexity proxy across the 12 in-scope quoted systems.
PAGA, microwave DMR and Telecom Tower are outside the driver set. Each of the
five priced pools reconciles to the cent. On-site service is OPEN. The estimate
does not post any cost owners, override service pricing or modify Release.

ADR-0550-001 principles 2–6 and 8–14 informed the source-bound draft trace,
single cost ownership, OPEN scope, non-additive display and separation from
release decisions. The registration is idempotent and a competing saved
Working price owner takes precedence.

Verification used the real source catalogue with synthetic FX. The DTRS
regression covers Vendor registration, ACP/APF MR links, Working owners,
11.M Draft bindings and C1 component quantities and rates. The C1 regression
covers USD/THB, ambiguous matches, owner totals and exact legacy restore.
PAGA successor, Working Schedules and Native Exhibit checks passed. Production
webpack compiled with the existing asset-size warning. The full build chain
stopped at the repository-basis fixture (116 offers versus 117 expected),
reproduced on upstream. The local Chromium process could not start because
its socket call was blocked. The user's saved browser workspace was not tested.
