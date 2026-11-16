# Project PJ2608-0550 Quotation Presentation & Sanitization Standards

This rule file governs all customer-facing quotation displays, interactive views, and export artifacts for project **PJ2608-0550**, specifically **`bid.quotation.C1` (Schedule C1)** and **`11.P` (Volume I Preview & Export)**. All future modifications to Volume I must strictly comply with these rules.

---

## 1. Zero Internal Notes Policy (Customer-Facing Views)
Customer-facing quotation views (`bid.quotation.C1` and `11.P`) are official commercial tender submissions intended for the Purchaser (Company). Under no circumstances shall internal system integrator (SI) notes or procurement trace data appear in these views.

* **Forbidden Elements in Customer Views:**
  * Raw internal working notes (e.g., `"MGW draft price · scope review pending"`, `"reconcile quantities before release"`).
  * Internal supplier quote comparisons, offer IDs (`OFFER-...`), or vendor references (e.g., `MgwCurrentQuote0550`, `PagaQuoteScope0550`).
  * Internal action buttons, trace navigation buttons (e.g., `"เปิด Working"`, `"VND · ..."`), or audit status tags.
  * Raw purchase costs, supplier discounts, or internal markup formulas.
* **Permitted Content:**
  * Official contract terms, clean equipment specifications, site locations (`APF`, `ACP`, `ABV01`, `AMS01`), and final customer selling prices.

---

## 2. Formal Oil & Gas EPC Nomenclature (100% English)
All main system rows and detailed descriptions must use formal Oil & Gas EPC scope definitions in 100% professional English, aligned with the Material Requisition (MR):

* **System Scope Definitions:**
  * **Appendix 1.1:** VHF DMR Radio Base Station & Subsystems / VHF-FM Marine Radio / MF/HF SSB Radio / VHF-AM Aeronautical Radio / RoIP Dispatch Consoles.
  * **Appendix 1.2:** Satellite Communication Terminal (VSAT) Subsystem / Ku-Band Broadband Services.
  * **Appendix 1.3:** LAN Infrastructure & Industrial Switches / Industrial CCTV Surveillance System / IP Telephony & PABX / Meteorological Station (MET).
  * **Appendix 1.4:** Public Address and General Alarm (PAGA) System / Explosion-Proof Sounders & Beacons.
  * **Appendix 1.5:** Digital Microwave Radio Link (2+0 Full Outdoor).
  * **Appendix 1.6:** Communal Entertainment & Television Distribution System.
  * **Appendix 1.7:** Non-Directional Beacon (NDB) Transmitter Subsystem.
  * **Appendix 1.8:** Fiber Optic Distribution System (FODP) & Telecom Cables.

---

## 3. Expandable BOM Sub-table Structure & Golden Prototype Standard
When expanding (`+` / `-`) any system line item in `bid.quotation.C1`, `11.P`, or `bid.technical`, the system must render a formal, bordered Bill of Materials (BOM) sub-table using the **Golden Prototype Standard** column order:

$$\text{Item} \quad|\quad \text{MR Description} \quad|\quad \text{Tag No.} \quad|\quad \text{Offered Equipment} \quad|\quad \text{Brand} \quad|\quad \text{Model} \quad|\quad \text{Part No.} \quad|\quad \text{Qty} \quad|\quad \text{Unit} \quad|\quad \text{Remarks}$$

* **Strict Separation of `MR Description` vs `Offered Equipment`:**
  * **`MR Description`:** Strictly preserves exact Customer MR Appendix 1 wording (e.g., `Radio System Cabinet`, `VHF Dipole DMR Antenna Tx`, `VHF DMR Repeater`) without overwriting it with vendor model names.
  * **`Tag No.`:** Displays verified Customer Equipment Tag Numbers from Appendix 2 / tag evidence (`APF-CAB-0004`, `APF-VHF-ANT-0001`, `RAD-308-001`, `RAD-308`, etc.), or `"Per Appendix 2 Drawing"` where unnumbered in Appendix 2. Never invent fake tag numbers.
  * **`Offered Equipment` + `Brand / Model / Part No.`:** Displays actual supplier-offered equipment descriptions and manufacturer specs from `7 VND` (MGW) or verified `10.2 SI` / secondary vendor records.
* **Location-First Grouping:** System groups must follow Customer MR site-first structure (e.g., `ABV01` groups Item `1.0` `VHF DMR Radio System` and Item `2.0` `Antenna Cable` `150 m` together under `VHF DMR Radio System / ABV01`, with clean section subtotal recalculation and unchanged Appendix Grand Total).
* **Site-Level Allocation:** Each sub-table must accurately represent the equipment assigned to that specific Location (`APF`, `ACP`, `ABV01`, `AMS01`).
* **Zero Generic Placeholders Rule:** Fallback strings such as `OEM Standard`, `Standard EPC Model`, and `Per Specification` are strictly forbidden. All items must carry real vendor Brand, Model, and Part No. derived from the Master Equipment / Vendor Offer catalog (e.g. TUTENG Cabinet `G26642`, Rittal `VX IT 42U`, H3C/Motorola Switch `LS-5135S-24T4S-EI`, Motorola `M8668i`, SmartPTT `RG-2000`, Amphenol Procom `TQJ-150I` / `WL-150-4S`, Dell `OptiPlex Workstation / CON-308-001`, Sailor `SAILOR 6210 / 6320`, Jotron `TR-910 / TRON TR30 AIR`, Hikvision `DS-2DY7436IXG-CXLWF316L`, Avaya `J179 / J159`, etc.).
* **Purge Internal SI Budget Rows & `REVIEW_FLAG` Isolation:** Internal SI budget allowances (such as `ACP E&I Cabin...`) and internal engineering `reviewFlags` metadata (stored in `10.2 SI` / data layer for Phase-2 verification such as Combiner/Multicoupler, Ex-certification, Capacity Max licenses, and RF Link Budget checks) must **never** appear in customer-facing `C1`, `11.P`, `bid.technical`, or Word exports.
* **Remarks Column:** Displays formal EPC technical notes (e.g., `"Included in Base Scope of Supply"`, `"Included in Lot"`, `"ATEX Zone 1 Certified"`). Replace any remaining `SI budget estimate` text with `"Included in Lot"`.

