# PJ2608-0553 ADDVALUE-to-SAMTEL engineering service markup

ADDVALUE cost (Item 7 VND) is ADDVALUE's actual selling price. Release adds 5% for SAMTEL on top of that cost. The factor is never a deduction.

`SAMTEL_ENGINEERING_SERVICE_MARKUP_0553` in `frontend/src/project0553/data/samtelEngineeringServiceMarkup0553.js` is `1.05`.

Release = Item 7 × 1.05.

Money is rounded to the nearest satang with `Math.round((n + Number.EPSILON) * 100) / 100`.

This factor is for the B3-BF additional proposal. It does not replace `priceBWorkingSell0553`, which keeps the Part B customer price equal to the working sell and then deducts 5% as SAMTEL's share of that price.
