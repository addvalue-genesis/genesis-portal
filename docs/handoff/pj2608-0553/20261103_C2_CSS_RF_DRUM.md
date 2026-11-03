# PJ2608-0553 — CSS RF drum selected in C2

Owner03-Nov2026 selects the RF spare row as a drum using CSS1/2-inch cable. Existing rowC2-REV08-09 (active Annex item8) offers one drum containing305m continuous CommScope HELIAX LDF4RK-50A cable. Same antenna reference TAGs/sites remain. Original raw Rev08 record is retained, not overwritten.

## Evidence and qualifications

CSS QT-H670003342 dated30-Jan-2024 to Royaltec quotes305MT atTHB550/MT, valid until6-Feb-2024. It is not a current ADDVALUE quotation or proof of a purchase, factory drum length or MOQ.305m is the owner-offered drum quantity using that quote. Historical rate550/m is selected as the provisional budget; no escalation or invented internet price is added.

Source: https://drive.google.com/file/d/1HkwJ0RBHshez5wLWcWoyECxzR-JlDf6b/view
Manufacturer specification confirms LDF4RK-50A1/2-inch50Ω: https://www.commscope.com/globalassets/digizuite/115684-p360-ldf4rk-50a-external.pdf
Manufacturer also publishes a separate500m variant; this is not evidence that the CSS305MT quotation is a factory-packed305m drum. Final packing, actual current quote, antenna-path loss, jacket/fire/environmental compliance and connector/gland compatibility remain unconfirmed.

## Calculation and scope

Cost305×550 =THB167750. Existing Release factor1.30 applies once: SELLTHB218075 /FX31.5 =USD6923.02; whole-drum USD10 roundup =USD6930. Replace old30m/USD600/SELLTHB16370.52 once. C2 source SELLTHB650382.02→852086.50; quotedC2USD20890→27220 (+6330). Other ten active C2 rows are exactly preserved, including CAT6A300m/USD8050 and four Type-N connectors/USD40 each. All A/B/C1 parents remain unchanged: A+BUSD894910; C1USD181100. C2 remains outside A+B.

CSS4.3-10 connector quote is not selected or added. Separate four C2 Type-N connectors remain budgeted; their exact compatibility with the selected cable is not approved. Do not transfer the six connectors included in installed MGW UHF-4 into this spare drum. PartA FORLLER UHF-4 remains3 installed100m+6-connector sets atUSD846/set; no installed A rate, quantity or brand changes.

## Implementation and verification

The existing option owner applies the two cable decisions sequentially after the historical quote allocation. All unrelated quoted rows retain their prior values. CAT6A metadata is preserved; RF has its own explicit historical CSS decision. Both use the same Release equation and existing source anchors. Source, Scope, Release, Official Annex and native6-sheet USD/THB and10-sheet Breakdown use this single offer. Old30m filled exports are repaired; repeated export/rebuild is idempotent. Internal source panels identify both replacements; customer files contain no raw cost/uplift/CSS procurement references. C1/C2 compact nine-column layout remains.

14 targeted checks passed, including the new independent R84 preservation fixture proving other ten C2 rows/all A/B/C1/raw sources unchanged; exact cost/Release/FX/rounding; both Source anchors; USD/THB/Breakdown numeric cells, stale workbook repair and repeated build. Dedicated build:0553 passed with three existing webpack size warnings. Browser QA/full legacy chain not run. Generated edited-image preview is illustrative and is not a browser verification screenshot. Draft branch only; no merge, procurement or customer transmission.
