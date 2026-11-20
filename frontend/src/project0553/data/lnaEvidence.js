// MR0002 particular evidence: not an approved receiver configuration.
export const LNA_0553_BASIS={
 projectId:"PJ2608-0553",mr:"MR-0002",tag:"RAD-508-001",qtyBasis:"1 Set per ZWP20 / ZWP21 / ZWP22 (MR summary)",
 candidate:{model:"RFI RX3852-2002-11",bandMinMHz:380,bandMaxMHz:520,maxGainDb:40,attenuationRangeDb:[0,31],maxNoiseFigureDb:2,oip3MinDbm:45,outputPowerMaxDbm:22},
 sources:[
 {id:"MR0002-C1",url:"https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view",use:"LNA + Yagi quantity and vendor link budget requirement"},
 {id:"RFI-RX3852-DATASHEET",url:"https://drive.google.com/file/d/1dAnYkC2r2hyYEgUuN-xA0xAvq-zG2iTA/view",use:"Candidate LNA band / maximum gain / noise figure / OIP3"},
 {id:"RPT-0001-C1",url:"https://drive.google.com/file/d/1DKLRk2xsCrxVU14UdSrpbHu4IjWiYQeJ/view",use:"Radio study reference; not a finalized LNA chain design"}
 ],
 openInputs:["DMR frequency/channel plan confirmed against 380–520 MHz band","Actual selected LNA and gain attenuator setting","Pre-LNA filter, connectors, antenna feeder loss and topology","Post-LNA losses and receiver NF / sensitivity","Input RF signal levels, blocking and intermodulation budget","Receiver AGC maximum input and LNA output compression margin","OEM calculation, approval and field performance verification"]
};
