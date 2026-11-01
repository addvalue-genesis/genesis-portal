# 0550 — Existing-work audit and system constraint continuation

1 November 2026, Asia/Bangkok. Base fad8a7bc3eede9e66aaf541040b4265f3006c215; prior application baseline 8eae7633. UI after this increment: **2026-11-01.5-preview**. Same branch feat/pj2608-0550-official-working-20261028 and port 3050.

## What was actually recovered

Read root AGENTS, the consolidated handoff, ADR-0550-001, SI Equation Rev03 and the operating/corpus/reader/existing-basis/volume checkpoints before changing the app. GitHub's head matched fad8a7bc; the existing checkout was clean at that SHA. Continued that checkout without creating another A, project store or architectural module.

Reused the exact Rev09 intake and v3 package. SHA256 values matched the original handoff:
- Rev09: ff0eb469c2322ad72635905cbbee5e3ddcd3892561083849bb59d5ed8e386bfd
- Work package: dbce6e3cdd4ab48d19bcb3667496017fd9eea84a28e3090a69224208d8c8d233

Drive metadata confirmed the same file identities, names and sizes. No DATA successor/predecessor/schema change, import package, original-source replacement or browser migration was made.

The audit reconstructs repository startup preparation plus the actual paired DATA in an isolated workspace. It **does not inspect the user's Windows browser**, which may contain additional work and deliberate edits/deletions.

- 677 source records; 724 prepared source-clause DRAFTs; 249 reading jobs.
- 990 derived requirement records = 264 MR catalogue + 724 prepared clauses + **2 existing AVL requirements**. The handoff's 988 is the catalogue/corpus basis before including these existing AVL requirements. This is not duplicate A preparation.
- 139 offers; 293 Working records, 279 selected in this reconstruction. These are record/selection counts, not accepted scope or a complete price.
- The reconstructed engineering register has 0 proofs, 0 activities, 0 scope reviews and 0 Particular records. That does not establish absence of reports in the source library or later records in the user's browser.
- Source findings already include 193 OPEN, 187 SOURCE_SUPPORTED and 21 CONFLICT. SOURCE_SUPPORTED is evidence status, not engineering acceptance. Existing analyses/findings are reused.

## Existing records by system

“Text found” means a saved excerpt/locator matches available source text after whitespace normalization. It is **not** authority, native visual acceptance, clause completeness or design approval. Interpretation means the existing required interpretation fields are present, not reviewed engineering. Columns overlap; never sum them into a completion percentage.

| Canonical system | Requirements | Text found | Interpretation fields | Offer + supplier text bound | Derived CAL/RPT | Activities |
|---|---:|---:|---:|---:|---:|---:|
| TEL-LAN | 70 | 53 | 0 | 0 | 0 | 0 |
| TEL-LAN-VCS | 30 | 28 | 0 | 0 | 0 | 0 |
| TEL-VSAT | 25 | 6 | 0 | 0 | 0 | 0 |
| TEL-VSAT-KU | 3 | 1 | 0 | 0 | 0 | 0 |
| TEL-PABX | 27 | 26 | 0 | 0 | 0 | 0 |
| TEL-IPP | 32 | 27 | 1 | 0 | 0 | 0 |
| TEL-PAGA | 76 | 60 | 1 | 0 | 0 | 0 |
| TEL-CCTV | 95 | 75 | 0 | 0 | 0 | 0 |
| TEL-RADIO-DTRS | 53 | 46 | 0 | 0 | 0 | 0 |
| TEL-RADIO-MARINE | 28 | 26 | 0 | 0 | 0 | 0 |
| TEL-RADIO-AERO | 27 | 26 | 0 | 0 | 0 | 0 |
| TEL-RADIO-SSB | 28 | 26 | 0 | 0 | 0 | 0 |
| TEL-NDB | 34 | 23 | 0 | 0 | 0 | 0 |
| TEL-AIS | 5 | 2 | 0 | 0 | 0 | 0 |
| TEL-DMR | 34 | 30 | 0 | 0 | 0 | 0 |
| TEL-FO | 86 | 49 | 0 | 0 | 0 | 0 |
| TEL-TELT | 4 | 2 | 0 | 0 | 0 | 0 |
| TEL-ES | 42 | 33 | 0 | 0 | 0 | 0 |
| TEL-MET | 39 | 29 | 0 | 0 | 0 | 0 |
| COMMON | 252 | 158 | 0 | 0 | 0 | 0 |

The 726 text-bound records comprise 724 prepared clauses plus the two existing AVL requirements. The 264 MR catalogue entries retain their IDs and are not silently presented as individually source-bound/read/accepted clauses. Supplier offers/catalogues/datasheets may already be available even where exact requirement-to-supplier binding is absent.

## Runtime continuation inside existing WP.1

The old system filter showed system-specific requirements without the COMMON requirement context in the SI review workspace. A already had reader/system views; those remain. This change extends **existing WP.1**, not the architecture registry, with a read-only projection:

