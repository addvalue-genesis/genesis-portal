const assert=require('node:assert/strict');
const path=require('node:path');
const babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),previous=require.extensions['.js'];
require.extensions['.js']=(module,file)=>file.startsWith(src+path.sep)?module._compile(babel.transformFileSync(file,{
 babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]
}).code,file):previous(module,file);

const {schematicQuantityMatrix0550,schematicQuantityGroups0550,NO_SITE_0550}=require(src+'/project0550/data/schematicQuantityMatrix0550');
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
const input={sourceIntake:{sources,findings:[],milestones:[]},offers:[native,duplicate,unknown,option],vendors:[]};
const before=JSON.stringify(input),result=schematicQuantityMatrix0550(input);

assert.equal(result.offered.length,3,'Identical original locators count once');
assert.equal(result.offered.find(x=>x.offer.id==='native').native.quantity,2);
assert.equal(result.offered.find(x=>x.offer.id==='native').building,null,'A site-only supplier quantity is not spread over buildings');
assert.deepEqual(result.offered.find(x=>x.offer.id==='native').exactTags,['CAM-317-201']);
assert.equal(result.offered.find(x=>x.offer.id==='unknown').site,NO_SITE_0550);
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
console.log('PASS 05.3 CUS/VND quantities, TAG deduplication/conflicts, exact quote TAGs, source revisions, site-only scope and no Working inputs.');
