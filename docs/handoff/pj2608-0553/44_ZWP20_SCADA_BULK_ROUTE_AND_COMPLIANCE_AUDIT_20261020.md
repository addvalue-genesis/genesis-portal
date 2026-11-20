# PJ2608-0553 — ZWP20 SCADA Bulk / Cable Route & Equipment-Interface Audit
Date: 2026-10-20
Target UI: `PJ2608-0553 / bid.budget.bom.zwp20.scada-bulk`
Decision class: **Engineering QA HOLD / NO AUTOMATIC REPRICING**. This is a source-based compliance and physical takeoff review, not an AFC cable route, accepted OEM BOM or actual field measurement.

## 0. Executive finding
**69 m Outdoor CAT6A S/FTP is one preliminary purchasing allowance, not a verified ZWP20 installed cable requirement and not evidence that all SCADA Ethernet interfaces are included.**
The 60 m route allowance × 1.15 loss/handling factor from the frozen cost model equals **69 m**. The E&I rooftop/mezzanine outdoor ODU and indoor E&I Room interface are recognized, but LAY-0001 gives equipment positions—not final cable trays/MCT and termination-to-termination paths. The referenced TEL-LAY-0002 (Cable Routing) and ELE-LAY-0002 (E&I Room panel details) were not available as readable source documents in the accessible Drive set for this review. Do not declare cable sufficiency, oversize cable quantity or approved distance without them or a measured DWG route.

## 1. Documents reviewed (source versus interpretation)
| Source | Revision, status | What it establishes | What it cannot prove |
|---|---|---|---|
| `MM-ZTK-1F-GEN-TEL-BOD-0001` | C2 | SCADA architecture, indoor/outdoor separation, power/link integration, ZWP20 interface intent | Exact cable route, field accessories count |
| `MM-ZTK-1F-GEN-TEL-MR-0001` | C1 | ZWP20 MTO 1 Lot Bulk = cable glands, coax, grounding kits etc. | 1 Lot ≠ 1 Ethernet cable; no cable length |
| `MM-ZTK-1F-GEN-TEL-DTS-0001` | C1 | CAT6A/Ex, equipment and M20 enclosure / surge requirements | OEM final certified connector / gland selection |
| `MM-ZTK-1F-GEN-TEL-SPE-0001` | C2, especially 6.1.3, 6.5/6.6 | ODU/IDU locations, outdoor Ethernet Ex surge, vendor completeness, cable fire performance, 80 m port-to-port, MCT/tray requirements | No field routing length |
| `MM-ZTK-1F-ZWPX-TEL-BLD-0001` | C1 sheet 3/7 | ZWP20 system block functions, Notes 3/5/7/8; multiple switch/PLC/DATO interconnections | Block lines are not measured copper cables |
| `MM-ZTK-1F-ZWPX-TEL-LAY-0001` | C1 (AFC) sheets 4–5 | ZWP20 ODU and antenna at Mezzanine / E&I room rooftop; E&I Room details referenced to ELE-LAY-0002 | Detailed E&I endpoints/tray route/MCT geometry |
| `MM-ZTK-1F-GEN-SCADA-TEL-DWG-0001_All` | working schematic | Diagrammatic Roof Top/Deck/E&I system interfaces | Not verified cable-route measurement |
| Attached `Technicable.pdf` | Tecnikabel TKSEA 23AWG FLEX LSZH 2019 Rev0, pp.1–5 | OD, armor, bend, flame-retardant datasheet entries | Not proof of IEC 60331 fire-resistance or correct exact SKU against the 2024 INNOVA quote |
| Current React `zwp20SiteCost0553.js` and `zwp20BulkScopeAudit0553.js` | Rev02-protected active working source | 69 m CAT6A, 1 M20 gland, historical rate + 16-function gap register | No accepted active gland count or final route length |

Original access-verified Drive pages:
- BOD C2: https://drive.google.com/file/d/16Jt1iSpmo86CWakv5Zis0TI1A5wgZAqA/view
- MR0001 C1: https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view
- DTS0001 C1: https://drive.google.com/file/d/1hOjBgaJ07PXF6rkep2dzkMXv-pnkQzix/view
- SPE0001 C2: https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view
- BLD0001 C1: https://drive.google.com/file/d/1ilsnWSfMlFZh8nD29rra4YRWizadovl-/view
- LAY0001 C1 (user shared): https://drive.google.com/file/d/1PStua_5EmygpXpT2wMB3Jlj-Sq7syETA/view
- Working DWG PDF: https://drive.google.com/file/d/1NbEsYWcQdvkIvCNx_lAjddehfrtwZSDu/view

