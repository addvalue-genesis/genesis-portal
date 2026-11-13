// The rates are read from project DATA at runtime. The public bundle carries
// only the form structure and the rules for preparing Working allocations.
export const C8_CALLOFF_SCHEMA_0550='genesis.0550.c8-calloff.v1';
export const C8_CALLOFF_ENDPOINT_0550='/api/local/pj2608-0550/c8-calloff';
const maxBytes=16384;
export const C8_CALLOFF_COUNTRIES_0550=['Thailand','Germany','China','Myanmar'];
export const C8_CALLOFF_ITEMS_0550=[
 ['OFFICE','Office / workstations','MD','person-day'],
 ['TRANSPORT','Hotel–factory shuttle','MD','person-day'],
 ['AIRPORT','Airport pick-up & drop-off','SET','round trip'],
 ['OFFICE_CONSUMABLES','Office consumables','SET','set-day'],
 ['WORKING_LUNCH','Working lunch','MD','person-day'],
];
export const c8Unit0550=binding=>C8_CALLOFF_ITEMS_0550.find(([role])=>role===binding.summary)?.[3];
const reference='Exhibit A Annex 5 / Exhibit C Schedule C8';
const prefix='LINE-C8-CALLOFF-';
export const c8Country0550=binding=>binding.treatment==='CALLOFF'&&
 C8_CALLOFF_COUNTRIES_0550.find(country=>binding.lineId===prefix+country.toUpperCase()+'-'+binding.summary);
export const c8Revision0550=binding=>binding.line?.sourceRef?.match(/^C8 (Rev\d{2})\b/)?.[1]||'';

export function validateC8Calloff0550(pack){
 const positive=n=>Number.isFinite(n)&&n>0&&n<=1e7;
 const count=n=>positive(n)&&Number.isInteger(n);
 const invalid=()=>{throw Error('C8_CALLOFF_DATA_INVALID');};
 if(pack?.schema!==C8_CALLOFF_SCHEMA_0550||pack.projectId!=='PJ2608-0550'||
  !/^Rev\d{2}$/.test(pack.revision)||!/^PJ2608-0550_C8_CallOff_Budget_Rev\d{2}\.xlsx$/.test(pack.sourceFilename)||
  !Array.isArray(pack.countries)||pack.countries.length!==C8_CALLOFF_COUNTRIES_0550.length)invalid();
 for(const [index,country] of pack.countries.entries()){
  if(country?.name!==C8_CALLOFF_COUNTRIES_0550[index]||![country.people,country.days,country.airportTrips].every(count)||
   !Array.isArray(country.rates)||country.rates.length!==C8_CALLOFF_ITEMS_0550.length||
   !country.rates.every(rate=>Array.isArray(rate)&&rate.length===2&&positive(rate[0])&&positive(rate[1])))invalid();
 }
 return pack;
}

export async function fetchC8Calloff0550(fetcher=fetch){
 const response=await fetcher(C8_CALLOFF_ENDPOINT_0550,{cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(response.status===404||response.ok&&!response.headers.get('content-type')?.includes('application/json'))return null;
 if(!response.ok)throw Error('C8_CALLOFF_DATA_UNAVAILABLE');
 return parseC8Calloff0550(await response.text());
}

function parseC8Calloff0550(body){
 if(new Blob([body]).size>maxBytes)throw Error('C8_CALLOFF_DATA_INVALID');
 return validateC8Calloff0550(JSON.parse(body.replace(/^\uFEFF/,'')));
}

export async function readC8CalloffFile0550(file){
 if(file.size>maxBytes)throw Error('C8_CALLOFF_DATA_INVALID');
 return parseC8Calloff0550(await file.text());
}

export function c8CalloffDraftRows0550(pack){
 return validateC8Calloff0550(pack).countries.flatMap(({name,people,days,airportTrips,rates})=>
  C8_CALLOFF_ITEMS_0550.map(([summary,description,unit,formUnit],index)=>{
   const id=prefix+name.toUpperCase()+'-'+summary;
   const quantity=summary==='AIRPORT'?airportTrips:unit==='MD'?people*days:days;
   const sourceRef='C8 '+pack.revision+' / '+pack.sourceFilename+' / '+name+' / C8 Rates / item '+(index+1)+' / '+reference;
   const basis=people+' representatives × '+days+' witness days. '+airportTrips+' airport round trip(s). Estimated call-off subject to request.';
   return {line:{id,scopeKey:id,description,systemToken:'COMMON',wbs:'B8',customerRowCode:'B1',
    tagRef:name,requirementRef:reference,sourceRef,vendorId:'',offerId:'',calculationId:'',resultKey:'value',
    quantity,unit,currency:'USD',manualCost:rates[index][0],sellMode:'DIRECT',sellRate:rates[index][1],
    markupPct:null,marginPct:null,primePct:0,selected:false,customerRemark:basis},
    binding:{schedule:'C8',summary,treatment:'CALLOFF',locator:sourceRef,basis,deliveryTerm:name+' / '+formUnit}};
  }));
}

// Recognize the previous automatic estimates by both their saved values and
// source basis. An edited or reviewed allocation stays available for review.
export function legacyGeneratedC8Calloff0550(binding){
 const {line,summary}=binding;
 if(binding.schedule!=='C8'||binding.treatment!=='CALLOFF'||binding.status!=='DRAFT'||binding.reviewer||
  binding.deliveryTerm||binding.sourceIds?.length||!line||binding.locator!==line.sourceRef||
  binding.basis!==line.customerRemark||line.selected||line.unit!=='MD'||line.currency!=='THB'||
  line.sellMode!=='DIRECT'||line.primePct!==0||line.officialReview)return false;
 const rate={OFFICE:1000,TRANSPORT:2000,WORKING_LUNCH:500}[summary];
 if(!rate||line.manualCost!==rate||line.sellRate!==rate)return false;
 return (line.id==='LINE-CHEVALIER-PBX-BUDGET-C8-'+summary&&line.quantity===8&&
  line.sourceRef.startsWith('PABX estimated budget · 2026-11-13 / 8 purchaser man-days'))||
  (line.id==='LINE-MGW-CCTV-ENT-BUDGET-C8-'+summary&&line.quantity===1&&
  line.sourceRef.startsWith('Shared project call-off planning rate / Purchaser facilities'));
}
