// PJ2608-0553 — controlled Z1F telecom layout equipment-location evidence.
// Physical locations originate from MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 (AFC 2026-09-04).
// Sheet = drawing sheet number, PDF page = sheet + 2 due two review-comment pages.
// NOT a certified cable routing or final cable schedule.
export const Z1F_TEL_LAYOUT_INDEX_0553=Object.freeze({
 source:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1",
 issued:"2026-09-04",status:"AFC",scale:"1:100 at A1",
 control:{quantityAuthority:"Z1F MR/MTO plus verified physical topology",
  positionAuthority:"Z1F TEL-LAY-0001 Rev.C1",
  roomDetails:"MM-ZTK-1F-ZWPX-ELE-LAY-0002",
  routing:"Budget route takeoff by endpoint, distinct cable and deck; drawings do NOT explicitly dimension cable-tray run lengths",
  procurement:"Vendor quoted quantities and historical Z1D/1E configurations are evidence only"},
 byWP:[
  {wp:"ZWP20",sheets:{upper:3,mezzanine:4,lower:5},
   equipment:[
    {tag:"MAR-514-001",system:"MARINE_RACON",deck:"UPPER",sheet:3,description:"Marine RACON"},
    {tag:"TCAB-514-001",system:"MARINE_RACON",deck:"UPPER",sheet:3,description:"RACON Ex d distribution box"},
    {tag:"TCAB-514-002",system:"MARINE_RACON",deck:"UPPER",sheet:3,description:"RACON control JB (Ex e)"},
    {tag:"MR-502-001",system:"SCADA_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:4,description:"SCADA ODU"},
    {tag:"ANT-502-001",system:"SCADA_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:4,description:"SCADA parabolic antenna"},
    {tag:"ANT-508-001",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:4,description:"Outdoor Yagi antenna"},
    {tag:"ANT-508-002",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:4,description:"Outdoor omni antenna"},
    {tag:"TCAB-508-001",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:4,description:"RF LNA enclosure"},
    {tag:"TCAB-508-002",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:4,description:"RF surge Ex d enclosure"},
    {tag:"LSE-504-001",system:"EX_SOUNDER_NOT_IP_PHONE",deck:"LOWER",sheet:5,description:"Outdoor Ex sounder"}
   ],
   indoor:{place:"E&I Room on Lower Deck",sheet:5,reference:"MM-ZTK-1F-ZWPX-ELE-LAY-0002",roomEquipmentLocations:"REFERENCED_ELSEWHERE"},
   note:"EX IP Phone not proven from the ZWP20 Equipment Tag List; identify by symbol and MR/MTO before adding cable runs."
  },
  {wp:"ZWP21",sheets:{upper:6,mezzanine:7,lower:8},
   equipment:[
    {tag:"MAR-514-001",system:"MARINE_RACON",deck:"UPPER",sheet:6},
    {tag:"TCAB-514-001",system:"MARINE_RACON",deck:"UPPER",sheet:6},
    {tag:"TCAB-514-002",system:"MARINE_RACON",deck:"UPPER",sheet:6},
    {tag:"ANT-508-001",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:7},
    {tag:"ANT-508-002",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:7},
    {tag:"TCAB-508-001",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:7},
    {tag:"TCAB-508-002",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:7},
    {tag:"MR-502-001",system:"SCADA_RADIO",deck:"LOWER",sheet:8},
    {tag:"ANT-502-001",system:"SCADA_RADIO",deck:"LOWER",sheet:8},
    {tag:"LSE-504-001",system:"EX_SOUNDER_NOT_IP_PHONE",deck:"LOWER",sheet:8}
   ]},
  {wp:"ZWP22",sheets:{upper:9,mezzanine:10,lower:11},
   equipment:[
    {tag:"MAR-514-001",system:"MARINE_RACON",deck:"UPPER",sheet:9},
    {tag:"TCAB-514-001",system:"MARINE_RACON",deck:"UPPER",sheet:9},
    {tag:"TCAB-514-002",system:"MARINE_RACON",deck:"UPPER",sheet:9},
    {tag:"MR-502-001",system:"SCADA_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:10},
    {tag:"ANT-502-001",system:"SCADA_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:10},
    {tag:"ANT-508-001",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:10},
    {tag:"ANT-508-002",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:10},
    {tag:"TCAB-508-001",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:10},
    {tag:"TCAB-508-002",system:"DTRS_TRUNK_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:10},
    {tag:"LSE-504-001",system:"EX_SOUNDER_NOT_IP_PHONE",deck:"LOWER",sheet:11}
   ]},
  {wp:"ZWP23",sheets:{mezzanine:12,lower:13},equipment:[
    {tag:"MR-502-001",system:"SCADA_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:12},
    {tag:"ANT-502-001",system:"SCADA_RADIO",deck:"MEZZANINE_EI_ROOFTOP",sheet:12},
    {tag:"ANT-502-001",system:"SCADA_RADIO",deck:"LOWER",sheet:13,note:"Duplicate tag appears on lower deck sheet; do not count second antenna without resolving GA/MTO revision"}
   ]}
 ],
 bulkRule:"Per unique physical cable: tagFrom → tagTo → path/deck → design length → allowance → selected SKU → unit rate → cost owner. Group by WP/system; no global 50m for all systems."
});
