const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '../frontend/src/project0550/BidVolumesWorkspace0550.jsx');
let c = fs.readFileSync(target, 'utf8');

c = c.replace(
  "displayView.pbxBudgetShares?.some(row=>['mapping','preview'].includes(panel)||row.schedule===panel)",
  "panel!=='preview'&&panel!=='C1'&&displayView.pbxBudgetShares?.some(row=>row.schedule===panel||panel==='mapping')"
);

c = c.replace(
  "['overview','A','A1','B','C','C1','C2','C3','C4','C5','C6','C7','C8','D','E','F','mapping','preview'].includes(panel)",
  "['overview','A','A1','B','C','C2','C3','C4','C5','C6','C7','C8','D','E','F','mapping'].includes(panel)"
);

c = c.replace(
  "[...VENDOR_VOLUME_TAGS_0550,'mapping','preview'].includes(panel)",
  "panel!=='preview'&&panel!=='C1'&&[...VENDOR_VOLUME_TAGS_0550,'mapping'].includes(panel)"
);

fs.writeFileSync(target, c, 'utf8');
console.log('BidVolumesWorkspace0550.jsx successfully updated');
