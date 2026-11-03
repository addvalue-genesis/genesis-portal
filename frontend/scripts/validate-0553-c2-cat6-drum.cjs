// Owner-authorized single-row replacement. Independent R81 preservation baseline.
const assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const e of ['.js','.jsx'])require.extensions[e]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const prior=require('./fixtures/0553-before-c2-cat6-drum-20261103.json');
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
const official=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
const option=from('data/optionBudgetaryOffer0553').selectOptionBudgetaryOffer0553().offers.C2;
for(const [name,rows] of [['sourceRows',[...source.a,...source.b,...source.c]],['officialRows',[...official.a,...official.b,...official.c]]])
 for(const p of prior[name].filter(x=>x.code!=='C2'))assert.equal(hash(rows.find(x=>x.code===p.code)),p.sha256,'Unexpected change '+name+'/'+p.code);
assert.equal(hash(source.annex),prior.workingAnnex,'Raw Working Annex remains unchanged');
assert.equal(hash(official.otherSpareItemizedAnnex.rows.C1),prior.c1);
assert.equal(hash(from('data/sparePricedBudgetReview0553').selectSparePricedBudgetReview0553().rows.C2),prior.rawC2);
for(const p of prior.c2.rows.filter(x=>!['C2-REV08-10','C2-REV08-09'].includes(x.id)))assert.deepEqual(option.rows.find(x=>x.id===p.id),p,'Other C2 row changed '+p.id);
assert.equal(option.rows.length,11);assert(!option.rows.some(x=>x.id==='C2-REV08-07'));
const r=option.rows.find(x=>x.id==='C2-REV08-10'),d=r.budgetDecision;
assert.equal(d.historicalRateTHBPerM,524);assert.equal(d.budgetCostTHBPerM,650);
assert.equal(d.lengthPerDrumM,300);assert.equal(d.totalLengthM,300);assert.equal(d.quantity,1);
assert.equal(r.quantity,1);assert.equal(r.qty,1);assert.equal(r.unit,'drum');
assert.equal(r.extendedCostTHB,300*650);assert.equal(r.unitCostTHB,195000);
assert.deepEqual(r.pricingBasis,{directCostTHB:195000,samTelShareTHB:39000,addvalueTargetProfitTHB:9750,omissionReserveTHB:9750,customerSellTHB:253500});
assert.equal(r.extendedTHB,195000*1.30);assert.equal(r.unitPriceTHB,253500);
assert.equal(r.sourceTotalUSD,Math.round(253500/31.5*100)/100);
assert.equal(r.unitUSD,Math.ceil((195000*1.30/31.5)/10)*10);assert.equal(r.totalUSD,8050);
assert.equal(r.upwardRoundingUSD,2.38);assert.equal(r.roundingAdjustmentUSD,2.38);
assert.equal(r.evidenceClass,'OWNER_PLANNING_ALLOWANCE_NOT_CURRENT_VENDOR_QUOTE');
assert(!d.factoryDrumLengthConfirmed&&!d.currentSupplierPriceConfirmed&&!d.procurementApproved&&!d.technicalCompatibilityConfirmed);
assert.equal(d.separatePackingAndFreightCostTHB,null);
assert.equal(r.sourceRowModuleId,'bid.budget.working.bc.c2.priced-budget-review.c2-rev08-10');
assert.equal(option.ownerCableReplacement.priorRow.quantity,50);assert.equal(option.ownerCableReplacement.priorRow.totalUSD,1500);
assert.equal(option.sourceSellTHB,852086.5);assert.equal(option.priorSelectedSourceSellTHB,436595.65);
assert.equal(option.budgetaryQuoteUSD,prior.c2.budgetaryQuoteUSD-1500+8050+option.ownerRfCableReplacement.quoteDeltaUSD);assert.equal(option.budgetaryQuoteUSD,27220);
assert.equal(option.rows.reduce((n,x)=>n+x.totalUSD,0),27220);assert.equal(option.ownerCableReplacement.quoteDeltaUSD,6550);
assert.equal(source.c.find(x=>x.code==='C2').budgetaryOptionOfferTHB,852086.5);
assert.equal(source.c.find(x=>x.code==='C2').budgetaryOptionOfferUSD,27220);
assert.equal(official.c.find(x=>x.code==='C2').budgetaryOptionQuoteUSD,27220);assert.equal(official.totalUSD,894910);
const shown=official.otherSpareItemizedAnnex.rows.C2.find(x=>x.id===r.id);
assert.equal(shown.qty,1);assert.equal(shown.unit,'drum');assert.equal(shown.totalUSD,8050);assert.equal(shown.totalTHB,253500);
assert(shown.specification.includes('300 metres continuous cable')&&shown.specification.includes('connectors')===false);
assert(shown.materials.includes('connectors and glands excluded'));assert(!shown.physicalSkuApproved&&!shown.customerIssued);
const css=from('data/cssRfCableReferences0553').CSS_RF_CABLE_REFERENCES_0553;
assert.equal(css[0].partNo,'LDF4RK-50A');assert.equal(css[0].quantity,305);assert.equal(css[0].unitPriceTHB,550);assert.equal(css[0].customer,'Royaltec International');
assert.equal(css[1].partNo,'AVA5RK-50');assert.equal(css[1].unit,'EA');assert.equal(css[1].customer,'Add Value System');
assert(css.every(x=>!x.postToPricing&&!x.purchaseConfirmed&&!x.equivalenceToSelectedForllerConfirmed&&!x.quotationSaysFactoryDrum));
const React=require('react'),render=require('react-dom/server').renderToStaticMarkup;
const internal=render(React.createElement(from('C2TagReview0553').C2TagReview0553));
assert(internal.includes('1 drum')&&internal.includes('300m continuous length')&&internal.includes('195,000.00')&&internal.includes('27,220.00'));
const sourcePanel=render(React.createElement(from('SparePricedBudgetReview0553').SparePricedBudgetReview0553,{code:'C2',context:'working'}));
assert.equal((sourcePanel.match(/data-component-key="bid\.budget\.working\.bc\.c2\.priced-budget-review\.c2-rev08-10"/g)||[]).length,1,'One existing source anchor must open the current replacement');
assert(sourcePanel.includes('Current item10 replacement')&&sourcePanel.includes('253,500.00'));