- Select any of the 19 systems, COMMON or additional canonical scope. Existing all-system scope review and its editor remain.
- Read the system clauses and actually linked customer documents, including family, revision, effective authority, text/read and review state. There is no file-family precedence or revision auto-selection.
- Expand **COMMON context separately**. A shared source or COMMON token does not establish per-system applicability or multiply activity/cost. A Particular enters a system set through explicit requirement links, or its own token when no explicit links exist.
- Distinguish customer text, interpretation, supplier offer/text binding, **received** CAL/RPT, **derived** proofs, activities, driver calculations and existing Working references.
- Search ID/title/statement/locator/interpretation. Source-bound rows appear first; pagination limits DOM rendering without dropping canonical records.
- Open the existing requirement editor or CAL/RPT/activity stage. Existing IDs link back to native A, supplier offer/source, calculations, Working, Budget, 11.M, Volume II, Deviation and 10.7.
- Included children reference one existing parent owner. No financial totals are summed here. Missing links stay visible. A finding for another system is not propagated solely because both use one long PHI document.

This worklist is **not automatic SI design or a new readiness gate**. It creates no requirements/proofs/activities/Working rows, review stamps, conflict resolutions, crew/rates/FX, prices or issues. Existing review and Official/Release gates remain authoritative. Stable 15 architectural module IDs, canonical inputs, edits/deletions and frozen history remain.

## Engineering follow-through from existing evidence

These are next actions against existing records/findings, not approved obligations or duplicate findings. PHI references below are MM-ASK-1A-APF-TEL-PHI-0001 Rev.B1. Combine with the actual MR, LIS interface matrix, DTS/SPE, drawings, contract and applicable STD. Reconcile copies/revisions; no unconditional hierarchy is asserted.

| System(s) | Existing basis | Next engineering work |
|---|---|---|
| LAN | PHI §7.3.1; A-0550-NET-ARITH; A-0550-AIS-UNIT | Rebuild bandwidth/port/PoE/redundancy from controlled application/site inputs; resolve arithmetic and AIS units. Shared switches retain one owner. |
| VCS | §7.3.2; A-0550-VCS-SITES | Reconcile four PHI locations versus two matrix installation locations; verify Teams/email endpoint, license and network evidence. |
| VSAT | §7.3.6; existing ownership finding | Separate Company/free-issue hardware from onshore design/integration/FAT/SAT/commissioning and received link budget. Free issue does not remove execution work. |
| KU VSAT | §7.3.18 | Separate Company-paid subscription from contractor equipment/accessories and APF/ACP integration; no guessed recurring charge. |
| PABX / IP phones | §7.3.3; SI-PABX-PLATFORM; REV-DTS-0002 | Reconcile offered IPO/IP500 with incumbent Aura integration, versions, HA, SIP/license/endpoints and interworking test basis; resolve DTS revision evidence. |
| PAGA | §7.3.4; PAGA-001/PAGA-004; SI-PAGA-SIP-LICENSE/BASE-REDUNDANCY/BOM-DIFFERENCE; A-0550-PAGA-PROOF | Use selected INDUSTRONIC evidence. Separate acoustic speech/alarm/beacon, loop/supervision, power/ESD/autonomy, purchased SIP channels and controller/network/amplifier redundancy. Reconcile quote/workbook quantities. MGW/Bosch catalogue capability is not accepted proof for another selected OEM. |
| CCTV | §7.3.5; existing quoted detail and clauses | Reconcile recording domains and APF/ACP/ABV01/AMS01 interfaces; prove coverage, storage/network/PoE/licenses and Ex/environment suitability from actual retention/bitrate/site/vendor inputs. |
| VHF DMR | §7.3.7; SI-DMR-HANDHELD; A-0550-MW-DIST | Retain MR 98 versus quote 96 handhelds and 26 mobiles/122 subscriber-license reference; reconcile all subscriber types and prove Tier III coverage/RoIP/future interfaces before quantity/licence allocation. |
| Marine radio | §7.3.8 | Reconcile main/backup, APF/ACP station roles, console/RoIP, autonomy, hazardous-area handheld applicability and controlled frequency/licence scope. |
| Aero radio | §7.3.9 | Verify frequency/channel, operational/console/antenna scope against actual offered evidence and authority process. |
| MF/HF SSB | §7.3.10; A-0550-SSB-UNIT | Preserve printed 7885 MHz as unresolved. Obtain controlled frequency evidence before tuning/ordering; verify RoIP/console/antenna/autonomy without silent MHz→kHz correction. |
| Microwave | §7.3.11; A-0550-MW-DIST | Resolve distance/coordinates, licensed 7 GHz, availability/diversity and actual profile/survey/link budget; bind selected equipment and shared tower/network/logistics once. |
| FOC | §7.3.13; MR/matrix/SPE | Resolve supply/duct/installation/termination/testing; prove route/core/loss/spare capacity/redundancy using actual drawings/lengths/SFPs. Preserve MR heading discrepancy; no guessed cable lengths. |
| Tower | §7.3.14; MR §1.3(i) | Reconcile 30 m ACP/60 m APF, actual antenna loads/layout, foundation design/anchor information versus construction ownership. |
| Entertainment | §7.3.12 | Reconcile actual sites, distribution/receivers/endpoints, subscription responsibility and network/signal/power interfaces. |
| MET | §7.3.15 | Reconcile instruments, tower/installation positions, displays/network/power/calibration and actual sensor technical evidence. |
| NDB | §7.3.17; SI-NDB-DISTANCE | Resolve 75 NM versus statute-mile/km language before RF/antenna/site prediction. Nameplate transmitter power is not coverage proof. |
| AIS | §7.3.16; A-0550-AIS-OWNER/AIS-UNIT; A-R06-AIS-MR-SPE-CONFLICT | Resolve free-issue workstation/software, offshore/onshore/APF connectivity and installation/integration/testing ownership. Clarify bandwidth units; retain TSI services until disposition. |
| COMMON | MR App.1.0 and 2–14; source/contract/STD | Reconcile battery limits, document lifecycle, included supplier engineering/FAT/packing, training, spares/tools, permits, logistics and terms. Bind actual events/days/crew/hours/rates/trips once. Rev04 MH/Rev10 THB580M stay historical references. |

