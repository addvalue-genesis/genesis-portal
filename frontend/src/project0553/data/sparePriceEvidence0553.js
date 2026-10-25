// PJ2608-0553 / Source evidence register for B10/B11/B13/C1/C2.
// Historical prices are NOT supplier spare quotations and are NEVER posted.
// User-directed pre-award assessment: keep what is known, unknown, and incompatible apart.
import {REV08_BASELINE} from "./rev08CommercialBaseline";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";

const freeze=Object.freeze,round=n=>Math.round((n+Number.EPSILON)*100)/100;
const codes=freeze(["B10","B11","B13","C1","C2"]);
const evidence=freeze([
 freeze({id:"MDS-RACON-PACKAGE-20260922",code:"C1",name:"Complete marine RACON installed package",brand:"Tideland / ORGA",model:"SeaBeacon-2 System 6 Ex (X/S band)",partNo:"024439 (radar beacon)",installedTag:"MAR-514-001",quotedQty:1,quotedUnitUSD:75000,quotedUnitTHB:null,quoteBasis:"FCA Factory; complete installed package, not replacement spare",supplier:"MDS QTORG2609244 / 22-Sep-2026",sourceUrl:"https://drive.google.com/file/d/1Wjod3tJNvte2Wrc3p0fmj8-9i664pEMW/view",status:"INSTALLED_PACKAGE_ONLY__NOT_SPARE_QUOTE",warning:"Includes Ex control box, BFOU cables, DB-5P, glands, purge/programming and FAT/packing; not item-priced spare; variant, Ex and logistics must be confirmed against selected MGW configuration"}),
 freeze({id:"EXION-PHONE-2026",code:"C2",name:"Ex Zone 1 VoIP phone",brand:"Gai-Tronics",model:"Auteldac 6",partNo:"212-02-6008-510",installedTag:"TPH family — verify actual site TAG",quotedQty:4,quotedUnitUSD:null,quotedUnitTHB:145000,quoteBasis:"DDP Nonthaburi, excludes VAT; lot-only, no partial orders; offer validity 30 days",supplier:"EXION quotation 1260576 / 2026",sourceUrl:"https://drive.google.com/file/d/13iGJllNfjuw8iME2mXcddnmRTt4ov-mk/view",status:"INSTALLED_ITEM_COMPARABLE__NOT_SPARE_QUOTE",warning:"MGW PHONE-1 selected model is 212-02-6008-410, not -510; historic quote is lot-only and cannot evidence one replacement spare's price"}),
 freeze({id:"EXION-SOUNDER-2026",code:"C2",name:"Ex alarm sounder",brand:"EATON",model:"DB3B Ex sounder",partNo:"DB3BDG048N2BNR",installedTag:"LSE family — verify actual site TAG",quotedQty:4,quotedUnitUSD:null,quotedUnitTHB:62000,quoteBasis:"DDP Nonthaburi, excludes VAT; lot-only, no partial orders; offer validity 30 days",supplier:"EXION quotation 1260576 / 2026",sourceUrl:"https://drive.google.com/file/d/13iGJllNfjuw8iME2mXcddnmRTt4ov-mk/view",status:"INSTALLED_ITEM_COMPARABLE__NOT_SPARE_QUOTE",warning:"MGW PHONE-1 quotes DB3B family only; confirm exact voltage/Ex part and kit inclusion; historical 4-piece lot price not a one-piece spare quotation"}),
 freeze({id:"MGW-MR0002-SURGE-2026",code:"B10",name:"MR0002 RF surge protector supplied within installed equipment",brand:"PolyPhaser",model:"IS-B50LN-C2",partNo:"IS-B50LN-C2",installedTag:"MR0002 surge TAGs — exact site match pending",quotedQty:null,quotedUnitUSD:null,quotedUnitTHB:null,quoteBasis:"Included in MGW UHF-2 installation bundle; no independent spare rate",supplier:"MGW P26-058_R2 / UHF-2",sourceUrl:null,status:"PART_A_INCLUDED__NOT_INDEPENDENT_SPARE",warning:"Do not assume all MR0001 RF surge protectors use this part; no B10 or C2 duplicate posting"})
]);
const historical=freeze(codes.flatMap(code=>(REV08_BASELINE.detail[code]||[]).map(([name,qty,rate],i)=>
 freeze({id:code+"-REV08-"+String(i+1).padStart(2,"0"),code,name,historicalQty:qty,historicalUnitUSD:rate,
 historicalTotalUSD:round(qty*rate),actualRequiredQty:null,verifiedOemSparePartNo:null,
 currentSupplierSpareQuoteUSD:null,commercialReleaseAllowed:false,
 status:"HISTORICAL_CANDIDATE_ONLY__NOT_SELECTED_ITEM_NOT_QUOTED"}))));
