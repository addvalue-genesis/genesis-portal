/*
ASK-TSI Priced Breakdown List — JSX output contract
Source template snapshot inspected from:
  ASK-TSI Priced Breakdown List.xlsx
  Sheet: PriceBreakdown
  Range: A1:H80

This component represents the form/output contract.
It must be populated from controlled engineering/cost/commercial state.
It is NOT the engineering source of truth.
*/

import React from "react";

export const ASKTSI_PRICED_BREAKDOWN_TEMPLATE = {
  id: "ASK-TSI-PRICED-BREAKDOWN",
  sourceFile: "ASK-TSI Priced Breakdown List.xlsx",
  sheet: "PriceBreakdown",
  range: "A1:H80",
  columns: ["S.N","Tag No.","Description","Qty","Unit","Unit Price","Sub-Total","Remark"],
  partA: [
    ["A1-01",1,"Network System (KU Band Internet)"],
    ["A1-02",2,"VSAT System"],
    ["A1-03",3,"Video Conference System (VCS)"],
    ["A1-04",4,"IP Telephony and PABX"],
    ["A1-05",5,"Public Address and General Alarm (PAGA)"],
    ["A1-06",6,"Closed Circuit Television (CCTV) System"],
    ["A1-07",7,"VHF DMR Radio System"],
    ["A1-08",8,"VHF-FM Marine Radio"],
    ["A1-09",9,"VHF-AM Aeronautical Radio"],
    ["A1-10",10,"MF/HF SSB Radio"],
    ["A1-11",11,"Microwave System (Telecommunication Tower)"],
    ["A1-12",12,"Entertainment System"],
    ["A1-13",13,"Fiber Optic Communication and Installation"],
    ["A1-14",14,"Meteorological System"],
    ["A1-15",15,"Non-Directional Beacon (NDB) System"]
  ],
  partB: [
    ["B1","Detail Design Engineering includes but not limited: Detail Design Architecture and Topology Dwg; Detail Design IFC Dwg; Calculation Sheet; Simulation Analysis; Technical Manuals and etc."],
    ["B2","Transportation to FOB PURCHASER'PORT"],
    ["B3","Training for Enduser / PURCHASER personnel"],
    ["B4","Specialist field assistance as per specification"],
    ["B5","Pre-commissioning, Commissioning and Start-up Spares"],
    ["B6","Special Tools for operation and maintenance"],
    ["B7",null],
    ["B8",null],
    ["B9",null]
  ],
  partC: [
    ["C1","On-site installation construction"],
    ["C2","Capital Spares For Ten Years"],
    ["C3","2 years normal operation spare parts"]
  ],
  sourceRemarks: {
    A_DEFAULT: "Details shall be included not limit to Bulk Materials etc. Main Equipment Brands shall be provided.",
    B2: "IF Over-sea TSI- CIF Yangon, Myanmar / IF China TSI -FOB any major port in China",
    C1: "Optional Item Undertaken by CNEEC",
    FINAL: "Delivery term shall follow program logistic proposal and fixed by each cluster per equipment cargo size."
  }
};

function money(value,currency="USD"){
  if(value===null || value===undefined || value==="") return "—";
  if(typeof value==="string") return value;
  try{
    return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(value);
  }catch{
    return String(value);
  }
}

function sourceAmountToThb(line,field,eurThbFx,usdThbFx,cnyThbFx){
  const map = field==="unitPrice" ? line.unitPriceByCurrency : line.subtotalByCurrency;
  if(!map) return null;

  if(Number.isFinite(map.THB)) return map.THB;

  const usdFx=Number(usdThbFx);
  if(Number.isFinite(map.USD) && Number.isFinite(usdFx) && usdFx>0) return map.USD * usdFx;

  const eurFx=Number(eurThbFx);
  if(Number.isFinite(map.EUR) && Number.isFinite(eurFx) && eurFx>0) return map.EUR * eurFx;

  const cnyFx=Number(cnyThbFx);
  if(Number.isFinite(map.CNY) && Number.isFinite(cnyFx) && cnyFx>0) return map.CNY * cnyFx;

  return null;
}

function convertedAmount(line,currency,field,eurThbFx,usdThbFx,cnyThbFx){
  const thb=sourceAmountToThb(line,field,eurThbFx,usdThbFx,cnyThbFx);
  if(!Number.isFinite(thb)) return null;

  if(currency==="THB") return thb;

  const usdFx=Number(usdThbFx);
  if(currency==="USD" && Number.isFinite(usdFx) && usdFx>0) return thb / usdFx;

  const eurFx=Number(eurThbFx);
  if(currency==="EUR" && Number.isFinite(eurFx) && eurFx>0) return thb / eurFx;

  const cnyFx=Number(cnyThbFx);
  if(currency==="CNY" && Number.isFinite(cnyFx) && cnyFx>0) return thb / cnyFx;

  return null;
}

