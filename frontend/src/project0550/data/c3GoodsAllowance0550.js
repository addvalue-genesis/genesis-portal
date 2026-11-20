import {generatedBidEstimate0550,kuSupportEquipmentTHB0550,kuSupportLotTHB0550} from './bidCompletion0550';
import {CHEVALIER_PBX_SUPPLY_0550} from './chevalierPbxQuote0550';
import {roundMoney0550,sumMoney0550} from './money0550';

export function c3GoodsBasis0550(data,equipment,systems,pbxQuote){
 const tokens=new Set([...systems,...equipment.map(line=>line.systemToken),'COMMON']);
 const bySystem=new Map([...tokens].map(token=>[token,{systemToken:token,costTHB:null,owners:new Set()}]));
 const add=(token,amount,id)=>{
  const row=bySystem.get(token);
  if(!row)return;
  row.costTHB=sumMoney0550([row.costTHB??0,amount]);
  row.owners.add(id);
 };
 const products=pbxQuote?.products||[];
 const exPhones=products.filter(item=>item.quoteEvidence.systemTokens.includes('TEL-IPP'));
 const productsGross=sumMoney0550(products.map(item=>item.quoteEvidence.quotedTotal));
 const exPhonesGross=sumMoney0550(exPhones.map(item=>item.quoteEvidence.quotedTotal));
 const ku=data.lines.find(line=>line.id==='LINE-BID-SUPPORT-TEL-VSAT-KU-0550');
 const splitKu=ku&&generatedBidEstimate0550(data,ku);
 for(const line of equipment){
  const cost=line.c3ProcurementCostTHB;
  if(!Number.isFinite(cost))continue;
  if(line.id===CHEVALIER_PBX_SUPPLY_0550&&productsGross>0&&exPhonesGross>0){
   const exPhoneCost=roundMoney0550(cost*exPhonesGross/productsGross);
   add('TEL-IPP',exPhoneCost,line.id);
   add(line.systemToken,roundMoney0550(cost-exPhoneCost),line.id);
  }else{
   const equipmentCost=line.id===ku?.id&&splitKu?roundMoney0550(cost*kuSupportEquipmentTHB0550/kuSupportLotTHB0550):cost;
   add(line.systemToken,equipmentCost,line.id);
  }
 }
 const ais=bySystem.get('TEL-AIS');
 const aisCompanySupply=ais?.costTHB===null&&equipment.some(line=>line.mrRequirementId==='MR-B1-AIS-CPY'&&line.mrScopeState?.excluded);
 if(aisCompanySupply)ais.costTHB=0;
 return [...bySystem.values()].map(row=>({...row,owners:[...row.owners],companySupply:row===ais&&aisCompanySupply}));
}

// Apportion the actual Working allowance in cents so all displayed shares
// reconcile to the existing price owners in both currencies.
export function c3GoodsShares0550(basis,allowances,currency){
 const priced=basis.filter(row=>row.costTHB>0&&!row.replaced);
 const total=sumMoney0550(priced.map(row=>row.costTHB));
 const amounts=new Map();
 for(const allowance of allowances){
  const amount=currency==='THB'?allowance.line.customerTHB:allowance.amount;
  if(!Number.isFinite(amount)||!(total>0))continue;
  let cumulative=0,allocated=0;
  for(const [i,row] of priced.entries()){
   cumulative=sumMoney0550([cumulative,row.costTHB]);
   const end=i===priced.length-1?amount:roundMoney0550(amount*cumulative/total);
   amounts.set(row.systemToken,sumMoney0550([amounts.get(row.systemToken)??0,roundMoney0550(end-allocated)]));
   allocated=end;
  }
 }
 return basis.map(row=>({...row,amount:row.companySupply?0:amounts.get(row.systemToken)??null}));
}
