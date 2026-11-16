// PJ2608-0553 — ADDITIONAL proposal for brownfield ZPQ / ZWP8 / ZWP11.
// Read-only. Does not post into the original Scope of Supply, the selected
// B3 working sell, or the release commercial model.
import {selectB3SelectedSatSurveyPrice0553} from "./b3SelectedSatSurveyPrice0553";
import {selectB9ChinaWorkingBudget0553} from "./b9ChinaWorkingBudget0553";
import {selectB3MgwPurchasedFatWorkingSell0553} from "./b3MgwPurchasedFatWorkingSell0553";
import {PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {OFFICIAL_WORKBOOK_TEMPLATE_0553} from "./officialWorkbookTemplate0553";
import {RELEASE_CUSTOMER_COLUMNS_0553,buildReleaseCommercialModel0553} from "./releaseCommercialModel0553";
import {MR0001_SITE_CLASSIFICATION} from "./mr0001SiteClassification";
import {MR0003_MR0004_SCOPE_C1} from "./mr0003Mr0004ScopeC1";
import {MR0002_BDA_DEVIATION_REV00_0553} from "./mr0002DeviationBdaRev00_0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";

export const B3BF_JUTAL_NOTE_0553="Note: Installation and cable routing are by the Jutal team. / งานติดตั้งและเดินสายโดยทีม Jutal";
export const B3BF_LAST_LINE_NOTE_0553="Note: Working days on the Greenfield/base B3 scope have been reduced by 5 working days. / ปรับลดวันทำงานไปที่ Greenfield/base B3 ลดลง 5 วันทำงาน";
export const B3BF_NET_CALENDAR_DAYS_0553=14;
export const B3BF_CARVEOUT_DAYS_0553=5;
export const B3BF_BROWNFIELD_SITES_0553=Object.freeze(["ZPQ","ZWP8","ZWP11"]);
export const B3BF_INSTALLER_0553="Jutal team (installation and cable routing)";
const NOT_IN_SCOPE="Not in scope (greenfield ZWP20-23)";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const freeze=value=>{
 if(value&&typeof value==="object"&&!Object.isFrozen(value)){
  Object.values(value).forEach(freeze);Object.freeze(value);
 }
 return value;
};
// Site JB column for this additional proposal. ZWP8 / ZWP11 enclosure tags are
// checked against the MTO rows below. ZPQ has no enclosure row in that MTO;
// the existing-rack statement is the proposal JB column, not a new supply price.
const JB_BY_SITE={
 ZPQ:{state:"existing",text:"Existing rack TCAB-LQM-202-002 (JB: existing)"},
 ZWP8:{state:"new",text:"New JB TCAB-500-003 (JB: yes, new)"},
 ZWP11:{state:"OPEN",text:"OPEN — BOD §8 says existing TCAB-WP11-500-003; MTO says new"}
};
const snapshot=fn=>JSON.stringify(fn());

function brownfieldA1Rows(){
 const sites=new Set(B3BF_BROWNFIELD_SITES_0553);
 const source=MTO.itemRows.filter(row=>sites.has(row.platform));
 if(source.length!==12)throw Error("Brownfield A1 MTO row count changed");
 for(const site of B3BF_BROWNFIELD_SITES_0553){
  if(MR0001_SITE_CLASSIFICATION.sites[site]?.type!=="BROWNFIELD")
   throw Error("A1 site is not classified brownfield: "+site);
 }
 if(!source.some(row=>row.platform==="ZWP8"&&row.sourceItemCodes.includes("TCAB-500-003")))
  throw Error("ZWP8 MTO is missing TCAB-500-003");
 if(!source.some(row=>row.platform==="ZWP11"&&row.sourceItemCodes.includes("TCAB-500-003")))
  throw Error("ZWP11 MTO is missing TCAB-500-003");
 return source.map((row,index)=>{
  const tags=row.sourceItemCodes.slice();
  const jb=JB_BY_SITE[row.platform];
  return {
   sn:"A1."+(index+1),mr:"MR-0001",site:row.platform,
   tags,
   tagText:row.sourcePartText==null?"":String(row.sourcePartText),
   description:row.sourceDescription==null?"":String(row.sourceDescription),
   qtyText:row.sourceQuantityText==null?"":String(row.sourceQuantityText),
   unitText:row.sourceUnit==null?"":String(row.sourceUnit),
   supplyBy:"Base A1",status:"Supplied under base",priceTHB:null,
   jbState:jb.state,jbText:jb.text,installer:B3BF_INSTALLER_0553,
   sourceRowIndex:row.sourceRowIndex,
   source:"MR0001 MTO Rev04 row "+row.sourceRowIndex
  };
 });
}
function otherPartA(){
 const brownfield=new Set(B3BF_BROWNFIELD_SITES_0553);
 const dtrsSites=Z1F_TEL_LAYOUT_INDEX_0553.byWP
  .filter(wp=>wp.equipment.some(item=>item.system==="DTRS_TRUNK_RADIO")).map(wp=>wp.wp);
 const lnaSites=Object.keys(MR0002_BDA_DEVIATION_REV00_0553.originalRequirement.afcLnaTagBySite);
 const phone=MR0003_MR0004_SCOPE_C1.systems.find(system=>system.mr==="MR0003");
 const racon=MR0003_MR0004_SCOPE_C1.systems.find(system=>system.mr==="MR0004");
 const hits=sites=>sites.filter(site=>brownfield.has(site));
 if(!phone||!racon||hits(dtrsSites).length||hits(lnaSites).length||hits(phone.sites).length||hits(racon.sites).length)
  throw Error("A2–A4 brownfield supply appeared in the source registers");
 if(lnaSites.slice().sort().join(",")!=="ZWP20,ZWP21,ZWP22")
  throw Error("LNA/BDA site list is not ZWP20/21/22");
 return [
  {sn:"A2",mr:"MR-0002",title:"MR-0002 DMR",
   description:"Listed at "+dtrsSites.join(", ")+". No new LNA/BDA supply at ZPQ, ZWP8 or ZWP11. LNA/DMR amplifier is only at "+lnaSites.join("/")+" per BLD-0001 Rev.C1 and BOD-0001 §7.4.",
   status:NOT_IN_SCOPE,priceTHB:null},
  {sn:"A3",mr:"MR-0003",title:"MR-0003 Telephone / sounder",
   description:"Listed at "+phone.sites.join(", ")+". No Ex-Telephone supply at the brownfield platforms.",
   status:NOT_IN_SCOPE,priceTHB:null},
  {sn:"A4",mr:"MR-0004",title:"MR-0004 Marine RACON",
   description:"Listed at "+racon.sites.join(", ")+".",
   status:NOT_IN_SCOPE,priceTHB:null}
 ];
}
function customerScopeName0553(code){
 const rows=OFFICIAL_WORKBOOK_TEMPLATE_0553.sheets.find(sheet=>sheet.name==="Scope of supply")?.rows||[];
 return rows.find(row=>row[1]===code)?.[2]||code;
}
function baseCustomerPreview0553(release){
 const partA=(release.a||[]).map(part=>({
  code:part.code,mr:part.mr,description:part.description,
  locations:[...new Set((part.sourceRows||[]).map(row=>row.site).filter(Boolean))]
 }));
 const b3=(release.b||[]).find(row=>row.code==="B3");
 const name=customerScopeName0553("B3");
 if(partA.length!==4||partA.some(part=>!part.description||!part.locations.length)||
    name==="B3"||!b3?.executionActivities?.releaseText||!b3.serviceCommercialBasis?.compactText)
  throw Error("Base Scope of Supply preview is missing Part A locations or the B3 description");
 return {source:"buildReleaseCommercialModel0553",partA,b3:{name,releaseText:b3.executionActivities.releaseText,compactText:b3.serviceCommercialBasis.compactText}};
}
function referencePartB(){
 return PART_BC_WBS_SOURCE_0553.summary.filter(row=>/^B\d+$/.test(row.code)).map(row=>({
  code:row.code,priceTHB:null,customerDescription:customerScopeName0553(row.code),
  note:row.code==="B3"?"Original quotation, unchanged":"Reference base scope"
 }));
}
function build(){
 const satBefore=snapshot(selectB3SelectedSatSurveyPrice0553);
 const chinaBefore=snapshot(selectB9ChinaWorkingBudget0553);
 const purchasedBefore=snapshot(selectB3MgwPurchasedFatWorkingSell0553);
 const sat=selectB3SelectedSatSurveyPrice0553();
 const china=selectB9ChinaWorkingBudget0553();
 const purchased=selectB3MgwPurchasedFatWorkingSell0553();
 const senior=sat.satRoleRates[0],specialist=sat.satRoleRates[1];
 const days=B3BF_NET_CALENDAR_DAYS_0553;
 const fxTHBPerUSD=sat.fxTHBPerUSD;
 const teamDayTHB=sat.satTeamDaySellTHB;
 const teamDayUSD=round(senior.usdPerPersonDay+specialist.usdPerPersonDay);
 const seniorLineTHB=round(days*senior.thbPerPersonDay);
 const specialistLineTHB=round(days*specialist.thbPerPersonDay);
 const seniorLineUSD=round(days*senior.usdPerPersonDay);
 const specialistLineUSD=round(days*specialist.usdPerPersonDay);
 const proposalTHB=round(days*teamDayTHB);
 const proposalUSD=round(days*teamDayUSD);
 const mobPersons=2,mobTrips=1,mobUsdPerPersonTrip=1000;
 const mobUSD=round(mobPersons*mobTrips*mobUsdPerPersonTrip);
 const mobTHB=round(mobUSD*fxTHBPerUSD);
 const grandTotalTHB=round(proposalTHB+mobTHB);
 const grandTotalUSD=round(proposalUSD+mobUSD);
 const baseB3WorkingSellTHB=round(sat.includedB3SatSurveyToolsWorkingSellTHB+china.fatWorkingSellTHB+purchased.selectedIncrementalWorkingSellTHB);
 const carveC1THB=sat.siteSurveyWorkingSellTHB;
 const carveC2THB=round(B3BF_CARVEOUT_DAYS_0553*teamDayTHB);
 if(fxTHBPerUSD!==31.5||senior.usdPerPersonDay!==1000||specialist.usdPerPersonDay!==800||
    senior.thbPerPersonDay!==31500||specialist.thbPerPersonDay!==25200||teamDayTHB!==56700||
    teamDayUSD!==1800||seniorLineUSD!==14000||specialistLineUSD!==11200||proposalUSD!==25200||
    round(senior.usdPerPersonDay*fxTHBPerUSD)!==senior.thbPerPersonDay||
    round(specialist.usdPerPersonDay*fxTHBPerUSD)!==specialist.thbPerPersonDay||
    round(teamDayUSD*fxTHBPerUSD)!==teamDayTHB||round(proposalUSD*fxTHBPerUSD)!==proposalTHB||
    round(seniorLineUSD*fxTHBPerUSD)!==seniorLineTHB||round(specialistLineUSD*fxTHBPerUSD)!==specialistLineTHB||
    seniorLineTHB!==441000||specialistLineTHB!==352800||proposalTHB!==793800||
    round(seniorLineTHB+specialistLineTHB)!==proposalTHB||
    mobUSD!==2000||mobTHB!==63000||grandTotalTHB!==856800||grandTotalUSD!==27200||
    round(mobUSD*fxTHBPerUSD)!==mobTHB||round(grandTotalUSD*fxTHBPerUSD)!==grandTotalTHB||
    sat.satTeamDays!==28||sat.satWorkingSellTHB!==1587600||sat.siteSurveyTeamDays!==5||
    carveC1THB!==252000||carveC2THB!==283500||sat.veexWorkingSellTHB!==30000||
    china.fatWorkingSellTHB!==452850||purchased.selectedIncrementalWorkingSellTHB!==0||
    baseB3WorkingSellTHB!==2322450)
  throw Error("B3 brownfield additional price does not match the read-only B3 basis");
 const baseCustomerPreview=baseCustomerPreview0553(buildReleaseCommercialModel0553());
 if(satBefore!==snapshot(selectB3SelectedSatSurveyPrice0553)||
    chinaBefore!==snapshot(selectB9ChinaWorkingBudget0553)||
    purchasedBefore!==snapshot(selectB3MgwPurchasedFatWorkingSell0553))
  throw Error("Brownfield additional proposal mutated an existing B3 price source");
 const a1Rows=brownfieldA1Rows();
 const bomLines=[
  {id:"BF.1.1",kind:"role",activity:senior.role,persons:1,days,unit:"man-day",
   usdPerPersonDay:senior.usdPerPersonDay,fxTHBPerUSD,
   unitRateTHB:senior.thbPerPersonDay,unitRateUSD:senior.usdPerPersonDay,
   totalTHB:seniorLineTHB,totalUSD:seniorLineUSD,countsInSubtotal:true,
   remarks:"Existing SAT role rate",officialRemarks:"Included in B3-BF"},
  {id:"BF.1.2",kind:"role",activity:specialist.role,persons:1,days,unit:"man-day",
   usdPerPersonDay:specialist.usdPerPersonDay,fxTHBPerUSD,
   unitRateTHB:specialist.thbPerPersonDay,unitRateUSD:specialist.usdPerPersonDay,
   totalTHB:specialistLineTHB,totalUSD:specialistLineUSD,countsInSubtotal:true,
   remarks:"Existing SAT role rate",officialRemarks:"Included in B3-BF"},
  {id:"BF.1.3",kind:"check",internalOnly:true,activity:"Team-day check: 2 persons × 14 days",persons:2,days,unit:"team-day",
   usdPerPersonDay:teamDayUSD,fxTHBPerUSD,
   unitRateTHB:teamDayTHB,unitRateUSD:teamDayUSD,totalTHB:null,totalUSD:null,countsInSubtotal:false,
   remarks:"(= BF.1.1 + BF.1.2) — not a second charge"},
  {id:"BF.1.4",kind:"mob",activity:"Mobilisation / demobilisation (ticket + POB), 2 persons × 1 trip",persons:mobPersons,trips:mobTrips,days:null,unit:"trip",
   usdPerPersonTrip:mobUsdPerPersonTrip,fxTHBPerUSD,
   unitRateTHB:round(mobUsdPerPersonTrip*fxTHBPerUSD),unitRateUSD:mobUsdPerPersonTrip,
   totalTHB:mobTHB,totalUSD:mobUSD,countsInSubtotal:false,includedInAdditional:true,
   officialRemarks:"Included in B3-BF",
   remarks:"Jack instruction 2026-11-16, USD 1,000/person/trip. Ticket + POB. Not the survey MOB labour already in base B3.",
   unpricedRemarks:"Jack instruction 2026-11-16. Ticket + POB. Not the survey MOB labour already in base B3."},
  {id:"BF.INFO",kind:"info",internalOnly:true,activity:"Greenfield/base B3 reduced by 5 working days",
   countsInSubtotal:false,unitRateTHB:null,totalTHB:null,
   remarks:"Carve-out basis OPEN. No price effect in this proposal. Base B3 is not modified."},
  {id:"BF.JUTAL",kind:"note",text:B3BF_JUTAL_NOTE_0553,countsInSubtotal:false,totalTHB:null},
  {id:"BF.NOTE",kind:"note",text:B3BF_LAST_LINE_NOTE_0553,countsInSubtotal:false,totalTHB:null}
 ];
 if(bomLines.some(line=>line.id==="BF.1.5"||line.id==="BF.1.6"||line.id==="BF.1.7"))
  throw Error("Boat, POB and installation rows must not remain in the breakdown");
 if(bomLines.at(-2).text!==B3BF_JUTAL_NOTE_0553||bomLines.at(-1).text!==B3BF_LAST_LINE_NOTE_0553)
  throw Error("B3 brownfield BOM last line note missing");
 const pricedBom=bomLines.filter(line=>line.countsInSubtotal);
 if(round(pricedBom.reduce((sum,line)=>sum+line.totalTHB,0))!==proposalTHB)
  throw Error("B3 brownfield BOM subtotal is not the 14 team-day price");
 const siteRows=B3BF_BROWNFIELD_SITES_0553.map((site,index)=>{
  const radio=a1Rows.find(row=>row.site===site&&row.tags.some(tag=>tag.startsWith("MR-")||tag.startsWith("ANT-")));
  return {
   sn:"BF.2."+(index+1),site,days:null,daysDisplay:"OPEN",priceTHB:null,
   description:(radio?radio.tagText:site)+" — split of the 14 calendar days is to be confirmed",
   jbText:JB_BY_SITE[site].text,installer:B3BF_INSTALLER_0553
  };
 });
 const partB=referencePartB();
 if(partB.length!==14||partB.some(row=>row.priceTHB!==null)||!partB.some(row=>row.code==="B3"&&row.note==="Original quotation, unchanged"))
  throw Error("Part B reference lines must stay unpriced");
 const openItems=[
  {id:"mob",topic:"MOB/DEMOB",detail:"Ticket + POB is included at Jack instruction 2026-11-16, USD 1,000/person/trip, 2 persons × 1 trip. This is not the survey MOB labour already in base B3.",unpricedDetail:"Ticket + POB is included at Jack instruction 2026-11-16, 2 persons × 1 trip. This is not the survey MOB labour already in base B3."},
  {id:"pob",internalOnly:true,topic:"Accommodation / POB / medical / visa",detail:"Offshore POB, accommodation, meals, medical and offshore certificates are OPEN (TBA) and are not counted."},
  {id:"split",topic:"Per-site split",detail:"Split of the 14 calendar days across ZPQ, ZWP8 and ZWP11 is OPEN. This proposal prices the total only."},
  {id:"carve",topic:"Carve-out basis C1 vs C2",detail:"Carve-out basis is OPEN: C1 brownfield survey 5 team-days, or C2 five SAT team-days. Neither is applied to this proposal. Base B3 is not modified."},
  {id:"zwp11-jb",topic:"ZWP11 JB new vs existing",detail:"ZWP11 JB is OPEN. BOD §8 says existing TCAB-WP11-500-003. MTO says new TCAB-500-003."},
  {id:"termination",topic:"Termination owner",detail:"Termination owner is OPEN."},
  {id:"zpq-dmr",topic:"ZPQ DMR integration scope",detail:"ZPQ DMR integration scope is OPEN (MR-0002 §5 'To integrate with existing system')."},
  {id:"zpq-pabx",topic:"ZPQ PABX FXS for ZWP20-23",detail:"ZPQ PABX FXS interface for ZWP20, ZWP21, ZWP22 and ZWP23 is OPEN."},
  {id:"zpq-band",topic:"ZPQ radio DMR SLR5300 vs TETRA",detail:"Existing ZPQ radio DMR SLR5300 vs TETRA is OPEN. Confirm the band before LNA/BDA selection."},
  {id:"commissioning",topic:"Commissioning responsibility",detail:"Commissioning responsibility is OPEN (BOD §10.5 / SPE §7.3.3 vendor vs BOD §7.2 EPCI)."}
 ];
 return freeze({
  id:"PJ2608-0553-B3BF-ADDITIONAL",
  title:"Additional Proposal — B3 Brownfield: Inspection, Testing & Certification (ZPQ / ZWP8 / ZWP11)",
  context:"Additional proposal for brownfield ZPQ, ZWP8 and ZWP11. The original mixed quotation is unchanged.",
  currency:"THB",netCalendarDays:days,teamPersons:2,fxTHBPerUSD,
  teamDayTHB,teamDayUSD,proposalTHB,proposalUSD,
  mobPersons,mobTrips,mobUsdPerPersonTrip,mobTHB,mobUSD,
  seniorLineUSD,specialistLineUSD,seniorUsdPerDay:senior.usdPerPersonDay,specialistUsdPerDay:specialist.usdPerPersonDay,
  partATHB:0,partBReferencePriceTHB:null,grandTotalTHB,grandTotalUSD,
  excludesOpenItems:true,originalQuotationUnchanged:true,baseB3Modified:false,
  installer:B3BF_INSTALLER_0553,
  exclusion:"No new LNA/BDA and no Ex-Telephone supply at the brownfield platforms (ZPQ, ZWP8, ZWP11). LNA/DMR amplifier is only at ZWP20/ZWP21/ZWP22 per BLD-0001 Rev.C1 and BOD-0001 §7.4.",
  baseReadOnly:{
   fatTHB:china.fatWorkingSellTHB,surveyTHB:sat.siteSurveyWorkingSellTHB,
   satTHB:sat.satWorkingSellTHB,veexTHB:sat.veexWorkingSellTHB,
   purchasedIncrementalTHB:purchased.selectedIncrementalWorkingSellTHB,
   workingSellTHB:baseB3WorkingSellTHB,appliedChangeTHB:0
  },
  carveOut:{
   status:"OPEN",days:B3BF_CARVEOUT_DAYS_0553,appliedToProposal:false,appliedToBase:false,
   c1:{id:"C1",basis:"Brownfield survey 5 team-days",days:5,valueTHB:carveC1THB},
   c2:{id:"C2",basis:"5 of 28 SAT team-days",days:5,valueTHB:carveC2THB}
  },
  bomLines,jutalNote:B3BF_JUTAL_NOTE_0553,lastLineNote:B3BF_LAST_LINE_NOTE_0553,siteRows,a1Rows,
  otherPartA:otherPartA(),partB,openItems,baseCustomerPreview
 });
}
let cache=null;
export function selectB3BrownfieldAdditional0553(){
 if(!cache)cache=build();
 return cache;
}
const csvCell=value=>{
 const text=value==null?"":String(value);
 return /[",\n]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;
};
const money2=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
export function formatB3BrownfieldMoney0553(model,thbValue,usdValue,currency){
 const thb=money2(thbValue),usd=money2(usdValue);
 if(!thb&&!usd)return "";
 if(currency==="usd")return usd?usd+" USD":"";
 if(currency==="both")return thb&&usd?thb+" THB / "+usd+" USD":thb||usd;
 return thb;
}
// No ADDVALUE/PTTEP vendor-number helper exists in this repo. Client documents use
// MM-ZTK-1F-GEN-TEL-<doctype>-<seq>. Vendor numbering per 10008-STD-6-GEN-002-R02
// adds a vendor-package segment. ADV, QUO, 0001 and Rev.00 are assumptions.
export const B3BF_EXPORT_NAME_0553=Object.freeze({
 standard:"10008-STD-6-GEN-002-R02",
 country:"MM",projectField:"ZTK",phase:"1F",area:"GEN",
 vendorPackage:"ADV",discipline:"TEL",docType:"QUO",seq:"0001",revision:"00",
 open:Object.freeze(["vendorPackage ADV","docType QUO","seq 0001","revision 00"])
});
export function b3BrownfieldDocumentNumber0553(){
 const a=B3BF_EXPORT_NAME_0553;
 return `${a.country}-${a.projectField}-${a.phase}-${a.area}-${a.vendorPackage}-${a.discipline}-${a.docType}-${a.seq} Rev.${a.revision}`;
}
export function b3BrownfieldExportFileName0553({audience="official",extension}={}){
 const base=b3BrownfieldDocumentNumber0553();
 const named=audience==="internal"?base+"_INTERNAL":base;
 if(!extension)return named;
 const ext=String(extension).replace(/^\./,"").toLowerCase();
 if(ext==="doc"||ext==="docx")throw Error("10.3 customer preview exports Excel only; there is no Word helper to reuse");
 return named+"."+ext;
}
 const UNPRICED_LEAK=/793,?800|856,?800|63,?000|56,?700|31,?500|27,?200|25,?200|441,?000|352,?800|252,?000|283,?500|2,?322,?450|452,?850|1,?587,?600|14,?000|11,?200|1,?800|1,?000|(?:^|[^\d.,])800(?:[^\d]|$)|31\.5|\bUSD\b|\bTHB\b/;
export function selectB3BrownfieldOfficialSchedule0553(model,{priced=true,itemized=true,currency="thb"}={}){
 if(!model||model.id!=="PJ2608-0553-B3BF-ADDITIONAL")throw Error("Official schedule requires the additional-proposal model");
 void itemized;
 const preview=model.baseCustomerPreview;
 if(!preview?.partA||!preview.b3)throw Error("Official schedule requires the base customer preview");
 const show=n=>priced?formatB3BrownfieldMoney0553(model,n.thb,n.usd,currency):"";
 const line=(cells,kind="line")=>({kind,cells});
 const rows=[];
 rows.push(line(["Part A: BASIC","A部分：基本"],"section"));
 for(const part of preview.partA){
  const locations=part.locations.length?"Locations: "+part.locations.join(", "):"TBC";
  rows.push(line([part.code,part.mr,part.description,locations,"1 lot",priced?"Quoted":"",priced?"Quoted":"","Quoted"]));
 }
 rows.push(line(["Part B: OTHERS","B部分：其它"],"section"));
 const senior=model.bomLines.find(entry=>entry.id==="BF.1.1");
 const specialist=model.bomLines.find(entry=>entry.id==="BF.1.2");
 const roleBullet=(entry)=>{
  if(!priced)return "• "+entry.activity;
  if(currency==="usd")return "• "+entry.activity+" — "+money2(entry.unitRateUSD)+" USD/day × "+entry.days+" = "+money2(entry.totalUSD)+" USD";
  if(currency==="both")return "• "+entry.activity+" — "+money2(entry.unitRateTHB)+" THB/day ("+money2(entry.unitRateUSD)+" USD/day) × "+entry.days+" = "+money2(entry.totalTHB)+" THB / "+money2(entry.totalUSD)+" USD";
  return "• "+entry.activity+" — "+money2(entry.unitRateTHB)+" THB/day × "+entry.days+" = "+money2(entry.totalTHB)+" THB";
 };
 const teamBullet=priced?(currency==="usd"
  ?"• "+model.netCalendarDays+" team-days × "+money2(model.teamDayUSD)+" USD/team-day = "+money2(model.proposalUSD)+" USD"
  :currency==="both"
   ?"• "+model.netCalendarDays+" team-days × "+money2(model.teamDayTHB)+" THB/team-day = "+money2(model.proposalTHB)+" THB / "+money2(model.proposalUSD)+" USD"
   :"• "+model.netCalendarDays+" team-days × "+money2(model.teamDayTHB)+" THB/team-day = "+money2(model.proposalTHB)+" THB")
  :"• "+model.netCalendarDays+" team-days";
 const mob=model.bomLines.find(entry=>entry.id==="BF.1.4");
 const mobBullet=!priced?"• MOB/DEMOB (ticket + POB)"
  :currency==="usd"?"• MOB/DEMOB (ticket + POB): "+mob.persons+" persons × "+mob.trips+" trip × "+money2(mob.unitRateUSD)+" USD = "+money2(mob.totalUSD)+" USD"
  :currency==="both"?"• MOB/DEMOB (ticket + POB): "+mob.persons+" persons × "+mob.trips+" trip × "+money2(mob.unitRateUSD)+" USD = "+money2(mob.totalUSD)+" USD / "+money2(mob.totalTHB)+" THB"
  :"• MOB/DEMOB (ticket + POB): "+mob.persons+" persons × "+mob.trips+" trip × "+money2(mob.unitRateTHB)+" THB = "+money2(mob.totalTHB)+" THB";
 const bfSpec=[roleBullet(senior),roleBullet(specialist),teamBullet,mobBullet].join("\n");
 const additional=show({thb:model.grandTotalTHB,usd:model.grandTotalUSD});
 for(const row of model.partB){
  if(row.code==="B3"){
   rows.push(line(["B3","",preview.b3.name,"","1 lot","",priced?"Quoted":"","Quoted"]));
   rows.push(line(["B3-BF","","Brownfield inspection, testing & certification — additional",bfSpec,"1 lot",additional,additional,""]));
  }else rows.push(line([row.code,"",row.customerDescription,"","1 lot","",priced?"Quoted":"","Quoted"]));
 }
 rows.push(line(["Total Additional (B3-BF)","","","","","",show({thb:model.grandTotalTHB,usd:model.grandTotalUSD}),""],"total"));
 rows.push(line([model.jutalNote],"note"));
 rows.push(line([model.lastLineNote],"note"));
 const columns=priced?RELEASE_CUSTOMER_COLUMNS_0553.scope:[...RELEASE_CUSTOMER_COLUMNS_0553.scope.slice(0,5),RELEASE_CUSTOMER_COLUMNS_0553.scope[7]];
 return Object.freeze({columns,rows:Object.freeze(rows),project:"ZAWTIKA DEVELOPMENT PROJECT PHASE 1F",title:"Scope of supply"});
}
export function buildB3BrownfieldAdditionalCsv0553(model,{priced,itemized,version="internal",currency="thb"}={}){
 if(!model||model.id!=="PJ2608-0553-B3BF-ADDITIONAL")throw Error("Brownfield CSV requires the additional-proposal model");
 const official=version==="official";
 if(official){
  const schedule=selectB3BrownfieldOfficialSchedule0553(model,{priced,itemized,currency});
  const drop=cells=>priced?cells:[...cells.slice(0,5),cells[7]||""];
  const lines=[
   ["Scope of supply / 供货范围"],
   ["Project","ZAWTIKA DEVELOPMENT PROJECT PHASE 1F"],
   ["Document",b3BrownfieldDocumentNumber0553()],
   schedule.columns
  ];
  for(const row of schedule.rows)lines.push(row.kind==="section"?[row.cells[0]+" / "+row.cells[1]]:drop(row.cells));
  const text=lines.map(row=>row.map(csvCell).join(",")).join("\n");
  if(priced===false&&UNPRICED_LEAK.test(text))throw Error("Unpriced brownfield export contains a money figure");
  return text;
 }
 const money=priced!==false;
 const showRates=money&&itemized!==false;
 const showBreakdown=showRates;
 const header=["SN","Item Description","Unit","Qty."];
 if(showRates)header.push(currency==="usd"?"Unit Rate (USD)":currency==="both"?"Unit Rate":"Unit Rate (THB)");
 if(money)header.push(currency==="usd"?"Amount (USD)":currency==="both"?"Amount":"Amount (THB)");
 if(showBreakdown)header.push("Breakdown (incl. in B3-BF)");
 header.push("Notes");
 const rows=[header];
 const push=(sn,description,unit,qty,rate,amount,breakdown,notes)=>{
  const line=[sn,description,unit,qty];
  if(showRates)line.push(rate??"");
  if(money)line.push(amount??"");
  if(showBreakdown)line.push(breakdown??"");
  line.push(notes??"");
  rows.push(line);
 };
 const shown=n=>money?n:"";
 const rateOf=(thbValue,usdValue)=>shown(formatB3BrownfieldMoney0553(model,thbValue,usdValue,currency));
 push("A1","Brownfield SCADA radio items","Lot",String(model.a1Rows.length),"",shown(formatB3BrownfieldMoney0553(model,0,0,currency)),"","Supplied under base");
 for(const row of model.a1Rows){
  const jb=official&&row.jbState==="OPEN"?"TBA":row.jbText;
  const note=row.status+" · "+jb+" · "+row.installer+(official?"":" · "+row.source);
  push(row.sn,row.tagText+"\n"+row.description,row.unitText,row.qtyText,"","","",note);
 }
 push("",model.exclusion,"","","","","","");
 for(const row of model.otherPartA)push(row.sn,row.title+" — "+row.description,"","","","","",row.status);
 push("B3-BF","Brownfield inspection, testing and certification — additional","Lot","1","",
  shown(formatB3BrownfieldMoney0553(model,model.grandTotalTHB,model.grandTotalUSD,currency)),"","Net additional. Original quotation unchanged.");
 if(itemized!==false){
  for(const line of model.bomLines){
   if(line.kind==="note"||(official&&line.internalOnly))continue;
   if(line.kind==="info"){push("",line.activity,"","","","","",line.remarks);continue;}
   const openWord=official&&line.kind==="open"?"TBA":line.display;
   const rate=line.kind==="check"?"(= BF.1.1 + BF.1.2)":openWord||rateOf(line.unitRateTHB,line.unitRateUSD);
   const breakdown=line.countsInSubtotal||line.includedInAdditional?shown(formatB3BrownfieldMoney0553(model,line.totalTHB,line.totalUSD,currency)):"";
   const remarks=official?(line.officialRemarks||(line.kind==="open"?"TBA":line.kind==="company"?"Arranged by Company":line.kind==="jutal"?line.remarks:"")):(money?line.remarks:(line.unpricedRemarks||line.remarks));
   push(line.id,line.activity,line.unit??"",line.days??"",rate,"",breakdown,remarks||"");
  }
  for(const site of model.siteRows)push(site.sn,site.description,"day",official?"TBA":"OPEN","","","",(official?"TBA · ":"")+site.jbText+" · "+site.installer);
 }
 for(const row of model.partB)push(row.code,row.note,"","","","","",row.note);
 if(money)push("","Grand total of this additional proposal (excl. OPEN items)","","","",
  shown(formatB3BrownfieldMoney0553(model,model.grandTotalTHB,model.grandTotalUSD,currency)),"",
  currency==="usd"?"USD":currency==="both"?"THB / USD":"THB");
 if(!official&&money){
  push("","Carve-out C1 "+model.carveOut.c1.basis,"day",String(model.carveOut.c1.days),"","","",formatB3BrownfieldMoney0553(model,model.carveOut.c1.valueTHB,null,"thb")+" OPEN — not applied; not in the Amount column");
  push("","Carve-out C2 "+model.carveOut.c2.basis,"day",String(model.carveOut.c2.days),"","","",formatB3BrownfieldMoney0553(model,model.carveOut.c2.valueTHB,null,"thb")+" OPEN — not applied; not in the Amount column");
 }
 const listed=model.openItems.filter(item=>!(official&&item.internalOnly));
 if(!official)for(const item of listed)push("",item.topic,"","","","","",money?item.detail:(item.unpricedDetail||item.detail));
 else for(const item of listed)push("",item.topic,"","","","","","TBA");
 rows.push(["",model.jutalNote]);
 rows.push(["",model.lastLineNote]);
 const text=rows.map(row=>{
  const line=row.slice();
  while(line.length<header.length)line.push("");
  return line.slice(0,header.length).map(csvCell).join(",");
 }).join("\n");
 if(!money&&UNPRICED_LEAK.test(text))throw Error("Unpriced brownfield export contains a money figure");
 return text;
}
