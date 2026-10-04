import React, { useMemo, useState } from "react";
import "./PricingStrategy.css";

const GATES = [
  {
    id:"G1", title:"Locked Basis", state:"OPEN",
    question:"เราเสนอในชื่อใคร? Incoterm / delivery point / tax / payment / warranty / scope boundary อะไร?",
    output:"One controlled commercial basis before price math starts."
  },
  {
    id:"G2", title:"Cost Base Complete", state:"PARTIAL",
    question:"ของที่ต้องซื้อ + งานที่ต้องทำ + VDRL + test + field + logistics ถูกผูกกับต้นทุนครบหรือยัง?",
    output:"C_base with no unquoted-required scope hidden as zero."
  },
  {
    id:"G3", title:"Accepted Conditions & Risk", state:"OPEN",
    question:"เงื่อนไขที่เรารับถูกแปลงเป็น cost / financing / risk / ZERO_WITH_REASON ครบหรือยัง?",
    output:"C_accept + F + R, with LD/risk kept explicit rather than silently buried."
  },
  {
    id:"G4", title:"Buyer-View Evaluability", state:"OPEN",
    question:"ใบของเราถูกเทียบได้ไหม? Scope, Incoterm, lead time, deviation, FAT/SAT/VDRL, vendor identity ครบไหม?",
    output:"PASS / FAIL / HOLD buyer-view checklist; no guessed buyer weighting."
  },
  {
    id:"G5", title:"Authorised Offer", state:"BLOCKED",
    question:"Floor / Target policy ถูกอนุมัติ และ Jack เลือกราคายื่นพร้อมเหตุผลแล้วหรือยัง?",
    output:"price_state = AUTHORISED_OFFER only after approval."
  }
];

const COST_CLASSES = [
  ["C_base","Base Execution Cost","Equipment + bulk + engineering + document + test + field + logistics required by scope","Derived from 0550 scope / quantity / workload"],
  ["C_accept","Accepted-Condition Cost","BG fee, insurance, warranty obligation, tax/service treatment or other accepted contract-condition cost that is expected/definite","Accepted condition must have formula + source"],
  ["F","Financing / Cash Carry","Payment-term funding, BG cash/fees, receivable timing and other financing effects","Cash-flow driver, not hidden markup"],
  ["R","Risk Reserve / Exposure","Uncertain residual exposure not already in base/accepted-condition cost","No double count; zero requires reason"],
  ["ZERO_WITH_REASON","Accepted Zero","A real obligation that creates no incremental cost under a documented reason","Never blank / never silent zero"],
  ["CLARIFY_FIRST","Clarification Gate","Responsibility/condition cannot yet be priced defensibly","Ask before pricing rather than inventing Option B"]
];

const CONTROL_CHECKS = [
  {
    id:"CTRL-01", title:"Margin vs Markup convention",
    lesson:"0553 found that /(1−m) and ×(1+m) cannot share one symbol/policy.",
    apply0550:"Choose one approved commercial convention per pricing layer; store the convention in DB."
  },
  {
    id:"CTRL-02", title:"Selling Rate ≠ Internal Cost Rate",
    lesson:"0553 benchmarking separated bill/sell rates from payroll/burden cost.",
    apply0550:"Keep cost rate, sell rate, partner markup and customer price as separate states."
  },
  {
    id:"CTRL-03", title:"Quantity / scope cannot disappear into zero",
    lesson:"0553 pricing review found included/absorbed rows can hide unverified scope.",
    apply0550:"Every zero-priced required item needs an inclusion absorber or ZERO_WITH_REASON."
  },
  {
    id:"CTRL-04", title:"Physical-trip conservation",
    lesson:"0553 Rev04 moved from one campaign assumption to explicit PhysicalTripKey / Mob / Demob counting.",
    apply0550:"FAT/SAT/site/training/logistics travel is counted by actual physical event, shared once across activities."
  },
  {
    id:"CTRL-05", title:"Document count ≠ Document workload",
    lesson:"0553 VDRL model separates Q_issue and Q_content plus review/revision cycles.",
    apply0550:"VDRL MH must follow content + issue/revision drivers; not percentage of equipment price."
  },
  {
    id:"CTRL-06", title:"Customer form price-state",
    lesson:"0553 review identified that blank customer form cells are commercially ambiguous.",
    apply0550:"Each required price line must be PRICED / TBC / EXCLUDED / N/A_WITH_REASON — never blank."
  },
  {
    id:"CTRL-07", title:"Historical / proportional estimate is not supplier quote",
    lesson:"0553 exposed the risk of proportional scaling when equipment/service margins differ.",
    apply0550:"Historical proxy stays TEMP_ESTIMATING until vendor quote / controlled rate replaces it."
  },
  {
    id:"CTRL-08", title:"Survey / missing activity gate",
    lesson:"0553 review found a brownfield survey could vanish if no activity driver exists.",
    apply0550:"Context-controlled activity set must explicitly trigger survey/site verification when evidence requires it."
  }
];

