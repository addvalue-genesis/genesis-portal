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

import React from "react";\n\nexport const ASKTSI_PRICED_BREAKDOWN_TEMPLATE = {
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

function remarkText(base,line,mode){
  const parts=[];
  if(base) parts.push(base);
  if(mode==="INTERNAL" && line.internalTrace) parts.push("[INTERNAL TRACE] "+line.internalTrace);
  if(line.openItems?.length) parts.push("[OPEN] "+line.openItems.join("; "));
  return parts.join("\n\n");
}

export function ASKTSIPricedBreakdownForm({lines={},currency="USD",mode="INTERNAL"}){
  const t=ASKTSI_PRICED_BREAKDOWN_TEMPLATE;

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

        <div className="bid-table-wrap">
          <table className="bid-table">
            <thead>
              <tr>{t.columns.map(c=><th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              <tr><td colSpan="8"><strong>Part A: BASIC PRICE / A1. Main Equipment Price</strong></td></tr>
              {t.partA.map(([code,sn,description])=>{
                const line=rowValue(lines,code);
                return (
                  <tr key={code}>
                    <td><strong>{sn}</strong><small>{code}</small></td>
                    <td>{line.tagNo || ""}</td>
                    <td><strong>{description}</strong>{line.state?<><br/><Status state={line.state}/></>:null}</td>
                    <td>{line.qty ?? 1}</td>
                    <td>{line.unit || "Lot"}</td>
                    <td>{money(line.unitPrice,currency)}</td>
                    <td>{money(line.subtotal ?? line.unitPrice,currency)}</td>
                    <td>{remarkText(line.sourceRemark || t.sourceRemarks.A_DEFAULT,line,mode)}</td>
                  </tr>
                );
              })}

              <tr><td colSpan="8"><strong>Part B: OTHERS</strong></td></tr>
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
                    <td>{money(line.unitPrice,currency)}</td>
                    <td>{money(line.subtotal ?? line.unitPrice,currency)}</td>
                    <td>{remarkText(line.sourceRemark || t.sourceRemarks[code] || "",line,mode)}{line.state?<><br/><Status state={line.state}/></>:null}</td>
                  </tr>
                );
              })}

              <tr><td colSpan="8"><strong>Total</strong></td></tr>
              <tr><td colSpan="8">Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.</td></tr>

              <tr><td colSpan="8"><strong>Part C: OPTIONS</strong></td></tr>
              {t.partC.map(([code,description])=>{
                const line=rowValue(lines,code);
                return (
                  <tr key={code}>
                    <td><strong>{code}</strong></td>
                    <td>{description}</td>
                    <td>{line.tagNo || ""}</td>
                    <td>{line.qty ?? "1 lot"}</td>
                    <td>{line.unit || ""}</td>
                    <td>{money(line.unitPrice,currency)}</td>
                    <td>{money(line.subtotal ?? line.unitPrice,currency)}</td>
                    <td>{remarkText(line.sourceRemark || t.sourceRemarks[code] || "",line,mode)}{line.state?<><br/><Status state={line.state}/></>:null}</td>
                  </tr>
                );
              })}
              <tr><td colSpan="8"><strong>Remark:</strong> {t.sourceRemarks.FINAL}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