---

## 4. SI Module Selling Price Integration & Dual Pricing Mode
All customer-facing figures must bind strictly to the pre-calculated final customer selling prices derived from the **SI Module**:

* **Markup Hierarchy:**
  * Standard MGW Systems: Supplier Net Cost $+ 5\%$ SI Handling $+ 5\%$ Prime Contractor Markup $+ 20\%$ Partner Margin.
  * Direct-Scope Systems (DMR Ceragon, PAGA Industronic, Telecom Tower): Pre-calculated governed contract rates.
  * Raw supplier purchase rates and markup arithmetic are strictly hidden.
* **Dual Pricing Mode Toggle:**
  * **`Lump Sum Lot Mode` (Default):** Main system row displays the single contract Lot price (`Lot`, `1`, `Total Price`). The BOM sub-table displays equipment specifications with Remarks (`"Included in Base Scope of Supply"`).
  * **`Itemized Pricing Mode`:** The BOM sub-table dynamically adds `Unit Rate` and `Total Price` columns, culminating in an exact `Subtotal` verification row that matches the parent Lot total with zero discrepancy.

---

## 5. Authoritative Native RFQ & Appendix 2 Source Root
* **Local Google Drive RFQ Source Root:**
  `H:\.shortcut-targets-by-id\1lG8jqDcz4fIU425V4xqiWPc2HdxrndAt\PJ2608-0550 SAM PTTEPI MY ASK TEL\00_NATIVE_ORIGINAL\SHAREPOINT\RFQ`
* **Mandatory Cross-Reference Rule (All 19 Systems + COMMON, `APPENDIX 1.1`–`1.9` + `COMMON`):**
  Every system audit and BOM reconciliation must cross-reference the native `MR`, `PHI`, `DTS`, `SPE`, `LIS`, and **Appendix 2 Drawings** (`MM-ASK-1A-[APF|ACP|ABV01|AMS01]-TEL-[LAY|BLK|SLD|STD]-*` and Client Comment sheets) from this root (indexed offline into `frontend/src/project0550/data/appendix2MasterEvidence0550.json` via `frontend/scripts/ingest-pj0550-rfq-appendix2.cjs`).

---

## 6. 3-Group Holistic Verification & Synthesis Equation Engine (`SI-SYNTH-EQ`)
* **Engine & Scorecard:** Implemented in `frontend/src/project0550/data/siVerificationEquations0550.js` (`SI_SYNTH_EQUATIONS_0550`, `SI_LEARNED_RULES_0550`, `evaluateSiSynthEquations0550`) and mounted across the existing `SI` tabs:
  * **`EQ-DISP` (`D_Proto` Golden Prototype Display Equation):** `D_Proto(r) = LocFirst(r) ⊗ Parent(r) ⊗ BOM_10(r) ⊗ Mode(LUMP_SUM | ITEMIZED) ⊗ Sanitize(r)` — enforces site-first MR grouping, formal O&G scope subtitles, 10-column BOM sub-tables (`Item | MR Description | Tag No. | Offered Equipment | Brand | Model | Part No. | Qty | Unit | Remarks`) keyed by `mrDescription + partNo`, `LIS-0001` tags, real `7 VND`/`VERSED` specs, exact Itemized roll-up (`|P_parent - Σ P_sub| <= 0.01`), and zero internal/Thai leaks.
  * **`SI-CAL` (`02 First Principles`, `EquationWorkbench.jsx`):** Displays formal mathematical definitions for **`EQ-UI`** (Customer-Facing Sanitization & 10-Col BOM Completeness), **`EQ-CUS`** ($\Psi_{\text{Synth}}$ Holistic Context Synthesis across `MR + PHI + DTS + SPE + LIS + Appendix 2 + RedFont/Comments`), and **`EQ-VND`** (Supplier/Cross-Volume Gate §10 & conditional markup routing $\mu(s)$).
  * **`SI-REQ` (`04 Systems / Requirements`, `WorkingPreview0550.jsx` step 4):** Mounts the **Particular Context & Learned Rules Registry ($\Psi_{\text{Synth}} + \Lambda_{\text{SI}}$)**.
  * **`SI-ACT` (`06 Execution / Resources`, `WorkingPreview0550.jsx` step 6):** Mounts the live **`SI-SYNTH-EQ` Verification Scorecard** across all 19 systems + `COMMON`.
* **Automatic Post-Edit Execution:** `full_audit.cjs` and `npm run validate:pj0550-si-equations` execute `SI-SYNTH-EQ` automatically after every BOM, pricing, technical, or schedule change.
