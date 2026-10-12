// Internal provisional pricing for scoped items without assigned vendor package.
// One budget exposure per actual MTO tag. These are NOT approved NEW procurement.
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
const prices=new Map(NEXTG.lines.map(v=>[v.code,v]));
const round=n=>Math.round(n*100)/100;
const configurations={
 ZWP22:{"MR-502-001":["B-1","B-2","B-3","B-5"],"MR-502-001A":["B-6","B-7"],"ANT-502-001":["B-12"],"SA-502-001":["B-8"]},
 ZWP23:{"SA-502-001":["B-8"]},
 ZPQ:{"MR-LQM-202-025A":["A-1","A-2","A-4","A-5"],"MR-LQM-202-025B":["B-1","B-2","B-3","B-5"],"ANT-LQM-202-025":["A-12"],"SA-LQM-202-025":["B-8"]},
 ZWP8:{"MR-502-003A":["B-6","B-7"],"MR-502-004A":["B-6","B-7"],"SA-502-002":["B-8"],"SA-502-003":["B-8"]},
 ZWP11:{"MR-502-005A":["C-1","C-2","C-3","C-5"],"MR-502-005B":["C-6","C-7"],"ANT-502-005":["C-11"],"SA-507-005":["C-8"]}
};
const exRate=SUPPLIER_QUOTE_LINES_0553.find(v=>v.id==="PROSPER-24051")?.lines.find(v=>v[0]==="1")?.[4];
const exception={
 ZWP8:{"TCAB-500-003":{currency:"THB",unitRate:exRate,description:"Ex enclosure historical analog"}},
 ZWP11:{"TCAB-500-003":{currency:"THB",unitRate:exRate,description:"Ex enclosure historical analog"}}
};
const bulkRate=69*524+1020;
export function deriveMR0001MissingBudget0553(item){
 const site=item.site,tag=item.sourceTag,qty=item.sourceScopeQty;
 if(!Number.isFinite(qty)||qty<=0)return null;
 const isBrownfield=["ZPQ","ZWP8","ZWP11"].includes(site);
 const codes=configurations[site]?.[tag];
 const analog=exception[site]?.[tag];
 const isBulk=/bulk material/i.test(tag);
 if(!codes&&!analog&&!isBulk)return null;
 const functions=codes?.map(code=>{
  const q=prices.get(code);
  return {functionId:code,sku:q?.partNumber||"NO_VENDOR_REFERENCE",qty:1,
   currency:"USD",unitPrice:q?.unitPrice??null,extended:q?.unitPrice??null,
   source:NEXTG.quoteNumber,status:"MANAGEMENT_BUDGETARY_CONFIGURATION_UNCONFIRMED"};
 })||[];
 if(codes&&!functions.every(x=>Number.isFinite(x.unitPrice)))return null;
 const currency=codes?"USD":"THB";
 const unitCost=codes?round(functions.reduce((n,x)=>n+x.unitPrice,0)):isBulk?bulkRate:analog?.unitRate;
 if(!Number.isFinite(unitCost))return null;
 if(isBulk)functions.push(
  {functionId:"SCADA_FIELD_CAT6A",sku:"TECKNIKABEL CAT6A",qty:69,currency:"THB",unitPrice:524,extended:69*524,source:"INNOVA QA24-0604 historical"},
  {functionId:"INDOOR_M20_GLAND",sku:"501/453/UNIV/A/M20",qty:1,currency:"THB",unitPrice:1020,extended:1020,source:"INNOVA QA24-0604 historical"}
 );
 if(analog)functions.push({functionId:"EX_ENCLOSURE_ANALOG",sku:"A7-3136-4121/Bxxx",qty:1,currency:"THB",unitPrice:unitCost,extended:unitCost,source:"PROSPER-24051"});
 return {site,mr:"MR-0001",row:item.sourceRow,tag,description:item.description,
  sourceQty:qty,sourceUnit:item.sourceScopeUnit,currency,unitCost,extended:round(unitCost*qty),
  vendor:codes?"Next G / Aviat — budgetary candidate":isBulk?"INNOVA / field bulk allowance":"BARTEC / Prosper historical comparable",
  sku:functions.map(x=>x.sku).join(" + "),components:functions,
  status:isBrownfield?"BROWNFIELD_REPLACEMENT_EQUIVALENT_ALLOWANCE__REUSE_REVIEW":"GREENFIELD_FUNCTIONAL_BUDGET__OEM_REVIEW",
  source:"MTO Rev04 + "+(codes?NEXTG.quoteNumber:isBulk?"INNOVA QA24-0604":"PROSPER-24051"),
  quantityBasis:isBrownfield?"MTO quantity priced as replacement-equivalent risk allowance; NOT confirmed new purchase":"MTO set or lot, site-specific function budget allowance",
  assumptions:[isBrownfield?"BLD NEW/REUSE/BY OTHERS not verified; allowance is NOT confirmed equipment procurement":"OEM function configuration/technical selection must be validated",
   isBulk?"69m CAT6A + one M20 gland as a scenario, not measured field route":codes?"Region, license, NMS, frequency and RF interface remain subject to vendor/engineering confirmation":"Ex size and supply package inclusions require review",
   "Do not add alternative offer groups or duplicate vendor-included accessories"],
  countedInWorkingTotal:true,budgetClass:"MANAGEMENT_PROVISIONAL_ALLOWANCE",releaseAllowed:false};
}
