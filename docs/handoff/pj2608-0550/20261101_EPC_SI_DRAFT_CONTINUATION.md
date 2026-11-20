# PJ2608-0550 — EPC/TSI draft continuation

1 November 2026. Starting remote/local HEAD verified as `9301be02931e9d64549e8330a7dbf0b90ed4246b`, branch `feat/pj2608-0550-official-working-20261028`. Application increment: **2026-11-01.6-preview**. Read [Windows baseline](20261101_WINDOWS_524F31A8_CONFIRMED.md), [whole-document QA](20261101_ALL_DOCUMENTS_CONTINUATION_QA.md) and the ADR/Equation references in AGENTS. The earlier successful Windows pull/start at `524f31a8` is confirmed; this later increment's Windows installation and saved browser data remain unobserved.

## Actual starting work and continuation

Owner direction: TC questioning is closed. TELECOM EPC/TSI must propose the complete solution and delivery scope, using MR with applicable PHI/BOD/DTS/SPE/LIS/BLD/LAY/STD, tender/contract and all written amendments/clarifications. State differences as Technical and/or Commercial Deviation according to impact, consistently in **11 Volume I / 12 Volume II / 13 Volume III**. UX/UI redesign remains paused; use existing A/B and canonical stores.

Exact Rev09 remains 677 sources. Exact v3 remains 724 prepared records and 249 reading jobs. Its isolated reconstruction has 990 derived requirements, 139 offers, 293 Working lines and 279 selected lines. Empty proof/activity arrays in that reconstruction **do not mean no earlier SI work existed**.

Recovered private `PJ2608-0550_SI_Work_Package_Rev01_20261029.json` contains 284 requirements (264 MR + 20 SI), **26 reports and 65 activity plans**, all quantities null; its 601 older source references exist in Rev09. Read alongside `PJ2608-0550_SI_Review_Rev01_20261029.md`. Do not wholesale reimport its older source basis or duplicate its requirements. Later user-local edits are not inspected and must win.

New system RPTs explicitly cite earlier system report IDs and reuse six specialist reports: `RPT-SI-PAGA-POWER`, `RPT-SI-PAGA-QUANTITIES`, `RPT-SI-PAGA-SIP`, `RPT-SI-NDB-UNITS`, `RPT-SI-DMR-QUANTITIES`, `RPT-SI-CCTV-RETENTION`. This is a new EPC bid-response desk revision after TC closure, not new accepted engineering. Activity allocations reference earlier ACT-SI plans with the same Working owner; no additional paid work is authorized.

| Work | Actual result |
|---|---|
| Targeted reading | 58 exact extracted locators across 15 source IDs, plus existing requirements/findings and selected offers |
| A | 22 source-bound COMMON contract requirements; 19 existing PHI system anchors enriched under their existing IDs, only if untouched since consumed preparation |
| SI | 20 Particulars, 20 OPEN RPT drafts, 79 activity/resource allocations against existing Working owners |
| Volume II | 100 authored slots: five sections × 19 systems + COMMON, with source/offer/proof/activity links |
| Volume I / III | Nine authored responses; four pending Technical and three pending Commercial Deviations |
| Applied clean reconstruction | 1012 derived requirements, 20 reports, 79 unpriced activities, 100 technical records, three pending CDs |
| Preserved | Exact financial inputs, lines, vendors, offers/selections, quantities, rates, FX, calculations, topology, approvals and frozen history |

This is **not full reading of all 677 sources**. No reading-job status was promoted. Native drawing/table/colour review, current supplier adequacy, actual design CAL/RPT, resource workload and end-to-end commercial reconciliation remain open. Every new review/date/basis stamp is blank, outcomes OPEN, unknown quantities null. Release remains HOLD. Source extraction and desk responses do not establish FAT/SAT, purchaser acceptance or issue authorization.

## Proposed bid basis for owner review

