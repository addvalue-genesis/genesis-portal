// Source-grounded site development classification; not equipment supply ownership.
// ZWP20-23 new Phase 1F platforms; ZPQ/ZWP8/ZWP11 existing platform tie-in nodes.
// No automatic inference of NEW/REUSE for any SKU, quantity, construction MH or cost.
const known={
 ZWP20:{type:"GREENFIELD",thai:"แท่นใหม่",note:"New ZWP20 · tie-in ZWP8"},
 ZWP21:{type:"GREENFIELD",thai:"แท่นใหม่",note:"New ZWP21 · tie-in ZWP11"},
 ZWP22:{type:"GREENFIELD",thai:"แท่นใหม่",note:"New ZWP22 · tie-in ZWP8"},
 ZWP23:{type:"GREENFIELD",thai:"แท่นใหม่",note:"New ZWP23 · diversity/tie-in ZPQ"},
 ZPQ:{type:"BROWNFIELD",thai:"แท่นเดิม / ดัดแปลง",note:"Existing link and ZWP23 tie-in"},
 ZWP8:{type:"BROWNFIELD",thai:"แท่นเดิม / ดัดแปลง",note:"BLD Rev.C1 explicit ZWP8-ZPQ reuse for ZWP20/ZWP22; new branch scope TBD"},
 ZWP11:{type:"BROWNFIELD",thai:"แท่นเดิม / ดัดแปลง",note:"Existing site · ZWP21 tie-in; ownership TBD"}
};
export const MR0001_SITE_CLASSIFICATION=Object.freeze({
 source:"BLD-0001 Rev.C1 + LAY-0001 Rev.C1 + MR0001/MTO Rev04",
 basis:"Project platform phase, not individual installed equipment state",
 sites:known,
 ownershipRule:"Each piece may independently be NEW_SUPPLY, REUSE, BY_OTHERS, or OPEN after BLD symbol and MR review",
 releaseAllowed:false
});
