// ADR §§1–3,6,8–10,13: discovery in canonical text is not accepted scope.
import {deriveSourceIntake} from "./sourceIntakeModel";
import {blankRequirement0550,integrationFingerprint0550,documentFamily0550} from "./integrationWorkspace0550";

const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
export function searchSourceEvidence0550(data,query,{authority="CURRENT_TENDER",limit=50}={}){
 const value=String(query||"").trim();
 if(value.length<2||value.length>200)return {rows:[],total:0,sources:0};
 const pattern=(/^\w/.test(value)?"\\b":"")+value.split(/\s+/).map(escaped).join("\\s+")+(/\w$/.test(value)?"\\b":""),rows=[];let total=0,count=0;
 for(const s of deriveSourceIntake(data.sourceIntake,"").sources){
  if((authority!=="ALL"&&s.effectiveAuthority!==authority)||!s.content)continue;
  const re=new RegExp(pattern,"giu");let match,found=false,key;
  while((match=re.exec(s.content))){
   total++;found=true;
   if(rows.length>=Math.min(200,Math.max(1,limit)))continue;
   const start=Math.max(0,match.index-180,s.content.lastIndexOf("\n",Math.max(0,match.index-180))+1);
   let end=s.content.indexOf("\n",match.index+match[0].length+260);if(end<0)end=s.content.length;
   end=Math.max(match.index+match[0].length,Math.min(end,Math.max(start+1800,match.index+match[0].length)));
   const prefix=s.content.slice(0,match.index),marker=[...prefix.matchAll(/\[(?:PDF PAGE (\d+)|(?:SHEET|OOXML PART) [^\]\n]+)\]/g)].at(-1),page=marker?.[1];
   const native=marker?.[0];
   const line=prefix.split("\n").length;
   key=key||integrationFingerprint0550(s);
   rows.push({id:s.id+"-O"+match.index,sourceId:s.id,sourceKey:key,title:s.title,documentNo:s.documentNo,revision:s.revision,authority:s.effectiveAuthority,readState:s.readState,family:documentFamily0550(s),offset:match.index,start,end,excerpt:s.content.slice(start,end),locator:[page?"physical PDF p"+page:native||"physical page not verified","source text line "+line,"characters "+start+"–"+end].join(" / ")});
  }
  if(found)count++;
 }
 return {rows,total,sources:count};
}

export function requirementFromSourceHit0550(data,hit,systemToken,systems){
 const s=deriveSourceIntake(data.sourceIntake,"").sources.find(s=>s.id===hit.sourceId);
 if(!s||s.effectiveAuthority!=="CURRENT_TENDER"||integrationFingerprint0550(s)!==hit.sourceKey||!Number.isInteger(hit.start)||!Number.isInteger(hit.end)||hit.start<0||hit.end<=hit.start||hit.end>s.content.length||s.content.slice(hit.start,hit.end)!==hit.excerpt)throw Error("Source evidence changed or is not current; search again");
 if(![...systems,"COMMON"].includes(systemToken))throw Error("Choose an applicable system");
 const requirementId="REQSRC-"+integrationFingerprint0550({sourceId:s.id,offset:hit.offset,systemToken}).replace(/:/g,"-");
 return {...blankRequirement0550(requirementId,systemToken),title:(s.documentNo||s.title)+" / "+hit.locator,statement:hit.excerpt,reference:(s.documentNo||s.title)+" "+s.revision,sourceIds:[s.id],sourceLocator:hit.locator,sourceExcerpt:hit.excerpt,reason:"Source text discovery candidate; applicability, meaning, responsibilities and SI proof remain to review."};
}
