// Source selection precedence: management decision Sep 2026, reconfirmed Oct 12.
// These are PART A equipment-only budget references, not released selling prices.
// MGW PHONE-1 is excluded from selected MR0003 budget to prevent double count.
export const MR0003_SELECTED_PRICE_0553=Object.freeze({
 selected:"EXION_TELEPHONE_SOUNDER_AND_PROSPER_BARTEC_JB",
 mr:"MR0003",locations:["ZWP20","ZWP21","ZWP22","ZWP23"],
 quoteExion:"EXION QT_1260576 Rev.0 dated 2026-09-04",quoteProsper:"Q-PROSRY-24051 Rev.0 dated 2024-07-12 item 3 historical 1E",
 phoneSku:"212-02-6008-510",phoneTHB:145000,
 sounderSku:"DB3BDG048N2BNR",sounderTHB:62000,
 jbSku:"BARTEC Ex e Telephone JB historical item 3",jbTHB:24500,
 equipmentPerSiteTHB:231500,equipmentFourSitesTHB:926000,
 quantityPerSite:1,priceBasis:"EXION_QUOTED_FOUR_UNITS_AND_PROSPER_2024_HISTORICAL_COMPARABLE",
 quoteQuantities:{phone:4,sounder:4,jbHistorical:4},
 excludedAlternative:"MGW PHONE-1 USD 11152 quoted package is not selected. Do not add to these equipment costs.",
 gates:["EXION sounder quote SKU versus technical datasheet discrepancy to be verified","PROSPER quotation is 1E, not current Z1F quote","PROSPER historical JB has 4 M20 entries, reconcile Z1F BARTEC GA with 8 M20 holes, cable end quantity and hazardous-area approvals","EXION scope excludes project TPI/certification unless specified","EXION special price per lot, no partial order","Budget excludes cables, additional glands, site installation, B1-B14/C1-C2 and commercial uplift"],
 releaseAllowed:false
});
