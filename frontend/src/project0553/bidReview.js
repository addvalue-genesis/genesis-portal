// PJ2608-0553 ONLY. Working review Rev01; no customer release.
export const BID_0553_SOURCES = [
  {id:"RFQ-ITB",name:"0-Instruction to Bidder.docx",revision:"Original received Aug 2026",url:"https://drive.google.com/file/d/1dyMxfGxL7k9JvxeaRk2oN5HEdMtP44Rl/view",status:"REVIEWED",note:"Original closes 08-Sep-2026; technical + unpriced first, priced held until notice."},
  {id:"RFQ-MTO-R04",name:"PJ2608-0553_MTO_MR0001-0004_SUBMIT_Rev04_20261006-Update.xlsx",revision:"Rev04",url:"https://drive.google.com/file/d/1o1UIsUw8JQtUt2yk4S8graNpIkNQCq8h/view",status:"REVIEWED",note:"Four MR tabs and delivery/FAT basis; latest working scope, not automatically an approved vendor offer."},
  {id:"CCL-R04",name:"Z1F Commercial Check List FOR-SAMTEL Rev04",revision:"Rev04 / SAMTEL review",url:"https://drive.google.com/file/d/1yxRC5iCIKolXHHi_R0qsrE2_4wAJzzXT/view",status:"REVIEWED",note:"40-week draft overall delivery basis, CIF Zhuhai; SAMTEL reply/evaluation cells need cleanup and agreement."},
  {id:"TC-0001",name:"TC-0001 SAMTEL 20261005",revision:"2026-10-05",url:"https://drive.google.com/file/d/1A1bb7ABA6SSeUcLRPqQnw7HZ6xXpvK0L/view",status:"INDEXED",note:"Full response-level engineering review required."},
  {id:"TC-0002",name:"TC-0002 SAMTEL 20261005",revision:"2026-10-05",url:"https://drive.google.com/file/d/1aOQfqwEEaPLA7OKEV1nLLq3Q0Z8Udo9X/view",status:"INDEXED",note:"Full response-level engineering review required."},
  {id:"TC-0003",name:"TC-0003 SAMTEL 20261005",revision:"2026-10-05",url:"https://drive.google.com/file/d/1zCLgq5QX4-j5ua55GjHHfsz3igfr5MDV/view",status:"INDEXED",note:"Full response-level engineering review required."},
  {id:"TC-0004",name:"TC-0004 SAMTEL 20261005",revision:"2026-10-05",url:"https://drive.google.com/file/d/1n75l5xLctj3k_Df-aUETo_oyHTwCkIfJ/view",status:"INDEXED",note:"Full response-level engineering review required."},
  {id:"INT-PRICE-R09",name:"PJ2608-0553 INTERNAL Pricing Rev09",revision:"Rev09 INTERNAL",url:"https://drive.google.com/file/d/1kmnY9WAiWeM-IIanARPfrzd4UNigv_QO/view",status:"HOLD",note:"Estimator allowances and unsupported prices cannot be promoted to customer release."},
  {id:"UNPRICED-R09",name:"Customer Unpriced Commercial Rev09",revision:"Rev09 PREPARED",url:"https://drive.google.com/drive/folders/1Md2zsMpScsjzyICDV8JqTxY6CZUd533J",status:"PREPARED_NOT_SENT",note:"Check hidden sheets, metadata, deviations and all price fields."},
  {id:"PRICED-R09",name:"Customer Priced Commercial Rev09",revision:"Rev09 HOLD",url:"https://drive.google.com/drive/folders/1jfkXNa4TNWPsvzKE-eTev-SbL-SdAo8Z",status:"HOLD_DO_NOT_SEND",note:"Reconcile against Rev04 MTO and current vendor offers."}
];
export const BID_0553_GATES = [
 {id:"G-01",priority:"P0",system:"ALL",title:"Closing and submission routing",status:"OPEN",detail:"Original instruction says 08-Sep-2026. Later JUTAL screenshot says 14-Oct-2026 17:00 Beijing. Obtain original amendment/email, sender and authorized mailbox; old submission instruction cannot govern unverified new round.",sources:["RFQ-ITB"]},
 {id:"G-02",priority:"P0",system:"ALL",title:"MTO Rev04 quantity and scope reconciliation",status:"OPEN",detail:"Treat Rev04 line/tag/location as working source; compare all four MR tabs to supplier BOM, Technical Proposal and commercial line items. Avoid inherited 0550 systems and values.",sources:["RFQ-MTO-R04"]},
 {id:"G-03",priority:"P0",system:"ALL",title:"Delivery Incoterms and lead-time conflict",status:"CONFLICT",detail:"CCL proposes CIF Zhuhai and 40 weeks, whereas MTO Rev04 describes MR-specific DAP Nonthaburi and component-specific lead times. Confirm one customer offer basis and quote-backed schedule.",sources:["CCL-R04","RFQ-MTO-R04","RFQ-ITB"]},
 {id:"G-04",priority:"P0",system:"ALL",title:"Manufacturer authorization letters",status:"OPEN",detail:"Confirm specific manufacturer authorization, signatory, bidder entity, MR and validity; no implied OEM authority from datasheet.",sources:["RFQ-ITB"]},
 {id:"G-05",priority:"P0",system:"ALL",title:"Spare-parts inventory and separate pricing",status:"OPEN",detail:"Produce source-backed commissioning and capital/spare schedules, mark vendor options separately and check four-year spare-price validity requirement from original ITB.",sources:["RFQ-ITB","RFQ-MTO-R04"]},
 {id:"G-06",priority:"P0",system:"ALL",title:"Unpriced zero-leak inspection",status:"OPEN",detail:"Scan all worksheets (including hidden), annexes, PDFs, filenames and metadata for prices, rates and currency; substitute QUOTED as RFQ requires.",sources:["RFQ-ITB","UNPRICED-R09"]},
 {id:"G-07",priority:"P0",system:"ALL",title:"Priced BOQ reconciliation",status:"HOLD",detail:"No zero-filling or back-solving; verify rate/source/revision/tax/FX/delivery/quantity for every priced line before releasing.",sources:["PRICED-R09","INT-PRICE-R09","RFQ-MTO-R04"]},
 {id:"G-08",priority:"P1",system:"MR-0001",title:"SCADA RF and industrial switch",status:"HOLD",detail:"Antenna frequency/gain/link calculation and Cisco PoE power, licence entitlement and complete-set lead time pending engineering confirmation.",sources:["RFQ-MTO-R04","TC-0001"]},
 {id:"G-09",priority:"P1",system:"MR-0002",title:"DMR technical clarification",status:"OPEN",detail:"Resolve latest TC response, exact offered brand/model, spectrum/licence and OEM evidence.",sources:["TC-0002","RFQ-MTO-R04"]},
 {id:"G-10",priority:"P1",system:"MR-0003",title:"Explosion-proof telephone certification",status:"OPEN",detail:"Bind Ex certificates, environmental temperature and interface/bulk requirements to offered exact model.",sources:["TC-0003","RFQ-MTO-R04"]},
 {id:"G-11",priority:"P1",system:"MR-0004",title:"RACON certification and FAT",status:"OPEN",detail:"Confirm hazardous-area and temperature proof, manufacturer FAT basis, lead time and marine authority requirements.",sources:["TC-0004","RFQ-MTO-R04"]},
 {id:"G-12",priority:"P0",system:"ALL",title:"SAMTEL final CCL replies and deviations",status:"OPEN",detail:"Remove internal SAMTEL review column before issue; validate tax, warranty, LD, payment, manufacturing place and deviations against purchaser's RFQ and contract.",sources:["CCL-R04","RFQ-ITB"]}
];
export function validateBidReview(sources=BID_0553_SOURCES,gates=BID_0553_GATES) {
 const ids=new Set(sources.map(s=>s.id)); const errors=[];
 if(ids.size!==sources.length) errors.push("DUPLICATE_SOURCE_ID");
 for(const g of gates){if(!g.sources?.length||g.sources.some(id=>!ids.has(id))) errors.push("UNLINKED_GATE:"+g.id);}
 if(gates.some(g=>!["OPEN","HOLD","CONFLICT","CLOSED_VERIFIED"].includes(g.status))) errors.push("INVALID_GATE_STATUS");
 return {ok:errors.length===0,errors,releaseAllowed:errors.length===0&&gates.every(g=>g.status==="CLOSED_VERIFIED")};
}
