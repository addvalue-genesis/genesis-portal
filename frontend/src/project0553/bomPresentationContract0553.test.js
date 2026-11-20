import {bomModuleId0553,bomPriceTHB0553,bomInclusion0553,bomEvidenceDisplay0553} from "./bomPresentationContract0553";
const assert=(yes,msg)=>{if(!yes)throw new Error(msg);};
export function validateBomPresentationContract0553(){
 const fx={thbPerUsd:31.5,date:"2026-10-14",source:"TEST_ONLY"};
 assert(bomModuleId0553({mr:"MR-0002",site:"ZWP20",itemId:"ZWP20-RFI-BDA-EXD-ENCLOSURE"})==="bid.budget.bom.mr0002.zwp20.zwp20-rfi-bda-exd-enclosure","Module ID invariant");
 assert(bomPriceTHB0553(10,"USD",fx).amount===315,"Currency conversion");
 assert(bomPriceTHB0553(10,"USD",null).state==="MISSING_FX","No silent default FX");
 assert(bomPriceTHB0553(null,"THB",fx).state==="MISSING_PRICE","Null must not become zero");
 const enclosure={priceInclusion:"INCLUDED_IN_MGW_R2_UHF1",parentPackage:"ZWP20-RFI-BDA",quoteLine:"UHF-1",countedInWorkingTotal:false};
 assert(bomInclusion0553(enclosure).included&&!bomInclusion0553(enclosure).additive,"No included double count");
 assert(bomEvidenceDisplay0553(enclosure,fx,[{id:"UHF-1",unitPriceUSD:31474}]).includes("THB"),"Quote parent THB evidence");
 return true;
}