## 2. Correct physical installation / cable route logic
- ZWP20 LAY-0001 sheet 4 names outdoor `MR-502-001` (radio ODU) and `ANT-502-001` on Mezzanine/roof of E&I Room. LAY sheet 5 explicitly directs reader to `MM-ZTK-1F-ZWPX-ELE-LAY-0002 C1` for E&I telecom details.
- Current frozen budget's preliminary mezzanine elevation +21.100/+21.300 versus lower deck +18.300 m implies 2.8–3.0 m elevation difference **only**; this is NOT cable path length. 0.5–1.0 m ODU/antenna plan separation in the older budget is also a scale-based proxy, not a verified connector-to-connector takeoff.
- SPE §6.1.3: outdoor ODU close to antenna, powered by PoE; indoor IDU enclosed in certified SS316L Ex e (or as required Ex d), local E&I Room, separately fed by Electrical.
- SPE §6.6.5: Telecom tray/ladders, Company approval to use Instrument trays; mandatory correctly sized MCT when passing between E&I Room and outside; 30 cm separation from other tray services; coax cannot share with other cable types.
- BOD wording about Instrument cable trays appears less restrictive than SPE §6.6.5; resolve route owner and documentation hierarchy with JUTAL/COMPANY. Do not assume an Instrument tray is automatically acceptable.
- End-to-end route: outdoor ODU Ethernet port → outdoor Ex-rated termination/entry as specified → protected tray/walkway/conduit and vertical/drop segments → properly certified E&I wall MCT penetration → indoor Ex e enclosure cable entry → surge/PoE/IDU and L3 ports as designed. Exact order of surge and power elements requires approved WIR/TER.

### Mandatory route-register (physical cables, NOT just network logical links)
| Cable / function | From → To | Separate circuit? | Current booking owner | Evidence gap |
|---|---|---|---|---|
| SCADA-ETH-01 | ZWP20 roof `MR-502-001` ODU PoE/RJ45 → indoor Ex enclosure (surge/PoE terminal) | Yes, one provisional external drop | MR0001 Bulk Row11, included 69 m scenario | Cable route & MCT, ODU connector, real indoor termination |
| SCADA-LAN-02 | L3 switch → existing router uplink | Yes unless already included as factory patch | A1 LAN / enclosure internal/Row11 only if separately purchased | BLD Note5; locate router and patch length |
| SCADA-PCS-03 | L3 switch → PCS/TCP-IP converter / local PLC data | Determine actual physical cable and free-issued scope | PCS vendor / A1 / Row11 by certified owner | BLD Notes2–3; network topology & cable location |
| SCADA-DATO-04 | L3 switch → relocated existing LAN outlet / DATO well-service interface | Existing outlet relocated, physical patch cabling scope to prove | DATO Row8 plus possibly distinct Row11 field patch | BLD Note7; outlet relocation route and previously supplied parts |
| SCADA-IDU-05 | indoor PoE/IDU → L3 network switch; possible surge or patch links | Confirm number of distinct physical patch leads | TCAB Row9 factory included vs Row11 | WIR / OEM BOM; avoid counting port-to-port logical edges as field bulk |
| SCADA-DC-06 | 24 VDC distribution/isolating feeder → Ex enclosure / power injector | Different cable type, not CAT6A | Electrical/TCAB/Row11 contingent on responsibilities | SLD and termination / breaker / MCT/entry |
| SCADA-EARTH-07 | ODU, antenna, surge and Ex enclosure → bonding / PE | Separate earth conductor/kit | OEM inclusions / Row11 / C1 install | Grounding locations, cross-sectional area and earthing details |
| SCADA-RF-08 | ODU RF → antenna (filter/jumper / possibly RF surge) | RF cable, NOT CAT6A | ODU Row4/ANT Row6 and package B-5 first | RF port count/length, Ex, coax connectors and 5 m trigger |
| MR0003 phone/sounder | Phone/IP/gateway / sounder | Separate MR0003 package | MR0003 / C1, not another MR0001 CAT6A run by default | Independent WIR/TER, Ex classification and supplier inclusion |

