const assert=require('node:assert/strict');
const path=require('node:path');
const babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),previous=require.extensions['.js'];
require.extensions['.js']=(module,file)=>file.startsWith(src+path.sep)?module._compile(babel.transformFileSync(file,{
 babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]
}).code,file):previous(module,file);

const {schematicQuantityMatrix0550,schematicQuantityGroups0550,NO_SITE_0550}=require(src+'/project0550/data/schematicQuantityMatrix0550');
const {schematicCoverage0550}=require(src+'/project0550/data/schematicCoverage0550');
const source=(id,documentNo,content,authority='CURRENT_TENDER')=>({
 id,documentNo,revision:'B1',content,authority,readState:'TEXT_READ',replaces:[]
});
const prefix='MM-ASK-1A-APF-TEL-';
const sources=[
 source('mr',prefix+'MR-0001','Material Requisition Rev.B1'),
 source('dts',prefix+'DTS-0004',[
  '[PDF PAGE 12]','APF','ITEM   BUILDING   TAG NO.   EQUIPMENT   LOCATION','1   CATERING BUILDING',
  'CAM-317-201   Fixed Camera   Food Court','CAM-317-201   Fixed Camera   Food Court',
  'CAM-317-202   Fixed Camera   Food Court','2   OFFICE BUILDING','CAM-317-202   PTZ Camera   Corridor',
  'ACP','1   E&I CABIN','CAM-317-201   Fixed Camera   Technical Room'
 ].join('\n')),
 source('lis',prefix+'LIS-0001','[PDF PAGE 3]\nCAM-317-201   CCTV Fixed Camera   1 PC','HISTORICAL'),
 source('interface',prefix+'LIS-0004','CAM-317-999   CCTV Camera   9 PC')
];
const quote=(id,description,locator,quotedQuantity,extra={})=>({id,description,quoteRef:'Q-QA',vendorId:'V-QA',
 unit:'U',unitCost:99000,quoteEvidence:{systemTokens:['TEL-CCTV'],sourceSha256:'a'.repeat(64),revision:'R1',locator,
 quotedQuantity,quotedUnit:'Sets',quotedUnitCost:1,classification:'RATE',terms:[],...extra}});
const native=quote('native','APF · Fixed Camera CAM-317-201','PDF p1 / CCTV / APF / SN 1',2);
const duplicate={...native,id:'native-duplicate'};
const unknown=quote('unknown','Fixed Camera','PDF p1 / CCTV / SN 2',3);
const option=quote('option','APF · Fixed Camera','PDF p1 / CCTV / APF / SN 3',5,{classification:'OPTION'});
const monitor=quote('monitor','APF · CCTV Workstation','PDF p1 / CCTV / APF / SN 4',2,{
 terms:['CCTV monitor 27" and 70" will be installed in Control room and Security Building']
});
const input={sourceIntake:{sources,findings:[],milestones:[]},offers:[native,duplicate,unknown,option,monitor],vendors:[]};
const before=JSON.stringify(input),result=schematicQuantityMatrix0550(input);

assert.equal(result.offered.length,4,'Identical original locators count once');
assert.equal(result.offered.find(x=>x.offer.id==='native').native.quantity,2);
assert.equal(result.offered.find(x=>x.offer.id==='native').building,null,'A site-only supplier quantity is not spread over buildings');
assert.deepEqual(result.offered.find(x=>x.offer.id==='native').exactTags,['CAM-317-201']);
assert.equal(result.offered.find(x=>x.offer.id==='unknown').site,NO_SITE_0550);
assert.equal(result.offered.find(x=>x.offer.id==='monitor').building,null,'Combined room and building quantities stay at site level');
assert.equal(result.required.find(x=>x.id==='MR-B1-13-APF-12').building,null);
assert.equal(schematicQuantityGroups0550(result.offered.filter(x=>x.site==='APF'),true)[0].quantity,2,'Option is separate');
const apf=result.tags.filter(x=>x.site==='APF'&&x.basis==='DTS');
assert.equal(apf.length,2);
assert.equal(apf.find(x=>x.tag==='CAM-317-201').building,'Catering Building');
assert.equal(apf.find(x=>x.tag==='CAM-317-202').building,null);
assert.equal(apf.find(x=>x.tag==='CAM-317-202').conflict,true);
assert(result.tags.some(x=>x.site==='ACP'&&x.tag==='CAM-317-201'));
assert(result.tags.some(x=>x.basis==='LIS อ้างอิง'&&x.quantity===1));
assert(!result.tags.some(x=>x.tag==='CAM-317-999'),'Interface Matrix does not create Equipment LIS quantities');
assert.equal(schematicQuantityGroups0550(result.required.filter(x=>x.site==='APF'&&x.system==='TEL-CCTV')).find(x=>x.label==='Camera').quantity,63);
assert.deepEqual(schematicQuantityMatrix0550({...input,lines:[{quantity:9999}],fx:{thbPerUSD:1},integrationWorkspace:{requirements:[]}}),result);
assert.equal(schematicQuantityMatrix0550({...input,sourceIntake:{...input.sourceIntake,sources:sources.map(s=>s.id==='mr'?{...s,revision:'B2'}:s)}}).required.length,0);
assert.equal(JSON.stringify(input),before);
const cameraMr=result.required.filter(row=>row.site==='APF'&&row.system==='TEL-CCTV'&&row.type==='Camera');
const station=(description,quantity)=>({
 system:'TEL-CCTV',type:'Camera',description,quoteKey:'Q26-063',
 offer:{},native:{quantity,unit:'Sets'},multipleSystems:false,
});
const cameraVnd=[station('Hazardous Area PTZ Camera Station',20),station('Hazardous Area FIXED Camera',2),
 station('Fixed Lens Type Bullet Camera',6),station('Fixed Lens Type Dome Camera',30),station('PTZ Dome Camera',5)];