const customer=render(React.createElement(from('OtherSpareOriginalAnnex0553').OtherSpareOriginalAnnex0553,{code:'C2',model:official.otherSpareItemizedAnnex}));
assert(customer.includes('300 metres')&&customer.includes('8,050.00')&&customer.includes('27,220.00'));
for(const text of ['OWNER_PLANNING','THB650','195,000','CSS RF cable','QT-H670003342'])assert(!customer.includes(text),'Internal reference leak '+text);
const native=from('nativeWorkingDraft0553'),template=from('data/nativeReleaseTemplate0553.json'),bytes=Buffer.from(template.base64,'base64');
const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
const cell=(xml,a)=>xml.match(new RegExp('<c\\b[^>]*r="'+a+'"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'))?.[1]||'';
const value=(xml,a,n)=>assert(cell(xml,a).includes('<v>'+n+'</v>'),a+' stale, expected '+n);
(async()=>{
 const usd=await native.buildNativeOfficialRelease0553(file,official),thb=await native.buildNativeWorkingDraft0553(file,source);
 const breakdown=await from('nativePriceBreakdown0553').buildNativePriceBreakdown0553(file,official,from('data/customerPriceBreakdown0553').buildCustomerPriceBreakdown0553(source,official));
 for(const [kind,out] of [['USD',usd],['THB',thb],['Breakdown',breakdown]]){
  const zip=native.entriesFromZip(new Uint8Array(await out.blob.arrayBuffer())),read=async i=>new TextDecoder().decode(await native.readEntry(zip.find(x=>x.name==='xl/worksheets/sheet'+i+'.xml')));
  const scope=await read(1),annex=await read(6),isThb=kind==='THB';
  value(scope,'F42',isThb?852086.5:27220);value(scope,'G42',isThb?852086.5:27220);
  value(annex,'G14',1);value(annex,'H14',isThb?253500:8050);value(annex,'I14',isThb?253500:8050);value(annex,'I19',isThb?852086.5:27220);
  assert(cell(annex,'D14').includes('300m drum'));assert(cell(annex,'E14').includes('TECKNIKABEL'));
  assert(cell(annex,'E14').includes('300 metres continuous cable'));
  for(const text of ['OWNER_PLANNING','195000','budgetCostTHBPerM','QT-H670003342'])assert(!annex.includes(text),'Internal cost/reference exported '+text);
  if(!isThb)value(scope,'G38',894910);
 }
 // Reusing an old, filled50m file must not resurrect old Qty/unit/amount.
 const parts=native.entriesFromZip(new Uint8Array(await usd.blob.arrayBuffer()));
 let oldXml=new TextDecoder().decode(await native.readEntry(parts.find(x=>x.name==='xl/worksheets/sheet6.xml')));
 for(const [a,v] of [['G14',50],['H14',30],['I14',1500],['I19',14340]])
  oldXml=oldXml.replace(new RegExp('(<c\\b[^>]*r="'+a+'"[^>]*>)[\\s\\S]*?</c>'),'$1<v>'+v+'</v></c>');
 const oldBytes=native.rebuildZip(parts,new Map([['xl/worksheets/sheet6.xml',new TextEncoder().encode(oldXml)]]));
 const oldFile={name:'Old50m.xlsx',arrayBuffer:async()=>oldBytes.buffer.slice(oldBytes.byteOffset,oldBytes.byteOffset+oldBytes.length)};
 const fixed=await native.buildNativeOfficialRelease0553(oldFile,official),again=await native.buildNativeOfficialRelease0553({name:usd.filename,arrayBuffer:()=>usd.blob.arrayBuffer()},official);
 assert.deepEqual(new Uint8Array(await fixed.blob.arrayBuffer()),new Uint8Array(await usd.blob.arrayBuffer()));
 assert.deepEqual(new Uint8Array(await again.blob.arrayBuffer()),new Uint8Array(await usd.blob.arrayBuffer()));
 console.log('PASS C2 CAT6A: owner300m drum / THB650 planning cost /195000×1.30÷31.5→USD8050; C227220, A+B894910; all unrelated C2 rows and A/B/C1/raw sources unchanged; subsequent RF owner replacement checked separately; Source/Scope/UI/USD/THB/Breakdown/stale/repeated exports agree; CSS quotes nonposting.');
})().catch(e=>{console.error(e);process.exitCode=1;});