function grossHistorical(code){
 return round((REV08_BASELINE.detail[code]||[]).reduce((s,[,q,r])=>s+q*r,0));
}
const overlapRules=freeze([
 freeze({family:"PoE injector",b10:"Spare DC PoE injector",c2:"SCADA DC PoE operating spare"}),
 freeze({family:"Cisco power module",b10:"Spare Cisco power module",c2:"Cisco power operating spare"}),
 freeze({family:"RF surge",b10:"RF surge spare",c2:"RF surge operating spares"}),
 freeze({family:"Ethernet surge",b10:"Ethernet surge spare",c2:"Ethernet surge operating spares"}),
 freeze({family:"RF Type N connector",b10:"RF Type N male spare connector",c2:"N-male termination spares"}),
 freeze({family:"M20 gland",b10:"M20 gland spare complete set",c2:"M20 complete gland spares"}),
 freeze({family:"Protection fuse",b10:"Protection fuse spare",c2:"Operating fuse spares"})
]);
export function selectSparesPriceEvidence0553(){
 const c1InstalledPackageCostUSD=MR0004_WORKING_BOM_0553.quotePackageUSD;
 if(c1InstalledPackageCostUSD!==75000)throw Error("Changed RACON installed package cost: re-qualify the C1 comparable");
 const c1CurrentOptionalReference=freeze({
  id:"C1-PTTEP-01",selectedPlanQty:1,qtyAuthority:"CURRENT_OPTION_PLANNING_QTY__NOT_CLIENT_MANDATORY",
  referenceKind:"NONPOSTING_INSTALLED_PACKAGE_COMPARABLE__NOT_SPARE_QUOTE",
  referenceFcaUnitUSD:c1InstalledPackageCostUSD,fxTHBPerUSD:31.5,
  indicativeInstalledPackageTHB:round(c1InstalledPackageCostUSD*31.5),
  indicativeFullReplacementSellScenarioTHB:round(c1InstalledPackageCostUSD*31.5*1.30),
  indicativeFullReplacementSellScenarioUSD:round(c1InstalledPackageCostUSD*1.30),
  vendorSpareQuoteUSD:null,approvedSpareQty:null,approvedCustomerSellUSD:null,
  releaseAllowed:false,includesAlreadySuppliedComponents:true,
  costOwner:"C1_OPTION_ONLY_NONPOSTING",pricingNote:"Budget only: full FCA installed package cost comparator x existing A/C price factor 1.30, not separately priced replacement spare; packing, freight, Ex/variant and existing Part A component credits unresolved"
 });
 const c2Historical=freeze({
  referenceUSD:grossHistorical("C2"),
  referenceKind:"REV08_OLDER_SELL_REFERENCE__NOT_CURRENT_SUPPLIER_COST_OR_QUOTATION",
  historicalCandidateLines:historical.filter(x=>x.code==="C2").length,
  budgetaryStockQtyApproved:false,
  verifiedSpareSkuRows:0,
  approvedCurrentOptionSellUSD:null,
  releaseAllowed:false,
  constraints:"Exclude actual B10 commissioning items under MR Attachment 7 instruction 6; 7/8-inch legacy feeder is not MGW quoted 1/2-inch feeder. Do not subtract functionally similar parts until compatible physical SKU and ownership are proven.",
 });
 const duplicated=freeze(overlapRules.map(r=>{
  const a=historical.find(x=>x.code==="B10"&&x.name===r.b10),b=historical.find(x=>x.code==="C2"&&x.name===r.c2);
  if(!a||!b)throw Error("Historic B10/C2 screening reference changed "+r.family);
  return freeze({family:r.family,b10Id:a.id,c2Id:b.id,
   historicalC2ExposureUSD:b.historicalTotalUSD,actualSkuIdentical:null,
   removalApproved:false,needsSkuAndOwnerReconciliation:true,
   action:"MR Attachment 7 instruction 6 — exclude the corresponding actual commissioning-spare line from the 2-year spare offer"});
 }));
 for(const code of codes){
  const source=REV08_BASELINE.summary.find(x=>x[0]===code)?.[2];
  if(!Number.isFinite(source)||Math.abs(grossHistorical(code)-source)>0.02)
   throw Error("Historical spare-source price sum changed "+code);
 }
 return freeze({moduleId:"bid.budget.working.bc.spare-price-evidence",historical,evidence,
  byCode:Object.freeze(Object.fromEntries(codes.map(code=>[code,freeze(historical.filter(x=>x.code===code))]))),
  directComparablesByCode:Object.freeze(Object.fromEntries(codes.map(code=>[code,freeze(evidence.filter(x=>x.code===code))]))),
  historicalGrossByCode:Object.freeze(Object.fromEntries(codes.map(code=>[code,grossHistorical(code)]))),
  c1CurrentOptionalReference,c2Historical,duplicates:duplicated,
  dataAuthority:"MR0001–MR0004 Rev.C1 Attachment 5/7/8; EXA-A8 Att-1/2; Rev08 historical; selected MDS, MGW and EXION evidence",
  customerPriceAuthority:false,independentSupplierSparePriceEstablished:false,
  sourceToWorkingOnly:true,additionalPostingAllowed:false,
  noUnverifiedQtyInOfficialRelease:true});
}
