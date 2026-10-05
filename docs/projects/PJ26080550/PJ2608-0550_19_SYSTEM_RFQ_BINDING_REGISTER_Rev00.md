# PJ2608-0550 — 19-System RFQ Binding Register

**Revision:** Rev00  
**Status:** Internal working / evidence-control register  
**Purpose:** Bind the existing 19-System Master sequence to the actual PJ2608-0550 RFQ document structure without treating internal numbering as a customer requirement.

## 1. Numbering doctrine

The following identifiers are separate and shall not be merged:

- **Internal System No.** — sequence from `00_ASK_19SYSTEM_MASTER_INTERNAL_REV00.xlsx`; used for GENESIS navigation and work control.
- **GENESIS Module ID** — `12.1` through `12.19`; mirrors Internal System No.
- **System Token** — stable internal token such as `TEL-PAGA`.
- **TEL-021 functional code** — customer/company functional identifier where present.
- **MR Appendix / item** — Material Requisition scope location.
- **PHI clause** — system philosophy / location / interface basis.
- **BOD clause** — Basis of Design system section.
- **SPE / STD** — project/company technical requirement source.

One identifier shall never silently replace another.

## 2. System master

| No. | GENESIS | Token | System | MR basis | PHI | BOD | SPE | Company STD / TEL-021 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 12.1 | TEL-LAN | LAN / Network System | MR-0001 Network pages | §7.3.1 | §7.1.1 | SPE-0002 | TEL-011 / TEL-012 / ICT-003 · TEL-021 11 |
| 2 | 12.2 | TEL-LAN-VCS | Video Conference System | MR-0001 Video Conference lines | §7.3.2 | §7.1.2 | No dedicated VCS SPE identified | ICT-001 · no TEL-021 row |
| 3 | 12.3 | TEL-VSAT | VSAT Satellite Communication | MR-0001 App.1.2 | §7.3.6 + tie-in PHI | §7.1.6 | SPE-0006 | TEL-008 · TEL-021 33 |
| 4 | 12.4 | TEL-VSAT-KU | KU-Band Satellite Internet | MR-0001 App.1.2 KU scope | §7.3.18 | §7.1.18 | No dedicated KU SPE identified | TEL-008 where applicable · no TEL-021 row |
| 5 | 12.5 | TEL-PABX | IP Telephony / PABX | MR-0001 App.1.3 telephony | §7.3.3 | §7.1.3 | SPE-0003 | TEL-003 / TEL-022 · TEL-021 03 |
| 6 | 12.6 | TEL-IPP | IP Phone (Ex) / Field Telephone | MR-0001 App.1.3 IP Phone (Ex) | §7.3.3 | §7.1.3 child scope | SPE-0003 field clauses | TEL-022 · independent TEL-021 row not confirmed |
| 7 | **12.7** | **TEL-PAGA** | **PAGA** | **MR-0001 App.1.4** | **§7.3.4** | **§7.1.4** | **SPE-0004** | **TEL-007 · TEL-021 01 PAGA-A; 02 PAGA-B only if specified** |
| 8 | 12.8 | TEL-CCTV | CCTV | MR-0001 App.1.3 CCTV | §7.3.5 | §7.1.5 | SPE-0005 | TEL-009 · TEL-021 52 |
| 9 | 12.9 | TEL-RADIO-DTRS | VHF DMR / Digital Trunked Radio | MR VHF DMR / handheld lines | §7.3.7 | §7.1.7 | SPE-0009 | TEL-001 · TEL-021 23 |
| 10 | 12.10 | TEL-RADIO-MARINE | VHF-FM Marine Radio | MR App.1.1 Marine | §7.3.8 | §7.1.8 | SPE-0007 | TEL-006 / TEL-027 · TEL-021 21 |
| 11 | 12.11 | TEL-RADIO-AERO | VHF-AM Aeronautical Radio | MR App.1.1 Aero | §7.3.9 | §7.1.9 | SPE-0008 | TEL-006 / TEL-026 · TEL-021 22 |
| 12 | 12.12 | TEL-RADIO-SSB | MF/HF SSB Radio | MR App.1.1 MF/HF | §7.3.10 | §7.1.10 | SPE-0010 | TEL-027 · TEL-021 24 |
| 13 | 12.13 | TEL-DMR | Digital Microwave / LOS Radio Links | MR App.1.5 Microwave | §7.3.11 | §7.1.11 | Dedicated SPE binding requires controlled file verification | TEL-004 · TEL-021 31 |
| 14 | 12.14 | TEL-ES | Entertainment | MR App.1.6 | §7.3.12 | §7.1.12 | SPE-0012 | TEL-010 · TEL-021 51 |
| 15 | 12.15 | TEL-FO | Fiber Optic Communication | MR / pipeline/interface scope | §7.3.13 + APL FOC philosophies | §7.1.13 | SPE-0013 | TEL-015 / TEL-012 · TEL-021 35 |
| 16 | 12.16 | TEL-TELT | Telecom Tower / Mast | MR App.1.1 tower items | §7.3.14 | §7.1.14 | No dedicated tower SPE bound in current supplier matrix | TEL-017 · TEL-021 93 |
| 17 | 12.17 | TEL-MET | Meteorological | MR MET pages | §7.3.15 | §7.1.15 | SPE-0014 | TEL-031 · TEL-021 61 |
| 18 | 12.18 | TEL-NDB | Non-Directional Beacon | MR App.1.7 | §7.3.17 | §7.1.16 | SPE-0015 | TEL-026 · TEL-021 25 |
| 19 | 12.19 | TEL-AIS | AIS Monitoring (Onshore) | free-issue / interface relationship; main hardware price not confirmed | §7.3.16 | §7.1.17 | No dedicated AIS SPE bound | TEL-021 42 |

