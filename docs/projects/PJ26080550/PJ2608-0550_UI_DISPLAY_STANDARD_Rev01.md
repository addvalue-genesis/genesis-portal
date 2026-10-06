# PJ2608-0550 UI / UX Display Standard Rev01

**Status:** Controlled working UI standard  
**Scope:** PJ2608-0550 GENESIS / ETM pages only  
**Primary target:** desktop engineering / commercial workbench at 100% browser zoom

## PTTEP standard check

The available project copy of **10008-STD-6-GEN-003 — Minimum Requirements for Vendor's Documentation** was reviewed for presentation/font requirements.

The reviewed clauses explicitly define document presentation items such as:
- drawings on standard A3 sheets;
- A1 only by specific COMPANY agreement and printable in A3;
- other documents on A4 sheets;
- native-format / dossier presentation requirements.

No explicit web/UI font family or point-size requirement was identified in the reviewed font/presentation text. Therefore the GENESIS application does **not** invent a PTTEP font-size rule. It uses the controlled readability standard below while export renderers preserve the applicable customer/template document format.

## 1. Readability baseline

The UI must be comfortably readable at 100% browser zoom.

Hard rules:
- normal body text: **13 px**
- interactive labels/tabs/buttons: **12–13 px**
- table cells: **12 px minimum**
- metadata/captions: **11 px minimum**
- engineering trace body: **12.5 px minimum**
- engineering trace title: **18 px**
- equation chips: **11.5 px minimum**

Do not solve density problems by shrinking text below the floor.

## 2. Engineering Trace layout

The trace module uses a readable two-column master/detail layout:

1. Requirement
2. Constraint
3. CAL / Study / RPT
4. Quantity Driver
5. Equation ID — full width
6. Cost Object
7. Commercial Rule
8. Displayed Price / Release — full width

The Equation and Displayed Price nodes are given full width because they are high-value review objects and may contain multiple controlled expressions / release states.

## 3. Price audit header

Price audit cards wrap responsively:
- desktop wide: 3 columns;
- medium: 2 columns;
- small: 1 column.

Labels must be visually secondary, but values must be readable without zoom.

## 4. Equation chips

Equation IDs are treated as engineering controls, not micro-metadata.

Minimum:
- 11.5 px text
- 6 × 8 px internal padding
- wrap to multiple lines instead of shrinking

Example:
- GEQ-001 Applicability
- GEQ-012 Material / Landed Cost
- GEQ-033 Commercial-treatment Line Cost
- GEQ-034 Controlled Currency Conversion

## 5. Responsive rule

At narrow widths:
- cards stack;
- full-width engineering objects return to normal single-column order;
- horizontal scrolling is reserved for wide tables only.

## 6. Export rule

React readability settings do not redefine customer deliverable typography.

XLSX / DOCX / PDF output must follow:
- the customer-provided template;
- applicable PTTEP/customer document requirements;
- the controlled Output Contract.

React is the engineering workbench, not the export master document.

## 7. Implementation

Project-wide readability:
- `Project0550DesignSystem.css`

Engineering-price trace:
- `ASKTSIPricedBreakdownForm.jsx`
- `BidWorkspace.css`

The shared design system is imported after module styles and therefore owns the readability floor / final engineering-trace overrides.
