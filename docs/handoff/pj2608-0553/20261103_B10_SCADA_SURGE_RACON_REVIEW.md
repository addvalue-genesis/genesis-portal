# B10 SCADA surge-only and RACON quotation review (R78)

Owner instruction: replace the RF-filter wording in selected B10 item1.04 with surge protection only; inspect QTORG2609244 for RACON spare preparation.

## Selected scope

- Keep source key `B10-PTTEP-01-F04`, its original parent, TAG references and existing budget allocation. Description: **RF surge-protection spare assembly**. Specification/materials describe an RF surge arrester, compatible connectors and earthing, with installed frequency/impedance/Ex matching required.
- Shared B10 schedule feeds Working/Scope/Release/Official and original native Excel. No new financial owner or OEM rate.
- Original NextG D-2/E-2 RF-filter lines remain unmodified supplier evidence, explicitly excluded from B10. They are not quotations for a surge device. The old RF-filter-based what-if retains its historical arithmetic but is prominently superseded and collapsed; it is not a current estimate for the revised scope.
- This selected-row instruction does not delete installed Part A or selected C1 radio-kit filters from their existing quoted package composition.
- No financial changes: B10 USD16,200; A+B USD897,800; C1 USD181,100; C2 USD13,900; B13 USD1,500; B11 N/A.

## RACON primary evidence

Read and visually checked the attached QTORG2609244 dated22Sep2026, physical PDF pages4 and8. Page4 lists SeaBeacon-2 System6 Ex, Ex control box, DB-5P with converter/bracket, purge kit, USB-to-flying-lead programming cable, tag/nameplates and standard documentation. Laptop is excluded. Page7 section3.6 says no special tools required.

Page4 lists two5m and one10m BFOU12C×1.5mm² runs plus six CMP glands as included; page8 excludes cables/glands. Page5/7 also conflict on FAT. These are unresolved supplier contradictions. Preserve the prior owner02Nov planning decision: ADDVALUE supplies field cable/glands in MR0004 PartA bulk and integrated FAT through B3, with zero supplier credit; existing cable/gland purchase rates remain unknown. Quoted lengths and source Qty1 are not a measured three-platform takeoff.

## What to prepare before a priced RACON commissioning spare list

| Current B10 function | Evidence to obtain from MDS/ORGA | Selection status |
| --- | --- | --- |
| 4.01 protective fuses | Service BOM, field-replaceable location, rating/type/OEM part no., recommended commissioning quantity, independent unit price | Conditional candidate, not proven by package quotation |
| 4.02 control-box gasket | Exact enclosure, opening/service procedure, whether replacement is mandatory, certified part no., quantity and price | Do not presume every Ex enclosure needs a separately replaced gasket |
| 4.03 Ex gland/entry seal | Installed cable OD/armour, thread, certified gland/seal part, actual extra replacement quantity and unit price | Separate spare stock from installed PartA ends; no automatic inclusion or credit |
| Cable termination/rework material | Approved ICD/cable schedule, terminals/ferrules/lugs and OEM-approved cable lengths if needed | Review only; no invented length/rate/new line |

The quotation does not itemize/prices these commissioning spares or demonstrate an external RF-coax feeder requirement. Do not add a complete RACON, DB-5P, purge kit or programming cable to B10 merely because it appears in the installed package. Request priced commissioning SPIR and reconcile against installed PartA and optional C2; retain the three existing B10 functional budgets until actual necessity/SKU/quantity/rate is evidenced. No automatic budget saving is justified by this document alone.

## Verification

Existing B10 native-annex regression checks the exact surge-only row in customer HTML and generated native XLSX, source identity and unchanged14 allocations. Supplier evidence regression checks the two explicit B10 filter exclusions. Scenario regression checks historical/superseded status while preserving historical arithmetic. Existing owner-supply regression checks the RACON cable/gland/FAT ownership and unknown costs. No merge or customer issue.

Validation completed: ten targeted checks passed (B10 native annex, itemized evidence, historical scenario, owner scope, change registry, Official USD/native, Working native, ten-sheet breakdown, release-SKU preview and lifecycle roundtrip). `npm run build:0553` passed with three existing webpack size warnings. No browser UI inspection. The previously documented Rev03 baseline guard limitation is unchanged; full legacy build chain is not claimed to pass.
