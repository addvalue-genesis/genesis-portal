import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./BidWorkspace.css";
import { BidFormTracker } from "./BidFormTracker";
import { VdrlProduction } from "./VdrlProduction";
import { EquationKernel } from "./EquationKernel";
import { PricingStrategy } from "./PricingStrategy";
import { ControlSpine } from "./ControlSpine";
import { BID_NAV_MODULES } from "./Project0550ModuleRegistry";
import { Project0550WorkingMemoryPanel, PROJECT0550_TEAM_WORKING_MEMORY } from "./Project0550WorkingMemory";
import { ASKTSIPricedBreakdownForm } from "./ASKTSIPricedBreakdownForm";
import { InternalCostOfferAnalysis } from "./InternalCostOfferAnalysis";
import { PROJECT0550_PRICING_BASELINE } from "./Project0550PricingBaseline";
import { summarizeProject0550PriceSources } from "./Project0550PriceSourceModel";
import { useProject0550CanonicalState, overlayControlledPriceLines } from "./useProject0550CanonicalState";

const SOURCE_GROUPS = [
  {
    key: "contract",
    title: "Contract / Commercial Pack",
    detail: "Purchase Agreement + Exhibit A/B/C/D/E/F",
    status: "SOURCE RECEIVED",
    items: [
      "Purchase Agreement",
      "Exhibit A · Scope of Work",
      "Exhibit B · Work Time Schedule",
      "Exhibit C · Commercial Terms / Price Schedules",
      "Exhibit D · Performance Test",
    ],
  },
  {
    key: "technical",
    title: "Technical RFQ Pack",
    detail: "MR / SPE / PHI / BOD / LIS / Drawings / FEED / latest update",
    status: "SOURCE RECEIVED",
    items: [
      "APF / ACP Basic Engineering documents",
      "Construction / updated Telecom documents",
      "Material Requisition and referenced specifications",
      "Tie-in / interface / layout / list / drawing evidence",
    ],
  },
  {
    key: "clarification",
    title: "Clarification / Deviation Pack",
    detail: "TC/TQ + Technical & Commercial Deviation templates",
    status: "ACTIVE",
    items: [
      "Attachment 3 · Technical Deviations List",
      "Attachment 4 · Commercial Deviations List",
      "Technical Clarification / Purchaser responses",
    ],
  },
  {
    key: "vendor",
    title: "Vendor / Subsupplier Inputs",
    detail: "Quotation, BOM, datasheets, deviation, delivery and services",
    status: "PARTIAL",
    items: [
      "OEM / supplier quotation",
      "Datasheet / compliance evidence",
      "Lead time / FAT / field service",
      "Spares / tools / training / warranty",
    ],
  },
];

const SCOPE_ROWS = [
  ["Engineering", "Detailed design, FEED validation, calculations, drawings, AFC / installation engineering", "PARTIAL", "Engineering proof + VDRL + MH"],
  ["Procurement", "All components / ancillary equipment / approved vendors / procurement management", "PARTIAL", "Required MTO + Vendor/TBE + price"],
  ["Fabrication / Assembly", "Manufacturing, assembly, quality and certificates", "OPEN", "Vendor scope + QA/QC cost"],
  ["Inspection / FAT / SIT", "ITP, hold/witness points, FAT/SIT, inspection facilities", "OPEN", "Test scope + witness cost + schedule"],
  ["Packing / Shipping", "Packing, marking, protection, shipping documents, Incoterms", "OPEN", "Logistics + documentation + cost"],
  ["Site Supervision", "Installation, pre-commissioning, commissioning and testing supervision", "OPEN", "Personnel × days/hours + rate"],
  ["Training", "O&M training, plan, trainer, material, facilities, logistics", "OPEN", "Training scope + MH + travel/facility"],
  ["Vendor Documents", "MDDR / VDRS, planned/actual dates, approval status, PTTEP format", "PARTIAL", "VDRL + review cycles + document MH"],
  ["Spares / Tools", "Pre-com/commissioning spares, 2-year spares, capital spares, special tools, consumables", "OPEN", "Separate price schedule / base-vs-option"],
  ["Warranty / Acceptance", "Performance, provisional/final acceptance, warranty obligations", "OPEN", "Risk + lifecycle + payment milestone"],
];

