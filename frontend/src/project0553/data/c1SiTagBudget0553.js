// C1 left requirement -> right supplier quote/TAG -> SI budget decision.
// This is an explicit priced planning scenario, not a firm spare quotation or
// an automatic replacement of the previously submitted C1 commercial option.
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {selectWorkingBomProjection0553} from "./workingBomAggregation0553";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";
import {selectMGWR2Selected0553} from "./mgwP26058R2Selected0553";
import {priceAorCFromCost0553,RELEASE_POLICY_0553} from "./releaseCommercialModel0553";
import {OPTION_BUDGETARY_QUOTE_POLICY_0553} from "./optionBudgetaryOffer0553";

const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const freeze=Object.freeze;
const identity=x=>JSON.stringify([x.mr,x.site,String(x.id)]);
export function selectC1SiTagBudget0553(){
 const projection=selectWorkingBomProjection0553(),fx=OPTION_BUDGETARY_QUOTE_POLICY_0553.fxTHBPerUSD;
 const tag=(mr,site,name)=>{
  const found=projection.lines.filter(x=>x.mr===mr&&x.site===site&&x.tag===name&&x.counted);
  if(found.length!==1)throw Error("C1 SI exact selected TAG missing/ambiguous "+[mr,site,name].join('/'));
  return found[0];
 };
 const quoted=code=>{
  const q=NEXTG.lines.find(x=>x.code===code);
  if(!q||!Number.isFinite(q.unitPrice)||q.unitPrice<0||!Number.isInteger(q.qty)||q.qty<=0)
   throw Error("C1 SI requires an actual priced Next G spare line "+code);
  return freeze({quote:NEXTG.quoteNumber,quoteLine:code,partNo:q.partNumber,
   description:q.description,quantity:q.qty,currency:"USD",unitCost:q.unitPrice,
   amount:round(q.qty*q.unitPrice),sourcePage:q.sourcePage,kind:"SUPPLIER_SPARE_QUOTE"});
 };
 const base=tag("MR-0001","ZWP8","MR-502-003"),remote=tag("MR-0001","ZWP22","MR-502-001"),
  indoorBase=tag("MR-0001","ZWP8","MR-502-003A"),indoorRemote=tag("MR-0001","ZWP22","MR-502-001A"),
  lan=tag("MR-0001","ZWP20","LAN-502-001"),bda=tag("MR-0002","ZWP20","TCAB-508-002"),
  racon=tag("MR-0004","ZWP20","MAR-514-001");
 const definitions=[
  {id:"C1-SI-ODU-BASE",group:1,groupTitle:"SCADA radio / ODU",description:"Base-station spare radio + RF filter + capacity key",family:"ODU_OR_RADIO",left:[base],codes:["D-1","D-2","D-3"],quantity:1,
   decision:"Next G explicitly quotes one base-station spare. Region key and extended warranty remain separate open/alternative lines."},
  {id:"C1-SI-ODU-REMOTE",group:1,groupTitle:"SCADA radio / ODU",description:"Subscriber spare radio + RF filter + capacity key",family:"ODU_OR_RADIO",left:[remote],codes:["E-1","E-2","E-3"],quantity:1,
   decision:"Next G explicitly quotes one subscriber spare; exact use across PTP/PTMP requires configuration confirmation."},
  {id:"C1-SI-INDOOR",group:2,groupTitle:"SCADA IDU / indoor power interface",description:"Two PoE supply + cord sets, one from each D/E spare package",family:"IDU",left:[indoorBase,indoorRemote],codes:["D-5","D-6","E-5","E-6"],quantity:2,
   decision:"Supplier spare quantities total two identical PoE/cord sets. This is the quoted indoor interface, not proof of complete dedicated IDU equivalence."},
  {id:"C1-SI-L3",group:3,groupTitle:"L3 Switch",description:"Selected Cisco 8-port TAG package, including quoted PSU/support/licence composition",family:"SCADA_NETWORK_SWITCH",left:[lan],quantity:1,
   components:MR0001_WORKING_PRICED_BOM.cisco.items.map(q=>freeze({quote:MR0001_WORKING_PRICED_BOM.cisco.sourceQuote,quoteLine:q.quoteLine,
    partNo:q.sku,description:q.description,quantity:1,currency:"THB",unitCost:q.unitPrice,amount:q.unitPrice,
    kind:"SELECTED_TAG_QUOTE_COMPOSITION"})),
   decision:"SI planning assumption: one project spare matching the selected TAG. Original five-unit supplier quantity is not the spare quantity; excluded expansion module is not restored."},
  {id:"C1-SI-BDA",group:4,groupTitle:"BDA / LNA replacement assembly",description:"RFI BDA + WAROM Ex d enclosure, current UHF-1 bundle",family:"DMR_BDA_ENCLOSURE_ASSEMBLY",left:[bda],quantity:1,
   components:[freeze({quote:"MGW P26-058_R2",quoteLine:"UHF-1",partNo:selectMGWR2Selected0553("UHF-1").model,
    description:selectMGWR2Selected0553("UHF-1").includedComponents.join('; '),quantity:1,currency:"USD",
    unitCost:selectMGWR2Selected0553("UHF-1").unitPriceUSD,amount:selectMGWR2Selected0553("UHF-1").unitPriceUSD,
    kind:"SELECTED_TAG_INSTALLED_PACKAGE_COMPARABLE"})],
   decision:"SI planning assumption: one spare assembly at the selected LNA-to-BDA position. Included enclosure is not charged again; Ex/RF technical qualification remains open."},
  {id:"C1-SI-RACON",group:5,groupTitle:"RACON",description:"MDS/ORGA complete RACON package including quoted boxes/accessories",family:"MARINE_RACON_MAIN",left:[racon],quantity:1,
   components:[freeze({quote:MR0004_WORKING_BOM_0553.quoteNumber,quoteLine:"MDS-FINANCIAL-SUMMARY",partNo:racon.item.sku,
    description:racon.item.description,quantity:1,currency:"USD",unitCost:MR0004_WORKING_BOM_0553.quotePackageUSD,
    amount:MR0004_WORKING_BOM_0553.quotePackageUSD,kind:"SELECTED_TAG_INSTALLED_PACKAGE_COMPARABLE"})],
   decision:"Retain one complete-system spare scenario. DB-5P/control-box/programming-kit inclusions are not additional C1 lines; FCA/delivery and inclusion conflicts remain qualified."}
 ];
 const used=new Set();
 const rows=definitions.map(d=>{
  const components=d.codes?d.codes.map(quoted):d.components;
  for(const c of components){
   const key=c.quote+'|'+c.quoteLine;
   if(used.has(key))throw Error("C1 SI supplier line counted twice "+key);
   used.add(key);
  }
  const currencies=[...new Set(components.map(c=>c.currency))];
  if(currencies.length!==1||components.some(c=>!Number.isFinite(c.amount)))throw Error("C1 SI mixed or missing source price");
  const currency=currencies[0],amount=round(components.reduce((n,c)=>n+c.amount,0));
  if(!["USD","THB"].includes(currency))throw Error("C1 SI unsupported source currency");
  // Convert source cents before rounding THB cents: avoid a binary .005
  // becoming .004999 at a large amount (e.g. E spare radio group).
  const amountTHB=currency==="USD"?Math.round(Math.round(amount*100)*fx)/100:amount;
  return freeze({id:d.id,group:d.group,groupTitle:d.groupTitle,family:d.family,description:d.description,
   left:freeze(d.left.map(x=>freeze({key:identity(x),mr:x.mr,site:x.site,tag:x.tag,id:x.id,
    sourceModuleId:"bid.budget.bom.system-location-mto",source:x.source||"MR0001 controlled TAG ledger",
    sourceQty:x.item.sourceQty??x.item.qty,sourceStatus:x.item.status}))),
   right:freeze(components),quantity:d.quantity,unit:"set",currency,
   unitCost:round(amount/d.quantity),equipmentCost:amount,equipmentCostTHB:amountTHB,
   budgetSellTHB:priceAorCFromCost0553(amountTHB).customerSellTHB,
   quantityAuthority:d.codes?"SUPPLIER_EXPLICIT_SPARE_QTY":"SI_ONE_PROJECT_SPARE_PLANNING_ASSUMPTION",
   rateBasis:d.codes?"SUPPLIER_SPARE_QUOTE":"EXISTING_SELECTED_TAG_RATE_COMPARABLE",
   siDecision:d.decision,budgetCalculated:true,firmSpareQuoteConfirmed:false});
 });
 // Cross-check the fallback against actual selected TAG costs, not quote-wide totals.
 for(const id of ["C1-SI-L3","C1-SI-BDA","C1-SI-RACON"]){
  const row=rows.find(x=>x.id===id),original=definitions.find(x=>x.id===id).left[0];
  if(row.equipmentCost!==original.item.unitCost)throw Error("C1 SI fallback differs from selected TAG "+id);
 }
 const equipmentCostTHB=round(rows.reduce((n,r)=>n+r.equipmentCostTHB,0));
 const budgetSellTHB=priceAorCFromCost0553(equipmentCostTHB).customerSellTHB;
 const proposedQuoteUSD=Math.ceil(budgetSellTHB/fx/OPTION_BUDGETARY_QUOTE_POLICY_0553.summaryRoundingUSD-1e-10)*OPTION_BUDGETARY_QUOTE_POLICY_0553.summaryRoundingUSD;
 const priorQuotedUSD=97500;
 return freeze({rows:freeze(rows),groups:freeze([1,2,3,4,5].map(group=>freeze({group,title:rows.find(r=>r.group===group).groupTitle,
  equipmentCostTHB:round(rows.filter(r=>r.group===group).reduce((n,r)=>n+r.equipmentCostTHB,0)),
  rows:freeze(rows.filter(r=>r.group===group))}))),
  equipmentCostTHB,budgetSellTHB,proposedQuoteUSD,priorQuotedUSD,deltaUSD:proposedQuoteUSD-priorQuotedUSD,
  fxTHBPerUSD:fx,priceFactor:RELEASE_POLICY_0553.aAndC.priceFactor,
  rowRoundingResidualTHB:round(budgetSellTHB-rows.reduce((n,r)=>n+r.budgetSellTHB,0)),
  openSourceLines:freeze(["D-4","E-4"].map(code=>{const q=NEXTG.lines.find(x=>x.code===code);return freeze({code,partNo:q.partNumber,unitPrice:q.unitPrice,reason:"Dash is unpriced, not a verified zero. Region entitlement needs confirmation."});})),
  unselectedWarrantyLines:freeze(["D-7","D-8","E-7","E-8"].map(code=>{const q=NEXTG.lines.find(x=>x.code===code);return freeze({code,partNo:q.partNumber,unitPrice:q.unitPrice,description:q.description});})),
  calculationStatus:"SI_EQUIPMENT_BUDGET_CALCULATED",technicalStatus:"OEM_CONFIGURATION_AND_TERMS_REVIEW_OPEN",
  verifiedDirectCostTHB:null,customerIssueAllowed:false,selectedInCommercialOffer:false,postToPricing:false,
  qualification:"Equipment budget only. Region-key increments, optional warranty choice, dedicated IDU equivalence, licence terms, quote validity and additional delivery/insurance costs remain qualified. Reconcile B10/C2 physical stock before adopting or purchasing the scenario. D/E spare prices take precedence; fallback TAG comparables are not represented as independent OEM spare quotes."});
}