const gaps=schematicCoverage0550(cameraMr,cameraVnd,{completeCameraRegister:true});
assert.deepEqual(gaps.filter(row=>row.delta!==0).map(row=>[row.label,row.status,row.delta]),[
 ['Ex PTZ','SHORT',-2],['Ex Fixed','EXCESS',2],
]);
assert(!schematicCoverage0550(cameraMr,cameraVnd).some(row=>row.status==='EXCESS'),'Incomplete evidence cannot infer a zero side');
assert(!schematicCoverage0550(cameraMr,cameraVnd,{partialCameraRegister:true}).some(row=>Number.isFinite(row.delta)));
assert(!schematicCoverage0550(cameraMr,[]).some(row=>row.status==='SHORT'),'Missing quote is not a zero quantity');
assert(!schematicCoverage0550(cameraMr,cameraVnd,{building:true,hasUnlocatedOffer:true}).some(row=>Number.isFinite(row.delta)),
 'Quantities still at site level cannot be allocated to the building');
assert.equal(schematicCoverage0550(cameraMr,[cameraVnd[0],{...cameraVnd[0],quoteKey:'another revision'}])
 .find(row=>row.label==='Ex PTZ').status,'OPEN');
assert.equal(schematicCoverage0550(cameraMr,[cameraVnd[0],{...cameraVnd[0],native:{quantity:2,unit:'PC'}}])
 .find(row=>row.label==='Ex PTZ').offeredQty,null,'Mixed units cannot be added');
const {MGW_CURRENT_BATCH_0550,MGW_CURRENT_PREFIX_0550,MGW_CURRENT_QUOTE_0550,MGW_CURRENT_SOURCE_HASH_0550}=
 require(src+'/project0550/data/mgwQuoteSelection0550');