| Topic | Proposed disposition and remaining decision |
|---|---|
| EPC responsibility | OEM quotation is an input, not the TSI scope ceiling. Include required engineering/interfaces/test/training/docs/spares/logistics/SSHE once under the responsible owner. |
| Training/programme | Propose Exhibit A's earlier one-month training-plan submission; retain the annex six-month statement. Course 9 tentative 20 trainees / estimated five days is not 20 trainers or 100 instructor man-days. Keep P6 Level 4 28 days, VDS kickoff/otherwise 14 days after award and manuals two months before installation separate. |
| Warranty/delivery | Customer 24 months after last PAC and INDUSTRONIC 12 months after despatch have different clocks: TSI must cover the gap. Supplier approval-dependent lead times are not an integrated final delivery promise. |
| VSAT/AIS | Free-issued hardware does not remove onshore TSI design/interface/integration/test/commissioning. AIS proposed stream interpretation 38.4 kbps/platform, 76.8 kbps before overhead; retain conflicting literal source. |
| PAGA | N+1 amplifiers do not prove controller/network redundancy. Expose optional items 5010/5020; decide compliant architecture and cost coverage. SIP catalogue up to 24 channels does not establish purchased activation count. `DEV-EPC-PAGA-REDUNDANCY` PENDING. |
| PABX | IPO R12/IP500 alternative is not established as Aura 10.2 HA/interworking compliance. Require version/licence/SIP/endpoint/HA proof and compliant fallback. `DEV-EPC-PABX-ALTERNATIVE` PENDING. |
| Radio/MW/NDB | Reconcile two handhelds/licences using the same counting basis; distinguish CMSS/controller from Dell dispatch server. Propose conservative 40 km MW envelope, retain 12 km/coordinate discrepancy; NDB 75 NM = 138.9 km. No current RF adequacy acceptance. Explicit SSB exception for literal 7885 MHz, no silent conversion/licence approval. |
| CCTV | Exact Ex fixed-camera sheet specifies AC100–240 V; do not assume all cameras PoE. Reuse prior retention/RAID arithmetic with its assumptions; actual bitrate, storage overhead, scene coverage and certificates remain open. |
| Two-year spares | Recommend mandatory MR stock in Base; saved Option treatment remains unchanged pending owner decision and C3/A1/A2 price reconciliation. Pair `DEV-EPC-SPARES-TREATMENT` / `CD-EPC-SPARES-TREATMENT`, PENDING. |
| Studies | TSI owns telecom hazards/interfaces and contributes to multidisciplinary studies; propose EPC leadership of whole-plant HAZID/HAZOP/QRA/SIL. Explicit `CD-EPC-STUDY-BOUNDARY`, PENDING. |
| Delivery terms | Propose customer CIF Yangon Incoterms 2020; identify manufacturer-country FOB qualification and OEM FCA/EXW upstream terms separately. `CD-EPC-INCOTERM` PENDING; saved charges/Incoterm unchanged. |

These are proposed dispositions after TC closure, not newly sent TC requests. Review the private report's clause locators and all system recommendations. Supplier price references remain internal; nothing was issued to the customer.

## Private files in existing DATA

No private payload or prices are committed to Git. Keep all earlier DATA files.

