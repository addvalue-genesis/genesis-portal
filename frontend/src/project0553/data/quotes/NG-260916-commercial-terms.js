// Exact source quotations are preserved in NG-260916-ADV-DAP1.full.json and original PDF.
// This commercial register is additive: extracted source wording versus interpretation,
// bid-comparison implications and unresolved RFQ/TC questions are separate fields.
export const NEXT_G_260916_TERMS_0553=Object.freeze({
 id:"NG-260916",moduleId:"bid.vendor.products.quotation.NG-260916",
 quotation:"NG/260916-ADV-DAP1",revision:"2026-09-16",sourceDocument:"NG Price Proposal - ADV Z1F as of 16Sep26.pdf",
 sourceUrl:"https://drive.google.com/file/d/1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd/view",
 rfqFolder:"https://drive.google.com/drive/folders/1qwpwivXfX_eWPholQWH5sfYwEPp2BZbQ",
 supplier:{name:"Next G Solution Co.,Ltd",address:"142 Two Pacific Place 23rd Floor, Sukhumvit Road, Klongtoey, Klongtoey, Bangkok, 10110",taxId:"0105551023612",branch:"Head Office"},
 customer:{name:"Add Value System company limited",address:"59/66 BanMai Pakkred Nonthaburi 11120 Thailand",telephone:"6625820144",mobile:"66-81466-1816"},
 quotationHeading:{scope:"1 System 1 RDL 3000 XP Series support ZAWTIKA 1F",quantity:1,unit:"System",currency:"USD",grandTotal:191610.15,originalBOQLineCount:53},
 sourceTermRecords:[
  {id:"NG-TERM-01",topic:"Quotation date",originalText:"DATE 16-Sep-26",value:"2026-09-16",verification:"SOURCE_TRANSCRIBED",implication:"Commercial revision must be date-linked"},
  {id:"NG-TERM-02",topic:"Quote validity",originalText:"Quote Valid Date: 01-Oct-26",value:"2026-10-01",verification:"SOURCE_TRANSCRIBED",implication:"EXPIRED: require updated validity before customer price release"},
  {id:"NG-TERM-03",topic:"Payment",originalText:"100% Cash in Advance",value:"100% cash in advance",verification:"SOURCE_TRANSCRIBED",implication:"Bid cash-flow/advance financing exposure; not automatically mirrored in customer terms"},
  {id:"NG-TERM-04",topic:"Shipping",originalText:"DAP Ranong",value:"DAP Ranong",verification:"SOURCE_TRANSCRIBED",implication:"Do not silently change to DAP Nonthaburi, CIF Zhuhai or offshore delivery; reconcile freight/import handoff"},
  {id:"NG-TERM-05",topic:"Delivery",originalText:"22 - 24 Weeks",value:"22–24 weeks",verification:"SOURCE_TRANSCRIBED",implication:"Starting event, calendar/working weeks and documentation/approval effects not specified; request written clarification"},
  {id:"NG-TERM-06",topic:"Thai VAT",originalText:"Note: In the case that the delivery is within Thailand (inland transportation). There will be VAT as the reguration of Revernue Department.",value:"VAT may apply to delivery within Thailand under Revenue Department rules",verification:"SOURCE_TRANSCRIBED",implication:"The quote shows a 7% VAT row without a numeric VAT amount; do not treat subtotal as VAT-inclusive"},
  {id:"NG-TERM-07",topic:"Quoted amount",originalText:"SUBTOTAL $ 191,610.15",value:"USD 191,610.15",verification:"SOURCE_TRANSCRIBED",implication:"Quotation-wide total only; not single ZWP20 system cost or sale price"},
  {id:"NG-TERM-08",topic:"BOQ group A",originalText:"A Base Station: ZPQ, ZWP8",value:"A: ZPQ and ZWP8 base stations",verification:"SOURCE_TRANSCRIBED",implication:"Base group is not automatically allocated to ZWP20"},
  {id:"NG-TERM-09",topic:"BOQ group B",originalText:"B Subscriber: ZWP23, ZWP21, ZWP22",value:"B: ZWP23/ZWP21/ZWP22 subscriber",verification:"SOURCE_TRANSCRIBED",implication:"ZWP20 is NOT named in group B: any ZWP20 allocation is an engineering budgetary inference, not supplier-design proof"},
  {id:"NG-TERM-10",topic:"BOQ group C",originalText:"C PTP: ZPQ - ZWP08 and ZWP11 - ZWP21",value:"C: PTP ZPQ–ZWP08 and ZWP11–ZWP21",verification:"SOURCE_TRANSCRIBED",implication:"Explicit link topology must be reconciled against latest RPT/BLD"},
  {id:"NG-TERM-11",topic:"BOQ group D",originalText:"D Base Station: Spare",value:"D: base station spares",verification:"SOURCE_TRANSCRIBED",implication:"Separate from operating equipment quantity"},
  {id:"NG-TERM-12",topic:"BOQ group E",originalText:"E Subscriber: Spare",value:"E: subscriber spares",verification:"SOURCE_TRANSCRIBED",implication:"Separate commissioning/capital spares ownership"}
 ],
 sourceNotStated:[
  {topic:"Warranty policy",state:"NOT_STATED_AS_UNAMBIGUOUS_SINGLE_CONTRACTUAL_TERM",note:"12/48-month extended warranty quote lines coexist; do not presume both cumulative or included as standard"},
  {topic:"FAT / SAT / commissioning",state:"NOT_FOUND_IN_EXTRACTED_QUOTATION",note:"Do not infer inclusion or exclusion without written supplier confirmation"},
  {topic:"Datasheets / certificates / Ex approval",state:"NOT_FOUND_AS_COMPLETE_CONTRACTUAL_COMMITMENT",note:"Separate OEM proof and project-specific certificates required"},
  {topic:"Import / customs / taxes outside Thai inland VAT",state:"NOT_SPECIFIED",note:"DAP does not by itself establish all bidder import/permit responsibilities for Myanmar/China routing"},
  {topic:"Country region licence",state:"IN_BOQ_BUT_MYANMAR_NOT_CONFIRMED",note:"Region keys 04/06 explicitly reference other countries; no Myanmar entitlement proven"},
  {topic:"NMS licence",state:"NO_EXPLICIT_MATCHED_PRICE_IN_BOQ",note:"Check project NMS requirement and software entitlement separately"},
  {topic:"Lead-time commencement",state:"NOT_SPECIFIED",note:"Confirm advance receipt, PO acceptance and approved documents start triggers"},
  {topic:"Freight split / final delivery point",state:"NOT_SPECIFIED_BEYOND_DAP_RANONG",note:"Reconcile client requested destination and onward freight"}
 ],
 policy:{keepOriginal53Lines:true,keepOriginalText:true,doNotOverwriteRawQuote:true,
  quotedDashesRemainNull:true,sourceVsInterpretationSeparated:true,
  supplierLocationNotEqualApprovedSiteAllocation:true,
  customerResponseRequiresRFQClauseAndSupplierEvidence:true,
  releaseAllowed:false,expired:true}
});
