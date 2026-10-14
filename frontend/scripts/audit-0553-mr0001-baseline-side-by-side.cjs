// Reproduce Rev01 vs CURRENT MR0001 totals in isolated Node processes.
// The SAME checked-out dependencies are used for both runs. Does not alter approval manifest.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const cp=require("node:child_process");
const root=path.resolve(__dirname,".."),src=path.join(root,"src");
const fixture=path.join(root,"audit-fixtures/pj2608-0553/mr0001TagCostLedger0553.rev01.js.txt");
const ledger=path.join(src,"project0553/data/mr0001TagCostLedger0553.js");
const approved="ec222963670a5cfdf5e8f4b850d33c4de01afba1";
const hash=t=>{const bytes=Buffer.from(t.replace(/\r\n/g,"\n"));return crypto.createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");};
if(process.argv[2]==="--worker"){
 const revision=process.argv[3];
 const babel=require("@babel/core"),originalJs=require.extensions[".js"],originalJson=require.extensions[".json"];
 function compile(mod,file){
  const raw=file===ledger&&revision==="REV01"?fs.readFileSync(fixture,"utf8"):fs.readFileSync(file,"utf8");
  const transpiled=babel.transformSync(raw,{filename:file,babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
  mod._compile(transpiled.code,file);
 }
 require.extensions[".js"]=(mod,file)=>file.startsWith(src+path.sep)?compile(mod,file):originalJs(mod,file);
 const {summarizeMR0001TagCost0553}=require(ledger);
 const locations=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
 const rows=locations.map(site=>{
  const s=summarizeMR0001TagCost0553(site);
  return {site,subtotal:s.subtotals,costed:s.costedRows,total:s.totalRows,
   items:s.rows.map(x=>({key:[site,x.row,x.tag].join("|"),row:x.row,tag:x.tag,qty:x.sourceQty??null,unit:x.sourceUnit??null,currency:x.currency??null,unitRate:x.unitCost??null,extended:x.extended??null,counted:x.countedInWorkingTotal===true,status:x.status??null,source:x.source??null}))};
 });
 console.log(JSON.stringify({revision,rows}));
 process.exit(0);
}
assert.equal(hash(fs.readFileSync(fixture,"utf8")),approved,"Rev01 fixture hash differs from approved baseline");
const currentHash=hash(fs.readFileSync(ledger,"utf8"));
function run(revision){
 const p=cp.spawnSync(process.execPath,[__filename,"--worker",revision],{cwd:root,encoding:"utf8",maxBuffer:20*1024*1024});
 if(p.status!==0)return {ok:false,revision,exitCode:p.status,error:(p.stderr||p.stdout||"Worker failed").slice(0,12000)};
 try{return {ok:true,data:JSON.parse(p.stdout.trim().split("\n").at(-1))};}
 catch(e){return {ok:false,revision,error:"Worker JSON parse failed: "+e.message};}
}
const rev01Result=run("REV01"),currentResult=run("CURRENT");
if(!rev01Result.ok||!currentResult.ok){
 const report={project:"PJ2608-0553",baselineApproval:"UNCHANGED",
  sourceHash:{rev01:approved,current:currentHash},
  dependencyBasis:"same checkout, but historical dependency compatibility NOT established",
  gate:"BLOCKED_REPRODUCIBILITY__REV02_NOT_APPROVED",
  runtimeStatuses:{REV01:rev01Result.ok?"PASS":"FAILED",CURRENT:currentResult.ok?"PASS":"FAILED"},
  errors:[rev01Result,currentResult].filter(x=>!x.ok).map(x=>({revision:x.revision,details:x.error})),
  currentSiteTotals:currentResult.ok?currentResult.data.rows.map(x=>({site:x.site,subtotal:x.subtotal,rowCount:x.total})):[],
  totals:[],changed:[],
  action:"Recover Rev01-era zwp8Row43CostTrace dependency at its original approved revision before asserting any numerical delta. Do not alter legacy assertion or silently adjust scenario."
 };
 const destination=path.join(root,"build-audit","mr0001-rev01-current-reconciliation.json");
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.writeFileSync(destination,JSON.stringify(report,null,2)+"\n");
 console.error("AUDIT BLOCKED: Rev01 and current cannot be compared reproducibly with shared checkout; see "+destination);
 process.exitCode=2;
} else {
const old=rev01Result.data,now=currentResult.data;
const map=x=>new Map(x.rows.flatMap(r=>r.items.map(item=>[item.key,item])));
const a=map(old),b=map(now);
const changed=[...new Set([...a.keys(),...b.keys()])].flatMap(key=>{
 const x=a.get(key),y=b.get(key);
 const fields=["qty","unit","currency","unitRate","extended","counted","status","source"];
 return !x||!y||fields.some(f=>x[f]!==y[f])?[{key,previous:x??null,current:y??null}]:[];
});
const totals=old.rows.map(prev=>{
 const curr=now.rows.find(x=>x.site===prev.site);
 return {site:prev.site,rev01:prev.subtotal,current:curr.subtotal,
  deltaUSD:Math.round(((curr.subtotal.USD??0)-(prev.subtotal.USD??0))*100)/100,
  deltaTHB:Math.round(((curr.subtotal.THB??0)-(prev.subtotal.THB??0))*100)/100,
  rowCountRev01:prev.total,rowCountCurrent:curr.total};
});
const report={project:"PJ2608-0553",baselineApproval:"UNCHANGED",sourceHash:{rev01:approved,current:currentHash},
 dependencyBasis:"same checkout / isolated module evaluation",totals,changed,gate:"DRAFT_REV02_NOT_APPROVED"};
const destination=path.join(root,"build-audit","mr0001-rev01-current-reconciliation.json");
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.writeFileSync(destination,JSON.stringify(report,null,2)+"\n");
console.log("SIDE BY SIDE MR0001 — report: "+destination);
for(const t of totals)console.log(t.site,"USD delta",t.deltaUSD,"THB delta",t.deltaTHB,"row counts",t.rowCountRev01,t.rowCountCurrent);
console.log("changed rows:",changed.length,"Rev02 remains UNAPPROVED");

}