const PRICE_SCHEDULES = [
  ["A1", "Base Scope Lump Sum", "BASE", "Must include ancillaries + pre-com/commissioning/start-up spares/tools + sufficient field service/training"],
  ["A2", "Optional Scope Lump Sum", "OPTION", "Optional supply priced separately"],
  ["C1", "Base Scope Price Breakdown", "BASE", "Equipment / package / services breakdown"],
  ["C2", "Pre-Com & Commissioning Spares", "BASE", "Commissioning-stage spares / consumables"],
  ["C3", "2-Year Operational Spares", "EXCLUDED FROM BASE", "Price separately"],
  ["C4", "Capital Spares", "SEPARATE", "Price separately"],
  ["C5", "Special Tools", "BASE / CHECK", "Commissioning and maintenance tools"],
  ["C6", "First Fill / Consumables", "BASE / CHECK", "Initial fills / consumables"],
  ["C7", "Field Services & Training", "BASE", "Personnel category × total hours × rates; sufficient included time"],
  ["C8", "Services / Facilities", "CALL-OFF / MIXED", "Free-of-charge items vs call-off unit rates"],
];

const OUTPUTS = [
  ["PRICE", "ASK-TSI Priced Breakdown", "Customer form: Part A / Part B / Part C", "NOT READY"],
  ["TECH-DEV", "Technical Deviations", "Attachment 3 template", "ACTIVE"],
  ["COM-DEV", "Commercial Deviations", "Attachment 4 template", "ACTIVE"],
  ["TECH", "Technical Proposal / Compliance", "MR/SPE/PHI/DWG + calculations/studies", "PARTIAL"],
  ["VDRL", "Vendor Document Register", "MDDR / VDRS + PTTEP document control", "PARTIAL"],
  ["SCHED", "Bid / Delivery Schedule", "Exhibit B + milestone / detailed schedule basis", "OPEN"],
];

const DEVIATIONS = [
  {
    type: "TECHNICAL",
    source: "PAGA · current cable schedule",
    issue: "Current APF cable type / length not controlled; loop-loss proof cannot be finalized.",
    response: "Clarification / technical deviation if bidder basis cannot be confirmed before closing.",
    state: "OPEN",
  },
  {
    type: "TECHNICAL",
    source: "PAGA · sound coverage",
    issue: "RPT-0005 / final coverage result not available at quotation stage.",
    response: "Use controlled preliminary basis + include cost to complete study; identify residual hold point.",
    state: "WORKING BASIS",
  },
  {
    type: "COMMERCIAL",
    source: "Field service / training",
    issue: "Exhibit C requires sufficient included service time; no extra payment entitlement for quoted included scope.",
    response: "Need explicit service-day/hour basis and exclusions before price freeze.",
    state: "OPEN",
  },
];

const WORKFLOW = [
  ["1", "Read Bid Pack", "Contract + technical + clarification sources"],
  ["2", "Extract Obligations", "Each clause becomes a traceable bid requirement"],
  ["3", "Decide Response", "Comply / Clarify / Technical Deviation / Commercial Deviation / Option / Exclusion"],
  ["4", "Engineer & Quantify", "First Principles + Constraints + CAL/SDY/RPT → Required MTO / Bulk / Work / MH"],
  ["5", "Price", "Map cost into Exhibit C schedules and lifecycle services"],
  ["6", "Generate Submission", "Price schedules + deviation lists + technical/VDRL/schedule outputs"],
];