function displayAmount(line,currency,field,eurThbFx,usdThbFx,cnyThbFx){
  const value=lineAmount(line,currency,field);
  if(value!==null && value!==undefined && value!=="") return money(value,currency);

  const converted=convertedAmount(line,currency,field,eurThbFx,usdThbFx,cnyThbFx);
  if(Number.isFinite(converted)) return money(converted,currency)+" · Working FX";

  const map = field==="unitPrice" ? line.unitPriceByCurrency : line.subtotalByCurrency;
  if(map && Number.isFinite(map.EUR)) return money(map.EUR,"EUR")+" · EUR FX TBC";
  if(map && Number.isFinite(map.CNY)) return money(map.CNY,"CNY")+" · CNY FX TBC";
  return "—";
}

function stateTone(state){
  const s=String(state||"TBC").toLowerCase();
  if(s.includes("ready")||s.includes("approved")||s.includes("controlled")) return "good";
  if(s.includes("working")||s.includes("prelim")||s.includes("partial")||s.includes("budget")) return "warn";
  if(s.includes("open")||s.includes("tbc")||s.includes("not priced")||s.includes("block")) return "bad";
  return "neutral";
}

function Status({state}){
  const text=state||"TBC";
  return <span className={"bid-status "+stateTone(text)}>{text}</span>;
}

function rowValue(lines,code){
  return lines?.[code] || {};
}

function lineAmount(line,currency,field){
  const map = field==="unitPrice" ? line.unitPriceByCurrency : line.subtotalByCurrency;
  if(map && Object.prototype.hasOwnProperty.call(map,currency)) return map[currency];
  return line[field];
}

function RemarkCell({base,line,mode}){
  const hasInternal = mode==="INTERNAL" && (line.internalTrace || line.openItems?.length);
  return (
    <div className="ask-remark">
      {base ? <div className="ask-remark-source">{base}</div> : null}
      {hasInternal ? (
        <details className="ask-trace">
          <summary>Internal trace / open items</summary>
          {line.internalTrace ? <div><strong>Trace:</strong> {line.internalTrace}</div> : null}
          {line.openItems?.length ? <div><strong>Open:</strong> {line.openItems.join("; ")}</div> : null}
        </details>
      ) : null}
    </div>
  );
}

function numericSubtotal(lines,codes,currency,eurThbFx,usdThbFx,cnyThbFx){
  return codes.reduce((sum,code)=>{
    const line=rowValue(lines,code);
    let v=lineAmount(line,currency,"subtotal") ?? lineAmount(line,currency,"unitPrice");
    if(!Number.isFinite(v)) v=convertedAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx);
    return Number.isFinite(v) ? sum+v : sum;
  },0);
}

function hasOpenTotal(lines,codes,currency){
  return codes.some(code=>{
    const line=rowValue(lines,code);
    const v=lineAmount(line,currency,"subtotal") ?? lineAmount(line,currency,"unitPrice");
    const state=String(line.state||"");
    return v===null || v===undefined || /OPEN|TBC|HOLD|NOT PRICED/i.test(state);
  });
}