### Desk check supporting an existing finding

No new source finding was created. A-0550-MW-DIST already records about 12 km versus about 40 km. PHI §7.3.14 / Table 7-10, physical PDF p63 / printed p58, provides:

- APF: 15°54′13.53″ N, 095°35′50.94″ E → 15.9037583333°, 95.5974833333°.
- ACP: 16°00′18.57″ N, 095°38′19.78″ E → 16.0051583333°, 95.6388277778°.
- Desk method: spherical great-circle distance d = 2R atan2(√a,√(1−a)); a = sin²(Δφ/2) + cos(φ1)cos(φ2)sin²(Δλ/2), radians, assumed R = 6371.0088 km.
- Arithmetic result: **12.1106559266 km**.

This supports investigating the existing discrepancy, not choosing the contractual design distance. Both coordinates were interpreted on one common angular datum for this desk comparison. No datum transformation, survey, terrain/profile or endpoint validation was performed. Review datum provisions and controlled site reports before design. No Working quantity, antenna, crew, duration, rate, FX or price was changed. This note is not a saved/reviewed canonical proof; reconstructed proof count stays 0.

## Principles and actual validation

ADR **1–6 and 8–14** affected the change: usable evidence, separate interpretation, explicit many-to-many links, SI adequacy, one owner, visible gaps, reverse trace, revision-aware review, canonical storage, frozen history and project-wide coverage. This is a runtime projection change, not documentation-only, but introduces no approval enforcement.

Completed before the execution environment disconnected:
- New model/React validator: separate COMMON, explicit Particular applicability, received CAL vs derived proof, supplier availability vs acceptance, source changes, included/shared owner refs, missing/deleted/additional scope, unrelated findings on shared documents, existing module identities and input preservation.
- Exact private Rev09/v3 reconstruction: helper checked all 20 scopes, all requirements covered once in their own system and byte-for-byte unchanged input workspace.
- Existing Working Preview, corpus/v3 continuation, controlled issue/frozen history, lifecycle drivers, SI-package preservation, live dossier, Working schedules and native Exhibit C regressions passed.
- Production webpack passed with its existing large-chunk warning (~3.15 MiB). Diff whitespace checks passed.
- Synthetic browser traversed all 19 systems + COMMON and reached the search/COMMON read-only workspace assertion.
- Actual Rev09 browser confirmed automatic receipt of 677 sources and displayed LAN, CCTV and COMMON worklists.

**Browser regression remains incomplete.** An initial test selected a hidden duplicate selector; it was corrected to the existing WP.4 editor. An initial receipt wait was replaced with the existing visible source-status wait. The environment disconnected during the corrected final runs, so final editor/source navigation, responsive visual inspection, reload preservation and overall browser PASS are not claimed. The tested application source and reproducible validators were preserved through GitHub after the disconnect; no final host rerun/readback was possible.

To finish QA from frontend, run npm run validate:pj0550-system-constraints, production webpack, then npm run validate:pj0550-system-constraints-browser with Playwright/Chromium available. The browser script also accepts the two exact private DATA paths as positional arguments; those files are never committed.

No unrelated full 0553 suite, Windows installation, formal issue, customer submission or main merge was performed.

## Remaining work and launch

Use existing source-backed requirements/findings to finish current applicability/interpretation, exact selected-supplier evidence, derived CAL/RPT with method/units/assumptions/criteria/limitations/reviewer, and activities/resources with single cost owners. Then reconcile Working/Budget/C1–C8/A1/A2, Volumes/Deviation and Release against that current basis. General Chat Default/Manual Override and complete transitive engineering dependency proof remain outstanding.

Windows pull/restart, Drive sync and additional local work remain unverified. From the existing frontend directory, stop the server, run git pull --ff-only origin feat/pj2608-0550-official-working-20261028 and npm start. Check UI 2026-11-01.5-preview; open 10.2 → WP.1 and select a system. No dependency installation or manual JSON import is required for the app change. Release remains HOLD / NOT ISSUED.
