import {deriveBidVolumes0550} from './bidVolumes0550';
import {bidVolumeSheets0550,bidVolumeHtml0550,buildBidVolumeXlsx0550} from '../exportBidVolumes0550';
import {technicalDraftHtml0550} from '../exportTechnicalProposal0550';
import {buildNativeExhibitDocx0550,nativeExhibitProblems0550} from '../exhibitCNative0550';
const base64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);};
export function freezeBidPackageOutput0550(data,model,number,today,{legacy=false}={}){
 const systems=(model.integration?.scopes||[]).map(s=>({token:s.id,name:s.id})),view=deriveBidVolumes0550(data,model,systems,today);
 if(!view.ready)throw Error('Bid package is not reviewed');
 if(!legacy&&nativeExhibitProblems0550(view).length)throw Error('Native Exhibit C has unresolved response slots');
 const outputLabel='AUTHORIZED COPY / '+number+' / '+today,v={...view,outputLabel};
 return {documentNo:view.proposal.documentNo,revision:view.proposal.revision,outputLabel,
  ...(!legacy?{nativeExhibitVersion:'exhibit-c-rev0.v1',docxI:base64(buildNativeExhibitDocx0550(v))}:{}),
  I:bidVolumeSheets0550(v,'I'),III:bidVolumeSheets0550(v,'III'),VDRL:bidVolumeSheets0550(v,'VDRL'),
  htmlI:bidVolumeHtml0550(v,'I',legacy?bidVolumeSheets0550(v,'I'):undefined),htmlIII:bidVolumeHtml0550(v,'III'),htmlVDRL:bidVolumeHtml0550(v,'VDRL'),
  htmlII:technicalDraftHtml0550(view.technical,data,today,view.vdrl).replace(/DRAFT — NOT FOR SUBMISSION/g,()=>outputLabel.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])))};
}
export function downloadFrozenBidPackage0550(issue,volume,format='xlsx'){
 const p=issue.bidPackage;if(!p)throw Error('This historical issue has no frozen three-volume output');
 const docx=volume==='I'&&format==='docx';if(docx&&!p.docxI)throw Error('This historical issue has no frozen native Word output');
 const html=volume==='II'||format==='html',content=docx?Uint8Array.from(atob(p.docxI),c=>c.charCodeAt(0)):html?p['html'+volume]:buildBidVolumeXlsx0550({proposal:{documentNo:p.documentNo,revision:p.revision},outputLabel:p.outputLabel},volume,p[volume]);
 const url=URL.createObjectURL(new Blob([content],{type:docx?'application/vnd.openxmlformats-officedocument.wordprocessingml.document':html?'text/html;charset=utf-8':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})),a=document.createElement('a');a.href=url;a.download=`PJ2608-0550_${issue.number.replace(/[^\w.-]/g,'_')}_Volume-${volume}.${docx?'docx':html?'html':'xlsx'}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function validateFrozenBidPackage0550(p){
 const keys=['documentNo','revision','outputLabel','I','III','VDRL','htmlI','htmlII','htmlIII','htmlVDRL',...(p?.nativeExhibitVersion?['nativeExhibitVersion','docxI']:[])];
 if(!p||Object.keys(p).length!==keys.length||keys.some(k=>p[k]===undefined))throw Error('Release: invalid frozen package');
 if(p.nativeExhibitVersion&&(p.nativeExhibitVersion!=='exhibit-c-rev0.v1'||typeof p.docxI!=='string'||!/^UEs[A-Za-z0-9+/]*={0,2}$/.test(p.docxI)))throw Error('Release: invalid frozen native Word output');
 for(const k of keys.filter(k=>!['I','III','VDRL'].includes(k)))if(typeof p[k]!=='string'||p[k].length>16*1024*1024)throw Error('Release: invalid frozen package text');
 for(const k of ['I','III','VDRL'])if(!Array.isArray(p[k])||p[k].length>20||p[k].some(s=>!s||typeof s.name!=='string'||!Array.isArray(s.heads)||!Array.isArray(s.rows)||s.rows.length>20000||s.heads.some(h=>typeof h!=='string')||s.rows.some(row=>!Array.isArray(row)||row.some(v=>v!==null&&typeof v!=='string'&&!(typeof v==='number'&&Number.isFinite(v))))))throw Error('Release: invalid frozen package tables');
}
