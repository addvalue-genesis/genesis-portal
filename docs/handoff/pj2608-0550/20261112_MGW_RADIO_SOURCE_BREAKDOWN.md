# MGW Radio source breakdown in Vendor Offers

12 Nov 2026. PJ2608-0550 Official Working, based on `ad00a9d6`.

Open MGW in `bid.vendor.offers` and expand Radio System Q26-063 ver1.0.
The original PDF pages 9–12 carry 18 priced rows and two unpriced headings.
The priced rows reconcile to the printed USD 700,501. GTPL relocation and
the Motorola accessory option have their own rows. The original PDF fills
the continuation gaps on RADIO-003, RADIO-010 and RADIO-017. The existing
catalogue rows and inputs to consumed supplier batch fingerprints are preserved.

The source Location column retains the supplier wording. The CUS site column
shows APF for RADIO-001–003 using the existing confirmed MR references.
The CUS comparison for RADIO-004 and RADIO-005 points to ACP. MR-0001 Rev.B1
Appendix 1.1 printed page 10 gives one standalone Radio Console for ACP item 5
and 700 m of Antenna Cable for ACP item 4. APF instead lists two consoles in
its RoIP package and 500 m on each of its cable items. APM locations without a
recorded match remain open. RADIO-016 retains the existing AMS01 note.

ADR-0550-001 principles 2, 3, 5, 6, 10 and 12 apply. The site comparison is
display-only evidence. Existing Offer IDs, receipt inputs, selected costs,
Working allocations and Release gates keep their original model.

Targeted React SSR passed on active and legacy inputs with existing detail
and money code and isolated unrelated controls and services. Checks covered
18 priced rows, two unpriced rows, five ACO site results, the three page
continuations, the quoted total and equality of the prior catalogue fields.
Both changed JSX files compile with Babel. The context command could not
complete in the connector source snapshot because it lacks the full dependency
tree. Full webpack build and Windows runtime were not verified.

## 13 November — find the Jotron fixed VHF-AM offer

In Project Module Search, enter `TR-910` or `Jotron` and select FIXED AM VHF
Radio Telephone. The existing Offer ID opens under 07.2 → MGW → VHF-AM
Aeronautical Radio → Q26-063 Radio / DTRS. The model also appears on the
original Radio System quotation row. It comes from the model line in the
recorded supplier detail on PDF page 11, item 4.

RADIO-012 has quoted quantity 1, no stated unit and a printed extension of
USD 14,680. It is counted once in the USD 700,501 radio source total and maps
to Working A1-09. This change only updates display text and search labels.
The MGW pricing and Vendor Register validators passed. A development webpack
build and DOM interaction check verified search and expansion on repository
seed data. Windows browser storage was not verified.

## 14 November — brand and model on the BOM Specification row

RADIO-012 now shows `Jotron · TR-910` in the `Brand / Model / Part No.`
column of its Specification row in 07.2, the Radio System source breakdown
and the Supplier details dialog. The brand and model come from the parent
quoted item. The included components retain their own part numbers when
stated. The MGW pricing and Vendor Register validators check the display and
the existing quote and Working price basis.

## 14 November — Working Draft unit for RADIO-012

Working A1-09 uses one `SET` for the fixed Jotron TR-910 with the six
components under Comprising. MGW Q26-063 PDF page 11 item 4 keeps its
original quantity 1 and its blank quoted unit (`Not stated` in GENESIS).
The owner and Offer ID retain the USD 14,680 extension. MR Appendix 1.1
APF item 4 and the C1 system row use one `Lot` for the complete system.

The draft unit migration applies to the existing generated owner and newly
prepared workspaces. The source register receipt and quoted evidence keep
their original values, and the supplier-unit review remains open. MGW
pricing and Vendor Register validators passed. The legacy C1 HTML hash
check fails identically on the parent commit and this change. The MGW
validator verifies the C1 system unit and the draft totals directly.

## 14 November — find the GTPL relocation reference

Search `GTPL` or `GRS#2` in Project Module Search, or use the GTPL shortcut
in 07.2 or under DTRS in the system grouping. The shortcut opens the existing
MGW Q26-063 PDF page 10 reference and clears the Volume I tag filter.
The supplier heading is APM. The quoted note describes moving the existing
equipment from GRS#2 to the APF Control Building and the new 60 m tower, with
the GTPL contractor responsible per MGW. PHI-0002 Rev.B1 §1.2 defines GTPL as
Gas To Power Pipeline Development Project. The listed supply boundary remains
open for clarification. This is an unpriced quotation reference with no
Offer or Working owner. The MGW radio source total is USD 700,501.

The MGW pricing and Vendor Register validators and development webpack build
passed. A DOM interaction check verified both search terms and the DTRS
shortcut under an active Volume I filter.