export function BidWorkspace() {
  const [active, setActive] = useState("overview");
  const [filter, setFilter] = useState("ALL");

  const deviationRows = useMemo(() => {
    if (filter === "ALL") return DEVIATIONS;
    return DEVIATIONS.filter((x) => x.type === filter);
  }, [filter]);

  return (
    <div className="bid-shell">
      <header className="bid-hero">
        <div>
          <div className="bid-eyebrow">PJ2608-0550 · BID SUBMISSION WORKBENCH · REV0</div>
          <h1>Quotation Control — Aung Sinkha Telecom</h1>
          <p>
            เป้าหมายของระบบนี้คือ <strong>ตอบ RFQ ให้ครบ + ระบุ deviation ให้ถูก + คิดราคาให้ไม่ตก scope</strong>
          </p>
        </div>
        <div className="bid-hero-status">
          <span className="preview">TEAM MEMORY · {PROJECT0550_TEAM_WORKING_MEMORY.syncRevision}</span>
          <span className="danger">PRICE FREEZE: NOT READY</span>
        </div>
      </header>

      <section className="bid-goal">
        <div>
          <small>THE ACTUAL BID LOGIC</small>
          <h2>เราไม่ได้เริ่มจาก “ราคาเท่าไร” — เราเริ่มจาก “ลูกค้าบังคับให้เรารับผิดชอบอะไรบ้าง”</h2>
          <p>
            Exhibit A ระบุ minimum scope และยังครอบคลุมกิจกรรมที่แม้ไม่ได้เขียนตรง ๆ แต่จำเป็นเพื่อให้ Goods fit for intended purpose.
            จากนั้น Technical Pack บอก requirement รายระบบ; สิ่งที่ทำไม่ได้ต้องถูกแยกเป็น Technical หรือ Commercial Deviation;
            สิ่งที่รับได้ต้องถูก quantify และ map เข้า Price Schedule.
          </p>
        </div>
        <div className="bid-goal-route">
          {WORKFLOW.map(([no, title, detail], i) => (
            <React.Fragment key={no}>
              <div><b>{no}</b><strong>{title}</strong><span>{detail}</span></div>
              {i < WORKFLOW.length - 1 && <em>→</em>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="bid-module-legend">
        <span className="system">SYSTEM RESOLVES</span>
        <span className="executive">EXECUTIVE DECISION</span>
        <span className="mixed">DEVIATION / MIXED AUTHORITY</span>
      </div>

      <nav className="bid-tabs">
        {BID_NAV_MODULES.map((m) => (
          <button
            key={m.key}
            className={"bid-module-tab "+(active === m.key ? "active " : "")+
              (m.authority === "EXECUTIVE_DECISION" ? "executive" : m.authority === "MIXED" ? "mixed" : "system")}
            onClick={() => setActive(m.key)}
            title={m.purpose}
          >
            <span className="bid-module-id">{m.id}</span>
            <span>{m.title}</span>
          </button>
        ))}
        <Link to="/projects/pj2608-0550/access" className="bid-drill"><b>11.0</b> Team Access</Link>
        <Link to="/projects/pj2608-0550/systems" className="bid-drill system"><b>12.0</b> System Engineering · 19 Systems</Link>
        <Link to="/projects/pj2608-0550/paga" className="bid-drill system"><b>12.7</b> Open PAGA Engineering →</Link>
      </nav>

      {active === "overview" && <Overview />}
      {active === "strategy" && <PricingStrategy />}
      {active === "model" && <EquationKernel />}
      {active === "control" && <ControlSpine />}
      {active === "form" && <BidFormTracker />}
      {active === "scope" && <ScopeView />}
      {active === "price" && <PriceView />}
      {active === "deviation" && (
        <DeviationView filter={filter} setFilter={setFilter} rows={deviationRows} />
      )}
      {active === "vdrl" && <VdrlProduction />}
      {active === "submission" && <SubmissionView />}
    </div>
  );
}

function Overview() {
  const canonical=useProject0550CanonicalState();
  const sourceGroups=useMemo(()=>{
    if(!canonical.data?.sourceGroups?.length) return SOURCE_GROUPS;
    const docs=canonical.data.sourceDocuments||[];
    return canonical.data.sourceGroups.map(g=>({
      key:g.group_code,
      title:g.group_name,
      detail:g.source_domain,
      status:g.status,
      items:docs.filter(d=>Number(d.source_group_id)===Number(g.id)).map(d=>d.source_title)
    }));
  },[canonical.data]);
  const outputs=useMemo(()=>{
    if(!canonical.data?.submissionItems?.length) return OUTPUTS;
    return canonical.data.submissionItems.map(x=>[
      x.submission_code,
      x.title,
      x.source_template || x.submission_type,
      x.readiness_status
    ]);
  },[canonical.data]);
  return (
    <div className="bid-stack">
      <Project0550WorkingMemoryPanel />
      <div className="bid-canonical-state-banner">
        <strong>{canonical.isLive ? "LIVE DB BID OVERVIEW PROJECTION" : "CONTROLLED FALLBACK PREVIEW"}</strong>
        <span>1.0 summarizes canonical source, requirement and submission state. It does not own a separate bid dataset.</span>
        {canonical.data?.openChanges?.length ? <em>{canonical.data.openChanges.length} open source/revision impact event(s)</em> : null}
      </div>
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>1.1 · BID INPUT PACK</small>
            <h2>ข้อมูลที่ระบบต้องอ่านก่อนทำราคา</h2>
          </div>
          <span className="bid-chip">4 SOURCE GROUPS</span>
        </div>
        <div className="bid-source-grid">
          {sourceGroups.map((g) => (
            <article key={g.key} className="bid-source-card">
              <div className="bid-source-top">
                <strong>{g.title}</strong>
                <Status status={g.status} />
              </div>
              <p>{g.detail}</p>
              <ul>{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>1.2 · WHAT MUST COME OUT</small>
            <h2>ผลลัพธ์สุดท้ายที่ใช้ยื่นราคา</h2>
          </div>
          <span className="bid-chip">SUBMISSION CONTROL</span>
        </div>
        <div className="bid-output-grid">
          {outputs.map(([code, title, basis, state]) => (
            <div key={code} className="bid-output-card">
              <b>{code}</b>
              <h3>{title}</h3>
              <p>{basis}</p>
              <Status status={state} />
            </div>
          ))}
        </div>
      </section>

      <section className="bid-panel bid-highlight">
        <small>1.3 · REQUIREMENT-TO-SUBMISSION LOGIC</small>
        <h2>First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model เป็นกลไกประมวลผลของงาน ไม่ใช่ข้อความประกอบ UI</h2>
        <div className="bid-connection">
          <div><span>Source / Requirement</span><strong>What must we achieve?</strong></div>
          <em>→</em>
          <div><span>Fundamental Need / Constraints</span><strong>What controls the solution?</strong></div>
          <em>→</em>
          <div><span>CAL / Study / RPT / Proof</span><strong>What can be released?</strong></div>
          <em>→</em>
          <div><span>Required MTO / Work / Lifecycle</span><strong>What must we buy and do?</strong></div>
          <em>→</em>
          <div><span>Parametric Cost / Risk</span><strong>What does it really cost?</strong></div>
          <em>→</em>
          <div><span>Commercial / Submission</span><strong>What do we offer?</strong></div>
        </div>
      </section>
    </div>
  );
}

function ScopeView() {
  const canonical=useProject0550CanonicalState();
  const rows=useMemo(()=>{
    if(!canonical.data?.requirements?.length) return SCOPE_ROWS;
    return canonical.data.requirements.map(r=>[
      r.requirement_domain || "OTHER",
      r.requirement_text,
      r.response_status || r.requirement_status || "OPEN",
      [
        r.price_impact_flag ? "Price impact" : null,
        r.schedule_impact_flag ? "Schedule impact" : null,
        r.linked_proof_id ? "Proof" : null,
        r.linked_mto_id ? "MTO" : null,
        r.linked_cost_item_id ? "Cost" : null
      ].filter(Boolean).join(" + ") || "Controlled response / compliance"
    ]);
  },[canonical.data]);
  return (
    <section className="bid-panel">
      <div className="bid-canonical-state-banner">
        <strong>{canonical.isLive ? "LIVE DB SCOPE / COMPLIANCE PROJECTION" : "CONTROLLED FALLBACK PREVIEW"}</strong>
        <span>Scope / Compliance reads canonical requirements and response state; it does not maintain a separate scope list.</span>
      </div>
      <div className="bid-panel-head">
        <div>
          <small>EXHIBIT A → BID OBLIGATION MATRIX</small>
          <h2>Scope ไม่ได้มีแค่อุปกรณ์ — ต้อง price งานและบริการทั้ง lifecycle</h2>
        </div>
        <Status status="REVIEW IN PROGRESS" />
      </div>
      <div className="bid-table-wrap">
        <table className="bid-table">
          <thead><tr><th>Scope group</th><th>Obligation / basis</th><th>Status</th><th>What it drives</th></tr></thead>
          <tbody>
            {rows.map(([group, basis, state, drives],idx) => (
              <tr key={group+"-"+idx}><td><strong>{group}</strong></td><td>{basis}</td><td><Status status={state} /></td><td>{drives}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bid-callout">
        <strong>Important:</strong>
        <span>
          เมื่อ requirement ใด “ทำไม่ได้ / ไม่รับ / ต้องมีเงื่อนไข” ระบบต้องบังคับให้เลือก response type
          ก่อนปล่อยราคา: Technical Deviation, Commercial Deviation, Clarification, Option หรือ Exclusion.
        </span>
      </div>
    </section>
  );
}

function PriceView() {
  const p = PROJECT0550_PRICING_BASELINE;
  const canonical=useProject0550CanonicalState();
  const [priceSurface,setPriceSurface]=useState("FORM");
  const currentLines=useMemo(
    ()=>overlayControlledPriceLines(p.lines,canonical.priceLineMap),
    [p.lines,canonical.priceLineMap]
  );
  const [currency,setCurrency] = useState("USD");
  const [eurThbFx,setEurThbFx] = useState(() => {
    if(typeof window==="undefined") return String(p.fx.workingEurThb ?? "");
    return window.localStorage.getItem("pj2608-0550-eur-thb-bot-mid-20261006") || String(p.fx.workingEurThb ?? "");
  });
  const [cnyThbFx,setCnyThbFx] = useState(() => {
    if(typeof window==="undefined") return String(p.fx.workingCnyThb ?? "");
    return window.localStorage.getItem("pj2608-0550-cny-thb-bot-mid-20261006") || String(p.fx.workingCnyThb ?? "");
  });

  function updateEurThbFx(value){
    setEurThbFx(value);
    if(typeof window!=="undefined"){
      if(value) window.localStorage.setItem("pj2608-0550-eur-thb-bot-mid-20261006",value);
      else window.localStorage.removeItem("pj2608-0550-eur-thb-bot-mid-20261006");
    }
  }

  function updateCnyThbFx(value){
    setCnyThbFx(value);
    if(typeof window!=="undefined"){
      if(value) window.localStorage.setItem("pj2608-0550-cny-thb-bot-mid-20261006",value);
      else window.localStorage.removeItem("pj2608-0550-cny-thb-bot-mid-20261006");
    }
  }

  const a1Codes=Object.keys(currentLines).filter(code=>/^A1-/.test(code));
  const bCodes=["B1","B2","B3","B4","B5","B6","B7","B8","B9"];
  const sourceSummary=useMemo(()=>summarizeProject0550PriceSources(currentLines,a1Codes),[currentLines]);

  function sumKnownThb(codes){
    return codes.reduce((sum,code)=>{
      const value=currentLines?.[code]?.subtotalByCurrency?.THB;
      return sum+(Number.isFinite(value)?Number(value):0);
    },0);
  }

  const partAKnownThb=sumKnownThb(a1Codes);
  const partBKnownThb=sumKnownThb(bCodes);
  const knownBaseThb=partAKnownThb+partBKnownThb;

  function knownBaseIn(currencyCode){
    const thb=knownBaseThb;
    if(currencyCode==="THB") return "THB "+thb.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
    if(currencyCode==="USD") return "USD "+(thb/p.fx.thbPerUsd).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
    const eurFx=Number(eurThbFx);
    if(currencyCode==="EUR" && Number.isFinite(eurFx) && eurFx>0) return "EUR "+(thb/eurFx).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
    const cnyFx=Number(cnyThbFx);
    if(currencyCode==="CNY" && Number.isFinite(cnyFx) && cnyFx>0) return "CNY "+(thb/cnyFx).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
    return "FX TBC";
  }

  return (
    <div className="bid-stack">
      <nav className="bid-price-subnav">
        <button
          type="button"
          className={priceSurface==="FORM"?"active":""}
          onClick={()=>setPriceSurface("FORM")}
        >
          <b>7.0</b>
          <span>ASK-TSI Priced Breakdown</span>
        </button>
        <button
          type="button"
          className={priceSurface==="ANALYSIS"?"active":""}
          onClick={()=>setPriceSurface("ANALYSIS")}
        >
          <b>7.1</b>
          <span>Internal Cost / Offer Analysis</span>
        </button>
      </nav>

      <section className="bid-panel bid-highlight">
        <div className="bid-panel-head">
          <div>
            <small>CURRENT 0550 PRICING BASELINE · {p.revision} · {p.date}</small>
            <h2>ASK-TSI Priced Breakdown — Current Controlled Price View</h2>
          </div>
          <span className="bid-status bad">PROJECT TOTAL: HOLD</span>
        </div>

        <div className="bid-canonical-state-banner">
          <strong>{canonical.isLive ? "LIVE DB CANONICAL STATE" : "CONTROLLED CODE FALLBACK"}</strong>
          <span>
            {canonical.isLive
              ? "Price table, commercial graphs and ASK-TSI form are reading the same canonical DB price-schedule state."
              : "DB projection is unavailable; UI is using the controlled code snapshot. Do not treat fallback as a separate source of truth."}
          </span>
          {canonical.data?.openChanges?.length ? <em>{canonical.data.openChanges.length} open revision/change event(s)</em> : null}
        </div>

        <div className="bid-offer-summary">
          <div>
            <small>PROJECT SELLING PRICE / BASE OFFER</small>
            <strong>HOLD</strong>
            <span>Base Offer = Part A + Part B. This is the project selling price that will be submitted when all price gates are closed.</span>
          </div>
          <div>
            <small>KNOWN NUMERIC PORTION OF A + B · MIXED SOURCES · FINAL BASE OFFER STILL HOLD</small>
            <strong>{knownBaseIn(currency)}</strong>
            <span>
              Dynamic from current controlled lines — not a hard-coded project total. Part A known = THB {partAKnownThb.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} · Part B known = THB {partBKnownThb.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}. Open/TBC portions such as PAGA remain outside the final released Base Offer.
            </span>
          </div>
          <div>
            <small>PART C</small>
            <strong>OPTIONS</strong>
            <span>Not included in Base Offer unless specifically selected/required.</span>
          </div>
        </div>

        <div className="bid-control-grid">
          <div>
            <strong>A + B CONTROL</strong>
            <span>Formula = Σ known numeric Part A + Σ known numeric Part B. Current known numeric portion = USD {(knownBaseThb/p.fx.thbPerUsd).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} / THB {knownBaseThb.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}. BASE OFFER remains HOLD until all open/TBC portions are closed.</span>
          </div>
          <div>
            <strong>PROJECT OFFER AMOUNT</strong>
            <span>HOLD until INDUSTRONIC PAGA is fully converted/closed. This is the amount that will be submitted.</span>
          </div>
          <div>
            <strong>PART C · OPTIONS</strong>
            <span>Separate from Base Offer. Included only when the option is selected/required.</span>
          </div>
          <div>
            <strong>PAGA Selected</strong>
            <span>{p.paga.vendor} · {p.paga.offer} · EUR {p.paga.knownSelectedSubtotalEur.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} · FX TBC</span>
          </div>
          <div>
            <strong>Offer Composition</strong>
            <span>{p.offerComposition.baseOffer} · {p.offerComposition.partC}</span>
          </div>
          <div>
            <strong>FX Control · Bank of Thailand</strong>
            <span>{p.fx.sourceReport} · {p.fx.rateType} · {p.fx.sourceDate} · USD/THB = {p.fx.thbPerUsd.toFixed(4)} · EUR/THB = {Number(eurThbFx).toFixed(4)} · CNY/THB = {Number(cnyThbFx).toFixed(4)}</span>
          </div>
        </div>

        <div className="bid-price-controls">
          <div className="bid-filter">
            {["USD","THB","EUR","CNY"].map((x)=>(
              <button key={x} onClick={()=>setCurrency(x)} className={currency===x?"active":""}>{x==="CNY" ? "CNY (RMB)" : x}</button>
            ))}
          </div>
          <label className="bid-fx-input">
            <span>EUR/THB BOT Mid Rate · {p.fx.sourceDate}</span>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={eurThbFx}
              onChange={(e)=>updateEurThbFx(e.target.value)}
              placeholder="1 EUR = ? THB"
              readOnly
            />
            <small>Bank of Thailand {p.fx.sourceReport} · MID RATE · reference/display conversion only</small>
          </label>
          <label className="bid-fx-input">
            <span>CNY/THB BOT Mid Rate · {p.fx.sourceDate}</span>
            <input
              type="number"
              step="0.0001"
              min="0"
              inputMode="decimal"
              value={cnyThbFx}
              onChange={(e)=>updateCnyThbFx(e.target.value)}
              placeholder="1 CNY = ? THB"
              readOnly
            />
            <small>Bank of Thailand {p.fx.sourceReport} · MID RATE · reference/display conversion only</small>
          </label>
        </div>
      </section>

      {priceSurface==="FORM" ? (
        <ASKTSIPricedBreakdownForm
          lines={currentLines}
          currency={currency}
          mode="INTERNAL"
          eurThbFx={eurThbFx}
          usdThbFx={p.fx.thbPerUsd}
          cnyThbFx={cnyThbFx}
        />
      ) : (
        <InternalCostOfferAnalysis
          lines={currentLines}
          currency={currency}
          canonical={canonical}
          eurThbFx={eurThbFx}
          usdThbFx={p.fx.thbPerUsd}
          cnyThbFx={cnyThbFx}
        />
      )}

      {priceSurface==="FORM" ? (
      <section className="bid-panel bid-formula-panel">
        <small>PARAMETRIC COST ENGINEERING → CUSTOMER FORM</small>
        <h2>Form เป็น output ของ Engineering Truth ไม่ใช่แหล่งกำเนิดราคา</h2>
        <div className="bid-formulas">
          <code>Requirement → Constraint → CAL/Study/RPT → Engineering Proof</code>
          <code>Required Qty = f(Requirement, Constraint, Proof, Quantity Driver)</code>
          <code>MH = Q × UMH × Factor</code>
          <code>Internal Cost = Material + Bulk + Work + Lifecycle + Common + Risk</code>
          <code>Customer Line = CommercialMapping(Controlled Cost, Treatment, Policy)</code>
          <code>Price View = Controlled Equation Output + Selected Vendor Evidence + FX Layer</code>
        </div>
        <p>
          Current baseline ผูก Part A / B / C จาก controlled 0550 pricing state แล้ว.
          PAGA ใช้ INDUSTRONIC เป็น selected basis; USD/THB และ Project Total ต้องคง HOLD
          จนกว่า EUR conversion และ OPEN/TBC ของ PAGA จะถูกปิดด้วย source-backed evidence.
        </p>
      </section>
      ) : null}
    </div>
  );
}

function DeviationView({ filter, setFilter, rows }) {
  const canonical=useProject0550CanonicalState();
  const sourceRows=useMemo(()=>{
    if(!canonical.data?.deviations?.length) return rows;
    return canonical.data.deviations.map(d=>({
      type:d.deviation_type,
      source:d.deviation_code+" · "+(d.source_doc_para_description||""),
      issue:d.vendor_deviation || d.reason_justification || "Deviation detail TBC",
      response:d.resolution || d.final_closure || "OPEN / RESPONSE REQUIRED",
      state:d.closure_status || d.status || "OPEN"
    }));
  },[canonical.data,rows]);
  const filteredRows=filter==="ALL" ? sourceRows : sourceRows.filter(x=>x.type===filter);
  return (
    <section className="bid-panel">
      <div className="bid-canonical-state-banner">
        <strong>{canonical.isLive ? "LIVE DB DEVIATION PROJECTION" : "CONTROLLED FALLBACK PREVIEW"}</strong>
        <span>Deviation output is generated from canonical requirement/response exceptions; closure remains linked to the originating requirement.</span>
      </div>
      <div className="bid-panel-head">
        <div>
          <small>ATTACHMENT 3 + ATTACHMENT 4</small>
          <h2>สิ่งที่ทำไม่ได้ ต้องไม่หายไป — ต้องออกเป็น Deviation ที่ trace กลับหา clause ได้</h2>
        </div>
        <div className="bid-filter">
          {["ALL", "TECHNICAL", "COMMERCIAL"].map((x) => (
            <button key={x} onClick={() => setFilter(x)} className={filter === x ? "active" : ""}>{x}</button>
          ))}
        </div>
      </div>

      <div className="bid-deviation-map">
        <div className="tech">
          <strong>Technical Deviation</strong>
          <span>Doc / Para / Description → Vendor Deviation → Reason → Contractor/Vendor/Company responses → Resolution / Status / Closure</span>
        </div>
        <div className="commercial">
          <strong>Commercial Deviation</strong>
          <span>Doc / Para / Description → Vendor Deviation → Reason → Purchaser Response → Resolution → Final Closure</span>
        </div>
      </div>

      <div className="bid-table-wrap">
        <table className="bid-table">
          <thead><tr><th>Type</th><th>Source / issue</th><th>Bid response</th><th>Status</th></tr></thead>
          <tbody>
            {filteredRows.map((x, idx) => (
              <tr key={idx}>
                <td><span className={"bid-dev-type " + x.type.toLowerCase()}>{x.type}</span></td>
                <td><strong>{x.source}</strong><br/><span>{x.issue}</span></td>
                <td>{x.response}</td>
                <td><Status status={x.state} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SubmissionView() {
  const canonical=useProject0550CanonicalState();
  const outputs=useMemo(()=>{
    if(!canonical.data?.submissionItems?.length) return OUTPUTS;
    return canonical.data.submissionItems.map(x=>[
      x.submission_code,
      x.title,
      x.source_template || x.submission_type,
      x.readiness_status
    ]);
  },[canonical.data]);
  const blocked=outputs.some(x=>["OPEN","NOT_READY","BLOCKED","PARTIAL"].includes(String(x[3]).toUpperCase()));
  return (
    <div className="bid-stack">
      <div className="bid-canonical-state-banner">
        <strong>{canonical.isLive ? "LIVE DB SUBMISSION PACKAGE PROJECTION" : "CONTROLLED FALLBACK PREVIEW"}</strong>
        <span>Submission module assembles released outputs only; it does not create engineering, scope, deviation or price truth.</span>
        {canonical.data?.openChanges?.length ? <em>{canonical.data.openChanges.length} open change event(s) may stale downstream outputs</em> : null}
      </div>
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>READY-TO-SUBMIT PACKAGE</small>
            <h2>Definition of Done ของงานเสนอราคา</h2>
          </div>
          <Status status={blocked ? "NOT READY" : "READY"} />
        </div>
        <div className="bid-submit-grid">
          {outputs.map(([code, title, basis, state], idx) => (
            <article key={code}>
              <span>{String(idx + 1).padStart(2, "0")}</span>
              <div><strong>{title}</strong><small>{basis}</small></div>
              <Status status={state} />
            </article>
          ))}
        </div>
      </section>

      <section className="bid-panel">
        <small>PROJECT CONTROLS FROM CONTRACT</small>
        <h2>สิ่งที่หลังบ้านต้องรองรับ เพราะมีผลต่อราคาและความเสี่ยง</h2>
        <div className="bid-control-grid">
          <div><strong>Schedule</strong><span>Detailed Work Time Schedule, milestones, engineering/procurement/commissioning dates</span></div>
          <div><strong>Document Control</strong><span>MDDR / VDRS, revision, submission/return dates, approval status</span></div>
          <div><strong>Inspection</strong><span>ITP, Hold/Witness/Review points, FAT/SIT notice and attendance</span></div>
          <div><strong>Site Service</strong><span>10-hour service day basis, supervision, commissioning/testing personnel</span></div>
          <div><strong>Training</strong><span>Training plan, trainer CV, facilities, logistics, materials, OJT/classroom/hands-on</span></div>
          <div><strong>Acceptance / Payment</strong><span>Ready for shipment, Material Receiving, Provisional / Final Acceptance milestones</span></div>
        </div>
      </section>
    </div>
  );
}

function Status({ status }) {
  const text = String(status || "TBC");
  const s = text.toLowerCase();
  let tone = "neutral";
  if (s.includes("ready") || s.includes("received") || s.includes("base")) tone = "good";
  if (s.includes("partial") || s.includes("active") || s.includes("working") || s.includes("review")) tone = "warn";
  if (s.includes("not ready") || s.includes("open") || s.includes("tbc")) tone = "bad";
  return <span className={"bid-status " + tone}>{text}</span>;
}
