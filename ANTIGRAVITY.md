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

## 3. Expandable BOM Sub-table Structure
When expanding (`+` / `-`) any system line item in `bid.quotation.C1` or `11.P`, the system must render a formal, bordered Bill of Materials (BOM) sub-table with separated specification columns:

$$\text{Item} \quad|\quad \text{Equipment Description} \quad|\quad \text{Brand} \quad|\quad \text{Model} \quad|\quad \text{Part No.} \quad|\quad \text{Qty} \quad|\quad \text{Unit} \quad|\quad \text{Remarks}$$

* **Site-Level Allocation:** Each sub-table must accurately represent the equipment assigned to that specific Location (`APF`, `ACP`, `ABV01`, `AMS01`).
* **Remarks Column:** Displays formal EPC technical notes (e.g., `"Included in Base Scope of Supply"`, `"ATEX Zone 1 Certified"`, `"Outdoor Marine Grade SUS316L"`).

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