## 3. PAGA pilot mapping

PAGA is **System No. 7**, therefore:

- `12.7` — PAGA Engineering
- `12.7.1` — System Picture
- `12.7.2` — Requirement / Evidence
- `12.7.3` — Engineering Proof
- `12.7.4` — Required MTO / Vendor
- `12.7.5` — VDRL / Workload
- `12.7.6` — Lifecycle / Cost
- `12.7.7` — Technical Resolution Queue

The same sub-module pattern is intended for the other 18 systems after their RFQ bindings are verified.

## 4. Source hierarchy

The 19-System workbook controls **internal sequence**, not contractual truth.

Technical truth must resolve through applicable PJ2608-0550 sources, typically:

`MR / RFQ → PHI / BOD → SPE / STD → DWG / LAY / LIS / MTO → RPT / CAL / SDY → approved TC/TQ → accepted vendor evidence`

If the sources conflict, create a controlled conflict object and reconcile authority/revision before release.

## 5. Audit items still requiring verification

1. Dedicated Microwave SPE file binding: referenced system requirement exists, but the supplier matrix recorded that no dedicated MW SPE was present in the local RFQ folder. Verify before treating a file as attached authority.
2. IPP is an internal split of telephone/field-phone scope; it is not currently an independent BOD section and no independent TEL-021 row is confirmed.
3. VCS and KU-Band are included in the internal 19-system architecture even though the supplier matrix records no TEL-021 row for them.
4. PAGA-B (TEL-021 code 02) is conditional: do not create or price it merely because the code exists; require actual project evidence that the B-loop scope applies.
5. AIS is an onshore monitoring/interface scope with offshore free-issue relationship; main hardware procurement scope must not be invented.

## 6. Review protocol

Claude / Grok / ChatGPT reviewers should comment by stable address, for example:

`12.7 / TEL-PAGA / RFQ-BINDING`

or

`12.13 / TEL-DMR / SPE-BINDING`

Each comment should state:
- issue;
- source checked;
- conflicting/absent evidence;
- proposed correction;
- impact;
- disposition: ACCEPT / REJECT / TBC / NEEDS SOURCE.

