# PJ2608-0553 B10 ODU/IDU/Cisco source-validated package composition (25 Oct 2026)

## Authority crosscheck — do not confuse installed scope and commissioning spares
1. Uploaded original `4-Scope of Supply.xlsx`, worksheet `B10 CommSpares`: heading "Erection, Precommissioning, Commissioning, Start Up Spare Parts Lists"; 13 **blank** item rows 6–18; buyer columns Item/Tag/Description/Detail Spec/Materials/Qty/DDP Unit Price/DDP Total. Row 19 total originally "Not quote"; row 20 asks for installation/commissioning/spares/tools costs with detailed breakdown. **There are no approved spare OEM quantities/rates in this native Annex.**
2. `MM-ZTK-1F-GEN-TEL-MR-0001..0004 Rev.C1` §5: one commissioning/start-up spare **kit/set per applicable new platform**; current 4/3/4/3 platform-driven scope. Attachment 5 requires part name, part number, prices and availability. Attachment 2 provides installed system BOM/TAG, not automatically B10 spare Qty. Attachment 7 two-year operating spares must exclude actual B10 start-up spare list items.
3. `MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2` §8.1: start-up/commission spares to supplied per PO; itemized SPIR in Company's format; references **MMC23-5025 EXA-A8** but the available attachment is named **MMC25-5001 EXA-A8**, so revision/precedence requires owner verification.
4. `MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2` §11.1: itemized spare part numbers and weights; two-year/capital alternatives quoted separately. SCADA architecture explicitly describes outdoor ODU, indoor radio unit and industrial Layer 3 switch. BOD installation requirement is not an extra physical spare procurement mandate.
5. `EXA-A8 Att-1 Minimum List of Spare Parts` is cross-disciplinary (PLC-based SCADA, power panels and navigation aids included), not an automatically approved part number/quantity list for telecom WiMAX ODU/IDU. Do NOT blindly apply generic 10% minimum PLC module rules to radio ODUs or Cisco.
6. No current verifiable MM-ZTK-1F telecom DTS for all four specific systems was located in this review; pending its exact document/revision, do not infer additional quantified spare modules.

## What installed equipment consists of (NOT B10 purchasing quantities)
- MR0001 SCADA: NextG NG/260916 A-1 WiMAX Base ODU `3K-SC-HAZ-RF4958-GPS-01` qty2 quoted USD3712.46; B-1/C-1 Connect-OW remote ODU `CONN-OW-HAZ-4958ER-01` quoted qty3/4 USD3456.50. Actual IDU OEM part number *not established*; BOD/SPE require independent IDU Ex housing/indoor function; NextG PoE PSU is not automatically a complete IDU. Cisco IE3400 L3 switch `IE-3400-8P2S-E` source VST quote qty5 at THB242460, PSU `PWR-IE65W-PC-DC` qty5 THB13930; quote Qty5 includes one ZWP8 and is NOT five spare switches. NextG D/E optional extra ODU/RF filters/DC PoE/cords have SKU/quoted price and offered qty, but no approved B10 delivery Qty.
- MR0002 DMR: selected RFI `BD4345-00N0-AC` + WAROM Ex `HRMD95-VIIIB` installed MGW UHF-1 3-site bundled sets USD31474 each; PolyPhaser `IS-B50LN-C2` in installed antenna RF package at no separate spare rate.
- MR0003 Ex phone: EXION 4 quoted installed `212-02-6008-510` THB145000 each and 4 `DB3BDG048N2BNR` sounders THB62000 each. Different supplier suffix/compliance and exact *spare* assemblies unverified. Ex JB GA1004 8-M20 not supported by the old 4-M20 quote at identical rate.
- MR0004 RACON: MDS one-system installed SeaBeacon-2 System 6 Ex `024439` USD75000 FCA, used as provisional budget 3 sites, not a commissioning replacement system spare quote.
- Four 14-kit current first-principles financial envelopes total B10 Working SELL THB509827.50 / 10.3.4 Official USD16200. Amounts remain unchanged and **do not** claim to cover all physical spare unit purchases.

## Code
New read-only model: `frontend/src/project0553/data/b10PhysicalComposition0553.js`.
New UI: `frontend/src/project0553/B10CompositionBreakdown0553.jsx`.
Reused existing source-owned `B10KitPriceSummary0553.jsx` to display system decomposition in Budgetary, Scope 10.5, Release 10.3.3 and Official 10.3.4 under parent four MR financial lines. Expanded by default for MR0001; all other MR sections collapsible.
New CSS is scoped and scrollable within the table, not document-wide, for 8 columns. Source model joins four exact parent `B10-PTTEP-01..04` IDs, and the UI's parent `↗ 10.2 Working Source` retains exact `sourceRowModuleId`. Quoted Part A cost visible only Internal, not in customer Official. B10 spare Qty/unit SELL remains `Not established` unless actual OEM SPIR approves. Source quantities in quotation are reference figures *only*.
Added targeted B10 source/release/official regression assertions to `frontend/scripts/validate-0553-b10-release-sku-preview.cjs`. Existing `npm run build` includes it already.
Supplier quote validity expired; cannot issue final B10 without OEM SPIR and exact approved count.

## Excel companion artifact
An INTERNAL, NONPOSTING derivative of user's original file (original six sheets unchanged, additional `B10 Composition REVIEW` worksheet with 35 evidence rows) was generated in this conversation:
`PJ2608-0553_B10_Composition_Spir_Review_INTERNAL_Rev01.xlsx`.
The canonical current native 6-sheet customer Export is not altered; it still emits 4 MR kits. Native itemized continuation/export must be implemented only when selected actual B10 physical SKU/Qty/price is evidenced or expressly approved as budgetary entries. Do not truncate >13 rows or relabel Part A installed quotes as B10 supplier pricing.

## Open approvals
- Authoritative document EXA-A8 revision mismatch and exact DTS for all four system functions.
- Make/model interchangeability from OEM for commissioning stock, Ex compliance and lead time.
- Approved physical quantities for 4/3/4/3 *kits* versus individual Part No. spares.
- Unique A1–A4/B10/C1/C2 physical stock owner, plus excluded vendor included parts.
- Native workbook continuation for more than 13 verified spare items; Issued Release gate remains HOLD.
- Node/browser/full webpack validation not run from connected GitHub in this session.
