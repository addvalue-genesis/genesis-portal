import { useEffect, useMemo, useState } from "react";

function parseJson(value,fallback){
  if(value==null) return fallback;
  if(typeof value==="object") return value;
  try{return JSON.parse(value);}catch{return fallback;}
}

export function useProject0550RequirementThreads(systemCode="PAGA"){
  const [payload,setPayload]=useState(null);
  const [status,setStatus]=useState("LOADING");

  useEffect(()=>{
    let active=true;
    const url="/backend/api/etm/requirement-threads.php?project=PJ2608-0550&system="+encodeURIComponent(systemCode);
    fetch(url)
      .then(r=>{ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(data=>{
        if(!data.ok) throw new Error(data.message||data.error||"Requirement-thread API unavailable");
        if(active){ setPayload(data); setStatus("LIVE_DB"); }
      })
      .catch(()=>{ if(active) setStatus("CONTROLLED_FALLBACK"); });
    return ()=>{active=false;};
  },[systemCode]);

  const rows=useMemo(()=>{
    if(!payload?.requirements?.length) return [];
    const eqByReq=new Map();
    for(const b of payload.equationBindings||[]){
      if(!eqByReq.has(b.requirement_code)) eqByReq.set(b.requirement_code,[]);
      eqByReq.get(b.requirement_code).push(b);
    }
    const casesByReq=new Map();
    for(const c of payload.resolutionCases||[]){
      if(!casesByReq.has(c.requirement_code)) casesByReq.set(c.requirement_code,[]);
      casesByReq.get(c.requirement_code).push(c);
    }
    return payload.requirements.map(r=>{
      const meta=parseJson(r.metadata_json,{});
      const bindings=eqByReq.get(r.requirement_code)||[];
      return {
        id:r.requirement_code,
        title:meta.title||r.requirement_type||r.requirement_code,
        requirement:r.requirement_text,
        source:parseJson(meta.sources,meta.sources||[]),
        constraints:parseJson(meta.constraints,meta.constraints||[]),
        proof:parseJson(meta.proof,meta.proof||[]),
        objects:parseJson(meta.objects,meta.objects||[]),
        drives:parseJson(meta.drives,meta.drives||[]),
        fundamentalNeed:meta.fundamentalNeed||"TBC",
        interfaceContext:parseJson(meta.interfaceContext,meta.interfaceContext||[]),
        engineeringInputs:parseJson(meta.engineeringInputs,meta.engineeringInputs||[]),
        architecture:meta.architecture||"TBC",
        requiredMtoState:meta.requiredMtoState||"TBC",
        equations:bindings.map(x=>x.equation_code),
        equationBindings:bindings,
        resolutionCases:casesByReq.get(r.requirement_code)||[],
        state:r.status||"OPEN",
        dataOrigin:"LIVE_DB"
      };
    });
  },[payload]);

  return {status,payload,rows,isLive:status==="LIVE_DB"};
}