| File | Drive ID / SHA256 |
|---|---|
| Exact unchanged Rev09 | `1Rjh58RGnj2KI7VR_J0_hSTb_PblcH2Mk` / `ff0eb469c2322ad72635905cbbee5e3ddcd3892561083849bb59d5ed8e386bfd` |
| Exact unchanged v3 | `17L1POjMLRwA-k3ySrZbps34_0NKXv1p2` / `dbce6e3cdd4ab48d19bcb3667496017fd9eea84a28e3090a69224208d8c8d233` |
| `PJ2608-0550_A_Work_Package_Rev02_20261101.json` | [Drive](https://drive.google.com/file/d/1kWp9bwASkyvwZmLGi9pMCIY7CeY9-m5p/view), 8,875,540 bytes / `7b333172242084408c2b2c3c8d5bb06a3bd0116dd74b43817a5cd235b3b72281` |
| Review ledger JSON | [Drive](https://drive.google.com/file/d/1LafqQOKhh_zFPBFit6D_wZpG2HXYIl77/view) / `c3ac66878c33e4619e5e967ed1e73964d7e9f355502e673fd2e5b72264387057` |
| Human review HTML | [Report](https://drive.google.com/file/d/1t1eGPDBFhihljLlMpCHolVlV9FCQGtmf/view), `PJ2608-0550_EPC_SI_Review_Rev01_20261101.html` |
| Earlier Oct29 package / review | `12fWJfWHhmznTLTe2893GIE_rxIUuhJiL` / `1Sm38D2fUb1NwFKUL_m_PAvq0yaHAlkYm` |

New package is schema **v4**, batch `PJ2608-0550-SI-EPC-REVIEW-20261101`, embedding exact v3 (and its v2 predecessor), linked to unchanged Rev09. Published raw JSON was downloaded from Drive and SHA256 matched byte-for-byte. Do not change a consumed batch in place. Future continuations need explicit lineage.

## Necessary implementation, no redesign

Existing add-only v3 could not enrich untouched source drafts or bring authored Volume I/III/CD responses into the canonical store. Extend existing paired loader/planner only:

- Validate explicit v3→v4 lineage, same source basis, all predecessor integration IDs retained. Only unstamped draft payloads; no prices/bindings/approvals/N/A/local document metadata or equipment physical details imported.
- Three-way enrichment for unchanged predecessor requirements only. Edits and consumed deletions win, including direct v2→v4. Skip new dependents of deliberately deleted requirements. Reuse unique same-system/site/source/exact-excerpt requirements under custom IDs; reject ambiguous evidence matches.
- Preserve existing technical slots, IDs, content, local document metadata and choices. Immutable same-batch receipts prevent repeat-load resurrection. Record exact consumed v2/v3 ancestors to prevent fallback/downgrade refilling; verify their hashes.
- Same-day DATA selection follows exact embedded predecessor, not filename/revision/upload date. Divergent peers remain a conflict. Existing 16 MiB per-file/32 MiB paired limits and loopback GET-only bridge remain.
- After new code and Drive sync, use existing automatic startup; no row entry/file-import clicks. Old code rejects unsupported v4 safely, retaining the saved workspace. Receive .6 before expecting its new receipt; no Windows .6 receipt is yet observed.

## Checks actually run

- New `validate:pj0550-epc-continuation`: v1/v2/v3 compatibility, v3→v4 unchanged-draft enrichment, edits/deletions/custom slots, direct v2→v4, semantic clause reuse, forbidden prices/approvals, tampered receipts, exact same-day lineage, conflicts and ancestor fallback. Exact private Rev09/v4/reconstruction also passed 1012/20/79/100/3 counts, full protected-input equality, repeat-load identity, OPEN engineering and release HOLD.
- Existing source-workspace-auto, corpus preparation, SI package, bid volumes, technical proposal and commercial-issue regressions passed. Commercial synthetic readiness tests do not confer actual project approval.
- Exact private paired DATA bridge also passed selection of the canonical v4 descendant alongside unchanged Rev09/v3 within existing limits.
- Production webpack passed; existing 3.15 MiB chunk-size warning remains.
- Final published payload passed actual DATA automatic browser: 677 sources, 746 prepared records, 249 reading jobs, three exact receipts, no import clicks, edits/deletions/reload preservation, wrong-basis atomic retention, unchanged finances/history, GET-only reads, no page errors.
- Actual DATA system/COMMON browser passed 20 options, LAN/CCTV/COMMON, read-only search, existing editor/reverse A navigation, 1440/390 containment, reload/exact preservation, no page errors. Later private payload changes only added prior-work narrative; final automatic browser used those exact published bytes.
- HTML layout inspected in Chromium; local runtime lacks Thai glyph fonts, so typography there is not evidence of Windows rendering. Git whitespace and document links checked before publishing.

ADR **1–6, 8–14** affected source/interpretation, prior-work reuse, scope/interfaces, single ownership, canonical records, change impact/frozen history and received versus derived proof. Import protections above are implemented/tested; complete transitive dependencies, General Chat Default/Manual Override, full source/native reading and engineering remain incomplete. No old THB580M or 0553 finance default was introduced.

Continue source/native evidence and supplier adequacy into actual CAL/RPT; establish justified resource quantities with existing E01–E09 and OEM inclusions, then reconcile Working/Budget and all three Volumes. Show combined decisions for review rather than asking for individual row entry. Preserve controlled drafts, user decisions and frozen issues; existing release gates stay in force.
