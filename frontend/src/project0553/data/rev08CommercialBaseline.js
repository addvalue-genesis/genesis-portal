export const REV08_BASELINE = {
 source:"4-Scope of Supply.xlsx",revision:"Rev08",currency:"USD",state:"HISTORICAL_BASELINE",
 summary:[
 ["A1","SCADA / AVIAT / Cisco",266605.3235],["A2","DMR Trunk Radio",481203.0075],
 ["A3","Telephone / sounder / JB",41393.0827],["A4","RACON",429780.2147],["A5","Bulk materials and accessories",147539.7774],
 ["B1","Engineering and design",62675],["B2","Documentation",22728.7018],
 ["B3","Inspection / FAT / SAT",119500],["B4","Painting / coating",1203.0075],
 ["B5","Packing and marking",11081.8647],["B6","Transportation",9764.5714],
 ["B7","Three-month storage",0],["B8","Training",14493.2331],
 ["B9","Specialist assistance",59907.2632],["B10","Commissioning spares",3905.5355],
 ["B11","Special tools",4073.4637],["B12","First filling",0],
 ["B13","Consumables",713.7845],["B14","Bonds and insurance",8333.3333],
 ["C1","Capital spares option",128550.7734],["C2","Two-year spares option",22914.4979]
 ],
 detail:{
 B10:[["Spare DC PoE injector",1,980.7836],["Spare Cisco power module",1,575.0376],["RF surge spare",2,362.3459],["Ethernet surge spare",2,565.4135],["RF Type N male spare connector",4,33.203],["M20 gland spare complete set",4,49.0827],["M25 gland spare complete set",2,33.203],["Protection fuse spare",8,4.812],["Interposing relay spare with socket",1,60.1504]],
 B11:[["RACON programming and adapter/charging tool set",1,2309.0526],["RF connector torque tool set",1,320.802],["Cable termination tool set",1,240.6015],["System configuration tools and maintenance access",1,1203.0075]],
 B13:[["Replacement preservation desiccant packs",40,6.015],["Replacement moisture barrier bags",20,10.0251],["Electrical maintenance cleaning kits",4,48.1203],["Preservation inspection labels",40,2.005]],
 C1:[["Spare SCADA remote radio",1,7080.4576],["Spare RACON complete unit",1,121470.3158]],
 C2:[["SCADA DC PoE operating spare",1,980.7836],["Cisco power operating spare",1,575.0376],["Explosion-proof IP phone spare",1,5814.5363],["Sounder spare",1,2486.2155],["RF surge operating spares",2,362.3459],["Ethernet surge operating spares",2,565.4135],["RACON distribution box spare",1,9054.3158],["Operating fuse spares",8,4.812],["7/8-inch RF cable operating spare (m)",30,17.3233],["CAT6A data cable operating spare (m)",50,25.215],["N-male termination spares",4,33.203],["M20 complete gland spares",4,49.0827]]
 },
 reportedBase:1684901.1645
};
export function getBaselineReview(){
 const b=REV08_BASELINE;
 const sum=p=>b.summary.filter(x=>x[0].startsWith(p)).reduce((s,x)=>s+x[2],0);
 return {partA:sum("A"),partB:sum("B"),base:sum("A")+sum("B"),options:sum("C"),
 reportedBase:b.reportedBase,checks:Object.entries(b.detail).map(([code,items])=>{
 const total=items.reduce((s,x)=>s+x[1]*x[2],0);
 const summary=b.summary.find(x=>x[0]===code)?.[2]??null;
 return {code,total,summary,delta:summary===null?null:total-summary,items};
 })};
}
