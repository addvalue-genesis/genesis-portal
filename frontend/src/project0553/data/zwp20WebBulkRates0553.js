// Public internet price evidence observed 2026-10-13. THB ex VAT.
export const ZWP20_WEB_BULK_RATES_0553=Object.freeze({
 status:"PUBLIC_RETAIL_BUDGET_CANDIDATES__NOT_OEM_OR_CLIENT_APPROVAL",
 date:"2026-10-13",
 lines:Object.freeze([
  {id:"HAWKE-A",sku:"501/453/UNIV/A/M20/KIT",rateTHB:1925.10,unit:"ea",
   outerDiameterMinMm:8.4,outerDiameterMaxMm:14.3,
   url:"https://th.rs-online.com/web/b/hawke/",source:"RS Thailand stock 271-1350",
   decision:"EX_COMPATIBILITY_AND_ARMOUR_REQUIRE_CERTIFICATE__CABLE_OD_MUST_MATCH"},
  {id:"HAWKE-O",sku:"501/453/UNIV/O/M20/NP/KIT",rateTHB:1488.36,unit:"ea",
   outerDiameterMinMm:9.5,outerDiameterMaxMm:16,
   url:"https://th.rs-online.com/web/p/cable-glands/0716021",source:"RS Thailand stock 716-021",
   decision:"ALT_SIZE_ONLY__CABLE_OD_AND_EX_CERT_REVIEW"},
  {id:"HAWKE-OS",sku:"501/453/UNIV/OS/M20/NP/KIT",rateTHB:1719.06,unit:"ea",
   outerDiameterMinMm:5.5,outerDiameterMaxMm:12,
   url:"https://th.rs-online.com/web/p/cable-glands/0716019",source:"RS Thailand stock 716-019",
   decision:"ALT_SIZE_ONLY__CABLE_OD_AND_EX_CERT_REVIEW"},
  {id:"EARTH-6MM",sku:"LAPP-1238000",rateTHB:82.6345,unit:"m",
   url:"https://th.rs-online.com/web/p/hook-up-wire/0362375",source:"RS Thailand LAPP 100m reel THB8263.45",
   decision:"SIX_SQMM_YELLOW_GREEN_TINNED_COPPER__FIRE_ENVIRONMENT_REVIEW"},
  {id:"TIE-316",sku:"RS-PRO-121-624",rateTHB:22.8153,unit:"ea",
   url:"https://th.rs-online.com/web/p/cable-ties/0121624",source:"RS Thailand 100pcs bag THB2281.53",
   decision:"SS316_TIE__FIELD_SUPPORT_SPACING_INSTALLATION_PROOF_REQUIRED"},
  {id:"RJ45",sku:"WEIDMULLER-1963600000",rateTHB:1176.68,unit:"ea",
   url:"https://th.rs-online.com/web/p/ethernet-couplers/7417317",source:"RS Thailand 741-7317",
   decision:"ALREADY_COST_OWNED_DATO_ROW8__DO_NOT_POST_AGAIN"}
 ]),
 rule:"Internet retail indicative prices, ex VAT; vendor included items must not be priced twice. Gland sealing range + selected cable OD/armor and Ex approvals are mandatory before exact purchase. Cable material 100m reel procurement economics differ from fractional budget takeoff."
});
export const findZwp20WebRate0553=id=>ZWP20_WEB_BULK_RATES_0553.lines.find(x=>x.id===id)||null;
