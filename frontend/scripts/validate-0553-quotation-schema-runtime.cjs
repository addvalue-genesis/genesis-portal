// Runtime rendering regression: Next G and MGW commercialTerms are structurally DIFFERENT.
// Do not replace source quotation schemas with invented company/contact fields.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
for(const ext of [".js",".jsx"]){
 const old=require.extensions[ext];
 require.extensions[ext]=(mod,filename)=>{
  if(filename.startsWith(root+path.sep)){
   const out=babel.transformFileSync(filename,{babelrc:false,configFile:false,sourceMaps:false,
    presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
   mod._compile(out.code,filename);
  }else if(old)old(mod,filename);
 };
}
const terms=require(path.join(root,"project0553/QuotationTermsDetail0553.jsx")).QuotationTermsDetail0553;
const register=require(path.join(root,"common/engineering/quotationCommercialRecord.js")).quotationCommercialRecord;
const supplierQuotes=require(path.join(root,"project0553/data/supplierQuoteLines.js")).SUPPLIER_QUOTE_LINES_0553;
const historic=require(path.join(root,"project0553/data/historicalVendorEvidence0553.json"));
const latest=require(path.join(root,"project0553/data/quotes/EXION-1260576-R0.current.json"));
const exionOld=require(path.join(root,"project0553/data/quotes/EXION-1240515-R0.reference.json"));
const allQuotes=[...supplierQuotes,...historic.quotes,latest,exionOld];
const renderQuote=q=>renderToStaticMarkup(React.createElement(terms,{quote:register(q)}));
const byId=id=>allQuotes.find(q=>q.id===id);
const nextG=byId("NG-260916"),mgw=byId("MGW-P26-058");
assert(nextG?.commercialTerms?.supplier?.name,"Next G has expanded header shape");
assert(mgw?.commercialTerms&&!mgw.commercialTerms.supplier,"MGW commercial terms do not contain Next G supplier header");
const nextHtml=renderQuote(nextG);
const mgwHtml=renderQuote(mgw);
assert(nextHtml.includes("Next G Solution Co.,Ltd")&&nextHtml.includes("100% cash in advance"),"Next G source header/clauses lost");
assert(nextHtml.includes("Not expressly committed")&&nextHtml.includes("NMS licence"),"NG sourceNotStated clarification matrix lost");
for(const term of ["Nantong","12–16 weeks","20% documents","warrantyBond","90 days"])
 assert(mgwHtml.includes(term),"MGW terms missing: "+term);
assert(mgwHtml.includes("Original supplier commercial wording (preserved)"),"Original MGW raw commercial text must stay available");
const exionHtml=renderQuote(latest);
assert(exionHtml.includes("16 weeks after ARO")&&exionHtml.includes("DDP Nonthaburi"),"EXION source clauses missing");
const oldHtml=renderQuote(exionOld);
assert(oldHtml.includes("20-22 weeks ARO/ARAD"),"EXION historical clauses lost");
// All quote shapes, including historical raw string terms, must be renderable.
for(const q of allQuotes){
 const html=renderQuote(q);
 assert(html.includes("Quotation &amp; Commercial Conditions"),"Quotation renderer empty for "+q.id);
}
const vendorSource=fs.readFileSync(path.join(root,"project0553/VendorProductCatalog0553.jsx"),"utf8");
assert(!vendorSource.includes("commercialTerms.supplier.name")&&!vendorSource.includes("commercialTerms.customer.name"),
 "Vendor Product Catalog still dereferences Next G-only commercial schema unsafely");
assert(vendorSource.includes("<QuotationTermsDetail0553 quote={selectedCommercial}/>"));
assert(vendorSource.includes("<QuotationTermsDetail0553 quote={q.header}/>"));
const catalog=require(path.join(root,"project0553/VendorProductCatalog0553.jsx")).VendorProductCatalog0553;
const mainHtml=renderToStaticMarkup(React.createElement(catalog));
assert(mainHtml.includes("Vendor Products")&&mainHtml.includes("Quotation"),"07 Vendor default view did not render");
assert(mainHtml.includes("Engineering Intelligence"),"New preview must coexist with original Vendor catalog");
console.log("PASS 0553 Vendor quotation schemas: "+allQuotes.length+" source quotations render, NG full/clarification terms, MGW structured/raw terms, EXION current/historical, full 07 Vendor SSR; no nested supplier.name crash.");
