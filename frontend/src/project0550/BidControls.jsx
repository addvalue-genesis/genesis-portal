import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BidHeading,BidPrinciples} from "./BidModulePresentation";
import {bidSection0550} from "./bidPresentation0550";
export const amount=(n,currency="THB")=>typeof n==="number"&&Number.isFinite(n)?new Intl.NumberFormat("en-US",{style:"currency",currency}).format(n):"OPEN";
export function Module({id,title,children,open=true}){const meta=bidSection0550(id);return <details className="p55-panel p55-bid-module" data-component-key={id} data-module-number={meta?.number} open={open}><summary>{meta?<BidHeading id={id} title={title}/>:<><strong>{title}</strong><ComponentCopyId projectId="PJ2608-0550" componentKey={id}/></>}</summary><div className="p55-bid-content">{meta&&<BidPrinciples id={id}/>} {children}</div></details>;}
export function Field({label,value,onChange,type="text",children,...props}){return <label className="p55-bid-field"><span>{label}</span>{children||<input aria-label={label} type={type} value={value??""} onChange={e=>onChange(type==="number"?(e.target.value===""?null:Number(e.target.value)):e.target.value)} {...props}/>}</label>;}
export function Select({label,value,onChange,options}){return <Field label={label}><select aria-label={label} value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={Array.isArray(o)?o[0]:o} value={Array.isArray(o)?o[0]:o}>{Array.isArray(o)?o[1]:o}</option>)}</select></Field>;}
export function Save({busy,children="บันทึก"}){return <button type="submit" className="p55-export-button" disabled={busy}>{busy?"กำลังบันทึก…":children}</button>;}