const cabinetOffer=(sn,index,name,count,unit,term,section='LAN')=>({
 ...quote(MGW_CURRENT_PREFIX_0550+section+'-APF-'+sn+'-0'+index,'APF · '+name,
  'PDF p1 / '+section+' / APF / SN '+sn+'.0 / row '+index,count,{
   systemTokens:[section==='FO'?'TEL-FO':section==='PABX'?(sn===9?'TEL-PABX':'TEL-IPP'):'TEL-LAN'],sourceId:MGW_CURRENT_BATCH_0550,
   sourceSha256:MGW_CURRENT_SOURCE_HASH_0550,quotedUnit:unit,terms:[term],
  }),
 quoteRef:MGW_CURRENT_QUOTE_0550,
});
const lan=schematicQuantityMatrix0550({...input,offers:[
 cabinetOffer(9,1,'LAN Cabinet, IP54',1,'Lot','Installed in Instrument & Telecom Room'),
 cabinetOffer(9,5,'Access Switch L3',1,'Set','~ 1 x PoE+ Switch'),
 cabinetOffer(10,1,'LAN Cabinet, IP54',8,'Lot','Multi-building cabinet package'),
 cabinetOffer(10,2,'Access Switch L3',16,'Set','~ 1 x PoE+ Switch'),
 cabinetOffer(10,3,'24 Ports CAT6A Patch Panel',32,'Set','~ Discrete distribution module Panel, 24 port'),
 cabinetOffer(10,1,'24 Ports Fiber Patch Panel',8,'Set','~ 1 x Fiber Optic Patch Panel','FO'),
 cabinetOffer(7,1,'Ex-Proof Telephone',3,'Set','~ 1 x Ethernet Media Convrter, 1G SPF Uplink','PABX'),
]});
const lanMr=lan.required.filter(row=>row.system==='TEL-LAN'&&row.site==='APF');
const lanVnd=lan.offered.filter(row=>row.system==='TEL-LAN');
const compareLan=(mrRows,vndRows,options)=>schematicCoverage0550(mrRows,vndRows,{packageOffers:lan.offered,...options});
const lanChecks=compareLan(lanMr,lanVnd);
const bom=(rows,sn,label)=>rows.find(row=>row.packageLabel==='MR '+sn+'.0 · LAN Cabinet'&&row.label===label);
const compared=row=>[row.requiredQty,row.offeredQty,row.delta,row.status];
assert.deepEqual(compared(bom(lanChecks,9,'จำนวนตู้')),[1,1,0,'MATCH']);
assert.deepEqual(compared(bom(lanChecks,10,'จำนวนตู้')),[8,8,0,'MATCH']);
assert.deepEqual(compared(bom(lanChecks,10,'Access Switch')),[16,16,0,'MATCH']);
assert.deepEqual(compared(bom(lanChecks,10,'UTP Patch Panel')),[16,32,16,'EXCESS']);
assert.deepEqual(compared(bom(lanChecks,10,'FO Patch Panel')),[8,8,0,'MATCH']);
assert.deepEqual(compared(bom(lanChecks,9,'Media Converter')),[3,null,null,'OPEN']);
const converter=bom(lanChecks,9,'Media Converter');
assert.equal(converter.offers.length,0,'The field package cannot satisfy the rack-side quantity');
assert.equal(converter.tieInOffers[0].offer.id,MGW_CURRENT_PREFIX_0550+'PABX-APF-7-01');
assert.match(converter.tieInBasis,/JB-304-001.*TPH-304-001/);
assert.equal(lanChecks.flatMap(row=>[...row.offers,...(row.tieInOffers||[])]).length,lan.offered.length,'Each offer appears once in LAN comparison or related evidence');
const server=cabinetOffer(9,1,'PABX Server',1,'Not stated','~ 1 x Dell R250 4*3.5 E-2334G /16G/2*2T SATA Server','PABX');
const withTieIn=schematicQuantityMatrix0550({...input,offers:[...lan.offered.map(row=>row.offer).map(offer=>
 offer.id.endsWith('LAN-APF-9-05')?{...offer,quoteEvidence:{...offer.quoteEvidence,terms:[...offer.quoteEvidence.terms,'~ 2 x 10G SFP+ Module | SFP-10G-LR']}}:offer),server]});
const apfEvidence=withTieIn.offered;
const compareEvidence=offers=>schematicCoverage0550(lanMr,offers.filter(row=>row.system==='TEL-LAN'),{packageOffers:offers});
const checked=compareEvidence(apfEvidence);
assert.deepEqual(compared(bom(checked,9,'IP PBX Server')),[1,1,0,'MATCH']);
assert.equal(bom(checked,9,'IP PBX Server').offers[0].native.unit,'Not stated','Original VND unit is preserved');
assert.deepEqual(compared(bom(checked,9,'Media Converter')),[3,null,null,'TIE_IN']);
assert.equal(bom(checked,9,'Media Converter').tieInOffers.length,2);
assert.deepEqual(compared(bom(compareEvidence(apfEvidence.filter(row=>!row.offer.id.endsWith('LAN-APF-9-05'))),9,'Media Converter')),[3,null,null,'OPEN']);
const withoutBom=apfEvidence.map(row=>row.offer.id===server.id?{...row,offer:{...row.offer,quoteEvidence:{...row.offer.quoteEvidence,terms:[]}}}:row);
assert.deepEqual(compared(bom(compareEvidence(withoutBom),9,'IP PBX Server')),[1,1,null,'OPEN']);
const control='Control Building';
const cabinetChecks=compareLan(lanMr.filter(row=>row.building===control),lanVnd.filter(row=>row.building===control),
 {building:true,place:control,hasUnlocatedOffer:true});
assert.deepEqual(compared(bom(cabinetChecks,9,'Access Switch')),[1,1,0,'MATCH']);
assert(!bom(cabinetChecks,10,'Access Switch'),'An eight-building package stays at site level');
console.log('PASS 05.3 CUS/VND quantities, TAG deduplication/conflicts, exact quote TAGs, source revisions, site-only scope LAN cabinet BOM reconciliation and no Working inputs.');
