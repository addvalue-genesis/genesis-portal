// Reconciliation-first cost overview across site and MR. No invented quote allocation.
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {MGW_P26_058_0553} from "./mgwP26058";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {MR0001_RADIO_ROLE_MATRIX} from "./mr0001RadioRoleMatrix";
const mrSystems=[
 {id:"MR-0001",name:"SCADA Radio / LAN"},
 {id:"MR-0002",name:"DMR / Trunk Radio"},
 {id:"MR-0003",name:"ATEX Telephone"},
 {id:"MR-0004",name:"Marine RACON"}];
const sites=[...new Set([
 ...MR0001_WORKING_PRICED_BOM.items.map(x=>x.site),
 ...MR0001_RADIO_ROLE_MATRIX.sites.map(x=>x.site),
 ..."ZWP20 ZWP21 ZWP22".split(" ")
])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const sourcePrice=(id)=>SUPPLIER_QUOTE_LINES_0553.find(q=>q.id===id);
const mgwBySystem={"MR-0002":["UHF-1","UHF-2","UHF-3","UHF-4"],
 "MR-0003":["PHONE-1"],"MR-0004":["RACON-1"]};
const normalizedMGW=MGW_P26_058_0553.lines.map(([id,sku,description,qty,unit,extended,group])=>({id,sku,description,qty,unit,extended,group}));
const sharedMGW=normalizedMGW.filter(x=>x.id.startsWith("SERV-"));
const checkedAmount=(row)=>row.qty*row.unit;
const derivedRows=sites.flatMap(site=>mrSystems.map(mr=>{
 const evidence=[];
 if(mr.id==="MR-0001"){
  const matches=MR0001_WORKING_PRICED_BOM.items.filter(x=>x.site===site&&Number.isFinite(x.indicativePackageCostTHB));
  for(const x of matches)evidence.push({source:"VST-0048-RE1",line:x.sourceTag,description:"Cisco LAN working package",sourceQty:x.sourceScopeQty,assumedQty:x.sourceScopeQty,currency:"THB",unit:MR0001_WORKING_PRICED_BOM.cisco.unitPackageQuotedSumTHB,extended:x.indicativePackageCostTHB,kind:"PROVISIONAL_SITE_QUOTE_BUNDLE"});
 }
 // MGW offer scope expressly lists ZWP20,21,22. One per site is a working
 // equal-distribution ASSUMPTION, not signed OEM site allocation.
 if(["ZWP20","ZWP21","ZWP22"].includes(site)&&mgwBySystem[mr.id]){
  for(const x of normalizedMGW.filter(x=>mgwBySystem[mr.id].includes(x.id))){
   if(x.qty!==3)throw Error("MGW site scenario quantity changed: "+x.id);
   evidence.push({source:"MGW-P26-058",line:x.id,description:x.description,
    sourceQty:x.qty,assumedQty:1,currency:"USD",unit:x.unit,extended:x.unit,
    kind:"PROVISIONAL_EQUAL_SPLIT_3_SITES"});
  }
 }
 const currencies=[...new Set(evidence.map(e=>e.currency))];
 const subtotals=currencies.map(currency=>({currency,amount:Math.round(evidence.filter(e=>e.currency===currency).reduce((n,e)=>n+e.extended,0)*100)/100}));
 const gaps=mr.id==="MR-0001"?["Next G radio/antenna/throughput/NMS allocation","Enclosure, DATO, surge and physical bulk","RF/CAL/OEM quantity and scope ownership"]:mr.id==="MR-0002"?["RFI LNA not included in MGW BDA","Site RF topology, feeder and enclosure take-off"]:mr.id==="MR-0003"?["Check vendor phone package already includes sounder, JB and glands","Installation cable/terminations"]:["RACON installation accessories, Ex/certification and test"];
 return {site,mr:mr.id,name:mr.name,evidence,subtotals,gaps,
  completeness:"PARTIAL_NOT_APPROVED",verifiedTotal:null,
  sourceNote:mr.id==="MR-0001"?"Cisco 5-site quote scenario only; Next G global quote unallocated":"MGW 3-unit quotation split equally across ZWP20-22 only as reversible budgetary assumption"};
}));
const mgwSharedAmount=sharedMGW.reduce((sum,r)=>sum+checkedAmount(r),0);
const mgwProductQuotedAmount=normalizedMGW.filter(x=>!x.id.startsWith("SERV-")).reduce((sum,r)=>sum+checkedAmount(r),0);
if(mgwSharedAmount+mgwProductQuotedAmount!==MGW_P26_058_0553.quotedTotal)throw Error("MGW reconciliation to original failed");
export const SITE_SYSTEM_COST_RECONCILIATION_0553=Object.freeze({
 id:"P553-SITE-MR-COST-RECON",basis:"SOURCE_QUOTED_BUDGETARY_ASSUMPTION",
 sites,systems:mrSystems,rows:derivedRows,
 mgwSharedUSD:mgwSharedAmount,mgwProductQuotedUSD:mgwProductQuotedAmount,
 mgwQuoteUSD:MGW_P26_058_0553.quotedTotal,
 nextGQuoteUSD:sourcePrice("NG-260916")?.quotedTotal??null,
 nextGSiteAllocatedUSD:null,siteFinalTotals:null,projectFinalTotal:null,
 exclusions:["Never add quotation-wide Next G to individual sites","MGW engineering/FAT/packing is shared and not allocated twice",
 "MGW BDA is NOT the missing RFI LNA","MGW telephone package already includes JB/sounder/glands",
 "Do not equate site scenario with verified A+B+C or customer sell",
 "Do not sum unlike currencies without sourced FX"],
 validity:"NO_CUSTOMER_RELEASE"});
);
