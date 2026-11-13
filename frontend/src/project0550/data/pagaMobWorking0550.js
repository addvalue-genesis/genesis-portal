import {EXTERNAL_ENGINEERING_POLICY_0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {integrationFingerprint0550} from './integrationWorkspace0550';
import {roundMoney0550,sumMoney0550} from './money0550';
import {pagaRevisionSelected0550} from './supplierRevision0550';
import plan from './pagaMobPlan0550.json';

// This snapshot is internal Working planning data. No selected financial
// owner is created while overlap with shared Working owners is unresolved.
export function preparePagaMobWorking0550(data){
 const repo=data.repositoryBasisImport;
 if(!repo||repo.pagaMobPlan||pagaRevisionSelected0550(data)?.net.id!==plan.packageOfferId)return data;
 return {...data,repositoryBasisImport:{...repo,pagaMobPlan:plan}};
}

export function validPagaMobPlan0550(saved){
 return saved?.version===plan.version&&integrationFingerprint0550(saved)===integrationFingerprint0550(plan);
}

export function pagaMobWorking0550(data,team,policies){
 const saved=data.repositoryBasisImport?.pagaMobPlan;
 if(!saved||pagaRevisionSelected0550(data)?.net.id!==saved.packageOfferId)return null;
 const {basis,events}=saved;
 const quote=(id,currency,unit)=>data.offers.find(offer=>offer.id===id&&
  offer.vendorId==='VENDOR-IDIE-0550'&&offer.currency===currency&&offer.unit===unit&&offer.unitCost>0);
 const fat=quote(saved.fatOfferId,'THB','day'),supervisor=quote(saved.supervisorOfferId,'EUR','MD');
 const overtime=supervisor?.quoteEvidence?.rateBasis?.match(/normal-day overtime EUR (\d+(?:\.\d+)?)\/hour/i);
 const supervisorOT=Math.max(0,basis.siteDayHours-basis.idieRegularHours);
 const fx=currency=>data.fx.source?.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(data.fx.date)&&
  Number.isFinite(data.fx['thbPer'+currency])&&data.fx['thbPer'+currency]>0?data.fx['thbPer'+currency]:null;
 const usd=fx('USD'),eur=fx('EUR');
 const engineerRate=team.find(role=>role.role==='Senior Telecom Engineer')?.protectedUsdDay;
 const technicianRate=team.find(role=>role.role==='Chief Telecom Technician')?.protectedUsdDay;
 const labour=policyDefaults0550(policies,'Professional Service');
 const external=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 const rows=events.map(event=>{
  const {days,engineers,technicians,travelDays,fatDays,supervisorDays,supervisorTravelDays}=event;
  const site=travelDays>0,crew=engineers+technicians;
  const paidHours=days*(site?basis.siteDayHours:basis.localDayHours)+travelDays*basis.localDayHours;
  const personDays=(days+travelDays)*crew;
  const trips=(site?crew:0)+Number(supervisorTravelDays>0);
  const nights=(site?(days+basis.transitNights)*crew:0)+(supervisorTravelDays?supervisorDays+basis.transitNights:0);
  const labourTHB=roundMoney0550(paidHours*(engineers*basis.engineerTHBPerHour+technicians*basis.technicianTHBPerHour));
  let idieTHB=0;
  if(fatDays)idieTHB=fat?roundMoney0550(fatDays*fat.unitCost):null;
  if(supervisorDays||supervisorTravelDays){
   const siteEUR=supervisor&&(!supervisorOT||overtime)?
    (supervisorDays+supervisorTravelDays)*supervisor.unitCost+supervisorDays*supervisorOT*Number(overtime?.[1]??0):null;
   const siteTHB=siteEUR!==null&&eur!==null?roundMoney0550(siteEUR*eur):null;
   idieTHB=sumMoney0550([idieTHB,siteTHB]);
  }
  const travelTHB=roundMoney0550(trips*(basis.airfareTHB+basis.transferTHB+basis.permitTHB)+nights*basis.roomTHB+
   ((site?personDays:0)+supervisorDays+supervisorTravelDays)*basis.perDiemTHB);
  const costTHB=sumMoney0550([labourTHB,idieTHB,travelTHB]);
  const customerUSD=usd&&idieTHB!==null&&labour&&external&&[engineerRate,technicianRate].every(Number.isFinite)?
   roundMoney0550(paidHours/basis.localDayHours*(engineers*engineerRate+technicians*technicianRate)*(1+labour.primePct/100)+
    (idieTHB*(1+external.markupPct/100)*(1+external.primePct/100)+travelTHB)/usd):null;
  return {...event,personDays,trips,nights,labourTHB,idieTHB,travelTHB,costTHB,customerUSD};
 });
 const personnelTHB=basis.uniqueTravelers*(basis.medicalTHB+basis.workRiskTHB);
 const costTHB=sumMoney0550([...rows.map(row=>row.costTHB),personnelTHB]);
 const customerUSD=sumMoney0550([...rows.map(row=>row.customerUSD),usd?roundMoney0550(personnelTHB/usd):null]);
 return {plan:saved,rows,personnelTHB,costTHB,costUSD:costTHB!==null&&usd?roundMoney0550(costTHB/usd):null,customerUSD};
}
