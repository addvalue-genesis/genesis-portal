// PJ2608-0553 — ADDITIONAL proposal for brownfield ZPQ / ZWP8 / ZWP11.
// Read-only. Does not post into the original Scope of Supply, the selected
// B3 working sell, or the release commercial model.
import {selectB3SelectedSatSurveyPrice0553} from "./b3SelectedSatSurveyPrice0553";
import {selectB9ChinaWorkingBudget0553} from "./b9ChinaWorkingBudget0553";
import {selectB3MgwPurchasedFatWorkingSell0553} from "./b3MgwPurchasedFatWorkingSell0553";
import {PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {MR0001_SITE_CLASSIFICATION} from "./mr0001SiteClassification";
import {MR0003_MR0004_SCOPE_C1} from "./mr0003Mr0004ScopeC1";
import {MR0002_BDA_DEVIATION_REV00_0553} from "./mr0002DeviationBdaRev00_0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";

export const B3BF_LAST_LINE_NOTE_0553="Note: Working days on the Greenfield/base B3 scope have been reduced by 5 working days. / ปรับลดวันทำงานไปที่ Greenfield/base B3 ลดลง 5 วันทำงาน";
export const B3BF_NET_CALENDAR_DAYS_0553=14;
export const B3BF_CARVEOUT_DAYS_0553=5;
export const B3BF_BROWNFIELD_SITES_0553=Object.freeze(["ZPQ","ZWP8","ZWP11"]);
export const B3BF_INSTALLER_0553="Jutal team (installation and cable routing)";
const NOT_IN_SCOPE="Not in scope (greenfield ZWP20-23)";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const clean=s=>String(s??"").replace(/\s+/g," ").trim();
const freeze=value=>{
 if(value&&typeof value==="object"&&!Object.isFrozen(value)){
  Object.values(value).forEach(freeze);Object.freeze(value);
 }
 return value;
};
const qtyTextOf=text=>{
 const lines=String(text||"").split(/\n/).map(s=>s.trim()).filter(Boolean);
 if(!lines.length)return "OPEN";
 return lines.every(line=>line===lines[0])?lines[0]:lines.join(", ");
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
   tags,tagText:tags.length?tags.join(" / "):clean(row.sourcePartText)||"(no tag)",
   description:clean(row.sourceDescription),qtyText:qtyTextOf(row.sourceQuantityText),
   supplyBy:"Base A1",status:"Supplied under base",priceTHB:null,
   jbState:jb.state,jbText:jb.text,installer:B3BF_INSTALLER_0553,
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
function referencePartB(){
 return PART_BC_WBS_SOURCE_0553.summary.filter(row=>/^B\d+$/.test(row.code)).map(row=>({
  code:row.code,priceTHB:null,
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
 const teamDayTHB=sat.satTeamDaySellTHB;
 const seniorLineTHB=round(days*senior.thbPerPersonDay);
 const specialistLineTHB=round(days*specialist.thbPerPersonDay);
 const proposalTHB=round(days*teamDayTHB);
 const baseB3WorkingSellTHB=round(sat.includedB3SatSurveyToolsWorkingSellTHB+china.fatWorkingSellTHB+purchased.selectedIncrementalWorkingSellTHB);
 const carveC1THB=sat.siteSurveyWorkingSellTHB;
 const carveC2THB=round(B3BF_CARVEOUT_DAYS_0553*teamDayTHB);
 if(sat.fxTHBPerUSD!==31.5||senior.usdPerPersonDay!==1000||specialist.usdPerPersonDay!==800||
    senior.thbPerPersonDay!==31500||specialist.thbPerPersonDay!==25200||teamDayTHB!==56700||
    seniorLineTHB!==441000||specialistLineTHB!==352800||proposalTHB!==793800||
    round(seniorLineTHB+specialistLineTHB)!==proposalTHB||
    sat.satTeamDays!==28||sat.satWorkingSellTHB!==1587600||sat.siteSurveyTeamDays!==5||
    carveC1THB!==252000||carveC2THB!==283500||sat.veexWorkingSellTHB!==30000||
    china.fatWorkingSellTHB!==452850||purchased.selectedIncrementalWorkingSellTHB!==0||
    baseB3WorkingSellTHB!==2322450)
  throw Error("B3 brownfield additional price does not match the read-only B3 basis");
 if(satBefore!==snapshot(selectB3SelectedSatSurveyPrice0553)||
    chinaBefore!==snapshot(selectB9ChinaWorkingBudget0553)||
    purchasedBefore!==snapshot(selectB3MgwPurchasedFatWorkingSell0553))
  throw Error("Brownfield additional proposal mutated an existing B3 price source");
 const a1Rows=brownfieldA1Rows();
 const bomLines=[
  {id:"BF.1.1",kind:"role",activity:senior.role,persons:1,days,unit:"man-day",
   usdPerPersonDay:senior.usdPerPersonDay,fxTHBPerUSD:sat.fxTHBPerUSD,
   unitRateTHB:senior.thbPerPersonDay,totalTHB:seniorLineTHB,countsInSubtotal:true,
   remarks:"Existing SAT role rate"},
  {id:"BF.1.2",kind:"role",activity:specialist.role,persons:1,days,unit:"man-day",
   usdPerPersonDay:specialist.usdPerPersonDay,fxTHBPerUSD:sat.fxTHBPerUSD,
   unitRateTHB:specialist.thbPerPersonDay,totalTHB:specialistLineTHB,countsInSubtotal:true,
   remarks:"Existing SAT role rate"},
  {id:"BF.1.3",kind:"check",activity:"Team-day check: 2 persons × 14 days",persons:2,days,unit:"team-day",
   usdPerPersonDay:senior.usdPerPersonDay+specialist.usdPerPersonDay,fxTHBPerUSD:sat.fxTHBPerUSD,
   unitRateTHB:teamDayTHB,totalTHB:null,countsInSubtotal:false,
   remarks:"(= BF.1.1 + BF.1.2) — not a second charge"},
  {id:"BF.1.4",kind:"open",activity:"Mobilisation / demobilisation of team",persons:null,days:null,unit:"lot",
   unitRateTHB:null,totalTHB:null,countsInSubtotal:false,display:"OPEN",remarks:"TBA — not counted"},
  {id:"BF.1.5",kind:"company",activity:"Offshore transfer — boat / helicopter",persons:null,days:null,unit:"—",
   unitRateTHB:null,totalTHB:null,countsInSubtotal:false,display:"By Company",remarks:"Arranged by Company"},
  {id:"BF.1.6",kind:"open",activity:"Offshore POB, accommodation, meals, medical / offshore certificates",persons:null,days:null,unit:"—",
   unitRateTHB:null,totalTHB:null,countsInSubtotal:false,display:"OPEN",remarks:"TBA — not counted"},
  {id:"BF.1.7",kind:"jutal",activity:"Installation and cable routing",persons:null,days:null,unit:"—",
   unitRateTHB:null,totalTHB:null,countsInSubtotal:false,display:"By Jutal team",remarks:"No price in this proposal"},
  {id:"BF.INFO",kind:"info",activity:"Greenfield/base B3 reduced by 5 working days",
   countsInSubtotal:false,unitRateTHB:null,totalTHB:null,
   remarks:"Carve-out basis OPEN. No price effect in this proposal. Base B3 is not modified."},
  {id:"BF.NOTE",kind:"note",text:B3BF_LAST_LINE_NOTE_0553,countsInSubtotal:false,totalTHB:null}
 ];
 if(bomLines[bomLines.length-1].text!==B3BF_LAST_LINE_NOTE_0553)
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
  {id:"mob",topic:"MOB/DEMOB",detail:"Mobilisation / demobilisation is OPEN (TBA) and is not counted."},
  {id:"pob",topic:"Accommodation / POB / medical / visa",detail:"Offshore POB, accommodation, meals, medical and offshore certificates are OPEN (TBA) and are not counted."},
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
  currency:"THB",netCalendarDays:days,teamPersons:2,fxTHBPerUSD:sat.fxTHBPerUSD,
  teamDayTHB,proposalTHB,partATHB:0,partBReferencePriceTHB:null,grandTotalTHB:proposalTHB,
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
  bomLines,lastLineNote:B3BF_LAST_LINE_NOTE_0553,siteRows,a1Rows,
  otherPartA:otherPartA(),partB,openItems
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
export function buildB3BrownfieldAdditionalCsv0553(model,{priced,itemized}={}){
 if(!model||model.id!=="PJ2608-0553-B3BF-ADDITIONAL")throw Error("Brownfield CSV requires the additional-proposal model");
 const money=priced!==false;
 const showRates=money&&itemized!==false;
 const header=["SN","Item Description","Unit","Qty."];
 if(showRates)header.push("Unit Rate (THB)");
 if(money)header.push("Amount (THB)");
 header.push("Notes");
 const rows=[header];
 const push=(sn,description,unit,qty,rate,amount,notes)=>{
  const line=[sn,description,unit,qty];
  if(showRates)line.push(rate??"");
  if(money)line.push(amount??"");
  line.push(notes??"");
  rows.push(line);
 };
 const moneyText=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
 push("A1","Brownfield SCADA radio items","Lot",String(model.a1Rows.length),"",money?moneyText(0):"","Supplied under base");
 for(const row of model.a1Rows)push(row.sn,row.tagText+" — "+row.description,row.qtyText,row.site,"","",row.status+" · "+row.jbText+" · "+row.installer);
 rows.push(["",model.exclusion,"","","","",""].slice(0,header.length));
 for(const row of model.otherPartA)push(row.sn,row.title+" — "+row.description,"","", "","",row.status);
 push("B3-BF","Brownfield inspection, testing and certification — additional","Lot","1",
  money?moneyText(model.proposalTHB):"",money?moneyText(model.proposalTHB):"","Net additional. Original quotation unchanged.");
 if(itemized!==false){
  for(const line of model.bomLines){
   if(line.kind==="note")continue;
   if(line.kind==="info"){push("",line.activity,"","","","",line.remarks);continue;}
   const rate=line.kind==="check"?"(= BF.1.1 + BF.1.2)":line.display||(Number.isFinite(line.unitRateTHB)?moneyText(line.unitRateTHB):"");
   const amount=line.display||(Number.isFinite(line.totalTHB)?moneyText(line.totalTHB):"");
   push(line.id,line.activity,line.unit??"",line.days??line.persons??"",showRates?rate:"",money&&line.kind!=="check"?amount:"",line.remarks||"");
  }
  for(const site of model.siteRows)push(site.sn,site.description,"day","OPEN","","",site.jbText+" · "+site.installer);
 }
 for(const row of model.partB)push(row.code,row.note,"","","","",row.note);
 if(money){
  push("","Part A","","","",moneyText(model.partATHB),"Supplied under base");
  push("","Part B reference lines","","","","","No price");
  push("","B3 Brownfield Additional","","","",moneyText(model.proposalTHB),"14 team-days");
  push("","Grand total of this additional proposal (excl. OPEN items)","","","",moneyText(model.grandTotalTHB),"THB");
  push("","Carve-out C1 "+model.carveOut.c1.basis,"day",String(model.carveOut.c1.days),"",moneyText(model.carveOut.c1.valueTHB),"OPEN — not applied");
  push("","Carve-out C2 "+model.carveOut.c2.basis,"day",String(model.carveOut.c2.days),"",moneyText(model.carveOut.c2.valueTHB),"OPEN — not applied");
 }
 for(const item of model.openItems)push("",item.topic,"","","","",item.detail);
 rows.push(["",model.lastLineNote,"","","","",""].slice(0,header.length));
 const text=rows.map(row=>row.map(csvCell).join(",")).join("\n");
 if(!money&&/793,?800|56,?700|31,?500|25,?200|441,?000|352,?800|252,?000|283,?500|2,?322,?450|452,?850|1,?587,?600|USD/.test(text))
  throw Error("Unpriced brownfield export contains a money figure");
 return text;
}