const BUYER_LENS = [
  ["Scope comparable","Can buyer compare the same required scope line-by-line?","Use clarification only to equalize buyer-visible scope; do not reveal internal know-how."],
  ["Technical responsiveness","Can the bid pass MR/SPE/DTS/Ex/certification checks?","No price strategy can rescue a non-responsive technical bid."],
  ["Deviation burden","Do deviations shift unmanageable risk to buyer/EPCI?","Accept-and-price normal conditions; deviate only where genuinely impossible/unacceptable."],
  ["Delivery / lead time","Does the package arrive when yard/site needs it?","Lead time and issue schedule are price/evaluability inputs, not footnotes."],
  ["Documentability","Can the buyer send our package upward without rewriting it?","VDRL, model/datasheet/cert, FAT/SAT, schedule and legal entity must be clean."],
  ["Evaluated price hygiene","Are Incoterm/tax/spares/services included on the same basis?","Compare evaluated price, not a misleading front-page number."]
];

const RESEARCH = [
  {
    title:"Auction / bidding under uncertainty",
    basis:"General auction theory",
    use:"Do not fabricate competitor prices. Unknown competitor bids are uncertainty, not a missing cell to guess.",
    boundary:"Conceptual only; no probability-of-win or optimal bid number without calibrated market/bid history."
  },
  {
    title:"Winner's-curse control",
    basis:"Common-value / uncertain-cost bidding research",
    use:"If scope/cost uncertainty is high, an aggressively low bid can win for the wrong reason. Close scope and risk before lowering price.",
    boundary:"Conceptual risk warning; not a Jutal-specific rule."
  },
  {
    title:"Value-for-money / evaluability",
    basis:"Procurement research and guidance",
    use:"Technical quality, risk, delivery and capacity can matter in addition to price; responsiveness is often a prerequisite to financial comparison.",
    boundary:"Actual Jutal/PTTEP evaluation criteria and weights must come from their RFQ/CCL, not this research."
  },
  {
    title:"Parametric cost estimating",
    basis:"Controlled 0553 GEQ/CER method + cost-estimating research",
    use:"Use quantity/work drivers and calibrated UMH/factors; sensitivity tests show materiality but do not silently reprice.",
    boundary:"Coefficients require 0550 evidence/history/policy."
  }
];

const PRICE_STATES = ["MODEL_ONLY","INTERNAL_HOLD","AUTHORISATION_PENDING","AUTHORISED_OFFER"];

