// Technical presentation only: no price/quantity owner and no new equipment TAG.
import {selectSpareCoverageEngineering0553} from './spareCoverageEngineering0553';
import {MR0001_WORKING_PRICED_BOM} from './mr0001WorkingPricedBom';
import EXION from './quotes/EXION-1260576-R0.current.json';
const freeze=Object.freeze;
export function selectC2CustomerSchedule0553(){
 const installed=selectSpareCoverageEngineering0553().installed;
 const psu=MR0001_WORKING_PRICED_BOM.cisco.items.find(x=>x.quoteLine==='1.1');
 const phone=EXION.lines.find(x=>x.code==='1'),sounder=EXION.lines.find(x=>x.code==='2');
 const mr1=x=>x.mr==='MR-0001',mr2=x=>x.mr==='MR-0002',mr3=x=>x.mr==='MR-0003';
 const definitions=[
  ['01','SCADA radio DC-to-PoE power-supply spare',x=>mr1(x)&&/^MR-.*A$/.test(x.tag),false,
   'PS-DCDC-HAZ-POE-IND-01',
   'Industrial DC-to-PoE power supply for the referenced SCADA indoor radio interface. Match installed input voltage, output/PoE rating and terminals. Power cord supplied only if required by the selected interface.',
   'Industrial power-supply module and compatible connection fittings'],
  ['02','Cisco L3 switch DC power-supply spare',x=>mr1(x)&&/^LAN-/.test(x.tag),false,psu.sku,
   'Replaceable DC power module for Cisco IE-3400-8P2S-E; match the selected '+psu.sku+' configuration, input supply and power capacity. Complete switch and software licences are excluded.',
   'Cisco industrial DC power-supply module'],
  ['03','Explosion-proof SIP telephone spare',x=>mr3(x)&&x.tag==='TPH-504-001',false,phone.sku,
   'GAI-TRONICS Auteldac 6 SIP telephone, reference '+phone.sku+'. Match installed Ex certification, SIP/network interface, supply and mounting. Complete telephone assembly.',
   'Hazardous-area telephone body, handset and supplied service fittings'],
  ['04','Explosion-proof sounder spare',x=>mr3(x)&&x.tag==='LSE-504-001',false,sounder.sku,
   'Eaton DB3B sounder, reference '+sounder.sku+'. Match installed supply voltage, tone/output configuration, enclosure and Ex certification.',
   'Certified sounder assembly with terminals and enclosure'],
  ['05','BDA antenna-path RF surge-arrester spares',x=>mr2(x)&&x.functionRole==='RF_SURGE_EXD',false,null,
   'RF coaxial surge arresters for the referenced DMR/BDA antenna path. PolyPhaser IS-B50LN-C2 is the installed-package reference; confirm exact replaceable device, operating band, 50-ohm interfaces, earthing and hazardous-area installation. Ex coupling components are not automatically interchangeable.',
   'RF surge arrester bodies with matching coaxial and earthing connections'],
  ['06','SCADA Ethernet/PoE surge-arrester spares',x=>mr1(x)&&/^SA-/.test(x.tag),false,'LP-POE-INL-IND-01',
   'Industrial Ethernet/PoE surge protection, reference LP-POE-INL-IND-01. Match installed data rate, PoE/supply rating, connector/shielding and earthing arrangement; this is separate from RF coaxial protection.',
   'Ethernet/PoE surge-protection devices and connection fittings'],
  ['08','Equipment protective-fuse stock',x=>mr1(x)&&/^LAN-/.test(x.tag)||/^TCAB-/.test(x.tag),true,null,
   'Replacement fuse cartridges for the referenced equipment power/control circuits. Select exact current/voltage, breaking capacity, speed and physical size from approved OEM wiring and fuse schedules; quantity is shared stock, not per TAG.',
   'OEM-compatible electrical fuse cartridges'],
  ['09','BDA antenna RF feeder spare cable (1/2")',x=>mr2(x)&&/^ANT-/.test(x.tag),false,null,
   '1/2-inch, 50-ohm RF feeder matching the selected MGW UHF-4 installation; quoted reference FORLLER RF LLF 1/2. Match cable construction, jacket/fire requirements and approved antenna-path loss. Supply as measured spare cable length; connectors listed separately.',
   '50-ohm coaxial feeder cable with marine-suitable jacket'],
  ['10','SCADA data-link CAT6A spare cable',x=>mr1(x)&&(/^LAN-/.test(x.tag)||/^MR-.*A$/.test(x.tag)),false,null,
   'CAT6A data cable for the referenced SCADA radio indoor interface and L3 network connections. Match installed shielding, jacket/fire rating, environment, connector and gland compatibility. Spare cable length excludes installed Part A cable.',
   'Shielded CAT6A data cable, approved installation type'],
  ['11','BDA RF feeder Type-N male spare connectors',x=>mr2(x)&&/^ANT-/.test(x.tag),false,null,
   '50-ohm Type-N male cable connectors to suit the selected 1/2-inch RF feeder and mating antenna-path equipment. Confirm exact cable family, connector assembly method and sealing/weatherproofing requirements.',
   'Type-N male coaxial connectors and compatible sealing fittings'],
  ['12','M20 Ex cable-gland spare sets',x=>mr3(x)&&x.tag==='TCAB-504-001',true,null,
   'Complete M20 Ex cable-gland sets for the referenced telephone junction boxes. Match certified enclosure entry, cable outside diameter, armour/seal range and required Ex protection. Spare stock is additional to installed glands; quantity is not per TAG.',
   'Certified metal glands with compatible seals and washers']
 ];
 return freeze(Object.fromEntries(definitions.map(([suffix,description,match,common,partNo,specification,materials])=>{
  const refs=installed.filter(match);if(!refs.length)throw Error('C2 technical reference missing '+suffix);
  const groups=new Map();for(const x of refs){if(!groups.has(x.tag))groups.set(x.tag,new Set());groups.get(x.tag).add(x.site);}
  const tag=common&&groups.size>4?[...groups.keys()].join('; '):[...groups].map(([tag,sites])=>tag+' / '+[...sites].join(', ')).join('; ');
  return ['C2-REV08-'+suffix,freeze({description,tag:(common?'COMMON — Reference: ':'')+tag,
   specification:(partNo?'Reference part: '+partNo+'. ':'')+specification,
   materials,referencePartNo:partNo,tagRefs:freeze(refs.map(x=>freeze({key:x.key,mr:x.mr,site:x.site,tag:x.tag}))),
   referenceTagOnly:true,physicalSkuApproved:false,quantityApproved:false})];
 })));
}
