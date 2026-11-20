// PJ2608-0553 LAY Rev.C1: known site geometry, NOT yet cable route take-off.
// Only explicit drawing elevations are recorded; no guessed tag coordinates or routes.
export const LAYOUT_GEOMETRY_0553={
 sourceId:"MM-ZTK-1F-ZWPX-TEL-LAY-0001",revision:"C1",
 url:"https://drive.google.com/file/d/1TojXzE-v8IZxZ53rjmYtiXhsCoTjv2eo/view",
 dimensionsUnit:"mm",elevationDatum:"LAT",printedScale:"1:100 (A1)",
 referenceLevels:[
 {id:"MEZZ-21100",name:"Mezzanine T.O.S.",elevationM:21.1},
 {id:"MEZZ-21300",name:"Mezzanine T.O.S. alternative section",elevationM:21.3},
 {id:"LOWER-18300",name:"Lower Deck T.O.S.",elevationM:18.3}
 ],
 identifiedTags:["ANT-508-001","ANT-508-002","TCAB-508-001","TCAB-508-002"],
 verifiedCableRoutes:[],
 status:"ELEVATIONS_CONFIRMED__ROUTING_OPEN",
 notes:["The +21.100/+21.300m elevations describe drawing areas/sections and are not device cable connection elevations.",
 "Vertical differences can be derived from drawing levels but must not be assigned to a cable run without a verified route and same facility/section.",
 "Measure horizontal routing from native/vector plan or explicit dimensions, not from text extraction or a resized screenshot.",
 "Gland, connector, surge and enclosure selections require termination topology and current certification evidence."]
};
export const levelDifference=(a,b)=>({status:"GEOMETRIC_REFERENCE_ONLY",differenceM:Math.abs(a-b),equation:"Delta elevation = |Z1 - Z2|"});
export const MEZZ_TO_LOWER_REFERENCE=LAYOUT_GEOMETRY_0553.referenceLevels.slice(0,2).map(l=>({from:l.id,to:"LOWER-18300",...levelDifference(l.elevationM,18.3)}));