export function ASKTSIPricedBreakdownForm({lines={},currency="USD",mode="INTERNAL",eurThbFx=null,usdThbFx=31.50,cnyThbFx=null}){
  const t=ASKTSI_PRICED_BREAKDOWN_TEMPLATE;
  const aCodes=t.partA.map(([code])=>code);
  const bCodes=t.partB.map(([code])=>code);
  const cCodes=t.partC.map(([code])=>code);

  const aKnown=numericSubtotal(lines,aCodes,currency,eurThbFx,usdThbFx,cnyThbFx);
  const bKnown=numericSubtotal(lines,bCodes,currency,eurThbFx,usdThbFx,cnyThbFx);
  const cKnown=numericSubtotal(lines,cCodes,currency,eurThbFx,usdThbFx,cnyThbFx);
  const aHold=hasOpenTotal(lines,aCodes,currency);
  const bHold=hasOpenTotal(lines,bCodes,currency);

  return (
    <div className="bid-stack">
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>OUTPUT CONTRACT · {t.sourceFile} · {t.sheet}!{t.range}</small>
            <h2>ASK-TSI Priced Breakdown List</h2>
          </div>
          <Status state={mode==="INTERNAL"?"CONTROLLED INTERNAL VIEW":"CUSTOMER FORM VIEW"}/>
        </div>
        <p>
          Form นี้รับค่าจาก controlled engineering / cost / commercial model.
          ช่องว่าง/TBC ต้องคงสถานะไว้และห้ามถูกแปลงเป็นศูนย์โดยอัตโนมัติ.
        </p>

        <div className="bid-table-wrap ask-price-wrap">
          <table className="bid-table ask-price-table">
            <colgroup>
              <col className="ask-col-sn"/>
              <col className="ask-col-tag"/>
              <col className="ask-col-desc"/>
              <col className="ask-col-qty"/>
              <col className="ask-col-unit"/>
              <col className="ask-col-price"/>
              <col className="ask-col-subtotal"/>
              <col className="ask-col-remark"/>
            </colgroup>
            <thead>
              <tr>{t.columns.map(c=><th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              <tr className="ask-part-head"><td colSpan="8"><strong>Part A: BASIC PRICE / A1. Main Equipment Price</strong></td></tr>
              {t.partA.map(([code,sn,description])=>{
                const line=rowValue(lines,code);
                return (
                  <tr key={code}>
                    <td><strong>{sn}</strong><small>{code}</small></td>
                    <td>{line.tagNo || ""}</td>
                    <td><strong>{description}</strong>{line.state?<><br/><Status state={line.state}/></>:null}</td>
                    <td>{line.qty ?? 1}</td>
                    <td>{line.unit || "Lot"}</td>
                    <td>{displayAmount(line,currency,"unitPrice",eurThbFx,usdThbFx,cnyThbFx)}</td>
                    <td>{displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx)}</td>
                    <td><RemarkCell base={line.sourceRemark || t.sourceRemarks.A_DEFAULT} line={line} mode={mode}/></td>
                  </tr>
                );
              })}
              <tr className="ask-total-row">
                <td colSpan="5"><strong>Part A Known Priced Subtotal</strong><small>Open/TBC items excluded from this numeric subtotal</small></td>
                <td></td>
                <td><strong>{money(aKnown,currency)}</strong></td>
                <td>{aHold ? <Status state="PART A TOTAL = HOLD"/> : <Status state="PART A TOTAL READY"/>}</td>
              </tr>

              <tr className="ask-part-head"><td colSpan="8"><strong>Part B: OTHERS</strong></td></tr>
              {t.partB.map(([code,sourceDescription])=>{
                const line=rowValue(lines,code);
                const description=sourceDescription || (mode==="INTERNAL" ? (line.description || "") : "");
                return (
                  <tr key={code}>
                    <td><strong>{code}</strong></td>
                    <td>{description}</td>
                    <td>{line.tagNo || ""}</td>
                    <td>{line.qty ?? "1 lot"}</td>
                    <td>{line.unit || ""}</td>
                    <td>{displayAmount(line,currency,"unitPrice",eurThbFx,usdThbFx,cnyThbFx)}</td>
                    <td>{displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx)}</td>
                    <td><RemarkCell base={line.sourceRemark || t.sourceRemarks[code] || ""} line={line} mode={mode}/>{line.state?<><br/><Status state={line.state}/></>:null}</td>
                  </tr>
                );
              })}
              <tr className="ask-total-row">
                <td colSpan="5"><strong>Part B Known Priced Subtotal</strong><small>Open/TBC items excluded from this numeric subtotal</small></td>
                <td></td>
                <td><strong>{money(bKnown,currency)}</strong></td>
                <td>{bHold ? <Status state="PART B TOTAL = HOLD"/> : <Status state="PART B TOTAL READY"/>}</td>
              </tr>
              <tr className="ask-base-total">
                <td colSpan="5"><strong>BASE OFFER = PART A + PART B</strong><small>This is the project offer amount before optional Part C.</small></td>
                <td></td>
                <td><strong>{aHold || bHold ? "HOLD" : money(aKnown+bKnown,currency)}</strong></td>
                <td><Status state={aHold || bHold ? "PROJECT OFFER = HOLD" : "PROJECT OFFER READY"}/></td>
              </tr>
              <tr><td colSpan="8">Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.</td></tr>

              <tr className="ask-part-head"><td colSpan="8"><strong>Part C: OPTIONS — EXCLUDED FROM BASE OFFER UNLESS SELECTED</strong></td></tr>
              {t.partC.map(([code,description])=>{
                const line=rowValue(lines,code);
                return (
                  <tr key={code}>
                    <td><strong>{code}</strong></td>
                    <td>{description}</td>
                    <td>{line.tagNo || ""}</td>
                    <td>{line.qty ?? "1 lot"}</td>
                    <td>{line.unit || ""}</td>
                    <td>{displayAmount(line,currency,"unitPrice",eurThbFx,usdThbFx,cnyThbFx)}</td>
                    <td>{displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx)}</td>
                    <td><RemarkCell base={line.sourceRemark || t.sourceRemarks[code] || ""} line={line} mode={mode}/>{line.state?<><br/><Status state={line.state}/></>:null}</td>
                  </tr>
                );
              })}
              <tr className="ask-option-total">
                <td colSpan="5"><strong>Part C Known Options Subtotal</strong><small>For reference only; not included in Base Offer automatically.</small></td>
                <td></td>
                <td><strong>{money(cKnown,currency)}</strong></td>
                <td><Status state="OPTIONS / SEPARATE"/></td>
              </tr>
              <tr><td colSpan="8"><strong>Remark:</strong> {t.sourceRemarks.FINAL}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