Do not multiply the initial 69 m by 4–8 functions without distinct cable-end evidence.

## 3. Ethernet physical and purchasing lengths
For each verified Ethernet cable ID:
`L_installed = sum(actual route segments) + bends/entry/termination tails measured along physical path`.
`L_buy = ceil(L_installed × (1 + approved purchasing/waste factor))`.
`L_link_ports = end-to-end designed Ethernet port-to-port length inclusive of patch cord segments`.
SPE §6.6.2 requires `L_link_ports ≤80 m`; the procurement factor is **not** part of installed link length.
Current booking is `L_assumed = 60 m`, `L_buy = ceil(60 × 1.15)=69 m` for one unmeasured external drop. No AFC measured takeoff has yet been found.

| Illustrative measured installed route (one cable, NOT validated) | Proposed buy at +15% | Delta buy vs booked 69 m | More historical cable cost at THB524/m | Ethernet technical gate |
|---:|---:|---:|---:|---|
| 20 m | 23 m | -46 m | -24,104 THB (do not deduct automatically) | Verify end-to-end cords, Ex entry |
| 40 m | 46 m | -23 m | -12,052 THB (do not deduct automatically) | Verify end-to-end cords, Ex entry |
| 60 m | 69 m | 0 | 0 | No measurement; 60m remains a planning assumption |
| 65 m | 75 m | +6 m | +3,144 THB | 80m port-to-port constraint |
| 75 m | 87 m | +18 m | +9,432 THB | Patch cords and 80m limit need checking |
| 80 m | 92 m | +23 m | +12,052 THB | 80m installed end-to-end ceiling: patch tails must fit within it |

If any verified Ethernet port-to-port distance exceeds 80 m, **do not** simply buy a longer CAT6A run: rework cable route/telecom equipment topology, approved intermediate Ethernet device, fibre interface or engineering deviation as appropriate. No automatic unapproved switch/repeater substitution.

## 4. Attached Tecnikabel cable technical qualification
Datasheet: Tecnikabel TKSEA ARMOURED LAN S/FTP 23AWG FLEX LSZH, Rev0 23 July 2019.
- Page 1: stranded bare copper 23AWG/7, nominal 0.28 mm² per conductor.
- Page 2: individually shielded pairs; tinned copper screen braid coverage ≥65%; inner SHF1 nominal OD **8.6 mm**; armor GSWB or TCWB ≥90%; outer SHF1 UV-resistant.
- Page 3: source SKUs `8TKSEALAN9GD` GSWB and `8TKSEALAN9GE` TCWB; **outer diameter 12 mm**; weight 195/190 kg/km; minimum static bending radius **120 mm**, dynamic **240 mm** (10×/20× outer OD).
- Page 4: Cat6A transmission characteristics (IEC 61156-6), screened 100 Ω network cable.
- Page 5: lists **IEC 60332-1-2 / IEC 60332-3-22** flame retardancy, IEC 60754 and IEC 61034 emission; **does not list an IEC 60331 fire resistance test**.
- SPE §6.6.2 specifically calls for IEC 60331 fire-resistant cable at 750°C/90 min according to IEC 61892-4 §4.14, **in addition to** IEC 60332 flame retardancy. **HOLD technical acceptance until certified evidence or formal authorized deviation**.
- DTS-0001 sheet 6 identifies **solid AWG23** conductor in its cable specification, while submitted Tecnikabel lists **AWG23/7 stranded**. Check exact clause and obtain engineering equivalence/deviation approval; do not silently substitute.
- Historical INNOVA `QA24-0604` quotes only generic “TECKNIKABEL CAT6A S/FTP cable” at THB524/m, without unambiguous full `8TKSEALAN9GD/GE` SKU in the controlled source. Price-to-datasheet model identity and GSWB-vs-TCWB armor choice are NOT established.
- An M20 cable gland cannot be selected from the M20 thread alone. With 12mm outer OD, retail size candidates may geometrically overlap 12mm, but Ex e/de certificate, braided armor capture, both seals (8.6mm inner/12mm outer), gland range, gland torque, IP66 and deluge are all unresolved. Never auto-approve a Hawke retail SKU.
- PoE voltage drop and worst-case power/injector capability across actual installed link require actual OEM Ethernet and cable conductor/current specifications, not only cable category.

