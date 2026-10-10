// PJ2608-0553 provisional budgetary reference (user authorized 2026-10-10).
// 2024 INNOVA quotations are NOT current vendor commitments. Source amounts remain THB, ex VAT.
export const INNOVA_0553_PROVISIONAL_PRICES=Object.freeze({
 supplier:"INNOVA CORPORATION CO., LTD",sourceDate:"2024-07-15",currency:"THB",
 priceUse:"PROVISIONAL_BUDGET_REFERENCE_REQUOTE_PENDING",customerReleaseApproved:false,
 quotations:[
  {number:"QA24-0604",url:"https://drive.google.com/file/d/1I4LhJY-heANsoV21uWMO6kUVioeokMUS/view",
   scope:"TECKNIKABEL CAT6A cable 300m, RJ45, Hawke gland, Ex adapter",originalSubtotalExVat:189220,
   historicalQuoteQtyBasis:"Source quotation basket, NOT approved MR0001 take-off",budgetAllocationQty:null,acceptedCost:null,
   lines:[{description:"TECKNIKABEL CAT6A S/FTP cable",qty:300,unit:"m",unitPriceExVat:524,pricingState:"SOURCE_VERIFIED"},
    {partNumber:"IE-PS-RJ45-FH-BK",description:"Weidmuller RJ45 plug-in connector",qty:1,unit:"ea",unitPriceExVat:1020,pricingState:"SOURCE_VERIFIED"},
    {partNumber:"501/453/UNIV/A/M20",description:"Hawke M20 gland",qty:1,unit:"set",unitPriceExVat:null,pricingState:"N_A_AS_QUOTED"},
    {partNumber:"AFU113030",description:"Crouse-Hinds Ex adaptor; MOQ 10",qty:10,unit:"ea",unitPriceExVat:3100,pricingState:"SOURCE_VERIFIED"}],
   functions:["CABLE_FIRE_RATING","FEEDER_ROUTE","RF_CONNECTOR","GLANDS"]},
  {number:"QA24-0605",url:"https://drive.google.com/file/d/1aynKyn90ucGBTDaDG_mYXMHJaowyBF6M/view",
   scope:"APS AME LabLan U/FTP CAT6A 305m box",originalSubtotalExVat:46000,
   historicalQuoteQtyBasis:"One quoted 305m box, NOT approved MR0001 take-off",budgetAllocationQty:null,acceptedCost:null,
   lines:[{description:"APS AME LabLan CAT6A 305m/box",qty:1,unit:"box",unitPriceExVat:46000}],
   functions:["CABLE_FIRE_RATING","FEEDER_ROUTE"]},
  {number:"QA24-0606",url:"https://drive.google.com/file/d/1t6lfccTdW7QcGxOTnq3mRTm9U6cubn_a/view",
   scope:"Hawke nickel-plated brass gland for 1/2-inch and 7/8-inch CELLFLEX RF cable",
   originalSubtotalExVat:2705,historicalQuoteQtyBasis:"One each per original quotation, NOT approved MR0001 take-off",
   budgetAllocationQty:null,acceptedCost:null,
   lines:[{partNumber:"501/421/B/M25",qty:1,unit:"set",unitPriceExVat:690,cable:"LCF12-50JFN 1/2-inch"},
    {partNumber:"501/421/C2/M40",qty:1,unit:"set",unitPriceExVat:2015,cable:"LCF78-50JFNA 7/8-inch"}],
   functions:["GLANDS","RF_CONNECTOR"]}
 ],
 rules:["Use source THB amounts as provisional budget rates only","Do not add three quote totals: cable solutions can be alternatives or overlap","Quote basket subtotals must not be multiplied by MTO Set/Lot","Source unit rates require cable size, Ex, interface, length and procurement quantity verification","Requote pending, customer release HOLD"]
});
