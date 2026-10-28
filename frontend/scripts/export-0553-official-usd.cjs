// Use the same canonical model and native exporter as 10.3.4, without a browser.
// Optional --template=PATH repairs a partial native customer workbook.
// Explicit output required; never overwrite the supplied template.
const fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),original=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):original(m,f);
const {buildReleaseCommercialModel0553}=require('../src/project0553/data/releaseCommercialModel0553');
const {buildOfficialUsdRelease0553}=require('../src/project0553/data/officialUsdRelease0553');
const {buildNativeOfficialRelease0553}=require('../src/project0553/nativeWorkingDraft0553');
(async()=>{
 const option=name=>process.argv.find(x=>x.startsWith('--'+name+'='))?.slice(name.length+3);
 const output=option('output'),input=option('template');
 if(!output)throw Error('Required: --output=PATH.xlsx; optional: --template=PATH.xlsx');
 if(!/\.xlsx$/i.test(output)||input&&path.resolve(input)===path.resolve(output))throw Error('Use a separate .xlsx output path');
 const template=require('../src/project0553/data/nativeReleaseTemplate0553.json');
 const bytes=input?fs.readFileSync(input):Buffer.from(template.base64,'base64');
 const source=buildReleaseCommercialModel0553({thbPerUsd:31.5}),model=buildOfficialUsdRelease0553(source);
 const result=await buildNativeOfficialRelease0553({name:input||template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)},model);
 fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});
 fs.writeFileSync(output,Buffer.from(await result.blob.arrayBuffer()));
 console.log(JSON.stringify({output:path.resolve(output),partA:model.a.length,partB:model.b.length,totalUSD:model.totalUSD,unpriced:model.unpriced,optionsUSD:model.c.map(x=>({code:x.code,amount:x.budgetaryOptionQuoteUSD})),issued:model.issued}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
