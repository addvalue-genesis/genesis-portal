// PJ2608-0553 — ADDITIONAL proposal for brownfield ZPQ / ZWP8 / ZWP11.
// Read-only. Does not post into the original Scope of Supply, the selected
// B3 working sell, or the release commercial model.
import {selectB3SelectedSatSurveyPrice0553} from "./b3SelectedSatSurveyPrice0553";
import {selectB9ChinaWorkingBudget0553} from "./b9ChinaWorkingBudget0553";
import {selectB3MgwPurchasedFatWorkingSell0553} from "./b3MgwPurchasedFatWorkingSell0553";
import {PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {OFFICIAL_WORKBOOK_TEMPLATE_0553} from "./officialWorkbookTemplate0553";
import {RELEASE_CUSTOMER_COLUMNS_0553,buildReleaseCommercialModel0553} from "./releaseCommercialModel0553";
import {entriesFromZip,readEntry,rebuildZip} from "../nativeWorkingDraft0553";
import {MR0001_SITE_CLASSIFICATION} from "./mr0001SiteClassification";
import {MR0003_MR0004_SCOPE_C1} from "./mr0003Mr0004ScopeC1";
import {MR0002_BDA_DEVIATION_REV00_0553} from "./mr0002DeviationBdaRev00_0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import {ADDVALUE_DOCUMENT_COMPANY_CODE_0553} from "./addvalueDocumentCode0553";

export const B3BF_JUTAL_NOTE_0553="Note: Installation and cable routing are by the Jutal team. / งานติดตั้งและเดินสายโดยทีม Jutal";
// Item 7 (VND) for this additional proposal only. Jack 2026-11-16: USD 1,000 and
// USD 800 are already ADDVALUE selling prices. MOB/DEMOB is USD 2,000 per person
// round trip. Sell = that VND cost × 1.00. Not posted into the 10.2/10.3.1 B3 dossier.
export const B3BF_ITEM7_NOTE_0553="Jack 2026-11-16: no markup. USD 1,000/800 are ADDVALUE selling prices. MOB/DEMOB is USD 2,000 per person round trip";
export const B3BF_ITEM7_EQUATION_0553="VND cost = 9 × (1,000 + 800) USD + 2 × 1 × 2,000 USD = 16,200 + 4,000 = 20,200 USD; × 31.5 = 636,300 THB";
export const B3BF_LAST_LINE_NOTE_0553="Note: Working days on the Greenfield/base B3 scope have been reduced by 5 working days. / ปรับลดวันทำงานไปที่ Greenfield/base B3 ลดลง 5 วันทำงาน";
export const B3BF_NET_CALENDAR_DAYS_0553=9;
export const B3BF_SITE_DAYS_0553=Object.freeze({ZPQ:2,ZWP8:2,ZWP11:2});
export const B3BF_DAY_PLAN_0553=Object.freeze([
 Object.freeze({id:"ZPQ",label:"ZPQ",days:2,kind:"site"}),
 Object.freeze({id:"ZWP8",label:"ZWP8",days:2,kind:"site"}),
 Object.freeze({id:"ZWP11",label:"ZWP11",days:2,kind:"site"}),
 Object.freeze({id:"MOB",label:"MOB",days:1,kind:"mob"}),
 Object.freeze({id:"DEMOB",label:"DEMOB",days:1,kind:"demob"}),
 Object.freeze({id:"PUNCH",label:"Punch list",days:1,kind:"punch"})
]);
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
function item7Vnd(senior,specialist,days,fxTHBPerUSD,seniorLineUSD,specialistLineUSD,seniorLineTHB,specialistLineTHB,labourUSD,mobPersons,mobTrips,mobUsdPerPersonTrip,mobUSD,mobTHB,vndUSD,vndTHB){
 const sellFactor=1;
 const lines=[
  {id:"VND.7.1",kind:"labour",activity:senior.role,persons:1,days,unit:"person-day",
   usdPerDay:senior.usdPerPersonDay,totalUSD:seniorLineUSD,totalTHB:seniorLineTHB},
  {id:"VND.7.2",kind:"labour",activity:specialist.role,persons:1,days,unit:"person-day",
   usdPerDay:specialist.usdPerPersonDay,totalUSD:specialistLineUSD,totalTHB:specialistLineTHB},
  {id:"VND.7.3",kind:"mob",activity:"MOB/DEMOB (ticket + POB)",persons:mobPersons,trips:mobTrips,days:null,unit:"person-trip",
   usdPerPersonTrip:mobUsdPerPersonTrip,totalUSD:mobUSD,totalTHB:mobTHB}
 ];
 const sellUSD=round(vndUSD*sellFactor),sellTHB=round(vndTHB*sellFactor);
 if(senior.usdPerPersonDay!==1000||specialist.usdPerPersonDay!==800||days!==9||
    labourUSD!==16200||mobPersons!==2||mobTrips!==1||mobUsdPerPersonTrip!==2000||mobUSD!==4000||
    vndUSD!==20200||fxTHBPerUSD!==31.5||vndTHB!==636300||
    round(seniorLineUSD+specialistLineUSD)!==labourUSD||round(labourUSD+mobUSD)!==vndUSD||
    round(vndUSD*fxTHBPerUSD)!==vndTHB||sellFactor!==1||sellUSD!==vndUSD||sellTHB!==vndTHB||
    lines[0].totalUSD!==9000||lines[0].totalTHB!==283500||
    lines[1].totalUSD!==7200||lines[1].totalTHB!==226800||
    lines[2].totalUSD!==4000||lines[2].totalTHB!==126000)
  throw Error("Item 7 VND cost is not the ADDVALUE selling price at factor 1.00");
 return {
  id:"ITEM-7-VND",label:"Item 7 (VND)",
  source:"Jack instruction 2026-11-16",
  priceClass:"ADDVALUE_SELLING_PRICE",
  postedToDossier:false,postedToRelease:false,
  markupFactor:sellFactor,sellFactor,samtelPct:0,addvalueProfitPct:0,omissionPct:0,
  seniorUsdPerDay:senior.usdPerPersonDay,specialistUsdPerDay:specialist.usdPerPersonDay,
  teamDays:days,labourUSD,mobPersons,mobTrips,mobUsdPerPersonTrip,mobUSD,
  vndCostUSD:vndUSD,fxTHBPerUSD,vndCostTHB:vndTHB,sellUSD,sellTHB,
  lines,equation:B3BF_ITEM7_EQUATION_0553,
  sellEquation:"Sell = VND cost × 1.00 = 20,200 USD / 636,300 THB",
  note:B3BF_ITEM7_NOTE_0553
 };
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
 const mobPersons=2,mobTrips=1,mobUsdPerPersonTrip=2000;
 const mobUSD=round(mobPersons*mobTrips*mobUsdPerPersonTrip);
 const mobTHB=round(mobUSD*fxTHBPerUSD);
 const grandTotalTHB=round(proposalTHB+mobTHB);
 const grandTotalUSD=round(proposalUSD+mobUSD);
 const baseB3WorkingSellTHB=round(sat.includedB3SatSurveyToolsWorkingSellTHB+china.fatWorkingSellTHB+purchased.selectedIncrementalWorkingSellTHB);
 const carveC1THB=sat.siteSurveyWorkingSellTHB;
 const carveC2THB=round(B3BF_CARVEOUT_DAYS_0553*teamDayTHB);
 if(fxTHBPerUSD!==31.5||senior.usdPerPersonDay!==1000||specialist.usdPerPersonDay!==800||
    senior.thbPerPersonDay!==31500||specialist.thbPerPersonDay!==25200||teamDayTHB!==56700||
    teamDayUSD!==1800||seniorLineUSD!==9000||specialistLineUSD!==7200||proposalUSD!==16200||
    round(senior.usdPerPersonDay*fxTHBPerUSD)!==senior.thbPerPersonDay||
    round(specialist.usdPerPersonDay*fxTHBPerUSD)!==specialist.thbPerPersonDay||
    round(teamDayUSD*fxTHBPerUSD)!==teamDayTHB||round(proposalUSD*fxTHBPerUSD)!==proposalTHB||
    round(seniorLineUSD*fxTHBPerUSD)!==seniorLineTHB||round(specialistLineUSD*fxTHBPerUSD)!==specialistLineTHB||
    seniorLineTHB!==283500||specialistLineTHB!==226800||proposalTHB!==510300||
    round(seniorLineTHB+specialistLineTHB)!==proposalTHB||
    mobUSD!==4000||mobTHB!==126000||grandTotalTHB!==636300||grandTotalUSD!==20200||
    senior.directCostTHB!==null||specialist.directCostTHB!==null||
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
  {id:"BF.1.3",kind:"check",internalOnly:true,activity:"Team-day check: 6 offshore working days + 1 MOB + 1 DEMOB + 1 punch list = 9 days",persons:2,days,unit:"team-day",
   usdPerPersonDay:teamDayUSD,fxTHBPerUSD,
   unitRateTHB:teamDayTHB,unitRateUSD:teamDayUSD,totalTHB:null,totalUSD:null,countsInSubtotal:false,
   remarks:"(= BF.1.1 + BF.1.2) — not a second charge"},
  {id:"BF.1.4",kind:"mob",activity:"Mobilisation / demobilisation (ticket + POB), 2 persons × 1 trip",persons:mobPersons,trips:mobTrips,days:null,unit:"trip",
   usdPerPersonTrip:mobUsdPerPersonTrip,fxTHBPerUSD,
   unitRateTHB:round(mobUsdPerPersonTrip*fxTHBPerUSD),unitRateUSD:mobUsdPerPersonTrip,
   totalTHB:mobTHB,totalUSD:mobUSD,countsInSubtotal:false,includedInAdditional:true,
   officialRemarks:"Included in B3-BF",
   remarks:"Jack instruction 2026-11-16, USD 2,000 per person round trip × 2 persons. Ticket + POB. Not the survey MOB labour already in base B3.",
   unpricedRemarks:"Jack instruction 2026-11-16. Ticket + POB, 2 persons × 1 round trip. Not the survey MOB labour already in base B3."},
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
  throw Error("B3 brownfield BOM subtotal is not the 9 team-day price");
 const siteDays=B3BF_SITE_DAYS_0553;
 const dayPlan=B3BF_DAY_PLAN_0553;
 if(dayPlan.reduce((sum,row)=>sum+row.days,0)!==days)
  throw Error("Brownfield day plan must sum to 9 team-days");
 if(B3BF_BROWNFIELD_SITES_0553.reduce((sum,site)=>sum+(siteDays[site]||0),0)!==6)
  throw Error("Brownfield productive site days must stay 6");
 const siteRows=B3BF_BROWNFIELD_SITES_0553.map((site,index)=>{
  const radio=a1Rows.find(row=>row.site===site&&row.tags.some(tag=>tag.startsWith("MR-")||tag.startsWith("ANT-")));
  return {
   sn:"BF.2."+(index+1),site,days:siteDays[site],daysDisplay:String(siteDays[site]),priceTHB:null,
   description:(radio?radio.tagText:site)+" — "+siteDays[site]+" offshore working days",
   jbText:JB_BY_SITE[site].text,installer:B3BF_INSTALLER_0553
  };
 });
 const partB=referencePartB();
 if(partB.length!==14||partB.some(row=>row.priceTHB!==null)||!partB.some(row=>row.code==="B3"&&row.note==="Original quotation, unchanged"))
  throw Error("Part B reference lines must stay unpriced");
 const openItems=[
  {id:"mob",topic:"MOB/DEMOB",detail:"Ticket + POB is included at Jack instruction 2026-11-16, USD 2,000 per person round trip × 2 persons = USD 4,000. This is not the survey MOB labour already in base B3.",unpricedDetail:"Ticket + POB is included at Jack instruction 2026-11-16, 2 persons × 1 round trip. This is not the survey MOB labour already in base B3."},
  {id:"pob",internalOnly:true,topic:"Accommodation / POB / medical / visa",detail:"Offshore POB, accommodation, meals, medical and offshore certificates are OPEN (TBA) and are not counted."},
  {id:"split",topic:"Per-site split",detail:"Jack decision 2026-11-16: 9 team-days = ZPQ 2 + ZWP8 2 + ZWP11 2 offshore working days + 1 MOB labour day + 1 DEMOB labour day + 1 punch-list day. Ticket + POB cash stays a separate line."},
  {id:"carve",topic:"Carve-out basis C1 vs C2",detail:"Carve-out basis is OPEN: C1 brownfield survey 5 team-days, or C2 five SAT team-days. Neither is applied to this proposal. Base B3 is not modified."},
  {id:"zwp11-jb",topic:"ZWP11 JB new vs existing",detail:"ZWP11 JB is OPEN. BOD §8 says existing TCAB-WP11-500-003. MTO says new TCAB-500-003."},
  {id:"termination",topic:"Termination owner",detail:"Termination owner is OPEN."},
  {id:"zpq-dmr",topic:"ZPQ DMR integration scope",detail:"ZPQ DMR integration scope is OPEN (MR-0002 §5 'To integrate with existing system')."},
  {id:"zpq-pabx",topic:"ZPQ PABX FXS for ZWP20-23",detail:"ZPQ PABX FXS interface for ZWP20, ZWP21, ZWP22 and ZWP23 is OPEN."},
  {id:"zpq-band",topic:"ZPQ radio DMR SLR5300 vs TETRA",detail:"Existing ZPQ radio DMR SLR5300 vs TETRA is OPEN. Confirm the band before LNA/BDA selection."},
  {id:"commissioning",topic:"Commissioning responsibility",detail:"Commissioning responsibility is OPEN (BOD §10.5 / SPE §7.3.3 vendor vs BOD §7.2 EPCI)."}
 ];
 const item7=item7Vnd(senior,specialist,days,fxTHBPerUSD,seniorLineUSD,specialistLineUSD,seniorLineTHB,specialistLineTHB,proposalUSD,mobPersons,mobTrips,mobUsdPerPersonTrip,mobUSD,mobTHB,grandTotalUSD,grandTotalTHB);
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
  bomLines,jutalNote:B3BF_JUTAL_NOTE_0553,lastLineNote:B3BF_LAST_LINE_NOTE_0553,
  item7,costBasis:item7,dayPlan,siteRows,a1Rows,
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
// Client documents use MM-ZTK-1F-GEN-<company>-TEL-<doctype>-<seq>.
// The company code is ADDVALUE_DOCUMENT_COMPANY_CODE_0553 (ADDV, never ADV).
// QUO, 0001 and Rev.00 remain numbering assumptions.
export const B3BF_EXPORT_NAME_0553=Object.freeze({
 standard:"10008-STD-6-GEN-002-R02",
 country:"MM",projectField:"ZTK",phase:"1F",area:"GEN",
 vendorPackage:ADDVALUE_DOCUMENT_COMPANY_CODE_0553,discipline:"TEL",docType:"QUO",seq:"0001",revision:"00",
 open:Object.freeze(["docType QUO","seq 0001","revision 00"])
});
export function b3BrownfieldDocumentNumber0553(){
 const a=B3BF_EXPORT_NAME_0553;
 if(a.vendorPackage!==ADDVALUE_DOCUMENT_COMPANY_CODE_0553||a.vendorPackage==="ADV")
  throw Error("Document company code must be ADDV, not ADV");
 const number=`${a.country}-${a.projectField}-${a.phase}-${a.area}-${a.vendorPackage}-${a.discipline}-${a.docType}-${a.seq} Rev.${a.revision}`;
 if(number.includes("-ADV-")||!number.includes("-ADDV-"))throw Error("Document number must use -ADDV-");
 return number;
}
export function b3BrownfieldExportFileName0553({audience="official",extension}={}){
 const base=b3BrownfieldDocumentNumber0553();
 const named=audience==="internal"?base+"_INTERNAL":base;
 if(!extension)return named;
 const ext=String(extension).replace(/^\./,"").toLowerCase();
 if(ext==="docx")throw Error("No docx library is installed. Official Word export uses a .doc HTML file that Word opens.");
 if(!["csv","xlsx","doc","html"].includes(ext))throw Error("Unsupported brownfield export extension "+ext);
 return named+"."+ext;
}
 const UNPRICED_LEAK=/793,?800|856,?800|636,?300|573,?300|510,?300|403,?200|340,?200|283,?500|226,?800|189,?000|151,?200|126,?000|63,?000|56,?700|31,?500|27,?200|25,?200|20,?200|18,?200|16,?200|12,?800|10,?800|441,?000|352,?800|252,?000|2,?322,?450|452,?850|1,?587,?600|14,?000|11,?200|9,?000|7,?200|6,?000|4,?800|4,?000|2,?000|1,?800|1,?000|(?:^|[^\d.,])800(?:[^\d]|$)|31\.5|\bUSD\b|\bTHB\b/;
export function b3BrownfieldOfficialScopeText0553(model){
 const senior=model?.bomLines?.find(entry=>entry.id==="BF.1.1");
 const specialist=model?.bomLines?.find(entry=>entry.id==="BF.1.2");
 if(!senior?.activity||!specialist?.activity||model.teamPersons!==2||model.netCalendarDays!==9)throw Error("Official B3-BF scope requires the two-person team");
 const sites=model.siteRows||[];
 if(sites.map(row=>row.site+":"+row.days).join(",")!=="ZPQ:2,ZWP8:2,ZWP11:2")
  throw Error("Official scope site split is not ZPQ 2 / ZWP8 2 / ZWP11 2");
 const plan=(model.dayPlan||[]).map(row=>row.label+" "+row.days).join(", ");
 if(plan!=="ZPQ 2, ZWP8 2, ZWP11 2, MOB 1, DEMOB 1, Punch list 1")
  throw Error("Official scope day plan is not the 9-day split");
 return "2 persons: "+senior.activity+" + "+specialist.activity;
}
function customerA1Preview0553(model){
 const part=(model.baseCustomerPreview?.partA||[]).find(entry=>entry.code==="A1");
 if(!part||part.mr!=="MR-0001"||!part.description||!part.locations?.length)
  throw Error("Official A1 requires the MR-0001 customer preview");
 return {
  tag:part.mr,
  description:part.description,
  specification:"Locations: "+part.locations.join(", ")
 };
}
const B3BF_PRICE_SENTENCE_0553="Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.\n价格应包括技术请购单中所要求的供货范围和工作范围，并不仅限于上面这些项。";
function padOfficialCells(cells){
 return Array.from({length:8},(_,index)=>cells?.[index]??"");
}
function templatePartBLines0553(){
 const sheet=OFFICIAL_WORKBOOK_TEMPLATE_0553.sheets.find(entry=>entry.name==="Scope of supply");
 const lines=(sheet?.rows||[]).filter(row=>/^B\d+$/.test(row[1]||"")).map(row=>({
  code:row[1],description:row[2],qty:row[5]||"1 lot",
  remark:typeof row[6]==="string"?row[6]:(typeof row[8]==="string"?row[8]:"")
 }));
 if(lines.map(line=>line.code).join(",")!=="B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14")
  throw Error("4-Scope of Supply Part B numbering is not B1–B14");
 return lines;
}
function templateLine(entry){
 return {kind:"template",cells:padOfficialCells([entry.code,entry.description,"","",entry.qty,"Quoted","",entry.remark])};
}
export function b3BrownfieldOfficialMatrix0553(schedule){
 return schedule.rows.map(row=>padOfficialCells(row.cells));
}
// Sheet rows in 4-Scope of Supply.xlsx. Three breakdown rows are inserted at row 27
// so B4–B14, the total and the closing lines keep the template's order.
export function b3BrownfieldOfficialExcelRows0553(schedule){
 const codes=schedule.rows.map(row=>row.kind+":"+(row.cells[0]||"").split("\n")[0]);
 const expected=["section:Part A: BASIC","subheading:A1. Main Equipment","a1:A1","section:Part B: OTHERS",
  "template:B1","template:B2","bfhead:B3","bf:B3-BF.1","bf:B3-BF.2","bf:B3-BF.3",
  ..."B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14".split(",").map(code=>"template:"+code),
  "total:Total 合计","highlight:Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.","note:"+B3BF_JUTAL_NOTE_0553,"note:"+B3BF_LAST_LINE_NOTE_0553];
 if(codes.join("\n")!==expected.join("\n"))throw Error("Official schedule no longer matches the 4-Scope of Supply row map");
 const numbers=[6,7,8,23];
 for(let row=24;row<=44;row++)numbers.push(row);
 if(numbers.length!==schedule.rows.length)throw Error("Official Excel row map length drifted");
 return numbers;
}
export function selectB3BrownfieldOfficialSchedule0553(model,{priced=true,itemized=true,currency="thb"}={}){
 if(!model||model.id!=="PJ2608-0553-B3BF-ADDITIONAL")throw Error("Official schedule requires the additional-proposal model");
 void itemized;
 const show=n=>priced?formatB3BrownfieldMoney0553(model,n.thb,n.usd,currency):"";
 const line=(cells,kind="line")=>({kind,cells:padOfficialCells(cells)});
 const senior=model.bomLines.find(entry=>entry.id==="BF.1.1");
 const specialist=model.bomLines.find(entry=>entry.id==="BF.1.2");
 const ticket=model.bomLines.find(entry=>entry.id==="BF.1.4");
 if(!senior||!specialist||!ticket)throw Error("Official schedule is missing the B3-BF price lines");
 const scope=b3BrownfieldOfficialScopeText0553(model);
 const a1Preview=customerA1Preview0553(model);
 const lump=show({thb:model.grandTotalTHB,usd:model.grandTotalUSD});
 const rows=[];
 rows.push(line(["Part A: BASIC\nA部分：基本"],"section"));
 rows.push(line(["A1. Main Equipment"],"subheading"));
 rows.push(line(["A1",a1Preview.tag+"\nMULTI-TAG / customer grouping subject to approval",a1Preview.description,a1Preview.specification,"1 lot","Quoted","",""],"a1"));
 rows.push(line(["Part B: OTHERS\nB部分：其它"],"section"));
 for(const entry of templatePartBLines0553()){
  if(entry.code==="B3"){
   rows.push(line(["B3","Brownfield Additional\n"+scope,"","","1 lot",lump,lump,"2 persons"],"bfhead"));
   rows.push(line(["B3-BF.1",senior.activity+"\n9 person-days","","","9 day","","",""],"bf"));
   rows.push(line(["B3-BF.2",specialist.activity+"\n9 person-days","","","9 day","","",""],"bf"));
   rows.push(line(["B3-BF.3","MOB/DEMOB (ticket + POB)\n2 persons × 1 round trip","","","2 trip","","",""],"bf"));
  }else rows.push(templateLine(entry));
 }
 rows.push(line(["Total 合计","","","","","",show({thb:model.grandTotalTHB,usd:model.grandTotalUSD}),"Labour + MOB/DEMOB + punch list"],"total"));
 rows.push(line([B3BF_PRICE_SENTENCE_0553],"highlight"));
 rows.push(line([model.jutalNote],"note"));
 rows.push(line([model.lastLineNote],"note"));
 const columns=RELEASE_CUSTOMER_COLUMNS_0553.scope;
 if(rows.filter(row=>row.kind==="a1").length!==1)throw Error("Official schedule must contain one A1 row");
 if(rows.filter(row=>row.kind==="bfhead").length!==1||rows.find(row=>row.kind==="bfhead").cells[0]!=="B3")
  throw Error("Official schedule must contain one B3 heading");
 if(rows.some(row=>row.kind==="day"))throw Error("Official schedule must not list the day breakdown");
 if(rows.some(row=>["A2","A3","A4"].includes(row.cells[0])))throw Error("Official schedule must not contain A2, A3 or A4");
 const a1=rows.find(row=>row.kind==="a1");
 if(a1.cells[5]!=="Quoted"||a1.cells[6]!=="")throw Error("A1 unit price must read Quoted and its sub-total must stay blank");
 if(rows.filter(row=>row.kind==="template").some(row=>row.cells[5]!=="Quoted"||row.cells[6]!==""))
  throw Error("Template B lines must show Quoted with a blank sub-total");
 const headingRow=rows.find(row=>row.kind==="bfhead");
 if(headingRow.cells[5]!==lump||headingRow.cells[6]!==lump)throw Error("B3 unit price and sub-total must both be the lump sum");
 const pricedLines=rows.filter(row=>row.kind==="bf");
 if(pricedLines.some(row=>row.cells[5]!==""||row.cells[6]!==""))throw Error("B3-BF breakdown price cells must stay blank");
 if(round(senior.totalTHB+specialist.totalTHB+ticket.totalTHB)!==model.grandTotalTHB)throw Error("B3 breakdown does not add up to the heading total");
 if(pricedLines.map(row=>row.cells[0]).join(",")!=="B3-BF.1,B3-BF.2,B3-BF.3")throw Error("B3-BF breakdown order changed");
 const b3=rows.findIndex(row=>row.cells[0]==="B3"),b4=rows.findIndex(row=>row.cells[0]==="B4");
 if(!(rows.findIndex(row=>row.cells[0]==="B1")<rows.findIndex(row=>row.cells[0]==="B2")&&rows.findIndex(row=>row.cells[0]==="B2")<b3&&b3<b4))
  throw Error("Part B order is not B1, B2, B3, breakdown, B4");
 b3BrownfieldOfficialExcelRows0553({rows});
 return Object.freeze({columns,rows:Object.freeze(rows),project:"ZAWTIKA DEVELOPMENT PROJECT PHASE 1F",title:"Scope of supply",template:"4-Scope of Supply.xlsx"});
}
export function buildB3BrownfieldAdditionalCsv0553(model,{priced,itemized,version="internal",currency="thb"}={}){
 if(!model||model.id!=="PJ2608-0553-B3BF-ADDITIONAL")throw Error("Brownfield CSV requires the additional-proposal model");
 const official=version==="official";
 if(official){
  const schedule=selectB3BrownfieldOfficialSchedule0553(model,{priced,itemized,currency});
  const lines=[
   ["Scope of supply / 供货范围"],
   ["Project","ZAWTIKA DEVELOPMENT PROJECT PHASE 1F"],
   ["RFQ No.",""],
   ["Package Name",b3BrownfieldDocumentNumber0553()],
   schedule.columns,
   ...b3BrownfieldOfficialMatrix0553(schedule)
  ];
  const text=lines.map(row=>row.map(csvCell).join(",")).join("\n");
  if(priced===false&&UNPRICED_LEAK.test(text))throw Error("Unpriced brownfield export contains a money figure");
  if(text.includes("\nZPQ,")||text.includes("Offshore working"))throw Error("Official CSV still lists the day breakdown");
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
  for(const row of model.dayPlan)push("DAY."+row.id,row.label,"day",String(row.days),"","","","Included in the 9 team-days. Ticket + POB cash is separate.");
 }
 for(const row of model.partB)push(row.code,row.note,"","","","","",row.note);
 if(money)push("","Grand total of this additional proposal (excl. OPEN items)","","","",
  shown(formatB3BrownfieldMoney0553(model,model.grandTotalTHB,model.grandTotalUSD,currency)),"",
  currency==="usd"?"USD":currency==="both"?"THB / USD":"THB");
 if(!official&&money){
  push("VND.7",model.item7.equation,"","","",shown(formatB3BrownfieldMoney0553(model,model.item7.vndCostTHB,model.item7.vndCostUSD,currency)),"",model.item7.note+" "+model.item7.sellEquation);
  if(itemized!==false)for(const line of model.item7.lines)push(line.id,line.activity,line.unit,String(line.days??line.trips??""),"",shown(formatB3BrownfieldMoney0553(model,line.totalTHB,line.totalUSD,currency)),"","Item 7 VND. Sell factor 1.00");
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
const encodeExcelText=text=>String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
function shiftBrownfieldSheetRows(xml,fromRow,delta){
 const blocks=[];
 const pattern=/<row r="(\d+)"[\s\S]*?<\/row>/g;
 let match;
 while((match=pattern.exec(xml)))blocks.push({row:Number(match[1]),start:match.index,text:match[0]});
 let out=xml;
 for(const block of blocks.filter(entry=>entry.row>=fromRow).sort((a,b)=>b.start-a.start)){
  const text=block.text.replace(/<row r="\d+"/,'<row r="'+(block.row+delta)+'"').replace(/r="([A-Z]+)(\d+)"/g,(all,column,number)=>'r="'+column+(Number(number)+delta)+'"');
  out=out.slice(0,block.start)+text+out.slice(block.start+block.text.length);
 }
 out=out.replace(/<mergeCell ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"/g,(all,column1,row1,column2,row2)=>{
  const top=Number(row1)>=fromRow?Number(row1)+delta:Number(row1);
  const bottom=Number(row2)>=fromRow?Number(row2)+delta:Number(row2);
  return '<mergeCell ref="'+column1+top+":"+column2+bottom+'"';
 });
 out=out.replace(/<dimension ref="A1:H\d+"\/>/,'<dimension ref="A1:H'+(44+delta)+'"/>');
 out=out.replace(/<mergeCells count="(\d+)"/,(all,count)=>'<mergeCells count="'+(Number(count)+delta)+'"');
 out=out.replace("</mergeCells>",[1,2,3].map(offset=>'<mergeCell ref="B'+(26+offset)+':D'+(26+offset)+'"/>').join("")+"</mergeCells>");
 const source=out.match(/<row r="26"[\s\S]*?<\/row>/);
 if(!source)throw Error("Template row 26 disappeared before the breakdown rows were inserted");
 const inserted=[1,2,3].map(offset=>source[0].replace(/r="([A-Z]+)26"/g,(all,column)=>'r="'+column+(26+offset)+'"').replace('<row r="26"','<row r="'+(26+offset)+'"')).join("");
 const anchor=out.match(/<row r="26"[\s\S]*?<\/row>/);
 out=out.slice(0,anchor.index+anchor[0].length)+inserted+out.slice(anchor.index+anchor[0].length);
 if(!out.includes('<row r="27"')||!out.includes('<row r="29"')||!out.includes('<row r="30"'))
  throw Error("Breakdown rows were not inserted into 4-Scope of Supply");
 return out;
}
function replaceBrownfieldCell(xml,address,value){
 if(!/^[A-H][1-9][0-9]*$/.test(address))throw Error("Illegal brownfield destination "+address);
 if(typeof value!=="string"&&!(typeof value==="number"&&Number.isFinite(value)))throw Error("Invalid brownfield cell "+address);
 const cellPattern=new RegExp('(<c\\b[^>]*\\br="'+address+'"[^>]*?)(?:\\s*/>|>([\\s\\S]*?)</c>)');
 const match=xml.match(cellPattern);
 if(!match)throw Error("Scope of supply template has no cell "+address);
 if(/<f(?:\s|>)/.test(match[2]||""))throw Error("Refusing to overwrite formula "+address);
 const nameAndStyle=match[1].replace(/\s+t="[^"]*"/g,"").replace(/\/\s*$/,"");
 const isText=typeof value==="string";
 const contents=isText?'<is><t xml:space="preserve">'+encodeExcelText(value)+'</t></is>':"<v>"+value+"</v>";
 return xml.replace(match[0],nameAndStyle+(isText?' t="inlineStr"':'')+">"+contents+"</c>");
}
const FORBIDDEN_BF_EXPORT=/2,?322,?450|856,?800|793,?800|403,?200|340,?200|27,?200|14,?000|11,?200|899,?640|28,?560/;
function officialExportOptions(options={}){
 return {priced:options.priced!==false,itemized:true,currency:options.currency||"thb"};
}
export function buildB3BrownfieldOfficialDocHtml0553(model,options={}){
 const view=officialExportOptions(options);
 const schedule=selectB3BrownfieldOfficialSchedule0553(model,view);
 const esc=value=>String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 const matrix=b3BrownfieldOfficialMatrix0553(schedule);
 const body=matrix.map(cells=>"<tr>"+cells.map(value=>`<td style="white-space:pre-line">${esc(value)}</td>`).join("")+"</tr>").join("");
 const docNo=b3BrownfieldDocumentNumber0553();
 const html=`<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(docNo)}</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]--><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #8aa;padding:4px;vertical-align:top}th{background:#0b2538;color:#fff}</style></head><body><h1>Scope of supply / 供货范围</h1><p>Project: ZAWTIKA DEVELOPMENT PROJECT PHASE 1F<br>RFQ No.<br>Package Name: ${esc(docNo)}</p><table><thead><tr>${schedule.columns.map(header=>`<th>${esc(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></body></html>`;
 if(FORBIDDEN_BF_EXPORT.test(html))throw Error("Word export contains a split price or the base B3 amount");
 if(view.priced&&view.currency==="thb"&&!html.includes("636,300.00"))throw Error("Word export is missing the combined THB total");
 if(view.priced&&view.currency==="usd"&&!html.includes("20,200.00 USD"))throw Error("Word export is missing the combined USD total");
 if(!view.priced&&UNPRICED_LEAK.test(html))throw Error("Unpriced Word export contains a money figure");
 return html;
}
export async function buildB3BrownfieldOfficialXlsx0553(file,model,options={}){
 if(!file||!/\.xlsx$/i.test(file.name||""))throw Error("Brownfield Excel export requires the original 4-Scope of Supply.xlsx");
 const view=officialExportOptions(options);
 const schedule=selectB3BrownfieldOfficialSchedule0553(model,view);
 const input=new Uint8Array(await file.arrayBuffer()),entries=entriesFromZip(input);
 const workbookEntry=entries.find(entry=>entry.name==="xl/workbook.xml");
 const sheetEntry=entries.find(entry=>entry.name==="xl/worksheets/sheet1.xml");
 if(!workbookEntry||!sheetEntry)throw Error("4-Scope of Supply template is incomplete");
 const workbook=new TextDecoder().decode(await readEntry(workbookEntry));
 if(!workbook.includes('name="Scope of supply"'))throw Error("Template is not 4-Scope of Supply");
 let xml=new TextDecoder().decode(await readEntry(sheetEntry));
 if(!xml.includes("<f>SUM(E8:E22)</f><v>8</v>"))throw Error("Part A quantity formula is not the original template");
 const sheetRows=b3BrownfieldOfficialExcelRows0553(schedule);
 const writes=new Map();
 const put=(cell,value)=>{if(writes.has(cell))throw Error("Duplicate brownfield cell "+cell);writes.set(cell,value);};
 sheetRows.forEach((line,index)=>{
  const cells=padOfficialCells(schedule.rows[index].cells);
  "ABCDEFGH".split("").forEach((column,cell)=>put(column+line,cells[cell]));
 });
 for(const row of [45,46,47])"ABCDEFGH".split("").forEach(column=>put(column+row,""));
 const written=[...writes.values()].map(value=>String(value)).join("\n");
 if(FORBIDDEN_BF_EXPORT.test(written))throw Error("Brownfield Excel export contains a split price or the base B3 amount");
 if(view.priced&&view.currency==="thb"&&!written.includes("636,300.00"))throw Error("Brownfield Excel export is missing the combined THB total");
 if(view.priced&&view.currency==="usd"&&!written.includes("20,200.00 USD"))throw Error("Brownfield Excel export is missing the combined USD total");
 if(!view.priced&&UNPRICED_LEAK.test(written))throw Error("Unpriced brownfield Excel contains a money figure");
 if(/\nZPQ\n|\nOffshore working\n/.test("\n"+written+"\n"))throw Error("Brownfield Excel export still lists the day breakdown");
 xml=xml.replace(/<c r="E7"([^>]*)>[\s\S]*?<\/c>/,'<c r="E7"$1/>');
 xml=shiftBrownfieldSheetRows(xml,27,3);
 for(const [cell,value] of writes)xml=replaceBrownfieldCell(xml,cell,value);
 const changes=new Map([[sheetEntry.name,new TextEncoder().encode(xml)]]);
 return {bytes:rebuildZip(entries,changes),filename:b3BrownfieldExportFileName0553({audience:"official",extension:"xlsx"}),
  warnings:["Official additional schedule written into 4-Scope of Supply sheet 1. Base B3 and the annex sheets are not repriced. No docx library is installed."]};
}