export function PricingStrategy(){
  const [state,setState]=useState("INTERNAL_HOLD");
  const [mode,setMode]=useState("overview");

  const gateCounts=useMemo(()=>({
    pass:GATES.filter(x=>x.state==="PASS").length,
    blocked:GATES.filter(x=>x.state==="BLOCKED").length,
    open:GATES.filter(x=>x.state!=="PASS"&&x.state!=="BLOCKED").length
  }),[]);

  return (
    <div className="ps-shell">
      <section className="ps-hero">
        <div>
          <small>PRICING DECISION ENGINE · REUSE FROM 0553 / 0541 METHOD</small>
          <h2>ไม่รู้ราคาคู่แข่ง ≠ ตั้งราคาไม่ได้</h2>
          <p>
            วิธีที่ควบคุมไว้คือ: <strong>รู้ scope ของเรา → รู้ต้นทุนจริง → price เงื่อนไขที่รับ → เห็น risk/cash →
            ตรวจว่าผู้ซื้อเทียบใบเราได้ → แล้วค่อยเลือก Floor–Target–Offer</strong>.
            ราคาคู่แข่งไม่ถูกเดาขึ้นมาเพื่อเติมช่องว่าง.
          </p>
        </div>
        <div className="ps-state">
          <span>PRICE STATE</span>
          <select value={state} onChange={e=>setState(e.target.value)}>
            {PRICE_STATES.map(x=><option key={x}>{x}</option>)}
          </select>
          <b>{state==="AUTHORISED_OFFER"?"CUSTOMER ISSUE ALLOWED":"CUSTOMER ISSUE BLOCKED"}</b>
        </div>
      </section>

      <nav className="ps-tabs">
        {[
          ["overview","Decision Pipeline"],
          ["cost","Cost / Floor / Target"],
          ["buyer","Buyer Lens"],
          ["controls","Lessons / Controls"],
          ["research","Research Basis"]
        ].map(([k,l])=><button key={k} className={mode===k?"active":""} onClick={()=>setMode(k)}>{l}</button>)}
      </nav>

      {mode==="overview" && (
        <div className="ps-stack">
          <section className="ps-panel">
            <div className="ps-panel-head">
              <div><small>G1 → G5</small><h2>Price is an output of gated evidence, not a manual cell.</h2></div>
              <div className="ps-mini-stats">
                <span>{gateCounts.open} open</span><span>{gateCounts.blocked} blocked</span>
              </div>
            </div>
            <div className="ps-gates">
              {GATES.map((g,i)=>(
                <React.Fragment key={g.id}>
                  <article>
                    <div><b>{g.id}</b><State text={g.state}/></div>
                    <h3>{g.title}</h3>
                    <p>{g.question}</p>
                    <span>{g.output}</span>
                  </article>
                  {i<GATES.length-1&&<i>→</i>}
                </React.Fragment>
              ))}
            </div>
          </section>

          <section className="ps-panel ps-decision-map">
            <small>DECISION LOGIC</small>
            <h2>สิ่งที่ Jack ต้องตัดสิน vs สิ่งที่ระบบต้องคำนวณ</h2>
            <div className="ps-decision-grid">
              <div>
                <strong>System calculates</strong>
                <span>Requirement applicability</span><span>Required quantity</span><span>MH / Duration</span>
                <span>Internal cost</span><span>Financing / risk exposure</span><span>Floor / Target from approved policy</span>
              </div>
              <div>
                <strong>System verifies</strong>
                <span>Evidence / source state</span><span>No double count</span><span>No unpriced required scope</span>
                <span>Buyer-form completeness</span><span>Benchmark / sensitivity</span>
              </div>
              <div>
                <strong>Jack decides</strong>
                <span>Policy mode</span><span>Floor / Target policy inputs</span><span>Which strategic point inside the approved band</span>
                <span>Final deviation position</span><span>Authorise Offer</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {mode==="cost" && <CostView/>}
      {mode==="buyer" && <BuyerView/>}
      {mode==="controls" && <ControlsView/>}
      {mode==="research" && <ResearchView/>}
    </div>
  );
}

function CostView(){
  return (
    <div className="ps-stack">
      <section className="ps-panel">
        <small>ACCEPT BUT PRICE IT</small>
        <h2>Accepted-Condition Register — เงื่อนไขที่รับต้องมี economic treatment</h2>
        <div className="ps-costclass-grid">
          {COST_CLASSES.map(r=>(
            <article key={r[0]}>
              <code>{r[0]}</code><h3>{r[1]}</h3><p>{r[2]}</p><span>{r[3]}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="ps-panel ps-formula">
        <small>CONTROLLED PRICING VIEW</small>
        <h2>จาก Cost ไป Floor / Target โดยไม่ใช้ “ราคาคู่แข่งเดา”</h2>
        <div className="ps-formulas">
          <code>C_internal = GEQ-021(Direct + Common)</code>
          <code>C_economic = C_internal + C_accept + F + R</code>
          <code>P_floor = PricingPolicy(C_economic ; approved floor policy)</code>
          <code>P_target = PricingPolicy(C_economic ; approved target policy)</code>
          <code>P_offer ∈ [P_floor, P_target] only after buyer-view gates + Jack decision</code>
        </div>
        <p>
          Floor และ Target ใช้ commercial mode เดียวกัน; ต่างกันที่ policy input ที่ผู้มีอำนาจอนุมัติ.
          Sensitivity/benchmark มีหน้าที่ทดสอบ materiality ไม่ใช่เขียนราคาใหม่เอง.
        </p>
      </section>

      <section className="ps-panel">
        <small>WHAT THE QUOTATION UI MUST SHOW</small>
        <h2>Cost stack ต้อง drill-down ได้ทั้งสองทิศทาง</h2>
        <div className="ps-trace">
          <div><b>Customer Price Line</b><span>Exhibit C / required customer form</span></div><i>↕</i>
          <div><b>Commercial State</b><span>Base / Separate / Option / Excluded / TBC</span></div><i>↕</i>
          <div><b>Cost Object</b><span>Equipment / bulk / engineering / VDRL / FAT / SAT / field / risk</span></div><i>↕</i>
          <div><b>Driver / Formula</b><span>Q / UMH / event / trip / issue / review cycle</span></div><i>↕</i>
          <div><b>Requirement / Evidence</b><span>Contract / MR / SPE / drawing / vendor quote / rate source</span></div>
        </div>
      </section>
    </div>
  );
}

function BuyerView(){
  return (
    <div className="ps-stack">
      <section className="ps-panel">
        <small>BUYER LENS — METHOD ONLY</small>
        <h2>ก่อนถาม “ราคาเท่าไร” ต้องถาม “ใบนี้ถูกเทียบได้หรือยัง”</h2>
        <div className="ps-buyer-list">
          {BUYER_LENS.map(r=>(
            <article key={r[0]}><h3>{r[0]}</h3><strong>{r[1]}</strong><p>{r[2]}</p></article>
          ))}
        </div>
      </section>

      <section className="ps-panel ps-competitor">
        <small>COMPETITOR-UNKNOWN DISCIPLINE</small>
        <h2>แข่งกับใครไม่รู้ — สิ่งที่ทำได้คือทำให้ comparison basis ชัด และรู้ walk-away ของตัวเอง</h2>
        <div>
          <span>Do not invent competitor price</span>
          <span>Do not cut 3–5% from rumours</span>
          <span>Equalise buyer-visible scope through clarification</span>
          <span>Keep brownfield know-how in technical proposal, not open questions</span>
          <span>Use benchmark as sanity check, not price setter</span>
          <span>Record why offer is near Floor or near Target</span>
        </div>
      </section>
    </div>
  );
}

function ControlsView(){
  return (
    <section className="ps-panel">
      <small>REUSED LEARNINGS FROM 0553 / 0541</small>
      <h2>Control checks ที่ควรถูกฝังในระบบ 0550 ตั้งแต่ต้น</h2>
      <div className="ps-control-grid">
        {CONTROL_CHECKS.map(x=>(
          <article key={x.id}>
            <div><code>{x.id}</code><h3>{x.title}</h3></div>
            <p><b>Lesson:</b> {x.lesson}</p>
            <span><b>0550:</b> {x.apply0550}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResearchView(){
  return (
    <section className="ps-panel">
      <small>ECONOMIC / PROCUREMENT / COST-ENGINEERING RESEARCH</small>
      <h2>ใช้เพื่อ constrain วิธีคิด — ไม่ใช้แทน Project Source</h2>
      <div className="ps-research-grid">
        {RESEARCH.map(x=>(
          <article key={x.title}>
            <h3>{x.title}</h3><b>{x.basis}</b><p>{x.use}</p><span>{x.boundary}</span>
          </article>
        ))}
      </div>
      <div className="ps-research-rule">
        <strong>Authority boundary</strong>
        <span>0550 Contract / MR / SPE / BOD / Drawing / TC / vendor quote &gt; project-approved policy &gt; calibrated history &gt; general research/benchmark.</span>
      </div>
    </section>
  );
}

function State({text}){
  const s=String(text).toLowerCase();let tone="neutral";
  if(s==="pass") tone="good";
  else if(s.includes("partial")) tone="warn";
  else if(s.includes("blocked")) tone="bad";
  else if(s.includes("open")) tone="open";
  return <span className={"ps-state-pill "+tone}>{text}</span>;
}