## 5. Functional completeness / purchasing owner matrix (current ZWP20)
Existing `ZWP20_BULK_SCOPE_AUDIT_0553` records **16 functional groups**, but only two are priced in Row11:
1. `ODU_CAT6A`: 69m × THB524 = **THB36,156** (one historical budget allowance only).
2. `PANEL_M20`: 1 × THB1,020 = **THB1,020** (one provisional indoor gland only).
**Total protected Row11 working amount = THB37,176**. This is *not* the complete ZWP20 SCADA Bulk cost.

Remaining identified functional groups: outdoor 3/4-inch NPT ODU cable entry/adaptor and approved radio mating RJ45 termination; indoor RJ45 module/patch leads with DATO ownership checks; ODU RF jumper and mating connectors (Next G B-5 package first); antenna/ODU mount and SS316 fasteners; separately confirmed RF surge and grounding kits; earth bonding cable and lugs; field support/cleats/ties; factory included panel plugs/locknuts/drain versus installed active M20 glands; external 24VDC feeder/fuse/MCB; identification labels and ferrules; field cable certification/service (not physical Row11 procurement); and start-up spare consumables under the appropriate B/C cost owner. Cable routing MCT and fire barrier restoration were also found by cross-document review and require explicit allocation/verification even if not yet a separate original 16-function line.

No new owner posting / price / automatic margin changes are authorized in this audit. Source REV02/REV03 unchanged.

## 6. Quality gates and responsibility to clear
| Gate | Required verifiable evidence | Release condition |
|---|---|---|
| ROUTE-01 | TEL-LAY-0002 actual SCADA route segments, E&I ELE-LAY-0002 SCADA panel/IDU position, MCT ID; or approved measured DWG overlay/site survey | Installed route measured from real ODU Ethernet connector to actual indoor port |
| ROUTE-02 | WIR/TER/Ports/Equipment TAG Cable Register | Every independent cable/run counted once; vendor-included patch cords deducted |
| ROUTE-03 | Route length + 80m Ethernet limit, cable diameter/tray separation/MCT | Each installed copper Ethernet link ≤80m, future procurement waste separate |
| FIRE-01 | Exact Tecnikabel quoted SKU, independent IEC60331/IEC61892 certificates (or formal accepted deviation) | 2019 PDF alone insufficient |
| CABLE-01 | Armored selected 8TKSEALAN9GD vs 9GE, solid-vs-stranded DTS decision, PoE datasheet and electrical test | OEM/interface compatibility confirmed |
| GLAND-01 | Each cable end: actual OD (inner+outer), armor type, location, M20/3/4 NPT and Ex protection certificate | Active/factory-included/net-purchase gland count confirmed per entry |
| ENCLOSURE-01 | BARTEC selected GA, 16 drilled holes / SPE 20% spares / DTS minimum18, E&I heat/load layout | Formal 16/18 deviation resolved, separate factory versus field cost |
| SURGE-01 | Ex-certified Ethernet surge installation location, indoor/outdoor protection and earthing | No double count of SA TAG Row10 and any package-included surge |
| POWER-01 | DC supply SLD/power breaker, PoE 65W PSU/worst load and wire/earth | Electrical owner split and load verified |
| OWNER-01 | Vendor scope inclusion matrix + A1/A5 vs B3/C1 boundary and cable installation service | One owner per physical SKU/cable/service; no historical cost reuse as new purchase |

## 7. Conclusions and design decisions
- **69m: NOT VERIFIED SUFFICIENT**; do not automatically increase, reduce, accept or multiply it. It may be plenty for a short E&I rooftop penetration, but could still be incomplete for the multiple network/PCS/DATO/IDU ports required by BLD.
- **Cable quoted at THB524/m: technically unqualified** against SPE IEC60331 and DTS AWG23-solid proof; maintain budgeting source without releasing procurement.
- **Current ZWP20 SCADA Bulk THB37,176 = partial budgetary floor**, not complete SCADA BOM.
- **Primary next document**: `MM-ZTK-1F-ZWPX-TEL-LAY-0002` Cable Routing Plan + `MM-ZTK-1F-ZWPX-ELE-LAY-0002` E&I Room Equipment Layout and approved Cable/WIR/TER. Both were referenced but not available as independently inspected source in this audit.
- After physical takeoff, issue a **separate versioned authorized Cost Change Request** before modifying frozen Rev02/Rev03 quantity or customer Working Sell. Technical material compliance and procurement release stay on HOLD.
