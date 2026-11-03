import {selectC2CustomerSchedule0553} from "./c2CustomerSchedule0553";
import {selectOptionBudgetaryOffer0553} from "./optionBudgetaryOffer0553";
// Read-only review of the twelve existing C2 price references. Equipment TAG
// associations are candidates, never proof of compatible spare SKU or stock.
import {selectSparePricedBudgetReview0553} from "./sparePricedBudgetReview0553";
import {selectSpareCoverageEngineering0553} from "./spareCoverageEngineering0553";
import {selectSparesPriceEvidence0553} from "./sparePriceEvidence0553";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import EXION from "./quotes/EXION-1260576-R0.current.json";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {selectMGWR2Selected0553} from "./mgwP26058R2Selected0553";
import {C2_CAT6A_DRUM_DECISION_0553 as cableDrum} from "./c2Cat6aDrumDecision0553";
import {C2_RF_DRUM_DECISION_0553 as rfDrum} from "./c2RfDrumDecision0553";
import {CSS_RF_CABLE_REFERENCES_0553} from "./cssRfCableReferences0553";
const freeze=Object.freeze;
const mr1=x=>x.mr==="MR-0001",mr2=x=>x.mr==="MR-0002",mr3=x=>x.mr==="MR-0003",mr4=x=>x.mr==="MR-0004";
const idu=x=>mr1(x)&&/^MR-.*A$/.test(x.tag),lan=x=>mr1(x)&&/^LAN-/.test(x.tag);
const cabinet=x=>/^TCAB-/.test(x.tag),dmrAntenna=x=>mr2(x)&&/^ANT-/.test(x.tag);
const ref=(partNo,source,note)=>freeze({partNo,source,note,spareRateConfirmed:false});
const historicalDescriptions=freeze([
 "SCADA DC PoE operating spare","Cisco power operating spare","Explosion-proof IP phone spare","Sounder spare",
 "RF surge operating spares","Ethernet surge operating spares","RACON distribution box spare","Operating fuse spares",
 "7/8-inch RF cable operating spare (m)","CAT6A data cable operating spare (m)","N-male termination spares","M20 complete gland spares"
]);
export function selectC2TagReview0553(){
 const source=selectSparePricedBudgetReview0553().rows.C2,customer=selectC2CustomerSchedule0553();
 const offer=selectOptionBudgetaryOffer0553().offers.C2,activeIds=new Set(offer.rows.map(x=>x.id));
 const installed=selectSpareCoverageEngineering0553().installed;
 const evidence=selectSparesPriceEvidence0553();
 const phone=EXION.lines.find(x=>x.code==="1"),horn=EXION.lines.find(x=>x.code==="2");
 const psu=MR0001_WORKING_PRICED_BOM.cisco.items.find(x=>x.quoteLine==="1.1");
 const feeder=selectMGWR2Selected0553("UHF-4");
 const definitions=[
  ["SCADA DC PoE operating spare",idu,["C1-SI-INDOOR"],
   ref("PS-DCDC-HAZ-POE-IND-01","Next G D-5/E-5","Spare-rate reference exists; reassess quantity and separate B10/C1/C2 stock"),
   "ตรวจ PoE รุ่น/กำลัง/ไฟเข้า และ stock B10/C1 ก่อนกำหนดจำนวน C2"],
  ["Cisco power operating spare",lan,["C1-SI-L3"],
   ref(psu.sku,MR0001_WORKING_PRICED_BOM.cisco.sourceQuote,"Installed PSU rate only; C1 switch package already includes a PSU"),
   "ตรวจ PSU ของ Switch 8-port และแยก stock จาก B10/C1; ไม่บวกทั้งชุด Switch"],
  ["Explosion-proof IP phone spare",x=>mr3(x)&&x.tag==="TPH-504-001",[],
   ref(phone.sku,"EXION "+EXION.quotation+" "+EXION.revision,"Selected Part A model; expired four-unit lot price, no partial orders; not a confirmed one-spare quote"),
   "ใช้ Auteldac 6 -510 ตาม EXION ที่เลือก; ยืนยันราคาอะไหล่หนึ่งเครื่องและเงื่อนไข lot"],
  ["Sounder spare",x=>mr3(x)&&x.tag==="LSE-504-001",[],
   ref(horn.sku,"EXION "+EXION.quotation+" "+EXION.revision,"Selected sounder reference; verify voltage/Ex variant and one-piece lot terms"),
   "ตรวจรหัส EATON DB3B, แรงดันและ Ex ให้ตรง; ยืนยันราคาสำรองแยกจาก lot ติดตั้ง"],
  ["RF surge operating spares",x=>mr1(x)&&/^SA-/.test(x.tag)||mr2(x)&&x.functionRole==="RF_SURGE_EXD",[],
   ref("IS-B50LN-C2 (MR0002 candidate only)","MGW UHF-2","Quoted installed RF bundle, not a universal SCADA/DMR spare or independent unit price"),
   "แยก RF band/connector/Ex ตาม MR และตรวจรายการ B10; ห้ามถือว่า SA ทุก TAG ใช้รุ่นเดียวกัน"],
  ["Ethernet surge operating spares",x=>mr1(x)&&/^SA-/.test(x.tag),[],
   ref("LP-POE-INL-IND-01 (candidate)","Next G A-8/B-8/C-8","Installed Ethernet/PoE surge candidate; separate from RF surge under the same parent TAG family"),
   "ระบุ Ethernet/PoE surge ต่างจาก RF surge และตรวจ B10; TAG เป็นอุปกรณ์อ้างอิงเท่านั้น"],
  ["RACON distribution box spare",x=>mr4(x)&&x.tag==="TCAB-514-001",["C1-SI-RACON"],
   ref("DB-5P","MDS QTORG2609244","Included in C1 complete RACON scenario; no standalone 2026 replacement rate"),
   "ขอ OEM ยืนยันเหตุผลและราคา DB-5P สำหรับสองปี; C1 เป็นทางเลือก จึงห้ามหัก C2 อัตโนมัติ และห้ามคิด stock ชุดเดียวซ้ำ"],
  ["Operating fuse spares",x=>lan(x)||cabinet(x),[],
   ref(null,"OEM wiring/BOM required","Parent equipment TAG only; fuse rating and exact protected circuit are unknown"),
   "แยก fuse ตามชนิด/กระแส/แรงดันจาก wiring และตรวจ B10; จำนวน 8 เดิมยังไม่ยืนยัน"],
  ["RF feeder operating-spare cable",dmrAntenna,[],
   ref(rfDrum.partNo,rfDrum.historicalQuote,"Owner-selected CSS CommScope1/2-inch305m drum at historical THB550/m. Selected installed FORLLER UHF-4 remains unchanged; technical equivalence, connectors and factory packing still require confirmation."),
   "เสนอ CSS CommScope LDF4RK-50A1/2 นิ้ว 1Drum305m; ตรวจเทียบสาย FORLLER ที่ติดตั้ง การสูญเสีย RF หัวต่อ ข้อกำหนดไฟ/สิ่งแวดล้อม และบรรจุภัณฑ์"],
  ["CAT6A data cable operating spare",x=>lan(x)||idu(x),[],
   ref(null,cableDrum.historicalQuote,"Owner selects TECKNIKABEL CAT6A S/FTP GSWB SHF1, one300m drum; THB650/m is planning cost, not a new supplier quote. Final SKU/technical compatibility and factory drum size unconfirmed."),
   "แยก stock C2 ทั้ง Drum300m จากวัสดุติดตั้ง A/field bulk และ B13; ยืนยันรุ่น บรรจุภัณฑ์และราคาปัจจุบัน"],
  ["Type N male RF connector operating spares",dmrAntenna,[],
   ref(null,"MGW UHF-4 connector inclusion / approved feeder SKU","Connector type, cable OD and 50-ohm compatibility still require exact SKU"),
   "จับคู่ขนาด feeder/หัวต่อและตรวจ B10; ห้ามใช้ Type N ทั่วไปแทนกันโดยไม่ตรวจรุ่น"],
  ["M20 cable gland operating spares",cabinet,[],
   ref(null,"Ex assembly certificate / cable-end register","M20 thread alone does not establish cable OD, seal range or Ex compatibility"),
   "อ้างอิง TAG ตู้และเลือกตาม cable OD/Ex; แยก stock สำรองจาก glands ติดตั้งและ B10"]
 ];
 if(source.length!==definitions.length)throw Error("C2 TAG review must retain all twelve historical identities");
 const rows=source.map((r,i)=>{
  if(r.id!=="C2-REV08-"+String(i+1).padStart(2,"0")||r.description!==historicalDescriptions[i])
   throw Error("C2 source identity/description changed; reassess exact TAG mapping "+r.id);
  const [description,match,c1Refs,partReference,action]=definitions[i];
  const tags=installed.filter(match).map(x=>freeze({key:x.key,mr:x.mr,site:x.site,tag:x.tag,source:x.source}));
  if(!tags.length)throw Error("C2 reference TAG source missing "+r.id);
  const b10=evidence.duplicates.filter(x=>x.c2Id===r.id).map(x=>x.b10Id);
  return freeze({id:r.id,item:String(i+1),historicalDescription:r.description,description,
   tagRefs:freeze(tags),partReference,c1Refs:freeze(c1Refs),b10Refs:freeze(b10),action,
   quantity:r.quantity,unit:r.unit,unitPriceTHB:r.unitPriceTHB,extendedTHB:r.extendedTHB,
   sourceDocument:r.sourceDocument,sourceId:r.id,quantityApproved:false,
   offered:activeIds.has(r.id),ownerExcluded:!activeIds.has(r.id),
   suitabilityStatus:i===6?"OWNER_EXCLUDED_FROM_C2":"CONDITIONAL_MAINTENANCE_SPARE_CANDIDATE",
   suitabilityReason:i===6?"Owner excluded this additional DB-5P spare on 03-Nov-2026; retained only as historical reference. Included Part A / C1 components remain unchanged.":
    "Function is a plausible maintenance spare; exact OEM compatibility, two-year quantity, current rate and B10 exclusion still require evidence.",
   rateReconciliation:i===0?freeze({supplier:NEXTG.quoteNumber,
    sourceLines:freeze(["D-5","D-6","E-5","E-6"]),
    poeCostUSD:NEXTG.lines.find(x=>x.code==="D-5").unitPrice,
    cordCostUSD:NEXTG.lines.find(x=>x.code==="D-6").unitPrice,
    existingC2RateReplaced:false,decision:"Current supplier spare-rate evidence exists; reconcile exact SKU, scope and terms against the historic C2 budget before selecting a new rate."}):null,
   currentOemSpareRateVerified:false,twoYearQuantityVerified:false,
   tagMappingStatus:"REFERENCE_EQUIPMENT_ONLY__OEM_SKU_AND_POOLING_OPEN",
   ...(activeIds.has(r.id)?{description:customer[r.id].description,tagRefs:customer[r.id].tagRefs}:{}),
   stockRemovalApproved:!activeIds.has(r.id),postToPricing:false,customerIssueAllowed:false});
 });
 return freeze({rows:freeze(rows),rfCableReferences:CSS_RF_CABLE_REFERENCES_0553,historicalSubtotalTHB:selectSparePricedBudgetReview0553().totals.C2,
  currentOfferUSD:offer.budgetaryQuoteUSD,selectedSubtotalTHB:offer.sourceSellTHB,
  quotedRowCount:offer.rows.length,excludedRows:offer.excludedRows,ownerStockDecision:offer.ownerStockDecision,
  b10PotentialRows:rows.filter(x=>x.offered&&x.b10Refs.length).length,
  c1PotentialRows:rows.filter(x=>x.offered&&x.c1Refs.length).length,
  tagPolicy:"Reference equipment TAG + site + OEM spare part number; cable endpoints or parent enclosure TAG for untagged parts",
  independentJustificationRows:freeze(rows.filter(x=>x.suitabilityStatus==="INDEPENDENT_JUSTIFICATION_REQUIRED").map(x=>x.id)),
  firmPurchaseRecommendationComplete:false,allCurrentOemRatesVerified:false,
  fullSystemCoverageConfirmed:false,postToPricing:false,customerIssueAllowed:false});
}
