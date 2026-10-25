import React from "react";
import {PriceToWinPreview0553} from "../project0553/PriceToWinPreview0553";
import {buildReleaseCommercialModel0553} from "../project0553/data/releaseCommercialModel0553";
import "../project0550/project0550.css";
import "../project0553/project0553.css";
import "../project0553/moduleHierarchy0553.css";
// Independent INTERNAL review route. Never an official customer workbook route.
export function PriceToWinPage0553(){
 // Fixed project planning FX, not current BOT rate or an independently approved FX quote.
 const source=buildReleaseCommercialModel0553({thbPerUsd:31.5});
 return <div className="p55-stack p553-dashboard" style={{maxWidth:1440,margin:"0 auto",padding:"20px 16px"}}>
  <section className="p55-panel">
   <div className="p55-eyebrow">PJ2608-0553 · Bid strategy / INTERNAL ONLY</div>
   <h2>Price-to-Win — Evaluation Sandbox</h2>
   <p className="p55-note">Read-only Working→Release data; THB/USD 31.5 is the 0553 quotation planning assumption, not a market FX confirmation. Customer Official Release, issuance and native Excel remain unchanged.</p>
   <a href="/projects/pj2608-0553">← Return to project workspace</a>
  </section>
  <PriceToWinPreview0553 model={source}/>
 </div>;
}
