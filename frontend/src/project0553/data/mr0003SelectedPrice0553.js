// Source selection precedence: management decision Sep 2026, reconfirmed Oct 12.
// These are PART A equipment-only budget references, not released selling prices.
// MGW PHONE-1 is excluded from selected MR0003 budget to prevent double count.
export const MR0003_SELECTED_PRICE_0553=Object.freeze({
 selected:"EXION_TELEPHONE_SOUNDER_AND_PROSPER_BARTEC_JB",
 mr:"MR0003",locations:["ZWP20","ZWP21","ZWP22","ZWP23"],
 quoteExion:"EXION QT_1260576 Rev.0 dated 2026-09-04",quoteProsper:"Q-PROSRY-24051 Rev.0 dated 2024-07-12 item 4 historical 1E",
 phoneSku:"212-02-6008-510",phoneTHB:145000,
 sounderSku:"DB3BDG048N2BNR",sounderTHB:62000,
 jbSku:"BARTEC 07-56D2-0411 Telephone Terminal Box Zone 1/2 historical item 4",jbTHB:22000,
 equipmentPerSiteTHB:229000,equipmentFourSitesTHB:916000,
 quantityPerSite:1,priceBasis:"EXION_QUOTED_FOUR_UNITS_AND_PROSPER_ITEM4_HISTORICAL_THREE_UNIT_RATE_COMPARABLE",
 quoteQuantities:{phone:4,sounder:4,jbHistorical:3},
 excludedAlternative:"MGW PHONE-1 USD 11152 quoted package is not selected. Do not add to these equipment costs.",
 gates:["EXION sounder quote SKU versus technical datasheet discrepancy to be verified","PROSPER quotation is 1E, not current Z1F quote","PROSPER historical selected item4 has 3 field M20 entries + 1 separate M20 drain and switching relay; GA-1004 has 8 top M20 entries. Reconcile model, Ex rating, wiring, quantity and certificate before purchase","EXION scope excludes project TPI/certification unless specified","EXION special price per lot, no partial order","Budget excludes cables, additional glands, site installation, B1-B14/C1-C2 and commercial uplift"],
 releaseAllowed:false
});
